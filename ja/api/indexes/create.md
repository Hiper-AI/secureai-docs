---
id: create
title: "インデックスの作成"
sidebar_label: "インデックスの作成"
description: "新しいナレッジベースのインデックスを作成する"
openapi: "POST /indexes/all"
---
# インデックスの作成

ドキュメントを保存および取得するための新しいナレッジ ベース インデックスを作成します。

## エンドポイント

```
POST /indexes
```

## 説明

このエンドポイントにより、管理者は新しいナレッジ ベース インデックスを作成できます。インデックスは特定のユーザーまたはグループに割り当てることができます。管理者のみがインデックスを作成できます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |はい |インデックス名 |
| `assignedUser` |文字列 |いいえ |インデックスを割り当てるユーザー ID (MongoDB ObjectId) |
| `assignedGroup` |文字列 |いいえ |インデックスを割り当てるグループ ID (MongoDB ObjectId) |
| `sharedIndexName` |文字列 |いいえ |共有インデックス名 (デフォルトは name) |
| `namespace` |文字列 |いいえ |インデックスの名前空間 (指定しない場合は自動生成) |
| `region` |文字列 |いいえ |ストレージの領域ヒント (オプション) |
| `cloud` |文字列 |いいえ |クラウド プロバイダーのヒント (オプション) |


## リクエストの例

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## 成功の応答

**ステータス コード**: `201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `message` |文字列 |成功メッセージ |
| `index` |オブジェクト |作成されたインデックス オブジェクト |
| `index.id` |文字列 |一意のインデックス識別子 |
| `index.name` |文字列 |インデックス名 |
| `index.sharedIndexName` |文字列 |共有インデックス名 |
| `index.namespace` |文字列 |インデックス名前空間 |
| `index.type` |文字列 |インデックスの種類 (個人、一般、グループ、不明) |
| `index.assignedUser` |オブジェクト |割り当てられたユーザー情報 (個人の場合) |
| `index.assignedGroup` |オブジェクト |割り当てられたグループ情報 (グループの場合) |
| `index.createdAt` |文字列 |作成タイムスタンプ |

## 使用例

### JavaScript

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

### パイソン

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## 検証とビジネス ルール

- **インデックス名の正規化** (ストレージと一意性チェック用):
  - 小文字、空白をトリミング
  - スペースをハイフンに置き換えます
  - `[a-z0-9-]` にない文字を削除します。
- **インデックス名の検証**: `^[a-z0-9-]{3,50}$` と一致する必要があります。それ以外の場合は 400 を返します。
- **一意性**: 正規化された `name` は一意である必要があります。重複した場合は 409 が返されます。
- **割り当てられたユーザー クォータ**: `assignedUser` が指定されている場合は、`checkUserIndexQuota` 経由でユーザー インデックス クォータを適用します。クォータを超過すると 403 が返されます。
- **地域制限 (必須)**: `Essential` ライセンスの場合、インデックスは `cloud=aws` および `region=us-east-1` でのみ作成できます。それ以外の場合は403。
- **割り当てられたグループ**: `assignedGroup` が指定される場合、グループは存在する必要があり、アーカイブされてはなりません (`status != 'Archived'`)。それ以外の場合は400。

## 正規化と保存

- `name`は正規化されて保存されます。
- `sharedIndexName` のデフォルトは正規化された `name` です。
- ユーザーに割り当てられる場合、`namespace` はデフォルトで `user-{userId}-index-{normalizedName}` になります。

## 典型的なエラーの形状

### 400 無効なインデックス名

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 インデックス クォータを超過しました

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 地域は許可されていません

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
}
```

### 400 グループが無効/非アクティブ

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
}
```

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

### 403 禁止

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Cannot create general indexes without admin privileges"
  }
}
```

### 409 紛争

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## インデックスの種類

|タイプ |説明 |必要な権限 |
|-----|----------|----------|
| `personal` |個人用インデックス |管理者権限 |
| `general` |共有組織インデックス |管理者権限 |
| `group` |グループ割り当てインデックス |管理者権限 |

## 必須フィールド

|フィールド |説明 |例 |
|----------|---------------|----------|
| `name` |インデックス名 | "私の知識ベース" |
| `region` | AWS リージョン | "us-east-1" |
| `cloud` |クラウドプロバイダー | 「AWS」 |

## 使用例

- **ユーザー割り当て**: インデックスを作成し、特定のユーザーに割り当てます。
- **グループ割り当て**: インデックスを作成し、グループに割り当てます。
- **ナレッジベース**: 特定のドメインに特化したナレッジベースを構築します。
- **コンテンツの構成**: トピックまたはカテゴリごとにコンテンツを整理します。
- **ベクトル ストレージ**: ベクトル埋め込みを保存および取得するためのインデックスを作成します。

## レート制限

- **デフォルト**: 1 分あたり 50 リクエスト
- **毎日**: 1 日あたり 5,000 リクエスト
- **毎月**: 毎月 150,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者のみがアクセスできます
- 必須フィールド: 名前、地域、クラウドはすべて必須です
- 割り当て: インデックスはユーザー (assignedUser) またはグループ (assignedGroup) に割り当てることができます。
- 自動生成: 名前空間が指定されていない場合は自動生成されます。
- 一意の名前: インデックス名はシステム全体で一意である必要があります。
- インデックスは作成後すぐに使用できます。
- 次元: ベクトル次元はアプリケーションによって内部的に管理されます (現在 4096)
- メトリック: 類似性メトリックはアプリケーションによって内部的に管理されます。