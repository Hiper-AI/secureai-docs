---
id: create
title: "Criar Grupo"
sidebar_label: "Criar Grupo"
description: "Crie um novo grupo de usuários"
openapi: "POST /groups"
---

# Criar grupo

Crie um novo grupo de usuários para organizar usuários e gerenciar permissões de acesso.

## Ponto final

```
POST /groups
```

## Descrição

Este endpoint permite que os administradores criem novos grupos de usuários. Os grupos são usados ​​para organizar usuários, gerenciar permissões e controlar o acesso a diferentes partes do sistema. Você pode especificar o nome, a descrição e os metadados do grupo durante a criação.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Sim | Nome do grupo |
| `description` | corda | Sim | Descrição do grupo |
| `users` | matriz | Não | Matriz de IDs de usuário para adicionar ao grupo |
| `status` | corda | Não | Status do grupo (o padrão é "Ativo") |

## Exemplo de solicitação

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## Resposta de sucesso

**Código de status**: `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
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
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `message` | corda | Mensagem de sucesso |
| `group` | objeto | Objeto de grupo criado |
| `group.id` | corda | Identificador único de grupo |
| `group.name` | corda | Nome do grupo |
| `group.description` | corda | Descrição do grupo |
| `group.status` | corda | Estado do grupo |
| `group.userCount` | inteiro | Número de usuários do grupo |
| `group.users` | matriz | Matriz de objetos de usuário no grupo |
| `group.users[].id` | corda | ID do usuário |
| `group.users[].name` | corda | Nome de usuário |
| `group.users[].email` | corda | E-mail do usuário |
| `group.createdAt` | corda | Carimbo de data e hora de criação |

## Exemplo de uso

### JavaScript

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

###Píton

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
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
    "message": "Group name is required",
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

- **Organização de usuários**: crie grupos para organizar usuários por departamento ou função
- **Controle de acesso**: estabeleça grupos para gerenciar permissões e acessos
- **Gerenciamento de equipes**: crie grupos para diferentes equipes ou projetos
- **Relatórios**: organize os usuários para relatórios e análises
- **Integração**: Crie grupos para integração de sistemas de terceiros

## Limites de taxa

- **Padrão**: 50 solicitações por minuto
- **Diariamente**: 5.000 solicitações por dia
- **Mensal**: 150.000 solicitações por mês

## Notas

- Este endpoint só é acessível por administradores
- Campos obrigatórios: nome e descrição são obrigatórios
- Atribuição de usuário: pode atribuir usuários ao grupo durante a criação
- Status: o padrão é "Ativo" se não for especificado
- Validação: IDs de usuário são validados antes da atribuição
- Resposta simples: a resposta não está aninhada no objeto de dados
- O grupo fica imediatamente disponível para uso após a criação