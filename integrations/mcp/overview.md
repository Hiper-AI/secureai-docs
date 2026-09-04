---
sidebar_position: 1
title: "Conectores MCP (Model Context Protocol)"
sidebar_label: "Conectores MCP"
description: "Conecte servidores Model Context Protocol (MCP) para brindar a los asistentes de SecureAI acceso gobernado a las herramientas"
---

# Conectores MCP

SecureAI puede conectarse a servidores **Model Context Protocol (MCP)** para que sus asistentes puedan llamar a herramientas externas (consultar bases de datos, leer tickets, ejecutar operaciones en la nube) bajo control. Los conectores se eligen de un mercado integrado y se configuran por usuario; Cada llamada a la herramienta aún pasa por la capa de política y seguridad de SecureAI.

Los conectores se administran en **Admin → Integraciones → MCP** (base de API `/api/connectors`).

## Patrones de transporte y autenticación

Cada conector declara cómo llega SecureAI a él y cómo se autentica. Se admiten tres patrones:

| Patrón | Transporte | Autenticación | Ejemplos |
|---------|-----------|------|----------|
| Proceso local | `stdio` | Clave API (en env) | Notion, Cloudflare (bin local), Azure (`npx @azure/mcp`), AWS (`uvx awslabs.aws-api-mcp-server`), servidores de referencia (Sequential Thinking, Web Fetch, Time). |
| Remoto (token) | `streamable_http` | Clave API/portador (en env) | MCP oficial de GitHub, la familia Google Cloud (BigQuery, Compute, Logging, Vertex AI, Cloud Run, GKE,…), Microsoft Learn. |
| Remoto (OAuth) | `streamable_http` | OAuth 2.1 + PKCE, con Registro Dinámico de Cliente | Cloudflare (MCP remoto oficial). Consulte [MCP remoto con OAuth y DCR](/integrations/mcp/remote-oauth-dcr). |

Algunos conectores remotos basados en tokens (por ejemplo, la familia Google Cloud) también llevan un flujo OAuth para que un usuario pueda autorizar con su propio cliente Google OAuth a través de una ventana emergente, en lugar de pegar un token estático.

## Conexión de un conector

1. **Administrador → Integraciones → MCP.**
2. Elija un conector del mercado.
3. Proporcione la configuración requerida: una clave/token de API, o autorice a través de la ventana emergente de OAuth para conectores OAuth.
4. Guardar. El conector queda disponible para el enrutador de herramientas del asistente.

## Seguridad de las herramientas

Cada conector declara **patrones de herramientas bloqueados**: operaciones destructivas (por ejemplo, `delete`, `destroy`, `terminate`) que SecureAI se niega a invocar incluso si el servidor MCP las expone. Esta barrera de seguridad se aplica de forma centralizada, por lo que un servidor de herramientas conectado no puede ser obligado a realizar una acción destructiva a través del asistente.

## Relacionado

- [MCP remoto con OAuth y DCR](/integrations/mcp/remote-oauth-dcr)
- [AI Gateway — Extremos remotos](/ai-gateway/remote-endpoints)