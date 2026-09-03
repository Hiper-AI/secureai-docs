---
id: create
title: "ロールの作成"
sidebar_label: "ロールの作成"
description: "新しいユーザー役割を作成する"
openapi: "POST /roles"
---
# ロールの作成

特定の権限を持つ新しいカスタム ユーザー ロールを作成します。

## エンドポイント

```
POST /roles
```

## 説明

このエンドポイントにより、管理者は新しいカスタム ユーザー ロールを作成できます。カスタム ロールには、組織のニーズに合わせた特定の権限を付与できます。作成時にロール名、説明、権限を指定できます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |はい |ロール名 (システム識別子) |
| `displayName` |文字列 |はい |人間が判読できるロール名 |
| `description` |文字列 |はい |役割の目的の説明 |
| `hasAdminPanelAccess` |ブール値 |いいえ |ロールに管理パネルへのアクセス権があるかどうか (デフォルト: false) |
| `permissions` |配列 |いいえ |権限オブジェクトの配列 |
| `canInteractWithAI` |ブール値 |いいえ |ロールが AI と対話できるかどうか (デフォルト: true) |
| `canUseChat` |ブール値 |いいえ |ロールがチャットを使用できるかどうか (デフォルト: true) |

## リクエストの例

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## 成功の応答

**ステータス コード**: `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `message` |文字列 |成功メッセージ |
| `role` |オブジェクト |作成されたロール オブジェクト |
| `role.id` |文字列 |一意のロール識別子 |
| `role.name` |文字列 |役割名 |
| `role.displayName` |文字列 |ロールの表示名 |
| `role.description` |文字列 |役割の説明 |
| `role.isSystem` |ブール値 |これがシステムの役割であるかどうか |
| `role.hasAdminPanelAccess` |ブール値 |ロールに管理パネルへのアクセス権があるかどうか |
| `role.permissions` |配列 |権限オブジェクトの配列 |
| `role.permissions[].section` |文字列 |許可セクション |
| `role.permissions[].level` |文字列 |許可レベル |
| `role.canInteractWithAI` |ブール値 |ロールが AI と対話できるかどうか |
| `role.canUseChat` |ブール値 |ロールがチャットを使用できるかどうか |
| `role.userCount` |整数 |このロールを持つユーザーの数 |
| `role.createdBy` |オブジェクト |ロールを作成したユーザー |
| `role.createdBy.id` |文字列 |作成者ユーザーID |
| `role.createdBy.name` |文字列 |作成者名 |
| `role.createdBy.email` |文字列 |作成者のメールアドレス |
| `role.createdAt` |文字列 |作成タイムスタンプ |

## 使用例

### JavaScript

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

### パイソン

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
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
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## 利用可能な権限セクション

|セクション |説明 |
|----------|---------------|
| `home` |ホームダッシュボードへのアクセス |
| `user-management` |ユーザー管理操作 |
| `index-management` |インデックス管理操作 |
| `analytics` |分析とレポート |
| `group-management` |グループ管理業務 |
| `integrations` |統合管理 |
| `services-status` |サービスステータスの監視 |
| `settings` |システム設定 |
| `announcements` |お知らせ管理 |
| `smltp-security` | SMLTP セキュリティ機能 |

## 利用可能な権限レベル

|レベル |説明 |
|------|-----------|
| `none` |セクションにアクセスできません |
| `reader` |セクションへの読み取り専用アクセス |
| `admin` |セクションへの完全な管理アクセス |

## 使用例

- **カスタム ロール**: 組織のニーズに合わせたロールを作成します
- **アクセス制御**: さまざまなユーザー タイプに特定の権限を定義します。
- **セキュリティ**: 最小特権アクセス原則を実装します。
- **コンプライアンス**: 規制要件を満たす役割を作成します
- **統合**: サードパーティ システム統合の役割を定義します。

## レート制限

- **デフォルト**: 1 分あたり 50 リクエスト
- **毎日**: 1 日あたり 5,000 リクエスト
- **毎月**: 毎月 150,000 件のリクエスト

## 注意事項

- **管理者のみ**: このエンドポイントには管理者権限が必要です
- **必須フィールド**: 名前、表示名、説明は必須です
- **権限の構造**: 権限はセクションとレベルのプロパティを持つオブジェクトです。
- **システム ロール**: カスタム ロールは決してシステム ロールではありません
- **フラット応答**: 応答はデータ オブジェクトの下にネストされていません
- **作成者情報**: ロールを作成した人を表示します。
- **ユーザー数**: 新しいロールの場合は 0 から始まります
- ロール名はシステム内で一意である必要があります
- ロールはユーザー割り当てにすぐに使用できるようになります