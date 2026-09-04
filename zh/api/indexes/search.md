---
sidebar_position: 4
title: "文件搜索索引"
openapi: "GET /indexes/{indexName}/search"
---
# 文档搜索索引

使用语义搜索来搜索索引中的文档。

## 端点

```
GET /indexes/{indexName}/search
```

## 说明

使用语义搜索来搜索索引中的文档。返回具有相关性分数的匹配文档，并按相关性排序。

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 路径参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `indexName` |字符串|是的 |要搜索的索引名称 |

## 查询参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `query` |字符串|是的 |搜索查询文本 |
| `top_k` |整数 |没有 |返回结果的最大数量（1-50，默认值：10）|
| `min_score` |浮动|没有 |最小相关性分数阈值（0.0-1.0，默认值：0.0）|

## 请求示例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=What%20is%20machine%20learning?&top_k=10&min_score=0.5" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const query = encodeURIComponent('What is machine learning?');
const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=${query}&top_k=10&min_score=0.5`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Total matches:', data.results.total);
data.results.matches.forEach(match => {
  console.log(`Rank ${match.rank}: ${match.content.substring(0, 100)}... (score: ${match.score})`);
});
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "query": "What is machine learning?",
    "top_k": 10,
    "min_score": 0.5
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Total matches:', result['results']['total'])
for match in result['results']['matches']:
    print(f"Rank {match['rank']}: {match['content'][:100]}... (score: {match['score']})")
```

## 回应

### 成功响应 (200)

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What is machine learning?",
  "results": {
    "matches": [
      {
        "rank": 1,
        "score": 0.85,
        "source": "training",
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed...",
        "metadata": {
          "page": 1,
          "chunkIndex": 0,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      },
      {
        "rank": 2,
        "score": 0.78,
        "source": "training",
        "content": "Machine learning algorithms build mathematical models based on training data to make predictions or decisions...",
        "metadata": {
          "page": 2,
          "chunkIndex": 1,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      }
    ],
    "total": 5,
    "top_k": 10
  },
  "index": {
    "name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求始终如此 |
| `request_id` |字符串|请求 ID 进行跟踪 |
| `query` |字符串|使用的搜索查询 |
| `results` |对象|搜索结果 |
| `index` |对象|索引信息 |

### 结果对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `matches` |数组|匹配文档数组，按相关性排序 |
| `total` |整数 |找到的匹配总数 |
| `top_k` |整数 |请求的top_k值|

### 匹配对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `rank` |整数 |结果排名（从 1 开始）|
| `score` |浮动|相关性得分（0.0-1.0，越高相关性越高）|
| `source` |字符串|文档来源标识符 |
| `content` |字符串|内容预览（截短至 500 个字符）|
| `metadata` |对象|附加元数据 |

### 元数据对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `page` |整数\|null |页码（如果来自 PDF）|
| `chunkIndex` |整数\|null |文档中的块索引 |
| `title` |字符串\|空|文档标题 |
| `documentId` |字符串\|空|文件编号 |

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
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
  "message": "User doesn't have access to this index"
}
```

### 404 未找到

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## 注释

- 语义搜索使用向量相似度来查找相关文档
- 结果按相关性分数排序（最高的在前）
- 使用`min_score`过滤掉低相关性结果
- 内容预览被截断为 500 个字符
- `top_k` 参数限制返回结果的数量
- 元数据包括有关文档来源和位置的信息