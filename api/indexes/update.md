---
id: update
title: "Actualizar Índice RAG"
sidebar_label: "Actualizar Índice"
description: "Actualizar un índice de base de conocimientos existente"
openapi: "PUT /indexes/{indexId}"
---

# Actualizar índice

Actualice un índice de base de conocimientos existente con nuevas configuraciones, metadatos o configuración.

## Endpoint

```
PUT /indexes/{indexId}
```

## Descripción

Este endpoint permite a los administradores actualizar un índice de base de conocimientos existente. Puede modificar el nombre del índice y reasignarlo a diferentes usuarios o grupos. Sólo los administradores pueden actualizar los índices.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `indexId` | cadena | Sí | El identificador único del índice a actualizar |

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | No | Nuevo nombre para el índice |
| `assignedUser` | cadena | No | ID de usuario al que asignar el índice (MongoDB ObjectId) |
| `assignedGroup` | cadena | No | ID de grupo al que asignar el índice (MongoDB ObjectId) |


## Solicitud de ejemplo

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `message` | cadena | Mensaje de éxito |
| `index` | objeto | Objeto de índice actualizado |
| `index.id` | cadena | Identificador de índice único |
| `index.name` | cadena | Nombre del índice actualizado |
| `index.sharedIndexName` | cadena | Nombre del índice compartido |
| `index.namespace` | cadena | Espacio de nombres de índice |
| `index.type` | cadena | Tipo de índice (personal, general, grupal, desconocido) |
| `index.assignedUser` | objeto | Información de usuario asignada (si es personal) |
| `index.assignedGroup` | objeto | Información del grupo asignado (si es grupo) |
| `index.createdAt` | cadena | Marca de tiempo de creación original |
| `index.updatedAt` | cadena | Marca de tiempo de la última actualización |

## Ejemplo de uso

### JavaScript

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  return await response.json();
};

// Example usage
const updateData = {
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

### Pitón

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

### rizo

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## Validaciones y reglas de negocio

- **Asignación a un usuario (`assignedUser`)**:
  - Aplicar cuota de índice de usuarios a través de `checkUserIndexQuota` al convertir a personal o cambiar el cesionario. La cuota excedida devuelve 403.
- **Asignación a un grupo (`assignedGroup`)**:
  - El grupo debe existir y estar activo (`status != 'Archived'`); los grupos no válidos/inactivos devuelven 400.

## Normalización y almacenamiento

- Al cambiar el nombre, `name` continúa almacenándose normalizado; `sharedIndexName` tiene por defecto el nombre normalizado si no se establece explícitamente.

## Formas de error típicas

### Cuota de índice 403 excedida

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
}
```

### 400 Grupo no válido/inactivo

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
}
```

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
    "message": "Cannot update this index"
  }
}
```

### 404 no encontrado

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
  }
}
```

### 409 Conflicto

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## Campos actualizables

| Campo | Descripción | Notas |
|-------|-------------|-------|
| `name` | Nombre del índice | Debe ser único en todo el sistema |
| `assignedUser` | Asignación de usuario | Asigna índice a un usuario específico |
| `assignedGroup` | Asignación grupal | Asigna índice a un grupo específico |

## Casos de uso

- **Cambios de nombre**: cambie el nombre de los índices para una mejor organización
- **Asignación de usuarios**: reasignar índices a diferentes usuarios
- **Asignación de grupo**: reasignar índices a diferentes grupos
- **Transferencia de propiedad**: cambiar la propiedad del índice entre usuarios

## Límites de tarifas

- **Predeterminado**: 50 solicitudes por minuto
- **Diario**: 5000 solicitudes por día
- **Mensual**: 150.000 solicitudes por mes

## Notas

- Solo los administradores pueden acceder a este endpoint.
- Campos limitados: solo se pueden actualizar el nombre, el usuario asignado y el grupo asignado
- Lógica de asignación: la asignación a un usuario borra la asignación de grupo y viceversa
- Validación: las identificaciones de usuarios y grupos se validan antes de la asignación.
- Sin configuración: no se pueden actualizar configuraciones, metadatos u otras configuraciones
- La marca de tiempo `updatedAt` se actualiza automáticamente
- Los nombres de los índices deben permanecer únicos en todo el sistema.