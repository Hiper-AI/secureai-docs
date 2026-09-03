---
id: list
title: "그룹 나열"
sidebar_label: "그룹 나열"
description: "모든 사용자 그룹 검색"
openapi: "GET /groups"
---
# 그룹 나열

페이지 매김 및 필터링 옵션을 사용하여 시스템의 모든 사용자 그룹 목록을 검색합니다.

## 엔드포인트

```
GET /groups
```

## 설명

이 엔드포인트는 SecureAI 시스템에서 사용 가능한 모든 사용자 그룹을 반환합니다. 구성원, 권한, 메타데이터를 포함하여 각 그룹에 대한 자세한 정보를 제공합니다. 이는 사용자 액세스 및 조직 구조를 관리하는 데 유용합니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `page` | 정수 | 아니요 | 1 | 페이지 매김을 위한 페이지 번호 |
| `limit` | 정수 | 아니요 | 20 | 페이지당 그룹 수(1-100) |
| `search` | 문자열 | 아니요 | - | 그룹 이름 또는 설명에 대한 검색어 |
| `status` | 문자열 | 아니요 | - | 그룹 상태로 필터링 |
| `sortBy` | 문자열 | 아니요 | 생성일자 | 정렬 기준 필드 |
| `sortOrder` | 문자열 | 아니요 | 설명 | 정렬 순서(오름차순, 내림차순) |

## 요청 예시

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `groups[]` | 배열 | 그룹 개체 배열 |
| `groups[].id` | 문자열 | 고유 그룹 식별자 |
| `groups[].name` | 문자열 | 그룹 이름 |
| `groups[].description` | 문자열 | 그룹 설명 |
| `groups[].status` | 문자열 | 그룹현황 |
| `groups[].userCount` | 정수 | 그룹의 사용자 수 |
| `groups[].users` | 배열 | 그룹의 사용자 개체 배열 |
| `groups[].users[].id` | 문자열 | 사용자 ID |
| `groups[].users[].name` | 문자열 | 사용자 이름 |
| `groups[].users[].email` | 문자열 | 사용자 이메일 |
| `groups[].createdAt` | 문자열 | 생성 타임스탬프 |
| `pagination` | 개체 | 페이지 매김 정보 |

## 사용 예

### 자바스크립트

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

### 파이썬

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

## 필터링 예

### 그룹 검색

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### 정렬 옵션

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### 페이지 매김

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## 사용 사례

- **그룹 관리**: 관리 목적으로 모든 그룹을 나열합니다.
- **사용자 조직**: 사용자 할당이 가능한 그룹을 검색합니다.
- **액세스 제어**: 그룹 권한 및 구성원 수 검토
- **보고**: 그룹 구조 및 구성원에 대한 보고서 생성
- **통합**: 애플리케이션 통합을 위한 그룹 검색

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 이 엔드포인트는 관리자만 접근할 수 있습니다.
- 페이지네이션: 오프셋이 아닌 페이지 매개변수 사용
- Flat Response: 응답이 데이터 개체 아래에 중첩되지 않습니다.
- 사용자 세부정보: 각 그룹 구성원의 전체 사용자 정보가 포함됩니다.
- 상태 필터: 그룹 상태별로 필터링 가능
- 검색 기능은 그룹 이름과 설명 전체에서 작동합니다.
- 정렬 옵션을 사용하면 다양한 기준에 따라 결과를 정리할 수 있습니다.