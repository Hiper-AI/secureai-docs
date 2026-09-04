---
id: splunk-security
title: "Integración con Splunk Security (HEC)"
sidebar_label: "Splunk Security"
description: "Guía de integración: Conexión de Splunk SIEM con HiperAI a través del recopilador de eventos HTTP (HEC)"
---

# Integración de seguridad de Splunk

Guía de integración: Conexión de Splunk SIEM con HiperAI

Esta guía describe los pasos necesarios para configurar Splunk para recibir registros de seguridad de HiperAI a través del HTTP Event Collector (HEC).

## Paso 1: crear un nuevo índice

Primero, crearemos un espacio dedicado para almacenar los registros de la aplicación.

### A. Desde la pantalla de inicio de Splunk, navegue hasta Configuración > Índices.

<div class="mac-window">
  ![Índices de configuración de Splunk](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. Haga clic en el botón Nuevo índice en la esquina superior derecha.

### C. Configurar el índice:

- **Nombre del índice**: `secureai_events`
- Deje todas las demás opciones con sus valores predeterminados para una configuración estándar.
- Haga clic en **Guardar**.

<div class="mac-window">
  ![Configuración del índice Splunk](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

Su nuevo índice ahora está creado y listo para recibir datos.

## Paso 2: Habilite el recopilador de eventos HTTP (HEC)

A continuación, nos aseguraremos de que Splunk esté escuchando las solicitudes de datos entrantes.

### A. Vaya a Configuración > Entradas de datos.

<div class="mac-window">
  ![Entradas de datos de Splunk](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. En "Entradas locales", haga clic en Recopilador de eventos HTTP.

<div class="mac-window">
  ![Recopilador de eventos HTTP de Splunk](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. En la esquina superior derecha, haga clic en Configuración global.

### D. Verifique la siguiente configuración:

- **Todos los tokens**: debe estar habilitado.
- **Habilitar SSL**: (Opcional) Se recomienda para entornos de producción, pero se puede deshabilitar para las pruebas iniciales.
- **Número de puerto HTTP**: asegúrese de que el puerto sea 8088.
- Haga clic en **Guardar**.

<div class="mac-window">
  ![Configuración global de Splunk HEC](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## Paso 3: Crear el token HEC

El token es la clave de acceso seguro que utilizará nuestra aplicación para autenticarse con Splunk.

### A. Regrese a la página del Recopilador de eventos HTTP (Configuración > Entradas de datos > Recopilador de eventos HTTP).

### B. Haga clic en el botón Nuevo token.

<div class="mac-window">
  ![Botón de token nuevo de Splunk](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. Configuración del token (pestaña 1):

- **Nombre**: `token_secureai_app`
- **Descripción**: (Opcional) Añade una breve descripción.
- **Habilitar reconocimiento del indexador**: **IMPORTANTE**: asegúrese de que esta casilla de verificación no esté marcada.
- Haga clic en **Siguiente**.

<div class="mac-window">
  ![Configuración del token Splunk](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. Configuración de entrada (pestaña 2):

- **Tipo de fuente**: haga clic en Seleccionar. En el campo de búsqueda, escriba `_json` y selecciónelo de la lista. Esto le dice a Splunk que espere datos en formato JSON.
- **Índices permitidos**: en la columna "Índices disponibles", busque el índice que creamos (`secureai_events`) y haga clic en él para moverlo a la columna "Índices seleccionados".
- **Índice predeterminado**: seleccione `secureai_events` en el menú desplegable.

<div class="mac-window">
  ![Configuración de entrada de Splunk](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- Haga clic en **Revisar** y luego en **Enviar**.

<div class="mac-window">
  ![Revisión y envío de Splunk](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. ¡Copia el valor del token!

Splunk ahora mostrará el valor del token. Cópialo inmediatamente y guárdalo en un lugar seguro. Este es el token que necesitarás configurar en nuestra aplicación.

<div class="mac-window">
  ![Valor del token de Splunk](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## Paso 4: Finalizar y compartir información

Ya casi has terminado. Sólo un último paso.

### A. Reúna la información

Para completar la integración, la aplicación necesita los siguientes tres datos:

1. **URL HEC**: la dirección de su servidor Splunk y el puerto HEC (por ejemplo, `http://splunk.yourcompany.com:8088/services/collector`).
2. **El token HEC**: el valor que copiaste en el paso anterior.
3. **El nombre del índice**: El nombre del índice que creó (`secureai_events`).

<div class="mac-window">
  ![Información del índice de Splunk](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. Revisar las reglas del firewall

Asegúrese de que cualquier firewall entre el servidor de aplicaciones y su servidor Splunk permita el tráfico en el puerto HEC (normalmente TCP 8088).

## Paso 4: Nota sobre el formato de datos (tipo de fuente)

Para garantizar que los datos se identifiquen y analicen correctamente, nuestra aplicación envía registros en un formato JSON estructurado específico.

**Importante**: Todos los eventos enviados desde SecureAI tendrán el tipo de fuente `secureai:json`.

Este valor se establece directamente en la carga útil de datos enviada por nuestra aplicación, por lo que anulará automáticamente el tipo de fuente predeterminado (`_json`) que seleccionó para el token. No es necesario realizar ninguna otra acción, pero es importante que sepa que encontrará los datos en sourcetype="secureai:json" en sus búsquedas.

## Paso 6: Verificar la integración

Una vez que haya ingresado los detalles de integración en la aplicación SecureAI, podrá verificar que la conexión esté funcionando correctamente.

### A. Pruebe la conexión

Utilice el botón "Probar conexión" dentro de nuestra aplicación. Esto enviará un evento de prueba a su índice Splunk.

<div class="mac-window">
  ![Conexión de prueba de Splunk](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

Verá un mensaje de éxito si el evento se envió correctamente o un mensaje de error si alguno de los datos proporcionados es incorrecto.

### B. Encuentre el evento de prueba en Splunk

Para ver si el evento llegó a Splunk, vaya a la aplicación Búsqueda e informes.

En la barra de búsqueda, ejecute una búsqueda de su índice (por ejemplo, `index="secureai_events"`).

Establezca el Intervalo de tiempo en "Últimas 24 horas". Debería ver aparecer el registro de prueba en los resultados.

<div class="mac-window">
  ![Resultados de la búsqueda de Splunk](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**Nota**: Dependiendo del tráfico de la red y la carga del sistema, a veces los registros pueden tardar hasta 10 minutos en aparecer en Splunk.

## ¡Listo!

Con estos pasos, su instancia de Splunk estará completamente configurada para integrarse con SecureAI 😎.