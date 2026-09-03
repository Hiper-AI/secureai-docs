---
sidebar_position: 1
title: "Endpoint Agent Overview"
sidebar_label: "Overview"
description: "The SecureAI OS Agent — endpoint AI governance, DLP, and egress control for laptops and servers"
---



# Endpoint Agent

The SecureAI **OS Agent** runs on your endpoints — Windows laptops, Linux servers, macOS machines — and enforces AI governance where the work actually happens. It discovers AI/MCP activity on the device, applies data-loss and behavioral protections, and can control or block egress to AI providers according to policy.

The agent fleet is managed under **Admin → Agent Registry → OS Agents**.

## What the agent does

- **Discovers AI usage on the device** — installed AI SDKs/processes, MCP servers, and shadow-network calls to AI providers.
- **Enforces policy** — monitor or block AI providers/models/apps/MCPs, apply behavioral AI-oversight, and enforce egress control (see [Egress Enforcement](/pt/en/agent/egress-enforcement)).
- **Protects data** — endpoint DLP/PII inspection.
- **Responds to threats** — quarantines malicious files and can isolate a compromised endpoint (see [Quarantine & Fleet Ops](/pt/en/agent/quarantine-and-fleet-ops)).
- **Optionally routes developer AI traffic** through SecureAI's gateway (see [Transparent Proxy](/pt/en/agent/transparent-proxy)).

## Device health & posture

Each enrolled device reports a health status and a security posture:

| Signal | Values |
|--------|--------|
| **Status** | `healthy`, `stale` (no heartbeat for ~5 minutes), `enrolled`, `paused`, `revoked` |
| **Posture** | `protected`, `at_risk`, `infected` |
| **Risk score** | 0–100, computed from violations, threats, and configuration |

The **OS Agents** tab lists every device with its status, posture, risk, OS/version, group, active policy, and linked owner. Expanding a device shows recent shadow-network observations, MCP inventory, AI-SDK processes, policy violations, blocked connections, quarantine items, threats, and command history.

## How to get started

1. **[Install the agent](/pt/en/agent/installation)** on endpoints (signed MSI on Windows; script on Linux/macOS).
2. Understand **[enrollment & installer packages](/pt/en/agent/enrollment-and-packages)** — how devices join and get their configuration.
3. Configure **[policies & groups](/pt/en/agent/policies-and-groups)** to decide what each device enforces.
4. Tune **[egress enforcement](/pt/en/agent/egress-enforcement)** and **[quarantine & fleet ops](/pt/en/agent/quarantine-and-fleet-ops)** for response.

## Roles

General admin-panel access lets you view and configure the fleet. **Destructive actions** — quarantine, process/MCP/network kill, isolate, and revoke — require the elevated system **admin** role. See [Quarantine & Fleet Ops](/pt/en/agent/quarantine-and-fleet-ops).

## Related

- [AI Discovery & Inventory](/pt/en/discovery/overview) — the agent is one of three discovery signals.
- [Threat Defense](/pt/en/threat-defense/overview)
