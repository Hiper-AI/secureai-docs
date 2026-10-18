---
sidebar_position: 10
title: "Amazon Bedrock — Inference on your account"
sidebar_label: "Amazon Bedrock — Inference"
description: "Run SecureAI's LLM traffic, Claude included, on your own AWS account with Amazon Bedrock: use your AWS commitment (EDP), credits, and quotas while SecureAI keeps enforcing DLP, policies, data residency, and signed receipts."
---

# Amazon Bedrock — Inference on your account

With this integration, SecureAI's large language model (LLM) calls for the families you choose run on **your own AWS account, through Amazon Bedrock**, instead of on SecureAI-managed providers. Usage is billed by AWS to your account, so it draws down your **AWS commitment (EDP) and credits**, and it uses **your Bedrock quotas**.

SecureAI stays in the path of every request: **DLP, model policies, data residency, and signed receipts** apply exactly as they do with any other provider. Traffic goes through SecureAI's gateway, which also inspects and redacts the model's responses (streaming included) before they reach the user.

<Info>
**Not to be confused with the other AWS card.** This page connects Bedrock as an **inference provider** (Admin → Integrations → **AI providers**). The **AWS Bedrock** card in the **Cloud** category inventories agents, models, identities, and costs in read-only mode and never sends a prompt; it is described in [AWS — Discovery](/en/integrations/cloud/aws-bedrock). Both use the same CloudFormation template and the same External ID, but each has its own role with different permissions.
</Info>

## How it works

1. You deploy an IAM role in your AWS account that **only** SecureAI's principal can assume, and **only** when it presents your organization's External ID.
2. For each call, SecureAI assumes that role and gets **temporary credentials** (they last one hour and renew automatically). No access key is stored.
3. SecureAI signs the request with **AWS Signature V4** and sends it, through its gateway, to **Amazon Bedrock Runtime** in the Region you chose: Chat Completions for OpenAI-compatible models, and Anthropic's Messages API for Claude.
4. The response comes back through the gateway, which applies DLP and issues the signed receipt.

SecureAI **does not use Bedrock API keys** (bearer tokens). That is why the integration works even if your organization blocks Bedrock API keys with an SCP, a guardrail AWS commonly recommends.

## What runs on Bedrock and what does not

| Runs on your Bedrock | Stays on SecureAI-managed providers |
|---|---|
| Chat and agents (models from the families you choose) | Embeddings (document and index search) |
| Grammar check, translation, Teams summaries and other background tasks, when their family runs on Bedrock or you choose **Remap everything** | Search re-ranking, document OCR |
| | Admin assistant, image generation, realtime voice |
| | Self-hosted models and the Claude Code proxy |

Model families available on Bedrock:

| Family | Models |
|--------|--------|
| **Claude (Anthropic)** | The Claude models Bedrock offers in your Region. **Bedrock is SecureAI's only bring-your-own-cloud lane that serves Claude**: the Vertex AI and Azure AI Foundry lanes do not. |
| **OpenAI** | GPT‑5.x on Bedrock |
| **gpt‑oss** | For example `gpt-oss-120b` |
| **DeepSeek** | DeepSeek V3.x |
| **Qwen** | Bedrock's Qwen models |
| **Mistral** | Mistral Large 3, Ministral 3 |

**Not offered through Bedrock:** Llama, Amazon Nova, DeepSeek‑R1, Mistral 7B, and Mixtral. On Bedrock those models only answer the Converse API, not the OpenAI-compatible surface SecureAI uses, so they stay on SecureAI-managed providers. Gemini is not on Bedrock.

## How many cloud providers you can use

| Plan | Inference providers enabled at the same time |
|------|-----------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry, **or** Amazon Bedrock) |
| **Enterprise** | Up to 3 — for example Vertex AI for Gemini, Foundry for GPT, and Bedrock for Claude |

With more than one provider enabled, each one serves **different** model families: a family can be routed to only one provider, and only one provider can use **Remap everything**. SecureAI refuses a configuration that overlaps another one and tells you which family collides.

## Prerequisites

- An **AWS account** where the models you want to use are **available to your account in the chosen Region**.
- For **Claude**: Anthropic's **use-case form** submitted once in the Bedrock console (**Model access** / **Model catalog** → any Claude model). Approval is usually immediate. Without it, the connection test tells you so.
- Some of the newest models (latest Claude, GPT‑5.x) may need **AWS to enable them for your account**. Until then, the test reports that the model is not available for your account.
- Permission in AWS to **create a CloudFormation stack with IAM roles** (or to create an IAM role by hand).
- **Admin** permission on the Integrations section of SecureAI.

## Step 1. Copy SecureAI's identity

1. Go to **Admin → Integrations → AI providers** and open **Amazon Bedrock — Inference on your account**.
2. Under **Connection**, leave **Cross-account IAM role** (recommended) selected. The drawer shows:

   | Item | What it is for |
   |------|----------------|
   | **SecureAI principal (trusted by the role)** | The ARN your role will trust. It is the only one that can assume it. |
   | **Your External ID** | Unique to your organization. The role refuses any caller that does not present it, so no other SecureAI customer can use your role (protection against the *confused deputy* problem). |

3. If you will also use [AWS — Discovery](/en/integrations/cloud/aws-bedrock), tick **Also create the read-only discovery role (SecureAI-Discovery) for the AWS inventory**: the same stack creates both roles, and the CLI command changes to `EnableDiscovery=true`. It is unticked by default.

<Warning>
Both connections share one stack name (`SecureAI-Integration`). Deploy it once with the roles you need. Running it again with `EnableInference=false` or `EnableDiscovery=false` makes CloudFormation **delete** that role.
</Warning>

## Step 2. Create the role in your AWS account

<Tabs>
<Tab title="CloudFormation (recommended)">

Deploy the SecureAI stack once in the AWS account where inference will run, in one of two ways:

- **Launch Stack in AWS** (when your deployment offers it): opens the CloudFormation console with every parameter filled in. Tick the IAM acknowledgement and click **Create stack**.
- **Download template** and create the stack from the console (**Create stack → Upload a template file**) with the principal and External ID from step 1, or with the AWS CLI command shown in the drawer. Copy it from the drawer: it already includes your values. It looks like this:

```bash
aws cloudformation deploy --stack-name SecureAI-Integration \
  --template-file secureai-integration.yaml \
  --capabilities CAPABILITY_NAMED_IAM --region us-east-1 \
  --parameter-overrides SecureAIPrincipalArn=<SecureAI principal ARN> \
    ExternalId=<External ID> EnableInference=true EnableDiscovery=false
```

The stack creates the **`SecureAI-BedrockInference`** role and, if you asked for it, the read-only **`SecureAI-Discovery`** role. **It creates no access key.**

| Stack parameter | What it controls |
|-----------------|------------------|
| `SecureAIPrincipalArn` / `ExternalId` | SecureAI's identity from step 1. |
| `EnableInference` | Creates the inference role (default `true`). |
| `EnableDiscovery` | Creates the read-only discovery role (default `true`). |
| `AllowRevokeAccessKeys` | Discovery only: lets SecureAI deactivate and reactivate IAM access keys (default `false`). |
| `RoleNamePrefix` | Prefix of the role names (default `SecureAI`). |

When the stack completes, copy the **`BedrockInferenceRoleArn`** output (**CloudFormation → Stacks → SecureAI-Integration → Outputs**).

</Tab>
<Tab title="Manual role (no CloudFormation)">

If your organization does not allow CloudFormation, create the role by hand in **IAM → Roles → Create role → Custom trust policy**, named `SecureAI-BedrockInference`, with a maximum session duration of 1 hour.

**Trust policy** (replace the values in `<>` with the ones from step 1):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SecureAIWithExternalId",
      "Effect": "Allow",
      "Principal": { "AWS": "<SecureAI principal ARN>" },
      "Action": "sts:AssumeRole",
      "Condition": { "StringEquals": { "sts:ExternalId": "<External ID>" } }
    }
  ]
}
```

**Permissions policy** (inline; replace `<account id>` with your 12-digit account ID):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InvokeModels",
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/*",
        "arn:aws:bedrock:*:<account id>:inference-profile/*",
        "arn:aws:bedrock:*:<account id>:application-inference-profile/*"
      ]
    },
    {
      "Sid": "ReadModelCatalog",
      "Effect": "Allow",
      "Action": [
        "bedrock:ListFoundationModels",
        "bedrock:GetFoundationModel",
        "bedrock:ListInferenceProfiles",
        "bedrock:GetInferenceProfile"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ApplyYourGuardrails",
      "Effect": "Allow",
      "Action": "bedrock:ApplyGuardrail",
      "Resource": [
        "arn:aws:bedrock:*:<account id>:guardrail/*",
        "arn:aws:bedrock:*:<account id>:guardrail-profile/*"
      ]
    },
    {
      "Sid": "ListYourGuardrails",
      "Effect": "Allow",
      "Action": "bedrock:ListGuardrails",
      "Resource": "*"
    }
  ]
}
```

Copy the ARN of the role you created.

</Tab>
<Tab title="IAM user access key">

As an alternative, SecureAI accepts the access key of a **dedicated IAM user** (Access key ID and Secret access key). Give the user the same permissions policy as the manual role.

<Warning>
A long-lived access key is **less safe than the role**: it never expires, and anyone holding it can call Bedrock as you until you rotate it. SecureAI stores the secret **encrypted** and never shows it again. Temporary (`ASIA…`) keys are refused because they expire within hours. We recommend the role: if you switch to it later, SecureAI deletes the stored access key.
</Warning>

</Tab>
</Tabs>

<Info>
**Why the resource Region is `*`.** A cross-Region inference profile needs permission on the profile **and** on the model in **every Region** it may route to. You can narrow the model list in the policy if you want; the Region must stay broad for the profiles you use.
</Info>

## Step 3. Connect the account in SecureAI

1. Under **Connection**, fill in:

   | Field | What to enter |
   |-------|---------------|
   | **Role ARN** | The `BedrockInferenceRoleArn` output (or the manual role's ARN). With an access key: the **Access key ID** and **Secret access key**. |
   | **AWS Region** | Where Bedrock receives your calls and where the model list is read (for example `us-east-1`, `eu-central-1`). Pick **Other** to type any Region Bedrock supports. |
   | **Inference scope** | **Geography** (default), **In-Region only**, or **Global**. See [Data residency](#data-residency-inference-scope). |

2. Click **Save**. SecureAI assumes the role, shows your **AWS account ID** and Region, and reads the Region's catalog under **Models available to your account**: the Region's foundation models and the cross-Region inference profiles. Nothing is routed yet: the integration is saved turned off so you can test it first, and the card shows **Configured · not routing to Bedrock**.

If the model list shows an error, the role cannot read the catalog (`bedrock:ListFoundationModels` / `bedrock:ListInferenceProfiles`) in that Region. Inference still works with SecureAI's built-in model ids (the connection test proves them), but automatic mapping is limited. If you change the Region, save again to re-read the models.

## Data residency: inference scope

The **inference scope** decides where AWS may process prompts:

| Scope | What SecureAI uses | Where prompts are processed |
|-------|--------------------|-----------------------------|
| **In-Region only** | The Region's foundation models | Only in the chosen Region; calls never leave it. Claude and GPT‑5.x are **unavailable**: Bedrock offers them only through cross-Region profiles. |
| **Geography** (default) | The cross-Region inference profile of your Region's geography (`us.`, `eu.`, `apac.`, `jp.`, `au.`, `ca.`) | In any Region of that geography, never outside it. Keeps residency and unlocks Claude and GPT‑5.x. |
| **Global** | `global.` profiles | In any commercial AWS Region. Highest capacity, but it **pins no residency**: SecureAI's residency policy treats it as unpinned. |

SecureAI enforces your organization's data-residency policy on the resulting geography. If you need residency, use **Geography** or **In-Region only**.

## Your own Bedrock Guardrail (optional)

If your organization already uses [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html), you can have SecureAI apply one of your guardrails to **every call** it makes on this connection. It is a **second layer** on top of SecureAI's DLP: Bedrock evaluates the prompt and the reply with your own denied topics, content filters, word filters, sensitive-information filters and grounding checks. It applies to Claude and to the Chat Completions models alike (gpt-oss, DeepSeek, Mistral, Qwen, GPT‑5.x).

1. In the Bedrock console (**Guardrails**), create or choose the guardrail in the **same Region** you configured in SecureAI, and **publish a version** (**Create version**).
2. In SecureAI's Amazon Bedrock panel, under **Your Bedrock Guardrail (optional)**, click **List my guardrails** and pick the guardrail and the version. If the role cannot list them, type the guardrail **id** (or its ARN) and the version number.
3. Click **Save**, then **Test connection**: the test goes through the guardrail exactly like real traffic.

To remove it, choose **None** as the guardrail and save.

| When… | Result |
|-------|--------|
| The guardrail lets the call through | The user gets the model's reply, unchanged. |
| The guardrail blocks the prompt or the reply | The user gets **the blocked message you configured in the guardrail**. For API integrations, the reply comes with `finish_reason: "content_filter"`. Every intervention is logged (`SAI-BEDROCK-006`). |
| The role cannot apply the guardrail, or the version does not exist | The call is **refused**. It is never retried on SecureAI's providers, **even if you allowed fallback**: that path cannot apply your guardrail. |

<Warning>
**Use a published version in production.** `DRAFT` is the guardrail's working copy: anyone editing it in the console changes what is applied here, without a new version. SecureAI allows it, but warns you.
</Warning>

<Info>
**Permissions.** The role needs `bedrock:ApplyGuardrail` on your guardrails and, for the list, `bedrock:ListGuardrails`. SecureAI's CloudFormation template includes both from this version on: if you deployed the stack earlier, **update it** with the new template (or add the two statements of the manual role's policy). If the guardrail uses cross-Region inference, the template also covers its *guardrail profiles*.

**How it is applied.** SecureAI sends the id and the version in the `X-Amzn-Bedrock-GuardrailIdentifier` and `X-Amzn-Bedrock-GuardrailVersion` headers, **inside the Signature V4 signature** of each request: nothing on the path can drop them without AWS refusing the call, and no user or integration can pick another guardrail. SecureAI does not turn on the guardrail *trace*, so the content that triggered it is not returned in the reply.

**AWS logs.** If Bedrock model invocation logging is on, AWS stores the original content even when the guardrail masks it. Encrypt those logs with KMS and restrict access to them.
</Info>

## Claude prompt caching

On Claude models, SecureAI automatically uses [Bedrock prompt caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html) so your account pays less and answers faster when a conversation reuses long context. There is nothing to configure.

- SecureAI marks up to two cache points per request: the **system prompt** and the **last long block** of the conversation (a pasted document, a search context, a long tool result).
- It marks them only when the content before them reaches the **model's token minimum** (for example 1,024 on Claude Sonnet 4.6 and 4,096 on Claude Haiku 4.5). Short prompts are sent exactly as before.
- The cache lasts **5 minutes** from its last use. Reading from cache costs about **10%** of an input token; writing it costs **25% more** than a regular token, and only on content that reaches the minimum. It pays off from **two calls** with the same context in that window, which is the usual case in a conversation.
- Each turn's usage separates the tokens read from cache and the ones written, so you can see them in analytics and on your AWS bill.

Models other than Claude are not affected.

## Step 4. Choose what runs on Bedrock

Under **What runs on Amazon Bedrock** there are two modes:

- **Only these model families**: the families you tick run on your Bedrock; every other model keeps running on SecureAI-managed providers (or another connected cloud).
- **Remap everything to Amazon Bedrock**: all LLM calls run on your Bedrock. Models with no Bedrock equivalent are served by a **default model**.

**Automatic mapping.** On save, SecureAI maps each SecureAI catalog model to the Bedrock id that serves it under your inference scope. For example, with **Geography** in a US Region:

| SecureAI model | Bedrock id |
|----------------|------------|
| `anthropic/claude-sonnet-4.6` | `us.anthropic.claude-sonnet-4-6` |
| `openai/gpt-oss-120b` | `openai.gpt-oss-120b-1:0` |

**Default Bedrock models** (pick them from your account's model list):

| Tier | Used for |
|------|----------|
| **Fast** | Background tasks (grammar, translation, Teams) and remapped internal calls |
| **Standard** | Models with no equivalent |
| **Reasoning** | Reasoning models with no equivalent |
| **Vision** | Requests with images or PDFs |

Under **Model → Bedrock id overrides** you can send a catalog model to an exact Bedrock target: a **model id**, an **inference profile id**, or the **ARN of an application inference profile**. Overrides win over the automatic mapping and are used as-is, even outside the chosen scope; the residency policy is still enforced on the resulting geography. An application inference profile ARN has no geography SecureAI can know, so the residency policy treats it, like a `global.` profile, as unpinned.

There are also two options:

| Option | Off (default, recommended) | On |
|--------|----------------------------|----|
| **Allow fallback to SecureAI-managed models** | If Bedrock fails or a model has no Bedrock id, the request is **refused** (fails closed) instead of being sent to another provider. | Those requests are retried **once** on SecureAI-managed providers. The retry is audited. |
| **Apply each seat's spend cap to turns served in your account** | Turns served by your Bedrock do not count against seats' monthly spend cap. | They count against each seat's monthly spend cap, at list price. |

## Step 5. Test, review, and turn it on

1. **Test connection** sends a minimal request to each default model, **through the same path real traffic uses** (gateway, policies, and receipts included), and shows each result with its latency. Choose the default models before testing: without them, it probes SecureAI's built-in ids for `gpt-oss-120b`, DeepSeek V3.2, and Claude Haiku 4.5, which must also be allowed by your SMLTP model policy. The test **is billed to your AWS account** (cents).
2. **Routing preview** shows, for every catalog model, whether **Your Amazon Bedrock** (and with which id), another connected cloud, or **SecureAI** will serve it, and which models will be hidden from users.
3. When the test passes, turn on **Route traffic to Amazon Bedrock** and click **Save**. **If you do not save, the switch does not stay on.** If your plan allows no further cloud provider or the routing overlaps another one, SecureAI refuses it and says why.
4. The card turns green: **Routing to Amazon Bedrock**. If it is saved but off, it shows **Configured · not routing to Bedrock**.

Models served by your Bedrock show the AWS logo next to their name in the chat model selector; hovering it says *Served by your organization's Amazon Bedrock*.

## What is billed, and to whom

- **LLM usage is billed by AWS to your account**, with your EDP, discounts, and credits. Rate limits are **your Bedrock quotas**.
- SecureAI shows the cost of those turns as a **list-price estimate** for analytics only; AWS's actual figure may be lower.
- Turns on Bedrock **do not count against seats' spend cap** unless you turn on **Apply each seat's spend cap to turns served in your account**.

## Security and compliance

- **No stored secrets.** With the role, SecureAI stores no AWS credential: it gets one-hour temporary credentials and renews them automatically. If you use an access key, the secret is stored encrypted and never returned to the browser.
- **Scoped trust.** The trust policy admits **only** SecureAI's principal, and **only** with `sts:ExternalId` equal to your organization's External ID.
- **Least privilege.** The inference role can only invoke models (`bedrock:InvokeModel`, `bedrock:InvokeModelWithResponseStream`), read the model catalog, and list and apply your account's Bedrock Guardrails. It cannot read your data, your IAM, or your billing.
- **Compatible with your SCPs.** SecureAI signs with Signature V4 and temporary credentials; it does not need Bedrock API keys.
- **The path stays protected.** Every call goes through SecureAI's SMLTP gateway: DLP on the prompt and on the response (streaming included), a per-request authorization token, and a verifiable **signed receipt**.
- **Fails closed.** If the configuration cannot be read or the role cannot be assumed, the request is refused; it is not sent to another provider unless you allowed fallback.
- **Audit.** Saving, testing, or disconnecting the integration is recorded in the activity log, never with the secret.

## Disconnect and revoke

**Disconnect** (drawer footer) deletes the configuration. From then on, **all traffic Bedrock served returns to SecureAI-managed providers**. You can also turn off only **Route traffic to Amazon Bedrock** to pause routing while keeping the connection.

To revoke SecureAI's access in AWS, **delete the stack** (or the role). If you used an access key, deactivate or delete it in IAM.

## Troubleshooting

These are the reasons **Test connection** shows:

| Reason | Likely cause | What to do |
|--------|--------------|------------|
| Credential | SecureAI could not assume the role: the stack is not deployed, the ARN is wrong, or the trust policy lacks SecureAI's principal or your External ID. With an access key: the key is invalid. | Check the ARN and the stack (or the key pair). |
| Blocked by an SCP | A service control policy of your AWS organization denies the action | Ask your cloud team to allow `bedrock:InvokeModel` for this account and Region. **The stack cannot fix it.** |
| Permission denied | The role or user lacks `bedrock:InvokeModel` on that model | Update the SecureAI stack or extend the IAM policy. |
| Anthropic use-case form | Claude is not enabled for your account yet | Submit Anthropic's form in the Bedrock console (**Model access** / **Model catalog** → a Claude model) and test again. |
| Model not entitled | AWS has not opened that model to your account or Region yet | Request it through your AWS account team; meanwhile, pick another model. |
| Model not available | The id is not offered in that Region or inference scope | Refresh the model list, pick another id, or widen the scope. |
| Quota | Bedrock throttled the requests | Retry later, or request a higher quota in **Service Quotas**. |
| Cannot apply the guardrail | The role lacks `bedrock:ApplyGuardrail` on the chosen guardrail | Update the SecureAI stack with the new template, or grant the permission on the guardrail. |
| Guardrail not found | The guardrail id or version does not exist in that Region | Pick it again from the list, or check the id and that the version is published. |
| Blocked by your SMLTP model policy | SecureAI's policy does not allow the model | Add the model to the allowed policy. |
| Amazon Bedrock returned an error | A failure on AWS's side | Retry; if it persists, check the AWS service status. |
| SMLTP Bedrock gateway unreachable / TLS error | A SecureAI infrastructure issue | Contact support. It does not depend on your AWS account. |

Errors users may see in the chat:

| Code | Meaning |
|------|---------|
| `SAI-BEDROCK-001` | The chosen model has no Bedrock equivalent in your Region and inference scope, and fallback is off. Pick another model, widen the scope, or allow fallback. |
| `SAI-BEDROCK-002` | AWS credentials could not be obtained (the role cannot be assumed or the access key is invalid). Check the stack and the connection. |
| `SAI-VERTEX-005` | The cloud-inference configuration could not be read; the request was refused for safety. Retry in a few seconds. |

## Current limitations

- **Llama, Amazon Nova, DeepSeek‑R1, Mistral 7B, and Mixtral** are not served through Bedrock (on Bedrock they only answer the Converse API).
- With **In-Region only**, Claude and GPT‑5.x are unavailable.
- **Not every Claude model answers through Bedrock.** SecureAI calls Claude through Bedrock's Anthropic Messages API, and Bedrock does not serve every Claude model there: in our October 2026 tests, Claude Sonnet 4.6 and Haiku 4.5 answered, while Opus 4.6, Opus 4.5 and Sonnet 4.5 returned *Model not available* even with access granted. Pick as default models Claude models that pass **Test connection**.
- **Claude on Bedrock:** every request gets its signed receipt, but the audit evidence does not yet bind the retained response to that receipt (the "response bound to receipt" flag is not available for these turns).
- **Embeddings, re-ranking, OCR, the admin assistant, image generation, and realtime voice** stay on SecureAI-managed providers.

## Related

- [AWS — Discovery](/en/integrations/cloud/aws-bedrock) — inventory of Bedrock agents, models, identities, and cost.
- [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference)
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [Signed receipts](/en/api/receipts)
