---
id: policies
title: "SMLTP 정책"
sidebar_label: "SMLTP 정책"
description: "모든 SMLTP 보안 정책 검색"
openapi: "GET /smltp-policies/all"
---
# SMLTP 정책

사용 가능한 모든 SMLTP(Secure Model Language Transfer Protocol) 보안 정책을 검색합니다.

## 엔드포인트

```
GET /smltp-policies/all
```

## 설명

기본 제공 정책과 사용자 지정 정책을 포함하여 사용 가능한 모든 SMLTP 정책을 검색합니다. **관리자 전용 액세스가 필요합니다.**

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
❌ 쿼리 매개변수가 지원되지 않습니다. 실제 API는 쿼리 매개변수를 허용하지 않습니다.

## 요청 예시

```bash
GET /smltp-policies/all
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `data` | 개체 | 응답 데이터 개체 |
| `data.builtInPolicies` | 배열 | 기본 제공 정책 개체 배열 |
| `data.customPolicies` | 배열 | 사용자 정의 정책 객체 배열 |
| `data.activePolicyTemplate` | 문자열 | 현재 활성 정책 템플릿 ID |
| `data.summary` | 개체 | 요약통계 |
| `data.summary.totalPolicies` | 정수 | 총 정책 수 |
| `data.summary.builtInCount` | 정수 | 기본 제공 정책 수 |
| `data.summary.customCount` | 정수 | 사용자 정의 정책 수 |

## 사용 예

### 자바스크립트

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

### 파이썬

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 오류 응답

### 401 승인되지 않음

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 요청이 너무 많습니다.

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

## 정책 개체 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `id` | 문자열 | 정책 식별자 |
| `name` | 문자열 | 정책 이름 |
| `type` | 문자열 | 정책 유형("기본 제공" 또는 "사용자 지정") |
| `description` | 문자열 | 정책 설명 |
| `isActive` | 부울 | 이 정책이 현재 활성화되어 있는지 여부 |
| `createdAt` | 문자열 | 생성 타임스탬프(사용자 지정 정책에만 해당) |

## 사용 사례

- **정책 검색**: 사용 가능한 보안 정책 찾기
- **규정 준수 계획**: 정책 요구 사항 이해
- **보안 구성**: 적절한 정책 선택
- **활성 정책 관리**: 현재 어떤 정책이 활성화되어 있는지 확인
- **통합**: 채팅 완료에 정책 적용

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 이 엔드포인트에는 관리자 권한이 필요합니다.
- 매개변수 없음: 쿼리 매개변수가 지원되지 않습니다.
- 내장 정책: 사전 정의된 시스템 정책을 반환합니다.
- 사용자 정의 정책: 사용자 정의 정책이 있는 경우 이를 반환합니다.
- 활성 정책: 현재 활성화된 정책 템플릿을 표시합니다.
- Flat Response: 응답이 데이터 개체 아래에 중첩됩니다.