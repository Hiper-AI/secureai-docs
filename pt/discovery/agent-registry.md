---
sidebar_position: 5
title: "Agent Registry"
sidebar_label: "Agent Registry"
description: "Govern your logical AI agents and chatbots — owners, purpose, autonomy level, risk, and bindings"
---



# Agent Registry

The **Agent Registry** (Admin → Agent Registry → **AI Agents**) is the governance inventory of your **logical** AI agents and chatbots — the applications and assistants your organization builds and runs. It records the metadata you need to govern each one: who owns it, what it's for, how autonomous it is, and what it's connected to.

<Info>
**Not the endpoint fleet**

The Agent Registry is about *logical* AI agents (a support chatbot, an internal copilot). It's different from the **OS Agents** fleet — the SecureAI software installed on endpoints, documented under [Endpoint Agent](/pt/en/agent/overview).
</Info>

## What's recorded per agent

| Field | Description |
|-------|-------------|
| **Owner** | The accountable user/team. |
| **Purpose** | What the agent does. |
| **Autonomy** | Level **L1–L3**, from assistive to fully autonomous. |
| **Risk** | Governance risk rating. |
| **Bindings** | Connected MCP servers and datasets/knowledge bases. |
| **Monitoring** | For chatbots, the monitoring/Prompt-Shield configuration. |

## Working with the registry

- **Import** agents to bootstrap the inventory.
- Review **relationships** between agents, their tools, and their data.
- **Apply suggested autonomy** — accept a recommended autonomy level for an agent.
- Register chatbots for monitoring; a chatbot first seen through the [Prompt Shield API](/pt/en/api/threat-defense/prompt-shield) is auto-registered here as `observed` for your review.

## Related

- [Endpoint Agent](/pt/en/agent/overview) — the OS-level agent fleet (distinct from this).
- [NHI Inventory](/pt/en/discovery/nhi-inventory) — the identities agents authenticate with.
- [Prompt Shield API](/pt/en/api/threat-defense/prompt-shield) — auto-registers chatbots.
- [AI Discovery & Inventory Overview](/pt/en/discovery/overview)
