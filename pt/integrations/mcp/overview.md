---
sidebar_position: 1
title: "Conectores MCP (Model Context Protocol)"
sidebar_label: "Conectores MCP"
description: "Conecte servidores Model Context Protocol (MCP) para fornecer aos assistentes da SecureAI acesso controlado às ferramentas"
---

# MCP Conectores

SecureAI pode se conectar a servidores **Model Context Protocol (MCP)** para que seus assistentes possam chamar ferramentas externas - consultando bancos de dados, leitura de tickets, execução de operações em nuvem - sob governança. Os conectores são escolhidos em um mercado integrado e configurados por usuário; cada chamada de ferramenta ainda passa pela camada de política e segurança da SecureAI.

Os conectores são gerenciados em **Admin → Integrações → MCP** (API base `/api/connectors`).

## Padrões de transporte e autenticação

Cada conector declara como o SecureAI o alcança e como ele se autentica. Três padrões são suportados:

| Padrão | Transporte | Autenticação | Exemplos |
|--------|-----------|------|----------|
| Processo local | `stdio` | Chave de API (em env) | Notion, Cloudflare (bin local), Azure (`npx @azure/mcp`), AWS (`uvx awslabs.aws-api-mcp-server`), servidores de referência (Sequential Thinking, Web Fetch, Time). |
| Remoto (token) | `streamable_http` | Chave API/portador (em env) | Oficial do GitHub MCP, a família Google Cloud (BigQuery, Compute, Logging, Vertex AI, Cloud Run, GKE,…), Microsoft Learn. |
| Remoto (OAuth) | `streamable_http` | OAuth 2.1 + PKCE, com registro dinâmico de cliente | Cloudflare (remoto oficial MCP). Consulte [Remoto MCP com OAuth e DCR](/pt/integrations/mcp/remote-oauth-dcr). |

Alguns conectores remotos baseados em token (por exemplo, a família Google Cloud) também carregam um fluxo OAuth para que um usuário possa autorizar com seu próprio cliente Google OAuth por meio de um pop-up, em vez de colar um token estático.

## Conectando um conector

1. **Administrador → Integrações → MCP.**
2. Escolha um conector no mercado.
3. Forneça a configuração necessária – uma chave/token de API ou autorize por meio do pop-up OAuth para conectores OAuth.
4. Salve. O conector fica disponível para o roteador de ferramentas do assistente.

## Segurança da ferramenta

Cada conector declara **padrões de ferramentas bloqueadas** — operações destrutivas (por exemplo, `delete`, `destroy`, `terminate`) que SecureAI se recusa a invocar mesmo que o servidor MCP os exponha. Essa proteção é aplicada centralmente, de modo que um servidor de ferramentas conectado não pode ser coagido a uma ação destrutiva por meio do assistente.

## Relacionado

- [Remoto MCP com OAuth e DCR](/pt/integrations/mcp/remote-oauth-dcr)
- [AI Gateway — Endpoints Remotos](/pt/ai-gateway/remote-endpoints)