---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Integración de Microsoft Entra ID (SSO)

Con esta integración, los usuarios de su organización inician sesión en SecureAI con su cuenta de trabajo de Microsoft (botón **Continuar con Microsoft**). La configuración es **self-serve**: un administrador de su organización registra SecureAI en su propio tenant de Microsoft Entra ID (antes Azure Active Directory) y carga los datos en **Admin → Integraciones**. No hace falta abrir un ticket ni esperar a Hiper AI: el botón aparece en la página de login apenas guarda la configuración.

Tiempo estimado: 10 minutos.

## Requisitos previos

- Un rol de Microsoft Entra que permita crear registros de aplicación (por ejemplo **Desarrollador de aplicaciones** o **Administrador de aplicaciones**). Para otorgar el consentimiento de administrador (paso 4) se necesita **Administrador de aplicaciones en la nube**, **Administrador de aplicaciones** o **Administrador global**.
- Acceso de administrador a SecureAI, con permiso de **Administrador** sobre la sección **Integraciones**.

## Cómo funciona

1. Usted crea un **registro de aplicación** en su tenant de Entra ID. SecureAI usa OpenID Connect (flujo de código de autorización) con un **secreto de cliente**.
2. En SecureAI carga el **Id. de directorio (inquilino)**, el **Id. de aplicación (cliente)** y el **valor del secreto**. El secreto se guarda cifrado y nunca se vuelve a mostrar.
3. Cuando un usuario hace clic en **Continuar con Microsoft**, Microsoft lo autentica (con su MFA y sus políticas de Acceso condicional) y SecureAI lo deja entrar si su email coincide con una cuenta **activa** de SecureAI.

SecureAI acepta únicamente tokens emitidos por **su** tenant: el inicio de sesión queda fijado a su directorio y nunca se usan los endpoints multi-tenant (`common` / `organizations`).

## Paso 1: Copiar la URI de redirección desde SecureAI

1. Inicie sesión en SecureAI como administrador.
2. Vaya a **Admin → Integraciones** y filtre por la categoría **IAM**.
3. En la tarjeta **Microsoft Entra ID (SSO)** haga clic en **Conectar integración** (o en **Reconfigurar**, si la tarjeta dice **Configurado por Hiper AI**).
4. En la sección **1. Registrá SecureAI en Microsoft Entra ID**, haga clic en **Copiar** junto a la **URI de redirección**.

La URI tiene esta forma (con el dominio de su instancia):

```
https://<su-empresa>.hiperai.ai/api/auth/azure/callback
```

Use siempre la URI que muestra su instancia: tiene que coincidir carácter por carácter, incluido `https://`.

Deje esta ventana abierta; va a volver para pegar los datos.

## Paso 2: Registrar la aplicación en Microsoft Entra ID

1. Abra el [centro de administración de Microsoft Entra](https://entra.microsoft.com) (o el [portal de Azure](https://portal.azure.com) → **Microsoft Entra ID**).

<div class="mac-window">
  ![Búsqueda de Microsoft Entra ID en el portal de Azure](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. Vaya a **Aplicaciones → Registros de aplicaciones**.

<div class="mac-window">
  ![Menú Registros de aplicaciones](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. Haga clic en **+ Nuevo registro**.

<div class="mac-window">
  ![Botón Nuevo registro](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. Complete el formulario:
   - **Nombre**: un nombre descriptivo, por ejemplo `SecureAI SSO`. Es el que verán los usuarios en la pantalla de consentimiento.
   - **Tipos de cuenta admitidos**: **Solo las cuentas de este directorio organizativo (inquilino único)**.
   - **URI de redirección**: plataforma **Web** (no "Aplicación de página única") y pegue la URI que copió en el paso 1.
5. Haga clic en **Registrar**.

<div class="mac-window">
  ![Formulario de registro de la aplicación](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. En la página **Información general** de la aplicación, copie:
   - **Id. de aplicación (cliente)** — un GUID como `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`.
   - **Id. de directorio (inquilino)** — otro GUID, como `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`.

## Paso 3: Crear un secreto de cliente

1. En el menú de la aplicación, abra **Certificados y secretos**.

<div class="mac-window">
  ![Menú Certificados y secretos](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. En **Secretos de cliente**, haga clic en **+ Nuevo secreto de cliente**.
3. Escriba una descripción (por ejemplo `SecureAI SSO`) y elija un vencimiento (Microsoft recomienda menos de 12 meses; el máximo es 24).
4. Haga clic en **Agregar**.

<div class="mac-window">
  ![Agregar secreto de cliente](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. Copie **inmediatamente** la columna **Valor** (se ve como `plm8Q~xxxxxxxx…`). Se muestra una sola vez.

<div class="mac-window">
  ![Valor del secreto de cliente](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
Copie el **Valor**, no el **Id. de secreto** (que es un GUID). Si pega el Id. de secreto, SecureAI lo rechaza al guardar.
</Warning>

Anote la fecha de vencimiento: cuando el secreto vence, el inicio de sesión con Microsoft deja de funcionar hasta que cargue uno nuevo (ver [Rotar el secreto](#rotar-el-secreto-de-cliente)).

## Paso 4: Revisar los permisos de API

SecureAI pide los permisos delegados `openid`, `profile`, `email` y `User.Read` de Microsoft Graph (este último para leer la foto de perfil del usuario). `User.Read` viene agregado por defecto en los registros nuevos.

1. En el menú de la aplicación, abra **Permisos de API**.
2. Verifique que estén **Microsoft Graph → Permisos delegados**: `User.Read` y, si quiere dejarlos explícitos, `openid`, `profile` y `email` (con **+ Agregar un permiso → Microsoft Graph → Permisos delegados**).

<div class="mac-window">
  ![Agregar permisos delegados](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. Haga clic en **Conceder consentimiento de administrador para [su organización]** y confirme.

<div class="mac-window">
  ![Conceder consentimiento de administrador](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

Si su tenant no permite que los usuarios den consentimiento a aplicaciones (configuración frecuente en empresas), este paso es obligatorio: sin él, los usuarios ven "Se necesita aprobación del administrador" al iniciar sesión.

## Paso 5: Cargar los datos en SecureAI y probar

Vuelva a **Admin → Integraciones → Microsoft Entra ID (SSO)**:

1. En **2. Pegá los datos del registro de aplicación** complete:
   - **Id. de directorio (inquilino)**: el GUID del paso 2 (también acepta un dominio verificado de su tenant, como `contoso.onmicrosoft.com`).
   - **Id. de aplicación (cliente)**: el GUID del paso 2.
   - **Valor del secreto de cliente**: el valor del paso 3.
   - **Dominios de email permitidos** (opcional, recomendado): los dominios de email de su organización separados por coma, por ejemplo `contoso.com, contoso.com.ar`. Solo esas direcciones podrán entrar con Microsoft. Si lo deja vacío, se acepta cualquier cuenta de su tenant que exista en SecureAI.
2. En **3. Probá la conexión** haga clic en **Probar conexión**. SecureAI consulta a Microsoft (sin iniciar sesión a nadie) y verifica:

   | Verificación | Si falla |
   |---|---|
   | Id. de directorio (inquilino) | Microsoft no conoce ese tenant (`AADSTS90002`). Copie el Id. de directorio de la página Información general. |
   | Id. de aplicación (cliente) | No existe esa aplicación en el tenant (`AADSTS700016`). Revise el Id. de cliente y que la app esté en el mismo tenant. |
   | Secreto de cliente | El secreto es inválido (`AADSTS7000215`) o venció (`AADSTS7000222`). Pegue el **Valor** o cree uno nuevo. |
   | URI de redirección registrada en la aplicación | La URI del paso 1 no está en el registro de aplicación (es el error `AADSTS50011` que vería el usuario al iniciar sesión). En la aplicación abra **Autenticación → Agregar una plataforma → Web**, péguela tal cual y guarde. |

   La prueba usa lo que está escrito en el formulario, así que puede probar antes de guardar. Si su tenant tiene una política de Acceso condicional que bloquea tokens de aplicación, el secreto puede aparecer como "no se pudo verificar automáticamente": no es un error, confirme haciendo un login real.

   <Note>
   La prueba confirma que la URI está registrada, pero no si se registró en la plataforma **Web** o en **Aplicación de página única (SPA)**. Registrada como SPA, la prueba da bien y el login falla con "No se pudo completar el inicio de sesión único". Revise que en **Autenticación** la URI aparezca bajo **Web**.
   </Note>

3. Verifique que esté activado **Mostrar "Continuar con Microsoft" en la página de login** (viene activado la primera vez).
4. Haga clic en **Guardar**.

Desde ese momento la tarjeta muestra **Activo en la página de login** y el botón **Continuar con Microsoft** aparece en el login de su instancia.

## Paso 6: Dar de alta a los usuarios

SecureAI **no crea cuentas automáticamente** al primer login: cada persona que vaya a entrar con Microsoft tiene que existir en SecureAI y estar activa. El email de la cuenta de SecureAI tiene que coincidir con el email del usuario en Entra ID (el atributo **Correo**; si está vacío, se usa el **nombre principal de usuario / UPN**). Mayúsculas y minúsculas no importan.

- **Usuarios existentes**: los que ya tienen cuenta en SecureAI (incluso con contraseña) no se recrean. Pueden seguir entrando con contraseña y además con Microsoft.
- **Usuarios nuevos solo con SSO**: en **Admin → Gestión IAM → Gestión de Usuarios → Agregar Usuario**, elija el método de autenticación **Cuenta Empresarial / SSO**. El usuario no recibe un email para crear contraseña y entra directamente con **Continuar con Microsoft**.
- **Muchos usuarios**: puede aprovisionarlos y darlos de baja automáticamente desde Entra ID con SCIM.

Cuando un usuario se desactiva en SecureAI (a mano o por SCIM), tampoco puede entrar por SSO.

## Probar el inicio de sesión

1. Abra la página de login de su instancia en una ventana de incógnito.
2. Haga clic en **Continuar con Microsoft**.
3. Elija su cuenta de trabajo y complete el MFA si se lo pide.
4. Microsoft lo devuelve a SecureAI con la sesión iniciada.

El login con contraseña sigue funcionando igual: activar SSO no lo desactiva.

## Desactivar o quitar la integración

- Para ocultar el botón sin perder la configuración, desactive el interruptor y guarde.
- Para borrarla, use **Quitar configuración**. Si su instancia tenía un SSO configurado previamente por Hiper AI, vuelve a aplicarse ese.

## Rotar el secreto de cliente

Antes de que venza el secreto:

1. En Entra ID, cree un nuevo secreto de cliente (paso 3) sin borrar el anterior.
2. En SecureAI, abra la integración, pegue el nuevo valor en **Valor del secreto de cliente**, haga clic en **Probar conexión** y luego en **Guardar**. Dejar el campo vacío conserva el secreto actual.
3. Cuando confirme que el login funciona, borre el secreto viejo en Entra ID.

El cambio se aplica al instante, sin cortar sesiones abiertas.

## Si su instancia ya tenía SSO configurado por Hiper AI

Las instancias a las que Hiper AI les configuró Microsoft SSO a pedido muestran la tarjeta como **Configurado por Hiper AI**. Esa configuración sigue funcionando. Si guarda la suya en Integraciones, la reemplaza; si después la quita, vuelve a aplicarse la anterior.

## Solución de problemas

Los errores del login se muestran en la página de inicio de sesión de SecureAI:

| Mensaje en SecureAI | Causa y solución |
|---|---|
| "Usuario no encontrado en la base de datos de SecureAI." | No hay una cuenta de SecureAI con ese email. Créela (paso 6) o verifique que el email coincida con el Correo/UPN de Entra ID. |
| "Esta cuenta no puede iniciar sesión acá…" | El dominio del email no está en **Dominios de email permitidos**, o el token vino de otro tenant. |
| "Este método de inicio de sesión no está habilitado para tu organización." | La integración está desactivada o incompleta. Revise la tarjeta en Integraciones. |
| "Tu proveedor de identidad no completó el inicio de sesión…" | Microsoft devolvió un error: el usuario canceló, falta el consentimiento de administrador (paso 4) o el usuario no está asignado a la aplicación. |
| "No se pudo completar el inicio de sesión único…" | El intercambio de código falló: normalmente un secreto vencido o reemplazado (use **Probar conexión**), o la URI de redirección registrada como **Aplicación de página única** en vez de **Web** (muévala a **Web** en **Autenticación**). |
| "Tu cuenta está inactiva…" | La cuenta está desactivada en SecureAI. |
| "La sesión de inicio expiró o no se inició desde este navegador…" | Pasaron más de 10 minutos, o el login empezó en otra pestaña/navegador. Vuelva a intentar desde la página de login. |

Errores que muestra Microsoft (antes de volver a SecureAI):

- **AADSTS50011 – La URI de redirección no coincide**: la URI registrada en Entra ID no es exactamente la que muestra SecureAI en el paso 1 (una barra final de más alcanza para que no coincida). **Probar conexión** lo detecta antes del primer login.
- **AADSTS65001 / "Se necesita aprobación del administrador"**: otorgue el consentimiento de administrador (paso 4).
- **AADSTS50105 – El usuario no está asignado a un rol de la aplicación**: la aplicación empresarial tiene **¿Asignación requerida?** en **Sí**. Asigne el usuario o un grupo en **Aplicaciones empresariales → SecureAI SSO → Usuarios y grupos**.
- **AADSTS7000215 / AADSTS7000222**: secreto inválido o vencido. Cargue uno nuevo.

Si necesita ayuda, contacte a soporte desde **Obtener soporte** en el menú de su perfil e incluya el Id. de aplicación (cliente), el Id. de directorio y el mensaje de error. **No envíe nunca el secreto de cliente.**
