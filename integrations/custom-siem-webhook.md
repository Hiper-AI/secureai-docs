---
id: custom-siem-webhook
title: "Integración con SIEM Personalizado vía Webhook"
sidebar_label: "SIEM / Webhook Custom"
description: "Integración genérica SIEM (HTTP/Webhook) para enviar registros de seguridad SecureAI a cualquier endpoint HTTP personalizado"
---

# Integración genérica SIEM (HTTP/Webhook)

## Descripción general

La integración genérica SIEM (HTTP/Webhook) le permite enviar registros de seguridad SecureAI a cualquier endpoint HTTP personalizado. Esto es perfecto para integrarse con sistemas SIEM que no tienen soporte nativo, herramientas de seguridad personalizadas ni ningún sistema de registro basado en HTTP.

## Casos de uso

- **Sistemas SIEM personalizados**: envíe registros a sus herramientas internas de monitoreo de seguridad
- **Plataformas de seguridad de terceros**: Integre con herramientas de seguridad que acepten webhooks
- **Paneles de control personalizados**: cree su propia visualización de eventos de seguridad
- **Pruebas y desarrollo**: utilice servicios de prueba de webhook para verificar la entrega de registros
- **Sistemas heredados**: conéctese a herramientas de seguridad más antiguas que solo admiten endpoints HTTP

## Pasos de configuración

### 1. Obtenga un endpoint de prueba

Para fines de prueba, recomendamos utilizar webhook.site:

1. Visite [https://webhook.site](https://webhook.site)
2. Copie su URL única (por ejemplo, `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`)
3. Mantenga esta página abierta para monitorear los webhooks entrantes.

<div class="mac-window">
  ![Endpoint de prueba de Webhook.site](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%201.png)
</div>

### 2. Configurar la integración

1. Navegue hasta **Integraciones** en su panel de administración de SecureAI
2. Busque **"SIEM genérico (HTTP/Webhook)"** en la categoría SIEM
3. Haga clic en **"Conectar integración"**

### 3. Complete la configuración

#### Configuración básica

- **Nombre de integración**: `Test Generic SIEM` (o cualquier nombre descriptivo)
- **URL del endpoint**: `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`
- **Método HTTP**: `POST` (recomendado para la mayoría de las plataformas SIEM)
- **Encabezados HTTP**: `{"Content-Type": "application/json"}`

<div class="mac-window">
  ![Configuración de encabezados HTTP](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%202.png)
</div>

#### Categorías de eventos

Seleccione qué tipos de eventos reenviar:

✅ **Recomendado para pruebas:**
- Autenticación e inicio de sesión
- API y uso de modelos
- Acceso a datos y PHI
- SMLTP y políticas
- Límites de facturación y uso
- Análisis

⚠️ **Opcional (puede generar un gran volumen):**
- Seguridad y violaciones
- Sistema e infraestructura
- Cambios de configuración

### 4. Pruebe la conexión

1. Haga clic en **"Probar conexión"** para verificar la conectividad.

<div class="mac-window">
  ![Botón de conexión de prueba](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%203.png)
</div>

2. Verifique webhook.site; debería ver una solicitud de prueba
3. Verifique que la respuesta sea exitosa.

<div class="mac-window">
  ![Verificación de respuesta exitosa](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%204.png)
</div>

### 5. Guardar y monitorear

1. Haga clic en **"Conectar"** para guardar la configuración.
2. Realice acciones en su sistema SecureAI (inicio de sesión, llamadas API, etc.)
3. Supervise webhook.site para ver registros en tiempo real

## Configuración avanzada

### Encabezados personalizados

Puede agregar encabezados personalizados para autenticación o requisitos específicos:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-api-key",
  "X-Custom-Header": "custom-value"
}
```

### Cuándo utilizar SIEM personalizado

La integración SIEM personalizada es particularmente útil en estos escenarios:

- **Sin sistema SIEM**: si actualmente no utiliza ninguna plataforma SIEM, esto proporciona una forma sencilla de comenzar a recopilar registros de seguridad.
- **Destinos de datos adicionales**: envíe datos a múltiples ubicaciones simultáneamente (por ejemplo, su SIEM principal + un sistema de respaldo)
- **Herramientas personalizadas**: Integre con herramientas de seguridad especializadas, centros de datos o paneles personalizados
- **Plataformas de comunicación**: envíe alertas a canales de Teams, Slack u otras herramientas de colaboración
- **Sistemas heredados**: conéctese a herramientas de seguridad más antiguas que solo admiten endpoints HTTP
- **Pruebas y desarrollo**: utilice servicios de prueba de webhook para verificar la entrega de registros antes de la implementación en producción.

**Nota**: Si ya tiene un SIEM compatible (Splunk, Microsoft Sentinel, Elastic), le recomendamos utilizar nuestras integraciones nativas para obtener características y rendimiento óptimos.

## Solución de problemas

### Problemas comunes

1. **Tiempo de espera de conexión**: compruebe si el endpoint es accesible y responde
2. **Errores de autenticación**: verifique las claves API y los encabezados de autenticación
3. **Problemas SSL/TLS**: garantice la validación adecuada del certificado para los endpoints HTTPS

### Monitoreo

- Verifique el estado de la integración en su panel de administración de SecureAI
- Supervisar las tasas de éxito de la entrega de webhooks
- Revisar los intentos fallidos de webhook en los registros
- Verificar la disponibilidad de los terminales y los tiempos de respuesta.

## Consideraciones de seguridad

- **Solo HTTPS**: use siempre endpoints HTTPS en producción
- **Autenticación**: implemente la autenticación adecuada para sus endpoints de webhook
- **Limitación de velocidad**: configure límites de velocidad adecuados en sus endpoints
- **Retención de registros**: implementar políticas de retención de registros adecuadas para el cumplimiento
- **Control de acceso**: restrinja el acceso a los endpoints de webhook solo a sistemas autorizados

## Mejores prácticas

1. **Empiece poco a poco**: comience con categorías de eventos esenciales y amplíe gradualmente
2. **Pruebe minuciosamente**: utilice webhook.site o servicios similares para la prueba inicial.
3. **Supervisar el rendimiento**: esté atento a retrasos o fallas en la entrega del webhook
4. **Configuración del documento**: mantenga registros detallados de la configuración de su webhook
5. **Revisión periódica**: revise y actualice periódicamente las configuraciones del webhook
6. **Planes de respaldo**: tenga métodos de registro alternativos en caso de que los webhooks fallen

## ¡Listo! 

Con estos pasos, su instancia de Webhook personalizado estará completamente configurada para integrarse con SecureAI 😎.