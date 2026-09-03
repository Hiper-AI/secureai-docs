---
sidebar_position: 3
title: "S2S 세션 기간 기록"
openapi: "POST /speech/s2s/log-session"
---
# S2S 세션 기간 기록

완료된 Speech-to-Speech 세션의 지속 시간을 기록하고 사용자의 S2S 시간 할당량에서 해당 시간을 공제합니다.

## 엔드포인트

```
POST /speech/s2s/log-session
```

## 설명

완료된 Speech-to-Speech 세션의 지속 시간을 기록하고 사용자의 S2S 시간 할당량에서 해당 시간을 공제합니다. 사용량을 정확하게 추적하려면 세션이 종료된 후에 호출되어야 합니다.

### 사용 추적

- 기간은 밀리초 단위로 지정됩니다.
- 자동으로 분 단위로 변환되어 사용자 할당량에서 차감됩니다.
- 라이센스 등급에 따라 사용자별로 시간이 추적됩니다.
- 활동 로그는 감사 목적으로 생성됩니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `durationMs` | 정수 | 예 | 세션 기간(밀리초)(최소: 0) |
| `user_id` | 문자열 | 아니요 | 이 세션을 청구할 사용자 ID(기본값은 API 키 소유자) |

## 요청 예시

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "durationMs": 42624,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
  }'
```

### 자바스크립트/Node.js

```javascript
// Calculate session duration in milliseconds
const sessionStartTime = Date.now();
// ... session happens ...
const sessionEndTime = Date.now();
const durationMs = sessionEndTime - sessionStartTime;

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    durationMs: durationMs,
    user_id: '60a7c8f5e8b4f5001f7a8c23'
  })
});

const data = await response.json();
console.log('Session logged:', data.message);
```

### 파이썬

```python
import requests
import time

# Calculate session duration
session_start = time.time() * 1000  # Convert to milliseconds
# ... session happens ...
session_end = time.time() * 1000
duration_ms = int(session_end - session_start)

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "durationMs": duration_ms,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Session logged:', result['message'])
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true |
| `message` | 문자열 | 성공 메시지 |
| `request_id` | 문자열 | 추적을 위한 요청 ID |

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
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

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## 메모

- 사용량을 정확하게 추적하려면 각 S2S 세션이 끝난 후 이 엔드포인트를 호출하세요.
- WebRTC 연결이 설정된 시점부터 종료될 때까지의 기간을 계산해야 합니다.
- 시간은 밀리초에서 분으로 자동 변환되어 사용자 할당량에서 차감됩니다.
- `user_id` 매개변수를 사용하면 다른 사용자 계정으로 청구할 수 있습니다.
- 활동 로그는 감사 목적으로 자동 생성됩니다.
- 세션 시작 전 남은 시간이 충분한지 확인하세요. (`/speech/s2s/status`에서 확인하세요.)