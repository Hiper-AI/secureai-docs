---
id: create
title: "Crear Rol"
sidebar_label: "Crear Rol"
description: "Crear un nuevo rol de usuario"
openapi: "POST /roles"
---

# Crear rol

Cree una nueva función de usuario personalizada con permisos específicos.

## Endpoint

```
POST /roles
```

## Descripción

Este endpoint permite a los administradores crear nuevos roles de usuario personalizados. Los roles personalizados pueden tener permisos específicos adaptados a las necesidades de su organización. Puede especificar el nombre del rol, la descripción y los permisos durante la creación.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | Sí | Nombre del rol (identificador del sistema) |
| `displayName` | cadena | Sí | Nombre de rol legible por humanos |
| `description` | cadena | Sí | Descripción del propósito del rol |
| `hasAdminPanelAccess` | booleano | No | Si el rol tiene acceso al panel de administración (predeterminado: falso) |
| `permissions` | matriz | No | Matriz de objetos de permiso |
| `canInteractWithAI` | booleano | No | Si el rol puede interactuar con la IA (predeterminado: verdadero) |
| `canUseChat` | booleano | No | Si el rol puede usar el chat (predeterminado: verdadero) |

## Solicitud de ejemplo

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## Respuesta exitosa

**Código de estado**: `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `message` | cadena | Mensaje de éxito |
| `role` | objeto | Objeto de rol creado |
| `role.id` | cadena | Identificador de rol único |
| `role.name` | cadena | Nombre del rol |
| `role.displayName` | cadena | Nombre para mostrar del rol |
| `role.description` | cadena | Descripción del rol |
| `role.isSystem` | booleano | Si se trata de una función del sistema |
| `role.hasAdminPanelAccess` | booleano | Si el rol tiene acceso al panel de administración |
| `role.permissions` | matriz | Matriz de objetos de permiso |
| `role.permissions[].section` | cadena | Sección de permisos |
| `role.permissions[].level` | cadena | Nivel de permiso |
| `role.canInteractWithAI` | booleano | Si el rol puede interactuar con la IA |
| `role.canUseChat` | booleano | Si el rol puede usar el chat |
| `role.userCount` | entero | Número de usuarios con este rol |
| `role.createdBy` | objeto | Usuario que creó el rol |
| `role.createdBy.id` | cadena | ID de usuario del creador |
| `role.createdBy.name` | cadena | Nombre del creador |
| `role.createdBy.email` | cadena | Correo electrónico del creador |
| `role.createdAt` | cadena | Marca de tiempo de creación |

## Ejemplo de uso

### JavaScript

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

### Pitón

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
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
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## Secciones de permisos disponibles

| Sección | Descripción |
|---------|-------------|
| `home` | Acceso al panel de inicio |
| `user-management` | Operaciones de gestión de usuarios |
| `index-management` | Operaciones de gestión de índices |
| `analytics` | Análisis e informes |
| `group-management` | Operaciones de gestión de grupos |
| `integrations` | Gestión de la integración |
| `services-status` | Monitoreo del estado de los servicios |
| `settings` | Configuración del sistema |
| `announcements` | Gestión de anuncios |
| `smltp-security` | Funciones de seguridad SMLTP |

## Niveles de permiso disponibles

| Nivel | Descripción |
|-------|-------------|
| `none` | Sin acceso a la sección |
| `reader` | Acceso de sólo lectura a la sección |
| `admin` | Acceso administrativo completo a la sección |

## Casos de uso

- **Roles personalizados**: cree roles adaptados a las necesidades de su organización
- **Control de acceso**: define permisos específicos para diferentes tipos de usuarios
- **Seguridad**: implementar principios de acceso con privilegios mínimos
- **Cumplimiento**: cree roles que cumplan con los requisitos reglamentarios
- **Integración**: definir roles para la integración de sistemas de terceros

## Límites de tarifas

- **Predeterminado**: 50 solicitudes por minuto
- **Diario**: 5000 solicitudes por día
- **Mensual**: 150.000 solicitudes por mes

## Notas

- **Solo administrador**: este endpoint requiere privilegios de administrador
- **Campos obligatorios**: el nombre, el nombre para mostrar y la descripción son obligatorios
- **Estructura de permisos**: Los permisos son objetos con propiedades de sección y nivel.
- **Roles del sistema**: los roles personalizados nunca son roles del sistema
- **Respuesta plana**: la respuesta no está anidada en el objeto de datos
- **Información del creador**: muestra quién creó el rol.
- **Recuento de usuarios**: comienza en 0 para nuevos roles
- Los nombres de los roles deben ser únicos dentro del sistema.
- El rol está disponible inmediatamente para la asignación de usuarios.