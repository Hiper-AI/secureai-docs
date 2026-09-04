---
id: list
title: "Listar Roles"
sidebar_label: "Listar Roles"
description: "Recuperar todos los roles de usuario disponibles"
openapi: "GET /roles"
---

# Lista de roles

Recupere todos los roles de usuario disponibles en el sistema SecureAI.

## Endpoint

```
GET /roles
```

## Descripción

Este endpoint devuelve todos los roles de usuario disponibles en el sistema SecureAI. Proporciona información detallada sobre cada rol, incluidos permisos, descripciones y metadatos. Esto es útil para comprender los roles disponibles y sus capacidades.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `page` | entero | No | 1 | Número de página para paginación (predeterminado: 1) |
| `limit` | entero | No | 20 | Número de roles por página (predeterminado: 20) |
| `search` | cadena | No | - | Término de búsqueda para nombre, nombre para mostrar o descripción |
| `isSystem` | cadena | No | - | Filtrar por roles del sistema (verdadero/falso) |
| `sortBy` | cadena | No | creadoEn | Campo para ordenar por (predeterminado: "createdAt") |
| `sortOrder` | cadena | No | desc | Orden de clasificación (asc/desc, predeterminado: "desc") |

## Solicitud de ejemplo

```bash
GET /roles?page=1&limit=10&search=admin
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `roles` | matriz | Matriz de objetos de rol |
| `roles[].id` | cadena | Identificador de rol único |
| `roles[].name` | cadena | Nombre del rol |
| `roles[].displayName` | cadena | Nombre para mostrar del rol |
| `roles[].description` | cadena | Descripción del rol |
| `roles[].isSystem` | booleano | Si se trata de una función del sistema |
| `roles[].hasAdminPanelAccess` | booleano | Si el rol tiene acceso al panel de administración |
| `roles[].permissions` | matriz | Matriz de objetos de permiso |
| `roles[].permissions[].section` | cadena | Sección de permisos |
| `roles[].permissions[].level` | cadena | Nivel de permiso |
| `roles[].canInteractWithAI` | booleano | Si el rol puede interactuar con la IA |
| `roles[].canUseChat` | booleano | Si el rol puede usar el chat |
| `roles[].userCount` | entero | Número de usuarios con este rol |
| `roles[].createdBy` | objeto | Usuario que creó el rol |
| `roles[].createdBy.id` | cadena | ID de usuario del creador |
| `roles[].createdBy.name` | cadena | Nombre del creador |
| `roles[].createdBy.email` | cadena | Correo electrónico del creador |
| `roles[].createdAt` | cadena | Marca de tiempo de creación |
| `roles[].updatedAt` | cadena | Marca de tiempo de la última actualización |
| `pagination` | objeto | Información de paginación |
| `pagination.page` | entero | Número de página actual |
| `pagination.limit` | entero | Artículos por página |
| `pagination.total` | entero | Número total de funciones |
| `pagination.pages` | entero | Número total de páginas |

## Ejemplo de uso

### JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

### Pitón

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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


## Casos de uso

- **Gestión de roles**: enumera todos los roles disponibles para la asignación de usuarios
- **Revisión de permisos**: comprenda qué permisos tiene cada rol
- **Control de acceso**: planifique el acceso de los usuarios según los roles disponibles
- **Asignación de usuarios**: asigne roles a los usuarios según sus necesidades
- **Análisis de roles**: analiza el uso de roles y la distribución de usuarios

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Este endpoint requiere privilegios de administrador
- Paginación basada en páginas: utiliza parámetros de página, no desplazamiento
- Búsqueda: busca en los campos de nombre, nombre para mostrar y descripción.
- Roles del sistema: puede filtrar por sistema o por roles personalizados
- Clasificación: puede ordenar por cualquier campo en orden ascendente o descendente
- Respuesta plana: la respuesta no está anidada en el objeto de datos
- Conteo de usuarios: muestra cuántos usuarios tienen cada rol
- Información del creador: muestra quién creó cada rol.