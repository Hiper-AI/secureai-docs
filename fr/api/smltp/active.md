---
id: active
title: "Politiques SMLTP actives"
sidebar_label: "Politiques SMLTP actives"
description: "Récupérer les stratégies SMLTP actuellement actives"
openapi: "GET /smltp-policies/active"
---
# Politiques SMLTP actives

Récupérez les politiques SMLTP (Secure Model Language Transfer Protocol) actuellement actives pour votre compte.

## Point de terminaison

```
GET /smltp-policies/active
```

## Description

Récupérez la configuration de la stratégie SMLTP actuellement active. **Accès administrateur uniquement requis.**

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Exemple de demande

```bash
GET /smltp-policies/active
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `data` | objet | Objet de données de réponse |
| `data.template` | chaîne | ID du modèle de stratégie actuellement actif |
| `data.policy` | objet | Objet de configuration de stratégie actuelle |
| `data.lastUpdated` | chaîne | Horodatage de la dernière mise à jour |

## Exemple d'utilisation

###JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

###Python

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponses d'erreur

### 401 Non autorisé

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 Trop de demandes

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```


## Cas d'utilisation

- **Policy Review** : vérifiez quel modèle de politique est actuellement actif
- **Vérification de la configuration** : examinez la configuration actuelle de la stratégie.
- **Gestion des modèles** : comprenez quel modèle de stratégie est utilisé
- **Dépannage** : comprendre les paramètres de stratégie actuels
- **Préparation de l'audit** : examiner la politique active pour les audits de conformité

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Ce point de terminaison nécessite des privilèges d'administrateur
- Politique unique : renvoie le modèle et la configuration de politique actuellement actifs
- No Arrays : ne renvoie pas un tableau de politiques, uniquement la stratégie active.
- ID du modèle : indique quel modèle de stratégie est actuellement actif
- Policy Config : renvoie l'objet de configuration de politique réel
- Réponse imbriquée : la réponse est imbriquée sous l'objet de données