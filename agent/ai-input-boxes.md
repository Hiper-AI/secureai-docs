---
title: "Cuadros de IA"
sidebarTitle: "Cuadros de IA"
description: "El agente revisa con su DLP lo que el colaborador escribe en apps de IA de escritorio, en Gemini de Chrome, en Copilot de Edge y en sitios de IA sin la extensión"
---

El agente lee el cuadro de texto donde el colaborador escribe un prompt y lo revisa con las reglas de DLP de su
organización antes de que salga. Cubre lo que la [SecureAI Extension](/extension/overview) no ve: las apps de IA de
escritorio, los paneles de IA que traen Chrome y Edge, y los sitios de IA abiertos en un navegador sin la extensión.

<Note>
Requiere una versión de SecureAI Agent posterior a la 1.3.5, en Windows. En macOS el agente no lee estos cuadros.
</Note>

## Qué cubre

El agente mira el cuadro editable que tiene el foco cuando está en:

| Superficie | Cuáles |
|---|---|
| Apps de IA de escritorio | ChatGPT, Claude, Copilot, Gemini, LM Studio, Ollama, Comet, Dia, Grammarly, Jan, goose y Msty |
| Paneles de IA del navegador | Gemini en Chrome y Copilot en Edge |
| Sitios de IA en un navegador | Chrome, Edge, Firefox, Brave, Opera, Vivaldi y Arc, solo en los navegadores donde la extensión no está forzada por política. Donde está, revisa la extensión |

La barra de direcciones del navegador queda afuera.

## Cómo se prende

En la consola: **Inventario → Dispositivos → Políticas**, abra la política del grupo, paso **Gobernanza**, sección
**Dispositivo → Guardas de datos → Cuadros de IA**. Una política nueva viene en **Apagado**.

| Modo | Qué hace |
|---|---|
| **Apagado** | No lee los cuadros. |
| **Monitorear** | Registra cada prompt y los datos sensibles que encuentra. El colaborador no ve nada. |
| **Avisar** | Además, le muestra al colaborador un aviso por borrador cuando una regla encuentra datos sensibles. No frena el envío. |
| **Bloquear** | Retiene la tecla Enter si el mensaje tiene datos que una regla bloquea o redacta, o si el agente no lo pudo revisar. Solo rige con la política en modo **block**; con la política en **monitor**, el agente lo trata como **Monitorear**. |

## Cómo funciona

1. El agente revisa cada 400 ms qué cuadro tiene el foco.
2. Cuando el texto deja de cambiar durante 1,2 segundos, lo evalúa una vez con el DLP de su organización, con un
   plazo de 3 segundos.
3. En **Bloquear**, al apretar Enter vuelve a evaluar el texto. Si sale limpio, deja pasar el Enter. Si no, el mensaje
   no se envía. Shift+Enter pasa siempre, porque las apps lo usan para cortar línea.
4. Si el último borrador tenía un hallazgo de bloqueo, el agente también retiene el clic en los botones cuyo nombre
   contiene *send*, *enviar*, *submit*, *envoyer*, *senden* o *invia*.

Si el DLP no responde a tiempo o no tiene reglas cargadas, en **Bloquear** el agente retiene el mensaje y avisa que no
lo pudo revisar. En los demás modos lo registra como no evaluado. Con el DLP del equipo apagado, deja pasar el mensaje y
solo cuenta el uso.

## Qué ve el colaborador

Una notificación de Windows, como mucho una cada 15 segundos por app o sitio. Nunca muestra el texto ni la regla.

- **Avisar**: "Lo que estás escribiendo en {sitio} tiene datos sensibles. Revisalo antes de enviarlo."
- **Bloquear**: "SecureAI · Mensaje no enviado", con el pedido de sacar los datos y volver a intentar.
- **Sin evaluar**: "SecureAI no pudo revisar tu mensaje".

## Qué se registra

Cada evento llega a la consola como actividad del agente (`agent_data_guard_event`, guarda `ai_input`) con:

- el resultado: `observed`, `detected`, `warned`, `unevaluated`, `blocked` o `blocked-unevaluated`;
- el modo, el destino (app, sitio o panel) y el navegador;
- el usuario de Windows;
- por cada regla que coincidió: id, nombre, categoría, severidad, acción y cantidad de coincidencias.

El texto del prompt no sale del equipo. El backend rechaza un lote que traiga un campo con texto.

## Qué no cubre

- Un clic en el botón de enviar antes de que pase la pausa de 1,2 segundos, o en un botón con otro nombre.
- Un envío por dictado de voz, por un atajo propio de la app o por activación de accesibilidad.
- Una app que corre como administrador: Windows no deja que el agente reinyecte el Enter, y ese Enter se pierde.
- Un texto demasiado largo para evaluar: en **Bloquear** queda retenido como no evaluado.

Por eso **Bloquear** reduce la fuga por el camino habitual (escribir o pegar y apretar Enter), pero no la impide en
todos los casos. Para un sitio de IA, la [extensión](/extension/overview) revisa el envío completo.

## Relacionado

- [Políticas y grupos](/agent/policies-and-groups)
- [Alertas y SIEM](/agent/alerts-and-siem): los eventos con hallazgo salen al SIEM como `endpoint_ai_input`.
