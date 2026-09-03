---
sidebar_position: 2
title: "Verfügbare Wissensdatenbanken"
openapi: "GET /indexes"
---
# Verfügbare Wissensdatenbanken abrufen

Rufen Sie verfügbare Wissensdatenbanken (Indizes) ab, auf die Ihr API-Schlüssel zugreifen kann.

## Endpunkt

```
GET /indexes
```

## Beschreibung

Rufen Sie verfügbare Wissensdatenbanken (Indizes) ab, auf die Ihr API-Schlüssel zugreifen kann. Beinhaltet persönliche Indizes, gemeinsame Indizes und die Zero-Knowledge-Option.

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr | `true` |
| `indexes` | Array | Liste der verfügbaren Wissensdatenbanken | Siehe Beispiel |
| `restrictions` | Objekt | Indexzugriffsbeschränkungen | Siehe Beispiel |

### Indexobjekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `id` | Zeichenfolge | Eindeutiger Indexbezeichner | `"my-knowledge-base"` |
| `name` | Zeichenfolge | Indexanzeigename | `"my-knowledge-base"` |
| `type` | Zeichenfolge | Indextyp | `"personal"` |
| `namespace` | Zeichenfolge | Index-Namespace (optional) | `"user-namespace"` |
| `description` | Zeichenfolge | Indexbeschreibung (optional) | `"Direct AI responses..."` |

### Indextypen

| Geben Sie | ein Beschreibung |
|------|-------------|
| `system` | Vom System bereitgestellte Indizes (z. B. Zero-Knowledge) |
| `personal` | Persönliche Wissensdatenbanken des Benutzers |
| `general` | Gemeinsame Wissensdatenbanken |

### Restrictions-Objekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `allowed_indexes` | Zeichenfolge | Beschreibung der zulässigen Indizes | `"all user indexes"` |

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
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Spezielle Indizes

### Null-Wissen

Der `Zero-Knowledge`-Index ist ein spezieller Systemindex, der direkte KI-Antworten ohne Abruf der Wissensdatenbank bereitstellt. Verwenden Sie dies, wenn Sie möchten:

- Reine KI-Antworten ohne RAG
- Testen der Fähigkeiten von KI-Modellen
- Allgemeines Gespräch ohne spezifischen Kontext

## Notizen

- Der Zero-Knowledge-Index ist immer verfügbar
- Persönliche Indizes werden vom Benutzer erstellt
- Der Zugriff auf Indizes hängt von Ihren Berechtigungen ab
- Verwenden Sie die Index-ID in Chat-Abschlussanfragen