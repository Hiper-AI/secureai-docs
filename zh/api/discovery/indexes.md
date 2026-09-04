---
sidebar_position: 2
title: "可用的知识库"
openapi: "GET /indexes"
---
# 获取可用的知识库

检索您的 API 密钥可以访问的可用知识库（索引）。

## 端点

```
GET /indexes
```

## 说明

检索您的 API 密钥可以访问的可用知识库（索引）。包括个人索引、共享索引和零知识选项。

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

### 成功响应 (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### 响应字段

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `success` |布尔 |对于成功的请求始终如此 | `true` |
| `indexes` |数组|可用知识库列表 |参见示例 |
| `restrictions` |对象|索引访问限制 |参见示例 |

### 索引对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `id` |字符串|唯一索引标识符 | `"my-knowledge-base"` |
| `name` |字符串|索引显示名称| `"my-knowledge-base"` |
| `type` |字符串|索引类型| `"personal"` |
| `namespace` |字符串|索引命名空间（可选）| `"user-namespace"` |
| `description` |字符串|索引描述（可选）| `"Direct AI responses..."` |

### 索引类型

|类型 |描述 |
|------|-------------|
| `system` |系统提供的索引（例如零知识）|
| `personal` |用户的个人知识库|
| `general` |共享知识库 |

### 限制对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `allowed_indexes` |字符串|允许索引的描述 | `"all user indexes"` |

## 错误响应

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## 用法示例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 特殊索引

### 零知识

`Zero-Knowledge` 索引是一种特殊的系统索引，无需知识库检索即可提供直接的 AI 响应。当你需要时使用这个：

- 没有 RAG 的纯 AI 响应
- 测试AI模型能力
- 没有特定上下文的一般对话

## 注释

- 零知识索引始终可用
- 个人索引由用户创建
- 对索引的访问取决于您的权限
- 在聊天完成请求中使用索引 ID