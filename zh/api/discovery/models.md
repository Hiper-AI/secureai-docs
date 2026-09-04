---
sidebar_position: 1
title: "可用型号"
openapi: "GET /models"
---
# 获取可用模型

根据您的 API 密钥权限和用户许可证检索可用的 AI 模型。

## 端点

```
GET /models
```

## 说明

根据您的 API 密钥权限和用户许可证检索可用的 AI 模型。

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 参数

|参数|类型 |必填 |描述 |示例|
|------------|------|----------|----------|----------|
| `provider` |字符串|没有 |按供应商筛选型号 | `"openai"` |

## 请求

### 基本请求

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 按提供商过滤

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

### 成功响应 (200)

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

### 响应字段

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `success` |布尔 |对于成功的请求始终如此 | `true` |
| `models` |数组|可用型号列表 |参见示例 |
| `user_license` |字符串|用户许可级别 | `"Pro"` |
| `restrictions` |对象|模型访问限制|参见示例 |
| `filters` |对象|应用过滤器|参见示例 |

### 模型对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `id` |字符串|唯一型号标识符| `"openai/gpt-5-nano"` |
| `name` |字符串|型号显示名称 | `"openai/gpt-5-nano"` |
| `provider` |字符串|模型提供商| `"openai"` |

### 限制对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `allowed_models` |字符串|模型访问级别 | `"all"` |

### 过滤对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `provider` |字符串|应用供应商过滤器 | `"openai"` |

## 错误响应

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 超出速率限制

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## 用法示例

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

###Python

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

### 按提供商过滤

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

### 卷曲

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## LLM 桶（当前）

聊天系统将模型分为两个执行桶：

- `standard` 桶
- `premium` 铲斗

该参考基于活动后端存储桶映射。

### 标准桶

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

### 优质桶

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

## 可用的提供商

- **开放人工智能**
- **人择**
- **谷歌**
- **元**
- **米斯特拉尔**
- **深度搜索**
- **xAI**
- **Qwen**

## 注释

- 可用型号取决于您的订阅级别
- 某些型号可能会根据您的许可证受到限制
- 使用提供商过滤器从特定提供商获取模型
- 响应包括您当前的许可级别和限制 
- API密钥限制（`allowedModels`）可以进一步减少型号列表