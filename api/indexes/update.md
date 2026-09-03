---
id: update
title: Update Index
sidebar_label: Update Index
description: Update an existing knowledge base index
openapi: "PUT /indexes/{indexId}"
---

# Update Index

Update an existing knowledge base index with new settings, metadata, or configuration.

## Endpoint

```
PUT /indexes/{indexId}
```

## Description

This endpoint allows administrators to update an existing knowledge base index. You can modify the index name and reassign it to different users or groups. Only administrators can update indexes.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indexId` | string | Yes | The unique identifier of the index to update |

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | New name for the index |
| `assignedUser` | string | No | User ID to assign the index to (MongoDB ObjectId) |
| `assignedGroup` | string | No | Group ID to assign the index to (MongoDB ObjectId) |


## Example Request

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## Success Response

**Status Code**: `200 OK`

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Success message |
| `index` | object | Updated index object |
| `index.id` | string | Unique index identifier |
| `index.name` | string | Updated index name |
| `index.sharedIndexName` | string | Shared index name |
| `index.namespace` | string | Index namespace |
| `index.type` | string | Index type (personal, general, group, unknown) |
| `index.assignedUser` | object | Assigned user information (if personal) |
| `index.assignedGroup` | object | Assigned group information (if group) |
| `index.createdAt` | string | Original creation timestamp |
| `index.updatedAt` | string | Last update timestamp |

## Example Usage

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

### Python

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

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## Error Responses

### 400 Bad Request

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

## Validations and Business Rules

- **Assigning to a user (`assignedUser`)**:
  - Enforce user index quota via `checkUserIndexQuota` when converting to personal or changing the assignee. Exceeded quota returns 403.
- **Assigning to a group (`assignedGroup`)**:
  - Group must exist and be active (`status != 'Archived'`); invalid/inactive groups return 400.

## Normalization and Storage

- When renaming, `name` continues to be stored normalized; `sharedIndexName` defaults to the normalized name if not explicitly set.

## Typical Error Shapes

### 403 Index Quota Exceeded

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
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
    "message": "Cannot update this index"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
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

## Updateable Fields

| Field | Description | Notes |
|-------|-------------|-------|
| `name` | Index name | Must be unique across the system |
| `assignedUser` | User assignment | Assigns index to a specific user |
| `assignedGroup` | Group assignment | Assigns index to a specific group |

## Use Cases

- **Name Changes**: Rename indexes for better organization
- **User Assignment**: Reassign indexes to different users
- **Group Assignment**: Reassign indexes to different groups
- **Ownership Transfer**: Change index ownership between users

## Rate Limits

- **Default**: 50 requests per minute
- **Daily**: 5,000 requests per day
- **Monthly**: 150,000 requests per month

## Notes

- This endpoint is only accessible by administrators
- Limited Fields: Only name, assignedUser, and assignedGroup can be updated
- Assignment Logic: Assigning to a user clears group assignment and vice versa
- Validation: User and group IDs are validated before assignment
- No Settings: Cannot update settings, metadata, or other configuration
- The `updatedAt` timestamp is automatically updated
- Index names must remain unique across the system 
