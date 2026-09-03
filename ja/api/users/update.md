---
id: update
title: "ユーザーの更新"
sidebar_label: "ユーザーの更新"
description: "既存のユーザーアカウントを更新する"
openapi: "PUT /users/{userId}"
---
# ユーザーを更新する

既存のユーザー アカウントを新しい情報で更新します。

## エンドポイント

```
PUT /users/{userId}
```

## 説明

このエンドポイントにより、管理者は既存のユーザー アカウントを更新できます。名前、電子メール、役割、ライセンス層、その他のアカウント設定などのユーザーの詳細を変更できます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## パスパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `userId` |文字列 |はい |更新するユーザーの一意の識別子 |

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |いいえ |ユーザーのフルネーム |
| `username` |文字列 |いいえ |ユーザーの一意のユーザー名 |
| `email` |文字列 |いいえ |ユーザーのメールアドレス |
| `password` |文字列 |いいえ |ユーザー アカウントの新しいパスワード |
| `role` |文字列 |いいえ |ユーザーの役割 (管理者、ユーザー、globalReader) |
| `license` |文字列 |いいえ |ライセンス層 (エッセンシャル、グロース、ウルトラ、早期アクセス) |
| `status` |整数 |いいえ |アカウントのステータス (0=非アクティブ、1=アクティブ) |
| `roleId` |文字列 |いいえ |カスタム ロール ID (MongoDB ObjectId) |
| `setupCompleted` |ブール値 |いいえ |ユーザーセットアップが完了しているかどうか |
| `isVerified` |ブール値 |いいえ |ユーザーが認証されているかどうか |

## リクエストの例

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `message` |文字列 |成功メッセージ |
| `user` |オブジェクト |更新されたユーザー オブジェクト |
| `user.id` |文字列 |一意のユーザー識別子 |
| `user.name` |文字列 |ユーザーのフルネーム |
| `user.username` |文字列 |ユーザーのユーザー名 |
| `user.email` |文字列 |ユーザーのメールアドレス |
| `user.role` |文字列 |システムにおけるユーザーの役割 |
| `user.license` |文字列 |ユーザーのライセンス層 |
| `user.status` |整数 |ユーザーのアカウントのステータス (0=非アクティブ、1=アクティブ) |
| `user.isVerified` |ブール値 |ユーザーが認証されているかどうか |
| `user.setupCompleted` |ブール値 |ユーザーセットアップが完了しているかどうか |
| `user.authType` |文字列 |認証タイプ |
| `user.customRole` |オブジェクト |カスタム ロール情報 (割り当てられている場合) |
| `user.createdAt` |文字列 |アカウント作成のタイムスタンプ |
| `user.updatedAt` |文字列 |最終更新タイムスタンプ |
| `user.lastActive` |文字列 |ユーザーの最後のアクティビティのタイムスタンプ |

## 使用例

### JavaScript

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

### パイソン

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 見つかりません

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 紛争

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## 検証とビジネス ルール

- **ライセンス値**: 許可されたライセンス (`Essential`、`Growth`、`Ultra`、`Early Access`) に含まれている必要があります。無効な値は 400 を返します。
- **ライセンス容量**: `checkLicenseCapacity` 経由で強制されます。選択した層がいっぱいの場合は 400 を返します。
- **ライセンス ダウングレード ガード**: 下位層に変更すると個人インデックス クォータが減少する場合、現在の個人インデックス数が `INDEX_QUOTAS[new_license]` を超えると変更はブロックされます。明示的なガイダンスとともに 400 を返します。
- **電子メールの正規化**: 検証および保存前に小文字化およびトリミングされます。
- **ユーザー名の正規化**: 検証および保存前に小文字化およびトリミングされます。
- **電子メール形式**: 単純な正規表現検証。無効なメールは 400 を返します。
- **ユーザー名の形式**: `^[a-z0-9.-]{3,30}$` と一致する必要があります。無効なユーザー名は 400 を返します。
- **一意性**: `email`、`username`、および `name` は一意のままでなければなりません。競合は 409 を返します。

## 正規化と保存

- `email` および `username` は常に小文字で保存され、トリミングされます。

## 典型的なエラーの形状

### 400 無効なライセンス

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400 ライセンスは使用できません

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 ライセンスのダウングレードが割り当てを超過しました

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 無効な電子メール

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 無効なユーザー名

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 対立（独自性）

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## ユーザーの役割

|役割 |説明 |権限 |
|------|---------------|---------------|
| `admin` |管理者 |フルシステムアクセス |
| `user` |一般ユーザー |標準ユーザー アクセス |
| `globalReader` |グローバルリーダー |読み取り専用の管理パネルへのアクセス |

## ライセンス階層

|階層 |説明 |特長 |
|------|---------------|----------|
| `Essential` |基本レベル |機能が制限されている |
| `Growth` |プロフェッショナル層 |強化された機能 |
| `Ultra` |プレミアム層 |フル機能 |
| `Early Access` |早期アクセス層 |ベータ版の機能 |

## アカウントのステータス

|ステータス |説明 |
|----------|---------------|
| `0` |非アクティブなアカウント |
| `1` |アクティブなアカウント |

## 使用例

- **ロール管理**: アクセス制御のためのユーザー ロールの更新
- **ライセンスのアップグレード**: ユーザー ライセンス層の変更
- **アカウント メンテナンス**: ユーザー情報とメタデータの更新
- **ステータス管理**: ユーザーアカウントのアクティブ化または一時停止
- **プロファイルの更新**: ユーザー名、電子メール、その他の詳細の変更

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- 管理者のみがユーザーアカウントを更新できます
- 電子メール アドレスはすべてのユーザー間で一意である必要があります
- パスワードの更新はオプションであり、指定された場合にのみ適用されます。
- メタデータの更新は既存のメタデータとマージされます
- `updatedAt` タイムスタンプは、操作が成功すると自動的に更新されます