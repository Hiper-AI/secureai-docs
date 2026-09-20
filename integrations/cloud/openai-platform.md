---
sidebar_position: 2
title: "Integración con OpenAI Platform"
sidebar_label: "OpenAI Platform"
description: "Conecte la plataforma OpenAI para que SecureAI pueda inventariar proyectos, modelos, claves, uso y costos."
---

# OpenAI Platform

Conecte su organización OpenAI para que SecureAI pueda inventariar proyectos, modelos, miembros, claves API, cuentas de servicio, gastos y actividad de auditoría, y revelar claves filtradas o con privilegios excesivos para su reparación.

## Qué importa SecureAI

- **Proyectos, modelos, miembros, roles y grupos**
- **NHI**: claves API y cuentas de servicio (revocables; consulte [Inventario de NHI](/discovery/nhi-inventory))
- **Alertas de gasto, límites de tarifas, certificados y configuración de retención de datos**
- **Registros de auditoría**
- **Uso y costo** durante los últimos 30 días, incluido el gasto por usuario

## Requisitos previos

- Un **propietario de la organización** (o administrador) en la plataforma OpenAI.
- Una **Clave API de administrador** (`sk-admin-…`). Se requieren claves de administrador para leer los proyectos, los miembros y el uso de toda la organización.

## Credenciales

| Campo | Requerido | Descripción |
|-------|----------|-------------|
| `adminApiKey` | Sí | Clave **admin** de la organización, formato `sk-admin-…`. Cifrado en reposo. |
| `projectApiKey` | No | Una o más claves de proyecto (una por línea), solo necesarias para el inventario de Asistentes heredado. |
| `organizationId` | Sí | Su identificación `org-…`; elimina la ambigüedad cuando una clave abarca varias organizaciones. |

### Dónde obtener la clave de administrador

1. Inicie sesión en la [Plataforma OpenAI](https://platform.openai.com/) como propietario de una organización y vaya a **Organization settings** (menú inferior izquierdo).

   <div class="mac-window">
   ![Organization settings en OpenAI Platform](/img/cloud/openai-platform/1%20-%20OpenAI%20Platform%20Integration.png)
   </div>

2. Vaya a **Admin keys → Create new admin key**. Póngale un nombre (por ejemplo `SecureAI`), deje **Vencimiento** en `Nunca` y elija **Restricted** con estos permisos:

   | Grupo | Nivel | Por qué |
   |-------|-------|---------|
   | **Organization Administration** | Write | El conector lee proyectos/miembros/roles/grupos/certificados/retención, y además **escribe**: revoca API keys (NHI), crea/actualiza/borra spend alerts y actualiza rate limits |
   | **Usage API Scope** | Read | Solo hace `GET` a usage/costs de los últimos 30 días |
   | **Audit Logs Scope** | Read | Solo hace `GET /v1/organization/audit_logs` |
   | **Fine-tuning Checkpoints** | Opcional | El conector no llama ningún endpoint de fine-tuning; puede dejarlo en `Read` (valor por defecto) sin que tenga efecto |

   <div class="mac-window">
   ![Crear admin key con permisos restringidos](/img/cloud/openai-platform/2%20-%20OpenAI%20Platform%20Integration.png)
   </div>

3. Haga clic en **Create admin key** y copie el valor (se muestra una sola vez, formato `sk-admin-…`).

4. Busque el `organizationId` en **Organization settings → General → Organization ID** (formato `org-…`).

   <div class="mac-window">
   ![Organization ID en OpenAI Platform](/img/cloud/openai-platform/3%20-%20OpenAI%20Platform%20Integration.png)
   </div>

## Conectar

1. **Administrador → Integraciones → Nube → Plataforma OpenAI → Connect Integration.**
2. Pegue la clave API de administrador y el `organizationId`, y haga clic en **Connect**.

   <div class="mac-window">
   ![Modal de configuración de OpenAI Platform en SecureAI](/img/cloud/openai-platform/4%20-%20OpenAI%20Platform%20Integration.png)
   </div>

3. Espere a la primera sincronización.

## Verificar

Después de la primera sincronización, abra [Sensores de nube](/discovery/cloud-sensors) para ver los modelos/asistentes descubiertos y [Inventario NHI](/discovery/nhi-inventory) para ver claves y cuentas de servicio. **Estadísticas** por proveedor muestran el uso, el costo y el gasto por usuario.

## Revocación

Las claves API de OpenAI son **revocables** de [NHI Inventory](/discovery/nhi-inventory): SecureAI puede desactivar una clave en la fuente. (Para las cuentas de servicio, las identidades de OpenAI son solo de monitoreo).

## Relacionado

- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Inventario NHI](/discovery/nhi-inventory)