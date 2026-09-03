---
sidebar_position: 1
title: "음성-음성 WebRTC 세션 시작"
openapi: "POST /speech/s2s/webrtc"
---
# 음성-음성 WebRTC 세션 시작

OpenAI Realtime API를 사용하여 실시간 음성 간 대화를 위한 WebRTC 연결을 설정합니다.

## 엔드포인트

```
POST /speech/s2s/webrtc
```

## 설명

OpenAI Realtime API를 사용하여 실시간 음성 간 대화를 위한 WebRTC 연결을 설정합니다. 이 엔드포인트는 WebRTC SDP 제안을 수락하고 OpenAI의 Realtime API와 피어 연결을 설정하는 데 사용할 수 있는 SDP 응답을 반환합니다.

### 사용 흐름

1. 클라이언트는 WebRTC 제안(RTCPeerConnection.createOffer)을 생성합니다.
2. 클라이언트는 이 엔드포인트에 SDP 제안을 보냅니다.
3. 이 엔드포인트는 OpenAI Realtime API에 대한 제안을 프록시합니다.
4. 클라이언트는 SDP 응답을 수신하고 WebRTC 연결을 설정합니다.
5. 클라이언트는 AI와 실시간 음성 대화를 나눌 수 있습니다.

### S2S 시간 추적

- 각 사용자에게는 라이선스에 따라 월별 S2S 시간 할당량이 있습니다.
- 시간은 분 단위로 추적되며 세션이 기록될 때 차감됩니다.
- `/speech/s2s/status`을 이용하여 남은 시간을 확인하세요.
- `/speech/s2s/log-session`을 사용하여 세션 기간을 기록하고 시간을 공제합니다.

### SMLTP 통합

- 모든 요청은 보안 및 규정 준수를 위해 SMLTP를 통해 처리됩니다.
- 지정된 SMLTP 정책을 기반으로 모델 검증이 시행됩니다.
- 규정 준수 추적을 위해 요청을 감사하고 기록합니다.

## 인증

필수: API 키

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청 본문

| 매개변수 | 유형 | 필수 | 설명 |
|------------|------|----------|-------------|
| `sdp` | 문자열 | 예 | 클라이언트의 RTCPeerConnection에서 제공되는 WebRTC SDP |
| `model` | 문자열 | 아니요 | OpenAI 실시간 모델(기본값: "gpt-4o-mini-realtime-preview") |
| `voice` | 문자열 | 아니요 | AI 응답에 사용할 음성(기본값: "합금") |
| `smltp_policy` | 문자열 | 아니요 | SMLTP 정책(기본값: "내부") |
| `output_audio` | 부울 | 아니요 | 오디오 출력 활성화 여부(기본값: true) |
| `user_id` | 문자열 | 아니요 | 이 세션을 청구할 사용자 ID(기본값은 API 키 소유자) |
| `instructions` | 문자열 | 아니요 | AI 도우미를 위한 선택적 시스템 지침 |

### 사용 가능한 모델

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### 사용 가능한 음색

- `alloy` (기본값)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### 사용 가능한 SMLTP 정책

- `public`
- `internal` (기본값)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## 요청 예시

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

### 자바스크립트/Node.js

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

### 파이썬

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

## 응답

### 성공 응답 (200)

**콘텐츠 유형**: `application/sdp`

응답은 `RTCPeerConnection.setRemoteDescription()`과 함께 사용할 수 있는 SDP 응답 문자열입니다.

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## 오류 응답

### 400 잘못된 요청

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 금지됨

#### S2S 시간 제한에 도달했습니다.

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

#### 모델 검증 실패

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 내부 서버 오류

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## 메모

- SDP 제안은 유효한 WebRTC SDP 제안 문자열이어야 합니다.
- SDP 응답을 받은 후 이를 사용하여 RTCPeerConnection에 원격 설명을 설정하세요.
- `/speech/s2s/status`를 사용하여 세션을 시작하기 전에 S2S 시간 상태를 확인하십시오.
- `/speech/s2s/log-session`을 사용하여 완료 후 세션 기간을 기록합니다.
- 모든 요청은 보안 및 규정 준수를 위해 SMLTP를 통해 처리됩니다.
- `user_id` 매개변수를 사용하면 다른 사용자 계정으로 청구할 수 있습니다.