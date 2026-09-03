---
sidebar_position: 3
title: "S2S-Sitzungsdauer protokollieren"
openapi: "POST /speech/s2s/log-session"
---
# S2S-Sitzungsdauer protokollieren

Protokollieren Sie die Dauer einer abgeschlossenen Speech-to-Speech-Sitzung und ziehen Sie die Zeit vom S2S-Zeitkontingent des Benutzers ab.

## Endpunkt

```
POST /speech/s2s/log-session
```

## Beschreibung

Protokollieren Sie die Dauer einer abgeschlossenen Speech-to-Speech-Sitzung und ziehen Sie die Zeit vom S2S-Zeitkontingent des Benutzers ab. Dies sollte nach dem Ende einer Sitzung aufgerufen werden, um die Nutzung genau zu verfolgen.

### Nutzungsverfolgung

- Die Dauer wird in Millisekunden angegeben
- Automatisch in Minuten umgerechnet und vom Kontingent des Benutzers abgezogen
- Die Zeit wird pro Benutzer basierend auf der Lizenzstufe erfasst
- Aktivitätsprotokolle werden zu Prüfzwecken erstellt

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `durationMs` | Ganzzahl | Ja | Sitzungsdauer in Millisekunden (Minimum: 0) |
| `user_id` | Zeichenfolge | Nein | Benutzer-ID, der diese Sitzung in Rechnung gestellt werden soll (standardmäßig API-Schlüsselbesitzer) |

## Beispiel für Anfrage

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "durationMs": 42624,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
  }'
```

### JavaScript/Node.js

```javascript
// Calculate session duration in milliseconds
const sessionStartTime = Date.now();
// ... session happens ...
const sessionEndTime = Date.now();
const durationMs = sessionEndTime - sessionStartTime;

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    durationMs: durationMs,
    user_id: '60a7c8f5e8b4f5001f7a8c23'
  })
});

const data = await response.json();
console.log('Session logged:', data.message);
```

### Python

```python
import requests
import time

# Calculate session duration
session_start = time.time() * 1000  # Convert to milliseconds
# ... session happens ...
session_end = time.time() * 1000
duration_ms = int(session_end - session_start)

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "durationMs": duration_ms,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Session logged:', result['message'])
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `request_id` | Zeichenfolge | ID zur Nachverfolgung anfordern |

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## Notizen

– Rufen Sie diesen Endpunkt nach dem Ende jeder S2S-Sitzung auf, um die Nutzung genau zu verfolgen
– Die Dauer sollte vom Aufbau der WebRTC-Verbindung bis zum Schließen berechnet werden
- Die Zeit wird automatisch von Millisekunden in Minuten umgerechnet und vom Kontingent des Benutzers abgezogen
- Der Parameter `user_id` ermöglicht die Abrechnung über ein anderes Benutzerkonto
- Zu Prüfzwecken werden automatisch Aktivitätsprotokolle erstellt
- Stellen Sie sicher, dass Sie noch genügend Zeit haben, bevor Sie eine Sitzung beginnen (fragen Sie bei `/speech/s2s/status` nach).