---
sidebar_position: 1
title: "Listar Usuarios"
openapi: "GET /users"
sidebar_label: "Listar Usuarios"
---

# Obtener todos los usuarios

Recupera todos los usuarios con paginación y filtrado. Solo accesible para administradores.

## Endpoint

```
GET /users
```

## Descripción

Este endpoint permite a los administradores recuperar una lista paginada de todos los usuarios del sistema. Admite el filtrado según varios criterios, incluidos función, licencia, estado y términos de búsqueda. Este es un endpoint administrativo que requiere permisos adecuados.

## Autenticación

Requerido. Incluya su clave API en el encabezado de Autorización.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitud

### Parámetros de consulta

| Parámetro | Tipo | Requerido | Predeterminado | Descripción |
|-----------|------|----------|---------|-------------|
| `page` | entero | No | 1 | Número de página para paginación |
| `limit` | entero | No | 20 | Número de usuarios por página (1-100) |
| `search` | cadena | No | - | Término de búsqueda para nombre, correo electrónico o nombre de usuario |
| `role` | cadena | No | - | Filtrar por rol de usuario (admin, usuario, globalReader) |
| `license` | cadena | No | - | Filtrar por licencia de usuario (Essential, Growth, Ultra, Early Access) |
| `status` | entero | No | - | Filtrar por estado de usuario (0=inactivo, 1=activo) |
| `sortBy` | cadena | No | creadoEn | Campo para ordenar por |
| `sortOrder` | cadena | No | desc | Orden de clasificación (asc, desc) |

### Solicitud de ejemplo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

Con búsqueda:

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre `true` para solicitudes exitosas |
| `users` | matriz | Matriz de objetos de usuario |
| `users[].id` | cadena | Identificador único del usuario |
| `users[].name` | cadena | Nombre completo del usuario |
| `users[].username` | cadena | Nombre de usuario del usuario |
| `users[].email` | cadena | Dirección de correo electrónico del usuario |
| `users[].role` | cadena | Rol del usuario (admin, usuario, globalReader) |
| `users[].license` | cadena | Nivel de licencia de usuario (Essential, Growth, Ultra, Early Access) |
| `users[].status` | entero | Estado del usuario (0=inactivo, 1=activo) |
| `users[].isVerified` | booleano | Si el usuario está verificado |
| `users[].setupCompleted` | booleano | Si se completó la configuración del usuario |
| `users[].authType` | cadena | Tipo de autenticación (básica, auth0) |
| `users[].mfaEnabled` | booleano | Si MFA está habilitado |
| `users[].customRole` | objeto | Información de función personalizada (si está asignada) |
| `users[].customRole.id` | cadena | ID de rol personalizado |
| `users[].customRole.name` | cadena | Nombre de rol personalizado |
| `users[].customRole.displayName` | cadena | Nombre para mostrar del rol personalizado |
| `users[].createdAt` | cadena | Marca de tiempo de creación de usuario |
| `users[].updatedAt` | cadena | Marca de tiempo de la última actualización del usuario |
| `users[].lastActive` | cadena | Marca de tiempo de la última actividad del usuario |
| `pagination` | objeto | Información de paginación |
| `pagination.page` | entero | Número de página actual |
| `pagination.limit` | entero | Artículos por página |
| `pagination.total` | entero | Número total de usuarios |
| `pagination.pages` | entero | Número total de páginas |

## Ejemplo de uso

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

### Pitón

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Prohibido

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## Ejemplos de filtrado

### Buscar por nombre o correo electrónico

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por rol

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por licencia

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por estado

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Ordenar por último activo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Casos de uso

- **Administración de usuarios**: vea y administre todos los usuarios en el sistema
- **Análisis de usuarios**: analiza la distribución de usuarios por función, licencia o estado
- **Buscar y filtrar**: encuentre usuarios específicos según varios criterios
- **Tareas administrativas**: soporte de operaciones administrativas y generación de informes.

## Descripciones de roles

- **admin**: acceso completo al sistema con control administrativo
- **usuario**: acceso estándar a funciones de chat y bases de conocimiento personales  
- **globalReader**: acceso de solo lectura al panel de administración con permisos de visualización

## Descripciones de licencia

- **Esencial**: nivel básico con 29.000 puntos/mes
- **Crecimiento**: nivel medio con funciones mejoradas
- **Ultra**: nivel premium con características máximas
- **Acceso anticipado**: nivel Beta con capacidades experimentales

## Límites de tarifas

Este endpoint sigue los límites de velocidad estándar:
- 60 solicitudes por minuto
- 1000 solicitudes por hora