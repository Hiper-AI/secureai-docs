---
sidebar_position: 1
title: "Available Models"
openapi: "GET /models"
---


# Get Available Models

Retrieve available AI models based on your API key permissions and user license.

## Endpoint

```
GET /models
```

## Description

Retrieve available AI models based on your API key permissions and user license.

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `provider` | string | No | Filter models by provider | `"openai"` |

## Request

### Basic Request

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filter by Provider

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

### Success Response (200)

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

### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `success` | boolean | Always true for successful requests | `true` |
| `models` | array | List of available models | See example |
| `user_license` | string | User's license tier | `"Pro"` |
| `restrictions` | object | Model access restrictions | See example |
| `filters` | object | Applied filters | See example |

### Model Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique model identifier | `"openai/gpt-5-nano"` |
| `name` | string | Model display name | `"openai/gpt-5-nano"` |
| `provider` | string | Model provider | `"openai"` |

### Restrictions Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `allowed_models` | string | Model access level | `"all"` |

### Filters Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `provider` | string | Applied provider filter | `"openai"` |

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 Rate Limit Exceeded

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Example Usage

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

### Python

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

### Filter by Provider

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

### cURL

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## LLM Buckets (Current)

The chat system classifies models into two execution buckets:

- `standard` bucket
- `premium` bucket

This reference is based on the active backend bucket mapping.

### Standard Bucket

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

### Premium Bucket

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

## Available Providers

- **OpenAI**
- **Anthropic**
- **Google**
- **Meta**
- **Mistral**
- **DeepSeek**
- **xAI**
- **Qwen**

## Notes

- Models available depend on your subscription tier
- Some models may be restricted based on your license
- Use the provider filter to get models from specific providers
- The response includes your current license tier and restrictions 
- API key restrictions (`allowedModels`) can further reduce the model list
