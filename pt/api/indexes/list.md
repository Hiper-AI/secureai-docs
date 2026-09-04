---
id: list
title: "Listar Índices RAG"
sidebar_label: "Listar Índices"
description: "Recuperar todos os índices da base de conhecimento disponíveis"
openapi: "GET /indexes/all"
---

# Lista todos os índices

Recuperar uma lista abrangente de todos os índices da base de conhecimento disponíveis no sistema.

## Ponto final

```
GET /indexes/all
```

## Descrição

Este endpoint retorna todos os índices da base de conhecimento disponíveis no sistema SecureAI. Ele fornece informações detalhadas sobre cada índice, incluindo tipo, status, data de criação e metadados. Isto é útil para descobrir bases de conhecimento disponíveis e suas capacidades.

## Autenticação

**Obrigatório**: Chave API

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `page` | inteiro | Não | 1 | Número de página para paginação |
| `limit` | inteiro | Não | 50 | Número de índices por página (1-100) |
| `search` | corda | Não | - | Termo de pesquisa para nome de índice ou nome de índice compartilhado |
| `type` | corda | Não | - | Filtrar por tipo de índice (pessoal, geral, grupo) |
| `status` | corda | Não | ativo | Filtrar por status do índice (ativo, excluído, todos) |
| `sortBy` | corda | Não | criadoEm | Campo para ordenar |
| `sortOrder` | corda | Não | desc | Ordem de classificação (asc, desc) |

## Exemplo de solicitação

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "indexes": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "my-knowledge-base",
      "sharedIndexName": "my-knowledge-base",
      "namespace": "user-namespace",
      "type": "personal",
      "assignedUser": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedGroup": null,
      "userId": "60a7c8f5e8b4f5001f7a8c24",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `indexes[]` | matriz | Matriz de objetos de índice |
| `indexes[].id` | corda | Identificador de índice único |
| `indexes[].name` | corda | Nome do índice |
| `indexes[].sharedIndexName` | corda | Nome do índice compartilhado |
| `indexes[].namespace` | corda | Espaço para nome do índice |
| `indexes[].type` | corda | Tipo de índice (pessoal, geral, grupo, desconhecido) |
| `indexes[].assignedUser` | objeto | Informações atribuídas ao usuário (se pessoais) |
| `indexes[].assignedGroup` | objeto | Informações atribuídas ao grupo (se for grupo) |
| `indexes[].userId` | corda | ID do usuário |
| `indexes[].isActive` | booleano | Se o índice está ativo |
| `indexes[].createdAt` | corda | Carimbo de data e hora de criação |
| `indexes[].updatedAt` | corda | Carimbo de data/hora da última atualização |
| `indexes[].deletedAt` | corda | Carimbo de hora de exclusão (se excluído) |
| `pagination` | objeto | Informações de paginação |

## Tipos de índice

| Tipo | Descrição | Acesso |
|------|------------|--------|
| `personal` | Índices pessoais criados pelo usuário | Acesso total para proprietário |
| `general` | Índices organizacionais compartilhados | Varia de acordo com as permissões |
| `group` | Índices atribuídos ao grupo | Membros do grupo |
| `unknown` | Índices com atribuição pouco clara | Varia |

## Status do índice

| Estado | Descrição |
|--------|------------|
| `active` | O índice está disponível para uso |
| `deleted` | O índice foi excluído |
| `all` | Incluir ativos e excluídos |

## Exemplo de uso

### JavaScript

```javascript
const listIndexes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/indexes/all${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listIndexes({
  type: 'personal',
  limit: 10,
  page: 1
});
console.log(result.indexes);
```

###Píton

```python
import requests

def list_indexes(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "type": "personal",
    "limit": 10,
    "page": 1
}

result = list_indexes(params)
print(result["indexes"])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
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

## Exemplos de filtragem

### Filtrar por tipo

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### Filtrar por status

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### Paginação

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## Casos de uso

- **Descoberta**: Encontre bases de conhecimento disponíveis para operações RAG
- **Gerenciamento**: lista índices para fins administrativos
- **Integração**: descubra índices para integração de aplicativos
- **Monitoramento**: verifique o status do índice e os metadados
- **Filtragem**: Encontre tipos específicos de índices (sistema, pessoais, etc.)

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Este endpoint só é acessível por administradores
- Os índices pessoais são visíveis apenas para seus proprietários
- Os índices do grupo são visíveis para os membros do grupo
- A resposta inclui informações atribuídas ao usuário e ao grupo
- A paginação usa parâmetro de página, não deslocamento
- Filtrar por tipo e status ajuda a restringir os resultados