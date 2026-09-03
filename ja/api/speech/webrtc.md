---
sidebar_position: 1
title: "Speech-to-Speech WebRTC セッションの開始"
openapi: "POST /speech/s2s/webrtc"
---
# Speech-to-Speech WebRTC セッションを開始する

OpenAI Realtime API を使用して、リアルタイムのスピーチツースピーチ会話のための WebRTC 接続を確立します。

## エンドポイント

```
POST /speech/s2s/webrtc
```

## 説明

OpenAI Realtime API を使用して、リアルタイムのスピーチツースピーチ会話のための WebRTC 接続を確立します。このエンドポイントは WebRTC SDP オファーを受け入れ、OpenAI の Realtime API とのピア接続を確立するために使用できる SDP アンサーを返します。

### 利用の流れ

1. クライアントが WebRTC オファー (RTCPeerConnection.createOffer) を作成します。
2. クライアントは SDP オファーをこのエンドポイントに送信します
3. このエンドポイントは、OpenAI Realtime API へのオファーをプロキシします。
4. クライアントは SDP 応答を受信し、WebRTC 接続を確立します
5. クライアントは AI とリアルタイムで音声会話できるようになります

### S2S 時間追跡

- 各ユーザーには、ライセンスに基づいて毎月の S2S 時間割り当てがあります。
- 時間は分単位で追跡され、セッションが記録されるときに差し引かれます
- `/speech/s2s/status`を使用して残り時間を確認します
- `/speech/s2s/log-session` を使用してセッション期間を記録し、時間を差し引きます

### SMLTP の統合

- セキュリティとコンプライアンスのために、すべてのリクエストは SMLTP を通じて処理されます
- モデル検証は、指定された SMLTP ポリシーに基づいて強制されます。
- リクエストは監査され、コンプライアンス追跡のために記録されます。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `sdp` |文字列 |はい |クライアントの RTCPeerConnection からの WebRTC SDP オファー |
| `model` |文字列 |いいえ | OpenAI リアルタイム モデル (デフォルト: "gpt-4o-mini-realtime-preview") |
| `voice` |文字列 |いいえ | AI応答に使用する音声（デフォルト：「合金」） |
| `smltp_policy` |文字列 |いいえ | SMLTP ポリシー (デフォルト: "内部") |
| `output_audio` |ブール値 |いいえ |オーディオ出力を有効にするかどうか (デフォルト: true) |
| `user_id` |文字列 |いいえ |このセッションの請求先となるユーザー ID (デフォルトは API キー所有者) |
| `instructions` |文字列 |いいえ | AI アシスタントのオプションのシステム命令 |

### 利用可能なモデル

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### 利用可能な音声

- `alloy` (デフォルト)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### 利用可能な SMLTP ポリシー

- `public`
- `internal` (デフォルト)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## リクエストの例

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

### パイソン

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

## 応答

### 成功の応答 (200)

**コンテンツ タイプ**: `application/sdp`

応答は、`RTCPeerConnection.setRemoteDescription()` で使用できる SDP 応答文字列です。

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 禁止

#### S2S 制限時間に達しました

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

#### モデルの検証に失敗しました

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## 注意事項

- SDP オファーは有効な WebRTC SDP オファー文字列である必要があります
- SDP 回答を受信したら、それを使用して RTCPeerConnection にリモートの説明を設定します。
- `/speech/s2s/status` を使用してセッションを開始する前に S2S 時間ステータスを確認します
- `/speech/s2s/log-session` を使用して完了後のセッション期間をログに記録します
- セキュリティとコンプライアンスのために、すべてのリクエストは SMLTP を通じて処理されます
- `user_id` パラメータにより、別のユーザー アカウントへの請求が可能になります