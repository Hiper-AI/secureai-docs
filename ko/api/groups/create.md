---
id: create
title: "그룹 만들기"
sidebar_label: "그룹 만들기"
description: "새 사용자 그룹 만들기"
openapi: "POST /groups"
---
# 그룹 생성

사용자를 구성하고 액세스 권한을 관리하기 위해 새 사용자 그룹을 만듭니다.

## 엔드포인트

```
POST /groups
```

## 설명

이 엔드포인트를 통해 관리자는 새 사용자 그룹을 생성할 수 있습니다. 그룹은 사용자를 구성하고, 권한을 관리하고, 시스템의 다양한 부분에 대한 액세스를 제어하는 ​​데 사용됩니다. 생성 중에 그룹 이름, 설명, 메타데이터를 지정할 수 있습니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 예 | 그룹 이름 |
| `description` | 문자열 | 예 | 그룹 설명 |
| `users` | 배열 | 아니요 | 그룹에 추가할 사용자 ID 배열 |
| `status` | 문자열 | 아니요 | 그룹 상태(기본값은 "활성") |

## 요청 예시

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## 성공 응답

**상태 코드**: `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
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
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `message` | 문자열 | 성공 메시지 |
| `group` | 개체 | 그룹 개체 생성 |
| `group.id` | 문자열 | 고유 그룹 식별자 |
| `group.name` | 문자열 | 그룹 이름 |
| `group.description` | 문자열 | 그룹 설명 |
| `group.status` | 문자열 | 그룹현황 |
| `group.userCount` | 정수 | 그룹의 사용자 수 |
| `group.users` | 배열 | 그룹의 사용자 개체 배열 |
| `group.users[].id` | 문자열 | 사용자 ID |
| `group.users[].name` | 문자열 | 사용자 이름 |
| `group.users[].email` | 문자열 | 사용자 이메일 |
| `group.createdAt` | 문자열 | 생성 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

### 파이썬

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
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
    "message": "Group name is required",
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

- **사용자 조직**: 그룹을 생성하여 부서별, 기능별로 사용자를 구성합니다.
- **접근 제어**: 권한 및 접근 관리를 위한 그룹 설정
- **팀 관리**: 다양한 팀이나 프로젝트를 위한 그룹 생성
- **보고**: 보고 및 분석을 위해 사용자 구성
- **통합**: 타사 시스템 통합을 위한 그룹 생성

## 속도 제한

- **기본값**: 분당 요청 50개
- **일일**: 일일 요청 5,000건
- **월간**: 월간 요청 150,000건

## 메모

- 이 엔드포인트는 관리자만 접근할 수 있습니다.
- 필수항목 : 이름, 설명 모두 필수입니다.
- 사용자 할당: 그룹 생성 시 사용자를 그룹에 할당할 수 있습니다.
- 상태: 지정되지 않은 경우 기본값은 "활성"입니다.
- 검증: 할당 전에 사용자 ID를 검증합니다.
- Flat Response: 응답이 데이터 개체 아래에 중첩되지 않습니다.
- 그룹 생성 후 즉시 사용 가능