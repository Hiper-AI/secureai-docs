---
id: update
title: "アップデートグループ"
sidebar_label: "アップデートグループ"
description: "既存のユーザーグループを更新する"
openapi: "PUT /groups/{groupId}"
---
# グループの更新

既存のユーザー グループを新しい情報、説明、またはメタデータで更新します。

## エンドポイント

```
PUT /groups/{groupId}
```

## 説明

このエンドポイントにより、管理者は既存のユーザー グループを更新できます。グループ名、説明、メタデータ、およびその他のプロパティを変更できます。グループは存在する必要があり、それを更新するための適切な権限を持っている必要があります。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## パスパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `groupId` |文字列 |はい |更新するグループの一意の識別子 |

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |いいえ |グループの新しい名前 |
| `description` |文字列 |いいえ |グループの新しい説明 |
| `users` |配列 |いいえ |グループに割り当てるユーザー ID の配列 |
| `status` |文字列 |いいえ |グループステータス |

## リクエストの例

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "message": "Group updated successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "status": "Active",
    "userCount": 3,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c27",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      }
    ],
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
| `group` |オブジェクト |更新されたグループ オブジェクト |
| `group.id` |文字列 |一意のグループ識別子 |
| `group.name` |文字列 |更新されたグループ名 |
| `group.description` |文字列 |グループの説明を更新 |
| `group.status` |文字列 |グループステータス |
| `group.userCount` |整数 |グループ内のユーザーの数 |
| `group.users` |配列 |グループ内のユーザー オブジェクトの配列 |
| `group.users[].id` |文字列 |ユーザーID |
| `group.users[].name` |文字列 |ユーザー名 |
| `group.users[].email` |文字列 |ユーザーのメールアドレス |
| `group.createdAt` |文字列 |オリジナルの作成タイムスタンプ |
| `group.updatedAt` |文字列 |最終更新タイムスタンプ |

## 使用例

### JavaScript

```javascript
const updateGroup = async (groupId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/groups/${groupId}`, {
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
  name: "Updated Engineering Team",
  description: "Updated software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  status: "Active"
};

const result = await updateGroup('60a7c8f5e8b4f5001f7a8c25', updateData);
console.log('Updated group:', result.group);
```

### パイソン

```python
import requests

def update_group(group_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/groups/{group_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
}

result = update_group("60a7c8f5e8b4f5001f7a8c25", update_data)
print("Updated group:", result["group"])
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/groups/60a7c8f5e8b4f5001f7a8c25" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name cannot be empty",
    "details": {
      "field": "name",
      "value": ""
    }
  }
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
    "message": "Cannot update this group"
  }
}
```

### 404 見つかりません

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
  }
}
```

### 409 紛争

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

## 使用例

- **グループ管理**: グループ情報と説明を更新します。
- **ユーザーの割り当て**: 新しいユーザーをグループに割り当てます
- **名前の変更**: わかりやすくするためにグループの名前を変更します。
- **ステータスの更新**: グループのステータスを変更します
- **チームの更新**: チーム構造が変更されたときにグループ情報を更新します

## レート制限

- **デフォルト**: 1 分あたり 50 リクエスト
- **毎日**: 1 日あたり 5,000 リクエスト
- **毎月**: 毎月 150,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者のみがアクセスできます
- 部分更新: 変更したいフィールドのみを含めます
- ユーザー割り当て: 新しいユーザーをグループに割り当てることができます
- 名前の検証: グループ名は一意である必要があります
- フラットな応答: 応答はデータ オブジェクトの下にネストされていません
- ユーザー検証: ユーザー ID は割り当て前に検証されます。
- `updatedAt` タイムスタンプは自動的に更新されます