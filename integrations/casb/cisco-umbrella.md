---
sidebar_position: 2
title: "Integración con Cisco Umbrella"
sidebar_label: "Cisco Umbrella"
description: "Configure Cisco Umbrella para detectar actividad de servicios de IA a través de la Reporting API v2"
---

# Integración con Cisco Umbrella

Conecte Cisco Umbrella para que SecureAI pueda detectar qué fuentes corporativas están resolviendo dominios LLM/AI, utilizando **Reporting API v2** de Umbrella. Umbrella es una fuente de capa DNS: confirma que un dispositivo *resolvió* un dominio de IA (no la carga útil TLS completa), que es exactamente lo que necesita el descubrimiento de IA en la sombra.

SecureAI ejecuta dos pases para una cobertura máxima:

1. Una lista seleccionada de dominios LLM/AI conocidos.
2. La **categoría de contenido `212` de Umbrella ("IA generativa")**, por lo que los servicios de IA recientemente populares se detectan incluso antes de que estén en la lista seleccionada.

## Requisitos previos

- Un paquete general que incluye **API de informes** y registros de actividad de DNS.
- **Credenciales API de Umbrella** (clave API + secreto) y su **ID de organización**.
- Para usar acciones de respuesta desde SecureAI, permisos adicionales de **Policies / Destination Lists**.

## Credenciales requeridas

| Campo en SecureAI | Requerido | Descripción |
| --- | --- | --- |
| **Umbrella API Key** | Sí | Clave con **Reports → Granular Events (Read)** y, si se usarán bloqueos, permisos de Policies. |
| **Umbrella API Secret** | Sí | Secreto de la API. SecureAI lo cifra en reposo. |
| **Organization ID** | Sí | ID numérico de su organización de Umbrella. |

### Permisos según la capacidad

| Capacidad | Permiso necesario |
| --- | --- |
| Descubrir actividad DNS de IA (incluye la categoría 212 "IA generativa") | **Reports → Granular Events → Read** |
| Consultar las destination lists | **Policies → Destination Lists → Read** y **Policies → Destinations → Read** |
| Crear, agregar o retirar dominios de bloqueos temporales | **Policies → Destination Lists → Write** y **Policies → Destinations → Write** |
| Bloqueo permanente ("hasta liberar") | Mismo permiso que el bloqueo temporal — es el mismo endpoint con `durationMinutes: null` |

Para habilitar **todas** las funciones (discovery completo, categorías y ambos tipos de bloqueo) con la Key Scope de Umbrella, seleccione exactamente:

```
Reports  / Granular Events       Read-Only
Policies / Destination Lists     Read / Write
Policies / Destinations          Read / Write
```

No son necesarios **Application Lists** (controla bloqueo de aplicaciones, no dominios), **Investigate**, **Admin** ni **Deployments**. La categoría de contenido 212 no tiene un scope propio: viaja como parámetro de la misma llamada de Reporting, ya cubierta por Granular Events.

### Dónde conseguirlos

1. Inicie sesión en el [panel de Umbrella](https://dashboard.umbrella.com/).
2. Vaya a **Administrador → Claves API** y haga clic en **Add**, en la esquina superior derecha.

![Página API Keys de Cisco Umbrella con el botón Add resaltado](/img/cisco-umbrella/step-1.png)

3. Dentro de **Add New API Key**, ingrese un nombre para la API Key.
4. En **Key Scope**, seleccione **Reports → Granular Events**. En el panel de la derecha, confirme que aparezca **Reports / Granular Events → Read-Only**.
5. Si SecureAI va a ejecutar acciones de respuesta, agregue **Policies → Destination Lists** y **Policies → Destinations**, ambos en modo **Read / Write**.

![Scopes requeridos para SecureAI en Cisco Umbrella](/img/cisco-umbrella/step-2.png)

6. Copie la API Key y el Key Secret inmediatamente. Cisco Umbrella muestra el secreto una sola vez.
7. Identifique el **Organization ID** en la URL del panel, en una ruta similar a `.../o/<orgId>/#/...`.

> Antes de publicar una captura de esta pantalla, cubra completamente la API Key y el Key Secret. Nunca incluya credenciales reales en la documentación.

![API Key, Key Secret y Organization ID censurados](/img/cisco-umbrella/step-3.png)

SecureAI se autentica con `POST https://api.umbrella.com/auth/v2/token` (Básico `apiKey:apiSecret`, `client_credentials`) y lee `GET /reports/v2/activity/dns`.

## Configurar en SecureAI

1. En SecureAI, abra **Administrador → Integraciones**.
2. Seleccione la categoría **Red**.
3. En la tarjeta **Cisco Umbrella**, haga clic en **Conectar**.

![Tarjeta Cisco Umbrella en la sección Integrations de SecureAI](/img/cisco-umbrella/step-4.png)

4. Complete los tres campos del formulario:
	- **Umbrella API Key**
	- **Umbrella API Secret**
	- **Organization ID**

> Para esta captura, cubra la API Key, el API Secret y cualquier otro identificador sensible antes de publicarla.

5. Haga clic en **Connect**. SecureAI guarda las credenciales y muestra la integración como configurada.

> El formulario de Integraciones no muestra un botón separado de prueba para Cisco Umbrella. La validación y la primera lectura se realizan durante la sincronización.

## Acciones de respuesta y bloqueos

SecureAI usa la **Policies API v2** para las acciones de respuesta que agregan dominios de IA a una destination list de bloqueo y los retiran cuando la acción vence o se libera.

La integración es de capa DNS y el bloqueo se aplica por dominio. El alcance depende de las policies de Umbrella a las que esté asociada la destination list. La lista administrada por SecureAI no bloquea tráfico por sí sola: un administrador debe asociarla a una policy en el dashboard de Umbrella.

Si la API key solo tiene permisos de Reporting, el descubrimiento seguirá funcionando, pero las acciones de bloqueo devolverán un error de permisos. No es necesario agregar una segunda credencial en el formulario actual: SecureAI reutiliza la API key y el secreto configurados para Umbrella.

## Iniciar la sincronización

1. En la tarjeta configurada de **Cisco Umbrella**, haga clic en el botón de sincronización (icono de flechas circulares).
2. Espere a que termine la sincronización inicial. Esta operación ejecuta un relleno de actividad DNS en segundo plano.
3. Para sincronizaciones posteriores, repita la acción cuando necesite actualizar los datos manualmente. El proceso programado también mantiene actualizado el inventario.

## Notas

- Umbrella es **capa DNS**: una coincidencia confirma la resolución del dominio, no una llamada API completa. Es ideal para su amplitud (todos los dispositivos detrás de Umbrella) pero no lleva cargas útiles de solicitud.
- Si la salida de Umbrella debe pasar por un proxy, configure `UMBRELLA_PROXY_URL` (o el estándar `HTTPS_PROXY`) en el backend de SecureAI.

## Verificar el resultado

Después de la primera sincronización, abra [Fuentes de red](/discovery/network-sources): las fuentes que resolvieron dominios de IA aparecen con sus proveedores, recuento de llamadas y gravedad.

Si la sincronización falla, revise el estado y el mensaje de error de la tarjeta Cisco Umbrella, confirme que la clave tenga permisos de **Informes** y verifique que el backend pueda realizar conexiones salientes a `api.umbrella.com`.

## Relacionado

- [CASB y descripción general de la red](/integrations/casb/overview)
- [Fuentes de red](/discovery/network-sources)