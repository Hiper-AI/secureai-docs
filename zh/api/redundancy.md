---
title: "Redundancy & Failover"
sidebar_label: "Redundancy & Failover"
description: "Caller-defined model failover chains for the SecureAI Completions API"
---


# Redundancy & Failover

The Completions API can automatically **fail over** from one model to another when a provider call fails. You define an ordered chain — a primary model plus up to two fallbacks — and SecureAI tries each in turn until one succeeds. This gives you resilience against provider outages, rate limits, and timeouts without any retry logic in your own code.

Redundancy is available on both the [classic `/chat/completions`](/api/chat/completions) endpoint and the [OpenAI-compatible `/v1/chat/completions`](/api/chat/openai-compatible) endpoint.

## How a chain is defined

There are three ways to request a chain, in precedence order:

| # | You send | Resulting chain |
|---|----------|-----------------|
| 1 | `models: ["a", "b", "c"]` | Exactly that chain (overrides `model`). |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`. |
| 3 | `model: "a"` alone | Uses the API key's admin-configured `failoverDefaults` if `a` appears in them (the chain starts at `a`'s position); otherwise a single attempt. |

A chain may contain **at most 3 distinct models**. Duplicate entries are collapsed. Each chain entry can be a plain model string or an object with per-attempt timeouts:

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

You cannot combine `models` and `fallback_models` in the same request.

## Chain-wide options (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

| Field | Range | Description |
|-------|-------|-------------|
| `timeout_ms` | 1000–300000 | Per-attempt overall timeout. |
| `first_token_timeout_ms` | 500–60000 | For streaming: how long to wait for the first content token before failing over. |
| `on` | subset of the triggers below | Which failure classes trigger failover. Defaults to all four. |

Per-attempt timeouts (set inside a `models[]` entry) override the chain-wide values for that attempt.

## Failover triggers

A failed attempt is classified into one of these reasons; failover happens only if the reason is in your `on` list **and** there is another model left in the chain:

| Reason | Cause |
|--------|-------|
| `connection_error` | Connection refused/reset, DNS/fetch failure. |
| `server_error` | Provider returned HTTP 5xx. |
| `rate_limit` | Provider returned HTTP 429. |
| `timeout` | The attempt exceeded `timeout_ms` (or `first_token_timeout_ms` while streaming). |

Failures that are **not** retryable never trigger failover — for example an intentional gateway rate-limit/token-budget block, an open circuit breaker, or a policy/validation rejection. A fallback would fail identically or the block is deliberate.

## Streaming behavior

For streaming requests, **failover is only possible before the first content token arrives.** SecureAI pulls the upstream stream until the first token (bounded by `first_token_timeout_ms`); if that fails, it fails over to the next model. Once the first token has been sent to your client, the serving model is locked in — a later mid-stream interruption is surfaced as an `error` frame, not a failover.

## What you get back

When a multi-model chain runs, the response includes a **failover report**:

- Classic endpoint: `metadata.failover`
- OpenAI-compatible endpoint: `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` tells you which model actually answered, and `requested_model` is the first model in the chain. A single-model (legacy) request produces no failover report.

## When the whole chain fails

If every attempt fails, the request returns an error listing all attempts:

- **429** if *every* failure was a rate limit.
- **502** otherwise.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

On the OpenAI-compatible endpoint the same condition returns the OpenAI error envelope with `code: "all_models_failed"`.

## Admin defaults (`failoverDefaults`)

An administrator can attach a default chain to an API key so callers get failover without sending a chain on every request. Configured in **Admin → API Keys**, the payload is validated and clamped:

- `models`: up to 3 distinct model names.
- `timeout_ms`: 1000–300000.
- `first_token_timeout_ms`: 500–60000.
- `on`: any subset of the four triggers.

When a caller sends just `model: "a"` and `a` is present in `failoverDefaults.models`, the chain starts at `a`'s position and continues through the remaining defaults.

## Security & billing per attempt

Every attempt is a full, independent call through the SMLTP wrapper — policy enforcement, egress/residency governance, and the Signed Entitlement Token mint all re-run per attempt, bound to that attempt's model and exact request bytes. Billing reflects the model that actually served the response. Each failover also emits an `api:model_failover` security event (delivered to any subscribed [webhooks](/zh/api/webhooks/overview)) and an audit-log entry.

## Related

- [Chat Completion](/zh/api/chat/completions)
- [OpenAI-compatible Endpoint](/zh/api/chat/openai-compatible)
- [Policy Check](/zh/api/policy-check) — preview the whole chain's access without spending points.
- [Webhooks](/zh/api/webhooks/overview) — subscribe to `api:model_failover`.
