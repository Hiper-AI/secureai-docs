---
title: "AI input boxes"
sidebarTitle: "AI input boxes"
description: "The agent checks what people type into desktop AI apps, Gemini in Chrome, Copilot in Edge and AI sites without the extension against your DLP rules"
---

The agent reads the text box where someone types a prompt and checks it against your organization's DLP rules before
it leaves. It covers what the [SecureAI Extension](/en/extension/overview) does not see: desktop AI apps, the AI panels
built into Chrome and Edge, and AI sites opened in a browser without the extension.

<Note>
Requires a SecureAI Agent version later than 1.3.5, on Windows. On macOS the agent does not read these boxes.
</Note>

## What it covers

The agent watches the focused editable box when it is in:

| Surface | Which |
|---|---|
| Desktop AI apps | ChatGPT, Claude, Copilot, Gemini, LM Studio, Ollama, Comet, Dia, Grammarly, Jan, goose and Msty |
| AI panels in the browser | Gemini in Chrome and Copilot in Edge |
| AI sites in a browser | Chrome, Edge, Firefox, Brave, Opera, Vivaldi and Arc, only in browsers where policy does not force the extension. Where it does, the extension checks |

The browser's address bar is left out.

## How to turn it on

In the console: **Inventory → Devices → Policies**, open the group's policy, **Governance** step, **Device → Data
guards → AI input boxes**. A new policy starts **Off**.

| Mode | What it does |
|---|---|
| **Off** | Does not read the boxes. |
| **Monitor** | Records each prompt and the sensitive data it finds. The person sees nothing. |
| **Warn** | Also shows the person one notice per draft when a rule finds sensitive data. Does not stop the send. |
| **Block** | Holds the Enter key when the message has data a rule blocks or redacts, or when the agent could not check it. Applies only with the policy in **block** mode; with the policy in **monitor**, the agent treats it as **Monitor**. |

## How it works

1. Every 400 ms the agent checks which box has focus.
2. When the text stops changing for 1.2 seconds, it checks it once against your DLP rules, with a 3-second limit.
3. In **Block**, pressing Enter checks the text again. If it comes out clean, the Enter goes through. If not, the
   message is not sent. Shift+Enter always goes through, because apps use it for a new line.
4. If the last draft had a blocking finding, the agent also holds clicks on buttons whose name contains *send*,
   *enviar*, *submit*, *envoyer*, *senden* or *invia*.

If DLP does not answer in time or has no rules loaded, in **Block** the agent holds the message and says it could not
check it. In the other modes it records it as unevaluated. With the device's DLP off, it lets the message through and
only counts the use.

## What the person sees

A Windows notification, at most one every 15 seconds per app or site. It never shows the text or the rule.

- **Warn**: what they are typing has sensitive data and they should review it before sending.
- **Block**: "SecureAI · Message not sent", asking them to remove the data and try again.
- **Unevaluated**: SecureAI could not check the message.

## What gets recorded

Each event reaches the console as agent activity (`agent_data_guard_event`, guard `ai_input`) with:

- the outcome: `observed`, `detected`, `warned`, `unevaluated`, `blocked` or `blocked-unevaluated`;
- the mode, the destination (app, site or panel) and the browser;
- the Windows user;
- for each matching rule: id, name, category, severity, action and number of matches.

The prompt text does not leave the device. The backend rejects a batch that carries a text field.

## What it does not cover

- A click on the send button before the 1.2-second pause, or on a button with another name.
- A send by voice dictation, by an app's own shortcut or by accessibility activation.
- An app running as administrator: Windows does not let the agent re-send the Enter, and that Enter is lost.
- A text too long to check: in **Block** it is held as unevaluated.

So **Block** cuts the usual path (type or paste, then press Enter), but it does not stop every send. For an AI site,
the [extension](/en/extension/overview) checks the whole send.

## Related

- [Policies and groups](/en/agent/policies-and-groups)
- [Alerts and SIEM](/en/agent/alerts-and-siem): events with a finding go to your SIEM as `endpoint_ai_input`.
