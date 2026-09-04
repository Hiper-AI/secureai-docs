---
id: create
title: "创建角色"
sidebar_label: "创建角色"
description: "创建新用户角色"
openapi: "POST /roles"
---
# 创建角色

创建具有特定权限的新自定义用户角色。

## 端点

```
POST /roles
```

## 说明

该端点允许管理员创建新的自定义用户角色。自定义角色可以具有根据您的组织需求定制的特定权限。您可以在创建过程中指定角色名称、描述和权限。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|是的 |角色名称（系统标识符）|
| `displayName` |字符串|是的 |人类可读的角色名称 |
| `description` |字符串|是的 |角色目的描述|
| `hasAdminPanelAccess` |布尔 |没有 |角色是否具有管理面板访问权限（默认：false）|
| `permissions` |数组|没有 |权限对象数组 |
| `canInteractWithAI` |布尔 |没有 |角色是否可以与AI交互（默认：true）|
| `canUseChat` |布尔 |没有 |角色是否可以使用聊天（默认：true）|

## 请求示例

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

## 成功响应

**状态代码**：`201 Created`

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `message` |字符串|成功留言|
| `role` |对象|创建角色对象 |
| `role.id` |字符串|唯一的角色标识符 |
| `role.name` |字符串|角色名称|
| `role.displayName` |字符串|角色的显示名称 |
| `role.description` |字符串|角色描述|
| `role.isSystem` |布尔 |这是否是系统角色 |
| `role.hasAdminPanelAccess` |布尔 |角色是否具有管理面板访问权限 |
| `role.permissions` |数组|权限对象数组 |
| `role.permissions[].section` |字符串|权限部分|
| `role.permissions[].level` |字符串|权限级别 |
| `role.canInteractWithAI` |布尔 |角色是否可以与AI交互 |
| `role.canUseChat` |布尔 |角色是否可以使用聊天 |
| `role.userCount` |整数 |具有此角色的用户数量 |
| `role.createdBy` |对象|创建角色的用户 |
| `role.createdBy.id` |字符串|创建者用户 ID |
| `role.createdBy.name` |字符串|创建者姓名|
| `role.createdBy.email` |字符串|创建者电子邮件 |
| `role.createdAt` |字符串|创建时间戳 |

## 用法示例

### JavaScript

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

###Python

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

### 卷曲

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

## 错误响应

### 400 错误请求

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

### 401 未经授权

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 403 禁止

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 冲突

```json
{
  "success": false,
  "error": {
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
  }
}
```

### 429 请求过多

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

## 可用的权限部分

|部分|描述 |
|---------|-------------|
| `home` |主页仪表板访问 |
| `user-management` |用户管理操作|
| `index-management` |指数管理操作|
| `analytics` |分析和报告 |
| `group-management` |集团管理运营|
| `integrations` |一体化管理|
| `services-status` |服务状态监控|
| `settings` |系统设置|
| `announcements` |公告管理 |
| `smltp-security` | SMLTP 安全功能 |

## 可用的权限级别

|水平|描述 |
|--------|-------------|
| `none` |无法访问该部分 |
| `reader` |对该部分的只读访问权限 |
| `admin` |对该部分的完全管理访问权限 |

## 用例

- **自定义角色**：创建适合您组织需求的角色
- **访问控制**：为不同用户类型定义特定权限
- **安全**：实施最低权限访问原则
- **合规性**：创建满足监管要求的角色
- **集成**：定义第三方系统集成的角色

## 速率限制

- **默认**：每分钟 50 个请求
- **每日**：每天 5,000 个请求
- **每月**：每月 150,000 个请求

## 注释

- **仅限管理员**：此端点需要管理员权限
- **必填字段**：名称、显示名称和描述为必填项
- **权限结构**：权限是具有部分和级别属性的对象
- **系统角色**：自定义角色永远不是系统角色
- **平面响应**：响应未嵌套在数据对象下
- **创建者信息**：显示角色的创建者
- **用户计数**：新角色从 0 开始
- 角色名称在系统内必须是唯一的
- 该角色立即可供用户分配