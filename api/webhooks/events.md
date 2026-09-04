---
sidebar_position: 2
title: "Catálogo de Eventos de Webhooks"
sidebar_label: "Eventos de Webhooks"
description: "El catálogo de eventos del webhook de SecureAI"
---

# Eventos de webhook

Al crear o actualizar un [endpoint de webhook](/api/webhooks/overview), lo suscribe a uno o más tipos de eventos. Utilice `"*"` para recibir todos los eventos.

## Catálogo de eventos

| Evento | Se dispara cuando |
|-------|-----------|
| `*` | Comodín: se suscribe a **todos** los eventos siguientes. |
| `promptshield:attack:blocked` | Prompt Shield bloqueó un intento de inyección rápida/jailbreak. |
| `promptshield:attack:detected` | Prompt Shield marcó un mensaje sospechoso (detectado pero no bloqueado). |
| `promptshield:canary:leaked` | Se encontró un token canario en la salida del modelo (señal de aviso del sistema/exfiltración de datos). |
| `dlp:incident` | Una regla de Prevención de pérdida de datos coincide. |
| `pii:incident` | Se detectó/redactó PII. |
| `api:limit_reached` | Una clave API alcanzó un límite diario/mensual/de tasa. |
| `api:model_failover` | Una cadena [redundancia](/api/redundancy) falló de un modelo a otro. |

La suscripción a un nombre de evento desconocido se rechaza en el momento de la creación/actualización.

## Sobre de carga útil

Cada entrega comparte el mismo sobre; el objeto `data` es específico del evento.

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "api:model_failover",
  "created": 1705312200,
  "data": {
    "failedModel": "openai/gpt-5-nano",
    "reason": "timeout",
    "nextModel": "anthropic/claude-sonnet-4",
    "latencyMs": 30011,
    "userId": "60a7c8f5e8b4f5001f7a8c23",
    "apiKeyId": "6512ab..."
  }
}
```

## Entregas de prueba

El botón **Enviar evento de prueba** (o `POST /api/admin/webhooks/:id/test`) entrega un evento `webhook:test` para que pueda confirmar su destinatario y la verificación de firma antes de publicarlo:

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## Relacionado

- [Descripción general de webhooks](/api/webhooks/overview): formato de entrega, verificación de firma, confiabilidad.