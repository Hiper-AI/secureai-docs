---
id: create
title: "Criar Índice RAG"
sidebar_label: "Criar Índice"
description: "Crie um novo índice da base de conhecimento"
openapi: "POST /indexes/all"
---

# Criar índice

Crie um novo índice da base de conhecimento para armazenar e recuperar documentos.

## Ponto final

```
POST /indexes
```

## Descrição

Este endpoint permite que os administradores criem um novo índice da base de conhecimento. O índice pode ser atribuído a usuários ou grupos específicos. Somente administradores podem criar índices.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `name` | corda | Sim | Nome do índice |
| `assignedUser` | corda | Não | ID do usuário para atribuir o índice ao (MongoDB ObjectId) |
| `assignedGroup` | corda | Não | ID do grupo ao qual atribuir o índice (MongoDB ObjectId) |
| `sharedIndexName` | corda | Não | Nome do índice compartilhado (o padrão é nome) |
| `namespace` | corda | Não | Namespace para o índice (gerado automaticamente se não for fornecido) |
| `region` | corda | Não | Dica de região para armazenamento (opcional) |
| `cloud` | corda | Não | Dica do provedor de nuvem (opcional) |


## Exemplo de solicitação

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## Resposta de sucesso

**Código de status**: `201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `message` | corda | Mensagem de sucesso |
| `index` | objeto | Objeto de índice criado |
| `index.id` | corda | Identificador de índice único |
| `index.name` | corda | Nome do índice |
| `index.sharedIndexName` | corda | Nome do índice compartilhado |
| `index.namespace` | corda | Espaço para nome do índice |
| `index.type` | corda | Tipo de índice (pessoal, geral, grupo, desconhecido) |
| `index.assignedUser` | objeto | Informações atribuídas ao usuário (se pessoais) |
| `index.assignedGroup` | objeto | Informações atribuídas ao grupo (se for grupo) |
| `index.createdAt` | corda | Carimbo de data e hora de criação |

## Exemplo de uso

### JavaScript

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

###Píton

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## Validações e regras de negócios

- **Normalização do nome do índice** (para verificações de armazenamento e exclusividade):
  - Minúsculas, corte os espaços em branco
  - Substitua espaços por hífens
  - Remova qualquer caractere que não esteja em `[a-z0-9-]`
- **Validação do nome do índice**: Deve corresponder a `^[a-z0-9-]{3,50}$`; caso contrário, retorna 400.
- **Unicidade**: `name` normalizado deve ser único; duplicatas retornam 409.
- **Cota de usuário atribuída**: Se `assignedUser` for fornecido, aplique a cota de índice de usuário por meio de `checkUserIndexQuota`; excedeu a cota retorna 403.
- **Restrição de região (Essencial)**: Para licença `Essential`, índices só podem ser criados com `cloud=aws` e `region=us-east-1`; caso contrário, 403.
- **Grupo atribuído**: Quando `assignedGroup` é fornecido, o grupo deve existir e não ser arquivado (`status != 'Archived'`); caso contrário, 400.

## Normalização e armazenamento

- `name` é armazenado normalizado.
- `sharedIndexName` padrão é o normalizado `name`.
- `namespace` é padronizado como `user-{userId}-index-{normalizedName}` quando atribuído a um usuário.

## Formas de erro típicas

### 400 Nome de índice inválido

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 Cota do índice excedida

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 Região não permitida

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
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
    "message": "Cannot create general indexes without admin privileges"
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

## Tipos de índice

| Tipo | Descrição | Permissões necessárias |
|------|-------------|----------|
| `personal` | Índice pessoal para uso individual | Privilégios de administrador |
| `general` | Índice organizacional compartilhado | Privilégios de administrador |
| `group` | Índice atribuído ao grupo | Privilégios de administrador |

## Campos obrigatórios

| Campo | Descrição | Exemplo |
|-------|------------|----------|
| `name` | Nome do índice | "minha base de conhecimento" |
| `region` | Região AWS | "nós-leste-1" |
| `cloud` | Provedor de nuvem | "ah" |

## Casos de uso

- **Atribuição de usuário**: crie índices e atribua-os a usuários específicos
- **Atribuição de grupo**: crie índices e atribua-os a grupos
- **Bases de conhecimento**: crie bases de conhecimento especializadas para domínios específicos
- **Organização de conteúdo**: organize o conteúdo por tópico ou categoria
- **Armazenamento de vetores**: crie índices para armazenar e recuperar incorporações de vetores

## Limites de taxa

- **Padrão**: 50 solicitações por minuto
- **Diariamente**: 5.000 solicitações por dia
- **Mensal**: 150.000 solicitações por mês

## Notas

- Este endpoint só é acessível por administradores
- Campos obrigatórios: nome, região, nuvem são todos obrigatórios
- Atribuição: o índice pode ser atribuído a um usuário (assignedUser) ou grupo (assignedGroup)
- Geração automática: o namespace é gerado automaticamente se não for fornecido
- Nomes exclusivos: os nomes dos índices devem ser exclusivos em todo o sistema
- O índice fica imediatamente disponível para uso após a criação
- Dimensão: a dimensão vetorial é gerenciada internamente pela aplicação (atualmente 4096)
- Métrica: a métrica de similaridade é gerenciada internamente pelo aplicativo