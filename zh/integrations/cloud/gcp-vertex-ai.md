---
sidebar_position: 6
title: "Google Cloud — 发现"
sidebarTitle: "Google Cloud"
icon: "/img/icons/google-cloud.svg"
sidebar_label: "Google Cloud — 发现"
description: "连接 Google Cloud，以便 SecureAI 可以清点 Vertex AI 的代理、模型、服务帐户、密钥、IAM、使用情况和成本 — 可以是单个项目，也可以是整个组织"
---

# Google Cloud — 发现

连接您的 Google Cloud 项目（或整个组织或文件夹），以便 SecureAI 可以清点 Vertex AI 代理、端点和模型，以及围绕它们的服务帐户、密钥、IAM 绑定、审计日志、使用情况和成本。

<Info>
此卡片**只读取**项目，从不发送提示。如果您希望在自己的 Google Cloud 帐户上运行 SecureAI 的 LLM 流量，请参阅 [Google Vertex AI — 在您的帐户上推理](/zh/integrations/cloud/vertex-ai-inference)。
</Info>

## SecureAI 导入什么

- **Vertex AI**：代理（Agent Engine）、服务端点、正在运行的批处理作业和调优作业，以及模型 — Model Registry 加上正在使用的每个发布方模型（Gemini、Claude、开放模型）。
- **Agent Builder / Gemini Enterprise 和 Dialogflow CX**（可选）：Agent Builder（Discovery Engine）引擎及其数据存储区，在 `global`、`us` 和 `eu` 位置中查询；以及 Dialogflow CX 代理，在 `global` 和您配置的 Vertex AI 位置中查询。
- 过去 30 天**按模型统计的使用情况**：请求数（以及其中失败的数量）、输入和输出令牌，以及提示缓存令牌。
- 过去 30 天**按凭证统计的使用情况**（Cloud Monitoring）：每个服务帐户和每个 API 密钥的请求总数，以及对 AI API（Vertex AI、Gemini API、Agent Builder、Dialogflow）的请求数。OAuth 客户端的流量（人员以及控制台或 `gcloud` 等工具）会单独汇总。它还提供这些帐户和密钥的上次使用时间。
- **按模型和身份统计的使用情况**（可选）：哪个服务帐户或人员调用了哪个 Vertex AI 模型，数据来自数据访问审计日志（如果您已开启）。请参阅[按模型和身份统计的使用情况](#按模型和身份统计的使用情况)。
- **在 SecureAI 之外使用的 Vertex AI**：未经过 SecureAI 推理连接、直接调用 Vertex AI 或 Gemini 的身份。请参阅[在 SecureAI 之外使用的 Vertex AI](#在-secureai-之外使用的-vertex-ai)。
- 过去 30 天的**成本**：来自 BigQuery 账单导出的本项目实际 AI 支出，或按标价计算的估算值。
- **NHI**：服务帐户、用户管理的服务帐户密钥、API 密钥、Workload Identity Federation 池和提供方，以及 OAuth 客户端 — 包括它们的上次使用时间（来自 Policy Analyzer 和按凭证统计的使用情况）以及它们的[特权风险](#特权风险)。可从 [NHI 清单](/zh/discovery/nhi-inventory) 撤销和恢复，可以手动操作，也可以通过[自动策略](#自动-nhi-策略)。
- 项目的 **IAM** 角色绑定。
- AI 和身份服务（Vertex AI、IAM、IAM Credentials、STS、API Keys、Resource Manager）的 **Cloud 审计日志**：过去 30 天内最新的 200 个事件。

默认情况下，连接器读取**一个项目**。使用 **Organization or folder** 字段时，它会读取组织或文件夹中的每个活跃项目：请参阅[组织或文件夹模式](#组织或文件夹模式)。

## 先决条件

### 需要启用的 API

SecureAI 使用相应的 Google API 读取每个范围。请在项目上启用它们（**API 和服务 → 库**，或使用 `gcloud services enable`）：

| API | 用途 | |
|-----|------|---|
| `cloudresourcemanager.googleapis.com` | 项目及其 IAM 绑定 | 必需 |
| `iam.googleapis.com` | 服务帐户、密钥、Workload Identity、OAuth 客户端 | 必需 |
| `aiplatform.googleapis.com` | Vertex AI 代理、端点、作业和模型 | 必需 |
| `apikeys.googleapis.com` | API 密钥 | 推荐 |
| `monitoring.googleapis.com` | 按模型和按凭证统计的使用情况 | 推荐 |
| `logging.googleapis.com` | 审计日志和数据访问日志 | 推荐 |
| `policyanalyzer.googleapis.com` | 密钥和服务帐户的上次使用时间（Policy Analyzer） | 可选 |
| `bigquery.googleapis.com` | 实际成本，如果您使用账单导出（在运行查询的项目上） | 可选 |
| `cloudasset.googleapis.com` | 组织或文件夹模式（在服务帐户所在的项目上） | 仅限该模式 |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | 如果您使用该产品 |
| `dialogflow.googleapis.com` | Dialogflow CX 代理 | 如果您使用该产品 |

停用的 API 不会导致同步失败：它会显示为一个缺口 **API disabled in the project — enable it**，并注明相应服务。Agent Builder 和 Dialogflow 是例外：如果它们的 API 处于关闭状态，SecureAI 会认为项目未使用该产品，不会将其标记为缺口。

### 角色

一个供 SecureAI 使用的服务帐户。**在项目上**为其授予以下角色（**IAM 和管理 → IAM → 授予访问权限**）：

| 角色 | 解锁的内容 | |
|------|------------|---|
| `roles/aiplatform.viewer` | Vertex AI 代理、端点、作业和模型 | 必需 |
| `roles/iam.securityReviewer` | 服务帐户、密钥、API 密钥、Workload Identity、OAuth 客户端、IAM 绑定 | 必需 |
| `roles/monitoring.viewer` | 按模型统计的使用情况（请求和令牌）以及按凭证统计的使用情况 | 推荐 |
| `roles/logging.viewer` | Cloud 审计日志 | 推荐 |
| `roles/policyanalyzer.activityAnalysisViewer` | 每个密钥和服务帐户的上次使用时间 | 可选 |
| `roles/logging.privateLogViewer` | 按模型和身份统计的使用情况：数据访问日志是私有日志，`roles/logging.viewer` 无法读取 | 可选 |
| `roles/discoveryengine.viewer` | Agent Builder / Gemini Enterprise 引擎 | 可选 |
| `roles/dialogflow.reader` | Dialogflow CX 代理 | 可选 |

要获取**实际成本**，您的 Cloud Billing 数据必须[导出到 BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=zh-cn)，并且服务帐户需要在导出数据集上拥有 `roles/bigquery.dataViewer`，在运行查询的项目上拥有 `roles/bigquery.jobUser`。

要**从 SecureAI 撤销和恢复**（可选），您需要为希望允许的每项操作授予相应角色。如果您的部署提供无密钥访问，请将这些角色授予一个[仅用于撤销的独立服务帐户](#用于撤销的独立服务帐户)，并让用于读取的服务帐户只保留只读角色；否则，请将它们授予连接器的服务帐户：

| 操作 | 角色 |
|------|------|
| 停用（或重新启用）服务帐户 | `roles/iam.serviceAccountAdmin` |
| 删除服务帐户密钥 | `roles/iam.serviceAccountKeyAdmin` |
| 删除（或恢复）API 密钥 | `roles/serviceusage.apiKeysAdmin` |
| 停用（或重新启用）Workload Identity 池或提供方 | `roles/iam.workloadIdentityPoolAdmin` |
| 停用（或重新启用）OAuth 客户端 | `roles/iam.oauthClientAdmin` |

<Note>
您**不需要** `roles/billing.viewer`：它是结算帐户角色，无法在项目上授予，连接器也不使用它。
</Note>

不会静默跳过任何内容：SecureAI 无法读取的内容都会连同可解决问题的角色一起列出 — 在连接时、每次同步后以及 GCP 面板中。

## 凭证

| 字段 | 必填 | 描述 |
|------|------|------|
| **Google Cloud Project ID**（`projectId`） | 是 | 项目 **ID**（例如 `my-project-123`）— 不是项目名称或编号。在组织模式下，它是配额和结算项目。 |
| **Vertex AI Location**（`location`） | 是 | 您的代理和端点所在的 Vertex AI 位置（例如 `us-central1`、`europe-west4`、`global`）。使用情况和成本涵盖所有位置。 |
| **More Vertex AI Locations**（`locations`） | 否 | 多个位置，以逗号分隔（最多 10 个）。优先于上面的位置。 |
| **Service Account JSON**（`serviceAccountJson`） | 二选一 | 服务帐户密钥 JSON。静态加密。 |
| **Service account to impersonate**（`impersonateServiceAccount`） | 二选一 | 无密钥：SecureAI 模拟的服务帐户的电子邮件地址。仅当您的部署提供无密钥访问时才会显示。 |
| **Service account for revocation**（`revokeImpersonateServiceAccount`） | 否 | 第二个服务帐户，仅用于撤销或恢复身份，从不用于读取。仅当您的部署提供无密钥访问时才会显示。 |
| **Organization or folder**（`scope`） | 否 | `organizations/<number>` 或 `folders/<number>`：读取其中的每个活跃项目。 |
| **BigQuery Billing Export Table**（`billingExportTable`） | 否 | 账单导出的 `project.dataset.table`（例如 `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`）。 |
| **BigQuery Billing Project ID**（`billingProjectId`） | 否 | 运行 BigQuery 查询的项目。默认为表所在的项目；`dataset.table` 形式的名称会在此项目中查找（为空时在项目 ID 中查找）。 |

### 获取方式

**选项 A — JSON 密钥**

1. 在 [Google Cloud 控制台](https://console.cloud.google.com/)中，转到 **IAM 和管理 → 服务账号 → 创建服务账号**（例如 `secureai-discovery`）。
2. 转到 **IAM 和管理 → IAM → 授予访问权限**，输入服务帐户的电子邮件地址作为主账号，并添加[先决条件](#先决条件)中的角色。
3. 回到 **服务账号**，打开该帐户 → **密钥 → 添加密钥 → 创建新密钥 → JSON**，然后下载文件。
4. 将**完整的** JSON 粘贴到 **Service Account JSON** 中，然后删除下载的文件。

使用 `gcloud` 的等效操作：

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
# 可选：上次使用时间、按模型和身份统计的使用情况、Agent Builder 和 Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

如果您使用 Agent Builder 或 Dialogflow CX，它们的 API 已在项目上启用；您无需为 SecureAI 另行启用。

<Warning>
如果 Google 提示服务帐户密钥创建已停用，说明您的组织强制执行了 `iam.disableServiceAccountKeyCreation` 政策 — 这是 2024 年以来创建的组织的默认设置。请使用选项 B，或请组织管理员为此项目设置例外。
</Warning>

**选项 B — 无密钥（模拟）**

1. 创建服务帐户并为其授予角色（上面的第 1 步和第 2 步）。
2. 在 SecureAI 的连接表单中，**Service account to impersonate (keyless — instead of the JSON)** 字段的帮助文本会注明需要授权的 SecureAI 帐户。在 Google Cloud 中打开您的服务帐户 → **权限 → 授予访问权限**，输入该帐户作为主账号，并为其授予 `roles/iam.serviceAccountTokenCreator`。使用 `gcloud`：

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. 在该字段中输入您的服务帐户的电子邮件地址，并将 JSON 留空。

如果该字段没有出现，说明您的部署不提供无密钥访问 — 请使用选项 A。

### 用于撤销的独立服务帐户

如果您的部署提供无密钥访问，您可以将读取和撤销分开。与把撤销角色授予用于读取的服务帐户相比，更推荐这种方式：

1. 创建第二个服务帐户（例如 `secureai-revoke`），并**只**为其授予[先决条件](#先决条件)中的撤销角色。
2. 在该帐户上，将 `roles/iam.serviceAccountTokenCreator` 授予 **Service account for revocation (optional — separate from reading)** 字段帮助文本中注明的 SecureAI 帐户。
3. 在该字段中输入它的电子邮件地址。

SecureAI 仅在撤销或恢复身份时才向该帐户请求一个有效期为 1 小时的令牌；同步从不使用它。用于读取的服务帐户保留只读角色。SecureAI 也会拒绝从清单中撤销这个撤销帐户。

## 组织或文件夹模式

要用一个连接器清点多个项目，请在 **Organization or folder** 中填写 `organizations/<number>` 或 `folders/<number>`（例如 `organizations/123456789012`）。

- SecureAI 通过 **Cloud Asset Inventory** 查找活跃项目，并像单项目连接器一样读取每个项目。**Google Cloud Project ID** 仍是配额和结算项目。
- **在组织或文件夹上**为服务帐户授予：`roles/cloudasset.viewer`、`roles/iam.securityReviewer` 和 `roles/aiplatform.viewer`，以及用于使用情况和审计的 `roles/monitoring.viewer` 和 `roles/logging.viewer`。
- 在服务帐户所在的项目上启用 `cloudasset.googleapis.com`。

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

对于文件夹，请使用 `gcloud resource-manager folders add-iam-policy-binding <number>` 代替 `gcloud organizations add-iam-policy-binding`。

为了让同步在合理的时间内完成，每次同步都有上限。配额项目优先，其次是拥有 Vertex AI 资源的项目：

| 内容 | 每次同步的上限 |
|------|----------------|
| 清点的项目 | 200 |
| 配额项目指标范围之外的按模型统计的使用情况（Cloud Monitoring） | 15 个拥有 Vertex AI 的项目 |
| 审计日志 | 25 个项目 |
| 按模型和身份统计的使用情况（数据访问日志） | 10 个项目 |

超出上限的部分会显示为部分缺口，并注明已读取多少。无法读取的项目也会作为缺口列出，**其任何内容都不会被退役或清除**。连接时，此模式下的测试只会枚举第一页项目并检查配额项目：读取每个项目是同步的工作。

## 连接

1. **Admin → Integrations → Cloud → Google Cloud — 发现 → 连接集成。**
2. 输入项目 ID、位置（或在 **More Vertex AI Locations** 中输入多个位置），以及 JSON 密钥或要模拟的服务帐户（二者之一）。如果您需要，请添加用于撤销的服务帐户、组织或文件夹，以及账单字段。
3. 点击 **连接**。保存之前，SecureAI 会对项目进行一次真实读取来检查凭证，需要几秒钟。如果无法读取项目，它会显示原因且不保存任何内容；您输入的内容会保留在表单中。可能出现的消息见[故障排除](#故障排除)。
4. 如果已保存但缺少某些角色，警告会列出这些角色。授予这些角色后再次同步。
5. 立即使用卡片上的刷新按钮进行同步。此后，SecureAI 每 6 小时自动同步一次。

以后要更改凭证，请再次使用 **连接**。留空的字段会保留已存储的值；输入 JSON 密钥会替换已存储的模拟设置，反之亦然。

## 验证

- [Cloud Sensors](/zh/discovery/cloud-sensors) 会列出发现的代理。点击 Google Cloud 卡片可打开 GCP 面板：使用情况和成本（请求、失败、令牌、缓存、成本及其来源）、模型和部署、身份和访问（服务帐户和密钥及其上次使用时间、IAM 绑定）以及审计。
- 如果面板显示 **Discovery could not read everything**，请逐行查看（请参阅[故障排除](#故障排除)）并再次同步。
- [NHI 清单](/zh/discovery/nhi-inventory) 会显示服务帐户和密钥。

如果同步失败（例如密钥已被删除或角色已被移除），卡片会显示错误，SecureAI 会以退避方式重试，并保留上一次的清单。部分读取绝不会使代理退役或移除身份。

## 按模型和身份统计的使用情况

Cloud Monitoring 能说明每个凭证发出了多少请求，但无法说明请求发往哪个模型。要了解**哪个身份调用了哪个模型**，SecureAI 会读取 Vertex AI 的**数据访问**审计日志。这是可选的，由您决定：

- 只有当 `aiplatform.googleapis.com`（或所有服务）开启了 **DATA_READ** 或 **DATA_WRITE** 日志时，SecureAI 才会读取它们。SecureAI 会在 IAM 政策中检测这一点；它从不替您开启。
- 开启它们会产生 **Cloud Logging 注入费用**，按 Google 的费率计费。您可以在 **IAM 和管理 → 审核日志 → Vertex AI API → 数据读取** 中开启。
- 服务帐户需要 `roles/logging.privateLogViewer`。
- 每个项目每次同步，SecureAI 最多读取 5,000 个条目或读取 20 秒，以先达到者为准。
- 如果它们处于关闭状态，面板会显示一个可选缺口，说明如何开启。如果您在组织或文件夹上开启了它们，但连接的是单个项目，SecureAI 无法从项目的政策中看到这一点，仍会显示该缺口。

## 特权风险

读取 IAM 政策后，如果服务帐户拥有以下任一角色，SecureAI 会将其标记为**特权**帐户：

- Owner（`roles/owner`）或 Editor（`roles/editor`）；
- 任何管理员角色（`roles/<service>.admin` 或以 `Admin` 结尾）；
- `roles/iam.serviceAccountTokenCreator` 或 `roles/iam.serviceAccountUser`，它们允许持有者以其他服务帐户的身份行事。

特权服务帐户的用户管理密钥会继承该标记：持有密钥的人就拥有该特权。**无限制**的 API 密钥（没有 API 目标，也没有应用限制）也会被标记。在 [NHI 清单](/zh/discovery/nhi-inventory) 中，它们会作为风险因素显示为 **Privileged (admin role or impersonation)** 和 **API key without restrictions**。如果无法读取 IAM 政策，SecureAI 不会标记任何内容，而不是将某个帐户视为非特权帐户。

## 在 SecureAI 之外使用的 Vertex AI

GCP 面板的 **Identity & Access** 标签页包含 **Vertex AI used outside SecureAI**：过去 30 天内未经过 [Vertex AI 推理](/zh/integrations/cloud/vertex-ai-inference)连接、直接调用 Vertex AI 或 Gemini 的身份。这些提示未经过 DLP、策略或签名回执。

- 启用数据访问 (Data Access) 审计日志时（请参阅[按模型和身份统计的使用情况](#按模型和身份统计的使用情况)），每一行会列出调用了哪些模型以及调用次数，并且只统计推理调用。
- 未启用时，数字来自 Cloud Monitoring 按凭证（服务帐户或 API 密钥）的统计，包括对 AI API（Vertex AI、Gemini API、Agent Builder、Dialogflow）的所有调用，而不仅是推理。
- 推理连接的服务帐户和连接器的服务帐户永远不计入。人员不会逐一列出：他们的调用汇总为一行（**People (Google accounts)**，或 **People and tools (OAuth)**：控制台、gcloud、应用）。
- 如果 SecureAI 在该次同步中无法读取推理连接，它不会进行任何分类，会将其标记为可选缺口，并保留上一次同步的结果。
- 它会生成 Insights 发现 **Google Vertex AI / Gemini is being used outside SecureAI**：严重程度为中等；如果调用方是 API 密钥（长期有效的凭证），则为严重。它映射到 OWASP LLM02、ISO/IEC 42001 A.4.2 和 A.6.2.6，以及 NIST AI RMF MAP-1.1 和 GOVERN-6.1。

## 成本

- **使用账单导出表时**：本项目在 AI 服务（Vertex AI、Gemini API、Agent Builder、Dialogflow 等）上的实际支出，扣除赠送金后以结算帐户的币种显示。当赠送金覆盖了使用量时，净额可能为零；此时面板会在旁边显示扣除赠送金前的金额。Google 会以数小时的延迟更新导出数据。
- **不使用时**：估算值 — Cloud Monitoring 中的令牌数 × 标价，包括 Claude 和提示缓存令牌。不反映折扣或承诺使用合同。

## 撤销和恢复

当连接器或用于撤销的服务帐户拥有相应操作的角色时（请参阅[先决条件](#先决条件)），可从 [NHI 清单](/zh/discovery/nhi-inventory)（挂锁）撤销 GCP 身份。每项操作在 Google 端的效果：

| 身份 | 在 Google 端发生什么 | 可逆 |
|------|----------------------|------|
| 服务帐户 | 停用 | 是 — **Restore** 会重新启用它 |
| 服务帐户密钥 | 删除 | 否 — Google 会将其销毁。请创建新密钥 |
| API 密钥 | 删除 | 是，30 天内 — **Restore** 可将其恢复；之后 Google 不再保留它 |
| Workload Identity 池 / 提供方、OAuth 客户端 | 停用 | 是 — **Restore** 会重新启用它 |

要撤消一次撤销，请在 NHI 清单中打开该身份的菜单并选择 **Restore**（*Undo the revocation at Google Cloud*）。该身份会在 Google Cloud 中重新启用，在 SecureAI 中会被解除阻止，并保持 **In remediation** 状态，直到您审核它。

- 只有 **SecureAI 在 Google Cloud 中撤销的**内容才能恢复，无论是手动撤销还是通过自动策略撤销。对于仅在 SecureAI 网关上的阻止，或您的团队直接在 Google Cloud 中停用的身份，不提供此操作。
- 已删除的服务帐户密钥无法恢复：SecureAI 会直接拒绝，不调用 Google。
- 恢复使用与撤销相同的角色。

保护措施：

- 连接器使用的服务帐户及其密钥无法从 SecureAI 撤销 — 那样会中断发现。用于撤销的服务帐户也是如此。请在 Google Cloud 中轮换它们。
- [Vertex AI 推理](/zh/integrations/cloud/vertex-ai-inference)连接用于身份验证的服务帐户及其用于签名的密钥也无法撤销：那样会停止每一次受治理的调用。使用无密钥（模拟）选项时，只有服务帐户受到保护：其密钥仍可撤销，因为 SecureAI 不使用其中任何一个签名。如果 SecureAI 无法确认推理连接使用的是哪个身份，它不会撤销任何服务帐户或服务帐户密钥（API 密钥不受影响）。
- Google 的默认服务帐户（Compute Engine 默认服务帐户、App Engine、Cloud Build、服务代理）需要二次确认：停用其中一个会停止以其身份运行的所有虚拟机、应用或构建。
- 如果连接器缺少某项操作的角色，错误会指出该角色。

## 自动 NHI 策略

**自动 NHI 策略**（NHI 清单 → **Automatic policies**）按规则对 Google Cloud 身份发出警报或将其撤销，无需逐一审核。它们会在连接器每次成功同步结束时进行评估，且只针对该连接器的身份。

| 规则 | 在 Google Cloud 上 | 默认阈值 |
|------|--------------------|----------|
| **Unused SA key / IAM access key** | N 天内未进行身份验证的服务帐户密钥。它只对已知的上次使用时间生效：没有使用记录的密钥不受影响。 | 90 天 |
| **Old SA key / IAM access key** | 创建时间超过 N 天的服务帐户密钥，无论是否使用过。 | 365 天 |
| **Unrestricted API key** | 没有应用限制且没有 API 目标的 API 密钥。 | — |
| **Privileged SA with a user key** | [特权](#特权风险)服务帐户的用户管理密钥。 | — |

每条规则有三种模式：**Off**、**Alert** 和 **Revoke**。所有规则初始都为关闭。保护措施：

- **Simulation mode (dryRun)** 默认开启：开启时，设为 **Revoke** 的规则不会切断任何内容；它只列出将要执行的操作。关闭它是启用真实切断的唯一方式。**Simulate with this configuration** 会在您保存之前显示效果。
- **Revocation cap per run**：默认为 5（1 到 50）。如果在一次运行中 **Revoke** 规则匹配的身份数超过上限，则不会切断任何内容，并发送警报。
- **Exclusions**：如果身份的所有者、名称或资源与某个模式匹配，任何规则都不会对其生效；`*` 是唯一的通配符。
- 只评估完整的密钥列表。
- SecureAI 使用的凭证（连接器的、撤销帐户的或 Vertex AI 推理的）永远不会被切断。Google 默认服务帐户的密钥永远不会被自动切断：规则只发出警报，由人来决定。

在 Google Cloud 上，撤销服务帐户密钥会将其**删除**（无法恢复），撤销 API 密钥会将其删除，但可在 30 天内恢复。每项操作都会被审计并发送通知。

## 故障排除

### 连接时

如果测试失败，**连接** 会显示以下消息之一，且不保存任何内容：

| 消息 | 原因 | 处理方法 |
|------|------|----------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | 您输入的是项目名称或编号 | 从控制台的项目选择器中复制项目 **ID**。 |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | 该 ID 不存在，或服务帐户在该项目上没有任何角色 | 检查 ID，并在项目上授予这两个必需角色。 |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | 该位置不存在（例如拼写错误） | 更正位置。 |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | 组织模式下未启用 Cloud Asset API | 在服务帐户所在的项目上启用 `cloudasset.googleapis.com`。 |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | 组织模式下组织或文件夹上缺少角色，或编号错误 | 在组织或文件夹上授予这些角色，或清空该字段以只读取项目。 |

### 面板中的缺口

当 GCP 面板显示 **Discovery could not read everything** 时，每一行都会注明范围和缺少的内容。标记为 *optional* 的行只用于丰富清单。

| 该行显示的内容 | 含义 | 处理方法 |
|----------------|------|----------|
| 一个角色（例如 `roles/monitoring.viewer`） | 服务帐户缺少该角色 | 在项目（或组织或文件夹）上授予该角色，然后再次同步。 |
| **API disabled in the project — enable it** | 该范围的 API 处于关闭状态；详细信息会注明服务 | 在 **API 和服务 → 库** 中启用它。 |
| 没有角色，且详细信息说明组织政策禁止该位置 | 组织政策（`constraints/gcp.resourceLocations`）阻止了该位置，因此那里不可能存在任何资源。任何角色都无法解决 | 从配置中移除该位置，或请组织管理员允许该位置。 |
| **Usage by model and identity** 未开启 | Vertex AI 的数据访问日志处于关闭状态 | 可选：请参阅[按模型和身份统计的使用情况](#按模型和身份统计的使用情况)。 |
| 部分读取（例如组织模式的上限） | 只读取了一部分；详细信息会说明读取了多少 | 不会因此退役或清除任何内容。如果您需要看到全部内容，请缩小范围。 |

## 相关

- [Google Vertex AI — 在您的帐户上推理](/zh/integrations/cloud/vertex-ai-inference)
- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [Google Workspace SSO](/zh/iam/google-workspace)
- [NHI 清单](/zh/discovery/nhi-inventory)
