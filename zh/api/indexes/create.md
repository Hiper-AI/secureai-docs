---
id: create
title: "创建索引"
sidebar_label: "创建索引"
description: "创建新的知识库索引"
openapi: "POST /indexes/all"
---
# 创建索引

创建新的知识库索引用于存储和检索文档。

## 端点

```
POST /indexes
```

## 说明

该端点允许管理员创建新的知识库索引。可以将索引分配给特定的用户或组。只有管​​理员可以创建索引。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|是的 |索引名称|
| `assignedUser` |字符串|没有 |将索引分配给的用户 ID (MongoDB ObjectId) |
| `assignedGroup` |字符串|没有 |将索引分配给的组 ID (MongoDB ObjectId) |
| `sharedIndexName` |字符串|没有 |共享索引名称（默认为名称） |
| `namespace` |字符串|没有 |索引的命名空间（如果未提供，则自动生成）|
| `region` |字符串|没有 |存储区域提示（可选）|
| `cloud` |字符串|没有 |云提供商提示（可选）|


## 请求示例

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## 成功响应

**状态代码**：`201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `message` |字符串|成功留言|
| `index` |对象|创建索引对象 |
| `index.id` |字符串|唯一索引标识符 |
| `index.name` |字符串|索引名称|
| `index.sharedIndexName` |字符串|共享索引名称 |
| `index.namespace` |字符串|索引命名空间|
| `index.type` |字符串|索引类型（个人、一般、团体、未知）|
| `index.assignedUser` |对象|分配的用户信息（如果是个人信息）|
| `index.assignedGroup` |对象|分配的组信息（如果组） |
| `index.createdAt` |字符串|创建时间戳 |

## 用法示例

### JavaScript

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

###Python

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

### 卷曲

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## 验证和业务规则

- **索引名称规范化**（用于存储和唯一性检查）：
  - 小写，修剪空格
  - 用连字符替换空格
  - 删除不在 `[a-z0-9-]` 中的任何字符
- **索引名称验证**：必须匹配 `^[a-z0-9-]{3,50}$`；否则返回 400。
- **唯一性**：标准化的`name`必须是唯一的；重复返回 409。
- **分配的用户配额**：如果提供了`assignedUser`，则通过`checkUserIndexQuota`强制执行用户索引配额；超出配额返回403。
- **区域限制（必备）**：对于`Essential`许可证，只能使用`cloud=aws`和`region=us-east-1`创建索引；否则 403。
- **分配的组**：当提供`assignedGroup`时，该组必须存在且未存档（`status != 'Archived'`）；否则400。

## 标准化和存储

- `name` 被标准化存储。
- `sharedIndexName` 默认为标准化的 `name`。
- 当分配给用户时，`namespace` 默认为 `user-{userId}-index-{normalizedName}`。

## 典型错误形状

### 400 无效的索引名称

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 超出索引配额

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 区域不允许

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
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
    "message": "Cannot create general indexes without admin privileges"
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

## 索引类型

|类型 |描述 |所需权限 |
|------|-------------|---------------------|
| `personal` |个人索引供个人使用|管理员权限 |
| `general` |共享组织索引 |管理员权限 |
| `group` |组分配索引 |管理员权限 |

## 必填字段

|领域 |描述 |示例|
|--------|-------------|----------|
| `name` |索引名称| “我的知识库”|
| `region` | AWS 区域 | “us-east-1”|
| `cloud` |云提供商 | “AWS”|

## 用例

- **用户分配**：创建索引并将其分配给特定用户
- **组分配**：创建索引并将它们分配给组
- **知识库**：为特定领域构建专业知识库
- **内容组织**：按主题或类别组织内容
- **矢量存储**：创建用于存储和检索矢量嵌入的索引

## 速率限制

- **默认**：每分钟 50 个请求
- **每日**：每天 5,000 个请求
- **每月**：每月 150,000 个请求

## 注释

- 该端点只能由管理员访问
- 必填字段：名称、地区、云均为必填
- 分配：索引可以分配给用户（signedUser）或组（signedGroup）
- 自动生成：如果未提供名称空间，则会自动生成
- 唯一名称：索引名称在整个系统中必须是唯一的
- 索引创建后立即可用
- 维度：矢量维度由应用程序内部管理（当前为 4096）
- 指标：相似度指标由应用程序内部管理