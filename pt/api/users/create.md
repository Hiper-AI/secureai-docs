---
sidebar_position: 2
title: "Criar Usuário"
openapi: "POST /users"
sidebar_label: "Criar Usuário"
---

# Criar novo usuário

Crie uma nova conta de usuário. Acessível apenas por administradores.

## Ponto final

```
POST /users
```

## Descrição

Este endpoint permite que os administradores criem novas contas de usuário no sistema. Você pode especificar vários atributos de usuário, incluindo função, licença e tipo de autenticação. Este é um endpoint administrativo que requer permissões apropriadas.

## Fluxo de criação de usuário

**Autenticação Básica** (`authType: "basic"`): O usuário recebe um e-mail de boas-vindas com um link de configuração de senha. A conta é criada sem ser verificada até que a senha seja definida.

**Empresa SSO** (`authType: "enterprise"`): o usuário é criado e verificado e pode entrar por meio da empresa SSO (Auth0, Microsoft AD, etc.). Nenhuma configuração de senha é necessária.

## Autenticação

Obrigatório. Inclua sua chave de API no cabeçalho de autorização.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitação

### Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|----------|---------|-------------|
| `name` | corda | Sim | - | Nome completo do usuário |
| `username` | corda | Não | - | Nome de usuário exclusivo (gerado automaticamente a partir de e-mail, se não for fornecido) |
| `email` | corda | Sim | - | Endereço de e-mail do usuário |
| `role` | corda | Não | usuário | Função do usuário (admin, usuário, globalReader) |
| `license` | corda | Não | Essencial | Nível de licença do usuário (Essential, Growth, Ultra, Early Access) |
| `roleId` | corda | Não | - | ID de função personalizada (MongoDB ObjectId) |
| `setupCompleted` | booleano | Não | falso | Se a configuração do usuário foi concluída |
| `authType` | corda | Não | básico | Tipo de autenticação (básica, empresarial) |

### Exemplo de solicitação

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## Resposta

### Resposta de sucesso (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre `true` para solicitações bem-sucedidas |
| `message` | corda | Mensagem de sucesso |
| `user` | objeto | Objeto de usuário criado |
| `user.id` | corda | Identificador único do utilizador |
| `user.name` | corda | Nome completo do usuário |
| `user.username` | corda | Nome de usuário do usuário |
| `user.email` | corda | Endereço de e-mail do usuário |
| `user.role` | corda | Função do usuário |
| `user.license` | corda | Nível de licença do usuário |
| `user.status` | inteiro | Status do usuário (1=ativo) |
| `user.isVerified` | booleano | Se o usuário foi verificado |
| `user.setupCompleted` | booleano | Se a configuração do usuário foi concluída |
| `user.authType` | corda | Tipo de autenticação |
| `user.createdAt` | corda | Carimbo de data e hora de criação do usuário |

## Exemplo de uso

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

###Píton

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 Tipo de autenticação inválido

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 campos obrigatórios ausentes

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
}
```

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

### 409 Conflito

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## Validações e regras de negócios

- **Valor da licença**: Deve ser uma das licenças permitidas (`Essential`, `Growth`, `Ultra`, `Early Access`). Valores inválidos retornam 400.
- **Capacidade da licença**: Aplicada via `checkLicenseCapacity`. Se a capacidade estiver cheia para o nível selecionado, retornará 400.
- **Normalização de e-mail**: letras minúsculas e cortadas antes da validação e armazenamento.
- **Normalização de nome de usuário**: letras minúsculas e cortadas antes da validação e armazenamento. Gerado automaticamente a partir de e-mail, se não for fornecido.
- **Formato de email**: Validado com um regex simples; e-mails inválidos retornam 400.
- **Formato do nome de usuário**: Deve corresponder a `^[a-z0-9.-]{3,30}$`; nomes de usuário inválidos retornam 400.
- **Singularidade**: `email`, `username` e `name` devem ser exclusivos. Os conflitos retornam 409.
- **Comportamento de convite por e-mail**: para autenticação básica, os usuários recebem e-mails de boas-vindas com links de configuração de senha.

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## Funções do usuário

| Função | Descrição | Permissões |
|------|-------------|-------------|
| `admin` | Administrador | Acesso total ao sistema |
| `user` | Usuário regular | Acesso de usuário padrão |
| `globalReader` | Leitor Global | Acesso somente leitura ao painel de administração |

## Níveis de licença

| Licença | Descrição | Recursos |
|--------|-------------|----------|
| `Essential` | Camada básica | Recursos limitados |
| `Growth` | Nível profissional | Recursos aprimorados |
| `Ultra` | Nível premium | Recursos completos |
| `Early Access` | Nível de acesso antecipado | Recursos beta |

## Tipos de autenticação

| Tipo | Descrição |
|------|-------------|
| `basic` | Autenticação de nome de usuário/senha (usuário recebe e-mail de configuração de senha) |
| `enterprise` | Integração empresarial SSO (Auth0, Microsoft AD, etc.) |

## Casos de uso

- **User Onboarding**: crie novas contas de usuário para membros da equipe
- **Onboarding sem senha**: crie usuários que recebem convites por e-mail para definir suas próprias senhas
- **SSO Integração**: Crie usuários que se autenticam por meio de provedores de identidade externos
- **Criação de usuários em massa**: crie vários usuários programaticamente
- **Integração**: Crie usuários de sistemas externos
- **Tarefas administrativas**: Gerenciar contas de usuários por meio de API

## Limites de taxa

Este endpoint segue os limites de taxa padrão:
- 60 solicitações por minuto
- 1000 solicitações por hora