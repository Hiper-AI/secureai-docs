---
id: update
title: "Actualizar Grupo"
sidebar_label: "Actualizar Grupo"
description: "Actualizar un grupo de usuarios existente"
openapi: "PUT /groups/{groupId}"
---

# Actualizar Grupo

Actualice un grupo de usuarios existente con nueva información, descripción o metadatos.

## Endpoint

```
PUT /groups/{groupId}
```

## Descripción

Este endpoint permite a los administradores actualizar un grupo de usuarios existente. Puede modificar el nombre del grupo, la descripción, los metadatos y otras propiedades. El grupo debe existir y usted debe tener los permisos adecuados para actualizarlo.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `groupId` | cadena | Sí | El identificador único del grupo a actualizar |

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | No | Nuevo nombre para el grupo |
| `description` | cadena | No | Nueva descripción para el grupo |
| `users` | matriz | No | Matriz de ID de usuario para asignar al grupo |
| `status` | cadena | No | Estado del grupo |

## Solicitud de ejemplo

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "message": "Group updated successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "status": "Active",
    "userCount": 3,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c27",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      }
    ],
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
| `group` | objeto | Objeto de grupo actualizado |
| `group.id` | cadena | Identificador de grupo único |
| `group.name` | cadena | Nombre del grupo actualizado |
| `group.description` | cadena | Descripción del grupo actualizada |
| `group.status` | cadena | Estado del grupo |
| `group.userCount` | entero | Número de usuarios en el grupo |
| `group.users` | matriz | Matriz de objetos de usuario en el grupo |
| `group.users[].id` | cadena | ID de usuario |
| `group.users[].name` | cadena | Nombre de usuario |
| `group.users[].email` | cadena | Correo electrónico del usuario |
| `group.createdAt` | cadena | Marca de tiempo de creación original |
| `group.updatedAt` | cadena | Marca de tiempo de la última actualización |

## Ejemplo de uso

### JavaScript

```javascript
const updateGroup = async (groupId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/groups/${groupId}`, {
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
  name: "Updated Engineering Team",
  description: "Updated software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  status: "Active"
};

const result = await updateGroup('60a7c8f5e8b4f5001f7a8c25', updateData);
console.log('Updated group:', result.group);
```

### Pitón

```python
import requests

def update_group(group_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/groups/{group_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
}

result = update_group("60a7c8f5e8b4f5001f7a8c25", update_data)
print("Updated group:", result["group"])
```

### rizo

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/groups/60a7c8f5e8b4f5001f7a8c25" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name cannot be empty",
    "details": {
      "field": "name",
      "value": ""
    }
  }
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
    "message": "Cannot update this group"
  }
}
```

### 404 no encontrado

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
  }
}
```

### 409 Conflicto

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

- **Gestión de grupos**: actualizar la información y descripciones del grupo
- **Asignación de usuarios**: asigna nuevos usuarios al grupo
- **Cambios de nombre**: cambie el nombre de los grupos para mayor claridad
- **Actualizaciones de estado**: cambiar el estado del grupo
- **Actualizaciones del equipo**: actualiza la información del grupo cuando cambia la estructura del equipo.

## Límites de tarifas

- **Predeterminado**: 50 solicitudes por minuto
- **Diario**: 5000 solicitudes por día
- **Mensual**: 150.000 solicitudes por mes

## Notas

- Solo los administradores pueden acceder a este endpoint.
- Actualizaciones parciales: incluya solo los campos que desea cambiar
- Asignación de usuarios: puede asignar nuevos usuarios al grupo
- Validación de nombre: los nombres de los grupos deben ser únicos
- Respuesta plana: la respuesta no está anidada en el objeto de datos
- Validación de usuario: las identificaciones de usuario se validan antes de la asignación
- La marca de tiempo `updatedAt` se actualiza automáticamente