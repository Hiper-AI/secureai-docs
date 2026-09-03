---
sidebar_position: 2
title: "Remote MCP with OAuth & DCR"
sidebar_label: "Remote OAuth & DCR"
description: "How SecureAI connects to remote MCP servers using OAuth 2.1, PKCE, and Dynamic Client Registration"
---



# Remote MCP with OAuth & DCR

Some remote MCP servers authorize access with **OAuth 2.1** rather than a static API token. SecureAI supports this end to end, including **PKCE** and **Dynamic Client Registration (DCR)** so you don't have to pre-register an OAuth application. The reference example is the **Cloudflare Official Remote MCP** connector (`cloudflare-remote`).

## How the flow works

1. **Dynamic Client Registration (RFC 7591).** When a connector declares a `registrationUrl` and has no static `clientId`, SecureAI registers itself as a public PKCE client at that URL and caches the resulting `client_id`. If the redirect URI changes, it re-registers automatically. (For connectors that ship a static client id, this step is skipped.)
2. **Authorization + PKCE (S256).** SecureAI generates a PKCE verifier/challenge, builds the authorization URL with `code_challenge` and `code_challenge_method=S256`, and redirects the admin/user to the provider to grant access.
3. **Callback.** The provider redirects back to `GET /api/connectors/oauth/callback/:slug`. This route is secured by the opaque `state` parameter (matched against a short-lived, 10-minute PKCE store) rather than a session, so it needs no auth middleware.
4. **Token exchange & storage.** SecureAI exchanges the code (with the PKCE verifier) for tokens and stores them **per user**. The access token is then injected into the MCP transport (e.g. as `BEARER_TOKEN`) for that user's tool calls.

## Connecting an OAuth MCP connector

1. **Admin → Integrations → MCP** and pick an OAuth connector (e.g. Cloudflare Official Remote MCP).
2. Click **Authorize** — a popup opens the provider's consent screen.
3. Approve the requested scopes.
4. On success you're redirected back and the connector shows as connected.

## Notes

- **Per-user tokens.** Each user authorizes individually; tool calls run with that user's own grant, not a shared credential.
- **PKCE is required** for these connectors (`pkceRequired: true`), so no client secret is stored for public clients.
- **Static-client connectors.** If your organization pre-registers an OAuth client, provide its client id/secret and SecureAI uses it instead of DCR.

## Related

- [MCP Connectors Overview](/en/integrations/mcp/overview)
- [AI Gateway — Remote Endpoints](/en/ai-gateway/remote-endpoints)
