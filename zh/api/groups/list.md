---
id: list
title: "列出组"
sidebar_label: "列出组"
description: "检索所有用户组"
openapi: "GET /groups"
---
# 列出组

使用分页和过滤选项检索系统中所有用户组的列表。

## 端点

```
GET /groups
```

## 说明

该端点返回 SecureAI 系统中可用的所有用户组。它提供有关每个组的详细信息，包括成员、权限和元数据。这对于管理用户访问和组织结构很有用。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 查询参数

|参数|类型 |必填 |描述 |
|------------|------|----------|----------|
| `page` |整数 |没有 | 1 |分页页码|
| `limit` |整数 |没有 | 20 | 20每页组数 (1-100) |
| `search` |字符串|没有 | - |群组名称或描述的搜索词|
| `status` |字符串|没有 | - |按群组状态过滤 |
| `sortBy` |字符串|没有 |创建于 |排序依据的字段 |
| `sortOrder` |字符串|没有 |描述 |排序顺序（升序、降序）|

## 请求示例

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `groups[]` |数组|组对象数组 |
| `groups[].id` |字符串|唯一的组标识符 |
| `groups[].name` |字符串|团体名称|
| `groups[].description` |字符串|集团简介|
| `groups[].status` |字符串|集团状态 |
| `groups[].userCount` |整数 |群组中的用户数量|
| `groups[].users` |数组|组中的用户对象数组 |
| `groups[].users[].id` |字符串|用户名 |
| `groups[].users[].name` |字符串|用户名 |
| `groups[].users[].email` |字符串|用户邮箱 |
| `groups[].createdAt` |字符串|创建时间戳 |
| `pagination` |对象|分页信息|

## 用法示例

### JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

###Python

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 错误响应

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

## 过滤示例

### 搜索组

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### 排序选项

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### 分页

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## 用例

- **组管理**：出于管理目的列出所有组
- **用户组织**：发现可用于用户分配的组
- **访问控制**：查看组权限和成员计数
- **报告**：生成有关团体结构和成员资格的报告
- **集成**：发现应用程序集成组

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 该端点只能由管理员访问
- 分页：使用页面参数，而不是偏移量
- 扁平响应：响应未嵌套在数据对象下
- 用户详细信息：包括每个群组成员的完整用户信息
- 状态过滤器：可以按组状态过滤
- 搜索功能适用于群组名称和描述
- 排序选项有助于按不同标准组织结果