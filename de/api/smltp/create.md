---
id: create
title: "Erstellen Sie eine SMLTP-Richtlinie"
sidebar_label: "Erstellen Sie eine SMLTP-Richtlinie"
description: "Erstellen Sie eine neue SMLTP-Sicherheitsrichtlinie"
openapi: "POST /smltp-policies/active"
---
# SMLTP-Richtlinie erstellen

Erstellen Sie eine neue SMLTP-Sicherheitsrichtlinie (Secure Model Language Transfer Protocol) für Ihr Konto.

## Endpunkt

```
POST /smltp-policies
```

## Beschreibung

Erstellen Sie eine neue benutzerdefinierte SMLTP-Richtlinie. Nur Administratorzugriff erforderlich.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Ja | Richtlinienname |
| `description` | Zeichenfolge | Ja | Richtlinienbeschreibung |
| `policy` | Objekt | Ja | Richtlinienkonfigurationsobjekt |
| `setAsActive` | boolescher Wert | Nein | Ob diese Richtlinie sofort als aktiv festgelegt werden soll (Standard: false) |

## Beispielanfrage

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## Erfolgsantwort

**Statuscode**: `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `policy` | Objekt | Erstelltes Richtlinienobjekt |
| `policy.id` | Zeichenfolge | Richtlinien-ID (aus dem Namen generiert) |
| `policy.name` | Zeichenfolge | Richtlinienname |
| `policy.description` | Zeichenfolge | Richtlinienbeschreibung |
| `policy.type` | Zeichenfolge | Richtlinientyp („benutzerdefiniert“) |
| `policy.isActive` | boolescher Wert | Ob die Richtlinie derzeit aktiv ist |
| `policy.createdAt` | Zeichenfolge | Erstellungszeitstempel |

## Beispielverwendung

### JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

### Python

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

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

### 403 Verboten

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 Konflikt

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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

- **Benutzerdefinierte Sicherheit**: Erstellen Sie Richtlinien, die auf Ihre Bedürfnisse zugeschnitten sind
- **Compliance**: Implementieren Sie spezifische regulatorische Anforderungen
- **Risikomanagement**: Definieren Sie Sicherheitsmaßnahmen zur Risikominderung
- **Datenschutz**: Legen Sie Datenschutz- und Datenverarbeitungsregeln fest
- **Richtlinienverwaltung**: Erstellen und verwalten Sie benutzerdefinierte SMLTP-Richtlinien

## Tarifbegrenzungen

- **Standard**: 50 Anfragen pro Minute
- **Täglich**: 5.000 Anfragen pro Tag
- **Monatlich**: 150.000 Anfragen pro Monat

## Notizen

– Für diesen Endpunkt sind Administratorrechte erforderlich
- Erforderliche Felder: Name, Beschreibung und Richtlinie sind erforderlich
- Richtlinien-ID: Wird aus dem Namen generiert (Kleinbuchstaben, Bindestriche für Leerzeichen)
- Eindeutige Namen: Richtliniennamen müssen eindeutig sein
- Aktiv setzen: Kann optional sofort als aktiv gesetzt werden
- Flache Antwort: Die Antwort ist nicht unter dem Datenobjekt verschachtelt