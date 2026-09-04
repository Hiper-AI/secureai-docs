---
title: "使用及配额"
sidebar_label: "用法"
description: "API 密钥的自助服务积分、预算和速率限制快照"
openapi: "GET /usage"
---
# 使用及配额

返回调用 API 密钥的配额和使用情况的自助服务快照：计费用户的积分桶、启用时的按模型使用预算，以及密钥自己的请求限制和速率限制。这与您从管理面板读取的数据相同，暴露给密钥持有者。

## 端点

```
GET /usage
```

## 身份验证

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求示例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

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

### 字段

|领域 |描述 |
|--------|-------------|
| `points.remaining` |计费用户存储桶中剩余的积分。 |
| `points.monthly_limit` |用户每月的积分津贴。 |
| `points.next_renewal` |下一个点更新的 ISO 时间戳。 |
| `usage_by_model` |当计费用户采用按型号计费模式时：`dollar_limit`、`current_spend`、`remaining_budget`。否则`{ "enabled": false }`。 |
| `api_key.billing_mode` | `user-completions` 或 `usage-by-model` — 请参阅[计费模式](/zh/api/billing-modes)。 |
| `api_key.daily` / `api_key.monthly` |密钥的请求计数器（`used`、`limit`、`remaining`）。 |
| `api_key.rate_limit` |每分钟和每小时的请求上限。 |
| `api_key.expires_at` | ISO 过期时间戳，如果密钥永不过期，则为 `null`。 |

## 注释

- 值反映 **计费** 用户，当请求使用 `user_id` 代表计费时，该用户可能与密钥所有者不同。
- 要预览*特定*请求是否会超过其配额（无需支出），请使用[策略检查](/zh/api/policy-check)并阅读`checks.quota`。

## 相关

- [计费模式](/zh/api/billing-modes)
- [认证概述](/zh/api/auth/overview)
- [策略检查](/zh/api/policy-check)