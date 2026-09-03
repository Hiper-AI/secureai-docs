---
id: create
title: "SMLTP ポリシーの作成"
sidebar_label: "SMLTP ポリシーの作成"
description: "新しい SMLTP セキュリティ ポリシーを作成する"
openapi: "POST /smltp-policies/active"
---
# SMLTP ポリシーを作成する

アカウントに新しい SMLTP (Secure Model Language Transfer Protocol) セキュリティ ポリシーを作成します。

## エンドポイント

```
POST /smltp-policies
```

## 説明

新しいカスタム SMLTP ポリシーを作成します。管理者のみのアクセスが必要です。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `name` |文字列 |はい |ポリシー名 |
| `description` |文字列 |はい |ポリシーの説明 |
| `policy` |オブジェクト |はい |ポリシー構成オブジェクト |
| `setAsActive` |ブール値 |いいえ |このポリシーをすぐにアクティブとして設定するかどうか (デフォルト: false)。

## リクエストの例

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## 成功の応答

**ステータス コード**: `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `message` |文字列 |成功メッセージ |
| `policy` |オブジェクト |作成されたポリシー オブジェクト |
| `policy.id` |文字列 |ポリシー識別子 (名前から生成) |
| `policy.name` |文字列 |ポリシー名 |
| `policy.description` |文字列 |ポリシーの説明 |
| `policy.type` |文字列 |ポリシーの種類 (「カスタム」) |
| `policy.isActive` |ブール値 |ポリシーが現在アクティブかどうか |
| `policy.createdAt` |文字列 |作成タイムスタンプ |

## 使用例

### JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

### パイソン

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
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
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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

- **カスタム セキュリティ**: ニーズに合わせたポリシーを作成します
- **コンプライアンス**: 特定の規制要件を実装します。
- **リスク管理**: リスクを軽減するためのセキュリティ対策を定義します。
- **データ保護**: プライバシーとデータの取り扱いルールを確立します。
- **ポリシー管理**: カスタム SMLTP ポリシーを作成および管理します。

## レート制限

- **デフォルト**: 1 分あたり 50 リクエスト
- **毎日**: 1 日あたり 5,000 リクエスト
- **毎月**: 毎月 150,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者権限が必要です
- 必須フィールド: 名前、説明、ポリシーは必須です
- ポリシー ID: 名前から生成 (小文字、スペースの場合はハイフン)
- 一意の名前: ポリシー名は一意である必要があります。
- アクティブに設定: オプションですぐにアクティブに設定できます。
- フラットな応答: 応答はデータ オブジェクトの下にネストされていません