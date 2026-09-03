---
id: create
title: "SMLTP 정책 생성"
sidebar_label: "SMLTP 정책 생성"
description: "새 SMLTP 보안 정책 만들기"
openapi: "POST /smltp-policies/active"
---
# SMLTP 정책 생성

계정에 대한 새 SMLTP(Secure Model Language Transfer Protocol) 보안 정책을 만듭니다.

## 엔드포인트

```
POST /smltp-policies
```

## 설명

새 사용자 지정 SMLTP 정책을 만듭니다. 관리자 전용 액세스가 필요합니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 예 | 정책 이름 |
| `description` | 문자열 | 예 | 정책 설명 |
| `policy` | 개체 | 예 | 정책 구성 개체 |
| `setAsActive` | 부울 | 아니요 | 해당 정책을 즉시 활성화할지 여부(기본값: false) |

## 요청 예시

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## 성공 응답

**상태 코드**: `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `message` | 문자열 | 성공 메시지 |
| `policy` | 개체 | 정책 객체 생성 |
| `policy.id` | 문자열 | 정책 식별자(이름에서 생성됨) |
| `policy.name` | 문자열 | 정책 이름 |
| `policy.description` | 문자열 | 정책 설명 |
| `policy.type` | 문자열 | 정책 유형("사용자 정의") |
| `policy.isActive` | 부울 | 정책이 현재 활성화되어 있는지 여부 |
| `policy.createdAt` | 문자열 | 생성 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

### 파이썬

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

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

### 403 금지됨

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 갈등

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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

- **맞춤형 보안**: 필요에 맞는 정책 생성
- **규정 준수**: 특정 규제 요구 사항 구현
- **위험 관리**: 위험 완화를 위한 보안 조치 정의
- **데이터 보호**: 개인정보 보호 및 데이터 처리 규칙 설정
- **정책 관리**: 맞춤형 SMLTP 정책 생성 및 관리

## 속도 제한

- **기본값**: 분당 요청 50개
- **일일**: 일일 요청 5,000건
- **월간**: 월간 요청 150,000건

## 메모

- 이 엔드포인트에는 관리자 권한이 필요합니다.
- 필수항목 : 이름, 설명, 정책을 필수로 입력해주세요.
- 정책 ID : 이름으로 생성(소문자, 공백은 하이픈)
- 고유 이름: 정책 이름은 고유해야 합니다.
- 활성 설정: 선택적으로 즉시 활성으로 설정할 수 있습니다.
- Flat Response: 응답이 데이터 개체 아래에 중첩되지 않습니다.