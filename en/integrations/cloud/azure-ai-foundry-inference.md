---
sidebar_position: 8
title: "Azure AI Foundry — Inference on your account"
sidebarTitle: "Azure AI Foundry"
icon: "/img/icons/azure.svg"
sidebar_label: "Azure AI Foundry — Inference"
description: "Run SecureAI's LLM traffic on your own Azure AI Foundry resource: consume your Azure commitment and credits while SecureAI keeps enforcing DLP, policies, and signed receipts."
---

# Azure AI Foundry — Inference on your account

With this integration, SecureAI's large language model (LLM) calls run on **your own Azure AI Foundry resource** instead of on SecureAI-managed providers. Usage is billed by Microsoft to your Azure subscription, so it draws down your **Azure commitment (MACC) and credits**.

SecureAI stays in the path of every request: **DLP, model policies, data residency, and signed receipts** apply exactly as they do with any other provider.

<Info>
**Not to be confused with the other Azure card.** This page connects Foundry as an **inference provider** (Admin → Integrations → **AI providers**). The **Azure — Discovery** card (**Cloud** category) inventories deployments, Foundry agents, every Entra non-human identity, and costs in read-only mode and never sends a prompt; it is described in [Azure — Discovery](/en/integrations/cloud/azure-ai-foundry). You can use both on the same subscription, but they are independent and ask for different permissions.
</Info>

## What runs on Foundry and what does not

| Runs on your Foundry | Stays on SecureAI-managed providers |
|---|---|
| Chat and agents (models from the families you choose) | Embeddings (document and index search) |
| Grammar check, translation, Teams summaries and other background tasks, when their family runs on Foundry or you choose **Remap everything** | Search re-ranking, document OCR |
| | Admin assistant, image generation, realtime voice |
| | Self-hosted models and the Claude Code proxy |

Supported model families: **OpenAI (GPT‑5 and o‑series), gpt‑oss, DeepSeek, Llama, Grok, Mistral, and Claude** — any of them that you have **deployed** on the resource. SecureAI picks the API from each deployment's format:

| Deployment | API SecureAI uses |
|------------|-------------------|
| OpenAI, gpt‑oss, DeepSeek, Llama, Grok, Mistral | The OpenAI-compatible API of `<your-resource>.openai.azure.com` |
| Claude (deployments with the Anthropic format) | Foundry's Anthropic Messages API: `https://<your-resource>.services.ai.azure.com/anthropic/v1/messages` |
| Other partner models that are not OpenAI-compatible (Phi, Cohere, AI21, Core42…) | The Azure AI Model Inference API: `https://<your-resource>.services.ai.azure.com/models/chat/completions` |

All three use the same service principal. For Claude, SecureAI asks Entra ID for a token for the `https://ai.azure.com/.default` audience, as Microsoft documents.

## How many cloud providers you can use

| Plan | Inference providers enabled at the same time |
|------|-----------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry **or** Amazon Bedrock) |
| **Enterprise** | Up to 3 — for example Vertex AI for Gemini and Foundry for GPT |

With more than one provider enabled, each one serves **different** model families: a family can be routed to only one provider, and only one provider can use **Remap everything**. SecureAI refuses a configuration that overlaps another one and tells you which family collides.

## Prerequisites

- An **Azure AI Foundry** (or Azure OpenAI) resource with at least one **model deployment** (for example `gpt-5.1` or `gpt-oss-120b`).
- A **service principal** (app registration in Microsoft Entra ID) with a **client secret** and, on that resource:
  - **Cognitive Services OpenAI User** — to call the models (required).
  - **Reader** — so SecureAI can list your deployments and map models automatically (recommended).
  - **Cognitive Services User** — for Claude and the other partner models. It is the role Microsoft documents for calling Claude on Foundry with Entra ID.
- For **Claude**: according to Microsoft, a paid subscription and an Azure Marketplace subscription to the model offer, created when you accept its terms while deploying it. See [Deploy and use Claude models in Microsoft Foundry](https://learn.microsoft.com/azure/ai-foundry/foundry-models/how-to/use-foundry-models-claude).
- **Admin** permission on the Integrations section of SecureAI.

## Step 1. Prepare the service principal in Azure

From [Azure Cloud Shell](https://shell.azure.com/) or with the `az` CLI. Replace `MY_RESOURCE` and `MY_RG`:

```bash
# 1. ID of the Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)

# 2. Create the service principal with the role to call models, scoped to the resource only
az ad sp create-for-rbac --name secureai-foundry \
  --role "Cognitive Services OpenAI User" --scopes "$RID"

# 3. (Recommended) let SecureAI list the deployments
az role assignment create --assignee <appId> --role "Reader" --scope "$RID"

# 4. (Claude and other partner models) let SecureAI call them
az role assignment create --assignee <appId> --role "Cognitive Services User" --scope "$RID"
```

Step 2 prints `appId` (client ID), `password` (client secret), and `tenant` (directory ID). You will paste them in SecureAI.

<Warning>
Treat the client secret like a password. SecureAI stores it **encrypted** and never shows it again. Client secrets **expire** (one year by default with `az`): put a reminder to rotate it, or the integration stops working that day.
</Warning>

<Info>
Roles assigned in Azure can take **up to 5 minutes** to take effect. If the first connection test returns **Missing role**, wait and test again.
</Info>

## Step 2. Connect the resource in SecureAI

1. Go to **Admin → Integrations → AI providers** and open **Azure AI Foundry — Inference on your account**.
2. Under **Connection**, fill in:

   | Field | What to enter |
   |-------|---------------|
   | **Resource name** | The name in `https://<name>.openai.azure.com` (the same as in `https://<name>.services.ai.azure.com`). You can paste the full endpoint URL; SecureAI keeps the name. |
   | **Directory (tenant) ID** | `tenant` from step 1. |
   | **Application (client) ID** | `appId` from step 1. |
   | **Client secret** | `password` from step 1. |
   | **Subscription ID / Resource group** | The resource's subscription and resource group. Needed when the principal only has **Reader** on the resource (the recommended setup), because it can read the resource but not search for it. |

3. Click **Save**. SecureAI lists your **deployments** (name, model, version, and deployment type) and maps each catalog model to the deployment that serves it — for example, `openai/gpt-oss-120b` → your `gpt-oss-120b` deployment. Nothing is routed yet: the integration is saved turned off so you can test it first.

If the deployment list shows a warning, the principal does not have **Reader** on the resource, or the subscription / resource group is missing. Inference still works; you just have to type the deployment names yourself.

## Step 3. Choose what runs on Foundry

- **Only these model families** — the families you tick run on your Foundry; everything else keeps running where it did. Default: **OpenAI**.
- **Remap everything to Foundry** — all LLM calls run on Foundry; models with no deployment are served by a **default deployment**.

**Default deployments** (pick from your deployments; embedding deployments are not offered, because they cannot answer a chat):

| Tier | Used for |
|------|----------|
| **Fast** | Background tasks (grammar, translation, Teams) and remapped internal calls |
| **Standard** | Models with no deployment |
| **Reasoning** | Reasoning models with no deployment |
| **Vision** | Requests with images or PDFs |

Under **Model overrides** you can send a catalog model to a specific deployment (for example `openai/gpt-5.2` → `prod-chat`). Overrides win over the automatic mapping.

Fallback and user quotas work as on Vertex AI: with **fallback off** (recommended) a request that Foundry cannot serve is **refused**, never sent to another provider.

## Step 4. Test, review, and turn it on

1. **Test connection** sends a one-token request to each default deployment (or to your first chat deployments if you have not chosen defaults), through the same path real traffic uses. It is billed to your Azure subscription (cents).
2. **Routing preview** shows, for every catalog model, whether **Foundry**, **Vertex AI**, or **SecureAI** will serve it, and with which deployment. A model of a family you route to Foundry that has no deployment (and no default for its tier) shows **Hidden from users**: with fallback off, the chat does not offer it.
3. Turn on **Route traffic to Azure AI Foundry** and click **Save**.

Models served by your Foundry show the **Azure logo** in the chat model selector.

## Data residency

The region requests are processed in depends on the **deployment type**:

| Deployment type | Where prompts are processed |
|-----------------|-----------------------------|
| **Global** (Global Standard, Global Provisioned) | Any Azure region Microsoft chooses — no residency guarantee |
| **Data Zone** | Inside the US or EU data zone of your resource |
| **Standard / Provisioned** (regional) | The resource's region |

SecureAI applies your organization's residency policy with that region. If you need residency, use **Data Zone** or regional deployments.

## Models from your cloud that SecureAI doesn't list

Your resource may have chat models deployed that SecureAI's catalog does not include (for example Phi or Cohere). Once your SecureAI deployment enables them, the chat offers them too:

- **Where they come from.** Your resource's chat deployments that no SecureAI catalog model already reaches. Embedding, speech, and image deployments are never offered. A model that a catalog model already reaches keeps its catalog name and is not repeated here.
- **Where they appear.** In the chat model selector, in their own section: **Your Azure AI Foundry**. Their id is `byo/azure-foundry/` followed by the deployment name.
- **Where they run.** Only on your Foundry. They are never sent to SecureAI-managed providers, even if you allowed fallback.
- **What they cost.** SecureAI does not charge for them (they have no SecureAI list price), so the per-seat spend cap does not apply to them, and any seat can use them. Microsoft bills the usage to your subscription, like the rest.
- **Same governance.** They go through the model policy, provider and vendor blocks, DLP, signed receipts, and audit. If your model policy lists the allowed models, add them in the policy editor, where they show up under your cloud's section.
- **What each one takes.** Tools, images, and context size come from the facts the provider publishes about the model. If a model takes no tools or no images, the chat does not offer them for it, and images are never sent to another provider to be described.

To turn the whole list off or hide individual models, use the **Offer the models of your Azure AI Foundry that SecureAI does not list** switch and each model's checkbox in the Azure AI Foundry panel, then click **Save**.

## What is billed, and to whom

- **LLM usage is billed by Microsoft to your Azure subscription**, with your agreement's discounts and credits.
- SecureAI shows the cost of those turns as a **list-price estimate** for analytics only.
- Turns on Foundry **do not deduct points** from users unless you turn on **Apply user point quotas**.

## Security and compliance

- **Encrypted credential.** The client secret is stored encrypted (AES-256-GCM) and is never returned to the browser.
- **Minimal permissions.** *Cognitive Services OpenAI User* to call models (and *Cognitive Services User* if you use Claude or other partner models) and *Reader* to list deployments, all scoped to the **resource** — never to the subscription.
- **The path stays protected.** Every call goes through SecureAI's SMLTP gateway (DLP, per-request authorization token, signed receipt). The gateway only connects to `<your-resource>.openai.azure.com` and `<your-resource>.services.ai.azure.com`.
- **Fails closed.** If the configuration cannot be read or Entra ID does not issue a token, the request is refused.
- **Audit.** Saving, testing, or disconnecting is recorded in the activity log (field names only, never the secret).

## Troubleshooting

| Reason in the test | Likely cause | What to do |
|--------------------|--------------|------------|
| Credential rejected | Wrong or expired client secret, wrong tenant or client ID | Create a new secret (`az ad app credential reset --id <appId>`) and paste it. |
| Missing role | The principal lacks **Cognitive Services OpenAI User** on the resource (or **Cognitive Services User**, for Claude and the other partner models), or the role is still propagating | Assign the role on the resource; wait up to 5 minutes. |
| Model not available | The deployment name does not exist on the resource | Check the deployment names (Refresh the list) and the tier defaults. |
| Quota exceeded | The deployment's tokens-per-minute quota is exhausted | Raise the deployment's capacity in Foundry. |
| Blocked by your SMLTP model policy | SecureAI's policy does not allow the model | Add the model to the allowed policy. |

Errors users may see in the chat:

| Code | Meaning |
|------|---------|
| `SAI-FOUNDRY-001` | The chosen model has no deployment on your Foundry and fallback is off. |
| `SAI-FOUNDRY-002` | Entra ID did not issue a token (secret invalid or expired). Renew the secret. |
| `SAI-VERTEX-005` | The cloud-inference configuration could not be read; the request was refused for safety. Retry in a few seconds. |

## Current limitations

- **Embeddings, re-ranking, OCR, the admin assistant, image generation, and realtime voice** stay on SecureAI-managed providers.
- **One Foundry resource** per organization.
- Authentication is **by service principal with a client secret** (no certificates or managed identity yet).

## Related

- [Azure — Discovery](/en/integrations/cloud/azure-ai-foundry)
- [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference)
- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
