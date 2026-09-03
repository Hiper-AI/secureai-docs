---
sidebar_position: 3
title: "Log S2S Session Duration"
openapi: "POST /speech/s2s/log-session"
---



# Log S2S Session Duration

Log the duration of a completed Speech-to-Speech session and deduct the time from the user's S2S time quota.

## Endpoint

```
POST /speech/s2s/log-session
```

## Description

Log the duration of a completed Speech-to-Speech session and deduct the time from the user's S2S time quota. This should be called after a session ends to track usage accurately.

### Usage Tracking

- Duration is specified in milliseconds
- Automatically converted to minutes and deducted from user's quota
- Time is tracked per-user based on license tier
- Activity logs are created for audit purposes

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `durationMs` | integer | Yes | Session duration in milliseconds (minimum: 0) |
| `user_id` | string | No | User ID to bill this session to (defaults to API key owner) |

## Request Example

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "durationMs": 42624,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
  }'
```

### JavaScript/Node.js

```javascript
// Calculate session duration in milliseconds
const sessionStartTime = Date.now();
// ... session happens ...
const sessionEndTime = Date.now();
const durationMs = sessionEndTime - sessionStartTime;

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    durationMs: durationMs,
    user_id: '60a7c8f5e8b4f5001f7a8c23'
  })
});

const data = await response.json();
console.log('Session logged:', data.message);
```

### Python

```python
import requests
import time

# Calculate session duration
session_start = time.time() * 1000  # Convert to milliseconds
# ... session happens ...
session_end = time.time() * 1000
duration_ms = int(session_end - session_start)

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "durationMs": duration_ms,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Session logged:', result['message'])
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for successful requests |
| `message` | string | Success message |
| `request_id` | string | Request ID for tracking |

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
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

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## Notes

- Call this endpoint after each S2S session ends to accurately track usage
- Duration should be calculated from when the WebRTC connection is established until it's closed
- Time is automatically converted from milliseconds to minutes and deducted from the user's quota
- The `user_id` parameter allows billing to a different user account
- Activity logs are automatically created for audit purposes
- Ensure you have sufficient remaining time before starting a session (check with `/speech/s2s/status`)

