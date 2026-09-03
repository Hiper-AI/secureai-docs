---
sidebar_position: 4
title: "ドキュメントの検索インデックス"
openapi: "GET /indexes/{indexName}/search"
---
# ドキュメントの検索インデックス

セマンティック検索を使用してインデックス内のドキュメントを検索します。

## エンドポイント

```
GET /indexes/{indexName}/search
```

## 説明

セマンティック検索を使用してインデックス内のドキュメントを検索します。関連性スコアを含む一致するドキュメントを関連性順に並べて返します。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## パスパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `indexName` |文字列 |はい |検索するインデックスの名前 |

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `query` |文字列 |はい |検索クエリのテキスト |
| `top_k` |整数 |いいえ |返される結果の最大数 (1 ～ 50、デフォルト: 10) |
| `min_score` |フロート |いいえ |関連性スコアの最小しきい値 (0.0 ～ 1.0、デフォルト: 0.0) |

## リクエストの例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=What%20is%20machine%20learning?&top_k=10&min_score=0.5" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

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

### パイソン

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

## 応答

### 成功の応答 (200)

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

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に true |
| `request_id` |文字列 |追跡用のリクエスト ID |
| `query` |文字列 |使用された検索クエリ |
| `results` |オブジェクト |検索結果 |
| `index` |オブジェクト |インデックス情報 |

### 結果オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `matches` |配列 |関連性によってソートされた、一致するドキュメントの配列 |
| `total` |整数 |見つかった一致の総数 |
| `top_k` |整数 |要求された top_k 値 |

### 一致オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `rank` |整数 |結果ランク (1 ベース) |
| `score` |フロート |関連性スコア (0.0 ～ 1.0、高いほど関連性が高くなります) |
| `source` |文字列 |ドキュメント ソース識別子 |
| `content` |文字列 |コンテンツのプレビュー (500 文字に切り捨てられます) |
| `metadata` |オブジェクト |追加のメタデータ |

### メタデータ オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `page` |整数\|null |ページ番号 (PDF からの場合) |
| `chunkIndex` |整数\|null |ドキュメント内のチャンク インデックス |
| `title` |文字列\|null |文書のタイトル |
| `documentId` |文字列\|null |ドキュメントID |

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
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

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## 注意事項

- セマンティック検索ではベクトルの類似性を使用して関連ドキュメントを検索します
- 結果は関連性スコアによって並べ替えられます (最も高いものから順)
- `min_score` を使用して関連性の低い結果を除外します
- コンテンツのプレビューは 500 文字に切り詰められます
- `top_k` パラメータは、返される結果の数を制限します
- メタデータにはドキュメントのソースと場所に関する情報が含まれます