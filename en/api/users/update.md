---
id: update
title: "Update User"
sidebar_label: "Update User"
description: "Update an existing user account"
openapi: "PUT /users/{userId}"
---



# Update User

Update an existing user account with new information.

## Endpoint

```
PUT /users/{userId}
```

## Description

This endpoint allows administrators to update an existing user account. You can modify user details such as name, email, role, license tier, and other account settings.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | The unique identifier of the user to update |

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Full name of the user |
| `username` | string | No | Unique username for the user |
| `email` | string | No | Email address of the user |
| `password` | string | No | New password for the user account |
| `role` | string | No | User role (admin, user, globalReader) |
| `license` | string | No | License tier (Essential, Growth, Ultra, Early Access) |
| `status` | integer | No | Account status (0=inactive, 1=active) |
| `roleId` | string | No | Custom role ID (MongoDB ObjectId) |
| `setupCompleted` | boolean | No | Whether user setup is completed |
| `isVerified` | boolean | No | Whether user is verified |

## Example Request

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Success message |
| `user` | object | Updated user object |
| `user.id` | string | Unique user identifier |
| `user.name` | string | User's full name |
| `user.username` | string | User's username |
| `user.email` | string | User's email address |
| `user.role` | string | User's role in the system |
| `user.license` | string | User's license tier |
| `user.status` | integer | User's account status (0=inactive, 1=active) |
| `user.isVerified` | boolean | Whether user is verified |
| `user.setupCompleted` | boolean | Whether user setup is completed |
| `user.authType` | string | Authentication type |
| `user.customRole` | object | Custom role information (if assigned) |
| `user.createdAt` | string | Account creation timestamp |
| `user.updatedAt` | string | Last update timestamp |
| `user.lastActive` | string | User's last activity timestamp |

## Example Usage

### JavaScript

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

### Python

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## Validations and Business Rules

- **License value**: Must be in allowed licenses (`Essential`, `Growth`, `Ultra`, `Early Access`). Invalid values return 400.
- **License capacity**: Enforced via `checkLicenseCapacity`; returns 400 when the selected tier is full.
- **License downgrade guard**: If changing to a lower tier reduces personal index quota, the change is blocked when current personal index count exceeds `INDEX_QUOTAS[new_license]`; returns 400 with explicit guidance.
- **Email normalization**: Lowercased and trimmed before validation and storage.
- **Username normalization**: Lowercased and trimmed before validation and storage.
- **Email format**: Simple regex validation; invalid emails return 400.
- **Username format**: Must match `^[a-z0-9.-]{3,30}$`; invalid usernames return 400.
- **Uniqueness**: `email`, `username`, and `name` must remain unique; conflicts return 409.

## Normalization and Storage

- `email` and `username` are always stored lowercased and trimmed.

## Typical Error Shapes

### 400 Invalid License

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400 License Unavailable

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 License Downgrade Exceeds Quota

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 Invalid Email

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 Invalid Username

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 Conflict (Uniqueness)

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | Administrator | Full system access |
| `user` | Regular user | Standard user access |
| `globalReader` | Global Reader | Read-only admin panel access |

## License Tiers

| Tier | Description | Features |
|------|-------------|----------|
| `Essential` | Basic tier | Limited features |
| `Growth` | Professional tier | Enhanced features |
| `Ultra` | Premium tier | Full features |
| `Early Access` | Early access tier | Beta features |

## Account Status

| Status | Description |
|--------|-------------|
| `0` | Inactive account |
| `1` | Active account |

## Use Cases

- **Role Management**: Updating user roles for access control
- **License Upgrades**: Changing user license tiers
- **Account Maintenance**: Updating user information and metadata
- **Status Management**: Activating or suspending user accounts
- **Profile Updates**: Modifying user names, emails, or other details

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- Only administrators can update user accounts
- Email addresses must be unique across all users
- Password updates are optional and will only be applied if provided
- Metadata updates are merged with existing metadata
- The `updatedAt` timestamp is automatically updated on successful operations 
