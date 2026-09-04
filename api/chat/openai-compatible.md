---
sidebar_position: 2
title: "Compatibilidad con OpenAI"
sidebar_label: "Compatible con OpenAI"
description: "Superficie de finalización de chat OpenAI directa: apunte cualquier SDK de OpenAI a SecureAI"
openapi: "POST /v1/chat/completions"
---

# Endpoint compatible con OpenAI

SecureAI expone una superficie compatible con OpenAI para que pueda integrarse con **cualquier SDK de OpenAI cambiando solo la URL base y la clave API**, sin cambios de código. La pila de seguridad completa de SecureAI (autenticación de clave API, listas permitidas de modelo/índice, aplicación de políticas SMLTP + derechos, Prompt Shield, PII/DLP, facturación de puntos y el [motor de redundancia de modelo](/api/redundancia)) se ejecuta debajo.

## Endpoint

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

Apunte el `base_url` de su cliente OpenAI a:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**Solo conocimiento cero**

Esta superficie **no** admite RAG/bases de conocimiento. Las solicitudes están fijadas en `Zero-Knowledge`. Si necesita recuperar la base de conocimientos, utilice el endpoint clásico [Finalización del chat](/api/chat/completions).
</Info>

## Autenticación

```bash
Authorization: Bearer sk-your-api-key-here
```

## Usando un SDK de OpenAI

### Pitón (`openai`)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key-here",
    base_url="https://{customer.name}.hiperai.ai/api/external/v1",
)

resp = client.chat.completions.create(
    model="openai/gpt-5-nano",
    messages=[{"role": "user", "content": "Hello!"}],
    # SecureAI extensions travel via extra_body
    extra_body={
        "smltp_policy": "internal",
        "fallback_models": ["anthropic/claude-sonnet-4"],
    },
)
print(resp.choices[0].message.content)
print(resp.model_extra["secureai"]["served_model"])
```

### JavaScript (`openai`)

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-your-api-key-here',
  baseURL: 'https://{customer.name}.hiperai.ai/api/external/v1',
});

const resp = await client.chat.completions.create({
  model: 'openai/gpt-5-nano',
  messages: [{ role: 'user', content: 'Hello!' }],
  // @ts-expect-error — SecureAI extension fields
  smltp_policy: 'internal',
  fallback_models: ['anthropic/claude-sonnet-4'],
});
console.log(resp.choices[0].message.content);
```

## Cuerpo de solicitud

Se admiten campos estándar de OpenAI. Se requiere `messages` (no hay `prompt` en esta superficie). `max_completion_tokens` se acepta como alias para `max_tokens`.

Los siguientes parámetros de OpenAI se pasan al proveedor tal cual:

`tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `stop`, `top_p`, `frequency_penalty`, `presence_penalty`, `seed`, `logprobs`, `top_logprobs`, `user`.

### Campos de extensión SecureAI

Envíelos como campos de cuerpo adicionales (a través de `extra_body` en los SDK de OpenAI):

| Campo | Descripción |
|-------|-------------|
| `smltp_policy` | Política de seguridad SMLTP para esta llamada. |
| `prompt_shield` | `{ enabled?, policy? }` — anulación del Escudo de aviso por llamada. |
| `models` / `fallback_models` | Modelo de cadena [redundancia](/api/redundancia). |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`. |
| `user_id` | Facturar a un usuario diferente (controlado por el administrador). |

## Respuesta

Forma estándar OpenAI `chat.completion`, más un objeto de extensión `secureai`.

```json
{
  "id": "chatcmpl-1a2b3c...",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "anthropic/claude-sonnet-4",
  "choices": [
    { "index": 0, "message": { "role": "assistant", "content": "Hello!" }, "finish_reason": "stop" }
  ],
  "usage": { "prompt_tokens": 9, "completion_tokens": 3, "total_tokens": 12 },
  "secureai": {
    "served_model": "anthropic/claude-sonnet-4",
    "requested_model": "openai/gpt-5-nano",
    "failover": { "occurred": true, "attempts": [ ... ] },
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "smltp_bundle_id": "bnd_..."
  }
}
```

`secureai.smltp_bundle_id` (cuando esté presente) se puede canjear por un [recibo](/api/recibos) de cumplimiento firmado.

### Transmisión

Establezca `stream: true`. Los marcos son objetos nativos de OpenAI `chat.completion.chunk` terminados en `data: [DONE]`. La extensión `secureai` está adjunta al **primer** fragmento. `choices` (incluidos los deltas de `tool_calls` y `finish_reason`) pasan intactos.

## Errores

Los errores de este controlador utilizan el sobre OpenAI:

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

Cuando falla toda una cadena de redundancia, el error utiliza `code: "all_models_failed"` y el estado `429` (todos los límites de velocidad) o `502` (de lo contrario). Los rechazos de middleware de seguridad mantienen la forma de SecureAI `{ "success": false, ... }`; ambos siempre llevan un `message`.

## Relacionado

- [Finalización del chat](/api/chat/completions): la superficie clásica (agrega RAG).
- [Redundancia y conmutación por error](/api/redundancy)
- [API de protección rápida](/api/threat-defense/prompt-shield)