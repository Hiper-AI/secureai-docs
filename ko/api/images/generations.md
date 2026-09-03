---
sidebar_position: 1
title: "이미지 생성"
openapi: "POST /images/generations"
---
# 이미지 생성

텍스트 프롬프트에서 새 이미지를 생성하거나 Google Gemini 2.5 Flash Image를 사용하여 기존 이미지를 변환하세요.

## 엔드포인트

```
POST /images/generations
```

## 설명

텍스트 설명에서 새 이미지를 생성하거나 기존 이미지를 변환합니다. 이 엔드포인트는 다음을 지원합니다.

- **텍스트-이미지**: 텍스트 설명에서 이미지 생성
- **Image-to-Image**: 기존 이미지 변환 또는 편집(이미지 파일 업로드)

모든 프롬프트와 응답은 감사 로깅 및 규정 준수를 위해 SMLTP를 통해 자동으로 처리됩니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

이 끝점은 `multipart/form-data`(파일 업로드용) 및 `application/json` 형식을 모두 허용합니다.

### 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `prompt` | 문자열 | 예 | 생성할 이미지 또는 업로드된 이미지를 변환하는 방법을 설명하는 텍스트 프롬프트(1-4000자) |
| `image` | 바이너리 | 아니요 | 이미지 대 이미지 생성을 위한 이미지 파일(JPEG, PNG, WEBP 또는 GIF, 최대 10MB) |
| `smltp_policy` | 문자열 | 아니요 | SMLTP 보안 정책(기본값: "내부") |
| `response_format` | 문자열 | 아니요 | 응답 형식: "url" 또는 "b64_json"(기본값: "url") |
| `size` | 문자열 | 아니요 | 이미지 크기(기본값: "1024x1024") |
| `n` | 정수 | 아니요 | 생성할 이미지 수(1~4, 기본값: 1) |

## 요청 예시

### 텍스트를 이미지로 변환(JSON)

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

### 이미지 대 이미지(다중 부분 양식 데이터)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### 자바스크립트/Node.js

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

### 파이썬

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

## 응답

### 성공 응답 (200)

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

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true |
| `id` | 문자열 | 고유 요청 식별자 |
| `object` | 문자열 | 개체 유형: "image.세대" |
| `created` | 정수 | 이미지가 생성된 시점의 Unix 타임스탬프 |
| `data` | 배열 | 생성된 이미지 배열 |
| `metadata` | 개체 | SMLTP 추적을 포함한 추가 메타데이터 |

### 이미지 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `url` | 문자열 | 생성된 이미지에 접근하기 위한 URL(response_format이 "url"인 경우) |
| `b64_json` | 문자열 | Base64로 인코딩된 이미지 데이터(response_format이 "b64_json"인 경우) |
| `revised_prompt` | 문자열 | 생성에 실제로 사용되는 프롬프트(입력과 다를 수 있음) |

### 메타데이터 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `model` | 문자열 | 사용된 모델: "google/gemini-2.5-flash-image-preview" |
| `provider` | 문자열 | 제공자: "Google" |
| `total_images` | 정수 | 생성된 총 이미지 수 |
| `is_image_to_image` | 부울 | 이미지 대 이미지 생성 여부 |
| `text_response` | 문자열\|널 | 모델의 선택적 텍스트 응답 |
| `smltp_trace_id` | 문자열 | 감사 추적을 위한 SMLTP 추적 ID |
| `smltp_bundle_id` | 문자열 | 감사 추적을 위한 SMLTP 번들 ID |
| `smltp_policy` | 문자열 | 적용된 SMLTP 정책 |

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 401 승인되지 않음

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 금지됨

```json
{
  "success": false,
  "error": "Access denied",
  "message": "SMLTP policy not allowed"
}
```

### 413 페이로드가 너무 큼

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 서비스를 사용할 수 없습니다.

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## 메모

- 업로드에 지원되는 이미지 형식: JPEG, PNG, WEBP, GIF
- 최대 파일 크기: 이미지당 10MB
- 이미지를 업로드할 때 변환 방법을 설명하는 메시지가 표시됩니다.
- Gemini는 일반적으로 요청당 1-4개의 이미지를 생성합니다.
- 모든 요청은 보안 및 규정 준수를 위해 SMLTP를 통해 처리됩니다.
- URL 대신 base64로 인코딩된 이미지 데이터를 받으려면 `response_format: "b64_json"`를 사용하세요.