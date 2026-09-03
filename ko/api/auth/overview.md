---
sidebar_position: 1
title: "인증 개요"
---
# API 인증

SecureAI는 모든 외부 API 액세스에 API 키 인증을 사용합니다. 키는 모델, 정책, 한도, 청구 및 보안에 대한 키별 제어 기능을 통해 관리자가 생성하고 구성한 전달자 토큰입니다.

## 인증 헤더

```http
Authorization: Bearer sk-your-api-key-here
```

**API 키 형식:**
- `sk-` 접두사로 시작합니다(예: `sk-8cd5253f...`).
- 접두사 뒤에는 64자의 16진수 비밀이 옵니다.
- 키의 SHA-256 해시만 서버측에 저장됩니다. 전체 키는 생성 시 **한 번** 표시됩니다. 분실한 경우 키를 순환/다시 생성하세요.

모든 API 호출에는 HTTPS가 필요합니다.

## API 키 생성 및 구성

관리자는 **관리 → API 키**(API 기반 `/api/admin/api-keys`, 관리자 전용)에서 키를 생성합니다. 전체 키는 생성 시 한 번 반환됩니다. 각 키에는 다음 구성이 포함됩니다.

### 소유권 및 청구

| 설정 | 설명 |
|---------|-------------|
| `name` | 사람이 읽을 수 있는 라벨. |
| `userId` | 이 키가 속하거나 청구되는 사용자 계정입니다. |
| `billingMode` | `user-completions`(사용자의 완료 허용량에서 공제) 또는 `usage-by-model`(모델 비용별로 달러 예산 공제). [결제 모드](/ko/en/api/billing-modes)를 참조하세요. |

발신자는 `user_id` 본문 매개변수(관리자 지정)를 사용하여 **다른** 사용자에게 개별 요청에 대해 요금을 청구할 수 있습니다.

### 제한

| 설정 | 설명 |
|---------|-------------|
| `dailyLimit` | 이 키에 대한 일일 최대 요청 수입니다. |
| `monthlyLimit` | 이 키에 대한 월별 최대 요청 수입니다. |
| `rateLimit.requestsPerMinute` | 분당 최대 한도(최대 1000). |
| `rateLimit.requestsPerHour` | 시간당 한도(최대 10000). |
| `expiresAt` | 선택적 만료; 만료되지 않는 키는 생략하세요. |

### 허용 목록

| 설정 | 설명 |
|---------|-------------|
| `allowedModels[]` | 설정된 경우 키는 이 모델 **만** 사용할 수 있습니다. 비어 있음 = 라이센스 기본 카탈로그. |
| `allowedIndexes[]` | 키가 쿼리할 수 있는 기술 자료를 제한합니다. |
| `allowedSMLTPPolicies[]` | 키가 요청할 수 있는 SMLTP 정책(기본값 `["public", "internal"]`) 정책 확인자에 대해 검증되었으므로 테넌트 사용자 지정 정책이 허용됩니다. |

### 프롬프트 쉴드

| 설정 | 설명 |
|---------|-------------|
| `enablePromptShield` | 이 키에 대해 프롬프트 쉴드를 켜십시오. |
| `promptShieldSensitivity` | `strict`, `balanced` 또는 `permissive`. |
| `promptShieldPolicyId` | 특정 Prompt Shield 정책을 키에 바인딩합니다. |
| `allowedPromptShieldPolicies[]` | 발신자는 `prompt_shield.policy`를 통해 통화별로 선택할 수 있는 정책을 선택할 수 있습니다. |

[Prompt Shield API](/ko/en/api/threat-defense/prompt-shield)를 참조하세요.

### 중복 기본값

`failoverDefaults`는 기본 모델 [장애 조치 체인](/ko/en/api/redundancy)을 키에 연결합니다: `models[]`(최대 3개), `timeout_ms`(1000–300000), `first_token_timeout_ms`(500–60000) 및 `on[]` 트리거. 그런 다음 호출자는 모든 요청에 ​​대해 체인을 보내지 않고 장애 조치를 받습니다.

## 멱등성

완료 `POST`는 `Idempotency-Key` 헤더를 허용합니다. 동일한 키를 사용하여 재시도하면 두 번째 비용이 청구되는 대신 원래 결과가 반환됩니다. 이를 사용하여 네트워크 재시도를 안전하게 만드세요. [채팅 완료](/ko/ko/api/chat/completions)를 참고하세요.

## 속도 제한

기본 한도(키별로 구성 가능):

- **분당**: 요청 60개
- **시간당**: 요청 1000개
- **일일**: 요청 100개
- **월간**: 요청 10,000건

키 보유자는 [`GET /usage`](/api/usage)를 통해 자체 실시간 할당량 및 한도를 읽을 수 있습니다.

## 보안 기능

- **HTTPS만** — 모든 API 호출에는 TLS가 필요합니다.
- **미사용 해시** — 각 키의 SHA-256 해시만 저장됩니다.
- **사용 추적 및 감사 로깅** — 모든 통화 및 인증 이벤트가 기록됩니다.
- **SMLTP 규정 준수** — 모든 요청에 ​​보안 정책이 적용됩니다.

## 오류 응답

### 인증 오류

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### 비율 제한 오류

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## 일반적인 오류 코드

| 오류 | 설명 |
|-------|-------------|
| `Invalid API key` | API 키가 유효하지 않거나 만료되었거나 취소되었습니다. |
| `Rate limit exceeded: too many requests per minute` | 분당 속도 제한을 초과했습니다. |
| `Rate limit exceeded: too many requests per hour` | 시간당 요금 한도를 초과했습니다. |
| `Access denied` | 이 키에는 모델, 인덱스 또는 정책이 허용되지 않습니다. |

## 다음 단계

- [API 참조](/ko/en/api) — 사용 가능한 모든 외부 엔드포인트를 살펴보세요.
- [채팅 완료](/ko/en/api/chat/completions) — 완료 통합을 시작합니다.
- [OpenAI 호환 엔드포인트](/ko/en/api/chat/openai- Compatible) — 기존 OpenAI SDK를 재사용합니다.
- [사용량](/ko/en/api/usage) — 할당량 및 한도를 확인하세요.