---
sidebar_position: 12
title: "API de OpenAI — Inferencia con la clave de su organización"
sidebarTitle: "API de OpenAI"
icon: "/img/icons/openai.svg"
sidebar_label: "API de OpenAI — Inferencia"
description: "Ejecute las llamadas a modelos GPT de SecureAI con la clave de API de OpenAI de su organización: OpenAI factura directamente a su cuenta o proyecto, con sus créditos y sus límites, mientras SecureAI sigue aplicando DLP, políticas de modelos y auditoría."
---

# API de OpenAI — Inferencia con la clave de su organización

Con esta integración, las llamadas a modelos **GPT** que hace SecureAI se envían a la **API de OpenAI con la clave de API de su organización**, en lugar de pasar por los proveedores administrados por SecureAI. El consumo lo factura **OpenAI a su organización o proyecto**: usa sus créditos, sus descuentos, su presupuesto y sus **límites de uso**.

SecureAI sigue en el camino de cada solicitud: **DLP, políticas de modelos, auditoría y recibos firmados** se aplican igual que con cualquier otro proveedor.

<Info>
**No confundir con OpenAI Platform.** Esta página conecta OpenAI como **proveedor de inferencia** (Administrador → Integraciones → **Proveedores de IA**) y usa una clave de API **normal**, que solo sirve para llamar a los modelos. La tarjeta [OpenAI Platform](/integrations/cloud/openai-platform) de la categoría **Nube** usa una clave de **administración** para inventariar proyectos, claves y uso, y nunca envía un prompt. Son integraciones independientes: puede usar una, la otra o las dos.
</Info>

## Cómo funciona

1. Usted crea en la plataforma de OpenAI una clave de API dedicada a SecureAI y la carga en SecureAI. Se guarda **cifrada** y no se vuelve a mostrar.
2. Al guardar, SecureAI lee con esa clave la **lista de modelos** que puede llamar (`GET /v1/models`, solo los modelos de chat) y asocia cada modelo GPT del catálogo de SecureAI con el id de OpenAI que lo sirve.
3. En cada turno de chat o tarea de un modelo GPT, SecureAI aplica DLP y la política de modelos, firma la solicitud y la envía a la **Chat Completions API** de OpenAI a través de su gateway SMLTP.
4. La respuesta vuelve por el gateway, que inspecciona y redacta también las respuestas en streaming antes de que lleguen al usuario, y emite el recibo firmado.

## Qué corre con su clave y qué no

| Corre con su clave de OpenAI | Sigue en proveedores administrados por SecureAI |
|---|---|
| Chat y agentes con modelos **GPT** (por ejemplo GPT‑5.x) | **gpt‑oss**: son modelos de pesos abiertos que OpenAI no aloja; siguen en SecureAI o en otra nube conectada |
| Tareas en segundo plano (gramática, traducción, resúmenes de Teams) cuando elige **Reasignar todo a API de OpenAI** | Modelos de otras familias (Claude, Gemini, Llama…), salvo que estén en otra nube conectada |
| Los modelos de chat que su clave puede llamar y el catálogo de SecureAI no lista (por ejemplo, la serie o), si su despliegue los ofrece | Embeddings, re-ranking de búsqueda, OCR de documentos, asistente de administración, generación de imágenes y voz en tiempo real |

## Cuántos proveedores de inferencia puede usar

La API de OpenAI cuenta como un proveedor de inferencia más, igual que Google Vertex AI, Azure AI Foundry, Amazon Bedrock y la API de Anthropic:

| Plan | Proveedores de inferencia habilitados al mismo tiempo |
|------|-------------------------------------------------------|
| **Scale** | 1 |
| **Enterprise** | Hasta 3, por ejemplo la API de OpenAI para GPT, la API de Anthropic para Claude y Vertex AI para Gemini |

Cada familia de modelos puede enrutarse a **un solo** proveedor. Si GPT ya corre en Azure AI Foundry o Amazon Bedrock, primero quítelo de allí: SecureAI rechaza una configuración que se superponga e indica qué familia colisiona.

## Requisitos previos

- Una **organización de OpenAI** con facturación activa (o un proyecto con presupuesto).
- Permiso para **crear claves de API** en la [plataforma de OpenAI](https://platform.openai.com) (**API keys**).
- Permiso de **administrador** en la sección Integraciones de SecureAI.
- Que la **política de modelos SMLTP** de su organización permita al menos un modelo GPT que su clave pueda llamar (**AI Gateway → Políticas**). SecureAI aplica esa política también a estas llamadas.

## Paso 1. Cree la clave en la plataforma de OpenAI

1. En la [plataforma de OpenAI](https://platform.openai.com), vaya a **API keys** y haga clic en **Create new secret key**.
2. Póngale un nombre que la identifique (por ejemplo `SecureAI`). Recomendamos una **clave de proyecto**: limita la clave a un proyecto, con su presupuesto, sus límites y su acceso a modelos.
3. Copie la clave (empieza con `sk-`). OpenAI la muestra una sola vez.

<Tip>
Use una clave **dedicada a SecureAI**: así puede ver su consumo por separado y revocarla sin afectar a otras aplicaciones.
</Tip>

## Paso 2. Conecte la clave en SecureAI

1. Vaya a **Administrador → Integraciones → Proveedores de IA** y abra **API de OpenAI — La clave de tu organización**.

   ![Tarjetas de la API de Anthropic y de la API de OpenAI en Administrador → Integraciones → Proveedores de IA](/img/cloud/anthropic-api-inference/01-integrations-ai-providers.png)

2. Complete:

   | Campo | Qué ingresar |
   |-------|--------------|
   | **Clave de API** | La clave del paso 1. |
   | **ID de organización (opcional)** | Solo si la clave pertenece a varias organizaciones: las llamadas se facturan a esta (`org-…`). |
   | **ID de proyecto (opcional)** | Envía las llamadas a este proyecto, con su presupuesto y sus límites (`proj_…`). |

3. Haga clic en **Guardar**.

Al guardar:

- El campo de la clave se vacía y muestra **Clave guardada (…xxxx)**: solo se conservan visibles los **últimos 4 caracteres**. La clave nunca se devuelve al navegador. Para cambiarla, escriba una nueva; si deja el campo vacío, se conserva la guardada.
- **Modelos que tu clave puede llamar** muestra los modelos de chat de su cuenta. Use **Actualizar** cuando OpenAI habilite modelos nuevos para su clave o proyecto.
- Todavía **no** se enruta tráfico: la integración se guarda apagada para que pueda probarla antes. La tarjeta muestra **Configurado · sin enrutar a API de OpenAI**.

Si la lista de modelos muestra un error, revise la clave y, si los cargó, los IDs de organización y proyecto.

## Paso 3. Elija qué corre con su clave

En **Qué corre en API de OpenAI** hay dos modos:

- **Solo estas familias de modelos** (por defecto, con **OpenAI** seleccionado): los modelos GPT corren con su clave; el resto sigue en los proveedores de SecureAI o en otra nube conectada.
- **Reasignar todo a API de OpenAI**: todas las llamadas a LLM corren con su clave. Los modelos que OpenAI no ofrece (Claude, Gemini…) los responden los **modelos de OpenAI por defecto**.

**Asociación automática.** SecureAI asocia cada modelo GPT del catálogo con el id que lista su clave: el mismo nombre (`openai/gpt-5.2` → `gpt-5.2`) o, si su clave solo tiene la versión con fecha, esa (`gpt-4.1-2025-04-14`). Si su clave no tiene un modelo, ese modelo queda oculto para los usuarios (o va a SecureAI si permitió el fallback).

**Modelos de OpenAI por defecto** (elíjalos de la lista de su clave):

| Nivel | Se usa para |
|-------|-------------|
| **Rápido** | Tareas en segundo plano (gramática, traducción, Teams) y llamadas internas reasignadas |
| **Estándar** | Modelos sin equivalente en OpenAI |
| **Razonamiento** | Modelos de razonamiento sin equivalente |
| **Visión** | Solicitudes con imágenes o PDFs |

En **Reemplazos modelo → id de OpenAI** puede enviar un modelo del catálogo de SecureAI a un id de OpenAI exacto, incluido un modelo con fine-tuning (`ft:gpt-4.1-mini:…`). Los reemplazos tienen prioridad sobre la asociación automática.

Además hay dos opciones:

| Opción | Apagada (por defecto, recomendado) | Encendida |
|--------|------------------------------------|-----------|
| **Permitir fallback a modelos administrados por SecureAI** | Si OpenAI falla o un modelo no tiene id de OpenAI, la solicitud se **rechaza** (falla cerrado) en lugar de enviarse a otro proveedor. | Esas solicitudes se reintentan **una vez** en proveedores administrados por SecureAI. El reintento queda auditado. |
| **Aplicar el tope de gasto de cada licencia a los turnos facturados a tu clave** | Los turnos que paga su clave no cuentan para el tope de gasto mensual de las licencias. | Cuentan para el tope de gasto mensual de cada licencia, a precio de lista. |

### Modelos de su clave que el catálogo no lista

Los modelos de chat que su clave puede llamar y el catálogo de SecureAI no tiene aparecen debajo del interruptor **Ofrecer los modelos de tu API de OpenAI que SecureAI no lista**, si su despliegue ofrece modelos propios de la nube. Puede desmarcar los que no quiera ofrecer, o apagar el interruptor.

Para que los usuarios puedan elegirlos en el chat (sección **Tu API de OpenAI** del selector de modelos), **agréguelos a la política de modelos SMLTP** en **AI Gateway → Políticas**: se listan en la misma sección. Corren solo con su clave, nunca en los proveedores de SecureAI, aunque haya permitido el fallback.

## Paso 4. Pruebe y active

1. Haga clic en **Probar conexión**. Envía una solicitud mínima (un token) a cada modelo por defecto, **por el mismo camino que usará el tráfico real**: gateway, política de modelos y recibos incluidos. Si todavía no eligió modelos por defecto, prueba el modelo GPT **más barato que su clave puede llamar y su política de modelos SMLTP permite**. La prueba **se factura a su cuenta de OpenAI** (una fracción de centavo).
2. Revise **Vista previa del enrutamiento**: para cada modelo del catálogo, muestra si lo servirá **Tu clave de API de OpenAI** (y con qué id), otra nube conectada o **SecureAI**, y cuáles quedarán ocultos para los usuarios.
3. Cuando la prueba pase, encienda **Enrutar tráfico a API de OpenAI** y haga clic en **Guardar**. **Si no guarda, el interruptor no queda activo.**
4. La tarjeta pasa a verde: **Enrutando a API de OpenAI**.

Los modelos que sirve su clave muestran el logo de OpenAI junto a su nombre en el selector de modelos del chat; al pasar el mouse dice que los sirve la clave de API de OpenAI de su organización.

## Residencia de datos

SecureAI **no puede fijar en cada solicitud la región donde OpenAI procesa una llamada**. Por eso, si su organización activa **Require a pinned region in your own cloud** (debajo de las tarjetas de proveedores, en **Administrador → Integraciones → Proveedores de IA**):

- No se puede habilitar el enrutamiento a la API de OpenAI.
- Si ya estaba habilitado, sus llamadas se **rechazan**. Nunca se envían a los proveedores de SecureAI en su lugar.

Si necesita residencia de datos para GPT, use [Azure AI Foundry](/integrations/cloud/azure-ai-foundry-inference) con una implementación regional o de zona de datos.

## Qué se factura y a quién

- **El consumo lo factura OpenAI a su organización o proyecto**, con sus créditos y descuentos. Los límites de velocidad y el presupuesto son **los de su organización o proyecto de OpenAI**.
- SecureAI muestra el costo de esos turnos como una **estimación a precio de lista** solo para analítica; la cifra real puede ser distinta.
- Estos turnos **no cuentan para el tope de gasto de las licencias**, salvo que active **Aplicar el tope de gasto de cada licencia a los turnos facturados a tu clave**.

## Seguridad y cumplimiento

- **La clave es de solo escritura.** Se guarda cifrada y nunca vuelve al navegador, ni siquiera a un administrador: solo se ven sus últimos 4 caracteres. No aparece en el registro de actividad.
- **El camino sigue protegido.** Cada llamada pasa por el gateway SMLTP de SecureAI: política de modelos, DLP sobre el prompt y sobre la respuesta (también en streaming), token de autorización por solicitud y **recibo firmado** verificable. El gateway reenvía su clave a OpenAI y no guarda ninguna propia.
- **Falla cerrado.** Si la clave no se puede leer, OpenAI la rechaza o un modelo no está disponible para su clave, la solicitud se rechaza; no se envía a otro proveedor salvo que usted haya permitido el fallback.
- **Separada de las claves de SecureAI.** Las llamadas que paga su clave usan un carril propio, distinto del que SecureAI usa con su propia cuenta.
- **Auditoría.** Guardar, probar o desconectar la integración queda en el registro de actividad, siempre sin la clave.

## Desconectar y revocar

**Desconectar** (pie del panel) elimina la configuración y la clave guardada. Desde ese momento, **todo el tráfico que atendía su clave vuelve a los proveedores administrados por SecureAI**. También puede apagar solo **Enrutar tráfico a API de OpenAI** para pausar el enrutamiento conservando la conexión.

Para revocar el acceso de SecureAI del lado de OpenAI, **elimine la clave** en la plataforma de OpenAI (**API keys**).

## Solución de problemas

Estos son los motivos que muestra **Probar conexión**:

| Motivo | Causa probable | Qué hacer |
|--------|----------------|-----------|
| Credencial / OpenAI rechazó la clave (401) | La clave es incorrecta o fue revocada, o los IDs de organización o proyecto no corresponden a la clave | Revise la clave y los IDs; si hace falta, cree una clave nueva. |
| La clave no tiene permiso (403) | El proyecto no tiene acceso a ese modelo | Revise el acceso a modelos del proyecto y los permisos de la clave en la plataforma de OpenAI. |
| Modelo no disponible | OpenAI no ofrece ese id de modelo a su clave o proyecto | **Actualizar** la lista de modelos y elija otro id. |
| Límite de uso o cuota | Se alcanzó el rate limit, la cuota o el presupuesto del proyecto | Revise los límites y la facturación del proyecto en la plataforma de OpenAI, o reintente más tarde. |
| Bloqueado por tu política de modelos SMLTP | La política de SecureAI no permite el modelo probado | Use el enlace **Abrir las políticas SMLTP** y permita el modelo, o elija como modelo por defecto uno que la política ya permita. |
| OpenAI devolvió un error | Falla del lado de OpenAI | Reintente; si persiste, revise el estado de OpenAI. |
| El gateway SMLTP de este carril no responde / Error de TLS | Problema de infraestructura de SecureAI | Contacte a soporte. No depende de su cuenta de OpenAI. |

Errores que pueden ver los usuarios en el chat:

| Código | Significado |
|--------|-------------|
| `SAI-OPENAI-001` | El modelo elegido no está disponible para su clave y el fallback está apagado. Elija otro modelo, agregue un reemplazo o permita el fallback. |
| `SAI-OPENAI-002` | No se pudo leer la clave de API guardada. Revise la conexión. |
| `SAI-RESIDENCY-001` | La política de residencia exige una región fija y la API de OpenAI no la fija: la llamada se rechazó. |
| `SAI-VERTEX-005` | No se pudo leer la configuración de inferencia y se rechazó por seguridad. Reintente en unos segundos. |

Si una llamada falla por un motivo que solo un administrador puede resolver (clave revocada, cuota agotada, modelo no disponible), SecureAI avisa a los administradores por correo, en la tarjeta de la integración y en la campana de notificaciones.

## Limitaciones actuales

- **Sin residencia de datos fija** (vea arriba).
- **gpt‑oss** no corre con su clave: OpenAI no aloja esos modelos.
- **Embeddings, re-ranking, OCR, asistente de administración, generación de imágenes y voz en tiempo real** siguen en proveedores administrados por SecureAI.

## Relacionado

- [API de Anthropic — Inferencia con la clave de su organización](/integrations/cloud/anthropic-api-inference)
- [Azure AI Foundry — Inferencia en tu cuenta](/integrations/cloud/azure-ai-foundry-inference): GPT en su recurso de Azure, con residencia de datos.
- [OpenAI Platform](/integrations/cloud/openai-platform): inventario de proyectos, claves y uso de OpenAI.
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Recibos firmados](/api/receipts)
