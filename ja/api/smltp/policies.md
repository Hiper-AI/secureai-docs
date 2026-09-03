---
id: policies
title: "SMLTP ポリシー"
sidebar_label: "SMLTP ポリシー"
description: "すべての SMLTP セキュリティ ポリシーを取得する"
openapi: "GET /smltp-policies/all"
---
# SMLTP ポリシー

利用可能なすべての SMLTP (Secure Model Language Transfer Protocol) セキュリティ ポリシーを取得します。

## エンドポイント

```
GET /smltp-policies/all
```

## 説明

組み込みポリシーやカスタム ポリシーを含む、利用可能なすべての SMLTP ポリシーを取得します。 **管理者のみのアクセスが必要です。**

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
❌ クエリ パラメータはサポートされていません - 実際の API はクエリ パラメータを受け入れません。

## リクエストの例

```bash
GET /smltp-policies/all
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `data` |オブジェクト |応答データ オブジェクト |
| `data.builtInPolicies` |配列 |組み込みポリシー オブジェクトの配列 |
| `data.customPolicies` |配列 |カスタム ポリシー オブジェクトの配列 |
| `data.activePolicyTemplate` |文字列 |現在アクティブなポリシー テンプレート ID |
| `data.summary` |オブジェクト |概要統計 |
| `data.summary.totalPolicies` |整数 |ポリシーの総数 |
| `data.summary.builtInCount` |整数 |組み込みポリシーの数 |
| `data.summary.customCount` |整数 |カスタム ポリシーの数 |

## 使用例

### JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

### パイソン

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
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

## ポリシーオブジェクトフィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `id` |文字列 |ポリシー識別子 |
| `name` |文字列 |ポリシー名 |
| `type` |文字列 |ポリシーの種類 (「組み込み」または「カスタム」) |
| `description` |文字列 |ポリシーの説明 |
| `isActive` |ブール値 |このポリシーが現在アクティブかどうか |
| `createdAt` |文字列 |作成タイムスタンプ (カスタム ポリシーのみ) |

## 使用例

- **ポリシーの検出**: 利用可能なセキュリティ ポリシーを検索します。
- **コンプライアンス計画**: ポリシー要件を理解する
- **セキュリティ構成**: 適切なポリシーを選択します
- **アクティブなポリシー管理**: 現在アクティブなポリシーを確認します
- **統合**: チャット完了にポリシーを適用します

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者権限が必要です
- パラメーターなし: クエリ パラメーターはサポートされていません。
- 組み込みポリシー: 事前定義されたシステム ポリシーを返します。
- カスタム ポリシー: カスタム ポリシーが存在する場合は返します。
- アクティブなポリシー: 現在アクティブなポリシー テンプレートを表示します。
- フラットな応答: 応答はデータ オブジェクトの下にネストされます