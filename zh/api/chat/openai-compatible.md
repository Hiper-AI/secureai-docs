---
sidebar_position: 2
title: "OpenAI 兼容端点"
sidebar_label: "OpenAI 兼容"
description: "直接 OpenAI 聊天完成界面 — 将任何 OpenAI SDK 指向 SecureAI"
openapi: "POST /v1/chat/completions"
---
# OpenAI 兼容端点

SecureAI 公开了与 OpenAI 兼容的表面，因此您可以通过仅更改基本 URL 和 API 密钥来与 **任何 OpenAI SDK 集成 - 无需更改代码。完整的 SecureAI 安全堆栈（API 密钥身份验证、模型/索引允许列表、SMLTP 策略执行 + 权利、Prompt Shield、PII/DLP、积分计费和[模型冗余引擎](/zh/api/redundancy)）在下面运行。

## 端点

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

将您的 OpenAI 客户端的 `base_url` 指向：

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**仅零知识**

该表面**不**支持RAG/知识库。请求被固定到`Zero-Knowledge`。如果您需要知识库检索，请使用经典的[聊天完成](/zh/api/chat/completions)端点。
</Info>

## 身份验证

```bash
Authorization: Bearer sk-your-api-key-here
```

## 使用 OpenAI SDK

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

## 请求正文

支持标准 OpenAI 字段。 `messages` 是必需的（该表面上没有 `prompt`）。 `max_completion_tokens` 被接受作为 `max_tokens` 的别名。

以下 OpenAI 参数按原样传递给提供商：

`tools`、`tool_choice`、`parallel_tool_calls`、`response_format`、`stop`、`top_p`、`frequency_penalty`、`presence_penalty`、`seed`、`logprobs`、`top_logprobs`、 `user`。

### SecureAI 扩展字段

将它们作为额外的正文字段发送（通过 OpenAI SDK 中的 `extra_body`）：

|领域 |描述 |
|--------|-------------|
| `smltp_policy` | SMLTP 此调用的安全策略。 |
| `prompt_shield` | `{ enabled?, policy? }` — 每次呼叫提示屏蔽覆盖。 |
| `models` / `fallback_models` |模型[冗余](/zh/api/redundancy)链。 |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`。 |
| `user_id` |向不同的用户计费（管理员控制）。 |

## 回应

标准 OpenAI `chat.completion` 形状，加上 `secureai` 扩展对象。

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

`secureai.smltp_bundle_id`（如果存在）可以兑换为已签名的合规性[收据](/zh/api/receipts)。

### 流媒体

设置`stream: true`。帧是由 `data: [DONE]` 终止的本机 OpenAI `chat.completion.chunk` 对象。 `secureai` 扩展附加到 **first** 块。 `choices`（包括`tool_calls`增量和`finish_reason`）不受影响地通过。

## 错误

此处理程序中的错误使用 OpenAI 信封：

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

当整个冗余链失败时，错误使用 `code: "all_models_failed"` 和状态 `429`（所有速率限制）或 `502`（否则）。安全中间件拒绝保持 SecureAI `{ "success": false, ... }` 的形状；两者都始终带有 `message`。

## 相关

- [聊天完成](/zh/api/chat/completions) — 经典界面（添加 RAG）。
- [冗余与故障转移](/zh/api/redundancy)
- [提示盾API](/zh/api/threat-defense/prompt-shield)