---
sidebar_position: 3
title: "Integración con Anthropic Console"
sidebar_label: "Anthropic Console"
description: "Conecte Anthropic Console para que SecureAI pueda inventariar espacios de trabajo, claves, uso, costos y actividad de auditoría"
---

# Anthropic Console

Conecte su organización Anthropic para que SecureAI pueda inventariar espacios de trabajo, claves API, cuentas de servicio, límites de gasto y (en Enterprise) el registro de auditoría y los análisis de Claude Code.

## Qué importa SecureAI

- **Espacios de trabajo**, uso y costo
- **NHI**: claves API, cuentas de servicio y claves BYOK (revocables; consulte [Inventario NHI](/discovery/nhi-inventory))
- **Límites de gasto**
- **Registro de auditoría** (API empresarial/de cumplimiento)
- **Análisis del Claude Code**

## Requisitos previos

- **Administrador** en la Consola Anthropic.
- Una **Clave API de administrador** (`sk-ant-admin…`).
- *(Opcional)* una **clave de espacio de trabajo** para desbloquear los datos de la plataforma del agente y una **clave de API de cumplimiento** (Enterprise) para desbloquear el registro de auditoría.

## Credenciales

| Campo | Requerido | Descripción |
|-------|----------|-------------|
| `adminApiKey` | Sí | Clave de administrador de la organización, formato `sk-ant-admin…`. Cifrado en reposo. |
| `apiKey` | No | Clave de espacio de trabajo: desbloquea el inventario de Agent Platform. |
| `complianceApiKey` | No | Clave API de cumplimiento empresarial: desbloquea el registro de auditoría. |

### Dónde obtener la clave de administrador

1. Inicie sesión en la [Consola Anthropic](https://console.anthropic.com/) como administrador.
2. Vaya a **Configuración → Claves de administrador** (nivel de organización).
3. Cree una clave de administrador y cópiela.

## Conectar

1. **Administrador → Integraciones → Nube → Anthropic Console → Conectar.**
2. Pegue la clave de administrador (y cualquier clave opcional).
3. **Probar**, luego **Guardar**.
4. **Sincronización**.

## Verificar

Abra [Sensores de nube](/discovery/cloud-sensors) para espacios de trabajo/agentes descubiertos y [Inventario NHI](/discovery/nhi-inventory) para claves y cuentas de servicio. Las estadísticas muestran límites de uso, costos y gastos.

## Revocación

Las claves API de Anthropic, las cuentas de servicio y las claves BYOK son **revocables** de [NHI Inventory](/discovery/nhi-inventory).

## Relacionado

- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Inventario NHI](/discovery/nhi-inventory)