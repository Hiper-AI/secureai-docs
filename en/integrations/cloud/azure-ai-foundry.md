---
sidebar_position: 4
title: "Azure — Discovery"
sidebarTitle: "Azure"
icon: "/img/icons/azure.svg"
sidebar_label: "Azure — Discovery"
description: "Connect Azure and Microsoft Entra ID so SecureAI can inventory your Azure OpenAI and Foundry resources, Foundry projects and agents, AI Search, Bot Service and every non-human identity (service principals, agent identities, managed identities, secrets, certificates and federated credentials) with its permissions, plus RBAC, activity, usage and cost."
---

# Azure — Discovery

Connect your Azure tenant so SecureAI can inventory your AI resources in Azure and **every non-human identity (NHI)** in Microsoft Entra ID, with the roles and permissions each one holds.

<Info>
This connection **only reads** and never sends a prompt. To run SecureAI's LLM traffic on your own Foundry resource instead, see [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference). They are two independent connections with different service principals and permissions; you can use both on the same subscription.
</Info>

## What SecureAI imports

For each subscription the service principal can read:

- **AI resources**: every Azure AI Services, Azure OpenAI and other Cognitive Services account (Content Safety, Speech, Language, Document Intelligence…), with its region and state.
- **Model deployments** of Azure OpenAI and Foundry, with their capacity and the last 30 days of usage (requests, input and output tokens, from Azure Monitor).
- **Foundry projects and agents**: the Foundry Agent Service agents and the classic assistants of every project, with the model each one uses. Also hubs and hub-based projects (Azure Machine Learning), with their online and serverless endpoints.
- **Azure AI Search** and **Azure Bot Service**.
- **Cost** for the current month, by service (Cost Management).
- **Activity**: Cognitive Services and Machine Learning management events from the last 30 days (Activity Log).
- **NHIs**, listed in the [NHI Inventory](/en/discovery/nhi-inventory):
  - **Service principals** of enterprise applications.
  - Microsoft Entra **agent identities**, the ones Foundry creates for each agent (classified as *agent*).
  - **Managed identities**, system- and user-assigned.
  - App registration **client secrets** and **certificates**, with their expiry.
  - **Federated credentials** (workload identity federation). For example, a GitHub Actions OIDC trust lets that repository get tokens as the application, with no secret at all.
  - The **last sign-in** of each application, when your tenant exposes that report.
- **Permissions of each identity**: its Azure RBAC roles at any scope of the subscription (subscription, resource group or resource), its Microsoft Graph application permissions and its Entra directory roles.
- **RBAC role assignments**: each role by name, with the users, groups and applications that hold it.

An identity is flagged as **privileged** when it holds any of these:

- one of the **Owner**, **Contributor**, **User Access Administrator** or **Role Based Access Control Administrator** roles;
- a Graph write permission, such as `Application.ReadWrite.All`, `Directory.ReadWrite.All`, `Mail.Send` or `Files.ReadWrite.All`;
- a directory admin role, such as Global Administrator or Application Administrator.

The secrets, certificates and federated credentials of a privileged application are flagged as privileged too.

SecureAI does not import the ~130 service principals Microsoft creates in every tenant (Azure Portal, Microsoft Graph, etc.) nor social sign-in connections: they are not your identities to govern.

## Prerequisites

A Microsoft Entra ID **app registration** (service principal) with a **client secret** and these permissions:

| Where | Permission | Required? | What it enables |
|-------|------------|-----------|-----------------|
| Subscription | **Reader** role | Yes | Resources, deployments, projects, managed identities, role assignments, usage and activity |
| Subscription | **Cost Management Reader** role | Recommended | Month-to-date cost by service |
| Foundry resource | **Cognitive Services Data Reader** role | Recommended | The agents of each Foundry project |
| Microsoft Graph | `Application.Read.All` (application permission) | Yes | Service principals, agent identities, applications, secrets, certificates, federated credentials and Graph permissions |
| Microsoft Graph | `Directory.Read.All` (application permission) | Yes | Directory roles and the names of each role's members |
| Microsoft Graph | `AuditLog.Read.All` (application permission) | Recommended | Last sign-in of each application |
| Microsoft Graph | `Application.ReadWrite.All` (application permission) | Only to revoke | Disable service principals and delete secrets, certificates and federated credentials from SecureAI |

The Graph permissions need **admin consent**. To read **all** your subscriptions, assign **Reader** on each one, or on a management group that contains them.

<Note>
Foundry agents live in the project's data plane, not in Azure Resource Manager: **Reader is not enough to see them**. Without **Cognitive Services Data Reader** (or **Foundry User**) on the Foundry resource, the sync still works, but the agent list stays empty and SecureAI reports it as a gap. Cognitive Services Data Reader is the narrowest role that allows it: data-plane read only.
</Note>

## Step 1. Create the service principal

### With the Azure CLI

From [Azure Cloud Shell](https://shell.azure.com/) or the `az` CLI. Replace `SUB_ID` with your subscription and, if you use Foundry, `MY_RESOURCE` and `MY_RG` with your resource and resource group:

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

Step 2 prints the three values you will paste into SecureAI. To **revoke from SecureAI**, also add `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role` (`Application.ReadWrite.All`) in step 3 and grant consent again.

### With the Azure portal

1. In the [Azure portal](https://portal.azure.com/), go to **Microsoft Entra ID → App registrations → New registration**, give it a name (for example `SecureAI Discovery`) and register it.
2. In **Overview**, copy the **Directory (tenant) ID** and the **Application (client) ID**.
3. In **Certificates & secrets → Client secrets → New client secret**, create one and copy its **Value** (it is shown only once).
4. In **API permissions → Add a permission → Microsoft Graph → Application permissions**, add `Application.Read.All`, `Directory.Read.All` and `AuditLog.Read.All` (and `Application.ReadWrite.All` if you want to revoke from SecureAI). Then click **Grant admin consent**.
5. In **Subscriptions → your subscription → Access control (IAM) → Add role assignment**, assign **Reader** and **Cost Management Reader** to the application.
6. In your **Foundry resource → Access control (IAM)**, assign **Cognitive Services Data Reader** to the application.

<Info>
Azure roles can take **up to 5 minutes** to apply, and Graph consent a few minutes more. If the first sync shows gaps for permissions you just granted, wait and sync again.
</Info>

<Warning>
Treat the secret like a password. SecureAI stores it **encrypted** and never shows it again. Secrets **expire** (after one year with the command above): rotate it before then, or the sync stops working that day.
</Warning>

## Step 2. Connect Azure in SecureAI

1. Go to **Admin → Integrations**, filter by **Cloud** and, on the **Azure — Discovery** card, click **Connect Integration**.
2. Fill in the fields:

   | Field | What to enter |
   |-------|---------------|
   | **Azure Tenant ID (Directory ID)** | `tenantId` from step 1 |
   | **App Registration Client ID** | `clientId` from step 1 |
   | **App Registration Client Secret** | `clientSecret` from step 1. Stored encrypted. |
   | **Subscription ID** (optional) | Limits the read to that subscription. Empty: every subscription where the principal has **Reader**. |

3. Click **Connect**. Before saving, SecureAI tests the credentials with a real read: if the secret is wrong or the principal cannot read the subscription, nothing is stored and the message says what is missing. If it connects but a Graph permission is missing, the notice names the permission.
4. **Sync** with the card's refresh button. An Azure sync can take several minutes (it walks Azure Resource Manager, Microsoft Graph, Azure Monitor and Cost Management). After that, SecureAI syncs on its own every 6 hours.

## Step 3. Verify

- [Cloud Sensors](/en/discovery/cloud-sensors) lists the discovered deployments, agents and services. Click the Azure card to open its Insights:
  - **Usage & Costs**: usage and cost;
  - **Models & Deployments**: deployments and agents;
  - **Identity & Access**: identities with their roles and the *Privileged* flag; secrets, certificates and federated credentials; RBAC roles with their members;
  - **Audit & Logs**: the activity.
- The [NHI Inventory](/en/discovery/nhi-inventory) shows service principals, agent identities, managed identities, secrets, certificates and federated credentials, with their permissions and whether they are privileged.

If a sync fails (for example, because the secret expired), the card shows the error and SecureAI retries with backoff, keeping the last inventory.

## Coverage gaps

Nothing SecureAI could not read is skipped silently: when you connect or sync, the notice names the missing permission.

| Surface | Permission that fixes it |
|---------|--------------------------|
| Entra identities (service principals, app registrations) | `Application.Read.All` with admin consent |
| Graph permissions of each identity | `Application.Read.All` |
| Directory roles | `Directory.Read.All` |
| Role assignments and managed identities | **Reader** on the subscription |
| Foundry agents | **Cognitive Services Data Reader** on the Foundry resource |

A partial read (a missing permission, a page Azure did not return, throttling) **never retires agents or deletes identities** from the inventory: SecureAI only treats something as deleted when the listing that would show it answered in full. Without role assignments, an identity's permissions stay *unknown*, never "none".

## Revocation

From the [NHI Inventory](/en/discovery/nhi-inventory) (padlock), with `Application.ReadWrite.All`:

| Identity | What happens in Azure | Reversible? |
|----------|-----------------------|-------------|
| Service principal | **Disabled** (`accountEnabled: false`) | Yes: enable it again in Entra ID |
| Client secret | **Deleted** from the application | No: create a new one |
| Certificate | **Removed** from the application | No: upload it again |
| Federated credential | The trust is **deleted** | No: create it again |
| User-assigned managed identity | The resource is **deleted** (also needs **Managed Identity Contributor** on it) | No |

Safeguards:

- SecureAI **does not offer to revoke** the service principal it connects with, nor its secrets, because that would cut discovery. Rotate them in Entra ID.
- **System-assigned** managed identities are not revoked from SecureAI: their lifecycle is the Azure resource's.
- Federated credentials that **Foundry** keeps on an agent's identity *blueprint* are not revoked from SecureAI either: cutting them stops the agent.
- Automatic NHI policies (revocation by age or disuse) do not apply to Azure yet: revocation is manual.

## Disconnect

In **Admin → Integrations → Cloud → Azure — Discovery**, deleting the connection removes the stored credentials. To remove SecureAI's access on the Azure side, delete the app registration or its secret.

## Related

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [Cloud Sensors](/en/discovery/cloud-sensors)
- [NHI Inventory](/en/discovery/nhi-inventory)
- [Microsoft Entra ID SSO](/en/iam/microsoft-entra-id)
