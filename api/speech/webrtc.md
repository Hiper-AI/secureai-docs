---
sidebar_position: 1
title: Initiate Speech-to-Speech WebRTC Session
openapi: "POST /speech/s2s/webrtc"
---

# Initiate Speech-to-Speech WebRTC Session

Establish a WebRTC connection for real-time speech-to-speech conversations using OpenAI Realtime API.

## Endpoint

```
POST /speech/s2s/webrtc
```

## Description

Establishes a WebRTC connection for real-time speech-to-speech conversations using OpenAI Realtime API. This endpoint accepts a WebRTC SDP offer and returns an SDP answer that can be used to establish a peer connection with OpenAI's Realtime API.

### Usage Flow

1. Client creates a WebRTC offer (RTCPeerConnection.createOffer)
2. Client sends the SDP offer to this endpoint
3. This endpoint proxies the offer to OpenAI Realtime API
4. Client receives SDP answer and establishes WebRTC connection
5. Client can then have real-time voice conversations with the AI

### S2S Time Tracking

- Each user has a monthly S2S time quota based on their license
- Time is tracked in minutes and deducted when sessions are logged
- Use `/speech/s2s/status` to check remaining time
- Use `/speech/s2s/log-session` to log session duration and deduct time

### SMLTP Integration

- All requests are processed through SMLTP for security and compliance
- Model validation is enforced based on the specified SMLTP policy
- Requests are audited and logged for compliance tracking

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sdp` | string | Yes | WebRTC SDP offer from the client's RTCPeerConnection |
| `model` | string | No | OpenAI Realtime model (default: "gpt-4o-mini-realtime-preview") |
| `voice` | string | No | Voice to use for AI response (default: "alloy") |
| `smltp_policy` | string | No | SMLTP policy (default: "internal") |
| `output_audio` | boolean | No | Whether to enable audio output (default: true) |
| `user_id` | string | No | User ID to bill this session to (defaults to API key owner) |
| `instructions` | string | No | Optional system instructions for the AI assistant |

### Available Models

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### Available Voices

- `alloy` (default)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### Available SMLTP Policies

- `public`
- `internal` (default)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## Request Example

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": true,
    "instructions": "You are a helpful customer service agent."
  }'
```

### JavaScript/Node.js

```javascript
// Create WebRTC peer connection
const pc = new RTCPeerConnection();

// Create offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// Send SDP offer to SecureAI
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sdp: offer.sdp,
    model: 'gpt-4o-mini-realtime-preview',
    voice: 'alloy',
    smltp_policy: 'internal',
    output_audio: true,
    instructions: 'You are a helpful customer service agent.'
  })
});

// Get SDP answer
const sdpAnswer = await response.text();

// Set remote description
await pc.setRemoteDescription(new RTCSessionDescription({
  type: 'answer',
  sdp: sdpAnswer
}));

// Now you can have real-time voice conversations
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": True,
    "instructions": "You are a helpful customer service agent."
}

response = requests.post(url, headers=headers, json=data)
sdp_answer = response.text
print('SDP Answer:', sdp_answer)
```

## Response

### Success Response (200)

**Content-Type**: `application/sdp`

The response is an SDP answer string that can be used with `RTCPeerConnection.setRemoteDescription()`.

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 Forbidden

#### S2S Time Limit Reached

```json
{
  "success": false,
  "error": "S2S time limit reached",
  "message": "Insufficient S2S time remaining for this user",
  "remaining_minutes": 0,
  "next_renewal_date": "2024-12-01T12:55:35.721Z",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

#### Model Validation Failed

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## Notes

- The SDP offer must be a valid WebRTC SDP offer string
- After receiving the SDP answer, use it to set the remote description on your RTCPeerConnection
- Check S2S time status before initiating sessions using `/speech/s2s/status`
- Log session duration after completion using `/speech/s2s/log-session`
- All requests are processed through SMLTP for security and compliance
- The `user_id` parameter allows billing to a different user account

