---
sidebar_position: 7
title: "Google Vertex AI — Inferencia en tu cuenta"
sidebar_label: "Vertex AI — Inferencia"
description: "Ejecute el tráfico de LLM de SecureAI en su propia cuenta de Google Cloud: pague a Google con su gasto comprometido (CUDs) mientras SecureAI sigue aplicando DLP, políticas y recibos firmados."
---

# Google Vertex AI — Inferencia en tu cuenta

Con esta integración, las llamadas a modelos de lenguaje (LLM) de SecureAI se ejecutan en **su propio proyecto de Google Cloud** en lugar de en los proveedores administrados por SecureAI. El consumo se factura directamente a su cuenta de Google, así que puede aprovechar su gasto comprometido (CUDs) y descuentos negociados.

SecureAI sigue en el camino de cada solicitud: **DLP, políticas de modelos, residencia de datos y recibos firmados** se aplican igual que con cualquier otro proveedor.

<Info>
**No confundir con la otra tarjeta de Google Cloud.** Esta página conecta Vertex AI como **proveedor de inferencia** (Admin → Integraciones → **Proveedores de IA**). La tarjeta **Google Cloud — Descubrimiento** (categoría **Nube**) solo inventaría el proyecto en modo lectura y nunca envía un prompt; se describe en [Google Cloud — Descubrimiento](/integrations/cloud/gcp-vertex-ai). Pueden usarse con el mismo proyecto, pero son independientes y piden permisos distintos.
</Info>

## Qué corre en Vertex y qué no

| Corre en su Vertex | Sigue en proveedores administrados por SecureAI |
|---|---|
| Chat y agentes (modelos de las familias que usted elija) | Embeddings (búsqueda en documentos e índices) |
| Resúmenes de reuniones de Teams (modelo Gemini) | Re-ranking de búsqueda |
| Corrección gramatical, traducción y demás tareas internas en segundo plano, cuando elige **Remapear todo** | OCR de documentos |
| | Asistente de administración |
| | Generación de imágenes y voz en tiempo real |
| | Modelos autoalojados y el proxy de Claude Code |

Modelos disponibles hoy: **Gemini** y los modelos abiertos servidos como MaaS en Vertex (**gpt-oss, DeepSeek, Llama y Qwen**). **Claude y Mistral en Vertex todavía no están soportados**; esos modelos se atienden según la configuración de fallback (ver más abajo).

## Requisitos previos

- Un **proyecto de Google Cloud** con facturación activa.
- La **Agent Platform API** habilitada en ese proyecto (el servicio `aiplatform.googleapis.com`).
- Una **cuenta de servicio** de su proyecto con el rol **Agent Platform User** (`roles/aiplatform.user`) y una **clave JSON** de esa cuenta.
- Permiso de **administrador** en la sección Integraciones de SecureAI. Con permiso de lectura puede ver la configuración pero no cambiarla.

## Paso 1. Prepare el proyecto en Google Cloud

Puede hacerlo con la línea de comandos (rápido) o desde la consola (con capturas).

<Tabs>
<Tab title="gcloud (Cloud Shell)">

Desde [Cloud Shell](https://shell.cloud.google.com/) o con `gcloud` instalado. Reemplace `MI_PROYECTO` por el ID real del proyecto:

```bash
gcloud config set project MI_PROYECTO

# 1. Habilitar la Agent Platform API
gcloud services enable aiplatform.googleapis.com

# 2. Crear una cuenta de servicio dedicada para SecureAI
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. Darle el rol mínimo para invocar modelos
gcloud projects add-iam-policy-binding MI_PROYECTO \
  --member="serviceAccount:secureai-vertex@MI_PROYECTO.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. Generar la clave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MI_PROYECTO.iam.gserviceaccount.com
```

</Tab>
<Tab title="Consola de Google Cloud">

1. En la [consola de Google Cloud](https://console.cloud.google.com/), seleccione su proyecto y abra **APIs y servicios → Biblioteca**. Busque **Agent Platform API** y haga clic en **Habilitar**. Si ya figura como **API habilitada**, no hace falta hacer nada.

   <div class="mac-window">
   ![Agent Platform API habilitada en Google Cloud](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. Vaya a **IAM y administración → Cuentas de servicio → Crear cuenta de servicio**. Póngale un nombre (por ejemplo `secureai-vertex`).

   <div class="mac-window">
   ![Crear la cuenta de servicio](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. En **Permisos**, otorgue el rol **Agent Platform User** (`roles/aiplatform.user`) sobre el proyecto y haga clic en **Listo**. No necesita ningún otro rol para inferencia.

   <div class="mac-window">
   ![Asignar el rol Agent Platform User](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. Abra la cuenta de servicio, vaya a la pestaña **Claves → Agregar clave → Crear clave nueva**, elija el tipo **JSON** y haga clic en **Crear**. El archivo se descarga una sola vez.

   <div class="mac-window">
   ![Crear la clave JSON](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
Trate el archivo JSON como una contraseña. SecureAI lo guarda **cifrado** y no lo vuelve a mostrar, pero el archivo descargado (`key.json`) queda en su equipo: pegue su contenido en SecureAI y **bórrelo** después, o guárdelo en un gestor de secretos.
</Warning>

<Warning>
**Si no puede crear la clave.** Si el paso 4 falla con `iam.disableServiceAccountKeyCreation`, la política de su organización de Google Cloud prohíbe las claves de cuenta de servicio (es el valor por defecto en organizaciones nuevas). Esta integración necesita la clave JSON, así que un administrador de políticas de la organización debe permitir la creación de claves para ese proyecto (restricción `iam.disableServiceAccountKeyCreation`) antes de continuar.
</Warning>

### Modelos abiertos (Llama, DeepSeek, Qwen, gpt-oss)

**Gemini no requiere nada más.** Para usar además Llama, DeepSeek, Qwen o gpt-oss, acepte primero los términos de cada modelo en **Vertex AI → Model Garden**. Estos modelos abiertos necesitan una **región** concreta (por ejemplo `us-central1`); con `global` pueden no estar disponibles.

## Paso 2. Conecte el proyecto en SecureAI

1. Vaya a **Administrador → Integraciones**, abra la categoría **Proveedores de IA** y haga clic en la tarjeta **Google Vertex AI — Inferencia en tu cuenta**.
2. En **Conexión**, complete:

   | Campo | Qué ingresar |
   |-------|--------------|
   | **ID del proyecto de Google Cloud** | El ID del proyecto (por ejemplo `mi-proyecto-123`), no el nombre. |
   | **Ubicación de Vertex AI** | Para empezar deje `global`: es donde están los Gemini 3 *preview* de los modelos por defecto. Si necesita **residencia de datos**, ponga una región (`us-central1`, `europe-west4`…): fija **dónde se procesan los prompts**, mientras que `global` deja que Google elija y no la garantiza. Los modelos abiertos necesitan una región. |
   | **Autenticación** | Deje seleccionada **Clave de service account (JSON)** y pegue el contenido **completo** de `key.json`. |

   <div class="mac-window">
   ![Sección Conexión del panel de Vertex AI](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Haga clic en **Guardar**. Todavía **no** se enruta tráfico: la integración se guarda apagada para que pueda probarla antes.

<Info>
**Recomendación para el primer día:** deje el modo **Solo estas familias de modelos** con solo **Gemini**, los modelos por defecto sin cambios y el fallback y las cuotas apagados. Es lo más predecible. Deje **Remapear todo** para cuando esto ya esté validado.
</Info>

<Info>
La clave pegada nunca vuelve a mostrarse. Para reemplazarla, pegue una nueva; si deja el campo vacío al guardar, se conserva la actual.
</Info>

## Paso 3. Elija qué corre en Vertex

En **Qué corre en Vertex** hay dos modos:

- **Solo estas familias de modelos** — las familias que marque (Gemini, gpt-oss, DeepSeek, Llama, Qwen) corren en su Vertex; el resto de los modelos sigue en los proveedores de SecureAI. Es el modo más conservador para empezar (por defecto: solo Gemini).
- **Remapear todo a Vertex** — todas las llamadas a LLM corren en su Vertex. Los modelos sin equivalente en Vertex los sirve un **modelo por defecto**.

**Modelos de Vertex por defecto** (editables):

| Nivel | Se usa para | Valor por defecto |
|-------|-------------|-------------------|
| **Rápido** | Tareas en segundo plano y utilidades (gramática, traducción, Teams) | `google/gemini-2.5-flash` |
| **Estándar** | Modelos sin equivalente | `google/gemini-3-flash-preview` |
| **Razonamiento** | Modelos de razonamiento sin equivalente | `google/gemini-3.1-pro-preview` |
| **Visión** | Solicitudes con imágenes o PDFs | `google/gemini-3-flash-preview` |

Además hay dos opciones:

| Opción | Apagada (recomendado) | Encendida |
|--------|----------------------|-----------|
| **Permitir fallback a modelos administrados por SecureAI** | Si Vertex falla o un modelo no tiene equivalente, la solicitud se **rechaza** en lugar de enviarse a otro proveedor. | Esas solicitudes se reintentan **una vez** en proveedores administrados por SecureAI. El reintento queda auditado. |
| **Aplicar cuotas de puntos de usuario al uso de Vertex** | El uso de Vertex no consume los puntos de los usuarios. | Se mantienen los límites de puntos por usuario también para Vertex. |

<div class="mac-window">

![Sección Qué corre en Vertex](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
Los modelos disponibles dependen de la **ubicación**. Los modelos por defecto (varios en versión *preview*) pueden no existir en todas las regiones. Si la prueba de conexión devuelve **Modelo no disponible en esta ubicación**, elija otra región o reemplace los modelos por defecto por unos que su región sirva. Los modelos abiertos (MaaS) requieren aceptar sus términos en Vertex AI Model Garden y una región concreta.
</Info>

## Paso 4. Pruebe la conexión

1. Con la integración guardada, en **Prueba de conexión** haga clic en **Probar conexión**.
2. SecureAI envía una solicitud mínima a cada modelo por defecto, **por el mismo camino que usará el tráfico real** (gateway, políticas y recibos incluidos), y muestra el resultado de cada uno con su latencia.

   <div class="mac-window">
   ![Resultado de la prueba de conexión](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Si algún modelo falla, el panel indica el motivo. Consulte la sección **Solución de problemas** al final de esta página.

<Info>
La prueba envía unas pocas solicitudes de un token y **se factura a su cuenta de Google** (centavos).
</Info>

## Paso 5. Revise el enrutamiento y active

1. Abra **Vista previa del enrutamiento → Ver qué carril sirve cada modelo**. Muestra, para cada modelo del catálogo, si lo servirá **su Vertex** (y con qué modelo de Vertex) o **SecureAI**, y cuáles quedarán **ocultos para los usuarios**. La vista previa simula la integración encendida, así que puede revisar el efecto antes de activarla.
2. Cuando la prueba pase, encienda **Enrutar tráfico a Vertex AI** y haga clic en **Guardar** otra vez. **Si no guarda, el interruptor no queda activo.** Para activarla se exige tener el proyecto y una credencial configurados.

   <div class="mac-window">
   ![Interruptor Enrutar tráfico a Vertex AI activado](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. La tarjeta pasa a verde: **Enrutando a Vertex**. Si está guardada pero apagada, muestra en ámbar **Configurado · sin enrutamiento a Vertex**.

El cambio se aplica de inmediato en el servidor donde se guardó y, a más tardar, en 30 segundos en el resto.

## Paso 6. Verifique en el selector de modelos

Cuando la integración está activa, los modelos que corren en su Vertex muestran el **logo de Google Cloud** junto al nombre en el selector de modelos del chat. Al pasar el mouse indica que corre en la cuenta de Vertex AI de su organización.

<div class="mac-window">

![Selector de modelos con el logo de Google Cloud](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

En el modo **Remapear todo** sin fallback, el selector **solo ofrece** los modelos que atiende su Vertex. Un modelo sin equivalente quedaría respondido por otro modelo distinto al elegido, y por eso se oculta.

## Qué se factura y a quién

- **El consumo de LLM lo factura Google a su cuenta**, no SecureAI. Verá el cargo en su facturación de Google Cloud, con sus descuentos y CUDs aplicados.
- SecureAI muestra el costo de los turnos servidos en Vertex como una **estimación a precio de lista** solo para analítica. Es una referencia: **no incluye** sus descuentos, así que la cifra real de Google puede ser menor.
- Los turnos en Vertex **no descuentan puntos** de los usuarios, salvo que active **Aplicar cuotas de puntos de usuario**.

## Seguridad y cumplimiento

- **Credenciales cifradas.** La clave de la cuenta de servicio se guarda cifrada (AES-256-GCM) y nunca se devuelve al navegador, ni siquiera a un administrador. La pantalla solo muestra el correo de la cuenta.
- **El camino sigue protegido.** Cada llamada pasa por el gateway SMLTP de SecureAI: DLP, token de autorización firmado por solicitud y **recibo firmado** verificable.
- **Residencia de datos.** Con una región fija (por ejemplo `europe-west4`), los prompts se procesan en esa región y se aplican las políticas de residencia de su organización.
- **Falla cerrado.** Si no se puede leer la configuración o obtener el token de Google, la solicitud se rechaza; no se envía a otro proveedor salvo que usted haya permitido el fallback.
- **Auditoría.** Guardar, probar o desconectar la integración queda en el registro de actividad, con los nombres de los campos cambiados y nunca con la clave.
- **Permisos mínimos.** Para inferencia basta `roles/aiplatform.user`; la integración no necesita leer su IAM ni su facturación.

## Desconectar

**Desconectar** (pie del panel) elimina la configuración y la clave guardada. Desde ese momento, **todo el tráfico vuelve a los proveedores administrados por SecureAI**. También puede apagar solo el interruptor **Enrutar tráfico a Vertex AI** para pausar el enrutamiento conservando la conexión.

Si dejó de usar la clave, **revóquela también en Google Cloud** (Cuentas de servicio → Claves).

## Solución de problemas

Estos son los motivos que muestra **Probar conexión**:

| Motivo | Causa probable | Qué hacer |
|--------|----------------|-----------|
| Credencial rechazada o no utilizable | JSON incompleto o inválido, o clave revocada | Vuelva a pegar el JSON completo o genere una clave nueva. |
| No autenticado | Google rechazó el token | Verifique que la cuenta de servicio exista y esté activa. |
| La API de Vertex AI no está habilitada en el proyecto | Falta el paso 1.1 | Habilite la **Agent Platform API** (`aiplatform.googleapis.com`) en el proyecto. |
| Falta roles/aiplatform.user | Permiso insuficiente | Otorgue el rol **Agent Platform User** (`roles/aiplatform.user`) a la cuenta de servicio en ese proyecto. |
| Modelo no disponible en esta ubicación | El modelo no existe en la región elegida, o es un modelo abierto cuyos términos no se aceptaron en Model Garden | Cambie la región o ese modelo por defecto; para modelos abiertos, acepte los términos en Model Garden. |
| Cuota excedida | Cuota de Vertex agotada | Revise las cuotas del proyecto o pida un aumento a Google. |
| Google devolvió un error | Falla del lado de Google | Reintente; si persiste, revise el estado de Google Cloud. |
| Bloqueado por tu política de modelos SMLTP | La política de SecureAI no permite el modelo | Agregue el modelo a la política permitida. |
| Gateway SMLTP de Vertex inaccesible / Error TLS | Problema de infraestructura de SecureAI | Contacte a soporte. No depende de su proyecto de Google. |

Errores que pueden ver los usuarios en el chat:

| Código | Significado |
|--------|-------------|
| `SAI-VERTEX-001` | El modelo elegido no tiene equivalente en Vertex y el fallback está apagado. Elija otro modelo, o permita el fallback. |
| `SAI-VERTEX-002` | No se pudo obtener el acceso a Google (clave inválida o revocada). Renueve la credencial. |
| `SAI-VERTEX-005` | No se pudo leer la configuración y se rechazó por seguridad. Reintente en unos segundos. |

## Limitaciones actuales

- **Claude y Mistral en Vertex** no están soportados (usan una API distinta).
- **Embeddings, re-ranking, OCR, asistente de administración, generación de imágenes y voz en tiempo real** siguen en proveedores administrados por SecureAI.
- **Una sola conexión** por organización (un proyecto y una ubicación a la vez).
- La autenticación es **solo con clave JSON** de cuenta de servicio.
- El proxy de **Claude Code** usa Anthropic de forma directa y no pasa por Vertex.

## Relacionado

- [Google Cloud — Descubrimiento](/integrations/cloud/gcp-vertex-ai) — inventario de agentes, modelos, identidades y costos del proyecto.
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Recibos firmados](/api/receipts)
