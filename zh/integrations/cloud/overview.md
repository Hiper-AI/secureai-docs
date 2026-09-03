---
sidebar_position: 1
title: "Cloud AI Providers Overview"
sidebar_label: "Overview"
description: "Connect your OpenAI, Anthropic, Azure, AWS, and GCP AI platforms so SecureAI can inventory agents, models, identities, usage, and cost"
---


# Cloud AI Providers

Cloud AI Provider connectors let SecureAI reach into the AI platforms your organization already uses — **OpenAI Platform, Anthropic Console, Azure AI Foundry, and Google Vertex AI** — and automatically inventory everything running there. No agent or SDK needs to be deployed on the provider side; SecureAI polls each provider's management API with read-mostly credentials you supply.

Once connected, a connector discovers and continuously syncs:

- **Agents, models, and deployments** running on the platform → shown in [Cloud Sensors](/zh/discovery/cloud-sensors).
- **Non-Human Identities (NHIs)** — API keys, service accounts, and (where supported) BYOK keys → shown in [NHI Inventory](/zh/discovery/nhi-inventory), with block/revoke controls.
- **Usage, tokens, and cost** for the last 30 days.
- **Governance signals** — IAM/RBAC bindings, spend limits, and audit logs, surfaced in per-provider Insights.

## The setup loop

Every provider follows the same four steps:

1. **Open Admin → Integrations** and select the **Cloud** category.
2. **Connect** the provider card and enter its credentials (see each provider's page).
3. **Test** the connection to validate the credentials.
4. **Sync** — the first sync runs a full import; subsequent syncs are incremental and also run on a schedule.

<Info>
**Where things appear**

Connector **setup** lives in **Admin → Integrations**. The **inventory** it produces appears in **Admin → Agent Registry**: discovered agents/models under [Cloud Sensors](/zh/discovery/cloud-sensors), and discovered identities under [NHI Inventory](/zh/discovery/nhi-inventory). You can re-run a sync from either place.
</Info>

## Choosing credentials

Use **read-only / viewer** credentials wherever possible — SecureAI only needs to *read* your inventory to build the picture. Some optional capabilities (revoking a leaked key, creating a spend alert) require additional write permissions; each provider page calls these out explicitly, and they are always optional.

All secrets you enter (client secrets, service-account JSON, admin API keys) are **encrypted at rest**.

## Provider guides

| Provider | Credential type |
|----------|-----------------|
| [OpenAI Platform](/zh/integrations/cloud/openai-platform) | Organization admin API key |
| [Anthropic Console](/zh/integrations/cloud/anthropic-console) | Admin API key (+ optional workspace / compliance keys) |
| [Azure AI Foundry](/zh/integrations/cloud/azure-ai-foundry) | Entra service principal (tenant/client/secret) |
| [Google Vertex AI](/zh/integrations/cloud/gcp-vertex-ai) | Service-account JSON |

## Related

- [Cloud Sensors](/zh/discovery/cloud-sensors) — the discovered agent/model inventory.
- [NHI Inventory](/zh/discovery/nhi-inventory) — the discovered identity inventory and revoke controls.
- [AI Discovery & Inventory Overview](/zh/discovery/overview)
