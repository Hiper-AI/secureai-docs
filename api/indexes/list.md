---
id: list
title: "Listar Índices RAG"
sidebar_label: "Listar Índices"
description: "Recuperar todos los índices de la base de conocimientos disponibles"
openapi: "GET /indexes/all"
---

# Listar todos los índices

Recupere una lista completa de todos los índices de la base de conocimientos disponibles en el sistema.

## Endpoint

```
GET /indexes/all
```

## Descripción

Este endpoint devuelve todos los índices de la base de conocimientos disponibles en el sistema SecureAI. Proporciona información detallada sobre cada índice, incluido su tipo, estado, fecha de creación y metadatos. Esto es útil para descubrir bases de conocimiento disponibles y sus capacidades.

## Autenticación

**Requerido**: Clave API

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `page` | entero | No | 1 | Número de página para paginación |
| `limit` | entero | No | 50 | Número de índices por página (1-100) |
| `search` | cadena | No | - | Término de búsqueda para nombre de índice o nombre de índice compartido |
| `type` | cadena | No | - | Filtrar por tipo de índice (personal, general, grupo) |
| `status` | cadena | No | activo | Filtrar por estado del índice (activo, eliminado, todo) |
| `sortBy` | cadena | No | creadoEn | Campo para ordenar por |
| `sortOrder` | cadena | No | desc | Orden de clasificación (asc, desc) |

## Solicitud de ejemplo

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "indexes": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "my-knowledge-base",
      "sharedIndexName": "my-knowledge-base",
      "namespace": "user-namespace",
      "type": "personal",
      "assignedUser": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedGroup": null,
      "userId": "60a7c8f5e8b4f5001f7a8c24",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `indexes[]` | matriz | Matriz de objetos de índice |
| `indexes[].id` | cadena | Identificador de índice único |
| `indexes[].name` | cadena | Nombre del índice |
| `indexes[].sharedIndexName` | cadena | Nombre del índice compartido |
| `indexes[].namespace` | cadena | Espacio de nombres de índice |
| `indexes[].type` | cadena | Tipo de índice (personal, general, grupal, desconocido) |
| `indexes[].assignedUser` | objeto | Información de usuario asignada (si es personal) |
| `indexes[].assignedGroup` | objeto | Información del grupo asignado (si es grupo) |
| `indexes[].userId` | cadena | ID de usuario |
| `indexes[].isActive` | booleano | Si el índice está activo |
| `indexes[].createdAt` | cadena | Marca de tiempo de creación |
| `indexes[].updatedAt` | cadena | Marca de tiempo de la última actualización |
| `indexes[].deletedAt` | cadena | Marca de tiempo de eliminación (si se elimina) |
| `pagination` | objeto | Información de paginación |

## Tipos de índice

| Tipo | Descripción | Acceso |
|------|-------------|--------|
| `personal` | Índices personales creados por el usuario | Acceso completo para el propietario |
| `general` | Índices organizativos compartidos | Varía según los permisos |
| `group` | Índices asignados por grupos | Miembros del grupo |
| `unknown` | Índices con asignación poco clara | Varía |

## Estado del índice

| Estado | Descripción |
|--------|-------------|
| `active` | El índice está disponible para su uso |
| `deleted` | El índice ha sido eliminado |
| `all` | Incluir activos y eliminados |

## Ejemplo de uso

### JavaScript

```javascript
const listIndexes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/indexes/all${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listIndexes({
  type: 'personal',
  limit: 10,
  page: 1
});
console.log(result.indexes);
```

### Pitón

```python
import requests

def list_indexes(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "type": "personal",
    "limit": 10,
    "page": 1
}

result = list_indexes(params)
print(result["indexes"])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
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

### Filtrar por tipo

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### Filtrar por estado

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### Paginación

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## Casos de uso

- **Descubrimiento**: encuentre bases de conocimiento disponibles para operaciones RAG
- **Gestión**: Listar índices para fines administrativos
- **Integración**: Descubra índices para la integración de aplicaciones
- **Monitoreo**: Verifique el estado del índice y los metadatos
- **Filtrado**: busque tipos específicos de índices (sistema, personal, etc.)

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Solo los administradores pueden acceder a este endpoint.
- Los índices personales sólo son visibles para sus propietarios.
- Los índices del grupo son visibles para los miembros del grupo.
- La respuesta incluye información de usuario y grupo asignado.
- La paginación utiliza el parámetro de página, no el desplazamiento.
- Filtrar por tipo y estado ayuda a limitar los resultados