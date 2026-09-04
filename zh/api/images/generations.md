---
sidebar_position: 1
title: "生成图像"
openapi: "POST /images/generations"
---
# 生成图像

根据文本提示生成新图像或使用 Google Gemini 2.5 Flash Image 转换现有图像。

## 端点

```
POST /images/generations
```

## 说明

从文本描述生成新图像或转换现有图像。该端点支持：

- **文本到图像**：从文本描述生成图像
- **图像到图像**：转换或编辑现有图像（上传图像文件）

所有提示和响应均通过 SMLTP 自动处理，以进行审核记录和合规性。

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

此端点接受 `multipart/form-data`（用于文件上传）和 `application/json` 格式。

### 参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `prompt` |字符串|是的 |描述要生成的图像或如何转换上传的图像的文本提示（1-4000 个字符） |
| `image` |二进制|没有 |用于图像到图像生成的图像文件（JPEG、PNG、WEBP 或 GIF，最大 10MB）|
| `smltp_policy` |字符串|没有 | SMLTP 安全策略（默认：“内部”）|
| `response_format` |字符串|没有 |响应格式：“url”或“b64_json”（默认：“url”）|
| `size` |字符串|没有 |图像大小（默认：“1024x1024”）|
| `n` |整数 |没有 |要生成的图像数量（1-4，默认值：1）|

## 请求示例

### 文本到图像 (JSON)

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

### 图像到图像（多部分表单数据）

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

###Python

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

## 回应

### 成功响应 (200)

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求始终如此 |
| `id` |字符串|唯一的请求标识符 |
| `object` |字符串|对象类型：“image. Generation” |
| `created` |整数 |创建图像时的 Unix 时间戳 |
| `data` |数组|生成的图像数组 |
| `metadata` |对象|其他元数据包括 SMLTP 跟踪 |

### 图像对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `url` |字符串|访问生成图像的 URL（当 response_format 为“url”时）|
| `b64_json` |字符串| Base64编码的图像数据（当response_format为“b64_json”时）|
| `revised_prompt` |字符串|实际用于生成的提示（可能与输入不同） |

### 元数据对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `model` |字符串|使用的模型：“google/gemini-2.5-flash-image-preview”|
| `provider` |字符串|提供商：“谷歌” |
| `total_images` |整数 |生成的图像总数 |
| `is_image_to_image` |布尔 |这是否是图像到图像的生成 |
| `text_response` |字符串\|空|模型的可选文本响应 |
| `smltp_trace_id` |字符串| SMLTP 用于审核跟踪的跟踪 ID |
| `smltp_bundle_id` |字符串| SMLTP 用于审核跟踪的捆绑包 ID |
| `smltp_policy` |字符串| SMLTP 已应用的策略 |

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "SMLTP policy not allowed"
}
```

### 413 有效负载太大

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 服务不可用

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## 注释

- 支持上传的图像格式：JPEG、PNG、WEBP、GIF
- 最大文件大小：每张图像 10MB
- 上传图片时，提示说明如何转换图片
- Gemini 通常为每个请求生成 1-4 张图像
- 所有请求均通过 SMLTP 处理，以确保安全性和合规性
- 使用`response_format: "b64_json"`接收base64编码的图像数据而不是URL