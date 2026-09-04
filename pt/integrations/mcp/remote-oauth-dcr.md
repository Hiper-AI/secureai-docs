---
sidebar_position: 2
title: "MCP Remoto com OAuth e DCR"
sidebar_label: "OAuth Remoto e DCR"
description: "Como o SecureAI se conecta a servidores MCP remotos usando OAuth 2.1, PKCE e Dynamic Client Registration"
---

# Remoto MCP com OAuth e DCR

Alguns servidores MCP remotos autorizam o acesso com **OAuth 2.1** em vez de um token de API estático. SecureAI oferece suporte completo, incluindo **PKCE** e **Dynamic Client Registration (DCR)** para que você não precise pré-registrar um aplicativo OAuth. O exemplo de referência é o conector **Cloudflare Official Remote MCP** (`cloudflare-remote`).

## Como funciona o fluxo

1. **Registro de cliente dinâmico (RFC 7591).** Quando um conector declara um `registrationUrl` e não tem [[XINL2] estático], o SecureAI se registra como um cliente PKCE público nessa URL e armazena em cache o `client_id` resultante. Se o URI de redirecionamento for alterado, ele será registrado novamente automaticamente. (Para conectores que enviam um ID de cliente estático, esta etapa é ignorada.)
2. **Autorização + PKCE (S256).** SecureAI gera um verificador/desafio PKCE, constrói o URL de autorização com `code_challenge` e `code_challenge_method=S256` e redireciona o administrador/usuário ao provedor para conceder acesso.
3. **Callback.** O provedor redireciona de volta para `GET /api/connectors/oauth/callback/:slug`. Esta rota é protegida pelo parâmetro opaco `state` (comparado com um armazenamento PKCE de curta duração de 10 minutos) em vez de uma sessão, portanto, não precisa de middleware de autenticação.
4. **Troca e armazenamento de tokens.** SecureAI troca o código (com o verificador PKCE) por tokens e os armazena **por usuário**. O token de acesso é então injetado no transporte MCP (por exemplo, como `BEARER_TOKEN`) para as chamadas de ferramenta desse usuário.

## Conectando um conector OAuth MCP

1. **Admin → Integrações → MCP** e escolha um conector OAuth (por exemplo, Cloudflare Official Remote MCP).
2. Clique em **Autorizar** — um pop-up abre a tela de consentimento do provedor.
3. Aprove os escopos solicitados.
4. Em caso de sucesso, você será redirecionado de volta e o conector será exibido como conectado.

## Notas

- **Tokens por usuário.** Cada usuário autoriza individualmente; as chamadas de ferramenta são executadas com a concessão do próprio usuário, não com uma credencial compartilhada.
- **PKCE é necessário** para esses conectores (`pkceRequired: true`), portanto, nenhum segredo do cliente é armazenado para clientes públicos.
- **Conectores de cliente estático.** Se sua organização pré-registrar um cliente OAuth, forneça seu ID/segredo de cliente e o SecureAI o usará em vez de DCR.

## Relacionado

- [MCP Visão geral dos conectores](/pt/integrations/mcp/overview)
- [AI Gateway — Endpoints Remotos](/pt/ai-gateway/remote-endpoints)