---
id: list
title: "Listar Grupos"
sidebar_label: "Listar Grupos"
description: "Recuperar todos os grupos de usuários"
openapi: "GET /groups"
---

# Listar grupos

Recuperar uma lista de todos os grupos de usuários no sistema com opções de paginação e filtragem.

## Ponto final

```
GET /groups
```

## Descrição

Este endpoint retorna todos os grupos de usuários disponíveis no sistema SecureAI. Ele fornece informações detalhadas sobre cada grupo, incluindo membros, permissões e metadados. Isso é útil para gerenciar o acesso do usuário e a estrutura organizacional.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `page` | inteiro | Não | 1 | Número de página para paginação |
| `limit` | inteiro | Não | 20 | Número de grupos por página (1-100) |
| `search` | corda | Não | - | Termo de pesquisa para nome ou descrição do grupo |
| `status` | corda | Não | - | Filtrar por status do grupo |
| `sortBy` | corda | Não | criadoEm | Campo para ordenar |
| `sortOrder` | corda | Não | desc | Ordem de classificação (asc, desc) |

## Exemplo de solicitação

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `groups[]` | matriz | Matriz de objetos de grupo |
| `groups[].id` | corda | Identificador único de grupo |
| `groups[].name` | corda | Nome do grupo |
| `groups[].description` | corda | Descrição do grupo |
| `groups[].status` | corda | Estado do grupo |
| `groups[].userCount` | inteiro | Número de usuários do grupo |
| `groups[].users` | matriz | Matriz de objetos de usuário no grupo |
| `groups[].users[].id` | corda | ID do usuário |
| `groups[].users[].name` | corda | Nome de usuário |
| `groups[].users[].email` | corda | E-mail do usuário |
| `groups[].createdAt` | corda | Carimbo de data e hora de criação |
| `pagination` | objeto | Informações de paginação |

## Exemplo de uso

### JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

###Píton

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

### Pesquisar grupos

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### Opções de classificação

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### Paginação

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## Casos de uso

- **Gerenciamento de grupos**: liste todos os grupos para fins administrativos
- **Organização de usuários**: descubra grupos disponíveis para atribuição de usuários
- **Controle de acesso**: revise as permissões do grupo e a contagem de membros
- **Relatórios**: Gere relatórios sobre estrutura e associação de grupos
- **Integração**: Descubra grupos para integração de aplicativos

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Este endpoint só é acessível por administradores
- Paginação: usa parâmetro de página, não deslocamento
- Resposta simples: a resposta não está aninhada no objeto de dados
- Detalhes do usuário: inclui informações completas do usuário para cada membro do grupo
- Filtro de status: pode filtrar por status do grupo
- A funcionalidade de pesquisa funciona em nomes e descrições de grupos
- As opções de classificação ajudam a organizar os resultados por diferentes critérios