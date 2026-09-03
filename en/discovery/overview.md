---
sidebar_position: 1
title: "AI Discovery & Inventory Overview"
sidebar_label: "Overview"
description: "How SecureAI discovers and inventories every AI agent, model, identity, and shadow-AI source across your organization"
---



# AI Discovery & Inventory

SecureAI builds a single, continuously-updated inventory of the AI in your organization — the agents and models you run, the identities behind them, and the shadow AI you didn't know about. It does this from **three complementary discovery signals**, all surfaced under **Admin → Agent Registry**.

## The three signals

| Signal | Sees | Fed by |
|--------|------|--------|
| **Cloud APIs** | Agents, models, deployments, and identities inside your AI platforms. | [Cloud AI Provider](/en/integrations/cloud/overview) connectors → [Cloud Sensors](/en/discovery/cloud-sensors) |
| **Network / CASB** | Corporate source IPs calling LLM APIs, with no agent installed. | [CASB / SWG](/en/integrations/casb/overview) connectors → [Network Sources](/en/discovery/network-sources) |
| **Endpoint agent** | AI/MCP activity on managed laptops and servers. | [OS Agent](/en/agent/overview) |

Identities discovered across all signals roll up into the [NHI Inventory](/en/discovery/nhi-inventory), and the logical agents/chatbots you govern live in the [Agent Registry](/en/discovery/agent-registry).

## The inventory tabs

Under **Admin → Agent Registry** you'll find:

- **[Cloud Sensors](/en/discovery/cloud-sensors)** — cloud-discovered agents and models.
- **[Network Sources](/en/discovery/network-sources)** — shadow-AI sources found in CASB/SWG logs.
- **[NHI Inventory](/en/discovery/nhi-inventory)** — non-human identities (keys, service accounts) with block/revoke controls.
- **[Agent Registry](/en/discovery/agent-registry)** — governance metadata for your logical AI agents and chatbots.

## Why it matters

You can't govern what you can't see. Discovery gives you the denominator: every model endpoint, every key, every device or workload touching AI — so policy, cost control, and incident response apply to your *whole* estate, not just the parts that were declared.

## Related

- [Cloud AI Providers](/en/integrations/cloud/overview)
- [CASB & Network (SWG)](/en/integrations/casb/overview)
- [Endpoint Agent](/en/agent/overview)
