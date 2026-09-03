---
id: active
title: "활성 SMLTP 정책"
sidebar_label: "활성 SMLTP 정책"
description: "현재 활성 SMLTP 정책 검색"
openapi: "GET /smltp-policies/active"
---
# 활성 SMLTP 정책

귀하의 계정에 대해 현재 활성화된 SMLTP(Secure Model Language Transfer Protocol) 정책을 검색하십시오.

## 엔드포인트

```
GET /smltp-policies/active
```

## 설명

현재 활성 SMLTP 정책 구성을 검색합니다. **관리자 전용 액세스가 필요합니다.**

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 요청 예시

```bash
GET /smltp-policies/active
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `data` | 개체 | 응답 데이터 개체 |
| `data.template` | 문자열 | 현재 활성 정책 템플릿 ID |
| `data.policy` | 개체 | 현재 정책 구성 개체 |
| `data.lastUpdated` | 문자열 | 마지막 업데이트 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

### 파이썬

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
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


## 사용 사례

- **정책 검토**: 현재 활성화된 정책 템플릿을 확인합니다.
- **구성 확인**: 현재 정책 구성을 검토합니다.
- **템플릿 관리**: 어떤 정책 템플릿이 사용되고 있는지 이해합니다.
- **문제 해결**: 현재 정책 설정 이해
- **감사 준비**: 규정 준수 감사를 위한 활성 정책 검토

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 이 엔드포인트에는 관리자 권한이 필요합니다.
- 단일 정책: 현재 활성화된 정책 템플릿 및 구성을 반환합니다.
- 배열 없음: 정책 배열을 반환하지 않고 활성 정책만 반환합니다.
- 템플릿 ID: 현재 활성화된 정책 템플릿을 표시합니다.
- Policy Config: 실제 정책 구성 객체를 반환합니다.
- 중첩된 응답: 응답이 데이터 개체 아래에 중첩되어 있습니다.