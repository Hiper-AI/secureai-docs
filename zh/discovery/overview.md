---
sidebar_position: 1
title: "人工智能发现和库存概述"
sidebar_label: "概述"
description: "SecureAI 如何发现并清点整个组织中的每个 AI 代理、模型、身份和影子 AI 源"
---
# 人工智能发现和库存

SecureAI 在您的组织中构建一个单一的、持续更新的 AI 清单——您运行的代理和模型、它们背后的身份以及您不知道的影子 AI。它通过**三个互补的发现信号**来实现这一点，所有这些信号都出现在**管理→代理注册表**下。

## 三个信号

|信号|看到 |喂养者 |
|--------|------|--------|
| **云 API** | AI 平台内的代理、模型、部署和身份。 | [云 AI 提供商](/zh/integrations/cloud/overview) 连接器 → [云传感器](/zh/discovery/cloud-sensors) |
| **网络/CASB** |调用 LLM API 的公司源 IP，未安装代理。 | [CASB / SWG](/zh/integrations/casb/overview) 连接器 → [网络资源](/zh/discovery/network-sources) |
| **端点代理** |托管笔记本电脑和服务器上的 AI/MCP 活动。 | [操作系统代理](/zh/agent/概述) |

在所有信号中发现的身份都会汇总到[NHI库存中，并且您管理的逻辑代理/聊天机器人位于[代理注册表](/zh/discovery/agent-registry)中。

## 库存选项卡

在**管理 → 代理注册表**下，您会发现：

- **[云传感器](/zh/discovery/cloud-sensors)** — 云发现的代理和模型。
- **[网络源](/zh/discovery/network-sources)** — 在 CASB/SWG 日志中找到的影子 AI 源。
- **[NHI Inventory](/zh/discovery/nhi-inventory)** — 具有阻止/撤销控制的非人类身份（密钥、服务帐户）。
- **[代理注册表](/zh/discovery/agent-registry)** — 逻辑 AI 代理和聊天机器人的治理元数据。

## 为什么这很重要

你无法管理你看不到的东西。 Discovery 为您提供分母：每个模型端点、每个密钥、每个涉及 AI 的设备或工作负载 - 因此策略、成本控制和事件响应适用于您的“整个”资产，而不仅仅是已声明的部分。

## 相关

- [云人工智能提供商](/zh/integrations/cloud/overview)
- [CASB 和网络 (SWG)](/zh/integrations/casb/overview)
- [Endpoint Agent](/zh/agent/概述)