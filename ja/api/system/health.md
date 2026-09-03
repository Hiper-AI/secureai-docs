---
sidebar_position: 1
title: "健康診断"
openapi: "GET /health"
---
# 健康診断

API が実行中で正常であるかどうかを確認します。認証は必要ありません。

## エンドポイント

```
GET /health
```

## 説明

このエンドポイントを使用すると、SecureAI 外部 API が実行されており、正常であることを確認できます。このエンドポイントには認証は必要ありません。

## リクエスト

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 応答フィールド

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `success` |ブール値 |ヘルスチェックが成功した場合は常に true | `true` |
| `status` |文字列 | API の健全性ステータス | `"healthy"` |
| `timestamp` |文字列 | ISO 8601 形式の現在のサーバーのタイムスタンプ | `"2024-01-15T10:30:00.000Z"` |
| `version` |文字列 |現在の API バージョン | `"1.0.0"` |

## 使用例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

### パイソン

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## 注意事項

- このエンドポイントは認証を必要としません
- このエンドポイントを使用して API の可用性を監視します
- 応答には、互換性チェックのための現在の API バージョンが含まれます