---
sidebar_position: 2
title: "获取S2S时间状态"
openapi: "GET /speech/s2s/status"
---
# 获取S2S时间状态

检索计费用户当前的语音到语音 (S2S) 时间状态。

## 端点

```
GET /speech/s2s/status
```

## 说明

检索计费用户当前的 S2S 时间状态，包括剩余时间、每月总限额、已使用时间和续订信息。

### S2S 时间配额

- 配额基于用户的许可级别
- 时间根据许可证分配日期每月重置
- 不可续订的试用许可证不会自动重置

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 查询参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `user_id` |字符串|没有 |用于检查状态的用户 ID（默认为 API 密钥所有者）|

## 请求示例

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

###Python

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

## 回应

### 成功响应 (200)

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

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |对于成功的请求始终如此 |
| `remaining_minutes` |数量 |剩余 S2S 时间（分钟）|
| `total_minutes` |数量 |每月 S2S 总时限 |
| `used_minutes` |数量 |本月使用S2S时间|
| `has_time_remaining` |布尔 |用户是否还有剩余S2S时间 |
| `next_renewal_date` |字符串\|空| S2S 时间配额何时重置（不可续订许可证为空）|
| `non_renewable` |布尔 |这是否是不可续订的试用许可证 |
| `request_id` |字符串|请求 ID 进行跟踪 |

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 未找到

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 注释

- 在启动 S2S 会话之前检查此端点以确保有足够的时间可用
- `user_id` 参数允许检查不同用户的状态（默认为 API 密钥所有者）
- 时间配额基于用户的许可级别
- 不可续订的试用许可证将具有 `non_renewable: true` 和 `next_renewal_date: null`