---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Integración de Google Workspace (SSO)

Con esta integración, los usuarios de su organización inician sesión en SecureAI con su cuenta de Google Workspace (botón **Continuar con Google**). La configuración es **self-serve**: un administrador de su organización crea un cliente OAuth en su propio proyecto de Google Cloud y carga los datos en **Admin → Integraciones**. No hace falta abrir un ticket ni esperar a Hiper AI: el botón aparece en la página de login apenas guarda la configuración.

Tiempo estimado: 10 minutos.

## Requisitos previos

- Un proyecto de Google Cloud **dentro de la organización de su Google Workspace**, y permisos para configurar Google Auth Platform y crear clientes OAuth en él (por ejemplo el rol **Propietario** o **Editor** del proyecto).
- Acceso de administrador a SecureAI, con permiso de **Administrador** sobre la sección **Integraciones**.

## Cómo funciona

1. Usted crea un **cliente OAuth 2.0 de tipo "Aplicación web"** en Google Cloud. SecureAI usa OpenID Connect con los alcances `openid`, `email` y `profile`.
2. En SecureAI carga el **ID de cliente**, el **Secreto del cliente** y sus **dominios de Google Workspace**. El secreto se guarda cifrado y nunca se vuelve a mostrar.
3. Cuando un usuario hace clic en **Continuar con Google**, Google lo autentica y SecureAI lo deja entrar solo si:
   - Google verificó su email,
   - la cuenta es **administrada por uno de sus dominios de Workspace** (claim `hd`), y
   - su email coincide con una cuenta **activa** de SecureAI.

Una cuenta personal de Google (por ejemplo una cuenta @gmail.com o una cuenta personal creada con el email de la empresa) **no** puede entrar, aunque tenga el mismo email que un usuario de SecureAI.

## Paso 1: Copiar la URI de redirección desde SecureAI

1. Inicie sesión en SecureAI como administrador.
2. Vaya a **Admin → Integraciones** y filtre por la categoría **IAM**.
3. En la tarjeta **Google Workspace (SSO)** haga clic en **Conectar integración** (o en **Reconfigurar**, si la tarjeta dice **Configurado por Hiper AI**).
4. En la sección **1. Creá un cliente OAuth en Google Cloud**, haga clic en **Copiar** junto a la **URI de redirección**.

La URI tiene esta forma (con el dominio de su instancia):

```
https://<su-empresa>.hiperai.ai/api/auth/google/callback
```

Use siempre la URI que muestra su instancia: tiene que coincidir exactamente, incluido `https://`.

## Paso 2: Elegir o crear un proyecto de Google Cloud

1. Abra la [consola de Google Cloud](https://console.cloud.google.com).
2. En el selector de proyectos de la barra superior, elija un proyecto de su organización o haga clic en **Proyecto nuevo**.

<div class="mac-window">
  ![Proyecto nuevo](/img/google%20sso%20images/google%20-%201.png)
</div>

3. Si lo crea: póngale un nombre (por ejemplo `SecureAI SSO`), verifique que la **Organización** sea la de su Google Workspace y haga clic en **Crear**.

<div class="mac-window">
  ![Crear proyecto](/img/google%20sso%20images/google%20-%202.png)
</div>

No hace falta habilitar ninguna API para el inicio de sesión.

## Paso 3: Configurar Google Auth Platform (pantalla de consentimiento)

1. En el menú, vaya a **APIs y servicios → Pantalla de consentimiento de OAuth** (en la consola nueva se llama **Google Auth Platform**). Si es la primera vez, haga clic en **Comenzar**.

<div class="mac-window">
  ![Pantalla de consentimiento de OAuth](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **Información de la app**: nombre de la app (por ejemplo `SecureAI`) y un email de asistencia al usuario.
3. **Público**: elija **Interno**. Así solo pueden usar la app las cuentas de su organización de Google Workspace, y Google no exige verificación de la app.
4. **Información de contacto**: un email para avisos de Google.
5. Acepte la política de datos del usuario y haga clic en **Crear**.

<div class="mac-window">
  ![Crear la configuración de OAuth](/img/google%20sso%20images/google%20-%204.png)
</div>

Los alcances `openid`, `email` y `profile` no son sensibles: no hace falta agregarlos en **Acceso a datos**.

<Note>
Si elige **Externo**, la app tiene que estar **En producción** (no "Prueba"); en modo prueba solo pueden entrar los usuarios de prueba que cargue. Aun con Externo, SecureAI solo acepta cuentas de los dominios de Workspace que configure en el paso 5.
</Note>

## Paso 4: Crear el cliente OAuth

1. En Google Auth Platform vaya a **Clientes** (o **APIs y servicios → Credenciales → + Crear credenciales → ID de cliente de OAuth**).

<div class="mac-window">
  ![Crear ID de cliente OAuth](/img/google%20sso%20images/google%20-%207.png)
</div>

2. Haga clic en **+ Crear cliente**.
3. **Tipo de aplicación**: **Aplicación web**.
4. **Nombre**: por ejemplo `SecureAI SSO`.
5. En **URIs de redireccionamiento autorizados** haga clic en **+ Agregar URI** y pegue la URI del paso 1. (No hace falta completar **Orígenes autorizados de JavaScript**.)

<div class="mac-window">
  ![URIs de redireccionamiento autorizados](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Deje sin marcar **Usar este cliente para un agente con IA** (*Use this client for an AI-powered agent*): es para otro tipo de cliente y SecureAI no lo necesita.
7. Haga clic en **Crear**.
8. En la ventana que aparece, copie el **ID de cliente** (termina en `.apps.googleusercontent.com`) y el **Secreto del cliente** (empieza con `GOCSPX-`). Puede descargar el JSON como respaldo. No cierre la ventana hasta haberlo copiado.

<div class="mac-window">
  ![Cliente OAuth creado](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google muestra el secreto completo solo al crearlo. Guárdelo en un lugar seguro; si lo pierde, agregue un secreto nuevo en el cliente.
</Warning>

Google avisa que un cliente nuevo o un cambio en sus URIs puede tardar desde 5 minutos hasta algunas horas en aplicarse. Si en el paso 5 **Probar conexión** marca la URI de redirección o el ID de cliente recién creados, espere unos minutos y pruebe de nuevo antes de cambiar nada.

## Paso 5: Cargar los datos en SecureAI y probar

Vuelva a **Admin → Integraciones → Google Workspace (SSO)**:

1. En **2. Pegá los datos del cliente OAuth** complete:
   - **ID de cliente**: el del paso 4.
   - **Secreto del cliente**: el del paso 4.
   - **Dominios de email permitidos** (obligatorio): su dominio principal de Google Workspace y, si los usa, sus dominios secundarios, separados por coma. Por ejemplo `contoso.com, contoso.com.ar`.
2. En **3. Probá la conexión** haga clic en **Probar conexión**. SecureAI consulta a Google (sin iniciar sesión a nadie) y verifica:

   | Verificación | Si falla |
   |---|---|
   | ID de cliente | Google no conoce ese cliente (`invalid_client`). Revise que copió el ID completo y que el cliente no esté borrado o deshabilitado. |
   | URI de redirección registrada en el cliente | La URI del paso 1 no está en **URIs de redireccionamiento autorizados** (`redirect_uri_mismatch`). Agréguela tal cual y espere unos minutos. |
   | Secreto del cliente | El secreto no corresponde a ese cliente (`invalid_client`). Péguelo de nuevo o agregue uno nuevo. |

   La prueba usa lo que está escrito en el formulario, así que puede probar antes de guardar.
3. Verifique que esté activado **Mostrar "Continuar con Google" en la página de login** (viene activado la primera vez). Sin dominios cargados, SecureAI no deja guardarlo activado.
4. Haga clic en **Guardar**.

Desde ese momento la tarjeta muestra **Activo en la página de login** y el botón **Continuar con Google** aparece en el login de su instancia.

## Paso 6: Dar de alta a los usuarios

SecureAI **no crea cuentas automáticamente** al primer login: cada persona que vaya a entrar con Google tiene que existir en SecureAI y estar activa, con el **mismo email** que su cuenta de Google Workspace (mayúsculas y minúsculas no importan; los alias con `+` no se aceptan).

- **Usuarios existentes**: los que ya tienen cuenta en SecureAI (incluso con contraseña) no se recrean. Pueden seguir entrando con contraseña y además con Google.
- **Usuarios nuevos solo con SSO**: en **Admin → Gestión IAM → Gestión de Usuarios → Agregar Usuario**, elija el método de autenticación **Cuenta Empresarial / SSO**. El usuario no recibe un email para crear contraseña y entra directamente con **Continuar con Google**.

Cuando un usuario se desactiva en SecureAI, tampoco puede entrar por SSO.

## Probar el inicio de sesión

1. Abra la página de login de su instancia en una ventana de incógnito.
2. Haga clic en **Continuar con Google**.
3. Elija su cuenta de Google Workspace.
4. Google lo devuelve a SecureAI con la sesión iniciada.

El login con contraseña sigue funcionando igual: activar SSO no lo desactiva.

## Desactivar o quitar la integración

- Para ocultar el botón sin perder la configuración, desactive el interruptor y guarde.
- Para borrarla, use **Quitar configuración**. Si su instancia tenía un SSO configurado previamente por Hiper AI, vuelve a aplicarse ese.

## Rotar el secreto del cliente

1. En Google Cloud, abra el cliente OAuth y haga clic en **Agregar secreto** (el anterior sigue funcionando).
2. En SecureAI, pegue el nuevo valor en **Secreto del cliente**, haga clic en **Probar conexión** y luego en **Guardar**. Dejar el campo vacío conserva el secreto actual.
3. Cuando confirme que el login funciona, deshabilite y borre el secreto viejo en Google Cloud.

El cambio se aplica al instante, sin cortar sesiones abiertas.

## Si su instancia ya tenía SSO configurado por Hiper AI

Las instancias a las que Hiper AI les configuró Google SSO a pedido muestran la tarjeta como **Configurado por Hiper AI**. Esa configuración sigue funcionando. Si guarda la suya en Integraciones, la reemplaza; si después la quita, vuelve a aplicarse la anterior.

## Solución de problemas

Los errores del login se muestran en la página de inicio de sesión de SecureAI:

| Mensaje en SecureAI | Causa y solución |
|---|---|
| "Usuario no encontrado en la base de datos de SecureAI." | No hay una cuenta de SecureAI con ese email. Créela (paso 6). |
| "Esta cuenta no puede iniciar sesión acá…" | La cuenta no pertenece a uno de los **Dominios de email permitidos**, o es una cuenta personal de Google (sin Workspace). Agregue el dominio o use la cuenta corporativa. |
| "Tu proveedor de identidad no verificó esta dirección de email." | Google no marcó el email como verificado, o el email contiene caracteres que SecureAI no acepta (por ejemplo un alias con `+`). |
| "Este método de inicio de sesión no está habilitado para tu organización." | La integración está desactivada o incompleta. Revise la tarjeta en Integraciones. |
| "Tu proveedor de identidad no completó el inicio de sesión…" | Google devolvió un error, por ejemplo porque el usuario canceló. |
| "No se pudo completar el inicio de sesión único…" | El intercambio de código falló, normalmente por un secreto reemplazado o borrado. Use **Probar conexión**. |
| "La sesión de inicio expiró o no se inició desde este navegador…" | Pasaron más de 10 minutos, o el login empezó en otra pestaña/navegador. Vuelva a intentar desde la página de login. |

Errores que muestra Google (antes de volver a SecureAI):

- **Error 400: redirect_uri_mismatch**: la URI de redirección del cliente no es exactamente la del paso 1. Corríjala en **URIs de redireccionamiento autorizados** (no en orígenes de JavaScript).
- **Error 403: org_internal**: la app es **Interna** y la cuenta no pertenece a la organización de Google Cloud dueña del proyecto. Pasa también si su empresa tiene más de una organización en Google (por ejemplo `empresa.com` y `empresa.ai`) y el cliente OAuth se creó en un proyecto de la otra: créelo en un proyecto de la organización a la que pertenecen los usuarios (en la consola, el selector de proyectos muestra la organización de cada uno).
- **Error 401: invalid_client / deleted_client**: el cliente OAuth no existe o fue borrado. Cree uno nuevo y actualice SecureAI.
- **"Acceso bloqueado: el administrador no confió en esta app"**: los controles de acceso a apps de su Workspace bloquean apps de terceros. En la consola de administración de Google (**Seguridad → Acceso y control de datos → Controles de APIs → Administrar el acceso de apps de terceros**) marque el ID de cliente como **De confianza**.

Si necesita ayuda, contacte a soporte desde **Obtener soporte** en el menú de su perfil e incluya el ID de cliente y el mensaje de error. **No envíe nunca el secreto del cliente.**

## Recursos adicionales

- [Configurar OAuth 2.0 en Google Cloud](https://support.google.com/cloud/answer/6158849)
- [OpenID Connect en Google](https://developers.google.com/identity/openid-connect/openid-connect)
- [Controlar qué apps de terceros acceden a datos de Google Workspace](https://support.google.com/a/answer/7281227)
