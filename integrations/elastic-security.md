---
id: elastic-security
title: "Integración con Elastic Security"
sidebar_label: "Elastic Security"
description: "Integre HiperAI con Elastic Security para detección avanzada de amenazas y análisis de seguridad"
---

# Integración de SecureAI con Elastic SIEM

Esta guía proporciona instrucciones paso a paso sobre cómo integrar SecureAI con su instancia de Elastic SIEM. Esta integración le permite reenviar registros de eventos desde SecureAI a Elasticsearch para monitoreo, análisis y alertas.

## Paso 1: Obtenga su endpoint de Elastic Cloud

Primero, debe obtener la URL del endpoint de su implementación de Elastic Cloud.

1. Inicie sesión en su cuenta de Elastic Cloud.
2. Desde la página de inicio, localice la implementación que desee.
3. Busque la URL del endpoint de Elasticsearch y cópiela. Lo necesitará para la configuración de SecureAI más adelante.

<div class="mac-window">
  ![Elastic Cloud Endpoint](/img/elastic%20images/Elastic%20-%201.png)
</div>

## Paso 2: crear una clave API en Elasticsearch

Se requiere una clave API para que SecureAI envíe datos de forma segura a su clúster de Elasticsearch.

1. En su panel de Kibana, navegue hasta **Administración** > **Claves API**.
2. Haga clic en el botón **Crear clave API**.

<div class="mac-window">
  ![Crear botón clave API](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. Configure la clave API con los siguientes detalles:

<div class="mac-window">
  ![Configurar clave API](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **Nombre**: `secureai-siem-integration` (u otro nombre descriptivo).
   - **Rol**: Asigne un rol que tenga los privilegios necesarios para escribir en índices. Para simplificar esta guía, no establecemos una fecha de vencimiento ni restricciones de funciones específicas.
4. Haga clic en **Crear clave API**.

<div class="mac-window">
  ![Haga clic en Crear clave API](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. Su clave será generada y mostrada. Copie la clave API codificada en Base64 y guárdela en una ubicación segura. No podrá volver a verlo después de salir de esta pantalla.

<div class="mac-window">
  ![Clave API generada](/img/elastic%20images/Elastic%20-%205.png)
</div>

## Paso 3: Crear el índice objetivo en Elasticsearch

Debe crear y asignar un índice en Elasticsearch donde se almacenarán los eventos de SecureAI.

1. En Kibana, navegue hasta **Herramientas de desarrollador**.
2. En la consola, ejecute el siguiente comando para crear el índice `secureai-events` con las asignaciones de campos apropiadas:

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![Crear índice en herramientas de desarrollador](/img/elastic%20images/Elastic%20-%206.png)
</div>

## Paso 4: Configurar la integración Elastic SIEM en SecureAI

Ahora, ingrese los detalles de Elastic en el panel de integraciones de SecureAI.

1. En su panel de SecureAI, navegue hasta **Integraciones**.
2. Localice la tarjeta de integración **Elastic SIEM** y haga clic en **Configurar**.
3. Complete los campos de configuración de la siguiente manera:
   - **Nombre de integración**: `secureai-app-elastic`
   - **URL elástica**: pegue el endpoint que copió en el Paso 1.
   - **Clave API elástica**: pegue la clave API codificada en Base64 que creó en el Paso 2.
   - **Índice elástico**: `secureai-events`
   - **Seleccione categorías de eventos**: marque todas las casillas para reenviar todos los tipos de eventos disponibles a su Elastic SIEM.
4. Haga clic en **Actualizar** para guardar la configuración.

<div class="mac-window">
  ![Haga clic en Actualizar para guardar la configuración](/img/elastic%20images/Elastic%20-%207.png)
</div>

## Paso 5: Pruebe y verifique la conexión

Después de guardar la configuración, pruebe la conexión para asegurarse de que SecureAI pueda comunicarse con su instancia Elastic.

1. En el modo de configuración de integración, haga clic en el botón **Probar conexión**.
2. Debería ver un mensaje de éxito: "¡Prueba exitosa! Conexión verificada".

<div class="mac-window">
  ![Mensaje de prueba exitosa](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. Para confirmar que se recibieron los datos de la prueba, vaya a **Descubrir** en Kibana.
4. Seleccione la vista de datos `secureai-events` (patrón de índice).
5. Debería ver un registro de eventos de prueba de SecureAI, que confirma que la integración está funcionando correctamente.

<div class="mac-window">
  ![Confirmación del registro de eventos de prueba](/img/elastic%20images/Elastic%20-%209.png)
</div>

Su integración de SecureAI y Elastic SIEM ya está activa. Los eventos se registrarán en su índice `secureai-events` a medida que ocurran.

## ¡Listo!

Con estos pasos, su instancia de Elastic estará completamente configurada para integrarse con SecureAI 😎.