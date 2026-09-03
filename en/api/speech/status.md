---
sidebar_position: 2
title: "Get S2S Time Status"
openapi: "GET /speech/s2s/status"
---



# Get S2S Time Status

Retrieve the current Speech-to-Speech (S2S) time status for the billing user.

## Endpoint

```
GET /speech/s2s/status
```

## Description

Retrieve the current Speech-to-Speech (S2S) time status for the billing user, including remaining time, total monthly limit, used time, and renewal information.

### S2S Time Quotas

- Quotas are based on the user's license tier
- Time resets monthly based on the license assignment date
- Non-renewable trial licenses don't auto-reset

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string | No | User ID to check status for (defaults to API key owner) |

## Request Example

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Remaining minutes:', data.remaining_minutes);
console.log('Total minutes:', data.total_minutes);
console.log('Used minutes:', data.used_minutes);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Remaining minutes:', result['remaining_minutes'])
print('Total minutes:', result['total_minutes'])
print('Used minutes:', result['used_minutes'])
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "remaining_minutes": 38.2896,
  "total_minutes": 45,
  "used_minutes": 6.7104,
  "has_time_remaining": true,
  "next_renewal_date": "2025-12-01T12:55:35.721Z",
  "non_renewable": false,
  "request_id": "a8c307b4-c0c9-4b30-98db-5aced06c1cfe"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for successful requests |
| `remaining_minutes` | number | Remaining S2S time in minutes |
| `total_minutes` | number | Total monthly S2S time limit |
| `used_minutes` | number | Used S2S time this month |
| `has_time_remaining` | boolean | Whether user has any remaining S2S time |
| `next_renewal_date` | string\|null | When the S2S time quota will reset (null for non-renewable licenses) |
| `non_renewable` | boolean | Whether this is a non-renewable trial license |
| `request_id` | string | Request ID for tracking |

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 Not Found

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Notes

- Check this endpoint before initiating S2S sessions to ensure sufficient time is available
- The `user_id` parameter allows checking status for a different user (defaults to API key owner)
- Time quotas are based on the user's license tier
- Non-renewable trial licenses will have `non_renewable: true` and `next_renewal_date: null`

