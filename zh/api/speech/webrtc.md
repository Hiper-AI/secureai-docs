---
sidebar_position: 1
title: "启动语音到语音 WebRTC 会话"
openapi: "POST /speech/s2s/webrtc"
---
# 启动语音到语音 WebRTC 会话

使用 OpenAI Realtime API 建立用于实时语音到语音对话的 WebRTC 连接。

## 端点

```
POST /speech/s2s/webrtc
```

## 说明

使用 OpenAI Realtime API 建立用于实时语音到语音对话的 WebRTC 连接。该端点接受 WebRTC SDP 提议并返回 SDP 应答，该应答可用于与 OpenAI 的实时 API 建立对等连接。

### 使用流程

1. 客户端创建WebRTC报价（RTCPeerConnection.createOffer）
2. 客户端将 SDP Offer 发送到该端点
3. 该端点代理 OpenAI Realtime API 的报价
4. 客户端收到SDP应答并建立WebRTC连接
5. 客户可以与AI进行实时语音对话

### S2S时间追踪

- 每个用户都有基于其许可证的每月 S2S 时间配额
- 时间以分钟为单位进行跟踪，并在记录会话时扣除
- 使用`/speech/s2s/status`查看剩余时间
- 使用`/speech/s2s/log-session`记录会话持续时间并扣除时间

### SMLTP 集成

- 所有请求均通过 SMLTP 处理，以确保安全性和合规性
- 根据指定的 SMLTP 策略强制执行模型验证
- 审核并记录请求以进行合规性跟踪

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `sdp` |字符串|是的 |来自客户端的 RTCPeerConnection 的 WebRTC SDP 报价 |
| `model` |字符串|没有 | OpenAI 实时模型（默认：“gpt-4o-mini-realtime-preview”）|
| `voice` |字符串|没有 |用于 AI 响应的语音（默认：“合金”）|
| `smltp_policy` |字符串|没有 | SMLTP 策略（默认：“内部”）|
| `output_audio` |布尔 |没有 |是否启用音频输出（默认：true）|
| `user_id` |字符串|没有 |将此会话记入帐单的用户 ID（默认为 API 密钥所有者）|
| `instructions` |字符串|没有 | AI助手可选系统说明|

### 可用型号

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### 可用的声音

- `alloy`（默认）
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### 可用的 SMLTP 策略

- `public`
- `internal`（默认）
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## 请求示例

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": true,
    "instructions": "You are a helpful customer service agent."
  }'
```

### JavaScript/Node.js

```javascript
// Create WebRTC peer connection
const pc = new RTCPeerConnection();

// Create offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// Send SDP offer to SecureAI
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sdp: offer.sdp,
    model: 'gpt-4o-mini-realtime-preview',
    voice: 'alloy',
    smltp_policy: 'internal',
    output_audio: true,
    instructions: 'You are a helpful customer service agent.'
  })
});

// Get SDP answer
const sdpAnswer = await response.text();

// Set remote description
await pc.setRemoteDescription(new RTCSessionDescription({
  type: 'answer',
  sdp: sdpAnswer
}));

// Now you can have real-time voice conversations
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": True,
    "instructions": "You are a helpful customer service agent."
}

response = requests.post(url, headers=headers, json=data)
sdp_answer = response.text
print('SDP Answer:', sdp_answer)
```

## 回应

### 成功响应 (200)

**内容类型**：`application/sdp`

响应是一个 SDP 应答字符串，可与 `RTCPeerConnection.setRemoteDescription()` 一起使用。

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 禁止

#### S2S 已达到时间限制

```json
{
  "success": false,
  "error": "S2S time limit reached",
  "message": "Insufficient S2S time remaining for this user",
  "remaining_minutes": 0,
  "next_renewal_date": "2024-12-01T12:55:35.721Z",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

#### 模型验证失败

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 内部服务器错误

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## 注释

- SDP优惠必须是有效的WebRTC SDP优惠字符串
- 收到 SDP 应答后，用它来设置 RTCPeerConnection 上的远程描述
- 使用 `/speech/s2s/status` 启动会话之前检查 S2S 时间状态
- 使用 `/speech/s2s/log-session` 完成后记录会话持续时间
- 所有请求均通过 SMLTP 处理，以确保安全性和合规性
- `user_id` 参数允许向不同的用户帐户计费