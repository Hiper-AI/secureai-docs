---
sidebar_position: 2
title: "OpenAI 호환 엔드포인트"
sidebar_label: "OpenAI 호환"
description: "드롭인 OpenAI 채팅 완료 화면 — SecureAI에서 모든 OpenAI SDK를 가리킵니다."
openapi: "POST /v1/chat/completions"
---
# OpenAI 호환 엔드포인트

SecureAI는 OpenAI 호환 표면을 노출하므로 코드 변경 없이 **기본 URL과 API 키만 변경하여 모든 OpenAI SDK**와 통합할 수 있습니다. 전체 SecureAI 보안 스택(API 키 인증, 모델/인덱스 허용 목록, SMLTP 정책 시행 + 권한, Prompt Shield, PII/DLP, 포인트 청구 및 [모델 중복 엔진](/ko/api/redundancy))이 아래에서 실행됩니다.

## 엔드포인트

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

OpenAI 클라이언트의 `base_url`을 다음 위치로 지정하세요.

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**영지식만 해당**

이 표면은 RAG/지식 기반을 지원하지 **않습니다**. 요청은 `Zero-Knowledge`에 고정되어 있습니다. 지식 기반 검색이 필요한 경우 클래식 [채팅 완료](/ko/api/chat/completions) 엔드포인트를 사용하세요.
</Info>

## 인증

```bash
Authorization: Bearer sk-your-api-key-here
```

## OpenAI SDK 사용

### 파이썬 (`openai`)

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

### 자바스크립트 (`openai`)

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

## 요청 본문

표준 OpenAI 필드가 지원됩니다. `messages`가 필요합니다(이 표면에는 `prompt`가 없습니다). `max_completion_tokens`은 `max_tokens`의 별칭으로 허용됩니다.

다음 OpenAI 매개변수는 있는 그대로 공급자에게 전달됩니다.

`tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `stop`, `top_p`, `frequency_penalty`, `presence_penalty`, `seed`, `logprobs`, `top_logprobs`, `user`.

### SecureAI 확장 필드

OpenAI SDK의 `extra_body`을 통해 추가 본문 필드로 다음을 보냅니다.

| 필드 | 설명 |
|-------|-------------|
| `smltp_policy` | 이 통화에 대한 SMLTP 보안 정책입니다. |
| `prompt_shield` | `{ enabled?, policy? }` — 호출별 프롬프트 쉴드 재정의. |
| `models` / `fallback_models` | 모델 [redundancy](/ko/api/redundancy) 체인. |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`. |
| `user_id` | 다른 사용자에게 청구합니다(관리자 지정). |

## 응답

표준 OpenAI `chat.completion` 모양과 `secureai` 확장 개체.

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

`secureai.smltp_bundle_id`(있는 경우)는 서명된 규정 준수 [영수증](/ko/api/receipts)으로 교환될 수 있습니다.

### 스트리밍

`stream: true`를 설정합니다. 프레임은 `data: [DONE]`로 끝나는 기본 OpenAI `chat.completion.chunk` 개체입니다. `secureai` 확장은 **첫 번째** 청크에 연결됩니다. `choices`(`tool_calls` 델타 및 `finish_reason` 포함)은 그대로 통과합니다.

## 오류

이 핸들러의 오류는 OpenAI 봉투를 사용합니다.

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

전체 중복 체인이 실패하면 오류는 `code: "all_models_failed"` 및 상태 `429`(모든 속도 제한) 또는 `502`(그렇지 않음)을 사용합니다. 보안 미들웨어 거부는 SecureAI `{ "success": false, ... }` 형태를 유지합니다. 둘 다 항상 `message`을 가지고 있습니다.

## 관련

- [채팅 완료](/ko/api/chat/completions) — 클래식 표면(RAG 추가).
- [이중화 및 장애 조치](/ko/api/redundancy)
- [Prompt Shield API](/ko/api/threat-defense/prompt-shield)