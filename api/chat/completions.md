---
sidebar_position: 1
title: "Chat Completions"
openapi: "POST /chat/completions"
sidebar_label: "Chat Completions"
---

# Finalización del chat

El endpoint principal para la finalización de chats de IA con recuperación de base de conocimientos (RAG) opcional, redundancia/conmutación por error de modelos, políticas de seguridad por llamada y transmisión.

## Endpoint

```
POST /chat/completions
```

## Descripción

El endpoint principal para la finalización del chat de IA con recuperación de la base de conocimientos (RAG) opcional. Soporta:

- **Dos formularios de entrada**: una sola cadena `prompt` (heredada) **o** una matriz `messages` de estilo OpenAI.
- **Redundancia de modelo**: una cadena de conmutación por error definida por la persona que llama (primaria + hasta 2 alternativas). Consulte [Redundancia y conmutación por error](/api/redundancy).
- **Seguridad por llamada**: selección de política SMLTP y anulación de Prompt Shield en línea.
- **Transmisión**: eventos enviados por el servidor (SSE).
- **Recibos firmados**: una referencia de recibo de cumplimiento SMLTP en las respuestas enviadas a través de la puerta de enlace.

<Tip>
**Compatibilidad con el SDK de OpenAI**

Si desea incluir SecureAI en una integración de OpenAI existente con **cero cambios de código**, utilice el [endpoint compatible con OpenAI](/api/chat/openai-compatible) en `/api/external/v1/chat/completions` en su lugar. Este endpoint clásico es el único que admite RAG.
</Tip>

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## encabezados

| Encabezado | Requerido | Descripción |
|--------|----------|-------------|
| `Authorization` | Sí | `Bearer sk-...` |
| `Content-Type` | Sí | `application/json` |
| `Idempotency-Key` | No | Una clave única que hace que sea seguro volver a intentar una POST de finalización. Repetir una solicitud con la misma clave devuelve el resultado original en lugar de facturar dos veces. |

## Cuerpo de solicitud

### Parámetros de entrada

Proporcione **ya sea** `prompt` **o** `messages`, no ambos.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `prompt` | cadena | Condicional | Mensaje del usuario (formulario heredado de un solo turno). |
| `messages` | matriz | Condicional | Matriz estilo OpenAI de `{ role, content }`. `role` es `system`, `user` o `assistant`. Como máximo un mensaje `system`, y solo como primera entrada. Máximo 100 mensajes, 256 KB de contenido total. |
| `system_message` | cadena | No | Aviso del sistema personalizado (heredado). No se puede combinar con una función `system` dentro de banda en `messages`. |

### Modelo y parámetros de redundancia

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `model` | cadena | Condicional | Modelo de IA (por ejemplo, `"openai/gpt-5-nano"`). Requerido a menos que se proporcione `models`. |
| `models` | matriz | No | Cadena de conmutación por error explícita (anula `model`). Hasta 3 entradas distintas; cada entrada es una cadena modelo o `{ model, timeout_ms, first_token_timeout_ms }`. |
| `fallback_models` | matriz | No | Respaldos añadidos después de `model`. No se puede combinar con `models`. |
| `redundancy` | objeto | No | Opciones para toda la cadena: `{ timeout_ms, first_token_timeout_ms, on: [...] }`. Consulte [Redundancia y conmutación por error](/api/redundancy). |

### Parámetros de recuperación y generación

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `index` | cadena | **Sí** | Nombre de la base de conocimientos a consultar. Utilice `"Zero-Knowledge"` para IA directa sin RAG. Este campo es obligatorio: una solicitud sin `index` devuelve `400 "Index required"`. |
| `use_rag` | booleano | No | Habilitar la recuperación de conocimientos (predeterminado: `true`). Configurar `use_rag: false` **no** renuncia al requisito de `index`: envíe `index: "Zero-Knowledge"`. |
| `smltp_policy` | cadena | No | Política de seguridad (`"internal"`, `"public"`, `"confidential"` o una política personalizada de inquilino). |
| `prompt_shield` | objeto | No | Control de protección de aviso por llamada: `{ enabled?: boolean, policy?: string }`. Consulte [API Prompt Shield](/api/threat-defense/prompt-shield#per-call-control-on-completions). |
| `temperature` | número | No | Control de aleatoriedad (0–2, predeterminado: 0,7). |
| `max_tokens` | entero | No | Tokens de respuesta máximos (predeterminado: 1000, con un límite de 4000). |
| `stream` | booleano | No | Transmita la respuesta como SSE (predeterminado: `false`). |
| `conversation_id` | cadena | No | ID de conversación opcional para seguimiento. |
| `user_id` | cadena | No | MongoDB ObjectId del usuario al que facturar esta solicitud (accesible al administrador; consulte [Modos de facturación](/api/billing-modes)). |

## Ejemplo de solicitud

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-4821-summary" \
  -d '{
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "What is the company policy on remote work?" }
    ],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "redundancy": { "timeout_ms": 30000, "on": ["timeout", "server_error", "rate_limit"] },
    "index": "Zero-Knowledge",
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "id": "req-abc123",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the company's remote work policy..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350,
    "input_tokens": 150,
    "output_tokens": 200
  },
  "metadata": {
    "conversation_id": "conv-123",
    "index_used": "Zero-Knowledge",
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "served_model": "openai/gpt-5-nano",
    "requested_model": "openai/gpt-5-nano",
    "rag_enabled": true,
    "documents_retrieved": 0,
    "sources": []
  }
}
```

### Objeto de metadatos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `conversation_id` | cadena | ID de conversación (repetida o generada). |
| `index_used` | cadena | Base de conocimientos utilizada. |
| `smltp_policy_used` | cadena | Nombre de la política SMLTP aplicada. |
| `smltp_policy_source` | cadena | De dónde vino la política (`request`, clave predeterminada, etc.). |
| `smltp_policy_hash` | cadena \| nulo | Hash de la política aplicada para verificación. |
| `prompt_shield_policy` | objeto \| nulo | La política de Prompt Shield se aplicó a esta llamada, si corresponde. |
| `served_model` | cadena | Modelo que realmente produjo la respuesta. |
| `requested_model` | cadena | Primer modelo de la cadena solicitada. |
| `failover` | objeto | **Presente solo cuando se ejecutó una cadena multimodelo.** `{ occurred, attempts[] }` — consulte [Redundancia y conmutación por error](/api/redundancy). |
| `smltp` | objeto | Presente cuando se genera un derecho SMLTP para la llamada. `{ bundle_id, receipt_url }`. El `bundle_id` (una identificación de derecho, por ejemplo, `jti-…`) se devuelve incluso en implementaciones nativas/directas; el recibo firmado en `receipt_url` solo se puede recuperar cuando el tráfico se enruta a través de la puerta de enlace SMLTP (de lo contrario, [Receipts](/api/receipts) devuelve `404`). |
| `rag_enabled` | booleano | Si se utilizó RAG. |
| `documents_retrieved` | entero | Número de documentos recuperados. |
| `sources` | matriz | Hasta 3 fuentes de documentos recuperados `{ source, score }`. |

## Transmisión

Configure `"stream": true` para recibir eventos enviados por el servidor. Cada línea SSE es `data: <json>` y la transmisión termina en `data: [DONE]`. Los fotogramas se escriben mediante un campo `type`:

| Marco `type` | Carga útil |
|--------------|---------|
| `metadata` | El sobre de respuesta (`id`, `object`, `created`, `model` = modelo de publicación y el objeto `metadata` anterior). Enviado primero. |
| `chunk` | Un delta incremental: `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`. |
| `usage` | Uso final del token. |
| `error` | Una interrupción del proveedor a mitad de camino (después del primer token, la conmutación por error ya no es posible). |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
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
  "message": "Model, index, or policy not allowed"
}
```

### 429/502 — Cadena de redundancia agotada

Cuando todos los modelos de una cadena de redundancia fallan, la respuesta informa de cada intento. El estado es `429` si todas las fallas fueron límites de velocidad, en caso contrario `502`.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 2 model attempt(s) failed (last: anthropic/claude-sonnet-4 — server_error)",
  "request_id": "req-abc123",
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30012 },
    { "model": "anthropic/claude-sonnet-4", "status": "failed", "reason": "server_error", "latency_ms": 812 }
  ]
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Ejemplo de uso

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is the company policy on remote work?' }],
    model: 'openai/gpt-5-nano',
    fallback_models: ['anthropic/claude-sonnet-4'],
    smltp_policy: 'internal',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log('Served by:', data.metadata.served_model);
console.log('Response:', data.choices[0].message.content);
```

### Pitón

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "messages": [{"role": "user", "content": "What is the company policy on remote work?"}],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("Served by:", result["metadata"]["served_model"])
print("Response:", result["choices"][0]["message"]["content"])
```

## Notas

- Se requiere `index`. Envíe `index: "Zero-Knowledge"` para obtener respuestas directas de IA sin RAG.
- El parámetro `user_id` factura la solicitud a una cuenta de usuario diferente (con control de administrador).
- La temperatura se fija entre 0 y 2; `max_tokens` tiene un límite de 4000.
- Para validar una solicitud con respecto a cada política **sin** llamar a un modelo o gastar puntos, use [Policy Check](/api/policy-check).
- Para conocer la semántica de la cadena de conmutación por error (activadores, tiempos de espera, comportamiento de transmisión, códigos de estado de agotamiento), consulte [Redundancia y conmutación por error](/api/redundancy).