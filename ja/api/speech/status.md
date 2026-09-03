---
sidebar_position: 2
title: "S2S 時間ステータスの取得"
openapi: "GET /speech/s2s/status"
---
# S2S 時間ステータスを取得

請求ユーザーの現在の Speech-to-Speech (S2S) 時間ステータスを取得します。

## エンドポイント

```
GET /speech/s2s/status
```

## 説明

残り時間、月間制限合計、使用時間、更新情報など、請求ユーザーの現在の Speech-to-Speech (S2S) 時間ステータスを取得します。

### S2S 時間の割り当て

- クォータはユーザーのライセンス層に基づいています
- 時間はライセンスの割り当て日に基づいて毎月リセットされます
- 更新不可の試用版ライセンスは自動リセットされません

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## クエリパラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `user_id` |文字列 |いいえ |ステータスを確認するユーザー ID (デフォルトは API キー所有者) |

## リクエストの例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Remaining minutes:', data.remaining_minutes);
console.log('Total minutes:', data.total_minutes);
console.log('Used minutes:', data.used_minutes);
```

### パイソン

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Remaining minutes:', result['remaining_minutes'])
print('Total minutes:', result['total_minutes'])
print('Used minutes:', result['used_minutes'])
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "remaining_minutes": 38.2896,
  "total_minutes": 45,
  "used_minutes": 6.7104,
  "has_time_remaining": true,
  "next_renewal_date": "2025-12-01T12:55:35.721Z",
  "non_renewable": false,
  "request_id": "a8c307b4-c0c9-4b30-98db-5aced06c1cfe"
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に true |
| `remaining_minutes` |番号 |残りの S2S 時間 (分) |
| `total_minutes` |番号 | S2S の月間合計時間制限 |
| `used_minutes` |番号 |今月の S2S 使用時間 |
| `has_time_remaining` |ブール値 |ユーザーに S2S 時間が残っているかどうか |
| `next_renewal_date` |文字列\|null | S2S 時間割り当てがいつリセットされるか (更新不可のライセンスの場合は無効) |
| `non_renewable` |ブール値 |これが更新不可の試用版ライセンスであるかどうか |
| `request_id` |文字列 |追跡用のリクエスト ID |

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
}
```

### 401 不正

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 404 見つかりません

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 注意事項

- S2S セッションを開始する前にこのエンドポイントをチェックして、十分な時間が利用可能であることを確認してください
- `user_id` パラメータを使用すると、別のユーザーのステータスを確認できます (デフォルトは API キー所有者)
- 時間割り当てはユーザーのライセンス層に基づきます
- 更新不可の試用版ライセンスには `non_renewable: true` および `next_renewal_date: null` が含まれます