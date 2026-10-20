---
sidebar_position: 1
title: "Google Drive — Añadir desde Drive"
sidebarTitle: "Google Drive"
icon: "/img/icons/google-drive.svg"
sidebar_label: "Google Drive"
description: "Permita que sus usuarios adjunten archivos de Google Drive y de unidades compartidas en el chat de SecureAI. Configuración self-serve con su propio cliente OAuth de Google Cloud."
---

# Google Drive — Añadir desde Drive

Con esta integración, sus usuarios adjuntan archivos de **Google Drive** (Mi unidad, Compartidos conmigo y **unidades compartidas**) directamente desde el chat, con la opción **Añadir desde Drive** del botón de adjuntar.

La configuración es **self-serve**: un administrador de su organización crea un cliente OAuth y una API key en **su propio proyecto de Google Cloud** y los carga en **Admin → Integraciones → Archivos**. No hace falta abrir un ticket ni esperar a Hiper AI: la opción aparece en el chat apenas guarda la configuración.

Tiempo estimado: 10 minutos.

## Cómo funciona

1. El usuario hace clic en **Adjuntar → Añadir desde Drive**. La primera vez, Google le pide que inicie sesión con **su propia cuenta** y que autorice a SecureAI.
2. Se abre el **selector oficial de Google Drive** (Google Picker). El usuario elige uno o varios archivos.
3. El navegador del usuario descarga **solo los archivos elegidos**, con el token del propio usuario, y los adjunta al mensaje. Los documentos de Google se exportan a Office (Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`; el resto, a PDF).
4. El archivo sigue el camino de cualquier adjunto: **pasa por el DLP** y por las políticas de su organización antes de llegar a un modelo.

<Info>
**SecureAI nunca ve todo su Drive.** Se usa el alcance `drive.file`: SecureAI solo puede leer los archivos que cada usuario elige en el selector, y nada más. No hay cuenta de servicio, ni delegación de dominio, ni lectura en segundo plano: un usuario solo puede adjuntar lo que ya puede abrir en Drive.
</Info>

## Requisitos previos

- Un proyecto de Google Cloud **dentro de la organización de su Google Workspace**, y permisos para habilitar APIs, configurar Google Auth Platform y crear credenciales en él (por ejemplo el rol **Propietario** o **Editor** del proyecto).
- Acceso de administrador a SecureAI, con permiso de **Administrador** sobre la sección **Integraciones**.
- Un plan de SecureAI que incluya **Adjuntar desde Drive / SharePoint**. Sin él puede dejar la configuración lista, pero los usuarios no verán la opción.

## Paso 1: Copiar las direcciones desde SecureAI

1. Inicie sesión en SecureAI como administrador.
2. Vaya a **Admin → Integraciones** y filtre por la categoría **Archivos**.
3. En la tarjeta **Google Drive** haga clic en **Conectar integración**.

<div class="mac-window">
  ![Tarjetas de la categoría Archivos](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. En la sección **1. Configurá Google Cloud** va a encontrar los dos valores que necesita en Google Cloud, cada uno con su botón **Copiar**:
   - **Origen de JavaScript autorizado**: la dirección de su instancia, por ejemplo `https://<su-empresa>.hiperai.ai`.
   - **Restricciones de sitio web para la API key**: dos líneas, la dirección de su instancia terminada en `/*` y `https://docs.google.com/*`.

<div class="mac-window">
  ![Origen y restricción en el drawer de SecureAI](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

Use siempre los valores que muestra su instancia: tienen que coincidir exactamente, incluido `https://` y sin `/` al final en el origen.

<Note>
`https://docs.google.com/*` es el propio selector de Google: se abre como un marco de `docs.google.com` y presenta la API key desde ahí. Sin esa línea, el selector se abre con el error **"The API developer key is invalid"**.
</Note>

## Paso 2: Elegir el proyecto y habilitar las APIs

1. Abra la [consola de Google Cloud](https://console.cloud.google.com) y, en el selector de proyectos de la barra superior, elija un proyecto de su organización (o cree uno nuevo, por ejemplo `SecureAI Drive`).
2. Vaya a **APIs y servicios → Biblioteca**, busque **Google Drive API** y haga clic en **Habilitar**.

<div class="mac-window">
  ![Habilitar la Google Drive API](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. Repita con **Google Picker API**.

<div class="mac-window">
  ![Habilitar la Google Picker API](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## Paso 3: Configurar la pantalla de consentimiento

1. Vaya a **Google Auth Platform** (menú **APIs y servicios → Pantalla de consentimiento de OAuth**). Si el proyecto todavía no la tiene configurada, haga clic en **Comenzar**.
2. Complete **Nombre de la app** (por ejemplo `SecureAI`) y el **correo de asistencia**.
3. En **Público**, elija **Interno**: solo las cuentas de su organización de Google Workspace podrán autorizar la app, y Google no exige verificación.
4. Complete el correo de contacto, acepte la política de datos del usuario y haga clic en **Crear**.

<div class="mac-window">
  ![Público Interno en Google Auth Platform](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

No hace falta agregar alcances a mano: SecureAI pide solo `drive.file`, un alcance no sensible.

## Paso 4: Crear el cliente OAuth

1. En **Google Auth Platform → Clientes**, haga clic en **Crear cliente**.
2. En **Tipo de aplicación**, elija **Aplicación web** y póngale un nombre (por ejemplo `SecureAI — Añadir desde Drive`).
3. En **Orígenes autorizados de JavaScript**, haga clic en **Agregar URI** y pegue el **Origen de JavaScript autorizado** que copió en el paso 1.
4. Deje vacías las **URIs de redireccionamiento autorizados**: el selector no las usa.
5. Haga clic en **Crear**.

<div class="mac-window">
  ![Cliente OAuth de tipo Aplicación web con el origen de SecureAI](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. Copie el **ID de cliente** (termina en `.apps.googleusercontent.com`). Este cliente no necesita secreto: no lo copie ni lo cargue en ningún lado.

<div class="mac-window">
  ![ID de cliente creado](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
Si su organización ya usa un cliente web de Google para el [inicio de sesión con Google Workspace](/iam/google-workspace) en SecureAI, puede reutilizarlo: agregue el origen de JavaScript a ese mismo cliente.
</Note>

## Paso 5: Crear y restringir la API key

1. Vaya a **APIs y servicios → Credenciales**, haga clic en **Crear credenciales → Clave de API**.
2. Abra la clave recién creada (**Editar clave de API**):
   - En **Restricciones de aplicaciones**, elija **Sitios web** y agregue, con **Agregar**, las **dos** restricciones que copió en el paso 1: la dirección de su instancia terminada en `/*` y `https://docs.google.com/*`.
   - En **Restricciones de API**, elija **Restringir clave** y marque solo **Google Picker API**.
3. Haga clic en **Guardar** y copie la clave (empieza con `AIza`). Los cambios en una API key pueden tardar hasta 5 minutos en aplicarse.

<div class="mac-window">
  ![API key restringida a Sitios web y a la Google Picker API](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
La API key **es pública por diseño**: el navegador de cada usuario la recibe para abrir el selector. Por eso es obligatorio restringirla al sitio de SecureAI, a `docs.google.com` y a la Google Picker API.
</Warning>

Si edita la clave después de usar **Probar conexión**, Google puede mostrar **"Warning: Potential breakage due to active usage"** con `drive.googleapis.com` en la lista. Ese uso lo generó la prueba de SecureAI, que consulta la Google Drive API con la clave para verificarla: escriba `UPDATE` y confirme.

## Paso 6: Cargar, probar y activar en SecureAI

1. Vuelva al drawer de **Google Drive** en SecureAI.
2. En **2. Pegá los identificadores**, pegue el **ID de cliente** y la **API key**.
3. En **3. Probalo**:
   - **Probar conexión** verifica desde los servidores de SecureAI que la API key es válida, que acepta pedidos desde su instancia y desde el selector de Google (`docs.google.com`), y que es del **mismo proyecto** que el cliente OAuth.
   - **Probar inicio de sesión** abre la misma ventana de Google que van a ver sus usuarios: inicie sesión con su cuenta. SecureAI confirma que el origen está autorizado y que la Google Drive API responde.

<div class="mac-window">
  ![Pruebas en verde en el drawer de SecureAI](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. En **4.**, deje activado **Mostrar "Añadir desde Drive" a los usuarios** y haga clic en **Guardar**.

La tarjeta pasa a **Disponible en el chat**.

## Paso 7: Cómo lo usan sus usuarios

1. En el chat, el usuario hace clic en el botón de **adjuntar** y elige **Añadir desde Drive**.

<div class="mac-window">
  ![Añadir desde Drive en el menú de adjuntar](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. Se abre una ventana de Google para elegir la cuenta y autorizar a SecureAI a ver los archivos que elija. Si el navegador bloquea las ventanas emergentes, hay que permitirlas para el sitio de SecureAI.
3. Se abre el selector de Google Drive, con las pestañas de Mi unidad, unidades compartidas e imágenes. Elige uno o varios archivos y hace clic en **Seleccionar**.


4. Los archivos aparecen adjuntos al mensaje, con el ícono de Google Drive. Al enviarlo pasan por las políticas de DLP de su organización: si un archivo tiene datos que una política bloquea (por ejemplo, direcciones de correo), el mensaje se bloquea como con cualquier adjunto.

## Solución de problemas

| Lo que ve | Causa | Qué hacer |
|---|---|---|
| **Probar conexión**: "La restricción de sitios web de la API key no incluye esta dirección" | La API key no tiene el sitio de SecureAI | Agregue la restricción exacta del paso 1, terminada en `/*` |
| **Probar conexión**: "Las restricciones de sitio web de la API key no incluyen https://docs.google.com/*" | Falta la segunda restricción del paso 1 | Agréguela (paso 5) y espere unos minutos |
| **Probar conexión**: "La API key es de un proyecto distinto al del cliente OAuth" | Las credenciales se crearon en proyectos distintos | Cree la API key en el mismo proyecto que el cliente OAuth |
| **Probar conexión**: "La Google Drive API no está habilitada" | Falta habilitar la API | Paso 2 |
| La ventana de Google muestra **Error 400: origin_mismatch** o **redirect_uri_mismatch** | El origen de JavaScript no está en el cliente OAuth | Agréguelo (paso 4). Los cambios pueden tardar unos minutos |
| La ventana de Google muestra **Error 403: org_internal** | El usuario usa una cuenta fuera de su Workspace | Debe iniciar sesión con la cuenta de la organización |
| El selector muestra "The API developer key is invalid" | La API key no tiene `https://docs.google.com/*` entre sus sitios web, o no permite la Google Picker API | Revise el paso 5 y use **Probar conexión**; los cambios en la clave tardan hasta 5 minutos |
| Google pide escribir `UPDATE` al guardar la API key ("Potential breakage due to active usage") | La prueba de SecureAI consultó la Drive API con la clave | Escriba `UPDATE` y confirme |
| "El navegador bloqueó la ventana de inicio de sesión de Google" | Las ventanas emergentes están bloqueadas para el sitio | Permítalas para la dirección de SecureAI |
| El mensaje se bloquea al enviarlo con el archivo adjunto | Una política de DLP detectó datos en el archivo | Es el comportamiento esperado; revise el incidente en **Protección de datos** |
| "SecureAI no recibió acceso a este archivo" | El archivo no se eligió en el selector | Elegirlo desde la ventana de Drive |
| "Su propietario no permite descargarlo" | El dueño desactivó la descarga | Pedir al dueño que lo habilite |
| El usuario no ve **Añadir desde Drive** | La integración está desactivada, sin guardar, o el plan no la incluye | Revise la tarjeta en **Admin → Integraciones → Archivos** |

## Preguntas frecuentes

**¿Funciona con unidades compartidas?** Sí. El selector tiene una pestaña para unidades compartidas; el usuario ve las unidades de las que es miembro.

**¿Qué permisos le da cada usuario a SecureAI?** Solo `drive.file`: acceso a los archivos que el usuario eligió en el selector. SecureAI no puede listar, buscar ni leer ningún otro archivo de su Drive.

**¿Cómo lo desactivo?** Desactive **Mostrar "Añadir desde Drive" a los usuarios** y guarde, o haga clic en **Quitar configuración**. Para cortar también el acceso ya otorgado por los usuarios, elimine el cliente OAuth en Google Cloud.

**Hiper AI ya me había configurado Drive. ¿Tengo que hacer algo?** No. Mientras no guarde una configuración propia, la tarjeta muestra **Configurado por Hiper AI** y todo sigue funcionando igual. Si guarda la suya, la reemplaza.

**¿Y la "cuenta de servicio de Google Drive" de la versión anterior?** Ya no se usa: cada descarga se hace con el token del propio usuario, que es más seguro, porque un usuario nunca puede adjuntar un archivo que no puede abrir.
