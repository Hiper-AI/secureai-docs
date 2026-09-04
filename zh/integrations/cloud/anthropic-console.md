---
sidebar_position: 3
title: "人择控制台"
sidebar_label: "人择控制台"
description: "连接 Anthropic 控制台，以便 SecureAI 可以清点工作空间、密钥、使用情况、成本和审核活动"
---
# Anthropic Console

连接您的 Anthropic 组织，以便 SecureAI 可以清点工作空间、API 密钥、服务帐户、支出限制以及（在企业上）审核日志和 Claude Code 分析。

## SecureAI 导入什么

- **工作空间**、使用情况和成本
- **NHIs** — API 密钥、服务帐户和 BYOK 密钥（可撤销 — 请参阅 [NHI 库存](/zh/discovery/nhi-inventory)）
- **支出限制**
- **审核日志**（企业/合规性 API）
- **Claude Code 分析**

## 先决条件

- Anthropic Console 上的 **管理员**。
- **管理 API 密钥** (`sk-ant-admin…`)。
- *（可选）* 用于解锁代理平台数据的 **工作区密钥**，以及用于解锁审核日志的 **合规性 API 密钥**（企业版）。

## 凭证

|领域 |必填|描述 |
|--------|----------|-------------|
| `adminApiKey` |是的 |组织管理密钥，格式 `sk-ant-admin…`。静态时加密。 |
| `apiKey` |没有 |工作区密钥 — 解锁代理平台库存。 |
| `complianceApiKey` |没有 |企业合规性 API 密钥 — 解锁审核日志。 |

### 在哪里获取管理密钥

1. 以管理员身份登录 [Anthropic Console](https://console.anthropic.com/)。
2. 转至 **设置 → 管理密钥**（组织级别）。
3. 创建管理密钥并复制它。

## 连接

1. **管理 → 集成 → 云 → Anthropic Console → 连接。**
2. 粘贴管理密钥（以及任何可选密钥）。
3. **测试**，然后**保存**。
4. **同步**。

## 验证

打开已发现的工作区/代理的 [Cloud Sensors](/zh/discovery/cloud-sensors) 和密钥和服务帐户的 [NHI Inventory](/zh/discovery/nhi-inventory)。见解显示使用情况、成本和支出限制。

## 撤销

Anthropic API 密钥、服务帐户和 BYOK 密钥可从 [NHI 库存](/zh/discovery/nhi-inventory) **撤销**。

## 相关

- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [NHI 库存](/zh/discovery/nhi-inventory)