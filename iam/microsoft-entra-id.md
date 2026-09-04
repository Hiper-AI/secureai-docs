---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Integración de Microsoft Entra ID (SSO)

Esta guía lo guiará a través del proceso de configuración de Microsoft Entra ID (anteriormente Azure Active Directory) para el inicio de sesión único (SSO) con SecureAI. Aprenderá cómo obtener las credenciales necesarias de Azure y enviarlas para completar la integración.

## Requisitos previos

- Acceso de administrador al Portal Azure
- Un inquilino de Azure Entra ID (Azure AD)
- Acceso de administrador a SecureAI

## Paso 1: Crear una aplicación en Azure Portal

1. Inicie sesión en [Portal Azure](https://portal.azure.com)
2. Busque y seleccione **Azure Active Directory** o **Microsoft Entra ID**

<div class="mac-window">
  ![Búsqueda en Azure Portal](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

3. En el menú lateral, seleccione **Registros de aplicaciones**

<div class="mac-window">
  ![Menú de registros de aplicaciones](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

4. Haga clic en **+ Nuevo registro**

<div class="mac-window">
  ![Nuevo botón de registro](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

## Paso 2: Configurar la aplicación

1. **Nombre**: ingrese un nombre descriptivo (por ejemplo, "SecureAI SSO")
2. **Tipos de cuenta admitidos**:
   - Seleccione **Cuentas solo en este directorio organizacional**
   - O **Cuentas en cualquier directorio organizacional** si necesita brindar soporte a varias organizaciones
3. **URI de redireccionamiento**:
   - Plataforma: **Web**
   - URI: `https://your-backend-domain.com/api/auth/azure/callback`
   - **Nota**: obtendrá esta URL de su equipo de desarrollo.
4. Haga clic en **Registrarse**

<div class="mac-window">
  ![Botón Registrar](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

## Paso 3: Obtener el ID de la aplicación (cliente)

1. En la página **Descripción general** de tu solicitud.
2. Copie el valor de **ID de aplicación (cliente)**
   - Este es un GUID que se ve así: `b96ee19f-5a15-4a85-b936-****-****`
   - **Guarde este valor** - lo necesitará más tarde

## Paso 4: Obtener el ID del directorio (inquilino)

1. En la misma página **Descripción general**
2. Copie el valor de **ID del directorio (inquilino)**
   - Este es un GUID que se ve así: `155812d2-1112-46c8-bf52-****-****`
   - **Guarde este valor** - lo necesitará más tarde

## Paso 5: Crear un secreto de cliente

1. En el menú lateral de tu aplicación, selecciona **Certificados y secretos**

<div class="mac-window">
  ![Menú Certificados y secretos](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. En la sección **Secretos del cliente**, haga clic en **+ Nuevo secreto del cliente**
3. **Descripción**: ingrese una descripción (por ejemplo, "Secreto de SSO de SecureAI")
4. **Expira**:
   - Seleccione un período de vencimiento (recomendado: 24 meses)
   - **IMPORTANTE**: Asegúrate de renovar el secreto antes de que caduque
5. Haga clic en **Agregar**

<div class="mac-window">
  ![Botón Agregar secreto de cliente](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

6. **INMEDIATAMENTE** copie el **Valor** del secreto
   - Se verá así: `plm8Q~************************************`

<div class="mac-window">
  ![Valor secreto del cliente](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>
   - **ADVERTENCIA**: Este valor solo se muestra una vez. Si lo pierdes, tendrás que crear un nuevo secreto.
   - **Guarde este valor de forma segura**

## Paso 6: Configurar los permisos de API

1. En el menú lateral, seleccione **Permisos de API**
2. Haga clic en **+ Agregar un permiso**
3. Seleccione **Microsoft Graph**
4. Seleccione **Permisos delegados**
5. Verifique los siguientes permisos:
   - `openid` (incluido automáticamente)
   - `profile`
   - `email`
6. Haga clic en **Agregar permisos**

<div class="mac-window">
  ![Botón Agregar permisos](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

7. Si su organización requiere el consentimiento del administrador:
   - Haga clic en **Otorgar consentimiento del administrador**

<div class="mac-window">
  ![Conceder botón de consentimiento del administrador](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

## Paso 7: Enviar variables al equipo de Hiper AI

Una vez que haya creado la aplicación en Azure y haya seguido los pasos anteriores, habrá obtenido tres datos críticos:

1. **ID de cliente** (del paso 3)
2. **ID de inquilino** (del paso 4)
3. **Valor secreto del cliente** (del paso 5)

Debes enviar estos tres valores al equipo de Hiper AI para completar la integración de SSO.

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

   - **Asunto**: Ingrese **"Integración SSO de Microsoft Entra ID"**
   - **Descripción**: Pegue los tres valores que copió durante el proceso de configuración:
     - ID de cliente (ID de aplicación)
     - ID de inquilino (ID de directorio)
     - Valor secreto del cliente
4. Haga clic en el botón **"Enviar solicitud"**

### C. Espere la confirmación

- Recibirás un correo electrónico de confirmación en un plazo de **24 a 72 horas** (según disponibilidad)
- El correo electrónico confirmará que su SSO se ha configurado correctamente
- Una vez configurado, podrá acceder a su instancia de SecureAI usando el botón de inicio de sesión **"Continuar con Azure EntraID"** en la página de inicio de sesión.

**Importante**: Mantenga sus credenciales seguras hasta que se complete la integración. No los compartas a través de canales inseguros.

## Configuración de usuario

### Usuarios existentes

Los usuarios que ya tienen cuentas en SecureAI (independientemente de si usan autenticación básica) **no es necesario volver a crearlas**. Pueden continuar usando sus cuentas existentes y también podrán iniciar sesión usando Azure Entra ID SSO una vez que esté configurado.

**Importante**: El correo electrónico del usuario en Azure debe coincidir exactamente con el correo electrónico en SecureAI para que SSO funcione.

### Creación de nuevos usuarios de SSO

Para nuevos usuarios que deberían acceder a SecureAI exclusivamente a través de SSO:

1. Navegue hasta **Administración de usuarios** en el panel de administración de SecureAI.
2. Haga clic para crear un nuevo usuario.
3. Al crear el usuario, seleccione la opción **"Cuenta Empresarial/SSO"**
4. Esta configuración garantiza que:
   - El nuevo usuario **no recibirá un correo electrónico** para generar una contraseña
   - El usuario podrá acceder a SecureAI **directamente usando el botón de inicio de sesión de Azure Entra ID SSO**
   - El correo electrónico del usuario en Azure debe coincidir exactamente con el correo electrónico ingresado en SecureAI

## Solución de problemas

### Error: "el valor de redirect_uri debe ser un URI absoluto válido"
- Verificar que el URI de redireccionamiento en Azure coincida exactamente con lo que está configurado en el servidor
- Asegúrese de incluir `https://` o `http://` según corresponda

### Error: "Usuario no encontrado en la base de datos SecureAI"
- El usuario debe estar previamente registrado en SecureAI
- Póngase en contacto con el administrador de SecureAI para crear la cuenta de usuario.

### Error: "Secreto de cliente no válido"
- El secreto puede haber caducado
- Crear un nuevo secreto de cliente y actualizar la configuración.

## Renovación del secreto del cliente

El secreto del cliente tiene fecha de vencimiento. Antes de que caduque:

1. Cree un nuevo secreto de cliente siguiendo el Paso 5
2. Proporcione el nuevo valor a su equipo de desarrollo
3. Actualizarán la configuración sin interrumpir el servicio

## Soporte

Si encuentra problemas durante la configuración:
1. Verifique que tenga permisos de administrador en Azure
2. Póngase en contacto con su equipo de desarrollo con:
   - Capturas de pantalla de los errores.
   - Las identificaciones que obtuviste (sin el secreto)
   - El mensaje de error completo.