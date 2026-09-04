---
sidebar_position: 1
title: "端点代理概述"
sidebar_label: "概述"
description: "SecureAI OS 代理 — 笔记本电脑和服务器的端点 AI 治理、DLP 和出口控制"
---
# 端点代理

SecureAI **OS Agent** 在您的端点（Windows 笔记本电脑、Linux 服务器、macOS 计算机）上运行，并在实际工作发生的地方实施 AI 治理。它发现设备上的 AI/MCP 活动，应用数据丢失和行为保护，并可以根据策略控制或阻止 AI 提供商的出口。

代理队列在 **管理 → 代理注册表 → 操作系统代理** 下进行管理。

## 代理的作用

- **发现设备上的 AI 使用情况** — 安装的 AI SDK/进程、MCP 服务器以及对 AI 提供商的影子网络调用。
- **执行策略** — 监控或阻止 AI 提供程序/模型/应用程序/MCPs，应用行为 AI 监督，并执行出口控制（请参阅 [Egress Enforcement](/zh/agent/egress-enforcement)）。
- **保护数据** — 端点 DLP/PII 检查。
- **响应威胁** — 隔离恶意文件并隔离受感染的端点（请参阅[隔离和队列操作](/zh/agent/quarantine-and-fleet-ops)）。
- **可选择通过 SecureAI 的网关路由开发人员 AI 流量**（请参阅[透明代理](/zh/agent/transparent-proxy)）。

## 设备健康状况和状态

每个注册的设备都会报告健康状态和安全状况：

|信号|价值观 |
|--------|--------|
| **状态** | `healthy`、`stale`（约 5 分钟无心跳）、`enrolled`、`paused`、`revoked` |
| **姿势** | `protected`、`at_risk`、`infected` |
| **风险评分** | 0–100，根据违规、威胁和配置计算得出 |

**操作系统代理**选项卡列出了每个设备及其状态、状态、风险、操作系统/版本、组、活动策略和链接的所有者。展开设备会显示最近的影子网络观察结果、MCP 库存、AI-SDK 进程、策略违规、阻止的连接、隔离项目、威胁和命令历史记录。

## 如何开始

1. **[安装代理](/zh/agent/installation)** 在端点上（Windows 上签名的 MSI；Linux/macOS 上脚本）。
2. 了解**[注册和安装程序包](/zh/agent/enrollment-and-packages)** — 设备如何加入并获取其配置。
3. 配置**[策略和组](/zh/agent/policies-and-groups)**来决定每个设备强制执行的内容。
4. 调整 **[出口强制执行](/zh/agent/egress-enforcement)** 和 **[隔离和队列操作](/zh/agent/quarantine-and-fleet-ops)** 以进行响应。

## 角色

常规管理面板访问权限允许您查看和配置队列。 **破坏性操作** — 隔离、处理/MCP/网络终止、隔离和撤销 — 需要提升的系统 **admin** 角色。请参阅[隔离和舰队行动](/zh/agent/quarantine-and-fleet-ops)。

## 相关

- [AI Discovery & Inventory](/zh/discovery/overview) — 代理是三个发现信号之一。
- [威胁防御](/zh/threat-defense/overview)