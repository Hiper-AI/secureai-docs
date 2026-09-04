---
sidebar_position: 2
title: "编辑图像"
openapi: "POST /images/edits"
---
# 编辑图像

使用带有文本说明的 Google Gemini 2.5 Flash Image 编辑现有图像。

## 端点

```
POST /images/edits
```

## 说明

使用带有文本说明的 Google Gemini 2.5 Flash Image 编辑现有图像。该端点专为**图像到图像编辑**而设计，其中：

- 图像文件是**必需的**（与 `/images/generations` 不同，它是可选的）
- 文本提示描述如何编辑或转换图像
- 编辑后的图像以相同的质量和格式选项返回

所有提示和响应均通过 SMLTP 自动处理，以进行审核记录和合规性。

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

该端点接受 `multipart/form-data` 格式。

### 参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `prompt` |字符串|是的 |描述如何编辑或转换上传图像的文本说明（1-4000 个字符）|
| `image` |二进制|是的 |要编辑的图像文件（JPEG、PNG、WEBP 或 GIF，最大 10MB）|
| `smltp_policy` |字符串|没有 | SMLTP 安全策略（默认：“内部”）|
| `response_format` |字符串|没有 |响应格式：“url”或“b64_json”（默认：“url”）|

## 请求示例

### 卷曲

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

###Python

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

## 回应

### 成功响应 (200)

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求始终如此 |
| `id` |字符串|唯一的请求标识符 |
| `object` |字符串|对象类型：“image.edit”|
| `created` |整数 |编辑图像时的 Unix 时间戳 |
| `data` |数组|编辑图像数组 |
| `metadata` |对象|其他元数据包括 SMLTP 跟踪 |

### 图像对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `url` |字符串|访问已编辑图像的 URL（当 response_format 为“url”时）|
| `b64_json` |字符串| Base64编码的图像数据（当response_format为“b64_json”时）|
| `revised_prompt` |字符串|实际用于编辑的提示（可能与输入不同）|

### 元数据对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `model` |字符串|使用的模型：“google/gemini-2.5-flash-image-preview”|
| `provider` |字符串|提供商：“谷歌” |
| `total_images` |整数 |图像总数（编辑时始终为 1）|
| `is_image_to_image` |布尔 |此端点始终为 true |
| `text_response` |字符串\|空|模型的可选文本响应 |
| `smltp_trace_id` |字符串| SMLTP 用于审核跟踪的跟踪 ID |
| `smltp_bundle_id` |字符串| SMLTP 用于审核跟踪的捆绑包 ID |
| `smltp_policy` |字符串| SMLTP 已应用的策略 |

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 服务不可用

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## 注释

- 支持的图像格式：JPEG、PNG、WEBP、GIF
- 最大文件大小：每张图像 10MB
- 此端点**需要**图像文件（与`/images/generations`不同）
- 提示描述如何编辑或转换上传的图片
- 所有请求均通过 SMLTP 处理，以确保安全性和合规性
- 使用`response_format: "b64_json"`接收base64编码的图像数据而不是URL