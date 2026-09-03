---
title: "청구 모드 API 키"
---
# 청구 모드 API 키

SecureAI는 API 키에 대해 두 가지 별도의 청구 모드를 지원하므로 관리자는 다양한 API 통합에 대해 사용량을 추적하고 청구하는 방법을 제어할 수 있습니다.

## 개요

API 키는 두 가지 청구 모드 중 하나로 구성될 수 있습니다.

- **사용자 완료**: 사용자의 라이선스 완료 버킷에서 차감됩니다.
- **모델별 사용량**: 실제 모델 사용량을 기준으로 사용자의 신용카드에 요금이 청구됩니다.

## 청구 모드

### 사용자 완료 모드

**기본 모드** - API 키는 기본적으로 이 모드를 사용합니다.

#### 작동 방식
- 사용자의 월별 라이선스 할당량에서 완료 횟수를 차감합니다.
- 웹 인터페이스와 동일한 완료 제한을 사용합니다.
- 사용자의 기존 라이선스 이상으로 추가 비용이 발생하지 않습니다.
- 사용 가능한 할당량이 없고 사용자가 모델별 사용량을 활성화한 경우 모델별 사용량으로 대체됩니다.

#### 사용 사례
- 기존 라이선스 할당을 사용하려는 내부 애플리케이션
- 개발 및 테스트 환경
- 예측 가능한 고정 비용을 원하는 애플리케이션
- 기존 라이센스 한도 내에서 유지하려는 경우

#### 구성
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### 모델 모드별 사용법

**고급 모드** - 명시적인 구성 및 사용자 권한이 필요합니다.

#### 작동 방식
- 실제 토큰 사용량과 모델 비용을 기준으로 과금
- 입력 토큰, 출력 토큰 및 총 토큰을 추적합니다.
- 모델별 가격을 기준으로 비용을 계산합니다.
- 사용자가 계정에서 모델별 사용량을 활성화해야 합니다.
- 구성 가능한 월별 달러 한도가 있습니다.

#### 사용 사례
- 정확한 비용 추적이 필요한 대용량 애플리케이션
- 고가 모델(GPT-5.x, Claude Opus/Sonnet 등)을 사용하는 애플리케이션
- 상세한 사용량 분석이 필요한 경우
- 사용한 만큼만 비용을 지불하고 싶은 애플리케이션

#### 구성
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## API 키 생성

### 결제 모드로 API 키 만들기

SecureAI 관리자 패널에서 API 키를 생성하고 구성합니다.

1. `Admin -> API Keys`로 이동합니다.
2. API 키를 생성하거나 편집합니다.
3. `billingMode`을 `user-completions` 또는 `usage-by-model`로 설정합니다.
4. 제한, 허용되는 모델, 허용되는 인덱스 및 허용되는 SMLTP 정책을 구성합니다.

### 결제 모드 확인

시스템은 청구 모드 요구 사항을 확인합니다.

- **모델별 사용량 모드**: 사용자가 모델별 사용량을 활성화해야 합니다.
- **사용자 완료 모드**: 모든 사용자와 함께 작동하지만 사용 가능한 할당량이 없는 경우 모델별 사용량으로 돌아갈 수 있습니다.

## 사용 추적

### 사용자 완료 추적

사용자 완료 모드의 경우 시스템은 다음을 추적합니다.
- 일일 및 월간 완료 횟수
- 모델별 사용 통계
- 할당량 소비 및 한도

### 모델 추적에 따른 사용량

모델별 사용량 모드의 경우 시스템은 다음을 추적합니다.
- 입력 토큰, 출력 토큰, 총 토큰
- 모델별 비용 및 포인트
- 월간 달러 지출
- 상세한 사용량 분석

## API 응답 예

### 사용자 완료 모드 응답

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### 모델 모드 응답별 사용법

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## 오류 처리

### 모델별 사용이 활성화되지 않음

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### 할당량 초과(사용자 완료)

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### 예산 초과(모델별 사용량)

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## 모범 사례

### 올바른 청구 모드 선택

1. **다음과 같은 경우 사용자 완성을 사용하세요.**
   - 예측 가능한 비용을 원하는 경우
   - 기존 라이선스 한도 내에 있습니다.
   - 내부 도구를 구축하고 있습니다.
   - 기존 할당량 할당을 사용하려는 경우

2. **다음과 같은 경우 모델별 사용량을 사용하세요.**
   - 상세한 비용 추적이 필요합니다.
   - 고가의 모델을 자주 사용하고 계십니다.
   - 실제 사용한 만큼만 비용을 지불하고 싶은 경우
   - 세분화된 사용량 분석이 필요합니다.

### 구성 권장 사항

1. **적절한 한도를 설정합니다.**
   - 속도 제어에 대한 일일 한도
   - 비용 관리를 위한 월별 한도
   - 모델 모드별 사용량에 대한 달러 한도

2. **모니터 사용량:**
   - API 키 사용을 정기적으로 추적
   - 한도에 가까워지면 알림을 설정하세요.
   - 월별 사용 패턴 검토

3. **보안 고려 사항:**
   - 민감한 애플리케이션에는 IP 제한 사용
   - 정기적으로 API 키 교체
   - 비정상적인 사용 패턴 모니터링

## 폴백 메커니즘

### 모델 대체에 따른 사용까지의 사용자 완료

User Completions API 키에서 할당량이 소진되면 시스템은 다음과 같은 경우 자동으로 모델별 사용량으로 대체됩니다.

1. **사용자의 계정 설정에서 모델별 사용이 활성화되어 있습니다**
2. 모델별 사용량 할당에 **사용자에게 사용 가능한 예산**이 있습니다.
3. **API 키는 대체를 허용합니다**(기본 동작)

#### 대체 프로세스

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### 유효성 검사 논리

#### 모델 요구 사항에 따른 사용

시스템은 모델별 사용량 청구를 허용하기 전에 다음 사항을 검증합니다.

1. **사용자 계정 설정**: 사용자는 "모델별 사용"을 활성화해야 합니다.
2. **월예산**: 사용자 할당에 사용 가능한 예산이 있어야 합니다.
3. **API 키 구성**: 모델별 사용을 위해 API 키를 구성하거나 대체를 허용해야 합니다.
4. **모델 액세스**: 사용자는 요청한 모델에 액세스할 수 있어야 합니다.

#### 혼합 청구 시나리오

결제 모드가 서로 다른 여러 API 키를 사용하는 경우:

- **사용자 완료 키**는 사용자의 월별 할당량에서 소비됩니다.
- **모델 키별 사용량**은 사용자의 예산 할당에서 소비됩니다.
- **대체 시나리오**는 사용자 완료를 먼저 우선순위로 지정한 다음 모델별 사용을 우선시합니다.
- **할당량 소진** 가능한 경우 자동 대체를 트리거합니다.

## 모드 간 마이그레이션

### 사용자 완성부터 모델별 활용까지

1. **모델별 사용량 활성화**: 사용자의 계정에서 모델별 사용량이 활성화되어 있는지 확인하세요.
2. **API 키 업데이트**: API 키 구성에서 결제 모드를 변경합니다.
3. **예산 한도 설정**: 적절한 월별 달러 한도 구성
4. **사용량 모니터링**: 완료 사용량과 예산 소비를 모두 추적합니다.
5. **폴백 테스트**: 대체 동작이 올바르게 작동하는지 확인합니다.

### 모델별 활용부터 사용자 완성까지

1. **할당량 확인**: 사용자의 월별 완료 할당량이 충분한지 확인하세요.
2. **API 키 업데이트**: API 키 구성에서 결제 모드를 변경합니다.
3. **사용량 모니터링**: 월별 한도를 기준으로 완료 소비량을 추적합니다.
4. **대체 구성**: 할당량이 소진된 경우 모델별 사용량에 대한 대체를 설정합니다.
5. **테스트 제한**: 할당량 제한이 제대로 적용되는지 확인하세요.

### 마이그레이션 모범 사례

- **점진적 마이그레이션**: 먼저 소량의 API 키로 테스트
- **두 지표 모두 모니터링**: 완료 사용량과 예산 소비를 모두 추적합니다.
- **적절한 제한 설정**: 두 모드 모두에 대해 현실적인 제한을 구성합니다.
- **문서 변경 사항**: 감사 목적으로 청구 모드 변경 사항을 추적합니다.
- **사용자 커뮤니케이션**: 청구 모드 변경 사항과 그 영향을 사용자에게 알립니다.

## 모니터링 및 분석

### 사용 분석

시스템은 두 가지 청구 모드에 대한 자세한 분석을 제공합니다.

- **사용자 완료**: 완료 횟수, 할당량 사용량, 모델 분포
- **모델별 사용량**: 토큰 수, 비용, 모델별 분석

### 관리자 패널 통합

관리자 패널은 다음을 제공합니다:
- 실시간 사용량 모니터링
- 과금 모드 구성
- 사용량 분석 및 보고서
- 비용 추적 및 알림

## 문제 해결

### 일반적인 문제

1. **모델별 사용이 작동하지 않음:**
   - 사용자가 모델별 사용을 활성화했는지 확인합니다.
   - 월별 달러 한도 확인
   - 적절한 모델 액세스 보장

2. **사용자 완료 할당량 문제:**
   - 사용자의 라이선스 등급을 확인하세요.
   - 월간 완료 한도 확인
   - 대체 수단으로 모델별 사용 활성화를 고려하세요.

3. **API 키 인증 오류:**
   - API 키가 활성화되어 있는지 확인
   - IP 제한 확인
   - 적절한 권한을 보장하세요.

### 지원

결제 모드 관련 문제:
1. 관리자 패널에서 사용 통계를 확인하세요.
2. API 키 구성 검토
3. 청구 방식 변경은 시스템 관리자에게 문의하세요.
4. 자세한 오류 정보를 보려면 로그를 모니터링하세요.