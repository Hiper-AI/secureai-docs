---
sidebar_position: 3
title: "Políticas de Segurança Descobertas"
openapi: "GET /smltp-policies"
sidebar_label: "Políticas de Segurança"
---

# Obtenha políticas de segurança

Recuperar políticas de segurança SMLTP (Secure Model Language Transfer Protocol) disponíveis.

## Ponto final

```
GET /smltp-policies
```

## Descrição

Recuperar políticas de segurança SMLTP (Secure Model Language Transfer Protocol) disponíveis. Estas políticas determinam como os seus dados são processados ​​e protegidos.

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas | `true` |
| `policies` | matriz | Lista de políticas de segurança disponíveis | Veja exemplo |
| `restrictions` | objeto | Restrições de acesso à política | Veja exemplo |

### Objeto de Política

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `id` | corda | Identificador único de política | `"internal"` |
| `name` | corda | Nome de exibição da política | `"Internal"` |
| `description` | corda | Descrição da política | `"For internal company data"` |

### Objeto de restrições

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `allowed_policies` | matriz | Matriz de IDs de políticas permitidas | `["public", "internal", "confidential"]` |

## Respostas de erro

### 401 Não autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Exemplo de uso

###JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

###Píton

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Tipos de políticas

### Público
- **Caso de uso**: dados públicos e não confidenciais
- **Nível de segurança**: Baixo
- **Processamento de Dados**: Processamento padrão com segurança básica

### Interno
- **Caso de uso**: dados internos da empresa
- **Nível de segurança**: Médio
- **Processamento de dados**: segurança aprimorada com proteções adicionais

### Confidencial
- **Caso de uso**: dados comerciais confidenciais
- **Nível de segurança**: Alto
- **Processamento de dados**: Máxima segurança com tratamento rigoroso de dados

## Notas

- Escolha a política apropriada com base na sensibilidade dos seus dados
- As políticas afetam a forma como seus dados são processados e protegidos
- Use o ID da política em solicitações de conclusão de chat
- Algumas políticas podem ser restritas com base no seu tipo de conta