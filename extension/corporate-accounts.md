---
title: "Solo cuentas corporativas"
sidebarTitle: "Solo cuentas corporativas"
description: "La extensión agrega los headers de restricción de tenant que documenta cada proveedor, y el proveedor rechaza las cuentas personales o de otra empresa"
---

Varios proveedores venden sus planes empresariales con un header que, agregado a las solicitudes hacia sus hosts,
hace que el proveedor rechace toda cuenta fuera de los tenants de la lista. Una cuenta personal de ChatGPT, de Claude o
de Gmail no puede iniciar sesión.

La SecureAI Extension agrega esos headers en el navegador, sin proxy ni inspección TLS. Quien rechaza la cuenta es el
proveedor: la extensión no decide nada a partir de la página.

<Note>
Requiere una versión de la SecureAI Extension posterior a la 1.0.32.
</Note>

## Proveedores

| Proveedor | Plan que lo habilita (según el proveedor) | Header | Dónde lo agrega la extensión | Qué carga usted |
|---|---|---|---|---|
| **Google Workspace** | Google Workspace | `X-GoogApps-Allowed-Domains` | `google.com` y sus subdominios | Los dominios de su organización (hasta 50) y, si quiere, permitir cuentas de visitante |
| **Microsoft Entra** | Restricciones de tenant v1 de Microsoft Entra | `Restrict-Access-To-Tenants` y `Restrict-Access-Context` | `login.microsoftonline.com`, `login.microsoft.com` y `login.windows.net` | Los tenants permitidos (dominio o GUID, hasta 50) y el ID de directorio que recibe los logs de inicio de sesión (obligatorio) |
| **Cuentas personales de Microsoft** | El proveedor no lo indica | `sec-Restrict-Tenant-Access-Policy: restrict-msa` | `login.live.com` | La casilla para bloquear cuentas personales de Microsoft |
| **GitHub Enterprise** | GitHub Enterprise Cloud con Enterprise Managed Users | `sec-GitHub-allowed-enterprise` | `github.com`, `api.github.com`, `githubcopilot.com` y sus subdominios | El ID de la enterprise. Uno solo: GitHub rechaza más de uno |
| **Slack** | Slack Business+ o Enterprise | `X-Slack-Allowed-Workspaces-Requester` y `X-Slack-Allowed-Workspaces` | `slack.com` y sus subdominios | El workspace u organización que pide la restricción y los permitidos (IDs `T…` o `E…`, hasta 100) |
| **ChatGPT Enterprise** | ChatGPT Enterprise | `ChatGPT-Allowed-Workspace-Id` | `chatgpt.com` | Los IDs de workspace (UUID, hasta 100) |
| **Claude (Anthropic)** | Claude Enterprise y organizaciones de la Console | `anthropic-allowed-org-ids` | `claude.ai`, `claude.com`, `anthropic.com` y `api.anthropic.com` | Los IDs de organización (UUID, hasta 500) |

El proveedor fija qué plan habilita el header y puede cambiarlo. Confírmelo en su documentación antes de prenderlo.

**Dropbox y Zoom no están.** Dropbox no publica un header de este tipo. Zoom tiene uno, pero lo da de alta su soporte y
filtra por dominio de email, no por una lista que la extensión pueda mandar.

## Cómo se prende

**Inventario → Extensión → Configuración → Corporate accounts only**. Marque cada proveedor, complete sus campos y
guarde con **Save tenant restrictions**. Esta sección todavía se muestra en inglés aunque la consola esté en español.

- SecureAI valida cada campo al guardar. Un valor inválido no se guarda y la consola indica qué campo falló.
- Sacar un proveedor, sumar un tenant, cambiar el ID de directorio o de enterprise, permitir visitantes o dejar de
  bloquear las cuentas personales de Microsoft afloja la restricción y pide MFA reciente.
- Cada cambio queda en la auditoría con los proveedores que tocó, sin los IDs.

La extensión recibe la configuración antes de que el colaborador inicie sesión en ella, y la aplica aunque el bloqueo
de IA no aprobada esté apagado. También puede llegar por la política administrada del navegador (clave
`tenantRestrictions`, desde su MDM); para un proveedor configurado en los dos lados, gana la política administrada.

## Qué ve el colaborador

La pantalla de error del proveedor cuando intenta entrar con una cuenta que no está en la lista. La extensión no
muestra un aviso propio.

## Qué se registra

SecureAI no recibe un evento por cada inicio de sesión rechazado: el rechazo ocurre en el proveedor. Para ver esos
intentos, use los logs de inicio de sesión del proveedor (en Microsoft, los del directorio que cargó como ID de
directorio).

## Qué no cubre

- Navegadores sin la extensión, apps de escritorio y móviles, Git por SSH y herramientas de línea de comandos. Para
  Gemini, NotebookLM y AI Studio en el escritorio, el agente puede fijar los dominios de Google en el navegador (ver
  [Apps de IA y cuentas](/agent/ai-apps#gemini-notebooklm-y-ai-studio-solo-con-cuentas-de-la-empresa)).
- Un proveedor con un dato mal cargado en la política administrada: la extensión no le pone header, porque un header
  inválido haría que el proveedor rechace todas las solicitudes.

## Relacionado

- [SecureAI Extension](/extension/overview)
- [IA dentro de SaaS](/extension/saas-ai)
