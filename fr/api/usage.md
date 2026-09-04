---
title: "Utilisation et quotas"
sidebar_label: "Usage"
description: "Points libre-service, budget et instantané de la limite de débit pour une clé API"
openapi: "GET /usage"
---
# Utilisation et quotas

Renvoie un instantané en libre-service du quota et de l'utilisation de la clé API appelante : le compartiment de points de l'utilisateur facturé, le budget d'utilisation par modèle lorsqu'il est activé, ainsi que les propres limites de requêtes et limites de débit de la clé. Il s'agit des mêmes données que vous liriez autrement dans le panneau d'administration, exposées au détenteur de la clé.

## Point de terminaison

```
GET /usage
```

## Authentification

```bash
Authorization: Bearer sk-your-api-key-here
```

## Exemple de demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

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

### Champs

| Champ | Descriptif |
|-------|-------------|
| `points.remaining` | Points restants dans le bucket de l'utilisateur facturé. |
| `points.monthly_limit` | L'allocation mensuelle de points de l'utilisateur. |
| `points.next_renewal` | Horodatage ISO du prochain renouvellement des points. |
| `usage_by_model` | Lorsque l'utilisateur facturé est en mode de facturation Utilisation par modèle : `dollar_limit`, `current_spend`, `remaining_budget`. Sinon `{ "enabled": false }`. |
| `api_key.billing_mode` | `user-completions` ou `usage-by-model` — voir [Modes de facturation](/fr/api/billing-modes). |
| `api_key.daily` / `api_key.monthly` | Les compteurs de requêtes de la clé (`used`, `limit`, `remaining`). |
| `api_key.rate_limit` | Plafonds de demande par minute et par heure. |
| `api_key.expires_at` | Horodatage d'expiration ISO, ou `null` si la clé n'expire jamais. |

## Remarques

- Les valeurs reflètent l'utilisateur **facturé**, qui peut différer du propriétaire de la clé lorsque les demandes utilisent `user_id` pour le compte de la facturation.
- Pour prévisualiser si une requête *spécifique* dépassera son quota (sans dépenses), utilisez [Policy Check](/fr/api/policy-check) et lisez `checks.quota`.

## Connexes

- [Modes de facturation](/fr/api/billing-modes)
- [Présentation de l'authentification](/fr/api/auth/overview)
- [Policy Check](/fr/api/policy-check)