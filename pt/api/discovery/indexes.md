---
sidebar_position: 2
title: "Bases de Conhecimento Disponíveis"
openapi: "GET /indexes"
sidebar_label: "Bases Disponíveis"
---

# Obtenha bases de conhecimento disponíveis

Recupere bases de conhecimento (índices) disponíveis que sua chave de API pode acessar.

## Ponto final

```
GET /indexes
```

## Descrição

Recupere bases de conhecimento (índices) disponíveis que sua chave de API pode acessar. Inclui índices pessoais, índices compartilhados e a opção Conhecimento Zero.

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas | `true` |
| `indexes` | matriz | Lista de bases de conhecimento disponíveis | Veja exemplo |
| `restrictions` | objeto | Restrições de acesso ao índice | Veja exemplo |

### Objeto de índice

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `id` | corda | Identificador de índice único | `"my-knowledge-base"` |
| `name` | corda | Nome de exibição do índice | `"my-knowledge-base"` |
| `type` | corda | Tipo de índice | `"personal"` |
| `namespace` | corda | Namespace de índice (opcional) | `"user-namespace"` |
| `description` | corda | Descrição do índice (opcional) | `"Direct AI responses..."` |

### Tipos de índice

| Tipo | Descrição |
|------|-------------|
| `system` | Índices fornecidos pelo sistema (por exemplo, Zero-Knowledge) |
| `personal` | Bases de conhecimento pessoal do usuário |
| `general` | Bases de conhecimento compartilhadas |

### Objeto de restrições

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `allowed_indexes` | corda | Descrição dos índices permitidos | `"all user indexes"` |

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
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

###Píton

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Índices Especiais

### Conhecimento Zero

O índice `Zero-Knowledge` é um índice de sistema especial que fornece respostas diretas de IA sem recuperação da base de conhecimento. Use isso quando quiser:

- Respostas puras de IA sem RAG
- Testando capacidades do modelo de IA
- Conversa geral sem contexto específico

## Notas

- O índice Zero-Knowledge está sempre disponível
- Índices pessoais são criados pelo usuário
- O acesso aos índices depende das suas permissões
- Use o ID do índice em solicitações de conclusão de chat