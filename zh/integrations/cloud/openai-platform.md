---
sidebar_position: 2
title: "开放人工智能平台"
sidebar_label: "开放人工智能平台"
description: "连接 OpenAI 平台，以便 SecureAI 可以清点项目、模型、密钥、使用情况和成本"
---
# OpenAI Platform

连接您的 OpenAI 组织，以便 SecureAI 可以清点项目、模型、成员、API 密钥、服务帐户、支出和审计活动，并显示泄漏或权限过高的密钥以进行补救。

## SecureAI 导入什么

- **项目、模型、成员、角色和组**
- **NHIs** — API 密钥和服务帐户（可撤销 — 请参阅 [NHI 库存](/zh/discovery/nhi-inventory)）
- **支出警报、速率限制、证书和数据保留设置**
- **审核日志**
- **过去 30 天的使用情况和费用**，包括每位用户的支出

## 先决条件

- OpenAI Platform 上的**组织所有者**（或管理员）。
- **管理 API 密钥** (`sk-admin-…`)。需要管理员密钥才能读取组织范围内的项目、成员和使用情况。

## 凭证

|领域 |必填|描述 |
|--------|----------|-------------|
| `adminApiKey` |是的 |组织**admin**密钥，格式`sk-admin-…`。静态时加密。 |
| `projectApiKey` |没有 |一个或多个项目密钥（每行一个），仅旧版 Assistant 清单需要。 |
| `organizationId` |没有 |您的 `org-…` id；当键跨越多个组织时消除歧义。 |

### 在哪里获取管理密钥

1. 以组织所有者身份登录 [OpenAI Platform](https://platform.openai.com/)。
2. 转至 **设置 → 组织 → 管理密钥**。
3. 创建一个新的管理密钥并复制它（显示一次）。

## 连接

1. **管理 → 集成 → 云 → OpenAI Platform → 连接。**
2. 粘贴管理 API 密钥（和可选字段）。
3. **测试**，然后**保存**。
4. **同步**。

## 验证

第一次同步后，打开 [云传感器](/zh/discovery/cloud-sensors) 查看发现的模型/助手，打开 [NHI 库存](/zh/discovery/nhi-inventory) 查看密钥和服务帐户。每个提供商**见解**显示使用情况、成本和每个用户的支出。

## 撤销

OpenAI API 密钥可从 [NHI Inventory](/zh/discovery/nhi-inventory) **撤销**：SecureAI 可以从源头禁用密钥。 （对于服务帐户，OpenAI 身份仅用于监控。）

## 相关

- [云人工智能提供商概述](/zh/integrations/cloud/overview)
- [NHI 库存](/zh/discovery/nhi-inventory)