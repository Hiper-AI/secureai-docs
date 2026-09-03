---
sidebar_position: 3
title: "Anthropic Console"
sidebar_label: "Anthropic Console"
description: "Connect the Anthropic Console so SecureAI can inventory workspaces, keys, usage, cost, and audit activity"
---



# Anthropic Console

Connect your Anthropic organization so SecureAI can inventory workspaces, API keys, service accounts, spend limits, and (on Enterprise) the audit log and Claude Code analytics.

## What SecureAI imports

- **Workspaces**, usage, and cost
- **NHIs** — API keys, service accounts, and BYOK keys (revocable — see [NHI Inventory](/en/discovery/nhi-inventory))
- **Spend limits**
- **Audit log** (Enterprise / Compliance API)
- **Claude Code analytics**

## Prerequisites

- **Admin** on the Anthropic Console.
- An **Admin API key** (`sk-ant-admin…`).
- *(Optional)* a **workspace key** to unlock Agent Platform data, and a **Compliance API key** (Enterprise) to unlock the Audit Log.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| `adminApiKey` | Yes | Organization admin key, format `sk-ant-admin…`. Encrypted at rest. |
| `apiKey` | No | Workspace key — unlocks Agent Platform inventory. |
| `complianceApiKey` | No | Enterprise Compliance API key — unlocks the Audit Log. |

### Where to get the admin key

1. Sign in to the [Anthropic Console](https://console.anthropic.com/) as an admin.
2. Go to **Settings → Admin keys** (organization-level).
3. Create an admin key and copy it.

## Connect

1. **Admin → Integrations → Cloud → Anthropic Console → Connect.**
2. Paste the admin key (and any optional keys).
3. **Test**, then **Save**.
4. **Sync**.

## Verify

Open [Cloud Sensors](/en/discovery/cloud-sensors) for discovered workspaces/agents and [NHI Inventory](/en/discovery/nhi-inventory) for keys and service accounts. Insights show usage, cost, and spend limits.

## Revocation

Anthropic API keys, service accounts, and BYOK keys are **revocable** from [NHI Inventory](/en/discovery/nhi-inventory).

## Related

- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [NHI Inventory](/en/discovery/nhi-inventory)
