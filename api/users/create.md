---
sidebar_position: 2
title: Create New User
openapi: "POST /users"
---

# Create New User

Create a new user account. Only accessible by administrators.

## Endpoint

```
POST /users
```

## Description

This endpoint allows administrators to create new user accounts in the system. You can specify various user attributes including role, license, and authentication type. This is an administrative endpoint that requires appropriate permissions.

## User Creation Flow

**Basic Auth** (`authType: "basic"`): User receives a welcome email with a password setup link. Account is created unverified until password is set.

**Enterprise SSO** (`authType: "enterprise"`): User is created verified and can sign in via enterprise SSO (Auth0, Microsoft AD, etc.). No password setup required.

## Authentication

Required. Include your API key in the Authorization header.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request

### Request Body

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | Yes | - | User's full name |
| `username` | string | No | - | Unique username (auto-generated from email if not provided) |
| `email` | string | Yes | - | User's email address |
| `role` | string | No | user | User's role (admin, user, globalReader) |
| `license` | string | No | Essential | User's license tier (Essential, Growth, Ultra, Early Access) |
| `roleId` | string | No | - | Custom role ID (MongoDB ObjectId) |
| `setupCompleted` | boolean | No | false | Whether user setup is completed |
| `authType` | string | No | basic | Authentication type (basic, enterprise) |

### Example Request

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## Response

### Success Response (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful requests |
| `message` | string | Success message |
| `user` | object | Created user object |
| `user.id` | string | User's unique identifier |
| `user.name` | string | User's full name |
| `user.username` | string | User's username |
| `user.email` | string | User's email address |
| `user.role` | string | User's role |
| `user.license` | string | User's license tier |
| `user.status` | integer | User status (1=active) |
| `user.isVerified` | boolean | Whether user is verified |
| `user.setupCompleted` | boolean | Whether user setup is completed |
| `user.authType` | string | Authentication type |
| `user.createdAt` | string | User creation timestamp |

## Example Usage

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 Invalid AuthType

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 Missing Required Fields

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
}
```

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

### 409 Conflict

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## Validations and Business Rules

- **License value**: Must be one of the allowed licenses (`Essential`, `Growth`, `Ultra`, `Early Access`). Invalid values return 400.
- **License capacity**: Enforced via `checkLicenseCapacity`. If capacity is full for the selected tier, returns 400.
- **Email normalization**: Lowercased and trimmed before validation and storage.
- **Username normalization**: Lowercased and trimmed before validation and storage. Auto-generated from email if not provided.
- **Email format**: Validated with a simple regex; invalid emails return 400.
- **Username format**: Must match `^[a-z0-9.-]{3,30}$`; invalid usernames return 400.
- **Uniqueness**: `email`, `username`, and `name` must be unique. Conflicts return 409.
- **Email invite behavior**: For basic auth, users receive welcome emails with password setup links.

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | Administrator | Full system access |
| `user` | Regular user | Standard user access |
| `globalReader` | Global Reader | Read-only admin panel access |

## License Tiers

| License | Description | Features |
|---------|-------------|----------|
| `Essential` | Basic tier | Limited features |
| `Growth` | Professional tier | Enhanced features |
| `Ultra` | Premium tier | Full features |
| `Early Access` | Early access tier | Beta features |

## Authentication Types

| Type | Description |
|------|-------------|
| `basic` | Username/password authentication (user receives password setup email) |
| `enterprise` | Enterprise SSO integration (Auth0, Microsoft AD, etc.) |

## Use Cases

- **User Onboarding**: Create new user accounts for team members
- **Passwordless Onboarding**: Create users who receive email invites to set their own passwords
- **SSO Integration**: Create users who authenticate via external identity providers
- **Bulk User Creation**: Programmatically create multiple users
- **Integration**: Create users from external systems
- **Administrative Tasks**: Manage user accounts through API

## Rate Limits

This endpoint follows the standard rate limits:
- 60 requests per minute
- 1000 requests per hour 
