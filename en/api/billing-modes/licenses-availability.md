---
id: licenses-availability
title: "Licenses Availability"
sidebar_label: "Licenses Availability"
description: "Retrieve current license pool limits, usage, and remaining (admin only)"
openapi: "GET /licenses/availability"
---



# Licenses Availability

Retrieve license pool limits, current usage, and remaining licenses for each tier.

## Endpoint

```
GET /licenses/availability
```

## Description

Returns the license pool status for all license tiers, including limits, current usage, and remaining capacity. Admin-only endpoint.

## Authentication

**Required**: API Key with admin privileges

```
Authorization: Bearer sk-your-api-key-here
```

## Request

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `limits` | object | License pool configured limits per tier |
| `usage` | object | Current assigned/used licenses per tier |
| `remaining` | object | Remaining licenses per tier |

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## Notes

- Admin-only endpoint
- Remaining may be reported as `Infinity` when no pool limit is enforced for that tier
- Values are organization-wide aggregates
