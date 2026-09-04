---
sidebar_position: 7
title: "Proxy Transparente (Roteamento Local de IA)"
sidebar_label: "Proxy Transparente"
description: "Route developer AI traffic (e.g. Claude Code) through the SecureAI gateway from the endpoint"
---




# Transparent Proxy (AI Routing)

The agent can transparently route a developer's AI traffic — for example [Claude Code](/pt/integrations/ide-claude-code) — through the SecureAI gateway. This brings coding-assistant usage under the same governance, cost tracking, and policy as the rest of your AI estate, without the developer changing their tools.

## How it works

Routing is configured per [policy](/pt/agent/policies-and-groups) via `claudeCodeRouting`:

| Setting | Description |
|---------|-------------|
| **Enabled** | Turn routing on for devices under this policy. |
| **Lock** | `user` (developer may toggle), `force_on` (always routed), or `force_off` (never routed). |
| **Model mappings** | Per-family mapping for `opus` / `sonnet` / `haiku` to the model actually served. |
| **Model lock** | `user` or `force` — whether the developer may change the mapping. |

When routing is enabled, SecureAI **mints a per-device API key** and injects it into the endpoint's environment (e.g. as `ANTHROPIC_AUTH_TOKEN`) via the transparent-proxy configuration. Usage is **billed to the linked developer's points bucket**, so make sure the device is linked to an owner user (see [Enrollment & Packages](/pt/agent/enrollment-and-packages)).

## Fleet-wide defaults

Gateway defaults can be set once for the fleet — `anthropicBaseUrl`, `openaiBaseUrl`, the auth token, and a lock — and inherited by devices. The agent reports whether the proxy is currently on or off, and those transitions are audited.

## Why route instead of block

For sanctioned developer AI, routing through the gateway is usually preferable to an [egress block](/pt/agent/egress-enforcement): the developer keeps working, while you gain policy enforcement, cost attribution, and audit on that traffic. Reserve blocking/lockdown for unsanctioned providers.

## Related

- [Egress Enforcement](/pt/agent/egress-enforcement)
- [Policies & Groups](/pt/agent/policies-and-groups)
- [AI Gateway Overview](/pt/ai-gateway/overview)
- [Claude Code IDE Integration](/pt/integrations/ide-claude-code)
