---
id: update
title: "インデックスの更新"
sidebar_label: "インデックスの更新"
description: "既存のナレッジベースのインデックスを更新する"
openapi: "PUT /indexes/{indexId}"
---
# インデックスを更新する

既存のナレッジ ベース インデックスを新しい設定、メタデータ、または構成で更新します。

## エンドポイント

```
PUT /indexes/{indexId}
```

## 説明

このエンドポイントにより、管理者は既存のナレッジ ベースのインデックスを更新できます。インデックス名を変更し、別のユーザーまたはグループに再割り当てすることができます。管理者のみがインデックスを更新できます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## パスパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `indexId` |文字列 |はい |更新するインデックスの一意の識別子 |

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |いいえ |インデックスの新しい名前 |
| `assignedUser` |文字列 |いいえ |インデックスを割り当てるユーザー ID (MongoDB ObjectId) |
| `assignedGroup` |文字列 |いいえ |インデックスを割り当てるグループ ID (MongoDB ObjectId) |


## リクエストの例

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `message` |文字列 |成功メッセージ |
| `index` |オブジェクト |更新されたインデックス オブジェクト |
| `index.id` |文字列 |一意のインデックス識別子 |
| `index.name` |文字列 |更新されたインデックス名 |
| `index.sharedIndexName` |文字列 |共有インデックス名 |
| `index.namespace` |文字列 |インデックス名前空間 |
| `index.type` |文字列 |インデックスの種類 (個人、一般、グループ、不明) |
| `index.assignedUser` |オブジェクト |割り当てられたユーザー情報 (個人の場合) |
| `index.assignedGroup` |オブジェクト |割り当てられたグループ情報 (グループの場合) |
| `index.createdAt` |文字列 |オリジナルの作成タイムスタンプ |
| `index.updatedAt` |文字列 |最終更新タイムスタンプ |

## 使用例

### JavaScript

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  return await response.json();
};

// Example usage
const updateData = {
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

### パイソン

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## 検証とビジネス ルール

- **ユーザーへの割り当て (`assignedUser`)**:
  - 個人に変換するとき、または担当者を変更するときに、`checkUserIndexQuota` を介してユーザー インデックス クォータを強制します。クォータを超過すると 403 が返されます。
- **グループへの割り当て (`assignedGroup`)**:
  - グループは存在し、アクティブである必要があります (`status != 'Archived'`)。無効または非アクティブなグループは 400 を返します。

## 正規化と保存

- 名前を変更すると、`name` は引き続き正規化されて保存されます。 `sharedIndexName` は、明示的に設定されていない場合、デフォルトで正規化された名前になります。

## 典型的なエラーの形状

### 403 インデックス クォータを超過しました

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
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
    "message": "Cannot update this index"
  }
}
```

### 404 見つかりません

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
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

## 更新可能なフィールド

|フィールド |説明 |メモ |
|----------|---------------|----------|
| `name` |インデックス名 |システム全体で一意である必要があります |
| `assignedUser` |ユーザーの割り当て |特定のユーザーにインデックスを割り当てます。
| `assignedGroup` |グループ割り当て |インデックスを特定のグループに割り当てます。

## 使用例

- **名前の変更**: 整理しやすくするためにインデックスの名前を変更します。
- **ユーザー割り当て**: インデックスを別のユーザーに再割り当てします。
- **グループ割り当て**: インデックスを別のグループに再割り当てします。
- **所有権の譲渡**: ユーザー間でインデックスの所有権を変更します。

## レート制限

- **デフォルト**: 1 分あたり 50 リクエスト
- **毎日**: 1 日あたり 5,000 リクエスト
- **毎月**: 毎月 150,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者のみがアクセスできます
- 制限されたフィールド: name、assignedUser、assignedGroup のみを更新できます
- 割り当てロジック: ユーザーに割り当てるとグループ割り当てがクリアされ、その逆も同様です。
- 検証: ユーザー ID とグループ ID は割り当て前に検証されます。
- 設定なし: 設定、メタデータ、またはその他の構成を更新できません
- `updatedAt` タイムスタンプは自動的に更新されます
- インデックス名はシステム全体で一意である必要があります