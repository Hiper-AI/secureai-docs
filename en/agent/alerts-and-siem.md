---
title: "Endpoint alerts and SIEM"
sidebarTitle: "Alerts and SIEM"
description: "Agent alert channels (email, webhook and Slack) and the endpoint events SecureAI sends to your SIEM"
---

## Alert channels

The agent notifies by email, webhook or Slack when a machine needs someone to look at it.

### What fires an alert

- A machine whose posture becomes **at risk** or **infected**.
- A tamper attempt on the agent, including a [deleted or edited hook](/en/agent/coding-agents#deleted-or-edited-hooks).
- A quarantined file.

### Where to set it up

**Analytics → Security → Fleet**, **Threats stopped** topic, **Endpoint alert channels** block.

| Channel | What it takes |
|---|---|
| **Email** | Up to 20 recipients, comma-separated. |
| **Webhook** | An `https` URL on a public host. SecureAI rejects internal addresses. |
| **Slack** | A Slack incoming webhook (`https://hooks.slack.com/...`). |

Leave the webhook or Slack field empty to keep the saved value. **Send test alert** sends an alert to every configured
channel; if there are none, the console says so. **Use the server variables** deletes the saved configuration and goes back
to the channels your installation defines through environment variables.

SecureAI stores both URLs encrypted and the console shows only the host. The change is audited with the number of
recipients and which channels changed, without the recipients or the URLs.

## Endpoint events in your SIEM

SecureAI sends agent events to your SIEM with their own `event_type`, so you can filter them without reading general
activity.

| `event_type` | When it is sent |
|---|---|
| `endpoint_shadow_ai` | The agent stopped an unapproved AI site, closed its tab or closed an unapproved desktop AI app. |
| `endpoint_mcp_blocked` | The agent blocked an MCP server or an MCP tool. |
| `endpoint_skill_quarantined` | The agent quarantined a skill or a hook. |
| `endpoint_agent_tamper` | Someone tried to tamper with or uninstall the agent, or deleted or edited a hook. |
| `endpoint_ai_input` | An [AI input box](/en/agent/ai-input-boxes) with a finding: every outcome except `observed`. |

### How to subscribe

In **Integrations**, in your SIEM integration ([Splunk](/en/integrations/splunk-security),
[Microsoft Sentinel](/en/integrations/microsoft-sentinel), [Elastic Security](/en/integrations/elastic-security) or
[webhook](/en/integrations/custom-siem-webhook)), pick the types in the security category.

An integration already subscribed to `policy_violation` or `user_activity` keeps receiving these events: you do not
need to change it.

### What each event carries

The same record you see in the console: the original type in `activity.type` and its `metadata`. SecureAI adds no
fields for the SIEM. AI input box events carry the matching rules and the number of matches, never the prompt text.

## Related

- [Quarantine and fleet operations](/en/agent/quarantine-and-fleet-ops)
- [AI input boxes](/en/agent/ai-input-boxes)
- [Coding agents](/en/agent/coding-agents)
