---
sidebar_position: 4
title: "Integración con Azure AI Foundry"
sidebar_label: "Azure AI Foundry"
description: "Conecte Azure AI Foundry/Azure OpenAI para que SecureAI pueda inventariar agentes, modelos, identidades, RBAC, uso y costos."
---

# Azure AI Foundry

Conecte su inquilino de Azure para que SecureAI pueda inventariar los agentes Azure OpenAI/AI Foundry, AI Search, Bot Service y endpoints de ML, junto con las identidades de Entra y RBAC que los gobiernan.

## Qué importa SecureAI

- **Agentes de Azure OpenAI/AI Foundry, búsqueda de IA, servicio de bot y endpoints de aprendizaje automático**
- **NHI**: entidades principales de servicio de Entra, secretos y certificados de aplicaciones e identidades administradas (revocables; consulte [Inventario de NHI](/discovery/nhi-inventory)).
- Asignaciones de roles **Azure RBAC**
- **Registros de actividad**
- **Uso, tokens y gasto** durante los últimos 30 días

## Requisitos previos

- Un registro de la aplicación **Entra ID (Azure AD)** (principal de servicio) con un secreto de cliente.
- **Permisos de la aplicación Microsoft Graph** otorgados con el consentimiento del administrador:
  - `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` (leer).
  - `Application.ReadWrite.All` — **solo** si desea que SecureAI revoque las identidades en la fuente.
- La entidad de servicio asignó una función de **Lector** en las suscripciones/grupos de recursos relevantes.

## Credenciales

| Campo | Requerido | Descripción |
|-------|----------|-------------|
| `tenantId` | Sí | ID del directorio (inquilino). |
| `clientId` | Sí | ID de la aplicación (cliente) del registro de la aplicación. |
| `clientSecret` | Sí | Secreto del cliente. Cifrado en reposo. |
| `subscriptionId` | No | Alcance el descubrimiento de una suscripción específica. |

SecureAI se autentica a través de OAuth2 (flujo principal de servicio de credenciales de cliente).

### Dónde conseguirlos

1. En el [portal de Azure](https://portal.azure.com/), vaya a **Microsoft Entra ID → Registros de aplicaciones → Nuevo registro**.
2. Copie el **ID del directorio (inquilino)** y el **ID de la aplicación (cliente)** de la descripción general de la aplicación.
3. En **Certificados y secretos**, cree un **secreto de cliente** y copie su valor.
4. En **Permisos de API**, agregue los permisos de Microsoft Graph anteriores y **Otorgue consentimiento de administrador**.
5. Asigne a la aplicación la función **Lector** en la suscripción de destino (**Suscripciones → Control de acceso (IAM)**).

## Conectar

1. **Administrador → Integraciones → Nube → Azure AI Foundry → Conectar.**
2. Ingrese inquilino, cliente, secreto (y suscripción opcional).
3. **Probar**, luego **Guardar**.
4. **Sincronización** (las sincronizaciones de Azure pueden tardar varios minutos: multiservicio + gráfico + barridos de registro de actividad).

## Verificar

Abra [Sensores de nube](/discovery/cloud-sensors) para agentes/endpoints descubiertos y [Inventario NHI](/discovery/nhi-inventory) para entidades principales de servicio, secretos e identidades administradas. Las estadísticas muestran RBAC, uso y gasto.

## Revocación

Las entidades principales de servicio, los secretos/certificados de aplicaciones y las identidades administradas de Entra son **revocables** a través de Microsoft Graph desde [NHI Inventory](/discovery/nhi-inventory); esto requiere el permiso `Application.ReadWrite.All` anterior.

## Relacionado

- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Microsoft Entra ID SSO](/iam/microsoft-entra-id)
- [Inventario NHI](/discovery/nhi-inventory)