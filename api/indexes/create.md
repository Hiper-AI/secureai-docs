---
id: create
title: "Crear Índice RAG"
sidebar_label: "Crear Índice"
description: "Crear un nuevo índice de base de conocimientos"
openapi: "POST /indexes/all"
---

# Crear índice

Cree un nuevo índice de base de conocimientos para almacenar y recuperar documentos.

## Endpoint

```
POST /indexes
```

## Descripción

Este endpoint permite a los administradores crear un nuevo índice de base de conocimientos. El índice se puede asignar a usuarios o grupos específicos. Sólo los administradores pueden crear índices.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | Sí | Nombre del índice |
| `assignedUser` | cadena | No | ID de usuario al que asignar el índice (MongoDB ObjectId) |
| `assignedGroup` | cadena | No | ID de grupo al que asignar el índice (MongoDB ObjectId) |
| `sharedIndexName` | cadena | No | Nombre de índice compartido (el nombre predeterminado es nombre) |
| `namespace` | cadena | No | Espacio de nombres para el índice (generado automáticamente si no se proporciona) |
| `region` | cadena | No | Sugerencia de región para almacenamiento (opcional) |
| `cloud` | cadena | No | Sugerencia de proveedor de nube (opcional) |


## Solicitud de ejemplo

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## Respuesta exitosa

**Código de estado**: `201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `message` | cadena | Mensaje de éxito |
| `index` | objeto | Objeto de índice creado |
| `index.id` | cadena | Identificador de índice único |
| `index.name` | cadena | Nombre del índice |
| `index.sharedIndexName` | cadena | Nombre del índice compartido |
| `index.namespace` | cadena | Espacio de nombres de índice |
| `index.type` | cadena | Tipo de índice (personal, general, grupal, desconocido) |
| `index.assignedUser` | objeto | Información de usuario asignada (si es personal) |
| `index.assignedGroup` | objeto | Información del grupo asignado (si es grupo) |
| `index.createdAt` | cadena | Marca de tiempo de creación |

## Ejemplo de uso

### JavaScript

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

### Pitón

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## Validaciones y reglas de negocio

- **Normalización del nombre del índice** (para comprobaciones de almacenamiento y unicidad):
  - Minúsculas, recortar espacios en blanco
  - Reemplazar espacios con guiones
  - Elimina cualquier carácter que no esté en `[a-z0-9-]`
- **Validación del nombre del índice**: debe coincidir con `^[a-z0-9-]{3,50}$`; de lo contrario devuelve 400.
- **Singularidad**: el `name` normalizado debe ser único; los duplicados devuelven 409.
- **Cuota de usuario asignada**: si se proporciona `assignedUser`, aplique la cuota de índice de usuario a través de `checkUserIndexQuota`; la cuota excedida devuelve 403.
- **Restricción de región (Esencial)**: Para la licencia `Essential`, los índices solo se pueden crear con `cloud=aws` y `region=us-east-1`; de lo contrario 403.
- **Grupo asignado**: Cuando se proporciona `assignedGroup`, el grupo debe existir y no estar archivado (`status != 'Archived'`); en caso contrario 400.

## Normalización y almacenamiento

- `name` se almacena normalizado.
- `sharedIndexName` por defecto es el `name` normalizado.
- `namespace` por defecto es `user-{userId}-index-{normalizedName}` cuando se asigna a un usuario.

## Formas de error típicas

### 400 Nombre de índice no válido

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### Cuota de índice 403 excedida

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 Región no permitida

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
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
    "message": "Cannot create general indexes without admin privileges"
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

## Tipos de índice

| Tipo | Descripción | Permisos requeridos |
|------|-------------|---------------------|
| `personal` | Índice personal para uso individual | Privilegios de administrador |
| `general` | Índice organizacional compartido | Privilegios de administrador |
| `group` | Índice asignado por grupo | Privilegios de administrador |

## Campos obligatorios

| Campo | Descripción | Ejemplo |
|-------|-------------|----------|
| `name` | Nombre del índice | "mi-base-de-conocimientos" |
| `region` | Región de AWS | "nosotros-este-1" |
| `cloud` | Proveedor de nube | "ay" |

## Casos de uso

- **Asignación de usuarios**: cree índices y asígnelos a usuarios específicos
- **Asignación de grupo**: cree índices y asígnelos a grupos
- **Bases de conocimiento**: cree bases de conocimiento especializadas para dominios específicos
- **Organización de contenido**: organiza el contenido por tema o categoría
- **Almacenamiento vectorial**: cree índices para almacenar y recuperar incrustaciones de vectores

## Límites de tarifas

- **Predeterminado**: 50 solicitudes por minuto
- **Diario**: 5000 solicitudes por día
- **Mensual**: 150.000 solicitudes por mes

## Notas

- Solo los administradores pueden acceder a este endpoint.
- Campos obligatorios: nombre, región y nube son todos obligatorios
- Asignación: el índice se puede asignar a un usuario (assignedUser) o a un grupo (assignedGroup)
- Generación automática: el espacio de nombres se genera automáticamente si no se proporciona
- Nombres únicos: los nombres de los índices deben ser únicos en todo el sistema.
- El índice está disponible inmediatamente para su uso después de su creación.
- Dimensión: la dimensión vectorial es gestionada internamente por la aplicación (actualmente 4096)
- Métrica: la aplicación gestiona internamente la métrica de similitud.