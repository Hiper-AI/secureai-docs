---
sidebar_position: 1
title: "Présentation de l'authentification"
---
#Authentification API

SecureAI utilise l'authentification par clé API pour tous les accès API externes. Les clés sont des jetons Bearer créés et configurés par les administrateurs, avec des contrôles par clé sur les modèles, les politiques, les limites, la facturation et la sécurité.

## En-tête d'authentification

```http
Authorization: Bearer sk-your-api-key-here
```

**Format de clé API :**
- Commence par un préfixe `sk-` (par exemple `sk-8cd5253f...`).
- Le préfixe est suivi d'un secret hexadécimal de 64 caractères.
- Seul un hachage SHA-256 de la clé est stocké côté serveur — la clé complète est affichée **une fois**, lors de la création. Si elle est perdue, faites pivoter/recréez la clé.

Tous les appels API nécessitent HTTPS.

## Création et configuration de clés API

Les administrateurs créent des clés dans **Admin → Clés API** (base API `/api/admin/api-keys`, administrateur uniquement). La clé complète est renvoyée une fois lors de la création. Chaque clé porte la configuration suivante :

### Propriété et facturation

| Paramètre | Descriptif |
|---------|-------------|
| `name` | Étiquette lisible par l'homme. |
| `userId` | Le compte utilisateur auquel cette clé appartient/pour lequel elle est facturée. |
| `billingMode` | `user-completions` (à déduire de l'allocation d'achèvement de l'utilisateur) ou `usage-by-model` (à déduire un budget en dollars par coût du modèle). Voir [Modes de facturation](/fr/en/api/billing-modes). |

Les appelants peuvent facturer une demande individuelle à un utilisateur **différent** avec le paramètre de corps `user_id` (admin-gated).

### Limites

| Paramètre | Descriptif |
|---------|-------------|
| `dailyLimit` | Nombre maximum de requêtes par jour pour cette clé. |
| `monthlyLimit` | Nombre maximum de requêtes par mois pour cette clé. |
| `rateLimit.requestsPerMinute` | Plafond par minute (jusqu'à 1000). |
| `rateLimit.requestsPerHour` | Plafond horaire (jusqu'à 10 000). |
| `expiresAt` | Expiration facultative ; omettre pour une clé qui n’expire pas. |

### Listes autorisées

| Paramètre | Descriptif |
|---------|-------------|
| `allowedModels[]` | Si elle est définie, la clé peut utiliser **uniquement** ces modèles. Vide = le catalogue de licence par défaut. |
| `allowedIndexes[]` | Limite les bases de connaissances que la clé peut interroger. |
| `allowedSMLTPPolicies[]` | Politiques SMLTP que la clé peut demander (par défaut `["public", "internal"]`). Validé par rapport au résolveur de stratégie, les stratégies personnalisées du locataire sont donc autorisées. |

### Bouclier d'invite

| Paramètre | Descriptif |
|---------|-------------|
| `enablePromptShield` | Activez Prompt Shield pour cette clé. |
| `promptShieldSensitivity` | `strict`, `balanced` ou `permissive`. |
| `promptShieldPolicyId` | Liez une stratégie Prompt Shield spécifique à la clé. |
| `allowedPromptShieldPolicies[]` | Politiques que l'appelant peut sélectionner par appel via `prompt_shield.policy`. |

Voir [API Prompt Shield](/fr/en/api/threat-defense/prompt-shield).

### Valeurs par défaut de redondance

`failoverDefaults` attache un modèle par défaut [chaîne de basculement] (/fr/en/api/redundancy) à la clé : `models[]` (jusqu'à 3), `timeout_ms` (1 000 à 300 000), `first_token_timeout_ms` (500 à 60 000) et `on[]` déclencheurs. Les appelants bénéficient alors d’un basculement sans envoyer de chaîne à chaque demande.

## Idempotence

Les `POST` de complétion acceptent un en-tête `Idempotency-Key`. Réessayer avec la même clé renvoie le résultat d'origine au lieu de facturer une seconde fois : utilisez-la pour sécuriser les nouvelles tentatives sur le réseau. Voir [Achèvement du chat](/fr/en/api/chat/completions).

## Limitation du débit

Plafonds par défaut (configurables par touche) :

- **Par minute** : 60 requêtes
- **Par heure** : 1000 requêtes
- **Quotidien** : 100 demandes
- **Mensuel** : 10 000 demandes

Un détenteur de clé peut lire son propre quota et ses limites en direct via [`GET /usage`](/api/usage).

## Fonctionnalités de sécurité

- **HTTPS uniquement** : tous les appels d'API nécessitent TLS.
- **Haché au repos** — seul un hachage SHA-256 de chaque clé est stocké.
- **Suivi de l'utilisation et journalisation d'audit** : chaque appel et événement d'authentification est enregistré.
- **Conformité SMLTP** — les politiques de sécurité sont appliquées à chaque demande.

## Réponses d'erreur

### Erreur d'authentification

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Erreur de limite de débit

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Codes d'erreur courants

| Erreur | Descriptif |
|-------|-------------|
| `Invalid API key` | La clé API n'est pas valide, a expiré ou est révoquée. |
| `Rate limit exceeded: too many requests per minute` | Limite de débit par minute dépassée. |
| `Rate limit exceeded: too many requests per hour` | Limite de tarif horaire dépassée. |
| `Access denied` | Modèle, index ou stratégie non autorisé pour cette clé. |

## Prochaines étapes

- [Référence API](/fr/en/api) — Explorez tous les points de terminaison externes disponibles.
- [Chat Completions](/fr/en/api/chat/completions) — Commencez à intégrer les complétions.
- [OpenAI-Compatible Endpoint](/fr/en/api/chat/openai-compatible) — Réutilisez un SDK OpenAI existant.
- [Usage](/fr/en/api/usage) — Vérifiez le quota et les limites.