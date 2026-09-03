---
id: list
title: "List All Indexes"
sidebar_label: "List All Indexes"
description: "Retrieve all available knowledge base indexes"
openapi: "GET /indexes/all"
---


# List All Indexes

Retrieve a comprehensive list of all available knowledge base indexes in the system.

## Endpoint

```
GET /indexes/all
```

## Description

This endpoint returns all knowledge base indexes available in the SecureAI system. It provides detailed information about each index including its type, status, creation date, and metadata. This is useful for discovering available knowledge bases and their capabilities.

## Authentication

**Required**: API Key

```
Authorization: Bearer sk-your-api-key-here
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 50 | Number of indexes per page (1-100) |
| `search` | string | No | - | Search term for index name or shared index name |
| `type` | string | No | - | Filter by index type (personal, general, group) |
| `status` | string | No | active | Filter by index status (active, deleted, all) |
| `sortBy` | string | No | createdAt | Field to sort by |
| `sortOrder` | string | No | desc | Sort order (asc, desc) |

## Example Request

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## Success Response

**Status Code**: `200 OK`

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `indexes[]` | array | Array of index objects |
| `indexes[].id` | string | Unique index identifier |
| `indexes[].name` | string | Index name |
| `indexes[].sharedIndexName` | string | Shared index name |
| `indexes[].namespace` | string | Index namespace |
| `indexes[].type` | string | Index type (personal, general, group, unknown) |
| `indexes[].assignedUser` | object | Assigned user information (if personal) |
| `indexes[].assignedGroup` | object | Assigned group information (if group) |
| `indexes[].userId` | string | User ID |
| `indexes[].isActive` | boolean | Whether index is active |
| `indexes[].createdAt` | string | Creation timestamp |
| `indexes[].updatedAt` | string | Last update timestamp |
| `indexes[].deletedAt` | string | Deletion timestamp (if deleted) |
| `pagination` | object | Pagination information |

## Index Types

| Type | Description | Access |
|------|-------------|--------|
| `personal` | User-created personal indexes | Full access for owner |
| `general` | Shared organizational indexes | Varies by permissions |
| `group` | Group-assigned indexes | Group members |
| `unknown` | Indexes with unclear assignment | Varies |

## Index Status

| Status | Description |
|--------|-------------|
| `active` | Index is available for use |
| `deleted` | Index has been deleted |
| `all` | Include both active and deleted |

## Example Usage

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

### Python

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

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 Too Many Requests

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

## Filtering Examples

### Filter by Type

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### Filter by Status

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### Pagination

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## Use Cases

- **Discovery**: Find available knowledge bases for RAG operations
- **Management**: List indexes for administrative purposes
- **Integration**: Discover indexes for application integration
- **Monitoring**: Check index status and metadata
- **Filtering**: Find specific types of indexes (system, personal, etc.)

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- This endpoint is only accessible by administrators
- Personal indexes are only visible to their owners
- Group indexes are visible to group members
- The response includes assigned user and group information
- Pagination uses page parameter, not offset
- Filtering by type and status helps narrow down results 
