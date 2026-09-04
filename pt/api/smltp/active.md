---
id: active
title: "Políticas SMLTP Ativas"
sidebar_label: "Políticas Ativas"
description: "Recuperar políticas SMLTP atualmente ativas"
openapi: "GET /smltp-policies/active"
---

# Políticas SMLTP ativas

Recupere as políticas SMLTP (Secure Model Language Transfer Protocol) atualmente ativas para sua conta.

## Ponto final

```
GET /smltp-policies/active
```

## Descrição

Recupere a configuração da política SMLTP atualmente ativa. **É necessário acesso apenas de administrador.**

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Exemplo de solicitação

```bash
GET /smltp-policies/active
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `data` | objeto | Objeto de dados de resposta |
| `data.template` | corda | ID do modelo de política atualmente ativo |
| `data.policy` | objeto | Objeto de configuração de política atual |
| `data.lastUpdated` | corda | Carimbo de data/hora da última atualização |

## Exemplo de uso

### JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

###Píton

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respostas de erro

### 401 Não autorizado

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 Muitas solicitações

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```


## Casos de uso

- **Revisão da política**: verifique qual modelo de política está ativo no momento
- **Verificação de configuração**: revise a configuração da política atual
- **Gerenciamento de modelos**: entenda qual modelo de política está sendo usado
- **Solução de problemas**: entenda as configurações atuais da política
- **Preparação para auditoria**: revisar a política ativa para auditorias de conformidade

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Este endpoint requer privilégios de administrador
- Política única: retorna o modelo e a configuração da política atualmente ativa
- No Arrays: Não retorna um array de políticas, apenas a ativa
- ID do modelo: mostra qual modelo de política está ativo no momento
- Configuração de política: retorna o objeto de configuração de política real
- Resposta aninhada: a resposta está aninhada no objeto de dados