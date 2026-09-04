---
id: update
title: "更新组"
sidebar_label: "更新组"
description: "更新现有用户组"
openapi: "PUT /groups/{groupId}"
---
# 更新组

使用新信息、描述或元数据更新现有用户组。

## 端点

```
PUT /groups/{groupId}
```

## 说明

该端点允许管理员更新现有用户组。您可以修改组名称、描述、元数据和其他属性。该组必须存在，并且您必须具有适当的权限才能更新它。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 路径参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `groupId` |字符串|是的 |要更新的组的唯一标识符 |

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|没有 |团体的新名称|
| `description` |字符串|没有 |群组的新描述 |
| `users` |数组|没有 |分配给组的用户 ID 数组 |
| `status` |字符串|没有 |集团状态 |

## 请求示例

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## 成功响应

**状态代码**：`200 OK`

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `message` |字符串|成功留言|
| `group` |对象|更新的组对象 |
| `group.id` |字符串|唯一的组标识符 |
| `group.name` |字符串|更新群组名称 |
| `group.description` |字符串|更新了群组描述 |
| `group.status` |字符串|集团状态 |
| `group.userCount` |整数 |群组中的用户数量|
| `group.users` |数组|组中的用户对象数组 |
| `group.users[].id` |字符串|用户名 |
| `group.users[].name` |字符串|用户名 |
| `group.users[].email` |字符串|用户邮箱 |
| `group.createdAt` |字符串|原创时间戳 |
| `group.updatedAt` |字符串|最后更新时间戳 |

## 用法示例

### JavaScript

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

###Python

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

### 卷曲

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

## 错误响应

### 400 错误请求

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
    "message": "Cannot update this group"
  }
}
```

### 404 未找到

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
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

- **群组管理**：更新群组信息和描述
- **用户分配**：将新用户分配到组
- **名称更改**：重命名组以使其更加清晰
- **状态更新**：更改群组状态
- **团队更新**：当团队结构发生变化时更新团队信息

## 速率限制

- **默认**：每分钟 50 个请求
- **每日**：每天 5,000 个请求
- **每月**：每月 150,000 个请求

## 注释

- 该端点只能由管理员访问
- 部分更新：仅包含您想要更改的字段
- 用户分配：可以将新用户分配到组中
- 名称验证：组名称必须是唯一的
- 扁平响应：响应未嵌套在数据对象下
- 用户验证：在分配之前验证用户 ID
- `updatedAt`时间戳自动更新