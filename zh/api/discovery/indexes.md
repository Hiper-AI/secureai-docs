---
sidebar_position: 2
title: "Available Knowledge Bases"
openapi: "GET /indexes"
---


# Get Available Knowledge Bases

Retrieve available knowledge bases (indexes) that your API key can access.

## Endpoint

```
GET /indexes
```

## Description

Retrieve available knowledge bases (indexes) that your API key can access. Includes personal indexes, shared indexes, and the Zero-Knowledge option.

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

### Success Response (200)

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

### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `success` | boolean | Always true for successful requests | `true` |
| `indexes` | array | List of available knowledge bases | See example |
| `restrictions` | object | Index access restrictions | See example |

### Index Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique index identifier | `"my-knowledge-base"` |
| `name` | string | Index display name | `"my-knowledge-base"` |
| `type` | string | Index type | `"personal"` |
| `namespace` | string | Index namespace (optional) | `"user-namespace"` |
| `description` | string | Index description (optional) | `"Direct AI responses..."` |

### Index Types

| Type | Description |
|------|-------------|
| `system` | System-provided indexes (e.g., Zero-Knowledge) |
| `personal` | User's personal knowledge bases |
| `general` | Shared knowledge bases |

### Restrictions Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `allowed_indexes` | string | Description of allowed indexes | `"all user indexes"` |

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Example Usage

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

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Special Indexes

### Zero-Knowledge

The `Zero-Knowledge` index is a special system index that provides direct AI responses without knowledge base retrieval. Use this when you want:

- Pure AI responses without RAG
- Testing AI model capabilities
- General conversation without specific context

## Notes

- The Zero-Knowledge index is always available
- Personal indexes are created by the user
- Access to indexes depends on your permissions
- Use the index ID in chat completion requests 
