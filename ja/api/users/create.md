---
sidebar_position: 2
title: "新しいユーザーの作成"
openapi: "POST /users"
---
# 新しいユーザーを作成する

新しいユーザー アカウントを作成します。管理者のみがアクセスできます。

## エンドポイント

```
POST /users
```

## 説明

このエンドポイントにより、管理者はシステム内に新しいユーザー アカウントを作成できます。ロール、ライセンス、認証タイプなどのさまざまなユーザー属性を指定できます。これは、適切な権限を必要とする管理エンドポイントです。

## ユーザー作成フロー

**基本認証** (`authType: "basic"`): ユーザーは、パスワード設定リンクが記載されたウェルカム電子メールを受信します。アカウントは、パスワードが設定されるまで検証されずに作成されます。

**エンタープライズ SSO** (`authType: "enterprise"`): ユーザーは検証済みで作成され、エンタープライズ SSO (Auth0、Microsoft AD など) 経由でサインインできます。パスワードの設定は必要ありません。

## 認証

必須。 API キーを Authorization ヘッダーに含めます。

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト

### リクエスト本文

|パラメータ |タイプ |必須 |デフォルト |説明 |
|----------|------|----------|----------|-------------|
| `name` |文字列 |はい | - |ユーザーのフルネーム |
| `username` |文字列 |いいえ | - |一意のユーザー名 (指定しない場合は電子メールから自動生成されます) |
| `email` |文字列 |はい | - |ユーザーのメールアドレス |
| `role` |文字列 |いいえ |ユーザー |ユーザーのロール (管理者、ユーザー、globalReader) |
| `license` |文字列 |いいえ |必須 |ユーザーのライセンス層 (Essential、Growth、Ultra、Early Access) |
| `roleId` |文字列 |いいえ | - |カスタム ロール ID (MongoDB ObjectId) |
| `setupCompleted` |ブール値 |いいえ |偽 |ユーザーセットアップが完了しているかどうか |
| `authType` |文字列 |いいえ |基本 |認証タイプ (ベーシック、エンタープライズ) |

### リクエストの例

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## 応答

### 成功の応答 (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に `true` |
| `message` |文字列 |成功メッセージ |
| `user` |オブジェクト |作成されたユーザー オブジェクト |
| `user.id` |文字列 |ユーザーの一意の識別子 |
| `user.name` |文字列 |ユーザーのフルネーム |
| `user.username` |文字列 |ユーザーのユーザー名 |
| `user.email` |文字列 |ユーザーのメールアドレス |
| `user.role` |文字列 |ユーザーの役割 |
| `user.license` |文字列 |ユーザーのライセンス層 |
| `user.status` |整数 |ユーザーステータス (1=アクティブ) |
| `user.isVerified` |ブール値 |ユーザーが認証されているかどうか |
| `user.setupCompleted` |ブール値 |ユーザーセットアップが完了しているかどうか |
| `user.authType` |文字列 |認証タイプ |
| `user.createdAt` |文字列 |ユーザー作成のタイムスタンプ |

## 使用例

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

### パイソン

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 無効な認証タイプ

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 必須フィールドがありません

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
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
  "message": "Admin access required"
}
```

### 409 紛争

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## 検証とビジネス ルール

- **ライセンス値**: 許可されたライセンス (`Essential`、`Growth`、`Ultra`、`Early Access`) のいずれかである必要があります。無効な値は 400 を返します。
- **ライセンス容量**: `checkLicenseCapacity` 経由で強制されます。選択した層の容量がいっぱいの場合は、400 を返します。
- **電子メールの正規化**: 検証および保存前に小文字化およびトリミングされます。
- **ユーザー名の正規化**: 検証および保存前に小文字化およびトリミングされます。指定されていない場合は、電子メールから自動生成されます。
- **電子メール形式**: 単純な正規表現で検証されます。無効なメールは 400 を返します。
- **ユーザー名の形式**: `^[a-z0-9.-]{3,30}$` と一致する必要があります。無効なユーザー名は 400 を返します。
- **一意性**: `email`、`username`、および `name` は一意である必要があります。競合は 409 を返します。
- **電子メールによる招待動作**: 基本認証の場合、ユーザーはパスワード設定リンクが記載されたウェルカム電子メールを受信します。

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## ユーザーの役割

|役割 |説明 |権限 |
|------|---------------|---------------|
| `admin` |管理者 |フルシステムアクセス |
| `user` |一般ユーザー |標準ユーザー アクセス |
| `globalReader` |グローバルリーダー |読み取り専用の管理パネルへのアクセス |

## ライセンス階層

|ライセンス |説明 |特長 |
|----------|---------------|----------|
| `Essential` |基本レベル |機能が制限されている |
| `Growth` |プロフェッショナル層 |強化された機能 |
| `Ultra` |プレミアム層 |フル機能 |
| `Early Access` |早期アクセス層 |ベータ版の機能 |

## 認証タイプ

|タイプ |説明 |
|------|---------------|
| `basic` |ユーザー名/パスワード認証 (ユーザーはパスワード設定メールを受け取ります) |
| `enterprise` |エンタープライズ SSO 統合 (Auth0、Microsoft AD など) |

## 使用例

- **ユーザー オンボーディング**: チーム メンバー用の新しいユーザー アカウントを作成します
- **パスワードレス オンボーディング**: 独自のパスワードを設定するための電子メール招待を受信するユーザーを作成します
- **SSO 統合**: 外部 ID プロバイダー経由で認証するユーザーを作成します。
- **ユーザーの一括作成**: プログラムで複数のユーザーを作成します
- **統合**: 外部システムからユーザーを作成
- **管理タスク**: API を介してユーザー アカウントを管理する

## レート制限

このエンドポイントは、標準のレート制限に従います。
- 1 分あたり 60 リクエスト
- 1 時間あたり 1000 リクエスト