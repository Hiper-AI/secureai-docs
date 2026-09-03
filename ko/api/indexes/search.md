---
sidebar_position: 4
title: "문서 검색 색인"
openapi: "GET /indexes/{indexName}/search"
---
# 문서 검색 색인

의미 검색을 사용하여 인덱스 내의 문서를 검색합니다.

## 엔드포인트

```
GET /indexes/{indexName}/search
```

## 설명

의미 검색을 사용하여 인덱스 내의 문서를 검색합니다. 관련성 점수가 있는 일치하는 문서를 관련성 기준으로 정렬하여 반환합니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 경로 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `indexName` | 문자열 | 예 | 검색할 인덱스 이름 |

## 쿼리 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `query` | 문자열 | 예 | 검색어 텍스트 |
| `top_k` | 정수 | 아니요 | 반환할 최대 결과 수(1-50, 기본값: 10) |
| `min_score` | 플로트 | 아니요 | 최소 관련성 점수 임계값(0.0-1.0, 기본값: 0.0) |

## 요청 예시

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=What%20is%20machine%20learning?&top_k=10&min_score=0.5" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 자바스크립트/Node.js

```javascript
const query = encodeURIComponent('What is machine learning?');
const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=${query}&top_k=10&min_score=0.5`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Total matches:', data.results.total);
data.results.matches.forEach(match => {
  console.log(`Rank ${match.rank}: ${match.content.substring(0, 100)}... (score: ${match.score})`);
});
```

### 파이썬

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "query": "What is machine learning?",
    "top_k": 10,
    "min_score": 0.5
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Total matches:', result['results']['total'])
for match in result['results']['matches']:
    print(f"Rank {match['rank']}: {match['content'][:100]}... (score: {match['score']})")
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What is machine learning?",
  "results": {
    "matches": [
      {
        "rank": 1,
        "score": 0.85,
        "source": "training",
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed...",
        "metadata": {
          "page": 1,
          "chunkIndex": 0,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      },
      {
        "rank": 2,
        "score": 0.78,
        "source": "training",
        "content": "Machine learning algorithms build mathematical models based on training data to make predictions or decisions...",
        "metadata": {
          "page": 2,
          "chunkIndex": 1,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      }
    ],
    "total": 5,
    "top_k": 10
  },
  "index": {
    "name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true |
| `request_id` | 문자열 | 추적을 위한 요청 ID |
| `query` | 문자열 | 사용된 검색어 |
| `results` | 개체 | 검색결과 |
| `index` | 개체 | 지수정보 |

### 결과 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `matches` | 배열 | 관련성에 따라 정렬된 일치하는 문서 배열 |
| `total` | 정수 | 발견된 총 일치 수 |
| `top_k` | 정수 | 요청된 top_k 값 |

### 일치 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `rank` | 정수 | 결과순위(1기준) |
| `score` | 플로트 | 관련성 점수(0.0-1.0, 높을수록 관련성이 높음) |
| `source` | 문자열 | 문서 소스 식별자 |
| `content` | 문자열 | 콘텐츠 미리보기(500자로 잘림) |
| `metadata` | 개체 | 추가 메타데이터 |

### 메타데이터 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `page` | 정수\|널 | 페이지 번호(PDF의 경우) |
| `chunkIndex` | 정수\|널 | 문서 내 청크 인덱스 |
| `title` | 문자열\|널 | 문서 제목 |
| `documentId` | 문자열\|널 | 문서 ID |

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
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
  "message": "User doesn't have access to this index"
}
```

### 404 찾을 수 없음

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## 메모

- 의미 검색은 벡터 유사성을 사용하여 관련 문서를 찾습니다.
- 결과는 관련성 점수에 따라 정렬됩니다(가장 높은 것부터)
- 관련성이 낮은 결과를 필터링하려면 `min_score`을 사용하세요.
- 콘텐츠 미리보기가 500자로 잘립니다.
- `top_k` 매개변수는 반환되는 결과 수를 제한합니다.
- 메타데이터에는 문서 소스 및 위치에 대한 정보가 포함됩니다.