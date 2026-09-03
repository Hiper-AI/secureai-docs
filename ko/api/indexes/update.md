---
id: update
title: "색인 업데이트"
sidebar_label: "색인 업데이트"
description: "기존 기술 자료 색인 업데이트"
openapi: "PUT /indexes/{indexId}"
---
# 인덱스 업데이트

새로운 설정, 메타데이터 또는 구성으로 기존 기술 자료 색인을 업데이트합니다.

## 엔드포인트

```
PUT /indexes/{indexId}
```

## 설명

이 끝점을 통해 관리자는 기존 기술 자료 색인을 업데이트할 수 있습니다. 인덱스 이름을 수정하고 이를 다른 사용자 또는 그룹에 다시 할당할 수 있습니다. 관리자만 인덱스를 업데이트할 수 있습니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 경로 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `indexId` | 문자열 | 예 | 업데이트할 인덱스의 고유 식별자 |

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 아니요 | 인덱스의 새 이름 |
| `assignedUser` | 문자열 | 아니요 | 인덱스를 할당할 사용자 ID(MongoDB ObjectId) |
| `assignedGroup` | 문자열 | 아니요 | 인덱스를 할당할 그룹 ID(MongoDB ObjectId) |


## 요청 예시

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `message` | 문자열 | 성공 메시지 |
| `index` | 개체 | 업데이트된 인덱스 개체 |
| `index.id` | 문자열 | 고유 인덱스 식별자 |
| `index.name` | 문자열 | 업데이트된 인덱스 이름 |
| `index.sharedIndexName` | 문자열 | 공유 인덱스 이름 |
| `index.namespace` | 문자열 | 인덱스 네임스페이스 |
| `index.type` | 문자열 | 인덱스 유형(개인, 일반, 그룹, 알 수 없음) |
| `index.assignedUser` | 개체 | 할당된 사용자 정보(개인인 경우) |
| `index.assignedGroup` | 개체 | 배정된 그룹 정보(그룹인 경우) |
| `index.createdAt` | 문자열 | 원본 생성 타임스탬프 |
| `index.updatedAt` | 문자열 | 마지막 업데이트 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  return await response.json();
};

// Example usage
const updateData = {
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

### 파이썬

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## 검증 및 비즈니스 규칙

- **사용자에게 할당(`assignedUser`)**:
  - 개인으로 전환하거나 담당자를 변경할 때 `checkUserIndexQuota`을 통해 사용자 인덱스 할당량을 적용합니다. 할당량을 초과하면 403이 반환됩니다.
- **그룹에 할당(`assignedGroup`)**:
  - 그룹이 존재하고 활성 상태여야 합니다(`status != 'Archived'`). 유효하지 않은/비활성 그룹은 400을 반환합니다.

## 정규화 및 저장

- 이름을 바꾸면 `name`은 계속해서 정규화되어 저장됩니다. `sharedIndexName` 명시적으로 설정되지 않은 경우 기본값은 정규화된 이름입니다.

## 일반적인 오류 형태

### 403 인덱스 할당량이 초과되었습니다.

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
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
    "message": "Cannot update this index"
  }
}
```

### 404 찾을 수 없음

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
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

## 업데이트 가능한 필드

| 필드 | 설명 | 메모 |
|-------|-------------|-------|
| `name` | 인덱스 이름 | 시스템 전체에서 고유해야 합니다 |
| `assignedUser` | 사용자 할당 | 특정 사용자에게 인덱스 할당 |
| `assignedGroup` | 그룹 과제 | 특정 그룹에 인덱스 할당 |

## 사용 사례

- **이름 변경**: 더 나은 구성을 위해 색인 이름을 바꿉니다.
- **사용자 할당**: 인덱스를 다른 사용자에게 재할당
- **그룹 할당**: 인덱스를 다른 그룹에 재할당
- **소유권 이전**: 사용자간 인덱스 소유권 변경

## 속도 제한

- **기본값**: 분당 요청 50개
- **일일**: 일일 요청 5,000건
- **월간**: 월간 요청 150,000건

## 메모

- 이 엔드포인트는 관리자만 접근할 수 있습니다.
- 제한된 필드: 이름, 지정사용자, 지정그룹만 업데이트 가능
- 할당 논리: 사용자에게 할당하면 그룹 할당이 지워지고 그 반대의 경우도 마찬가지입니다.
- 검증: 할당 전에 사용자 및 그룹 ID를 검증합니다.
- 설정 없음: 설정, 메타데이터 또는 기타 구성을 업데이트할 수 없습니다.
- `updatedAt` 타임스탬프가 자동으로 업데이트됩니다.
- 인덱스 이름은 시스템 전체에서 고유해야 합니다.