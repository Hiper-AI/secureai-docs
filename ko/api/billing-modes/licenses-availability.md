---
id: licenses-availability
title: "라이센스 가용성"
sidebar_label: "라이센스 가용성"
description: "현재 라이선스 풀 제한, 사용량 및 남은 항목을 검색합니다(관리자 전용)"
openapi: "GET /licenses/availability"
---
# 라이센스 가용성

각 계층에 대한 라이선스 풀 제한, 현재 사용량 및 남은 라이선스를 검색합니다.

## 엔드포인트

```
GET /licenses/availability
```

## 설명

한도, 현재 사용량, 남은 용량을 포함하여 모든 라이선스 계층에 대한 라이선스 풀 상태를 반환합니다. 관리자 전용 엔드포인트.

## 인증

**필수**: 관리자 권한이 있는 API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 요청

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `limits` | 개체 | 계층당 라이선스 풀 구성 제한 |
| `usage` | 개체 | 계층당 현재 할당/사용된 라이선스 |
| `remaining` | 개체 | 계층당 남은 라이선스 |

## 오류 응답

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
  "message": "Admin access required"
}
```

## 메모

- 관리자 전용 엔드포인트
- 해당 계층에 대해 풀 제한이 적용되지 않으면 나머지는 `Infinity`로 보고될 수 있습니다.
- 값은 조직 전체의 집계입니다.