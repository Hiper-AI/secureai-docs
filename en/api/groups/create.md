---
id: create
title: "Create Group"
sidebar_label: "Create Group"
description: "Create a new user group"
openapi: "POST /groups"
---



# Create Group

Create a new user group for organizing users and managing access permissions.

## Endpoint

```
POST /groups
```

## Description

This endpoint allows administrators to create new user groups. Groups are used to organize users, manage permissions, and control access to different parts of the system. You can specify the group name, description, and metadata during creation.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Group name |
| `description` | string | Yes | Group description |
| `users` | array | No | Array of user IDs to add to the group |
| `status` | string | No | Group status (defaults to "Active") |

## Example Request

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## Success Response

**Status Code**: `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Success message |
| `group` | object | Created group object |
| `group.id` | string | Unique group identifier |
| `group.name` | string | Group name |
| `group.description` | string | Group description |
| `group.status` | string | Group status |
| `group.userCount` | integer | Number of users in the group |
| `group.users` | array | Array of user objects in the group |
| `group.users[].id` | string | User ID |
| `group.users[].name` | string | User name |
| `group.users[].email` | string | User email |
| `group.createdAt` | string | Creation timestamp |

## Example Usage

### JavaScript

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

### Python

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
  }'
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name is required",
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
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

- **User Organization**: Create groups to organize users by department or function
- **Access Control**: Establish groups for managing permissions and access
- **Team Management**: Create groups for different teams or projects
- **Reporting**: Organize users for reporting and analytics
- **Integration**: Create groups for third-party system integration

## Rate Limits

- **Default**: 50 requests per minute
- **Daily**: 5,000 requests per day
- **Monthly**: 150,000 requests per month

## Notes

- This endpoint is only accessible by administrators
- Required Fields: Both name and description are required
- User Assignment: Can assign users to the group during creation
- Status: Defaults to "Active" if not specified
- Validation: User IDs are validated before assignment
- Flat Response: Response is not nested under data object
- The group is immediately available for use after creation 
