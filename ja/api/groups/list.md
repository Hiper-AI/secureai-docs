---
id: list
title: "リストグループ"
sidebar_label: "リストグループ"
description: "すべてのユーザーグループを取得する"
openapi: "GET /groups"
---
# グループをリストする

ページネーションとフィルタリングのオプションを使用して、システム内のすべてのユーザー グループのリストを取得します。

## エンドポイント

```
GET /groups
```

## 説明

このエンドポイントは、SecureAI システムで利用可能なすべてのユーザー グループを返します。メンバー、権限、メタデータなど、各グループに関する詳細情報が提供されます。これは、ユーザー アクセスと組織構造を管理するのに役立ちます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `page` |整数 |いいえ | 1 |ページネーションのページ番号 |
| `limit` |整数 |いいえ | 20 |ページごとのグループ数 (1 ～ 100) |
| `search` |文字列 |いいえ | - |グループ名または説明の検索語 |
| `status` |文字列 |いいえ | - |グループのステータスでフィルターする |
| `sortBy` |文字列 |いいえ |作成場所 |並べ替えるフィールド |
| `sortOrder` |文字列 |いいえ |説明 |ソート順 (昇順、降順) |

## リクエストの例

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `groups[]` |配列 |グループオブジェクトの配列 |
| `groups[].id` |文字列 |一意のグループ識別子 |
| `groups[].name` |文字列 |グループ名 |
| `groups[].description` |文字列 |グループの説明 |
| `groups[].status` |文字列 |グループステータス |
| `groups[].userCount` |整数 |グループ内のユーザーの数 |
| `groups[].users` |配列 |グループ内のユーザー オブジェクトの配列 |
| `groups[].users[].id` |文字列 |ユーザーID |
| `groups[].users[].name` |文字列 |ユーザー名 |
| `groups[].users[].email` |文字列 |ユーザーのメールアドレス |
| `groups[].createdAt` |文字列 |作成タイムスタンプ |
| `pagination` |オブジェクト |ページネーション情報 |

## 使用例

### JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

### パイソン

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

## フィルタリングの例

### グループの検索

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### 並べ替えオプション

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### ページネーション

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## 使用例

- **グループ管理**: 管理目的ですべてのグループをリストします。
- **ユーザー組織**: ユーザー割り当てに使用可能なグループを検出します
- **アクセス制御**: グループの権限とメンバー数を確認します。
- **レポート**: グループの構造とメンバーシップに関するレポートを生成します。
- **統合**: アプリケーション統合のためのグループを検出します

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者のみがアクセスできます
- ページネーション: オフセットではなくページパラメータを使用します。
- フラットな応答: 応答はデータ オブジェクトの下にネストされていません
- ユーザーの詳細: 各グループ メンバーの完全なユーザー情報が含まれます
- ステータスフィルター: グループステータスでフィルターできます。
- 検索機能はグループ名と説明全体で機能します
- 並べ替えオプションは、さまざまな基準に基づいて結果を整理するのに役立ちます