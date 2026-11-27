---
title: "SecureAI Extension"
sidebarTitle: "Visión general"
description: "La extensión de navegador de SecureAI: DLP en los sitios de IA, IA dentro de SaaS, cuentas corporativas y descubrimiento de la IA que ya usan sus colaboradores"
---

La SecureAI Extension corre en Chrome y Edge. Revisa en el navegador lo que sus colaboradores mandan a la IA y le
informa a SecureAI qué IA usan. La revisión de DLP corre en el equipo del colaborador.

Se configura en **Inventario → Extensión → Configuración**.

## Qué hace

- **DLP en los sitios de IA.** Revisa lo que el colaborador escribe, pega, edita o sube en ChatGPT, Claude, Gemini,
  Microsoft Copilot, Perplexity y otros sitios de IA conocidos, incluidos NotebookLM y AI Studio. Según la regla, avisa,
  reemplaza el dato o bloquea el envío.
- **[IA dentro de SaaS](/extension/saas-ai).** Revisa los prompts a Microsoft 365 Copilot, Gemini en Workspace,
  Notion AI, Atlassian Rovo, Canva Magic y Slack AI.
- **[Solo cuentas corporativas](/extension/corporate-accounts).** Agrega los headers con los que Google, Microsoft,
  GitHub, Slack, OpenAI y Anthropic rechazan las cuentas personales.
- **Descubrimiento**: le muestra qué IA usan sus colaboradores, aunque nadie la haya aprobado (sección siguiente).

## Descubrimiento de la IA que ya está en uso

| Qué | Qué manda |
|---|---|
| **Extensiones de IA instaladas** | Nombre, identificador, versión, si está activa, cómo se instaló y a qué sitios tiene acceso. Revisa la lista de extensiones del navegador y manda solo las de IA. Lo hace cuando cambia la lista y una vez por día. |
| **Sitios de IA que no están en la lista** | La dirección y las señales por las que la extensión cree que la página es un chat de IA. |
| **Uso de los sitios de IA conocidos** | Por cada mensaje: el sitio, el modelo, el tipo y el plan de la cuenta, una estimación de tokens calculada por el largo del texto, los archivos (cantidad y tamaño), los conectores activos y si hubo bloqueo. El email solo si la cuenta es corporativa. |

Ninguno de estos eventos lleva el texto de un prompt ni de una respuesta.

## Con el agente

En Windows, el [SecureAI Agent](/agent/overview) cubre lo que la extensión no ve: las apps de IA de escritorio, los
paneles de IA de Chrome y Edge, y los sitios de IA en navegadores sin la extensión
([Cuadros de IA](/agent/ai-input-boxes)).
