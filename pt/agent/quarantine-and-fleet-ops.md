---
sidebar_position: 6
title: "Quarantine & Fleet Ops"
sidebar_label: "Quarantine & Fleet Ops"
description: "Respond to endpoint threats — quarantine, restore, isolate, incidents, and fleet-wide operations"
---



# Quarantine & Fleet Ops

Beyond enforcement, the agent fleet has a response and operations layer: quarantine and restore, endpoint isolation, an incident War Room, a quarantine vault, threat tuning, and a fleet dashboard.

## Device commands & roles

Destructive device commands require the elevated system **admin** role (tighter than general admin-panel access):

| Command | Effect |
|---------|--------|
| `quarantine` | Moves and encrypts a malicious file and kills its process tree. **Destructive.** |
| `kill_process` / `kill_mcp` / `kill_network` | Terminate a process, an MCP server, or a network connection. |
| `isolate` / `unisolate` | Cut the endpoint off from the network / restore it. |
| `revoke` | Revoke the device (it can no longer enroll or call home). |

`restore` (recovering a quarantined file) is a recovery action and is available to any admin operator. The agent confirms quarantine/restore results back to the backend.

## Quarantine vault

Quarantined items are retained in a **vault** with a configurable retention period (**30 days** by default). From the vault you can filter by machine, severity, restored/reviewed state, mark items reviewed, and **restore** items in bulk.

## Threat tuning

The **review queue** collects self-quarantined files and recent policy auto-kills awaiting human false-positive review, each row carrying the device's resolved policy so you can tune the right rule. From an incident you can **blocklist** or **whitelist** a detection — globally in the org catalog or scoped to a policy.

## Incidents (War Room)

Endpoint incidents are triaged in the War Room as runbooks. Device-level actions include **ack-clear** (clear recorded violations, recompute posture, and close the related threat runbooks) and threat blocklist/whitelist.

## Fleet dashboard

The dashboard summarizes the whole fleet: coverage, online/stale counts by OS, posture distribution, average risk, active-incident facets, a per-device heatmap, a per-day threat timeline, top threats, and top risks.

## Self-update & anti-tamper

- **Self-update** — the agent updates itself via an `update` command plus a signed release manifest (version + checksum + signature); the newest build can be auto-synced to the fleet.
- **Anti-tamper / uninstall key** — a [policy](/pt/en/agent/policies-and-groups#tamper-protection--uninstall-key) can require an uninstall key so the agent can't be silently removed. Validation works even off-network (an offline salt/hash is carried to the endpoint), with a fleet-wide key as fallback; failed uninstall attempts are audited.

## Related

- [Policies & Groups](/pt/en/agent/policies-and-groups)
- [Egress Enforcement](/pt/en/agent/egress-enforcement)
- [Threat Defense](/pt/en/threat-defense/overview)
