---
sidebar_position: 2
title: "S2S-Zeitstatus abrufen"
openapi: "GET /speech/s2s/status"
---
# S2S-Zeitstatus abrufen

Rufen Sie den aktuellen Speech-to-Speech-Zeitstatus (S2S) für den Abrechnungsbenutzer ab.

## Endpunkt

```
GET /speech/s2s/status
```

## Beschreibung

Rufen Sie den aktuellen Speech-to-Speech (S2S)-Zeitstatus für den Abrechnungsbenutzer ab, einschließlich verbleibender Zeit, monatlichem Gesamtlimit, genutzter Zeit und Verlängerungsinformationen.

### S2S-Zeitkontingente

- Kontingente basieren auf der Lizenzstufe des Benutzers
- Die Zeit wird monatlich basierend auf dem Datum der Lizenzzuweisung zurückgesetzt
- Nicht verlängerbare Testlizenzen werden nicht automatisch zurückgesetzt

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `user_id` | Zeichenfolge | Nein | Benutzer-ID, deren Status überprüft werden soll (standardmäßig API-Schlüsselbesitzer) |

## Beispiel für Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Remaining minutes:', data.remaining_minutes);
console.log('Total minutes:', data.total_minutes);
console.log('Used minutes:', data.used_minutes);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Remaining minutes:', result['remaining_minutes'])
print('Total minutes:', result['total_minutes'])
print('Used minutes:', result['used_minutes'])
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "remaining_minutes": 38.2896,
  "total_minutes": 45,
  "used_minutes": 6.7104,
  "has_time_remaining": true,
  "next_renewal_date": "2025-12-01T12:55:35.721Z",
  "non_renewable": false,
  "request_id": "a8c307b4-c0c9-4b30-98db-5aced06c1cfe"
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr |
| `remaining_minutes` | Zahl | Verbleibende S2S-Zeit in Minuten |
| `total_minutes` | Zahl | Gesamtes monatliches S2S-Zeitlimit |
| `used_minutes` | Zahl | Habe diesen Monat S2S-Zeit genutzt |
| `has_time_remaining` | boolescher Wert | Ob der Benutzer noch verbleibende S2S-Zeit hat |
| `next_renewal_date` | string\|null | Wenn das S2S-Zeitkontingent zurückgesetzt wird (null für nicht erneuerbare Lizenzen) |
| `non_renewable` | boolescher Wert | Ob es sich um eine nicht verlängerbare Testlizenz handelt |
| `request_id` | Zeichenfolge | ID zur Nachverfolgung anfordern |

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 Nicht gefunden

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Notizen

– Überprüfen Sie diesen Endpunkt, bevor Sie S2S-Sitzungen starten, um sicherzustellen, dass ausreichend Zeit verfügbar ist
– Der Parameter `user_id` ermöglicht die Überprüfung des Status für einen anderen Benutzer (standardmäßig API-Schlüsselbesitzer).
- Zeitkontingente basieren auf der Lizenzstufe des Benutzers
- Nicht verlängerbare Testlizenzen haben `non_renewable: true` und `next_renewal_date: null`