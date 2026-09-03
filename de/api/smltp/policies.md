---
id: policies
title: "SMLTP-Richtlinien"
sidebar_label: "SMLTP-Richtlinien"
description: "Rufen Sie alle SMLTP-Sicherheitsrichtlinien ab"
openapi: "GET /smltp-policies/all"
---
# SMLTP-Richtlinien

Rufen Sie alle verfügbaren SMLTP-Sicherheitsrichtlinien (Secure Model Language Transfer Protocol) ab.

## Endpunkt

```
GET /smltp-policies/all
```

## Beschreibung

Rufen Sie alle verfügbaren SMLTP-Richtlinien ab, einschließlich integrierter und benutzerdefinierter Richtlinien. **Nur Administratorzugriff erforderlich.**

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
❌ Keine Abfrageparameter unterstützt – die eigentliche API akzeptiert keine Abfrageparameter.

## Beispielanfrage

```bash
GET /smltp-policies/all
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `data` | Objekt | Antwortdatenobjekt |
| `data.builtInPolicies` | Array | Array integrierter Richtlinienobjekte |
| `data.customPolicies` | Array | Array benutzerdefinierter Richtlinienobjekte |
| `data.activePolicyTemplate` | Zeichenfolge | Derzeit aktive Richtlinienvorlagen-ID |
| `data.summary` | Objekt | Zusammenfassende Statistik |
| `data.summary.totalPolicies` | Ganzzahl | Gesamtzahl der Policen |
| `data.summary.builtInCount` | Ganzzahl | Anzahl der integrierten Richtlinien |
| `data.summary.customCount` | Ganzzahl | Anzahl benutzerdefinierter Richtlinien |

## Beispielverwendung

### JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

### Python

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
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

## Richtlinienobjektfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `id` | Zeichenfolge | Richtlinien-ID |
| `name` | Zeichenfolge | Richtlinienname |
| `type` | Zeichenfolge | Richtlinientyp („integriert“ oder „benutzerdefiniert“) |
| `description` | Zeichenfolge | Richtlinienbeschreibung |
| `isActive` | boolescher Wert | Ob diese Richtlinie derzeit aktiv ist |
| `createdAt` | Zeichenfolge | Erstellungszeitstempel (nur benutzerdefinierte Richtlinien) |

## Anwendungsfälle

- **Richtlinienerkennung**: Finden Sie verfügbare Sicherheitsrichtlinien
- **Compliance-Planung**: Richtlinienanforderungen verstehen
- **Sicherheitskonfiguration**: Wählen Sie die entsprechenden Richtlinien aus
- **Aktive Richtlinienverwaltung**: Überprüfen Sie, welche Richtlinie derzeit aktiv ist
- **Integration**: Wenden Sie Richtlinien auf Chat-Abschlüsse an

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

– Für diesen Endpunkt sind Administratorrechte erforderlich
- Keine Parameter: Es werden keine Abfrageparameter unterstützt
- Integrierte Richtlinien: Gibt vordefinierte Systemrichtlinien zurück
- Benutzerdefinierte Richtlinien: Gibt benutzerdefinierte Richtlinien zurück, sofern vorhanden
- Aktive Richtlinie: Zeigt an, welche Richtlinienvorlage derzeit aktiv ist
- Flache Antwort: Die Antwort ist unter dem Datenobjekt verschachtelt