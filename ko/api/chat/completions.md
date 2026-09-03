---
sidebar_position: 1
title: "채팅 완료"
openapi: "POST /chat/completions"
---
# 채팅 완료

선택적 RAG(지식 기반 검색), 모델 중복성/장애 조치, 호출별 보안 정책 및 스트리밍을 갖춘 AI 채팅 완료를 위한 기본 엔드포인트입니다.

## 엔드포인트

```
POST /chat/completions
```

## 설명

선택적 RAG(지식 기반 검색)를 사용하여 AI 채팅 완료를 위한 기본 엔드포인트입니다. 다음을 지원합니다:

- **두 가지 입력 형식** — 단일 `prompt` 문자열(레거시) **또는** OpenAI 스타일 `messages` 배열.
- **모델 중복성** — 호출자가 정의한 장애 조치 체인(기본 + 최대 2개의 대체) [이중화 및 장애 조치](/ko/ko/api/redundancy)를 참조하세요.
- **호출별 보안** — SMLTP 정책 선택 및 인라인 Prompt Shield 재정의.
- **스트리밍** — 서버에서 보낸 이벤트(SSE).
- **서명된 영수증** — 게이트웨이를 통해 라우팅된 응답에 대한 SMLTP 준수 영수증 참조입니다.

<Tip>
**OpenAI SDK 호환성**

**코드 변경 없음**으로 기존 OpenAI 통합에 SecureAI를 추가하려면 `/api/external/v1/chat/completions`에서 [OpenAI 호환 엔드포인트](/ko/en/api/chat/openai-호환)를 대신 사용하세요. 이 클래식 엔드포인트는 RAG를 지원하는 유일한 엔드포인트입니다.
</Tip>

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 헤더

| 헤더 | 필수 | 설명 |
|---------|------------|-------------|
| `Authorization` | 예 | `Bearer sk-...` |
| `Content-Type` | 예 | `application/json` |
| `Idempotency-Key` | 아니요 | 완료 POST를 안전하게 재시도할 수 있게 만드는 고유 키입니다. 동일한 키로 요청을 반복하면 비용이 두 번 청구되는 대신 원래 결과가 반환됩니다. |

## 요청 본문

### 입력 매개변수

**`prompt` **또는** `messages` 중 하나를 제공하세요. 둘 다 제공할 수는 없습니다.

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `prompt` | 문자열 | 조건부 | 사용자 메시지(기존 단일 회전 형식) |
| `messages` | 배열 | 조건부 | `{ role, content }`의 OpenAI 스타일 배열. `role`은 `system`, `user` 또는 `assistant`입니다. 최대 하나의 `system` 메시지이며 첫 번째 항목으로만 사용됩니다. 최대 100개의 메시지, 총 콘텐츠 256KB |
| `system_message` | 문자열 | 아니요 | 사용자 정의 시스템 프롬프트(레거시). `messages`의 대역 내 `system` 역할과 결합할 수 없습니다. |

### 모델 및 중복성 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `model` | 문자열 | 조건부 | AI 모델(예: `"openai/gpt-5-nano"`). `models`이 제공되지 않는 한 필수입니다. |
| `models` | 배열 | 아니요 | 명시적 장애 조치 체인(`model` 재정의). 최대 3개의 개별 항목; 각 항목은 모델 문자열 또는 `{ model, timeout_ms, first_token_timeout_ms }`입니다. |
| `fallback_models` | 배열 | 아니요 | `model` 뒤에 대체가 추가되었습니다. `models`와 결합할 수 없습니다. |
| `redundancy` | 개체 | 아니요 | 체인 전체 옵션: `{ timeout_ms, first_token_timeout_ms, on: [...] }`. [이중화 및 장애 조치](/ko/ko/api/redundancy)를 참조하세요. |

### 검색 및 생성 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `index` | 문자열 | **예** | 쿼리할 기술 자료 이름입니다. RAG가 없는 직접 AI에는 `"Zero-Knowledge"`을 사용하세요. 이 필드는 필수입니다. `index`가 없는 요청은 `400 "Index required"`를 반환합니다. |
| `use_rag` | 부울 | 아니요 | 지식 검색을 활성화합니다(기본값: `true`). `use_rag: false` 설정은 `index` 요구 사항을 포기하지 **않습니다** — `index: "Zero-Knowledge"`를 보냅니다. |
| `smltp_policy` | 문자열 | 아니요 | 보안 정책(`"internal"`, `"public"`, `"confidential"` 또는 테넌트 사용자 지정 정책). |
| `prompt_shield` | 개체 | 아니요 | 호출별 프롬프트 쉴드 제어: `{ enabled?: boolean, policy?: string }`. [Prompt Shield API](/ko/en/api/threat-defense/prompt-shield#per-call-control-on-completions)를 참조하세요. |
| `temperature` | 번호 | 아니요 | 무작위성 제어(0–2, 기본값: 0.7). |
| `max_tokens` | 정수 | 아니요 | 최대 응답 토큰(기본값: 1000, 최대 4000) |
| `stream` | 부울 | 아니요 | 응답을 SSE로 스트리밍합니다(기본값: `false`). |
| `conversation_id` | 문자열 | 아니요 | 추적을 위한 선택적 대화 ID입니다. |
| `user_id` | 문자열 | 아니요 | 이 요청을 청구할 사용자의 MongoDB ObjectId입니다(관리자 관리, [청구 모드](/ko/en/api/billing-modes) 참조). |

## 요청 예시

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

## 응답

### 성공 응답 (200)

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

### 메타데이터 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `conversation_id` | 문자열 | 대화 ID(에코되거나 생성됨)입니다. |
| `index_used` | 문자열 | 기술 자료가 사용되었습니다. |
| `smltp_policy_used` | 문자열 | SMLTP 정책 이름이 적용되었습니다. |
| `smltp_policy_source` | 문자열 | 정책의 출처(`request`, 주요 기본값 등). |
| `smltp_policy_hash` | 문자열 \| null | 확인을 위해 적용된 정책의 해시입니다. |
| `prompt_shield_policy` | 개체 \| null | 이 통화에 Prompt Shield 정책이 적용됩니다(있는 경우). |
| `served_model` | 문자열 | 실제로 그 답을 만들어낸 모델. |
| `requested_model` | 문자열 | 요청한 체인의 첫 번째 모델입니다. |
| `failover` | 개체 | **다중 모델 체인이 실행된 경우에만 표시됩니다.** `{ occurred, attempts[] }` — [중복성 및 장애 조치](/ko/en/api/redundancy)를 참조하세요. |
| `smltp` | 개체 | 통화에 대해 SMLTP 권한이 부여될 때 표시됩니다. `{ bundle_id, receipt_url }`. `bundle_id`(자격 ID, 예: `jti-…`)는 기본/직접 배포에서도 반환됩니다. `receipt_url`에 서명된 영수증은 트래픽이 SMLTP 게이트웨이를 통해 라우팅되는 경우에만 검색할 수 있습니다. 그렇지 않으면 [Receipts](/ko/en/api/receipts)가 `404`를 반환합니다. |
| `rag_enabled` | 부울 | RAG 사용 여부. |
| `documents_retrieved` | 정수 | 검색된 문서 수입니다. |
| `sources` | 배열 | 검색된 문서 소스는 최대 3개입니다`{ source, score }`. |

## 스트리밍

서버에서 보낸 이벤트를 수신하려면 `"stream": true`를 설정하세요. 각 SSE 라인은 `data: <json>`이고 스트림은 `data: [DONE]`로 끝납니다. 프레임은 `type` 필드를 통해 입력됩니다.

| 프레임 `type` | 페이로드 |
|---------------|---------|
| `metadata` | 응답 봉투(`id`, `object`, `created`, `model` = 서빙 모델 및 위의 `metadata` 개체). 먼저 보냈습니다. |
| `chunk` | 증분 델타: `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`. |
| `usage` | 최종 토큰 사용. |
| `error` | 미드스트림 공급자 중단(첫 번째 토큰 이후에는 장애 조치가 더 이상 가능하지 않음) |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 승인되지 않음

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 금지됨

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429 / 502 — 중복 체인이 소진되었습니다.

중복 체인의 모든 모델이 실패하면 응답은 각 시도를 보고합니다. 모든 실패가 비율 제한인 경우 상태는 `429`이고, 그렇지 않은 경우 `502`입니다.

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

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 사용 예

### 자바스크립트/Node.js

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

### 파이썬

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

## 메모

- `index`이 필요합니다. RAG 없이 직접 AI 응답을 위해 `index: "Zero-Knowledge"`를 보냅니다.
- `user_id` 매개변수는 요청을 다른 사용자 계정(관리자 관리)으로 청구합니다.
- 온도는 0~2로 고정됩니다. `max_tokens`는 4000으로 제한됩니다.
- 모델 호출이나 포인트 지출 없이**모든 정책에 대해 요청을 검증하려면 [정책 확인](/ko/en/api/policy-check)을 사용하세요.
- 장애 조치 체인 의미(트리거, 시간 초과, 스트리밍 동작, 소진 상태 코드)는 [Redundancy & Failover](/ko/en/api/redundancy)를 참조하세요.