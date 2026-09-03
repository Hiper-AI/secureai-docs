---
sidebar_position: 1
title: "건강검진"
openapi: "GET /health"
---
# 건강검진

API가 실행 중이고 정상인지 확인하세요. 인증이 필요하지 않습니다.

## 엔드포인트

```
GET /health
```

## 설명

이 엔드포인트를 사용하면 SecureAI 외부 API가 실행 중이고 정상인지 확인할 수 있습니다. 이 끝점에는 인증이 필요하지 않습니다.

## 요청

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 응답 필드

| 필드 | 유형 | 설명 | 예 |
|-------|------|-------------|---------|
| `success` | 부울 | 성공적인 상태 확인을 위해 항상 true | `true` |
| `status` | 문자열 | API의 상태 | `"healthy"` |
| `timestamp` | 문자열 | ISO 8601 형식의 현재 서버 타임스탬프 | `"2024-01-15T10:30:00.000Z"` |
| `version` | 문자열 | 현재 API 버전 | `"1.0.0"` |

## 사용 예

### 자바스크립트/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

### 파이썬

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## 메모

- 이 엔드포인트에는 인증이 필요하지 않습니다.
- 이 엔드포인트를 사용하여 API 가용성을 모니터링하세요.
- 응답에는 호환성 확인을 위한 현재 API 버전이 포함됩니다.