---
sidebar_position: 11
title: "API de Anthropic — Inferencia con la clave de su organización"
sidebarTitle: "API de Anthropic"
icon: "/img/icons/anthropic.svg"
sidebar_label: "API de Anthropic — Inferencia"
description: "Ejecute las llamadas a Claude de SecureAI con la clave de API de Anthropic de su organización: Anthropic factura directamente a su cuenta, con sus créditos y sus límites, mientras SecureAI sigue aplicando DLP, políticas de modelos y auditoría."
---

# API de Anthropic — Inferencia con la clave de su organización

Con esta integración, las llamadas a **Claude** que hace SecureAI se envían a la **API de Anthropic con la clave de API de su organización**, en lugar de pasar por los proveedores administrados por SecureAI. El consumo lo factura **Anthropic a su cuenta**: usa sus créditos, sus descuentos y sus **límites de uso** (rate limits).

SecureAI sigue en el camino de cada solicitud: **DLP, políticas de modelos, auditoría y recibos firmados** se aplican igual que con cualquier otro proveedor.

<Info>
**No confundir con Anthropic Console.** Esta página conecta Anthropic como **proveedor de inferencia** (Administrador → Integraciones → **Proveedores de IA**) y usa una clave de API **normal**, que solo sirve para llamar a los modelos. La tarjeta [Anthropic Console](/integrations/cloud/anthropic-console) de la categoría **Nube** usa una clave de **administración** para inventariar claves, workspaces y uso, y nunca envía un prompt. Son integraciones independientes: puede usar una, la otra o las dos.
</Info>

## Cómo funciona

1. Usted crea en Anthropic Console una clave de API dedicada a SecureAI y la carga en SecureAI. Se guarda **cifrada** y no se vuelve a mostrar.
2. Al guardar, SecureAI lee con esa clave la **lista de modelos** que puede llamar (`GET /v1/models`) y asocia cada modelo Claude del catálogo de SecureAI con el id de Anthropic que lo sirve.
3. En cada turno de chat o tarea de un modelo Claude, SecureAI aplica DLP y la política de modelos, firma la solicitud y la envía a la **Messages API** de Anthropic a través de su gateway SMLTP.
4. La respuesta vuelve por el gateway, que inspecciona y redacta también las respuestas en streaming antes de que lleguen al usuario, y emite el recibo firmado.

## Qué corre con su clave y qué no

| Corre con su clave de Anthropic | Sigue en proveedores administrados por SecureAI |
|---|---|
| Chat y agentes con modelos **Claude** | Modelos de otras familias (GPT, Gemini, Llama…), salvo que estén en otra nube conectada |
| Tareas en segundo plano (gramática, traducción, resúmenes de Teams) cuando elige **Reasignar todo a API de Anthropic** | Embeddings (búsqueda en documentos e índices), re-ranking de búsqueda, OCR de documentos |
| Los modelos Claude que su clave puede llamar y el catálogo de SecureAI todavía no lista (por ejemplo, la línea Claude 5.5), si su despliegue los ofrece | Asistente de administración, generación de imágenes y voz en tiempo real |
| | El proxy de Claude Code, que usa su propio carril |

## Cuántos proveedores de inferencia puede usar

La API de Anthropic cuenta como un proveedor de inferencia más, igual que Google Vertex AI, Azure AI Foundry, Amazon Bedrock y la API de OpenAI:

| Plan | Proveedores de inferencia habilitados al mismo tiempo |
|------|-------------------------------------------------------|
| **Scale** | 1 |
| **Enterprise** | Hasta 3, por ejemplo la API de Anthropic para Claude, la API de OpenAI para GPT y Vertex AI para Gemini |

Cada familia de modelos puede enrutarse a **un solo** proveedor. Si Claude ya corre en Amazon Bedrock, primero quítelo de Bedrock: SecureAI rechaza una configuración que se superponga e indica qué familia colisiona.

## Requisitos previos

- Una **cuenta de Anthropic** con facturación activa y saldo de créditos.
- Permiso para **crear claves de API** en [Anthropic Console](https://console.anthropic.com) (**Settings → API keys**).
- Permiso de **administrador** en la sección Integraciones de SecureAI.
- Que la **política de modelos SMLTP** de su organización permita al menos un modelo Claude que su clave pueda llamar (**AI Gateway → Políticas**). SecureAI aplica esa política también a estas llamadas.

## Paso 1. Cree la clave en Anthropic Console

1. En [Anthropic Console](https://console.anthropic.com), vaya a **Settings → API keys** y haga clic en **Create Key**.
2. Póngale un nombre que la identifique (por ejemplo `SecureAI`) y, si usa workspaces, créela en el workspace al que quiere facturar estas llamadas. Los límites de uso y de gasto de ese workspace se aplican a SecureAI.
3. Copie la clave (empieza con `sk-ant-`). Anthropic la muestra una sola vez.

<Tip>
Use una clave **dedicada a SecureAI**: así puede ver su consumo por separado y revocarla sin afectar a otras aplicaciones.
</Tip>

## Paso 2. Conecte la clave en SecureAI

1. Vaya a **Administrador → Integraciones → Proveedores de IA** y abra **API de Anthropic — La clave de tu organización**.

   ![Tarjetas de la API de Anthropic y de la API de OpenAI en Administrador → Integraciones → Proveedores de IA](/img/cloud/anthropic-api-inference/01-integrations-ai-providers.png)

2. En **Clave de API**, pegue la clave y haga clic en **Guardar**.

Al guardar:

- El campo se vacía y muestra **Clave guardada (…xxxx)**: solo se conservan visibles los **últimos 4 caracteres**. La clave nunca se devuelve al navegador. Para cambiarla, escriba una nueva; si deja el campo vacío, se conserva la guardada.
- **Modelos que tu clave puede llamar** muestra los modelos Claude de su cuenta, con su contexto máximo, si aceptan imágenes y si admiten razonamiento extendido. Use **Actualizar** cuando Anthropic habilite modelos nuevos para su cuenta.
- Todavía **no** se enruta tráfico: la integración se guarda apagada para que pueda probarla antes. La tarjeta muestra **Configurado · sin enrutar a API de Anthropic**.

Si la lista de modelos muestra un error, revise la clave: Anthropic la rechazó o no tiene acceso a la lista. El enrutamiento puede funcionar igual con los ids de modelo que SecureAI conoce (la prueba de conexión los verifica), pero la asociación automática queda limitada.

## Paso 3. Elija qué corre con su clave

En **Qué corre en API de Anthropic** hay dos modos:

- **Solo estas familias de modelos** (por defecto, con **Claude** seleccionado): los modelos Claude corren con su clave; el resto sigue en los proveedores de SecureAI o en otra nube conectada.
- **Reasignar todo a API de Anthropic**: todas las llamadas a LLM corren con su clave. Los modelos que Anthropic no ofrece (GPT, Gemini…) los responden los **modelos de Anthropic por defecto**.

**Asociación automática.** SecureAI asocia cada modelo Claude del catálogo con el id que lista su clave: el alias (`claude-sonnet-4-6`) o, si su clave solo tiene la versión con fecha, esa (`claude-haiku-4-5-20251001`). Nunca asocia un modelo con otro parecido: si su clave no tiene un modelo, ese modelo queda oculto para los usuarios (o va a SecureAI si permitió el fallback).

**Modelos de Anthropic por defecto** (elíjalos de la lista de su clave):

| Nivel | Se usa para |
|-------|-------------|
| **Rápido** | Tareas en segundo plano (gramática, traducción, Teams) y llamadas internas reasignadas |
| **Estándar** | Modelos sin equivalente en Anthropic |
| **Razonamiento** | Modelos de razonamiento sin equivalente |
| **Visión** | Solicitudes con imágenes o PDFs |

En **Reemplazos modelo → id de Anthropic** puede enviar un modelo del catálogo de SecureAI a un id de Anthropic exacto (por ejemplo, `anthropic/claude-sonnet-5` → `claude-sonnet-5-5`). Los reemplazos tienen prioridad sobre la asociación automática.

Además hay dos opciones:

| Opción | Apagada (por defecto, recomendado) | Encendida |
|--------|------------------------------------|-----------|
| **Permitir fallback a modelos administrados por SecureAI** | Si Anthropic falla o un modelo no tiene id de Anthropic, la solicitud se **rechaza** (falla cerrado) en lugar de enviarse a otro proveedor. | Esas solicitudes se reintentan **una vez** en proveedores administrados por SecureAI. El reintento queda auditado. |
| **Aplicar el tope de gasto de cada licencia a los turnos facturados a tu clave** | Los turnos que paga su clave no cuentan para el tope de gasto mensual de las licencias. | Cuentan para el tope de gasto mensual de cada licencia, a precio de lista. |

### Modelos de su clave que el catálogo no lista

Los modelos Claude que su clave puede llamar y el catálogo de SecureAI todavía no tiene (por ejemplo, los más nuevos) aparecen debajo del interruptor **Ofrecer los modelos de tu API de Anthropic que SecureAI no lista**, si su despliegue ofrece modelos propios de la nube. Puede desmarcar los que no quiera ofrecer, o apagar el interruptor.

Para que los usuarios puedan elegirlos en el chat (sección **Tu API de Anthropic** del selector de modelos), **agréguelos a la política de modelos SMLTP** en **AI Gateway → Políticas**: se listan en la misma sección. Corren solo con su clave, nunca en los proveedores de SecureAI, aunque haya permitido el fallback.

## Paso 4. Pruebe y active

1. Haga clic en **Probar conexión**. Envía una solicitud mínima (un token) a cada modelo por defecto, **por el mismo camino que usará el tráfico real**: gateway, política de modelos y recibos incluidos. Si todavía no eligió modelos por defecto, prueba el modelo Claude **más barato que su clave puede llamar y su política de modelos SMLTP permite**. La prueba **se factura a su cuenta de Anthropic** (una fracción de centavo).
2. Revise **Vista previa del enrutamiento**: para cada modelo del catálogo, muestra si lo servirá **Tu clave de API de Anthropic** (y con qué id), otra nube conectada o **SecureAI**, y cuáles quedarán ocultos para los usuarios.
3. Cuando la prueba pase, encienda **Enrutar tráfico a API de Anthropic** y haga clic en **Guardar**. **Si no guarda, el interruptor no queda activo.**
4. La tarjeta pasa a verde: **Enrutando a API de Anthropic**.

Los modelos que sirve su clave muestran el logo de Anthropic junto a su nombre en el selector de modelos del chat; al pasar el mouse dice que los sirve la clave de API de Anthropic de su organización.

## Residencia de datos

La API de Anthropic **no permite fijar en cada solicitud la región donde se procesa**. Por eso, si su organización activa **Require a pinned region in your own cloud** (debajo de las tarjetas de proveedores, en **Administrador → Integraciones → Proveedores de IA**):

- No se puede habilitar el enrutamiento a la API de Anthropic.
- Si ya estaba habilitado, sus llamadas se **rechazan**. Nunca se envían a los proveedores de SecureAI en su lugar.

Si necesita residencia de datos para Claude, use [Amazon Bedrock](/integrations/cloud/aws-bedrock-inference) con alcance **Geografía** o **Solo dentro de la Región**.

## Qué se factura y a quién

- **El consumo lo factura Anthropic a su cuenta**, con sus créditos y descuentos. Los límites de velocidad son **los de su cuenta o workspace de Anthropic**.
- SecureAI muestra el costo de esos turnos como una **estimación a precio de lista** solo para analítica; la cifra real puede ser distinta.
- Estos turnos **no cuentan para el tope de gasto de las licencias**, salvo que active **Aplicar el tope de gasto de cada licencia a los turnos facturados a tu clave**.

## Seguridad y cumplimiento

- **La clave es de solo escritura.** Se guarda cifrada y nunca vuelve al navegador, ni siquiera a un administrador: solo se ven sus últimos 4 caracteres. No aparece en el registro de actividad.
- **El camino sigue protegido.** Cada llamada pasa por el gateway SMLTP de SecureAI: política de modelos, DLP sobre el prompt y sobre la respuesta (también en streaming), token de autorización por solicitud y **recibo firmado** verificable. El gateway reenvía su clave a Anthropic y no guarda ninguna propia.
- **Falla cerrado.** Si la clave no se puede leer, Anthropic la rechaza o un modelo no está disponible para su clave, la solicitud se rechaza; no se envía a otro proveedor salvo que usted haya permitido el fallback.
- **Separada de las claves de SecureAI.** Las llamadas que paga su clave usan un carril propio, distinto del que SecureAI usa con su propia cuenta de Anthropic (por ejemplo, para el proxy de Claude Code).
- **Auditoría.** Guardar, probar o desconectar la integración queda en el registro de actividad, siempre sin la clave.

## Desconectar y revocar

**Desconectar** (pie del panel) elimina la configuración y la clave guardada. Desde ese momento, **todo el tráfico que atendía su clave vuelve a los proveedores administrados por SecureAI**. También puede apagar solo **Enrutar tráfico a API de Anthropic** para pausar el enrutamiento conservando la conexión.

Para revocar el acceso de SecureAI del lado de Anthropic, **elimine la clave** en Anthropic Console (**Settings → API keys**).

## Solución de problemas

Estos son los motivos que muestra **Probar conexión**:

| Motivo | Causa probable | Qué hacer |
|--------|----------------|-----------|
| Credencial / Anthropic rechazó la clave (401) | La clave es incorrecta, fue revocada o se copió incompleta | Cree una clave nueva y péguela otra vez. |
| La clave no tiene permiso (403) | El workspace de la clave no tiene acceso a ese modelo | Revise el workspace y los permisos de la clave en Anthropic Console. |
| Modelo no disponible | Anthropic no ofrece ese id de modelo a su clave | **Actualizar** la lista de modelos y elija otro id. |
| Límite de uso o créditos insuficientes | Se alcanzó el rate limit o el saldo de créditos es insuficiente | Revise **Plans & Billing** en Anthropic Console, o reintente más tarde. |
| Bloqueado por tu política de modelos SMLTP | La política de SecureAI no permite el modelo probado | Use el enlace **Abrir las políticas SMLTP** y permita el modelo, o elija como modelo por defecto uno que la política ya permita. |
| Anthropic devolvió un error | Falla del lado de Anthropic | Reintente; si persiste, revise el estado de Anthropic. |
| El gateway SMLTP de este carril no responde / Error de TLS | Problema de infraestructura de SecureAI | Contacte a soporte. No depende de su cuenta de Anthropic. |

Errores que pueden ver los usuarios en el chat:

| Código | Significado |
|--------|-------------|
| `SAI-ANTHROPIC-001` | El modelo elegido no está disponible para su clave y el fallback está apagado. Elija otro modelo, agregue un reemplazo o permita el fallback. |
| `SAI-ANTHROPIC-002` | No se pudo leer la clave de API guardada. Revise la conexión. |
| `SAI-RESIDENCY-001` | La política de residencia exige una región fija y la API de Anthropic no la fija: la llamada se rechazó. |
| `SAI-VERTEX-005` | No se pudo leer la configuración de inferencia y se rechazó por seguridad. Reintente en unos segundos. |

Si una llamada falla por un motivo que solo un administrador puede resolver (clave revocada, créditos agotados, modelo no disponible), SecureAI avisa a los administradores por correo, en la tarjeta de la integración y en la campana de notificaciones.

## Limitaciones actuales

- **Sin residencia de datos fija** (vea arriba).
- **Embeddings, re-ranking, OCR, asistente de administración, generación de imágenes y voz en tiempo real** siguen en proveedores administrados por SecureAI.
- **El proxy de Claude Code** sigue usando su propio carril, no su clave.

## Relacionado

- [API de OpenAI — Inferencia con la clave de su organización](/integrations/cloud/openai-api-inference)
- [Amazon Bedrock — Inferencia en tu cuenta](/integrations/cloud/aws-bedrock-inference): Claude en su cuenta de AWS, con residencia de datos.
- [Anthropic Console](/integrations/cloud/anthropic-console): inventario de claves, workspaces y uso de Anthropic.
- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [Recibos firmados](/api/receipts)
