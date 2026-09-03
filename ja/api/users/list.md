---
sidebar_position: 1
title: "すべてのユーザーを取得"
openapi: "GET /users"
---
# すべてのユーザーを取得

ページネーションとフィルタリングを使用してすべてのユーザーを取得します。管理者のみがアクセスできます。

## エンドポイント

```
GET /users
```

## 説明

このエンドポイントを使用すると、管理者はシステム内のすべてのユーザーのページ分割されたリストを取得できます。役割、ライセンス、ステータス、検索用語などのさまざまな基準によるフィルタリングをサポートします。これは、適切な権限を必要とする管理エンドポイントです。

## 認証

必須。 API キーを Authorization ヘッダーに含めます。

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト

### クエリパラメータ

|パラメータ |タイプ |必須 |デフォルト |説明 |
|----------|------|----------|----------|-------------|
| `page` |整数 |いいえ | 1 |ページネーションのページ番号 |
| `limit` |整数 |いいえ | 20 |ページあたりのユーザー数 (1 ～ 100) |
| `search` |文字列 |いいえ | - |名前、電子メール、またはユーザー名の検索語 |
| `role` |文字列 |いいえ | - |ユーザー ロール (管理者、ユーザー、globalReader) によるフィルター |
| `license` |文字列 |いいえ | - |ユーザー ライセンスによるフィルター (Essential、Growth、Ultra、Early Access) |
| `status` |整数 |いいえ | - |ユーザーステータスによるフィルター (0=非アクティブ、1=アクティブ) |
| `sortBy` |文字列 |いいえ |作成場所 |並べ替えるフィールド |
| `sortOrder` |文字列 |いいえ |説明 |ソート順 (昇順、降順) |

### リクエストの例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

検索の場合:

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に `true` |
| `users` |配列 |ユーザーオブジェクトの配列 |
| `users[].id` |文字列 |ユーザーの一意の識別子 |
| `users[].name` |文字列 |ユーザーのフルネーム |
| `users[].username` |文字列 |ユーザーのユーザー名 |
| `users[].email` |文字列 |ユーザーのメールアドレス |
| `users[].role` |文字列 |ユーザーのロール (管理者、ユーザー、globalReader) |
| `users[].license` |文字列 |ユーザーのライセンス層 (Essential、Growth、Ultra、Early Access) |
| `users[].status` |整数 |ユーザーステータス (0=非アクティブ、1=アクティブ) |
| `users[].isVerified` |ブール値 |ユーザーが認証されているかどうか |
| `users[].setupCompleted` |ブール値 |ユーザーセットアップが完了しているかどうか |
| `users[].authType` |文字列 |認証タイプ (基本、auth0) |
| `users[].mfaEnabled` |ブール値 | MFA が有効かどうか |
| `users[].customRole` |オブジェクト |カスタム ロール情報 (割り当てられている場合) |
| `users[].customRole.id` |文字列 |カスタムロールID |
| `users[].customRole.name` |文字列 |カスタムロール名 |
| `users[].customRole.displayName` |文字列 |カスタム役割の表示名 |
| `users[].createdAt` |文字列 |ユーザー作成のタイムスタンプ |
| `users[].updatedAt` |文字列 |ユーザーの最終更新タイムスタンプ |
| `users[].lastActive` |文字列 |ユーザーの最後のアクティビティのタイムスタンプ |
| `pagination` |オブジェクト |ページネーション情報 |
| `pagination.page` |整数 |現在のページ番号 |
| `pagination.limit` |整数 |ページごとの項目 |
| `pagination.total` |整数 |ユーザーの総数 |
| `pagination.pages` |整数 |総ページ数 |

## 使用例

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

### パイソン

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## エラー応答

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
  "message": "Admin access required"
}
```

## フィルタリングの例

### 名前またはメールアドレスで検索

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 役割によるフィルター

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### ライセンスによるフィルター

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### ステータスによるフィルター

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 最終アクティブ順に並べ替え

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 使用例

- **ユーザー管理**: システム内のすべてのユーザーを表示および管理します
- **ユーザー分析**: ロール、ライセンス、またはステータスごとにユーザーの分布を分析します。
- **検索とフィルター**: さまざまな条件に基づいて特定のユーザーを検索します
- **管理タスク**: 管理操作とレポート作成をサポートします。

## 役割の説明

- **admin**: 管理制御による完全なシステム アクセス
- **ユーザー**: チャット機能と個人のナレッジベースへの標準アクセス  
- **globalReader**: 表示権限を持つ管理パネルへの読み取り専用アクセス

## ライセンスの説明

- **Essential**: 29,000 ポイント/月のベーシック レベル
- **成長**: 機能が強化された中間層
- **ウルトラ**: 最大限の機能を備えたプレミアム層
- **早期アクセス**: 実験的な機能を備えたベータ版

## レート制限

このエンドポイントは、標準のレート制限に従います。
- 1 分あたり 60 リクエスト
- 1 時間あたり 1000 リクエスト