---
title: "Coding agents: inventory, hooks and MCP proxy"
sidebarTitle: "Coding agents"
description: "Rules, skills and plugins of coding agents, hooks someone deletes or edits, and the local MCP proxy that checks each tool call"
---

This page covers three agent controls over AI coding tools (Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot and
others):

- the **inventory** of rules, skills, plugins and hooks on each machine;
- SecureAI **hooks** someone deletes or edits, which the agent restores and reports as tampering;
- the **local MCP proxy**, which runs each MCP tool call through your policy.

<Note>
Requires a SecureAI Agent version later than 1.3.5, on Windows.
</Note>

## Inventory of rules, skills and plugins

### What it scans

| Type | Files |
|---|---|
| **Rules** | In each project: `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/`, `.windsurfrules`, `.windsurf/rules/`, `.github/copilot-instructions.md` and `.github/instructions/`. In the user profile: `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md` and Windsurf's global rules |
| **Skills** | Claude Code's, `~/.codex/skills/*/SKILL.md` and `.agents/skills/*/SKILL.md` |
| **Plugins** | Claude Code plugins and Claude Desktop extensions |
| **Hooks** | Those of Claude Code, Gemini CLI, Codex and GitHub Copilot |

The agent scans the projects the user opened in Claude Code. A repository opened only in another tool is not scanned.

### Where you see it

**Inventory → Devices → Agentic inventory**. The **Rule** filter shows instruction files with the tool, the version
and the start of their SHA-256 fingerprint. Two files with the same name and different content show up as two items.

### What gets recorded

- For rules, other tools' skills, plugins and extensions: name, version, description (for a skill), SHA-256
  fingerprint, full file path and Windows user. The text is not uploaded.
- For hooks: the command, with secrets masked.
- Claude Code skills and subagents already uploaded their content before this change, and still do.

### How it is governed

Rules are judged against the policy's **skills** list. With the policy in **block**, the agent quarantines the skills
and subagents that list denies: it moves the file out of the tool's folder. Rules, plugins and hooks are reported, but
the agent does not move them.

## Deleted or edited hooks

The agent installs hooks in coding tools to see each session. If someone deletes or edits one, the agent puts it back
on the next refresh (about 30 seconds) and reports a tamper attempt.

### Files it watches

The ones the agent writes: SecureAI's file in Claude Code's managed settings, the machine-level hooks of Cursor, GitHub
Copilot CLI, Codex, Gemini CLI, Factory, Qwen, Augment and Kiro, and the user files of Junie, Devin and goose.

It does not watch Claude Code's user `settings.json`, Antigravity's user hook or Gemini's user extension.

### When it reports

Only with **Coding-agent traces** turned on in the policy. It reports when the file changed since the agent last wrote it
and had to be rewritten. A change the user makes around the hook, without touching it, is not reported. It sends at
most one report per file every 15 minutes.

### What gets recorded and what the person sees

The report carries the tool, whether the hook was deleted or edited, and the file path. It does not carry the content
or the process that touched it: the agent does not identify it. The person sees no notice.

In the console it counts as tampering in **Analytics → Security → Fleet**. It also fires the
[alert channels](/en/agent/alerts-and-siem#alert-channels) and goes to your SIEM as `endpoint_agent_tamper`.

## Local MCP proxy

With the proxy on, the agent rewrites the MCP clients' configuration so each local server starts behind it. Each tool
call (`tools/call`) then goes through your policy before it reaches the server.

### How to turn it on

**Inventory → Devices → Policies**, open the group's policy, **Governance** step, **Coding agents → Local MCP proxy**.
With the proxy on, **Inspect arguments and results** appears: it runs each call's arguments and response through the
secrets detector and DLP. Both start off. Turning them off asks for recent MFA and is audited.

### Which clients it wraps

Claude Desktop, Claude Code, Cursor, Windsurf, Cline, Roo, Kilo, VS Code, Gemini CLI, Zed and OpenCode.

It does not touch the configuration of Codex (TOML), Continue (YAML) or a JSON file with comments.

### What it decides on each call

- A server the policy's **MCPs** list denies: denied with the policy in **block**, alerted with the policy in **monitor**.
- A per-tool rule (`behaviorGuard.toolRules`) set to `block` or `require_approval`: denied when behavior oversight is
  on. `require_approval` denies with a message asking for an administrator's approval; it does not wait for one. These
  rules are loaded through the API: the console does not show them yet.
- With **Inspect arguments and results**: the call is denied if the arguments or the response carry a secret or data
  DLP blocks.

The client gets an error that starts with "SecureAI:". If the proxy's configuration file is missing or was not written
by an administrator, the proxy denies every tool call and lets the rest of the protocol through.

### Secrets and rollback

The agent takes variables holding secrets out of the configuration and stores them encrypted with DPAPI. The original
stays in `%LOCALAPPDATA%\hiperai\secureai-agent\mcp-wrap`. If you turn the proxy off or uninstall the agent, the agent
restores the original configuration with its secrets.

If the user removes the proxy from a server by hand, the agent puts it back and reports a critical **Tamper attempt**.

### What gets recorded

In the agent's traces, for each call: the server, the tool, the decision and the size in bytes of the arguments and
the result. Arguments and results are not recorded.

### What it does not cover

- **Remote MCP servers.** The proxy wraps local servers only. Remote ones still go direct; the agent notes them in its
  local log.
- The clients and formats listed above that the proxy does not rewrite.

## Related

- [Policies and groups](/en/agent/policies-and-groups)
- [IDE: Claude Code](/en/integrations/ide-claude-code)
- [Alerts and SIEM](/en/agent/alerts-and-siem)
