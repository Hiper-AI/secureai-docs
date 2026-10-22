---
sidebar_position: 12
title: "OpenAI API — Inference with your organization's key"
sidebarTitle: "OpenAI API"
icon: "/img/icons/openai.svg"
sidebar_label: "OpenAI API — Inference"
description: "Run SecureAI's GPT calls with your organization's own OpenAI API key: OpenAI bills your organization or project directly, with your credits and your limits, while SecureAI keeps enforcing DLP, model policies and audit."
---

# OpenAI API — Inference with your organization's key

With this integration, the **GPT** calls SecureAI makes go to the **OpenAI API with your organization's own API key**, instead of through SecureAI-managed providers. **OpenAI bills your organization or project**: the usage draws on your credits, your discounts, your budget and your **rate limits**.

SecureAI stays in the path of every request: **DLP, model policies, audit and signed receipts** apply exactly as with any other provider.

<Info>
**Not the same as OpenAI Platform.** This page connects OpenAI as an **inference provider** (Admin → Integrations → **AI providers**) with a **regular** API key, which can only call models. The [OpenAI Platform](/en/integrations/cloud/openai-platform) card in the **Cloud** category uses an **Admin** key to inventory projects, keys and usage, and never sends a prompt. They are independent: use either one, or both.
</Info>

## How it works

1. You create an API key dedicated to SecureAI in the OpenAI platform and save it in SecureAI. It is stored **encrypted** and never shown again.
2. On save, SecureAI uses the key to read the **list of models** it can call (`GET /v1/models`, chat models only) and matches each GPT model of SecureAI's catalog to the OpenAI id that serves it.
3. On every chat turn or task with a GPT model, SecureAI applies DLP and the model policy, signs the request and sends it to OpenAI's **Chat Completions API** through its SMLTP gateway.
4. The response comes back through the gateway, which inspects and redacts it (streaming included) before it reaches the user, and issues the signed receipt.

## What runs on your key and what does not

| Runs on your OpenAI key | Stays on SecureAI-managed providers |
|---|---|
| Chat and agents with **GPT** models (for example GPT‑5.x) | **gpt‑oss**: open-weights models OpenAI does not host; they stay on SecureAI or another connected cloud |
| Background tasks (grammar, translation, Teams summaries) when you choose **Remap everything to the OpenAI API** | Models of other families (Claude, Gemini, Llama…), unless another connected cloud serves them |
| Chat models your key can call that SecureAI's catalog does not list (for example the o-series), when your deployment offers them | Embeddings, search re-ranking, document OCR, the admin assistant, image generation and realtime voice |

## How many inference providers you can use

The OpenAI API counts as one more inference provider, like Google Vertex AI, Azure AI Foundry, Amazon Bedrock and the Anthropic API:

| Plan | Inference providers enabled at the same time |
|------|----------------------------------------------|
| **Scale** | 1 |
| **Enterprise** | Up to 3 — for example the OpenAI API for GPT, the Anthropic API for Claude and Vertex AI for Gemini |

Each model family can be routed to **one** provider only. If GPT already runs on Azure AI Foundry or Amazon Bedrock, remove it there first: SecureAI refuses an overlapping configuration and says which family collides.

## Prerequisites

- An **OpenAI organization** with active billing (or a project with a budget).
- Permission to **create API keys** in the [OpenAI platform](https://platform.openai.com) (**API keys**).
- **Admin** permission on SecureAI's Integrations section.
- Your organization's **SMLTP model policy** must allow at least one GPT model your key can call (**AI Gateway → Policies**). SecureAI applies that policy to these calls too.

## Step 1. Create the key in the OpenAI platform

1. In the [OpenAI platform](https://platform.openai.com), go to **API keys** and click **Create new secret key**.
2. Give it a recognizable name (for example `SecureAI`). We recommend a **project key**: it limits the key to one project, with its budget, its limits and its model access.
3. Copy the key (it starts with `sk-`). OpenAI shows it only once.

<Tip>
Use a key **dedicated to SecureAI**, so you can track its usage on its own and revoke it without affecting other applications.
</Tip>

## Step 2. Connect the key in SecureAI

1. Go to **Admin → Integrations → AI providers** and open **OpenAI API — Your organization's key**.

   ![The Anthropic API and OpenAI API cards in Admin → Integrations → AI providers](/img/cloud/anthropic-api-inference/01-integrations-ai-providers.png)

2. Fill in:

   | Field | What to enter |
   |-------|---------------|
   | **API key** | The key from step 1. |
   | **Organization ID (optional)** | Only for a key that belongs to several organizations: the calls are billed to this one (`org-…`). |
   | **Project ID (optional)** | Sends the calls to this project, with its budget and limits (`proj_…`). |

3. Click **Save**.

On save:

- The key field clears and shows **Key saved (…xxxx)**: only the **last 4 characters** stay visible. The key is never sent back to the browser. To change it, type a new one; an empty field keeps the stored key.
- **Models your key can call** lists the chat models of your account. Use **Refresh** when OpenAI opens new models to your key or project.
- No traffic is routed yet: the integration is saved switched off so you can test it first. The card shows **Configured · not routing to the OpenAI API**.

If the model list shows an error, check the key and, if you set them, the organization and project IDs.

## Step 3. Choose what runs on your key

**What runs on the OpenAI API** has two modes:

- **Only these model families** (the default, with **OpenAI** selected): GPT models run on your key; everything else stays on SecureAI's providers or another connected cloud.
- **Remap everything to the OpenAI API**: every LLM call runs on your key. Models OpenAI does not serve (Claude, Gemini…) are answered by the **default OpenAI models**.

**Automatic matching.** SecureAI matches each GPT model of the catalog to the id your key lists: the same name (`openai/gpt-5.2` → `gpt-5.2`) or, when your key only has the dated version, that one (`gpt-4.1-2025-04-14`). A model your key does not have is hidden from users (or goes to SecureAI if you allowed fallback).

**Default OpenAI models** (pick them from your key's list):

| Tier | Used for |
|------|----------|
| **Fast** | Background tasks (grammar, translation, Teams) and remapped internal calls |
| **Standard** | Models with no OpenAI equivalent |
| **Reasoning** | Reasoning models with no equivalent |
| **Vision** | Requests with images or PDFs |

In **Model → OpenAI id overrides** you can send a SecureAI catalog model to an exact OpenAI id, a fine-tuned model included (`ft:gpt-4.1-mini:…`). Overrides win over automatic matching.

Two more options:

| Option | Off (default, recommended) | On |
|--------|----------------------------|----|
| **Allow fallback to SecureAI-managed models** | If OpenAI fails or a model has no OpenAI id, the request is **refused** (fail closed) instead of being sent to another provider. | Those requests are retried **once** on SecureAI-managed providers. The retry is audited. |
| **Apply each seat's spend cap to turns billed to your key** | Turns paid by your key do not count against the seats' monthly spend cap. | They count against each seat's monthly spend cap, at list price. |

### Models of your key the catalog does not list

Chat models your key can call that SecureAI's catalog does not have appear under the **Offer the models of your OpenAI API that SecureAI does not list** switch, when your deployment offers models of your own cloud. Untick the ones you do not want to offer, or turn the switch off.

For users to pick them in the chat (the **Your OpenAI API** section of the model selector), **add them to the SMLTP model policy** in **AI Gateway → Policies**, where they are listed in the same section. They run only on your key, never on SecureAI's providers, even with fallback allowed.

## Step 4. Test and switch on

1. Click **Test connection**. It sends a minimal (one-token) request to each default model **through the same path real traffic will take** — gateway, model policy and receipts included. With no default models yet, it probes the **cheapest GPT model your key can call that your SMLTP model policy allows**. The test **is billed to your OpenAI account** (a fraction of a cent).
2. Check the **Routing preview**: for each catalog model it shows whether **Your OpenAI API key** will serve it (and with which id), another connected cloud, or **SecureAI**, and which ones will be hidden from users.
3. When the test passes, turn on **Route traffic to the OpenAI API** and click **Save**. **The switch does not stick until you save.**
4. The card turns green: **Routing to the OpenAI API**.

Models served by your key show the OpenAI logo next to their name in the chat model selector; hovering it says your organization's OpenAI API key serves them.

## Data residency

SecureAI **cannot pin the region where OpenAI processes a call**. So if your organization turns on **Require a pinned region in your own cloud** (below the provider cards in **Admin → Integrations → AI providers**):

- Routing to the OpenAI API cannot be enabled.
- If it was already enabled, its calls are **refused** — never sent to SecureAI's providers instead.

If you need data residency for GPT, use [Azure AI Foundry](/en/integrations/cloud/azure-ai-foundry-inference) with a regional or data-zone deployment.

## What is billed, and to whom

- **OpenAI bills the usage to your organization or project**, with your credits and discounts. Rate limits and budget are **those of your OpenAI organization or project**.
- SecureAI shows the cost of those turns as a **list-price estimate** for analytics only; the real figure may differ.
- These turns **do not count against the seats' spend cap**, unless you turn on **Apply each seat's spend cap to turns billed to your key**.

## Security and compliance

- **The key is write-only.** It is stored encrypted and never returned to the browser, not even to an admin: only its last 4 characters are shown. It never appears in the activity log.
- **The path stays protected.** Every call goes through SecureAI's SMLTP gateway: model policy, DLP on the prompt and on the response (streaming included), a per-request authorization token and a verifiable **signed receipt**. The gateway forwards your key to OpenAI and holds none of its own.
- **Fail closed.** If the key cannot be read, OpenAI rejects it or a model is not available to your key, the request is refused; it is not sent to another provider unless you allowed fallback.
- **Kept apart from SecureAI's keys.** Calls paid by your key use a lane of their own, separate from the one SecureAI uses with its own account.
- **Audit.** Saving, testing or disconnecting the integration is recorded in the activity log, never with the key.

## Disconnect and revoke

**Disconnect** (panel footer) deletes the configuration and the stored key. From then on, **all the traffic your key served returns to SecureAI-managed providers**. You can also just turn off **Route traffic to the OpenAI API** to pause routing and keep the connection.

To revoke SecureAI's access on OpenAI's side, **delete the key** in the OpenAI platform (**API keys**).

## Troubleshooting

These are the reasons **Test connection** shows:

| Reason | Likely cause | What to do |
|--------|--------------|------------|
| Credential / OpenAI rejected the API key (401) | The key is wrong or was revoked, or the organization or project IDs do not belong to the key | Check the key and the IDs; create a new key if needed. |
| The key is not allowed to call this model (403) | The project has no access to that model | Check the project's model access and the key's permissions in the OpenAI platform. |
| Model not available | OpenAI does not offer that model id to your key or project | **Refresh** the model list and pick another id. |
| Rate limit or quota reached | The rate limit, the quota or the project's budget was reached | Check the project's limits and billing in the OpenAI platform, or retry later. |
| Blocked by your SMLTP model policy | SecureAI's policy does not allow the probed model | Use the **Open SMLTP policies** link and allow the model, or pick a default model the policy already allows. |
| OpenAI returned an error | A failure on OpenAI's side | Retry; if it persists, check OpenAI's status. |
| This lane's SMLTP gateway is unreachable / TLS error | A SecureAI infrastructure problem | Contact support. It does not depend on your OpenAI account. |

Errors users may see in the chat:

| Code | Meaning |
|------|---------|
| `SAI-OPENAI-001` | The chosen model is not available to your key and fallback is off. Pick another model, add an override or allow fallback. |
| `SAI-OPENAI-002` | The stored API key could not be read. Check the connection. |
| `SAI-RESIDENCY-001` | The residency policy requires a pinned region and the OpenAI API does not pin one: the call was refused. |
| `SAI-VERTEX-005` | The inference configuration could not be read and the request was refused for safety. Retry in a few seconds. |

When a call fails for a reason only an admin can fix (a revoked key, quota exhausted, a model not available), SecureAI notifies the admins by email, on the integration card and in the notification bell.

## Current limitations

- **No pinned data residency** (see above).
- **gpt‑oss** does not run on your key: OpenAI does not host those models.
- **Embeddings, re-ranking, OCR, the admin assistant, image generation and realtime voice** stay on SecureAI-managed providers.

## Related

- [Anthropic API — Inference with your organization's key](/en/integrations/cloud/anthropic-api-inference)
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference): GPT on your Azure resource, with data residency.
- [OpenAI Platform](/en/integrations/cloud/openai-platform): inventory of OpenAI projects, keys and usage.
- [Cloud AI providers overview](/en/integrations/cloud/overview)
- [Signed receipts](/en/api/receipts)
