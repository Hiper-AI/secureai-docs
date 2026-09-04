---
sidebar_position: 5
title: "代理登记处"
sidebar_label: "代理登记处"
description: "管理您的逻辑 AI 代理和聊天机器人 — 所有者、目的、自主级别、风险和绑定"
---
# 代理注册

**代理注册表**（管理→代理注册表→**人工智能代理**）是您的**逻辑**人工智能代理和聊天机器人（您的组织构建和运行的应用程序和助手）的治理清单。它记录了管理每个设备所需的元数据：谁拥有它、它的用途、它的自治程度以及它与什么相关。

<Info>
**不是端点舰队**

代理注册表是关于*逻辑*人工智能代理（支持聊天机器人，内部副驾驶）。它与 **OS Agents** 队列不同 - 安装在端点上的 SecureAI 软件，记录在 [Endpoint Agent](/zh/agent/overview) 下。
</Info>

## 每个代理记录的内容

|领域 |描述 |
|--------|-------------|
| **所有者** |负责任的用户/团队。 |
| **目的** |代理做什么。 |
| **自治** | **L1–L3** 级别，从辅助到完全自主。 |
| **风险** |治理风险评级。 |
| **绑定** |连接的 MCP 服务器和数据集/知识库。 |
| **监控** |对于聊天机器人，监控/提示屏蔽配置。 |

## 使用注册表

- **导入**代理以引导库存。
- 审查代理、其工具和数据之间的**关系**。
- **应用建议的自治** — 接受代理的建议自治级别。
- 注册聊天机器人进行监控；通过 [Prompt Shield API](/zh/api/threat-defense/prompt-shield) 首次看到的聊天机器人会在此处自动注册为 `observed` 供您审核。

## 相关

- [Endpoint Agent](/zh/agent/overview) — 操作系统级代理队列（与此不同）。
- [NHI Inventory](/zh/discovery/nhi-inventory) — 代理进行身份验证的身份。
- [Prompt Shield API](/zh/api/threat-defense/prompt-shield) — 自动注册聊天机器人。
- [AI发现与库存概述](/zh/discovery/overview)