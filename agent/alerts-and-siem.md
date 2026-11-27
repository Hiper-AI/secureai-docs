---
title: "Alertas y SIEM del endpoint"
sidebarTitle: "Alertas y SIEM"
description: "Canales de alerta del agente (mail, webhook y Slack) y los eventos de endpoint que SecureAI manda a su SIEM"
---

## Canales de alerta

El agente avisa por mail, webhook o Slack cuando un equipo necesita que alguien lo mire.

### Qué dispara una alerta

- Un equipo que pasa a postura **en riesgo** o **infectado**.
- Un intento de manipulación del agente, incluido un [hook borrado o editado](/agent/coding-agents#hooks-borrados-o-editados).
- Un archivo puesto en cuarentena.

### Dónde se configura

**Analíticas → Seguridad → Flota**, tema **Amenazas frenadas**, bloque **Canales de alerta del endpoint**.

| Canal | Qué acepta |
|---|---|
| **Mail** | Hasta 20 destinatarios separados por coma. |
| **Webhook** | Una URL `https` a un host público. SecureAI rechaza direcciones internas. |
| **Slack** | Un webhook entrante de Slack (`https://hooks.slack.com/...`). |

Deje vacío el campo de webhook o de Slack para conservar el valor guardado. **Mandar alerta de prueba** manda una
alerta a todos los canales configurados; si no hay ninguno, la consola lo indica. **Usar las variables del servidor**
borra la configuración guardada y vuelve a los canales que su instalación define por variables de entorno.

SecureAI guarda las dos URLs cifradas y la consola muestra solo el host. El cambio queda en la auditoría con la
cantidad de destinatarios y qué canales cambiaron, sin los destinatarios ni las URLs.

## Eventos de endpoint en el SIEM

SecureAI manda a su SIEM los eventos del agente con un `event_type` propio, para que pueda filtrarlos sin leer la
actividad general.

| `event_type` | Cuándo sale |
|---|---|
| `endpoint_shadow_ai` | El agente frenó un sitio de IA no aprobado, cerró su pestaña o cerró una app de IA de escritorio no aprobada. |
| `endpoint_mcp_blocked` | El agente bloqueó un servidor MCP o una herramienta MCP. |
| `endpoint_skill_quarantined` | El agente puso en cuarentena una skill o un hook. |
| `endpoint_agent_tamper` | Alguien intentó manipular o desinstalar el agente, o borró o editó un hook. |
| `endpoint_ai_input` | Un [cuadro de IA](/agent/ai-input-boxes) con un hallazgo: todo resultado salvo `observed`. |

### Cómo se suscribe

En **Integraciones**, en la integración de su SIEM ([Splunk](/integrations/splunk-security),
[Microsoft Sentinel](/integrations/microsoft-sentinel), [Elastic Security](/integrations/elastic-security) o
[webhook](/integrations/custom-siem-webhook)), elija los tipos en la categoría de seguridad.

Una integración que ya estaba suscripta a `policy_violation` o a `user_activity` sigue recibiendo estos eventos: no
hace falta cambiarla.

### Qué lleva cada evento

El mismo registro que ve en la consola: el tipo original en `activity.type` y su `metadata`. SecureAI no agrega campos
para el SIEM. Los eventos de cuadros de IA llevan las reglas que coincidieron y la cantidad de coincidencias, nunca el
texto del prompt.

## Relacionado

- [Cuarentena y operaciones de flota](/agent/quarantine-and-fleet-ops)
- [Cuadros de IA](/agent/ai-input-boxes)
- [Agentes de código](/agent/coding-agents)
