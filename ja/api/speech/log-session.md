---
sidebar_position: 3
title: "S2S セッション期間をログに記録する"
openapi: "POST /speech/s2s/log-session"
---
# S2S セッション期間をログに記録します

完了した Speech-to-Speech セッションの継続時間を記録し、その時間をユーザーの S2S 時間割り当てから差し引きます。

## エンドポイント

```
POST /speech/s2s/log-session
```

## 説明

完了した Speech-to-Speech セッションの継続時間を記録し、その時間をユーザーの S2S 時間割り当てから差し引きます。使用状況を正確に追跡するには、セッションの終了後にこれを呼び出す必要があります。

### 使用状況の追跡

- 期間はミリ秒単位で指定します
- 自動的に分に変換され、ユーザーの割り当てから差し引かれます
- 時間はライセンス層に基づいてユーザーごとに追跡されます
- アクティビティ ログは監査目的で作成されます。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `durationMs` |整数 |はい |ミリ秒単位のセッション継続時間 (最小: 0) |
| `user_id` |文字列 |いいえ |このセッションの請求先となるユーザー ID (デフォルトは API キー所有者) |

## リクエストの例

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "durationMs": 42624,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
  }'
```

### JavaScript/Node.js

```javascript
// Calculate session duration in milliseconds
const sessionStartTime = Date.now();
// ... session happens ...
const sessionEndTime = Date.now();
const durationMs = sessionEndTime - sessionStartTime;

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    durationMs: durationMs,
    user_id: '60a7c8f5e8b4f5001f7a8c23'
  })
});

const data = await response.json();
console.log('Session logged:', data.message);
```

### パイソン

```python
import requests
import time

# Calculate session duration
session_start = time.time() * 1000  # Convert to milliseconds
# ... session happens ...
session_end = time.time() * 1000
duration_ms = int(session_end - session_start)

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "durationMs": duration_ms,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Session logged:', result['message'])
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に true |
| `message` |文字列 |成功メッセージ |
| `request_id` |文字列 |追跡用のリクエスト ID |

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
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

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## 注意事項

- 使用状況を正確に追跡するために、各 S2S セッションの終了後にこのエンドポイントを呼び出します
- 期間は、WebRTC 接続が確立されてから閉じられるまで計算する必要があります。
- 時間は自動的にミリ秒から分に変換され、ユーザーの割り当てから差し引かれます。
- `user_id` パラメータにより、別のユーザー アカウントへの請求が可能になります
- 監査目的でアクティビティ ログが自動的に作成されます
- セッションを開始する前に十分な時間が残っていることを確認してください (`/speech/s2s/status` で確認してください)