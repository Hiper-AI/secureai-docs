---
sidebar_position: 3
title: "보안 정책"
openapi: "GET /smltp-policies"
---
# 보안 정책 가져오기

사용 가능한 SMLTP(Secure Model Language Transfer Protocol) 보안 정책을 검색합니다.

## 엔드포인트

```
GET /smltp-policies
```

## 설명

사용 가능한 SMLTP(Secure Model Language Transfer Protocol) 보안 정책을 검색합니다. 이러한 정책은 귀하의 데이터가 처리되고 보호되는 방식을 결정합니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true | `true` |
| `policies` | 배열 | 사용 가능한 보안 정책 목록 | 예 보기 |
| `restrictions` | 개체 | 정책 액세스 제한 | 예 보기 |

### 정책 개체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `id` | 문자열 | 고유 정책 식별자 | `"internal"` |
| `name` | 문자열 | 정책 표시 이름 | `"Internal"` |
| `description` | 문자열 | 정책 설명 | `"For internal company data"` |

### 제한 개체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `allowed_policies` | 배열 | 허용된 정책 ID 배열 | `["public", "internal", "confidential"]` |

## 오류 응답

### 401 승인되지 않음

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## 사용 예

### 자바스크립트/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

### 파이썬

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 정책 유형

### 공개
- **사용 사례**: 민감하지 않은 공개 데이터
- **보안 수준**: 낮음
- **데이터 처리**: 기본 보안을 갖춘 표준 처리

### 내부
- **사용 사례**: 회사 내부 데이터
- **보안 수준**: 중간
- **데이터 처리**: 추가 보호 장치로 보안 강화

### 기밀
- **사용 사례**: 기밀 비즈니스 데이터
- **보안 수준**: 높음
- **데이터 처리**: 엄격한 데이터 처리로 보안 극대화

## 메모

- 데이터 민감도에 따라 적절한 정책을 선택하세요.
- 정책은 데이터 처리 및 보호 방법에 영향을 미칩니다.
- 채팅 완료 요청에 정책 ID 사용
- 계정 유형에 따라 일부 정책이 제한될 수 있습니다.