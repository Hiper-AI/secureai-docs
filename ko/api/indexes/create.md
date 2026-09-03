---
id: create
title: "인덱스 생성"
sidebar_label: "인덱스 생성"
description: "새 기술 자료 색인 만들기"
openapi: "POST /indexes/all"
---
# 인덱스 생성

문서를 저장하고 검색하기 위한 새로운 기술 자료 색인을 만듭니다.

## 엔드포인트

```
POST /indexes
```

## 설명

이 끝점을 통해 관리자는 새로운 기술 자료 색인을 생성할 수 있습니다. 인덱스는 특정 사용자나 그룹에 할당될 수 있습니다. 관리자만 인덱스를 생성할 수 있습니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 예 | 인덱스 이름 |
| `assignedUser` | 문자열 | 아니요 | 인덱스를 할당할 사용자 ID(MongoDB ObjectId) |
| `assignedGroup` | 문자열 | 아니요 | 인덱스를 할당할 그룹 ID(MongoDB ObjectId) |
| `sharedIndexName` | 문자열 | 아니요 | 공유 인덱스 이름(기본값은 이름) ​​|
| `namespace` | 문자열 | 아니요 | 인덱스의 네임스페이스(제공되지 않은 경우 자동 생성) |
| `region` | 문자열 | 아니요 | 저장을 위한 지역 힌트(선택 사항) |
| `cloud` | 문자열 | 아니요 | 클라우드 공급자 힌트(선택 사항) |


## 요청 예시

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## 성공 응답

**상태 코드**: `201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `message` | 문자열 | 성공 메시지 |
| `index` | 개체 | 인덱스 객체 생성 |
| `index.id` | 문자열 | 고유 인덱스 식별자 |
| `index.name` | 문자열 | 인덱스 이름 |
| `index.sharedIndexName` | 문자열 | 공유 인덱스 이름 |
| `index.namespace` | 문자열 | 인덱스 네임스페이스 |
| `index.type` | 문자열 | 인덱스 유형(개인, 일반, 그룹, 알 수 없음) |
| `index.assignedUser` | 개체 | 할당된 사용자 정보(개인인 경우) |
| `index.assignedGroup` | 개체 | 배정된 그룹 정보(그룹인 경우) |
| `index.createdAt` | 문자열 | 생성 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

### 파이썬

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## 검증 및 비즈니스 규칙

- **인덱스 이름 정규화**(저장 및 고유성 확인용):
  - 소문자, 공백 제거
  - 공백을 하이픈으로 교체
  - `[a-z0-9-]`에 없는 문자를 제거합니다.
- **인덱스 이름 유효성 검사**: `^[a-z0-9-]{3,50}$`과 일치해야 합니다. 그렇지 않으면 400을 반환합니다.
- **고유성**: 정규화된 `name`은 고유해야 합니다. 중복은 409를 반환합니다.
- **할당된 사용자 할당량**: `assignedUser`가 제공되면 `checkUserIndexQuota`을 통해 사용자 인덱스 할당량을 적용합니다. 할당량을 초과하면 403이 반환됩니다.
- **지역 제한(필수)**: `Essential` 라이센스의 경우 인덱스는 `cloud=aws` 및 `region=us-east-1`로만 생성할 수 있습니다. 그렇지 않으면 403.
- **할당된 그룹**: `assignedGroup`이 제공되면 그룹이 존재해야 하며 보관되지 않아야 합니다(`status != 'Archived'`). 그렇지 않으면 400.

## 정규화 및 저장

- `name`는 정규화되어 저장됩니다.
- `sharedIndexName`은 기본적으로 정규화된 `name`로 설정됩니다.
- `namespace`는 사용자에게 할당되면 기본값은 `user-{userId}-index-{normalizedName}`입니다.

## 일반적인 오류 형태

### 400 잘못된 인덱스 이름

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 인덱스 할당량이 초과되었습니다.

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 지역이 허용되지 않음

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
}
```

### 400 그룹이 유효하지 않음/비활성화

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
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
    "message": "Cannot create general indexes without admin privileges"
  }
}
```

### 409 갈등

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## 인덱스 유형

| 유형 | 설명 | 필요한 권한 |
|------|-------------|-------|
| `personal` | 개인이 사용할 수 있는 개인 색인 | 관리자 권한 |
| `general` | 공유조직지수 | 관리자 권한 |
| `group` | 그룹 할당 인덱스 | 관리자 권한 |

## 필수 입력사항

| 필드 | 설명 | 예 |
|-------|-------------|----------|
| `name` | 인덱스 이름 | "내 지식 기반" |
| `region` | AWS 지역 | "us-east-1" |
| `cloud` | 클라우드 제공자 | "아우" |

## 사용 사례

- **사용자 할당**: 인덱스를 생성하고 특정 사용자에게 할당
- **그룹 할당**: 인덱스를 생성하고 그룹에 할당
- **지식 베이스**: 특정 도메인에 대한 전문 지식 베이스 구축
- **콘텐츠 정리**: 주제나 카테고리별로 콘텐츠를 정리합니다.
- **벡터 저장소**: 벡터 임베딩을 저장하고 검색하기 위한 인덱스 생성

## 속도 제한

- **기본값**: 분당 요청 50개
- **일일**: 일일 요청 5,000건
- **월간**: 월간 요청 150,000건

## 메모

- 이 엔드포인트는 관리자만 접근할 수 있습니다.
- 필수항목 : 이름, 지역, 클라우드 모두 필수입니다.
- 할당: 사용자(AssignedUser) 또는 그룹(AssignedGroup)에 인덱스를 할당할 수 있습니다.
- 자동 생성: 네임스페이스가 제공되지 않으면 자동 생성됩니다.
- 고유 이름: 인덱스 이름은 시스템 전체에서 고유해야 합니다.
- 인덱스 생성 후 즉시 사용 가능
- 차원: 벡터 차원은 애플리케이션에서 내부적으로 관리됩니다(현재 4096).
- 메트릭: 유사성 메트릭은 애플리케이션에서 내부적으로 관리됩니다.