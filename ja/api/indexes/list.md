---
id: list
title: "すべてのインデックスをリストする"
sidebar_label: "すべてのインデックスをリストする"
description: "利用可能なナレッジベースのインデックスをすべて取得します"
openapi: "GET /indexes/all"
---
# すべてのインデックスをリストする

システム内で利用可能なすべてのナレッジ ベース インデックスの包括的なリストを取得します。

## エンドポイント

```
GET /indexes/all
```

## 説明

このエンドポイントは、SecureAI システムで利用可能なすべてのナレッジ ベース インデックスを返します。タイプ、ステータス、作成日、メタデータなど、各インデックスに関する詳細情報が提供されます。これは、利用可能なナレッジ ベースとその機能を発見するのに役立ちます。

## 認証

**必須**: API キー

```
Authorization: Bearer sk-your-api-key-here
```

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `page` |整数 |いいえ | 1 |ページネーションのページ番号 |
| `limit` |整数 |いいえ | 50 |ページごとのインデックスの数 (1 ～ 100) |
| `search` |文字列 |いいえ | - |インデックス名または共有インデックス名の検索語 |
| `type` |文字列 |いいえ | - |インデックス タイプ (個人、一般、グループ) でフィルタリング |
| `status` |文字列 |いいえ |アクティブ |インデックスのステータスによるフィルター (アクティブ、削除、すべて) |
| `sortBy` |文字列 |いいえ |作成場所 |並べ替えるフィールド |
| `sortOrder` |文字列 |いいえ |説明 |ソート順 (昇順、降順) |

## リクエストの例

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## 成功の応答

**ステータス コード**: `200 OK`

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

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `indexes[]` |配列 |インデックス オブジェクトの配列 |
| `indexes[].id` |文字列 |一意のインデックス識別子 |
| `indexes[].name` |文字列 |インデックス名 |
| `indexes[].sharedIndexName` |文字列 |共有インデックス名 |
| `indexes[].namespace` |文字列 |インデックス名前空間 |
| `indexes[].type` |文字列 |インデックスの種類 (個人、一般、グループ、不明) |
| `indexes[].assignedUser` |オブジェクト |割り当てられたユーザー情報 (個人の場合) |
| `indexes[].assignedGroup` |オブジェクト |割り当てられたグループ情報 (グループの場合) |
| `indexes[].userId` |文字列 |ユーザーID |
| `indexes[].isActive` |ブール値 |インデックスがアクティブかどうか |
| `indexes[].createdAt` |文字列 |作成タイムスタンプ |
| `indexes[].updatedAt` |文字列 |最終更新タイムスタンプ |
| `indexes[].deletedAt` |文字列 |削除タイムスタンプ (削除された場合) |
| `pagination` |オブジェクト |ページネーション情報 |

## インデックスの種類

|タイプ |説明 |アクセス |
|------|---------------|----------|
| `personal` |ユーザー作成の個人インデックス |所有者のフルアクセス |
| `general` |共有組織インデックス |権限によって異なります |
| `group` |グループ割り当てインデックス |グループメンバー |
| `unknown` |割り当てが不明瞭なインデックス |さまざま |

## インデックスのステータス

|ステータス |説明 |
|----------|---------------|
| `active` |インデックスは使用可能です |
| `deleted` |インデックスが削除されました |
| `all` |アクティブなものと削除されたものの両方を含める |

## 使用例

### JavaScript

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

### パイソン

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

## エラー応答

### 401 不正

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 リクエストが多すぎます

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

## フィルタリングの例

### タイプによるフィルター

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### ステータスによるフィルター

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### ページネーション

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## 使用例

- **ディスカバリー**: RAG 操作に利用可能なナレッジ ベースを検索します。
- **管理**: 管理目的のリストインデックス
- **統合**: アプリケーション統合のためのインデックスを検出します
- **監視**: インデックスのステータスとメタデータを確認します
- **フィルタリング**: 特定の種類のインデックス (システム、個人など) を検索します。

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者のみがアクセスできます
- 個人インデックスはその所有者のみに表示されます
- グループインデックスはグループメンバーに表示されます
- 応答には、割り当てられたユーザーとグループの情報が含まれます
- ページネーションではオフセットではなくページパラメータを使用します
- タイプとステータスによるフィルタリングは、結果を絞り込むのに役立ちます