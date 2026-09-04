---
title: "Métricas de Uso y Consumo"
sidebar_label: "Uso y Consumo"
description: "Instantánea de puntos de autoservicio, presupuesto y límite de tarifa para una clave API"
openapi: "GET /usage"
---

# Uso y cuota

Devuelve una instantánea de autoservicio de la cuota y el uso de la clave API de llamada: el depósito de puntos del usuario facturado, el presupuesto de uso por modelo cuando está habilitado y los límites de solicitud y de tasa de la propia clave. Estos son los mismos datos que de otro modo leerías en el panel de administración, expuestos al poseedor de la clave.

## Endpoint

```
GET /usage
```

## Autenticación

```bash
Authorization: Bearer sk-your-api-key-here
```

## Ejemplo de solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

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

| Campo | Descripción |
|-------|-------------|
| `points.remaining` | Puntos que quedan en el depósito del usuario facturado. |
| `points.monthly_limit` | La asignación de puntos mensual del usuario. |
| `points.next_renewal` | Marca de tiempo ISO de la próxima renovación de puntos. |
| `usage_by_model` | Cuando el usuario facturado está en el modo de facturación Uso por modelo: `dollar_limit`, `current_spend`, `remaining_budget`. De lo contrario `{ "enabled": false }`. |
| `api_key.billing_mode` | `user-completions` o `usage-by-model` — consulte [Modos de facturación](/api/billing-modes). |
| `api_key.daily` / `api_key.monthly` | Los contadores de solicitudes de la clave (`used`, `limit`, `remaining`). |
| `api_key.rate_limit` | Límites de solicitud por minuto y por hora. |
| `api_key.expires_at` | Marca de tiempo de vencimiento ISO, o `null` si la clave nunca caduca. |

## Notas

- Los valores reflejan el usuario **facturado**, que puede diferir del propietario de la clave cuando las solicitudes utilizan `user_id` facturación en nombre de.
- Para obtener una vista previa de si una solicitud *específica* superará su cuota (sin gasto), use [Policy Check](/api/policy-check) y lea `checks.quota`.

## Relacionado

- [Modos de facturación](/api/billing-modes)
- [Descripción general de autenticación](/api/auth/overview)
- [Verificación de políticas](/api/policy-check)