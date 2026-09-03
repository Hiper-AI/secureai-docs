---
sidebar_position: 2
title: "새 사용자 생성"
openapi: "POST /users"
---
# 새로운 사용자 생성

새 사용자 계정을 만듭니다. 관리자만 액세스할 수 있습니다.

## 엔드포인트

```
POST /users
```

## 설명

이 끝점을 사용하면 관리자는 시스템에 새 사용자 계정을 만들 수 있습니다. 역할, 라이센스, 인증 유형을 포함한 다양한 사용자 속성을 지정할 수 있습니다. 이는 적절한 권한이 필요한 관리 끝점입니다.

## 사용자 생성 흐름

**기본 인증** (`authType: "basic"`): 사용자는 비밀번호 설정 링크가 포함된 환영 이메일을 받습니다. 비밀번호가 설정될 때까지 계정은 확인되지 않은 채 생성됩니다.

**엔터프라이즈 SSO** (`authType: "enterprise"`): 사용자가 확인되어 생성되었으며 엔터프라이즈 SSO(Auth0, Microsoft AD 등)를 통해 로그인할 수 있습니다. 비밀번호 설정이 필요하지 않습니다.

## 인증

필수입니다. Authorization 헤더에 API 키를 포함하세요.

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청

### 요청 본문

| 매개변수 | 유형 | 필수 | 기본값 | 설명 |
|------------|------|----------|---------|------------|
| `name` | 문자열 | 예 | - | 사용자 이름 |
| `username` | 문자열 | 아니요 | - | 고유한 사용자 이름(제공되지 않은 경우 이메일에서 자동 생성됨) |
| `email` | 문자열 | 예 | - | 사용자의 이메일 주소 |
| `role` | 문자열 | 아니요 | 사용자 | 사용자 역할(관리자, 사용자, globalReader) |
| `license` | 문자열 | 아니요 | 필수 | 사용자 라이선스 등급(Essential, Growth, Ultra, Early Access) |
| `roleId` | 문자열 | 아니요 | - | 사용자 정의 역할 ID(MongoDB ObjectId) |
| `setupCompleted` | 부울 | 아니요 | 거짓 | 사용자 설정 완료 여부 |
| `authType` | 문자열 | 아니요 | 기본 | 인증 유형(기본, 기업) |

### 예시 요청

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## 응답

### 성공 응답(201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 `true` |
| `message` | 문자열 | 성공 메시지 |
| `user` | 개체 | 사용자 개체 생성 |
| `user.id` | 문자열 | 사용자의 고유 식별자 |
| `user.name` | 문자열 | 사용자 이름 |
| `user.username` | 문자열 | 사용자의 사용자 이름 |
| `user.email` | 문자열 | 사용자의 이메일 주소 |
| `user.role` | 문자열 | 사용자의 역할 |
| `user.license` | 문자열 | 사용자의 라이선스 등급 |
| `user.status` | 정수 | 사용자 상태(1=활성) |
| `user.isVerified` | 부울 | 사용자 확인 여부 |
| `user.setupCompleted` | 부울 | 사용자 설정 완료 여부 |
| `user.authType` | 문자열 | 인증 유형 |
| `user.createdAt` | 문자열 | 사용자 생성 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

### 파이썬

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 잘못된 인증 유형

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 필수 필드 누락

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
}
```

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

### 409 갈등

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## 검증 및 비즈니스 규칙

- **라이센스 값**: 허용되는 라이선스(`Essential`, `Growth`, `Ultra`, `Early Access`) 중 하나여야 합니다. 잘못된 값은 400을 반환합니다.
- **라이센스 용량**: `checkLicenseCapacity`를 통해 적용됩니다. 선택한 계층의 용량이 가득 찬 경우 400을 반환합니다.
- **이메일 정규화**: 유효성 검사 및 저장 전에 소문자로 자르고 잘립니다.
- **사용자 이름 정규화**: 유효성 검사 및 저장 전에 소문자로 변경되고 잘립니다. 제공되지 않은 경우 이메일에서 자동 생성됩니다.
- **이메일 형식**: 간단한 정규식으로 확인됩니다. 잘못된 이메일은 400을 반환합니다.
- **사용자 이름 형식**: `^[a-z0-9.-]{3,30}$`과 일치해야 합니다. 잘못된 사용자 이름은 400을 반환합니다.
- **고유성**: `email`, `username` 및 `name`은 고유해야 합니다. 충돌은 409를 반환합니다.
- **이메일 초대 동작**: 기본 인증의 경우 사용자는 비밀번호 설정 링크가 포함된 환영 이메일을 받습니다.

## 정규화 및 저장

- `email` 및 `username`는 항상 소문자로 저장되고 잘립니다.

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## 사용자 역할

| 역할 | 설명 | 권한 |
|------|-------------|-------------|
| `admin` | 관리자 | 전체 시스템 액세스 |
| `user` | 일반 사용자 | 표준 사용자 액세스 |
| `globalReader` | 글로벌 리더 | 읽기 전용 관리자 패널 액세스 |

## 라이선스 등급

| 라이센스 | 설명 | 특징 |
|---------|-------------|----------|
| `Essential` | 기본 계층 | 제한된 기능 |
| `Growth` | 전문 계층 | 향상된 기능 |
| `Ultra` | 프리미엄 등급 | 전체 기능 |
| `Early Access` | 조기 액세스 등급 | 베타 기능 |

## 인증 유형

| 유형 | 설명 |
|------|-------------|
| `basic` | 사용자 이름/비밀번호 인증(사용자는 비밀번호 설정 이메일을 받습니다) |
| `enterprise` | 엔터프라이즈 SSO 통합(Auth0, Microsoft AD 등) |

## 사용 사례

- **사용자 온보딩**: 팀 구성원을 위한 새 사용자 계정 생성
- **비밀번호 없는 온보딩**: 자신의 비밀번호를 설정하도록 이메일 초대를 받는 사용자를 만듭니다.
- **SSO 통합**: 외부 ID 공급자를 통해 인증하는 사용자 생성
- **대량 사용자 생성**: 프로그래밍 방식으로 여러 사용자 생성
- **통합**: 외부 시스템에서 사용자 생성
- **관리 업무**: API를 통해 사용자 계정 관리

## 속도 제한

이 엔드포인트는 표준 비율 제한을 따릅니다.
- 분당 60개 요청
- 시간당 요청 1000개