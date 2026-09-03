---
sidebar_position: 1
title: "Gesundheitscheck"
openapi: "GET /health"
---
# Gesundheitscheck

Überprüfen Sie, ob die API ausgeführt wird und fehlerfrei ist. Keine Authentifizierung erforderlich.

## Endpunkt

```
GET /health
```

## Beschreibung

Mit diesem Endpunkt können Sie überprüfen, ob die SecureAI External API ausgeführt wird und fehlerfrei ist. Für diesen Endpunkt ist keine Authentifizierung erforderlich.

## Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `success` | boolescher Wert | Immer wahr für einen erfolgreichen Gesundheitscheck | `true` |
| `status` | Zeichenfolge | Gesundheitsstatus der API | `"healthy"` |
| `timestamp` | Zeichenfolge | Aktueller Server-Zeitstempel im ISO 8601-Format | `"2024-01-15T10:30:00.000Z"` |
| `version` | Zeichenfolge | Aktuelle API-Version | `"1.0.0"` |

## Beispielverwendung

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

### Python

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Notizen

– Dieser Endpunkt erfordert keine Authentifizierung
– Verwenden Sie diesen Endpunkt, um die API-Verfügbarkeit zu überwachen
– Die Antwort enthält die aktuelle API-Version zur Kompatibilitätsprüfung