---
id: audit-logs
title: "監査ログ"
sidebar_label: "監査ログ"
description: "SMLTP監査ログの取得"
openapi: "GET /audit-logs"
---
# 監査ログ

セキュリティの監視とコンプライアンスのために SMLTP (Secure Model Language Transfer Protocol) 監査ログを取得します。

## エンドポイント

```
GET /audit-logs
```

## 説明

このエンドポイントは、セキュリティ イベント、ポリシー違反、コンプライアンス活動を追跡する SMLTP 監査ログを返します。これは、セキュリティ監視、コンプライアンス監査、セキュリティ インシデントの調査に役立ちます。

## 認証

**必須**: 管理者権限を持つ API キー

```
Authorization: Bearer sk-your-api-key-here
```

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `page` |整数 |いいえ | 1 |ページネーションのページ番号 (デフォルト: 1) |
| `limit` |整数 |いいえ | 50 |ページごとのログの数 (デフォルト: 50) |
| `startDate` |文字列 |いいえ | - |フィルタリングの開始日 (ISO 8601 形式) |
| `endDate` |文字列 |いいえ | - |フィルタリングの終了日 (ISO 8601 形式) |
| `type` |文字列 |いいえ | - |ログの種類でフィルターする |
| `severity` |文字列 |いいえ | - |重大度レベルでフィルターする |
| `userId` |文字列 |いいえ | - |ユーザー ID によるフィルター |
| `search` |文字列 |いいえ | - |説明またはメタデータの検索語 |

## リクエストの例

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## 成功の応答

**ステータス コード**: `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |操作が成功したかどうかを示します。
| `data` |オブジェクト |応答データ オブジェクト |
| `data.logs` |配列 |監査ログ オブジェクトの配列 |
| `data.logs[].id` |文字列 |一意の監査ログ識別子 |
| `data.logs[].timestamp` |文字列 |ログのタイムスタンプ (ISO 8601) |
| `data.logs[].type` |文字列 |監査イベントの種類 |
| `data.logs[].severity` |文字列 |重大度レベル |
| `data.logs[].description` |文字列 |イベントの説明 |
| `data.logs[].user` |オブジェクト |ユーザー情報 (入手可能な場合) |
| `data.logs[].user.id` |文字列 |ユーザーID |
| `data.logs[].user.name` |文字列 |ユーザー名 |
| `data.logs[].user.email` |文字列 |ユーザーのメールアドレス |
| `data.logs[].metadata` |オブジェクト |追加のメタデータ |
| `data.logs[].complianceCategory` |文字列 |コンプライアンスカテゴリ |
| `data.logs[].outcome` |文字列 |イベントの結果 |
| `data.pagination` |オブジェクト |ページネーション情報 |
| `data.pagination.page` |整数 |現在のページ番号 |
| `data.pagination.limit` |整数 |ページごとの項目 |
| `data.pagination.total` |整数 |ログの総数 |
| `data.pagination.pages` |整数 |総ページ数 |
| `data.dateRange` |オブジェクト |日付範囲情報 |

## 使用例

### JavaScript

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

### パイソン

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
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

### 期間

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### イベントのフィルタリング

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### ユーザーのフィルタリング

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## 使用例

- **セキュリティ監視**: セキュリティ イベントとポリシー違反を監視します。
- **コンプライアンス監査**: コンプライアンス活動と違反を追跡します。
- **インシデント調査**: セキュリティ インシデントと侵害を調査します。
- **ポリシー分析**: ポリシーの有効性と施行を分析します。
- **ユーザー アクティビティ**: ユーザー アクションと API 使用状況を追跡します。

## レート制限

- **デフォルト**: 1 分あたり 100 リクエスト
- **毎日**: 1 日あたり 10,000 リクエスト
- **毎月**: 毎月 300,000 件のリクエスト

## 注意事項

- このエンドポイントには管理者権限が必要です
- ページネーション: オフセットではなくページパラメータを使用します。
- 日付範囲: 日付が指定されていない場合、デフォルトで過去 7 日間になります。
- 検索: 説明フィールドとメタデータ操作フィールドを検索します。
- ネストされた応答: 応答はデータ オブジェクトの下にネストされます。
- ユーザー情報: ユーザー情報は利用可能な場合に入力されます。
- ログはコンプライアンスの目的で保存されます