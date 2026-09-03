---
sidebar_position: 2
title: "이미지 편집"
openapi: "POST /images/edits"
---
# 이미지 편집

텍스트 지침이 포함된 Google Gemini 2.5 Flash 이미지를 사용하여 기존 이미지를 편집하세요.

## 엔드포인트

```
POST /images/edits
```

## 설명

텍스트 지침이 포함된 Google Gemini 2.5 Flash 이미지를 사용하여 기존 이미지를 편집하세요. 이 엔드포인트는 다음과 같은 경우에 **이미지 간 편집**을 위해 특별히 설계되었습니다.

- 이미지 파일은 **필수**입니다(선택 사항인 `/images/generations`와 다름).
- 이미지를 편집하거나 변환하는 방법을 설명하는 텍스트 프롬프트
- 편집된 이미지는 동일한 품질 및 형식 옵션으로 반환됩니다.

모든 프롬프트와 응답은 감사 로깅 및 규정 준수를 위해 SMLTP를 통해 자동으로 처리됩니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

이 끝점은 `multipart/form-data` 형식을 허용합니다.

### 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `prompt` | 문자열 | 예 | 업로드된 이미지를 편집하거나 변환하는 방법을 설명하는 텍스트 지침(1-4000자) |
| `image` | 바이너리 | 예 | 편집할 이미지 파일(JPEG, PNG, WEBP, GIF, 최대 10MB) |
| `smltp_policy` | 문자열 | 아니요 | SMLTP 보안 정책(기본값: "내부") |
| `response_format` | 문자열 | 아니요 | 응답 형식: "url" 또는 "b64_json"(기본값: "url") |

## 요청 예시

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/edits" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky and enhance the overall atmosphere" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### 자바스크립트/Node.js

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

### 파이썬

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

## 응답

### 성공 응답 (200)

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

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true |
| `id` | 문자열 | 고유 요청 식별자 |
| `object` | 문자열 | 개체 유형: "image.edit" |
| `created` | 정수 | 이미지가 편집된 시점의 Unix 타임스탬프 |
| `data` | 배열 | 편집된 이미지 배열 |
| `metadata` | 개체 | SMLTP 추적을 포함한 추가 메타데이터 |

### 이미지 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `url` | 문자열 | 편집된 이미지에 접근하기 위한 URL(response_format이 "url"인 경우) |
| `b64_json` | 문자열 | Base64로 인코딩된 이미지 데이터(response_format이 "b64_json"인 경우) |
| `revised_prompt` | 문자열 | 편집에 실제로 사용되는 프롬프트(입력과 다를 수 있음) |

### 메타데이터 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `model` | 문자열 | 사용된 모델: "google/gemini-2.5-flash-image-preview" |
| `provider` | 문자열 | 제공자: "Google" |
| `total_images` | 정수 | 총 이미지 수(편집 시 항상 1개) |
| `is_image_to_image` | 부울 | 이 끝점에 대해 항상 true |
| `text_response` | 문자열\|널 | 모델의 선택적 텍스트 응답 |
| `smltp_trace_id` | 문자열 | 감사 추적을 위한 SMLTP 추적 ID |
| `smltp_bundle_id` | 문자열 | 감사 추적을 위한 SMLTP 번들 ID |
| `smltp_policy` | 문자열 | 적용된 SMLTP 정책 |

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 서비스를 사용할 수 없습니다.

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## 메모

- 지원되는 이미지 형식: JPEG, PNG, WEBP, GIF
- 최대 파일 크기: 이미지당 10MB
- 이 엔드포인트에는 이미지 파일이 **필수**입니다(`/images/generations`와 다름).
- 프롬프트는 업로드된 이미지를 편집하거나 변환하는 방법을 설명합니다.
- 모든 요청은 보안 및 규정 준수를 위해 SMLTP를 통해 처리됩니다.
- URL 대신 base64로 인코딩된 이미지 데이터를 받으려면 `response_format: "b64_json"`를 사용하세요.