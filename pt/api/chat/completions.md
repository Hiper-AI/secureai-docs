---
sidebar_position: 1
title: "Chat Completions"
openapi: "POST /chat/completions"
sidebar_label: "Chat Completions"
---

# Conclusão do bate-papo

O principal endpoint para conclusões de chat de IA com recuperação opcional da base de conhecimento (RAG), redundância/failover de modelo, políticas de segurança por chamada e streaming.

## Ponto final

```
POST /chat/completions
```

## Descrição

O endpoint principal para conclusões de chat de IA com recuperação opcional da base de conhecimento (RAG). Suporta:

- **Dois formulários de entrada** — uma única string `prompt` (legado) **ou** um array `messages` estilo OpenAI.
- **Redundância de modelo** — uma cadeia de failover definida pelo chamador (primária + até 2 substitutos). Consulte [Redundância e failover](/pt/api/redundancy).
- **Segurança por chamada** — seleção de política SMLTP e substituição do Prompt Shield em linha.
- **Streaming** — Eventos enviados pelo servidor (SSE).
- **Recibos assinados** — uma referência de recibo de conformidade SMLTP nas respostas roteadas pelo gateway.

<Tip>
**Compatibilidade do OpenAI SDK**

Se você quiser colocar o SecureAI em uma integração OpenAI existente com **zero alterações de código**, use o [endpoint compatível com OpenAI](/pt/api/chat/openai-compatível) em `/api/external/v1/chat/completions`. Este endpoint clássico é o único que suporta RAG.
</Tip>

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Cabeçalhos

| Cabeçalho | Obrigatório | Descrição |
|--------|----------|------------|
| `Authorization` | Sim | `Bearer sk-...` |
| `Content-Type` | Sim | `application/json` |
| `Idempotency-Key` | Não | Uma chave exclusiva que torna um POST de conclusão seguro para nova tentativa. Repetir uma solicitação com a mesma chave retorna o resultado original em vez de cobrar duas vezes. |

## Corpo da solicitação

### Parâmetros de entrada

Forneça **** `prompt` **ou** `messages` — não ambos.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `prompt` | corda | Condicional | Mensagem do usuário (formulário legado de turno único). |
| `messages` | matriz | Condicional | Matriz estilo OpenAI de `{ role, content }`. `role` é `system`, `user` ou `assistant`. No máximo uma mensagem `system`, e apenas como primeira entrada. Máximo de 100 mensagens, conteúdo total de 256 KB. |
| `system_message` | corda | Não | Prompt de sistema personalizado (legado). Não pode ser combinado com uma função `system` dentro da banda em `messages`. |

### Modelo e parâmetros de redundância

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `model` | corda | Condicional | Modelo de IA (por exemplo, `"openai/gpt-5-nano"`). Obrigatório, a menos que `models` seja fornecido. |
| `models` | matriz | Não | Cadeia de failover explícita (substitui `model`). Até 3 entradas distintas; cada entrada é uma string de modelo ou `{ model, timeout_ms, first_token_timeout_ms }`. |
| `fallback_models` | matriz | Não | Fallbacks anexados após `model`. Não pode ser combinado com `models`. |
| `redundancy` | objeto | Não | Opções para toda a cadeia: `{ timeout_ms, first_token_timeout_ms, on: [...] }`. Consulte [Redundância e failover](/pt/api/redundancy). |

### Parâmetros de recuperação e geração

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `index` | corda | **Sim** | Nome da base de conhecimento a ser consultada. Use `"Zero-Knowledge"` para IA direta sem RAG. Este campo é obrigatório — uma solicitação sem `index` retorna `400 "Index required"`. |
| `use_rag` | booleano | Não | Habilite a recuperação de conhecimento (padrão: `true`). A configuração `use_rag: false` **não** dispensa o requisito `index` — enviar `index: "Zero-Knowledge"`. |
| `smltp_policy` | corda | Não | Política de segurança (`"internal"`, `"public"`, `"confidential"` ou uma política personalizada de locatário). |
| `prompt_shield` | objeto | Não | Controle de Prompt Shield por chamada: `{ enabled?: boolean, policy?: string }`. Consulte [API Prompt Shield](/pt/api/threat-defense/prompt-shield#per-call-control-on-completions). |
| `temperature` | número | Não | Controle de aleatoriedade (0–2, padrão: 0,7). |
| `max_tokens` | inteiro | Não | Máximo de tokens de resposta (padrão: 1.000, limitado a 4.000). |
| `stream` | booleano | Não | Transmita a resposta como SSE (padrão: `false`). |
| `conversation_id` | corda | Não | ID de conversa opcional para rastreamento. |
| `user_id` | corda | Não | MongoDB ObjectId do usuário para o qual cobrar esta solicitação (controlado pelo administrador; consulte [Modos de cobrança](/pt/api/billing-modes)). |

## Exemplo de solicitação

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

## Resposta

### Resposta de sucesso (200)

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

### Objeto de metadados

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `conversation_id` | corda | ID da conversa (ecoada ou gerada). |
| `index_used` | corda | Base de conhecimento usada. |
| `smltp_policy_used` | corda | Nome da política SMLTP aplicada. |
| `smltp_policy_source` | corda | De onde veio a política (`request`, padrão de chave, etc.). |
| `smltp_policy_hash` | cadeia \| nulo | Hash da política aplicada para verificação. |
| `prompt_shield_policy` | objeto \| nulo | Política Prompt Shield aplicada a esta chamada, se houver. |
| `served_model` | corda | Modelo que realmente produziu a resposta. |
| `requested_model` | corda | Primeiro modelo da cadeia solicitada. |
| `failover` | objeto | **Presente apenas quando uma cadeia multimodelo foi executada.** `{ occurred, attempts[] }` — consulte [Redundância e failover](/pt/api/redundancy). |
| `smltp` | objeto | Presente quando um direito SMLTP é criado para a chamada. `{ bundle_id, receipt_url }`. O `bundle_id` (um ID de autorização, por exemplo, `jti-…`) é retornado mesmo em implantações nativas/diretas; o recibo assinado em `receipt_url` só é recuperável quando o tráfego é roteado através do gateway SMLTP (caso contrário, [Receipts](/pt/api/receipts) retorna `404`). |
| `rag_enabled` | booleano | Se RAG foi usado. |
| `documents_retrieved` | inteiro | Número de documentos recuperados. |
| `sources` | matriz | Até 3 fontes de documentos recuperadas `{ source, score }`. |

## Transmissão

Defina `"stream": true` para receber eventos enviados pelo servidor. Cada linha SSE é `data: <json>` e o fluxo termina com `data: [DONE]`. Os quadros são digitados através de um campo `type`:

| Quadro `type` | Carga útil |
|-------------|---------|
| `metadata` | O envelope de resposta (`id`, `object`, `created`, `model` = modelo de serviço e o objeto `metadata` acima). Enviado primeiro. |
| `chunk` | Um delta incremental: `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`. |
| `usage` | Uso final do token. |
| `error` | Uma interrupção do provedor intermediário (após o primeiro token, o failover não é mais possível). |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 Não autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Proibido

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429/502 — Cadeia de redundância esgotada

Quando todos os modelos em uma cadeia de redundância falham, a resposta relata cada tentativa. O status é `429` se todas as falhas forem limites de taxa, caso contrário `502`.

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

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Exemplo de uso

###JavaScript/Node.js

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

###Píton

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

- `index` é obrigatório. Envie `index: "Zero-Knowledge"` para respostas diretas de IA sem RAG.
- O parâmetro `user_id` cobra a solicitação para uma conta de usuário diferente (controlada por administrador).
- A temperatura é fixada em 0–2; `max_tokens` está limitado a 4.000.
- Para validar uma solicitação em relação a cada política **sem** chamar um modelo ou gastar pontos, use [Policy Check](/pt/api/policy-check).
- Para semântica da cadeia de failover (gatilhos, tempos limite, comportamento de streaming, códigos de status de exaustão), consulte [Redundância e Failover](/pt/api/redundancy).