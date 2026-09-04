---
sidebar_position: 2
title: "MCP Remoto con OAuth y DCR"
sidebar_label: "OAuth Remoto y DCR"
description: "Cómo se conecta SecureAI a servidores MCP remotos mediante OAuth 2.1, PKCE y registro dinámico de cliente"
---

# MCP remoto con OAuth y DCR

Algunos servidores MCP remotos autorizan el acceso con **OAuth 2.1** en lugar de un token API estático. SecureAI admite esto de un extremo a otro, incluidos **PKCE** y **Registro dinámico de cliente (DCR)** para que no tenga que registrar previamente una aplicación OAuth. El ejemplo de referencia es el conector **Cloudflare Official Remote MCP** (`cloudflare-remote`).

## Cómo funciona el flujo

1. **Registro dinámico de cliente (RFC 7591).** Cuando un conector declara un `registrationUrl` y no tiene un `clientId` estático, SecureAI se registra como un cliente PKCE público en esa URL y almacena en caché el [[XINL3] resultante. Si el URI de redireccionamiento cambia, se vuelve a registrar automáticamente. (Para los conectores que envían una identificación de cliente estática, se omite este paso).
2. **Autorización + PKCE (S256).** SecureAI genera un verificador/desafío PKCE, crea la URL de autorización con `code_challenge` y `code_challenge_method=S256` y redirige al administrador/usuario al proveedor para otorgar acceso.
3. **Devolución de llamada.** El proveedor redirige nuevamente a `GET /api/connectors/oauth/callback/:slug`. Esta ruta está protegida por el parámetro opaco `state` (comparado con un almacén PKCE de corta duración de 10 minutos) en lugar de una sesión, por lo que no necesita middleware de autenticación.
4. **Intercambio y almacenamiento de tokens.** SecureAI intercambia el código (con el verificador PKCE) por tokens y los almacena **por usuario**. Luego, el token de acceso se inyecta en el transporte MCP (por ejemplo, como `BEARER_TOKEN`) para las llamadas a la herramienta de ese usuario.

## Conexión de un conector MCP OAuth

1. **Administrador → Integraciones → MCP** y elija un conector OAuth (por ejemplo, MCP remoto oficial de Cloudflare).
2. Haga clic en **Autorizar**: una ventana emergente abre la pantalla de consentimiento del proveedor.
3. Aprobar los alcances solicitados.
4. Si tiene éxito, se le redirigirá nuevamente y el conector se mostrará como conectado.

## Notas

- **Tokens por usuario.** Cada usuario autoriza individualmente; Las llamadas a herramientas se ejecutan con la concesión propia de ese usuario, no con una credencial compartida.
- **Se requiere PKCE** para estos conectores (`pkceRequired: true`), por lo que no se almacena ningún secreto de cliente para los clientes públicos.
- **Conectores de cliente estático.** Si su organización registra previamente un cliente OAuth, proporcione su ID/secreto de cliente y SecureAI lo usará en lugar de DCR.

## Relacionado

- [Descripción general de los conectores MCP](/integrations/mcp/overview)
- [AI Gateway — Extremos remotos](/ai-gateway/remote-endpoints)