---
sidebar_position: 5
title: "Control y Cumplimiento de Salida (Egress Enforcement)"
sidebar_label: "Control de Salida (Egress)"
description: "Controle o bloquee el tráfico de IA saliente desde endpoints con SecureAI OS Agent"
---

# Control de salida

La aplicación de la salida controla lo que un endpoint puede enviar **hacia fuera** a proveedores de IA y servidores MCP. Se configura según [política](/agent/policies-and-groups) y el agente lo aplica localmente.

## Modos

| Modo | Comportamiento |
|------|----------|
| **apagado** | Sin control de salida: solo descubrimiento/monitoreo. |
| **matar** | Finalice el proceso infractor cuando realice una llamada de IA no permitida (predeterminado heredado). |
| **bloque** | Bloqueo de red duradero de la conexión (Plataforma de filtrado de Windows), dejando el proceso en ejecución. |
| **bloqueo** | Denegación predeterminada: todo está bloqueado excepto los destinos en una **lista permitida** explícita. |

## Controles adicionales

| Controlar | Descripción |
|---------|-------------|
| **Lista de permitidos** | En `lockdown`, el conjunto de destinos que permanecen permitidos. |
| **Bloquear MCP remoto** | Bloquea el endpoint para que no llegue a servidores MCP remotos. |

La configuración resuelta se entrega a cada dispositivo como `egressEnforcement: { mode, allowList, blockRemoteMcp }` y se reevalúa en cada latido.

## Elegir un modo

- Comience en **desactivado** (o una política de modo **monitor**) para crear una imagen precisa de lo que realmente llama el endpoint, visible en el cajón del dispositivo y en [AI Discovery](/discovery/overview).
- Muévase a **bloquear** para detener de forma duradera la salida de IA no permitida sin interrumpir el resto de la red del proceso.
- Utilice **kill** donde desee que el programa infractor se detenga por completo.
- Utilice **bloqueo** para la postura más estricta: solo se puede acceder a sus endpoints de IA autorizados (la lista de permitidos).

Los modos de salida también están incluidos en los [ajustes preestablecidos de protección](/agent/policies-and-groups#protection-presets) (Pasivo / Normal / Agresivo), por lo que puede establecer un nivel de postura completo con un solo clic y ajustarlo desde allí.

<Warning>
`kill`, `block` y `lockdown` interrumpen activamente el tráfico del endpoint. Valide un cambio con **simulación de prueba** y **anillos de implementación** por etapas ([Policies & Groups](/agent/policies-and-groups#safe-rollouts)) antes de aplicarlo en toda la flota.
</Warning>

## Relacionado

- [Políticas y grupos](/agent/policies-and-groups)
- [Proxy transparente](/agent/transparent-proxy): enruta el tráfico de IA permitido a través de la puerta de enlace en lugar de bloquearlo.
- [Operaciones de cuarentena y flota](/agent/quarantine-and-fleet-ops)