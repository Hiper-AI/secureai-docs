---
id: policies
title: "Políticas SMLTP"
sidebar_label: "Políticas SMLTP"
description: "Recuperar todas as políticas de segurança SMLTP"
openapi: "GET /smltp-policies/all"
---

# SMLTP Políticas

Recupere todas as políticas de segurança SMLTP (Secure Model Language Transfer Protocol) disponíveis.

## Ponto final

```
GET /smltp-policies/all
```

## Descrição

Recupere todas as políticas SMLTP disponíveis, incluindo políticas integradas e personalizadas. **É necessário acesso apenas de administrador.**

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
❌ Nenhum parâmetro de consulta suportado - a API real não aceita nenhum parâmetro de consulta.

## Exemplo de solicitação

```bash
GET /smltp-policies/all
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `data` | objeto | Objeto de dados de resposta |
| `data.builtInPolicies` | matriz | Matriz de objetos de política integrados |
| `data.customPolicies` | matriz | Matriz de objetos de política personalizados |
| `data.activePolicyTemplate` | corda | ID do modelo de política atualmente ativo |
| `data.summary` | objeto | Estatísticas resumidas |
| `data.summary.totalPolicies` | inteiro | Número total de políticas |
| `data.summary.builtInCount` | inteiro | Número de políticas integradas |
| `data.summary.customCount` | inteiro | Número de políticas personalizadas |

## Exemplo de uso

### JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

###Píton

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
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

## Campos de objeto de política

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `id` | corda | Identificador da política |
| `name` | corda | Nome da política |
| `type` | corda | Tipo de política ("integrada" ou "personalizada") |
| `description` | corda | Descrição da política |
| `isActive` | booleano | Se esta política está atualmente ativa |
| `createdAt` | corda | Carimbo de data/hora de criação (somente políticas personalizadas) |

## Casos de uso

- **Descoberta de políticas**: encontre políticas de segurança disponíveis
- **Planejamento de conformidade**: entenda os requisitos da política
- **Configuração de segurança**: selecione políticas apropriadas
- **Gerenciamento de políticas ativas**: verifique qual política está ativa no momento
- **Integração**: aplique políticas às conclusões do chat

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Este endpoint requer privilégios de administrador
- Sem parâmetros: nenhum parâmetro de consulta é suportado
- Políticas integradas: retorna políticas de sistema predefinidas
- Políticas personalizadas: retorna políticas personalizadas, se existirem
- Política Ativa: Mostra qual modelo de política está ativo no momento
- Resposta simples: a resposta está aninhada no objeto de dados