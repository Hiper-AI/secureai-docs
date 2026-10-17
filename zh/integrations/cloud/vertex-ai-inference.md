---
sidebar_position: 7
title: "Google Vertex AI — 在您的帐户上推理"
sidebar_label: "Vertex AI — 推理"
description: "在您自己的 Google Cloud 帐户上运行 SecureAI 的 LLM 流量：用您的承诺支出（CUD）向 Google 付费，同时 SecureAI 继续执行 DLP、策略和签名收据。"
---

# Google Vertex AI — 在您的帐户上推理

通过此集成，SecureAI 的大语言模型（LLM）调用会在**您自己的 Google Cloud 项目**中运行，而不是在 SecureAI 托管的提供商上运行。使用量直接计入您的 Google 帐户，因此您可以使用承诺支出（CUD）和协商折扣。

SecureAI 仍位于每个请求的路径上：**DLP、模型策略、数据驻留和签名收据**的适用方式与任何其他提供商完全相同。

<Info>
**请勿与另一张 Google Cloud 卡片混淆。** 本页将 Vertex AI 连接为**推理提供商**（Admin → Integrations → **AI providers**）。**Google Cloud — 发现** 卡片（**Cloud** 类别）只以只读模式清点项目，从不发送提示；其说明见 [Google Cloud — 发现](/zh/integrations/cloud/gcp-vertex-ai)。您可以在同一个项目上同时使用两者，但它们相互独立，所需的权限也不同。
</Info>

## 哪些在 Vertex 上运行，哪些不在

| 在您的 Vertex 上运行 | 保留在 SecureAI 托管的提供商上 |
|---|---|
| 聊天和代理（来自您所选系列的模型） | 嵌入（文档和索引搜索） |
| Teams 会议摘要（Gemini 模型） | 搜索重排序 |
| 语法检查、翻译和其他内部后台任务（当您选择 **Remap everything** 时） | 文档 OCR |
| | 管理助手 |
| | 图像生成和实时语音 |
| | 自托管模型和 Claude Code 代理 |

目前可用的模型：**Gemini**，以及在 Vertex 上以 MaaS 形式提供的开放模型（**gpt-oss、DeepSeek、Llama 和 Qwen**）。**尚不支持 Vertex 上的 Claude 和 Mistral**；这些模型按回退设置处理（见下文）。

## 您可以使用多少个云提供商

| 套餐 | 可同时启用的推理提供商 |
|------|------------------------|
| **Scale** | 1 个（Google Vertex AI、Azure AI Foundry **或** Amazon Bedrock） |
| **Enterprise** | 最多 3 个 — 例如 Vertex AI 用于 Gemini、Foundry 用于 GPT、Bedrock 用于 Claude |

启用多个提供商时，每个提供商服务**不同**的模型系列：一个系列只能由一个已启用的提供商承接，并且只有一个提供商可以处于 **Remap everything** 模式。当您在开启状态下保存集成时，SecureAI 会在以下两种情况下拒绝保存，并在面板中说明原因：

| 情况 | 面板消息 |
|------|----------|
| 路由与另一个已启用的提供商重叠（某个系列已被另一个提供商承接，或出现第二个 **Remap everything**） | *This routing overlaps another enabled cloud provider: …*，后面跟着发生冲突的系列或模式。 |
| 您的套餐不允许再启用一个提供商 | *Your plan's BYO-cloud provider limit is reached (… of … in use). Disable another provider or upgrade the plan.* |

## 先决条件

- 一个已启用结算的 **Google Cloud 项目**。
- 在该项目上启用 **Agent Platform API (Vertex AI API)**（`aiplatform.googleapis.com` 服务）。
- 您项目中的一个**服务帐户**，拥有 **Agent Platform User** 角色（`roles/aiplatform.user`），并采用以下两种方式之一让 SecureAI 以其身份行事：
  - **选项 A — JSON 密钥**：该服务帐户的 JSON 密钥。
  - **选项 B — 无密钥（模拟）**：您在自己的服务帐户上，为面板中显示的 SecureAI 服务帐户授予 **Service Account Token Creator** 角色（`roles/iam.serviceAccountTokenCreator`），不存储任何密钥。只有当您的 SecureAI 部署提供此选项时才可用；否则面板会将其显示为停用状态，并提示 *Keyless access is not enabled on this deployment.*
- SecureAI 中 Integrations 部分的 **Admin** 权限。拥有读取权限时，您可以查看配置，但不能更改。

## 第 1 步：在 Google Cloud 中准备项目

您可以通过命令行（快速）或控制台（附截图）完成。第 1 到 3 项对两种身份验证选项都相同；第 4 项（JSON 密钥）仅适用于选项 A。

<Tabs>
<Tab title="gcloud（Cloud Shell）">

在 [Cloud Shell](https://shell.cloud.google.com/) 中或在已安装 `gcloud` 的环境中执行。将 `MY_PROJECT` 替换为实际的项目 ID：

```bash
gcloud config set project MY_PROJECT

# 1. 启用 Agent Platform API（Vertex AI API）
gcloud services enable aiplatform.googleapis.com

# 2. 为 SecureAI 创建专用服务帐户
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. 为其授予调用模型所需的最低角色
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:secureai-vertex@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. 仅限选项 A：生成 JSON 密钥
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MY_PROJECT.iam.gserviceaccount.com
```

</Tab>
<Tab title="Google Cloud 控制台">

1. 在 [Google Cloud 控制台](https://console.cloud.google.com/)中，选择您的项目并打开 **API 和服务 → 库**。搜索 **Agent Platform API**（原 **Vertex AI API**）并点击 **启用**。如果已显示 **API 已启用**，则无需任何操作。

   <div class="mac-window">
   ![Google Cloud 中已启用的 Agent Platform API](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. 转到 **IAM 和管理 → 服务账号 → 创建服务账号**。为其命名（例如 `secureai-vertex`）。

   <div class="mac-window">
   ![创建服务帐户](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. 在 **权限** 下，在项目上授予 **Agent Platform User** 角色（`roles/aiplatform.user`），然后点击 **完成**。推理不需要其他角色。

   <div class="mac-window">
   ![授予 Agent Platform User 角色](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. **仅限选项 A。** 打开该服务帐户，转到 **密钥** 标签页 → **添加密钥 → 创建新密钥**，选择 **JSON** 密钥类型，然后点击 **创建**。文件只会下载一次。

   <div class="mac-window">
   ![创建 JSON 密钥](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
请像对待密码一样对待 JSON 文件。SecureAI 会将其**加密**存储且不再显示，但下载的文件（`key.json`）仍保留在您的计算机上：将其内容粘贴到 SecureAI 中，然后**删除它**，或将其保存在密钥管理器中。
</Warning>

<Warning>
**如果您无法创建密钥。** 如果第 4 项因 `iam.disableServiceAccountKeyCreation` 而失败，说明您的 Google Cloud 组织政策禁止服务帐户密钥（这是新组织的默认设置）。如果您的部署提供**选项 B（无密钥）**，请使用它；否则，请组织政策管理员为该项目设置 `iam.disableServiceAccountKeyCreation` 约束的例外。
</Warning>

### 选项 B：无需密钥授权 SecureAI

使用选项 B 时不会创建任何密钥。改为：

1. 在 SecureAI 中打开 Vertex AI 面板（见第 2 步），选择 **Keyless (impersonation)**，然后在 **Your service account to impersonate** 中输入您的服务帐户的电子邮件地址。
2. 面板会显示要运行的命令，其中已填好您部署的 SecureAI 服务帐户。使用 **Copy** 复制该命令，然后在 Cloud Shell 中运行。它类似于：

   ```bash
   gcloud iam service-accounts add-iam-policy-binding secureai-vertex@MY_PROJECT.iam.gserviceaccount.com \
     --member="serviceAccount:SECUREAI_ACCOUNT" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   该角色是**在您的服务帐户上**授予的，而不是在项目上：SecureAI 只能以该帐户的身份行事，而该帐户本身只拥有 `roles/aiplatform.user`。

### 开放模型（Llama、DeepSeek、Qwen、gpt-oss）

**Gemini 无需其他操作。** 如果还要使用 Llama、DeepSeek、Qwen 或 gpt-oss，请先在 **Vertex AI → Model Garden** 中接受每个模型的条款。这些开放模型需要特定的**区域**（例如 `us-central1`）；使用 `global` 时可能无法使用。

## 第 2 步：在 SecureAI 中连接项目

1. 转到 **Admin → Integrations**，打开 **AI providers** 类别，然后点击 **Google Vertex AI — Inference on your account** 卡片。
2. 在 **Connection** 下填写：

   | 字段 | 填写内容 |
   |------|----------|
   | **Google Cloud project ID** | 项目 ID（例如 `my-project-123`），而不是其显示名称。 |
   | **Vertex AI location** | 开始时保留 `global`：Gemini 3 *preview* 默认模型位于该位置。如果您需要**数据驻留**，请输入一个区域（`us-central1`、`europe-west4`…）：SecureAI 会将每个请求发送到您选择的区域端点，而 Google 在何处处理请求取决于 Google 的数据驻留承诺。使用 `global` 时，由 Google 选择区域。开放模型需要指定区域。 |
   | **Authentication** | **选项 A：** 保持选中 **Service-account key (JSON)**，并将 `key.json` 的**完整**内容粘贴到 **Service-account key JSON** 中。**选项 B：** 选择 **Keyless (impersonation)**，在 **Your service account to impersonate** 中输入您的服务帐户的电子邮件地址，然后运行面板显示的命令（请参阅上文的 **选项 B：无需密钥授权 SecureAI**）。 |

   <div class="mac-window">
   ![Vertex AI 面板的 Connection 部分](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. 点击 **Save**。此时尚未路由任何流量：集成以关闭状态保存，以便您先进行测试。

<Info>
**第一天的建议：** 保持 **Only these model families** 模式且只选 **Gemini**，默认模型保持不变，回退和按席位的支出上限都保持关闭。这是最可预测的设置。待验证完成后再使用 **Remap everything**。
</Info>

<Info>
使用选项 A 时，粘贴的密钥不会再次显示。要替换它，请粘贴新的密钥；如果保存时将该字段留空，则保留当前密钥。
</Info>

## 第 3 步：选择在 Vertex 上运行的内容

在 **What runs on Vertex** 下有两种模式：

- **Only these model families** — 您勾选的系列（Gemini、gpt-oss、DeepSeek、Llama、Qwen）在您的 Vertex 上运行；其他所有模型继续在 SecureAI 的提供商上运行。这是最稳妥的起步方式（默认：仅 Gemini）。
- **Remap everything to Vertex** — 所有 LLM 调用都在您的 Vertex 上运行。没有 Vertex 对应模型的模型由**默认模型**提供服务。

**Default Vertex models**（可编辑）：

| 层级 | 用途 | 默认值 |
|------|------|--------|
| **Fast** | 后台任务和实用工具（语法、翻译、Teams） | `google/gemini-2.5-flash` |
| **Standard** | 没有对应模型的模型 | `google/gemini-3-flash-preview` |
| **Reasoning** | 没有对应模型的推理模型 | `google/gemini-3.1-pro-preview` |
| **Vision** | 包含图像或 PDF 的请求 | `google/gemini-3-flash-preview` |

此外还有两个选项：

| 选项 | 关闭（推荐） | 开启 |
|------|--------------|------|
| **Allow fallback to SecureAI-managed models** | 如果 Vertex 失败或某个模型没有对应模型，请求会被**拒绝**，而不是发送到其他提供商。 | 这些请求会在 SecureAI 托管的提供商上重试**一次**。重试会被审计。 |
| **Apply each seat's spend cap to turns served in your account** | 在您的 Vertex 上处理的轮次不计入每个用户的席位支出上限。 | 这些轮次计入席位的支出上限（包括每月上限和 4 小时突发限制），按标价计算，与 SecureAI 处理的轮次相同。 |

<div class="mac-window">

![What runs on Vertex 部分](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
可用模型取决于**位置**。默认模型（其中几个是 *preview*）可能并非在每个区域都存在。如果连接测试返回 **Model not available in this location**，请选择其他区域，或将默认模型替换为您所在区域提供的模型。开放模型（MaaS）需要在 Vertex AI Model Garden 中接受其条款，并需要特定区域。
</Info>

## 第 4 步：测试连接

1. 集成保存后，在 **Connection test** 下点击 **Test connection**。
2. SecureAI 会向每个默认模型发送一个最小请求，**经过与真实流量相同的路径**（包括网关、策略和收据），并显示每个结果及其延迟。

   <div class="mac-window">
   ![连接测试结果](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. 如果某个模型失败，面板会显示原因。请参阅本页末尾的**故障排除**部分。

### 该身份还能做什么

测试还会使用 `projects:testIamPermissions` 和与推理通道相同的令牌，检查连接的身份在项目中还能做什么：不需要任何额外角色，也不会更改任何内容。面板会显示以下提示之一：

| 面板提示 | 含义 |
|----------|------|
| *Permissions: roles/aiplatform.user — it can call models and also deploy or delete Vertex AI resources, and none of the permissions outside AI that SecureAI checks.* | 使用 `roles/aiplatform.user` 时的预期结果。 |
| *Least privilege: this identity can call models and nothing else that SecureAI checked.* | 它甚至没有 `roles/aiplatform.user` 的部署权限（例如使用自定义角色）。 |
| *This identity can do much more than call models: …* （警告，附权限列表） | 它拥有 AI 之外的权限，例如更改 IAM 政策、创建服务帐户密钥，或读取 Storage、BigQuery 或 Secret Manager 中的数据。活动日志会将该测试记录为警告。请仅向该服务帐户授予 `roles/aiplatform.user`。 |
| *Could not check what else this identity can do in the project …* | Google 未响应；例如 Cloud Resource Manager API 已停用。 |

<Info>
测试会发送几个单令牌请求，**费用计入您的 Google 帐户**（几美分）。
</Info>

## 第 5 步：检查路由并开启

1. 打开 **Routing preview → Show which lane serves each model**。对于目录中的每个模型，它会显示该模型将由 **your Vertex** 提供（以及使用哪个 Vertex 模型）还是由 **SecureAI** 提供，以及哪些会被标为 **hidden from users**。预览会模拟集成处于开启状态，因此您可以在启用之前检查效果。
2. 测试通过后，开启 **Route traffic to Vertex AI**，然后再次点击 **Save**。**如果不保存，开关不会保持开启。** 要开启它，必须已配置项目和凭证。如果您的套餐不允许再启用一个云提供商，或者路由与另一个提供商重叠，SecureAI 会拒绝并说明原因（请参阅上文的 **您可以使用多少个云提供商**）。

   <div class="mac-window">
   ![已开启的 Route traffic to Vertex AI 开关](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. 卡片变为绿色：**Routing to Vertex**。如果已保存但处于关闭状态，则显示琥珀色的 **Configured · not routing to Vertex**。

更改会在保存它的服务器上立即生效，在其他服务器上最多 30 秒内生效。

## 第 6 步：在模型选择器中验证

集成处于活动状态时，在您的 Vertex 上运行的模型会在聊天模型选择器中的名称旁显示 **Google Cloud 徽标**。将鼠标悬停在徽标上，会提示该模型在您组织的 Vertex AI 帐户上运行。

<div class="mac-window">

![带有 Google Cloud 徽标的模型选择器](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

在没有回退的 **Remap everything** 模式下，选择器**只提供**您的 Vertex 所服务的模型。没有对应模型的模型会由与所选模型不同的模型来回答，因此会被隐藏。

## 计费内容及计费对象

- **LLM 使用量由 Google 计入您的帐户**，而不是由 SecureAI 计费。您会在 Google Cloud 账单中看到这笔费用，并已应用您的折扣和 CUD。
- SecureAI 将在 Vertex 上处理的轮次成本显示为**按标价的估算值**，仅用于分析。这只是参考：它**不包括**您的折扣，因此 Google 的实际金额可能更低。
- 在您的 Vertex 上处理的轮次**不计入每个用户的席位支出上限**，除非您开启 **Apply each seat's spend cap to turns served in your account**。**席位级别**仍然适用：即使模型由您的 Vertex 提供，用户也只能使用其级别或更低级别的模型。
- **Govern BYO** 席位只能使用在您组织自己的基础设施上提供的模型：由您的 Vertex（或其他已连接的云提供商）提供的模型，以及在您的服务器上自托管的模型。其他任何模型都会被拒绝，选择器也不会为其提供 **Auto**。

## 安全与合规

- **加密的凭证，或者没有凭证。** 使用选项 A 时，服务帐户密钥以加密方式（AES-256-GCM）存储，从不返回给浏览器，即使是管理员也看不到；屏幕上只显示该帐户的电子邮件地址。使用选项 B 时不存储任何密钥：SecureAI 向 Google 请求以您的服务帐户身份行事的短期令牌。
- **路径仍受保护。** 每次调用都会经过 SecureAI 的 SMLTP 网关：DLP、每个请求的签名授权令牌，以及可验证的**签名收据**。
- **数据驻留。** 固定区域（例如 `europe-west4`）时，SecureAI 会将每个请求发送到该区域的端点，并应用您组织的驻留策略。Google 在何处处理请求取决于 Google 的数据驻留承诺。
- **失败时关闭。** 如果无法读取配置或无法获取 Google 的令牌，请求会被拒绝；除非您允许回退，否则不会发送到其他提供商。
- **审计。** 保存、测试或断开集成都会记录在活动日志中，包含所更改字段的名称，但从不包含密钥。
- **最小权限可见。** 连接测试会检查连接的身份在项目中还能做什么，并在其拥有 AI 之外的权限时发出警告（请参阅第 4 步中的 **该身份还能做什么**）。
- **最小权限。** `roles/aiplatform.user` 足以进行推理；该集成不需要读取您的 IAM 或账单。

## 断开连接

**Disconnect**（面板底部）会删除配置和已存储的密钥。从那一刻起，**所有流量都会回到 SecureAI 托管的提供商**。您也可以只关闭 **Route traffic to Vertex AI** 开关来暂停路由，同时保留连接。

然后也在 Google Cloud 中移除访问权限：

- **选项 A：** 如果您不再使用该密钥，请**撤销它**（服务账号 → 密钥）。
- **选项 B：** 移除您在自己的服务帐户上授予 SecureAI 服务帐户的 `roles/iam.serviceAccountTokenCreator` 角色（服务账号 → 您的帐户 → **权限**）。

## 故障排除

以下是 **Test connection** 可能显示的原因：

| 原因 | 可能的起因 | 处理方法 |
|------|------------|----------|
| Credential rejected or not usable | JSON 不完整或无效，或密钥已被撤销。无密钥：SecureAI 帐户在您的服务帐户上缺少 `roles/iam.serviceAccountTokenCreator`，或电子邮件地址输入有误 | 重新粘贴完整的 JSON，或创建新密钥。无密钥：运行面板显示的命令，并检查电子邮件地址。 |
| Not authenticated | Google 拒绝了令牌 | 检查服务帐户是否存在且处于活动状态。 |
| Vertex AI API is not enabled on the project | 未完成第 1 步的第 1 项 | 在项目上启用 **Agent Platform API (Vertex AI API)**（`aiplatform.googleapis.com`）。 |
| Missing roles/aiplatform.user | 权限不足 | 在该项目上为服务帐户授予 **Agent Platform User** 角色（`roles/aiplatform.user`）。 |
| Model not available in this location | 该模型在所选区域中不存在，或者它是尚未在 Model Garden 中接受条款的开放模型 | 更换区域或该默认模型；对于开放模型，请在 Model Garden 中接受条款。 |
| Quota exceeded | Vertex 配额已用尽 | 检查项目的配额，或向 Google 申请提高配额。 |
| Google returned an error | Google 端故障 | 重试；如果问题仍然存在，请查看 Google Cloud 的状态。 |
| Blocked by your SMLTP model policy | SecureAI 的策略不允许该模型 | 将该模型添加到允许的策略中。 |
| SMLTP Vertex gateway unreachable / TLS error | SecureAI 基础设施问题 | 请联系支持团队。这与您的 Google 项目无关。 |
| Unexpected error | SecureAI 无法归类的故障 | 重试。如果问题仍然存在，请联系支持团队并提供面板显示的消息。 |
| No default models configured | 四个默认模型均为空，因此没有可测试的内容 | 在 **Default Vertex models** 下至少填写一个，保存后再次测试。 |

用户可能在聊天中看到的错误：

| 代码 | 含义 |
|------|------|
| `SAI-VERTEX-001` | 所选模型没有 Vertex 对应模型，且回退处于关闭状态。请选择其他模型，或允许回退。 |
| `SAI-VERTEX-002` | 无法获取 Google 访问权限（密钥无效或已被撤销，或者在无密钥模式下模拟权限已被移除）。请更新凭证。 |
| `SAI-VERTEX-005` | 无法读取配置，出于安全考虑请求已被拒绝。请在几秒钟后重试。 |

## 当前限制

- 不支持 **Vertex 上的 Claude 和 Mistral**（它们使用不同的 API）。
- **嵌入、重排序、OCR、管理助手、图像生成和实时语音**保留在 SecureAI 托管的提供商上。
- 每个组织**一个 Vertex 项目和位置**。
- 可同时启用的推理提供商数量取决于您的套餐（Scale：1 个，Enterprise：最多 3 个）。请参阅 [Azure AI Foundry — 在您的帐户上推理](/en/integrations/cloud/azure-ai-foundry-inference) 和 [Amazon Bedrock — 在您的帐户上推理](/en/integrations/cloud/aws-bedrock-inference)。
- **Claude Code** 代理直接使用 Anthropic，不经过 Vertex。

## 相关

- [Google Cloud — 发现](/zh/integrations/cloud/gcp-vertex-ai) — 清点项目的代理、模型、身份和成本。
- [Azure AI Foundry — 在您的帐户上推理](/en/integrations/cloud/azure-ai-foundry-inference)
- [Amazon Bedrock — 在您的帐户上推理](/en/integrations/cloud/aws-bedrock-inference)
- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [签名收据](/zh/api/receipts)
