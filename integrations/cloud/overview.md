---
sidebar_position: 1
title: "Proveedores Cloud de IA — Visión General"
sidebar_label: "Visión General Cloud"
description: "Conecte sus plataformas de IA OpenAI, Anthropic, Azure, AWS y GCP para que SecureAI pueda inventariar agentes, modelos, identidades, uso y costos."
---

# Proveedores de IA en la nube

Los conectores de proveedor de IA en la nube permiten a SecureAI acceder a las plataformas de IA que su organización ya utiliza (**OpenAI Platform, Anthropic Console, Azure AI Foundry y Google Vertex AI**) e inventariar automáticamente todo lo que se ejecuta allí. No es necesario implementar ningún agente o SDK en el lado del proveedor; SecureAI sondea la API de administración de cada proveedor con las credenciales de lectura mayoritaria que usted proporciona.

Una vez conectado, un conector descubre y sincroniza continuamente:

- **Agentes, modelos e implementaciones** que se ejecutan en la plataforma → se muestran en [Sensores de nube](/discovery/cloud-sensors).
- **Identidades no humanas (NHI)**: claves API, cuentas de servicio y (cuando sean compatibles) claves BYOK → se muestran en [Inventario NHI](/discovery/nhi-inventory), con controles de bloqueo/revocación.
- **Uso, tokens y costo** durante los últimos 30 días.
- **Señales de gobernanza**: enlaces de IAM/RBAC, límites de gasto y registros de auditoría, que aparecieron en Insights por proveedor.

## El bucle de configuración

Cada proveedor sigue los mismos cuatro pasos:

1. **Abra Administrador → Integraciones** y seleccione la categoría **Nube**.
2. **Conecte** la tarjeta del proveedor e ingrese sus credenciales (consulte la página de cada proveedor).
3. **Prueba** la conexión para validar las credenciales.
4. **Sincronización**: la primera sincronización ejecuta una importación completa; Las sincronizaciones posteriores son incrementales y también se ejecutan según una programación.

<Info>
**Donde aparecen las cosas**

La **configuración** del conector se encuentra en **Administrador → Integraciones**. El **inventario** que produce aparece en **Admin → Registro de agentes**: agentes/modelos descubiertos en [Sensores de nube](/discovery/cloud-sensors) e identidades descubiertas en [Inventario NHI](/discovery/nhi-inventory). Puedes volver a ejecutar una sincronización desde cualquier lugar.
</Info>

## Elegir credenciales

Utilice credenciales de **solo lectura/visor** siempre que sea posible: SecureAI solo necesita *leer* su inventario para crear la imagen. Algunas capacidades opcionales (revocar una clave filtrada, crear una alerta de gasto) requieren permisos de escritura adicionales; cada página del proveedor los menciona explícitamente y siempre son opcionales.

Todos los secretos que ingresa (secretos de cliente, JSON de cuenta de servicio, claves API de administrador) están **cifrados en reposo**.

## Guías de proveedores

| Proveedor | Tipo de credencial |
|----------|-----------------|
| [Plataforma OpenAI](/integrations/cloud/openai-platform) | Clave API de administración de la organización |
| [Anthropic Console](/integrations/cloud/anthropic-console) | Clave API de administración (+ claves opcionales de espacio de trabajo/cumplimiento) |
| [Azure AI Foundry](/integrations/cloud/azure-ai-foundry) | Principal de servicio de entrada (inquilino/cliente/secreto) |
| [Google Vertex AI](/integrations/cloud/gcp-vertex-ai) | JSON de cuenta de servicio |

## Relacionado

- [Sensores de nube](/discovery/cloud-sensors): el inventario de agente/modelo descubierto.
- [NHI Inventory](/discovery/nhi-inventory): el inventario de identidad descubierto y los controles de revocación.
- [Descripción general del inventario y descubrimiento de IA](/discovery/overview)