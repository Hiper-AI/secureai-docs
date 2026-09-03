---
id: list
title: "List Groups"
sidebar_label: "List Groups"
description: "Retrieve all user groups"
openapi: "GET /groups"
---


# List Groups

Retrieve a list of all user groups in the system with pagination and filtering options.

## Endpoint

```
GET /groups
```

## Description

This endpoint returns all user groups available in the SecureAI system. It provides detailed information about each group including members, permissions, and metadata. This is useful for managing user access and organizational structure.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 20 | Number of groups per page (1-100) |
| `search` | string | No | - | Search term for group name or description |
| `status` | string | No | - | Filter by group status |
| `sortBy` | string | No | createdAt | Field to sort by |
| `sortOrder` | string | No | desc | Sort order (asc, desc) |

## Example Request

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `groups[]` | array | Array of group objects |
| `groups[].id` | string | Unique group identifier |
| `groups[].name` | string | Group name |
| `groups[].description` | string | Group description |
| `groups[].status` | string | Group status |
| `groups[].userCount` | integer | Number of users in the group |
| `groups[].users` | array | Array of user objects in the group |
| `groups[].users[].id` | string | User ID |
| `groups[].users[].name` | string | User name |
| `groups[].users[].email` | string | User email |
| `groups[].createdAt` | string | Creation timestamp |
| `pagination` | object | Pagination information |

## Example Usage

### JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

### Python

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

## Filtering Examples

### Search Groups

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### Sort Options

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### Pagination

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## Use Cases

- **Group Management**: List all groups for administrative purposes
- **User Organization**: Discover available groups for user assignment
- **Access Control**: Review group permissions and member counts
- **Reporting**: Generate reports on group structure and membership
- **Integration**: Discover groups for application integration

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- This endpoint is only accessible by administrators
- Pagination: Uses page parameter, not offset
- Flat Response: Response is not nested under data object
- User Details: Includes full user information for each group member
- Status Filter: Can filter by group status
- Search functionality works across group names and descriptions
- Sorting options help organize results by different criteria 
