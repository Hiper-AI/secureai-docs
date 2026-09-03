---
sidebar_position: 5
title: API Reference
---

# API Reference

SecureAI External API provides AI chat completion capabilities with knowledge base retrieval, security policies, and comprehensive usage tracking. This API is designed for external developers and integrations using API key authentication.

## Key Features

- **RAG (Retrieval-Augmented Generation)**: Automatically search knowledge bases for relevant context
- **Multi-Model Support**: OpenAI, Anthropic, Google, Meta, and other AI models
- **Model Redundancy & Failover**: Caller-defined failover chains (primary + fallbacks) with per-attempt timeouts
- **OpenAI-Compatible Endpoint**: Point any OpenAI SDK at `/api/external/v1` — no code changes
- **Image Generation**: Generate and edit images using Google Gemini 2.5 Flash Image
- **Speech-to-Speech (S2S)**: Real-time voice conversations using OpenAI Realtime API with WebRTC
- **Security Policies**: SMLTP policy enforcement, per-call Prompt Shield, and signed compliance receipts
- **Webhooks**: Signed, real-time delivery of security and platform events
- **Usage Tracking**: Comprehensive usage monitoring, self-service quota, and rate limiting
- **Knowledge Base Integration**: Access to personal and shared knowledge bases
- **User Management**: Complete user, group, and role management capabilities
- **Audit Logging**: Comprehensive activity and security audit logs

## Authentication

All endpoints (except health check) require API key authentication using Bearer token:

```bash
Authorization: Bearer sk-your-api-key-here
```

## Base URL

```
https://{customer.name}.hiperai.ai/api/external
```

For the OpenAI-compatible surface, point your SDK's base URL at:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## Billing and Usage

By default, API requests are billed to the user account that owns the API key. You can specify a different user to bill by including the `user_id` parameter in your request. This allows for:

- Multi-tenant applications with per-user billing
- Flexible completion limit management
- Per-user "Usage by Model" settings

## Rate Limits

- **Default**: 60 requests per minute, 1000 requests per hour
- **Daily limits**: 100 requests (configurable)
- **Monthly limits**: 10,000 requests (configurable)

## Quick Start

### 1. Health Check

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. Get Available Models

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Get Available Knowledge Bases

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Create a Chat Completion

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API Endpoints

### System
- [Health Check](/api/system/health) - Check API status

### Discovery
- [Get Available Models](/api/discovery/models) - List available AI models
- [Get Available Knowledge Bases](/api/discovery/indexes) - List accessible knowledge bases
- [Get Security Policies](/api/discovery/smltp-policies) - List available SMLTP policies

### Chat
- [Chat Completion](/api/chat/completions) - Main AI chat endpoint with RAG
- [OpenAI-Compatible Endpoint](/api/chat/openai-compatible) - Drop-in `/v1/chat/completions` for OpenAI SDKs
- [Redundancy & Failover](/api/redundancy) - Model failover chains
- [Policy Check](/api/policy-check) - Dry-run the security pipeline without calling a model
- [Usage](/api/usage) - Self-service quota, budget, and rate limits
- [Receipts](/api/receipts) - Fetch signed SMLTP compliance receipts

### Webhooks
- [Webhooks Overview](/api/webhooks/overview) - Signed real-time event delivery
- [Webhook Events](/api/webhooks/events) - Event catalog and payloads

### Images
- [Generate Images](/api/images/generations) - Generate images from text or edit existing images
- [Edit Images](/api/images/edits) - Image-to-image editing with text instructions

### Speech/S2S
- [Initiate S2S WebRTC Session](/api/speech/webrtc) - Establish real-time voice conversations
- [Get S2S Time Status](/api/speech/status) - Check remaining S2S time quota
- [Log S2S Session Duration](/api/speech/log-session) - Log session duration and deduct time

### User Management
- [Get All Users](/api/users/list) - Retrieve users with pagination
- [Create User](/api/users/create) - Create new user account
- [Update User](/api/users/update) - Update existing user
- [Get License Availability](/api/billing-modes/licenses-availability) - Retrieve license pool limits and usage

### Index Management
- [Get All Indexes](/api/indexes/list) - Retrieve all knowledge bases
- [Create Index](/api/indexes/create) - Create new knowledge base
- [Update Index](/api/indexes/update) - Update existing index
- [Train Index with Documents](/api/indexes/train) - Train index by uploading documents
- [Search Index for Documents](/api/indexes/search) - Search documents using semantic search

### Group Management
- [Get All Groups](/api/groups/list) - Retrieve all groups
- [Create Group](/api/groups/create) - Create new group
- [Update Group](/api/groups/update) - Update existing group

### SMLTP Security
- [Get All SMLTP Policies](/api/smltp/policies) - List all security policies
- [Get Active Policy](/api/smltp/active) - Get current active policy
- [Create Custom Policy](/api/smltp/create) - Create custom SMLTP policy
- [Audit Logs](/api/smltp/audit-logs) - Retrieve SMLTP audit logs

### Role Management
- [Get All Roles](/api/roles/list) - Retrieve all roles
- [Create Role](/api/roles/create) - Create new custom role

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Rate Limit Error

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request - invalid parameters |
| `401` | Unauthorized - invalid API key |
| `403` | Forbidden - insufficient permissions |
| `404` | Not found |
| `409` | Conflict - resource already exists |
| `413` | Payload Too Large - file size exceeded |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service Unavailable - service not configured |

## SDK Examples

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. Get Available Models

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Get Available Knowledge Bases

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Create a Chat Completion

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API Endpoints

### System
- [Health Check](/api/system/health) - Check API status

### Discovery
- [Get Available Models](/api/discovery/models) - List available AI models
- [Get Available Knowledge Bases](/api/discovery/indexes) - List accessible knowledge bases
- [Get Security Policies](/api/discovery/smltp-policies) - List available SMLTP policies

### Chat
- [Chat Completion](/api/chat/completions) - Main AI chat endpoint with RAG
- [OpenAI-Compatible Endpoint](/api/chat/openai-compatible) - Drop-in `/v1/chat/completions` for OpenAI SDKs
- [Redundancy & Failover](/api/redundancy) - Model failover chains
- [Policy Check](/api/policy-check) - Dry-run the security pipeline without calling a model
- [Usage](/api/usage) - Self-service quota, budget, and rate limits
- [Receipts](/api/receipts) - Fetch signed SMLTP compliance receipts

### Webhooks
- [Webhooks Overview](/api/webhooks/overview) - Signed real-time event delivery
- [Webhook Events](/api/webhooks/events) - Event catalog and payloads

### Images
- [Generate Images](/api/images/generations) - Generate images from text or edit existing images
- [Edit Images](/api/images/edits) - Image-to-image editing with text instructions

### Speech/S2S
- [Initiate S2S WebRTC Session](/api/speech/webrtc) - Establish real-time voice conversations
- [Get S2S Time Status](/api/speech/status) - Check remaining S2S time quota
- [Log S2S Session Duration](/api/speech/log-session) - Log session duration and deduct time

### User Management
- [Get All Users](/api/users/list) - Retrieve users with pagination
- [Create User](/api/users/create) - Create new user account
- [Update User](/api/users/update) - Update existing user
- [Get License Availability](/api/billing-modes/licenses-availability) - Retrieve license pool limits and usage

### Index Management
- [Get All Indexes](/api/indexes/list) - Retrieve all knowledge bases
- [Create Index](/api/indexes/create) - Create new knowledge base
- [Update Index](/api/indexes/update) - Update existing index
- [Train Index with Documents](/api/indexes/train) - Train index by uploading documents
- [Search Index for Documents](/api/indexes/search) - Search documents using semantic search

### Group Management
- [Get All Groups](/api/groups/list) - Retrieve all groups
- [Create Group](/api/groups/create) - Create new group
- [Update Group](/api/groups/update) - Update existing group

### SMLTP Security
- [Get All SMLTP Policies](/api/smltp/policies) - List all security policies
- [Get Active Policy](/api/smltp/active) - Get current active policy
- [Create Custom Policy](/api/smltp/create) - Create custom SMLTP policy
- [Audit Logs](/api/smltp/audit-logs) - Retrieve SMLTP audit logs

### Role Management
- [Get All Roles](/api/roles/list) - Retrieve all roles
- [Create Role](/api/roles/create) - Create new custom role

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Rate Limit Error

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request - invalid parameters |
| `401` | Unauthorized - invalid API key |
| `403` | Forbidden - insufficient permissions |
| `404` | Not found |
| `409` | Conflict - resource already exists |
| `413` | Payload Too Large - file size exceeded |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service Unavailable - service not configured |

## SDK Examples

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Next Steps

- [Knowledge Base & RAG](/indexes/overview) - Learn about Knowledge Bases and RAG
```
