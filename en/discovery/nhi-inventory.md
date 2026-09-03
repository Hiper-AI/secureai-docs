---
sidebar_position: 4
title: "NHI Inventory"
sidebar_label: "NHI Inventory"
description: "Inventory and govern the Non-Human Identities — API keys and service accounts — behind your AI agents and workloads"
---



# NHI Inventory

The **NHI Inventory** (Admin → Agent Registry → **Non-Human Identities**) is the inventory of the machine credentials behind your AI — the API keys, service accounts, and BYOK keys that agents, MCP servers, and workloads use. It rolls up identities discovered by every [Cloud AI Provider](/en/integrations/cloud/overview) connector, scores their risk, and gives you controls to block or revoke them.

## What each identity shows

- **Provider** (SecureAI / OpenAI / Anthropic / Azure / GCP / AWS) and **type** (agent / mcp / workload).
- **Risk score** (0–100) with contributing factors (see below).
- **SMLTP verdict** chip (blocked / enforced / monitor) and receipt count.
- **Used-by**, **last-used** (idle days), **rotation**, and an **expiry countdown**.
- **Status**: healthy / remediation / critical.

## Control levels

How much you can *do* to an identity depends on how it was discovered:

| Level | What it means | Action available |
|-------|---------------|------------------|
| **Managed** | A SecureAI-issued (non-cloud) identity. | **Block / Unblock** at the gateway — denies or restores any request authenticated by that identity, and pushes the gateway revocation list. |
| **Revocable** | Cloud-discovered **and** enforceable at the source. | **Revoke** — the padlock ("candadito"): deletes/disables the key **at the provider**. Irreversible; marks the identity blocked/critical. |
| **Monitor-only** | Cloud-discovered but not enforceable. | Read-only. Dormancy alone never escalates it to critical (it adds a small monitor-only risk factor). |

### Which clouds are revocable

| Identity type | Revocable at source | Monitor-only |
|---------------|---------------------|--------------|
| **API keys** | OpenAI, Anthropic, GCP, Azure, AWS | — |
| **Service accounts / BYOK keys** | Anthropic, GCP, Azure | OpenAI, AWS |

## Actions

| Action | Effect |
|--------|--------|
| **Block / Unblock** | Deny/restore requests authenticated by a managed identity's SecureAI key (gateway revocation list). |
| **Revoke** | Cut a revocable identity at the provider. Requires the identity be enforceable with an external id; otherwise returns "not revocable at the source." |
| **Mark rotated** | Record that a key was rotated. |
| **Register / rotate signing key** | Manage SET signing keys for the identity. |

## Risk scoring

The governance sweeper computes a composite 0–100 score from factors including: dormant / dormant-critical, rotation-overdue / rotation-critical, expired / expiring-soon, broad scopes, no owner, reactivated, and monitor-only. Reactivation of a previously-dormant identity raises an alert.

## Related

- [Cloud AI Providers](/en/integrations/cloud/overview) — the source of discovered identities.
- [Cloud Sensors](/en/discovery/cloud-sensors)
- [AI Discovery & Inventory Overview](/en/discovery/overview)
