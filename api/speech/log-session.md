---
sidebar_position: 3
title: "Registrar Sesión Speech-to-Speech"
openapi: "POST /speech/s2s/log-session"
sidebar_label: "Log de Sesión S2S"
---

# Registrar duración de la sesión S2S

Registre la duración de una sesión de voz a voz completa y deduzca el tiempo de la cuota de tiempo S2S del usuario.

## Endpoint

```
POST /speech/s2s/log-session
```

## Descripción

Registre la duración de una sesión de voz a voz completa y deduzca el tiempo de la cuota de tiempo S2S del usuario. Esto debe llamarse después de que finalice una sesión para realizar un seguimiento del uso con precisión.

### Seguimiento de uso

- La duración se especifica en milisegundos.
- Convertido automáticamente a minutos y deducido de la cuota del usuario.
- El tiempo se rastrea por usuario según el nivel de licencia
- Los registros de actividad se crean con fines de auditoría.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `durationMs` | entero | Sí | Duración de la sesión en milisegundos (mínimo: 0) |
| `user_id` | cadena | No | ID de usuario al que facturar esta sesión (el valor predeterminado es el propietario de la clave API) |

## Ejemplo de solicitud

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

### Pitón

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

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas |
| `message` | cadena | Mensaje de éxito |
| `request_id` | cadena | Solicitar ID para seguimiento |

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## Notas

- Llame a este endpoint después de que finalice cada sesión S2S para realizar un seguimiento preciso del uso.
- La duración debe calcularse desde que se establece la conexión WebRTC hasta que se cierra
- El tiempo se convierte automáticamente de milisegundos a minutos y se deduce de la cuota del usuario.
- El parámetro `user_id` permite facturar a una cuenta de usuario diferente
- Los registros de actividad se crean automáticamente con fines de auditoría.
- Asegúrese de tener suficiente tiempo restante antes de iniciar una sesión (consulte con `/speech/s2s/status`)