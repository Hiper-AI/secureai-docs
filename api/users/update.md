---
id: update
title: "Actualizar Usuario"
sidebar_label: "Actualizar Usuario"
description: "Actualizar una cuenta de usuario existente"
openapi: "PUT /users/{userId}"
---

# Actualizar usuario

Actualice una cuenta de usuario existente con nueva información.

## Endpoint

```
PUT /users/{userId}
```

## Descripción

Este endpoint permite a los administradores actualizar una cuenta de usuario existente. Puede modificar los detalles del usuario, como el nombre, el correo electrónico, la función, el nivel de licencia y otras configuraciones de la cuenta.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `userId` | cadena | Sí | El identificador único del usuario a actualizar |

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | No | Nombre completo del usuario |
| `username` | cadena | No | Nombre de usuario único para el usuario |
| `email` | cadena | No | Dirección de correo electrónico del usuario |
| `password` | cadena | No | Nueva contraseña para la cuenta de usuario |
| `role` | cadena | No | Rol de usuario (administrador, usuario, globalReader) |
| `license` | cadena | No | Nivel de licencia (Esencial, Crecimiento, Ultra, Acceso temprano) |
| `status` | entero | No | Estado de la cuenta (0=inactivo, 1=activo) |
| `roleId` | cadena | No | ID de rol personalizado (MongoDB ObjectId) |
| `setupCompleted` | booleano | No | Si se completó la configuración del usuario |
| `isVerified` | booleano | No | Si el usuario está verificado |

## Solicitud de ejemplo

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `message` | cadena | Mensaje de éxito |
| `user` | objeto | Objeto de usuario actualizado |
| `user.id` | cadena | Identificador único de usuario |
| `user.name` | cadena | Nombre completo del usuario |
| `user.username` | cadena | Nombre de usuario del usuario |
| `user.email` | cadena | Dirección de correo electrónico del usuario |
| `user.role` | cadena | Rol del usuario en el sistema |
| `user.license` | cadena | Nivel de licencia de usuario |
| `user.status` | entero | Estado de la cuenta del usuario (0=inactivo, 1=activo) |
| `user.isVerified` | booleano | Si el usuario está verificado |
| `user.setupCompleted` | booleano | Si se completó la configuración del usuario |
| `user.authType` | cadena | Tipo de autenticación |
| `user.customRole` | objeto | Información de función personalizada (si está asignada) |
| `user.createdAt` | cadena | Marca de tiempo de creación de cuenta |
| `user.updatedAt` | cadena | Marca de tiempo de la última actualización |
| `user.lastActive` | cadena | Marca de tiempo de la última actividad del usuario |

## Ejemplo de uso

### JavaScript

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

### Pitón

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

### rizo

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 no encontrado

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 Conflicto

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## Validaciones y reglas de negocio

- **Valor de licencia**: Debe estar en licencias permitidas (`Essential`, `Growth`, `Ultra`, `Early Access`). Los valores no válidos devuelven 400.
- **Capacidad de licencia**: Aplicada a través de `checkLicenseCapacity`; devuelve 400 cuando el nivel seleccionado está lleno.
- **Guardia de degradación de licencia**: si el cambio a un nivel inferior reduce la cuota de índice personal, el cambio se bloquea cuando el recuento de índice personal actual excede `INDEX_QUOTAS[new_license]`; devuelve 400 con orientación explícita.
- **Normalización del correo electrónico**: minúsculas y recortadas antes de la validación y el almacenamiento.
- **Normalización del nombre de usuario**: minúsculas y recortadas antes de la validación y el almacenamiento.
- **Formato de correo electrónico**: validación de expresiones regulares simple; los correos electrónicos no válidos devuelven 400.
- **Formato de nombre de usuario**: debe coincidir con `^[a-z0-9.-]{3,30}$`; Los nombres de usuario no válidos devuelven 400.
- **Singularidad**: `email`, `username` y `name` deben seguir siendo únicos; Los conflictos regresan 409.

## Normalización y almacenamiento

- `email` y `username` siempre se guardan en minúsculas y recortados.

## Formas de error típicas

### 400 Licencia no válida

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### Licencia 400 no disponible

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### La degradación de la licencia 400 supera la cuota

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 Correo electrónico no válido

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 Nombre de usuario no válido

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 Conflicto (singularidad)

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## Roles de usuario

| Rol | Descripción | Permisos |
|------|-------------|-------------|
| `admin` | Administrador | Acceso completo al sistema |
| `user` | Usuario habitual | Acceso de usuario estándar |
| `globalReader` | Lector global | Acceso al panel de administración de solo lectura |

## Niveles de licencia

| Nivel | Descripción | Características |
|------|-------------|----------|
| `Essential` | Nivel básico | Funciones limitadas |
| `Growth` | Nivel profesional | Funciones mejoradas |
| `Ultra` | Nivel premium | Funciones completas |
| `Early Access` | Nivel de acceso temprano | Funciones beta |

## Estado de la cuenta

| Estado | Descripción |
|--------|-------------|
| `0` | Cuenta inactiva |
| `1` | Cuenta activa |

## Casos de uso

- **Gestión de roles**: actualización de roles de usuario para control de acceso
- **Actualizaciones de licencia**: cambio de niveles de licencia de usuario
- **Mantenimiento de cuenta**: actualización de información y metadatos del usuario
- **Gestión de estado**: Activar o suspender cuentas de usuario
- **Actualizaciones de perfil**: modificación de nombres de usuario, correos electrónicos u otros detalles

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Sólo los administradores pueden actualizar las cuentas de usuario.
- Las direcciones de correo electrónico deben ser únicas para todos los usuarios.
- Las actualizaciones de contraseña son opcionales y solo se aplicarán si se proporcionan
- Las actualizaciones de metadatos se fusionan con los metadatos existentes.
- La marca de tiempo `updatedAt` se actualiza automáticamente en operaciones exitosas