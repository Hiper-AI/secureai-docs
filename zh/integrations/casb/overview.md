---
sidebar_position: 1
title: "CASB & Network (SWG) Overview"
sidebar_label: "Overview"
description: "Discover shadow AI from your CASB / SWG / DNS logs — which corporate sources are calling LLM APIs, with no agent required"
---


# CASB & Network (SWG) Integrations

These connectors solve the **shadow-AI discovery** problem: finding every corporate device, server, or workload that is calling an LLM API — even ones where you can't install an SDK or the [endpoint agent](/zh/agent/overview) (a build server, a warehouse sorter, a contractor's laptop). SecureAI reads the logs your **CASB / Secure Web Gateway (SWG) / DNS** platform already collects and detects traffic to AI providers.

The result is a live inventory of **which source IPs and users are calling which AI providers**, surfaced in [Network Sources](/zh/discovery/network-sources).

## Supported connectors

| Connector | Data source | Status |
|-----------|-------------|--------|
| [Cisco Umbrella](/zh/integrations/casb/cisco-umbrella) | DNS-layer Reporting API v2 | Available |

## The setup loop

1. **Admin → Integrations → Network** (CASB / SWG category).
2. **Connect** the connector and enter its credentials (see each connector's page). URL fields are SSRF-guarded and secrets are encrypted at rest.
3. **Test** the connection.
4. **Sync** — the first sync launches a background **backfill** (default lookback matches the discovery window); subsequent syncs run on a schedule (default every 30 minutes).

## The discovery window

Network discovery reports activity over a rolling window — **30 days by default** (configurable via the `NETWORK_DISCOVERY_WINDOW_DAYS` environment variable). A few sub-views (top domains, top users, unknown domains) use a fixed 7-day window. See [Network Sources](/zh/discovery/network-sources) for how the inventory is presented and triaged.

## What gets detected

Each connector matches traffic against a curated catalog of known LLM/AI domains and, where the platform supports it, its native "Generative AI" content category. Detected activity is grouped by **source IP** and surfaced with the calling user, the AI provider(s), call volume, top domain, a **severity** rating, and a **threat-domain** flag for risky destinations.

## Related

- [Network Sources](/zh/discovery/network-sources) — the discovered inventory and triage workflow.
- [Endpoint Agent](/zh/agent/overview) — for endpoints where you *can* deploy an agent.
- [AI Discovery & Inventory Overview](/zh/discovery/overview)
