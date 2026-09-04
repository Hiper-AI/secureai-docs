---
id: create
title: "Criar Política SMLTP"
sidebar_label: "Criar Política SMLTP"
description: "Crie uma nova política de segurança SMLTP"
openapi: "POST /smltp-policies/active"
---

# Criar política SMLTP

Crie uma nova política de segurança SMLTP (Secure Model Language Transfer Protocol) para sua conta.

## Ponto final

```
POST /smltp-policies
```

## Descrição

Crie uma nova política personalizada SMLTP. É necessário acesso apenas de administrador.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Sim | Nome da política |
| `description` | corda | Sim | Descrição da política |
| `policy` | objeto | Sim | Objeto de configuração de política |
| `setAsActive` | booleano | Não | Se esta política deve ser definida como ativa imediatamente (padrão: falso) |

## Exemplo de solicitação

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## Resposta de sucesso

**Código de status**: `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `message` | corda | Mensagem de sucesso |
| `policy` | objeto | Objeto de política criado |
| `policy.id` | corda | Identificador da política (gerado a partir do nome) |
| `policy.name` | corda | Nome da política |
| `policy.description` | corda | Descrição da política |
| `policy.type` | corda | Tipo de política ("personalizada") |
| `policy.isActive` | booleano | Se a política está atualmente ativa |
| `policy.createdAt` | corda | Carimbo de data e hora de criação |

## Exemplo de uso

### JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

###Píton

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

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

### 403 Proibido

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 Conflito

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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

- **Segurança personalizada**: crie políticas adaptadas às suas necessidades
- **Conformidade**: Implementar requisitos regulatórios específicos
- **Gerenciamento de riscos**: Defina medidas de segurança para mitigação de riscos
- **Proteção de Dados**: Estabeleça regras de privacidade e tratamento de dados
- **Gerenciamento de políticas**: crie e gerencie políticas SMLTP personalizadas

## Limites de taxa

- **Padrão**: 50 solicitações por minuto
- **Diariamente**: 5.000 solicitações por dia
- **Mensal**: 150.000 solicitações por mês

## Notas

- Este endpoint requer privilégios de administrador
- Campos obrigatórios: nome, descrição e política são obrigatórios
- ID da política: gerado a partir do nome (letras minúsculas, hífens para espaços)
- Nomes exclusivos: os nomes das políticas devem ser exclusivos
- Definir ativo: opcionalmente, pode ser definido como ativo imediatamente
- Resposta simples: a resposta não está aninhada no objeto de dados