---
id: licenses-availability
title: "ライセンスの利用可能性"
sidebar_label: "ライセンスの利用可能性"
description: "現在のライセンス プールの制限、使用量、残りを取得する (管理者のみ)"
openapi: "GET /licenses/availability"
---
# ライセンスの利用可能性

各層のライセンス プールの制限、現在の使用量、残りのライセンスを取得します。

## エンドポイント

```
GET /licenses/availability
```

## 説明

すべてのライセンス層のライセンス プールのステータス (制限、現在の使用量、残りの容量など) を返します。管理者専用のエンドポイント。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## リクエスト

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `limits` |オブジェクト |ライセンス プールの構成された層ごとの制限 |
| `usage` |オブジェクト |階層ごとに現在割り当てられている/使用されているライセンス |
| `remaining` |オブジェクト |階層ごとの残りのライセンス |

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

## 注意事項

- 管理者専用エンドポイント
- その層にプール制限が適用されていない場合、残りは `Infinity` として報告される場合があります
- 値は組織全体の集計です