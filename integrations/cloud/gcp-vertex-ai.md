---
sidebar_position: 6
title: "Google Cloud — Descubrimiento"
sidebar_label: "Google Cloud — Descubrimiento"
description: "Conecte Google Cloud para que SecureAI pueda inventariar agentes, modelos, cuentas de servicio, claves, IAM, uso y costos de Vertex AI."
---

# Google Cloud — Descubrimiento

Conecte su proyecto de Google Cloud para que SecureAI pueda inventariar los agentes, endpoints y modelos de Vertex AI, junto con las cuentas de servicio, claves, vinculaciones de IAM, registros de auditoría, uso y costos que los rodean.

<Info>
Esta tarjeta **solo lee** el proyecto y nunca envía un prompt. Si lo que busca es ejecutar el tráfico de LLM de SecureAI en su propia cuenta de Google Cloud, consulte [Google Vertex AI — Inferencia en tu cuenta](/integrations/cloud/vertex-ai-inference).
</Info>

## Qué importa SecureAI

- **Vertex AI**: agentes (Agent Engine), endpoints de serving, jobs de batch y de tuning en curso, y modelos — el Model Registry más cada modelo de publisher en uso (Gemini, Claude, modelos abiertos).
- **Uso** de los últimos 30 días, por modelo: solicitudes (y cuántas fallaron), tokens de entrada y de salida, y tokens de caché de prompts.
- **Costo** de los últimos 30 días: el gasto real en IA de este proyecto, tomado de su exportación de facturación a BigQuery, o una estimación a precio de lista.
- **NHI**: cuentas de servicio, claves de cuenta de servicio administradas por el usuario, claves API, pools y proveedores de Workload Identity Federation, y clientes OAuth — con la última vez que se autenticó cada clave y cada cuenta de servicio. Revocables desde el [Inventario de NHI](/discovery/nhi-inventory).
- Vinculaciones de roles de **IAM** del proyecto.
- **Registros de auditoría de la nube** de los servicios de IA e identidad (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): los últimos 200 eventos de los últimos 30 días.

## Requisitos previos

Una cuenta de servicio con la que actúa SecureAI. Otórguele estos roles **en el proyecto** (**IAM y administración → IAM → Otorgar acceso**):

| Rol | Qué habilita | |
|-----|--------------|---|
| `roles/aiplatform.viewer` | Agentes, endpoints, jobs y modelos de Vertex AI | Obligatorio |
| `roles/iam.securityReviewer` | Cuentas de servicio, claves, claves API, Workload Identity, clientes OAuth, vinculaciones de IAM | Obligatorio |
| `roles/monitoring.viewer` | Solicitudes y tokens por modelo | Recomendado |
| `roles/logging.viewer` | Registros de auditoría de la nube | Recomendado |
| `roles/policyanalyzer.activityAnalysisViewer` | Último uso de cada clave y cuenta de servicio | Opcional |

Para el **costo real**, los datos de Cloud Billing tienen que estar [exportados a BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=es-419), y la cuenta de servicio necesita `roles/bigquery.dataViewer` en el dataset de la exportación y `roles/bigquery.jobUser` en el proyecto que ejecuta la consulta.

Para **revocar desde SecureAI** (opcional), otorgue además el rol de cada acción que quiera permitir:

| Acción | Rol |
|--------|-----|
| Deshabilitar una cuenta de servicio | `roles/iam.serviceAccountAdmin` |
| Borrar una clave de cuenta de servicio | `roles/iam.serviceAccountKeyAdmin` |
| Borrar una clave API | `roles/serviceusage.apiKeysAdmin` |
| Deshabilitar un pool o proveedor de Workload Identity | `roles/iam.workloadIdentityPoolAdmin` |
| Deshabilitar un cliente OAuth | `roles/iam.oauthClientAdmin` |

<Note>
**No** hace falta `roles/billing.viewer`: es un rol de cuenta de facturación, no se puede otorgar en un proyecto y el conector no lo usa.
</Note>

Nada se omite en silencio: lo que SecureAI no puede leer aparece con el rol que lo resuelve — al conectar, después de cada sincronización y en el panel de GCP.

## Credenciales

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `projectId` | Sí | El **ID** del proyecto (por ejemplo, `mi-proyecto-123`) — no el nombre ni el número. |
| `location` | Sí | Ubicación de Vertex AI donde están sus agentes y endpoints (por ejemplo, `us-central1`, `europe-west4`, `global`). El uso y el costo cubren todas las ubicaciones. |
| `locations` | No | Varias ubicaciones, separadas por comas (hasta 10). Reemplaza a `location`. |
| `serviceAccountJson` | Uno de los dos | La clave JSON de la cuenta de servicio. Cifrada en reposo. |
| `impersonateServiceAccount` | Uno de los dos | Sin clave: el email de la cuenta de servicio que SecureAI suplanta. Aparece solo cuando su despliegue ofrece acceso sin clave. |
| `billingExportTable` | No | `proyecto.dataset.tabla` de su exportación de facturación (por ejemplo, `mi-facturacion.billing_export.gcp_billing_export_v1_XXXXXX`). |
| `billingProjectId` | No | Proyecto que ejecuta la consulta de BigQuery. Por defecto, el de la tabla; un nombre `dataset.tabla` se busca en este proyecto (o en `projectId` si está vacío). |

### Dónde conseguirlas

**Opción A — clave JSON**

1. En la [consola de Google Cloud](https://console.cloud.google.com/), vaya a **IAM y administración → Cuentas de servicio → Crear cuenta de servicio** (por ejemplo, `secureai-discovery`).
2. Vaya a **IAM y administración → IAM → Otorgar acceso**, ingrese el email de la cuenta de servicio como principal y agregue los roles de [Requisitos previos](#requisitos-previos).
3. De vuelta en **Cuentas de servicio**, abra la cuenta → **Claves → Agregar clave → Crear clave nueva → JSON**, y descargue el archivo.
4. Pegue el JSON **completo** en `serviceAccountJson` y después borre el archivo descargado.

Lo mismo con `gcloud`:

```bash
PROJECT=mi-proyecto-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
Si Google responde que la creación de claves de cuenta de servicio está deshabilitada, su organización aplica la política `iam.disableServiceAccountKeyCreation` — la predeterminada en las organizaciones creadas desde 2024. Use la opción B, o pida a su administrador de la organización una excepción para este proyecto.
</Warning>

**Opción B — sin clave (suplantación)**

1. Cree la cuenta de servicio y otórguele los roles (pasos 1 y 2 de arriba).
2. En el formulario de conexión de SecureAI, el campo **Service account to impersonate** indica qué cuenta de SecureAI hay que autorizar. En Google Cloud, abra su cuenta de servicio → **Permisos → Otorgar acceso**, ingrese esa cuenta como principal y asígnele `roles/iam.serviceAccountTokenCreator`.
3. Ingrese el email de su cuenta de servicio en el campo y deje el JSON vacío.

Si el campo no aparece, su despliegue no ofrece acceso sin clave: use la opción A.

## Conectar

1. **Administrador → Integraciones → Nube → Google Cloud — Descubrimiento → Conectar.**
2. Ingrese el ID del proyecto, la ubicación (o varias en **More Vertex AI Locations**) y la clave JSON o la cuenta de servicio a suplantar. Agregue los campos de facturación si usa la exportación.
3. Haga clic en **Conectar**. Antes de guardar, SecureAI verifica las credenciales con una lectura real del proyecto; demora unos segundos. Si no puede leer el proyecto (ID incorrecto, sin roles, ubicación mal escrita), muestra el motivo y no guarda nada; lo que ingresó queda en el formulario.
4. Si guarda pero faltan roles, un aviso los enumera. Otórguelos y vuelva a sincronizar.
5. Sincronice ahora con el botón de actualizar de la tarjeta. Después, SecureAI sincroniza solo cada 6 horas.

Para cambiar las credenciales más adelante, use **Conectar** de nuevo. Los campos que deje vacíos conservan el valor guardado; ingresar una clave JSON reemplaza una suplantación guardada, y viceversa.

## Verificar

- [Sensores de nube](/discovery/cloud-sensors) lista los agentes descubiertos. Haga clic en la tarjeta de Google Cloud para abrir el panel de GCP: uso y costos (solicitudes, fallas, tokens, caché, costo y su origen), modelos y despliegues, identidad y acceso (cuentas de servicio y claves con su último uso, vinculaciones de IAM) y auditoría.
- Si el panel dice **El descubrimiento no pudo leer todo**, otorgue los roles que enumera y vuelva a sincronizar.
- El [Inventario de NHI](/discovery/nhi-inventory) muestra las cuentas de servicio y las claves.

Si una sincronización falla (por ejemplo, porque se borró la clave o se quitaron los roles), la tarjeta muestra el error y SecureAI reintenta con espera progresiva, conservando el último inventario. Una lectura parcial nunca retira agentes ni elimina identidades.

## Costo

- **Con `billingExportTable`**: el gasto real de este proyecto en servicios de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), neto de créditos, en la moneda de su cuenta de facturación. Si los créditos cubren el uso, el neto puede ser cero; el panel muestra al lado el importe antes de créditos. Google actualiza la exportación con varias horas de demora.
- **Sin ella**: una estimación — tokens de Cloud Monitoring × precio de lista, incluidos Claude y los tokens de caché. No refleja descuentos ni contratos de uso comprometido.

## Revocación

Las identidades de GCP son revocables desde el [Inventario de NHI](/discovery/nhi-inventory) (candado) cuando el conector tiene el rol de esa acción (vea [Requisitos previos](#requisitos-previos)). Qué hace cada una en Google:

| Identidad | Qué pasa en Google | ¿Reversible? |
|-----------|--------------------|--------------|
| Cuenta de servicio | Se deshabilita | Sí — se vuelve a habilitar en Google Cloud |
| Clave de cuenta de servicio | Se borra | No |
| Clave API | Se borra | Se puede restaurar durante 30 días en Google Cloud |
| Pool / proveedor de Workload Identity, cliente OAuth | Se deshabilita | Sí |

Protecciones:

- La cuenta de servicio que usa el conector, y sus claves, no se pueden revocar desde SecureAI: cortaría el descubrimiento. Rótelas en Google Cloud.
- Las cuentas de servicio predeterminadas de Google (la predeterminada de Compute Engine, App Engine, Cloud Build, agentes de servicio) piden una segunda confirmación: deshabilitar una detiene cada VM, aplicación o build que se ejecuta con ella.
- Si al conector le falta el rol de una acción, el error indica cuál.

## Relacionado

- [Google Vertex AI — Inferencia en tu cuenta](/integrations/cloud/vertex-ai-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [SSO de Google Workspace](/iam/google-workspace)
- [Inventario de NHI](/discovery/nhi-inventory)
