---
sidebar_position: 1
title: "Sesión WebRTC Speech-to-Speech"
openapi: "POST /speech/s2s/webrtc"
sidebar_label: "Sesión WebRTC (S2S)"
---

# Iniciar sesión WebRTC de voz a voz

Establezca una conexión WebRTC para conversaciones de voz a voz en tiempo real utilizando OpenAI Realtime API.

## Endpoint

```
POST /speech/s2s/webrtc
```

## Descripción

Establece una conexión WebRTC para conversaciones de voz a voz en tiempo real utilizando OpenAI Realtime API. Este endpoint acepta una oferta SDP WebRTC y devuelve una respuesta SDP que se puede utilizar para establecer una conexión entre pares con la API en tiempo real de OpenAI.

### Flujo de uso

1. El cliente crea una oferta WebRTC (RTCPeerConnection.createOffer)
2. El cliente envía la oferta SDP a este endpoint.
3. Este endpoint representa la oferta para OpenAI Realtime API
4. El cliente recibe la respuesta SDP y establece una conexión WebRTC.
5. Luego, el cliente puede tener conversaciones de voz en tiempo real con la IA.

### Seguimiento del tiempo S2S

- Cada usuario tiene una cuota de tiempo S2S mensual según su licencia
- El tiempo se registra en minutos y se deduce cuando se registran las sesiones.
- Utilice `/speech/s2s/status` para comprobar el tiempo restante
- Utilice `/speech/s2s/log-session` para registrar la duración de la sesión y deducir el tiempo

### Integración SMLTP

- Todas las solicitudes se procesan a través de SMLTP por motivos de seguridad y cumplimiento.
- La validación del modelo se aplica según la política SMLTP especificada.
- Las solicitudes se auditan y registran para realizar un seguimiento del cumplimiento.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `sdp` | cadena | Sí | Oferta WebRTC SDP de RTCPeerConnection del cliente |
| `model` | cadena | No | Modelo OpenAI Realtime (predeterminado: "gpt-4o-mini-realtime-preview") |
| `voice` | cadena | No | Voz a utilizar para la respuesta de IA (predeterminado: "aleación") |
| `smltp_policy` | cadena | No | Política SMLTP (predeterminada: "interna") |
| `output_audio` | booleano | No | Ya sea para habilitar la salida de audio (predeterminado: verdadero) |
| `user_id` | cadena | No | ID de usuario al que facturar esta sesión (el valor predeterminado es el propietario de la clave API) |
| `instructions` | cadena | No | Instrucciones opcionales del sistema para el asistente de IA |

### Modelos disponibles

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### Voces disponibles

- `alloy` (predeterminado)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### Políticas SMLTP disponibles

- `public`
- `internal` (predeterminado)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## Ejemplo de solicitud

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

### Pitón

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

## Respuesta

### Respuesta exitosa (200)

**Tipo de contenido**: `application/sdp`

La respuesta es una cadena de respuesta SDP que se puede utilizar con `RTCPeerConnection.setRemoteDescription()`.

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 Prohibido

#### Límite de tiempo S2S alcanzado

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

#### Error en la validación del modelo

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## Notas

- La oferta SDP debe ser una cadena de oferta WebRTC SDP válida
- Después de recibir la respuesta SDP, úsela para configurar la descripción remota en su RTCPeerConnection
- Verifique el estado del tiempo S2S antes de iniciar sesiones usando `/speech/s2s/status`
- Registrar la duración de la sesión después de completarla usando `/speech/s2s/log-session`
- Todas las solicitudes se procesan a través de SMLTP por motivos de seguridad y cumplimiento.
- El parámetro `user_id` permite facturar a una cuenta de usuario diferente