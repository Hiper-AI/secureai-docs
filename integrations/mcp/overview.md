---
sidebar_position: 1
title: MCP Connectors Overview
sidebar_label: Overview
description: "Connect Model Context Protocol (MCP) servers to give SecureAI's assistants governed access to tools"
---

# MCP Connectors

SecureAI can connect to **Model Context Protocol (MCP)** servers so its assistants can call external tools — querying databases, reading tickets, running cloud operations — under governance. Connectors are chosen from a built-in marketplace and configured per user; every tool call still passes through SecureAI's policy and safety layer.

Connectors are managed in **Admin → Integrations → MCP** (API base `/api/connectors`).

## Transport & authentication patterns

Each connector declares how SecureAI reaches it and how it authenticates. Three patterns are supported:

| Pattern | Transport | Auth | Examples |
|---------|-----------|------|----------|
| Local process | `stdio` | API key (in env) | Notion, Cloudflare (local bin), Azure (`npx @azure/mcp`), AWS (`uvx awslabs.aws-api-mcp-server`), reference servers (Sequential Thinking, Web Fetch, Time). |
| Remote (token) | `streamable_http` | API key / bearer (in env) | GitHub official MCP, the Google Cloud family (BigQuery, Compute, Logging, Vertex AI, Cloud Run, GKE, …), Microsoft Learn. |
| Remote (OAuth) | `streamable_http` | OAuth 2.1 + PKCE, with Dynamic Client Registration | Cloudflare (Official Remote MCP). See [Remote MCP with OAuth & DCR](/integrations/mcp/remote-oauth-dcr). |

Some token-based remote connectors (e.g. the Google Cloud family) also carry an OAuth flow so a user can authorize with their own Google OAuth client via a popup, rather than pasting a static token.

## Connecting a connector

1. **Admin → Integrations → MCP.**
2. Pick a connector from the marketplace.
3. Provide its required configuration — an API key/token, or authorize via the OAuth popup for OAuth connectors.
4. Save. The connector becomes available to the assistant's tool router.

## Tool safety

Every connector declares **blocked tool patterns** — destructive operations (e.g. `delete`, `destroy`, `terminate`) that SecureAI refuses to invoke even if the MCP server exposes them. This guardrail is enforced centrally, so a connected tool server cannot be coerced into a destructive action through the assistant.

## Related

- [Remote MCP with OAuth & DCR](/integrations/mcp/remote-oauth-dcr)
- [AI Gateway — Remote Endpoints](/ai-gateway/remote-endpoints)
