---
id: policies
title: SMLTP Policies
sidebar_label: SMLTP Policies
description: Retrieve all SMLTP security policies
openapi: "GET /smltp-policies/all"
---

# SMLTP Policies

Retrieve all available SMLTP (Secure Model Language Transfer Protocol) security policies.

## Endpoint

```
GET /smltp-policies/all
```

## Description

Retrieve all available SMLTP policies including built-in and custom policies. **Admin only access required.**

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
❌ No query parameters supported - the actual API doesn't accept any query parameters.

## Example Request

```bash
GET /smltp-policies/all
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `data` | object | Response data object |
| `data.builtInPolicies` | array | Array of built-in policy objects |
| `data.customPolicies` | array | Array of custom policy objects |
| `data.activePolicyTemplate` | string | Currently active policy template ID |
| `data.summary` | object | Summary statistics |
| `data.summary.totalPolicies` | integer | Total number of policies |
| `data.summary.builtInCount` | integer | Number of built-in policies |
| `data.summary.customCount` | integer | Number of custom policies |

## Example Usage

### JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

### Python

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
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

## Policy Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Policy identifier |
| `name` | string | Policy name |
| `type` | string | Policy type ("built-in" or "custom") |
| `description` | string | Policy description |
| `isActive` | boolean | Whether this policy is currently active |
| `createdAt` | string | Creation timestamp (custom policies only) |

## Use Cases

- **Policy Discovery**: Find available security policies
- **Compliance Planning**: Understand policy requirements
- **Security Configuration**: Select appropriate policies
- **Active Policy Management**: Check which policy is currently active
- **Integration**: Apply policies to chat completions

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- This endpoint requires admin privileges
- No Parameters: No query parameters are supported
- Built-in Policies: Returns predefined system policies
- Custom Policies: Returns custom policies if any exist
- Active Policy: Shows which policy template is currently active
- Flat Response: Response is nested under data object 
