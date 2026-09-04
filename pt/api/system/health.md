---
sidebar_position: 1
title: "Health Check (Status do Sistema)"
openapi: "GET /health"
sidebar_label: "Health Check"
---

# Exame de saúde

Verifique se a API está funcionando e íntegra. Nenhuma autenticação necessária.

## Ponto final

```
GET /health
```

## Descrição

Este endpoint permite verificar se a API externa SecureAI está em execução e íntegra. Nenhuma autenticação é necessária para este endpoint.

## Solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Campos de resposta

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-------------|---------|
| `success` | booleano | Sempre verdadeiro para uma verificação de saúde bem-sucedida | `true` |
| `status` | corda | Estado de saúde da API | `"healthy"` |
| `timestamp` | corda | Carimbo de data/hora atual do servidor no formato ISO 8601 | `"2024-01-15T10:30:00.000Z"` |
| `version` | corda | Versão atual da API | `"1.0.0"` |

## Exemplo de uso

###JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

###Píton

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

###cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Notas

- Este endpoint não requer autenticação
- Use este endpoint para monitorar a disponibilidade da API
- A resposta inclui a versão atual da API para verificação de compatibilidade