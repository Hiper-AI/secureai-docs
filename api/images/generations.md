---
sidebar_position: 1
title: Generate Images
openapi: "POST /images/generations"
---

# Generate Images

Generate new images from text prompts or transform existing images using Google Gemini 2.5 Flash Image.

## Endpoint

```
POST /images/generations
```

## Description

Generate new images from text descriptions or transform existing images. This endpoint supports:

- **Text-to-Image**: Generate images from text descriptions
- **Image-to-Image**: Transform or edit existing images (upload an image file)

All prompts and responses are automatically processed through SMLTP for audit logging and compliance.

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request Body

This endpoint accepts both `multipart/form-data` (for file uploads) and `application/json` formats.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text prompt describing the image to generate or how to transform the uploaded image (1-4000 characters) |
| `image` | binary | No | Image file for image-to-image generation (JPEG, PNG, WEBP, or GIF, max 10MB) |
| `smltp_policy` | string | No | SMLTP security policy (default: "internal") |
| `response_format` | string | No | Response format: "url" or "b64_json" (default: "url") |
| `size` | string | No | Image size (default: "1024x1024") |
| `n` | integer | No | Number of images to generate (1-4, default: 1) |

## Request Examples

### Text-to-Image (JSON)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
  }'
```

### Image-to-Image (Multipart Form Data)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
// Text-to-Image
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over the ocean with mountains in the background, digital art style',
    smltp_policy: 'internal',
    response_format: 'url',
    n: 1
  })
});

const data = await response.json();
console.log('Generated image URL:', data.data[0].url);

// Image-to-Image
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response2 = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data2 = await response2.json();
console.log('Edited image URL:', data2.data[0].url);
```

### Python

```python
import requests

# Text-to-Image
url = "https://{customer.name}.hiperai.ai/api/external/images/generations"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Generated image URL:', result['data'][0]['url'])

# Image-to-Image
with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers={'Authorization': 'Bearer sk-your-api-key-here'}, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3",
  "object": "image.generation",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_68c5c6d2d57c85b102eb05e2_90d3756f_0.png",
      "revised_prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": false,
    "text_response": null,
    "smltp_trace_id": "trx-220eca66-5e3a-4a72-886b-e6ba8cde18a6",
    "smltp_bundle_id": "jti-bb850e61-fbfe-412a-8b0d-d180d4a36d22",
    "smltp_policy": "internal"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for successful requests |
| `id` | string | Unique request identifier |
| `object` | string | Object type: "image.generation" |
| `created` | integer | Unix timestamp of when images were created |
| `data` | array | Array of generated images |
| `metadata` | object | Additional metadata including SMLTP tracking |

### Image Object

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | URL to access the generated image (when response_format is "url") |
| `b64_json` | string | Base64-encoded image data (when response_format is "b64_json") |
| `revised_prompt` | string | The prompt actually used for generation (may differ from input) |

### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Model used: "google/gemini-2.5-flash-image-preview" |
| `provider` | string | Provider: "Google" |
| `total_images` | integer | Total number of images generated |
| `is_image_to_image` | boolean | Whether this was an image-to-image generation |
| `text_response` | string\|null | Optional text response from the model |
| `smltp_trace_id` | string | SMLTP trace ID for audit tracking |
| `smltp_bundle_id` | string | SMLTP bundle ID for audit tracking |
| `smltp_policy` | string | SMLTP policy that was applied |

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
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
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 Service Unavailable

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## Notes

- Supported image formats for upload: JPEG, PNG, WEBP, GIF
- Maximum file size: 10MB per image
- When uploading an image, the prompt describes how to transform it
- Gemini typically generates 1-4 images per request
- All requests are processed through SMLTP for security and compliance
- Use `response_format: "b64_json"` to receive base64-encoded image data instead of URLs

