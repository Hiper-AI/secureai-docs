---
title: "Référence rapide des modes de facturation"
---
# Référence rapide des modes de facturation

Un guide de comparaison rapide pour choisir entre les modes de facturation Complétions par l'utilisateur et Utilisation par modèle.

## Quick Comparison

| Feature | User Completions | Utilisation par modèle |
|---------|--------|----------------|
| **Default Mode** | ✅ Yes | ❌ No |
| **Cost Structure** | Fixed (license quota) | Variable (per token) |
| **User Permission** | Not required | Must be enabled |
| **Cost Tracking** | Completion counts | Le jeton compte + les coûts |
| **Meilleur pour** | Coûts prévisibles | Utilisation à grand volume |
| **Fallback Support** | ✅ Yes | ❌ Non |

## Quand utiliser chaque mode

### Mode de complétion utilisateur

**Choisissez ceci quand :**
- ✅ Vous souhaitez des coûts prévisibles et fixes
- ✅ Vous respectez les limites de licence existantes
- ✅ Vous construisez des outils internes
- ✅ Vous souhaitez utiliser les allocations de quotas existantes
- ✅ Vous avez besoin d'une gestion simple des coûts

**Exemples de cas d'utilisation :**
- Chatbots internes
- Développement et tests
- Applications à faible volume
- Projets à budget fixe

### Utilisation par mode modèle

**Choisissez ceci quand :**
- ✅ Vous avez besoin d'un suivi détaillé des coûts
- ✅ Vous utilisez fréquemment des modèles coûteux
- ✅ Vous souhaitez payer uniquement pour l'utilisation réelle
- ✅ Vous avez besoin d'analyses d'utilisation granulaires
- ✅ Vous avez des besoins en volume importants

**Exemples de cas d'utilisation :**
-Applications de production
- Services d'IA à grand volume
- Projets sensibles aux coûts
- Applications multimodèles

## Utilisation de l'API

Lors de l'utilisation de l'API externe avec les modes de facturation :

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## Limites de taux

### Limites de débit par défaut
- **Requêtes par minute** : 60 (configurable)
- **Demandes par heure** : 1 000 (configurable)
- **Limites quotidiennes** : 100 requêtes (configurables)
- **Limites mensuelles** : 10 000 requêtes (configurables)

### Limites spécifiques au mode de facturation
- **Réalisations par l'utilisateur** : basé sur le quota de licences
- **Utilisation par modèle** : limites supplémentaires basées sur le dollar

## Intégration des politiques SMLTP

Les deux modes de facturation prennent en charge l'application des politiques SMLTP :

| Politique | Descriptif | Cas d'utilisation |
|--------|-------------|--------------|
| `public` | Pour les données non sensibles | Applications destinées au public |
| `internal` | Pour les données de l'entreprise | Outils et processus internes |
| `confidential` | Pour les informations sensibles | Applications à accès restreint |

### Exemple de configuration SMLTP

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## Exemples de configurations

### Configuration des achèvements utilisateur

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### Utilisation par configuration de modèle

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## Scénarios d'erreur

### Erreurs d'achèvement par l'utilisateur

| Erreur | Parce que | Solutions |
|-------|-------|--------------|
| `Completion limit exceeded` | Quota mensuel atteint | Activer l'utilisation par modèle ou augmenter le quota |
| `Daily limit exceeded` | Limite quotidienne atteinte | Attendre la réinitialisation ou augmenter la limite |
| `User not found` | ID utilisateur invalide | Vérifier que l'utilisateur existe |

### Erreurs d'utilisation par modèle

| Erreur | Parce que | Solutions |
|-------|-------|--------------|
| `Usage by Model required` | L'utilisateur ne l'a pas activé | Activer l'utilisation par modèle pour l'utilisateur |
| `Usage by Model budget exceeded` | Budget mensuel atteint | Augmenter la limite en dollars |
| `Invalid billing mode` | Mode non valide spécifié | Utilisez `"usage-by-model"` ou `"user-completions"` |

## Guide de migration

### Des complétions utilisateur à l'utilisation par modèle

1. **Activer l'utilisation par modèle pour l'utilisateur**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **Mettre à jour la configuration de la clé API**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **Surveiller l'utilisation et les coûts**
   - Suivre l'utilisation des jetons
   - Suivre les dépenses mensuelles
   - Ajuster les limites si nécessaire

### De l'utilisation par modèle aux complétions utilisateur

1. **Vérifiez que l'utilisateur dispose d'un quota suffisant**
   - Vérifier le niveau de licence
   - Vérifier les limites mensuelles

2. **Mettre à jour la configuration de la clé API**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **Surveiller l'utilisation de l'achèvement**
   - Suivre le nombre d'achèvements
   - S'assurer que le comportement de secours fonctionne

## Estimation des coûts

### Coûts de réalisation des utilisateurs

- **Coût fixe** : basé sur le niveau de licence
- **Pas de frais supplémentaires** : au-delà de la licence existante
- **Prévisible** : identique à l'utilisation de l'interface Web

### Utilisation par coûts de modèle

- **Coût variable** : basé sur l'utilisation du jeton
- **Tarif spécifique au modèle** : tarifs différents par modèle
- **Exemples de coûts** :
  - GPT-5.1 : la tarification du fournisseur s'applique
  - Claude Sonnet 4.6 : tarification fournisseur applicable
  - GPT-5 Nano : les tarifs du fournisseur s'appliquent

## Conseils de surveillance

### Surveillance des achèvements des utilisateurs

- Suivre le nombre d'achèvements quotidiennement
- Surveiller la consommation des quotas
- Définir des alertes à l'approche des limites
- Examiner les modèles d'utilisation mensuellement

### Utilisation par la surveillance du modèle

- Suivre l'utilisation et les coûts des jetons
- Suivre les dépenses mensuelles
- Définir des alertes de limite en dollars
- Examiner la répartition des coûts par modèle

## Considérations de sécurité

### Les deux modes

- Utiliser les restrictions IP pour les applications sensibles
- Faites pivoter régulièrement les clés API
- Surveiller les activités inhabituelles
- Mettre en œuvre une gestion appropriée des erreurs

### Utilisation par modèle spécifique

- Fixer des limites monétaires appropriées
- Surveiller les hausses de coûts
- Examiner les modèles d'utilisation du modèle
- Suivre l'utilisation coûteuse des modèles

## Ressources d'assistance

###Documentations
- [Aperçu des modes de facturation](../billing-modes.md)
- [Limites & Quotas](/fr/api/limits-and-quotas) - Comprendre les limites de la plateforme

### Panneau d'administration
- **Section API** : créer et gérer des clés API
- **Section Utilisateurs** : Activer l'utilisation par modèle

### Problèmes courants
1. **L'utilisation par modèle ne fonctionne pas** : vérifiez les autorisations de l'utilisateur
2. **Quota dépassé** : activez l'utilisation par modèle ou augmentez les limites.
3. **Pics de coûts** : examinez l'utilisation du modèle et définissez des limites
4. **Erreurs d'authentification** : vérifiez la clé API et les autorisations