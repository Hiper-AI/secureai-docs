---
sidebar_position: 1
title: "Authentication Overview"
---



# API Authentication

SecureAI uses API key authentication for all external API access. Keys are Bearer tokens created and configured by administrators, with per-key controls over models, policies, limits, billing, and security.

## Authentication Header

```http
Authorization: Bearer sk-your-api-key-here
```

**API Key Format:**
- Starts with an `sk-` prefix (e.g. `sk-8cd5253f...`).
- The prefix is followed by a 64-character hexadecimal secret.
- Only a SHA-256 hash of the key is stored server-side — the full key is shown **once**, at creation. If it's lost, rotate/recreate the key.

All API calls require HTTPS.

## Creating & configuring API keys

Administrators create keys in **Admin → API Keys** (API base `/api/admin/api-keys`, admin-only). The full key is returned once on creation. Each key carries the following configuration:

### Ownership & billing

| Setting | Description |
|---------|-------------|
| `name` | Human-readable label. |
| `userId` | The user account this key belongs to / bills against. |
| `billingMode` | `user-completions` (deduct from the user's completion allowance) or `usage-by-model` (deduct a dollar budget by model cost). See [Billing Modes](/en/api/billing-modes). |

Callers can bill an individual request to a **different** user with the `user_id` body parameter (admin-gated).

### Limits

| Setting | Description |
|---------|-------------|
| `dailyLimit` | Max requests per day for this key. |
| `monthlyLimit` | Max requests per month for this key. |
| `rateLimit.requestsPerMinute` | Per-minute ceiling (up to 1000). |
| `rateLimit.requestsPerHour` | Per-hour ceiling (up to 10000). |
| `expiresAt` | Optional expiry; omit for a non-expiring key. |

### Allowlists

| Setting | Description |
|---------|-------------|
| `allowedModels[]` | If set, the key may use **only** these models. Empty = the license default catalog. |
| `allowedIndexes[]` | Restricts which knowledge bases the key can query. |
| `allowedSMLTPPolicies[]` | SMLTP policies the key may request (default `["public", "internal"]`). Validated against the policy resolver, so tenant custom policies are allowed. |

### Prompt Shield

| Setting | Description |
|---------|-------------|
| `enablePromptShield` | Turn Prompt Shield on for this key. |
| `promptShieldSensitivity` | `strict`, `balanced`, or `permissive`. |
| `promptShieldPolicyId` | Bind a specific Prompt Shield policy to the key. |
| `allowedPromptShieldPolicies[]` | Policies the caller may select per call via `prompt_shield.policy`. |

See [Prompt Shield API](/en/api/threat-defense/prompt-shield).

### Redundancy defaults

`failoverDefaults` attaches a default model [failover chain](/en/api/redundancy) to the key: `models[]` (up to 3), `timeout_ms` (1000–300000), `first_token_timeout_ms` (500–60000), and `on[]` triggers. Callers then get failover without sending a chain on every request.

## Idempotency

Completion `POST`s accept an `Idempotency-Key` header. Retrying with the same key returns the original result instead of billing a second time — use it to make network retries safe. See [Chat Completion](/en/api/chat/completions).

## Rate limiting

Default ceilings (configurable per key):

- **Per minute**: 60 requests
- **Per hour**: 1000 requests
- **Daily**: 100 requests
- **Monthly**: 10,000 requests

A key holder can read its own live quota and limits via [`GET /usage`](/api/usage).

## Security features

- **HTTPS only** — all API calls require TLS.
- **Hashed at rest** — only a SHA-256 hash of each key is stored.
- **Usage tracking & audit logging** — every call and authentication event is logged.
- **SMLTP compliance** — security policies are enforced on every request.

## Error Responses

### Authentication error

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Rate limit error

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Common Error Codes

| Error | Description |
|-------|-------------|
| `Invalid API key` | API key is invalid, expired, or revoked. |
| `Rate limit exceeded: too many requests per minute` | Per-minute rate limit exceeded. |
| `Rate limit exceeded: too many requests per hour` | Per-hour rate limit exceeded. |
| `Access denied` | Model, index, or policy not allowed for this key. |

## Next Steps

- [API Reference](/en/api) — Explore all available external endpoints.
- [Chat Completions](/en/api/chat/completions) — Start integrating completions.
- [OpenAI-Compatible Endpoint](/en/api/chat/openai-compatible) — Reuse an existing OpenAI SDK.
- [Usage](/en/api/usage) — Check quota and limits.
