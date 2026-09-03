---
id: list
title: "役割のリスト"
sidebar_label: "役割のリスト"
description: "利用可能なすべてのユーザー役割を取得する"
openapi: "GET /roles"
---
# 役割をリストする

SecureAI システムで利用可能なすべてのユーザー ロールを取得します。

## エンドポイント

```
GET /roles
```

## 説明

このエンドポイントは、SecureAI システムで利用可能なすべてのユーザー ロールを返します。権限、説明、メタデータなど、各ロールに関する詳細情報が提供されます。これは、利用可能な役割とその機能を理解するのに役立ちます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `page` |整数 |いいえ | 1 |ページネーションのページ番号 (デフォルト: 1) |
| `limit` |整数 |いいえ | 20 |ページごとのロールの数 (デフォルト: 20) |
| `search` |文字列 |いいえ | - |名前、表示名、または説明の検索語 |
| `isSystem` |文字列 |いいえ | - |システムの役割によるフィルター (true/false) |
| `sortBy` |文字列 |いいえ |作成場所 |並べ替えの基準となるフィールド (デフォルト: "createdAt") |
| `sortOrder` |文字列 |いいえ |説明 |ソート順序 (asc/desc、デフォルト: "desc") |

## リクエストの例

```bash
GET /roles?page=1&limit=10&search=admin
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `roles` |配列 |ロールオブジェクトの配列 |
| `roles[].id` |文字列 |一意のロール識別子 |
| `roles[].name` |文字列 |役割名 |
| `roles[].displayName` |文字列 |ロールの表示名 |
| `roles[].description` |文字列 |役割の説明 |
| `roles[].isSystem` |ブール値 |これがシステムの役割であるかどうか |
| `roles[].hasAdminPanelAccess` |ブール値 |ロールに管理パネルへのアクセス権があるかどうか |
| `roles[].permissions` |配列 |権限オブジェクトの配列 |
| `roles[].permissions[].section` |文字列 |許可セクション |
| `roles[].permissions[].level` |文字列 |許可レベル |
| `roles[].canInteractWithAI` |ブール値 |ロールが AI と対話できるかどうか |
| `roles[].canUseChat` |ブール値 |ロールがチャットを使用できるかどうか |
| `roles[].userCount` |整数 |このロールを持つユーザーの数 |
| `roles[].createdBy` |オブジェクト |ロールを作成したユーザー |
| `roles[].createdBy.id` |文字列 |作成者ユーザーID |
| `roles[].createdBy.name` |文字列 |作成者名 |
| `roles[].createdBy.email` |文字列 |作成者のメールアドレス |
| `roles[].createdAt` |文字列 |作成タイムスタンプ |
| `roles[].updatedAt` |文字列 |最終更新タイムスタンプ |
| `pagination` |オブジェクト |ページネーション情報 |
| `pagination.page` |整数 |現在のページ番号 |
| `pagination.limit` |整数 |ページごとの項目 |
| `pagination.total` |整数 |ロールの総数 |
| `pagination.pages` |整数 |総ページ数 |

## 使用例

### JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

### パイソン

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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

- **ロール管理**: ユーザー割り当てに使用可能なすべてのロールをリストします。
- **権限の確認**: 各役割にどのような権限があるかを理解します。
- **アクセス制御**: 利用可能な役割に基づいてユーザー アクセスを計画します。
- **ユーザー割り当て**: ニーズに基づいてユーザーに役割を割り当てます。
- **ロール分析**: ロールの使用状況とユーザー分布を分析します。

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者権限が必要です
- ページベースのページネーション: オフセットではなくページパラメータを使用します。
- 検索: 名前、表示名、および説明フィールドを検索します。
- システム ロール: システム ロールとカスタム ロールでフィルタリングできます。
- 並べ替え: 任意のフィールドで昇順または降順に並べ替えることができます
- フラットな応答: 応答はデータ オブジェクトの下にネストされていません
- ユーザー数: 各ロールを持つユーザーの数を示します。
- 作成者情報: 各ロールの作成者を表示します。