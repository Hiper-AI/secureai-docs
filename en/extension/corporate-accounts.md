---
title: "Corporate accounts only"
sidebarTitle: "Corporate accounts only"
description: "The extension adds the tenant-restriction headers each provider documents, and the provider refuses personal or other companies' accounts"
---

Several providers sell their enterprise plans with a header that, added to requests to their hosts, makes the provider
refuse any account outside the listed tenants. A personal ChatGPT, Claude or Gmail account cannot sign in.

The SecureAI Extension adds those headers in the browser, with no proxy and no TLS inspection. The provider refuses the
account: the extension does not decide anything from the page.

<Note>
Requires a SecureAI Extension version later than 1.0.32.
</Note>

## Providers

| Provider | Plan that enables it (per the provider) | Header | Where the extension adds it | What you enter |
|---|---|---|---|---|
| **Google Workspace** | Google Workspace | `X-GoogApps-Allowed-Domains` | `google.com` and its subdomains | Your organization's domains (up to 50) and, optionally, allow visitor accounts |
| **Microsoft Entra** | Microsoft Entra tenant restrictions v1 | `Restrict-Access-To-Tenants` and `Restrict-Access-Context` | `login.microsoftonline.com`, `login.microsoft.com` and `login.windows.net` | The allowed tenants (domain or GUID, up to 50) and the directory ID that receives the sign-in logs (required) |
| **Personal Microsoft accounts** | Not stated by the provider | `sec-Restrict-Tenant-Access-Policy: restrict-msa` | `login.live.com` | The checkbox to block personal Microsoft accounts |
| **GitHub Enterprise** | GitHub Enterprise Cloud with Enterprise Managed Users | `sec-GitHub-allowed-enterprise` | `github.com`, `api.github.com`, `githubcopilot.com` and their subdomains | The enterprise ID. Only one: GitHub rejects more |
| **Slack** | Slack Business+ or Enterprise | `X-Slack-Allowed-Workspaces-Requester` and `X-Slack-Allowed-Workspaces` | `slack.com` and its subdomains | The workspace or organization requesting the restriction and the allowed ones (`T…` or `E…` IDs, up to 100) |
| **ChatGPT Enterprise** | ChatGPT Enterprise | `ChatGPT-Allowed-Workspace-Id` | `chatgpt.com` | The workspace IDs (UUID, up to 100) |
| **Claude (Anthropic)** | Claude Enterprise and Console organizations | `anthropic-allowed-org-ids` | `claude.ai`, `claude.com`, `anthropic.com` and `api.anthropic.com` | The organization IDs (UUID, up to 500) |

The provider decides which plan enables the header and can change it. Check its documentation before you turn it on.

**Dropbox and Zoom are not supported.** Dropbox does not publish a header of this kind. Zoom has one, but its support
team sets it up and it filters by email domain, not by a list the extension can send.

## How to turn it on

**Inventory → Extension → Settings → Corporate accounts only**. Tick each provider, fill in its fields and save with
**Save tenant restrictions**.

- SecureAI validates each field on save. An invalid value is not saved and the console names the field that failed.
- Removing a provider, adding a tenant, changing the directory or enterprise ID, allowing visitors or no longer blocking
  personal Microsoft accounts loosens the restriction and asks for recent MFA.
- Each change is audited with the providers it touched, without the IDs.

The extension gets the configuration before the employee signs in to it, and applies it even with unapproved-AI
blocking off. It can also come through the browser's managed policy (`tenantRestrictions` key, from your MDM); for a
provider set in both places, the managed policy wins.

## What the employee sees

The provider's error page when they try an account that is not on the list. The extension shows no notice of its own.

## What gets recorded

SecureAI gets no event for each refused sign-in: the refusal happens at the provider. To see those attempts, use the
provider's sign-in logs (for Microsoft, those of the directory you entered as directory ID).

## What it does not cover

- Browsers without the extension, desktop and mobile apps, Git over SSH and command-line tools. For Gemini, NotebookLM
  and AI Studio on the desktop, the agent can set Google's domains in the browser (see
  [AI apps and accounts](/en/agent/ai-apps#gemini-notebooklm-and-ai-studio-with-company-accounts-only)).
- A provider with a malformed value in the managed policy: the extension sends no header for it, because an invalid
  header would make the provider reject every request.

## Related

- [SecureAI Extension](/en/extension/overview)
- [AI inside SaaS apps](/en/extension/saas-ai)
