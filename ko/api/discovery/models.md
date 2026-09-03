---
sidebar_position: 1
title: "사용 가능한 모델"
openapi: "GET /models"
---
# 사용 가능한 모델 얻기

API 키 권한 및 사용자 라이선스를 기반으로 사용 가능한 AI 모델을 검색합니다.

## 엔드포인트

```
GET /models
```

## 설명

API 키 권한 및 사용자 라이선스를 기반으로 사용 가능한 AI 모델을 검색합니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 매개변수

| 매개변수 | 유형 | 필수 | 설명 | 예 |
|------------|------|----------|-------------|---------|
| `provider` | 문자열 | 아니요 | 공급자별로 모델 필터링 | `"openai"` |

## 요청

### 기본요청

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 제공업체별로 필터링

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "models": [
    {
      "id": "openai/gpt-5-nano",
      "name": "openai/gpt-5-nano",
      "provider": "openai"
    },
    {
      "id": "anthropic/claude-sonnet-4.6",
      "name": "anthropic/claude-sonnet-4.6",
      "provider": "anthropic"
    }
  ],
  "user_license": "Pro",
  "restrictions": {
    "allowed_models": "all"
  },
  "filters": {
    "provider": "openai"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true | `true` |
| `models` | 배열 | 사용 가능한 모델 목록 | 예 보기 |
| `user_license` | 문자열 | 사용자의 라이선스 등급 | `"Pro"` |
| `restrictions` | 개체 | 모델 액세스 제한 | 예 보기 |
| `filters` | 개체 | 적용된 필터 | 예 보기 |

### 모델 객체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `id` | 문자열 | 고유 모델 식별자 | `"openai/gpt-5-nano"` |
| `name` | 문자열 | 모델 표시 이름 | `"openai/gpt-5-nano"` |
| `provider` | 문자열 | 모델 제공자 | `"openai"` |

### 제한 개체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `allowed_models` | 문자열 | 모델 액세스 수준 | `"all"` |

### 필터 개체

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `provider` | 문자열 | 적용된 공급자 필터 | `"openai"` |

## 오류 응답

### 401 승인되지 않음

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 속도 제한이 초과되었습니다.

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## 사용 예

### 자바스크립트/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/models', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Models:', data.models);
console.log('User License:', data.user_license);
```

### 파이썬

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', headers=headers)
data = response.json()

print('Available Models:', data['models'])
print('User License:', data['user_license'])
```

### 제공업체별로 필터링

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'provider': 'openai'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', 
                      headers=headers, params=params)
data = response.json()

print('OpenAI Models:', data['models'])
```

### cURL

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## LLM 버킷(현재)

채팅 시스템은 모델을 두 가지 실행 버킷으로 분류합니다.

- `standard` 버킷
- `premium` 버킷

이 참조는 활성 백엔드 버킷 매핑을 기반으로 합니다.

### 표준 버킷

- `openai/gpt-oss-120b`
- `openai/gpt-5-nano`
- `google/gemini-3.1-flash-lite-preview`
- `google/gemini-3-flash-preview`
- `deepseek/deepseek-r1-distill-llama-70b`
- `deepseek/deepseek-r1`
- `deepseek/deepseek-v3.2`
- `meta-llama/llama-3.3-70b-instruct`
- `meta-llama/llama-4-maverick`
- `meta-llama/llama-4-scout`
- `mistralai/mistral-7b-instruct`
- `mistralai/mistral-nemo`
- `mistralai/ministral-14b-2512`
- `mistralai/mistral-large-2512`
- `x-ai/grok-3-mini`
- `qwen/qwen3-235b-a22b-2507`
- `qwen/qwen3-coder`
- `qwen/qwen3-coder-next`
- `qwen/qwen3.5-397b-a17b`

### 프리미엄 버킷

- `anthropic/claude-3.7-sonnet`
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-opus-4.6`
- `openai/o4-mini-high`
- `openai/o4-mini`
- `openai/gpt-5.2`
- `openai/gpt-5.3-codex`
- `openai/gpt-5.1`
- `google/gemini-3.1-pro-preview`
- `x-ai/grok-4`

## 이용 가능한 제공업체

- **오픈AI**
- **인류학**
- **구글**
- **메타**
- **미스트랄**
- **딥시크**
- **xAI**
- **Qwen**

## 메모

- 사용 가능한 모델은 구독 등급에 따라 다릅니다.
- 일부 모델은 라이센스에 따라 사용이 제한될 수 있습니다.
- 공급자 필터를 사용하여 특정 공급자로부터 모델을 가져옵니다.
- 응답에는 현재 라이선스 등급 및 제한 사항이 포함됩니다. 
- API 키 제한(`allowedModels`)으로 모델 목록을 더욱 줄일 수 있습니다.