---
sidebar_position: 2
title: "사용 가능한 기술 자료"
openapi: "GET /indexes"
---
# 사용 가능한 지식 베이스 얻기

API 키가 액세스할 수 있는 사용 가능한 기술 자료(색인)를 검색합니다.

## 엔드포인트

```
GET /indexes
```

## 설명

API 키가 액세스할 수 있는 사용 가능한 기술 자료(색인)를 검색합니다. 개인 색인, 공유 색인 및 영지식 옵션이 포함됩니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true | `true` |
| `indexes` | 배열 | 사용 가능한 기술 자료 목록 | 예 보기 |
| `restrictions` | 개체 | 인덱스 액세스 제한 | 예 보기 |

### 인덱스 객체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `id` | 문자열 | 고유 인덱스 식별자 | `"my-knowledge-base"` |
| `name` | 문자열 | 인덱스 표시 이름 | `"my-knowledge-base"` |
| `type` | 문자열 | 인덱스 유형 | `"personal"` |
| `namespace` | 문자열 | 인덱스 네임스페이스(선택 사항) | `"user-namespace"` |
| `description` | 문자열 | 인덱스 설명(선택 사항) | `"Direct AI responses..."` |

### 인덱스 유형

| 유형 | 설명 |
|------|-------------|
| `system` | 시스템 제공 인덱스(예: 영지식) |
| `personal` | 사용자의 개인 지식 기반 |
| `general` | 공유 지식 기반 |

### 제한 개체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `allowed_indexes` | 문자열 | 허용된 인덱스에 대한 설명 | `"all user indexes"` |

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
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

### 파이썬

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 특수 인덱스

### 영지식

`Zero-Knowledge` 인덱스는 지식베이스 검색 없이 직접적인 AI 응답을 제공하는 특수 시스템 인덱스입니다. 원할 때 이것을 사용하십시오:

- RAG가 없는 순수한 AI 응답
- AI 모델 기능 테스트
- 구체적인 맥락이 없는 일반적인 대화

## 메모

- 영지식 지수는 항상 이용 가능합니다.
- 개인 색인은 사용자가 생성합니다.
- 색인에 대한 액세스는 권한에 따라 다릅니다.
- 채팅 완료 요청 시 인덱스 ID를 사용하세요.