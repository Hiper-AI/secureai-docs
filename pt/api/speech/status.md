---
sidebar_position: 2
title: "Status da Sessão Speech-to-Speech"
openapi: "GET /speech/s2s/status"
sidebar_label: "Status S2S"
---

# Obtenha o status do horário S2S

Recuperar o status de tempo atual do Speech-to-Speech (S2S) para o usuário de cobrança.

## Ponto final

```
GET /speech/s2s/status
```

## Descrição

Recupere o status atual do tempo de Speech-to-Speech (S2S) do usuário de cobrança, incluindo tempo restante, limite mensal total, tempo usado e informações de renovação.

### Cotas de tempo S2S

- As cotas são baseadas no nível de licença do usuário
- O tempo é redefinido mensalmente com base na data de atribuição da licença
- Licenças de avaliação não renováveis não são redefinidas automaticamente

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `user_id` | corda | Não | ID do usuário para verificar o status (o padrão é proprietário da chave API) |

## Exemplo de solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

###JavaScript/Node.js

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

###Píton

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

## Resposta

### Resposta de sucesso (200)

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

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas |
| `remaining_minutes` | número | Tempo restante de S2S em minutos |
| `total_minutes` | número | Limite de tempo S2S mensal total |
| `used_minutes` | número | Tempo S2S usado este mês |
| `has_time_remaining` | booleano | Se o usuário tem algum tempo S2S restante |
| `next_renewal_date` | string\|nulo | Quando a cota horária S2S será zerada (nulo para licenças não renováveis) |
| `non_renewable` | booleano | Se esta é uma licença de teste não renovável |
| `request_id` | corda | Solicitar ID para rastreamento |

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 não encontrado

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Notas

- Verifique este endpoint antes de iniciar sessões S2S para garantir que haja tempo suficiente disponível
- O parâmetro `user_id` permite verificar o status de um usuário diferente (o padrão é proprietário da chave API)
- As cotas de tempo são baseadas no nível de licença do usuário
- Licenças de avaliação não renováveis terão `non_renewable: true` e `next_renewal_date: null`