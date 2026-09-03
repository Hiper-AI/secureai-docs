---
title: "중복성 및 장애 조치"
sidebar_label: "중복성 및 장애 조치"
description: "SecureAI Completions API에 대한 호출자 정의 모델 장애 조치 체인"
---
# 중복성 및 장애 조치

Completions API는 공급자 호출이 실패할 때 한 모델에서 다른 모델로 자동으로 **장애 조치**할 수 있습니다. 순서가 지정된 체인(기본 모델과 최대 2개의 대체 모델)을 정의하면 SecureAI는 하나가 성공할 때까지 각 체인을 차례로 시도합니다. 이를 통해 자체 코드에 재시도 논리가 없어도 공급자 중단, 속도 제한 및 시간 초과에 대한 복원력을 얻을 수 있습니다.

[클래식 `/chat/completions`](/api/chat/completions) 엔드포인트와 [OpenAI 호환 `/v1/chat/completions`](/api/chat/openai- Compatible) 엔드포인트 모두에서 중복성을 사용할 수 있습니다.

## 체인 정의 방법

우선순위에 따라 체인을 요청하는 방법에는 세 가지가 있습니다.

| # | 당신은 보낸다 | 결과 체인 ​​|
|---|------------|----|
| 1 | `models: ["a", "b", "c"]` | 정확히 해당 체인입니다(`model` 재정의). |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`. |
| 3 | `model: "a"` 혼자 | `a`가 나타나는 경우 API 키의 관리자 구성 `failoverDefaults`을 사용합니다(체인은 `a`의 위치에서 시작됩니다). 그렇지 않으면 단일 시도입니다. |

체인에는 **최대 3개의 개별 모델**이 포함될 수 있습니다. 중복된 항목은 축소됩니다. 각 체인 항목은 일반 모델 문자열이거나 시도당 시간 제한이 있는 객체일 수 있습니다.

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

동일한 요청에서 `models`과 `fallback_models`를 결합할 수 없습니다.

## 체인 전체 옵션 (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

| 필드 | 범위 | 설명 |
|-------|---------|-------------|
| `timeout_ms` | 1000~300000 | 시도당 전체 시간 초과입니다. |
| `first_token_timeout_ms` | 500~60000 | 스트리밍의 경우: 장애 조치 전 첫 번째 콘텐츠 토큰을 기다리는 시간입니다. |
| `on` | 아래 트리거의 하위 집합 | 장애 조치를 트리거하는 오류 클래스. 기본값은 4개 모두입니다. |

시도당 시간 제한(`models[]` 항목 내부에 설정)은 해당 시도에 대한 체인 전체 값을 재정의합니다.

## 장애 조치 트리거

실패한 시도는 다음 이유 중 하나로 분류됩니다. 장애 조치는 이유가 `on` 목록에 있고** 체인에 다른 모델이 남아 있는 경우에만 발생합니다.

| 이유 | 원인 |
|---------|-------|
| `connection_error` | 연결 거부/재설정, DNS/가져오기 실패. |
| `server_error` | 공급자가 HTTP 5xx를 반환했습니다. |
| `rate_limit` | 공급자가 HTTP 429를 반환했습니다. |
| `timeout` | 시도 횟수가 `timeout_ms`(또는 스트리밍 중에는 `first_token_timeout_ms`)을 초과했습니다. |

재시도가 **불가능**한 장애는 결코 장애 조치를 트리거하지 않습니다. 예를 들어 의도적인 게이트웨이 속도 제한/토큰 예산 차단, 개방형 회로 차단기 또는 정책/검증 거부 등이 있습니다. 폴백은 동일하게 실패하거나 차단이 의도적입니다.

## 스트리밍 동작

스트리밍 요청의 경우 **첫 번째 콘텐츠 토큰이 도착하기 전에만 장애 조치가 가능합니다.** SecureAI는 첫 번째 토큰(`first_token_timeout_ms`로 제한됨)까지 업스트림 스트림을 가져옵니다. 실패하면 다음 모델로 장애 조치됩니다. 첫 번째 토큰이 클라이언트에 전송되면 제공 모델이 잠깁니다. 이후의 중간 스트림 중단은 장애 조치가 아닌 `error` 프레임으로 표시됩니다.

## 당신이 돌려받는 것

다중 모델 체인이 실행되면 응답에 **장애 조치 보고서**가 포함됩니다.

- 클래식 끝점: `metadata.failover`
- OpenAI 호환 엔드포인트: `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model`은 실제로 어떤 모델이 응답했는지 알려주며, `requested_model`은 체인의 첫 번째 모델입니다. 단일 모델(레거시) 요청은 장애 조치 보고서를 생성하지 않습니다.

## 전체 체인이 실패하는 경우

모든 시도가 실패하면 요청은 모든 시도를 나열하는 오류를 반환합니다.

- *모든* 실패가 비율 제한인 경우 **429**입니다.
- **502** 그렇지 않은 경우.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

OpenAI 호환 엔드포인트에서 동일한 조건은 `code: "all_models_failed"`와 함께 OpenAI 오류 봉투를 반환합니다.

## 관리자 기본값 (`failoverDefaults`)

관리자는 호출자가 요청할 때마다 체인을 보내지 않고도 장애 조치를 받을 수 있도록 API 키에 기본 체인을 연결할 수 있습니다. **관리 → API 키**에서 구성하면 페이로드가 검증되고 고정됩니다.

- `models`: 최대 3개의 고유한 모델 이름.
- `timeout_ms`: 1000~300000.
- `first_token_timeout_ms`: 500~60000.
- `on`: 4개 트리거의 하위 집합입니다.

호출자가 `model: "a"`만 보내고 `a`가 `failoverDefaults.models`에 있는 경우 체인은 `a`의 위치에서 시작하여 나머지 기본값까지 계속됩니다.

## 보안 및 시도당 청구

모든 시도는 SMLTP 래퍼를 통한 완전하고 독립적인 호출입니다. 즉, 정책 시행, 송신/상주 거버넌스 및 서명된 자격 토큰 발행은 모두 시도당 재실행되며 해당 시도의 모델과 정확한 요청 바이트에 바인딩됩니다. 청구에는 실제로 응답을 제공한 모델이 반영됩니다. 각 장애 조치는 또한 `api:model_failover` 보안 이벤트(구독한 [webhooks](/ko/en/api/webhooks/overview)에 전달됨)와 감사 로그 항목을 내보냅니다.

## 관련

- [채팅 완료](/ko/ko/api/chat/completions)
- [OpenAI 호환 엔드포인트](/ko/en/api/chat/openai-호환)
- [정책 확인](/ko/en/api/policy-check) — 포인트를 지출하지 않고 전체 체인의 액세스를 미리 볼 수 있습니다.
- [Webhooks](/ko/ko/api/webhooks/overview) — `api:model_failover`을 구독하세요.