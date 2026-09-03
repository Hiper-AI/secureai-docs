---
title: "Clés API du mode de facturation"
---
# Clés API du mode de facturation

SecureAI prend en charge deux modes de facturation distincts pour les clés API, permettant aux administrateurs de contrôler la façon dont l'utilisation est suivie et facturée pour différentes intégrations d'API.

## Aperçu

Les clés API peuvent être configurées avec l'un des deux modes de facturation suivants :

- ** Achèvements par l'utilisateur ** : déduit du seau d'achèvement de licence de l'utilisateur.
- **Utilisation par modèle** : frais sur la carte de crédit de l'utilisateur en fonction de l'utilisation réelle du modèle

## Modes de facturation

### Mode de complétion utilisateur

**Mode par défaut** : les clés API utilisent ce mode par défaut.

#### Comment ça marche
- Déduit les achèvements du quota de licence mensuel de l'utilisateur
- Utilise les mêmes limites d'achèvement que l'interface Web
- Aucun frais supplémentaire au-delà de la licence existante de l'utilisateur
- Revient à l'utilisation par modèle si aucun quota n'est disponible et que l'utilisation par modèle est activée pour l'utilisateur.

#### Cas d'utilisation
- Applications internes dans lesquelles vous souhaitez utiliser les allocations de licences existantes
- Environnements de développement et de tests
- Applications pour lesquelles vous souhaitez des coûts prévisibles et fixes
- Lorsque vous souhaitez rester dans les limites de licence existantes

####Configuration
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### Utilisation par mode modèle

**Mode avancé** - Nécessite une configuration explicite et l'autorisation de l'utilisateur.

#### Comment ça marche
- Frais basés sur l'utilisation réelle du jeton et les coûts du modèle
- Suit les jetons d'entrée, les jetons de sortie et le total des jetons
- Calcule les coûts en fonction de la tarification spécifique au modèle
- Nécessite que l'utilisateur ait activé l'utilisation par modèle dans son compte
- A des limites mensuelles configurables

#### Cas d'utilisation
- Applications à grand volume pour lesquelles vous avez besoin d'un suivi précis des coûts
- Applications utilisant des modèles plus coûteux (GPT-5.x, Claude Opus/Sonnet, etc.)
- Lorsque vous avez besoin d'analyses d'utilisation détaillées
- Applications pour lesquelles vous souhaitez payer uniquement pour ce que vous utilisez

####Configuration
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## Création de clé API

### Création de clés API avec modes de facturation

Créez et configurez des clés API à partir du panneau d'administration SecureAI.

1. Accédez à `Admin -> API Keys`.
2. Créez ou modifiez une clé API.
3. Réglez `billingMode` sur `user-completions` ou `usage-by-model`.
4. Configurez les limites, les modèles autorisés, les index autorisés et les stratégies SMLTP autorisées.

### Validation du mode de facturation

Le système valide les exigences du mode de facturation :

- **Mode Utilisation par modèle** : nécessite que l'utilisateur ait activé l'utilisation par modèle.
- **Mode de complétion utilisateur** : fonctionne avec n'importe quel utilisateur, mais peut revenir à l'utilisation par modèle si aucun quota n'est disponible.

## Suivi de l'utilisation

### Suivi des achèvements des utilisateurs

Pour le mode Complétions utilisateur, le système suit :
- Comptes d'achèvement quotidiens et mensuels
- Statistiques d'utilisation spécifiques au modèle
- Consommation et limites des quotas

### Utilisation par suivi de modèle

Pour le mode Utilisation par modèle, le système suit :
- Jetons d'entrée, jetons de sortie et jetons totaux
- Coûts et points spécifiques au modèle
- Dépenses mensuelles en dollars
- Analyses d'utilisation détaillées

## Exemples de réponses API

### Réponse du mode d'achèvement de l'utilisateur

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### Utilisation par réponse en mode modèle

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## Gestion des erreurs

### Utilisation par modèle non activée

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### Quota dépassé (achèvements par l'utilisateur)

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### Budget dépassé (utilisation par modèle)

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## meilleures pratiques

### Choisir le bon mode de facturation

1. **Utilisez les complétions utilisateur lorsque :**
   - Vous voulez des coûts prévisibles
   - Vous respectez les limites de licence existantes
   - Vous construisez des outils internes
   - Vous souhaitez utiliser les allocations de quotas existantes

2. **Utilisez Utilisation par modèle lorsque :**
   - Vous avez besoin d'un suivi détaillé des coûts
   - Vous utilisez fréquemment des modèles coûteux
   - Vous souhaitez payer uniquement pour l'utilisation réelle
   - Vous avez besoin d'analyses d'utilisation granulaires

### Recommandations de configuration

1. **Fixez des limites appropriées :**
   - Limites quotidiennes pour le contrôle des tarifs
   - Limites mensuelles pour le contrôle des coûts
   - Limites en dollars pour le mode Utilisation par modèle

2. **Utilisation du moniteur :**
   - Suivez régulièrement l'utilisation des clés API
   - Configurer des alertes à l'approche des limites
   - Examiner les modèles d'utilisation mensuellement

3. **Considérations de sécurité :**
   - Utiliser les restrictions IP pour les applications sensibles
   - Faites pivoter régulièrement les clés API
   - Surveiller les modèles d'utilisation inhabituels

## Mécanisme de repli

### Achèvements des utilisateurs vers utilisation par modèle de secours

Lorsqu'une clé API de complétion par l'utilisateur rencontre un épuisement de quota, le système revient automatiquement à Utilisation par modèle si :

1. **L'utilisateur a activé l'utilisation par modèle** dans les paramètres de son compte
2. **L'utilisateur dispose d'un budget disponible** dans son allocation d'utilisation par modèle
3. **La clé API permet le repli** (comportement par défaut)

#### Processus de secours

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### Logique de validation

#### Utilisation par exigences de modèle

Le système valide les éléments suivants avant d'autoriser la facturation de l'utilisation par modèle :

1. **Paramètres du compte utilisateur** : l'utilisateur doit avoir activé « Utilisation par modèle »
2. **Budget mensuel** : l'utilisateur doit disposer d'un budget disponible dans son allocation
3. **Configuration de la clé API** : la clé API doit être configurée pour l'utilisation par modèle ou autoriser le repli
4. **Accès au modèle** : l'utilisateur doit avoir accès au modèle demandé

#### Scénarios de facturation mixtes

Lorsque plusieurs clés API avec différents modes de facturation sont utilisées :

- Les **clés de complétion utilisateur** sont consommées à partir du quota mensuel de l'utilisateur.
- **L'utilisation par clés de modèle** consomme à partir de l'allocation budgétaire de l'utilisateur.
- **Les scénarios de secours** donnent la priorité aux achèvements par l'utilisateur en premier, puis à l'utilisation par modèle.
- **L'épuisement du quota** déclenche un repli automatique si disponible

## Migration entre les modes

### Des complétions utilisateur à l'utilisation par modèle

1. **Activer l'utilisation par modèle** : assurez-vous que l'utilisation par modèle est activée dans son compte.
2. **Mettre à jour la clé API** : modifiez le mode de facturation dans la configuration de la clé API
3. **Définir des limites budgétaires** : configurez des limites mensuelles appropriées en dollars
4. **Surveiller l'utilisation** : suivez à la fois l'utilisation de l'achèvement et la consommation du budget.
5. **Test de secours** : vérifiez que le comportement de secours fonctionne correctement

### De l'utilisation par modèle aux complétions utilisateur

1. **Vérifier le quota** : assurez-vous que l'utilisateur dispose d'un quota d'achèvement mensuel suffisant
2. **Mettre à jour la clé API** : modifiez le mode de facturation dans la configuration de la clé API
3. **Surveiller l'utilisation** : suivez la consommation d'achèvement par rapport aux limites mensuelles
4. **Configurer le repli** : configurez le repli vers l'utilisation par modèle si le quota est épuisé.
5. **Tester les limites** : vérifiez que les limites de quota sont correctement appliquées

### Bonnes pratiques de migration

- **Migration progressive** : testez d'abord avec des clés API à faible volume
- **Surveiller les deux mesures** : suivez à la fois l'utilisation de l'achèvement et la consommation du budget
- **Définir des limites appropriées** : configurez des limites réalistes pour les deux modes
- **Modifications du document** : gardez une trace des modifications du mode de facturation à des fins d'audit
- **Communication utilisateur** : Informez les utilisateurs des changements de mode de facturation et de leurs implications

## Surveillance et analyses

### Analyse d'utilisation

Le système fournit des analyses détaillées pour les deux modes de facturation :

- **Achèvements utilisateur** : nombre d'achèvements, utilisation des quotas, distribution du modèle
- **Utilisation par modèle** : nombre de jetons, coûts, analyses spécifiques au modèle

### Intégration du panneau d'administration

Le panneau d'administration fournit :
- Surveillance de l'utilisation en temps réel
- Configuration du mode de facturation
- Analyses et rapports d'utilisation
- Suivi des coûts et alertes

## Dépannage

### Problèmes courants

1. **L'utilisation par modèle ne fonctionne pas :**
   - Vérifiez que l'utilisateur a activé l'utilisation par modèle.
   - Vérifiez les limites mensuelles en dollars
   - Assurer un accès approprié au modèle

2. **Problèmes de quota d'achèvements par les utilisateurs :**
   - Vérifiez le niveau de licence de l'utilisateur
   - Vérifier les limites d'achèvement mensuelles
   - Envisagez d'activer l'utilisation par modèle comme solution de secours

3. **Erreurs d'authentification par clé API :**
   - Vérifiez que la clé API est active
   - Vérifiez les restrictions IP
   - Assurer les autorisations appropriées

### Assistance

Pour les problèmes liés aux modes de facturation :
1. Vérifiez le panneau d'administration pour les statistiques d'utilisation
2. Vérifiez la configuration de la clé API
3. Contactez l'administrateur système pour les changements de mode de facturation
4. Surveillez les journaux pour obtenir des informations détaillées sur les erreurs