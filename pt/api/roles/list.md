---
id: list
title: "Listar Funções (Roles)"
sidebar_label: "Listar Roles"
description: "Recuperar todas as funções de usuário disponíveis"
openapi: "GET /roles"
---

# Listar funções

Recupere todas as funções de usuário disponíveis no sistema SecureAI.

## Ponto final

```
GET /roles
```

## Descrição

Este endpoint retorna todas as funções de usuário disponíveis no sistema SecureAI. Ele fornece informações detalhadas sobre cada função, incluindo permissões, descrições e metadados. Isto é útil para compreender as funções disponíveis e suas capacidades.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `page` | inteiro | Não | 1 | Número da página para paginação (padrão: 1) |
| `limit` | inteiro | Não | 20 | Número de funções por página (padrão: 20) |
| `search` | corda | Não | - | Termo de pesquisa por nome, nome de exibição ou descrição |
| `isSystem` | corda | Não | - | Filtrar por funções do sistema (verdadeiro/falso) |
| `sortBy` | corda | Não | criadoEm | Campo para ordenar (padrão: "createdAt") |
| `sortOrder` | corda | Não | desc | Ordem de classificação (asc/desc, padrão: "desc") |

## Exemplo de solicitação

```bash
GET /roles?page=1&limit=10&search=admin
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `roles` | matriz | Matriz de objetos de função |
| `roles[].id` | corda | Identificador único de função |
| `roles[].name` | corda | Nome da função |
| `roles[].displayName` | corda | Nome de exibição da função |
| `roles[].description` | corda | Descrição da função |
| `roles[].isSystem` | booleano | Se esta é uma função do sistema |
| `roles[].hasAdminPanelAccess` | booleano | Se a função tem acesso ao painel de administração |
| `roles[].permissions` | matriz | Matriz de objetos de permissão |
| `roles[].permissions[].section` | corda | Seção de permissão |
| `roles[].permissions[].level` | corda | Nível de permissão |
| `roles[].canInteractWithAI` | booleano | Se a função pode interagir com IA |
| `roles[].canUseChat` | booleano | Se a função pode usar chat |
| `roles[].userCount` | inteiro | Número de usuários com esta função |
| `roles[].createdBy` | objeto | Usuário que criou a função |
| `roles[].createdBy.id` | corda | ID do usuário criador |
| `roles[].createdBy.name` | corda | Nome do criador |
| `roles[].createdBy.email` | corda | E-mail do criador |
| `roles[].createdAt` | corda | Carimbo de data e hora de criação |
| `roles[].updatedAt` | corda | Carimbo de data/hora da última atualização |
| `pagination` | objeto | Informações de paginação |
| `pagination.page` | inteiro | Número da página atual |
| `pagination.limit` | inteiro | Itens por página |
| `pagination.total` | inteiro | Número total de funções |
| `pagination.pages` | inteiro | Número total de páginas |

## Exemplo de uso

### JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

###Píton

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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


## Casos de uso

- **Gerenciamento de funções**: liste todas as funções disponíveis para atribuição de usuário
- **Revisão de permissões**: entenda quais permissões cada função possui
- **Controle de acesso**: planeje o acesso do usuário com base nas funções disponíveis
- **Atribuição de usuários**: atribua funções aos usuários com base em suas necessidades
- **Análise de funções**: analise o uso de funções e a distribuição de usuários

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Este endpoint requer privilégios de administrador
- Paginação baseada em página: usa parâmetro de página, não deslocamento
- Pesquisa: pesquisas nos campos nome, displayName e descrição
- Funções do sistema: pode filtrar por sistema versus funções personalizadas
- Classificação: pode classificar por qualquer campo em ordem crescente ou decrescente
- Resposta simples: a resposta não está aninhada no objeto de dados
- Contagem de usuários: mostra quantos usuários têm cada função
- Informações do criador: mostra quem criou cada função