---
sidebar_position: 1
title: "Achèvement du chat"
openapi: "POST /chat/completions"
---
# Achèvement du chat

Le point de terminaison principal pour les discussions IA avec récupération de base de connaissances (RAG) facultative, redondance/basculement de modèle, politiques de sécurité par appel et streaming.

## Point de terminaison

```
POST /chat/completions
```

## Description

Le point de terminaison principal pour les discussions IA avec récupération facultative de la base de connaissances (RAG). Il prend en charge :

- **Deux formulaires de saisie** — une seule chaîne `prompt` (héritée) **ou** un tableau `messages` de style OpenAI.
- **Redondance du modèle** — une chaîne de basculement définie par l'appelant (primaire + jusqu'à 2 solutions de secours). Voir [Redondance & Failover](/fr/en/api/redundancy).
- **Sécurité par appel** — Sélection de stratégie SMLTP et remplacement du Prompt Shield en ligne.
- **Streaming** — Événements envoyés par le serveur (SSE).
- **Reçus signés** — une référence de reçu de conformité SMLTP sur les réponses acheminées via la passerelle.

<Tip>
**Compatibilité avec le SDK OpenAI**

Si vous souhaitez insérer SecureAI dans une intégration OpenAI existante avec **zéro changement de code**, utilisez plutôt le [point de terminaison compatible OpenAI](/fr/en/api/chat/openai-compatible) sur `/api/external/v1/chat/completions`. Ce point de terminaison classique est le seul à prendre en charge RAG.
</Tip>

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## En-têtes

| En-tête | Obligatoire | Descriptif |
|--------|----------|-------------|
| `Authorization` | Oui | `Bearer sk-...` |
| `Content-Type` | Oui | `application/json` |
| `Idempotency-Key` | Non | Une clé unique qui permet de réessayer un POST de fin en toute sécurité. Répéter une demande avec la même clé renvoie le résultat original au lieu de facturer deux fois. |

## Corps de la demande

### Paramètres d'entrée

Fournissez **soit** `prompt` **ou** `messages` — pas les deux.

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `prompt` | chaîne | Conditionnel | Message de l'utilisateur (ancien formulaire à tour unique). |
| `messages` | tableau | Conditionnel | Tableau de style OpenAI de `{ role, content }`. `role` est `system`, `user` ou `assistant`. Au plus un message `system`, et uniquement comme première entrée. 100 messages maximum, 256 Ko de contenu total. |
| `system_message` | chaîne | Non | Invite système personnalisée (héritée). Ne peut pas être combiné avec un rôle `system` intrabande dans `messages`. |

### Paramètres de modèle et de redondance

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `model` | chaîne | Conditionnel | Modèle d'IA (par exemple `"openai/gpt-5-nano"`). Obligatoire sauf si `models` est fourni. |
| `models` | tableau | Non | Chaîne de basculement explicite (remplace `model`). Jusqu'à 3 entrées distinctes ; chaque entrée est une chaîne de modèle ou `{ model, timeout_ms, first_token_timeout_ms }`. |
| `fallback_models` | tableau | Non | Solutions de secours ajoutées après `model`. Ne peut pas être combiné avec `models`. |
| `redundancy` | objet | Non | Options à l'échelle de la chaîne : `{ timeout_ms, first_token_timeout_ms, on: [...] }`. Voir [Redondance & Failover](/fr/en/api/redundancy). |

### Paramètres de récupération et de génération

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `index` | chaîne | **Oui** | Nom de la base de connaissances à interroger. Utilisez `"Zero-Knowledge"` pour l'IA directe sans RAG. Ce champ est obligatoire — une requête sans `index` renvoie `400 "Index required"`. |
| `use_rag` | booléen | Non | Activer la récupération des connaissances (par défaut : `true`). Le réglage de `use_rag: false` ne supprime **pas** l'exigence de `index` – envoyer `index: "Zero-Knowledge"`. |
| `smltp_policy` | chaîne | Non | Stratégie de sécurité (`"internal"`, `"public"`, `"confidential"` ou une stratégie personnalisée de locataire). |
| `prompt_shield` | objet | Non | Contrôle du bouclier d'invite par appel : `{ enabled?: boolean, policy?: string }`. Voir [API Prompt Shield](/fr/en/api/threat-defense/prompt-shield#per-call-control-on-completions). |
| `temperature` | numéro | Non | Contrôle du caractère aléatoire (0–2, par défaut : 0,7). |
| `max_tokens` | entier | Non | Nombre maximum de jetons de réponse (par défaut : 1 000, plafonné à 4 000). |
| `stream` | booléen | Non | Diffusez la réponse en tant que SSE (par défaut : `false`). |
| `conversation_id` | chaîne | Non | ID de conversation facultatif pour le suivi. |
| `user_id` | chaîne | Non | MongoDB ObjectId de l'utilisateur à qui facturer cette demande (admin-gated ; voir [Billing Modes](/fr/en/api/billing-modes)). |

## Exemple de demande

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-4821-summary" \
  -d '{
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "What is the company policy on remote work?" }
    ],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "redundancy": { "timeout_ms": 30000, "on": ["timeout", "server_error", "rate_limit"] },
    "index": "Zero-Knowledge",
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "id": "req-abc123",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the company's remote work policy..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350,
    "input_tokens": 150,
    "output_tokens": 200
  },
  "metadata": {
    "conversation_id": "conv-123",
    "index_used": "Zero-Knowledge",
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "served_model": "openai/gpt-5-nano",
    "requested_model": "openai/gpt-5-nano",
    "rag_enabled": true,
    "documents_retrieved": 0,
    "sources": []
  }
}
```

### Objet de métadonnées

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `conversation_id` | chaîne | ID de conversation (répercuté ou généré). |
| `index_used` | chaîne | Base de connaissances utilisée. |
| `smltp_policy_used` | chaîne | Nom de la stratégie SMLTP appliquée. |
| `smltp_policy_source` | chaîne | D'où provient la stratégie (`request`, clé par défaut, etc.). |
| `smltp_policy_hash` | chaîne \| nul | Hash de la stratégie appliquée pour vérification. |
| `prompt_shield_policy` | objet \| nul | La politique Prompt Shield s'est appliquée à cet appel, le cas échéant. |
| `served_model` | chaîne | Modèle qui a réellement produit la réponse. |
| `requested_model` | chaîne | Premier modèle de la chaîne demandée. |
| `failover` | objet | **Présent uniquement lors de l'exécution d'une chaîne multimodèle.** `{ occurred, attempts[] }` — voir [Redondance et basculement](/fr/en/api/redundancy). |
| `smltp` | objet | Présent lorsqu’un droit SMLTP est émis pour l’appel. `{ bundle_id, receipt_url }`. Le `bundle_id` (un identifiant de droit, par exemple `jti-…`) est renvoyé même sur les déploiements natifs/directs ; le reçu signé à `receipt_url` n'est récupérable que lorsque le trafic est acheminé via la passerelle SMLTP (sinon [Receipts](/fr/en/api/receipts) renvoie `404`). |
| `rag_enabled` | booléen | Si RAG a été utilisé. |
| `documents_retrieved` | entier | Nombre de documents récupérés. |
| `sources` | tableau | Jusqu'à 3 sources de documents récupérés `{ source, score }`. |

## Diffusion

Définissez `"stream": true` pour recevoir les événements envoyés par le serveur. Chaque ligne SSE est `data: <json>` et le flux se termine par `data: [DONE]`. Les trames sont saisies via un champ `type` :

| Cadre `type` | Charge utile |
|--------------|---------|
| `metadata` | L'enveloppe de réponse (`id`, `object`, `created`, `model` = modèle de diffusion et l'objet `metadata` ci-dessus). Envoyé en premier. |
| `chunk` | Un delta incrémentiel : `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`. |
| `usage` | Utilisation finale du jeton. |
| `error` | Une interruption du fournisseur à mi-parcours (après le premier token, le basculement n'est plus possible). |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 Non autorisé

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Interdit

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429/502 — Chaîne de redondance épuisée

Lorsque chaque modèle d'une chaîne de redondance échoue, la réponse signale chaque tentative. L'état est `429` si tous les échecs étaient des limites de débit, sinon `502`.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 2 model attempt(s) failed (last: anthropic/claude-sonnet-4 — server_error)",
  "request_id": "req-abc123",
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30012 },
    { "model": "anthropic/claude-sonnet-4", "status": "failed", "reason": "server_error", "latency_ms": 812 }
  ]
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Exemple d'utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is the company policy on remote work?' }],
    model: 'openai/gpt-5-nano',
    fallback_models: ['anthropic/claude-sonnet-4'],
    smltp_policy: 'internal',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log('Served by:', data.metadata.served_model);
console.log('Response:', data.choices[0].message.content);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "messages": [{"role": "user", "content": "What is the company policy on remote work?"}],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("Served by:", result["metadata"]["served_model"])
print("Response:", result["choices"][0]["message"]["content"])
```

## Remarques

- `index` est requis. Envoyez `index: "Zero-Knowledge"` pour des réponses directes de l'IA sans RAG.
- Le paramètre `user_id` facture la requête à un autre compte utilisateur (admin-gated).
- La température est fixée à 0–2 ; `max_tokens` est plafonné à 4 000.
- Pour valider une demande par rapport à chaque politique **sans** appeler un modèle ou dépenser des points, utilisez [Policy Check](/fr/en/api/policy-check).
- Pour la sémantique de la chaîne de basculement (déclencheurs, délais d'attente, comportement de streaming, codes d'état d'épuisement), voir [Redondance & Failover](/fr/en/api/redundancy).