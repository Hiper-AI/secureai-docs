---
id: active
title: Active SMLTP Policies
sidebar_label: Active SMLTP Policies
description: Retrieve currently active SMLTP policies
openapi: "GET /smltp-policies/active"
---

# Active SMLTP Policies

Retrieve the currently active SMLTP (Secure Model Language Transfer Protocol) policies for your account.

## Endpoint

```
GET /smltp-policies/active
```

## Description

Retrieve the currently active SMLTP policy configuration. **Admin only access required.**

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Example Request

```bash
GET /smltp-policies/active
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `data` | object | Response data object |
| `data.template` | string | Currently active policy template ID |
| `data.policy` | object | Current policy configuration object |
| `data.lastUpdated` | string | Last update timestamp |

## Example Usage

### JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

### Python

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
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

- **Policy Review**: Check which policy template is currently active
- **Configuration Check**: Review current policy configuration
- **Template Management**: Understand which policy template is being used
- **Troubleshooting**: Understand current policy settings
- **Audit Preparation**: Review active policy for compliance audits

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- This endpoint requires admin privileges
- Single Policy: Returns the currently active policy template and configuration
- No Arrays: Does not return an array of policies, just the active one
- Template ID: Shows which policy template is currently active
- Policy Config: Returns the actual policy configuration object
- Nested Response: Response is nested under data object 
