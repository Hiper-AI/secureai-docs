---
sidebar_position: 2
title: "웹훅 이벤트"
sidebar_label: "이벤트"
description: "SecureAI 웹훅 이벤트 카탈로그"
---
# 웹훅 이벤트

[웹훅 엔드포인트](/ko/api/webhooks/overview)를 생성하거나 업데이트할 때 하나 이상의 이벤트 유형을 구독합니다. 모든 이벤트를 수신하려면 `"*"`을 사용하세요.

## 이벤트 카탈로그

| 이벤트 | 다음 경우에 발생 |
|-------|------------|
| `*` | 와일드카드 — 아래 **모든** 이벤트를 구독합니다. |
| `promptshield:attack:blocked` | Prompt Shield는 프롬프트 주입/탈옥 시도를 차단했습니다. |
| `promptshield:attack:detected` | Prompt Shield는 의심스러운 프롬프트를 표시했습니다(감지되었지만 차단되지는 않음). |
| `promptshield:canary:leaked` | 모델 출력(시스템 프롬프트/데이터 유출 신호)에서 카나리아 토큰이 발견되었습니다. |
| `dlp:incident` | 데이터 손실 방지 규칙이 일치했습니다. |
| `pii:incident` | PII가 감지/수정되었습니다. |
| `api:limit_reached` | API 키가 일일/월간/비율 제한에 도달했습니다. |
| `api:model_failover` | [중복](/ko/api/redundancy) 체인이 한 모델에서 다른 모델로 장애 조치되었습니다. |

알 수 없는 이벤트 이름에 대한 구독은 생성/업데이트 시 거부됩니다.

## 페이로드 봉투

모든 배송은 동일한 봉투를 공유합니다. `data` 개체는 이벤트별로 다릅니다.

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "api:model_failover",
  "created": 1705312200,
  "data": {
    "failedModel": "openai/gpt-5-nano",
    "reason": "timeout",
    "nextModel": "anthropic/claude-sonnet-4",
    "latencyMs": 30011,
    "userId": "60a7c8f5e8b4f5001f7a8c23",
    "apiKeyId": "6512ab..."
  }
}
```

## 테스트 배송

**테스트 이벤트 보내기** 버튼(또는 `POST /api/admin/webhooks/:id/test`)은 `webhook:test` 이벤트를 전달하므로 라이브로 전환하기 전에 수신자와 서명 확인을 확인할 수 있습니다.

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## 관련

- [Webhooks 개요](/ko/api/webhooks/overview) — 전달 형식, 서명 확인, 신뢰성.