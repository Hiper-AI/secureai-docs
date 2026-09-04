---
id: list
title: "列出所有索引"
sidebar_label: "列出所有索引"
description: "检索所有可用的知识库索引"
openapi: "GET /indexes/all"
---
# 列出所有索引

检索系统中所有可用知识库索引的综合列表。

## 端点

```
GET /indexes/all
```

## 说明

该端点返回 SecureAI 系统中可用的所有知识库索引。它提供有关每个索引的详细信息，包括其类型、状态、创建日期和元数据。这对于发现可用的知识库及其功能非常有用。

## 身份验证

**必填**：API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 查询参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `page` |整数 |没有 | 1 |分页页码|
| `limit` |整数 |没有 | 50 | 50每页索引数 (1-100) |
| `search` |字符串|没有 | - |索引名称或共享索引名称的搜索词|
| `type` |字符串|没有 | - |按索引类型过滤（个人、一般、团体）|
| `status` |字符串|没有 |活跃 |按索引状态过滤（活动、已删除、全部）|
| `sortBy` |字符串|没有 |创建于 |排序依据的字段 |
| `sortOrder` |字符串|没有 |描述 |排序顺序（升序、降序）|

## 请求示例

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "indexes": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "my-knowledge-base",
      "sharedIndexName": "my-knowledge-base",
      "namespace": "user-namespace",
      "type": "personal",
      "assignedUser": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedGroup": null,
      "userId": "60a7c8f5e8b4f5001f7a8c24",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `indexes[]` |数组|索引对象数组 |
| `indexes[].id` |字符串|唯一索引标识符 |
| `indexes[].name` |字符串|索引名称|
| `indexes[].sharedIndexName` |字符串|共享索引名称 |
| `indexes[].namespace` |字符串|索引命名空间|
| `indexes[].type` |字符串|索引类型（个人、一般、团体、未知）|
| `indexes[].assignedUser` |对象|分配的用户信息（如果是个人信息）|
| `indexes[].assignedGroup` |对象|分配的组信息（如果组） |
| `indexes[].userId` |字符串|用户名 |
| `indexes[].isActive` |布尔 |索引是否活跃 |
| `indexes[].createdAt` |字符串|创建时间戳 |
| `indexes[].updatedAt` |字符串|最后更新时间戳 |
| `indexes[].deletedAt` |字符串|删除时间戳（如果已删除）|
| `pagination` |对象|分页信息|

## 索引类型

|类型 |描述 |访问 |
|------|-------------|--------|
| `personal` |用户创建的个人索引|所有者的完全访问权限 |
| `general` |共享组织索引 |因权限而异 |
| `group` |组分配索引|团体成员 |
| `unknown` |分配不明确的索引 |变化 |

## 索引状态

|状态 |描述 |
|--------|-------------|
| `active` |索引可供使用|
| `deleted` |索引已被删除 |
| `all` |包括活动的和已删除的 |

## 用法示例

### JavaScript

```javascript
const listIndexes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/indexes/all${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listIndexes({
  type: 'personal',
  limit: 10,
  page: 1
});
console.log(result.indexes);
```

###Python

```python
import requests

def list_indexes(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "type": "personal",
    "limit": 10,
    "page": 1
}

result = list_indexes(params)
print(result["indexes"])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
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

### 按类型过滤

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### 按状态过滤

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### 分页

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## 用例

- **发现**：查找 RAG 操作的可用知识库
- **管理**：出于管理目的列出索引
- **集成**：发现应用程序集成的索引
- **监控**：检查索引状态和元数据
- **过滤**：查找特定类型的索引（系统、个人等）

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 该端点只能由管理员访问
- 个人索引仅对其所有者可见
- 群组索引对群组成员可见
- 响应包括分配的用户和组信息
- 分页使用页面参数，而不是偏移量
- 按类型和状态过滤有助于缩小结果范围