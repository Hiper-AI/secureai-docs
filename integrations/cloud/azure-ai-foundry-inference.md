---
sidebar_position: 8
title: "Azure AI Foundry — Inferencia en tu cuenta"
sidebarTitle: "Azure AI Foundry"
icon: "/img/icons/azure.svg"
sidebar_label: "Azure AI Foundry — Inferencia"
description: "Ejecute el tráfico de LLM de SecureAI en su propio recurso de Azure AI Foundry: aproveche su compromiso de Azure y sus créditos mientras SecureAI sigue aplicando DLP, políticas y recibos firmados."
---

# Azure AI Foundry — Inferencia en tu cuenta

Con esta integración, las llamadas a modelos de lenguaje (LLM) de SecureAI se ejecutan en **su propio recurso de Azure AI Foundry** en lugar de en los proveedores administrados por SecureAI. El consumo lo factura Microsoft a su suscripción de Azure, así que descuenta de su **compromiso de Azure (MACC) y de sus créditos**.

SecureAI sigue en el camino de cada solicitud: **DLP, políticas de modelos, residencia de datos y recibos firmados** se aplican igual que con cualquier otro proveedor.

<Info>
**No confundir con la otra tarjeta de Azure.** Esta página conecta Foundry como **proveedor de inferencia** (Admin → Integraciones → **Proveedores de IA**). La tarjeta **Azure — Descubrimiento** (categoría **Nube**) inventaría despliegues, agentes de Foundry, todas las identidades no humanas de Entra y costos en modo lectura y nunca envía un prompt; se describe en [Azure — Descubrimiento](/integrations/cloud/azure-ai-foundry). Pueden usarse con la misma suscripción, pero son independientes y piden permisos distintos.
</Info>

## Qué corre en Foundry y qué no

| Corre en su Foundry | Sigue en proveedores administrados por SecureAI |
|---|---|
| Chat y agentes (modelos de las familias que usted elija) | Embeddings (búsqueda en documentos e índices) |
| Corrección gramatical, traducción, resúmenes de Teams y demás tareas en segundo plano, cuando su familia corre en Foundry o elige **Remapear todo** | Re-ranking de búsqueda, OCR de documentos |
| | Asistente de administración, generación de imágenes y voz en tiempo real |
| | Modelos autoalojados y el proxy de Claude Code |

Familias de modelos soportadas: **OpenAI (GPT‑5 y serie o), gpt‑oss, DeepSeek, Llama, Grok, Mistral y Claude**, cualquiera de ellas que usted haya **desplegado** en el recurso. SecureAI elige la API según el formato de cada despliegue:

| Despliegue | API que usa SecureAI |
|------------|----------------------|
| OpenAI, gpt‑oss, DeepSeek, Llama, Grok, Mistral | La API compatible con OpenAI de `<su-recurso>.openai.azure.com` |
| Claude (despliegues con formato Anthropic) | La API Messages de Anthropic en Foundry: `https://<su-recurso>.services.ai.azure.com/anthropic/v1/messages` |
| Otros modelos de socios que no son compatibles con OpenAI (Phi, Cohere, AI21, Core42…) | La Azure AI Model Inference API: `https://<su-recurso>.services.ai.azure.com/models/chat/completions` |

Las tres usan el mismo principal de servicio. Para Claude, SecureAI pide a Entra ID un token para la audiencia `https://ai.azure.com/.default`, como indica Microsoft.

## Cuántos proveedores de nube puede usar

| Plan | Proveedores de inferencia habilitados al mismo tiempo |
|------|-------------------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry **o** Amazon Bedrock) |
| **Enterprise** | Hasta 3, por ejemplo Vertex AI para Gemini y Foundry para GPT |

Con más de un proveedor habilitado, cada uno atiende familias de modelos **distintas**: una familia solo puede enrutarse a un proveedor, y solo un proveedor puede usar **Remapear todo**. SecureAI rechaza una configuración que se superponga con otra e indica qué familia colisiona.

## Requisitos previos

- Un recurso de **Azure AI Foundry** (o Azure OpenAI) con al menos un **despliegue de modelo** (por ejemplo `gpt-5.1` o `gpt-oss-120b`).
- Un **principal de servicio** (registro de aplicación en Microsoft Entra ID) con un **secreto de cliente** y, sobre ese recurso:
  - **Cognitive Services OpenAI User**: para invocar los modelos (obligatorio).
  - **Reader**: para que SecureAI pueda listar sus despliegues y mapear los modelos automáticamente (recomendado).
  - **Cognitive Services User**: para Claude y los demás modelos de socios. Es el rol que Microsoft indica para llamar a Claude en Foundry con Entra ID.
- Para **Claude**: según Microsoft, una suscripción de pago y una suscripción de Azure Marketplace a la oferta del modelo, que se crea al aceptar sus términos cuando lo despliega. Vea [Deploy and use Claude models in Microsoft Foundry](https://learn.microsoft.com/azure/ai-foundry/foundry-models/how-to/use-foundry-models-claude).
- Permiso de **administrador** en la sección Integraciones de SecureAI.

## Paso 1. Prepare el principal de servicio en Azure

Desde [Azure Cloud Shell](https://shell.azure.com/) o con la CLI `az`. Reemplace `MY_RESOURCE` y `MY_RG`:

```bash
# 1. ID of the Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)

# 2. Create the service principal with the role to call models, scoped to the resource only
az ad sp create-for-rbac --name secureai-foundry \
  --role "Cognitive Services OpenAI User" --scopes "$RID"

# 3. (Recommended) let SecureAI list the deployments
az role assignment create --assignee <appId> --role "Reader" --scope "$RID"

# 4. (Claude and other partner models) let SecureAI call them
az role assignment create --assignee <appId> --role "Cognitive Services User" --scope "$RID"
```

El paso 2 imprime `appId` (ID de cliente), `password` (secreto de cliente) y `tenant` (ID del directorio). Los pegará en SecureAI.

<Warning>
Trate el secreto de cliente como una contraseña. SecureAI lo guarda **cifrado** y no lo vuelve a mostrar. Los secretos de cliente **vencen** (un año por defecto con `az`): programe un recordatorio para rotarlo, o la integración dejará de funcionar ese día.
</Warning>

<Info>
Los roles asignados en Azure pueden tardar **hasta 5 minutos** en aplicarse. Si la primera prueba de conexión devuelve **Falta el rol**, espere y pruebe de nuevo.
</Info>

## Paso 2. Conecte el recurso en SecureAI

1. Vaya a **Administrador → Integraciones → Proveedores de IA** y abra **Azure AI Foundry — Inferencia en tu cuenta**.
2. En **Conexión**, complete:

   | Campo | Qué ingresar |
   |-------|--------------|
   | **Nombre del recurso** | El nombre en `https://<nombre>.openai.azure.com` (el mismo que en `https://<nombre>.services.ai.azure.com`). Puede pegar la URL completa del endpoint; SecureAI conserva el nombre. |
   | **ID del directorio (tenant)** | `tenant` del paso 1. |
   | **ID de la aplicación (cliente)** | `appId` del paso 1. |
   | **Secreto de cliente** | `password` del paso 1. |
   | **ID de suscripción / Grupo de recursos** | La suscripción y el grupo de recursos del recurso. Se necesitan cuando el principal solo tiene **Reader** sobre el recurso (la configuración recomendada), porque puede leerlo pero no buscarlo. |

3. Haga clic en **Guardar**. SecureAI lista sus **despliegues** (nombre, modelo, versión y tipo de despliegue) y asigna cada modelo del catálogo al despliegue que lo sirve; por ejemplo, `openai/gpt-oss-120b` → su despliegue `gpt-oss-120b`. Todavía **no** se enruta tráfico: la integración se guarda apagada para que pueda probarla antes.

Si la lista de despliegues muestra una advertencia, el principal no tiene **Reader** sobre el recurso, o falta la suscripción o el grupo de recursos. La inferencia funciona igual; solo tendrá que escribir usted mismo los nombres de los despliegues.

## Paso 3. Elija qué corre en Foundry

- **Solo estas familias de modelos** — las familias que marque corren en su Foundry; todo lo demás sigue corriendo donde estaba. Por defecto: **OpenAI**.
- **Remapear todo a Foundry** — todas las llamadas a LLM corren en Foundry; los modelos sin despliegue los sirve un **despliegue por defecto**.

**Despliegues por defecto** (elíjalos entre sus despliegues; los de embeddings no se ofrecen, porque no pueden responder un chat):

| Nivel | Se usa para |
|-------|-------------|
| **Rápido** | Tareas en segundo plano (gramática, traducción, Teams) y llamadas internas remapeadas |
| **Estándar** | Modelos sin despliegue |
| **Razonamiento** | Modelos de razonamiento sin despliegue |
| **Visión** | Solicitudes con imágenes o PDFs |

En **Reemplazos de modelo** puede enviar un modelo del catálogo a un despliegue concreto (por ejemplo `openai/gpt-5.2` → `prod-chat`). Los reemplazos tienen prioridad sobre el mapeo automático.

El fallback y las cuotas de usuario funcionan igual que en Vertex AI: con el **fallback apagado** (recomendado), una solicitud que Foundry no puede atender se **rechaza** y nunca se envía a otro proveedor.

## Paso 4. Pruebe, revise y active

1. **Probar conexión** envía una solicitud de un token a cada despliegue por defecto (o a sus primeros despliegues de chat si no eligió valores por defecto), por el mismo camino que usa el tráfico real. Se factura a su suscripción de Azure (centavos).
2. **Vista previa del enrutamiento** muestra, para cada modelo del catálogo, si lo servirá **Foundry**, **Vertex AI** o **SecureAI**, y con qué despliegue. Un modelo de una familia que usted envía a Foundry y que no tiene despliegue (ni un valor por defecto para su nivel) aparece como **Oculto para los usuarios**: con el fallback apagado, el chat no lo ofrece.
3. Encienda **Enrutar tráfico a Azure AI Foundry** y haga clic en **Guardar**.

Los modelos servidos por su Foundry muestran el **logo de Azure** en el selector de modelos del chat.

## Residencia de datos

La región en la que se procesan las solicitudes depende del **tipo de despliegue**:

| Tipo de despliegue | Dónde se procesan los prompts |
|--------------------|-------------------------------|
| **Global** (Global Standard, Global Provisioned) | Cualquier región de Azure que elija Microsoft; sin garantía de residencia |
| **Data Zone** | Dentro de la zona de datos de EE. UU. o de la UE de su recurso |
| **Standard / Provisioned** (regional) | La región del recurso |

SecureAI aplica la política de residencia de su organización con esa región. Si necesita residencia, use despliegues **Data Zone** o regionales.

## Modelos de su nube que SecureAI no lista

Su recurso puede tener desplegados modelos de chat que el catálogo de SecureAI no incluye (por ejemplo Phi o Cohere). Cuando su despliegue de SecureAI los habilita, el chat también los ofrece:

- **De dónde salen.** De los despliegues de chat de su recurso que ningún modelo del catálogo de SecureAI ya alcanza. Los despliegues de embeddings, de voz y de imágenes nunca se ofrecen. Un modelo al que ya llega un modelo del catálogo conserva su nombre del catálogo y no se repite acá.
- **Dónde aparecen.** En el selector de modelos del chat, en su propia sección: **Tu Azure AI Foundry**. Su id es `byo/azure-foundry/` seguido del nombre del despliegue.
- **Dónde corren.** Solo en su Foundry. Nunca se envían a los proveedores administrados por SecureAI, aunque haya permitido el fallback.
- **Qué cuestan.** SecureAI no los cobra (no tienen precio de lista en SecureAI), así que el tope de gasto por asiento no se aplica a ellos, y cualquier asiento puede usarlos. Microsoft factura el consumo a su suscripción, como el resto.
- **Misma gobernanza.** Pasan por la política de modelos, los bloqueos de proveedor y de fabricante, el DLP, los recibos firmados y la auditoría. Si su política de modelos enumera los modelos permitidos, agréguelos en el editor de la política, donde aparecen en la sección de su nube.
- **Qué admite cada uno.** Las herramientas, las imágenes y el tamaño de contexto salen de los datos que el proveedor publica sobre el modelo. Si un modelo no admite herramientas o imágenes, el chat no se las ofrece, y las imágenes nunca se envían a otro proveedor para que las describa.

Para apagar la lista entera o para ocultar modelos sueltos, use en el panel de Azure AI Foundry el interruptor **Ofrecer los modelos de tu Azure AI Foundry que SecureAI no lista** y las casillas de cada modelo, y haga clic en **Guardar**.

## Qué se factura y a quién

- **El consumo de LLM lo factura Microsoft a su suscripción de Azure**, con los descuentos y créditos de su contrato.
- SecureAI muestra el costo de esos turnos como una **estimación a precio de lista** solo para analítica.
- Los turnos en Foundry **no descuentan puntos** de los usuarios, salvo que active **Aplicar cuotas de puntos de usuario**.

## Seguridad y cumplimiento

- **Credencial cifrada.** El secreto de cliente se guarda cifrado (AES-256-GCM) y nunca se devuelve al navegador.
- **Permisos mínimos.** *Cognitive Services OpenAI User* para invocar modelos (y *Cognitive Services User* si usa Claude u otros modelos de socios) y *Reader* para listar despliegues, todos limitados al **recurso**, nunca a la suscripción.
- **El camino sigue protegido.** Cada llamada pasa por el gateway SMLTP de SecureAI (DLP, token de autorización por solicitud, recibo firmado). El gateway solo se conecta a `<su-recurso>.openai.azure.com` y `<su-recurso>.services.ai.azure.com`.
- **Falla cerrado.** Si no se puede leer la configuración o Entra ID no emite un token, la solicitud se rechaza.
- **Auditoría.** Guardar, probar o desconectar queda en el registro de actividad (solo nombres de campos, nunca el secreto).

## Solución de problemas

| Motivo en la prueba | Causa probable | Qué hacer |
|---------------------|----------------|-----------|
| Credencial rechazada | Secreto de cliente incorrecto o vencido, o tenant o ID de cliente erróneos | Cree un secreto nuevo (`az ad app credential reset --id <appId>`) y péguelo. |
| Falta el rol | El principal no tiene **Cognitive Services OpenAI User** sobre el recurso (o **Cognitive Services User**, para Claude y los demás modelos de socios), o el rol aún se está propagando | Asigne el rol sobre el recurso; espere hasta 5 minutos. |
| Modelo no disponible | El nombre del despliegue no existe en el recurso | Verifique los nombres de los despliegues (actualice la lista) y los valores por defecto de cada nivel. |
| Cuota excedida | Se agotó la cuota de tokens por minuto del despliegue | Aumente la capacidad del despliegue en Foundry. |
| Bloqueado por tu política de modelos SMLTP | La política de SecureAI no permite el modelo | Agregue el modelo a la política permitida. |

Errores que pueden ver los usuarios en el chat:

| Código | Significado |
|--------|-------------|
| `SAI-FOUNDRY-001` | El modelo elegido no tiene despliegue en su Foundry y el fallback está apagado. |
| `SAI-FOUNDRY-002` | Entra ID no emitió un token (secreto inválido o vencido). Renueve el secreto. |
| `SAI-VERTEX-005` | No se pudo leer la configuración de inferencia en la nube y se rechazó por seguridad. Reintente en unos segundos. |

## Limitaciones actuales

- **Embeddings, re-ranking, OCR, asistente de administración, generación de imágenes y voz en tiempo real** siguen en proveedores administrados por SecureAI.
- **Un solo recurso de Foundry** por organización.
- La autenticación es **por principal de servicio con secreto de cliente** (todavía sin certificados ni identidad administrada).

## Relacionado

- [Azure — Descubrimiento](/integrations/cloud/azure-ai-foundry)
- [Google Vertex AI — Inferencia en tu cuenta](/integrations/cloud/vertex-ai-inference)
- [Amazon Bedrock — Inferencia en tu cuenta](/integrations/cloud/aws-bedrock-inference)
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
