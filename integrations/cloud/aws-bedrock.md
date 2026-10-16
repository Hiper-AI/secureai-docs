---
sidebar_position: 9
title: "AWS — Descubrimiento"
sidebar_label: "AWS — Descubrimiento"
description: "Conecte AWS para que SecureAI pueda inventariar Bedrock Agents, AgentCore, bases de conocimiento, guardrails, modelos, identidades IAM, actividad de CloudTrail, uso y costos de Bedrock, en una cuenta o en toda su organización de AWS."
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
- **Registro de invocaciones de modelos**: si está activado en cada región. Desactivado significa que los prompts no se registran, y se muestra como una brecha.
- **Uso** de los últimos 30 días por modelo, tomado de CloudWatch: invocaciones, tokens de entrada y de salida, y errores.
- **Costo** de Bedrock de los últimos 30 días, tomado de Cost Explorer: por región y, en modo AWS Organizations, por cuenta vinculada.
- **Auditoría**: eventos de CloudTrail de Bedrock y AgentCore de los últimos 30 días (hasta 100 por fuente y región).
- **NHI**: usuarios IAM y sus access keys con su último uso (fecha, servicio y región); roles IAM que pueden asumir servicios de IA (Bedrock, AgentCore, SageMaker) y roles o usuarios cuyas políticas permiten invocar Bedrock, con el último uso de cada rol. El modelo usado por cada identidad sale de CloudTrail, cuando esa lectura fue completa. Visibles en el [Inventario de NHI](/discovery/nhi-inventory).
- **Quién puede invocar Bedrock**: un mapa de acceso que distingue los permisos explícitos de los comodines (`*`, `bedrock:*`, `NotAction`).

<Note>
El mapa de acceso se arma con las sentencias **Allow** de las políticas IAM (en línea, administradas por el cliente y las políticas administradas por AWS, que se reconocen por su nombre). **No evalúa** sentencias Deny, condiciones, SCP ni límites de permisos: muestra a quién permiten las políticas, no prueba el acceso efectivo.
</Note>

## Requisitos previos

Un rol de solo lectura en su cuenta que SecureAI asume con el External ID de su organización. La plantilla de CloudFormation de SecureAI lo crea con el nombre `SecureAI-Discovery` y estos permisos:

| Grupo | Acciones IAM | Qué habilita |
|-------|--------------|--------------|
| Bedrock | `bedrock:ListFoundationModels`, `ListCustomModels`, `ListImportedModels`, `ListProvisionedModelThroughputs`, `ListInferenceProfiles`, `ListGuardrails`, `GetGuardrail`, `GetModelInvocationLoggingConfiguration`, `ListAgents`, `GetAgent`, `ListAgentAliases`, `ListKnowledgeBases`, `GetKnowledgeBase` | Agentes, alias, bases de conocimiento, guardrails, modelos, throughput aprovisionado, perfiles de inferencia y registro de invocaciones |
| AgentCore | `bedrock-agentcore:ListAgentRuntimes`, `ListGateways`, `ListMemories`, `GetAgentRuntime` | Runtimes, gateways y memorias de AgentCore |
| IAM | `iam:GetAccountAuthorizationDetails`, `ListUsers`, `ListRoles`, `GetRole`, `ListAccessKeys`, `GetAccessKeyLastUsed` | Usuarios, roles, access keys y su último uso; quién puede invocar Bedrock |
| CloudTrail | `cloudtrail:LookupEvents` | Eventos de auditoría y modelo usado por identidad |
| CloudWatch | `cloudwatch:ListMetrics`, `GetMetricData` | Invocaciones y tokens por modelo |
| Cost Explorer | `ce:GetCostAndUsage` | Costo de Bedrock |
| Organizations | `organizations:DescribeOrganization`, `ListAccounts` | Lista de cuentas miembro (solo en la cuenta de administración o de administrador delegado) |

`GetAgent` y `GetKnowledgeBase` permiten leer un agente o una base de conocimiento por el id que nombra CloudTrail cuando el listado está bloqueado.

Para **desactivar access keys desde SecureAI** (opcional), despliegue el stack con `AllowRevokeAccessKeys=true`: agrega `iam:UpdateAccessKey` sobre los usuarios IAM de la cuenta. Está apagado por defecto.

Nada se omite en silencio: lo que SecureAI no puede leer aparece con la acción IAM que lo resuelve. Vea [Brechas de cobertura](#brechas-de-cobertura).

## Conectar

1. Vaya a **Administrador → Registro de agentes → Sensores de nube** y haga clic en **Conectar AWS** (o, si ya está conectado, en **Conexión de AWS**). La misma conexión está en **Administrador → Integraciones → Nube → AWS Bedrock**.
2. En la pestaña **Conexión**, deje seleccionado **Rol de SecureAI (recomendado)**. El panel muestra el **ARN del principal de SecureAI** y su **External ID (único de su tenant)**.
3. **Despliegue el stack de SecureAI en su cuenta de AWS**: con **Lanzar el stack en AWS** (cuando se ofrece), o con **Descargar la plantilla** y el comando de la AWS CLI que muestra el panel (ya incluye sus parámetros). Si ya desplegó el stack para [inferencia](/integrations/cloud/aws-bedrock-inference) con el rol de descubrimiento incluido, no hace falta repetirlo. Si su organización no permite CloudFormation, cree el rol `SecureAI-Discovery` a mano con la misma política de confianza que se muestra en la [guía de inferencia](/integrations/cloud/aws-bedrock-inference) y las acciones de la tabla de arriba sobre `"Resource": "*"`.
4. Pegue la salida **`DiscoveryRoleArn`** del stack en **ARN del rol de descubrimiento** (por ejemplo `arn:aws:iam::123456789012:role/SecureAI-Discovery`).
5. En **Regiones**, escriba las regiones donde viven sus recursos de Bedrock y AgentCore, separadas por coma (por ejemplo `us-east-1, eu-west-1`). IAM y Cost Explorer son globales.
6. Haga clic en **Probar y conectar**. SecureAI verifica la conexión con una lectura real antes de guardar.
7. Sincronice ahora con el botón de actualizar. Después, SecureAI sincroniza solo cada 6 horas.

### Alternativa: access key de un usuario IAM

En lugar del rol, puede usar el **ID de clave de acceso** y la **Clave de acceso secreta** de un usuario IAM (y un **Token de sesión** opcional si son credenciales temporales). Dele al usuario los mismos permisos de solo lectura que el rol. SecureAI guarda el secreto cifrado. Preferimos el rol: no guarda ningún secreto y se revoca borrando el stack.

Al enviar el formulario de nuevo se reemplaza la configuración, y se descarta la credencial guardada del otro método.

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
| **Máximo de cuentas por sincronización** | Por defecto 50, máximo 200. |

Una cuenta que SecureAI no puede leer queda como **brecha**, y no se retira ni se poda nada de ella. Si el rol que pegó está en una cuenta miembro, la conexión lo indica y nombra la cuenta de administración donde debe desplegarlo.

## Verificar

- [Sensores de nube](/discovery/cloud-sensors) lista los agentes descubiertos. Haga clic en la tarjeta de AWS para abrir **AWS Bedrock — Insights**: uso y costo de Bedrock, agentes (Bedrock Agents y runtimes de AgentCore), lo que está conectado a ellos (alias, bases de conocimiento, guardrails, gateways y memorias, throughput y perfiles), cuentas y regiones leídas con su registro de invocaciones, access keys, roles IAM, **Quién puede invocar Bedrock** y la actividad de CloudTrail.
- El [Inventario de NHI](/discovery/nhi-inventory) muestra los usuarios, access keys y roles.

Si una sincronización falla (por ejemplo, porque se borró el stack), la tarjeta muestra el error y SecureAI reintenta con espera progresiva, conservando el último inventario. Una lectura parcial nunca retira agentes ni elimina identidades.

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

- SecureAI se niega a desactivar la access key que usa su propia conexión: cortaría el descubrimiento. Rótela en IAM.
- Los roles IAM se monitorean, pero no se revocan desde SecureAI.
- Sin `AllowRevokeAccessKeys=true`, el error indica que falta `iam:UpdateAccessKey` y cómo actualizar el stack.

Para revocar el acceso de SecureAI a su cuenta, **elimine el stack** (o el rol `SecureAI-Discovery`).

## Relacionado

- [Amazon Bedrock — Inferencia en tu cuenta](/integrations/cloud/aws-bedrock-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Sensores de nube](/discovery/cloud-sensors)
- [Inventario de NHI](/discovery/nhi-inventory)
