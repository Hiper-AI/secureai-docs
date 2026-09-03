---
id: list
title: "모든 인덱스 나열"
sidebar_label: "모든 인덱스 나열"
description: "사용 가능한 모든 기술 자료 색인을 검색합니다."
openapi: "GET /indexes/all"
---
# 모든 인덱스 나열

시스템에서 사용 가능한 모든 지식 기반 색인의 포괄적인 목록을 검색합니다.

## 엔드포인트

```
GET /indexes/all
```

## 설명

이 엔드포인트는 SecureAI 시스템에서 사용 가능한 모든 지식 기반 색인을 반환합니다. 유형, 상태, 생성 날짜, 메타데이터 등 각 인덱스에 대한 자세한 정보를 제공합니다. 이는 사용 가능한 지식 기반과 해당 기능을 검색하는 데 유용합니다.

## 인증

**필수**: API 키

```
Authorization: Bearer sk-your-api-key-here
```

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `page` | 정수 | 아니요 | 1 | 페이지 매김을 위한 페이지 번호 |
| `limit` | 정수 | 아니요 | 50 | 페이지당 인덱스 수(1-100) |
| `search` | 문자열 | 아니요 | - | 인덱스 이름 또는 공유 인덱스 이름에 대한 검색어 |
| `type` | 문자열 | 아니요 | - | 인덱스 유형별 필터링(개인, 일반, 그룹) |
| `status` | 문자열 | 아니요 | 활성 | 인덱스 상태별 필터링(활성, 삭제됨, 모두) |
| `sortBy` | 문자열 | 아니요 | 생성일자 | 정렬 기준 필드 |
| `sortOrder` | 문자열 | 아니요 | 설명 | 정렬 순서(오름차순, 내림차순) |

## 요청 예시

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## 성공 응답

**상태 코드**: `200 OK`

```json
{
  "success": true,
  "indexes": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "my-knowledge-base",
      "sharedIndexName": "my-knowledge-base",
      "namespace": "user-namespace",
      "type": "personal",
      "assignedUser": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedGroup": null,
      "userId": "60a7c8f5e8b4f5001f7a8c24",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 작업이 성공했는지 여부를 나타냅니다 |
| `indexes[]` | 배열 | 인덱스 객체 배열 |
| `indexes[].id` | 문자열 | 고유 인덱스 식별자 |
| `indexes[].name` | 문자열 | 인덱스 이름 |
| `indexes[].sharedIndexName` | 문자열 | 공유 인덱스 이름 |
| `indexes[].namespace` | 문자열 | 인덱스 네임스페이스 |
| `indexes[].type` | 문자열 | 인덱스 유형(개인, 일반, 그룹, 알 수 없음) |
| `indexes[].assignedUser` | 개체 | 할당된 사용자 정보(개인인 경우) |
| `indexes[].assignedGroup` | 개체 | 배정된 그룹 정보(그룹인 경우) |
| `indexes[].userId` | 문자열 | 사용자 ID |
| `indexes[].isActive` | 부울 | 인덱스 활성 여부 |
| `indexes[].createdAt` | 문자열 | 생성 타임스탬프 |
| `indexes[].updatedAt` | 문자열 | 마지막 업데이트 타임스탬프 |
| `indexes[].deletedAt` | 문자열 | 삭제 타임스탬프(삭제된 경우) |
| `pagination` | 개체 | 페이지 매김 정보 |

## 인덱스 유형

| 유형 | 설명 | 액세스 |
|------|-------------|-------|
| `personal` | 사용자가 만든 개인 색인 | 소유자에 대한 전체 액세스 |
| `general` | 공유 조직 색인 | 권한에 따라 다름 |
| `group` | 그룹 할당 인덱스 | 그룹 회원 |
| `unknown` | 할당이 불분명한 인덱스 | 다양함 |

## 인덱스 상태

| 상태 | 설명 |
|---------|-------------|
| `active` | 인덱스를 사용할 수 있습니다 |
| `deleted` | 색인이 삭제되었습니다 |
| `all` | 활성 및 삭제된 항목 모두 포함 |

## 사용 예

### 자바스크립트

```javascript
const listIndexes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/indexes/all${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listIndexes({
  type: 'personal',
  limit: 10,
  page: 1
});
console.log(result.indexes);
```

### 파이썬

```python
import requests

def list_indexes(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "type": "personal",
    "limit": 10,
    "page": 1
}

result = list_indexes(params)
print(result["indexes"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
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

### 유형별로 필터링

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### 상태별 필터링

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### 페이지 매김

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## 사용 사례

- **검색**: RAG 운영에 사용 가능한 기술 자료를 찾습니다.
- **관리**: 관리 목적으로 색인을 나열합니다.
- **통합**: 애플리케이션 통합을 위한 인덱스 검색
- **모니터링**: 인덱스 상태 및 메타데이터 확인
- **필터링**: 특정 유형의 인덱스 찾기(시스템, 개인 등)

## 속도 제한

- **기본값**: 분당 요청 100개
- **일일**: 일일 요청 10,000건
- **월간**: 월간 요청 300,000건

## 메모

- 이 엔드포인트는 관리자만 접근할 수 있습니다.
- 개인 색인은 소유자만 볼 수 있습니다.
- 그룹 색인은 그룹 구성원에게 표시됩니다.
- 응답에는 할당된 사용자 및 그룹 정보가 포함됩니다.
- 페이지 매김은 오프셋이 아닌 페이지 매개변수를 사용합니다.
- 유형 및 상태별로 필터링하면 결과 범위를 좁힐 수 있습니다.