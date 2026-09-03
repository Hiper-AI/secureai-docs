---
sidebar_position: 2
title: "Webhook Events"
sidebar_label: "Events"
description: "The SecureAI webhook event catalog"
---



# Webhook Events

When creating or updating a [webhook endpoint](/en/api/webhooks/overview), you subscribe it to one or more event types. Use `"*"` to receive every event.

## Event catalog

| Event | Fires when |
|-------|-----------|
| `*` | Wildcard — subscribes to **all** events below. |
| `promptshield:attack:blocked` | Prompt Shield blocked a prompt-injection/jailbreak attempt. |
| `promptshield:attack:detected` | Prompt Shield flagged a suspicious prompt (detected but not blocked). |
| `promptshield:canary:leaked` | A canary token was found in model output (system-prompt/data exfiltration signal). |
| `dlp:incident` | A Data Loss Prevention rule matched. |
| `pii:incident` | PII was detected/redacted. |
| `api:limit_reached` | An API key hit a daily/monthly/rate limit. |
| `api:model_failover` | A [redundancy](/en/api/redundancy) chain failed over from one model to another. |

Subscribing to an unknown event name is rejected at create/update time.

## Payload envelope

Every delivery shares the same envelope; the `data` object is event-specific.

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "api:model_failover",
  "created": 1705312200,
  "data": {
    "failedModel": "openai/gpt-5-nano",
    "reason": "timeout",
    "nextModel": "anthropic/claude-sonnet-4",
    "latencyMs": 30011,
    "userId": "60a7c8f5e8b4f5001f7a8c23",
    "apiKeyId": "6512ab..."
  }
}
```

## Test deliveries

The **Send test event** button (or `POST /api/admin/webhooks/:id/test`) delivers a `webhook:test` event so you can confirm your receiver and signature verification before going live:

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## Related

- [Webhooks Overview](/en/api/webhooks/overview) — delivery format, signature verification, reliability.
