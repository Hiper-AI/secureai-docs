---
id: create
title: "Crear Grupo"
sidebar_label: "Crear Grupo"
description: "Crear un nuevo grupo de usuarios"
openapi: "POST /groups"
---

# Crear grupo

Cree un nuevo grupo de usuarios para organizar usuarios y administrar permisos de acceso.

## Endpoint

```
POST /groups
```

## Descripción

Este endpoint permite a los administradores crear nuevos grupos de usuarios. Los grupos se utilizan para organizar usuarios, administrar permisos y controlar el acceso a diferentes partes del sistema. Puede especificar el nombre del grupo, la descripción y los metadatos durante la creación.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | Sí | Nombre del grupo |
| `description` | cadena | Sí | Descripción del grupo |
| `users` | matriz | No | Matriz de ID de usuario para agregar al grupo |
| `status` | cadena | No | Estado del grupo (por defecto "Activo") |

## Solicitud de ejemplo

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## Respuesta exitosa

**Código de estado**: `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
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
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `message` | cadena | Mensaje de éxito |
| `group` | objeto | Objeto de grupo creado |
| `group.id` | cadena | Identificador de grupo único |
| `group.name` | cadena | Nombre del grupo |
| `group.description` | cadena | Descripción del grupo |
| `group.status` | cadena | Estado del grupo |
| `group.userCount` | entero | Número de usuarios en el grupo |
| `group.users` | matriz | Matriz de objetos de usuario en el grupo |
| `group.users[].id` | cadena | ID de usuario |
| `group.users[].name` | cadena | Nombre de usuario |
| `group.users[].email` | cadena | Correo electrónico del usuario |
| `group.createdAt` | cadena | Marca de tiempo de creación |

## Ejemplo de uso

### JavaScript

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

### Pitón

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
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
    "message": "Group name is required",
    "details": {
      "field": "name",
      "value": null
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
    "message": "Admin privileges required"
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

- **Organización de usuarios**: cree grupos para organizar a los usuarios por departamento o función
- **Control de acceso**: Establece grupos para gestionar permisos y accesos
- **Gestión de equipos**: crea grupos para diferentes equipos o proyectos
- **Informes**: organiza a los usuarios para generar informes y análisis
- **Integración**: cree grupos para la integración de sistemas de terceros

## Límites de tarifas

- **Predeterminado**: 50 solicitudes por minuto
- **Diario**: 5000 solicitudes por día
- **Mensual**: 150.000 solicitudes por mes

## Notas

- Solo los administradores pueden acceder a este endpoint.
- Campos obligatorios: tanto el nombre como la descripción son obligatorios
- Asignación de usuarios: puede asignar usuarios al grupo durante la creación
- Estado: El valor predeterminado es "Activo" si no se especifica
- Validación: las identificaciones de usuario se validan antes de la asignación.
- Respuesta plana: la respuesta no está anidada en el objeto de datos
- El grupo está disponible inmediatamente para su uso después de su creación.