---
sidebar_position: 2
title: "Webhook-Ereignisse"
sidebar_label: "Veranstaltungen"
description: "Der SecureAI-Webhook-Ereigniskatalog"
---
# Webhook-Ereignisse

Wenn Sie einen [Webhook-Endpunkt](/de/api/webhooks/overview) erstellen oder aktualisieren, abonnieren Sie ihn für einen oder mehrere Ereignistypen. Verwenden Sie `"*"`, um jedes Ereignis zu empfangen.

## Veranstaltungskatalog

| Veranstaltung | Wird ausgelöst, wenn |
|-------|-----------|
| `*` | Platzhalter – abonniert **alle** Ereignisse unten. |
| `promptshield:attack:blocked` | Prompt Shield hat einen Prompt-Injection-/Jailbreak-Versuch blockiert. |
| `promptshield:attack:detected` | Prompt Shield hat eine verdächtige Eingabeaufforderung gekennzeichnet (erkannt, aber nicht blockiert). |
| `promptshield:canary:leaked` | In der Modellausgabe wurde ein Canary-Token gefunden (Systemaufforderung/Datenexfiltrationssignal). |
| `dlp:incident` | Eine Data Loss Prevention-Regel stimmt überein. |
| `pii:incident` | PII wurden erkannt/geschwärzt. |
| `api:limit_reached` | Ein API-Schlüssel hat ein Tages-/Monats-/Ratenlimit erreicht. |
| `api:model_failover` | Eine [redundancy](/de/api/redundancy)-Kette ist von einem Modell auf ein anderes fehlgeschlagen. |

Das Abonnieren eines unbekannten Ereignisnamens wird zum Zeitpunkt der Erstellung/Aktualisierung abgelehnt.

## Nutzlastumschlag

Jede Lieferung hat denselben Umschlag; Das `data`-Objekt ist ereignisspezifisch.

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

## Testlieferungen

Die Schaltfläche **Testereignis senden** (oder `POST /api/admin/webhooks/:id/test`) liefert ein `webhook:test`-Ereignis, damit Sie Ihren Empfänger und die Signaturüberprüfung bestätigen können, bevor Sie live gehen:

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## Verwandte

- [Webhooks-Übersicht](/de/api/webhooks/overview) – Lieferformat, Signaturprüfung, Zuverlässigkeit.