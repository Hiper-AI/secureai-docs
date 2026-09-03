---
id: licenses-availability
title: "Disponibilidade de licenças"
sidebar_label: "Disponibilidade de licenças"
description: "Recuperar limites atuais do pool de licenças, uso e restante (somente administrador)"
openapi: "GET /licenses/availability"
---
# Disponibilidade de licenças

Recupere os limites do pool de licenças, o uso atual e as licenças restantes para cada nível.

## Ponto final

```
GET /licenses/availability
```

## Descrição

Retorna o status do pool de licenças para todos os níveis de licença, incluindo limites, uso atual e capacidade restante. Endpoint somente administrador.

## Autenticação

**Obrigatório**: Chave de API com privilégios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Indica se a operação foi bem sucedida |
| `limits` | objeto | Limites configurados do pool de licenças por nível |
| `usage` | objeto | Licenças atuais atribuídas/utilizadas por nível |
| `remaining` | objeto | Licenças restantes por nível |

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

## Notas

- Endpoint somente administrador
- O restante pode ser relatado como `Infinity` quando nenhum limite de pool for aplicado para esse nível
- Os valores são agregados de toda a organização