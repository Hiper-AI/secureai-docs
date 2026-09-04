---
id: update
title: "Atualizar Usuário"
sidebar_label: "Atualizar Usuário"
description: "Atualizar uma conta de usuário existente"
openapi: "PUT /users/{userId}"
---

# Atualizar usuário

Atualize uma conta de usuário existente com novas informações.

## Ponto final

```
PUT /users/{userId}
```

## Descrição

Este endpoint permite que os administradores atualizem uma conta de usuário existente. Você pode modificar detalhes do usuário, como nome, email, função, nível de licença e outras configurações da conta.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de caminho

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `userId` | corda | Sim | O identificador exclusivo do usuário a ser atualizado |

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Não | Nome completo do usuário |
| `username` | corda | Não | Nome de usuário exclusivo para o usuário |
| `email` | corda | Não | Endereço de e-mail do usuário |
| `password` | corda | Não | Nova senha da conta do usuário |
| `role` | corda | Não | Função do usuário (admin, usuário, globalReader) |
| `license` | corda | Não | Nível de licença (Essential, Growth, Ultra, Early Access) |
| `status` | inteiro | Não | Estado da conta (0=inativa, 1=ativa) |
| `roleId` | corda | Não | ID de função personalizada (MongoDB ObjectId) |
| `setupCompleted` | booleano | Não | Se a configuração do usuário foi concluída |
| `isVerified` | booleano | Não | Se o usuário foi verificado |

## Exemplo de solicitação

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## Resposta de sucesso

**Código de status**: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `message` | corda | Mensagem de sucesso |
| `user` | objeto | Objeto de usuário atualizado |
| `user.id` | corda | Identificador único de usuário |
| `user.name` | corda | Nome completo do usuário |
| `user.username` | corda | Nome de usuário do usuário |
| `user.email` | corda | Endereço de e-mail do usuário |
| `user.role` | corda | Papel do usuário no sistema |
| `user.license` | corda | Nível de licença do usuário |
| `user.status` | inteiro | Status da conta do usuário (0=inativo, 1=ativo) |
| `user.isVerified` | booleano | Se o usuário foi verificado |
| `user.setupCompleted` | booleano | Se a configuração do usuário foi concluída |
| `user.authType` | corda | Tipo de autenticação |
| `user.customRole` | objeto | Informações de função personalizada (se atribuídas) |
| `user.createdAt` | corda | Carimbo de data e hora de criação da conta |
| `user.updatedAt` | corda | Carimbo de data/hora da última atualização |
| `user.lastActive` | corda | Carimbo de data/hora da última atividade do usuário |

## Exemplo de uso

### JavaScript

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

###Píton

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

###cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 não encontrado

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 Conflito

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## Validações e regras de negócios

- **Valor da licença**: Deve estar em licenças permitidas (`Essential`, `Growth`, `Ultra`, `Early Access`). Valores inválidos retornam 400.
- **Capacidade de licença**: Aplicada via `checkLicenseCapacity`; retorna 400 quando a camada selecionada está cheia.
- **Proteção de downgrade de licença**: Se a mudança para um nível inferior reduzir a cota de índice pessoal, a alteração será bloqueada quando a contagem atual do índice pessoal exceder `INDEX_QUOTAS[new_license]`; retorna 400 com orientação explícita.
- **Normalização de e-mail**: letras minúsculas e cortadas antes da validação e armazenamento.
- **Normalização de nome de usuário**: letras minúsculas e cortadas antes da validação e armazenamento.
- **Formato de e-mail**: Validação simples de regex; e-mails inválidos retornam 400.
- **Formato do nome de usuário**: Deve corresponder a `^[a-z0-9.-]{3,30}$`; nomes de usuário inválidos retornam 400.
- **Singularidade**: `email`, `username` e `name` devem permanecer únicos; conflitos retornam 409.

## Normalização e armazenamento

- `email` e `username` são sempre armazenados em letras minúsculas e aparados.

## Formas de erro típicas

### 400 Licença Inválida

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400 Licença indisponível

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 downgrades de licença excedem a cota

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 E-mail inválido

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 Nome de usuário inválido

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 Conflito (Singularidade)

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## Funções do usuário

| Função | Descrição | Permissões |
|------|-------------|-------------|
| `admin` | Administrador | Acesso total ao sistema |
| `user` | Usuário regular | Acesso de usuário padrão |
| `globalReader` | Leitor Global | Acesso somente leitura ao painel de administração |

## Níveis de licença

| Nível | Descrição | Recursos |
|------|-------------|----------|
| `Essential` | Camada básica | Recursos limitados |
| `Growth` | Nível profissional | Recursos aprimorados |
| `Ultra` | Nível premium | Recursos completos |
| `Early Access` | Nível de acesso antecipado | Recursos beta |

## Status da conta

| Estado | Descrição |
|--------|------------|
| `0` | Conta inativa |
| `1` | Conta ativa |

## Casos de uso

- **Gerenciamento de funções**: atualização de funções de usuário para controle de acesso
- **Atualizações de licença**: alteração dos níveis de licença do usuário
- **Manutenção da conta**: atualização de informações e metadados do usuário
- **Gerenciamento de status**: ativação ou suspensão de contas de usuário
- **Atualizações de perfil**: modificação de nomes de usuário, e-mails ou outros detalhes

## Limites de taxa

- **Padrão**: 100 solicitações por minuto
- **Diariamente**: 10.000 solicitações por dia
- **Mensal**: 300.000 solicitações por mês

## Notas

- Somente administradores podem atualizar contas de usuários
- Os endereços de e-mail devem ser exclusivos para todos os usuários
- As atualizações de senha são opcionais e só serão aplicadas se fornecidas
- As atualizações de metadados são mescladas com os metadados existentes
- O carimbo de data/hora `updatedAt` é atualizado automaticamente em operações bem-sucedidas