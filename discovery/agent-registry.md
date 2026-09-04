---
sidebar_position: 5
title: "Registro de Agentes y Modelos Locales"
sidebar_label: "Registro de Agentes"
description: "Gobierna tus chatbots y agentes lógicos de IA: propietarios, propósito, nivel de autonomía, riesgo y vinculaciones"
---

# Registro de agentes

El **Registro de agentes** (Administrador → Registro de agentes → **Agentes de IA**) es el inventario de gobernanza de sus chatbots y agentes de IA **lógicos**: las aplicaciones y asistentes que su organización crea y ejecuta. Registra los metadatos necesarios para gobernar cada uno: quién es el propietario, para qué sirve, qué tan autónomo es y a qué está conectado.

<Info>
**No es la flota de terminales**

El Registro de agentes trata sobre agentes de IA *lógicos* (un chatbot de soporte, un copiloto interno). Es diferente de la flota de **Agentes OS**: el software SecureAI instalado en los endpoints, documentado en [Endpoint Agent](/agent/overview).
</Info>

## Qué se registra por agente

| Campo | Descripción |
|-------|-------------|
| **Propietario** | El usuario/equipo responsable. |
| **Propósito** | Lo que hace el agente. |
| **Autonomía** | Nivel **L1–L3**, desde asistencial hasta totalmente autónomo. |
| **Riesgo** | Calificación de riesgo de gobernanza. |
| **Encuadernaciones** | Servidores MCP conectados y conjuntos de datos/bases de conocimiento. |
| **Monitoreo** | Para chatbots, la configuración de monitoreo/Prompt-Shield. |

## Trabajar con el registro

- **Importar** agentes para iniciar el inventario.
- Revisar **relaciones** entre agentes, sus herramientas y sus datos.
- **Aplicar autonomía sugerida**: acepta un nivel de autonomía recomendado para un agente.
- Registrar chatbots para monitoreo; un chatbot visto por primera vez a través de la [API Prompt Shield](/api/threat-defense/prompt-shield) se registra automáticamente aquí como `observed` para su revisión.

## Relacionado

- [Endpoint Agent](/agent/overview): la flota de agentes a nivel del sistema operativo (distinta de esta).
- [NHI Inventory](/discovery/nhi-inventory): las identidades con las que los agentes se autentican.
- [API Prompt Shield](/api/threat-defense/prompt-shield): registra automáticamente los chatbots.
- [Descripción general del inventario y descubrimiento de IA](/discovery/overview)