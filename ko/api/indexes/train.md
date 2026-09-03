---
sidebar_position: 3
title: "문서로 인덱스 훈련"
openapi: "POST /indexes/{indexName}/train"
---
# 문서로 인덱스 훈련

문서(파일)를 업로드하거나 텍스트 입력을 제공하여 인덱스를 훈련합니다.

## 엔드포인트

```
POST /indexes/{indexName}/train
```

## 설명

문서(파일)를 업로드하거나 텍스트 입력을 제공하여 인덱스를 훈련합니다. 이 엔드포인트는 다양한 파일 형식을 지원하며 한 번에 최대 20개의 파일을 처리할 수 있습니다.

### 지원되는 파일 형식

-TXT
- PDF
- DOCX
- 의사
- JSON
- CSV
- XLS
-XLSX

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 경로 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `indexName` | 문자열 | 예 | 훈련할 인덱스 이름 |

## 요청 본문

이 끝점은 `multipart/form-data` 형식을 허용합니다.

### 매개변수

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `files` | 바이너리 배열 | 아니요 | 업로드할 문서 파일(최대 20개, 각 50MB) |
| `text_inputs` | 문자열 | 아니요 | 텍스트 입력의 JSON 문자열 배열입니다. 각 항목에는 이름, 유형, 내용, 크기 |

### 텍스트 입력 형식

`text_inputs`를 사용할 때 다음을 포함하는 객체가 포함된 JSON 문자열 배열을 제공하세요.

```json
[
  {
    "name": "doc1.txt",
    "type": "text/plain",
    "content": "Document content here",
    "size": 20
  }
]
```

## 요청 예시

### 파일 업로드(다중 부분 양식 데이터)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@document3.txt"
```

### 자바스크립트/Node.js

```javascript
const formData = new FormData();
formData.append('files', fileInput1.files[0]);
formData.append('files', fileInput2.files[0]);
formData.append('files', fileInput3.files[0]);

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Files processed:', data.results.files_processed);
console.log('Documents indexed:', data.results.documents_indexed);
```

### 파이썬

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

files = [
    ('files', open('document1.pdf', 'rb')),
    ('files', open('document2.docx', 'rb')),
    ('files', open('document3.txt', 'rb'))
]

response = requests.post(url, headers=headers, files=files)
result = response.json()
print('Files processed:', result['results']['files_processed'])
print('Documents indexed:', result['results']['documents_indexed'])
```

### 텍스트 입력 사용

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## 응답

### 성공 응답 (200)

```json
{
  "success": true,
  "message": "Index trained successfully",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "results": {
    "files_processed": 3,
    "documents_extracted": 3,
    "documents_indexed": 3,
    "total_vectors": 11,
    "total_chunks": 3,
    "index_name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### 응답 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `success` | 부울 | 성공적인 요청의 경우 항상 true |
| `message` | 문자열 | 성공 메시지 |
| `request_id` | 문자열 | 추적을 위한 요청 ID |
| `results` | 개체 | 훈련 결과 |

### 결과 개체

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `files_processed` | 정수 | 처리된 파일 수 |
| `documents_extracted` | 정수 | 파일에서 추출된 문서 수 |
| `documents_indexed` | 정수 | 성공적으로 색인이 생성된 문서 수 |
| `total_vectors` | 정수 | Pinecone에 저장된 총 벡터 수 |
| `total_chunks` | 정수 | 생성된 총 텍스트 청크 수 |
| `index_name` | 문자열 | 훈련된 인덱스의 이름 |
| `namespace` | 문자열 | 인덱스의 네임스페이스 |

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
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

### 413 페이로드가 너무 큼

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## 메모

- 요청당 최대 20개 파일
- 파일당 최대 50MB
- 파일은 멀티파트/폼 데이터로 업로드 가능
- 텍스트 입력은 JSON 문자열 배열로 제공될 수 있습니다.
- 의미 검색을 위해 문서가 자동으로 청크화되고 벡터화됩니다.
- 훈련 전에 인덱스가 존재해야 합니다.
- 훈련 결과에는 성공적으로 인덱싱된 문서 수가 표시됩니다.