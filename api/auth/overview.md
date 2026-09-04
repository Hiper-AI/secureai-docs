---
sidebar_position: 1
title: "Autenticación de la API"
sidebar_label: "Autenticación"
---

# Autenticación API

SecureAI utiliza autenticación de clave API para todos los accesos API externos. Las claves son tokens portadores creados y configurados por administradores, con controles por clave sobre modelos, políticas, límites, facturación y seguridad.

## Encabezado de autenticación

```http
Authorization: Bearer sk-your-api-key-here
```

**Formato de clave API:**
- Comienza con un prefijo `sk-` (por ejemplo, `sk-8cd5253f...`).
- El prefijo va seguido de un secreto hexadecimal de 64 caracteres.
- Solo se almacena un hash SHA-256 de la clave en el lado del servidor; la clave completa se muestra **una vez**, en el momento de la creación. Si se pierde, gire/recree la clave.

Todas las llamadas API requieren HTTPS.

## Creación y configuración de claves API

Los administradores crean claves en **Admin → Claves API** (base API `/api/admin/api-keys`, solo administrador). La clave completa se devuelve una vez en el momento de la creación. Cada clave lleva la siguiente configuración:

### Propiedad y facturación

| Configuración | Descripción |
|---------|-------------|
| `name` | Etiqueta legible por humanos. |
| `userId` | La cuenta de usuario a la que pertenece esta clave/a la que se factura. |
| `billingMode` | `user-completions` (deducir del subsidio de finalización del usuario) o `usage-by-model` (deducir un presupuesto en dólares por costo del modelo). Consulte [Modos de facturación](/api/billing-modes). |

Las personas que llaman pueden facturar una solicitud individual a un usuario **diferente** con el parámetro de cuerpo `user_id` (controlado por el administrador).

### Límites

| Configuración | Descripción |
|---------|-------------|
| `dailyLimit` | Solicitudes máximas por día para esta clave. |
| `monthlyLimit` | Solicitudes máximas por mes para esta clave. |
| `rateLimit.requestsPerMinute` | Límite por minuto (hasta 1000). |
| `rateLimit.requestsPerHour` | Límite por hora (hasta 10000). |
| `expiresAt` | Caducidad opcional; omitir para una clave que no caduque. |

### Listas permitidas

| Configuración | Descripción |
|---------|-------------|
| `allowedModels[]` | Si está configurada, la clave puede usar **solo** estos modelos. Vacío = el catálogo predeterminado de licencias. |
| `allowedIndexes[]` | Restringe qué bases de conocimiento puede consultar la clave. |
| `allowedSMLTPPolicies[]` | Políticas SMLTP que la clave puede solicitar (predeterminado `["public", "internal"]`). Validado con el solucionador de políticas, por lo que se permiten políticas personalizadas de inquilinos. |

### Escudo rápido

| Configuración | Descripción |
|---------|-------------|
| `enablePromptShield` | Active Prompt Shield para esta clave. |
| `promptShieldSensitivity` | `strict`, `balanced` o `permissive`. |
| `promptShieldPolicyId` | Vincule una política de Prompt Shield específica a la clave. |
| `allowedPromptShieldPolicies[]` | Políticas que la persona que llama puede seleccionar por llamada a través de `prompt_shield.policy`. |

Consulte [API Prompt Shield](/api/threat-defense/prompt-shield).

### Valores predeterminados de redundancia

`failoverDefaults` adjunta un modelo predeterminado [cadena de conmutación por error](/api/redundancy) a la clave: `models[]` (hasta 3), `timeout_ms` (1000–300000), `first_token_timeout_ms` (500–60000) y `on[]`. Luego, las personas que llaman obtienen conmutación por error sin enviar una cadena en cada solicitud.

## Idempotencia

Los `POST` de finalización aceptan un encabezado `Idempotency-Key`. Al volver a intentarlo con la misma clave, se obtiene el resultado original en lugar de facturar por segunda vez; utilícelo para que los reintentos de red sean seguros. Consulte [Finalización del chat](/api/chat/completions).

## Limitación de velocidad

Techos predeterminados (configurables por clave):

- **Por minuto**: 60 solicitudes
- **Por hora**: 1000 solicitudes
- **Diario**: 100 solicitudes
- **Mensual**: 10,000 solicitudes

Un titular de clave puede leer su propia cuota activa y límites a través de [`GET /usage`](/api/usage).

## Funciones de seguridad

- **Solo HTTPS**: todas las llamadas API requieren TLS.
- **Hashed en reposo**: solo se almacena un hash SHA-256 de cada clave.
- **Seguimiento de uso y registro de auditoría**: se registra cada llamada y evento de autenticación.
- **Cumplimiento de SMLTP**: las políticas de seguridad se aplican en cada solicitud.

## Respuestas de error

### Error de autenticación

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Error de límite de tarifa

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Códigos de error comunes

| Error | Descripción |
|-------|-------------|
| `Invalid API key` | La clave API no es válida, ha caducado o está revocada. |
| `Rate limit exceeded: too many requests per minute` | Se superó el límite de tarifa por minuto. |
| `Rate limit exceeded: too many requests per hour` | Se superó el límite de tarifa por hora. |
| `Access denied` | Modelo, índice o política no permitidos para esta clave. |

## Próximos pasos

- [Referencia de API](/api): explora todos los endpoints externos disponibles.
- [Finalizaciones de chat](/api/chat/completions): comience a integrar las finalizaciones.
- [Endpoint compatible con OpenAI](/api/chat/openai-compatible): reutilice un SDK de OpenAI existente.
- [Uso](/api/usage): verifique la cuota y los límites.