---
sidebar_position: 2
title: "Compatibilidade com OpenAI"
sidebar_label: "Compatível com OpenAI"
description: "Superfície de conclusão do OpenAI Chat - aponte qualquer SDK OpenAI para SecureAI"
openapi: "POST /v1/chat/completions"
---

# Endpoint compatível com OpenAI

SecureAI expõe uma superfície compatível com OpenAI para que você possa integrar com **qualquer SDK OpenAI alterando apenas o URL base e a chave de API** — sem alterações de código. A pilha de segurança SecureAI completa (autenticação de chave de API, listas de permissões de modelo/índice, aplicação de política SMLTP + direitos, Prompt Shield, PII/DLP, faturamento de pontos e o [mecanismo de redundância de modelo](/pt/api/redundancy)) é executado abaixo.

## Ponto final

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

Aponte o `base_url` do seu cliente OpenAI para:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**Somente Conhecimento Zero**

Esta superfície **não** suporta RAG/bases de conhecimento. As solicitações são fixadas em `Zero-Knowledge`. Se você precisar de recuperação da base de conhecimento, use o endpoint clássico [Chat Completion](/pt/api/chat/completions).
</Info>

## Autenticação

```bash
Authorization: Bearer sk-your-api-key-here
```

## Usando um SDK OpenAI

### Python (`openai`)

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

## Corpo da solicitação

Os campos OpenAI padrão são suportados. `messages` é obrigatório (não há `prompt` nesta superfície). `max_completion_tokens` é aceito como um alias para `max_tokens`.

Os seguintes parâmetros OpenAI são passados para o provedor no estado em que se encontram:

`tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `stop`, `top_p`, `frequency_penalty`, `presence_penalty`, `seed`, `logprobs`, `top_logprobs`, `user`.

### Campos de extensão SecureAI

Envie-os como campos de corpo extras (via `extra_body` nos SDKs OpenAI):

| Campo | Descrição |
|-------|------------|
| `smltp_policy` | Política de segurança SMLTP para esta chamada. |
| `prompt_shield` | `{ enabled?, policy? }` — substituição do Prompt Shield por chamada. |
| `models` / `fallback_models` | Cadeia de modelo [redundância](/pt/api/redundancy). |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`. |
| `user_id` | Faturar para um usuário diferente (controlado pelo administrador). |

## Resposta

Forma OpenAI padrão `chat.completion`, mais um objeto de extensão `secureai`.

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

`secureai.smltp_bundle_id` (quando presente) pode ser trocado por um [recibo] de conformidade assinado(/pt/api/receipts).

### Transmissão

Defina `stream: true`. Os frames são objetos OpenAI nativos `chat.completion.chunk` terminados por `data: [DONE]`. A extensão `secureai` é anexada ao **primeiro** pedaço. `choices` (incluindo `tool_calls` deltas e `finish_reason`) passam intocados.

## Erros

Os erros deste manipulador usam o envelope OpenAI:

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

Quando toda uma cadeia de redundância falha, o erro usa `code: "all_models_failed"` e status `429` (todos os limites de taxa) ou `502` (caso contrário). As rejeições de middleware de segurança mantêm o formato SecureAI `{ "success": false, ... }`; ambos sempre carregam um `message`.

## Relacionado

- [Conclusão de bate-papo](/pt/api/chat/completions) — a superfície clássica (adiciona RAG).
- [Redundância e failover](/pt/api/redundancy)
- [API Prompt Shield](/pt/api/threat-defense/prompt-shield)