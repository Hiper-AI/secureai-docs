---
id: create
title: "Create SMLTP Policy"
sidebar_label: "Create SMLTP Policy"
description: "Create a new SMLTP security policy"
openapi: "POST /smltp-policies/active"
---



# Create SMLTP Policy

Create a new SMLTP (Secure Model Language Transfer Protocol) security policy for your account.

## Endpoint

```
POST /smltp-policies
```

## Description

Create a new custom SMLTP policy. Admin only access required.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Policy name |
| `description` | string | Yes | Policy description |
| `policy` | object | Yes | Policy configuration object |
| `setAsActive` | boolean | No | Whether to set this policy as active immediately (default: false) |

## Example Request

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## Success Response

**Status Code**: `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Success message |
| `policy` | object | Created policy object |
| `policy.id` | string | Policy identifier (generated from name) |
| `policy.name` | string | Policy name |
| `policy.description` | string | Policy description |
| `policy.type` | string | Policy type ("custom") |
| `policy.isActive` | boolean | Whether policy is currently active |
| `policy.createdAt` | string | Creation timestamp |

## Example Usage

### JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

### Python

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
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
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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

- **Custom Security**: Create policies tailored to your needs
- **Compliance**: Implement specific regulatory requirements
- **Risk Management**: Define security measures for risk mitigation
- **Data Protection**: Establish privacy and data handling rules
- **Policy Management**: Create and manage custom SMLTP policies

## Rate Limits

- **Default**: 50 requests per minute
- **Daily**: 5,000 requests per day
- **Monthly**: 150,000 requests per month

## Notes

- This endpoint requires admin privileges
- Required Fields: name, description, and policy are required
- Policy ID: Generated from name (lowercase, hyphens for spaces)
- Unique Names: Policy names must be unique
- Set Active: Can optionally set as active immediately
- Flat Response: Response is not nested under data object 
