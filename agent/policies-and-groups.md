---
sidebar_position: 4
title: "Políticas y Grupos de Dispositivos"
sidebar_label: "Políticas y Grupos"
description: "Configure lo que SecureAI OS Agent aplica con políticas, grupos, ajustes preestablecidos de protección e implementaciones seguras."
---

# Políticas y grupos

Una **política** define lo que aplica el agente; un **grupo** asigna una política a un conjunto de dispositivos. Cada dispositivo resuelve su política efectiva en cada latido, por lo que los cambios se propagan rápidamente.

## Políticas

Una política (`AgentPolicy`) contiene:

| Configuración | Descripción |
|---------|-------------|
| **Modo** | `monitor` (solo observar) o `block` (aplicar). |
| **Conjuntos de reglas** | Listas de permitir/denegar para `mcps`, `apps`, `providers` y `models`. |
| **Amenazas** | Si el dispositivo consume la fuente de amenazas de la organización. |
| **Control de Salida (Egress Enforcement)** | `off` / `kill` / `block` / `lockdown` (+ lista de permitidos, bloque-remoto-MCP). Consulte [Cumplimiento de salida](/agent/egress-enforcement). |
| **Guardia de comportamiento** | Supervisión de comportamiento de IA: habilitada, sensibilidad y acción predeterminada (`alert`, `quarantine`, `kill`, `block`, `require_approval`), para endpoint y/o gateway. |
| **Enrutamiento del Claude Code** | Configuración de proxy transparente. Consulte [Proxy transparente](/agent/transparent-proxy). |
| **Protección contra manipulaciones** | Requisito de clave de desinstalación (ver más abajo). |
| **Lanzamiento** | Configuración de implementación por etapas (consulte [Implementaciones seguras](#safe-rollouts)). |

### Ajustes preestablecidos de protección

En lugar de ajustar cada perilla, puede elegir un único ajuste preestablecido de protección que combine la protección de comportamiento con el modo de salida:

| Preestablecido | Comportamiento |
|--------|----------|
| **Pasivo** | Observar y alertar; aplicación mínima. |
| **Normal** | Aplicación equilibrada. |
| **Agresivo** | Aplicación estricta (por ejemplo, bloqueo/cuarentena, salida más estricta). |

Las combinaciones no preestablecidas se muestran como **Personalizadas**.

## Grupos

Un **grupo** (`AgentGroup`) tiene un `policyId` más **reglas de membresía** dinámicas: coinciden en sistema operativo, patrón global de nombre de host y prioridad. La política efectiva de un dispositivo se resuelve **dispositivo → grupo → política** y se reevalúa en cada latido, por lo que mover un dispositivo entre grupos (o editar las reglas de un grupo) lo reorienta automáticamente.

## Implementaciones seguras

Los cambios de política se envían a través de un flujo de trabajo controlado para que pueda validarlos antes de su aplicación en toda la flota:

- **Revisiones y reversiones**: cada cambio de política tiene una versión; retroceder a una revisión anterior en cualquier momento.
- **Anillos de implementación**: avanza un cambio a través de anillos por etapas (pausar/reanudar/avanzar) en lugar de hacerlo todos a la vez.
- **Simulación de prueba**: obtenga una vista previa de lo que una política *detectaría o bloquearía en el inventario actual, sin guardar ni aplicar nada.
- **Excepciones**: un flujo de trabajo de aprobación para excepciones por dispositivo/por regla; aprobar uno agrega una exclusión administrada. La aprobación requiere el rol de administrador.

## Protección contra manipulaciones y clave de desinstalación

Una política puede requerir una **clave de desinstalación** (`tamperProtection.uninstallRequiresKey`) para que un usuario local no pueda eliminar el agente sin ella. El requisito (y una clave hash con un salt/hash fuera de línea) se entrega al endpoint para que pueda validarse incluso fuera de la red. Los intentos de desinstalación se validan a través de un endpoint público de validación de token (primero clave por política, luego un respaldo para toda la flota); Los fallos son auditados. Consulte [Autoactualización y antimanipulación](/agent/quarantine-and-fleet-ops#self-update--anti-tamper).

## Relacionado

- [Aplicación de salida](/agent/egress-enforcement)
- [Operaciones de cuarentena y flota](/agent/quarantine-and-fleet-ops)
- [Proxy transparente](/agent/proxy-transparente)