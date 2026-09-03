---
title: "Redondance et basculement"
sidebar_label: "Redondance et basculement"
description: "Chaînes de basculement de modèle définies par l'appelant pour l'API SecureAI Completions"
---
# Redondance et basculement

L'API Completions peut automatiquement **basculer** d'un modèle à un autre lorsqu'un appel de fournisseur échoue. Vous définissez une chaîne ordonnée (un modèle principal et jusqu'à deux solutions de secours) et SecureAI les essaie tour à tour jusqu'à ce que l'un d'entre eux réussisse. Cela vous donne une résilience contre les pannes de fournisseur, les limites de débit et les délais d'attente sans aucune logique de nouvelle tentative dans votre propre code.

La redondance est disponible à la fois sur le point de terminaison [classique `/chat/completions`](/api/chat/completions) et sur le point de terminaison [compatible OpenAI `/v1/chat/completions`](/api/chat/openai-compatible).

## Comment une chaîne est définie

Il existe trois manières de demander une chaîne, par ordre de priorité :

| # | Vous envoyez | Chaîne résultante |
|---|----------|-----------------|
| 1 | `models: ["a", "b", "c"]` | Exactement cette chaîne (remplace `model`). |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`. |
| 3 | `model: "a"` seul | Utilise le `failoverDefaults` configuré par l'administrateur de la clé API si `a` y apparaît (la chaîne commence à la position de `a`) ; sinon une seule tentative. |

Une chaîne peut contenir **au maximum 3 modèles distincts**. Les entrées en double sont réduites. Chaque entrée de chaîne peut être une chaîne de modèle simple ou un objet avec des délais d'attente par tentative :

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

Vous ne pouvez pas combiner `models` et `fallback_models` dans la même requête.

## Options à l'échelle de la chaîne (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

| Champ | Gamme | Descriptif |
|-------|-------|-------------|
| `timeout_ms` | 1 000 à 300 000 | Délai d'expiration global par tentative. |
| `first_token_timeout_ms` | 500 à 60 000 | Pour le streaming : combien de temps attendre le premier jeton de contenu avant de basculer. |
| `on` | sous-ensemble des déclencheurs ci-dessous | Quelles classes de défaillance déclenchent le basculement. La valeur par défaut est les quatre. |

Les délais d'attente par tentative (définis dans une entrée `models[]`) remplacent les valeurs à l'échelle de la chaîne pour cette tentative.

## Déclencheurs de basculement

Une tentative échouée est classée dans l'une de ces raisons ; le basculement ne se produit que si la raison figure dans votre liste `on` **et** qu'il reste un autre modèle dans la chaîne :

| Raison | Parce que |
|--------|-------|
| `connection_error` | Connexion refusée/réinitialisation, échec DNS/récupération. |
| `server_error` | Le fournisseur a renvoyé HTTP 5xx. |
| `rate_limit` | Le fournisseur a renvoyé HTTP 429. |
| `timeout` | La tentative a dépassé `timeout_ms` (ou `first_token_timeout_ms` lors de la diffusion). |

Les échecs qui ne peuvent **pas** être réessayés ne déclenchent jamais de basculement – par exemple un blocage intentionnel de limite de débit/budget de jeton de passerelle, un disjoncteur ouvert ou un rejet de politique/validation. Un repli échouerait de la même manière ou le blocage serait délibéré.

## Comportement du streaming

Pour les demandes de streaming, **le basculement n'est possible qu'avant l'arrivée du premier jeton de contenu.** SecureAI extrait le flux en amont jusqu'au premier jeton (délimité par `first_token_timeout_ms`) ; si cela échoue, il passe au modèle suivant. Une fois que le premier jeton a été envoyé à votre client, le modèle de service est verrouillé : une interruption ultérieure à mi-flux apparaît comme une trame `error`, et non comme un basculement.

## Ce que vous obtenez en retour

Lorsqu'une chaîne multimodèle s'exécute, la réponse inclut un **rapport de basculement** :

- Point de terminaison classique : `metadata.failover`
- Point de terminaison compatible OpenAI : `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` vous indique quel modèle a réellement répondu, et `requested_model` est le premier modèle de la chaîne. Une demande à modèle unique (héritée) ne produit aucun rapport de basculement.

## Quand toute la chaîne échoue

Si chaque tentative échoue, la requête renvoie une erreur répertoriant toutes les tentatives :

- **429** si *chaque* échec était une limite de débit.
- **502** sinon.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

Sur le point de terminaison compatible OpenAI, la même condition renvoie l'enveloppe d'erreur OpenAI avec `code: "all_models_failed"`.

## Paramètres par défaut de l'administrateur (`failoverDefaults`)

Un administrateur peut attacher une chaîne par défaut à une clé API afin que les appelants bénéficient d'un basculement sans envoyer de chaîne à chaque demande. Configurée dans **Admin → Clés API**, la charge utile est validée et bloquée :

- `models` : jusqu'à 3 noms de modèles distincts.
- `timeout_ms` : 1 000 à 300 000.
- `first_token_timeout_ms` : 500 à 60 000.
- `on` : n'importe quel sous-ensemble des quatre déclencheurs.

Lorsqu'un appelant envoie uniquement `model: "a"` et que `a` est présent dans `failoverDefaults.models`, la chaîne commence à la position de `a` et continue jusqu'aux valeurs par défaut restantes.

## Sécurité et facturation par tentative

Chaque tentative est un appel complet et indépendant via le wrapper SMLTP : application des politiques, gouvernance de sortie/résidence et création du jeton de droit signé, tous réexécutés par tentative, liés au modèle de cette tentative et aux octets exacts de la requête. La facturation reflète le modèle qui a réellement servi la réponse. Chaque basculement émet également un événement de sécurité `api:model_failover` (délivré à tout [webhooks](/fr/en/api/webhooks/overview) abonné) et une entrée de journal d'audit.

## Connexes

- [Achèvement du chat](/fr/en/api/chat/completions)
- [Point de terminaison compatible OpenAI](/fr/en/api/chat/openai-compatible)
- [Policy Check](/fr/en/api/policy-check) — prévisualisez l'accès à toute la chaîne sans dépenser de points.
- [Webhooks](/fr/en/api/webhooks/overview) — abonnez-vous à `api:model_failover`.