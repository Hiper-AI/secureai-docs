---
sidebar_position: 3
title: "Train Index with Documents"
openapi: "POST /indexes/{indexName}/train"
---



# Train Index with Documents

Train an index by uploading documents (files) or providing text inputs.

## Endpoint

```
POST /indexes/{indexName}/train
```

## Description

Train an index by uploading documents (files) or providing text inputs. This endpoint supports multiple file formats and can process up to 20 files at once.

### Supported File Formats

- TXT
- PDF
- DOCX
- DOC
- JSON
- CSV
- XLS
- XLSX

## Authentication

Required: API Key

```bash
Authorization: Bearer sk-your-api-key-here
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indexName` | string | Yes | Name of the index to train |

## Request Body

This endpoint accepts `multipart/form-data` format.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | array of binary | No | Document files to upload (up to 20 files, 50MB each) |
| `text_inputs` | string | No | JSON string array of text inputs. Each item should have: name, type, content, size |

### Text Input Format

When using `text_inputs`, provide a JSON string array with objects containing:

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

## Request Examples

### Upload Files (Multipart Form Data)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@document3.txt"
```

### JavaScript/Node.js

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

### Python

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

### Using Text Inputs

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## Response

### Success Response (200)

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for successful requests |
| `message` | string | Success message |
| `request_id` | string | Request ID for tracking |
| `results` | object | Training results |

### Results Object

| Field | Type | Description |
|-------|------|-------------|
| `files_processed` | integer | Number of files processed |
| `documents_extracted` | integer | Number of documents extracted from files |
| `documents_indexed` | integer | Number of documents successfully indexed |
| `total_vectors` | integer | Total number of vectors stored in Pinecone |
| `total_chunks` | integer | Total number of text chunks created |
| `index_name` | string | Name of the trained index |
| `namespace` | string | Namespace of the index |

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Access denied",
  "message": "User doesn't have access to this index"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 413 Payload Too Large

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## Notes

- Maximum 20 files per request
- Maximum 50MB per file
- Files can be uploaded as multipart/form-data
- Text inputs can be provided as a JSON string array
- Documents are automatically chunked and vectorized for semantic search
- The index must exist before training
- Training results show how many documents were successfully indexed

