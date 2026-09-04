---
sidebar_position: 1
title: "Modelos Disponíveis na API"
openapi: "GET /models"
sidebar_label: "Modelos Disponíveis"
---

# Obtenha modelos disponíveis

Recupere modelos de IA disponíveis com base em suas permissões de chave de API e licença de usuário.

## Ponto final

```
GET /models
```

## Descrição

Recupere modelos de IA disponíveis com base em suas permissões de chave de API e licença de usuário.

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|----------|------------|---------|
| `provider` | corda | Não | Filtrar modelos por provedor | `"openai"` |

## Solicitação

### Solicitação Básica

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por provedor

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

### Resposta de sucesso (200)

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

### Campos de resposta

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas | `true` |
| `models` | matriz | Lista de modelos disponíveis | Veja exemplo |
| `user_license` | corda | Nível de licença do usuário | `"Pro"` |
| `restrictions` | objeto | Restrições de acesso ao modelo | Veja exemplo |
| `filters` | objeto | Filtros aplicados | Veja exemplo |

### Objeto Modelo

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `id` | corda | Identificador único do modelo | `"openai/gpt-5-nano"` |
| `name` | corda | Nome de exibição do modelo | `"openai/gpt-5-nano"` |
| `provider` | corda | Fornecedor de modelos | `"openai"` |

### Objeto de restrições

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `allowed_models` | corda | Nível de acesso do modelo | `"all"` |

### Objeto de filtros

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `provider` | corda | Filtro de provedor aplicado | `"openai"` |

## Respostas de erro

### 401 Não autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 Limite de taxa excedido

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Exemplo de uso

###JavaScript/Node.js

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

###Píton

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

### Filtrar por provedor

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

###cURL

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Buckets LLM (atual)

O sistema de chat classifica os modelos em dois intervalos de execução:

- `standard` balde
- `premium` balde

Esta referência é baseada no mapeamento de bucket de back-end ativo.

### Balde padrão

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

### Balde Premium

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

## Provedores disponíveis

- **OpenAI**
- **Antrópico**
- **Google**
- ** Meta **
- **Mistral**
- **DeepSeek**
- **xAI**
- **Qwen**

## Notas

- Os modelos disponíveis dependem do seu nível de assinatura
- Alguns modelos podem ser restritos com base na sua licença
- Use o filtro de provedor para obter modelos de fornecedores específicos
- A resposta inclui seu nível de licença atual e restrições 
- Restrições de chave API (`allowedModels`) podem reduzir ainda mais a lista de modelos