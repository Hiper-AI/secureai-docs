---
sidebar_position: 3
title: "训练索引与文档"
openapi: "POST /indexes/{indexName}/train"
---
# 训练带有文档的索引

通过上传文档（文件）或提供文本输入来训练索引。

## 端点

```
POST /indexes/{indexName}/train
```

## 说明

通过上传文档（文件）或提供文本输入来训练索引。该端点支持多种文件格式，一次最多可处理 20 个文件。

### 支持的文件格式

- 文本
- PDF
- DOCX
- 文档
- JSON
- CSV
-XLS
-XLSX

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 路径参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `indexName` |字符串|是的 |要训​​练的索引名称 |

## 请求正文

该端点接受 `multipart/form-data` 格式。

### 参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `files` |二进制数组 |没有 |要上传的文档文件（最多 20 个文件，每个文件 50MB）|
| `text_inputs` |字符串|没有 |文本输入的 JSON 字符串数组。每个项目应该有：名称、类型、内容、尺寸 |

### 文本输入格式

使用 `text_inputs` 时，提供一个 JSON 字符串数组，其中包含以下对象：

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

## 请求示例

### 上传文件（多部分表单数据）

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

###Python

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

### 使用文本输入

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## 回应

### 成功响应 (200)

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求始终如此 |
| `message` |字符串|成功留言|
| `request_id` |字符串|请求 ID 进行跟踪 |
| `results` |对象|培训成果|

### 结果对象

|领域 |类型 |描述 |
|--------|------|-------------|
| `files_processed` |整数 |处理的文件数量 |
| `documents_extracted` |整数 |从文件中提取的文档数量 |
| `documents_indexed` |整数 |成功索引的文档数量 |
| `total_vectors` |整数 | Pinecone 中存储的向量总数 |
| `total_chunks` |整数 |创建的文本块总数 |
| `index_name` |字符串|训练索引的名称 |
| `namespace` |字符串|索引的命名空间 |

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
}
```

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "User doesn't have access to this index"
}
```

### 404 未找到

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 413 有效负载太大

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## 注释

- 每个请求最多 20 个文件
- 每个文件最大 50MB
- 文件可以作为多部分/表单数据上传
- 文本输入可以作为 JSON 字符串数组提供
- 文档自动分块和矢量化以进行语义搜索
- 训练前索引必须存在
- 训练结果显示有多少文档被成功索引