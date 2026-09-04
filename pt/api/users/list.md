---
sidebar_position: 1
title: "Listar Usuários"
openapi: "GET /users"
sidebar_label: "Listar Usuários"
---

# Obtenha todos os usuários

Recuperar todos os usuários com paginação e filtragem. Acessível apenas por administradores.

## Ponto final

```
GET /users
```

## Descrição

Este endpoint permite que os administradores recuperem uma lista paginada de todos os usuários no sistema. Ele oferece suporte à filtragem por vários critérios, incluindo função, licença, status e termos de pesquisa. Este é um endpoint administrativo que requer permissões apropriadas.

## Autenticação

Obrigatório. Inclua sua chave de API no cabeçalho de autorização.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitação

### Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|----------|---------|-------------|
| `page` | inteiro | Não | 1 | Número de página para paginação |
| `limit` | inteiro | Não | 20 | Número de usuários por página (1-100) |
| `search` | corda | Não | - | Termo de pesquisa por nome, e-mail ou nome de usuário |
| `role` | corda | Não | - | Filtrar por função de usuário (admin, usuário, globalReader) |
| `license` | corda | Não | - | Filtrar por licença de usuário (Essential, Growth, Ultra, Early Access) |
| `status` | inteiro | Não | - | Filtrar por status do usuário (0=inativo, 1=ativo) |
| `sortBy` | corda | Não | criadoEm | Campo para ordenar |
| `sortOrder` | corda | Não | desc | Ordem de classificação (asc, desc) |

### Exemplo de solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

Com pesquisa:

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre `true` para solicitações bem-sucedidas |
| `users` | matriz | Matriz de objetos de usuário |
| `users[].id` | corda | Identificador único do utilizador |
| `users[].name` | corda | Nome completo do usuário |
| `users[].username` | corda | Nome de usuário do usuário |
| `users[].email` | corda | Endereço de e-mail do usuário |
| `users[].role` | corda | Função do usuário (admin, usuário, globalReader) |
| `users[].license` | corda | Nível de licença do usuário (Essential, Growth, Ultra, Early Access) |
| `users[].status` | inteiro | Status do usuário (0=inativo, 1=ativo) |
| `users[].isVerified` | booleano | Se o usuário foi verificado |
| `users[].setupCompleted` | booleano | Se a configuração do usuário foi concluída |
| `users[].authType` | corda | Tipo de autenticação (básico, auth0) |
| `users[].mfaEnabled` | booleano | Se a MFA está habilitada |
| `users[].customRole` | objeto | Informações de função personalizada (se atribuídas) |
| `users[].customRole.id` | corda | ID de função personalizada |
| `users[].customRole.name` | corda | Nome da função personalizada |
| `users[].customRole.displayName` | corda | Nome de exibição da função personalizada |
| `users[].createdAt` | corda | Carimbo de data e hora de criação do usuário |
| `users[].updatedAt` | corda | Carimbo de data e hora da última atualização do usuário |
| `users[].lastActive` | corda | Carimbo de data/hora da última atividade do usuário |
| `pagination` | objeto | Informações de paginação |
| `pagination.page` | inteiro | Número da página atual |
| `pagination.limit` | inteiro | Itens por página |
| `pagination.total` | inteiro | Número total de usuários |
| `pagination.pages` | inteiro | Número total de páginas |

## Exemplo de uso

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

###Píton

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respostas de erro

### 401 Não autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Proibido

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## Exemplos de filtragem

### Pesquise por nome ou e-mail

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por função

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por licença

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrar por status

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Classificar por último ativo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Casos de uso

- **Gerenciamento de usuários**: visualize e gerencie todos os usuários no sistema
- **Análise de usuários**: analise a distribuição de usuários por função, licença ou status
- **Pesquisar e Filtrar**: Encontre usuários específicos com base em vários critérios
- **Tarefas administrativas**: suporte a operações administrativas e relatórios

## Descrições de funções

- **admin**: Acesso total ao sistema com controle administrativo
- **usuário**: acesso padrão a recursos de chat e bases de conhecimento pessoais  
- **globalReader**: acesso somente leitura ao painel de administração com permissões de visualização

## Descrições de licença

- **Essencial**: nível básico com 29.000 pontos/mês
- **Crescimento**: nível intermediário com recursos aprimorados
- **Ultra**: nível Premium com recursos máximos
- **Acesso antecipado**: nível beta com recursos experimentais

## Limites de taxa

Este endpoint segue os limites de taxa padrão:
- 60 solicitações por minuto
- 1000 solicitações por hora