---
sidebar_position: 2
title: "Crear Usuario"
openapi: "POST /users"
sidebar_label: "Crear Usuario"
---

# Crear nuevo usuario

Crea una nueva cuenta de usuario. Solo accesible para administradores.

## Endpoint

```
POST /users
```

## Descripción

Este endpoint permite a los administradores crear nuevas cuentas de usuario en el sistema. Puede especificar varios atributos de usuario, incluidos rol, licencia y tipo de autenticación. Este es un endpoint administrativo que requiere permisos adecuados.

## Flujo de creación de usuarios

**Autentificación básica** (`authType: "basic"`): el usuario recibe un correo electrónico de bienvenida con un enlace de configuración de contraseña. La cuenta se crea sin verificar hasta que se establece la contraseña.

**SSO empresarial** (`authType: "enterprise"`): el usuario se crea verificado y puede iniciar sesión a través de SSO empresarial (Auth0, Microsoft AD, etc.). No se requiere configuración de contraseña.

## Autenticación

Requerido. Incluya su clave API en el encabezado de Autorización.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitud

### Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Predeterminado | Descripción |
|-----------|------|----------|---------|-------------|
| `name` | cadena | Sí | - | Nombre completo del usuario |
| `username` | cadena | No | - | Nombre de usuario único (generado automáticamente desde el correo electrónico si no se proporciona) |
| `email` | cadena | Sí | - | Dirección de correo electrónico del usuario |
| `role` | cadena | No | usuario | Rol del usuario (admin, usuario, globalReader) |
| `license` | cadena | No | Esencial | Nivel de licencia de usuario (Essential, Growth, Ultra, Early Access) |
| `roleId` | cadena | No | - | ID de rol personalizado (MongoDB ObjectId) |
| `setupCompleted` | booleano | No | falso | Si se completó la configuración del usuario |
| `authType` | cadena | No | básico | Tipo de autenticación (básica, empresarial) |

### Solicitud de ejemplo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## Respuesta

### Respuesta exitosa (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre `true` para solicitudes exitosas |
| `message` | cadena | Mensaje de éxito |
| `user` | objeto | Objeto de usuario creado |
| `user.id` | cadena | Identificador único del usuario |
| `user.name` | cadena | Nombre completo del usuario |
| `user.username` | cadena | Nombre de usuario del usuario |
| `user.email` | cadena | Dirección de correo electrónico del usuario |
| `user.role` | cadena | Rol del usuario |
| `user.license` | cadena | Nivel de licencia de usuario |
| `user.status` | entero | Estado del usuario (1=activo) |
| `user.isVerified` | booleano | Si el usuario está verificado |
| `user.setupCompleted` | booleano | Si se completó la configuración del usuario |
| `user.authType` | cadena | Tipo de autenticación |
| `user.createdAt` | cadena | Marca de tiempo de creación de usuario |

## Ejemplo de uso

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

### Pitón

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 Tipo de autenticación no válido

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 campos obligatorios faltantes

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
}
```

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

### 409 Conflicto

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## Validaciones y reglas de negocio

- **Valor de la licencia**: Debe ser una de las licencias permitidas (`Essential`, `Growth`, `Ultra`, `Early Access`). Los valores no válidos devuelven 400.
- **Capacidad de licencia**: Aplicada a través de `checkLicenseCapacity`. Si la capacidad está llena para el nivel seleccionado, devuelve 400.
- **Normalización del correo electrónico**: minúsculas y recortadas antes de la validación y el almacenamiento.
- **Normalización del nombre de usuario**: minúsculas y recortadas antes de la validación y el almacenamiento. Generado automáticamente desde el correo electrónico si no se proporciona.
- **Formato de correo electrónico**: validado con una expresión regular simple; los correos electrónicos no válidos devuelven 400.
- **Formato de nombre de usuario**: debe coincidir con `^[a-z0-9.-]{3,30}$`; Los nombres de usuario no válidos devuelven 400.
- **Singularidad**: `email`, `username` y `name` deben ser únicos. Los conflictos regresan 409.
- **Comportamiento de invitación por correo electrónico**: para la autenticación básica, los usuarios reciben correos electrónicos de bienvenida con enlaces de configuración de contraseña.

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## Roles de usuario

| Rol | Descripción | Permisos |
|------|-------------|-------------|
| `admin` | Administrador | Acceso completo al sistema |
| `user` | Usuario habitual | Acceso de usuario estándar |
| `globalReader` | Lector global | Acceso al panel de administración de solo lectura |

## Niveles de licencia

| Licencia | Descripción | Características |
|---------|-------------|----------|
| `Essential` | Nivel básico | Funciones limitadas |
| `Growth` | Nivel profesional | Funciones mejoradas |
| `Ultra` | Nivel premium | Funciones completas |
| `Early Access` | Nivel de acceso temprano | Funciones beta |

## Tipos de autenticación

| Tipo | Descripción |
|------|-------------|
| `basic` | Autenticación de nombre de usuario/contraseña (el usuario recibe un correo electrónico de configuración de contraseña) |
| `enterprise` | Integración SSO empresarial (Auth0, Microsoft AD, etc.) |

## Casos de uso

- **Incorporación de usuarios**: cree nuevas cuentas de usuario para los miembros del equipo
- **Incorporación sin contraseña**: cree usuarios que reciban invitaciones por correo electrónico para establecer sus propias contraseñas.
- **Integración SSO**: cree usuarios que se autentiquen a través de proveedores de identidad externos
- **Creación masiva de usuarios**: crea múltiples usuarios mediante programación
- **Integración**: Crear usuarios desde sistemas externos
- **Tareas administrativas**: administrar cuentas de usuario a través de API

## Límites de tarifas

Este endpoint sigue los límites de velocidad estándar:
- 60 solicitudes por minuto
- 1000 solicitudes por hora