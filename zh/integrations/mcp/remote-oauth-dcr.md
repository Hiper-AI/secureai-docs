---
sidebar_position: 2
title: "具有 OAuth 和 DCR 的远程 MCP"
sidebar_label: "远程 OAuth 和 DCR"
description: "SecureAI 如何使用 OAuth 2.1、PKCE 和动态客户端注册连接到远程 MCP 服务器"
---
# 使用 OAuth 和 DCR 进行远程 MCP

某些远程 MCP 服务器使用 **OAuth 2.1** 而不是静态 API 令牌来授权访问。 SecureAI 支持这种端到端，包括 **PKCE** 和 **动态客户端注册 (DCR)**，因此您无需预先注册 OAuth 应用程序。参考示例是 **Cloudflare 官方远程 MCP** 连接器 (`cloudflare-remote`)。

## 流程如何运作

1. **动态客户端注册 (RFC 7591)。** 当连接器声明 `registrationUrl` 并且没有静态 `clientId` 时，SecureAI 会在该 URL 将自身注册为公共 PKCE 客户端，并缓存生成的 `client_id`。如果重定向 URI 更改，它会自动重新注册。 （对于提供静态客户端 ID 的连接器，将跳过此步骤。）
2. **授权 + PKCE (S256)。** SecureAI 生成 PKCE 验证器/挑战，使用 `code_challenge` 和 `code_challenge_method=S256` 构建授权 URL，并将管理员/用户重定向到提供商以授予访问权限。
3. **回调。** 提供者重定向回`GET /api/connectors/oauth/callback/:slug`。该路由由不透明的 `state` 参数（与短暂的 10 分钟 PKCE 存储相匹配）而不是会话来保护，因此它不需要身份验证中间件。
4. **令牌交换和存储。** SecureAI 将代码（与 PKCE 验证器）交换为令牌并存储它们 **每个用户**。然后，访问令牌被注入到 MCP 传输中（例如，作为 `BEARER_TOKEN`）以供该用户的工具调用。

## 连接 OAuth MCP 连接器

1. **管理 → 集成 → MCP** 并选择 OAuth 连接器（例如 Cloudflare 官方远程 MCP）。
2. 单击 **授权** — 弹出窗口将打开提供商的同意屏幕。
3. 批准所请求的范围。
4. 成功后，您将被重定向回来，并且连接器显示为已连接。

## 注释

- **每用户令牌。** 每个用户单独授权；工具调用使用该用户自己的授权运行，而不是共享凭据。
- **这些连接器 (`pkceRequired: true`) 需要 PKCE**，因此不会为公共客户端存储客户端密钥。
- **静态客户端连接器。** 如果您的组织预先注册了 OAuth 客户端，请提供其客户端 ID/秘密，SecureAI 将使用它而不是 DCR。

## 相关

- [MCP 连接器概述](/zh/integrations/mcp/overview)
- [AI Gateway — 远程端点](/zh/ai-gateway/remote-endpoints)