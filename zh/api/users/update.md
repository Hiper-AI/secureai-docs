---
id: update
title: "更新用户"
sidebar_label: "更新用户"
description: "更新现有用户帐户"
openapi: "PUT /users/{userId}"
---
# 更新用户

使用新信息更新现有用户帐户。

## 端点

```
PUT /users/{userId}
```

## 说明

该端点允许管理员更新现有的用户帐户。您可以修改用户详细信息，例如姓名、电子邮件、角色、许可证层和其他帐户设置。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 路径参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `userId` |字符串|是的 |要更新的用户的唯一标识符 |

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|没有 |用户全名 |
| `username` |字符串|没有 |用户的唯一用户名 |
| `email` |字符串|没有 |用户的电子邮件地址 |
| `password` |字符串|没有 |用户帐户的新密码 |
| `role` |字符串|没有 |用户角色（管理员、用户、globalReader）|
| `license` |字符串|没有 |许可级别（Essential、Growth、Ultra、Early Access）|
| `status` |整数 |没有 |帐户状态（0=不活动，1=活动）|
| `roleId` |字符串|没有 |自定义角色 ID (MongoDB ObjectId) |
| `setupCompleted` |布尔 |没有 |用户设置是否完成 |
| `isVerified` |布尔 |没有 |用户是否已验证 |

## 请求示例

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

## 成功响应

**状态代码**：`200 OK`

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `message` |字符串|成功留言|
| `user` |对象|更新的用户对象 |
| `user.id` |字符串|唯一的用户标识符 |
| `user.name` |字符串|用户全名 |
| `user.username` |字符串|用户的用户名 |
| `user.email` |字符串|用户的电子邮件地址 |
| `user.role` |字符串|用户在系统中的角色|
| `user.license` |字符串|用户许可级别 |
| `user.status` |整数 |用户帐户状态（0=非活动，1=活动）|
| `user.isVerified` |布尔 |用户是否已验证 |
| `user.setupCompleted` |布尔 |用户设置是否完成 |
| `user.authType` |字符串|认证类型 |
| `user.customRole` |对象|自定义角色信息（如果已分配）|
| `user.createdAt` |字符串|帐户创建时间戳 |
| `user.updatedAt` |字符串|最后更新时间戳 |
| `user.lastActive` |字符串|用户上次活动时间戳 |

## 用法示例

### JavaScript

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

###Python

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

### 卷曲

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

## 错误响应

### 400 错误请求

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

### 404 未找到

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 冲突

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## 验证和业务规则

- **许可证值**：必须位于允许的许可证中（`Essential`、`Growth`、`Ultra`、`Early Access`）。无效值返回 400。
- **许可证容量**：通过 `checkLicenseCapacity` 强制执行；当所选层已满时返回 400。
- **许可证降级保护**：如果更改为较低级别会减少个人索引配额，则当当前个人索引计数超过`INDEX_QUOTAS[new_license]`时，更改将被阻止；返回 400 并有明确的指导。
- **电子邮件标准化**：在验证和存储之前小写并修剪。
- **用户名规范化**：在验证和存储之前小写并修剪。
- **电子邮件格式**：简单的正则表达式验证；无效邮件返回400。
- **用户名格式**：必须匹配`^[a-z0-9.-]{3,30}$`；无效的用户名返回 400。
- **唯一性**：`email`、`username`和`name`必须保持唯一；冲突返回 409。

## 标准化和存储

- `email` 和 `username` 始终以小写形式存储并进行修剪。

## 典型错误形状

### 400 无效许可证

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400 许可证不可用

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 个许可证降级超出配额

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 无效电子邮件

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 用户名无效

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 冲突（唯一性）

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## 用户角色

|角色 |描述 |权限 |
|------|-------------|-------------|
| `admin` |管理员|完整的系统访问|
| `user` |普通用户|标准用户访问 |
| `globalReader` |全球读者|只读管理面板访问|

## 许可级别

|等级 |描述 |特点|
|------|-------------|----------|
| `Essential` |基本层|功能有限|
| `Growth` |专业级|增强功能 |
| `Ultra` |高级级别 |功能齐全 |
| `Early Access` |抢先体验级别 |测试版功能 |

## 账户状态

|状态 |描述 |
|--------|-------------|
| `0` |不活跃帐户 |
| `1` |活跃账户 |

## 用例

- **角色管理**：更新用户角色以进行访问控制
- **许可证升级**：更改用户许可证级别
- **帐户维护**：更新用户信息和元数据
- **状态管理**：激活或暂停用户帐户
- **个人资料更新**：修改用户名、电子邮件或其他详细信息

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 只有管理员可以更新用户帐户
- 电子邮件地址在所有用户中必须是唯一的
- 密码更新是可选的，并且仅在提供时才会应用
- 元数据更新与现有元数据合并
- `updatedAt` 时间戳会在成功操作时自动更新