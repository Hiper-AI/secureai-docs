---
sidebar_position: 1
title: "Webhooks de Eventos — Visão Geral"
sidebar_label: "Webhooks"
description: "Receba eventos de plataforma e segurança em tempo real da SecureAI por meio de webhooks HTTP assinados"
---

# Webhooks

SecureAI pode enviar eventos de segurança e de plataforma para seus próprios endpoints HTTP em tempo real – blocos Prompt Shield, vazamentos canário, incidentes DLP/PII, eventos de limite de API e failovers de modelo. Cada entrega é assinada com uma assinatura HMAC-SHA256 para que você possa verificar se ela veio da SecureAI e não foi adulterada ou reproduzida.

Os endpoints do Webhook são gerenciados por administradores em **Admin → Webhooks** (API base `/api/admin/webhooks`).

## Gerenciando terminais

| Ação | Rota |
|-------|-------|
| Listar endpoints (+ catálogo de eventos) | `GET /api/admin/webhooks` |
| Criar endpoint (retorna segredo uma vez) | `POST /api/admin/webhooks` |
| Atualizar ponto de extremidade | `PUT /api/admin/webhooks/:id` |
| Girar segredo de assinatura (retornado uma vez) | `POST /api/admin/webhooks/:id/rotate-secret` |
| Envie uma entrega de teste | `POST /api/admin/webhooks/:id/test` |
| Excluir ponto de extremidade | `DELETE /api/admin/webhooks/:id` |

Entradas de tempo de criação: `url`, `description`, `events[]` (consulte [Eventos](/pt/api/webhooks/events)) e `enabled`. O segredo de assinatura (`whsec_...`) é mostrado **apenas** na criação e rotação — armazene-o com segurança; você não pode recuperá-lo novamente.

O endpoint `url` é validado por SSRF: apenas `http(s)` é aceito e hosts privados/loopback/link-local são rejeitados, a menos que a instância seja executada com `WEBHOOKS_ALLOW_PRIVATE=true` (receptores auto-hospedados geralmente precisam disso).

## Formato de entrega

Cada entrega é um HTTP `POST` com um corpo JSON:

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

E estes cabeçalhos:

| Cabeçalho | Descrição |
|--------|------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` | O tipo de evento (por exemplo, `promptshield:attack:blocked`). |
| `X-SecureAI-Delivery` | Um UUID de entrega exclusivo (uso para idempotência). |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

Seu endpoint deve retornar qualquer status `2xx` para confirmar a entrega.

## Verificando a assinatura

Recalcule o HMAC sobre `` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t` está fora de sua janela de tolerância (proteção de reprodução). **Verifique o corpo da solicitação bruta** — analisar e serializar novamente o JSON primeiro alterará os bytes e quebrará a assinatura.

### Node.js (Expresso)

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

## Confiabilidade

- **Tentativas:** até 3 tentativas com espera de 0s/10s/60s, tempo limite de 5s cada. Qualquer `2xx` reconhece.
- **Desativação automática:** após 20 falhas consecutivas de entrega, um endpoint é desativado automaticamente; um administrador o reativa (o que também redefine o contador de falhas).
- **Pelo menos uma vez:** as entregas podem ser repetidas — desduplicação em `X-SecureAI-Delivery` (ou na carga útil `id`).
- **Dispare e esqueça:** a entrega do webhook nunca bloqueia ou atrasa a solicitação de API de origem.

## Relacionado

- [Webhook Events](/pt/api/webhooks/events) — o catálogo completo de eventos e cargas úteis.
- [Redundância e Failover](/pt/api/redundancy) — fonte de `api:model_failover`.
- [Threat Defense](/pt/threat-defense/overview) — fonte dos eventos `promptshield:*`.