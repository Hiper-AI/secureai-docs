---
sidebar_position: 1
title: "Health Check (Estado del Sistema)"
openapi: "GET /health"
sidebar_label: "Health Check"
---

# Control de salud

Compruebe si la API está funcionando y en buen estado. No se requiere autenticación.

## Endpoint

```
GET /health
```

## Descripción

Este endpoint le permite verificar que la API externa SecureAI esté funcionando y en buen estado. No se requiere autenticación para este endpoint.

## Solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Campos de respuesta

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `success` | booleano | Siempre es cierto para un control de salud exitoso | `true` |
| `status` | cadena | Estado de salud de la API | `"healthy"` |
| `timestamp` | cadena | Marca de tiempo actual del servidor en formato ISO 8601 | `"2024-01-15T10:30:00.000Z"` |
| `version` | cadena | Versión API actual | `"1.0.0"` |

## Ejemplo de uso

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

### Pitón

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Notas

- Este endpoint no requiere autenticación
- Utilice este endpoint para monitorear la disponibilidad de API
- La respuesta incluye la versión actual de la API para comprobar la compatibilidad.