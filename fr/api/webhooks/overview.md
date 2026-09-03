---
sidebar_position: 1
title: "Présentation des webhooks"
sidebar_label: "Aperçu"
description: "Recevez des événements de sécurité et de plate-forme en temps réel de SecureAI via des webhooks HTTP signés"
---
# Webhooks

SecureAI peut transmettre les événements de sécurité et de plate-forme à vos propres points de terminaison HTTP en temps réel : blocages de Prompt Shield, fuites Canary, incidents DLP/PII, événements de limite d'API et basculements de modèles. Chaque livraison est signée avec une signature HMAC-SHA256 afin que vous puissiez vérifier qu'elle provient de SecureAI et qu'elle n'a pas été falsifiée ou relue.

Les points de terminaison Webhook sont gérés par les administrateurs dans **Admin → Webhooks** (base API `/api/admin/webhooks`).

## Gestion des points de terminaison

| Actions | Itinéraire |
|--------|-------|
| Liste des points de terminaison (+ catalogue d'événements) | `GET /api/admin/webhooks` |
| Créer un point de terminaison (renvoie le secret une fois) | `POST /api/admin/webhooks` |
| Mettre à jour le point de terminaison | `PUT /api/admin/webhooks/:id` |
| Rotation du secret de signature (renvoyé une fois) | `POST /api/admin/webhooks/:id/rotate-secret` |
| Envoyer une livraison test | `POST /api/admin/webhooks/:id/test` |
| Supprimer le point de terminaison | `DELETE /api/admin/webhooks/:id` |

Entrées au moment de la création : `url`, `description`, `events[]` (voir [Events](/fr/en/api/webhooks/events)) et `enabled`. Le secret de signature (`whsec_...`) est affiché **uniquement** lors de la création et de la rotation — stockez-le en toute sécurité ; vous ne pouvez pas le récupérer à nouveau.

Le point de terminaison `url` est validé par SSRF : seul `http(s)` est accepté et les hôtes privés/bouclage/lien-local sont rejetés à moins que l'instance ne s'exécute avec `WEBHOOKS_ALLOW_PRIVATE=true` (les récepteurs auto-hébergés en ont souvent besoin).

##Format de livraison

Chaque livraison est un HTTP `POST` avec un corps JSON :

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

Et ces en-têtes :

| En-tête | Descriptif |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` | Le type d'événement (par exemple `promptshield:attack:blocked`). |
| `X-SecureAI-Delivery` | Un UUID de livraison unique (à utiliser pour l'idempotence). |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

Votre point de terminaison doit renvoyer n'importe quel statut `2xx` pour accuser réception de la livraison.

## Vérification de la signature

Recalculez le HMAC sur `` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t` est en dehors de votre fenêtre de tolérance (protection contre la relecture). **Vérifiez par rapport au corps brut de la requête** : l'analyse et la re-sérialisation du JSON en premier modifieront les octets et briseront la signature.

### Node.js (Express)

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

### Python (Flacon)

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

## Fiabilité

- **Nouvelles tentatives :** jusqu'à 3 tentatives avec un délai d'attente de 0 s/10 s/60 s, un délai d'attente de 5 s chacune. Tout `2xx` reconnaît.
- **Désactivation automatique :** après 20 échecs de livraison consécutifs, un point de terminaison est automatiquement désactivé ; un administrateur le réactive (ce qui réinitialise également le compteur d'échecs).
- **Au moins une fois :** les livraisons peuvent se répéter — déduplication sur `X-SecureAI-Delivery` (ou sur la charge utile `id`).
- **Fire-and-forget :** la livraison du webhook ne bloque ni ne retarde jamais la demande d'API d'origine.

## Connexes

- [Webhook Events](/fr/en/api/webhooks/events) — le catalogue complet des événements et les charges utiles.
- [Redondance & Failover](/fr/en/api/redundancy) — source de `api:model_failover`.
- [Threat Defense](/fr/en/threat-defense/overview) — source des événements `promptshield:*`.