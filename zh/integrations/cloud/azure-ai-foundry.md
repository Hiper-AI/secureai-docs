---
sidebar_position: 4
title: "Azure 人工智能铸造厂"
sidebar_label: "Azure 人工智能铸造厂"
description: "连接 Azure AI Foundry / Azure OpenAI，以便 SecureAI 可以清点代理、模型、身份、RBAC、使用情况和成本"
---
# Azure AI Foundry

连接您的 Azure 租户，以便 SecureAI 可以清点 Azure OpenAI / AI Foundry 代理、AI 搜索、机器人服务和 ML 端点，以及管理它们的 Entra 身份和 RBAC。

## SecureAI 导入什么

- **Azure OpenAI / AI Foundry 代理、AI 搜索、机器人服务和 ML 端点**
- **NHIs** — Entra 服务主体、应用程序机密和证书以及托管身份（可撤销 — 请参阅 [NHI Inventory](/zh/discovery/nhi-inventory)）
- **Azure RBAC** 角色分配
- **活动日志**
- **过去 30 天的使用情况、代币和支出**

## 先决条件

- 带有客户端密钥的 **Entra ID (Azure AD) 应用程序注册**（服务主体）。
- **Microsoft Graph 应用程序权限** 经管理员同意授予：
  - `Application.Read.All`、`Directory.Read.All`、`AuditLog.Read.All`（读取）。
  - `Application.ReadWrite.All` — **仅**如果您希望 SecureAI 在源处撤销身份。
- 服务主体在相关订阅/资源组上分配了 **Reader** 角色。

## 凭证

|领域 |必填|描述 |
|--------|----------|-------------|
| `tenantId` |是的 |目录（租户）ID。 |
| `clientId` |是的 |应用程序注册的应用程序（客户端）ID。 |
| `clientSecret` |是的 |客户秘密。静态时加密。 |
| `subscriptionId` |没有 |特定订阅的范围发现。 |

SecureAI 通过 OAuth2（客户端凭证服务主体流程）进行身份验证。

### 哪里可以获得它们

1. 在 [Azure 门户](https://portal.azure.com/) 中，转到 **Microsoft Entra ID → 应用程序注册 → 新注册**。
2. 从应用程序的概述中复制 **目录（租户）ID** 和 **应用程序（客户端）ID**。
3. 在 **证书和机密** 下，创建 **客户端机密** 并复制其值。
4. 在 **API 权限** 下，添加上面的 Microsoft Graph 权限并 **授予管理员同意**。
5. 为应用程序分配目标订阅上的 **Reader** 角色（**订阅 → 访问控制 (IAM)**）。

## 连接

1. **管理 → 集成 → 云 → Azure AI Foundry → 连接。**
2. 输入租户、客户端、密钥（和可选订阅）。
3. **测试**，然后**保存**。
4. **同步**（Azure 同步可能需要几分钟 - 多服务 + 图形 + 活动日志扫描）。

## 验证

打开 [Cloud Sensors](/zh/discovery/cloud-sensors) 以获取已发现的代理/端点，并打开 [NHI Inventory](/zh/discovery/nhi-inventory) 以获取服务主体、机密和托管身份。见解显示 RBAC、使用情况和支出。

## 撤销

Entra 服务主体、应用程序机密/证书和托管身份可通过 Microsoft Graph 从 [NHI Inventory](/zh/discovery/nhi-inventory) **撤销** — 这需要上面的 `Application.ReadWrite.All` 权限。

## 相关

- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [Microsoft Entra ID SSO](/zh/iam/microsoft-entra-id)
- [NHI 库存](/zh/discovery/nhi-inventory)