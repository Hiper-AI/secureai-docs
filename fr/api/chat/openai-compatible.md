---
sidebar_position: 2
title: "Point de terminaison compatible OpenAI"
sidebar_label: "Compatible OpenAI"
description: "Surface de complétion de discussion OpenAI instantanée : pointez n'importe quel SDK OpenAI vers SecureAI"
openapi: "POST /v1/chat/completions"
---
# Point de terminaison compatible OpenAI

SecureAI expose une surface compatible OpenAI afin que vous puissiez intégrer **n'importe quel SDK OpenAI en modifiant uniquement l'URL de base et la clé API** — aucune modification de code. La pile de sécurité complète SecureAI (authentification par clé API, listes d'autorisation de modèle/index, application de la politique SMLTP + droits, Prompt Shield, PII/DLP, facturation des points et le [moteur de redondance de modèle](/fr/api/redundancy)) s'exécute en dessous.

## Point de terminaison

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

Pointez le `base_url` de votre client OpenAI vers :

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**Zéro-Connaissance uniquement**

Cette surface ne prend **pas** en charge les RAG/bases de connaissances. Les demandes sont épinglées sur `Zero-Knowledge`. Si vous avez besoin d'une récupération de base de connaissances, utilisez le point de terminaison classique [Chat Completion](/fr/api/chat/completions).
</Info>

## Authentification

```bash
Authorization: Bearer sk-your-api-key-here
```

## Utilisation d'un SDK OpenAI

###Python (`openai`)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key-here",
    base_url="https://{customer.name}.hiperai.ai/api/external/v1",
)

resp = client.chat.completions.create(
    model="openai/gpt-5-nano",
    messages=[{"role": "user", "content": "Hello!"}],
    # SecureAI extensions travel via extra_body
    extra_body={
        "smltp_policy": "internal",
        "fallback_models": ["anthropic/claude-sonnet-4"],
    },
)
print(resp.choices[0].message.content)
print(resp.model_extra["secureai"]["served_model"])
```

###JavaScript (`openai`)

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-your-api-key-here',
  baseURL: 'https://{customer.name}.hiperai.ai/api/external/v1',
});

const resp = await client.chat.completions.create({
  model: 'openai/gpt-5-nano',
  messages: [{ role: 'user', content: 'Hello!' }],
  // @ts-expect-error — SecureAI extension fields
  smltp_policy: 'internal',
  fallback_models: ['anthropic/claude-sonnet-4'],
});
console.log(resp.choices[0].message.content);
```

## Corps de la demande

Les champs OpenAI standard sont pris en charge. `messages` est requis (il n'y a pas de `prompt` sur cette surface). `max_completion_tokens` est accepté comme alias pour `max_tokens`.

Les paramètres OpenAI suivants sont transmis tels quels au fournisseur :

`tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `stop`, `top_p`, `frequency_penalty`, `presence_penalty`, `seed`, `logprobs`, `top_logprobs`, `user`.

### Champs d'extension SecureAI

Envoyez-les sous forme de champs de corps supplémentaires (via `extra_body` dans les SDK OpenAI) :

| Champ | Descriptif |
|-------|-------------|
| `smltp_policy` | Politique de sécurité SMLTP pour cet appel. |
| `prompt_shield` | `{ enabled?, policy? }` — remplacement du bouclier d'invite par appel. |
| `models` / `fallback_models` | Modèle de chaîne de [redondance](/fr/api/redundancy). |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`. |
| `user_id` | Facturer à un autre utilisateur (admin-gated). |

## Réponse

Forme OpenAI standard `chat.completion`, plus un objet d'extension `secureai`.

```json
{
  "id": "chatcmpl-1a2b3c...",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "anthropic/claude-sonnet-4",
  "choices": [
    { "index": 0, "message": { "role": "assistant", "content": "Hello!" }, "finish_reason": "stop" }
  ],
  "usage": { "prompt_tokens": 9, "completion_tokens": 3, "total_tokens": 12 },
  "secureai": {
    "served_model": "anthropic/claude-sonnet-4",
    "requested_model": "openai/gpt-5-nano",
    "failover": { "occurred": true, "attempts": [ ... ] },
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "smltp_bundle_id": "bnd_..."
  }
}
```

`secureai.smltp_bundle_id` (lorsqu'il est présent) peut être échangé contre un [reçu] de conformité signé (/en/api/receipts).

### Diffusion

Réglez `stream: true`. Les cadres sont des objets natifs OpenAI `chat.completion.chunk` terminés par `data: [DONE]`. L'extension `secureai` est attachée au **premier** morceau. `choices` (y compris les deltas `tool_calls` et `finish_reason`) traversent intacts.

## Erreurs

Les erreurs de ce gestionnaire utilisent l'enveloppe OpenAI :

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

Lorsqu'une chaîne de redondance entière échoue, l'erreur utilise `code: "all_models_failed"` et l'état `429` (toutes les limites de débit) ou `502` (sinon). Les rejets de middleware de sécurité conservent la forme SecureAI `{ "success": false, ... }` ; les deux portent toujours un `message`.

## Connexes

- [Chat Completion](/fr/api/chat/completions) — la surface classique (ajoute RAG).
- [Redondance & Failover](/fr/api/redundancy)
- [API Prompt Shield](/fr/api/threat-defense/prompt-shield)