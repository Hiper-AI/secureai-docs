---
sidebar_position: 2
title: "Integración con Cisco Umbrella"
sidebar_label: "Cisco Umbrella"
description: "Detecte la IA oculta de la actividad DNS de Cisco Umbrella a través de la API de informes v2"
---

# Cisco Umbrella

Conecte Cisco Umbrella para que SecureAI pueda detectar qué fuentes corporativas están resolviendo dominios LLM/AI, utilizando **Reporting API v2** de Umbrella. Umbrella es una fuente de capa DNS: confirma que un dispositivo *resolvió* un dominio de IA (no la carga útil TLS completa), que es exactamente lo que necesita el descubrimiento de IA en la sombra.

SecureAI ejecuta dos pases para una cobertura máxima:

1. Una lista seleccionada de dominios LLM/AI conocidos.
2. La **categoría de contenido `212` de Umbrella ("IA generativa")**, por lo que los servicios de IA recientemente populares se detectan incluso antes de que estén en la lista seleccionada.

## Requisitos previos

- Un paquete general que incluye **API de informes** y registros de actividad de DNS.
- **Credenciales API de Umbrella** (clave API + secreto) y su **ID de organización**.

## Credenciales

| Campo | Requerido | Descripción |
|-------|----------|-------------|
| `apiKey` | Sí | Clave API de informes generales. |
| `apiSecret` | Sí | Secreto de la API de informes generales. Cifrado en reposo. |
| `orgId` | Sí | Su ID de organización paraguas. |

### Dónde conseguirlos

1. Inicie sesión en el [panel de Umbrella] (https://dashboard.umbrella.com/).
2. Vaya a **Administrador → Claves API** y cree una clave con alcance de **Informes**. Copie la clave y el secreto (se muestran una vez).
3. Su **ID de organización** es el ID numérico en la URL del panel (`.../o/<orgId>/#/...`).

SecureAI se autentica con `POST https://api.umbrella.com/auth/v2/token` (Básico `apiKey:apiSecret`, `client_credentials`) y lee `GET /reports/v2/activity/dns`.

## Conectar

1. **Administrador → Integraciones → Red → Cisco Umbrella → Conectar.**
2. Ingrese la clave API, el secreto y el ID de la organización.
3. **Probar**, luego **Guardar**.
4. **Sincronización**: la primera sincronización repone la actividad DNS reciente en segundo plano.

## Notas

- Umbrella es **capa DNS**: una coincidencia confirma la resolución del dominio, no una llamada API completa. Es ideal para su amplitud (todos los dispositivos detrás de Umbrella) pero no lleva cargas útiles de solicitud.
- Si la salida de Umbrella debe pasar por un proxy, configure `UMBRELLA_PROXY_URL` (o el estándar `HTTPS_PROXY`) en el backend de SecureAI.

## Verificar

Después de la primera sincronización, abra [Fuentes de red](/discovery/network-sources): las fuentes que resolvieron dominios de IA aparecen con su(s) proveedor(es), recuento de llamadas y gravedad.

## Relacionado

- [CASB y descripción general de la red](/integrations/casb/overview)
- [Fuentes de red](/discovery/network-sources)