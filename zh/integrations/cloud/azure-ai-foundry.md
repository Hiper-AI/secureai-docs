---
sidebar_position: 4
title: "Azure — 发现"
sidebar_label: "Azure — 发现"
description: "连接 Azure 和 Microsoft Entra ID，让 SecureAI 盘点您的 Azure OpenAI 和 Foundry 资源、Foundry 项目与智能体、AI Search、Bot Service，以及每一个非人类身份（服务主体、智能体标识、托管标识、密码、证书和联合凭据）及其权限，同时盘点 RBAC、活动、使用情况和费用。"
---

# Azure — 发现

连接您的 Azure 租户，SecureAI 即可盘点您在 Azure 中的 AI 资源，以及 Microsoft Entra ID 中**每一个非人类身份（NHI）**，并列出每个身份所拥有的角色和权限。

<Info>
此连接**只读**，从不发送提示词。如果您希望让 SecureAI 的 LLM 流量改为运行在您自己的 Foundry 资源上，请参阅 [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)。这是两个相互独立的连接，使用不同的服务主体和权限；您可以在同一个订阅上同时使用两者。
</Info>

## SecureAI 导入什么

对于服务主体能够读取的每个订阅：

- **AI 资源**：每个 Azure AI Services、Azure OpenAI 和其他 Cognitive Services 帐户（Content Safety、Speech、Language、Document Intelligence 等），包括其区域和状态。
- Azure OpenAI 和 Foundry 的**模型部署**，包括其容量以及最近 30 天的使用情况（请求数、输入和输出令牌数，来自 Azure Monitor）。
- **Foundry 项目与智能体**：每个项目中 Foundry Agent Service 的智能体和经典助手，以及它们各自使用的模型。还包括中心（hub）和基于中心的项目（Azure Machine Learning），以及它们的在线终结点和无服务器终结点。
- **Azure AI Search** 和 **Azure Bot Service**。
- 当月按服务划分的**费用**（Cost Management）。
- **活动**：最近 30 天 Cognitive Services 和 Machine Learning 的管理事件（活动日志）。
- **NHI**，列在 [NHI 清单](/zh/discovery/nhi-inventory)中：
  - 企业应用程序的**服务主体**。
  - Microsoft Entra **智能体标识**，即 Foundry 为每个智能体创建的标识（归类为*智能体*）。
  - **托管标识**，包括系统分配和用户分配的托管标识。
  - 应用注册的**客户端密码**和**证书**，及其到期时间。
  - **联合凭据**（工作负载标识联合身份验证）。例如，GitHub Actions 的 OIDC 信任允许该存储库以该应用程序的身份获取令牌，完全无需密码。
  - 每个应用程序的**上次登录**，前提是您的租户提供该报告。
- **每个身份的权限**：其在订阅任意范围（订阅、资源组或资源）内的 Azure RBAC 角色、Microsoft Graph 应用程序权限，以及 Entra 目录角色。
- **RBAC 角色分配**：按名称列出每个角色，以及拥有该角色的用户、组和应用程序。

如果身份拥有以下任意一项，就会被标记为**特权**：

- **Owner**、**Contributor**、**User Access Administrator** 或 **Role Based Access Control Administrator** 角色之一；
- Graph 写入权限，例如 `Application.ReadWrite.All`、`Directory.ReadWrite.All`、`Mail.Send` 或 `Files.ReadWrite.All`；
- 目录管理员角色，例如 Global Administrator 或 Application Administrator。

特权应用程序的密码、证书和联合凭据也会被标记为特权。

SecureAI 不会导入 Microsoft 在每个租户中创建的约 130 个服务主体（Azure Portal、Microsoft Graph 等），也不会导入社交登录连接：它们不是需要由您治理的身份。

## 先决条件

一个带有**客户端密码**的 Microsoft Entra ID **应用注册**（服务主体），以及以下权限：

| 位置 | 权限 | 是否必需 | 作用 |
|------|------|----------|------|
| 订阅 | **Reader** 角色 | 是 | 资源、部署、项目、托管标识、角色分配、使用情况和活动 |
| 订阅 | **Cost Management Reader** 角色 | 建议 | 按服务划分的当月累计费用 |
| Foundry 资源 | **Cognitive Services Data Reader** 角色 | 建议 | 每个 Foundry 项目的智能体 |
| Microsoft Graph | `Application.Read.All`（应用程序权限） | 是 | 服务主体、智能体标识、应用程序、密码、证书、联合凭据和 Graph 权限 |
| Microsoft Graph | `Directory.Read.All`（应用程序权限） | 是 | 目录角色以及每个角色成员的名称 |
| Microsoft Graph | `AuditLog.Read.All`（应用程序权限） | 建议 | 每个应用程序的上次登录 |
| Microsoft Graph | `Application.ReadWrite.All`（应用程序权限） | 仅用于撤销 | 在 SecureAI 中禁用服务主体，并删除密码、证书和联合凭据 |

Graph 权限需要**管理员同意**。要读取您的**所有**订阅，请在每个订阅上分配 **Reader**，或在包含这些订阅的管理组上分配。

<Note>
Foundry 智能体位于项目的数据平面，而不在 Azure Resource Manager 中：**仅有 Reader 无法看到它们**。如果 Foundry 资源上没有 **Cognitive Services Data Reader**（或 **Foundry User**），同步仍然可以进行，但智能体列表会保持为空，SecureAI 会将其报告为缺口。Cognitive Services Data Reader 是允许此操作的最窄角色：仅限数据平面读取。
</Note>

## 步骤 1. 创建服务主体

### 使用 Azure CLI

在 [Azure Cloud Shell](https://shell.azure.com/) 或 `az` CLI 中运行。将 `SUB_ID` 替换为您的订阅；如果使用 Foundry，请将 `MY_RESOURCE` 和 `MY_RG` 替换为您的资源和资源组：

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

步骤 2 会输出您要粘贴到 SecureAI 中的三个值。若要**在 SecureAI 中撤销**，还需要在步骤 3 中添加 `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role`（`Application.ReadWrite.All`），并重新授予同意。

### 使用 Azure 门户

1. 在 [Azure 门户](https://portal.azure.com/)中，转到 **Microsoft Entra ID → 应用注册 → 新注册**，为其命名（例如 `SecureAI Discovery`）并完成注册。
2. 在**概述**中，复制**目录（租户）ID** 和**应用程序（客户端）ID**。
3. 在**证书和密码 → 客户端密码 → 新客户端密码**中创建一个密码，并复制其**值**（只显示一次）。
4. 在 **API 权限 → 添加权限 → Microsoft Graph → 应用程序权限**中，添加 `Application.Read.All`、`Directory.Read.All` 和 `AuditLog.Read.All`（如果您想在 SecureAI 中撤销，还需添加 `Application.ReadWrite.All`）。然后单击**授予管理员同意**。
5. 在**订阅 → 您的订阅 → 访问控制(IAM) → 添加角色分配**中，将 **Reader** 和 **Cost Management Reader** 分配给该应用程序。
6. 在**您的 Foundry 资源 → 访问控制(IAM)** 中，将 **Cognitive Services Data Reader** 分配给该应用程序。

<Info>
Azure 角色最多可能需要 **5 分钟**才能生效，Graph 同意还需要再多几分钟。如果首次同步时，刚刚授予的权限仍显示缺口，请稍候再同步一次。
</Info>

<Warning>
请像对待密码一样对待该密码。SecureAI 会将其**加密**存储，且不会再次显示。密码会**过期**（使用上述命令时为一年后）：请在此之前轮换，否则同步将在当天停止工作。
</Warning>

## 步骤 2. 在 SecureAI 中连接 Azure

1. 转到**管理 → 集成**，按 **Cloud** 筛选，然后在 **Azure — 发现**卡片上单击**连接集成**。
2. 填写各字段：

   | 字段 | 填写内容 |
   |------|----------|
   | **Azure Tenant ID (Directory ID)** | 步骤 1 中的 `tenantId` |
   | **App Registration Client ID** | 步骤 1 中的 `clientId` |
   | **App Registration Client Secret** | 步骤 1 中的 `clientSecret`。加密存储。 |
   | **Subscription ID**（可选） | 将读取范围限制为该订阅。留空：主体拥有 **Reader** 的所有订阅。 |

3. 单击**连接**。保存之前，SecureAI 会通过一次真实读取来测试凭据：如果密码有误，或主体无法读取该订阅，则不会存储任何内容，并且提示信息会说明缺少什么。如果连接成功但缺少某项 Graph 权限，通知中会指出该权限。
4. 使用卡片上的刷新按钮进行**同步**。Azure 同步可能需要几分钟（它会遍历 Azure Resource Manager、Microsoft Graph、Azure Monitor 和 Cost Management）。此后，SecureAI 每 6 小时自动同步一次。

## 步骤 3. 验证

- [Cloud Sensors](/zh/discovery/cloud-sensors) 列出已发现的部署、智能体和服务。单击 Azure 卡片即可打开其 Insights：
  - **Usage & Costs**：使用情况和费用；
  - **Models & Deployments**：部署和智能体；
  - **Identity & Access**：带有角色和 *Privileged* 标记的身份；密码、证书和联合凭据；带有成员的 RBAC 角色；
  - **Audit & Logs**：活动。
- [NHI 清单](/zh/discovery/nhi-inventory)显示服务主体、智能体标识、托管标识、密码、证书和联合凭据，以及它们的权限和是否为特权。

如果同步失败（例如密码已过期），卡片会显示错误，SecureAI 会以退避方式重试，并保留最近一次的清单。

## 覆盖缺口

SecureAI 无法读取的内容不会被悄悄跳过：连接或同步时，通知会指出缺少的权限。

| 范围 | 可解决问题的权限 |
|------|------------------|
| Entra 身份（服务主体、应用注册） | 带管理员同意的 `Application.Read.All` |
| 每个身份的 Graph 权限 | `Application.Read.All` |
| 目录角色 | `Directory.Read.All` |
| 角色分配和托管标识 | 订阅上的 **Reader** |
| Foundry 智能体 | Foundry 资源上的 **Cognitive Services Data Reader** |

部分读取（缺少权限、Azure 未返回的页面、限流）**绝不会从清单中移除智能体或删除身份**：只有当本应显示某项内容的列表被完整返回时，SecureAI 才会将其视为已删除。没有角色分配时，身份的权限保持为*未知*，而不会是“无”。

## 撤销

在 [NHI 清单](/zh/discovery/nhi-inventory)中（挂锁图标），使用 `Application.ReadWrite.All`：

| 身份 | 在 Azure 中发生什么 | 可逆吗？ |
|------|---------------------|----------|
| 服务主体 | 被**禁用**（`accountEnabled: false`） | 是：在 Entra ID 中重新启用 |
| 客户端密码 | 从应用程序中**删除** | 否：创建新的密码 |
| 证书 | 从应用程序中**移除** | 否：重新上传 |
| 联合凭据 | 信任关系被**删除** | 否：重新创建 |
| 用户分配的托管标识 | 资源被**删除**（还需要对其拥有 **Managed Identity Contributor**） | 否 |

保护措施：

- SecureAI **不提供撤销**其自身用于连接的服务主体及其密码的选项，因为那会中断发现。请在 Entra ID 中轮换它们。
- **系统分配**的托管标识不能在 SecureAI 中撤销：其生命周期取决于 Azure 资源。
- **Foundry** 保存在智能体标识*蓝图*上的联合凭据，同样不能在 SecureAI 中撤销：删除它们会使智能体停止工作。
- 自动 NHI 策略（按使用时长或闲置时间撤销）暂不适用于 Azure：撤销需手动进行。

## 断开连接

在**管理 → 集成 → Cloud → Azure — 发现**中，删除该连接会移除已存储的凭据。若要在 Azure 一侧移除 SecureAI 的访问权限，请删除应用注册或其密码。

## 相关

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [Cloud Sensors](/zh/discovery/cloud-sensors)
- [NHI 清单](/zh/discovery/nhi-inventory)
- [Microsoft Entra ID (SSO)](/zh/iam/microsoft-entra-id)
