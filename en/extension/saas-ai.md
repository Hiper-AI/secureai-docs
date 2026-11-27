---
title: "AI inside SaaS apps"
sidebarTitle: "AI inside SaaS apps"
description: "The extension runs DLP on what employees send to the AI built into Microsoft 365, Google Workspace, Notion, Atlassian, Canva and Slack"
---

Many SaaS apps ship their own AI: Copilot in Outlook, Gemini in Docs, Notion AI. Employees send it a prompt without
leaving the app, and the AI often takes the open document as context. The SecureAI Extension recognizes that AI's input
box and checks what goes out through it against your organization's DLP rules.

<Note>
Requires a SecureAI Extension version later than 1.0.32, with unapproved-AI blocking on in the extension settings.
</Note>

## What it covers

| Feature | Where |
|---|---|
| **Microsoft 365 Copilot** | `m365.cloud.microsoft`, Outlook on the web, Office on the web and SharePoint |
| **Gemini in Google Workspace** | Google Docs and Gmail |
| **Notion AI** | `notion.so` and `app.notion.com` |
| **Atlassian Rovo** | `*.atlassian.net` and `home.atlassian.com` |
| **Canva Magic** | `canva.com` |
| **Slack AI** | `app.slack.com` |

## What it does today

The extension applies **Inspect** to all six features:

- It checks what the employee types, pastes or attaches while focus is in the AI's box. The rest of the SaaS document
  is not checked while the employee edits it.
- Before sending, in Microsoft 365 Copilot (Outlook and Office on the web) and in Gemini (Docs and Gmail), it also checks
  the document or email the AI will take as context. There, a rule that replaces data blocks instead, because the
  extension cannot replace text inside the document, and a rule that only logs lets the send through.
- If a rule blocks, the employee sees the extension's DLP notice and the message does not go out. The rest of the SaaS
  app works as usual.

The other two options already exist in the extension: **Allow** (no checks on that feature) and **Off** (refuses every
send from the AI's box and cuts the AI's network requests, without cutting the page). The console does not let you pick
them yet, so today every feature stays on **Inspect**.

## What gets recorded

The same DLP events as on an AI site: the page address, the feature name, the matching rules with their category,
severity and number of matches, the content length and the attached file's name. The prompt text is not sent.

The extension does not record usage of these features (model, account, tokens) the way it does for ChatGPT, Claude or
Gemini: they show up only when a rule acts.

## What it does not cover

- **Unmeasured boxes.** In Notion, Microsoft 365, Slack, Rovo and Canva, the extension finds the AI's box by its
  accessible label or placeholder text. If the vendor changes that text, the extension stops recognizing the box and
  does not check it.
- **Gemini in Gmail.** Neither the box nor the AI's request has been measured in Gmail: the check may not act.
- **Copilot inside Word and Excel on the web** when it goes through Office's internal service (AugLoop).
- **Slack AI** has no identified network request: once the console lets you turn it off, only the refusal in the box
  will work.
- The desktop apps of these products (Outlook, Teams, Slack, Notion). On Windows, the agent covers them only if they
  are [AI apps it recognizes](/en/agent/ai-apps); these are not.

## Related

- [SecureAI Extension](/en/extension/overview)
- [Corporate accounts only](/en/extension/corporate-accounts)
