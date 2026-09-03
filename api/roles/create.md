---
id: create
title: Create Role
sidebar_label: Create Role
description: Create a new user role
openapi: "POST /roles"
---

# Create Role

Create a new custom user role with specific permissions.

## Endpoint

```
POST /roles
```

## Description

This endpoint allows administrators to create new custom user roles. Custom roles can have specific permissions tailored to your organization's needs. You can specify the role name, description, and permissions during creation.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Role name (system identifier) |
| `displayName` | string | Yes | Human-readable role name |
| `description` | string | Yes | Description of the role purpose |
| `hasAdminPanelAccess` | boolean | No | Whether role has admin panel access (default: false) |
| `permissions` | array | No | Array of permission objects |
| `canInteractWithAI` | boolean | No | Whether role can interact with AI (default: true) |
| `canUseChat` | boolean | No | Whether role can use chat (default: true) |

## Example Request

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## Success Response

**Status Code**: `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Success message |
| `role` | object | Created role object |
| `role.id` | string | Unique role identifier |
| `role.name` | string | Role name |
| `role.displayName` | string | Display name for the role |
| `role.description` | string | Role description |
| `role.isSystem` | boolean | Whether this is a system role |
| `role.hasAdminPanelAccess` | boolean | Whether role has admin panel access |
| `role.permissions` | array | Array of permission objects |
| `role.permissions[].section` | string | Permission section |
| `role.permissions[].level` | string | Permission level |
| `role.canInteractWithAI` | boolean | Whether role can interact with AI |
| `role.canUseChat` | boolean | Whether role can use chat |
| `role.userCount` | integer | Number of users with this role |
| `role.createdBy` | object | User who created the role |
| `role.createdBy.id` | string | Creator user ID |
| `role.createdBy.name` | string | Creator name |
| `role.createdBy.email` | string | Creator email |
| `role.createdAt` | string | Creation timestamp |

## Example Usage

### JavaScript

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

### Python

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
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
    "message": "Admin privileges required"
  }
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## Available Permission Sections

| Section | Description |
|---------|-------------|
| `home` | Home dashboard access |
| `user-management` | User management operations |
| `index-management` | Index management operations |
| `analytics` | Analytics and reporting |
| `group-management` | Group management operations |
| `integrations` | Integration management |
| `services-status` | Services status monitoring |
| `settings` | System settings |
| `announcements` | Announcement management |
| `smltp-security` | SMLTP security features |

## Available Permission Levels

| Level | Description |
|-------|-------------|
| `none` | No access to the section |
| `reader` | Read-only access to the section |
| `admin` | Full administrative access to the section |

## Use Cases

- **Custom Roles**: Create roles tailored to your organization's needs
- **Access Control**: Define specific permissions for different user types
- **Security**: Implement least-privilege access principles
- **Compliance**: Create roles that meet regulatory requirements
- **Integration**: Define roles for third-party system integration

## Rate Limits

- **Default**: 50 requests per minute
- **Daily**: 5,000 requests per day
- **Monthly**: 150,000 requests per month

## Notes

- **Admin Only**: This endpoint requires admin privileges
- **Required Fields**: name, displayName, and description are required
- **Permission Structure**: Permissions are objects with section and level properties
- **System Roles**: Custom roles are never system roles
- **Flat Response**: Response is not nested under data object
- **Creator Info**: Shows who created the role
- **User Count**: Starts at 0 for new roles
- Role names must be unique within the system
- The role is immediately available for user assignment 
