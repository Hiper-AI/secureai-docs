---
id: audit-logs
title: "감사 로그"
sidebar_label: "감사 로그"
description: "SMLTP 감사 로그 검색"
openapi: "GET /audit-logs"
---
# 감사 로그

보안 모니터링 및 규정 준수를 위한 SMLTP(Secure Model Language Transfer Protocol) 감사 로그를 검색합니다.

## 엔드포인트

```
GET /audit-logs
```

## 설명

이 끝점은 보안 이벤트, 정책 위반 및 규정 준수 활동을 추적하는 SMLTP 감사 로그를 반환합니다. 이는 보안 모니터링, 규정 준수 감사 및 보안 사고 조사에 유용합니다.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `page` | 정수 | 아니요 | 1 | 페이지 매김을 위한 페이지 번호(기본값: 1) |
| `limit` | 정수 | 아니요 | 50 | 페이지당 로그 수(기본값: 50) |
| `startDate` | 문자열 | 아니요 | - | 필터링 시작 날짜(ISO 8601 형식) |
| `endDate` | 문자열 | 아니요 | - | 필터링 종료 날짜(ISO 8601 형식) |
| `type` | 문자열 | 아니요 | - | 로그 유형별로 필터링 |
| `severity` | 문자열 | 아니요 | - | 심각도 수준으로 필터링 |
| `userId` | 문자열 | 아니요 | - | 사용자 ID로 필터링 |
| `search` | 문자열 | 아니요 | - | 설명 또는 메타데이터에 대한 검색어 |

## 요청 예시

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `data` | 개체 | 응답 데이터 개체 |
| `data.logs` | 배열 | 감사 로그 객체 배열 |
| `data.logs[].id` | 문자열 | 고유한 감사 로그 식별자 |
| `data.logs[].timestamp` | 문자열 | 로그 타임스탬프(ISO 8601) |
| `data.logs[].type` | 문자열 | 감사 이벤트 유형 |
| `data.logs[].severity` | 문자열 | 심각도 수준 |
| `data.logs[].description` | 문자열 | 이벤트 설명 |
| `data.logs[].user` | 개체 | 사용자 정보(사용 가능한 경우) |
| `data.logs[].user.id` | 문자열 | 사용자 ID |
| `data.logs[].user.name` | 문자열 | 사용자 이름 |
| `data.logs[].user.email` | 문자열 | 사용자 이메일 |
| `data.logs[].metadata` | 개체 | 추가 메타데이터 |
| `data.logs[].complianceCategory` | 문자열 | 컴플라이언스 카테고리 |
| `data.logs[].outcome` | 문자열 | 이벤트 결과 |
| `data.pagination` | 개체 | 페이지 매김 정보 |
| `data.pagination.page` | 정수 | 현재 페이지 번호 |
| `data.pagination.limit` | 정수 | 페이지당 항목 |
| `data.pagination.total` | 정수 | 총 로그 수 |
| `data.pagination.pages` | 정수 | 총 페이지 수 |
| `data.dateRange` | 개체 | 기간 정보 |

## 사용 예

### 자바스크립트

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

### 파이썬

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 오류 응답

### 401 승인되지 않음

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 403 금지됨

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 429 요청이 너무 많습니다.

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```


## 필터링 예

### 기간

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### 이벤트 필터링

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### 사용자 필터링

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## 사용 사례

- **보안 모니터링**: 보안 이벤트 및 정책 위반을 모니터링합니다.
- **규정 준수 감사**: 규정 준수 활동 및 위반 추적
- **사고 조사**: 보안 사고 및 위반 사항을 조사합니다.
- **정책 분석**: 정책 효과 및 집행 분석
- **사용자 활동**: 사용자 작업 및 API 사용 추적

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 이 엔드포인트에는 관리자 권한이 필요합니다.
- 페이지네이션: 오프셋이 아닌 페이지 매개변수 사용
- 날짜 범위: 날짜가 제공되지 않은 경우 기본값은 최근 7일입니다.
- 검색: 설명 및 메타데이터.작업 필드에서 검색합니다.
- 중첩된 응답: 응답이 데이터 개체 아래에 중첩되어 있습니다.
- 사용자 정보: 사용자 정보가 있는 경우 입력됩니다.
- 로그는 규정 준수 목적으로 보관됩니다.