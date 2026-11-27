---
title: "SecureAI Extension"
sidebarTitle: "Overview"
description: "SecureAI's browser extension: DLP on AI sites, AI inside SaaS apps, corporate accounts, and discovery of the AI your employees already use"
---

The SecureAI Extension runs in Chrome and Edge. It checks in the browser what your employees send to AI and tells
SecureAI which AI they use. The DLP check runs on the employee's computer.

You configure it in **Inventory → Extension → Settings**.

## What it does

- **DLP on AI sites.** Checks what people type, paste, edit or upload on ChatGPT, Claude, Gemini, Microsoft Copilot,
  Perplexity and other known AI sites, including NotebookLM and AI Studio. Depending on the rule, it warns, replaces the
  value or blocks the send.
- **[AI inside SaaS apps](/en/extension/saas-ai).** Checks prompts to Microsoft 365 Copilot, Gemini in Workspace, Notion
  AI, Atlassian Rovo, Canva Magic and Slack AI.
- **[Corporate accounts only](/en/extension/corporate-accounts).** Adds the headers Google, Microsoft, GitHub, Slack,
  OpenAI and Anthropic use to refuse personal accounts.
- **Discovery**: shows you which AI your employees use, approved or not (next section).

## Discovering the AI already in use

| What | What it sends |
|---|---|
| **Installed AI extensions** | Name, identifier, version, whether it is on, how it was installed and which sites it can access. It reads the browser's extension list and sends only the AI ones, when the list changes and once a day. |
| **AI sites not on the list** | The address and the signals that make the extension think the page is an AI chat. |
| **Use of known AI sites** | Per message: the site, the model, the account type and plan, a token estimate worked out from the text length, files (count and size), the connectors on, and whether it was blocked. The email address only for a corporate account. |

None of these events carries the text of a prompt or an answer.

## With the agent

On Windows, the [SecureAI Agent](/en/agent/overview) covers what the extension does not see: desktop AI apps, the AI
panels in Chrome and Edge, and AI sites in browsers without the extension ([AI input boxes](/en/agent/ai-input-boxes)).
