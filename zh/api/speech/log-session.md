---
sidebar_position: 3
title: "记录 S2S 会话持续时间"
openapi: "POST /speech/s2s/log-session"
---
# 记录 S2S 会话持续时间

记录已完成的语音到语音会话的持续时间，并从用户的 S2S 时间配额中扣除该时间。

## 端点

```
POST /speech/s2s/log-session
```

## 说明

记录已完成的语音到语音会话的持续时间，并从用户的 S2S 时间配额中扣除该时间。应在会话结束后调用此函数以准确跟踪使用情况。

### 使用情况跟踪

- 持续时间以毫秒为单位指定
- 自动转换为分钟并从用户配额中扣除
- 根据许可证级别跟踪每个用户的时间
- 出于审计目的而创建活动日志

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `durationMs` |整数 |是的 |会话持续时间（以毫秒为单位）（最小值：0）|
| `user_id` |字符串|没有 |将此会话记入帐单的用户 ID（默认为 API 密钥所有者）|

## 请求示例

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

###Python

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

## 回应

### 成功响应 (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求始终如此 |
| `message` |字符串|成功留言|
| `request_id` |字符串|请求 ID 进行跟踪 |

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## 注释

- 每个S2S会话结束后调用此端点以准确跟踪使用情况
- 持续时间应从 WebRTC 连接建立到关闭计算
- 时间自动从毫秒转换为分钟并从用户配额中扣除
- `user_id` 参数允许向不同的用户帐户计费
- 出于审计目的自动创建活动日志
- 确保在开始会话之前有足够的剩余时间（检查`/speech/s2s/status`）