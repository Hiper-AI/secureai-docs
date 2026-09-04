---
id: microsoft-sentinel
title: "Integración con Microsoft Sentinel"
sidebar_label: "Microsoft Sentinel"
description: "Guía de integración: Conexión de Microsoft Sentinel con HiperAI mediante reglas de recopilación de datos de Azure (DCR)"
---

# Integración de Microsoft Sentinel

Guía de integración: Conectando Microsoft Sentinel con HiperAI

Esta guía describe los pasos necesarios para configurar Microsoft Sentinel para recibir registros de seguridad de SecureAI a través de las reglas de recopilación de datos de Azure (DCR).

## Paso 1: Crear la identidad de la aplicación (registro de la aplicación)

Primero, crearemos una identidad para su aplicación en Azure, lo que le permitirá autenticarse de forma segura.

### A. Vaya a Azure Active Directory

En Azure Portal, busque y seleccione **Azure Active Directory**.

<div class="mac-window">
  ![Búsqueda de Azure Active Directory](/img/ms%20sentinel%20-%20images/Sentinel%20-%201.png)
</div>

### B. Nuevo registro

En el menú de la izquierda, navegue hasta **Registros de aplicaciones** y haga clic en **+ Nuevo registro**.

<div class="mac-window">
  ![Menú de registros de aplicaciones](/img/ms%20sentinel%20-%20images/Sentinel%20-%202.png)
</div>

### C. Nombre la aplicación

Proporcione un nombre claro, como `SecureAI-Log-Ingester` y deje las otras opciones con sus valores predeterminados. Haga clic en **Registrarse**.

<div class="mac-window">
  ![Formulario de registro de aplicación](/img/ms%20sentinel%20-%20images/Sentinel%20-%203.png)
</div>

### D. Copie las identificaciones

Desde la página Descripción general de la nueva aplicación, copie y almacene de forma segura los siguientes valores:
- **ID de aplicación (cliente)**
- **ID del directorio (inquilino)**

<div class="mac-window">
  ![Descripción general de la aplicación con ID](/img/ms%20sentinel%20-%20images/Sentinel%20-%204.png)
</div>

### E. Crear el secreto del cliente

En el menú de la izquierda, vaya a **Certificados y secretos** y haga clic en **+ Nuevo secreto de cliente**. Proporcione una descripción (por ejemplo, "SentinelLogKey") y haga clic en **Agregar**.

<div class="mac-window">
  ![Crear secreto de cliente](/img/ms%20sentinel%20-%20images/Sentinel%20-%205.png)
</div>

**PASO CRÍTICO**: Copie inmediatamente el **Valor** del secreto. Esta es la única vez que será completamente visible. Guárdelo de forma segura con las otras identificaciones.

<div class="mac-window">
  ![Valor secreto del cliente](/img/ms%20sentinel%20-%20images/Sentinel%20-%206.png)
</div>

## Paso 2: Crear la infraestructura de ingesta de Azure

Ahora, construiremos la "vía" y el "almacenamiento" para sus registros.

### A. Crear el endpoint de recopilación de datos (DCE)

#### 1. Encuentre el servicio

En la barra de búsqueda de Azure, busque y seleccione **Endpoints de recopilación de datos**.

<div class="mac-window">
  ![Buscar endpoints de recopilación de datos](/img/ms%20sentinel%20-%20images/Sentinel%20-%207.png)
</div>

#### 2. Crear un nuevo DCE

Haga clic en **+ Crear**.

<div class="mac-window">
  ![Crear endpoint de recopilación de datos](/img/ms%20sentinel%20-%20images/Sentinel%20-%208.png)
</div>

#### 3. Configurar el DCE

- **Nombre**: `dce-secureai-integration`
- **Región**: elija la misma región que su espacio de trabajo de Log Analytics
- Haga clic en **Revisar + crear** y luego en **Crear**.

<div class="mac-window">
  ![Revisar y crear DCE](/img/ms%20sentinel%20-%20images/Sentinel%20-%209.png)
</div>

#### 4. Copie el URI

Una vez implementado, navegue hasta el recurso. En su página Descripción general, copie el **URI de ingesta de registros** y guárdelo.

<div class="mac-window">
  ![Descripción general de DCE con URI](/img/ms%20sentinel%20-%20images/Sentinel%20-%2010.png)
</div>

### B. Crear la tabla personalizada y la regla de recopilación de datos (DCR)

#### 1. Vaya a Log Analytics

Navegue hasta su **Espacio de trabajo de Log Analytics**.

#### 2. Crear una tabla personalizada

En el menú de la izquierda, haga clic en **Tablas**, luego **+ Crear** y seleccione **Nuevo registro personalizado (basado en DCR)**.

<div class="mac-window">
  ![Crear tabla personalizada](/img/ms%20sentinel%20-%20images/Sentinel%20-%2011.png)
</div>

#### 3. Pestaña "Conceptos básicos"

- **Nombre de la tabla**: `secureaitosiem` (Azure agregará automáticamente `_CL`, creando el nombre completo `secureaitosiem_CL`)
- **Regla de recopilación de datos**: seleccione "Crear un nuevo..." y asígnele el nombre `dcr-secureai-events`

<div class="mac-window">
  ![Configuración de regla de recopilación de datos](/img/ms%20sentinel%20-%20images/Sentinel%20-%2012.png)
</div>

- **Endpoint de recopilación de datos**: seleccione el DCE que creó anteriormente (`dce-secureai-integration`)
- Haga clic en **Siguiente: Esquema y transformación**

<div class="mac-window">
  ![Siguiente esquema y transformación](/img/ms%20sentinel%20-%20images/Sentinel%20-%2013.png)
</div>

#### 4. Pestaña "Esquema y transformación"

**Sube un archivo de muestra**: El sistema te lo indicará. Cree un archivo `.json` con el siguiente contenido y cárguelo:

```json
[
  {
    "time": "2025-08-30T21:34:29.013Z",
    "level": "Info",
    "message": "SecureAI platform started successfully",
    "component": "SystemService",
    "correlationId": "test-001"
  },
  {
    "time": "2025-08-30T21:34:30.013Z",
    "level": "Warning",
    "message": "High memory usage detected on server",
    "component": "MonitoringService",
    "correlationId": "test-002"
  },
  {
    "time": "2025-08-30T21:34:31.013Z",
    "level": "Error",
    "message": "Database connection timeout after 30 seconds",
    "component": "DatabaseService",
    "correlationId": "test-003"
  },
  {
    "time": "2025-08-30T21:34:32.013Z",
    "level": "Info",
    "message": "User admin@secureai.com logged in successfully",
    "component": "AuthService",
    "correlationId": "test-004"
  },
  {
    "time": "2025-08-30T21:34:33.013Z",
    "level": "Warning",
    "message": "API rate limit approaching threshold",
    "component": "APIGateway",
    "correlationId": "test-005"
  },
  {
    "time": "2025-08-30T21:34:34.013Z",
    "level": "Info",
    "message": "Security scan completed - 0 threats found",
    "component": "SecurityScanner",
    "correlationId": "test-006"
  },
  {
    "time": "2025-08-30T21:34:35.013Z",
    "level": "Error",
    "message": "Failed to sync with external SIEM system",
    "component": "SIEMSync",
    "correlationId": "test-007"
  },
  {
    "time": "2025-08-30T21:34:36.013Z",
    "level": "Info",
    "message": "Backup job completed successfully",
    "component": "BackupService",
    "correlationId": "test-008"
  }
]
```

**Descargar archivo de muestra**: También puede descargar el archivo JSON de muestra completo para usarlo directamente:

<a href="/sample-json.json" download>📥 muestra.json</a>

#### 5. Aplicar la transformación

El sistema puede mostrar una advertencia sobre el campo TimeGenerated. Haga clic en el botón **Editor de transformación**, elimine todo el contenido existente y pegue la siguiente consulta KQL completa:

```kql
source
| extend TimeGenerated = todatetime(['time'])
| project
    TimeGenerated,
    Level_s = tostring(['level']),
    Message_s = tostring(['message']),
    Component_s = tostring(['component']),
    CorrelationId_s = tostring(['correlationId'])
```

<div class="mac-window">
  ![Consulta de transformación KQL](/img/ms%20sentinel%20-%20images/Sentinel%20-%2014.png)
</div>

Haga clic en **Aplicar**. Debería ver una vista previa de la tabla con todas las columnas y tipos de datos correctos.

<div class="mac-window">
  ![Aplicar transformación](/img/ms%20sentinel%20-%20images/Sentinel%20-%2015.png)
</div>

#### 6. Finalizar la creación

Haga clic en **Siguiente: Revisar + crear** y luego en **Crear**.

<div class="mac-window">
  ![Revisar y crear DCR](/img/ms%20sentinel%20-%20images/Sentinel%20-%2016.png)
</div>

## Paso 3: Conectar la identidad a la infraestructura (permisos)

Este paso crucial otorga permiso a nuestra aplicación para utilizar la regla de recopilación de datos que acabamos de crear.

### A. Vaya a su nuevo DCR

Busque y abra su regla de recopilación de datos, `dcr-secureai-events` y en "Descripción general", copie el ID inmutable y guárdelo para su integración.

<div class="mac-window">
  ![Descripción general de DCR con ID inmutable](/img/ms%20sentinel%20-%20images/Sentinel%20-%2017.png)
</div>

### B. Asignar el rol

En el menú de la izquierda, vaya a **Control de acceso (IAM)** y haga clic en **+ Agregar** → **Agregar asignación de roles**.

<div class="mac-window">
  ![Agregar asignación de roles](/img/ms%20sentinel%20-%20images/Sentinel%20-%2018.png)
</div>

**Función**: busque y seleccione **Editor de métricas de supervisión**.

<div class="mac-window">
  ![Seleccione la función del editor de métricas de monitoreo](/img/ms%20sentinel%20-%20images/Sentinel%20-%2019.png)
</div>

**Miembros**: haga clic en **Seleccionar miembros** y busque el nombre de registro de su aplicación (`SecureAI-Log-Ingester`). Selecciónelo.

<div class="mac-window">
  ![Seleccione miembro de registro de la aplicación](/img/ms%20sentinel%20-%20images/Sentinel%20-%2020.png)
</div>

Haga clic en **Revisar + asignar**.

## Paso 4: Finalizar y compartir información

Ya casi has terminado. Sólo un último paso.

### A. Reúna la información

Para completar la integración, la aplicación necesita los siguientes seis datos:

1. **ID de inquilino**: (Desde el paso 1)
2. **ID de cliente**: (Desde el paso 1)
3. **Secreto del cliente**: (Del paso 1)
4. **DCE URI**: (Del paso 2A)
5. **ID inmutable de DCR**: (Navegue a su DCR `dcr-secureai-events` y cópielo desde la vista JSON)
6. **Nombre de la transmisión**: este es un valor construido. El formato es `Custom-{TableName}`. En nuestro caso será: `Custom-secureaitosiem_CL`

### B. Configurar la aplicación

Ingrese estos 6 valores en los ajustes de configuración de su aplicación.

<div class="mac-window">
  ![Configuración de la aplicación](/img/ms%20sentinel%20-%20images/Sentinel%20-%2021.png)
</div>

## Paso 5: Verificar la integración

Una vez que haya ingresado los detalles de integración en la aplicación SecureAI, podrá verificar que la conexión esté funcionando correctamente.

### A. Pruebe la conexión

Utilice el botón "Probar conexión" dentro de nuestra aplicación. Esto enviará un evento de prueba a su espacio de trabajo de Microsoft Sentinel.

### B. Busque el evento de prueba en Log Analytics

Para ver si el evento llegó a Microsoft Sentinel, vaya a su área de trabajo de Log Analytics y haga clic en **Registros**.

Ejecute la siguiente consulta para ver sus datos entrantes:

```kql
secureaitosiem_CL
| order by TimeGenerated desc
```

Debería ver los datos de su registro aparecer con todas las columnas (`TimeGenerated`, `Level_s`, `Message_s`, etc.) correctamente completadas. Si es así, ¡tu integración es un éxito! ✅

<div class="mac-window">
  ![Verificación de integración exitosa](/img/ms%20sentinel%20-%20images/Sentinel%20-%2022.png)
</div>

**Nota**: Dependiendo del tráfico de la red y la carga del sistema, a veces los registros pueden tardar hasta 10 minutos en aparecer en Microsoft Sentinel.

## ¡Listo!

Con estos pasos, su instancia de Microsoft Sentinel estará completamente configurada para integrarse con SecureAI 😎.