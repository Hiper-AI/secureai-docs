---
title: "청구 모드 빠른 참조"
---
# 청구 모드 빠른 참조

사용자 완료 및 모델별 사용량 청구 모드 중에서 선택하기 위한 빠른 비교 가이드입니다.

## 빠른 비교

| 기능 | 사용자 완료 | 모델별 사용량 |
|---------|------|---|
| **기본 모드** | ✅ 예 | ❌ 아니요 |
| **비용 구조** | 고정(라이센스 할당량) | 변수(토큰별) |
| **사용자 권한** | 필요하지 않음 | 활성화되어야 합니다 |
| **비용 추적** | 완료 횟수 | 토큰 수 + 비용 |
| **최고의 대상** | 예측 가능한 비용 | 대용량 사용량 |
| **대체 지원** | ✅ 예 | ❌ 아니요 |

## 각 모드를 사용하는 경우

### 사용자 완료 모드

**다음과 같은 경우에 이것을 선택하세요:**
- ✅ 예측 가능하고 고정된 비용을 원합니다.
- ✅ 기존 라이선스 한도 내에 있습니다.
- ✅ 내부 도구를 구축하고 있습니다.
- ✅ 기존 할당량 할당을 사용하려는 경우
- ✅간편한 비용관리가 필요하신 분

**예시 사용 사례:**
- 내부 챗봇
- 개발 및 테스트
- 저용량 애플리케이션
- 고정예산 프로젝트

### 모델 모드별 사용법

**다음과 같은 경우에 이것을 선택하세요:**
- ✅ 자세한 비용 추적이 필요합니다
- ✅ 고가의 모델을 자주 사용하고 계십니다.
- ✅실제 사용량에 대해서만 비용을 지불하고 싶습니다.
- ✅ 세분화된 사용량 분석이 필요합니다.
- ✅ 대량 요구사항이 있는 경우

**예시 사용 사례:**
- 생산 응용
- 대용량 AI 서비스
- 비용에 민감한 프로젝트
- 다중 모델 애플리케이션

## API 사용법

결제 모드로 외부 API를 사용하는 경우:

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## 속도 제한

### 기본 속도 제한
- **분당 요청 수**: 60(구성 가능)
- **시간당 요청**: 1,000(구성 가능)
- **일일 한도**: 요청 100개(구성 가능)
- **월 한도**: 요청 10,000건(구성 가능)

### 청구 모드별 한도
- **사용자 완료**: 라이선스 할당량 기준
- **모델별 사용량**: 달러 기준 추가 한도

## SMLTP 정책 통합

두 청구 모드 모두 SMLTP 정책 시행을 지원합니다.

| 정책 | 설명 | 사용 사례 |
|---------|-------------|----------|
| `public` | 민감하지 않은 데이터의 경우 | 공개 애플리케이션 |
| `internal` | 회사 데이터 | 내부 도구 및 프로세스 |
| `confidential` | 민감한 정보의 경우 | 제한된 접근 신청 |

### SMLTP 구성 예

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## 구성 예

### 사용자 완료 구성

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### 모델 구성별 사용량

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## 오류 시나리오

### 사용자 완료 오류

| 오류 | 원인 | 솔루션 |
|---------|-------|----------|
| `Completion limit exceeded` | 월별 할당량 도달 | 모델별 사용량 활성화 또는 할당량 늘리기 |
| `Daily limit exceeded` | 일일 한도 도달 | 재설정 대기 또는 한도 증가 |
| `User not found` | 잘못된 사용자 ID | 사용자가 존재하는지 확인 |

### 모델 오류에 따른 사용법

| 오류 | 원인 | 솔루션 |
|---------|-------|----------|
| `Usage by Model required` | 사용자가 활성화하지 않았습니다 | 사용자에 대한 모델별 사용 활성화 |
| `Usage by Model budget exceeded` | 월예산 도달 | 달러 한도 증가 |
| `Invalid billing mode` | 잘못된 모드가 지정되었습니다 | `"usage-by-model"` 또는 `"user-completions"` 사용 |

## 마이그레이션 가이드

### 사용자 완성부터 모델별 활용까지

1. **사용자에 대한 모델별 사용 활성화**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **API 키 구성 업데이트**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **사용량 및 비용 모니터링**
   - 토큰 사용 추적
   - 월간 지출 모니터링
   - 필요에 따라 한도를 조정합니다.

### 모델별 활용부터 사용자 완성까지

1. **사용자에게 할당량이 충분한지 확인**
   - 라이선스 등급 확인
   - 월 한도 확인

2. **API 키 구성 업데이트**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **완료 사용량 모니터링**
   - 트랙 완료 횟수
   - 대체 동작이 작동하는지 확인

## 비용 추정

### 사용자 완료 비용

- **고정 비용**: 라이선스 등급에 따라 다름
- **추가 비용 없음**: 기존 라이선스 이상
- **예측 가능**: 웹 인터페이스 사용법과 동일

### 모델 비용별 사용량

- **가변 비용**: 토큰 사용량에 따라 다름
- **모델별 가격**: 모델별로 요금이 다름
- **예시 비용**:
  - GPT-5.1: 공급자 가격이 적용됩니다.
  - Claude Sonnet 4.6: 공급자 가격 적용
  - GPT-5 Nano: 공급자 가격이 적용됩니다.

## 모니터링 팁

### 사용자 완료 모니터링

- 매일 완료 횟수를 추적합니다.
- 할당량 소비 모니터링
- 한도에 가까워지면 알림을 설정하세요.
- 월별 사용 패턴 검토

### 모델 모니터링에 따른 사용량

- 토큰 사용량 및 비용 추적
- 월간 지출 모니터링
- 달러 한도 알림 설정
- 모델별 비용 내역 검토

## 보안 고려 사항

### 두 모드 모두

- 민감한 앱에는 IP 제한 사용
- 정기적으로 API 키 교체
- 비정상적인 활동 모니터링
- 적절한 오류 처리 구현

### 모델별 용도

- 적절한 달러 한도 설정
- 비용 급증 모니터링
- 모델 사용 패턴 검토
- 비용이 많이 드는 모델 사용 추적

## 지원 리소스

### 문서
- [결제 모드 개요](../billing-modes.md)
- [한도 및 할당량](/ko/api/limits-and-quotas) - 플랫폼 한도 이해

### 관리자 패널
- **API 섹션**: API 키 생성 및 관리
- **사용자 섹션**: 모델별 사용 활성화

### 일반적인 문제
1. **모델별 사용 불가**: 사용자 권한 확인
2. **할당량 초과**: 모델별 사용량을 활성화하거나 제한을 늘립니다.
3. **비용 급증**: 모델 사용량 검토 및 제한 설정
4. **인증 오류**: API 키 및 권한 확인