---
sidebar_position: 1
title: "云人工智能提供商概述"
sidebar_label: "概述"
description: "连接您的 OpenAI、Anthropic、Azure、AWS 和 GCP AI 平台，以便 SecureAI 可以清点代理、模型、身份、使用情况和成本"
---
# 云人工智能提供商

云 AI 提供商连接器可让 SecureAI 访问您的组织已使用的 AI 平台 — **OpenAI Platform、Anthropic Console、Azure AI Foundry 和 Google Vertex AI** — 并自动清点其中运行的所有内容。提供商端无需部署Agent或SDK； SecureAI 使用您提供的主要读取凭据轮询每个提供商的管理 API。

连接后，连接器会发现并持续同步：

- 在平台上运行的 **代理、模型和部署** → 显示在 [云传感器](/zh/discovery/cloud-sensors) 中。
- **非人类身份 (NHIs)** — API 密钥、服务帐户和（如果支持）BYOK 密钥 → 显示在 [NHI 库存](/zh/discovery/nhi-inventory) 中，具有阻止/撤销控件。
- **过去 30 天的使用情况、代币和成本**。
- **治理信号** — IAM/RBAC 绑定、支出限制和审计日志，显示在每个提供商的见解中。

## 设置循环

每个提供商都遵循相同的四个步骤：

1. **打开管理→集成**并选择**云**类别。
2. **连接** 提供商卡并输入其凭据（请参阅每个提供商的页面）。
3. **测试**连接以验证凭据。
4. **同步** — 第一次同步运行完全导入；后续同步是增量的并且也按计划运行。

<Info>
**事物出现的地方**

连接器**设置**位于**管理→集成**中。它生成的 **清单** 出现在 **管理 → 代理注册表**中：在 [Cloud Sensors](/zh/discovery/cloud-sensors) 下发现的代理/模型，并在 [NHI Inventory](/zh/discovery/nhi-inventory) 下发现的身份。您可以从任一位置重新运行同步。
</Info>

## 选择凭证

尽可能使用**只读/查看者**凭据 - SecureAI 只需要*读取*您的库存即可构建图片。一些可选功能（撤销泄露的密钥、创建支出警报）需要额外的写入权限；每个提供程序页面都会明确调用这些内容，并且它们始终是可选的。

您输入的所有机密（客户端机密、服务帐户 JSON、管理 API 密钥）均**静态加密**。

## 提供商指南

|供应商|凭证类型 |
|----------|-----------------|
| [OpenAI Platform](/zh/integrations/cloud/openai-platform) |组织管理员 API 密钥 |
| [Anthropic Console](/zh/integrations/cloud/anthropic-console) |管理 API 密钥（+ 可选工作区/合规性密钥）|
| [Azure AI Foundry](/zh/integrations/cloud/azure-ai-foundry) | Entra 服务主体（租户/客户端/秘密）|
| [Google Vertex AI](/zh/integrations/cloud/gcp-vertex-ai) |服务帐户 JSON |

## 相关

- [云传感器](/zh/discovery/cloud-sensors) — 已发现的代理/模型库存。
- [NHI Inventory](/zh/discovery/nhi-inventory) — 发现的身份清单和撤销控制。
- [AI发现与库存概述](/zh/discovery/overview)