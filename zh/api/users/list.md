---
sidebar_position: 1
title: "获取所有用户"
openapi: "GET /users"
---
# 获取所有用户

通过分页和过滤检索所有用户。仅可由管理员访问。

## 端点

```
GET /users
```

## 说明

该端点允许管理员检索系统中所有用户的分页列表。它支持按各种标准进行过滤，包括角色、许可证、状态和搜索词。这是需要适当权限的管理端点。

## 身份验证

必填。将您的 API 密钥包含在授权标头中。

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求

### 查询参数

|参数|类型 |必填|默认|描述 |
|------------|------|----------|---------|------------|
| `page` |整数 |没有 | 1 |分页页码|
| `limit` |整数 |没有 | 20 | 20每页用户数 (1-100) |
| `search` |字符串|没有 | - |姓名、电子邮件或用户名的搜索词 |
| `role` |字符串|没有 | - |按用户角色过滤（管理员、用户、globalReader）|
| `license` |字符串|没有 | - |按用户许可证过滤（Essential、Growth、Ultra、Early Access）|
| `status` |整数 |没有 | - |按用户状态过滤（0=非活动，1=活动）|
| `sortBy` |字符串|没有 |创建于 |排序依据的字段 |
| `sortOrder` |字符串|没有 |描述 |排序顺序（升序、降序）|

### 请求示例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

通过搜索：

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

### 成功响应 (200)

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求，始终 `true` |
| `users` |数组|用户对象数组 |
| `users[].id` |字符串|用户的唯一标识符|
| `users[].name` |字符串|用户全名 |
| `users[].username` |字符串|用户的用户名 |
| `users[].email` |字符串|用户的电子邮件地址 |
| `users[].role` |字符串|用户角色（管理员、用户、globalReader）|
| `users[].license` |字符串|用户许可级别（Essential、Growth、Ultra、Early Access）|
| `users[].status` |整数 |用户状态（0=非活动，1=活动）|
| `users[].isVerified` |布尔 |用户是否已验证 |
| `users[].setupCompleted` |布尔 |用户设置是否完成 |
| `users[].authType` |字符串|身份验证类型（基本、auth0）|
| `users[].mfaEnabled` |布尔 |是否启用MFA |
| `users[].customRole` |对象|自定义角色信息（如果已分配）|
| `users[].customRole.id` |字符串|自定义角色 ID |
| `users[].customRole.name` |字符串|自定义角色名称 |
| `users[].customRole.displayName` |字符串|自定义角色显示名称 |
| `users[].createdAt` |字符串|用户创建时间戳 |
| `users[].updatedAt` |字符串|用户上次更新时间戳 |
| `users[].lastActive` |字符串|用户上次活动时间戳 |
| `pagination` |对象|分页信息|
| `pagination.page` |整数 |当前页码 |
| `pagination.limit` |整数 |每页项目 |
| `pagination.total` |整数 |用户总数 |
| `pagination.pages` |整数 |总页数 |

## 用法示例

### JavaScript

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

###Python

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

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 错误响应

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## 过滤示例

### 按姓名或电子邮件搜索

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 按角色过滤

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 按许可证过滤

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 按状态过滤

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 按上次活动排序

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 用例

- **用户管理**：查看和管理系统中的所有用户
- **用户分析**：按角色、许可证或状态分析用户分布
- **搜索和过滤**：根据各种条件查找特定用户
- **管理任务**：支持管理操作和报告

## 角色描述

- **管理员**：具有管理控制的完整系统访问权限
- **用户**：对聊天功能和个人知识库的标准访问  
- **globalReader**：具有查看权限的管理面板的只读访问权限

## 许可证说明

- **Essential**：基本级别，每月 29,000 点
- **增长**：具有增强功能的中层
- **Ultra**：具有最多功能的高级层
- **抢先体验**：具有实验功能的 Beta 层

## 速率限制

此端点遵循标准速率限制：
- 每分钟 60 个请求
- 每小时 1000 个请求