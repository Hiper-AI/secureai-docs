---
id: update
title: "Atualizar Grupo"
sidebar_label: "Atualizar Grupo"
description: "Atualizar um grupo de usuários existente"
openapi: "PUT /groups/{groupId}"
---

# Atualizar grupo

Atualize um grupo de usuários existente com novas informações, descrições ou metadados.

## Ponto final

```
PUT /groups/{groupId}
```

## Descrição

Este endpoint permite que os administradores atualizem um grupo de usuários existente. Você pode modificar o nome do grupo, a descrição, os metadados e outras propriedades. O grupo deve existir e você deve ter permissões apropriadas para atualizá-lo.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de caminho

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `groupId` | corda | Sim | O identificador exclusivo do grupo a ser atualizado |

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Não | Novo nome do grupo |
| `description` | corda | Não | Nova descrição para o grupo |
| `users` | matriz | Não | Matriz de IDs de usuário a serem atribuídos ao grupo |
| `status` | corda | Não | Estado do grupo |

## Exemplo de solicitação

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "message": "Group updated successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "status": "Active",
    "userCount": 3,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c27",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      }
    ],
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
| `group` | objeto | Objeto de grupo atualizado |
| `group.id` | corda | Identificador único de grupo |
| `group.name` | corda | Nome do grupo atualizado |
| `group.description` | corda | Descrição atualizada do grupo |
| `group.status` | corda | Estado do grupo |
| `group.userCount` | inteiro | Número de usuários do grupo |
| `group.users` | matriz | Matriz de objetos de usuário no grupo |
| `group.users[].id` | corda | ID do usuário |
| `group.users[].name` | corda | Nome de usuário |
| `group.users[].email` | corda | E-mail do usuário |
| `group.createdAt` | corda | Carimbo de data/hora de criação original |
| `group.updatedAt` | corda | Carimbo de data/hora da última atualização |

## Exemplo de uso

### JavaScript

```javascript
const updateGroup = async (groupId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/groups/${groupId}`, {
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
  name: "Updated Engineering Team",
  description: "Updated software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  status: "Active"
};

const result = await updateGroup('60a7c8f5e8b4f5001f7a8c25', updateData);
console.log('Updated group:', result.group);
```

###Píton

```python
import requests

def update_group(group_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/groups/{group_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
}

result = update_group("60a7c8f5e8b4f5001f7a8c25", update_data)
print("Updated group:", result["group"])
```

###cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/groups/60a7c8f5e8b4f5001f7a8c25" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name cannot be empty",
    "details": {
      "field": "name",
      "value": ""
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
    "message": "Cannot update this group"
  }
}
```

### 404 não encontrado

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
  }
}
```

### 409 Conflito

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

- **Gerenciamento de grupo**: atualize informações e descrições do grupo
- **Atribuição de usuário**: atribua novos usuários ao grupo
- **Alterações de nome**: renomeie grupos para melhor clareza
- **Atualizações de status**: alterar o status do grupo
- **Atualizações da equipe**: atualize as informações do grupo quando a estrutura da equipe mudar

## Limites de taxa

- **Padrão**: 50 solicitações por minuto
- **Diariamente**: 5.000 solicitações por dia
- **Mensal**: 150.000 solicitações por mês

## Notas

- Este endpoint só é acessível por administradores
- Atualizações parciais: inclua apenas os campos que você deseja alterar
- Atribuição de usuário: pode atribuir novos usuários ao grupo
- Validação de nome: os nomes dos grupos devem ser exclusivos
- Resposta simples: a resposta não está aninhada no objeto de dados
- Validação do usuário: IDs de usuário são validados antes da atribuição
- O carimbo de data/hora `updatedAt` é atualizado automaticamente