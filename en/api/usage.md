---
title: "Usage & Quota"
sidebar_label: "Usage"
description: "Self-service points, budget, and rate-limit snapshot for an API key"
openapi: "GET /usage"
---



# Usage & Quota

Return a self-service snapshot of the calling API key's quota and usage: the billed user's points bucket, the Usage-by-Model budget when enabled, and the key's own request limits and rate limits. This is the same data you'd otherwise read from the admin panel, exposed to the key holder.

## Endpoint

```
GET /usage
```

## Authentication

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request Example

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

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

### Fields

| Field | Description |
|-------|-------------|
| `points.remaining` | Points left in the billed user's bucket. |
| `points.monthly_limit` | The user's monthly points allowance. |
| `points.next_renewal` | ISO timestamp of the next points renewal. |
| `usage_by_model` | When the billed user is on the Usage-by-Model billing mode: `dollar_limit`, `current_spend`, `remaining_budget`. Otherwise `{ "enabled": false }`. |
| `api_key.billing_mode` | `user-completions` or `usage-by-model` — see [Billing Modes](/en/api/billing-modes). |
| `api_key.daily` / `api_key.monthly` | The key's request counters (`used`, `limit`, `remaining`). |
| `api_key.rate_limit` | Per-minute and per-hour request ceilings. |
| `api_key.expires_at` | ISO expiry timestamp, or `null` if the key never expires. |

## Notes

- Values reflect the **billed** user, which may differ from the key owner when requests use `user_id` on-behalf-of billing.
- To preview whether a *specific* request would pass its quota (without spending), use [Policy Check](/en/api/policy-check) and read `checks.quota`.

## Related

- [Billing Modes](/en/api/billing-modes)
- [Authentication Overview](/en/api/auth/overview)
- [Policy Check](/en/api/policy-check)
