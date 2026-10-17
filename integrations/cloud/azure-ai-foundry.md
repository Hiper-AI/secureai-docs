---
sidebar_position: 4
title: "Azure — Descubrimiento"
sidebar_label: "Azure — Descubrimiento"
description: "Conecte Azure y Microsoft Entra ID para que SecureAI inventaríe los recursos de Azure OpenAI y Foundry, los proyectos y agentes de Foundry, AI Search, Bot Service y todas las identidades no humanas (principales de servicio, identidades de agente, identidades administradas, secretos, certificados y credenciales federadas) con sus permisos, además del RBAC, la actividad, el uso y el costo."
---

# Azure — Descubrimiento

Conecte su inquilino de Azure para que SecureAI inventaríe sus recursos de IA en Azure y **todas las identidades no humanas (NHI)** de Microsoft Entra ID, con los roles y permisos que tiene cada una.

<Info>
Esta conexión **solo lee** y nunca envía un prompt. Si lo que busca es ejecutar el tráfico de LLM de SecureAI en su propio recurso de Foundry, consulte [Azure AI Foundry — Inferencia en tu cuenta](/integrations/cloud/azure-ai-foundry-inference). Son dos conexiones independientes, con principales de servicio y permisos distintos, y puede usar las dos sobre la misma suscripción.
</Info>

## Qué importa SecureAI

En cada suscripción que el principal de servicio puede leer:

- **Recursos de IA**: todas las cuentas de Azure AI Services, Azure OpenAI y demás Cognitive Services (Content Safety, Speech, Language, Document Intelligence…), con su región y estado.
- **Despliegues de modelos** de Azure OpenAI y Foundry, con su capacidad y el uso de los últimos 30 días (solicitudes y tokens de entrada y de salida, tomados de Azure Monitor).
- **Proyectos y agentes de Foundry**: los agentes de Foundry Agent Service y los asistentes clásicos de cada proyecto, con el modelo que usa cada uno. También los hubs y proyectos basados en hub (Azure Machine Learning), con sus endpoints en línea y sin servidor.
- **Azure AI Search** y **Azure Bot Service**.
- **Costo** del mes en curso por servicio (Cost Management).
- **Actividad**: los eventos de administración de Cognitive Services y Machine Learning de los últimos 30 días (Registro de actividad).
- **NHI**, visibles en el [Inventario de NHI](/discovery/nhi-inventory):
  - **Principales de servicio** de las aplicaciones empresariales.
  - **Identidades de agente** de Microsoft Entra, las que Foundry crea para cada agente (se clasifican como *agente*).
  - **Identidades administradas**, asignadas por el sistema y por el usuario.
  - **Secretos de cliente** y **certificados** de los registros de aplicaciones, con su vencimiento.
  - **Credenciales federadas** (federación de identidades de carga de trabajo). Por ejemplo, la confianza OIDC de un repositorio de GitHub Actions le permite a ese repositorio obtener tokens como la aplicación, sin ningún secreto.
  - El **último inicio de sesión** de cada aplicación, cuando su inquilino expone ese informe.
- **Permisos de cada identidad**: sus roles de Azure RBAC en cualquier alcance de la suscripción (suscripción, grupo de recursos o recurso), sus permisos de aplicación de Microsoft Graph y sus roles de directorio de Entra.
- **Asignaciones de roles RBAC**: cada rol con su nombre y los usuarios, grupos y aplicaciones que lo tienen.

Una identidad se marca como **privilegiada** cuando tiene alguno de estos permisos:

- uno de los roles **Owner**, **Contributor**, **User Access Administrator** o **Role Based Access Control Administrator**;
- un permiso de Graph de escritura, por ejemplo `Application.ReadWrite.All`, `Directory.ReadWrite.All`, `Mail.Send` o `Files.ReadWrite.All`;
- un rol de administrador del directorio, por ejemplo Global Administrator o Application Administrator.

Los secretos, certificados y credenciales federadas de una aplicación privilegiada también se marcan como privilegiados.

SecureAI no importa los ~130 principales de servicio que Microsoft crea en todos los inquilinos (Azure Portal, Microsoft Graph, etc.) ni las conexiones de inicio de sesión social, porque no son identidades suyas para gobernar.

## Requisitos previos

Un **registro de aplicación** de Microsoft Entra ID (principal de servicio) con un **secreto de cliente** y estos permisos:

| Dónde | Permiso | ¿Obligatorio? | Qué habilita |
|-------|---------|---------------|--------------|
| Suscripción | Rol **Reader** | Sí | Recursos, despliegues, proyectos, identidades administradas, asignaciones de roles, uso y actividad |
| Suscripción | Rol **Cost Management Reader** | Recomendado | Costo del mes por servicio |
| Recurso de Foundry | Rol **Cognitive Services Data Reader** | Recomendado | Agentes de cada proyecto de Foundry |
| Microsoft Graph | `Application.Read.All` (permiso de aplicación) | Sí | Principales de servicio, identidades de agente, aplicaciones, secretos, certificados, credenciales federadas y permisos de Graph |
| Microsoft Graph | `Directory.Read.All` (permiso de aplicación) | Sí | Roles de directorio y nombres de los miembros de cada rol |
| Microsoft Graph | `AuditLog.Read.All` (permiso de aplicación) | Recomendado | Último inicio de sesión de cada aplicación |
| Microsoft Graph | `Application.ReadWrite.All` (permiso de aplicación) | Solo para revocar | Deshabilitar principales de servicio y eliminar secretos, certificados y credenciales federadas desde SecureAI |

Los permisos de Graph necesitan **consentimiento de administrador**. Para leer **todas** sus suscripciones, asigne **Reader** en cada una o en un grupo de administración que las contenga.

<Note>
Los agentes de Foundry viven en el plano de datos del proyecto, no en Azure Resource Manager: **Reader no alcanza para verlos**. Sin **Cognitive Services Data Reader** (o **Foundry User**) sobre el recurso de Foundry, la sincronización funciona igual, pero la lista de agentes queda vacía y SecureAI lo muestra como una brecha. Cognitive Services Data Reader es el rol más acotado que lo permite: solo da lectura del plano de datos.
</Note>

## Paso 1. Cree el principal de servicio

### Con la CLI de Azure

Desde [Azure Cloud Shell](https://shell.azure.com/) o con la CLI `az`. Reemplace `SUB_ID` por su suscripción y, si usa Foundry, `MY_RESOURCE` y `MY_RG` por su recurso y su grupo de recursos:

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

El paso 2 imprime los tres valores que va a pegar en SecureAI. Para **revocar desde SecureAI**, agregue también `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role` (`Application.ReadWrite.All`) en el paso 3 y vuelva a dar el consentimiento.

### Con el portal de Azure

1. En el [portal de Azure](https://portal.azure.com/), vaya a **Microsoft Entra ID → Registros de aplicaciones → Nuevo registro**, póngale un nombre (por ejemplo `SecureAI Discovery`) y regístrela.
2. En **Información general**, copie el **Id. de directorio (inquilino)** y el **Id. de aplicación (cliente)**.
3. En **Certificados y secretos → Secretos de cliente → Nuevo secreto de cliente**, créelo y copie su **Valor** (se muestra una sola vez).
4. En **Permisos de API → Agregar un permiso → Microsoft Graph → Permisos de aplicación**, agregue `Application.Read.All`, `Directory.Read.All` y `AuditLog.Read.All` (y `Application.ReadWrite.All` si quiere revocar desde SecureAI). Luego haga clic en **Conceder consentimiento de administrador**.
5. En **Suscripciones → su suscripción → Control de acceso (IAM) → Agregar asignación de roles**, asigne **Reader** y **Cost Management Reader** a la aplicación.
6. En su **recurso de Foundry → Control de acceso (IAM)**, asigne **Cognitive Services Data Reader** a la aplicación.

<Info>
Los roles de Azure pueden tardar **hasta 5 minutos** en aplicarse, y el consentimiento de Graph unos minutos más. Si la primera sincronización muestra brechas por permisos recién asignados, espere y sincronice de nuevo.
</Info>

<Warning>
Trate el secreto como una contraseña. SecureAI lo guarda **cifrado** y no lo vuelve a mostrar. Los secretos **vencen** (en un año con el comando de arriba): rótelo antes de esa fecha o la sincronización dejará de funcionar.
</Warning>

## Paso 2. Conecte Azure en SecureAI

1. Vaya a **Administrador → Integraciones**, filtre por **Nube** y, en la tarjeta **Azure — Descubrimiento**, haga clic en **Conectar Integración**.
2. Complete los campos:

   | Campo | Qué ingresar |
   |-------|--------------|
   | **ID de inquilino de Azure (Directory ID)** | `tenantId` del paso 1 |
   | **ID de cliente del registro de aplicación** | `clientId` del paso 1 |
   | **Secreto de cliente del registro de aplicación** | `clientSecret` del paso 1. Se guarda cifrado. |
   | **ID de suscripción** (opcional) | Limita la lectura a esa suscripción. Si lo deja vacío, se leen todas las suscripciones donde el principal tiene **Reader**. |

3. Haga clic en **Conectar**. Antes de guardar, SecureAI prueba las credenciales con una lectura real: si el secreto es incorrecto o el principal no puede leer la suscripción, no se guarda nada y el mensaje dice qué falta. Si se conecta pero falta un permiso de Graph, el aviso nombra el permiso.
4. **Sincronice** con el botón de actualizar de la tarjeta. Una sincronización de Azure puede tardar varios minutos (recorre Azure Resource Manager, Microsoft Graph, Azure Monitor y Cost Management). Después, SecureAI sincroniza solo cada 6 horas.

## Paso 3. Verifique

- En [Sensores de nube](/discovery/cloud-sensors) se ven los despliegues, agentes y servicios descubiertos. Haga clic en la tarjeta de Azure para abrir sus Insights:
  - **Uso y costos**: uso y costo;
  - **Modelos y despliegues**: despliegues y agentes;
  - **Identidad y acceso**: identidades con sus roles y la marca *Privilegiada*; secretos, certificados y credenciales federadas; roles RBAC con sus miembros;
  - **Auditoría y logs**: la actividad.
- El [Inventario de NHI](/discovery/nhi-inventory) muestra los principales de servicio, identidades de agente, identidades administradas, secretos, certificados y credenciales federadas, con sus permisos y si son privilegiados.

Si una sincronización falla (por ejemplo, porque venció el secreto), la tarjeta muestra el error y SecureAI reintenta con espera progresiva, conservando el último inventario.

## Brechas de cobertura

Lo que SecureAI no pudo leer no se omite en silencio: al conectar o sincronizar, el aviso nombra el permiso que falta.

| Superficie | Permiso que lo resuelve |
|------------|-------------------------|
| Identidades de Entra (principales de servicio, registros de aplicaciones) | `Application.Read.All` con consentimiento de administrador |
| Permisos de Graph de cada identidad | `Application.Read.All` |
| Roles de directorio | `Directory.Read.All` |
| Asignaciones de roles e identidades administradas | **Reader** en la suscripción |
| Agentes de Foundry | **Cognitive Services Data Reader** en el recurso de Foundry |

Una lectura parcial (un permiso que falta, una página que Azure no devolvió o una limitación de solicitudes) **nunca retira agentes ni elimina identidades** del inventario: SecureAI solo da algo por borrado cuando el listado que lo mostraría respondió completo. Sin las asignaciones de roles, los permisos de una identidad quedan como *desconocidos*, no como "ninguno".

## Revocación

Desde el [Inventario de NHI](/discovery/nhi-inventory) (candado), con `Application.ReadWrite.All`:

| Identidad | Qué pasa en Azure | ¿Reversible? |
|-----------|-------------------|--------------|
| Principal de servicio | Se **deshabilita** (`accountEnabled: false`) | Sí: vuelva a habilitarlo en Entra ID |
| Secreto de cliente | Se **elimina** de la aplicación | No: cree uno nuevo |
| Certificado | Se **quita** de la aplicación | No: vuelva a subirlo |
| Credencial federada | Se **elimina** la confianza | No: vuelva a crearla |
| Identidad administrada asignada por el usuario | Se **elimina** el recurso (además necesita **Managed Identity Contributor** sobre él) | No |

Protecciones:

- SecureAI **no ofrece revocar** el principal de servicio con el que se conecta ni sus secretos, porque cortaría el descubrimiento. Rótelos en Entra ID.
- Las identidades administradas **asignadas por el sistema** no se revocan desde SecureAI: su ciclo de vida es el del recurso de Azure.
- Las credenciales federadas que **Foundry** mantiene en el *blueprint* de identidad de un agente tampoco se revocan desde SecureAI: si se cortan, el agente deja de funcionar.
- Las políticas automáticas de NHI (revocación por antigüedad o por falta de uso) todavía no se aplican a Azure: la revocación es manual.

## Desconectar

En **Administrador → Integraciones → Nube → Azure — Descubrimiento**, eliminar la conexión borra las credenciales guardadas. Para quitarle el acceso a SecureAI del lado de Azure, elimine el registro de aplicación o su secreto.

## Relacionado

- [Azure AI Foundry — Inferencia en tu cuenta](/integrations/cloud/azure-ai-foundry-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Sensores de nube](/discovery/cloud-sensors)
- [Inventario de NHI](/discovery/nhi-inventory)
- [Microsoft Entra ID SSO](/iam/microsoft-entra-id)
