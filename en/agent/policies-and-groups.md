---
sidebar_position: 4
title: "Policies & Groups"
sidebar_label: "Policies & Groups"
description: "Configure what the SecureAI OS Agent enforces with policies, groups, protection presets, and safe rollouts"
---



# Policies & Groups

A **policy** defines what the agent enforces; a **group** assigns a policy to a set of devices. Every device resolves its effective policy on each heartbeat, so changes propagate quickly.

## Policies

A policy (`AgentPolicy`) contains:

| Setting | Description |
|---------|-------------|
| **Mode** | `monitor` (observe only) or `block` (enforce). |
| **Rulesets** | Allow/deny lists for `mcps`, `apps`, `providers`, and `models`. |
| **Threat feed** | Whether the device consumes the org threat feed. |
| **Egress enforcement** | `off` / `kill` / `block` / `lockdown` (+ allow list, block-remote-MCP). See [Egress Enforcement](/en/agent/egress-enforcement). |
| **Behavior guard** | Behavioral AI-oversight: enabled, sensitivity, and default action (`alert`, `quarantine`, `kill`, `block`, `require_approval`), for endpoint and/or gateway. |
| **Claude Code routing** | Transparent-proxy settings. See [Transparent Proxy](/en/agent/transparent-proxy). |
| **Tamper protection** | Uninstall-key requirement (see below). |
| **Rollout** | Staged rollout configuration (see [Safe rollouts](#safe-rollouts)). |

### Protection presets

Rather than tuning every knob, you can pick a single protection preset that bundles the behavior guard with the egress mode:

| Preset | Behavior |
|--------|----------|
| **Passive** | Observe and alert; minimal enforcement. |
| **Normal** | Balanced enforcement. |
| **Aggressive** | Strong enforcement (e.g. block/quarantine, tighter egress). |

Off-preset combinations are shown as **Custom**.

## Groups

A **group** (`AgentGroup`) has a `policyId` plus dynamic **membership rules** — matched on OS, hostname glob pattern, and priority. A device's effective policy is resolved **device → group → policy**, re-evaluated on every heartbeat, so moving a device between groups (or editing a group's rules) re-targets it automatically.

## Safe rollouts

Policy changes ship through a controlled workflow so you can validate before fleet-wide enforcement:

- **Revisions & rollback** — every policy change is versioned; roll back to a prior revision at any time.
- **Rollout rings** — advance a change through staged rings (pause/resume/advance) instead of all at once.
- **Dry-run simulate** — preview what a policy *would* detect or block against the current inventory, without saving or enforcing anything.
- **Exceptions** — an approval workflow for per-device/per-rule exceptions; approving one appends a managed exclusion. Approval requires the admin role.

## Tamper protection & uninstall key

A policy can require an **uninstall key** (`tamperProtection.uninstallRequiresKey`) so the agent cannot be removed by a local user without it. The requirement (and a hashed key with an offline salt/hash) is delivered to the endpoint so it can validate even off-network. Uninstall attempts validate through a public token-validation endpoint (per-policy key first, then a fleet-wide fallback); failures are audited. See [Self-update & anti-tamper](/en/agent/quarantine-and-fleet-ops#self-update--anti-tamper).

## Related

- [Egress Enforcement](/en/agent/egress-enforcement)
- [Quarantine & Fleet Ops](/en/agent/quarantine-and-fleet-ops)
- [Transparent Proxy](/en/agent/transparent-proxy)
