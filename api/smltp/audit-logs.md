---
id: audit-logs
title: "Logs de Auditoría Criptográficos"
sidebar_label: "Logs de Auditoría"
description: "Recuperar registros de auditoría SMLTP"
openapi: "GET /audit-logs"
---

# Registros de auditoría

Recupere registros de auditoría SMLTP (Protocolo de transferencia de lenguaje de modelo seguro) para monitorear y cumplir con la seguridad.

## Endpoint

```
GET /audit-logs
```

## Descripción

Este endpoint devuelve registros de auditoría SMLTP que rastrean eventos de seguridad, violaciones de políticas y actividades de cumplimiento. Esto es útil para monitorear la seguridad, auditar el cumplimiento e investigar incidentes de seguridad.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `page` | entero | No | 1 | Número de página para paginación (predeterminado: 1) |
| `limit` | entero | No | 50 | Número de registros por página (predeterminado: 50) |
| `startDate` | cadena | No | - | Fecha de inicio del filtrado (formato ISO 8601) |
| `endDate` | cadena | No | - | Fecha de finalización del filtrado (formato ISO 8601) |
| `type` | cadena | No | - | Filtrar por tipo de registro |
| `severity` | cadena | No | - | Filtrar por nivel de gravedad |
| `userId` | cadena | No | - | Filtrar por ID de usuario |
| `search` | cadena | No | - | Término de búsqueda para descripción o metadatos |

## Solicitud de ejemplo

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `data` | objeto | Objeto de datos de respuesta |
| `data.logs` | matriz | Matriz de objetos de registro de auditoría |
| `data.logs[].id` | cadena | Identificador único de registro de auditoría |
| `data.logs[].timestamp` | cadena | Marca de tiempo del registro (ISO 8601) |
| `data.logs[].type` | cadena | Tipo de evento de auditoría |
| `data.logs[].severity` | cadena | Nivel de gravedad |
| `data.logs[].description` | cadena | Descripción del evento |
| `data.logs[].user` | objeto | Información del usuario (si está disponible) |
| `data.logs[].user.id` | cadena | ID de usuario |
| `data.logs[].user.name` | cadena | Nombre de usuario |
| `data.logs[].user.email` | cadena | Correo electrónico del usuario |
| `data.logs[].metadata` | objeto | Metadatos adicionales |
| `data.logs[].complianceCategory` | cadena | Categoría de cumplimiento |
| `data.logs[].outcome` | cadena | Resultado del evento |
| `data.pagination` | objeto | Información de paginación |
| `data.pagination.page` | entero | Número de página actual |
| `data.pagination.limit` | entero | Artículos por página |
| `data.pagination.total` | entero | Número total de registros |
| `data.pagination.pages` | entero | Número total de páginas |
| `data.dateRange` | objeto | Información del rango de fechas |

## Ejemplo de uso

### JavaScript

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

### Pitón

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 403 Prohibido

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 429 Demasiadas solicitudes

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```


## Ejemplos de filtrado

### Rango de fechas

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### Filtrado de eventos

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### Filtrado de usuarios

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## Casos de uso

- **Monitoreo de seguridad**: supervise eventos de seguridad y violaciones de políticas
- **Auditoría de cumplimiento**: realice un seguimiento de las actividades y violaciones de cumplimiento
- **Investigación de incidentes**: investigue incidentes y violaciones de seguridad
- **Análisis de políticas**: analizar la eficacia y el cumplimiento de las políticas
- **Actividad del usuario**: seguimiento de las acciones del usuario y el uso de API

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Este endpoint requiere privilegios de administrador
- Paginación: utiliza el parámetro de página, no el desplazamiento.
- Rango de fechas: el valor predeterminado es de 7 días si no se proporcionan fechas
- Búsqueda: Búsquedas en los campos de descripción y metadatos.operación
- Respuesta anidada: la respuesta está anidada en el objeto de datos.
- Información del usuario: la información del usuario se completa cuando está disponible
- Los registros se conservan con fines de cumplimiento.