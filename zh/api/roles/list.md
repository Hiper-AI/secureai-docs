---
id: list
title: "列出角色"
sidebar_label: "列出角色"
description: "检索所有可用的用户角色"
openapi: "GET /roles"
---
# 列出角色

检索 SecureAI 系统中所有可用的用户角色。

## 端点

```
GET /roles
```

## 说明

该端点返回 SecureAI 系统中可用的所有用户角色。它提供有关每个角色的详细信息，包括权限、描述和元数据。这对于了解可用角色及其功能很有用。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 查询参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `page` |整数 |没有 | 1 |分页页码（默认：1）|
| `limit` |整数 |没有 | 20 | 20每页角色数量（默认：20） |
| `search` |字符串|没有 | - |名称、显示名称或描述的搜索词 |
| `isSystem` |字符串|没有 | - |按系统角色过滤（真/假） |
| `sortBy` |字符串|没有 |创建于 |排序依据的字段（默认值：“createdAt”）|
| `sortOrder` |字符串|没有 |描述 |排序顺序（升序/降序，默认：“降序”）|

## 请求示例

```bash
GET /roles?page=1&limit=10&search=admin
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `roles` |数组|角色对象数组 |
| `roles[].id` |字符串|唯一的角色标识符 |
| `roles[].name` |字符串|角色名称|
| `roles[].displayName` |字符串|角色的显示名称 |
| `roles[].description` |字符串|角色描述|
| `roles[].isSystem` |布尔 |这是否是系统角色 |
| `roles[].hasAdminPanelAccess` |布尔 |角色是否具有管理面板访问权限 |
| `roles[].permissions` |数组|权限对象数组 |
| `roles[].permissions[].section` |字符串|权限部分|
| `roles[].permissions[].level` |字符串|权限级别 |
| `roles[].canInteractWithAI` |布尔 |角色是否可以与AI交互 |
| `roles[].canUseChat` |布尔 |角色是否可以使用聊天 |
| `roles[].userCount` |整数 |具有此角色的用户数量 |
| `roles[].createdBy` |对象|创建角色的用户 |
| `roles[].createdBy.id` |字符串|创建者用户 ID |
| `roles[].createdBy.name` |字符串|创建者姓名|
| `roles[].createdBy.email` |字符串|创建者电子邮件 |
| `roles[].createdAt` |字符串|创建时间戳 |
| `roles[].updatedAt` |字符串|最后更新时间戳 |
| `pagination` |对象|分页信息|
| `pagination.page` |整数 |当前页码 |
| `pagination.limit` |整数 |每页项目 |
| `pagination.total` |整数 |角色总数 |
| `pagination.pages` |整数 |总页数 |

## 用法示例

### JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

###Python

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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


## 用例

- **角色管理**：列出用户分配的所有可用角色
- **权限审核**：了解每个角色拥有哪些权限
- **访问控制**：根据可用角色规划用户访问
- **用户分配**：根据用户的需求为用户分配角色
- **角色分析**：分析角色使用情况和用户分布

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 该端点需要管理员权限
- 基于页面的分页：使用页面参数，而不是偏移量
- 搜索：在名称、显示名称和描述字段中搜索
- 系统角色：可以按系统与自定义角色进行过滤
- 排序：可以按任何字段升序或降序排序
- 扁平响应：响应未嵌套在数据对象下
- 用户计数：显示每个角色有多少用户
- 创建者信息：显示每个角色的创建者