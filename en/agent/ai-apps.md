---
title: "Desktop AI apps and Google accounts"
sidebarTitle: "AI apps and accounts"
description: "Which desktop AI apps the agent recognizes, what it does with an unapproved one, and how to limit Gemini, NotebookLM and AI Studio to your company's accounts"
---

## Desktop AI apps

The agent recognizes an AI app by the executable's product name and its verified signer. An unsigned executable, or
one with a tampered signature, does not count as the app.

| Apps | From agent version |
|---|---|
| ChatGPT, Claude, Copilot, LM Studio, Ollama, Comet, Dia and Grammarly | 1.3.5 |
| Gemini, Jan, goose and Msty | later than 1.3.5 |

### What it does with an unapproved app

With the policy's unapproved-AI rule in force and the app's site not approved:

- in **block** or **redirect**, the agent closes the app and its child processes and shows the person a notice, with a
  button to your organization's SecureAI chat if you have one. If they open it again, it closes it again;
- in **warn**, it only shows the notice.

The agent closes the app instead of cutting its network because Copilot runs inside WebView2, the same component Teams
and Outlook use: cutting that component's network would take them offline too.

### What gets recorded

Each close shows up in the unapproved-AI chart as **Desktop app closed**, with the app's name, and goes to your SIEM as
`endpoint_shadow_ai` (see [Alerts and SIEM](/en/agent/alerts-and-siem)).

If you also turn on [AI input boxes](/en/agent/ai-input-boxes), the agent checks what people type into the approved
apps.

## Gemini, NotebookLM and AI Studio with company accounts only

You can have Google refuse sign-in in Chrome, Edge and Brave for any account outside your company's domains. The agent
writes each browser's `AllowedDomainsForApps` policy in the Windows registry with the domain list. The rule applies to
the whole Google session in those browsers, not only to Gemini.

<Note>
Requires a SecureAI Agent version later than 1.3.5, on Windows. The console does not show this field yet: set it
through the policies API, in `vendorPolicies.browserAi.googleAccountDomains`.
</Note>

- Up to 20 domains, without wildcards or scheme (`company.com`, not `*.company.com`).
- SecureAI rejects public email domains such as `gmail.com`.
- Adding a domain or emptying the list asks for recent MFA, like every change that loosens the policy.
- If the list is invalid, the agent keeps the current value and reports it.
- If your IT team already set `AllowedDomainsForApps` by GPO, the agent leaves it alone and reports it as managed by IT.
- With no domains in the policy, the agent removes the value it had written.

The person sees no SecureAI notice: they see Google's refusal when they try another account. For the same control from
the extension, across every provider that supports it, see [Corporate accounts only](/en/extension/corporate-accounts).

## Related

- [Policies and groups](/en/agent/policies-and-groups)
- [AI input boxes](/en/agent/ai-input-boxes)
