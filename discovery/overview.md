---
sidebar_position: 1
title: "Descubrimiento de IA y Shadow AI"
sidebar_label: "Visión General"
description: "Cómo SecureAI descubre e inventaria cada agente, modelo, identidad y fuente de IA en la sombra de su organización"
---

# Descubrimiento e inventario de IA

SecureAI crea un inventario único y continuamente actualizado de la IA de su organización: los agentes y modelos que ejecuta, las identidades detrás de ellos y la IA oculta que no conocía. Lo hace a partir de **tres señales de descubrimiento complementarias**, todas ellas aparecieron en **Administrador → Registro de agentes**.

## Las tres señales

| Señal | Ve | Alimentado por |
|--------|------|--------|
| **API en la nube** | Agentes, modelos, implementaciones e identidades dentro de sus plataformas de IA. | Conectores de [Proveedor de IA en la nube](/integrations/cloud/overview) → [Sensores de nube](/discovery/cloud-sensors) |
| **Red / CASB** | IP de origen corporativo que llaman a las API de LLM, sin ningún agente instalado. | Conectores [CASB / SWG](/integrations/casb/overview) → [Fuentes de red](/discovery/network-sources) |
| **Agente de endpoint** | Actividad de AI/MCP en servidores y portátiles administrados. | [Agente del sistema operativo](/agent/overview) |

Las identidades descubiertas en todas las señales se acumulan en el [Inventario NHI](/discovery/nhi-inventory), y los agentes lógicos/chatbots que usted controla viven en el [Registro de agentes](/discovery/agent-registry).

## Las pestañas de inventario

En **Administrador → Registro de agentes** encontrará:

- **[Cloud Sensors](/discovery/cloud-sensors)**: agentes y modelos descubiertos en la nube.
- **[Fuentes de red](/discovery/network-sources)**: fuentes de IA oculta encontradas en registros CASB/SWG.
- **[NHI Inventory](/discovery/nhi-inventory)**: identidades no humanas (claves, cuentas de servicio) con controles de bloqueo/revocación.
- **[Registro de agentes](/discovery/agent-registry)**: metadatos de gobernanza para sus chatbots y agentes de IA lógicos.

## Por qué es importante

No puedes gobernar lo que no puedes ver. Discovery le brinda el denominador: cada terminal de modelo, cada clave, cada dispositivo o carga de trabajo relacionada con la IA, por lo que la política, el control de costos y la respuesta a incidentes se aplican a *todo* su patrimonio, no solo a las partes que se declararon.

## Relacionado

- [Proveedores de IA en la nube](/integrations/cloud/overview)
- [CASB y red (SWG)](/integraciones/casb/overview)
- [Agente de endpoint](/agent/overview)