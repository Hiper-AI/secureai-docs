---
sidebar_position: 6
title: "Google Cloud — 发现"
sidebar_label: "Google Cloud — 发现"
description: "连接 Google Cloud，以便 SecureAI 可以清点 Vertex AI 的代理、模型、服务帐户、密钥、IAM、使用情况和成本"
---

# Google Cloud — 发现

连接您的 Google Cloud 项目，以便 SecureAI 可以清点 Vertex AI 代理、端点和模型，以及围绕它们的服务帐户、密钥、IAM 绑定、审计日志、使用情况和成本。

<Info>
此卡片**只读取**项目，从不发送提示。如果您希望在自己的 Google Cloud 帐户上运行 SecureAI 的 LLM 流量，请参阅 [Google Vertex AI — 在您的帐户上推理](/en/integrations/cloud/vertex-ai-inference)。
</Info>

## SecureAI 导入什么

- **Vertex AI**：代理（Agent Engine）、服务端点、正在运行的批处理作业和调优作业，以及模型 — Model Registry 加上正在使用的每个发布方模型（Gemini、Claude、开放模型）。
- 过去 30 天按模型统计的**使用情况**：请求数（以及其中失败的数量）、输入和输出令牌，以及提示缓存令牌。
- 过去 30 天的**成本**：来自 BigQuery 账单导出的本项目实际 AI 支出，或按标价计算的估算值。
- **NHI**：服务帐户、用户管理的服务帐户密钥、API 密钥、Workload Identity Federation 池和提供方，以及 OAuth 客户端 — 包括每个密钥和服务帐户最后一次进行身份验证的时间。可从 [NHI 清单](/zh/discovery/nhi-inventory) 撤销。
- 项目的 **IAM** 角色绑定。
- AI 和身份服务（Vertex AI、IAM、IAM Credentials、STS、API Keys、Resource Manager）的 **Cloud 审计日志**：过去 30 天内最新的 200 个事件。

## 先决条件

一个供 SecureAI 使用的服务帐户。**在项目上**为其授予以下角色（**IAM 和管理 → IAM → 授予访问权限**）：

| 角色 | 解锁的内容 | |
|------|------------|---|
| `roles/aiplatform.viewer` | Vertex AI 代理、端点、作业和模型 | 必需 |
| `roles/iam.securityReviewer` | 服务帐户、密钥、API 密钥、Workload Identity、OAuth 客户端、IAM 绑定 | 必需 |
| `roles/monitoring.viewer` | 按模型统计的请求和令牌 | 推荐 |
| `roles/logging.viewer` | Cloud 审计日志 | 推荐 |
| `roles/policyanalyzer.activityAnalysisViewer` | 每个密钥和服务帐户的上次使用时间 | 可选 |

要获取**实际成本**，您的 Cloud Billing 数据必须[导出到 BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=zh-cn)，并且服务帐户需要在导出数据集上拥有 `roles/bigquery.dataViewer`，在运行查询的项目上拥有 `roles/bigquery.jobUser`。

要**从 SecureAI 撤销**（可选），还需为您希望允许的每项操作授予相应角色：

| 操作 | 角色 |
|------|------|
| 停用服务帐户 | `roles/iam.serviceAccountAdmin` |
| 删除服务帐户密钥 | `roles/iam.serviceAccountKeyAdmin` |
| 删除 API 密钥 | `roles/serviceusage.apiKeysAdmin` |
| 停用 Workload Identity 池或提供方 | `roles/iam.workloadIdentityPoolAdmin` |
| 停用 OAuth 客户端 | `roles/iam.oauthClientAdmin` |

<Note>
您**不需要** `roles/billing.viewer`：它是结算帐户角色，无法在项目上授予，连接器也不使用它。
</Note>

不会静默跳过任何内容：SecureAI 无法读取的内容都会连同可解决问题的角色一起列出 — 在连接时、每次同步后以及 GCP 面板中。

## 凭证

| 字段 | 必填 | 描述 |
|------|------|------|
| `projectId` | 是 | 项目 **ID**（例如 `my-project-123`）— 不是项目名称或编号。 |
| `location` | 是 | 您的代理和端点所在的 Vertex AI 位置（例如 `us-central1`、`europe-west4`、`global`）。使用情况和成本涵盖所有位置。 |
| `locations` | 否 | 多个位置，以逗号分隔（最多 10 个）。优先于 `location`。 |
| `serviceAccountJson` | 二选一 | 服务帐户密钥 JSON。静态加密。 |
| `impersonateServiceAccount` | 二选一 | 无密钥：SecureAI 模拟的服务帐户的电子邮件地址。仅当您的部署提供无密钥访问时才会显示。 |
| `billingExportTable` | 否 | 账单导出的 `project.dataset.table`（例如 `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`）。 |
| `billingProjectId` | 否 | 运行 BigQuery 查询的项目。默认为表所在的项目；`dataset.table` 形式的名称会在此项目中查找（为空时在 `projectId` 中查找）。 |

### 获取方式

**选项 A — JSON 密钥**

1. 在 [Google Cloud 控制台](https://console.cloud.google.com/)中，转到 **IAM 和管理 → 服务账号 → 创建服务账号**（例如 `secureai-discovery`）。
2. 转到 **IAM 和管理 → IAM → 授予访问权限**，输入服务帐户的电子邮件地址作为主账号，并添加[先决条件](#先决条件)中的角色。
3. 回到 **服务账号**，打开该帐户 → **密钥 → 添加密钥 → 创建新密钥 → JSON**，然后下载文件。
4. 将**完整的** JSON 粘贴到 `serviceAccountJson` 中，然后删除下载的文件。

使用 `gcloud` 的等效操作：

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
如果 Google 提示服务帐户密钥创建已停用，说明您的组织强制执行了 `iam.disableServiceAccountKeyCreation` 政策 — 这是 2024 年以来创建的组织的默认设置。请使用选项 B，或请组织管理员为此项目设置例外。
</Warning>

**选项 B — 无密钥（模拟）**

1. 创建服务帐户并为其授予角色（上面的第 1 步和第 2 步）。
2. 在 SecureAI 的连接表单中，**Service account to impersonate** 字段会显示需要授权的 SecureAI 帐户。在 Google Cloud 中打开您的服务帐户 → **权限 → 授予访问权限**，输入该帐户作为主账号，并为其授予 `roles/iam.serviceAccountTokenCreator`。
3. 在该字段中输入您的服务帐户的电子邮件地址，并将 JSON 留空。

如果该字段没有出现，说明您的部署不提供无密钥访问 — 请使用选项 A。

## 连接

1. **管理 → 集成 → 云 → Google Cloud — Discovery → 连接。**
2. 输入项目 ID、位置（或在 **More Vertex AI Locations** 中输入多个位置），以及 JSON 密钥或要模拟的服务帐户（二者之一）。如果您使用账单导出，请添加账单字段。
3. 点击 **连接**。保存之前，SecureAI 会对项目进行一次真实读取来检查凭证，需要几秒钟。如果无法读取项目（ID 错误、没有角色、位置拼写错误），它会显示原因且不保存任何内容；您输入的内容会保留在表单中。
4. 如果已保存但缺少某些角色，警告会列出这些角色。授予这些角色后再次同步。
5. 立即使用卡片上的刷新按钮进行同步。此后，SecureAI 每 6 小时自动同步一次。

以后要更改凭证，请再次使用 **连接**。留空的字段会保留已存储的值；输入 JSON 密钥会替换已存储的模拟设置，反之亦然。

## 验证

- [Cloud Sensors](/zh/discovery/cloud-sensors) 会列出发现的代理。点击 Google Cloud 卡片可打开 GCP 面板：使用情况和成本（请求、失败、令牌、缓存、成本及其来源）、模型和部署、身份和访问（服务帐户和密钥及其上次使用时间、IAM 绑定）以及审计。
- 如果面板显示 **Discovery could not read everything**，请授予其列出的角色并再次同步。
- [NHI 清单](/zh/discovery/nhi-inventory) 会显示服务帐户和密钥。

如果同步失败（例如密钥已被删除或角色已被移除），卡片会显示错误，SecureAI 会以退避方式重试，并保留上一次的清单。部分读取绝不会使代理退役或移除身份。

## 成本

- **使用 `billingExportTable` 时**：本项目在 AI 服务（Vertex AI、Gemini API、Agent Builder、Dialogflow 等）上的实际支出，扣除赠送金后以结算帐户的币种显示。当赠送金覆盖了使用量时，净额可能为零；此时面板会在旁边显示扣除赠送金前的金额。Google 会以数小时的延迟更新导出数据。
- **不使用时**：估算值 — Cloud Monitoring 中的令牌数 × 标价，包括 Claude 和提示缓存令牌。不反映折扣或承诺使用合同。

## 撤销

当连接器拥有相应操作的角色时（请参阅[先决条件](#先决条件)），可从 [NHI 清单](/zh/discovery/nhi-inventory)（挂锁）撤销 GCP 身份。每项操作在 Google 端的效果：

| 身份 | 在 Google 端发生什么 | 可逆 |
|------|----------------------|------|
| 服务帐户 | 停用 | 是 — 在 Google Cloud 中重新启用 |
| 服务帐户密钥 | 删除 | 否 |
| API 密钥 | 删除 | 可在 Google Cloud 中于 30 天内恢复 |
| Workload Identity 池 / 提供方、OAuth 客户端 | 停用 | 是 |

保护措施：

- 连接器使用的服务帐户及其密钥无法从 SecureAI 撤销 — 那样会中断发现。请在 Google Cloud 中轮换它们。
- Google 的默认服务帐户（Compute Engine 默认服务帐户、App Engine、Cloud Build、服务代理）需要二次确认：停用其中一个会停止以其身份运行的所有虚拟机、应用或构建。
- 如果连接器缺少某项操作的角色，错误会指出该角色。

## 相关

- [Google Vertex AI — 在您的帐户上推理](/en/integrations/cloud/vertex-ai-inference)
- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [Google Workspace SSO](/zh/iam/google-workspace)
- [NHI 清单](/zh/discovery/nhi-inventory)
