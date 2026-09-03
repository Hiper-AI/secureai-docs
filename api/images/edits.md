---
sidebar_position: 2
title: Edit Images
openapi: "POST /images/edits"
---

# Edit Images

Edit existing images using Google Gemini 2.5 Flash Image with text instructions.

## Endpoint

```
POST /images/edits
```

## Description

Edit existing images using Google Gemini 2.5 Flash Image with text instructions. This endpoint is specifically designed for **image-to-image editing** where:

- An image file is **required** (unlike `/images/generations` where it's optional)
- A text prompt describes how to edit or transform the image
- The edited image is returned with the same quality and format options

All prompts and responses are automatically processed through SMLTP for audit logging and compliance.

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request Body

This endpoint accepts `multipart/form-data` format.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text instructions describing how to edit or transform the uploaded image (1-4000 characters) |
| `image` | binary | Yes | Image file to edit (JPEG, PNG, WEBP, or GIF, max 10MB) |
| `smltp_policy` | string | No | SMLTP security policy (default: "internal") |
| `response_format` | string | No | Response format: "url" or "b64_json" (default: "url") |

## Request Examples

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/edits" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky and enhance the overall atmosphere" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky and enhance the overall atmosphere');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/edits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Edited image URL:', data.data[0].url);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/images/edits"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky and enhance the overall atmosphere',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers=headers, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806",
  "object": "image.edit",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_edit_68c5c6d2d57c85b102eb05e2_f55bb4aa_0.png",
      "revised_prompt": "Add dramatic sunset colors to the sky and enhance the overall atmosphere"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": true,
    "text_response": null,
    "smltp_trace_id": "trx-6caec994-73af-4f2c-9e13-572d53262f2a",
    "smltp_bundle_id": "jti-26464307-d455-4a3d-9ca4-8ec144cb601c",
    "smltp_policy": "internal"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for successful requests |
| `id` | string | Unique request identifier |
| `object` | string | Object type: "image.edit" |
| `created` | integer | Unix timestamp of when image was edited |
| `data` | array | Array of edited images |
| `metadata` | object | Additional metadata including SMLTP tracking |

### Image Object

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | URL to access the edited image (when response_format is "url") |
| `b64_json` | string | Base64-encoded image data (when response_format is "b64_json") |
| `revised_prompt` | string | The prompt actually used for editing (may differ from input) |

### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Model used: "google/gemini-2.5-flash-image-preview" |
| `provider` | string | Provider: "Google" |
| `total_images` | integer | Total number of images (always 1 for edits) |
| `is_image_to_image` | boolean | Always true for this endpoint |
| `text_response` | string\|null | Optional text response from the model |
| `smltp_trace_id` | string | SMLTP trace ID for audit tracking |
| `smltp_bundle_id` | string | SMLTP bundle ID for audit tracking |
| `smltp_policy` | string | SMLTP policy that was applied |

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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

### 403 Forbidden

```json
{
  "success": false,
  "error": "Access denied",
  "message": "SMLTP policy not allowed"
}
```

### 413 Payload Too Large

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 Service Unavailable

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## Notes

- Supported image formats: JPEG, PNG, WEBP, GIF
- Maximum file size: 10MB per image
- The image file is **required** for this endpoint (unlike `/images/generations`)
- The prompt describes how to edit or transform the uploaded image
- All requests are processed through SMLTP for security and compliance
- Use `response_format: "b64_json"` to receive base64-encoded image data instead of URLs

