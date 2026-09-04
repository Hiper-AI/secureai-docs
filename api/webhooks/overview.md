---
sidebar_position: 1
title: "Webhooks de Eventos — Visión General"
sidebar_label: "Webhooks"
description: "Reciba eventos de plataforma y seguridad en tiempo real de SecureAI a través de webhooks HTTP firmados"
---

# Webhooks

SecureAI puede enviar eventos de plataforma y seguridad a sus propios endpoints HTTP en tiempo real: bloqueos de Prompt Shield, fugas canarias, incidentes DLP/PII, eventos de límite de API y conmutaciones por error de modelos. Cada entrega está firmada con una firma HMAC-SHA256 para que pueda verificar que proviene de SecureAI y que no fue manipulada ni reproducida.

Los administradores administran los endpoints de Webhook en **Admin → Webhooks** (base de API `/api/admin/webhooks`).

## Gestión de endpoints

| Acción | Ruta |
|--------|-------|
| Listar endpoints (+ catálogo de eventos) | `GET /api/admin/webhooks` |
| Crear endpoint (devuelve el secreto una vez) | `POST /api/admin/webhooks` |
| Actualizar endpoint | `PUT /api/admin/webhooks/:id` |
| Rotar el secreto de firma (devuelto una vez) | `POST /api/admin/webhooks/:id/rotate-secret` |
| Enviar una entrega de prueba | `POST /api/admin/webhooks/:id/test` |
| Eliminar endpoint | `DELETE /api/admin/webhooks/:id` |

Entradas en el momento de la creación: `url`, `description`, `events[]` (consulte [Eventos](/api/webhooks/events)) y `enabled`. El secreto de firma (`whsec_...`) se muestra **solo** al crear y rotar; guárdelo de forma segura; no puedes recuperarlo de nuevo.

El endpoint `url` está validado por SSRF: solo se acepta `http(s)` y los hosts privados/loopback/link-local se rechazan a menos que la instancia se ejecute con `WEBHOOKS_ALLOW_PRIVATE=true` (los receptores autohospedados a menudo necesitan esto).

## Formato de entrega

Cada entrega es un HTTP `POST` con un cuerpo JSON:

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

Y estos encabezados:

| Encabezado | Descripción |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` | El tipo de evento (por ejemplo, `promptshield:attack:blocked`). |
| `X-SecureAI-Delivery` | Un UUID de entrega único (uso para idempotencia). |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

Su endpoint debe devolver cualquier estado `2xx` para acusar recibo de la entrega.

## Verificando la firma

Vuelva a calcular el HMAC sobre `` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t` está fuera de su ventana de tolerancia (protección de reproducción). **Verifique con el cuerpo de la solicitud sin formato**: analizar y volver a serializar el JSON primero cambiará los bytes y romperá la firma.

### Node.js (Rápido)

```javascript
import crypto from 'crypto';
import express from 'express';

const app = express();
const SECRET = process.env.SECUREAI_WEBHOOK_SECRET; // whsec_...
const TOLERANCE_SECONDS = 300;

// Capture the RAW body — do not use express.json() before verifying.
app.post('/webhooks/secureai', express.raw({ type: 'application/json' }), (req, res) => {
  const header = req.get('X-SecureAI-Signature') || '';
  const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=')));
  const t = Number(parts.t);
  const rawBody = req.body.toString('utf8');

  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > TOLERANCE_SECONDS) {
    return res.status(400).send('stale or invalid timestamp');
  }

  const expected = crypto.createHmac('sha256', SECRET).update(`${t}.${rawBody}`).digest('hex');
  const ok = parts.v1 &&
    crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));
  if (!ok) return res.status(401).send('bad signature');

  const event = JSON.parse(rawBody);
  console.log('Received', event.type, event.id);
  res.sendStatus(200);
});
```

### Python (frasco)

```python
import hashlib, hmac, time
from flask import Flask, request, abort

app = Flask(__name__)
SECRET = b"whsec_..."          # your signing secret
TOLERANCE_SECONDS = 300

@app.post("/webhooks/secureai")
def secureai_webhook():
    header = request.headers.get("X-SecureAI-Signature", "")
    parts = dict(kv.split("=", 1) for kv in header.split(","))
    t = int(parts.get("t", "0"))
    raw_body = request.get_data()  # raw bytes — do NOT use request.json first

    if abs(time.time() - t) > TOLERANCE_SECONDS:
        abort(400, "stale timestamp")

    signed = f"{t}.".encode() + raw_body
    expected = hmac.new(SECRET, signed, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(parts.get("v1", ""), expected):
        abort(401, "bad signature")

    return "", 200
```

## Confiabilidad

- **Reintentos:** hasta 3 intentos con retroceso de 0 s/10 s/60 s, tiempo de espera de 5 s cada uno. Cualquier `2xx` reconoce.
- **Desactivación automática:** después de 20 errores de entrega consecutivos, un endpoint se desactiva automáticamente; un administrador lo vuelve a habilitar (lo que también restablece el contador de fallas).
- **Al menos una vez:** las entregas pueden repetirse: deduplicar en `X-SecureAI-Delivery` (o la carga útil `id`).
- **Dispara y olvida:** la entrega del webhook nunca bloquea ni retrasa la solicitud de API de origen.

## Relacionado

- [Eventos Webhook](/api/webhooks/events): el catálogo completo de eventos y las cargas útiles.
- [Redundancia y conmutación por error](/api/redundancy) — fuente de `api:model_failover`.
- [Threat Defense](/threat-defense/overview) — fuente de los eventos `promptshield:*`.