---
sidebar_position: 1
title: Get All Users
openapi: "GET /users"
---

# Get All Users

Retrieve all users with pagination and filtering. Only accessible by administrators.

## Endpoint

```
GET /users
```

## Description

This endpoint allows administrators to retrieve a paginated list of all users in the system. It supports filtering by various criteria including role, license, status, and search terms. This is an administrative endpoint that requires appropriate permissions.

## Authentication

Required. Include your API key in the Authorization header.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 20 | Number of users per page (1-100) |
| `search` | string | No | - | Search term for name, email, or username |
| `role` | string | No | - | Filter by user role (admin, user, globalReader) |
| `license` | string | No | - | Filter by user license (Essential, Growth, Ultra, Early Access) |
| `status` | integer | No | - | Filter by user status (0=inactive, 1=active) |
| `sortBy` | string | No | createdAt | Field to sort by |
| `sortOrder` | string | No | desc | Sort order (asc, desc) |

### Example Request

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

With search:

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful requests |
| `users` | array | Array of user objects |
| `users[].id` | string | User's unique identifier |
| `users[].name` | string | User's full name |
| `users[].username` | string | User's username |
| `users[].email` | string | User's email address |
| `users[].role` | string | User's role (admin, user, globalReader) |
| `users[].license` | string | User's license tier (Essential, Growth, Ultra, Early Access) |
| `users[].status` | integer | User status (0=inactive, 1=active) |
| `users[].isVerified` | boolean | Whether user is verified |
| `users[].setupCompleted` | boolean | Whether user setup is completed |
| `users[].authType` | string | Authentication type (basic, auth0) |
| `users[].mfaEnabled` | boolean | Whether MFA is enabled |
| `users[].customRole` | object | Custom role information (if assigned) |
| `users[].customRole.id` | string | Custom role ID |
| `users[].customRole.name` | string | Custom role name |
| `users[].customRole.displayName` | string | Custom role display name |
| `users[].createdAt` | string | User creation timestamp |
| `users[].updatedAt` | string | User last update timestamp |
| `users[].lastActive` | string | User's last activity timestamp |
| `pagination` | object | Pagination information |
| `pagination.page` | integer | Current page number |
| `pagination.limit` | integer | Items per page |
| `pagination.total` | integer | Total number of users |
| `pagination.pages` | integer | Total number of pages |

## Example Usage

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Error Responses

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
  "message": "Admin access required"
}
```

## Filtering Examples

### Search by Name or Email

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filter by Role

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filter by License

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filter by Status

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Sort by Last Active

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Use Cases

- **User Management**: View and manage all users in the system
- **User Analytics**: Analyze user distribution by role, license, or status
- **Search and Filter**: Find specific users based on various criteria
- **Administrative Tasks**: Support administrative operations and reporting

## Role Descriptions

- **admin**: Full system access with administrative control
- **user**: Standard access to chat features and personal knowledge bases  
- **globalReader**: Read-only access to admin panel with viewing permissions

## License Descriptions

- **Essential**: Basic tier with 29,000 points/month
- **Growth**: Mid-tier with enhanced features
- **Ultra**: Premium tier with maximum features
- **Early Access**: Beta tier with experimental capabilities

## Rate Limits

This endpoint follows the standard rate limits:
- 60 requests per minute
- 1000 requests per hour 
