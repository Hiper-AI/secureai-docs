---
sidebar_position: 3
title: "Security Policies"
openapi: "GET /smltp-policies"
---



# Get Security Policies

Retrieve available SMLTP (Secure Model Language Transfer Protocol) security policies.

## Endpoint

```
GET /smltp-policies
```

## Description

Retrieve available SMLTP (Secure Model Language Transfer Protocol) security policies. These policies determine how your data is processed and protected.

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `success` | boolean | Always true for successful requests | `true` |
| `policies` | array | List of available security policies | See example |
| `restrictions` | object | Policy access restrictions | See example |

### Policy Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique policy identifier | `"internal"` |
| `name` | string | Policy display name | `"Internal"` |
| `description` | string | Policy description | `"For internal company data"` |

### Restrictions Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `allowed_policies` | array | Array of allowed policy IDs | `["public", "internal", "confidential"]` |

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Example Usage

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Policy Types

### Public
- **Use Case**: Public, non-sensitive data
- **Security Level**: Low
- **Data Processing**: Standard processing with basic security

### Internal
- **Use Case**: Internal company data
- **Security Level**: Medium
- **Data Processing**: Enhanced security with additional safeguards

### Confidential
- **Use Case**: Confidential business data
- **Security Level**: High
- **Data Processing**: Maximum security with strict data handling

## Notes

- Choose the appropriate policy based on your data sensitivity
- Policies affect how your data is processed and protected
- Use the policy ID in chat completion requests
- Some policies may be restricted based on your account type 
