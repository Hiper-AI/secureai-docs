---
id: list
title: "Listar Grupos"
sidebar_label: "Listar Grupos"
description: "Recuperar todos los grupos de usuarios"
openapi: "GET /groups"
---

# Listar grupos

Recupere una lista de todos los grupos de usuarios en el sistema con opciones de paginación y filtrado.

## Endpoint

```
GET /groups
```

## Descripción

Este endpoint devuelve todos los grupos de usuarios disponibles en el sistema SecureAI. Proporciona información detallada sobre cada grupo, incluidos miembros, permisos y metadatos. Esto es útil para gestionar el acceso de los usuarios y la estructura organizativa.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `page` | entero | No | 1 | Número de página para paginación |
| `limit` | entero | No | 20 | Número de grupos por página (1-100) |
| `search` | cadena | No | - | Término de búsqueda para nombre o descripción del grupo |
| `status` | cadena | No | - | Filtrar por estado del grupo |
| `sortBy` | cadena | No | creadoEn | Campo para ordenar por |
| `sortOrder` | cadena | No | desc | Orden de clasificación (asc, desc) |

## Solicitud de ejemplo

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `groups[]` | matriz | Matriz de objetos de grupo |
| `groups[].id` | cadena | Identificador de grupo único |
| `groups[].name` | cadena | Nombre del grupo |
| `groups[].description` | cadena | Descripción del grupo |
| `groups[].status` | cadena | Estado del grupo |
| `groups[].userCount` | entero | Número de usuarios en el grupo |
| `groups[].users` | matriz | Matriz de objetos de usuario en el grupo |
| `groups[].users[].id` | cadena | ID de usuario |
| `groups[].users[].name` | cadena | Nombre de usuario |
| `groups[].users[].email` | cadena | Correo electrónico del usuario |
| `groups[].createdAt` | cadena | Marca de tiempo de creación |
| `pagination` | objeto | Información de paginación |

## Ejemplo de uso

### JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

### Pitón

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

### Buscar grupos

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### Opciones de clasificación

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### Paginación

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## Casos de uso

- **Gestión de grupos**: enumera todos los grupos para fines administrativos
- **Organización de usuarios**: descubra los grupos disponibles para la asignación de usuarios
- **Control de acceso**: revisar los permisos del grupo y el recuento de miembros
- **Informes**: genere informes sobre la estructura del grupo y la membresía
- **Integración**: Descubra grupos para la integración de aplicaciones

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Solo los administradores pueden acceder a este endpoint.
- Paginación: utiliza el parámetro de página, no el desplazamiento.
- Respuesta plana: la respuesta no está anidada en el objeto de datos
- Detalles del usuario: incluye información de usuario completa para cada miembro del grupo
- Filtro de estado: puede filtrar por estado de grupo
- La función de búsqueda funciona en todos los nombres y descripciones de grupos.
- Las opciones de clasificación ayudan a organizar los resultados según diferentes criterios.