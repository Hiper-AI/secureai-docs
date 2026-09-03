---
id: create
title: Create Index
sidebar_label: Create Index
description: Create a new knowledge base index
openapi: "POST /indexes/all"
---

# Create Index

Create a new knowledge base index for storing and retrieving documents.

## Endpoint

```
POST /indexes
```

## Description

This endpoint allows administrators to create a new knowledge base index. The index can be assigned to specific users or groups. Only administrators can create indexes.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Index name |
| `assignedUser` | string | No | User ID to assign the index to (MongoDB ObjectId) |
| `assignedGroup` | string | No | Group ID to assign the index to (MongoDB ObjectId) |
| `sharedIndexName` | string | No | Shared index name (defaults to name) |
| `namespace` | string | No | Namespace for the index (auto-generated if not provided) |
| `region` | string | No | Region hint for storage (optional) |
| `cloud` | string | No | Cloud provider hint (optional) |


## Example Request

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## Success Response

**Status Code**: `201 Created`

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Success message |
| `index` | object | Created index object |
| `index.id` | string | Unique index identifier |
| `index.name` | string | Index name |
| `index.sharedIndexName` | string | Shared index name |
| `index.namespace` | string | Index namespace |
| `index.type` | string | Index type (personal, general, group, unknown) |
| `index.assignedUser` | object | Assigned user information (if personal) |
| `index.assignedGroup` | object | Assigned group information (if group) |
| `index.createdAt` | string | Creation timestamp |

## Example Usage

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

### Python

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

### cURL

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

## Error Responses

### 400 Bad Request

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

## Validations and Business Rules

- **Index name normalization** (for storage and uniqueness checks):
  - Lowercase, trim whitespace
  - Replace spaces with hyphens
  - Remove any character not in `[a-z0-9-]`
- **Index name validation**: Must match `^[a-z0-9-]{3,50}$`; otherwise returns 400.
- **Uniqueness**: Normalized `name` must be unique; duplicates return 409.
- **Assigned user quota**: If `assignedUser` is provided, enforce user index quota via `checkUserIndexQuota`; exceeded quota returns 403.
- **Region restriction (Essential)**: For `Essential` license, indexes can only be created with `cloud=aws` and `region=us-east-1`; otherwise 403.
- **Assigned group**: When `assignedGroup` is provided, the group must exist and not be archived (`status != 'Archived'`); otherwise 400.

## Normalization and Storage

- `name` is stored normalized.
- `sharedIndexName` defaults to the normalized `name`.
- `namespace` defaults to `user-{userId}-index-{normalizedName}` when assigned to a user.

## Typical Error Shapes

### 400 Invalid Index Name

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 Index Quota Exceeded

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 Region Not Allowed

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
}
```

### 400 Group Invalid/Inactive

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
}
```

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

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Cannot create general indexes without admin privileges"
  }
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## Index Types

| Type | Description | Permissions Required |
|------|-------------|---------------------|
| `personal` | Personal index for individual use | Admin privileges |
| `general` | Shared organizational index | Admin privileges |
| `group` | Group-assigned index | Admin privileges |

## Required Fields

| Field | Description | Example |
|-------|-------------|----------|
| `name` | Index name | "my-knowledge-base" |
| `region` | AWS region | "us-east-1" |
| `cloud` | Cloud provider | "aws" |

## Use Cases

- **User Assignment**: Create indexes and assign them to specific users
- **Group Assignment**: Create indexes and assign them to groups
- **Knowledge Bases**: Build specialized knowledge bases for specific domains
- **Content Organization**: Organize content by topic or category
- **Vector Storage**: Create indexes for storing and retrieving vector embeddings

## Rate Limits

- **Default**: 50 requests per minute
- **Daily**: 5,000 requests per day
- **Monthly**: 150,000 requests per month

## Notes

- This endpoint is only accessible by administrators
- Required fields: name, region, cloud are all required
- Assignment: Index can be assigned to a user (assignedUser) or group (assignedGroup)
- Auto-generation: namespace is auto-generated if not provided
- Unique Names: Index names must be unique across the system
- The index is immediately available for use after creation
- Dimension: Vector dimension is managed internally by the application (currently 4096)
- Metric: Similarity metric is managed internally by the application 
