---
id: update
title: "Atualizar Índice RAG"
sidebar_label: "Atualizar Índice"
description: "Atualizar um índice da base de conhecimento existente"
openapi: "PUT /indexes/{indexId}"
---

# Atualizar índice

Atualize um índice da base de conhecimento existente com novas configurações, metadados ou configurações.

## Ponto final

```
PUT /indexes/{indexId}
```

## Descrição

Este endpoint permite que os administradores atualizem um índice da base de conhecimento existente. Você pode modificar o nome do índice e reatribuí-lo a diferentes usuários ou grupos. Somente administradores podem atualizar índices.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de caminho

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `indexId` | corda | Sim | O identificador exclusivo do índice a ser atualizado |

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Não | Novo nome para o índice |
| `assignedUser` | corda | Não | ID do usuário para atribuir o índice ao (MongoDB ObjectId) |
| `assignedGroup` | corda | Não | ID do grupo ao qual atribuir o índice (MongoDB ObjectId) |


## Exemplo de solicitação

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `message` | corda | Mensagem de sucesso |
| `index` | objeto | Objeto de índice atualizado |
| `index.id` | corda | Identificador de índice único |
| `index.name` | corda | Nome do índice atualizado |
| `index.sharedIndexName` | corda | Nome do índice compartilhado |
| `index.namespace` | corda | Espaço para nome do índice |
| `index.type` | corda | Tipo de índice (pessoal, geral, grupo, desconhecido) |
| `index.assignedUser` | objeto | Informações atribuídas ao usuário (se pessoais) |
| `index.assignedGroup` | objeto | Informações atribuídas ao grupo (se for grupo) |
| `index.createdAt` | corda | Carimbo de data/hora de criação original |
| `index.updatedAt` | corda | Carimbo de data/hora da última atualização |

## Exemplo de uso

### JavaScript

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  return await response.json();
};

// Example usage
const updateData = {
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

###Píton

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

###cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## Validações e regras de negócios

- **Atribuindo a um usuário (`assignedUser`)**:
  - Aplicar cota de índice de usuário via `checkUserIndexQuota` ao converter para pessoal ou alterar o destinatário. Cota excedida retorna 403.
- **Atribuindo a um grupo (`assignedGroup`)**:
  - O grupo deve existir e estar ativo (`status != 'Archived'`); grupos inválidos/inativos retornam 400.

## Normalização e armazenamento

- Ao renomear, `name` continua sendo armazenado normalizado; `sharedIndexName` padroniza o nome normalizado se não for definido explicitamente.

## Formas de erro típicas

### 403 Cota do índice excedida

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
}
```

### 400 Grupo inválido/inativo

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
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
    "message": "Cannot update this index"
  }
}
```

### 404 não encontrado

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
  }
}
```

### 409 Conflito

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## Campos atualizáveis

| Campo | Descrição | Notas |
|-------|-------------|-------|
| `name` | Nome do índice | Deve ser exclusivo em todo o sistema |
| `assignedUser` | Atribuição de usuário | Atribui índice a um usuário específico |
| `assignedGroup` | Trabalho de grupo | Atribui índice a um grupo específico |

## Casos de uso

- **Alterações de nome**: renomeie os índices para melhor organização
- **Atribuição de usuário**: reatribua índices a diferentes usuários
- **Atribuição de grupo**: reatribua índices a grupos diferentes
- **Transferência de propriedade**: altere a propriedade do índice entre usuários

## Limites de taxa

- **Padrão**: 50 solicitações por minuto
- **Diariamente**: 5.000 solicitações por dia
- **Mensal**: 150.000 solicitações por mês

## Notas

- Este endpoint só é acessível por administradores
- Campos limitados: somente nome, assignUser e assignGroup podem ser atualizados
- Lógica de Atribuição: Atribuir a um usuário limpa a atribuição de grupo e vice-versa
- Validação: IDs de usuários e grupos são validados antes da atribuição
- Sem configurações: não é possível atualizar configurações, metadados ou outras configurações
- O carimbo de data/hora `updatedAt` é atualizado automaticamente
- Os nomes dos índices devem permanecer exclusivos em todo o sistema