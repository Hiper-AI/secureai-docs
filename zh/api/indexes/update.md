---
id: update
title: "更新索引"
sidebar_label: "更新索引"
description: "更新现有知识库索引"
openapi: "PUT /indexes/{indexId}"
---
# 更新索引

使用新设置、元数据或配置更新现有知识库索引。

## 端点

```
PUT /indexes/{indexId}
```

## 说明

该端点允许管理员更新现有的知识库索引。您可以修改索引名称并将其重新分配给不同的用户或组。只有管​​理员可以更新索引。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 路径参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `indexId` |字符串|是的 |要更新的索引的唯一标识符 |

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|没有 |索引的新名称 |
| `assignedUser` |字符串|没有 |将索引分配给的用户 ID (MongoDB ObjectId) |
| `assignedGroup` |字符串|没有 |将索引分配给的组 ID (MongoDB ObjectId) |


## 请求示例

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
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
| `index` |对象|更新的索引对象 |
| `index.id` |字符串|唯一索引标识符 |
| `index.name` |字符串|更新索引名称 |
| `index.sharedIndexName` |字符串|共享索引名称 |
| `index.namespace` |字符串|索引命名空间|
| `index.type` |字符串|索引类型（个人、一般、团体、未知）|
| `index.assignedUser` |对象|分配的用户信息（如果是个人信息）|
| `index.assignedGroup` |对象|分配的组信息（如果组） |
| `index.createdAt` |字符串|原创时间戳 |
| `index.updatedAt` |字符串|最后更新时间戳 |

## 用法示例

### JavaScript

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
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
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

###Python

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

### 卷曲

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## 验证和业务规则

- **分配给用户 (`assignedUser`)**：
  - 当转换为个人或更改受让人时，通过`checkUserIndexQuota`强制执行用户索引配额。超出配额返回403。
- **分配给一个组（`assignedGroup`）**：
  - 组必须存在并且处于活动状态（`status != 'Archived'`）；无效/不活动的组返回 400。

## 标准化和存储

- 重命名时，`name`继续标准化存储；如果未显式设置，`sharedIndexName` 默认为规范化名称。

## 典型错误形状

### 403 超出索引配额

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
}
```

### 400 组无效/无效

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
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
    "message": "Cannot update this index"
  }
}
```

### 404 未找到

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
  }
}
```

### 409 冲突

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## 可更新字段

|领域 |描述 |笔记|
|--------|-------------|--------|
| `name` |索引名称|在整个系统中必须是唯一的 |
| `assignedUser` |用户分配|将索引分配给特定用户 |
| `assignedGroup` |小组作业|将索引分配给特定组 |

## 用例

- **名称更改**：重命名索引以更好地组织
- **用户分配**：将索引重新分配给不同的用户
- **组分配**：将索引重新分配给不同的组
- **所有权转让**：更改用户之间的索引所有权

## 速率限制

- **默认**：每分钟 50 个请求
- **每日**：每天 5,000 个请求
- **每月**：每月 150,000 个请求

## 注释

- 该端点只能由管理员访问
- 有限字段：只能更新名称、分配用户和分配组
- 分配逻辑：分配给用户会清除组分配，反之亦然
- 验证：在分配之前验证用户和组 ID
- 无设置：无法更新设置、元数据或其他配置
- `updatedAt`时间戳自动更新
- 索引名称在整个系统中必须保持唯一