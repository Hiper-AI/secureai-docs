---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Integración de Google Workspace (SSO)

Esta guía lo guiará a través del proceso de configuración de Google Workspace para el inicio de sesión único (SSO) con SecureAI. Aprenderá cómo obtener las credenciales necesarias de Google Cloud Console y enviarlas para completar la integración.

## Requisitos previos

- Acceso de administrador a Google Cloud Console
- Una cuenta de Google Workspace para su organización
- Acceso a la consola de administración de Google Workspace de su organización (si usa restricciones de dominio)
- Acceso de administrador a SecureAI

## Paso 1: crear un proyecto en Google Cloud Console

1. Inicie sesión en [Google Cloud Console](https://console.cloud.google.com)
2. Haga clic en el menú desplegable del proyecto en la parte superior de la página.
3. Haga clic en **Nuevo proyecto**

<div class="mac-window">
  ![Nuevo proyecto](/img/google%20sso%20images/google%20-%201.png)
</div>

4. Ingrese un nombre de proyecto (por ejemplo, "SecureAI SSO")
5. Haga clic en **Crear**

<div class="mac-window">
  ![Crear proyecto](/img/google%20sso%20images/google%20-%202.png)
</div>

## Paso 2: habilite la API de Google+ (si es necesario)

1. En su proyecto, vaya a **API y servicios** > **Biblioteca**
2. Busque "API de Google+" o "Identidad de Google".
3. Haga clic en él y haga clic en **Habilitar** (si aún no está habilitado)
4. **Nota**: Es posible que Google OAuth moderno no requiera esto, pero habilitarlo garantiza la compatibilidad.

## Paso 3: Configurar la pantalla de consentimiento de OAuth

1. Vaya a **API y servicios** > **Pantalla de consentimiento de OAuth**

<div class="mac-window">
  ![Pantalla de consentimiento de OAuth](/img/google%20sso%20images/google%20-%203.png)
</div>

2. Complete la información requerida:
   - **Nombre de la aplicación**: ingrese un nombre (por ejemplo, "SecureAI")
   - **Correo electrónico de soporte al usuario**: seleccione una dirección de correo electrónico de soporte
   - **Información de contacto**: agregue una dirección de correo electrónico de contacto

3. Elija **Tipo de usuario**:
   - **Interno**: solo para usuarios de su organización de Google Workspace (recomendado para uso empresarial)
   - **Externo**: para usuarios fuera de su organización

4. Haga clic en **Crear**

<div class="mac-window">
  ![Crear consentimiento de OAuth](/img/google%20sso%20images/google%20-%204.png)
</div>

5. **Marca**:
   - Vaya a la sección **Marca** en el menú de la izquierda
   - Busque **Dominios autorizados** y agregue el dominio de su empresa
   - Esto permite a los usuarios iniciar sesión con la dirección de correo electrónico de su empresa.
   - (Además, puede agregar la URL de su página de inicio, política de privacidad y términos de servicio si lo desea)

<div class="mac-window">
  ![Dominios autorizados](/img/google%20sso%20images/google%20-%205.png)
</div>

6. **Ámbitos**:
   - En el menú de la izquierda, haga clic en la sección **Acceso a datos**
   - Dentro de la sección Acceso a datos, haga clic en **Agregar o quitar ámbitos**
   - Se abrirá una ventana desde el lado izquierdo donde podrás buscar roles.
   - Busque el rol **"openid"** y selecciónelo
   - Haga clic en **Actualizar**
   - Luego haga clic en **Guardar** en la sección Acceso a datos
   - **Nota**: El alcance `openid` incluye automáticamente el acceso `profile` y `email`; no es necesario agregarlos por separado.
   - Si ve otras opciones de alcance, solo necesita **OpenID** para SecureAI SSO

<div class="mac-window">
  ![Selección de alcance de OpenID](/img/google%20sso%20images/google%20-%206.png)
</div>

   - **Importante**: El alcance de OpenID proporciona acceso a:
     - Dirección de correo electrónico del usuario
     - Información básica del perfil.
     - Esto es todo lo que se necesita para la autenticación SecureAI

7. **Usuarios de prueba** (si usa Externo):
   - Agregue usuarios de prueba si es necesario durante la prueba
   - Haga clic en **Guardar y continuar**

8. **Resumen**:
   - Revisa tu configuración
   - Haga clic en **Volver al panel**

## Paso 4: Crear credenciales OAuth 2.0

1. Vaya a **API y servicios** > **Credenciales**
2. Haga clic en **+ Crear credenciales** > **ID de cliente OAuth**

<div class="mac-window">
  ![Crear ID de cliente OAuth](/img/google%20sso%20images/google%20-%207.png)
</div>
3. **Tipo de aplicación**: seleccione **Aplicación web**
4. **Nombre**: ingrese un nombre descriptivo (por ejemplo, "Cliente SSO SecureAI")
5. **URI de redireccionamiento autorizado**: haga clic en **+ Agregar URI** e ingrese:
   - `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
   - **Importante**: La URL debe coincidir exactamente (incluidos `https://` y `/api/auth/google/callback`)

<div class="mac-window">
  ![URI de redireccionamiento autorizado](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Haga clic en **Crear**

## Paso 5: Obtenga sus credenciales

Después de crear el cliente OAuth:

1. Aparecerá una ventana emergente con tus credenciales.

<div class="mac-window">
  ![Ventana emergente de credenciales de OAuth](/img/google%20sso%20images/google%20-%209.png)
</div>
2. **ID de cliente**:
   - Parece: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`
   - **Copia este valor** - lo necesitarás más tarde
3. **Secreto del cliente**:
   - Parece: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **Copia este valor inmediatamente**
   - **ADVERTENCIA**: Este secreto solo se muestra una vez en la ventana emergente. Si lo pierde, deberá crear un nuevo cliente OAuth

## Paso 6: Enviar variables al equipo de Hiper AI

Una vez que haya creado el cliente OAuth en Google Cloud Console y haya seguido los pasos anteriores, habrá obtenido la siguiente información crítica:

1. **ID de cliente** (del paso 5)
2. **Secreto del cliente** (del paso 5)
3. **URI de redireccionamiento**: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`

Debes enviar estos valores al equipo de Hiper AI para completar la integración de SSO.

### A. Acceda al Panel de administración

1. Inicie sesión en su instancia de SecureAI como administrador
2. Navegue hasta `https://{enterprise.name}.hiperai.ai/admin/home`
3. En la esquina superior derecha, haz clic en tu foto de perfil de administrador.
4. Esto abrirá un menú desplegable con varias opciones.

### B. Enviar la solicitud de soporte

1. Haga clic en **"Obtener soporte"** en el menú desplegable.

<div class="mac-window">
  ![Obtener menú de soporte](/img/microsoft%20entraid%20sso%20images/10%20-%20azure.png)
</div>

2. Aparecerá una ventana emergente con un formulario de ticket de soporte.
3. Rellena el formulario con la siguiente información:
   - **Categoría**: seleccione **"Integraciones e implementaciones"**

<div class="mac-window">
  ![Categoría de formulario de soporte](/img/microsoft%20entraid%20sso%20images/11%20-%20azure.png)
</div>

   - **Asunto**: introduzca **"Integración SSO de Google Workspace"**
   - **Descripción**: Pegue los valores que copió durante el proceso de configuración:
     - Identificación del cliente
     - Secreto del cliente
     - URI de redireccionamiento: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
4. Haga clic en el botón **"Enviar solicitud"**

### C. Espere la confirmación

- Recibirás un correo electrónico de confirmación en un plazo de **24 a 72 horas** (según disponibilidad)
- El correo electrónico confirmará que su SSO se ha configurado correctamente
- Una vez configurado, podrá acceder a su instancia de SecureAI utilizando el botón de inicio de sesión **"Continuar con Google"** en la página de inicio de sesión.

**Importante**: Mantenga sus credenciales seguras hasta que se complete la integración. No los compartas a través de canales inseguros.

## Configuración de usuario

### Usuarios existentes

Los usuarios que ya tienen cuentas en SecureAI (independientemente de si usan autenticación básica) **no es necesario volver a crearlas**. Pueden continuar usando sus cuentas existentes y también podrán iniciar sesión usando Google Workspace SSO una vez que esté configurado.

**Importante**: El correo electrónico del usuario en Google Workspace debe coincidir exactamente con el correo electrónico en SecureAI para que SSO funcione.

### Creación de nuevos usuarios de SSO

Para nuevos usuarios que deberían acceder a SecureAI exclusivamente a través de SSO:

1. Navegue hasta **Administración de usuarios** en el panel de administración de SecureAI.
2. Haga clic para crear un nuevo usuario.
3. Al crear el usuario, seleccione la opción **"Cuenta Empresarial/SSO"**
4. Esta configuración garantiza que:
   - El nuevo usuario **no recibirá un correo electrónico** para generar una contraseña
   - El usuario podrá acceder a SecureAI **directamente usando el botón de inicio de sesión SSO de Google Workspace**
   - El correo electrónico del usuario en Google Workspace debe coincidir exactamente con el correo electrónico ingresado en SecureAI

## Solución de problemas

### Error: "redirect_uri_mismatch"

- Verifique que el URI de redireccionamiento en Google Cloud Console coincida exactamente con lo que está configurado en el servidor
- Asegúrese de incluir `https://` (no `http://` en producción)
- El URI de redireccionamiento debe ser exactamente: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
- Compruebe si hay barras diagonales o errores tipográficos

### Error: "Usuario no encontrado en la base de datos SecureAI"

- El usuario debe estar previamente registrado en SecureAI
- Póngase en contacto con el administrador de SecureAI para crear la cuenta de usuario.
- Verifique que la dirección de correo electrónico en Google Workspace coincida exactamente con el correo electrónico en SecureAI

### Error: "El dominio de correo electrónico no está permitido para iniciar sesión en Google Workspace"

- El dominio de correo electrónico del usuario no está en la lista de dominios permitidos.
- Póngase en contacto con su equipo de desarrollo para agregar su dominio a la lista permitida
- O verificar que la configuración de restricción de dominio sea correcta

### Error: "acceso_deniado" o "cliente_no autorizado"

- Verificar que la pantalla de consentimiento de OAuth esté configurada correctamente
- Verifique que su solicitud esté aprobada (si utiliza el tipo de usuario externo)
- Asegúrese de que el ID del cliente y el secreto del cliente sean correctos

### Error: "cliente_inválido"

- Es posible que el secreto del cliente se haya restablecido o sea incorrecto
- Verificar el secreto del cliente en Google Cloud Console
- Cree un nuevo secreto de cliente si es necesario y proporcione el nuevo valor a su equipo de desarrollo.

## Mejores prácticas de seguridad de secretos del cliente

1. **Nunca envíes secretos a repositorios de código**
2. **Rote los secretos periódicamente** (recomendado: cada 90 días)
3. **Limitar el acceso** a la página de credenciales de Google Cloud Console
4. **Utilice canales seguros** cuando comparta secretos con su equipo de desarrollo
5. **Monitorear el uso** en Google Cloud Console para detectar actividad sospechosa

## Renovación del secreto del cliente

Para rotar su secreto de cliente (recomendado cada 90 días):

1. Vaya a **API y servicios** > **Credenciales**
2. Encuentre su ID de cliente de OAuth 2.0
3. Haga clic en el **ícono de lápiz** (Editar)
4. En la sección **Secreto del cliente**, haga clic en **Restablecer secreto**
5. **Copia inmediatamente** el nuevo valor secreto
6. Proporcione el nuevo secreto a su equipo de desarrollo a través de la solicitud de soporte del panel de administración.
7. Actualizarán la configuración sin interrumpir el servicio
8. Después de confirmar que el nuevo secreto funciona, opcionalmente puede eliminar el antiguo secreto.

**Nota**: Hay un breve período de superposición durante la rotación en el que ambos secretos funcionan, lo que permite una transición sin problemas.

## Prueba de inicio de sesión SSO

Una vez completada la configuración:

1. Vaya a su página de inicio de sesión de SecureAI
2. Haga clic en **Continuar con Google**
3. Selecciona tu cuenta de Google Workspace
4. Otorgue permisos si se le solicita
5. Deberías ser redirigido a SecureAI e iniciar sesión.

Si tiene problemas:
- Borra las cookies de tu navegador y vuelve a intentarlo.
- Verifica que estás usando la cuenta correcta de Google Workspace
- Verifique que su correo electrónico exista en SecureAI

## Soporte

Si encuentra problemas durante la configuración:

1. Verifique que tenga permisos de administrador en Google Cloud Console
2. Verifique que tenga acceso de administrador de Google Workspace (si se utilizan restricciones de dominio)
3. Comuníquese con su equipo de desarrollo a través de la solicitud de soporte del panel de administración con:
   - Capturas de pantalla de los errores.
   - El ID del cliente (puedes compartirlo, no es confidencial)
   - El mensaje de error completo.
   - Cualquier error relevante en la consola del navegador.

**Nunca comparta su secreto de cliente en solicitudes de soporte**; compártalo únicamente a través de canales seguros después de establecer la verificación de identidad.

## Recursos adicionales

- [Documentación de la consola de Google Cloud] (https://cloud.google.com/docs)
- [Documentación de Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Ayuda para administradores de Google Workspace](https://support.google.com/a)