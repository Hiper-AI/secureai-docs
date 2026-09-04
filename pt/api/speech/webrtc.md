---
sidebar_position: 1
title: "Sessão WebRTC Speech-to-Speech"
openapi: "POST /speech/s2s/webrtc"
sidebar_label: "Sessão WebRTC (S2S)"
---

# Iniciar sessão WebRTC de fala para fala

Estabeleça uma conexão WebRTC para conversas de voz em tempo real usando a API OpenAI Realtime.

## Ponto final

```
POST /speech/s2s/webrtc
```

## Descrição

Estabelece uma conexão WebRTC para conversas de fala em voz em tempo real usando a API OpenAI Realtime. Este endpoint aceita uma oferta WebRTC SDP e retorna uma resposta SDP que pode ser usada para estabelecer uma conexão peer com a API Realtime da OpenAI.

### Fluxo de uso

1. O cliente cria uma oferta WebRTC (RTCPeerConnection.createOffer)
2. O cliente envia a oferta SDP para este endpoint
3. Este endpoint faz proxy da oferta para OpenAI Realtime API
4. O cliente recebe resposta SDP e estabelece conexão WebRTC
5. O cliente pode então ter conversas de voz em tempo real com a IA

### Rastreamento de tempo S2S

- Cada usuário tem uma cota mensal de tempo S2S com base em sua licença
- O tempo é monitorado em minutos e deduzido quando as sessões são registradas
- Use `/speech/s2s/status` para verificar o tempo restante
- Use `/speech/s2s/log-session` para registrar a duração da sessão e deduzir o tempo

### SMLTP Integração

- Todas as solicitações são processadas através de SMLTP para segurança e conformidade
- A validação do modelo é aplicada com base na política SMLTP especificada
- As solicitações são auditadas e registradas para rastreamento de conformidade

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `sdp` | corda | Sim | Oferta WebRTC SDP do RTCPeerConnection do cliente |
| `model` | corda | Não | Modelo OpenAI Realtime (padrão: "gpt-4o-mini-realtime-preview") |
| `voice` | corda | Não | Voz a ser usada para resposta de IA (padrão: "alloy") |
| `smltp_policy` | corda | Não | Política SMLTP (padrão: "interna") |
| `output_audio` | booleano | Não | Se a saída de áudio deve ser habilitada (padrão: true) |
| `user_id` | corda | Não | ID do usuário para cobrar esta sessão (o padrão é o proprietário da chave de API) |
| `instructions` | corda | Não | Instruções opcionais do sistema para o assistente de IA |

### Modelos Disponíveis

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### Vozes disponíveis

- `alloy` (padrão)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### Políticas SMLTP disponíveis

- `public`
- `internal` (padrão)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## Exemplo de solicitação

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

###JavaScript/Node.js

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

###Píton

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

## Resposta

### Resposta de sucesso (200)

**Tipo de conteúdo**: `application/sdp`

A resposta é uma string de resposta SDP que pode ser usada com `RTCPeerConnection.setRemoteDescription()`.

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 Proibido

#### Limite de tempo S2S atingido

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

#### Falha na validação do modelo

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## Notas

- A oferta SDP deve ser uma string de oferta WebRTC SDP válida
- Após receber a resposta SDP, use-a para definir a descrição remota em seu RTCPeerConnection
- Verifique o status do horário S2S antes de iniciar sessões usando `/speech/s2s/status`
- Registrar a duração da sessão após a conclusão usando `/speech/s2s/log-session`
- Todas as solicitações são processadas através de SMLTP para segurança e conformidade
- O parâmetro `user_id` permite o faturamento para uma conta de usuário diferente