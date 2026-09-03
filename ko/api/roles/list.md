---
id: list
title: "역할 나열"
sidebar_label: "역할 나열"
description: "사용 가능한 모든 사용자 역할 검색"
openapi: "GET /roles"
---
# 역할 나열

SecureAI 시스템에서 사용 가능한 모든 사용자 역할을 검색합니다.

## 엔드포인트

```
GET /roles
```

## 설명

이 엔드포인트는 SecureAI 시스템에서 사용 가능한 모든 사용자 역할을 반환합니다. 권한, 설명, 메타데이터를 포함하여 각 역할에 대한 자세한 정보를 제공합니다. 이는 사용 가능한 역할과 해당 기능을 이해하는 데 유용합니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `page` | 정수 | 아니요 | 1 | 페이지 매김을 위한 페이지 번호(기본값: 1) |
| `limit` | 정수 | 아니요 | 20 | 페이지당 역할 수(기본값: 20) |
| `search` | 문자열 | 아니요 | - | 이름, 표시 이름 또는 설명에 대한 검색어 |
| `isSystem` | 문자열 | 아니요 | - | 시스템 역할별 필터링(true/false) |
| `sortBy` | 문자열 | 아니요 | 생성일자 | 정렬 기준 필드(기본값: "createdAt") |
| `sortOrder` | 문자열 | 아니요 | 설명 | 정렬 순서(asc/desc, 기본값: "desc") |

## 요청 예시

```bash
GET /roles?page=1&limit=10&search=admin
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `roles` | 배열 | 역할 개체 배열 |
| `roles[].id` | 문자열 | 고유한 역할 식별자 |
| `roles[].name` | 문자열 | 역할 이름 |
| `roles[].displayName` | 문자열 | 역할의 표시 이름 |
| `roles[].description` | 문자열 | 역할 설명 |
| `roles[].isSystem` | 부울 | 시스템 역할인지 여부 |
| `roles[].hasAdminPanelAccess` | 부울 | 역할에 관리자 패널 액세스 권한이 있는지 여부 |
| `roles[].permissions` | 배열 | 권한 개체 배열 |
| `roles[].permissions[].section` | 문자열 | 권한 섹션 |
| `roles[].permissions[].level` | 문자열 | 권한 수준 |
| `roles[].canInteractWithAI` | 부울 | 역할이 AI와 상호작용할 수 있는지 여부 |
| `roles[].canUseChat` | 부울 | 역할이 채팅을 사용할 수 있는지 여부 |
| `roles[].userCount` | 정수 | 이 역할을 가진 사용자 수 |
| `roles[].createdBy` | 개체 | 역할을 생성한 사용자 |
| `roles[].createdBy.id` | 문자열 | 작성자 사용자 ID |
| `roles[].createdBy.name` | 문자열 | 크리에이터 이름 |
| `roles[].createdBy.email` | 문자열 | 크리에이터 이메일 |
| `roles[].createdAt` | 문자열 | 생성 타임스탬프 |
| `roles[].updatedAt` | 문자열 | 마지막 업데이트 타임스탬프 |
| `pagination` | 개체 | 페이지 매김 정보 |
| `pagination.page` | 정수 | 현재 페이지 번호 |
| `pagination.limit` | 정수 | 페이지당 항목 |
| `pagination.total` | 정수 | 총 역할 수 |
| `pagination.pages` | 정수 | 총 페이지 수 |

## 사용 예

### 자바스크립트

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

### 파이썬

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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

- **역할 관리**: 사용자 할당에 사용 가능한 모든 역할을 나열합니다.
- **권한 검토**: 각 역할에 어떤 권한이 있는지 이해합니다.
- **액세스 제어**: 사용 가능한 역할을 기반으로 사용자 액세스 계획
- **사용자 할당**: 필요에 따라 사용자에게 역할을 할당합니다.
- **역할 분석**: 역할 활용 및 사용자 분포 분석

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 이 엔드포인트에는 관리자 권한이 필요합니다.
- 페이지 기반 페이지네이션: 오프셋이 아닌 페이지 매개변수 사용
- 검색: 이름, 표시이름, 설명 필드에서 검색합니다.
- 시스템 역할: 시스템과 사용자 정의 역할을 기준으로 필터링할 수 있습니다.
- 정렬: 모든 필드를 오름차순 또는 내림차순으로 정렬할 수 있습니다.
- Flat Response: 응답이 데이터 개체 아래에 중첩되지 않습니다.
- 사용자 수: 각 역할을 맡은 사용자 수를 나타냅니다.
- 작성자 정보: 각 역할을 만든 사람이 표시됩니다.