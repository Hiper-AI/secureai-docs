---
sidebar_position: 7
title: "Proxy Transparente (Enrutamiento Local de IA)"
sidebar_label: "Proxy Transparente"
description: "Enrutar el tráfico de IA del desarrollador (por ejemplo, Claude Code) a través de la puerta de enlace SecureAI desde el endpoint"
---

# Proxy transparente (enrutamiento AI)

El agente puede enrutar de forma transparente el tráfico de IA de un desarrollador, por ejemplo [Claude Code](/integrations/ide-claude-code), a través de la puerta de enlace SecureAI. Esto hace que el uso del asistente de codificación esté bajo la misma gobernanza, seguimiento de costos y política que el resto de su patrimonio de IA, sin que el desarrollador cambie sus herramientas.

## Cómo funciona

El enrutamiento se configura por [política](/agent/policies-and-groups) a través de `claudeCodeRouting`:

| Configuración | Descripción |
|---------|-------------|
| **Habilitado** | Active el enrutamiento para dispositivos bajo esta política. |
| **Bloquear** | `user` (el desarrollador puede alternar), `force_on` (siempre enrutado) o `force_off` (nunca enrutado). |
| **Asignaciones de modelos** | Mapeo por familia para `opus` / `sonnet` / `haiku` al modelo realmente servido. |
| **Bloqueo de modelo** | `user` o `force`: si el desarrollador puede cambiar la asignación. |

Cuando el enrutamiento está habilitado, SecureAI **crea una clave API por dispositivo** y la inyecta en el entorno del endpoint (por ejemplo, como `ANTHROPIC_AUTH_TOKEN`) a través de la configuración de proxy transparente. El uso se **factura al depósito de puntos del desarrollador vinculado**, así que asegúrese de que el dispositivo esté vinculado a un usuario propietario (consulte [Inscripción y paquetes](/agent/enrollment-and-packages)).

## Valores predeterminados para toda la flota

Los valores predeterminados de la puerta de enlace se pueden configurar una vez para la flota (`anthropicBaseUrl`, `openaiBaseUrl`, el token de autenticación y un bloqueo) y los dispositivos los heredan. El agente informa si el proxy está actualmente activado o desactivado y esas transiciones se auditan.

## ¿Por qué enrutar en lugar de bloquear?

Para la IA de un desarrollador autorizado, el enrutamiento a través de la puerta de enlace suele ser preferible a un [bloque de salida](/agent/egress-enforcement): el desarrollador sigue trabajando, mientras usted obtiene la aplicación de políticas, la atribución de costos y la auditoría de ese tráfico. Bloqueo/bloqueo de reserva para proveedores no autorizados.

## Relacionado

- [Aplicación de salida](/agent/egress-enforcement)
- [Políticas y grupos](/agent/policies-and-groups)
- [Descripción general de la puerta de enlace AI](/ai-gateway/overview)
- [Integración IDE de Claude Code](/integrations/ide-claude-code)