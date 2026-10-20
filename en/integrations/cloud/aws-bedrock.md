---
sidebar_position: 9
title: "AWS — Discovery"
sidebarTitle: "AWS"
icon: "/img/icons/aws.svg"
sidebar_label: "AWS — Discovery"
description: "Connect AWS so SecureAI can inventory Bedrock Agents, AgentCore, SageMaker, knowledge bases, guardrails, models, IAM identities, CloudTrail activity, and Bedrock usage and cost, and detect Bedrock use outside SecureAI, in one account or across your AWS Organization"
---

# AWS — Discovery

Connect your AWS account (or your whole AWS Organization) so SecureAI can inventory Amazon Bedrock and AgentCore agents, models, and resources, along with the IAM identities that can invoke them, the audit events, usage, and cost that surround them.

<Info>
This connection **only reads** the account and never sends a prompt. If you want to run SecureAI's LLM traffic on your own AWS account, see [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference). Both use the same CloudFormation template and the same External ID.
</Info>

## What SecureAI imports

For each account and each region you choose:

- **Agents**: Bedrock Agents (classic) and their aliases, and **AgentCore** runtimes, with their gateways and memories.
- **Bedrock resources**: knowledge bases, guardrails, custom and imported models, provisioned throughput, and inference profiles (system and application).
- **SageMaker**: real-time inference endpoints and models.
- **Model-invocation logging**: whether it is enabled in each region. Off means prompts are not recorded, and it is shown as a gap.
- **Usage** over the last 30 days per model, from CloudWatch: invocations, input and output tokens, and errors.
- **Cost** of Bedrock over the last 30 days, from Cost Explorer: by region and, in AWS Organizations mode, by linked account.
- **Audit**: CloudTrail events of Bedrock and AgentCore over the last 30 days (up to 100 per source and region).
- **NHIs**: IAM users and their access keys with last use (date, service, and region); IAM roles that AI services (Bedrock, AgentCore, SageMaker) can assume, and roles or users whose policies allow invoking Bedrock, with each role's last use. The model each identity used comes from CloudTrail, when that read was complete. Shown in the [NHI Inventory](/en/discovery/nhi-inventory).
- **Who can invoke Bedrock**: an access map that tells explicit grants apart from wildcards (`*`, `bedrock:*`, `NotAction`), and the **effective access** of each of those identities according to the IAM policy simulator.
- **Bedrock used outside SecureAI**: the identities that invoked Bedrock models without going through SecureAI, with model, region, volume, and date. See [Bedrock used outside SecureAI](#bedrock-used-outside-secureai).

<Note>
The access map is first built from the **Allow** statements of IAM policies (inline, customer managed, and AWS managed policies, which are recognized by name). SecureAI then confirms each identity with the **IAM policy simulator** (`iam:SimulatePrincipalPolicy`), first with no specific resource and then on the most-used model. The simulator **does evaluate** Deny statements, conditions, permission boundaries and, when the account belongs to an AWS Organization, SCPs. It **does not simulate** resource control policies (RCPs), VPC endpoint policies, or session policies. A condition that depends on the request context (for example, source IP or MFA) is shown as **Depends on context**, never as confirmed access. Up to 25 identities are simulated per account and sync, explicit grants first.
</Note>

## Prerequisites

A read-only role in your account that SecureAI assumes with your organization's External ID. SecureAI's CloudFormation template creates it as `SecureAI-Discovery`, with these permissions:

| Group | IAM actions | What it unlocks |
|-------|-------------|-----------------|
| Bedrock | `bedrock:ListFoundationModels`, `ListCustomModels`, `ListImportedModels`, `ListProvisionedModelThroughputs`, `ListInferenceProfiles`, `ListGuardrails`, `GetGuardrail`, `GetModelInvocationLoggingConfiguration`, `ListAgents`, `GetAgent`, `ListAgentAliases`, `ListKnowledgeBases`, `GetKnowledgeBase` | Agents, aliases, knowledge bases, guardrails, models, provisioned throughput, inference profiles, and invocation logging |
| AgentCore | `bedrock-agentcore:ListAgentRuntimes`, `ListGateways`, `ListMemories`, `GetAgentRuntime` | AgentCore runtimes, gateways, and memories |
| IAM | `iam:GetAccountAuthorizationDetails`, `ListUsers`, `ListRoles`, `GetRole`, `ListAccessKeys`, `GetAccessKeyLastUsed`, `SimulatePrincipalPolicy` | Users, roles, access keys and their last use; who can invoke Bedrock and their effective access |
| SageMaker | `sagemaker:ListEndpoints`, `ListModels` | SageMaker endpoints and models |
| CloudTrail | `cloudtrail:LookupEvents` | Audit events and model used per identity |
| CloudWatch | `cloudwatch:ListMetrics`, `GetMetricData` | Invocations and tokens per model |
| Cost Explorer | `ce:GetCostAndUsage` | Bedrock cost |
| Organizations | `organizations:DescribeOrganization`, `ListAccounts` | Member account list (only in the management or delegated administrator account) |

`GetAgent` and `GetKnowledgeBase` let SecureAI read an agent or knowledge base by the id CloudTrail names when the listing itself is blocked. `iam:SimulatePrincipalPolicy` only evaluates policies: it changes nothing in the account.

If you deployed the stack before `iam:SimulatePrincipalPolicy` and the SageMaker permissions were added, **update the stack** with the new template. Until then, effective access and SageMaker show up as optional gaps naming the missing action.

To **deactivate access keys from SecureAI** (optional), deploy the stack with `AllowRevokeAccessKeys=true`: it adds `iam:UpdateAccessKey` on the account's IAM users. It is off by default.

Nothing is skipped silently: whatever SecureAI cannot read is listed with the IAM action that fixes it. See [Coverage gaps](#coverage-gaps).

## Connect

1. Go to **Admin → Inventory → Cloud Connectors** and click **Connect AWS** (or, once connected, **AWS connection**). It opens **AWS Bedrock — Insights** on its **Connection** tab.

2. Leave **SecureAI role (recommended)** selected. The panel shows the **SecureAI principal ARN** and your **External ID (unique to your tenant)**.

3. **Deploy the SecureAI stack in your AWS account**: with **Launch Stack in AWS** (when offered), or with **Download template** and the AWS CLI command shown in the panel (it already includes your parameters). If your organization does not allow CloudFormation, create the `SecureAI-Discovery` role by hand with the same trust policy shown in the [inference guide](/en/integrations/cloud/aws-bedrock-inference) and the actions in the table above on `"Resource": "*"`.
4. Paste the stack's **`DiscoveryRoleArn`** output into **Discovery role ARN** (for example `arn:aws:iam::123456789012:role/SecureAI-Discovery`).
5. Under **Regions (comma-separated)**, enter the regions where your Bedrock and AgentCore resources live (for example `us-east-1, eu-west-1`). IAM and Cost Explorer are global.

6. Click **Test and connect**. SecureAI checks the connection with a real read before saving, and lists anything it could not read.
7. Run the first sync: in **Admin → Integrations**, on the **AWS Bedrock** card (**Cloud** category), click **Sync now** (the refresh icon). After that, SecureAI syncs automatically every 6 hours.

<Warning>
**One stack per account, for both connections.** The inference and discovery roles come from the same template and the same stack name (`SecureAI-Integration`). When your [Amazon Bedrock inference](/en/integrations/cloud/aws-bedrock-inference) connection already uses the stack's `SecureAI-BedrockInference` role, the panel says so and the command it shows keeps `EnableInference=true`: run that command as shown. If you build the command yourself, keep `EnableInference=true` in that account, or CloudFormation deletes the inference role and stops your inference traffic. If the stack already created the discovery role, skip step 3.
</Warning>

### Alternative: IAM user access key

Instead of the role, you can use an IAM user's **Access key ID** and **Secret access key** (plus an optional **Session token** for temporary credentials). Give the user the same read-only permissions as the role. SecureAI stores the secret encrypted. We prefer the role: it stores no secret and is revoked by deleting the stack.

Switching from one method to the other drops the stored credential of the method you leave.

## AWS Organizations mode (optional)

To read every account in your organization with a single connection:

1. Deploy the stack in the **management account** (or a **delegated administrator** account) and paste that role's ARN.
2. Deploy the same template to the **member accounts** with a **CloudFormation StackSet**, with the **same External ID**. Member accounts only need the discovery role: use `EnableInference=false`. The role must have the same name in every member account.
3. Turn on **AWS Organizations mode — read every account**.

SecureAI lists the organization's **ACTIVE** accounts and assumes the role directly in each member account.

| Optional field | What it does |
|----------------|--------------|
| **Role name in member accounts** | Defaults to the name of the management account's role. |
| **Only these accounts** | Comma-separated account IDs, to read only a subset. |

SecureAI reads up to 50 accounts per sync, the management account first. CloudTrail (audit events and Bedrock used outside SecureAI) and the policy simulator cover the first 10 of them, and CloudWatch usage the first 15; when an organization is larger, the panel lists it as a partial read. A connection takes up to 10 regions.

An account SecureAI cannot read is listed as a **gap**, and nothing of it is retired or pruned. If the role you pasted is in a member account, the connection says so and names the management account to deploy it in.

## Verify

- [Cloud Connectors](/en/discovery/cloud-sensors) lists the discovered agents. Click **AWS connection** to open **AWS Bedrock — Insights**, with these tabs:
  - **Usage & Costs**: tokens, requests and errors per model (CloudWatch) and Bedrock spend (Cost Explorer).
  - **Models & Deployments**: agents (Bedrock Agents and AgentCore runtimes), what is wired to them (aliases, knowledge bases, guardrails, gateways and memories, throughput, inference profiles, and SageMaker endpoints), and the accounts and regions read with their invocation logging.
  - **Identity & Access**: **Bedrock used outside SecureAI**, **Who can invoke Bedrock**, **Effective access — IAM policy simulator**, IAM roles, and IAM access keys.
  - **Audit & Logs**: Bedrock and AgentCore CloudTrail events.
  - **Connection**: the setup above.
- The [NHI Inventory](/en/discovery/nhi-inventory) shows the users, access keys, and roles.

If a sync fails (for example, the stack was deleted), the card shows the error and SecureAI retries with backoff, keeping the last inventory. A partial read never retires agents or removes identities.

## Bedrock used outside SecureAI

From the CloudTrail events it already reads (`InvokeModel`, `InvokeModelWithResponseStream`, `Converse`, `ConverseStream`, the OpenAI- and Anthropic-compatible APIs of `bedrock-runtime`, and agent invocations: `InvokeAgent`, `InvokeInlineAgent` and `InvokeAgentRuntime`), SecureAI separates the calls made by **its own inference identity** — the role or access key of the [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference) connection — from the calls made by **any other identity**. Those other calls went through no DLP, model policy, or signed receipt.

Under **Identity & Access → Bedrock used outside SecureAI** you see, per identity:

- the IAM role or user (and the access key, masked, when it was a long-lived key);
- the models it invoked and how many times each;
- the account and regions;
- the total calls and when it was last seen.

It is also an **Insights** finding (*Amazon Bedrock is being used outside SecureAI*): **critical** when the caller is an IAM user access key or the root account, **moderate** when it is a role.

Details:

- SecureAI recognizes its inference identity by the **role ARN or access key ID** it has configured, never by the session name: a role with the same name that is not the configured one is still reported.
- If SecureAI has no Bedrock inference connection, **every** invocation is outside SecureAI.
- CloudTrail is read up to 100 events per source and region. When that cap was reached (or a region could not be read), calls are shown with **+**: they are a minimum, not the total.
- Failed calls (for example, `AccessDenied`) do not count as use.

## Coverage gaps

If the panel says **Discovery could not read everything**, each line names the surface that was missed, the **exact IAM action**, the **account and region**, and how to fix it:

| Status | What it means | What to do |
|--------|---------------|------------|
| **Missing from the role** | The role does not have that action | Redeploy or update the SecureAI stack. |
| **Blocked by an SCP** | A service control policy of your organization denies the action | **The stack cannot fix it**: talk to your cloud team. |
| **Blocked by a permissions boundary** / **Explicit Deny** | A permissions boundary or a Deny statement overrides the grant | Review the boundary or policy with your cloud team. |
| **Throttled** / **Partial** | AWS throttled the requests or the read was incomplete | Sync again later. |

When a listing is denied but direct reads work (for example, `bedrock:ListAgents` blocked and `GetAgent` allowed), SecureAI says so and reads the resources CloudTrail names.

## Cost

- The cost is the actual Amazon Bedrock spend according to **Cost Explorer**, over the last 30 days, by region and, in AWS Organizations mode, by linked account.
- AWS bills **US$0.01 for each Cost Explorer request**. SecureAI makes **one per sync**: with the automatic sync every 6 hours, that is about US$1.20 a month, plus any manual syncs.

## Access-key revocation

With `AllowRevokeAccessKeys=true` in the stack, IAM access keys can be **deactivated** from the [NHI Inventory](/en/discovery/nhi-inventory) (padlock), and **reactivated** later:

| Identity | What happens at AWS | Reversible |
|----------|---------------------|------------|
| IAM user access key | Set to **Inactive** | Yes — restore it to **Active** from SecureAI or in IAM |

Safeguards:

- SecureAI refuses to deactivate the access key its own connection uses (that would cut discovery off) and the access key of the [Bedrock inference](/en/integrations/cloud/aws-bedrock-inference) connection (that would stop every governed call). Rotate them in IAM. If SecureAI cannot check which key the inference connection uses, it deactivates nothing.
- IAM roles are monitored, but not revoked from SecureAI.
- Without `AllowRevokeAccessKeys=true`, the error says `iam:UpdateAccessKey` is missing and how to update the stack.

### Automatic NHI policies

The **automatic NHI policies** (NHI Inventory → **Automatic policies**) also apply to AWS access keys, with the same rules as Google Cloud service-account keys:

| Rule | On AWS |
|------|--------|
| **Unused key** | Access key with no known use in N days (per `GetAccessKeyLastUsed`). A key with no recorded last use is never touched. |
| **Old key** | Access key created more than N days ago, used or not. |

In **Revoke** mode the cut is the same as the manual one: the key is set to **Inactive** and can be reactivated. The same safeguards apply: simulation on by default, a revocation cap per run, only over complete listings, exclusions, and never the keys SecureAI itself uses (discovery and inference). IAM roles are never cut.

To revoke SecureAI's access to your account, **delete the stack** (or the `SecureAI-Discovery` role).

## Related

- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [Cloud Sensors](/en/discovery/cloud-sensors)
- [NHI Inventory](/en/discovery/nhi-inventory)
