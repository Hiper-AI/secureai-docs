---
id: audit-logs
title: "Logs de Auditoria Criptográficos"
sidebar_label: "Logs de Auditoria"
description: "Recuperar logs de auditoria SMLTP"
openapi: "GET /audit-logs"
---

# Registros de auditoria

Recupere logs de auditoria SMLTP (Secure Model Language Transfer Protocol) para monitoramento e conformidade de segurança.

## Ponto final

```
GET /audit-logs
```

## Descrição

Este endpoint retorna logs de auditoria SMLTP que rastreiam eventos de segurança, violações de políticas e atividades de conformidade. Isso é útil para monitoramento de segurança, auditoria de conformidade e investigação de incidentes de segurança.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `page` | inteiro | Não | 1 | Número da página para paginação (padrão: 1) |
| `limit` | inteiro | Não | 50 | Número de logs por página (padrão: 50) |
| `startDate` | corda | Não | - | Data de início da filtragem (formato ISO 8601) |
| `endDate` | corda | Não | - | Data final da filtragem (formato ISO 8601) |
| `type` | corda | Não | - | Filtrar por tipo de log |
| `severity` | corda | Não | - | Filtrar por nível de gravidade |
| `userId` | corda | Não | - | Filtrar por ID de usuário |
| `search` | corda | Não | - | Termo de pesquisa para descrição ou metadados |

## Exemplo de solicitação

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `data` | objeto | Objeto de dados de resposta |
| `data.logs` | matriz | Matriz de objetos de log de auditoria |
| `data.logs[].id` | corda | Identificador único do registo de auditoria |
| `data.logs[].timestamp` | corda | Carimbo de data/hora do registro (ISO 8601) |
| `data.logs[].type` | corda | Tipo de evento de auditoria |
| `data.logs[].severity` | corda | Nível de gravidade |
| `data.logs[].description` | corda | Descrição do evento |
| `data.logs[].user` | objeto | Informações do usuário (se disponíveis) |
| `data.logs[].user.id` | corda | ID do usuário |
| `data.logs[].user.name` | corda | Nome de usuário |
| `data.logs[].user.email` | corda | E-mail do usuário |
| `data.logs[].metadata` | objeto | Metadados adicionais |
| `data.logs[].complianceCategory` | corda | Categoria de conformidade |
| `data.logs[].outcome` | corda | Resultado do evento |
| `data.pagination` | objeto | Informações de paginação |
| `data.pagination.page` | inteiro | Número da página atual |
| `data.pagination.limit` | inteiro | Itens por página |
| `data.pagination.total` | inteiro | Número total de registos |
| `data.pagination.pages` | inteiro | Número total de páginas |
| `data.dateRange` | objeto | Informações sobre intervalo de datas |

## Exemplo de uso

### JavaScript

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

###Píton

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
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


## Exemplos de filtragem

### Intervalo de datas

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### Filtragem de Eventos

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### Filtragem de usuários

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## Casos de uso

- **Monitoramento de segurança**: monitore eventos de segurança e violações de políticas
- **Auditoria de conformidade**: rastreie atividades e violações de conformidade
- **Investigação de incidentes**: investigue incidentes e violações de segurança
- **Análise de políticas**: analise a eficácia e a aplicação das políticas
- **Atividade do usuário**: rastreie as ações do usuário e o uso da API

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Este endpoint requer privilégios de administrador
- Paginação: usa parâmetro de página, não deslocamento
- Intervalo de datas: o padrão é durar 7 dias se nenhuma data for fornecida
- Pesquisa: pesquisas nos campos descrição e metadata.operação
- Resposta aninhada: a resposta está aninhada no objeto de dados
- Informações do usuário: as informações do usuário são preenchidas quando disponíveis
- Os registros são retidos para fins de conformidade