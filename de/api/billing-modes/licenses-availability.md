---
id: licenses-availability
title: "Verfügbarkeit von Lizenzen"
sidebar_label: "Verfügbarkeit von Lizenzen"
description: "Aktuelle Lizenzpoollimits, Nutzung und verbleibende Lizenzen abrufen (nur Administrator)"
openapi: "GET /licenses/availability"
---
# Verfügbarkeit von Lizenzen

Rufen Sie Lizenzpoollimits, aktuelle Nutzung und verbleibende Lizenzen für jede Stufe ab.

## Endpunkt

```
GET /licenses/availability
```

## Beschreibung

Gibt den Lizenzpoolstatus für alle Lizenzstufen zurück, einschließlich Limits, aktueller Nutzung und verbleibender Kapazität. Endpunkt nur für Administratoren.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `limits` | Objekt | Konfigurierte Grenzwerte für den Lizenzpool pro Stufe |
| `usage` | Objekt | Aktuell zugewiesene/genutzte Lizenzen pro Stufe |
| `remaining` | Objekt | Verbleibende Lizenzen pro Stufe |

## Fehlerantworten

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Verboten

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## Notizen

- Endpunkt nur für Administratoren
– „Verbleibend“ kann als `Infinity` gemeldet werden, wenn für diese Stufe kein Poollimit erzwungen wird
- Werte sind organisationsweite Aggregate