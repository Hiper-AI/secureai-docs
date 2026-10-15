---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Connect Google Cloud so SecureAI can inventory Vertex AI agents, models, service accounts, keys, IAM, usage, and cost"
---

# Google Cloud — Discovery

Connect your Google Cloud project so SecureAI can inventory Vertex AI agents, endpoints, and models, along with the service accounts, keys, IAM bindings, audit logs, usage, and cost that surround them.

<Info>
This card **only reads** the project and never sends a prompt. If you want to run SecureAI's LLM traffic on your own Google Cloud account, see [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference).
</Info>

## What SecureAI imports

- **Vertex AI**: agents (Agent Engine), serving endpoints, running batch and tuning jobs, and models — the Model Registry plus every publisher model in use (Gemini, Claude, open models).
- **Usage** over the last 30 days, per model: requests (and how many failed), input and output tokens, and prompt-cache tokens.
- **Cost** over the last 30 days: this project's actual AI spend from your BigQuery billing export, or an estimate at list price.
- **NHIs**: service accounts, user-managed service-account keys, API keys, Workload Identity Federation pools and providers, and OAuth clients — with the last time each key and service account authenticated. Revocable from the [NHI Inventory](/en/discovery/nhi-inventory).
- **IAM** role bindings on the project.
- **Cloud Audit Logs** of the AI and identity services (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): the latest 200 events of the last 30 days.

## Prerequisites

A service account that SecureAI acts as. Grant it these roles **on the project** (**IAM & Admin → IAM → Grant access**):

| Role | What it unlocks | |
|------|-----------------|---|
| `roles/aiplatform.viewer` | Vertex AI agents, endpoints, jobs, and models | Required |
| `roles/iam.securityReviewer` | Service accounts, keys, API keys, Workload Identity, OAuth clients, IAM bindings | Required |
| `roles/monitoring.viewer` | Requests and tokens per model | Recommended |
| `roles/logging.viewer` | Cloud Audit Logs | Recommended |
| `roles/policyanalyzer.activityAnalysisViewer` | Last use of each key and service account | Optional |

For **actual cost**, your Cloud Billing data must be [exported to BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery), and the service account needs `roles/bigquery.dataViewer` on the export dataset and `roles/bigquery.jobUser` on the project that runs the query.

To **revoke from SecureAI** (optional), also grant the role of each action you want to allow:

| Action | Role |
|--------|------|
| Disable a service account | `roles/iam.serviceAccountAdmin` |
| Delete a service-account key | `roles/iam.serviceAccountKeyAdmin` |
| Delete an API key | `roles/serviceusage.apiKeysAdmin` |
| Disable a Workload Identity pool or provider | `roles/iam.workloadIdentityPoolAdmin` |
| Disable an OAuth client | `roles/iam.oauthClientAdmin` |

<Note>
You do **not** need `roles/billing.viewer`: it is a billing-account role, it cannot be granted on a project, and the connector does not use it.
</Note>

Nothing is skipped silently: whatever SecureAI cannot read is listed with the role that fixes it — when you connect, after each sync, and in the GCP panel.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| `projectId` | Yes | The project **ID** (e.g. `my-project-123`) — not its name or number. |
| `location` | Yes | Vertex AI location where your agents and endpoints live (e.g. `us-central1`, `europe-west4`, `global`). Usage and cost cover every location. |
| `locations` | No | Several locations, comma-separated (up to 10). Overrides `location`. |
| `serviceAccountJson` | One of the two | The service-account key JSON. Encrypted at rest. |
| `impersonateServiceAccount` | One of the two | Keyless: the email of the service account SecureAI impersonates. Shown only when your deployment offers keyless access. |
| `billingExportTable` | No | `project.dataset.table` of your billing export (e.g. `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| `billingProjectId` | No | Project that runs the BigQuery query. Defaults to the table's project; a `dataset.table` name is looked up in this project (or in `projectId` if empty). |

### Where to get them

**Option A — JSON key**

1. In the [Google Cloud console](https://console.cloud.google.com/), go to **IAM & Admin → Service Accounts → Create service account** (e.g. `secureai-discovery`).
2. Go to **IAM & Admin → IAM → Grant access**, enter the service account's email as the principal, and add the roles from [Prerequisites](#prerequisites).
3. Back in **Service Accounts**, open the account → **Keys → Add key → Create new key → JSON**, and download the file.
4. Paste the **entire** JSON into `serviceAccountJson`, then delete the downloaded file.

The same with `gcloud`:

```bash
PROJECT=my-project-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
If Google answers that service-account key creation is disabled, your organization enforces the `iam.disableServiceAccountKeyCreation` policy — the default for organizations created since 2024. Use option B, or ask your organization admin for an exception on this project.
</Warning>

**Option B — keyless (impersonation)**

1. Create the service account and grant it the roles (steps 1 and 2 above).
2. In SecureAI's connect form, the **Service account to impersonate** field names the SecureAI account to authorize. In Google Cloud, open your service account → **Permissions → Grant access**, enter that account as the principal, and give it `roles/iam.serviceAccountTokenCreator`.
3. Enter your service account's email in the field and leave the JSON empty.

If the field does not appear, your deployment does not offer keyless access — use option A.

## Connect

1. **Admin → Integrations → Cloud → Google Cloud — Discovery → Connect.**
2. Enter the project ID, the location (or several in **More Vertex AI Locations**), and either the JSON key or the service account to impersonate. Add the billing fields if you use the export.
3. Click **Connect**. SecureAI checks the credentials with a real read of the project before saving — it takes a few seconds. If it cannot read the project (wrong ID, no roles, mistyped location), it shows why and saves nothing; what you entered stays in the form.
4. If it saves but some roles are missing, a warning lists them. Grant them and sync again.
5. Sync now with the refresh button on the card. After that, SecureAI syncs automatically every 6 hours.

To change the credentials later, use **Connect** again. Fields left empty keep their stored value; entering a JSON key replaces a stored impersonation, and vice versa.

## Verify

- [Cloud Sensors](/en/discovery/cloud-sensors) lists the discovered agents. Click the Google Cloud card to open the GCP panel: usage and cost (requests, failures, tokens, cache, cost and its source), models and deployments, identity and access (service accounts and keys with their last use, IAM bindings), and audit.
- If the panel says **Discovery could not read everything**, grant the roles it lists and sync again.
- The [NHI Inventory](/en/discovery/nhi-inventory) shows the service accounts and keys.

If a sync fails (for example, the key was deleted or the roles removed), the card shows the error and SecureAI retries with backoff, keeping the last inventory. A partial read never retires agents or removes identities.

## Cost

- **With `billingExportTable`**: this project's actual spend on AI services (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), net of credits, in your billing account's currency. When credits cover the usage the net can be zero; the panel then shows the amount before credits next to it. Google updates the export with a delay of several hours.
- **Without it**: an estimate — tokens from Cloud Monitoring × list price, including Claude and prompt-cache tokens. It does not reflect discounts or committed-use contracts.

## Revocation

GCP identities are revocable from the [NHI Inventory](/en/discovery/nhi-inventory) (padlock) when the connector has the role of that action (see [Prerequisites](#prerequisites)). What each one does at Google:

| Identity | What happens at Google | Reversible |
|----------|------------------------|------------|
| Service account | Disabled | Yes — re-enable it in Google Cloud |
| Service-account key | Deleted | No |
| API key | Deleted | Restorable for 30 days in Google Cloud |
| Workload Identity pool / provider, OAuth client | Disabled | Yes |

Safeguards:

- The service account the connector uses, and its keys, cannot be revoked from SecureAI — that would cut discovery off. Rotate them in Google Cloud.
- Google's default service accounts (Compute Engine default, App Engine, Cloud Build, service agents) ask for a second confirmation: disabling one stops every VM, app, or build that runs as it.
- If the connector lacks the role for an action, the error names the role.

## Related

- [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [Google Workspace SSO](/en/iam/google-workspace)
- [NHI Inventory](/en/discovery/nhi-inventory)
