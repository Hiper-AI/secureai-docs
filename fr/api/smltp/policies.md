---
id: policies
title: "Politiques SMLTP"
sidebar_label: "Politiques SMLTP"
description: "Récupérer toutes les politiques de sécurité SMLTP"
openapi: "GET /smltp-policies/all"
---
# Politiques SMLTP

Récupérez toutes les politiques de sécurité SMLTP (Secure Model Language Transfer Protocol) disponibles.

## Point de terminaison

```
GET /smltp-policies/all
```

## Description

Récupérez toutes les stratégies SMLTP disponibles, y compris les stratégies intégrées et personnalisées. **Accès administrateur uniquement requis.**

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
❌ Aucun paramètre de requête pris en charge - l'API actuelle n'accepte aucun paramètre de requête.

## Exemple de demande

```bash
GET /smltp-policies/all
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `data` | objet | Objet de données de réponse |
| `data.builtInPolicies` | tableau | Tableau d'objets de stratégie intégrés |
| `data.customPolicies` | tableau | Tableau d'objets de stratégie personnalisés |
| `data.activePolicyTemplate` | chaîne | ID du modèle de stratégie actuellement actif |
| `data.summary` | objet | Statistiques récapitulatives |
| `data.summary.totalPolicies` | entier | Nombre total de polices |
| `data.summary.builtInCount` | entier | Nombre de stratégies intégrées |
| `data.summary.customCount` | entier | Nombre de stratégies personnalisées |

## Exemple d'utilisation

###JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

###Python

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
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

## Champs d'objet de stratégie

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `id` | chaîne | Identificateur de politique |
| `name` | chaîne | Nom de la politique |
| `type` | chaîne | Type de stratégie ("intégrée" ou "personnalisée") |
| `description` | chaîne | Description de la politique |
| `isActive` | booléen | Si cette politique est actuellement active |
| `createdAt` | chaîne | Horodatage de création (stratégies personnalisées uniquement) |

## Cas d'utilisation

- **Policy Discovery** : recherchez les politiques de sécurité disponibles
- **Planification de la conformité** : comprendre les exigences de la politique
- **Configuration de la sécurité** : sélectionnez les politiques appropriées
- **Gestion active des politiques** : vérifiez quelle politique est actuellement active
- **Intégration** : appliquez des politiques aux fins de chat

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Ce point de terminaison nécessite des privilèges d'administrateur
- Aucun paramètre : aucun paramètre de requête n'est pris en charge
- Politiques intégrées : renvoie les politiques système prédéfinies
- Politiques personnalisées : renvoie les politiques personnalisées s'il en existe
- Politique active : indique quel modèle de politique est actuellement actif
- Réponse plate : la réponse est imbriquée sous l'objet de données