---
sidebar_position: 2
title: "S2S 시간 상태 가져오기"
openapi: "GET /speech/s2s/status"
---
# S2S 시간 상태 가져오기

청구 사용자의 현재 S2S(Speech-to-Speech) 시간 상태를 검색합니다.

## 엔드포인트

```
GET /speech/s2s/status
```

## 설명

남은 시간, 총 월별 한도, 사용 시간, 갱신 정보를 포함하여 청구 사용자의 현재 S2S(Speech-to-Speech) 시간 상태를 검색합니다.

### S2S 시간 할당량

- 할당량은 사용자의 라이선스 등급을 기준으로 합니다.
- 라이선스 할당일을 기준으로 매월 시간이 재설정됩니다.
- 갱신할 수 없는 평가판 라이선스는 자동으로 재설정되지 않습니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `user_id` | 문자열 | 아니요 | 상태를 확인할 사용자 ID (기본값은 API Key 소유자) |

## 요청 예시

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 자바스크립트/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Remaining minutes:', data.remaining_minutes);
console.log('Total minutes:', data.total_minutes);
console.log('Used minutes:', data.used_minutes);
```

### 파이썬

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Remaining minutes:', result['remaining_minutes'])
print('Total minutes:', result['total_minutes'])
print('Used minutes:', result['used_minutes'])
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "remaining_minutes": 38.2896,
  "total_minutes": 45,
  "used_minutes": 6.7104,
  "has_time_remaining": true,
  "next_renewal_date": "2025-12-01T12:55:35.721Z",
  "non_renewable": false,
  "request_id": "a8c307b4-c0c9-4b30-98db-5aced06c1cfe"
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true |
| `remaining_minutes` | 번호 | 남은 S2S 시간(분) |
| `total_minutes` | 번호 | 총 월간 S2S 시간 제한 |
| `used_minutes` | 번호 | 이번 달 S2S 사용시간 |
| `has_time_remaining` | 부울 | 사용자에게 남은 S2S 시간이 있는지 여부 |
| `next_renewal_date` | 문자열\|널 | S2S 시간 할당량이 재설정되는 경우(갱신 불가능한 라이센스의 경우 null) |
| `non_renewable` | 부울 | 갱신할 수 없는 평가판 라이선스인지 여부 |
| `request_id` | 문자열 | 추적을 위한 요청 ID |

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 찾을 수 없음

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 메모

- S2S 세션을 시작하기 전에 이 엔드포인트를 확인하여 충분한 시간을 사용할 수 있는지 확인하세요.
- `user_id` 매개변수를 사용하면 다른 사용자의 상태를 확인할 수 있습니다. (기본값은 API 키 소유자)
- 시간 할당량은 사용자의 라이선스 등급을 기준으로 합니다.
- 갱신할 수 없는 평가판 라이센스에는 `non_renewable: true` 및 `next_renewal_date: null`이 있습니다.