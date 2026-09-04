---
id: create
title: "创建群组"
sidebar_label: "创建群组"
description: "创建新用户组"
openapi: "POST /groups"
---
# 创建组

创建新的用户组用于组织用户和管理访问权限。

## 端点

```
POST /groups
```

## 说明

该端点允许管理员创建新的用户组。组用于组织用户、管理权限以及控制对系统不同部分的访问。您可以在创建过程中指定组名称、描述和元数据。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|是的 |团体名称|
| `description` |字符串|是的 |集团简介|
| `users` |数组|没有 |要添加到组中的用户 ID 数组 |
| `status` |字符串|没有 |组状态（默认为“活动”）|

## 请求示例

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## 成功响应

**状态代码**：`201 Created`

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `message` |字符串|成功留言|
| `group` |对象|创建组对象 |
| `group.id` |字符串|唯一的组标识符 |
| `group.name` |字符串|团体名称|
| `group.description` |字符串|集团简介|
| `group.status` |字符串|集团状态 |
| `group.userCount` |整数 |群组中的用户数量|
| `group.users` |数组|组中的用户对象数组 |
| `group.users[].id` |字符串|用户名 |
| `group.users[].name` |字符串|用户名 |
| `group.users[].email` |字符串|用户邮箱 |
| `group.createdAt` |字符串|创建时间戳 |

## 用法示例

### JavaScript

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

###Python

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

### 卷曲

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

## 错误响应

### 400 错误请求

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
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

## 用例

- **用户组织**：创建组以按部门或职能组织用户
- **访问控制**：建立用于管理权限和访问的组
- **团队管理**：为不同的团队或项目创建组
- **报告**：组织用户进行报告和分析
- **集成**：创建第三方系统集成组

## 速率限制

- **默认**：每分钟 50 个请求
- **每日**：每天 5,000 个请求
- **每月**：每月 150,000 个请求

## 注释

- 该端点只能由管理员访问
- 必填字段：名称和描述均为必填项
- 用户分配：可以在创建过程中将用户分配到组中
- 状态：如果未指定，则默认为“活动”
- 验证：在分配之前验证用户 ID
- 扁平响应：响应未嵌套在数据对象下
- 群组创建后可立即使用