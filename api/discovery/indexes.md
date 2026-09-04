---
sidebar_position: 2
title: "Bases de Conocimiento Disponibles"
openapi: "GET /indexes"
sidebar_label: "Bases Disponibles"
---

# Obtenga bases de conocimientos disponibles

Recupere las bases de conocimiento (índices) disponibles a las que puede acceder su clave API.

## Endpoint

```
GET /indexes
```

## Descripción

Recupere las bases de conocimiento (índices) disponibles a las que puede acceder su clave API. Incluye índices personales, índices compartidos y la opción de conocimiento cero.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas | `true` |
| `indexes` | matriz | Lista de bases de conocimiento disponibles | Ver ejemplo |
| `restrictions` | objeto | Restricciones de acceso al índice | Ver ejemplo |

### Objeto de índice

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | cadena | Identificador de índice único | `"my-knowledge-base"` |
| `name` | cadena | Nombre para mostrar del índice | `"my-knowledge-base"` |
| `type` | cadena | Tipo de índice | `"personal"` |
| `namespace` | cadena | Espacio de nombres de índice (opcional) | `"user-namespace"` |
| `description` | cadena | Descripción del índice (opcional) | `"Direct AI responses..."` |

### Tipos de índice

| Tipo | Descripción |
|------|-------------|
| `system` | Índices proporcionados por el sistema (por ejemplo, conocimiento cero) |
| `personal` | Bases de conocimientos personales del usuario |
| `general` | Bases de conocimiento compartidas |

### Objeto de restricciones

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `allowed_indexes` | cadena | Descripción de índices permitidos | `"all user indexes"` |

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Ejemplo de uso

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

### Pitón

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Índices especiales

### Conocimiento cero

El índice `Zero-Knowledge` es un índice de sistema especial que proporciona respuestas directas de IA sin recuperación de la base de conocimientos. Usa esto cuando quieras:

- Respuestas de IA pura sin RAG
- Prueba de las capacidades del modelo de IA
- Conversación general sin contexto específico.

## Notas

- El índice de Conocimiento Cero siempre está disponible
- Los índices personales son creados por el usuario.
- El acceso a los índices depende de sus permisos.
- Utilice el ID de índice en las solicitudes de finalización del chat.