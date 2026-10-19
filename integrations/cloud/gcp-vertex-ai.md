---
sidebar_position: 6
title: "Google Cloud — Descubrimiento"
sidebarTitle: "Google Cloud"
icon: "/img/icons/google-cloud.svg"
sidebar_label: "Google Cloud — Descubrimiento"
description: "Conecte Google Cloud para que SecureAI pueda inventariar agentes, modelos, cuentas de servicio, claves, IAM, uso y costos de Vertex AI, en un proyecto o en toda una organización."
---

# Google Cloud — Descubrimiento

Conecte su proyecto de Google Cloud (o toda una organización o carpeta) para que SecureAI pueda inventariar los agentes, endpoints y modelos de Vertex AI, junto con las cuentas de servicio, claves, vinculaciones de IAM, registros de auditoría, uso y costos que los rodean.

<Info>
Esta tarjeta **solo lee** el proyecto y nunca envía un prompt. Si lo que busca es ejecutar el tráfico de LLM de SecureAI en su propia cuenta de Google Cloud, consulte [Google Vertex AI — Inferencia en tu cuenta](/integrations/cloud/vertex-ai-inference).
</Info>

## Qué importa SecureAI

- **Vertex AI**: agentes (Agent Engine), endpoints de serving, jobs de batch y de tuning en curso, y modelos — el Model Registry más cada modelo de publisher en uso (Gemini, Claude, modelos abiertos).
- **Agent Builder / Gemini Enterprise y Dialogflow CX** (opcional): los engines de Agent Builder (Discovery Engine) con sus data stores, que se consultan en las ubicaciones `global`, `us` y `eu`; y los agentes de Dialogflow CX, que se consultan en `global` y en las ubicaciones de Vertex AI que configure.
- **Uso por modelo**, de los últimos 30 días: solicitudes (y cuántas fallaron), tokens de entrada y de salida, y tokens de caché de prompts.
- **Uso por credencial**, de los últimos 30 días (Cloud Monitoring): solicitudes totales y solicitudes a APIs de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow) de cada cuenta de servicio y cada clave API. El tráfico de clientes OAuth (personas y herramientas como la consola o `gcloud`) se suma aparte. También da el último uso de esas cuentas y claves.
- **Uso por modelo e identidad** (opcional): qué cuenta de servicio o persona llamó a qué modelo de Vertex AI, tomado de los registros de auditoría de Data Access si usted los tiene activos. Vea [Uso por modelo e identidad](#uso-por-modelo-e-identidad).
- **Vertex AI usado por fuera de SecureAI**: las identidades que llamaron a Vertex AI o Gemini directamente, sin pasar por la conexión de inferencia de SecureAI. Vea [Vertex AI usado por fuera de SecureAI](#vertex-ai-usado-por-fuera-de-secureai).
- **Costo** de los últimos 30 días: el gasto real en IA de este proyecto, tomado de su exportación de facturación a BigQuery, o una estimación a precio de lista.
- **NHI**: cuentas de servicio, claves de cuenta de servicio administradas por el usuario, claves API, pools y proveedores de Workload Identity Federation, y clientes OAuth — con su último uso (de Policy Analyzer y del uso por credencial) y su [riesgo por privilegios](#riesgo-por-privilegios). Revocables y restaurables desde el [Inventario de NHI](/discovery/nhi-inventory), a mano o con [políticas automáticas](#políticas-automáticas-de-nhi).
- Vinculaciones de roles de **IAM** del proyecto.
- **Registros de auditoría de la nube** de los servicios de IA e identidad (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): los últimos 200 eventos de los últimos 30 días.

Por defecto el conector lee **un proyecto**. Con el campo **Organización o carpeta** lee todos los proyectos activos de una organización o carpeta: vea [Modo organización o carpeta](#modo-organización-o-carpeta).

## Requisitos previos

### APIs habilitadas

SecureAI lee cada superficie con la API de Google que corresponde. Habilítelas en el proyecto (**APIs y servicios → Biblioteca**, o con `gcloud services enable`):

| API | Para qué | |
|-----|----------|---|
| `cloudresourcemanager.googleapis.com` | El proyecto y sus vinculaciones de IAM | Obligatoria |
| `iam.googleapis.com` | Cuentas de servicio, claves, Workload Identity, clientes OAuth | Obligatoria |
| `aiplatform.googleapis.com` | Agentes, endpoints, jobs y modelos de Vertex AI | Obligatoria |
| `apikeys.googleapis.com` | Claves API | Recomendada |
| `monitoring.googleapis.com` | Uso por modelo y por credencial | Recomendada |
| `logging.googleapis.com` | Registros de auditoría y logs de Data Access | Recomendada |
| `policyanalyzer.googleapis.com` | Último uso de claves y cuentas de servicio (Policy Analyzer) | Opcional |
| `bigquery.googleapis.com` | Costo real, si usa la exportación de facturación (en el proyecto que ejecuta la consulta) | Opcional |
| `cloudasset.googleapis.com` | Modo organización o carpeta (en el proyecto de la cuenta de servicio) | Solo en ese modo |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | Si usa ese producto |
| `dialogflow.googleapis.com` | Agentes de Dialogflow CX | Si usa ese producto |

Una API deshabilitada no hace fallar la sincronización: aparece como brecha **API deshabilitada en el proyecto — habilitala**, con el nombre del servicio. Agent Builder y Dialogflow son la excepción: si su API está apagada, SecureAI entiende que el proyecto no usa ese producto y no lo marca como brecha.

### Roles

Una cuenta de servicio con la que actúa SecureAI. Otórguele estos roles **en el proyecto** (**IAM y administración → IAM → Otorgar acceso**):

| Rol | Qué habilita | |
|-----|--------------|---|
| `roles/aiplatform.viewer` | Agentes, endpoints, jobs y modelos de Vertex AI | Obligatorio |
| `roles/iam.securityReviewer` | Cuentas de servicio, claves, claves API, Workload Identity, clientes OAuth, vinculaciones de IAM | Obligatorio |
| `roles/monitoring.viewer` | Uso por modelo (solicitudes y tokens) y uso por credencial | Recomendado |
| `roles/logging.viewer` | Registros de auditoría de la nube | Recomendado |
| `roles/policyanalyzer.activityAnalysisViewer` | Último uso de cada clave y cuenta de servicio | Opcional |
| `roles/logging.privateLogViewer` | Uso por modelo e identidad: los logs de Data Access son logs privados, y `roles/logging.viewer` no los lee | Opcional |
| `roles/discoveryengine.viewer` | Engines de Agent Builder / Gemini Enterprise | Opcional |
| `roles/dialogflow.reader` | Agentes de Dialogflow CX | Opcional |

Para el **costo real**, los datos de Cloud Billing tienen que estar [exportados a BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=es-419), y la cuenta de servicio necesita `roles/bigquery.dataViewer` en el dataset de la exportación y `roles/bigquery.jobUser` en el proyecto que ejecuta la consulta.

Para **revocar y restaurar desde SecureAI** (opcional), hace falta el rol de cada acción que quiera permitir. Si su despliegue ofrece acceso sin clave, otórguelos a una [cuenta de servicio aparte, solo para revocar](#cuenta-de-servicio-aparte-para-revocar), y deje la de lectura con roles de solo lectura; si no, otórgueselos a la cuenta de servicio del conector:

| Acción | Rol |
|--------|-----|
| Deshabilitar (o volver a habilitar) una cuenta de servicio | `roles/iam.serviceAccountAdmin` |
| Borrar una clave de cuenta de servicio | `roles/iam.serviceAccountKeyAdmin` |
| Borrar (o restaurar) una clave API | `roles/serviceusage.apiKeysAdmin` |
| Deshabilitar (o volver a habilitar) un pool o proveedor de Workload Identity | `roles/iam.workloadIdentityPoolAdmin` |
| Deshabilitar (o volver a habilitar) un cliente OAuth | `roles/iam.oauthClientAdmin` |

<Note>
**No** hace falta `roles/billing.viewer`: es un rol de cuenta de facturación, no se puede otorgar en un proyecto y el conector no lo usa.
</Note>

Nada se omite en silencio: lo que SecureAI no puede leer aparece con el rol que lo resuelve — al conectar, después de cada sincronización y en el panel de GCP.

## Credenciales

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| **ID del proyecto de Google Cloud** (`projectId`) | Sí | El **ID** del proyecto (por ejemplo, `mi-proyecto-123`) — no el nombre ni el número. En modo organización, es el proyecto de cuota y facturación. |
| **Ubicación de Vertex AI** (`location`) | Sí | Ubicación de Vertex AI donde están sus agentes y endpoints (por ejemplo, `us-central1`, `europe-west4`, `global`). El uso y el costo cubren todas las ubicaciones. |
| **Más ubicaciones de Vertex AI** (`locations`) | No | Varias ubicaciones, separadas por comas (hasta 10). Reemplaza a la ubicación anterior. |
| **JSON de la cuenta de servicio** (`serviceAccountJson`) | Uno de los dos | La clave JSON de la cuenta de servicio. Cifrada en reposo. |
| **Cuenta de servicio a suplantar** (`impersonateServiceAccount`) | Uno de los dos | Sin clave: el email de la cuenta de servicio que SecureAI suplanta. Aparece solo cuando su despliegue ofrece acceso sin clave. |
| **Cuenta de servicio para revocar** (`revokeImpersonateServiceAccount`) | No | Una segunda cuenta de servicio que se usa solo para revocar o restaurar identidades, nunca para leer. Aparece solo cuando su despliegue ofrece acceso sin clave. |
| **Organización o carpeta** (`scope`) | No | `organizations/<número>` o `folders/<número>`: lee todos los proyectos activos que contiene. |
| **Tabla de exportación de facturación de BigQuery** (`billingExportTable`) | No | `proyecto.dataset.tabla` de su exportación de facturación (por ejemplo, `mi-facturacion.billing_export.gcp_billing_export_v1_XXXXXX`). |
| **ID del proyecto de facturación de BigQuery** (`billingProjectId`) | No | Proyecto que ejecuta la consulta de BigQuery. Por defecto, el de la tabla; un nombre `dataset.tabla` se busca en este proyecto (o en el ID del proyecto si está vacío). |

### Dónde conseguirlas

**Opción A — clave JSON**

1. En la [consola de Google Cloud](https://console.cloud.google.com/), vaya a **IAM y administración → Cuentas de servicio → Crear cuenta de servicio** (por ejemplo, `secureai-discovery`).
2. Vaya a **IAM y administración → IAM → Otorgar acceso**, ingrese el email de la cuenta de servicio como principal y agregue los roles de [Requisitos previos](#requisitos-previos).
3. De vuelta en **Cuentas de servicio**, abra la cuenta → **Claves → Agregar clave → Crear clave nueva → JSON**, y descargue el archivo.
4. Pegue el JSON **completo** en **JSON de la cuenta de servicio** y después borre el archivo descargado.

Lo mismo con `gcloud`:

```bash
PROJECT=mi-proyecto-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# Opcionales: último uso, uso por modelo e identidad, Agent Builder y Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

Si usa Agent Builder o Dialogflow CX, sus APIs ya están habilitadas en el proyecto; no hace falta habilitarlas para SecureAI.

<Warning>
Si Google responde que la creación de claves de cuenta de servicio está deshabilitada, su organización aplica la política `iam.disableServiceAccountKeyCreation` — la predeterminada en las organizaciones creadas desde 2024. Use la opción B, o pida a su administrador de la organización una excepción para este proyecto.
</Warning>

**Opción B — sin clave (suplantación)**

1. Cree la cuenta de servicio y otórguele los roles (pasos 1 y 2 de arriba).
2. En el formulario de conexión de SecureAI, la ayuda del campo **Cuenta de servicio a suplantar (sin clave — en vez del JSON)** indica qué cuenta de SecureAI hay que autorizar. En Google Cloud, abra su cuenta de servicio → **Permisos → Otorgar acceso**, ingrese esa cuenta como principal y asígnele `roles/iam.serviceAccountTokenCreator`. Con `gcloud`:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:CUENTA_DE_SECUREAI --role=roles/iam.serviceAccountTokenCreator
   ```

3. Ingrese el email de su cuenta de servicio en el campo y deje el JSON vacío.

Si el campo no aparece, su despliegue no ofrece acceso sin clave: use la opción A.

### Cuenta de servicio aparte para revocar

Si su despliegue ofrece acceso sin clave, puede separar la lectura de la revocación. Es lo recomendado en lugar de darle los roles de revocación a la cuenta de servicio que lee:

1. Cree una segunda cuenta de servicio (por ejemplo, `secureai-revoke`) y otórguele **solo** los roles de revocación de [Requisitos previos](#requisitos-previos).
2. Sobre esa cuenta, otórguele `roles/iam.serviceAccountTokenCreator` a la cuenta de SecureAI que indica la ayuda del campo **Cuenta de servicio para revocar (opcional — aparte de la de lectura)**.
3. Ingrese su email en ese campo.

SecureAI le pide a esa cuenta un token de 1 hora solo mientras revoca o restaura una identidad; la sincronización nunca la usa. La cuenta de servicio de lectura queda con roles de solo lectura. SecureAI tampoco permite revocar la cuenta de revocación desde el inventario.

## Modo organización o carpeta

Para inventariar varios proyectos con un solo conector, complete **Organización o carpeta** con `organizations/<número>` o `folders/<número>` (por ejemplo, `organizations/123456789012`).

- SecureAI encuentra los proyectos activos con **Cloud Asset Inventory** y lee cada uno como si fuera un conector de un solo proyecto. El **ID del proyecto de Google Cloud** sigue siendo el proyecto de cuota y facturación.
- Otorgue a la cuenta de servicio, **en la organización o carpeta**: `roles/cloudasset.viewer`, `roles/iam.securityReviewer` y `roles/aiplatform.viewer`, más `roles/monitoring.viewer` y `roles/logging.viewer` para uso y auditoría.
- Habilite `cloudasset.googleapis.com` en el proyecto de la cuenta de servicio.

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

Para una carpeta, use `gcloud resource-manager folders add-iam-policy-binding <número>` en lugar de `gcloud organizations add-iam-policy-binding`.

Para que una sincronización termine en un tiempo razonable, cada una tiene topes. Primero va el proyecto de cuota, después los proyectos con recursos de Vertex AI:

| Qué | Tope por sincronización |
|-----|-------------------------|
| Proyectos inventariados | 200 |
| Uso por modelo (Cloud Monitoring) fuera del alcance de métricas del proyecto de cuota | 15 proyectos con Vertex AI |
| Registros de auditoría | 25 proyectos |
| Uso por modelo e identidad (logs de Data Access) | 10 proyectos |

Lo que queda fuera de un tope aparece como brecha parcial, con la cantidad leída. Un proyecto que no se puede leer también queda como brecha, y **nada de él se retira ni se poda**. Al conectar, la prueba en este modo solo enumera la primera página de proyectos y verifica el proyecto de cuota: la lectura de cada proyecto la hace la sincronización.

## Conectar

1. **Administrador → Integraciones → Nube → Google Cloud — Descubrimiento → Conectar Integración.**
2. Ingrese el ID del proyecto, la ubicación (o varias en **Más ubicaciones de Vertex AI**) y la clave JSON o la cuenta de servicio a suplantar. Agregue, si los usa, la cuenta de servicio para revocar, la organización o carpeta y los campos de facturación.
3. Haga clic en **Conectar**. Antes de guardar, SecureAI verifica las credenciales con una lectura real del proyecto; demora unos segundos. Si no puede leer el proyecto, muestra el motivo y no guarda nada; lo que ingresó queda en el formulario. Los mensajes posibles están en [Solución de problemas](#solución-de-problemas).
4. Si guarda pero faltan roles, un aviso los enumera. Otórguelos y vuelva a sincronizar.
5. Sincronice ahora con el botón de actualizar de la tarjeta. Después, SecureAI sincroniza solo cada 6 horas.

Para cambiar las credenciales más adelante, use **Conectar** de nuevo. Los campos que deje vacíos conservan el valor guardado; ingresar una clave JSON reemplaza una suplantación guardada, y viceversa.

## Verificar

- [Sensores de nube](/discovery/cloud-sensors) lista los agentes descubiertos. Haga clic en la tarjeta de Google Cloud para abrir el panel de GCP: uso y costos (solicitudes, fallas, tokens, caché, costo y su origen), modelos y despliegues, identidad y acceso (cuentas de servicio y claves con su último uso, vinculaciones de IAM) y auditoría.
- Si el panel dice **El descubrimiento no pudo leer todo**, revise cada línea (vea [Solución de problemas](#solución-de-problemas)) y vuelva a sincronizar.
- El [Inventario de NHI](/discovery/nhi-inventory) muestra las cuentas de servicio y las claves.

Si una sincronización falla (por ejemplo, porque se borró la clave o se quitaron los roles), la tarjeta muestra el error y SecureAI reintenta con espera progresiva, conservando el último inventario. Una lectura parcial nunca retira agentes ni elimina identidades.

## Uso por modelo e identidad

Cloud Monitoring dice cuántas solicitudes hizo cada credencial, pero no a qué modelo. Para saber **qué identidad llamó a qué modelo**, SecureAI lee los registros de auditoría de **Data Access** de Vertex AI. Es opcional y depende de usted:

- SecureAI los lee solo si los registros **DATA_READ** o **DATA_WRITE** están activos para `aiplatform.googleapis.com` (o para todos los servicios). SecureAI lo detecta en la política de IAM; nunca los activa.
- Activarlos tiene un **costo de ingesta en Cloud Logging**, según la tarifa de Google. Se activan en **IAM y administración → Registros de auditoría → Vertex AI API → Lectura de datos**.
- La cuenta de servicio necesita `roles/logging.privateLogViewer`.
- Por proyecto y sincronización, SecureAI lee hasta 5000 entradas o durante 20 segundos, lo que ocurra primero.
- Si no están activos, el panel muestra una brecha opcional que explica cómo activarlos. Si los activó en la organización o carpeta pero conecta un solo proyecto, SecureAI no puede verlo desde la política del proyecto y muestra la brecha igual.

## Riesgo por privilegios

Con la política de IAM leída, SecureAI marca como **privilegiada** a una cuenta de servicio que tiene alguno de estos roles:

- Owner (`roles/owner`) o Editor (`roles/editor`);
- cualquier rol de administración (`roles/<servicio>.admin` o terminado en `Admin`);
- `roles/iam.serviceAccountTokenCreator` o `roles/iam.serviceAccountUser`, que permiten actuar como otras cuentas de servicio.

Una clave de usuario de una cuenta de servicio privilegiada hereda la marca: quien tenga la clave tiene ese privilegio. Las claves API **sin restricciones** (sin API de destino y sin restricción de aplicación) también se marcan. En el [Inventario de NHI](/discovery/nhi-inventory) aparecen entre los factores de riesgo como **Privilegiada (rol de administración o de suplantación)** y **API key sin restricciones**. Si la política de IAM no se pudo leer, SecureAI no marca nada en lugar de dar una cuenta por no privilegiada.

## Vertex AI usado por fuera de SecureAI

En el panel de GCP, la pestaña **Identidad y acceso** incluye **Vertex AI usado por fuera de SecureAI**: las identidades que llamaron a Vertex AI o Gemini directamente en los últimos 30 días, sin pasar por la [conexión de inferencia de Vertex AI](/integrations/cloud/vertex-ai-inference). Esos prompts no pasaron por DLP, políticas ni recibos firmados.

- Con los logs de auditoría de Data Access activos (vea [Uso por modelo e identidad](#uso-por-modelo-e-identidad)), cada fila dice qué modelos llamó y cuántas veces, y solo cuenta llamadas de inferencia.
- Sin ellos, el número sale de Cloud Monitoring por credencial (cuenta de servicio o clave API) e incluye toda llamada a una API de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow), no solo inferencia.
- Nunca cuenta la cuenta de servicio de la conexión de inferencia ni la del conector. A las personas no las lista una por una: sus llamadas van en una sola fila agregada (**Personas (cuentas de Google)**, o **Personas y herramientas (OAuth)**: consola, gcloud, apps).
- Si SecureAI no pudo leer la conexión de inferencia en esa sincronización, no clasifica nada, lo indica como brecha opcional y conserva lo de la sincronización anterior.
- Genera el hallazgo de Insights **Google Vertex AI / Gemini is being used outside SecureAI**: moderado, y crítico si quien llama es una clave API (una credencial de larga vida). Se mapea a OWASP LLM02, ISO/IEC 42001 A.4.2 y A.6.2.6, y NIST AI RMF MAP-1.1 y GOVERN-6.1.

## Costo

- **Con la tabla de exportación de facturación**: el gasto real de este proyecto en servicios de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), neto de créditos, en la moneda de su cuenta de facturación. Si los créditos cubren el uso, el neto puede ser cero; el panel muestra al lado el importe antes de créditos. Google actualiza la exportación con varias horas de demora.
- **Sin ella**: una estimación — tokens de Cloud Monitoring × precio de lista, incluidos Claude y los tokens de caché. No refleja descuentos ni contratos de uso comprometido.

## Revocación y restauración

Las identidades de GCP son revocables desde el [Inventario de NHI](/discovery/nhi-inventory) (candado) cuando el conector, o la cuenta de servicio para revocar, tiene el rol de esa acción (vea [Requisitos previos](#requisitos-previos)). Qué hace cada una en Google:

| Identidad | Qué pasa en Google | ¿Reversible? |
|-----------|--------------------|--------------|
| Cuenta de servicio | Se deshabilita | Sí — **Restaurar** la vuelve a habilitar |
| Clave de cuenta de servicio | Se borra | No — Google la destruye. Cree una clave nueva |
| Clave API | Se borra | Sí, durante 30 días — **Restaurar** la recupera; después Google ya no la conserva |
| Pool / proveedor de Workload Identity, cliente OAuth | Se deshabilita | Sí — **Restaurar** lo vuelve a habilitar |

Para deshacer una revocación, abra el menú de la identidad en el Inventario de NHI y elija **Restaurar** (*Deshacer la revocación en Google Cloud*). La identidad se vuelve a habilitar en Google Cloud y en SecureAI queda desbloqueada y en **En remediación** hasta que la revise.

- Solo se puede restaurar lo que **SecureAI revocó en Google Cloud**, a mano o con una política automática. No se ofrece para un bloqueo solo en el gateway de SecureAI, ni para una identidad que su equipo deshabilitó directamente en Google Cloud.
- Una clave de cuenta de servicio borrada no se puede restaurar: SecureAI lo rechaza sin llamar a Google.
- Restaurar usa los mismos roles que revocar.

Protecciones:

- La cuenta de servicio que usa el conector, y sus claves, no se pueden revocar desde SecureAI: cortaría el descubrimiento. Lo mismo vale para la cuenta de servicio para revocar. Rótelas en Google Cloud.
- Tampoco se puede revocar la cuenta de servicio con la que se autentica la conexión de [inferencia de Vertex AI](/integrations/cloud/vertex-ai-inference), ni la clave con la que firma: cortaría todas las llamadas gobernadas. Con la opción sin clave (impersonación) solo se protege la cuenta de servicio: sus claves se pueden revocar, porque SecureAI no firma con ninguna. Si SecureAI no puede comprobar qué identidad usa la conexión de inferencia, no revoca ninguna cuenta de servicio ni clave de cuenta de servicio (las claves API no se ven afectadas).
- Las cuentas de servicio predeterminadas de Google (la predeterminada de Compute Engine, App Engine, Cloud Build, agentes de servicio) piden una segunda confirmación: deshabilitar una detiene cada VM, aplicación o build que se ejecuta con ella.
- Si al conector le falta el rol de una acción, el error indica cuál.

## Políticas automáticas de NHI

Las **políticas automáticas de NHI** (Inventario de NHI → **Políticas automáticas**) alertan o revocan identidades de Google Cloud según reglas, sin revisarlas una por una. Se evalúan al final de cada sincronización exitosa del conector, solo sobre sus identidades.

| Regla | En Google Cloud | Umbral por defecto |
|-------|-----------------|--------------------|
| **Clave de SA / access key de IAM sin uso** | Clave de cuenta de servicio sin autenticarse en N días. Solo actúa con un último uso conocido: una clave sin uso registrado no se toca. | 90 días |
| **Clave de SA / access key de IAM vieja** | Clave de cuenta de servicio creada hace más de N días, tenga uso o no. | 365 días |
| **API key sin restricciones** | Clave API sin restricción de aplicación y sin API de destino. | — |
| **SA privilegiada con clave de usuario** | Clave de usuario de una cuenta de servicio [privilegiada](#riesgo-por-privilegios). | — |

Cada regla tiene tres modos: **Apagada**, **Alertar** y **Revocar**. Todas empiezan apagadas. Las protecciones:

- **Modo simulación (dryRun)** activado por defecto: con él, ninguna regla en **Revocar** corta nada; solo queda listado qué haría. Apagarlo es lo único que habilita cortes reales. **Simular con esta configuración** muestra el efecto antes de guardar.
- **Tope de revocaciones por corrida**: 5 por defecto (de 1 a 50). Si en una corrida las reglas en **Revocar** afectan a más identidades que el tope, no se corta ninguna y se envía una alerta.
- **Exclusiones**: ninguna regla actúa sobre una identidad cuyo dueño, nombre o recurso coincida con un patrón; `*` es el único comodín.
- Solo se evalúan listados de claves completos.
- Nunca se corta una credencial que usa SecureAI (la del conector, la de revocación o la de la inferencia de Vertex AI). Las claves de las cuentas de servicio predeterminadas de Google nunca se cortan automáticamente: la regla solo alerta, y decide una persona.

En Google Cloud, revocar una clave de cuenta de servicio la **borra** (no se puede restaurar), y revocar una clave API la borra con 30 días para restaurarla. Cada acción queda auditada y se notifica.

## Solución de problemas

### Al conectar

Si la prueba falla, **Conectar** muestra uno de estos mensajes (en inglés) y no guarda nada:

| Mensaje | Causa | Qué hacer |
|---------|-------|-----------|
| `"Mi Proyecto" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | Ingresó el nombre o el número del proyecto | Copie el **ID** del proyecto desde el selector de proyectos de la consola. |
| `<cuenta> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | El ID no existe, o la cuenta de servicio no tiene roles en ese proyecto | Revise el ID y otorgue los dos roles obligatorios en el proyecto. |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | La ubicación no existe (por ejemplo, mal escrita) | Corrija la ubicación. |
| `The Cloud Asset API is not enabled for <cuenta>'s project. Enable cloudasset.googleapis.com and retry.` | Modo organización sin la Cloud Asset API | Habilite `cloudasset.googleapis.com` en el proyecto de la cuenta de servicio. |
| `<cuenta> cannot list the projects of organizations/<número>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | Modo organización sin los roles en la organización o carpeta, o el número es incorrecto | Otorgue los roles en la organización o carpeta, o quite el campo para leer solo el proyecto. |

### Brechas del panel

Cuando el panel de GCP dice **El descubrimiento no pudo leer todo**, cada línea nombra la superficie y lo que falta. Las marcadas como *opcional* solo enriquecen el inventario.

| Lo que muestra la línea | Qué significa | Qué hacer |
|-------------------------|---------------|-----------|
| Un rol (por ejemplo, `roles/monitoring.viewer`) | A la cuenta de servicio le falta ese rol | Otórguelo en el proyecto (o en la organización o carpeta) y vuelva a sincronizar. |
| **API deshabilitada en el proyecto — habilitala** | La API de esa superficie está apagada; el detalle nombra el servicio | Habilítela en **APIs y servicios → Biblioteca**. |
| Ningún rol, y un detalle que dice que una política de la organización prohíbe la ubicación | Una política de la organización (`constraints/gcp.resourceLocations`) bloquea esa ubicación, así que ahí no puede haber recursos. Ningún rol lo resuelve | Quite esa ubicación de la configuración, o pida a su administrador de la organización que la permita. |
| **Uso por modelo e identidad** sin activar | Los logs de Data Access de Vertex AI no están activos | Opcional: vea [Uso por modelo e identidad](#uso-por-modelo-e-identidad). |
| Una lectura parcial (por ejemplo, un tope del modo organización) | Se leyó solo una parte; el detalle dice cuánto | Nada se retira ni se poda por eso. Si necesita verlo todo, reduzca el alcance. |

## Relacionado

- [Google Vertex AI — Inferencia en tu cuenta](/integrations/cloud/vertex-ai-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [SSO de Google Workspace](/iam/google-workspace)
- [Inventario de NHI](/discovery/nhi-inventory)
