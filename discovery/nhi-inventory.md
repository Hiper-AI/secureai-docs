---
sidebar_position: 4
title: "Inventario de NHIs (Identidades No Humanas)"
sidebar_label: "Inventario de NHIs"
description: "Realice un inventario y gobierne las identidades no humanas (claves API y cuentas de servicio) detrás de sus cargas de trabajo y agentes de IA."
---

# Inventario del NHI

El **Inventario NHI** (Administrador → Registro de agentes → **Identidades no humanas**) es el inventario de las credenciales de la máquina detrás de su IA: las claves API, las cuentas de servicio y las claves BYOK que utilizan los agentes, los servidores MCP y las cargas de trabajo. Reúne las identidades descubiertas por cada conector [Proveedor de IA en la nube](/integrations/cloud/overview), califica su riesgo y le brinda controles para bloquearlas o revocarlas.

## Lo que muestra cada identidad

- **Proveedor** (SecureAI / OpenAI / Anthropic / Azure / GCP / AWS) y **tipo** (agente/mcp/carga de trabajo).
- **Puntuación de riesgo** (0–100) con factores contribuyentes (ver más abajo).
- **Veredicto SMLTP** chip (bloqueado/aplicado/monitorizado) y recuento de recibos.
- **Usado por**, **último uso** (días de inactividad), **rotación** y una **cuenta regresiva de vencimiento**.
- **Estado**: saludable/remediación/crítico.

## Niveles de control

Cuánto puedes *hacer* con una identidad depende de cómo se descubrió:

| Nivel | Lo que significa | Acción disponible |
|-------|---------------|------------------|
| **Administrado** | Una identidad emitida por SecureAI (no en la nube). | **Bloquear/Desbloquear** en la puerta de enlace: niega o restaura cualquier solicitud autenticada por esa identidad y envía la lista de revocación de la puerta de enlace. |
| **Revocable** | Descubierto en la nube **y** ejecutable en el origen. | **Revocar** — el candado ("candadito"): elimina/inhabilita la clave **en el proveedor**. Irreversible; marca la identidad bloqueada/crítica. |
| **Solo monitor** | Descubierto en la nube pero no aplicable. | Sólo lectura. La inactividad por sí sola nunca lo convierte en crítico (agrega un pequeño factor de riesgo exclusivo del monitor). |

### ¿Qué nubes son revocables?

| Tipo de identidad | Revocable en origen | Sólo monitor |
|---------------|---------------------|--------------|
| **Claves API** | OpenAI, Antrópico, GCP, Azure, AWS | — |
| **Cuentas de servicio/claves BYOK** | Antrópico, GCP, Azure | OpenAI, AWS |

## Acciones

| Acción | Efecto |
|--------|--------|
| **Bloquear / Desbloquear** | Solicitudes de denegación/restauración autenticadas mediante la clave SecureAI de una identidad administrada (lista de revocación de puerta de enlace). |
| **Revocar** | Cortar una identidad revocable en el proveedor. Requiere que la identidad sea ejecutable con una identificación externa; de lo contrario, devuelve "no revocable en la fuente". |
| **Marca rotada** | Registre que se giró una llave. |
| **Registrar/rotar clave de firma** | Administre las claves de firma SET para la identidad. |

## Puntuación de riesgo

El barredor de gobernanza calcula una puntuación compuesta de 0 a 100 a partir de factores que incluyen: inactivo/inactivo-crítico, rotación vencida/rotación crítica, caducado/caducará pronto, alcances amplios, sin propietario, reactivado y solo monitor. La reactivación de una identidad previamente inactiva genera una alerta.

## Relacionado

- [Proveedores de IA en la nube](/integrations/cloud/overview): la fuente de las identidades descubiertas.
- [Sensores de nube](/discovery/cloud-sensors)
- [Descripción general del inventario y descubrimiento de IA](/discovery/overview)