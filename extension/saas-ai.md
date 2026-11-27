---
title: "IA dentro de SaaS"
sidebarTitle: "IA dentro de SaaS"
description: "La extensión revisa con DLP lo que el colaborador manda a la IA que viene dentro de Microsoft 365, Google Workspace, Notion, Atlassian, Canva y Slack"
---

Muchas aplicaciones SaaS traen su propia IA: Copilot en Outlook, Gemini en Docs, Notion AI. El colaborador le manda
un prompt sin salir de la aplicación, y a menudo la IA toma como contexto el documento abierto. La SecureAI Extension
reconoce el cuadro de esa IA y revisa lo que sale por ahí con las reglas de DLP de su organización.

<Note>
Requiere una versión de la SecureAI Extension posterior a la 1.0.32 y el bloqueo de IA no aprobada encendido en la
configuración de la extensión.
</Note>

## Qué cubre

| Función | Dónde |
|---|---|
| **Microsoft 365 Copilot** | `m365.cloud.microsoft`, Outlook en la web, Office en la web y SharePoint |
| **Gemini en Google Workspace** | Google Docs y Gmail |
| **Notion AI** | `notion.so` y `app.notion.com` |
| **Atlassian Rovo** | `*.atlassian.net` y `home.atlassian.com` |
| **Canva Magic** | `canva.com` |
| **Slack AI** | `app.slack.com` |

## Qué hace hoy

La extensión aplica **Inspeccionar** a las seis funciones:

- Revisa lo que el colaborador escribe, pega o adjunta mientras el foco está en el cuadro de la IA. El resto del
  documento del SaaS no se revisa mientras el colaborador lo edita.
- Antes de enviar, en Microsoft 365 Copilot (Outlook y Office en la web) y en Gemini (Docs y Gmail), revisa también el
  documento o el correo que la IA va a tomar como contexto. Ahí, una regla que reemplaza datos pasa a bloquear, porque
  la extensión no puede reemplazar texto dentro del documento, y una regla que solo registra deja pasar.
- Si una regla bloquea, el colaborador ve el aviso de DLP de la extensión y el mensaje no sale. El resto del SaaS
  funciona igual.

Las otras dos opciones ya existen en la extensión: **Permitir** (no revisa nada en esa función) y **Apagar** (rechaza
cada envío desde el cuadro de la IA y corta las solicitudes de la IA a la red, sin cortar la página). La consola
todavía no permite elegirlas, así que hoy todas las funciones quedan en **Inspeccionar**.

## Qué se registra

Los mismos eventos de DLP que en un sitio de IA: la dirección de la página, el nombre de la función, las reglas que
coincidieron con su categoría, severidad y cantidad de coincidencias, el largo del contenido y el nombre del archivo
adjunto. El texto del prompt no se manda.

La extensión no registra el uso de estas funciones (modelo, cuenta, tokens) como lo hace en ChatGPT, Claude o Gemini:
solo aparecen cuando una regla actúa.

## Qué no cubre

- **Cuadros sin medir.** En Notion, Microsoft 365, Slack, Rovo y Canva, la extensión encuentra el cuadro de la IA por su
  etiqueta accesible o su texto de ayuda. Si el fabricante cambia ese texto, la extensión deja de reconocer el cuadro y
  no lo revisa.
- **Gemini en Gmail.** Ni el cuadro ni la solicitud de la IA están medidos en Gmail: la revisión puede no actuar.
- **Copilot dentro de Word y Excel en la web** cuando va por el servicio interno de Office (AugLoop).
- **Slack AI** no tiene una solicitud de red identificada: cuando la consola permita apagarla, solo funcionará el
  rechazo en el cuadro.
- Las apps de escritorio de estos productos (Outlook, Teams, Slack, Notion). En Windows, el agente las cubre solo si son
  [apps de IA que reconoce](/agent/ai-apps); estas no lo son.

## Relacionado

- [SecureAI Extension](/extension/overview)
- [Solo cuentas corporativas](/extension/corporate-accounts)
