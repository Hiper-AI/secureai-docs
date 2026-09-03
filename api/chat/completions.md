---
sidebar_position: 1
title: Chat Completion
openapi: "POST /chat/completions"
---

# Chat Completion

The main endpoint for AI chat completions with optional knowledge base retrieval (RAG), model redundancy/failover, per-call security policies, and streaming.

## Endpoint

```
POST /chat/completions
```

## Description

The main endpoint for AI chat completions with optional knowledge base retrieval (RAG). It supports:

- **Two input forms** — a single `prompt` string (legacy) **or** an OpenAI-style `messages` array.
- **Model redundancy** — a caller-defined failover chain (primary + up to 2 fallbacks). See [Redundancy & Failover](/api/redundancy).
- **Per-call security** — SMLTP policy selection and an inline Prompt Shield override.
- **Streaming** — Server-Sent Events (SSE).
- **Signed receipts** — an SMLTP compliance receipt reference on responses routed through the gateway.

<Tip>
**OpenAI SDK compatibility**

If you want to drop SecureAI into an existing OpenAI integration with **zero code changes**, use the [OpenAI-compatible endpoint](/api/chat/openai-compatible) at `/api/external/v1/chat/completions` instead. This classic endpoint is the only one that supports RAG.
</Tip>

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer sk-...` |
| `Content-Type` | Yes | `application/json` |
| `Idempotency-Key` | No | A unique key that makes a completion POST safe to retry. Repeating a request with the same key returns the original result instead of billing twice. |

## Request Body

### Input parameters

Provide **either** `prompt` **or** `messages` — not both.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Conditional | User's message (legacy single-turn form). |
| `messages` | array | Conditional | OpenAI-style array of `{ role, content }`. `role` is `system`, `user`, or `assistant`. At most one `system` message, and only as the first entry. Max 100 messages, 256&nbsp;KB total content. |
| `system_message` | string | No | Custom system prompt (legacy). Cannot be combined with an in-band `system` role in `messages`. |

### Model & redundancy parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Conditional | AI model (e.g. `"openai/gpt-5-nano"`). Required unless `models` is supplied. |
| `models` | array | No | Explicit failover chain (overrides `model`). Up to 3 distinct entries; each entry is a model string or `{ model, timeout_ms, first_token_timeout_ms }`. |
| `fallback_models` | array | No | Fallbacks appended after `model`. Cannot be combined with `models`. |
| `redundancy` | object | No | Chain-wide options: `{ timeout_ms, first_token_timeout_ms, on: [...] }`. See [Redundancy & Failover](/api/redundancy). |

### Retrieval & generation parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `index` | string | **Yes** | Knowledge base name to query. Use `"Zero-Knowledge"` for direct AI with no RAG. This field is required — a request without `index` returns `400 "Index required"`. |
| `use_rag` | boolean | No | Enable knowledge retrieval (default: `true`). Setting `use_rag: false` does **not** waive the `index` requirement — send `index: "Zero-Knowledge"`. |
| `smltp_policy` | string | No | Security policy (`"internal"`, `"public"`, `"confidential"`, or a tenant custom policy). |
| `prompt_shield` | object | No | Per-call Prompt Shield control: `{ enabled?: boolean, policy?: string }`. See [Prompt Shield API](/api/threat-defense/prompt-shield#per-call-control-on-completions). |
| `temperature` | number | No | Randomness control (0–2, default: 0.7). |
| `max_tokens` | integer | No | Max response tokens (default: 1000, capped at 4000). |
| `stream` | boolean | No | Stream the response as SSE (default: `false`). |
| `conversation_id` | string | No | Optional conversation ID for tracking. |
| `user_id` | string | No | MongoDB ObjectId of the user to bill this request to (admin-gated; see [Billing Modes](/api/billing-modes)). |

## Request Example

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

## Response

### Success Response (200)

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

### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `conversation_id` | string | Conversation ID (echoed or generated). |
| `index_used` | string | Knowledge base used. |
| `smltp_policy_used` | string | Applied SMLTP policy name. |
| `smltp_policy_source` | string | Where the policy came from (`request`, key default, etc.). |
| `smltp_policy_hash` | string \| null | Hash of the applied policy for verification. |
| `prompt_shield_policy` | object \| null | Prompt Shield policy applied to this call, if any. |
| `served_model` | string | Model that actually produced the answer. |
| `requested_model` | string | First model in the requested chain. |
| `failover` | object | **Present only when a multi-model chain ran.** `{ occurred, attempts[] }` — see [Redundancy & Failover](/api/redundancy). |
| `smltp` | object | Present when an SMLTP entitlement is minted for the call. `{ bundle_id, receipt_url }`. The `bundle_id` (an entitlement id, e.g. `jti-…`) is returned even on native/direct deployments; the signed receipt at `receipt_url` is only retrievable when traffic is routed through the SMLTP gateway (otherwise [Receipts](/api/receipts) returns `404`). |
| `rag_enabled` | boolean | Whether RAG was used. |
| `documents_retrieved` | integer | Number of documents retrieved. |
| `sources` | array | Up to 3 retrieved document sources `{ source, score }`. |

## Streaming

Set `"stream": true` to receive Server-Sent Events. Each SSE line is `data: <json>` and the stream ends with `data: [DONE]`. Frames are typed via a `type` field:

| Frame `type` | Payload |
|--------------|---------|
| `metadata` | The response envelope (`id`, `object`, `created`, `model` = serving model, and the `metadata` object above). Sent first. |
| `chunk` | An incremental delta: `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`. |
| `usage` | Final token usage. |
| `error` | A mid-stream provider interruption (after the first token, failover is no longer possible). |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429 / 502 — Redundancy chain exhausted

When every model in a redundancy chain fails, the response reports each attempt. The status is `429` if all failures were rate limits, otherwise `502`.

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

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Example Usage

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

### Python

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

## Notes

- `index` is required. Send `index: "Zero-Knowledge"` for direct AI responses without RAG.
- The `user_id` parameter bills the request to a different user account (admin-gated).
- Temperature is clamped to 0–2; `max_tokens` is capped at 4000.
- To validate a request against every policy **without** calling a model or spending points, use [Policy Check](/api/policy-check).
- For failover chain semantics (triggers, timeouts, streaming behavior, exhaustion status codes), see [Redundancy & Failover](/api/redundancy).
