---
sidebar_position: 5
title: "Egress Enforcement"
sidebar_label: "Egress Enforcement"
description: "Control or block outbound AI traffic from endpoints with the SecureAI OS Agent"
---



# Egress Enforcement

Egress enforcement controls what an endpoint is allowed to send **out** to AI providers and MCP servers. It's configured per [policy](/pt/en/agent/policies-and-groups) and enforced locally by the agent.

## Modes

| Mode | Behavior |
|------|----------|
| **off** | No egress enforcement — discovery/monitoring only. |
| **kill** | Terminate the offending process when it makes a disallowed AI call (legacy default). |
| **block** | Durable network block of the connection (Windows Filtering Platform), leaving the process running. |
| **lockdown** | Default-deny: everything is blocked except destinations on an explicit **allow list**. |

## Additional controls

| Control | Description |
|---------|-------------|
| **Allow list** | In `lockdown`, the set of destinations that remain permitted. |
| **Block remote MCP** | Blocks the endpoint from reaching remote MCP servers. |

The resolved configuration is delivered to each device as `egressEnforcement: { mode, allowList, blockRemoteMcp }` and re-evaluated on every heartbeat.

## Choosing a mode

- Start in **off** (or a **monitor**-mode policy) to build an accurate picture of what the endpoint actually calls — visible in the device drawer and in [AI Discovery](/pt/en/discovery/overview).
- Move to **block** to durably stop disallowed AI egress without disrupting the rest of the process's networking.
- Use **kill** where you want the offending program stopped outright.
- Use **lockdown** for the strictest posture — only your sanctioned AI endpoints (the allow list) are reachable.

Egress modes are also bundled into the [protection presets](/pt/en/agent/policies-and-groups#protection-presets) (Passive / Normal / Aggressive), so you can set a whole-posture level in one click and fine-tune from there.

<Warning>
`kill`, `block`, and `lockdown` actively interrupt endpoint traffic. Validate a change with **dry-run simulate** and staged **rollout rings** ([Policies & Groups](/pt/en/agent/policies-and-groups#safe-rollouts)) before applying it fleet-wide.
</Warning>

## Related

- [Policies & Groups](/pt/en/agent/policies-and-groups)
- [Transparent Proxy](/pt/en/agent/transparent-proxy) — route allowed AI traffic through the gateway instead of blocking it.
- [Quarantine & Fleet Ops](/pt/en/agent/quarantine-and-fleet-ops)
