---
id: create
title: "Créer une stratégie SMLTP"
sidebar_label: "Créer une stratégie SMLTP"
description: "Créer une nouvelle politique de sécurité SMLTP"
openapi: "POST /smltp-policies/active"
---
# Créer une politique SMLTP

Créez une nouvelle politique de sécurité SMLTP (Secure Model Language Transfer Protocol) pour votre compte.

## Point de terminaison

```
POST /smltp-policies
```

## Description

Créez une nouvelle stratégie SMLTP personnalisée. Accès administrateur uniquement requis.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Oui | Nom de la politique |
| `description` | chaîne | Oui | Description de la politique |
| `policy` | objet | Oui | Objet de configuration de stratégie |
| `setAsActive` | booléen | Non | S'il faut définir cette stratégie comme active immédiatement (par défaut : false) |

## Exemple de demande

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## Réponse réussie

**Code d'état** : `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `message` | chaîne | Message de réussite |
| `policy` | objet | Objet de stratégie créé |
| `policy.id` | chaîne | Identificateur de stratégie (généré à partir du nom) |
| `policy.name` | chaîne | Nom de la politique |
| `policy.description` | chaîne | Description de la politique |
| `policy.type` | chaîne | Type de stratégie (« personnalisé ») |
| `policy.isActive` | booléen | Si la stratégie est actuellement active |
| `policy.createdAt` | chaîne | Horodatage de création |

## Exemple d'utilisation

###JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

###Python

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

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

### 403 Interdit

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 Conflit

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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

- **Sécurité personnalisée** : créez des politiques adaptées à vos besoins
- **Conformité** : mettre en œuvre des exigences réglementaires spécifiques
- **Gestion des risques** : définir des mesures de sécurité pour atténuer les risques
- **Protection des données** : Établir des règles de confidentialité et de traitement des données
- **Gestion des politiques** : créez et gérez des politiques SMLTP personnalisées

## Limites de taux

- **Par défaut** : 50 requêtes par minute
- **Quotidien** : 5 000 requêtes par jour
- **Mensuel** : 150 000 demandes par mois

## Remarques

- Ce point de terminaison nécessite des privilèges d'administrateur
- Champs obligatoires : le nom, la description et la politique sont obligatoires
- ID de stratégie : généré à partir du nom (minuscules, tirets pour les espaces)
- Noms uniques : les noms de stratégie doivent être uniques
- Définir actif : peut éventuellement être défini comme actif immédiatement
- Réponse plate : la réponse n'est pas imbriquée sous l'objet de données