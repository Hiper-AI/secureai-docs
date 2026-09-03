---
sidebar_position: 1
title: Health Check
openapi: "GET /health"
---

# Health Check

Check if the API is running and healthy. No authentication required.

## Endpoint

```
GET /health
```

## Description

This endpoint allows you to verify that the SecureAI External API is running and healthy. No authentication is required for this endpoint.

## Request

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `success` | boolean | Always true for successful health check | `true` |
| `status` | string | Health status of the API | `"healthy"` |
| `timestamp` | string | Current server timestamp in ISO 8601 format | `"2024-01-15T10:30:00.000Z"` |
| `version` | string | Current API version | `"1.0.0"` |

## Example Usage

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

### Python

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Notes

- This endpoint does not require authentication
- Use this endpoint to monitor API availability
- The response includes the current API version for compatibility checking 
