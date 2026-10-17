---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Connect Google Cloud so SecureAI can inventory Vertex AI agents, models, service accounts, keys, IAM, usage, and cost — in one project or across an organization"
---

# Google Cloud — Discovery

Connect your Google Cloud project (or a whole organization or folder) so SecureAI can inventory Vertex AI agents, endpoints, and models, along with the service accounts, keys, IAM bindings, audit logs, usage, and cost that surround them.

<Info>
This card **only reads** the project and never sends a prompt. If you want to run SecureAI's LLM traffic on your own Google Cloud account, see [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference).
</Info>

## What SecureAI imports

- **Vertex AI**: agents (Agent Engine), serving endpoints, running batch and tuning jobs, and models — the Model Registry plus every publisher model in use (Gemini, Claude, open models).
- **Agent Builder / Gemini Enterprise and Dialogflow CX** (optional): Agent Builder (Discovery Engine) engines with their data stores, queried in the `global`, `us`, and `eu` locations; and Dialogflow CX agents, queried in `global` and in the Vertex AI locations you configure.
- **Usage per model** over the last 30 days: requests (and how many failed), input and output tokens, and prompt-cache tokens.
- **Usage per credential** over the last 30 days (Cloud Monitoring): total requests and requests to AI APIs (Vertex AI, Gemini API, Agent Builder, Dialogflow) for each service account and each API key. OAuth-client traffic (people and tools such as the console or `gcloud`) is added up separately. It also gives the last use of those accounts and keys.
- **Usage by model and identity** (optional): which service account or person called which Vertex AI model, taken from the Data Access audit logs if you have them on. See [Usage by model and identity](#usage-by-model-and-identity).
- **Cost** over the last 30 days: this project's actual AI spend from your BigQuery billing export, or an estimate at list price.
- **NHIs**: service accounts, user-managed service-account keys, API keys, Workload Identity Federation pools and providers, and OAuth clients — with their last use (from Policy Analyzer and from usage per credential) and their [privilege risk](#privilege-risk). Revocable and restorable from the [NHI Inventory](/en/discovery/nhi-inventory), by hand or with [automatic policies](#automatic-nhi-policies).
- **IAM** role bindings on the project.
- **Cloud Audit Logs** of the AI and identity services (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): the latest 200 events of the last 30 days.

By default the connector reads **one project**. With the **Organization or folder** field it reads every active project of an organization or folder: see [Organization or folder mode](#organization-or-folder-mode).

## Prerequisites

### Enabled APIs

SecureAI reads each surface with the matching Google API. Enable them on the project (**APIs & Services → Library**, or with `gcloud services enable`):

| API | What for | |
|-----|----------|---|
| `cloudresourcemanager.googleapis.com` | The project and its IAM bindings | Required |
| `iam.googleapis.com` | Service accounts, keys, Workload Identity, OAuth clients | Required |
| `aiplatform.googleapis.com` | Vertex AI agents, endpoints, jobs, and models | Required |
| `apikeys.googleapis.com` | API keys | Recommended |
| `monitoring.googleapis.com` | Usage per model and per credential | Recommended |
| `logging.googleapis.com` | Audit logs and Data Access logs | Recommended |
| `policyanalyzer.googleapis.com` | Last use of keys and service accounts (Policy Analyzer) | Optional |
| `bigquery.googleapis.com` | Actual cost, if you use the billing export (on the project that runs the query) | Optional |
| `cloudasset.googleapis.com` | Organization or folder mode (on the service account's project) | That mode only |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | If you use that product |
| `dialogflow.googleapis.com` | Dialogflow CX agents | If you use that product |

A disabled API does not fail the sync: it shows up as a gap, **API disabled in the project — enable it**, naming the service. Agent Builder and Dialogflow are the exception: if their API is off, SecureAI takes it that the project does not use that product and does not flag it as a gap.

### Roles

A service account that SecureAI acts as. Grant it these roles **on the project** (**IAM & Admin → IAM → Grant access**):

| Role | What it unlocks | |
|------|-----------------|---|
| `roles/aiplatform.viewer` | Vertex AI agents, endpoints, jobs, and models | Required |
| `roles/iam.securityReviewer` | Service accounts, keys, API keys, Workload Identity, OAuth clients, IAM bindings | Required |
| `roles/monitoring.viewer` | Usage per model (requests and tokens) and usage per credential | Recommended |
| `roles/logging.viewer` | Cloud Audit Logs | Recommended |
| `roles/policyanalyzer.activityAnalysisViewer` | Last use of each key and service account | Optional |
| `roles/logging.privateLogViewer` | Usage by model and identity: Data Access logs are private logs, and `roles/logging.viewer` does not read them | Optional |
| `roles/discoveryengine.viewer` | Agent Builder / Gemini Enterprise engines | Optional |
| `roles/dialogflow.reader` | Dialogflow CX agents | Optional |

For **actual cost**, your Cloud Billing data must be [exported to BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery), and the service account needs `roles/bigquery.dataViewer` on the export dataset and `roles/bigquery.jobUser` on the project that runs the query.

To **revoke and restore from SecureAI** (optional), you need the role of each action you want to allow. If your deployment offers keyless access, grant them to a [separate, revocation-only service account](#separate-service-account-for-revocation) and keep the reading one with read-only roles; otherwise, grant them to the connector's service account:

| Action | Role |
|--------|------|
| Disable (or re-enable) a service account | `roles/iam.serviceAccountAdmin` |
| Delete a service-account key | `roles/iam.serviceAccountKeyAdmin` |
| Delete (or restore) an API key | `roles/serviceusage.apiKeysAdmin` |
| Disable (or re-enable) a Workload Identity pool or provider | `roles/iam.workloadIdentityPoolAdmin` |
| Disable (or re-enable) an OAuth client | `roles/iam.oauthClientAdmin` |

<Note>
You do **not** need `roles/billing.viewer`: it is a billing-account role, it cannot be granted on a project, and the connector does not use it.
</Note>

Nothing is skipped silently: whatever SecureAI cannot read is listed with the role that fixes it — when you connect, after each sync, and in the GCP panel.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| **Google Cloud Project ID** (`projectId`) | Yes | The project **ID** (e.g. `my-project-123`) — not its name or number. In organization mode, it is the quota and billing project. |
| **Vertex AI Location** (`location`) | Yes | Vertex AI location where your agents and endpoints live (e.g. `us-central1`, `europe-west4`, `global`). Usage and cost cover every location. |
| **More Vertex AI Locations** (`locations`) | No | Several locations, comma-separated (up to 10). Overrides the location above. |
| **Service Account JSON** (`serviceAccountJson`) | One of the two | The service-account key JSON. Encrypted at rest. |
| **Service account to impersonate** (`impersonateServiceAccount`) | One of the two | Keyless: the email of the service account SecureAI impersonates. Shown only when your deployment offers keyless access. |
| **Service account for revocation** (`revokeImpersonateServiceAccount`) | No | A second service account used only to revoke or restore identities, never to read. Shown only when your deployment offers keyless access. |
| **Organization or folder** (`scope`) | No | `organizations/<number>` or `folders/<number>`: reads every active project in it. |
| **BigQuery Billing Export Table** (`billingExportTable`) | No | `project.dataset.table` of your billing export (e.g. `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| **BigQuery Billing Project ID** (`billingProjectId`) | No | Project that runs the BigQuery query. Defaults to the table's project; a `dataset.table` name is looked up in this project (or in the project ID if empty). |

### Where to get them

**Option A — JSON key**

1. In the [Google Cloud console](https://console.cloud.google.com/), go to **IAM & Admin → Service Accounts → Create service account** (e.g. `secureai-discovery`).
2. Go to **IAM & Admin → IAM → Grant access**, enter the service account's email as the principal, and add the roles from [Prerequisites](#prerequisites).
3. Back in **Service Accounts**, open the account → **Keys → Add key → Create new key → JSON**, and download the file.
4. Paste the **entire** JSON into **Service Account JSON**, then delete the downloaded file.

The same with `gcloud`:

```bash
PROJECT=my-project-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# Optional: last use, usage by model and identity, Agent Builder, and Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

If you use Agent Builder or Dialogflow CX, their APIs are already enabled on the project; you do not need to enable them for SecureAI.

<Warning>
If Google answers that service-account key creation is disabled, your organization enforces the `iam.disableServiceAccountKeyCreation` policy — the default for organizations created since 2024. Use option B, or ask your organization admin for an exception on this project.
</Warning>

**Option B — keyless (impersonation)**

1. Create the service account and grant it the roles (steps 1 and 2 above).
2. In SecureAI's connect form, the help text of the **Service account to impersonate (keyless — instead of the JSON)** field names the SecureAI account to authorize. In Google Cloud, open your service account → **Permissions → Grant access**, enter that account as the principal, and give it `roles/iam.serviceAccountTokenCreator`. With `gcloud`:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. Enter your service account's email in the field and leave the JSON empty.

If the field does not appear, your deployment does not offer keyless access — use option A.

### Separate service account for revocation

If your deployment offers keyless access, you can keep reading and revoking apart. This is recommended over giving the revoke roles to the service account that reads:

1. Create a second service account (e.g. `secureai-revoke`) and grant it **only** the revoke roles from [Prerequisites](#prerequisites).
2. On that account, grant `roles/iam.serviceAccountTokenCreator` to the SecureAI account named in the help text of the **Service account for revocation (optional — separate from reading)** field.
3. Enter its email in that field.

SecureAI requests a 1-hour token from that account only while it revokes or restores an identity; the sync never uses it. The reading service account keeps read-only roles. SecureAI also refuses to revoke the revocation account from the inventory.

## Organization or folder mode

To inventory several projects with one connector, fill in **Organization or folder** with `organizations/<number>` or `folders/<number>` (e.g. `organizations/123456789012`).

- SecureAI finds the active projects with **Cloud Asset Inventory** and reads each one as if it were a single-project connector. The **Google Cloud Project ID** stays the quota and billing project.
- Grant the service account, **on the organization or folder**: `roles/cloudasset.viewer`, `roles/iam.securityReviewer`, and `roles/aiplatform.viewer`, plus `roles/monitoring.viewer` and `roles/logging.viewer` for usage and audit.
- Enable `cloudasset.googleapis.com` on the service account's project.

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

For a folder, use `gcloud resource-manager folders add-iam-policy-binding <number>` instead of `gcloud organizations add-iam-policy-binding`.

So that a sync finishes in reasonable time, each one has caps. The quota project goes first, then projects with Vertex AI resources:

| What | Cap per sync |
|------|--------------|
| Projects inventoried | 200 |
| Usage per model (Cloud Monitoring) outside the quota project's metrics scope | 15 projects with Vertex AI |
| Audit logs | 25 projects |
| Usage by model and identity (Data Access logs) | 10 projects |

Whatever falls outside a cap shows up as a partial gap, with how much was read. A project that cannot be read is also listed as a gap, and **nothing of it is retired or pruned**. When you connect, the test in this mode only enumerates the first page of projects and checks the quota project: reading each project is the sync's job.

## Connect

1. **Admin → Integrations → Cloud → Google Cloud — Discovery → Connect Integration.**
2. Enter the project ID, the location (or several in **More Vertex AI Locations**), and either the JSON key or the service account to impersonate. If you use them, add the service account for revocation, the organization or folder, and the billing fields.
3. Click **Connect**. SecureAI checks the credentials with a real read of the project before saving — it takes a few seconds. If it cannot read the project, it shows why and saves nothing; what you entered stays in the form. The possible messages are in [Troubleshooting](#troubleshooting).
4. If it saves but some roles are missing, a warning lists them. Grant them and sync again.
5. Sync now with the refresh button on the card. After that, SecureAI syncs automatically every 6 hours.

To change the credentials later, use **Connect** again. Fields left empty keep their stored value; entering a JSON key replaces a stored impersonation, and vice versa.

## Verify

- [Cloud Sensors](/en/discovery/cloud-sensors) lists the discovered agents. Click the Google Cloud card to open the GCP panel: usage and cost (requests, failures, tokens, cache, cost and its source), models and deployments, identity and access (service accounts and keys with their last use, IAM bindings), and audit.
- If the panel says **Discovery could not read everything**, review each line (see [Troubleshooting](#troubleshooting)) and sync again.
- The [NHI Inventory](/en/discovery/nhi-inventory) shows the service accounts and keys.

If a sync fails (for example, the key was deleted or the roles removed), the card shows the error and SecureAI retries with backoff, keeping the last inventory. A partial read never retires agents or removes identities.

## Usage by model and identity

Cloud Monitoring tells how many requests each credential made, but not to which model. To know **which identity called which model**, SecureAI reads Vertex AI's **Data Access** audit logs. It is optional and up to you:

- SecureAI reads them only if **DATA_READ** or **DATA_WRITE** logs are on for `aiplatform.googleapis.com` (or for all services). SecureAI detects this in the IAM policy; it never turns them on.
- Turning them on has a **Cloud Logging ingestion cost**, at Google's rates. You turn them on in **IAM & Admin → Audit Logs → Vertex AI API → Data Read**.
- The service account needs `roles/logging.privateLogViewer`.
- Per project and sync, SecureAI reads up to 5,000 entries or for 20 seconds, whichever comes first.
- If they are off, the panel shows an optional gap explaining how to turn them on. If you turned them on at the organization or folder but connect a single project, SecureAI cannot see it from the project's policy and shows the gap anyway.

## Privilege risk

With the IAM policy read, SecureAI flags a service account as **privileged** when it holds any of these roles:

- Owner (`roles/owner`) or Editor (`roles/editor`);
- any admin role (`roles/<service>.admin` or ending in `Admin`);
- `roles/iam.serviceAccountTokenCreator` or `roles/iam.serviceAccountUser`, which let the holder act as other service accounts.

A user-managed key of a privileged service account inherits the flag: whoever holds the key holds that privilege. **Unrestricted** API keys (no API target and no application restriction) are flagged too. In the [NHI Inventory](/en/discovery/nhi-inventory) they show up among the risk factors as **Privileged (admin role or impersonation)** and **API key without restrictions**. If the IAM policy could not be read, SecureAI flags nothing rather than treating an account as not privileged.

## Cost

- **With the billing export table**: this project's actual spend on AI services (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), net of credits, in your billing account's currency. When credits cover the usage the net can be zero; the panel then shows the amount before credits next to it. Google updates the export with a delay of several hours.
- **Without it**: an estimate — tokens from Cloud Monitoring × list price, including Claude and prompt-cache tokens. It does not reflect discounts or committed-use contracts.

## Revocation and restore

GCP identities are revocable from the [NHI Inventory](/en/discovery/nhi-inventory) (padlock) when the connector, or the service account for revocation, has the role of that action (see [Prerequisites](#prerequisites)). What each one does at Google:

| Identity | What happens at Google | Reversible |
|----------|------------------------|------------|
| Service account | Disabled | Yes — **Restore** re-enables it |
| Service-account key | Deleted | No — Google destroys it. Create a new key |
| API key | Deleted | Yes, for 30 days — **Restore** brings it back; after that Google no longer keeps it |
| Workload Identity pool / provider, OAuth client | Disabled | Yes — **Restore** re-enables it |

To undo a revocation, open the identity's menu in the NHI Inventory and choose **Restore** (*Undo the revocation at Google Cloud*). The identity is enabled again in Google Cloud, and in SecureAI it is unblocked and stays **In remediation** until you review it.

- Only what **SecureAI revoked at Google Cloud** can be restored, by hand or through an automatic policy. It is not offered for a block on SecureAI's gateway only, nor for an identity your team disabled directly in Google Cloud.
- A deleted service-account key cannot be restored: SecureAI refuses without calling Google.
- Restoring uses the same roles as revoking.

Safeguards:

- The service account the connector uses, and its keys, cannot be revoked from SecureAI — that would cut discovery off. The same goes for the service account for revocation. Rotate them in Google Cloud.
- Nor can the service account that the [Vertex AI inference](/en/integrations/cloud/vertex-ai-inference) connection authenticates with be revoked, nor the key it signs with: it would stop every governed call. With the keyless (impersonation) option only the service account is protected: its keys can still be revoked, because SecureAI signs with none of them. If SecureAI cannot check which identity the inference connection uses, it does not revoke any service account or service-account key (API keys are unaffected).
- Google's default service accounts (Compute Engine default, App Engine, Cloud Build, service agents) ask for a second confirmation: disabling one stops every VM, app, or build that runs as it.
- If the connector lacks the role for an action, the error names the role.

## Automatic NHI policies

**Automatic NHI policies** (NHI Inventory → **Automatic policies**) alert on or revoke Google Cloud identities by rule, without reviewing them one by one. They are evaluated at the end of every successful sync of the connector, over its identities only.

| Rule | On Google Cloud | Default threshold |
|------|-----------------|-------------------|
| **Unused SA key / IAM access key** | Service-account key that has not authenticated in N days. It only acts on a known last use: a key with no recorded use is left alone. | 90 days |
| **Old SA key / IAM access key** | Service-account key created more than N days ago, used or not. | 365 days |
| **Unrestricted API key** | API key with no application restriction and no API target. | — |
| **Privileged SA with a user key** | User-managed key of a [privileged](#privilege-risk) service account. | — |

Each rule has three modes: **Off**, **Alert**, and **Revoke**. All start off. The safeguards:

- **Simulation mode (dryRun)** is on by default: with it, no rule set to **Revoke** cuts anything; it only lists what it would do. Turning it off is the only thing that enables real cuts. **Simulate with this configuration** shows the effect before you save.
- **Revocation cap per run**: 5 by default (1 to 50). If in one run the **Revoke** rules match more identities than the cap, nothing is cut and an alert is sent.
- **Exclusions**: no rule acts on an identity whose owner, name, or resource matches a pattern; `*` is the only wildcard.
- Only complete key listings are evaluated.
- A credential SecureAI uses (the connector's, the revocation account's, or the Vertex AI inference one) is never cut. Keys of Google's default service accounts are never cut automatically: the rule only alerts, and a person decides.

On Google Cloud, revoking a service-account key **deletes** it (it cannot be restored), and revoking an API key deletes it with 30 days to restore it. Every action is audited and notified.

## Troubleshooting

### When connecting

If the test fails, **Connect** shows one of these messages and saves nothing:

| Message | Cause | What to do |
|---------|-------|------------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | You entered the project's name or number | Copy the project **ID** from the console's project picker. |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | The ID does not exist, or the service account has no role on that project | Check the ID and grant the two required roles on the project. |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | The location does not exist (for example, mistyped) | Fix the location. |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | Organization mode without the Cloud Asset API | Enable `cloudasset.googleapis.com` on the service account's project. |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | Organization mode without the roles on the organization or folder, or a wrong number | Grant the roles on the organization or folder, or remove the field to read only the project. |

### Panel gaps

When the GCP panel says **Discovery could not read everything**, each line names the surface and what is missing. Lines marked *optional* only enrich the inventory.

| What the line shows | What it means | What to do |
|---------------------|---------------|------------|
| A role (e.g. `roles/monitoring.viewer`) | The service account lacks that role | Grant it on the project (or on the organization or folder) and sync again. |
| **API disabled in the project — enable it** | That surface's API is off; the detail names the service | Enable it in **APIs & Services → Library**. |
| No role, and a detail saying an organization policy forbids the location | An organization policy (`constraints/gcp.resourceLocations`) blocks that location, so nothing can exist there. No role fixes it | Remove that location from the configuration, or ask your organization admin to allow it. |
| **Usage by model and identity** not turned on | Vertex AI's Data Access logs are off | Optional: see [Usage by model and identity](#usage-by-model-and-identity). |
| A partial read (e.g. an organization-mode cap) | Only part was read; the detail says how much | Nothing is retired or pruned because of it. If you need to see everything, narrow the scope. |

## Related

- [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [Google Workspace SSO](/en/iam/google-workspace)
- [NHI Inventory](/en/discovery/nhi-inventory)
