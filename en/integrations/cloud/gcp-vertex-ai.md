---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Connect Google Cloud so SecureAI can inventory Vertex AI agents, models, service accounts, IAM, usage, and cost"
---

# Google Cloud — Discovery

Connect your Google Cloud project so SecureAI can inventory Vertex AI agents, endpoints, and models, along with the service accounts, IAM bindings, audit logs, usage, and billing that surround them.

<Info>
This card **only reads** the project and never sends a prompt. If you want to run SecureAI's LLM traffic on your own Google Cloud account, see [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference).
</Info>

## What SecureAI imports

- **Vertex AI agents, endpoints, and models**
- **NHIs** — service accounts, service-account keys, and API keys (revocable — see [NHI Inventory](/en/discovery/nhi-inventory))
- **IAM** role bindings
- **Cloud Audit Logs**
- **Requests, tokens, and cost** for the last 30 days (actual from BigQuery billing export, or estimated)

## Prerequisites

- A **service account** with a JSON key, granted read roles on the project:
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - BigQuery roles (e.g. `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`) if you use billing export for **actual** cost.
  - *(Optional)* key/service-account admin roles if you want SecureAI to revoke identities at the source.

## Credentials

| Field | Required | Description |
|-------|----------|-------------|
| `projectId` | Yes | GCP project ID. |
| `location` | Yes | Vertex region (e.g. `us-central1`). |
| `serviceAccountJson` | Yes | The service-account key JSON. Encrypted at rest. |
| `billingExportTable` | No | BigQuery table for actual billing (e.g. `dataset.gcp_billing_export_v1_XXXX`). |
| `billingProjectId` | No | Project that hosts the billing export, if different. |

### Where to get them

1. In the [Google Cloud console](https://console.cloud.google.com/), go to **IAM & Admin → Service Accounts → Create service account**.
2. Grant the roles listed above.
3. Under **Keys → Add key → JSON**, download the key file.
4. Paste the **entire** JSON into the `serviceAccountJson` field.

## Connect

1. **Admin → Integrations → Cloud → Google Cloud — Discovery → Connect.**
2. Enter project, location, and the service-account JSON (plus optional billing fields).
3. **Test**, then **Save**.
4. **Sync**.

## Verify

Open [Cloud Sensors](/en/discovery/cloud-sensors) for discovered agents/endpoints/models and [NHI Inventory](/en/discovery/nhi-inventory) for service accounts and keys. Insights show IAM bindings, usage, and cost.

## Revocation

GCP service accounts, SA keys, and API keys are **revocable** from [NHI Inventory](/en/discovery/nhi-inventory) when the connector has the optional key/SA admin roles.

## Related

- [Google Vertex AI — Inference on your account](/en/integrations/cloud/vertex-ai-inference)
- [Cloud AI Providers Overview](/en/integrations/cloud/overview)
- [Google Workspace SSO](/en/iam/google-workspace)
- [NHI Inventory](/en/discovery/nhi-inventory)
