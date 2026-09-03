---
sidebar_position: 1
title: "Webhooks Overview"
sidebar_label: "Overview"
description: "Receive real-time security and platform events from SecureAI via signed HTTP webhooks"
---


# Webhooks

SecureAI can push security and platform events to your own HTTP endpoints in real time — Prompt Shield blocks, canary leaks, DLP/PII incidents, API limit events, and model failovers. Every delivery is signed with an HMAC-SHA256 signature so you can verify it came from SecureAI and was not tampered with or replayed.

Webhook endpoints are managed by administrators in **Admin → Webhooks** (API base `/api/admin/webhooks`).

## Managing endpoints

| Action | Route |
|--------|-------|
| List endpoints (+ event catalog) | `GET /api/admin/webhooks` |
| Create endpoint (returns secret once) | `POST /api/admin/webhooks` |
| Update endpoint | `PUT /api/admin/webhooks/:id` |
| Rotate signing secret (returned once) | `POST /api/admin/webhooks/:id/rotate-secret` |
| Send a test delivery | `POST /api/admin/webhooks/:id/test` |
| Delete endpoint | `DELETE /api/admin/webhooks/:id` |

Create-time inputs: `url`, `description`, `events[]` (see [Events](/zh/api/webhooks/events)), and `enabled`. The signing secret (`whsec_...`) is shown **only** on create and rotate — store it securely; you cannot retrieve it again.

The endpoint `url` is SSRF-validated: only `http(s)` is accepted, and private/loopback/link-local hosts are rejected unless the instance runs with `WEBHOOKS_ALLOW_PRIVATE=true` (self-hosted receivers often need this).

## Delivery format

Each delivery is an HTTP `POST` with a JSON body:

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

And these headers:

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` | The event type (e.g. `promptshield:attack:blocked`). |
| `X-SecureAI-Delivery` | A unique delivery UUID (use for idempotency). |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

Your endpoint should return any `2xx` status to acknowledge the delivery.

## Verifying the signature

Recompute the HMAC over `` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t` is outside your tolerance window (replay protection). **Verify against the raw request body** — parsing and re-serializing the JSON first will change the bytes and break the signature.

### Node.js (Express)

```javascript
import crypto from 'crypto';
import express from 'express';

const app = express();
const SECRET = process.env.SECUREAI_WEBHOOK_SECRET; // whsec_...
const TOLERANCE_SECONDS = 300;

// Capture the RAW body — do not use express.json() before verifying.
app.post('/webhooks/secureai', express.raw({ type: 'application/json' }), (req, res) => {
  const header = req.get('X-SecureAI-Signature') || '';
  const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=')));
  const t = Number(parts.t);
  const rawBody = req.body.toString('utf8');

  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > TOLERANCE_SECONDS) {
    return res.status(400).send('stale or invalid timestamp');
  }

  const expected = crypto.createHmac('sha256', SECRET).update(`${t}.${rawBody}`).digest('hex');
  const ok = parts.v1 &&
    crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));
  if (!ok) return res.status(401).send('bad signature');

  const event = JSON.parse(rawBody);
  console.log('Received', event.type, event.id);
  res.sendStatus(200);
});
```

### Python (Flask)

```python
import hashlib, hmac, time
from flask import Flask, request, abort

app = Flask(__name__)
SECRET = b"whsec_..."          # your signing secret
TOLERANCE_SECONDS = 300

@app.post("/webhooks/secureai")
def secureai_webhook():
    header = request.headers.get("X-SecureAI-Signature", "")
    parts = dict(kv.split("=", 1) for kv in header.split(","))
    t = int(parts.get("t", "0"))
    raw_body = request.get_data()  # raw bytes — do NOT use request.json first

    if abs(time.time() - t) > TOLERANCE_SECONDS:
        abort(400, "stale timestamp")

    signed = f"{t}.".encode() + raw_body
    expected = hmac.new(SECRET, signed, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(parts.get("v1", ""), expected):
        abort(401, "bad signature")

    return "", 200
```

## Reliability

- **Retries:** up to 3 attempts with 0s / 10s / 60s backoff, 5s timeout each. Any `2xx` acknowledges.
- **Auto-disable:** after 20 consecutive delivery failures an endpoint is automatically disabled; an admin re-enables it (which also resets the failure counter).
- **At-least-once:** deliveries may repeat — deduplicate on `X-SecureAI-Delivery` (or the payload `id`).
- **Fire-and-forget:** webhook delivery never blocks or delays the originating API request.

## Related

- [Webhook Events](/zh/api/webhooks/events) — the full event catalog and payloads.
- [Redundancy & Failover](/zh/api/redundancy) — source of `api:model_failover`.
- [Threat Defense](/zh/threat-defense/overview) — source of the `promptshield:*` events.
