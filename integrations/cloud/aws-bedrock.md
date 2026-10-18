---
sidebar_position: 9
title: "AWS — Descubrimiento"
sidebar_label: "AWS — Descubrimiento"
description: "Conecte AWS para que SecureAI pueda inventariar Bedrock Agents, AgentCore, SageMaker, bases de conocimiento, guardrails, modelos, identidades IAM, actividad de CloudTrail, uso y costos de Bedrock, y detectar el uso de Bedrock por fuera de SecureAI, en una cuenta o en toda su organización de AWS."
---

# AWS — Descubrimiento

Conecte su cuenta de AWS (o toda su organización de AWS) para que SecureAI pueda inventariar los agentes, modelos y recursos de Amazon Bedrock y AgentCore, junto con las identidades IAM que pueden invocarlos, los eventos de auditoría, el uso y el costo que los rodean.

<Info>
Esta conexión **solo lee** la cuenta y nunca envía un prompt. Si lo que busca es ejecutar el tráfico de LLM de SecureAI en su propia cuenta de AWS, consulte [Amazon Bedrock — Inferencia en tu cuenta](/integrations/cloud/aws-bedrock-inference). Las dos usan la misma plantilla de CloudFormation y el mismo External ID.
</Info>

## Qué importa SecureAI

Por cada cuenta y cada región que usted elija:

- **Agentes**: Bedrock Agents (clásicos) y sus alias, y runtimes de **AgentCore**, con sus gateways y memorias.
- **Recursos de Bedrock**: bases de conocimiento, guardrails, modelos personalizados e importados, throughput aprovisionado y perfiles de inferencia (del sistema y de aplicación).
- **SageMaker**: endpoints de inferencia en tiempo real y modelos.
- **Registro de invocaciones de modelos**: si está activado en cada región. Desactivado significa que los prompts no se registran, y se muestra como una brecha.
- **Uso** de los últimos 30 días por modelo, tomado de CloudWatch: invocaciones, tokens de entrada y de salida, y errores.
- **Costo** de Bedrock de los últimos 30 días, tomado de Cost Explorer: por región y, en modo AWS Organizations, por cuenta vinculada.
- **Auditoría**: eventos de CloudTrail de Bedrock y AgentCore de los últimos 30 días (hasta 100 por fuente y región).
- **NHI**: usuarios IAM y sus access keys con su último uso (fecha, servicio y región); roles IAM que pueden asumir servicios de IA (Bedrock, AgentCore, SageMaker) y roles o usuarios cuyas políticas permiten invocar Bedrock, con el último uso de cada rol. El modelo usado por cada identidad sale de CloudTrail, cuando esa lectura fue completa. Visibles en el [Inventario de NHI](/discovery/nhi-inventory).
- **Quién puede invocar Bedrock**: un mapa de acceso que distingue los permisos explícitos de los comodines (`*`, `bedrock:*`, `NotAction`), y el **acceso efectivo** de cada una de esas identidades según el simulador de políticas IAM.
- **Bedrock usado por fuera de SecureAI**: las identidades que invocaron modelos de Bedrock sin pasar por SecureAI, con modelo, región, volumen y fecha. Vea [Bedrock usado por fuera de SecureAI](#bedrock-usado-por-fuera-de-secureai).

<Note>
El mapa de acceso se arma primero con las sentencias **Allow** de las políticas IAM (en línea, administradas por el cliente y las políticas administradas por AWS, que se reconocen por su nombre). Después, SecureAI confirma cada identidad con el **simulador de políticas IAM** (`iam:SimulatePrincipalPolicy`), primero sin recurso específico y luego sobre el modelo más usado. El simulador **sí evalúa** sentencias Deny, condiciones, límites de permisos y, si la cuenta pertenece a una organización de AWS, las SCP. **No simula** las resource control policies (RCP), las políticas de VPC endpoint ni las políticas de sesión. Una condición que depende del contexto de la solicitud (por ejemplo, la IP de origen o MFA) se muestra como **Depende del contexto**, nunca como acceso confirmado. Se simulan hasta 25 identidades por cuenta y sincronización, primero las que tienen el permiso explícito.
</Note>

## Requisitos previos

Un rol de solo lectura en su cuenta que SecureAI asume con el External ID de su organización. La plantilla de CloudFormation de SecureAI lo crea con el nombre `SecureAI-Discovery` y estos permisos:

| Grupo | Acciones IAM | Qué habilita |
|-------|--------------|--------------|
| Bedrock | `bedrock:ListFoundationModels`, `ListCustomModels`, `ListImportedModels`, `ListProvisionedModelThroughputs`, `ListInferenceProfiles`, `ListGuardrails`, `GetGuardrail`, `GetModelInvocationLoggingConfiguration`, `ListAgents`, `GetAgent`, `ListAgentAliases`, `ListKnowledgeBases`, `GetKnowledgeBase` | Agentes, alias, bases de conocimiento, guardrails, modelos, throughput aprovisionado, perfiles de inferencia y registro de invocaciones |
| AgentCore | `bedrock-agentcore:ListAgentRuntimes`, `ListGateways`, `ListMemories`, `GetAgentRuntime` | Runtimes, gateways y memorias de AgentCore |
| IAM | `iam:GetAccountAuthorizationDetails`, `ListUsers`, `ListRoles`, `GetRole`, `ListAccessKeys`, `GetAccessKeyLastUsed`, `SimulatePrincipalPolicy` | Usuarios, roles, access keys y su último uso; quién puede invocar Bedrock y su acceso efectivo |
| SageMaker | `sagemaker:ListEndpoints`, `ListModels` | Endpoints y modelos de SageMaker |
| CloudTrail | `cloudtrail:LookupEvents` | Eventos de auditoría y modelo usado por identidad |
| CloudWatch | `cloudwatch:ListMetrics`, `GetMetricData` | Invocaciones y tokens por modelo |
| Cost Explorer | `ce:GetCostAndUsage` | Costo de Bedrock |
| Organizations | `organizations:DescribeOrganization`, `ListAccounts` | Lista de cuentas miembro (solo en la cuenta de administración o de administrador delegado) |

`GetAgent` y `GetKnowledgeBase` permiten leer un agente o una base de conocimiento por el id que nombra CloudTrail cuando el listado está bloqueado. `iam:SimulatePrincipalPolicy` solo evalúa políticas: no cambia nada en la cuenta.

Si desplegó el stack antes de que se agregaran `iam:SimulatePrincipalPolicy` y los permisos de SageMaker, **actualice el stack** con la plantilla nueva. Mientras tanto, el acceso efectivo y SageMaker aparecen como brechas opcionales que nombran la acción que falta.

Para **desactivar access keys desde SecureAI** (opcional), despliegue el stack con `AllowRevokeAccessKeys=true`: agrega `iam:UpdateAccessKey` sobre los usuarios IAM de la cuenta. Está apagado por defecto.

Nada se omite en silencio: lo que SecureAI no puede leer aparece con la acción IAM que lo resuelve. Vea [Brechas de cobertura](#brechas-de-cobertura).

## Conectar

1. Vaya a **Administrador → Inventario → Conectores Cloud** y haga clic en **Conectar AWS** (o, si ya está conectado, en **Conexión de AWS**). Se abre **AWS Bedrock — Insights** en la pestaña **Conexión**.

2. Deje seleccionado **Rol de SecureAI (recomendado)**. El panel muestra el **ARN del principal de SecureAI** y su **External ID (único de su tenant)**.

3. **Despliegue el stack de SecureAI en su cuenta de AWS**: con **Lanzar el stack en AWS** (cuando se ofrece), o con **Descargar la plantilla** y el comando de la AWS CLI que muestra el panel (ya incluye sus parámetros). Si su organización no permite CloudFormation, cree el rol `SecureAI-Discovery` a mano con la misma política de confianza que se muestra en la [guía de inferencia](/integrations/cloud/aws-bedrock-inference) y las acciones de la tabla de arriba sobre `"Resource": "*"`.
4. Pegue la salida **`DiscoveryRoleArn`** del stack en **ARN del rol de descubrimiento** (por ejemplo `arn:aws:iam::123456789012:role/SecureAI-Discovery`).
5. En **Regiones**, escriba las regiones donde viven sus recursos de Bedrock y AgentCore, separadas por coma (por ejemplo `us-east-1, eu-west-1`). IAM y Cost Explorer son globales.

6. Haga clic en **Probar y conectar**. SecureAI verifica la conexión con una lectura real antes de guardar, y lista lo que no pudo leer.
7. Haga la primera sincronización: en **Administrador → Integraciones**, en la tarjeta **AWS Bedrock** (categoría **Nube**), haga clic en **Sincronizar ahora** (el ícono de actualizar). Después, SecureAI sincroniza solo cada 6 horas.

<Warning>
**Un solo stack por cuenta, para las dos conexiones.** Los roles de inferencia y de descubrimiento salen de la misma plantilla y del mismo nombre de stack (`SecureAI-Integration`). Si su conexión de [inferencia de Amazon Bedrock](/integrations/cloud/aws-bedrock-inference) ya usa el rol `SecureAI-BedrockInference` del stack, el panel lo indica y el comando que muestra conserva `EnableInference=true`: córralo tal cual. Si arma el comando usted, deje `EnableInference=true` en esa cuenta; si no, CloudFormation borra el rol de inferencia y corta su tráfico. Si el stack ya creó el rol de descubrimiento, saltee el paso 3.
</Warning>

### Alternativa: access key de un usuario IAM

En lugar del rol, puede usar el **ID de clave de acceso** y la **Clave de acceso secreta** de un usuario IAM (y un **Token de sesión** opcional si son credenciales temporales). Dele al usuario los mismos permisos de solo lectura que el rol. SecureAI guarda el secreto cifrado. Preferimos el rol: no guarda ningún secreto y se revoca borrando el stack.

Al pasar de un método al otro se descarta la credencial guardada del método que deja.

## Modo AWS Organizations (opcional)

Para leer todas las cuentas de su organización con una sola conexión:

1. Despliegue el stack en la **cuenta de administración** (o en una cuenta de **administrador delegado**) y pegue el ARN de ese rol.
2. Despliegue la misma plantilla en las **cuentas miembro** con un **StackSet de CloudFormation**, con el **mismo External ID**. En las cuentas miembro solo hace falta el rol de descubrimiento: use `EnableInference=false`. El rol debe tener el mismo nombre en todas las cuentas miembro.
3. Active **Modo AWS Organizations: leer todas las cuentas**.

SecureAI lista las cuentas **ACTIVAS** de la organización y asume el rol directamente en cada cuenta miembro.

| Campo opcional | Qué hace |
|----------------|----------|
| **Nombre del rol en las cuentas miembro** | Por defecto, el nombre del rol de la cuenta de administración. |
| **Solo estas cuentas** | Lista de IDs de cuenta separados por coma, para leer solo un subconjunto. |

SecureAI lee hasta 50 cuentas por sincronización, primero la de administración. CloudTrail (eventos de auditoría y Bedrock usado por fuera de SecureAI) y el simulador de políticas cubren las primeras 10, y el uso de CloudWatch las primeras 15; si la organización es más grande, el panel lo indica como lectura parcial. Una conexión admite hasta 10 regiones.

Una cuenta que SecureAI no puede leer queda como **brecha**, y no se retira ni se poda nada de ella. Si el rol que pegó está en una cuenta miembro, la conexión lo indica y nombra la cuenta de administración donde debe desplegarlo.

## Verificar

- [Conectores Cloud](/discovery/cloud-sensors) lista los agentes descubiertos. Haga clic en **Conexión de AWS** para abrir **AWS Bedrock — Insights**, con estas pestañas:
  - **Uso y costos**: tokens, solicitudes y errores por modelo (CloudWatch) y gasto en Bedrock (Cost Explorer).
  - **Modelos y despliegues**: agentes (Bedrock Agents y runtimes de AgentCore), lo que está conectado a ellos (alias, bases de conocimiento, guardrails, gateways y memorias, throughput, perfiles de inferencia y endpoints de SageMaker), y las cuentas y regiones leídas con su registro de invocaciones.
  - **Identidad y acceso**: **Bedrock usado por fuera de SecureAI**, **Quién puede invocar Bedrock**, **Acceso efectivo (simulador de políticas IAM)**, roles IAM y access keys.
  - **Auditoría y logs**: eventos de CloudTrail de Bedrock y AgentCore.
  - **Conexión**: la configuración de arriba.
- El [Inventario de NHI](/discovery/nhi-inventory) muestra los usuarios, access keys y roles.

Si una sincronización falla (por ejemplo, porque se borró el stack), la tarjeta muestra el error y SecureAI reintenta con espera progresiva, conservando el último inventario. Una lectura parcial nunca retira agentes ni elimina identidades.

## Bedrock usado por fuera de SecureAI

Con los eventos de CloudTrail que ya lee (`InvokeModel`, `InvokeModelWithResponseStream`, `Converse`, `ConverseStream`, las API compatibles con OpenAI y Anthropic de `bedrock-runtime` y las invocaciones de agentes: `InvokeAgent`, `InvokeInlineAgent` e `InvokeAgentRuntime`), SecureAI separa las llamadas que hizo **su propia identidad de inferencia** —el rol o la access key de la conexión [Amazon Bedrock — Inferencia en tu cuenta](/integrations/cloud/aws-bedrock-inference)— de las que hizo **cualquier otra identidad**. Estas últimas no pasaron por DLP, políticas de modelos ni recibos firmados.

En **Identidad y acceso → Bedrock usado por fuera de SecureAI** se ve, por identidad:

- el rol o usuario IAM (y la access key, enmascarada, si fue una key de larga duración);
- los modelos que invocó y cuántas veces cada uno;
- la cuenta y las regiones;
- el total de llamadas y la última vez que se vio.

También aparece como hallazgo en **Insights** (*Amazon Bedrock se está usando por fuera de SecureAI*), con severidad **crítica** cuando quien llama es una access key de usuario IAM o la cuenta root, y **moderada** cuando es un rol.

Detalles:

- SecureAI reconoce su identidad de inferencia por el **ARN del rol o el ID de la access key** que tiene configurados, nunca por el nombre de la sesión: un rol que se llame igual pero no sea el configurado se informa igual.
- Si no hay una conexión de inferencia de Bedrock en SecureAI, **todas** las invocaciones son por fuera de SecureAI.
- CloudTrail se lee hasta 100 eventos por fuente y región. Si se llegó a ese tope (o una región no se pudo leer), las llamadas se muestran con **+**: son un mínimo, no el total.
- Las llamadas con error (por ejemplo, `AccessDenied`) no cuentan como uso.

## Brechas de cobertura

Si el panel dice **El descubrimiento no pudo leer todo**, cada línea indica la superficie que faltó, la **acción IAM exacta**, la **cuenta y la región**, y cómo resolverlo:

| Estado | Qué significa | Qué hacer |
|--------|---------------|-----------|
| **Falta en el rol** | El rol no tiene esa acción | Vuelva a desplegar o actualice el stack de SecureAI. |
| **Bloqueado por una SCP** | Una service control policy de su organización deniega la acción | **El stack no puede resolverlo**: hable con su equipo de nube. |
| **Bloqueado por un límite de permisos** / **Deny explícito** | Un permissions boundary o una sentencia Deny anula el permiso | Revise el límite o la política con su equipo de nube. |
| **Limitado por AWS** / **Parcial** | AWS limitó las solicitudes o la lectura quedó incompleta | Vuelva a sincronizar más tarde. |

Cuando un listado está denegado pero las lecturas directas funcionan (por ejemplo, `bedrock:ListAgents` bloqueado y `GetAgent` permitido), SecureAI lo indica y lee los recursos que nombra CloudTrail.

## Costo

- El costo es el gasto real en Amazon Bedrock según **Cost Explorer**, de los últimos 30 días, por región y, en modo AWS Organizations, por cuenta vinculada.
- AWS cobra **US$ 0,01 por cada solicitud a Cost Explorer**. SecureAI hace **una por sincronización**: con la sincronización automática cada 6 horas, son unos US$ 1,20 al mes, más las sincronizaciones manuales.

## Revocación de access keys

Con `AllowRevokeAccessKeys=true` en el stack, las access keys IAM se pueden **desactivar** desde el [Inventario de NHI](/discovery/nhi-inventory) (candado), y **reactivar** después:

| Identidad | Qué pasa en AWS | ¿Reversible? |
|-----------|-----------------|--------------|
| Access key de usuario IAM | Pasa a **Inactive** | Sí: se restaura a **Active** desde SecureAI o desde IAM |

Protecciones:

- SecureAI se niega a desactivar la access key que usa su propia conexión (cortaría el descubrimiento) y la access key de la conexión de [inferencia de Bedrock](/integrations/cloud/aws-bedrock-inference) (cortaría todas las llamadas gobernadas). Rótelas en IAM. Si SecureAI no puede comprobar cuál es la key de inferencia, no desactiva nada.
- Los roles IAM se monitorean, pero no se revocan desde SecureAI.
- Sin `AllowRevokeAccessKeys=true`, el error indica que falta `iam:UpdateAccessKey` y cómo actualizar el stack.

### Políticas automáticas de NHI

Las **políticas automáticas de NHI** (Inventario de NHI → **Políticas automáticas**) también se aplican a las access keys de AWS, con las mismas reglas que a las claves de service account de Google Cloud:

| Regla | En AWS |
|-------|--------|
| **Clave sin uso** | Access key sin uso conocido en N días (según `GetAccessKeyLastUsed`). Una key sin último uso registrado no se toca. |
| **Clave vieja** | Access key creada hace más de N días, tenga uso o no. |

En modo **Revocar**, el corte es el mismo que el manual: la key pasa a **Inactive** y se puede reactivar. Valen las mismas protecciones: simulación activada por defecto, tope de revocaciones por corrida, solo sobre listados completos, exclusiones, y nunca las keys que usa SecureAI (descubrimiento e inferencia). Los roles IAM no se cortan.

Para revocar el acceso de SecureAI a su cuenta, **elimine el stack** (o el rol `SecureAI-Discovery`).

## Relacionado

- [Amazon Bedrock — Inferencia en tu cuenta](/integrations/cloud/aws-bedrock-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Sensores de nube](/discovery/cloud-sensors)
- [Inventario de NHI](/discovery/nhi-inventory)
