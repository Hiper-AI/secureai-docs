---
sidebar_position: 1
title: "Endpoint Agent — Gobernanza en el Dispositivo"
sidebar_label: "Endpoint Agent"
description: "SecureAI OS Agent: gobernanza de IA de endpoints, DLP y control de salida para portátiles y servidores"
---

# Agente de endpoint

SecureAI **OS Agent** se ejecuta en sus terminales (portátiles Windows, servidores Linux, máquinas macOS) y aplica la gobernanza de la IA donde realmente se realiza el trabajo. Descubre la actividad de AI/MCP en el dispositivo, aplica protecciones de comportamiento y pérdida de datos, y puede controlar o bloquear la salida a los proveedores de AI de acuerdo con la política.

La flota de agentes se administra en **Admin → Registro de agentes → Agentes del sistema operativo**.

## Qué hace el agente

- **Descubre el uso de IA en el dispositivo**: SDK/procesos de IA instalados, servidores MCP y llamadas de red oculta a proveedores de IA.
- **Hace cumplir la política**: monitoree o bloquee proveedores/modelos/aplicaciones/MCP de IA, aplique supervisión de comportamiento de IA y aplique el control de salida (consulte [Cumplimiento de salida](/agent/egress-enforcement)).
- **Protege los datos**: inspección DLP/PII del endpoint.
- **Responde a amenazas**: pone en cuarentena archivos maliciosos y puede aislar un endpoint comprometido (consulte [Cuarentena y operaciones de flota](/agent/quarantine-and-fleet-ops)).
- **Opcionalmente enruta el tráfico de IA del desarrollador** a través de la puerta de enlace de SecureAI (consulte [Proxy transparente](/agent/transparent-proxy)).

## Salud y postura del dispositivo

Cada dispositivo inscrito informa un estado de salud y una postura de seguridad:

| Señal | Valores |
|--------|--------|
| **Estado** | `healthy`, `stale` (sin latidos durante ~5 minutos), `enrolled`, `paused`, `revoked` |
| **Postura** | `protected`, `at_risk`, `infected` |
| **Puntuación de riesgo** | 0–100, calculado a partir de infracciones, amenazas y configuración |

La pestaña **Agentes del sistema operativo** enumera cada dispositivo con su estado, postura, riesgo, versión/sistema operativo, grupo, política activa y propietario vinculado. Al expandir un dispositivo se muestran observaciones recientes de la red oculta, inventario de MCP, procesos AI-SDK, violaciones de políticas, conexiones bloqueadas, elementos en cuarentena, amenazas e historial de comandos.

## Cómo empezar

1. **[Instalar el agente](/agent/installation)** en los endpoints (MSI firmado en Windows; script en Linux/macOS).
2. Comprenda **[paquetes de inscripción e instalación](/agent/enrollment-and-packages)**: cómo se unen los dispositivos y obtienen su configuración.
3. Configure **[políticas y grupos](/agent/policies-and-groups)** para decidir qué aplica cada dispositivo.
4. Sintonice **[aplicación de salida](/agent/egress-enforcement)** y **[operaciones de cuarentena y flota](/agent/quarantine-and-fleet-ops)** para obtener respuesta.

## Roles

El acceso general al panel de administración le permite ver y configurar la flota. **Las acciones destructivas** (cuarentena, proceso/MCP/eliminación de red, aislamiento y revocación) requieren la función elevada de **admin** del sistema. Consulte [Operaciones de flota y cuarentena](/agent/quarantine-and-fleet-ops).

## Relacionado

- [AI Discovery & Inventory](/discovery/overview): el agente es una de las tres señales de descubrimiento.
- [Defensa contra amenazas](/threat-defense/overview)