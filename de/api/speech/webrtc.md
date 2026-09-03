---
sidebar_position: 1
title: "Initiieren Sie eine Speech-to-Speech-WebRTC-Sitzung"
openapi: "POST /speech/s2s/webrtc"
---
# Speech-to-Speech-WebRTC-Sitzung starten

Stellen Sie mithilfe der OpenAI Realtime API eine WebRTC-Verbindung für Echtzeit-Sprachgespräche her.

## Endpunkt

```
POST /speech/s2s/webrtc
```

## Beschreibung

Stellt mithilfe der OpenAI Realtime API eine WebRTC-Verbindung für Echtzeit-Sprachgespräche her. Dieser Endpunkt akzeptiert ein WebRTC-SDP-Angebot und gibt eine SDP-Antwort zurück, die zum Herstellen einer Peer-Verbindung mit der Echtzeit-API von OpenAI verwendet werden kann.

### Nutzungsablauf

1. Der Client erstellt ein WebRTC-Angebot (RTCPeerConnection.createOffer).
2. Der Client sendet das SDP-Angebot an diesen Endpunkt
3. Dieser Endpunkt leitet das Angebot an die OpenAI Realtime API weiter
4. Der Client empfängt die SDP-Antwort und stellt eine WebRTC-Verbindung her
5. Der Kunde kann dann in Echtzeit Sprachgespräche mit der KI führen

### S2S-Zeiterfassung

- Jeder Benutzer verfügt über ein monatliches S2S-Zeitkontingent basierend auf seiner Lizenz
- Die Zeit wird in Minuten erfasst und bei der Protokollierung von Sitzungen abgezogen
- Verwenden Sie `/speech/s2s/status`, um die verbleibende Zeit zu überprüfen
- Verwenden Sie `/speech/s2s/log-session`, um die Sitzungsdauer zu protokollieren und Zeit abzuziehen

### SMLTP-Integration

- Alle Anfragen werden aus Sicherheits- und Compliance-Gründen über SMLTP verarbeitet
– Die Modellvalidierung wird basierend auf der angegebenen SMLTP-Richtlinie erzwungen
- Anfragen werden zur Compliance-Nachverfolgung geprüft und protokolliert

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `sdp` | Zeichenfolge | Ja | WebRTC SDP-Angebot aus der RTCPeerConnection | des Clients
| `model` | Zeichenfolge | Nein | OpenAI-Echtzeitmodell (Standard: „gpt-4o-mini-realtime-preview“) |
| `voice` | Zeichenfolge | Nein | Für die KI-Antwort zu verwendende Stimme (Standard: „Legierung“) |
| `smltp_policy` | Zeichenfolge | Nein | SMLTP-Richtlinie (Standard: „intern“) |
| `output_audio` | boolescher Wert | Nein | Ob die Audioausgabe aktiviert werden soll (Standard: true) |
| `user_id` | Zeichenfolge | Nein | Benutzer-ID, der diese Sitzung in Rechnung gestellt werden soll (standardmäßig API-Schlüsselbesitzer) |
| `instructions` | Zeichenfolge | Nein | Optionale Systemanweisungen für den KI-Assistenten |

### Verfügbare Modelle

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### Verfügbare Stimmen

- `alloy` (Standard)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### Verfügbare SMLTP-Richtlinien

- `public`
- `internal` (Standard)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## Beispiel für Anfrage

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": true,
    "instructions": "You are a helpful customer service agent."
  }'
```

### JavaScript/Node.js

```javascript
// Create WebRTC peer connection
const pc = new RTCPeerConnection();

// Create offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// Send SDP offer to SecureAI
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sdp: offer.sdp,
    model: 'gpt-4o-mini-realtime-preview',
    voice: 'alloy',
    smltp_policy: 'internal',
    output_audio: true,
    instructions: 'You are a helpful customer service agent.'
  })
});

// Get SDP answer
const sdpAnswer = await response.text();

// Set remote description
await pc.setRemoteDescription(new RTCSessionDescription({
  type: 'answer',
  sdp: sdpAnswer
}));

// Now you can have real-time voice conversations
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": True,
    "instructions": "You are a helpful customer service agent."
}

response = requests.post(url, headers=headers, json=data)
sdp_answer = response.text
print('SDP Answer:', sdp_answer)
```

## Antwort

### Erfolgsantwort (200)

**Inhaltstyp**: `application/sdp`

Die Antwort ist eine SDP-Antwortzeichenfolge, die mit `RTCPeerConnection.setRemoteDescription()` verwendet werden kann.

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 Verboten

#### S2S-Zeitlimit erreicht

```json
{
  "success": false,
  "error": "S2S time limit reached",
  "message": "Insufficient S2S time remaining for this user",
  "remaining_minutes": 0,
  "next_renewal_date": "2024-12-01T12:55:35.721Z",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

#### Modellvalidierung fehlgeschlagen

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## Notizen

– Das SDP-Angebot muss eine gültige WebRTC-SDP-Angebotszeichenfolge sein
- Nachdem Sie die SDP-Antwort erhalten haben, verwenden Sie diese, um die Remote-Beschreibung auf Ihrer RTCPeerConnection festzulegen
- Überprüfen Sie den S2S-Zeitstatus, bevor Sie Sitzungen mit `/speech/s2s/status` starten.
- Protokollieren Sie die Sitzungsdauer nach Abschluss mit `/speech/s2s/log-session`
- Alle Anfragen werden aus Sicherheits- und Compliance-Gründen über SMLTP verarbeitet
- Der Parameter `user_id` ermöglicht die Abrechnung über ein anderes Benutzerkonto