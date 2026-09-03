---
id: active
title: "アクティブな SMLTP ポリシー"
sidebar_label: "アクティブな SMLTP ポリシー"
description: "現在アクティブな SMLTP ポリシーを取得します"
openapi: "GET /smltp-policies/active"
---
# アクティブな SMLTP ポリシー

アカウントの現在アクティブな SMLTP (Secure Model Language Transfer Protocol) ポリシーを取得します。

## エンドポイント

```
GET /smltp-policies/active
```

## 説明

現在アクティブな SMLTP ポリシー構成を取得します。 **管理者のみのアクセスが必要です。**

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## リクエストの例

```bash
GET /smltp-policies/active
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `data` |オブジェクト |応答データ オブジェクト |
| `data.template` |文字列 |現在アクティブなポリシー テンプレート ID |
| `data.policy` |オブジェクト |現在のポリシー構成オブジェクト |
| `data.lastUpdated` |文字列 |最終更新タイムスタンプ |

## 使用例

### JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

### パイソン

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
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

- **ポリシーのレビュー**: 現在アクティブなポリシー テンプレートを確認します。
- **構成チェック**: 現在のポリシー構成を確認します。
- **テンプレート管理**: どのポリシー テンプレートが使用されているかを理解する
- **トラブルシューティング**: 現在のポリシー設定を理解する
- **監査の準備**: コンプライアンス監査のアクティブなポリシーを確認します。

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者権限が必要です
- 単一ポリシー: 現在アクティブなポリシー テンプレートと構成を返します。
- 配列なし: ポリシーの配列は返されず、アクティブなポリシーのみが返されます。
- テンプレート ID: 現在アクティブなポリシー テンプレートを表示します。
- ポリシー構成: 実際のポリシー構成オブジェクトを返します。
- ネストされた応答: 応答はデータ オブジェクトの下にネストされます。