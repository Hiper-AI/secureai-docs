---
id: audit-logs
title: "Audit Logs"
sidebar_label: "Audit Logs"
description: "Retrieve SMLTP audit logs"
openapi: "GET /audit-logs"
---



# Audit Logs

Retrieve SMLTP (Secure Model Language Transfer Protocol) audit logs for security monitoring and compliance.

## Endpoint

```
GET /audit-logs
```

## Description

This endpoint returns SMLTP audit logs that track security events, policy violations, and compliance activities. This is useful for security monitoring, compliance auditing, and investigating security incidents.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | 1 | Page number for pagination (default: 1) |
| `limit` | integer | No | 50 | Number of logs per page (default: 50) |
| `startDate` | string | No | - | Start date for filtering (ISO 8601 format) |
| `endDate` | string | No | - | End date for filtering (ISO 8601 format) |
| `type` | string | No | - | Filter by log type |
| `severity` | string | No | - | Filter by severity level |
| `userId` | string | No | - | Filter by user ID |
| `search` | string | No | - | Search term for description or metadata |

## Example Request

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `data` | object | Response data object |
| `data.logs` | array | Array of audit log objects |
| `data.logs[].id` | string | Unique audit log identifier |
| `data.logs[].timestamp` | string | Log timestamp (ISO 8601) |
| `data.logs[].type` | string | Type of audit event |
| `data.logs[].severity` | string | Severity level |
| `data.logs[].description` | string | Event description |
| `data.logs[].user` | object | User information (if available) |
| `data.logs[].user.id` | string | User ID |
| `data.logs[].user.name` | string | User name |
| `data.logs[].user.email` | string | User email |
| `data.logs[].metadata` | object | Additional metadata |
| `data.logs[].complianceCategory` | string | Compliance category |
| `data.logs[].outcome` | string | Event outcome |
| `data.pagination` | object | Pagination information |
| `data.pagination.page` | integer | Current page number |
| `data.pagination.limit` | integer | Items per page |
| `data.pagination.total` | integer | Total number of logs |
| `data.pagination.pages` | integer | Total number of pages |
| `data.dateRange` | object | Date range information |

## Example Usage

### JavaScript

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

### Python

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
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

### Date Range

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### Event Filtering

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### User Filtering

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## Use Cases

- **Security Monitoring**: Monitor security events and policy violations
- **Compliance Auditing**: Track compliance activities and violations
- **Incident Investigation**: Investigate security incidents and breaches
- **Policy Analysis**: Analyze policy effectiveness and enforcement
- **User Activity**: Track user actions and API usage

## Rate Limits

- **Default**: 100 requests per minute
- **Daily**: 10,000 requests per day
- **Monthly**: 300,000 requests per month

## Notes

- This endpoint requires admin privileges
- Pagination: Uses page parameter, not offset
- Date Range: Defaults to last 7 days if no dates provided
- Search: Searches in description and metadata.operation fields
- Nested Response: Response is nested under data object
- User Info: User information is populated when available
- Logs are retained for compliance purposes 
