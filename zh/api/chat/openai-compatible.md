---
sidebar_position: 2
title: "OpenAI-Compatible Endpoint"
sidebar_label: "OpenAI-Compatible"
description: "Drop-in OpenAI Chat Completions surface — point any OpenAI SDK at SecureAI"
openapi: "POST /v1/chat/completions"
---


# OpenAI-Compatible Endpoint

SecureAI exposes an OpenAI-compatible surface so you can integrate with **any OpenAI SDK by changing only the base URL and API key** — no code changes. The full SecureAI security stack (API-key auth, model/index allowlists, SMLTP policy enforcement + entitlements, Prompt Shield, PII/DLP, points billing, and the [model redundancy engine](/zh/api/redundancy)) runs underneath.

## Endpoint

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

Point your OpenAI client's `base_url` at:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**Zero-Knowledge only**

This surface does **not** support RAG / knowledge bases. Requests are pinned to `Zero-Knowledge`. If you need knowledge-base retrieval, use the classic [Chat Completion](/zh/api/chat/completions) endpoint.
</Info>

## Authentication

```bash
Authorization: Bearer sk-your-api-key-here
```

## Using an OpenAI SDK

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

## Request Body

Standard OpenAI fields are supported. `messages` is required (there is no `prompt` on this surface). `max_completion_tokens` is accepted as an alias for `max_tokens`.

The following OpenAI parameters are passed through to the provider as-is:

`tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `stop`, `top_p`, `frequency_penalty`, `presence_penalty`, `seed`, `logprobs`, `top_logprobs`, `user`.

### SecureAI extension fields

Send these as extra body fields (via `extra_body` in the OpenAI SDKs):

| Field | Description |
|-------|-------------|
| `smltp_policy` | SMLTP security policy for this call. |
| `prompt_shield` | `{ enabled?, policy? }` — per-call Prompt Shield override. |
| `models` / `fallback_models` | Model [redundancy](/zh/api/redundancy) chain. |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`. |
| `user_id` | Bill to a different user (admin-gated). |

## Response

Standard OpenAI `chat.completion` shape, plus a `secureai` extension object.

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

`secureai.smltp_bundle_id` (when present) can be exchanged for a signed compliance [receipt](/zh/api/receipts).

### Streaming

Set `stream: true`. Frames are native OpenAI `chat.completion.chunk` objects terminated by `data: [DONE]`. The `secureai` extension is attached to the **first** chunk. `choices` (including `tool_calls` deltas and `finish_reason`) pass through untouched.

## Errors

Errors from this handler use the OpenAI envelope:

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

When a whole redundancy chain fails, the error uses `code: "all_models_failed"` and status `429` (all rate limits) or `502` (otherwise). Security-middleware rejections keep the SecureAI `{ "success": false, ... }` shape; both always carry a `message`.

## Related

- [Chat Completion](/zh/api/chat/completions) — the classic surface (adds RAG).
- [Redundancy & Failover](/zh/api/redundancy)
- [Prompt Shield API](/zh/api/threat-defense/prompt-shield)
