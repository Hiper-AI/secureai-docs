---
sidebar_position: 2
title: "SharePoint y OneDrive — Añadir desde SharePoint"
sidebarTitle: "SharePoint"
icon: "/img/icons/sharepoint.svg"
sidebar_label: "SharePoint y OneDrive"
description: "Permita que sus usuarios adjunten archivos de sitios de SharePoint y de OneDrive en el chat de SecureAI. Configuración self-serve con su propio registro de aplicación de Microsoft Entra ID."
---

# SharePoint y OneDrive — Añadir desde SharePoint

Con esta integración, sus usuarios adjuntan archivos de **sitios de SharePoint** (incluidos los sitios de Teams), de **OneDrive** y de **Compartidos conmigo** directamente desde el chat, con la opción **Añadir desde SharePoint** del botón de adjuntar.

La configuración es **self-serve**: un administrador de su organización registra SecureAI como aplicación en **su propio directorio de Microsoft Entra ID** y carga los identificadores en **Admin → Integraciones → Archivos**. No hace falta abrir un ticket ni esperar a Hiper AI: la opción aparece en el chat apenas guarda la configuración.

Tiempo estimado: 10 minutos.

## Cómo funciona

1. El usuario hace clic en **Adjuntar → Añadir desde SharePoint**. La primera vez, Microsoft le pide que inicie sesión con **su propia cuenta de Microsoft 365**.
2. Se abre el explorador de SecureAI sobre Microsoft Graph: sitios, bibliotecas, carpetas, búsqueda y archivos compartidos con el usuario. El usuario elige uno o varios archivos.
3. El navegador del usuario descarga **solo los archivos elegidos**, con el token del propio usuario, y los adjunta al mensaje.
4. El archivo sigue el camino de cualquier adjunto: **pasa por el DLP** y por las políticas de su organización antes de llegar a un modelo.

<Info>
**Permisos delegados, nunca de aplicación.** SecureAI actúa siempre **en nombre del usuario que inició sesión**: un usuario solo ve y adjunta lo que ya puede abrir en SharePoint. La aplicación es una "aplicación de página única" (SPA) sin secreto de cliente, y SecureAI no lee nada en segundo plano.
</Info>

## Requisitos previos

- Un rol de Entra ID que permita registrar aplicaciones y **conceder consentimiento de administrador** para permisos de Microsoft Graph (por ejemplo **Administrador de aplicaciones en la nube** o **Administrador global**).
- Acceso de administrador a SecureAI, con permiso de **Administrador** sobre la sección **Integraciones**.
- Un plan de SecureAI que incluya **Adjuntar desde Drive / SharePoint**. Sin él puede dejar la configuración lista, pero los usuarios no verán la opción.

## Paso 1: Copiar la URI de redirección desde SecureAI

1. Inicie sesión en SecureAI como administrador.
2. Vaya a **Admin → Integraciones** y filtre por la categoría **Archivos**.
3. En la tarjeta **SharePoint y OneDrive** haga clic en **Conectar integración**.
4. En la sección **1. Registrá SecureAI en Microsoft Entra ID**, haga clic en **Copiar** junto a la **URI de redirección**.

<div class="mac-window">
  ![URI de redirección en el drawer de SecureAI](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

La URI es la dirección de su instancia, por ejemplo `https://<su-empresa>.hiperai.ai`. Use siempre la que muestra su instancia: tiene que coincidir exactamente.

## Paso 2: Registrar la aplicación en Entra ID

1. Abra el [Centro de administración de Microsoft Entra](https://entra.microsoft.com) y vaya a **Entra ID → Registros de aplicaciones**.
2. Haga clic en **Nuevo registro**.

<div class="mac-window">
  ![Registros de aplicaciones → Nuevo registro](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. Complete:
   - **Nombre**: por ejemplo `SecureAI — Añadir desde SharePoint`.
   - **Tipos de cuenta admitidos**: **Solo las cuentas de este directorio organizativo** (un solo inquilino).
   - **URI de redirección**: en el desplegable elija **Aplicación de página única (SPA)** y pegue la URI que copió en el paso 1.
4. Haga clic en **Registrar**.


<Warning>
La plataforma tiene que ser **Aplicación de página única (SPA)**, no **Web**. Con **Web**, el inicio de sesión falla con el error `AADSTS9002326`. Si ya la registró como Web, vaya a **Autenticación**, agregue una plataforma **Aplicación de página única** con la misma URI y quite la de Web.
</Warning>

5. En la **Información general** de la aplicación, copie el **Id. de aplicación (cliente)** y el **Id. de directorio (inquilino)**. No hace falta crear ningún secreto de cliente.

<div class="mac-window">
  ![Id. de aplicación y de directorio](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## Paso 3: Agregar los permisos de Microsoft Graph

1. En la aplicación, vaya a **Permisos de API → Agregar un permiso → Microsoft Graph → Permisos delegados**.
2. Busque y marque:
   - `Files.Read.All` — leer los archivos a los que el usuario tiene acceso.
   - `Sites.Read.All` — listar y buscar los sitios de SharePoint a los que el usuario tiene acceso.
3. Haga clic en **Agregar permisos**. `User.Read` ya viene agregado por defecto; déjelo.

<div class="mac-window">
  ![Permisos delegados de Microsoft Graph](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## Paso 4: Conceder el consentimiento de administrador

1. En **Permisos de API**, haga clic en **Conceder consentimiento de administrador para &lt;su organización&gt;** y confirme con **Sí**.
2. Los tres permisos tienen que quedar con el estado **Concedido para &lt;su organización&gt;**.

<div class="mac-window">
  ![Consentimiento de administrador concedido](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

Sin este paso, cada usuario vería un pedido de consentimiento (o un error `AADSTS65001` si su organización no permite que los usuarios consientan).

## Paso 5: Cargar, probar y activar en SecureAI

1. Vuelva al drawer de **SharePoint y OneDrive** en SecureAI.
2. En **2. Pegá los identificadores**, pegue el **ID de directorio (inquilino)** y el **ID de aplicación (cliente)**.
3. En **3. Probalo**:
   - **Probar conexión** verifica desde los servidores de SecureAI que el directorio existe.
   - **Probar inicio de sesión** abre la misma ventana de Microsoft que van a ver sus usuarios: inicie sesión con su cuenta. SecureAI confirma que la URI de redirección es de tipo SPA, que `Files.Read.All` y `Sites.Read.All` tienen consentimiento y que Microsoft Graph responde.

<div class="mac-window">
  ![Pruebas en verde en el drawer de SecureAI](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. En **4.**, deje activado **Mostrar "Añadir desde SharePoint" a los usuarios** y haga clic en **Guardar**.

La tarjeta pasa a **Disponible en el chat**.

## Paso 6: Cómo lo usan sus usuarios

1. En el chat, el usuario hace clic en el botón de **adjuntar** y elige **Añadir desde SharePoint**.

<div class="mac-window">
  ![Añadir desde SharePoint en el menú de adjuntar](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. La primera vez, hace clic en **Iniciar sesión con Microsoft** y elige su cuenta de la organización.
3. Navega por **Sitios**, **Compartidos** o la búsqueda, elige uno o varios archivos y hace clic en **Agregar**.


4. Los archivos aparecen adjuntos al mensaje, con el ícono de SharePoint.

## Restringir quién puede usarlo (opcional)

Para que solo algunos usuarios o grupos puedan usar **Añadir desde SharePoint**:

1. En Entra, vaya a **Aplicaciones empresariales** y abra la aplicación que registró.
2. En **Propiedades**, active **¿Se requiere asignación?** y guarde.
3. En **Usuarios y grupos**, asigne los usuarios o grupos habilitados.

Un usuario no asignado recibe el error `AADSTS50105` al iniciar sesión y no puede adjuntar archivos.

## Solución de problemas

| Lo que ve | Causa | Qué hacer |
|---|---|---|
| `AADSTS50011` — la URI de redirección no coincide | La URI del paso 1 no está registrada | Agréguela en **Autenticación → Aplicación de página única** |
| `AADSTS9002326` | La URI está registrada como **Web** | Muévala a **Aplicación de página única** |
| `AADSTS65001` — falta consentimiento | No se concedió el consentimiento de administrador | Paso 4 |
| `AADSTS700016` — aplicación no encontrada | ID de aplicación o de directorio equivocados | Cópielos de nuevo desde **Información general** |
| `AADSTS50105` | El usuario no está asignado a la aplicación | Asígnelo, o desactive **¿Se requiere asignación?** |
| **Probar inicio de sesión**: "Faltan estos permisos delegados" | Falta `Files.Read.All` o `Sites.Read.All`, o su consentimiento | Pasos 3 y 4 |
| El usuario no ve sitios, solo "Compartidos" | El usuario no es miembro de ningún sitio | Es esperado: solo ve lo que ya puede abrir |
| El usuario no ve **Añadir desde SharePoint** | La integración está desactivada, sin guardar, o el plan no la incluye | Revise la tarjeta en **Admin → Integraciones → Archivos** |

## Preguntas frecuentes

**¿Qué puede leer SecureAI?** Solo lo que el usuario que inició sesión ya puede leer, y solo cuando él elige un archivo en el explorador. Los permisos son delegados: no existe un acceso de SecureAI "como aplicación" a su SharePoint.

**¿Funcionan las políticas de acceso condicional?** Sí. El inicio de sesión es un inicio de sesión normal de Microsoft 365 y respeta MFA, dispositivos administrados y el resto de sus políticas.

**¿Cómo lo desactivo?** Desactive **Mostrar "Añadir desde SharePoint" a los usuarios** y guarde, o haga clic en **Quitar configuración**. Para revocar también los tokens ya emitidos, elimine el registro de aplicación en Entra ID o deshabilite el inicio de sesión de su aplicación empresarial.

**Hiper AI ya me había configurado SharePoint. ¿Tengo que hacer algo?** No. Mientras no guarde una configuración propia, la tarjeta muestra **Configurado por Hiper AI** y todo sigue funcionando igual. Si guarda la suya, la reemplaza.
