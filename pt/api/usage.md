---
title: "Métricas de Uso e Consumo"
sidebar_label: "Uso e Consumo"
description: "Pontos de autoatendimento, orçamento e instantâneo de limite de taxa para uma chave de API"
openapi: "GET /usage"
---

# Uso e cota

Retorne um instantâneo de autoatendimento da cota e do uso da chave de API de chamada: o bucket de pontos do usuário faturado, o orçamento de uso por modelo quando habilitado e os limites de solicitação e de taxa da própria chave. Esses são os mesmos dados que você leria no painel de administração, expostos ao detentor da chave.

## Ponto final

```
GET /usage
```

## Autenticação

```bash
Authorization: Bearer sk-your-api-key-here
```

## Exemplo de solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

```json
{
  "success": true,
  "points": {
    "remaining": 4188,
    "monthly_limit": 5000,
    "next_renewal": "2026-08-01T00:00:00.000Z"
  },
  "usage_by_model": {
    "enabled": true,
    "dollar_limit": 250,
    "current_spend": 61.4,
    "remaining_budget": 188.6
  },
  "api_key": {
    "name": "Production integration",
    "billing_mode": "user-completions",
    "daily": { "used": 120, "limit": 1000, "remaining": 880 },
    "monthly": { "used": 3400, "limit": 10000, "remaining": 6600 },
    "rate_limit": { "requests_per_minute": 60, "requests_per_hour": 1000 },
    "expires_at": null
  }
}
```

### Campos

| Campo | Descrição |
|-------|------------|
| `points.remaining` | Pontos restantes no bucket do usuário faturado. |
| `points.monthly_limit` | A cota mensal de pontos do usuário. |
| `points.next_renewal` | Carimbo de data e hora ISO da próxima renovação de pontos. |
| `usage_by_model` | Quando o usuário cobrado está no modo de cobrança por uso por modelo: `dollar_limit`, `current_spend`, `remaining_budget`. Caso contrário `{ "enabled": false }`. |
| `api_key.billing_mode` | `user-completions` ou `usage-by-model` — consulte [Modos de cobrança](/pt/api/billing-modes). |
| `api_key.daily` / `api_key.monthly` | Os contadores de solicitação da chave (`used`, `limit`, `remaining`). |
| `api_key.rate_limit` | Limites de solicitação por minuto e por hora. |
| `api_key.expires_at` | Carimbo de data e hora de expiração ISO ou `null` se a chave nunca expirar. |

## Notas

- Os valores refletem o usuário **faturado**, que pode diferir do proprietário da chave quando as solicitações usam `user_id` em nome do faturamento.
- Para visualizar se uma solicitação *específica* ultrapassaria sua cota (sem gastos), use [Policy Check](/pt/api/policy-check) e leia `checks.quota`.

## Relacionado

- [Modos de cobrança](/pt/api/billing-modes)
- [Visão geral da autenticação](/pt/api/auth/overview)
- [Verificação de política](/pt/api/policy-check)