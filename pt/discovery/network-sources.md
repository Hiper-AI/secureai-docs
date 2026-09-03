---
sidebar_position: 3
title: "Network Sources"
sidebar_label: "Network Sources"
description: "Shadow-AI discovery — which corporate source IPs and users are calling LLM APIs, from your CASB/SWG logs"
---



# Network Sources

**Network Sources** (Admin → Agent Registry → **Network**) surfaces the shadow AI found in your CASB/SWG logs: which corporate **source IPs and users are calling LLM APIs**, even where no SDK or [endpoint agent](/pt/en/agent/overview) is deployed. It's fed by the [CASB & Network connectors](/pt/en/integrations/casb/overview) — Cisco Umbrella, Zscaler, and others.

## The discovery window

Activity is reported over a rolling window — **30 days by default** (configurable via `NETWORK_DISCOVERY_WINDOW_DAYS`). A few sub-views (top domains, top users, unknown domains) use a fixed 7-day window. On first connect, a connector runs a background backfill so history is available immediately.

## What each source shows

| Field | Description |
|-------|-------------|
| **Source IP** | The corporate device/workload making AI calls. |
| **User / gateway** | The primary user or gateway identity, when the connector provides it. |
| **Total calls** | Call volume within the window. |
| **Top domain / providers** | The most-hit AI destination and the provider set. |
| **Severity** | `critical` / `high` / `medium` / `low`. |
| **Threat domains** | A badge when a source reached risky destinations. |
| **Registered** | Whether the source has been triaged/registered. |

Drilling into a source shows a per-observation table (domain, provider, connector, calls, user, last-seen).

## Triage workflow

- **Register** a source you recognize (it becomes part of your known inventory), or **elevate** it for follow-up.
- **Ignore / unignore** sources that are expected/noise.
- Review the **unknown-domains** queue to classify AI destinations the catalog didn't recognize.
- Explore **analytics** and the **topology** view for org-wide patterns.
- Export to CSV.

## Syncing

Run **Sync** per connector or **Sync All**; connectors also sync on a schedule (default every 30 minutes). Backfill progress and connector staleness are shown inline. Connector setup lives in **Admin → Integrations → Network**.

## Related

- [CASB & Network (SWG) integrations](/pt/en/integrations/casb/overview) — connect the log sources.
- [Endpoint Agent](/pt/en/agent/overview) — for endpoints you can manage directly.
- [AI Discovery & Inventory Overview](/pt/en/discovery/overview)
