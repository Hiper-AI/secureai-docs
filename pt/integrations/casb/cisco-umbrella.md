---
sidebar_position: 2
title: "Cisco Umbrella"
sidebar_label: "Cisco Umbrella"
description: "Detect shadow AI from Cisco Umbrella DNS activity via the Reporting API v2"
---



# Cisco Umbrella

Connect Cisco Umbrella so SecureAI can detect which corporate sources are resolving LLM/AI domains, using Umbrella's **Reporting API v2**. Umbrella is a DNS-layer source: it confirms that a device *resolved* an AI domain (not the full TLS payload), which is exactly what shadow-AI discovery needs.

SecureAI runs two passes for maximum coverage:

1. A curated list of known LLM/AI domains.
2. Umbrella's **content category `212` ("Generative AI")**, so newly popular AI services are caught even before they're in the curated list.

## Prerequisites

- An Umbrella package that includes the **Reporting API** and DNS activity logs.
- **Umbrella API credentials** (API key + secret) and your **Organization ID**.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| `apiKey` | Yes | Umbrella Reporting API key. |
| `apiSecret` | Yes | Umbrella Reporting API secret. Encrypted at rest. |
| `orgId` | Yes | Your Umbrella Organization ID. |

### Where to get them

1. Sign in to the [Umbrella dashboard](https://dashboard.umbrella.com/).
2. Go to **Admin → API Keys** and create a key with **Reporting** scope. Copy the key and secret (shown once).
3. Your **Organization ID** is the numeric id in the dashboard URL (`.../o/<orgId>/#/...`).

SecureAI authenticates with `POST https://api.umbrella.com/auth/v2/token` (Basic `apiKey:apiSecret`, `client_credentials`) and reads `GET /reports/v2/activity/dns`.

## Connect

1. **Admin → Integrations → Network → Cisco Umbrella → Connect.**
2. Enter the API key, secret, and Organization ID.
3. **Test**, then **Save**.
4. **Sync** — the first sync backfills recent DNS activity in the background.

## Notes

- Umbrella is **DNS-layer**: a match confirms domain resolution, not a completed API call. It is ideal for breadth (every device behind Umbrella) but does not carry request payloads.
- If Umbrella egress must go through a proxy, set `UMBRELLA_PROXY_URL` (or the standard `HTTPS_PROXY`) on the SecureAI backend.

## Verify

After the first sync, open [Network Sources](/pt/en/discovery/network-sources) — sources that resolved AI domains appear with their provider(s), call counts, and severity.

## Related

- [CASB & Network Overview](/pt/en/integrations/casb/overview)
- [Network Sources](/pt/en/discovery/network-sources)
