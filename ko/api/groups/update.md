---
id: update
title: "그룹 업데이트"
sidebar_label: "그룹 업데이트"
description: "기존 사용자 그룹 업데이트"
openapi: "PUT /groups/{groupId}"
---
# 그룹 업데이트

새로운 정보, 설명 또는 메타데이터로 기존 사용자 그룹을 업데이트합니다.

## 엔드포인트

```
PUT /groups/{groupId}
```

## 설명

이 끝점을 통해 관리자는 기존 사용자 그룹을 업데이트할 수 있습니다. 그룹 이름, 설명, 메타데이터 및 기타 속성을 수정할 수 있습니다. 그룹이 존재해야 하며 이를 업데이트하려면 적절한 권한이 있어야 합니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 경로 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `groupId` | 문자열 | 예 | 업데이트할 그룹의 고유 식별자 |

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 아니요 | 그룹의 새 이름 |
| `description` | 문자열 | 아니요 | 그룹에 대한 새로운 설명 |
| `users` | 배열 | 아니요 | 그룹에 할당할 사용자 ID 배열 |
| `status` | 문자열 | 아니요 | 그룹현황 |

## 요청 예시

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "message": "Group updated successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "status": "Active",
    "userCount": 3,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c27",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      }
    ],
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
| `group` | 개체 | 업데이트된 그룹 개체 |
| `group.id` | 문자열 | 고유 그룹 식별자 |
| `group.name` | 문자열 | 업데이트된 그룹 이름 |
| `group.description` | 문자열 | 업데이트된 그룹 설명 |
| `group.status` | 문자열 | 그룹현황 |
| `group.userCount` | 정수 | 그룹의 사용자 수 |
| `group.users` | 배열 | 그룹의 사용자 개체 배열 |
| `group.users[].id` | 문자열 | 사용자 ID |
| `group.users[].name` | 문자열 | 사용자 이름 |
| `group.users[].email` | 문자열 | 사용자 이메일 |
| `group.createdAt` | 문자열 | 원본 생성 타임스탬프 |
| `group.updatedAt` | 문자열 | 마지막 업데이트 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const updateGroup = async (groupId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/groups/${groupId}`, {
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
  name: "Updated Engineering Team",
  description: "Updated software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  status: "Active"
};

const result = await updateGroup('60a7c8f5e8b4f5001f7a8c25', updateData);
console.log('Updated group:', result.group);
```

### 파이썬

```python
import requests

def update_group(group_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/groups/{group_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
}

result = update_group("60a7c8f5e8b4f5001f7a8c25", update_data)
print("Updated group:", result["group"])
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/groups/60a7c8f5e8b4f5001f7a8c25" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name cannot be empty",
    "details": {
      "field": "name",
      "value": ""
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
    "message": "Cannot update this group"
  }
}
```

### 404 찾을 수 없음

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
  }
}
```

### 409 갈등

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

- **그룹 관리**: 그룹 정보 및 설명 업데이트
- **사용자 할당**: 그룹에 새 사용자를 할당합니다.
- **이름 변경**: 명확성을 높이기 위해 그룹 이름을 바꿉니다.
- **상태 업데이트**: 그룹 상태 변경
- **팀 업데이트**: 팀 구조 변경 시 그룹 정보 업데이트

## 속도 제한

- **기본값**: 분당 요청 50개
- **일일**: 일일 요청 5,000건
- **월간**: 월간 요청 150,000건

## 메모

- 이 엔드포인트는 관리자만 접근할 수 있습니다.
- 부분 업데이트: 변경하려는 필드만 포함
- 사용자 할당: 그룹에 새로운 사용자를 할당할 수 있습니다.
- 이름 확인: 그룹 이름은 고유해야 합니다.
- Flat Response: 응답이 데이터 개체 아래에 중첩되지 않습니다.
- 사용자 검증: 할당 전 사용자 ID를 검증합니다.
- `updatedAt` 타임스탬프가 자동으로 업데이트됩니다.