---
sidebar_position: 1
title: "Webhooks-Übersicht"
sidebar_label: "Überblick"
description: "Erhalten Sie Sicherheits- und Plattformereignisse in Echtzeit von SecureAI über signierte HTTP-Webhooks"
---
# Webhooks

SecureAI kann Sicherheits- und Plattformereignisse in Echtzeit an Ihre eigenen HTTP-Endpunkte übertragen – Prompt Shield-Blöcke, Canary-Leaks, DLP/PII-Vorfälle, API-Limit-Ereignisse und Modell-Failovers. Jede Lieferung ist mit einer HMAC-SHA256-Signatur signiert, sodass Sie überprüfen können, ob sie von SecureAI stammt und nicht manipuliert oder wiederholt wurde.

Webhook-Endpunkte werden von Administratoren unter **Admin → Webhooks** (API-Basis `/api/admin/webhooks`) verwaltet.

## Endpunkte verwalten

| Aktion | Route |
|--------|-------|
| Endpunkte auflisten (+ Ereigniskatalog) | `GET /api/admin/webhooks` |
| Endpunkt erstellen (geheimes Geheimnis einmal zurückgeben) | `POST /api/admin/webhooks` |
| Endpunkt aktualisieren | `PUT /api/admin/webhooks/:id` |
| Signaturgeheimnis rotieren (einmal zurückgegeben) | `POST /api/admin/webhooks/:id/rotate-secret` |
| Senden Sie eine Testlieferung | `POST /api/admin/webhooks/:id/test` |
| Endpunkt löschen | `DELETE /api/admin/webhooks/:id` |

Eingaben zur Erstellungszeit: `url`, `description`, `events[]` (siehe [Events](/de/en/api/webhooks/events)) und `enabled`. Das Signaturgeheimnis (`whsec_...`) wird **nur** beim Erstellen und Rotieren angezeigt – speichern Sie es sicher; Sie können es nicht erneut abrufen.

Der Endpunkt `url` ist SSRF-validiert: nur `http(s)` wird akzeptiert und private/Loopback-/Link-Local-Hosts werden abgelehnt, es sei denn, die Instanz läuft mit `WEBHOOKS_ALLOW_PRIVATE=true` (selbstgehostete Empfänger benötigen dies oft).

## Lieferformat

Jede Lieferung ist ein HTTP `POST` mit einem JSON-Body:

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

Und diese Überschriften:

| Kopfzeile | Beschreibung |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` | Der Ereignistyp (z. B. `promptshield:attack:blocked`). |
| `X-SecureAI-Delivery` | Eine eindeutige Liefer-UUID (für Idempotenz verwenden). |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

Ihr Endpunkt sollte einen beliebigen `2xx`-Status zurückgeben, um die Zustellung zu bestätigen.

## Überprüfung der Signatur

Berechnen Sie den HMAC über „` `${t} neu. ${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t“ liegt außerhalb Ihres Toleranzfensters (Wiedergabeschutz). **Überprüfen Sie anhand des rohen Anforderungstexts** – wenn Sie zuerst den JSON-Code analysieren und erneut serialisieren, werden die Bytes geändert und die Signatur beschädigt.

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

### Python (Flasche)

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

## Zuverlässigkeit

- **Wiederholungen:** bis zu 3 Versuche mit 0s/10s/60s Backoff, jeweils 5s Timeout. Jeder `2xx` bestätigt.
- **Automatische Deaktivierung:** Nach 20 aufeinanderfolgenden Zustellungsfehlern wird ein Endpunkt automatisch deaktiviert; Ein Administrator aktiviert es erneut (wodurch auch der Fehlerzähler zurückgesetzt wird).
- **Mindestens einmal:** Lieferungen können wiederholt werden – deduplizieren Sie auf `X-SecureAI-Delivery` (oder der Nutzlast `id`).
- **Fire-and-Forget:** Die Webhook-Bereitstellung blockiert oder verzögert niemals die ursprüngliche API-Anfrage.

## Verwandte

- [Webhook Events](/de/en/api/webhooks/events) – der vollständige Eventkatalog und die Payloads.
- [Redundancy & Failover](/de/en/api/redundancy) — Quelle von `api:model_failover`.
- [Threat Defense](/de/en/threat-defense/overview) – Quelle der `promptshield:*`-Ereignisse.