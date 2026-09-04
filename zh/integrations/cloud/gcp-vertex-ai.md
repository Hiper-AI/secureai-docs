---
sidebar_position: 6
title: "谷歌顶点人工智能"
sidebar_label: "谷歌顶点人工智能"
description: "连接 Google Vertex AI，以便 SecureAI 可以清点代理、模型、服务帐户、IAM、使用情况和成本"
---
# 谷歌顶点人工智能

连接您的 Google Cloud 项目，以便 SecureAI 可以清点 Vertex AI 代理、端点和模型，以及围绕它们的服务帐户、IAM 绑定、审核日志、使用情况和计费。

## SecureAI 导入什么

- **Vertex AI 代理、端点和模型**
- **NHIs** — 服务帐户、服务帐户密钥和 API 密钥（可撤销 — 请参阅 [NHI 库存](/zh/discovery/nhi-inventory)）
- **IAM** 角色绑定
- **云审计日志**
- 过去 30 天的**请求、令牌和费用**（来自 BigQuery 账单导出的实际值或估计值）

## 先决条件

- 具有 JSON 密钥的 **服务帐户**，授予项目读取角色：
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - BigQuery 角色（例如 `roles/bigquery.dataViewer`、`roles/bigquery.jobUser`）（如果您针对 **实际** 成本使用账单导出）。
  - *（可选）* 密钥/服务帐户管理员角色（如果您希望 SecureAI 在源处撤销身份）。

## 凭证

|领域 |必填|描述 |
|--------|----------|-------------|
| `projectId` |是的 | GCP 项目 ID。 |
| `location` |是的 |顶点区域（例如 `us-central1`）。 |
| `serviceAccountJson` |是的 |服务帐户密钥 JSON。静态时加密。 |
| `billingExportTable` |没有 |用于实际计费的 BigQuery 表（例如 `dataset.gcp_billing_export_v1_XXXX`）。 |
| `billingProjectId` |没有 |托管计费导出的项目（如果不同）。 |

### 哪里可以获得它们

1. 在 [Google Cloud 控制台](https://console.cloud.google.com/) 中，转到 **IAM & 管理 → 服务帐户 → 创建服务帐户**。
2. 授予上面列出的角色。
3. 在 **Keys → 添加密钥 → JSON** 下，下载密钥文件。
4. 将 **整个** JSON 粘贴到 `serviceAccountJson` 字段中。

## 连接

1. **管理 → 集成 → 云 → Google Vertex AI → 连接。**
2. 输入项目、位置和服务帐户 JSON（以及可选的计费字段）。
3. **测试**，然后**保存**。
4. **同步**。

## 验证

打开 [Cloud Sensors](/zh/discovery/cloud-sensors) 以获取已发现的代理/端点/模型，并打开 [NHI Inventory](/zh/discovery/nhi-inventory) 以获取服务帐户和密钥。见解显示 IAM 绑定、使用情况和成本。

## 撤销

当连接器具有可选密钥/SA 管理员角色时，GCP 服务帐户、SA 密钥和 API 密钥可从 [NHI Inventory](/zh/discovery/nhi-inventory) **撤销**。

## 相关

- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [Google Workspace SSO](/zh/iam/google-workspace)
- [NHI 库存](/zh/discovery/nhi-inventory)