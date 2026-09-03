---
id: list
title: "List Roles"
sidebar_label: "List Roles"
description: "Retrieve all available user roles"
openapi: "GET /roles"
---


# List Roles

Retrieve all available user roles in the SecureAI system.

## Endpoint

```
GET /roles
```

## Description

This endpoint returns all user roles available in the SecureAI system. It provides detailed information about each role including permissions, descriptions, and metadata. This is useful for understanding the available roles and their capabilities.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | 1 | Page number for pagination (default: 1) |
| `limit` | integer | No | 20 | Number of roles per page (default: 20) |
| `search` | string | No | - | Search term for name, display name, or description |
| `isSystem` | string | No | - | Filter by system roles (true/false) |
| `sortBy` | string | No | createdAt | Field to sort by (default: "createdAt") |
| `sortOrder` | string | No | desc | Sort order (asc/desc, default: "desc") |

## Example Request

```bash
GET /roles?page=1&limit=10&search=admin
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `roles` | array | Array of role objects |
| `roles[].id` | string | Unique role identifier |
| `roles[].name` | string | Role name |
| `roles[].displayName` | string | Display name for the role |
| `roles[].description` | string | Role description |
| `roles[].isSystem` | boolean | Whether this is a system role |
| `roles[].hasAdminPanelAccess` | boolean | Whether role has admin panel access |
| `roles[].permissions` | array | Array of permission objects |
| `roles[].permissions[].section` | string | Permission section |
| `roles[].permissions[].level` | string | Permission level |
| `roles[].canInteractWithAI` | boolean | Whether role can interact with AI |
| `roles[].canUseChat` | boolean | Whether role can use chat |
| `roles[].userCount` | integer | Number of users with this role |
| `roles[].createdBy` | object | User who created the role |
| `roles[].createdBy.id` | string | Creator user ID |
| `roles[].createdBy.name` | string | Creator name |
| `roles[].createdBy.email` | string | Creator email |
| `roles[].createdAt` | string | Creation timestamp |
| `roles[].updatedAt` | string | Last update timestamp |
| `pagination` | object | Pagination information |
| `pagination.page` | integer | Current page number |
| `pagination.limit` | integer | Items per page |
| `pagination.total` | integer | Total number of roles |
| `pagination.pages` | integer | Total number of pages |

## Example Usage

### JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

### Python

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
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


## Use Cases

- **Role Management**: List all available roles for user assignment
- **Permission Review**: Understand what permissions each role has
- **Access Control**: Plan user access based on available roles
- **User Assignment**: Assign roles to users based on their needs
- **Role Analysis**: Analyze role usage and user distribution

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- This endpoint requires admin privileges
- Page-based Pagination: Uses page parameter, not offset
- Search: Searches in name, displayName, and description fields
- System Roles: Can filter by system vs custom roles
- Sorting: Can sort by any field in ascending or descending order
- Flat Response: Response is not nested under data object
- User Count: Shows how many users have each role
- Creator Info: Shows who created each role 
