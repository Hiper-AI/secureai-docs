---
id: active
title: "Aktive SMLTP-Richtlinien"
sidebar_label: "Aktive SMLTP-Richtlinien"
description: "Rufen Sie aktuell aktive SMLTP-Richtlinien ab"
openapi: "GET /smltp-policies/active"
---
# Aktive SMLTP-Richtlinien

Rufen Sie die aktuell aktiven SMLTP-Richtlinien (Secure Model Language Transfer Protocol) für Ihr Konto ab.

## Endpunkt

```
GET /smltp-policies/active
```

## Beschreibung

Rufen Sie die aktuell aktive SMLTP-Richtlinienkonfiguration ab. **Nur Administratorzugriff erforderlich.**

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Beispielanfrage

```bash
GET /smltp-policies/active
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `data` | Objekt | Antwortdatenobjekt |
| `data.template` | Zeichenfolge | Derzeit aktive Richtlinienvorlagen-ID |
| `data.policy` | Objekt | Aktuelles Richtlinienkonfigurationsobjekt |
| `data.lastUpdated` | Zeichenfolge | Zeitstempel der letzten Aktualisierung |

## Beispielverwendung

### JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

### Python

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Fehlerantworten

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 Zu viele Anfragen

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```


## Anwendungsfälle

- **Richtlinienüberprüfung**: Überprüfen Sie, welche Richtlinienvorlage derzeit aktiv ist
- **Konfigurationsprüfung**: Überprüfen Sie die aktuelle Richtlinienkonfiguration
- **Vorlagenverwaltung**: Verstehen Sie, welche Richtlinienvorlage verwendet wird
- **Fehlerbehebung**: Aktuelle Richtlinieneinstellungen verstehen
- **Audit-Vorbereitung**: Überprüfen Sie die aktive Richtlinie für Compliance-Audits

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

– Für diesen Endpunkt sind Administratorrechte erforderlich
- Einzelne Richtlinie: Gibt die derzeit aktive Richtlinienvorlage und -konfiguration zurück
- Keine Arrays: Gibt kein Array von Richtlinien zurück, sondern nur die aktive
- Vorlagen-ID: Zeigt an, welche Richtlinienvorlage derzeit aktiv ist
- Richtlinienkonfiguration: Gibt das tatsächliche Richtlinienkonfigurationsobjekt zurück
- Verschachtelte Antwort: Die Antwort ist unter dem Datenobjekt verschachtelt