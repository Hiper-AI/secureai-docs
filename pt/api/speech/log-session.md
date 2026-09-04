---
sidebar_position: 3
title: "Registrar Sessão Speech-to-Speech"
openapi: "POST /speech/s2s/log-session"
sidebar_label: "Log de Sessão S2S"
---

# Registrar a duração da sessão S2S

Registre a duração de uma sessão de conversão de fala em fala concluída e deduza o tempo da cota de tempo S2S do usuário.

## Ponto final

```
POST /speech/s2s/log-session
```

## Descrição

Registre a duração de uma sessão de conversão de fala em fala concluída e deduza o tempo da cota de tempo S2S do usuário. Isso deve ser chamado após o término de uma sessão para rastrear o uso com precisão.

### Rastreamento de uso

- A duração é especificada em milissegundos
- Convertido automaticamente em minutos e deduzido da cota do usuário
- O tempo é rastreado por usuário com base no nível de licença
- Os logs de atividades são criados para fins de auditoria

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `durationMs` | inteiro | Sim | Duração da sessão em milissegundos (mínimo: 0) |
| `user_id` | corda | Não | ID do usuário para cobrar esta sessão (o padrão é o proprietário da chave de API) |

## Exemplo de solicitação

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "durationMs": 42624,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
  }'
```

###JavaScript/Node.js

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

###Píton

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

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas |
| `message` | corda | Mensagem de sucesso |
| `request_id` | corda | Solicitar ID para rastreamento |

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### 401 Não autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## Notas

- Chame esse endpoint após o término de cada sessão S2S para rastrear o uso com precisão
- A duração deve ser calculada desde o estabelecimento da conexão WebRTC até o fechamento
- O tempo é convertido automaticamente de milissegundos para minutos e deduzido da cota do usuário
- O parâmetro `user_id` permite o faturamento para uma conta de usuário diferente
- Os logs de atividades são criados automaticamente para fins de auditoria
- Certifique-se de ter tempo restante suficiente antes de iniciar uma sessão (verifique com `/speech/s2s/status`)