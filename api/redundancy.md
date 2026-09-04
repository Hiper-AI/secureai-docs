---
title: "Redundancia y Failover Automático"
sidebar_label: "Redundancia & Failover"
description: "Cadenas de conmutación por error de modelos definidas por la persona que llama para la API SecureAI Completions"
---

# Redundancia y conmutación por error

La API de Completions puede **conmutar por error** automáticamente de un modelo a otro cuando falla una llamada al proveedor. Usted define una cadena ordenada (un modelo primario más hasta dos alternativas) y SecureAI prueba cada una de ellas hasta que una tiene éxito. Esto le brinda resiliencia contra interrupciones del proveedor, límites de velocidad y tiempos de espera sin ninguna lógica de reintento en su propio código.

La redundancia está disponible tanto en el endpoint [clásico `/chat/completions`](/api/chat/completions) como en el endpoint [compatible con OpenAI `/v1/chat/completions`](/api/chat/openai-compatible).

## Cómo se define una cadena

Hay tres formas de solicitar una cadena, en orden de prioridad:

| # | Tu envías | Cadena resultante |
|---|----------|-----------------|
| 1 | `models: ["a", "b", "c"]` | Exactamente esa cadena (anula `model`). |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`. |
| 3 | `model: "a"` solo | Utiliza el `failoverDefaults` configurado por el administrador de la clave API si `a` aparece en ellos (la cadena comienza en la posición de `a`); de lo contrario, un solo intento. |

Una cadena puede contener **como máximo 3 modelos distintos**. Las entradas duplicadas están colapsadas. Cada entrada de la cadena puede ser una cadena modelo simple o un objeto con tiempos de espera por intento:

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

No puede combinar `models` y `fallback_models` en la misma solicitud.

## Opciones para toda la cadena (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

| Campo | Gama | Descripción |
|-------|-------|-------------|
| `timeout_ms` | 1000–300000 | Tiempo de espera general por intento. |
| `first_token_timeout_ms` | 500–60000 | Para transmisión: cuánto tiempo esperar por el primer token de contenido antes de realizar la conmutación por error. |
| `on` | subconjunto de los desencadenantes siguientes | Qué clases de fallas desencadenan la conmutación por error. El valor predeterminado es los cuatro. |

Los tiempos de espera por intento (establecidos dentro de una entrada `models[]`) anulan los valores de toda la cadena para ese intento.

## Desencadenantes de conmutación por error

Un intento fallido se clasifica en uno de estos motivos; La conmutación por error ocurre solo si el motivo está en su lista `on` **y** queda otro modelo en la cadena:

| Razón | Causa |
|--------|-------|
| `connection_error` | Conexión rechazada/restablecida, error de DNS/búsqueda. |
| `server_error` | El proveedor devolvió HTTP 5xx. |
| `rate_limit` | El proveedor devolvió HTTP 429. |
| `timeout` | El intento superó `timeout_ms` (o `first_token_timeout_ms` durante la transmisión). |

Las fallas que **no** se pueden reintentar nunca desencadenan una conmutación por error, por ejemplo, un bloqueo intencional de límite de velocidad de puerta de enlace/presupuesto de token, un disyuntor abierto o un rechazo de política/validación. Una alternativa fallaría de manera idéntica o el bloqueo es deliberado.

## Comportamiento de transmisión

Para solicitudes de transmisión, **la conmutación por error solo es posible antes de que llegue el primer token de contenido.** SecureAI extrae la transmisión ascendente hasta el primer token (delimitado por `first_token_timeout_ms`); si eso falla, pasa al siguiente modelo. Una vez que se ha enviado el primer token a su cliente, el modelo de servicio se bloquea: una interrupción posterior a mitad de camino aparece como un marco `error`, no como una conmutación por error.

## Lo que obtienes a cambio

Cuando se ejecuta una cadena de varios modelos, la respuesta incluye un **informe de conmutación por error**:

- Endpoint clásico: `metadata.failover`
- Endpoint compatible con OpenAI: `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` te dice qué modelo respondió realmente, y `requested_model` es el primer modelo de la cadena. Una solicitud de modelo único (heredado) no genera ningún informe de conmutación por error.

## Cuando falla toda la cadena

Si todos los intentos fallan, la solicitud devuelve un error que enumera todos los intentos:

- **429** si *cada* falla fuera un límite de tasa.
- **502** en caso contrario.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

En el endpoint compatible con OpenAI, la misma condición devuelve el sobre de error de OpenAI con `code: "all_models_failed"`.

## Valores predeterminados del administrador (`failoverDefaults`)

Un administrador puede adjuntar una cadena predeterminada a una clave API para que las personas que llaman obtengan conmutación por error sin enviar una cadena en cada solicitud. Configurada en **Admin → Claves API**, la carga útil se valida y fija:

- `models`: hasta 3 nombres de modelos distintos.
- `timeout_ms`: 1000–300000.
- `first_token_timeout_ms`: 500–60000.
- `on`: cualquier subconjunto de los cuatro activadores.

Cuando una persona que llama envía solo `model: "a"` y `a` está presente en `failoverDefaults.models`, la cadena comienza en la posición de `a` y continúa a través de los valores predeterminados restantes.

## Seguridad y facturación por intento

Cada intento es una llamada completa e independiente a través del contenedor SMLTP: aplicación de políticas, gobernanza de salida/residencia y el token de derecho firmado, todo se vuelve a ejecutar por intento, vinculado al modelo de ese intento y a los bytes de solicitud exactos. La facturación refleja el modelo que realmente proporcionó la respuesta. Cada conmutación por error también emite un evento de seguridad `api:model_failover` (entregado a cualquier [webhooks](/api/webhooks/overview) suscrito) y una entrada del registro de auditoría.

## Relacionado

- [Finalización del chat](/api/chat/completions)
- [Endpoint compatible con OpenAI] (/api/chat/openai-compatible)
- [Policy Check](/api/policy-check): obtenga una vista previa del acceso a toda la cadena sin gastar puntos.
- [Webhooks](/api/webhooks/overview) — suscríbete a `api:model_failover`.