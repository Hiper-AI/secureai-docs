---
sidebar_position: 2
title: "思科保护伞"
sidebar_label: "思科保护伞"
description: "通过报告 API v2 从 Cisco Umbrella DNS 活动检测影子 AI"
---
# Cisco Umbrella

连接 Cisco Umbrella，以便 SecureAI 可以使用 Umbrella 的 **Reporting API v2** 检测哪些公司来源正在解析 LLM/AI 域。 Umbrella 是 DNS 层源：它确认设备“解析”了 AI 域（不是完整的 TLS 有效负载），这正是影子 AI 发现所需要的。

SecureAI 运行两次以实现最大覆盖范围：

1. 已知 LLM/AI 领域的精选列表。
2. Umbrella 的 **内容类别 `212`（“生成式 AI”）**，因此新流行的 AI 服务甚至在进入策划列表之前就已被捕获。

## 先决条件

- 一个包含 **Reporting API** 和 DNS 活动日志的 Umbrella 软件包。
- **Umbrella API 凭证**（API 密钥 + 秘密）和您的 **组织 ID**。

## 凭证

|领域 |必填|描述 |
|--------|----------|-------------|
| `apiKey` |是的 |伞式报告 API 密钥。 |
| `apiSecret` |是的 |伞式报告 API 秘密。静态时加密。 |
| `orgId` |是的 |您的伞式组织 ID。 |

### 哪里可以获得它们

1. 登录 [Umbrella 仪表板](https://dashboard.umbrella.com/)。
2. 转到 **管理 → API 密钥** 并创建一个具有 **报告** 范围的密钥。复制密钥和秘密（显示一次）。
3. 您的 **组织 ID** 是仪表板 URL (`.../o/<orgId>/#/...`) 中的数字 ID。

SecureAI 使用 `POST https://api.umbrella.com/auth/v2/token`（基本 `apiKey:apiSecret`、`client_credentials`）进行身份验证并读取 `GET /reports/v2/activity/dns`。

## 连接

1. **管理 → 集成 → 网络 → Cisco Umbrella → 连接。**
2. 输入 API 密钥、密码和组织 ID。
3. **测试**，然后**保存**。
4. **同步** — 第一次同步会在后台回填最近的 DNS 活动。

## 注释

- Umbrella 是 **DNS 层**：匹配确认域解析，而不是完成的 API 调用。它非常适合广度（Umbrella 后面的每个设备），但不携带请求有效负载。
- 如果 Umbrella 出口必须通过代理，请在 SecureAI 后端设置 `UMBRELLA_PROXY_URL`（或标准 `HTTPS_PROXY`）。

## 验证

第一次同步后，打开 [网络源](/zh/discovery/network-sources) — 解析 AI 域的源会显示其提供商、调用计数和严重性。

## 相关

- [CASB & 网络概述](/zh/integrations/casb/overview)
- [网络资源](/zh/discovery/network-sources)