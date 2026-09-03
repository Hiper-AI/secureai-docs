---
sidebar_position: 4
title: Search Index for Documents
openapi: "GET /indexes/{indexName}/search"
---

# Search Index for Documents

Search documents within an index using semantic search.

## Endpoint

```
GET /indexes/{indexName}/search
```

## Description

Search documents within an index using semantic search. Returns matching documents with relevance scores, sorted by relevance.

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indexName` | string | Yes | Name of the index to search |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query text |
| `top_k` | integer | No | Maximum number of results to return (1-50, default: 10) |
| `min_score` | float | No | Minimum relevance score threshold (0.0-1.0, default: 0.0) |

## Request Example

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

### Python

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

## Response

### Success Response (200)

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for successful requests |
| `request_id` | string | Request ID for tracking |
| `query` | string | The search query that was used |
| `results` | object | Search results |
| `index` | object | Index information |

### Results Object

| Field | Type | Description |
|-------|------|-------------|
| `matches` | array | Array of matching documents, sorted by relevance |
| `total` | integer | Total number of matches found |
| `top_k` | integer | Requested top_k value |

### Match Object

| Field | Type | Description |
|-------|------|-------------|
| `rank` | integer | Result rank (1-based) |
| `score` | float | Relevance score (0.0-1.0, higher is more relevant) |
| `source` | string | Document source identifier |
| `content` | string | Content preview (truncated to 500 characters) |
| `metadata` | object | Additional metadata |

### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `page` | integer\|null | Page number (if from PDF) |
| `chunkIndex` | integer\|null | Chunk index within document |
| `title` | string\|null | Document title |
| `documentId` | string\|null | Document ID |

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Access denied",
  "message": "User doesn't have access to this index"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## Notes

- Semantic search uses vector similarity to find relevant documents
- Results are sorted by relevance score (highest first)
- Use `min_score` to filter out low-relevance results
- Content previews are truncated to 500 characters
- The `top_k` parameter limits the number of results returned
- Metadata includes information about the document source and location

