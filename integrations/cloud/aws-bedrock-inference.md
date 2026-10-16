---
sidebar_position: 10
title: "Amazon Bedrock — Inferencia en tu cuenta"
sidebar_label: "Amazon Bedrock — Inferencia"
description: "Ejecute el tráfico de LLM de SecureAI, Claude incluido, en su propia cuenta de AWS con Amazon Bedrock: aproveche su compromiso con AWS (EDP), sus créditos y sus cuotas mientras SecureAI sigue aplicando DLP, políticas, residencia de datos y recibos firmados."
---

# Amazon Bedrock — Inferencia en tu cuenta

Con esta integración, las llamadas a modelos de lenguaje (LLM) de SecureAI de las familias que usted elija se ejecutan en **su propia cuenta de AWS, con Amazon Bedrock**, en lugar de en los proveedores administrados por SecureAI. El consumo lo factura AWS a su cuenta, así que descuenta de su **compromiso con AWS (EDP) y de sus créditos**, y usa **sus cuotas de Bedrock**.

SecureAI sigue en el camino de cada solicitud: **DLP, políticas de modelos, residencia de datos y recibos firmados** se aplican igual que con cualquier otro proveedor. El tráfico pasa por el gateway de SecureAI, que además inspecciona y redacta las respuestas del modelo (también en streaming) antes de que lleguen al usuario.

<Info>
**No confundir con la otra tarjeta de AWS.** Esta página conecta Bedrock como **proveedor de inferencia** (Admin → Integraciones → **Proveedores de IA**). La tarjeta **AWS Bedrock** de la categoría **Nube** inventaría agentes, modelos, identidades y costos en modo lectura y nunca envía un prompt; se describe en [AWS — Descubrimiento](/integrations/cloud/aws-bedrock). Las dos usan la misma plantilla de CloudFormation y el mismo External ID, pero cada una tiene su propio rol con permisos distintos.
</Info>

## Cómo funciona

1. Usted despliega en su cuenta de AWS un rol IAM que **solo** el principal de SecureAI puede asumir, y **solo** si presenta el External ID de su organización.
2. Para cada llamada, SecureAI asume ese rol y obtiene **credenciales temporales** (duran una hora y se renuevan solas). No se guarda ninguna access key.
3. SecureAI firma la solicitud con **AWS Signature V4** y la envía, a través de su gateway, a **Amazon Bedrock Runtime** en la Región que usted eligió: Chat Completions para los modelos compatibles con OpenAI y la API Messages de Anthropic para Claude.
4. La respuesta vuelve por el gateway, que aplica DLP y emite el recibo firmado.

SecureAI **no usa claves API de Bedrock** (tokens bearer). Por eso la integración funciona aunque su organización bloquee las claves API de Bedrock con una SCP, un control que AWS recomienda con frecuencia.

## Qué corre en Bedrock y qué no

| Corre en su Bedrock | Sigue en proveedores administrados por SecureAI |
|---|---|
| Chat y agentes (modelos de las familias que usted elija) | Embeddings (búsqueda en documentos e índices) |
| Corrección gramatical, traducción, resúmenes de Teams y demás tareas en segundo plano, cuando su familia corre en Bedrock o elige **Remapear todo** | Re-ranking de búsqueda, OCR de documentos |
| | Asistente de administración, generación de imágenes y voz en tiempo real |
| | Modelos autoalojados y el proxy de Claude Code |

Familias de modelos disponibles en Bedrock:

| Familia | Modelos |
|---------|---------|
| **Claude (Anthropic)** | Los modelos Claude que Bedrock ofrece en su Región. **Bedrock es el único carril de nube propia de SecureAI que sirve Claude**: los de Vertex AI y Azure AI Foundry no lo hacen. |
| **OpenAI** | GPT‑5.x en Bedrock |
| **gpt‑oss** | Por ejemplo `gpt-oss-120b` |
| **DeepSeek** | DeepSeek V3.x |
| **Qwen** | Modelos Qwen de Bedrock |
| **Mistral** | Mistral Large 3, Ministral 3, Magistral, Devstral |

**No se ofrecen por Bedrock:** Llama, Amazon Nova, DeepSeek‑R1, Mistral 7B y Mixtral. En Bedrock esos modelos solo responden a la API Converse, no a la interfaz compatible con OpenAI que usa SecureAI, así que siguen en los proveedores administrados por SecureAI. Gemini no está en Bedrock.

## Cuántos proveedores de nube puede usar

| Plan | Proveedores de inferencia habilitados al mismo tiempo |
|------|-------------------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry **o** Amazon Bedrock) |
| **Enterprise** | Hasta 3, por ejemplo Vertex AI para Gemini, Foundry para GPT y Bedrock para Claude |

Con más de un proveedor habilitado, cada uno atiende familias de modelos **distintas**: una familia solo puede enrutarse a un proveedor, y solo un proveedor puede usar **Remapear todo**. SecureAI rechaza una configuración que se superponga con otra e indica qué familia colisiona.

## Requisitos previos

- Una **cuenta de AWS** en la que los modelos que quiera usar estén **disponibles para su cuenta en la Región** elegida.
- Para **Claude**: haber enviado una vez el **formulario de caso de uso de Anthropic** en la consola de Bedrock (**Model access** / **Model catalog** → cualquier modelo Claude). La aprobación suele ser inmediata. Sin él, la prueba de conexión lo indica.
- Algunos de los modelos más nuevos (el último Claude, GPT‑5.x, Grok) pueden requerir que **AWS los habilite para su cuenta**. Mientras tanto, la prueba devuelve que el modelo no está disponible para su cuenta.
- Permiso en AWS para **crear un stack de CloudFormation con roles IAM** (o para crear un rol IAM a mano).
- Permiso de **administrador** en la sección Integraciones de SecureAI.

## Paso 1. Copie la identidad de SecureAI

1. Vaya a **Administrador → Integraciones → Proveedores de IA** y abra **Amazon Bedrock — Inferencia en tu cuenta**.
2. En **Conexión**, deje seleccionado **Rol IAM entre cuentas** (recomendado). El panel muestra:

   | Dato | Para qué sirve |
   |------|----------------|
   | **Principal de SecureAI** | El ARN en el que confiará su rol. Es el único que podrá asumirlo. |
   | **Tu External ID** | Único de su organización. El rol rechaza a cualquier llamador que no lo presente, así ningún otro cliente de SecureAI puede usar su rol (protección contra el problema del *confused deputy*). |

3. Si también va a usar [AWS — Descubrimiento](/integrations/cloud/aws-bedrock), marque **Crear también el rol de descubrimiento de solo lectura**: el mismo stack crea los dos roles.

## Paso 2. Cree el rol en su cuenta de AWS

<Tabs>
<Tab title="CloudFormation (recomendado)">

Despliegue una vez el stack de SecureAI en la cuenta de AWS donde correrá la inferencia, de una de estas dos formas:

- **Launch Stack en AWS** (cuando su despliegue lo ofrece): abre la consola de CloudFormation con todos los parámetros completos. Marque la confirmación de IAM y haga clic en **Create stack**.
- **Descargar plantilla** y crear el stack desde la consola (**Create stack → Upload a template file**) con el principal y el External ID del paso 1, o con el comando de la AWS CLI que muestra el panel. Cópielo desde el panel: ya incluye sus valores. Tiene esta forma:

```bash
aws cloudformation deploy --stack-name SecureAI-Integration \
  --template-file secureai-integration.yaml \
  --capabilities CAPABILITY_NAMED_IAM --region us-east-1 \
  --parameter-overrides SecureAIPrincipalArn=<ARN del principal de SecureAI> \
    ExternalId=<External ID> EnableInference=true EnableDiscovery=true
```

El stack crea el rol **`SecureAI-BedrockInference`** y, si lo pidió, el rol de solo lectura **`SecureAI-Discovery`**. **No crea ninguna access key.**

| Parámetro del stack | Qué controla |
|---------------------|--------------|
| `SecureAIPrincipalArn` / `ExternalId` | La identidad de SecureAI del paso 1. |
| `EnableInference` | Crea el rol de inferencia (por defecto `true`). |
| `EnableDiscovery` | Crea el rol de descubrimiento de solo lectura (por defecto `true`). |
| `AllowRevokeAccessKeys` | Solo para descubrimiento: permite desactivar y reactivar access keys IAM desde SecureAI (por defecto `false`). |
| `RoleNamePrefix` | Prefijo de los nombres de los roles (por defecto `SecureAI`). |

Cuando el stack termine, copie la salida **`BedrockInferenceRoleArn`** (**CloudFormation → Stacks → SecureAI-Integration → Outputs**).

</Tab>
<Tab title="Rol manual (sin CloudFormation)">

Si su organización no permite CloudFormation, cree el rol a mano en **IAM → Roles → Create role → Custom trust policy**, con el nombre `SecureAI-BedrockInference` y una duración máxima de sesión de 1 hora.

**Política de confianza** (reemplace los valores entre `<>` por los del paso 1):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SecureAIWithExternalId",
      "Effect": "Allow",
      "Principal": { "AWS": "<SecureAI principal ARN>" },
      "Action": "sts:AssumeRole",
      "Condition": { "StringEquals": { "sts:ExternalId": "<External ID>" } }
    }
  ]
}
```

**Política de permisos** (en línea; reemplace `<account id>` por el ID de 12 dígitos de su cuenta):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InvokeModels",
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/*",
        "arn:aws:bedrock:*:<account id>:inference-profile/*",
        "arn:aws:bedrock:*:<account id>:application-inference-profile/*"
      ]
    },
    {
      "Sid": "ReadModelCatalog",
      "Effect": "Allow",
      "Action": [
        "bedrock:ListFoundationModels",
        "bedrock:GetFoundationModel",
        "bedrock:ListInferenceProfiles",
        "bedrock:GetInferenceProfile"
      ],
      "Resource": "*"
    }
  ]
}
```

Copie el ARN del rol creado.

</Tab>
<Tab title="Access key de usuario IAM">

Como alternativa, SecureAI acepta la access key de un **usuario IAM dedicado** (Access key ID y Secret access key). Dele al usuario la misma política de permisos que al rol manual.

<Warning>
Una access key de larga duración es **menos segura que el rol**: no vence, y quien la tenga puede llamar a Bedrock en su nombre hasta que la rote. SecureAI guarda el secreto **cifrado** y no lo vuelve a mostrar. Las claves temporales (`ASIA…`) se rechazan, porque vencen en horas. Recomendamos el rol: si más adelante cambia a él, SecureAI borra la access key guardada.
</Warning>

</Tab>
</Tabs>

<Info>
**Por qué la Región del recurso es `*`.** Un perfil de inferencia entre Regiones necesita permiso sobre el perfil **y** sobre el modelo en **cada Región** a la que puede enrutar. Si quiere, puede restringir la lista de modelos de la política; la Región debe seguir siendo amplia para los perfiles que use.
</Info>

## Paso 3. Conecte la cuenta en SecureAI

1. En **Conexión**, complete:

   | Campo | Qué ingresar |
   |-------|--------------|
   | **ARN del rol** | La salida `BedrockInferenceRoleArn` (o el ARN del rol manual). Con access key: el **Access key ID** y el **Secret access key**. |
   | **Región de AWS** | Dónde recibe Bedrock sus llamadas y de dónde se lee la lista de modelos (por ejemplo `us-east-1`, `eu-central-1`). Elija **Otro** para escribir cualquier Región que Bedrock soporte. |
   | **Alcance de inferencia** | **Geografía** (por defecto), **Solo dentro de la Región** o **Global**. Vea [Residencia de datos](#residencia-de-datos-alcance-de-inferencia). |

2. Haga clic en **Guardar**. SecureAI asume el rol, muestra el **ID de su cuenta de AWS** y lee el catálogo de la Región en **Modelos disponibles para tu cuenta**: los modelos fundacionales de esa Región y los perfiles de inferencia entre Regiones. Todavía **no** se enruta tráfico: la integración se guarda apagada para que pueda probarla antes.

Si la lista de modelos muestra un error, el rol no puede leer el catálogo (`bedrock:ListFoundationModels` / `bedrock:ListInferenceProfiles`) en esa Región. La inferencia funciona igual con los ids de modelo integrados de SecureAI (la prueba de conexión los verifica), pero el mapeo automático queda limitado. Si cambia de Región, guarde otra vez para volver a leer los modelos.

## Residencia de datos: alcance de inferencia

El **alcance de inferencia** decide dónde puede AWS procesar los prompts:

| Alcance | Qué usa SecureAI | Dónde se procesan los prompts |
|---------|------------------|-------------------------------|
| **Solo dentro de la Región** | Modelos fundacionales de la Región | Solo en la Región elegida; las llamadas nunca salen de ella. Claude y GPT‑5.x **no están disponibles**: Bedrock los ofrece solo con perfiles entre Regiones. |
| **Geografía** (por defecto) | Perfil de inferencia entre Regiones de la geografía de su Región (`us.`, `eu.`, `apac.`, `jp.`, `au.`, `ca.`) | En cualquier Región de esa geografía, nunca fuera de ella. Mantiene la residencia y habilita Claude y GPT‑5.x. |
| **Global** | Perfiles `global.` | En cualquier Región comercial de AWS. Máxima capacidad, pero **no fija residencia**: la política de residencia de SecureAI lo trata como sin residencia fijada. |

SecureAI aplica la política de residencia de datos de su organización sobre la geografía resultante. Si necesita residencia, use **Geografía** o **Solo dentro de la Región**.

## Paso 4. Elija qué corre en Bedrock

En **Qué corre en Amazon Bedrock** hay dos modos:

- **Solo estas familias de modelos**: las familias que marque corren en su Bedrock; el resto de los modelos sigue en los proveedores de SecureAI (o en otra nube conectada).
- **Remapear todo a Amazon Bedrock**: todas las llamadas a LLM corren en su Bedrock. Los modelos sin equivalente en Bedrock los sirve un **modelo por defecto**.

**Mapeo automático.** Al guardar, SecureAI asigna cada modelo del catálogo de SecureAI al id de Bedrock que lo sirve según su alcance de inferencia. Por ejemplo, con **Geografía** en una Región de EE. UU.:

| Modelo de SecureAI | Id de Bedrock |
|--------------------|---------------|
| `anthropic/claude-sonnet-4.6` | `us.anthropic.claude-sonnet-4-6` |
| `openai/gpt-oss-120b` | `openai.gpt-oss-120b-1:0` |

**Modelos de Bedrock por defecto** (elíjalos de la lista de modelos de su cuenta):

| Nivel | Se usa para |
|-------|-------------|
| **Rápido** | Tareas en segundo plano (gramática, traducción, Teams) y llamadas internas remapeadas |
| **Estándar** | Modelos sin equivalente |
| **Razonamiento** | Modelos de razonamiento sin equivalente |
| **Visión** | Solicitudes con imágenes o PDFs |

En **Overrides modelo → id de Bedrock** puede enviar un modelo del catálogo a un destino exacto de Bedrock: un **id de modelo**, un **id de perfil de inferencia** o el **ARN de un perfil de inferencia de aplicación**. Los reemplazos tienen prioridad sobre el mapeo automático y se usan tal cual, aunque queden fuera del alcance elegido; la política de residencia se aplica igual sobre la geografía resultante.

Además hay dos opciones:

| Opción | Apagada (por defecto, recomendado) | Encendida |
|--------|------------------------------------|-----------|
| **Permitir fallback a modelos administrados por SecureAI** | Si Bedrock falla o un modelo no tiene id de Bedrock, la solicitud se **rechaza** (falla cerrado) en lugar de enviarse a otro proveedor. | Esas solicitudes se reintentan **una vez** en proveedores administrados por SecureAI. El reintento queda auditado. |
| **Aplicar las cuotas de puntos de usuario al uso de Amazon Bedrock** | El uso de Bedrock no consume los puntos mensuales de los usuarios. | Se mantienen los límites de puntos por usuario también para Bedrock. |

## Paso 5. Pruebe, revise y active

1. **Probar conexión** envía una solicitud mínima a cada modelo por defecto, **por el mismo camino que usará el tráfico real** (gateway, políticas y recibos incluidos), y muestra el resultado de cada uno con su latencia. Si todavía no eligió modelos por defecto, prueba `gpt-oss-120b`, DeepSeek V3.2 y Claude Haiku 4.5 según su alcance de inferencia. La prueba **se factura a su cuenta de AWS** (centavos).
2. **Vista previa del enrutamiento** muestra, para cada modelo del catálogo, si lo servirá **Tu Amazon Bedrock** (y con qué id), otra nube conectada o **SecureAI**, y cuáles quedarán ocultos para los usuarios.
3. Cuando la prueba pase, encienda **Enrutar tráfico a Amazon Bedrock** y haga clic en **Guardar**. **Si no guarda, el interruptor no queda activo.** Si su plan no admite otro proveedor de nube o el enrutamiento se superpone con otro, SecureAI lo rechaza y explica por qué.
4. La tarjeta pasa a verde: **Enrutando a Amazon Bedrock**. Si está guardada pero apagada, muestra **Configurado · sin enrutar a Bedrock**.

Los modelos servidos por su Bedrock muestran la insignia **Tu Bedrock** en el selector de modelos del chat; al pasar el mouse indica que los sirve el Amazon Bedrock de su organización.

## Qué se factura y a quién

- **El consumo de LLM lo factura AWS a su cuenta**, con su EDP, sus descuentos y sus créditos. Los límites de velocidad son **sus cuotas de Bedrock**.
- SecureAI muestra el costo de esos turnos como una **estimación a precio de lista** solo para analítica; la cifra real de AWS puede ser menor.
- Los turnos en Bedrock **no descuentan puntos** de los usuarios, salvo que active **Aplicar las cuotas de puntos de usuario**.

## Seguridad y cumplimiento

- **Sin secretos guardados.** Con el rol, SecureAI no guarda ninguna credencial de AWS: obtiene credenciales temporales de una hora y las renueva automáticamente. Si usa una access key, el secreto se guarda cifrado y nunca se devuelve al navegador.
- **Confianza acotada.** La política de confianza admite **solo** al principal de SecureAI y **solo** con `sts:ExternalId` igual al External ID de su organización.
- **Permisos mínimos.** El rol de inferencia solo puede invocar modelos (`bedrock:InvokeModel`, `bedrock:InvokeModelWithResponseStream`) y leer el catálogo de modelos. No puede leer sus datos, su IAM ni su facturación.
- **Compatible con sus SCP.** SecureAI firma con Signature V4 y credenciales temporales; no necesita claves API de Bedrock.
- **El camino sigue protegido.** Cada llamada pasa por el gateway SMLTP de SecureAI: DLP sobre el prompt y sobre la respuesta (también en streaming), token de autorización por solicitud y **recibo firmado** verificable.
- **Falla cerrado.** Si no se puede leer la configuración o asumir el rol, la solicitud se rechaza; no se envía a otro proveedor salvo que usted haya permitido el fallback.
- **Auditoría.** Guardar, probar o desconectar la integración queda en el registro de actividad, nunca con el secreto.

## Desconectar y revocar

**Desconectar** (pie del panel) elimina la configuración. Desde ese momento, **todo el tráfico que atendía Bedrock vuelve a los proveedores administrados por SecureAI**. También puede apagar solo **Enrutar tráfico a Amazon Bedrock** para pausar el enrutamiento conservando la conexión.

Para revocar el acceso de SecureAI en AWS, **elimine el stack** (o el rol). Si usaba una access key, desactívela o elimínela en IAM.

## Solución de problemas

Estos son los motivos que muestra **Probar conexión**:

| Motivo | Causa probable | Qué hacer |
|--------|----------------|-----------|
| Credencial | SecureAI no pudo asumir el rol: el stack no está desplegado, el ARN es incorrecto, o la política de confianza no tiene el principal de SecureAI o su External ID. Con access key: la clave es inválida. | Revise el ARN y el stack (o el par de claves). |
| Bloqueado por una SCP | Una service control policy de su organización de AWS deniega la acción | Pida a su equipo de nube que permita `bedrock:InvokeModel` para esta cuenta y Región. **El stack no puede resolverlo.** |
| Permiso denegado | Al rol o usuario le falta `bedrock:InvokeModel` sobre ese modelo | Actualice el stack de SecureAI o amplíe la política IAM. |
| Formulario de caso de uso de Anthropic | Claude todavía no está habilitado para su cuenta | Envíe el formulario de Anthropic en la consola de Bedrock (**Model access** / **Model catalog** → un modelo Claude) y vuelva a probar. |
| Modelo no habilitado para la cuenta | AWS todavía no abrió ese modelo a su cuenta o Región | Pídalo a su equipo de cuenta de AWS; mientras tanto, elija otro modelo. |
| Modelo no disponible | El id no se ofrece en esa Región o alcance de inferencia | Actualice la lista de modelos, elija otro id o amplíe el alcance. |
| Cuota | Bedrock limitó las solicitudes (throttling) | Reintente más tarde o pida una cuota mayor en **Service Quotas**. |
| Bloqueado por tu política de modelos SMLTP | La política de SecureAI no permite el modelo | Agregue el modelo a la política permitida. |
| Amazon Bedrock devolvió un error | Falla del lado de AWS | Reintente; si persiste, revise el estado de AWS. |
| Gateway SMLTP de Bedrock inalcanzable / Error TLS | Problema de infraestructura de SecureAI | Contacte a soporte. No depende de su cuenta de AWS. |

Errores que pueden ver los usuarios en el chat:

| Código | Significado |
|--------|-------------|
| `SAI-BEDROCK-001` | El modelo elegido no tiene equivalente en Bedrock con su Región y alcance de inferencia, y el fallback está apagado. Elija otro modelo, amplíe el alcance o permita el fallback. |
| `SAI-BEDROCK-002` | No se pudieron obtener credenciales de AWS (el rol no se puede asumir o la access key es inválida). Revise el stack y la conexión. |
| `SAI-VERTEX-005` | No se pudo leer la configuración de inferencia en la nube y se rechazó por seguridad. Reintente en unos segundos. |

## Limitaciones actuales

- **Llama, Amazon Nova, DeepSeek‑R1, Mistral 7B y Mixtral** no se sirven por Bedrock (en Bedrock solo responden a la API Converse).
- Con **Solo dentro de la Región**, Claude y GPT‑5.x no están disponibles.
- **Claude en Bedrock:** cada solicitud tiene su recibo firmado, pero la evidencia de auditoría todavía no vincula la respuesta conservada con ese recibo (la marca "respuesta vinculada al recibo" no está disponible para estos turnos).
- **Embeddings, re-ranking, OCR, asistente de administración, generación de imágenes y voz en tiempo real** siguen en proveedores administrados por SecureAI.

## Relacionado

- [AWS — Descubrimiento](/integrations/cloud/aws-bedrock): inventario de agentes, modelos, identidades y costos de Bedrock.
- [Google Vertex AI — Inferencia en tu cuenta](/integrations/cloud/vertex-ai-inference)
- [Azure AI Foundry — Inferencia en tu cuenta](/integrations/cloud/azure-ai-foundry-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Recibos firmados](/api/receipts)
