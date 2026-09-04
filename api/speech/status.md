---
sidebar_position: 2
title: "Estado de Sesión Speech-to-Speech"
openapi: "GET /speech/s2s/status"
sidebar_label: "Estado S2S"
---

# Obtener estado de tiempo S2S

Recupere el estado de tiempo actual de voz a voz (S2S) para el usuario de facturación.

## Endpoint

```
GET /speech/s2s/status
```

## Descripción

Recupere el estado actual del tiempo de Voz a Voz (S2S) para el usuario de facturación, incluido el tiempo restante, el límite mensual total, el tiempo utilizado y la información de renovación.

### Cuotas de tiempo S2S

- Las cuotas se basan en el nivel de licencia del usuario.
- El tiempo se restablece mensualmente según la fecha de asignación de la licencia.
- Las licencias de prueba no renovables no se restablecen automáticamente

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `user_id` | cadena | No | ID de usuario para verificar el estado (el valor predeterminado es el propietario de la clave API) |

## Ejemplo de solicitud

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

### Pitón

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

## Respuesta

### Respuesta exitosa (200)

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

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas |
| `remaining_minutes` | número | Tiempo restante de S2S en minutos |
| `total_minutes` | número | Límite de tiempo total mensual S2S |
| `used_minutes` | número | Tiempo S2S usado este mes |
| `has_time_remaining` | booleano | Si al usuario le queda tiempo S2S |
| `next_renewal_date` | cadena\|nulo | Cuándo se restablecerá la cuota de tiempo S2S (nula para licencias no renovables) |
| `non_renewable` | booleano | Si se trata de una licencia de prueba no renovable |
| `request_id` | cadena | Solicitar ID para seguimiento |

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 no encontrado

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Notas

- Verifique este endpoint antes de iniciar sesiones S2S para garantizar que haya suficiente tiempo disponible
- El parámetro `user_id` permite verificar el estado de un usuario diferente (el valor predeterminado es el propietario de la clave API)
- Las cuotas de tiempo se basan en el nivel de licencia del usuario.
- Las licencias de prueba no renovables tendrán `non_renewable: true` y `next_renewal_date: null`