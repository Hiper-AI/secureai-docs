---
title: "사용량 및 할당량"
sidebar_label: "용법"
description: "API 키에 대한 셀프 서비스 포인트, 예산, 비율 제한 스냅샷"
openapi: "GET /usage"
---
# 사용량 및 할당량

호출하는 API 키의 할당량 및 사용량(청구된 사용자의 포인트 버킷, 활성화된 경우 모델별 사용량 예산, 키 자체 요청 제한 및 속도 제한)의 셀프 서비스 스냅샷을 반환합니다. 이는 관리자 패널에서 읽은 것과 동일한 데이터이며 키 홀더에 노출됩니다.

## 엔드포인트

```
GET /usage
```

## 인증

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청 예시

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

```json
{
  "success": true,
  "points": {
    "remaining": 4188,
    "monthly_limit": 5000,
    "next_renewal": "2026-08-01T00:00:00.000Z"
  },
  "usage_by_model": {
    "enabled": true,
    "dollar_limit": 250,
    "current_spend": 61.4,
    "remaining_budget": 188.6
  },
  "api_key": {
    "name": "Production integration",
    "billing_mode": "user-completions",
    "daily": { "used": 120, "limit": 1000, "remaining": 880 },
    "monthly": { "used": 3400, "limit": 10000, "remaining": 6600 },
    "rate_limit": { "requests_per_minute": 60, "requests_per_hour": 1000 },
    "expires_at": null
  }
}
```

### 필드

| 필드 | 설명 |
|-------|-------------|
| `points.remaining` | 청구된 사용자의 버킷에 남은 포인트입니다. |
| `points.monthly_limit` | 사용자의 월별 포인트 허용량입니다. |
| `points.next_renewal` | 다음 포인트 갱신의 ISO 타임스탬프입니다. |
| `usage_by_model` | 청구 사용자가 모델별 사용량 청구 모드인 경우: `dollar_limit`, `current_spend`, `remaining_budget`. 그렇지 않으면 `{ "enabled": false }`. |
| `api_key.billing_mode` | `user-completions` 또는 `usage-by-model` — [결제 모드](/ko/api/billing-modes)를 참조하세요. |
| `api_key.daily` / `api_key.monthly` | 키의 요청 카운터(`used`, `limit`, `remaining`). |
| `api_key.rate_limit` | 분당 및 시간당 요청 한도. |
| `api_key.expires_at` | ISO 만료 타임스탬프 또는 키가 만료되지 않는 경우 `null`입니다. |

## 메모

- 값은 **청구** 사용자를 반영하며, 요청이 청구를 대신하여 `user_id`를 사용하는 경우 키 소유자와 다를 수 있습니다.
- *특정* 요청이 (지출 없이) 할당량을 통과하는지 미리 보려면 [정책 확인](/ko/api/policy-check)을 사용하고 `checks.quota`을 읽으세요.

## 관련

- [결제 모드](/ko/api/billing-modes)
- [인증 개요](/ko/api/auth/overview)
- [정책 확인](/ko/api/policy-check)