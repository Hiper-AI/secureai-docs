---
sidebar_position: 3
title: "Sicherheitsrichtlinien"
openapi: "GET /smltp-policies"
---
# Sicherheitsrichtlinien abrufen

Rufen Sie verfügbare SMLTP-Sicherheitsrichtlinien (Secure Model Language Transfer Protocol) ab.

## Endpunkt

```
GET /smltp-policies
```

## Beschreibung

Rufen Sie verfügbare SMLTP-Sicherheitsrichtlinien (Secure Model Language Transfer Protocol) ab. Diese Richtlinien legen fest, wie Ihre Daten verarbeitet und geschützt werden.

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr | `true` |
| `policies` | Array | Liste der verfügbaren Sicherheitsrichtlinien | Siehe Beispiel |
| `restrictions` | Objekt | Richtlinienzugriffsbeschränkungen | Siehe Beispiel |

### Richtlinienobjekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `id` | Zeichenfolge | Eindeutiger Richtlinienbezeichner | `"internal"` |
| `name` | Zeichenfolge | Anzeigename der Richtlinie | `"Internal"` |
| `description` | Zeichenfolge | Richtlinienbeschreibung | `"For internal company data"` |

### Restrictions-Objekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `allowed_policies` | Array | Array zulässiger Richtlinien-IDs | `["public", "internal", "confidential"]` |

## Fehlerantworten

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Beispielverwendung

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Richtlinientypen

### Öffentlich
- **Anwendungsfall**: Öffentliche, nicht sensible Daten
- **Sicherheitsstufe**: Niedrig
- **Datenverarbeitung**: Standardverarbeitung mit grundlegender Sicherheit

### Intern
- **Anwendungsfall**: Interne Unternehmensdaten
- **Sicherheitsstufe**: Mittel
- **Datenverarbeitung**: Erhöhte Sicherheit mit zusätzlichen Schutzmaßnahmen

### Vertraulich
- **Anwendungsfall**: Vertrauliche Geschäftsdaten
- **Sicherheitsstufe**: Hoch
- **Datenverarbeitung**: Maximale Sicherheit bei strenger Datenverarbeitung

## Notizen

- Wählen Sie die entsprechende Richtlinie basierend auf Ihrer Datensensibilität
- Richtlinien beeinflussen, wie Ihre Daten verarbeitet und geschützt werden
- Verwenden Sie die Richtlinien-ID in Chat-Abschlussanfragen
- Einige Richtlinien können je nach Kontotyp eingeschränkt sein