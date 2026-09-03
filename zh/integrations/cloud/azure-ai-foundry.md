---
sidebar_position: 4
title: "Azure AI Foundry"
sidebar_label: "Azure AI Foundry"
description: "Connect Azure AI Foundry / Azure OpenAI so SecureAI can inventory agents, models, identities, RBAC, usage, and cost"
---


# Azure AI Foundry

Connect your Azure tenant so SecureAI can inventory Azure OpenAI / AI Foundry agents, AI Search, Bot Service and ML endpoints, along with the Entra identities and RBAC that govern them.

## What SecureAI imports

- **Azure OpenAI / AI Foundry agents, AI Search, Bot Service, and ML endpoints**
- **NHIs** — Entra service principals, app secrets & certificates, and managed identities (revocable — see [NHI Inventory](/zh/discovery/nhi-inventory))
- **Azure RBAC** role assignments
- **Activity logs**
- **Usage, tokens, and spend** for the last 30 days

## Prerequisites

- An **Entra ID (Azure AD) app registration** (service principal) with a client secret.
- **Microsoft Graph application permissions** granted with admin consent:
  - `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` (read).
  - `Application.ReadWrite.All` — **only** if you want SecureAI to revoke identities at the source.
- The service principal assigned a **Reader** role on the relevant subscription(s)/resource groups.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| `tenantId` | Yes | Directory (tenant) ID. |
| `clientId` | Yes | Application (client) ID of the app registration. |
| `clientSecret` | Yes | Client secret. Encrypted at rest. |
| `subscriptionId` | No | Scope discovery to a specific subscription. |

SecureAI authenticates via OAuth2 (client-credentials service-principal flow).

### Where to get them

1. In the [Azure portal](https://portal.azure.com/), go to **Microsoft Entra ID → App registrations → New registration**.
2. Copy the **Directory (tenant) ID** and **Application (client) ID** from the app's Overview.
3. Under **Certificates & secrets**, create a **client secret** and copy its value.
4. Under **API permissions**, add the Microsoft Graph permissions above and **Grant admin consent**.
5. Assign the app the **Reader** role on the target subscription (**Subscriptions → Access control (IAM)**).

## Connect

1. **Admin → Integrations → Cloud → Azure AI Foundry → Connect.**
2. Enter tenant, client, secret (and optional subscription).
3. **Test**, then **Save**.
4. **Sync** (Azure syncs can take several minutes — multi-service + Graph + activity-log sweeps).

## Verify

Open [Cloud Sensors](/zh/discovery/cloud-sensors) for discovered agents/endpoints and [NHI Inventory](/zh/discovery/nhi-inventory) for service principals, secrets, and managed identities. Insights show RBAC, usage, and spend.

## Revocation

Entra service principals, app secrets/certs, and managed identities are **revocable** via Microsoft Graph from [NHI Inventory](/zh/discovery/nhi-inventory) — this requires the `Application.ReadWrite.All` permission above.

## Related

- [Cloud AI Providers Overview](/zh/integrations/cloud/overview)
- [Microsoft Entra ID SSO](/zh/iam/microsoft-entra-id)
- [NHI Inventory](/zh/discovery/nhi-inventory)
