---
sidebar_position: 3
title: "Fuentes de Red y Detección de Tráfico"
sidebar_label: "Fuentes de Red"
description: "Descubrimiento de Shadow-AI: qué IP de origen corporativo y qué usuarios llaman a las API de LLM, desde sus registros CASB/SWG"
---

# Fuentes de red

**Fuentes de red** (Administrador → Registro de agentes → **Red**) muestra la IA oculta que se encuentra en sus registros CASB/SWG: qué **IP de origen corporativas y usuarios llaman a las API de LLM**, incluso cuando no se implementa ningún SDK o [agente de endpoint](/agent/overview). Se alimenta de [CASB y conectores de red](/integrations/casb/overview): Cisco Umbrella, Zscaler y otros.

## La ventana de descubrimiento

La actividad se informa durante un período continuo: **30 días de forma predeterminada** (configurable a través de `NETWORK_DISCOVERY_WINDOW_DAYS`). Algunas subvistas (dominios principales, usuarios principales, dominios desconocidos) utilizan una ventana fija de 7 días. En la primera conexión, un conector ejecuta un reabastecimiento en segundo plano para que el historial esté disponible de inmediato.

## Lo que muestra cada fuente

| Campo | Descripción |
|-------|-------------|
| **IP de origen** | El dispositivo/carga de trabajo corporativo que realiza llamadas de IA. |
| **Usuario/puerta de enlace** | La identidad del usuario principal o de la puerta de enlace, cuando el conector la proporciona. |
| **Llamadas totales** | Volumen de llamadas dentro de la ventana. |
| **Dominios/proveedores principales** | El destino de IA más afectado y el conjunto de proveedores. |
| **Severidad** | `critical` / `high` / `medium` / `low`. |
| **Dominios de amenazas** | Una insignia cuando una fuente llegó a destinos peligrosos. |
| **Registrado** | Si la fuente ha sido seleccionada/registrada. |

Al profundizar en una fuente se muestra una tabla por observación (dominio, proveedor, conector, llamadas, usuario, visto por última vez).

## Flujo de trabajo de clasificación

- **Registra** una fuente que reconozcas (pasa a formar parte de tu inventario conocido) o **elévala** para su seguimiento.
- **Ignorar/designorar** fuentes esperadas/ruido.
- Revisar la cola **dominios desconocidos** para clasificar los destinos de IA que el catálogo no reconoció.
- Explore **análisis** y la vista **topología** para conocer patrones en toda la organización.
- Exportar a CSV.

## Sincronización

Ejecute **Sync** por conector o **Sync All**; Los conectores también se sincronizan según un cronograma (predeterminado cada 30 minutos). El progreso del reabastecimiento y el estado obsoleto del conector se muestran en línea. La configuración del conector se encuentra en **Admin → Integraciones → Red**.

## Relacionado

- [Integraciones CASB y red (SWG)](/integrations/casb/overview): conecte las fuentes de registro.
- [Agente de endpoint](/agent/overview): para endpoints que puede administrar directamente.
- [Descripción general del inventario y descubrimiento de IA](/discovery/overview)