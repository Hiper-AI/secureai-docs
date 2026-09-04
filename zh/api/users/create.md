---
sidebar_position: 2
title: "创建新用户"
openapi: "POST /users"
---
# 创建新用户

创建一个新的用户帐户。仅可由管理员访问。

## 端点

```
POST /users
```

## 说明

该端点允许管理员在系统中创建新的用户帐户。您可以指定各种用户属性，包括角色、许可证和身份验证类型。这是需要适当权限的管理端点。

## 用户创建流程

**基本身份验证** (`authType: "basic"`)：用户收到一封带有密码设置链接的欢迎电子邮件。在设置密码之前，帐户的创建未经验证。

**企业 SSO** (`authType: "enterprise"`)：用户已创建并经过验证，可以通过企业 SSO（Auth0、Microsoft AD 等）登录。无需设置密码。

## 身份验证

必填。将您的 API 密钥包含在授权标头中。

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求

### 请求正文

|参数|类型 |必填|默认|描述 |
|------------|------|----------|---------|------------|
| `name` |字符串|是的 | - |用户全名 |
| `username` |字符串|没有 | - |唯一的用户名（如果未提供，则从电子邮件自动生成）|
| `email` |字符串|是的 | - |用户的电子邮件地址 |
| `role` |字符串|没有 |用户 |用户角色（管理员、用户、globalReader）|
| `license` |字符串|没有 |必备|用户许可级别（Essential、Growth、Ultra、Early Access）|
| `roleId` |字符串|没有 | - |自定义角色 ID (MongoDB ObjectId) |
| `setupCompleted` |布尔 |没有 |假 |用户设置是否完成 |
| `authType` |字符串|没有 |基本 |身份验证类型（基本、企业）|

### 请求示例

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

## 回应

### 成功响应 (201)

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求，始终 `true` |
| `message` |字符串|成功留言|
| `user` |对象|创建用户对象 |
| `user.id` |字符串|用户的唯一标识符|
| `user.name` |字符串|用户全名 |
| `user.username` |字符串|用户的用户名 |
| `user.email` |字符串|用户的电子邮件地址 |
| `user.role` |字符串|用户角色|
| `user.license` |字符串|用户许可级别 |
| `user.status` |整数 |用户状态（1=活动）|
| `user.isVerified` |布尔 |用户是否已验证 |
| `user.setupCompleted` |布尔 |用户设置是否完成 |
| `user.authType` |字符串|认证类型 |
| `user.createdAt` |字符串|用户创建时间戳 |

## 用法示例

### JavaScript

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

###Python

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

### 卷曲

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

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 无效的身份验证类型

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 缺少必填字段

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
}
```

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

### 409 冲突

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## 验证和业务规则

- **许可证值**：必须是允许的许可证之一（`Essential`、`Growth`、`Ultra`、`Early Access`）。无效值返回 400。
- **许可证容量**：通过 `checkLicenseCapacity` 强制执行。如果所选层的容量已满，则返回 400。
- **电子邮件标准化**：在验证和存储之前小写并修剪。
- **用户名规范化**：在验证和存储之前小写并修剪。如果未提供，则从电子邮件自动生成。
- **电子邮件格式**：使用简单的正则表达式进行验证；无效邮件返回400。
- **用户名格式**：必须匹配`^[a-z0-9.-]{3,30}$`；无效的用户名返回 400。
- **唯一性**：`email`、`username` 和 `name` 必须是唯一的。冲突再次出现 409。
- **电子邮件邀请行为**：对于基本身份验证，用户会收到带有密码设置链接的欢迎电子邮件。

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## 用户角色

|角色 |描述 |权限 |
|------|-------------|-------------|
| `admin` |管理员|完整的系统访问|
| `user` |普通用户|标准用户访问 |
| `globalReader` |全球读者|只读管理面板访问|

## 许可级别

|许可证|描述 |特点|
|---------|-------------|----------|
| `Essential` |基本层|功能有限|
| `Growth` |专业级|增强功能 |
| `Ultra` |高级级别 |功能齐全 |
| `Early Access` |抢先体验级别 |测试版功能 |

## 身份验证类型

|类型 |描述 |
|------|-------------|
| `basic` |用户名/密码验证（用户收到密码设置电子邮件）|
| `enterprise` |企业 SSO 集成（Auth0、Microsoft AD 等）|

## 用例

- **用户入职**：为团队成员创建新的用户帐户
- **无密码入职**：创建接收电子邮件邀请设置自己密码的用户
- **SSO 集成**：创建通过外部身份提供商进行身份验证的用户
- **批量用户创建**：以编程方式创建多个用户
- **集成**：从外部系统创建用户
- **管理任务**：通过API管理用户帐户

## 速率限制

此端点遵循标准速率限制：
- 每分钟 60 个请求
- 每小时 1000 个请求