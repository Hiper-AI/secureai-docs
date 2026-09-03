---
title: "Nutzung und Kontingent"
sidebar_label: "Verwendung"
description: "Self-Service-Punkte-, Budget- und Ratenlimit-Snapshot für einen API-Schlüssel"
openapi: "GET /usage"
---
# Nutzung und Kontingent

Geben Sie einen Self-Service-Snapshot des Kontingents und der Nutzung des aufrufenden API-Schlüssels zurück: den Punkte-Bucket des abgerechneten Benutzers, das Budget „Nutzung nach Modell“, sofern aktiviert, und die eigenen Anforderungs- und Ratenlimits des Schlüssels. Dabei handelt es sich um dieselben Daten, die Sie sonst aus dem Admin-Panel lesen würden und die dem Schlüsselinhaber zugänglich gemacht werden.

## Endpunkt

```
GET /usage
```

## Authentifizierung

```bash
Authorization: Bearer sk-your-api-key-here
```

## Beispiel für Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

```json
{
  "success": true,
  "points": {
    "remaining": 4188,
    "monthly_limit": 5000,
    "next_renewal": "2026-08-01T00:00:00.000Z"
  },
  "usage_by_model": {
    "enabled": true,
    "dollar_limit": 250,
    "current_spend": 61.4,
    "remaining_budget": 188.6
  },
  "api_key": {
    "name": "Production integration",
    "billing_mode": "user-completions",
    "daily": { "used": 120, "limit": 1000, "remaining": 880 },
    "monthly": { "used": 3400, "limit": 10000, "remaining": 6600 },
    "rate_limit": { "requests_per_minute": 60, "requests_per_hour": 1000 },
    "expires_at": null
  }
}
```

### Felder

| Feld | Beschreibung |
|-------|-------------|
| `points.remaining` | Im Bucket des abgerechneten Benutzers verbleibende Punkte. |
| `points.monthly_limit` | Das monatliche Punktekontingent des Benutzers. |
| `points.next_renewal` | ISO-Zeitstempel der nächsten Punkteverlängerung. |
| `usage_by_model` | Wenn sich der abgerechnete Benutzer im Abrechnungsmodus „Nutzung nach Modell“ befindet: `dollar_limit`, `current_spend`, `remaining_budget`. Ansonsten `{ "enabled": false }`. |
| `api_key.billing_mode` | `user-completions` oder `usage-by-model` – siehe [Abrechnungsmodi](/de/en/api/billing-modes). |
| `api_key.daily` / `api_key.monthly` | Die Anforderungszähler des Schlüssels (`used`, `limit`, `remaining`). |
| `api_key.rate_limit` | Anfrageobergrenzen pro Minute und Stunde. |
| `api_key.expires_at` | ISO-Ablaufzeitstempel oder `null`, wenn der Schlüssel nie abläuft. |

## Notizen

– Die Werte spiegeln den **abgerechneten** Benutzer wider, der sich vom Schlüsseleigentümer unterscheiden kann, wenn Anfragen `user_id` im Auftrag der Abrechnung verwenden.
- Um eine Vorschau zu erhalten, ob eine *bestimmte* Anfrage ihr Kontingent erreichen würde (ohne Ausgaben), verwenden Sie [Policy Check](/de/en/api/policy-check) und lesen Sie `checks.quota`.

## Verwandte

- [Abrechnungsmodi](/de/en/api/billing-modes)
- [Authentifizierungsübersicht](/de/en/api/auth/overview)
- [Policy Check](/de/en/api/policy-check)