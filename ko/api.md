---
sidebar_position: 5
title: "API 참조"
---
# API 참조

SecureAI 외부 API는 지식 기반 검색, 보안 정책 및 포괄적인 사용 추적을 통해 AI 채팅 완료 기능을 제공합니다. 이 API는 API 키 인증을 사용하는 외부 개발자 및 통합을 위해 설계되었습니다.

## 주요 기능

- **RAG(Retrieval-Augmented Generation)**: 관련 컨텍스트에 대한 지식 베이스를 자동으로 검색합니다.
- **다중 모델 지원**: OpenAI, Anthropic, Google, Meta 및 기타 AI 모델
- **모델 중복성 및 장애 조치**: 시도당 시간 제한이 있는 호출자 정의 장애 조치 체인(기본 + 대체)
- **OpenAI 호환 엔드포인트**: `/api/external/v1`에서 OpenAI SDK를 가리킵니다. — 코드 변경 없음
- **이미지 생성**: Google Gemini 2.5 Flash Image를 사용하여 이미지를 생성하고 편집합니다.
- **S2S(Speech-to-Speech)**: WebRTC와 OpenAI Realtime API를 사용한 실시간 음성 대화
- **보안 정책**: SMLTP 정책 시행, 호출별 Prompt Shield 및 서명된 규정 준수 영수증
- **웹후크**: 서명된 보안 및 플랫폼 이벤트 실시간 전달
- **사용량 추적**: 종합적인 사용량 모니터링, 셀프 서비스 할당량 및 속도 제한
- **지식 기반 통합**: 개인 및 공유 지식 기반에 액세스
- **사용자 관리**: 완전한 사용자, 그룹 및 역할 관리 기능
- **감사 로깅**: 포괄적인 활동 및 보안 감사 로그

## 인증

상태 확인을 제외한 모든 엔드포인트에는 Bearer 토큰을 사용한 API 키 인증이 필요합니다.

```bash
Authorization: Bearer sk-your-api-key-here
```

## 기본 URL

```
https://{customer.name}.hiperai.ai/api/external
```

OpenAI 호환 표면의 경우 SDK의 기본 URL을 다음 위치로 지정하세요.

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## 청구 및 사용

기본적으로 API 요청은 API 키를 소유한 사용자 계정에 요금이 청구됩니다. 요청에 `user_id` 매개변수를 포함하여 청구할 다른 사용자를 지정할 수 있습니다. 이는 다음을 허용합니다:

- 사용자별 청구 기능이 있는 다중 테넌트 애플리케이션
- 유연한 완료 한도 관리
- 사용자별 "모델별 사용량" 설정

## 속도 제한

- **기본값**: 분당 요청 60개, 시간당 요청 1,000개
- **일일 한도**: 요청 100개(구성 가능)
- **월 한도**: 요청 10,000건(구성 가능)

## 빠른 시작

### 1. 건강검진

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. 사용 가능한 모델 가져오기

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. 사용 가능한 기술 자료 얻기

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. 채팅 완료 만들기

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

## API 엔드포인트

### 시스템
- [헬스 체크](/ko/api/system/health) - API 상태 확인

### 발견
- [사용 가능한 모델 가져오기](/ko/api/discovery/models) - 사용 가능한 AI 모델 목록
- [사용 가능한 지식 베이스 가져오기](/ko/api/discovery/indexes) - 접근 가능한 지식 베이스 나열
- [보안 정책 가져오기](/ko/api/discovery/smltp-policies) - 사용 가능한 SMLTP 정책 목록

### 채팅
- [채팅 완료](/ko/api/chat/completions) - RAG를 이용한 메인 AI 채팅 엔드포인트
- [OpenAI 호환 엔드포인트](/ko/api/chat/openai- Compatible) - OpenAI SDK용 드롭인 `/v1/chat/completions`
- [Redundancy & Failover](/ko/api/redundancy) - 모델 장애 조치 체인
- [정책 확인](/ko/api/policy-check) - 모델 호출 없이 보안 파이프라인을 테스트 실행
- [사용량](/ko/api/usage) - 셀프 서비스 할당량, 예산, 비율 제한
- [영수증](/ko/api/receipts) - 서명된 SMLTP 준수 영수증 가져오기

### 웹훅
- [Webhooks 개요](/ko/api/webhooks/overview) - 서명된 실시간 이벤트 전달
- [웹훅 이벤트](/ko/api/webhooks/events) - 이벤트 카탈로그 및 페이로드

### 이미지
- [이미지 생성](/ko/api/images/세대) - 텍스트에서 이미지를 생성하거나 기존 이미지를 편집합니다.
- [이미지 편집](/ko/api/images/edits) - 텍스트 지침을 사용한 이미지 간 편집

### 음성/S2S
- [S2S WebRTC 세션 시작](/ko/api/speech/webrtc) - 실시간 음성 대화 설정
- [S2S 시간 상태 가져오기](/ko/api/speech/status) - 남은 S2S 시간 할당량 확인
- [S2S 세션 시간 로그](/ko/api/speech/log-session) - 세션 시간 및 차감 시간 로그

### 사용자 관리
- [모든 사용자 가져오기](/ko/api/users/list) - 페이지 매김으로 사용자 검색
- [사용자 생성](/ko/api/users/create) - 새로운 사용자 계정 생성
- [사용자 업데이트](/ko/api/users/update) - 기존 사용자 업데이트
- [라이선스 가용성 받기](/ko/api/billing-modes/licenses-availability) - 라이선스 풀 한도 및 사용량 조회

### 인덱스 관리
- [모든 색인 가져오기](/ko/api/indexes/list) - 모든 지식 베이스 가져오기
- [인덱스 생성](/ko/api/indexes/create) - 새로운 지식베이스 생성
- [인덱스 업데이트](/ko/api/indexes/update) - 기존 인덱스 업데이트
- [문서로 인덱스 훈련](/ko/api/indexes/train) - 문서를 업로드하여 인덱스 훈련
- [문서 색인 검색](/ko/api/indexes/search) - 의미 검색을 이용한 문서 검색

### 그룹 관리
- [모든 그룹 가져오기](/ko/api/groups/list) - 모든 그룹 가져오기
- [그룹 생성](/ko/api/groups/create) - 새 그룹 생성
- [그룹 업데이트](/ko/api/groups/update) - 기존 그룹 업데이트

### SMLTP 보안
- [모든 SMLTP 정책 가져오기](/ko/api/smltp/policies) - 모든 보안 정책 나열
- [활성 정책 가져오기](/ko/api/smltp/active) - 현재 활성 정책 가져오기
- [커스텀 정책 생성](/ko/api/smltp/create) - 커스텀 SMLTP 정책 생성
- [감사 로그](/ko/api/smltp/audit-logs) - SMLTP 감사 로그 검색

### 역할 관리
- [모든 역할 가져오기](/ko/api/roles/list) - 모든 역할 가져오기
- [역할 생성](/ko/api/roles/create) - 새로운 커스텀 역할 생성

## 오류 처리

### 오류 응답 형식

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### 속도 제한 오류

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### 일반적인 HTTP 상태 코드

| 코드 | 설명 |
|------|-------------|
| `200` | 성공 |
| `201` | 성공적으로 생성됨 |
| `400` | 잘못된 요청 - 잘못된 매개변수 |
| `401` | 승인되지 않음 - 잘못된 API 키 |
| `403` | 금지됨 - 권한이 부족함 |
| `404` | 찾을 수 없음 |
| `409` | 충돌 - 리소스가 이미 존재합니다 |
| `413` | 페이로드가 너무 큼 - 파일 크기가 초과됨 |
| `429` | 속도 제한이 초과되었습니다 |
| `500` | 내부 서버 오류 |
| `503` | 서비스를 사용할 수 없음 - 서비스가 구성되지 않음 |

## SDK 예

### 자바스크립트/Node.js

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

### 파이썬

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

### 2. 사용 가능한 모델 가져오기

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. 사용 가능한 기술 자료 얻기

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. 채팅 완료 만들기

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

## API 엔드포인트

### 시스템
- [헬스 체크](/ko/api/system/health) - API 상태 확인

### 발견
- [사용 가능한 모델 가져오기](/ko/api/discovery/models) - 사용 가능한 AI 모델 목록
- [사용 가능한 지식 베이스 가져오기](/ko/api/discovery/indexes) - 접근 가능한 지식 베이스 나열
- [보안 정책 가져오기](/ko/api/discovery/smltp-policies) - 사용 가능한 SMLTP 정책 목록

### 채팅
- [채팅 완료](/ko/api/chat/completions) - RAG를 이용한 메인 AI 채팅 엔드포인트
- [OpenAI 호환 엔드포인트](/ko/api/chat/openai- Compatible) - OpenAI SDK용 드롭인 `/v1/chat/completions`
- [Redundancy & Failover](/ko/api/redundancy) - 모델 장애 조치 체인
- [정책 확인](/ko/api/policy-check) - 모델 호출 없이 보안 파이프라인을 테스트 실행
- [사용량](/ko/api/usage) - 셀프 서비스 할당량, 예산, 비율 제한
- [영수증](/ko/api/receipts) - 서명된 SMLTP 준수 영수증 가져오기

### 웹훅
- [Webhooks 개요](/ko/api/webhooks/overview) - 서명된 실시간 이벤트 전달
- [웹훅 이벤트](/ko/api/webhooks/events) - 이벤트 카탈로그 및 페이로드

### 이미지
- [이미지 생성](/ko/api/images/세대) - 텍스트에서 이미지를 생성하거나 기존 이미지를 편집합니다.
- [이미지 편집](/ko/api/images/edits) - 텍스트 지침을 사용한 이미지 간 편집

### 음성/S2S
- [S2S WebRTC 세션 시작](/ko/api/speech/webrtc) - 실시간 음성 대화 설정
- [S2S 시간 상태 가져오기](/ko/api/speech/status) - 남은 S2S 시간 할당량 확인
- [S2S 세션 시간 로그](/ko/api/speech/log-session) - 세션 시간 및 차감 시간 로그

### 사용자 관리
- [모든 사용자 가져오기](/ko/api/users/list) - 페이지 매김으로 사용자 검색
- [사용자 생성](/ko/api/users/create) - 새로운 사용자 계정 생성
- [사용자 업데이트](/ko/api/users/update) - 기존 사용자 업데이트
- [라이선스 가용성 받기](/ko/api/billing-modes/licenses-availability) - 라이선스 풀 한도 및 사용량 조회

### 인덱스 관리
- [모든 색인 가져오기](/ko/api/indexes/list) - 모든 지식 베이스 가져오기
- [인덱스 생성](/ko/api/indexes/create) - 새로운 지식베이스 생성
- [인덱스 업데이트](/ko/api/indexes/update) - 기존 인덱스 업데이트
- [문서로 인덱스 훈련](/ko/api/indexes/train) - 문서를 업로드하여 인덱스 훈련
- [문서 색인 검색](/ko/api/indexes/search) - 의미 검색을 이용한 문서 검색

### 그룹 관리
- [모든 그룹 가져오기](/ko/api/groups/list) - 모든 그룹 가져오기
- [그룹 생성](/ko/api/groups/create) - 새 그룹 생성
- [그룹 업데이트](/ko/api/groups/update) - 기존 그룹 업데이트

### SMLTP 보안
- [모든 SMLTP 정책 가져오기](/ko/api/smltp/policies) - 모든 보안 정책 나열
- [활성 정책 가져오기](/ko/api/smltp/active) - 현재 활성 정책 가져오기
- [커스텀 정책 생성](/ko/api/smltp/create) - 커스텀 SMLTP 정책 생성
- [감사 로그](/ko/api/smltp/audit-logs) - SMLTP 감사 로그 검색

### 역할 관리
- [모든 역할 가져오기](/ko/api/roles/list) - 모든 역할 가져오기
- [역할 생성](/ko/api/roles/create) - 새로운 커스텀 역할 생성

## 오류 처리

### 오류 응답 형식

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### 속도 제한 오류

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### 일반적인 HTTP 상태 코드

| 코드 | 설명 |
|------|-------------|
| `200` | 성공 |
| `201` | 성공적으로 생성됨 |
| `400` | 잘못된 요청 - 잘못된 매개변수 |
| `401` | 승인되지 않음 - 잘못된 API 키 |
| `403` | 금지됨 - 권한이 부족함 |
| `404` | 찾을 수 없음 |
| `409` | 충돌 - 리소스가 이미 존재합니다 |
| `413` | 페이로드가 너무 큼 - 파일 크기가 초과됨 |
| `429` | 속도 제한이 초과되었습니다 |
| `500` | 내부 서버 오류 |
| `503` | 서비스를 사용할 수 없음 - 서비스가 구성되지 않음 |

## SDK 예

### 자바스크립트/Node.js

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

### 파이썬

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

## 다음 단계

- [기술 자료 및 RAG](/ko/indexes/overview) - 기술 자료 및 RAG에 대해 알아보기
````