---
sidebar_position: 1
title: "聊天完成"
openapi: "POST /chat/completions"
---
# 聊天完成

AI 聊天完成的主要端点，具有可选的知识库检索 (RAG)、模型冗余/故障转移、每次调用安全策略和流。

## 端点

```
POST /chat/completions
```

## 说明

具有可选知识库检索 (RAG) 的 AI 聊天完成的主要端点。它支持：

- **两种输入形式** — 单个 `prompt` 字符串（旧版）**或** OpenAI 样式的 `messages` 数组。
- **模型冗余** — 调用者定义的故障转移链（主要 + 最多 2 个后备）。请参见[冗余与故障转移](/zh/api/redundancy)。
- **每次呼叫安全性** — SMLTP 策略选择和内联提示屏蔽覆盖。
- **流式传输** — 服务器发送的事件 (SSE)。
- **签名收据** — 通过网关路由的响应的 SMLTP 合规收据参考。

<Tip>
**OpenAI SDK 兼容性**

如果您想将 SecureAI 放入现有的 OpenAI 集成中并实现**零代码更改**，请改用 `/api/external/v1/chat/completions` 处的 [OpenAI 兼容端点](/zh/api/chat/openai-company)。这一经典端点是唯一支持 RAG 的端点。
</Tip>

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 标题

|标题|必填|描述 |
|--------|----------|-------------|
| `Authorization` |是的 | `Bearer sk-...` |
| `Content-Type` |是的 | `application/json` |
| `Idempotency-Key` |没有 |使完成 POST 可以安全重试的唯一密钥。使用相同密钥重复请求将返回原始结果，而不是计费两次。 |

## 请求正文

### 输入参数

提供**`prompt` **或** `messages` — 不能同时提供。

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `prompt` |字符串|有条件|用户的消息（传统单轮形式）。 |
| `messages` |数组|有条件| OpenAI 风格的 `{ role, content }` 数组。 `role` 是`system`、`user` 或`assistant`。最多一条 `system` 消息，并且仅作为第一个条目。最多 100 条消息，总内容 256 KB。 |
| `system_message` |字符串|没有 |自定义系统提示（旧版）。无法与 `messages` 中的带内 `system` 角色组合。 |

### 模型和冗余参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `model` |字符串|有条件| AI模型（例如`"openai/gpt-5-nano"`）。除非提供 `models`，否则是必需的。 |
| `models` |数组|没有 |显式故障转移链（覆盖 `model`）。最多 3 个不同的条目；每个条目都是一个模型字符串或 `{ model, timeout_ms, first_token_timeout_ms }`。 |
| `fallback_models` |数组|没有 |在 `model` 之后附加后备。不能与`models`组合。 |
| `redundancy` |对象|没有 |链范围选项：`{ timeout_ms, first_token_timeout_ms, on: [...] }`。请参见[冗余与故障转移](/zh/api/redundancy)。 |

### 检索和生成参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `index` |字符串| **是** |要查询的知识库名称。使用 `"Zero-Knowledge"` 进行直接 AI，无需 RAG。此字段是必填字段 — 没有 `index` 的请求将返回 `400 "Index required"`。 |
| `use_rag` |布尔 |没有 |启用知识检索（默认值：`true`）。设置 `use_rag: false` **不会**放弃 `index` 要求 — 发送 `index: "Zero-Knowledge"`。 |
| `smltp_policy` |字符串|没有 |安全策略（`"internal"`、`"public"`、`"confidential"` 或租户自定义策略）。 |
| `prompt_shield` |对象|没有 |每次呼叫提示屏蔽控制：`{ enabled?: boolean, policy?: string }`。请参阅[Prompt Shield API](/zh/api/threat-defense/prompt-shield#per-call-control-on-completions)。 |
| `temperature` |数量 |没有 |随机性控制（0–2，默认值：0.7）。 |
| `max_tokens` |整数 |没有 |最大响应令牌（默认值：1000，上限为 4000）。 |
| `stream` |布尔 |没有 |将响应流式传输为 SSE（默认值：`false`）。 |
| `conversation_id` |字符串|没有 |用于跟踪的可选对话 ID。 |
| `user_id` |字符串|没有 |用于向该请求计费的用户的 MongoDB ObjectId（管理员控制；请参阅[计费模式](/zh/api/billing-modes)）。 |

## 请求示例

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

## 回应

### 成功响应 (200)

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

### 元数据对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `conversation_id` |字符串|对话 ID（回显或生成）。 |
| `index_used` |字符串|使用的知识库。 |
| `smltp_policy_used` |字符串|应用的 SMLTP 策略名称。 |
| `smltp_policy_source` |字符串|策略来自哪里（`request`、密钥默认值等）。 |
| `smltp_policy_hash` |字符串\|空 |用于验证的应用策略的哈希值。 |
| `prompt_shield_policy` |对象\|空 |应用于此呼叫的提示屏蔽策略（如果有）。 |
| `served_model` |字符串|实际产生答案的模型。 |
| `requested_model` |字符串|请求链中的第一个模型。 |
| `failover` |对象| **仅在多模型链运行时出现。** `{ occurred, attempts[] }` — 请参阅[冗余和故障转移](/zh/api/redundancy)。 |
| `smltp` |对象|当为呼叫创建 SMLTP 权利时出现。 `{ bundle_id, receipt_url }`。即使在本机/直接部署中也会返回 `bundle_id`（权利 ID，例如 `jti-…`）；仅当流量通过 SMLTP 网关路由时，才能检索 `receipt_url` 处的签名收据（否则 [Receipts](/zh/api/receipts) 返回 `404`）。 |
| `rag_enabled` |布尔 |是否使用了RAG。 |
| `documents_retrieved` |整数 |检索到的文档数量。 |
| `sources` |数组|最多 3 个检索的文档源 `{ source, score }`。 |

## 流媒体

设置 `"stream": true` 以接收服务器发送的事件。每条 SSE 行都是 `data: <json>`，流以 `data: [DONE]` 结尾。帧通过 `type` 字段输入：

|框架`type` |有效负载|
|--------------|---------|
| `metadata` |响应包络（`id`、`object`、`created`、`model` = 服务模型，以及上面的 `metadata` 对象）。先发了。 |
| `chunk` |增量增量：`{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`。 |
| `usage` |最终代币使用情况。 |
| `error` |中流提供程序中断（在第一个令牌之后，不再可能进行故障转移）。 |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429 / 502 — 冗余链已耗尽

当冗余链中的每个模型都失败时，响应会报告每次尝试。如果所有故障都是速率限制，则状态为 `429`，否则为 `502`。

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

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 用法示例

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

###Python

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

## 注释

- `index` 是必需的。发送 `index: "Zero-Knowledge"` 进行直接 AI 响应，无需 RAG。
- `user_id` 参数将请求记入不同的用户帐户（管理员控制）。
- 温度固定在0-2； `max_tokens` 的上限为 4000。
- 要在不调用模型或消费点的情况下验证每个策略的请求，请使用[策略检查](/zh/api/policy-check)。
- 有关故障转移链语义（触发器、超时、流行为、耗尽状态代码），请参阅[冗余和故障转移](/zh/api/redundancy)。