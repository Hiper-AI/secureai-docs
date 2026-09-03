---
id: update
title: "사용자 업데이트"
sidebar_label: "사용자 업데이트"
description: "기존 사용자 계정 업데이트"
openapi: "PUT /users/{userId}"
---
# 사용자 업데이트

기존 사용자 계정을 새로운 정보로 업데이트합니다.

## 엔드포인트

```
PUT /users/{userId}
```

## 설명

이 끝점을 통해 관리자는 기존 사용자 계정을 업데이트할 수 있습니다. 이름, 이메일, 역할, 라이선스 등급 및 기타 계정 설정과 같은 사용자 세부 정보를 수정할 수 있습니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 경로 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `userId` | 문자열 | 예 | 업데이트할 사용자의 고유 식별자 |

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 아니요 | 사용자 이름 |
| `username` | 문자열 | 아니요 | 사용자의 고유한 사용자 이름 |
| `email` | 문자열 | 아니요 | 사용자의 이메일 주소 |
| `password` | 문자열 | 아니요 | 사용자 계정의 새 비밀번호 |
| `role` | 문자열 | 아니요 | 사용자 역할(관리자, 사용자, globalReader) |
| `license` | 문자열 | 아니요 | 라이선스 등급(Essential, Growth, Ultra, Early Access) |
| `status` | 정수 | 아니요 | 계정 상태(0=비활성, 1=활성) |
| `roleId` | 문자열 | 아니요 | 사용자 정의 역할 ID(MongoDB ObjectId) |
| `setupCompleted` | 부울 | 아니요 | 사용자 설정 완료 여부 |
| `isVerified` | 부울 | 아니요 | 사용자 확인 여부 |

## 요청 예시

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `message` | 문자열 | 성공 메시지 |
| `user` | 개체 | 업데이트된 사용자 개체 |
| `user.id` | 문자열 | 고유한 사용자 식별자 |
| `user.name` | 문자열 | 사용자 이름 |
| `user.username` | 문자열 | 사용자의 사용자 이름 |
| `user.email` | 문자열 | 사용자의 이메일 주소 |
| `user.role` | 문자열 | 시스템에서 사용자의 역할 |
| `user.license` | 문자열 | 사용자의 라이선스 등급 |
| `user.status` | 정수 | 사용자의 계정 상태(0=비활성, 1=활성) |
| `user.isVerified` | 부울 | 사용자 확인 여부 |
| `user.setupCompleted` | 부울 | 사용자 설정 완료 여부 |
| `user.authType` | 문자열 | 인증 유형 |
| `user.customRole` | 개체 | 사용자 정의 역할 정보(할당된 경우) |
| `user.createdAt` | 문자열 | 계정 생성 타임스탬프 |
| `user.updatedAt` | 문자열 | 마지막 업데이트 타임스탬프 |
| `user.lastActive` | 문자열 | 사용자의 마지막 활동 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

### 파이썬

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 찾을 수 없음

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 갈등

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## 검증 및 비즈니스 규칙

- **라이센스 값**: 허용된 라이선스(`Essential`, `Growth`, `Ultra`, `Early Access`)에 있어야 합니다. 잘못된 값은 400을 반환합니다.
- **라이센스 용량**: `checkLicenseCapacity`을 통해 적용됩니다. 선택한 계층이 가득 차면 400을 반환합니다.
- **라이선스 다운그레이드 가드**: 하위 계층으로 변경하여 개인 인덱스 할당량을 줄이는 경우 현재 개인 인덱스 수가 `INDEX_QUOTAS[new_license]`를 초과하면 변경이 차단됩니다. 명시적인 지침에 따라 400을 반환합니다.
- **이메일 정규화**: 유효성 검사 및 저장 전에 소문자로 자르고 잘립니다.
- **사용자 이름 정규화**: 유효성 검사 및 저장 전에 소문자로 변경되고 잘립니다.
- **이메일 형식**: 간단한 정규식 유효성 검사; 잘못된 이메일은 400을 반환합니다.
- **사용자 이름 형식**: `^[a-z0-9.-]{3,30}$`와 일치해야 합니다. 잘못된 사용자 이름은 400을 반환합니다.
- **고유성**: `email`, `username` 및 `name`은 고유해야 합니다. 충돌은 409를 반환합니다.

## 정규화 및 저장

- `email` 및 `username`은 항상 소문자로 저장되고 잘립니다.

## 일반적인 오류 형태

### 400 유효하지 않은 라이센스

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400 라이센스를 사용할 수 없음

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 라이센스 다운그레이드가 할당량을 초과합니다.

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 잘못된 이메일

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 잘못된 사용자 이름

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 충돌(고유성)

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## 사용자 역할

| 역할 | 설명 | 권한 |
|------|-------------|-------------|
| `admin` | 관리자 | 전체 시스템 액세스 |
| `user` | 일반 사용자 | 표준 사용자 액세스 |
| `globalReader` | 글로벌 리더 | 읽기 전용 관리자 패널 액세스 |

## 라이선스 등급

| 계층 | 설명 | 특징 |
|------|-------------|----------|
| `Essential` | 기본 계층 | 제한된 기능 |
| `Growth` | 전문 계층 | 향상된 기능 |
| `Ultra` | 프리미엄 등급 | 전체 기능 |
| `Early Access` | 조기 액세스 등급 | 베타 기능 |

## 계정 상태

| 상태 | 설명 |
|---------|-------------|
| `0` | 비활성 계정 |
| `1` | 활성 계정 |

## 사용 사례

- **역할 관리**: 액세스 제어를 위한 사용자 역할 업데이트
- **라이선스 업그레이드**: 사용자 라이선스 등급 변경
- **계정 관리**: 사용자 정보 및 메타데이터 업데이트
- **상태 관리**: 사용자 계정 활성화 또는 정지
- **프로필 업데이트**: 사용자 이름, 이메일 또는 기타 세부정보 수정

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 관리자만 사용자 계정을 업데이트할 수 있습니다.
- 이메일 주소는 모든 사용자에게 고유해야 합니다.
- 비밀번호 업데이트는 선택사항이며 제공된 경우에만 적용됩니다.
- 메타데이터 업데이트가 기존 메타데이터와 병합됩니다.
- `updatedAt` 타임스탬프는 작업 성공 시 자동으로 업데이트됩니다.