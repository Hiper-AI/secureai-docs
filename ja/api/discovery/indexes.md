---
sidebar_position: 2
title: "利用可能なナレッジベース"
openapi: "GET /indexes"
---
# 利用可能なナレッジベースを取得する

API キーがアクセスできる利用可能なナレッジ ベース (インデックス) を取得します。

## エンドポイント

```
GET /indexes
```

## 説明

API キーがアクセスできる利用可能なナレッジ ベース (インデックス) を取得します。個人インデックス、共有インデックス、およびゼロ知識オプションが含まれます。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `success` |ブール値 |リクエストが成功した場合は常に true | `true` |
| `indexes` |配列 |利用可能なナレッジベースのリスト |例を参照 |
| `restrictions` |オブジェクト |インデックスのアクセス制限 |例を参照 |

### インデックスオブジェクト

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `id` |文字列 |一意のインデックス識別子 | `"my-knowledge-base"` |
| `name` |文字列 |インデックス表示名 | `"my-knowledge-base"` |
| `type` |文字列 |インデックスの種類 | `"personal"` |
| `namespace` |文字列 |インデックス名前空間 (オプション) | `"user-namespace"` |
| `description` |文字列 |インデックスの説明 (オプション) | `"Direct AI responses..."` |

### インデックスの種類

|タイプ |説明 |
|------|---------------|
| `system` |システム提供のインデックス (例: Zero-Knowledge) |
| `personal` |ユーザーの個人的な知識ベース |
| `general` |共有知識ベース |

### 制限対象

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `allowed_indexes` |文字列 |許可されるインデックスの説明 | `"all user indexes"` |

## エラー応答

### 401 不正

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## 使用例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

### パイソン

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 特別なインデックス

### 知識ゼロ

`Zero-Knowledge` インデックスは、ナレッジ ベースを取得せずに直接 AI 応答を提供する特別なシステム インデックスです。次の場合にこれを使用します。

- RAG を使用しない純粋な AI 応答
- AI モデルの機能をテストする
- 特定の文脈のない一般的な会話

## 注意事項

- ゼロ知識インデックスはいつでも利用可能です
- 個人インデックスはユーザーによって作成されます
- インデックスへのアクセスは権限に応じて異なります
- チャット完了リクエストでインデックス ID を使用する