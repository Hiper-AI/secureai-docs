---
sidebar_position: 3
title: "セキュリティポリシー"
openapi: "GET /smltp-policies"
---
# セキュリティポリシーを取得する

利用可能な SMLTP (Secure Model Language Transfer Protocol) セキュリティ ポリシーを取得します。

## エンドポイント

```
GET /smltp-policies
```

## 説明

利用可能な SMLTP (Secure Model Language Transfer Protocol) セキュリティ ポリシーを取得します。これらのポリシーは、データの処理方法と保護方法を決定します。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `success` |ブール値 |リクエストが成功した場合は常に true | `true` |
| `policies` |配列 |利用可能なセキュリティ ポリシーのリスト |例を参照 |
| `restrictions` |オブジェクト |ポリシーのアクセス制限 |例を参照 |

### ポリシーオブジェクト

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `id` |文字列 |一意のポリシー識別子 | `"internal"` |
| `name` |文字列 |ポリシー表示名 | `"Internal"` |
| `description` |文字列 |ポリシーの説明 | `"For internal company data"` |

### 制限対象

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `allowed_policies` |配列 |許可されたポリシー ID の配列 | `["public", "internal", "confidential"]` |

## エラー応答

### 401 不正

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## 使用例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

### パイソン

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## ポリシーの種類

### パブリック
- **ユースケース**: 公開された非機密データ
- **セキュリティ レベル**: 低
- **データ処理**: 基本的なセキュリティを備えた標準処理

### 内部
- **使用例**: 社内データ
- **セキュリティ レベル**: 中
- **データ処理**: 追加の保護手段によるセキュリティの強化

### 機密
- **ユースケース**: 機密のビジネスデータ
- **セキュリティ レベル**: 高
- **データ処理**: 厳密なデータ処理による最大限のセキュリティ

## 注意事項

- データの機密性に基づいて適切なポリシーを選択します
- ポリシーはデータの処理方法と保護方法に影響します
- チャット完了リクエストでポリシー ID を使用する
- 一部のポリシーはアカウントの種類に基づいて制限される場合があります