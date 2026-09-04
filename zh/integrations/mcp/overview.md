---
sidebar_position: 1
title: "MCP 连接器概述"
sidebar_label: "概述"
description: "连接模型上下文协议 (MCP) 服务器，为 SecureAI 的助手提供对工具的受控访问"
---
# MCP 连接器

SecureAI 可以连接到 **模型上下文协议 (MCP)** 服务器，以便其助手可以在治理下调用外部工具 - 查询数据库、读取票证、运行云操作。连接器是从内置市场中选择的，并按用户进行配置；每个工具调用仍然通过 SecureAI 的策略和安全层。

连接器在 **管理 → 集成 → MCP**（API 基础 `/api/connectors`）中进行管理。

## 传输和身份验证模式

每个连接器都声明 SecureAI 如何到达它以及它如何进行身份验证。支持三种模式：

|图案|交通 |授权 |示例 |
|--------|---------|------|----------|
|本地流程| `stdio` | API 密钥（在环境中）| Notion、Cloudflare（本地 bin）、Azure (`npx @azure/mcp`)、AWS (`uvx awslabs.aws-api-mcp-server`)、参考服务器（顺序思维、Web 获取、时间）。 |
|远程（令牌）| `streamable_http` | API 密钥/持有者（在环境中）| GitHub 官方 MCP、Google Cloud 系列（BigQuery、Compute、Logging、Vertex AI、Cloud Run、GKE 等）、Microsoft Learn。 |
|远程（OAuth）| `streamable_http` | OAuth 2.1 + PKCE，具有动态客户端注册 | Cloudflare（官方远程 MCP）。请参阅[使用 OAuth 和 DCR 的远程 MCP(/zh/integrations/mcp/remote-oauth-dcr)。 |

一些基于令牌的远程连接器（例如 Google Cloud 系列）还带有 OAuth 流，因此用户可以通过弹出窗口使用自己的 Google OAuth 客户端进行授权，而不是粘贴静态令牌。

## 连接连接器

1. **管理 → 集成 → MCP.**
2. 从市场上选择一个连接器。
3. 提供所需的配置 - API 密钥/令牌，或通过 OAuth 连接器的 OAuth 弹出窗口进行授权。
4. 保存。连接器可供助手的工具刳刨机使用。

## 工具安全

每个连接器都声明**阻止的工具模式** - 破坏性操作（例如 `delete`、`destroy`、`terminate`），即使 MCP 服务器公开 SecureAI 也拒绝调用它们。该护栏是集中实施的，因此连接的工具服务器无法通过助手强制执行破坏性操作。

## 相关

- [带有 OAuth 和 DCR 的远程 MCP(/zh/integrations/mcp/remote-oauth-dcr)
- [AI Gateway — 远程端点](/zh/ai-gateway/remote-endpoints)