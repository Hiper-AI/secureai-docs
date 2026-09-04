---
sidebar_position: 1
title: "Modelos Disponibles en la API"
openapi: "GET /models"
sidebar_label: "Modelos Disponibles"
---

# Obtener modelos disponibles

Recupere los modelos de IA disponibles según los permisos de su clave API y su licencia de usuario.

## Endpoint

```
GET /models
```

## Descripción

Recupere los modelos de IA disponibles según los permisos de su clave API y su licencia de usuario.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parámetros

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|----------|-------------|---------|
| `provider` | cadena | No | Filtrar modelos por proveedor | `"openai"` |

## Solicitud

### Solicitud básica

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por proveedor

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "models": [
    {
      "id": "openai/gpt-5-nano",
      "name": "openai/gpt-5-nano",
      "provider": "openai"
    },
    {
      "id": "anthropic/claude-sonnet-4.6",
      "name": "anthropic/claude-sonnet-4.6",
      "provider": "anthropic"
    }
  ],
  "user_license": "Pro",
  "restrictions": {
    "allowed_models": "all"
  },
  "filters": {
    "provider": "openai"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas | `true` |
| `models` | matriz | Lista de modelos disponibles | Ver ejemplo |
| `user_license` | cadena | Nivel de licencia de usuario | `"Pro"` |
| `restrictions` | objeto | Restricciones de acceso al modelo | Ver ejemplo |
| `filters` | objeto | Filtros aplicados | Ver ejemplo |

### Objeto modelo

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | cadena | Identificador de modelo único | `"openai/gpt-5-nano"` |
| `name` | cadena | Nombre para mostrar del modelo | `"openai/gpt-5-nano"` |
| `provider` | cadena | Proveedor de modelos | `"openai"` |

### Objeto de restricciones

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `allowed_models` | cadena | Nivel de acceso al modelo | `"all"` |

### Objeto de filtros

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `provider` | cadena | Filtro de proveedor aplicado | `"openai"` |

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 Límite de tasa excedido

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Ejemplo de uso

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/models', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Models:', data.models);
console.log('User License:', data.user_license);
```

### Pitón

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', headers=headers)
data = response.json()

print('Available Models:', data['models'])
print('User License:', data['user_license'])
```

### Filtrar por proveedor

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'provider': 'openai'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', 
                      headers=headers, params=params)
data = response.json()

print('OpenAI Models:', data['models'])
```

### rizo

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Depósitos de LLM (actuales)

El sistema de chat clasifica los modelos en dos grupos de ejecución:

- cubo `standard`
- cubo `premium`

Esta referencia se basa en la asignación de depósitos de backend activos.

### Cucharón estándar

- `openai/gpt-oss-120b`
- `openai/gpt-5-nano`
- `google/gemini-3.1-flash-lite-preview`
- `google/gemini-3-flash-preview`
- `deepseek/deepseek-r1-distill-llama-70b`
- `deepseek/deepseek-r1`
- `deepseek/deepseek-v3.2`
- `meta-llama/llama-3.3-70b-instruct`
- `meta-llama/llama-4-maverick`
- `meta-llama/llama-4-scout`
- `mistralai/mistral-7b-instruct`
- `mistralai/mistral-nemo`
- `mistralai/ministral-14b-2512`
- `mistralai/mistral-large-2512`
- `x-ai/grok-3-mini`
- `qwen/qwen3-235b-a22b-2507`
- `qwen/qwen3-coder`
- `qwen/qwen3-coder-next`
- `qwen/qwen3.5-397b-a17b`

### Cubo premium

- `anthropic/claude-3.7-sonnet`
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-opus-4.6`
- `openai/o4-mini-high`
- `openai/o4-mini`
- `openai/gpt-5.2`
- `openai/gpt-5.3-codex`
- `openai/gpt-5.1`
- `google/gemini-3.1-pro-preview`
- `x-ai/grok-4`

## Proveedores disponibles

- **AI abierta**
- **Antrópico**
- **Google**
- **Meta**
- **Mistral**
- **búsqueda profunda**
- **xAI**
- **Qwen**

## Notas

- Los modelos disponibles dependen de su nivel de suscripción
- Algunos modelos pueden estar restringidos según su licencia
- Utilice el filtro de proveedores para obtener modelos de proveedores específicos
- La respuesta incluye su nivel de licencia actual y sus restricciones. 
- Las restricciones de clave API (`allowedModels`) pueden reducir aún más la lista de modelos