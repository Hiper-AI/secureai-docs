---
id: create
title: "역할 생성"
sidebar_label: "역할 생성"
description: "새 사용자 역할 만들기"
openapi: "POST /roles"
---
# 역할 생성

특정 권한을 가진 새로운 사용자 정의 사용자 역할을 만듭니다.

## 엔드포인트

```
POST /roles
```

## 설명

이 끝점을 통해 관리자는 새로운 사용자 지정 사용자 역할을 만들 수 있습니다. 사용자 정의 역할에는 조직의 요구 사항에 맞는 특정 권한이 있을 수 있습니다. 생성 중에 역할 이름, 설명, 권한을 지정할 수 있습니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `name` | 문자열 | 예 | 역할 이름(시스템 식별자) |
| `displayName` | 문자열 | 예 | 사람이 읽을 수 있는 역할 이름 |
| `description` | 문자열 | 예 | 역할 목적에 대한 설명 |
| `hasAdminPanelAccess` | 부울 | 아니요 | 역할에 관리자 패널 액세스 권한이 있는지 여부(기본값: false) |
| `permissions` | 배열 | 아니요 | 권한 개체 배열 |
| `canInteractWithAI` | 부울 | 아니요 | 역할이 AI와 상호작용할 수 있는지 여부(기본값: true) |
| `canUseChat` | 부울 | 아니요 | 역할이 채팅을 사용할 수 있는지 여부(기본값: true) |

## 요청 예시

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## 성공 응답

**상태 코드**: `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `message` | 문자열 | 성공 메시지 |
| `role` | 개체 | 역할 객체 생성 |
| `role.id` | 문자열 | 고유한 역할 식별자 |
| `role.name` | 문자열 | 역할 이름 |
| `role.displayName` | 문자열 | 역할의 표시 이름 |
| `role.description` | 문자열 | 역할 설명 |
| `role.isSystem` | 부울 | 시스템 역할인지 여부 |
| `role.hasAdminPanelAccess` | 부울 | 역할에 관리자 패널 액세스 권한이 있는지 여부 |
| `role.permissions` | 배열 | 권한 개체 배열 |
| `role.permissions[].section` | 문자열 | 권한 섹션 |
| `role.permissions[].level` | 문자열 | 권한 수준 |
| `role.canInteractWithAI` | 부울 | 역할이 AI와 상호작용할 수 있는지 여부 |
| `role.canUseChat` | 부울 | 역할이 채팅을 사용할 수 있는지 여부 |
| `role.userCount` | 정수 | 이 역할을 가진 사용자 수 |
| `role.createdBy` | 개체 | 역할을 생성한 사용자 |
| `role.createdBy.id` | 문자열 | 작성자 사용자 ID |
| `role.createdBy.name` | 문자열 | 크리에이터 이름 |
| `role.createdBy.email` | 문자열 | 크리에이터 이메일 |
| `role.createdAt` | 문자열 | 생성 타임스탬프 |

## 사용 예

### 자바스크립트

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

### 파이썬

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
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
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## 사용 가능한 권한 섹션

| 섹션 | 설명 |
|---------|-------------|
| `home` | 홈 대시보드 액세스 |
| `user-management` | 사용자 관리 운영 |
| `index-management` | 인덱스 관리 운영 |
| `analytics` | 분석 및 보고 |
| `group-management` | 그룹경영운영 |
| `integrations` | 통합관리 |
| `services-status` | 서비스 현황 모니터링 |
| `settings` | 시스템 설정 |
| `announcements` | 공지사항 관리 |
| `smltp-security` | SMLTP 보안 기능 |

## 사용 가능한 권한 수준

| 레벨 | 설명 |
|-------|-------------|
| `none` | 섹션에 액세스할 수 없습니다 |
| `reader` | 섹션에 대한 읽기 전용 액세스 |
| `admin` | 섹션에 대한 전체 관리 액세스 |

## 사용 사례

- **사용자 정의 역할**: 조직의 요구 사항에 맞는 역할을 만듭니다.
- **액세스 제어**: 다양한 사용자 유형에 대한 특정 권한을 정의합니다.
- **보안**: 최소 권한 액세스 원칙 구현
- **규정 준수**: 규제 요구 사항을 충족하는 역할 생성
- **통합**: 타사 시스템 통합을 위한 역할 정의

## 속도 제한

- **기본값**: 분당 요청 50개
- **일일**: 일일 요청 5,000건
- **월간**: 월간 요청 150,000건

## 메모

- **관리자 전용**: 이 엔드포인트에는 관리자 권한이 필요합니다.
- **필수항목** : 이름, 표시이름, 설명을 필수로 입력해주세요.
- **권한 구조**: 권한은 섹션 및 수준 속성이 있는 개체입니다.
- **시스템 역할**: 사용자 정의 역할은 시스템 역할이 아닙니다.
- **플랫 응답**: 응답이 데이터 개체 아래에 중첩되지 않습니다.
- **Creator Info**: 역할을 만든 사람이 누구인지 표시합니다.
- **사용자 수**: 새 역할의 경우 0부터 시작
- 역할 이름은 시스템 내에서 고유해야 합니다.
- 해당 역할은 사용자 할당에 즉시 사용 가능합니다.