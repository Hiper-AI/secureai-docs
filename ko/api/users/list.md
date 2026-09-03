---
sidebar_position: 1
title: "모든 사용자 가져오기"
openapi: "GET /users"
---
# 모든 사용자 얻기

페이지 매김 및 필터링을 통해 모든 사용자를 검색합니다. 관리자만 액세스할 수 있습니다.

## 엔드포인트

```
GET /users
```

## 설명

이 끝점을 통해 관리자는 시스템에 있는 모든 사용자의 페이지가 매겨진 목록을 검색할 수 있습니다. 역할, 라이선스, 상태, 검색어 등 다양한 기준으로 필터링을 지원합니다. 이는 적절한 권한이 필요한 관리 끝점입니다.

## 인증

필수입니다. Authorization 헤더에 API 키를 포함하세요.

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청

### 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 기본값 | 설명 |
|------------|------|----------|---------|------------|
| `page` | 정수 | 아니요 | 1 | 페이지 매김을 위한 페이지 번호 |
| `limit` | 정수 | 아니요 | 20 | 페이지당 사용자 수(1-100) |
| `search` | 문자열 | 아니요 | - | 이름, 이메일 또는 사용자 이름에 대한 검색어 |
| `role` | 문자열 | 아니요 | - | 사용자 역할(관리자, 사용자, globalReader)별로 필터링 |
| `license` | 문자열 | 아니요 | - | 사용자 라이센스별로 필터링(Essential, Growth, Ultra, Early Access) |
| `status` | 정수 | 아니요 | - | 사용자 상태별 필터링(0=비활성, 1=활성) |
| `sortBy` | 문자열 | 아니요 | 생성일자 | 정렬 기준 필드 |
| `sortOrder` | 문자열 | 아니요 | 설명 | 정렬 순서(오름차순, 내림차순) |

### 예시 요청

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

검색:

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 `true` |
| `users` | 배열 | 사용자 개체 배열 |
| `users[].id` | 문자열 | 사용자의 고유 식별자 |
| `users[].name` | 문자열 | 사용자 이름 |
| `users[].username` | 문자열 | 사용자의 사용자 이름 |
| `users[].email` | 문자열 | 사용자의 이메일 주소 |
| `users[].role` | 문자열 | 사용자 역할(관리자, 사용자, globalReader) |
| `users[].license` | 문자열 | 사용자 라이선스 등급(Essential, Growth, Ultra, Early Access) |
| `users[].status` | 정수 | 사용자 상태(0=비활성, 1=활성) |
| `users[].isVerified` | 부울 | 사용자 확인 여부 |
| `users[].setupCompleted` | 부울 | 사용자 설정 완료 여부 |
| `users[].authType` | 문자열 | 인증 유형(기본, auth0) |
| `users[].mfaEnabled` | 부울 | MFA 활성화 여부 |
| `users[].customRole` | 개체 | 사용자 정의 역할 정보(할당된 경우) |
| `users[].customRole.id` | 문자열 | 사용자 정의 역할 ID |
| `users[].customRole.name` | 문자열 | 사용자 정의 역할 이름 |
| `users[].customRole.displayName` | 문자열 | 사용자 정의 역할 표시 이름 |
| `users[].createdAt` | 문자열 | 사용자 생성 타임스탬프 |
| `users[].updatedAt` | 문자열 | 사용자 마지막 업데이트 타임스탬프 |
| `users[].lastActive` | 문자열 | 사용자의 마지막 활동 타임스탬프 |
| `pagination` | 개체 | 페이지 매김 정보 |
| `pagination.page` | 정수 | 현재 페이지 번호 |
| `pagination.limit` | 정수 | 페이지당 항목 |
| `pagination.total` | 정수 | 총 사용자 수 |
| `pagination.pages` | 정수 | 총 페이지 수 |

## 사용 예

### 자바스크립트

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

### 파이썬

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 오류 응답

### 401 승인되지 않음

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 금지됨

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## 필터링 예

### 이름이나 이메일로 검색

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 역할별 필터링

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 라이선스로 필터링

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 상태별 필터링

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 마지막 활성순으로 정렬

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 사용 사례

- **사용자 관리**: 시스템 내 모든 사용자를 조회하고 관리합니다.
- **사용자 분석**: 역할별, 라이선스별, 상태별 사용자 분포 분석
- **검색 및 필터링**: 다양한 기준으로 특정 사용자를 찾습니다.
- **관리 업무**: 관리 운영 및 보고 지원

## 역할 설명

- **관리자**: 관리 제어를 통한 전체 시스템 액세스
- **사용자**: 채팅 기능 및 개인 지식 베이스에 대한 일반 액세스  
- **globalReader**: 보기 권한이 있는 관리자 패널에 대한 읽기 전용 액세스

## 라이센스 설명

- **필수**: 기본 등급(월 29,000포인트)
- **성장**: 향상된 기능을 갖춘 중간급
- **Ultra**: 최대 기능을 갖춘 프리미엄 등급
- **사전 체험판**: 실험적 기능을 갖춘 베타 단계

## 속도 제한

이 엔드포인트는 표준 비율 제한을 따릅니다.
- 분당 60개 요청
- 시간당 요청 1000개