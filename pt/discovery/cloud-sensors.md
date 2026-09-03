---
sidebar_position: 2
title: "Cloud Sensors"
sidebar_label: "Cloud Sensors"
description: "The read-only inventory of agents and models discovered inside your connected AI cloud platforms"
---



# Cloud Sensors

**Cloud Sensors** (Admin → Agent Registry → **Cloud**) is the inventory of agents, models, and deployments discovered inside your connected cloud AI platforms — **Azure AI Foundry, AWS Bedrock, GCP Vertex AI, OpenAI Platform, and Anthropic Console**. It's read-only: you configure the connectors in [Integrations](/pt/en/integrations/cloud/overview) and Cloud Sensors shows what they found.

## KPIs

| KPI | Meaning |
|-----|---------|
| **Connected Providers** | How many cloud providers are configured and connected. |
| **Discovered Agents** | Total agents/models currently visible across providers. |
| **Active Cloud Agents** | Agents still present in the latest discovery. |
| **Auto-Retired** | Agents removed by a recent discovery (they disappeared from the provider). |

Each KPI carries a 30-day sparkline built from sync history.

## The inventory table

| Column | Description |
|--------|-------------|
| **Agent** | Discovered agent/model name. |
| **Provider** | Azure / AWS / GCP / OpenAI / Anthropic. |
| **Workspace / Deployment** | Where it lives on the provider. |
| **Model** | Underlying model. |
| **Status** | `observed`, `active`, or `retired` (with a `· auto` suffix when auto-retired by discovery). |
| **Last discovery** | When it was last seen. |

Filter by provider, status, or free-text search; export the visible rows to CSV.

## Syncing

Run **Sync** for a single provider or **Sync All**. Each provider also exposes an **Insights** dialog (usage, cost, governance details specific to that provider). Connector credentials and setup live in **Admin → Integrations → Cloud** — this tab links out to it, and the empty state points you there.

## Related

- [Cloud AI Providers](/pt/en/integrations/cloud/overview) — connect and configure the providers.
- [NHI Inventory](/pt/en/discovery/nhi-inventory) — identities discovered by the same connectors.
- [AI Discovery & Inventory Overview](/pt/en/discovery/overview)
