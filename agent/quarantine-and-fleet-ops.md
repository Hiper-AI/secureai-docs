---
sidebar_position: 6
title: "Operaciones de Cuarentena y Gestión de Flota"
sidebar_label: "Cuarentena y Flota"
description: "Responda a las amenazas a los endpoints: ponga en cuarentena, restaure, aísle, incidentes y operaciones en toda la flota"
---

# Cuarentena y operaciones de flota

Más allá de la aplicación de la ley, la flota de agentes tiene una capa de respuesta y operaciones: cuarentena y restauración, aislamiento de endpoints, una sala de guerra de incidentes, una bóveda de cuarentena, ajuste de amenazas y un panel de control de la flota.

## Comandos y funciones del dispositivo

Los comandos destructivos de dispositivos requieren la función elevada de **admin** del sistema (más estricta que el acceso general al panel de administración):

| Comando | Efecto |
|---------|--------|
| `quarantine` | Mueve y cifra un archivo malicioso y elimina su árbol de procesos. **Destructivo.** |
| `kill_process` / `kill_mcp` / `kill_network` | Finalice un proceso, un servidor MCP o una conexión de red. |
| `isolate` / `unisolate` | Corte el endpoint de la red/restáurelo. |
| `revoke` | Revocar el dispositivo (ya no podrá inscribirse ni llamar a casa). |

`restore` (recuperar un archivo en cuarentena) es una acción de recuperación y está disponible para cualquier operador administrador. El agente confirma los resultados de la cuarentena/restauración al backend.

## Bóveda de cuarentena

Los elementos en cuarentena se conservan en una **bóveda** con un período de retención configurable (**30 días** de forma predeterminada). Desde el almacén puede filtrar por máquina, gravedad, estado restaurado/revisado, marcar elementos como revisados ​​y **restaurar** elementos de forma masiva.

## Ajuste de amenazas

La **cola de revisión** recopila archivos en cuarentena automática y políticas recientes que se eliminan automáticamente en espera de una revisión humana de falsos positivos; cada fila contiene la política resuelta del dispositivo para que pueda ajustar la regla correcta. A partir de un incidente, puede **poner en lista bloqueada** o **en lista blanca** una detección, globalmente en el catálogo de la organización o en el ámbito de una política.

## Incidentes (Sala de Guerra)

Los incidentes de endpoints se clasifican en War Room como runbooks. Las acciones a nivel de dispositivo incluyen **ack-clear** (borrar infracciones registradas, volver a calcular la postura y cerrar los runbooks de amenazas relacionados) y la lista blanca o bloqueada de amenazas.

## Panel de flota

El panel resume toda la flota: cobertura, recuentos en línea/obsoletos por sistema operativo, distribución de postura, riesgo promedio, facetas de incidentes activos, un mapa de calor por dispositivo, un cronograma de amenazas por día, amenazas principales y riesgos principales.

## Autoactualización y antimanipulación

- **Autoactualización**: el agente se actualiza a sí mismo mediante un comando `update` más un manifiesto de lanzamiento firmado (versión + suma de verificación + firma); la versión más nueva se puede sincronizar automáticamente con la flota.
- **Clave antimanipulación/desinstalación**: una [política](/agent/policies-and-groups#tamper-protection--uninstall-key) puede requerir una clave de desinstalación para que el agente no pueda eliminarse silenciosamente. La validación funciona incluso fuera de la red (se lleva un salt/hash fuera de línea al endpoint), con una clave para toda la flota como alternativa; Se auditan los intentos fallidos de desinstalación.

## Relacionado

- [Políticas y grupos](/agent/policies-and-groups)
- [Aplicación de salida](/agent/egress-enforcement)
- [Defensa contra amenazas](/threat-defense/overview)