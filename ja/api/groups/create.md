---
id: create
title: "グループの作成"
sidebar_label: "グループの作成"
description: "新しいユーザーグループを作成する"
openapi: "POST /groups"
---
# グループの作成

ユーザーを整理し、アクセス権限を管理するための新しいユーザー グループを作成します。

## エンドポイント

```
POST /groups
```

## 説明

このエンドポイントにより、管理者は新しいユーザー グループを作成できます。グループは、ユーザーの編成、権限の管理、システムのさまざまな部分へのアクセスの制御に使用されます。作成時にグループ名、説明、メタデータを指定できます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |はい |グループ名 |
| `description` |文字列 |はい |グループの説明 |
| `users` |配列 |いいえ |グループに追加するユーザー ID の配列 |
| `status` |文字列 |いいえ |グループのステータス (デフォルトは「アクティブ」) |

## リクエストの例

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## 成功の応答

**ステータス コード**: `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
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
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `message` |文字列 |成功メッセージ |
| `group` |オブジェクト |作成されたグループ オブジェクト |
| `group.id` |文字列 |一意のグループ識別子 |
| `group.name` |文字列 |グループ名 |
| `group.description` |文字列 |グループの説明 |
| `group.status` |文字列 |グループステータス |
| `group.userCount` |整数 |グループ内のユーザーの数 |
| `group.users` |配列 |グループ内のユーザー オブジェクトの配列 |
| `group.users[].id` |文字列 |ユーザーID |
| `group.users[].name` |文字列 |ユーザー名 |
| `group.users[].email` |文字列 |ユーザーのメールアドレス |
| `group.createdAt` |文字列 |作成タイムスタンプ |

## 使用例

### JavaScript

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

### パイソン

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
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
    "message": "Group name is required",
    "details": {
      "field": "name",
      "value": null
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
    "message": "Admin privileges required"
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

- **ユーザー組織**: グループを作成して、部門または機能ごとにユーザーを整理します。
- **アクセス制御**: 権限とアクセスを管理するためのグループを確立します。
- **チーム管理**: さまざまなチームまたはプロジェクト用のグループを作成します
- **レポート**: レポートと分析のためにユーザーを整理します
- **統合**: サードパーティ システム統合用のグループを作成します。

## レート制限

- **デフォルト**: 1 分あたり 50 リクエスト
- **毎日**: 1 日あたり 5,000 リクエスト
- **毎月**: 毎月 150,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者のみがアクセスできます
- 必須フィールド: 名前と説明の両方が必須です
- ユーザー割り当て: 作成中にユーザーをグループに割り当てることができます
- ステータス: 指定しない場合、デフォルトは「アクティブ」です。
- 検証: ユーザー ID は割り当て前に検証されます。
- フラットな応答: 応答はデータ オブジェクトの下にネストされていません
- グループは作成後すぐに使用できます。