---
sidebar_position: 2
title: OpenAI Platform
sidebar_label: OpenAI Platform
description: "Connect the OpenAI Platform so SecureAI can inventory projects, models, keys, usage, and cost"
---

# OpenAI Platform

Connect your OpenAI organization so SecureAI can inventory projects, models, members, API keys, service accounts, spend, and audit activity — and surface leaked or over-privileged keys for remediation.

## What SecureAI imports

- **Projects, models, members, roles, and groups**
- **NHIs** — API keys and service accounts (revocable — see [NHI Inventory](/discovery/nhi-inventory))
- **Spend alerts, rate limits, certificates, and data-retention settings**
- **Audit logs**
- **Usage and cost** for the last 30 days, including per-user spend

## Prerequisites

- An **Organization owner** (or admin) on the OpenAI Platform.
- An **Admin API key** (`sk-admin-…`). Admin keys are required to read org-wide projects, members, and usage.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| `adminApiKey` | Yes | Organization **admin** key, format `sk-admin-…`. Encrypted at rest. |
| `projectApiKey` | No | One or more project keys (one per line), only needed for legacy Assistants inventory. |
| `organizationId` | No | Your `org-…` id; disambiguates when a key spans multiple orgs. |

### Where to get the admin key

1. Sign in to the [OpenAI Platform](https://platform.openai.com/) as an organization owner.
2. Go to **Settings → Organization → Admin keys**.
3. Create a new admin key and copy it (shown once).

## Connect

1. **Admin → Integrations → Cloud → OpenAI Platform → Connect.**
2. Paste the admin API key (and optional fields).
3. **Test**, then **Save**.
4. **Sync**.

## Verify

After the first sync, open [Cloud Sensors](/discovery/cloud-sensors) to see discovered models/assistants, and [NHI Inventory](/discovery/nhi-inventory) to see keys and service accounts. Per-provider **Insights** show usage, cost, and per-user spend.

## Revocation

OpenAI API keys are **revocable** from [NHI Inventory](/discovery/nhi-inventory): SecureAI can disable a key at the source. (For service accounts, OpenAI identities are monitor-only.)

## Related

- [Cloud AI Providers Overview](/integrations/cloud/overview)
- [NHI Inventory](/discovery/nhi-inventory)
