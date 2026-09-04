---
id: create
title: "Criar Função (Role)"
sidebar_label: "Criar Role"
description: "Crie uma nova função de usuário"
openapi: "POST /roles"
---

# Criar função

Crie uma nova função de usuário personalizada com permissões específicas.

## Ponto final

```
POST /roles
```

## Descrição

Este endpoint permite que os administradores criem novas funções de usuário personalizadas. As funções personalizadas podem ter permissões específicas adaptadas às necessidades da sua organização. Você pode especificar o nome da função, a descrição e as permissões durante a criação.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Sim | Nome da função (identificador do sistema) |
| `displayName` | corda | Sim | Nome da função legível por humanos |
| `description` | corda | Sim | Descrição da finalidade da função |
| `hasAdminPanelAccess` | booleano | Não | Se a função tem acesso ao painel de administração (padrão: false) |
| `permissions` | matriz | Não | Matriz de objetos de permissão |
| `canInteractWithAI` | booleano | Não | Se a função pode interagir com IA (padrão: verdadeiro) |
| `canUseChat` | booleano | Não | Se a função pode usar chat (padrão: true) |

## Exemplo de solicitação

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## Resposta de sucesso

**Código de status**: `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `message` | corda | Mensagem de sucesso |
| `role` | objeto | Objeto de função criado |
| `role.id` | corda | Identificador único de função |
| `role.name` | corda | Nome da função |
| `role.displayName` | corda | Nome de exibição da função |
| `role.description` | corda | Descrição da função |
| `role.isSystem` | booleano | Se esta é uma função do sistema |
| `role.hasAdminPanelAccess` | booleano | Se a função tem acesso ao painel de administração |
| `role.permissions` | matriz | Matriz de objetos de permissão |
| `role.permissions[].section` | corda | Seção de permissão |
| `role.permissions[].level` | corda | Nível de permissão |
| `role.canInteractWithAI` | booleano | Se a função pode interagir com IA |
| `role.canUseChat` | booleano | Se a função pode usar chat |
| `role.userCount` | inteiro | Número de usuários com esta função |
| `role.createdBy` | objeto | Usuário que criou a função |
| `role.createdBy.id` | corda | ID do usuário criador |
| `role.createdBy.name` | corda | Nome do criador |
| `role.createdBy.email` | corda | E-mail do criador |
| `role.createdAt` | corda | Carimbo de data e hora de criação |

## Exemplo de uso

### JavaScript

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

###Píton

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
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
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## Seções de permissão disponíveis

| Seção | Descrição |
|--------|-------------|
| `home` | Acesso ao painel inicial |
| `user-management` | Operações de gerenciamento de usuários |
| `index-management` | Operações de gestão de índices |
| `analytics` | Análise e relatórios |
| `group-management` | Operações de gestão do grupo |
| `integrations` | Gestão de integração |
| `services-status` | Monitoramento do status dos serviços |
| `settings` | Configurações do sistema |
| `announcements` | Gestão de anúncios |
| `smltp-security` | SMLTP recursos de segurança |

## Níveis de permissão disponíveis

| Nível | Descrição |
|-------|------------|
| `none` | Sem acesso à seção |
| `reader` | Acesso somente leitura à seção |
| `admin` | Acesso administrativo total à seção |

## Casos de uso

- **Funções personalizadas**: crie funções adaptadas às necessidades da sua organização
- **Controle de acesso**: Defina permissões específicas para diferentes tipos de usuários
- **Segurança**: implemente princípios de acesso com privilégios mínimos
- **Conformidade**: crie funções que atendam aos requisitos regulatórios
- **Integração**: defina funções para integração de sistemas de terceiros

## Limites de taxa

- **Padrão**: 50 solicitações por minuto
- **Diariamente**: 5.000 solicitações por dia
- **Mensal**: 150.000 solicitações por mês

## Notas

- **Somente administrador**: este endpoint requer privilégios de administrador
- **Campos obrigatórios**: nome, displayName e descrição são obrigatórios
- **Estrutura de permissão**: permissões são objetos com propriedades de seção e nível
- **Funções do sistema**: funções personalizadas nunca são funções do sistema
- **Resposta simples**: a resposta não está aninhada no objeto de dados
- **Informações do criador**: mostra quem criou a função
- **Contagem de usuários**: começa em 0 para novas funções
- Os nomes das funções devem ser exclusivos no sistema
- A função fica imediatamente disponível para atribuição do usuário