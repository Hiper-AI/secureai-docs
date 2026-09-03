---
sidebar_position: 3
title: "ドキュメントを使用してインデックスをトレーニングする"
openapi: "POST /indexes/{indexName}/train"
---
# ドキュメントを使用してインデックスをトレーニングする

ドキュメント (ファイル) をアップロードするか、テキスト入力を提供して、インデックスをトレーニングします。

## エンドポイント

```
POST /indexes/{indexName}/train
```

## 説明

ドキュメント (ファイル) をアップロードするか、テキスト入力を提供して、インデックスをトレーニングします。このエンドポイントは複数のファイル形式をサポートし、一度に最大 20 個のファイルを処理できます。

### サポートされているファイル形式

-TXT
- PDF
- DOCX
- ドキュメント
- JSON
- CSV
-XLS
-XLSX

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## パスパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `indexName` |文字列 |はい |トレーニングするインデックスの名前 |

## リクエスト本文

このエンドポイントは `multipart/form-data` 形式を受け入れます。

### パラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `files` |バイナリの配列 |いいえ |アップロードするドキュメント ファイル (最大 20 ファイル、各 50MB) |
| `text_inputs` |文字列 |いいえ |テキスト入力の JSON 文字列配列。各項目には、名前、タイプ、内容、サイズが含まれている必要があります。

### テキスト入力形式

`text_inputs` を使用する場合は、以下を含むオブジェクトを含む JSON 文字列配列を提供します。

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

## リクエストの例

### ファイルのアップロード (マルチパート フォーム データ)

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

### パイソン

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

### テキスト入力の使用

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## 応答

### 成功の応答 (200)

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

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に true |
| `message` |文字列 |成功メッセージ |
| `request_id` |文字列 |追跡用のリクエスト ID |
| `results` |オブジェクト |トレーニング結果 |

### 結果オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `files_processed` |整数 |処理されたファイルの数 |
| `documents_extracted` |整数 |ファイルから抽出されたドキュメントの数 |
| `documents_indexed` |整数 |インデックスが正常に作成されたドキュメントの数 |
| `total_vectors` |整数 | Pinecone に格納されているベクトルの総数 |
| `total_chunks` |整数 |作成されたテキスト チャンクの総数 |
| `index_name` |文字列 |トレーニングされたインデックスの名前 |
| `namespace` |文字列 |インデックスの名前空間 |

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
}
```

### 401 不正

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

### 404 見つかりません

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 413 ペイロードが大きすぎます

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## 注意事項

- リクエストごとに最大 20 ファイル
- 1ファイルあたり最大50MB
- ファイルはマルチパート/フォームデータとしてアップロードできます
- テキスト入力は JSON 文字列配列として提供できます。
- ドキュメントは自動的にチャンク化され、セマンティック検索のためにベクトル化されます。
- インデックスはトレーニング前に存在する必要があります
- トレーニング結果には、インデックス作成に成功したドキュメントの数が表示されます。