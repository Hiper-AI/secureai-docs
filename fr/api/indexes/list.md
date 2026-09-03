---
id: list
title: "Répertorier tous les index"
sidebar_label: "Répertorier tous les index"
description: "Récupérer tous les index de la base de connaissances disponibles"
openapi: "GET /indexes/all"
---
# Liste tous les index

Récupérez une liste complète de tous les index de base de connaissances disponibles dans le système.

## Point de terminaison

```
GET /indexes/all
```

## Description

Ce point de terminaison renvoie tous les index de la base de connaissances disponibles dans le système SecureAI. Il fournit des informations détaillées sur chaque index, notamment son type, son statut, sa date de création et ses métadonnées. Ceci est utile pour découvrir les bases de connaissances disponibles et leurs capacités.

## Authentification

**Obligatoire** : clé API

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `page` | entier | Non | 1 | Numéro de page pour la pagination |
| `limit` | entier | Non | 50 | Nombre d'index par page (1-100) |
| `search` | chaîne | Non | - | Terme de recherche pour le nom d'index ou le nom d'index partagé |
| `type` | chaîne | Non | - | Filtrer par type d'index (personnel, général, groupe) |
| `status` | chaîne | Non | actif | Filtrer par statut d'index (actif, supprimé, tous) |
| `sortBy` | chaîne | Non | créé à | Champ à trier par |
| `sortOrder` | chaîne | Non | desc | Ordre de tri (asc, desc) |

## Exemple de demande

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "indexes": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "my-knowledge-base",
      "sharedIndexName": "my-knowledge-base",
      "namespace": "user-namespace",
      "type": "personal",
      "assignedUser": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedGroup": null,
      "userId": "60a7c8f5e8b4f5001f7a8c24",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `indexes[]` | tableau | Tableau d'objets d'index |
| `indexes[].id` | chaîne | Identificateur d'index unique |
| `indexes[].name` | chaîne | Nom de l'index |
| `indexes[].sharedIndexName` | chaîne | Nom de l'index partagé |
| `indexes[].namespace` | chaîne | Espace de noms d'index |
| `indexes[].type` | chaîne | Type d'index (personnel, général, groupe, inconnu) |
| `indexes[].assignedUser` | objet | Informations utilisateur attribuées (si personnelles) |
| `indexes[].assignedGroup` | objet | Informations sur le groupe attribué (si groupe) |
| `indexes[].userId` | chaîne | Identifiant utilisateur |
| `indexes[].isActive` | booléen | Si l'index est actif |
| `indexes[].createdAt` | chaîne | Horodatage de création |
| `indexes[].updatedAt` | chaîne | Horodatage de la dernière mise à jour |
| `indexes[].deletedAt` | chaîne | Horodatage de suppression (si supprimé) |
| `pagination` | objet | Informations sur la pagination |

## Types d'index

| Tapez | Descriptif | Accès |
|------|-------------|--------|
| `personal` | Index personnels créés par l'utilisateur | Accès complet pour le propriétaire |
| `general` | Index organisationnels partagés | Varie selon les autorisations |
| `group` | Index attribués au groupe | Membres du groupe |
| `unknown` | Index dont l'affectation n'est pas claire | Varie |

## Statut de l'index

| Statut | Descriptif |
|--------|-------------|
| `active` | L'index est disponible pour utilisation |
| `deleted` | L'index a été supprimé |
| `all` | Inclure à la fois les actifs et les supprimés |

## Exemple d'utilisation

###JavaScript

```javascript
const listIndexes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/indexes/all${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listIndexes({
  type: 'personal',
  limit: 10,
  page: 1
});
console.log(result.indexes);
```

###Python

```python
import requests

def list_indexes(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "type": "personal",
    "limit": 10,
    "page": 1
}

result = list_indexes(params)
print(result["indexes"])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
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

## Exemples de filtrage

### Filtrer par type

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### Filtrer par statut

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### Pagination

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## Cas d'utilisation

- **Découverte** : recherchez les bases de connaissances disponibles pour les opérations RAG
- **Gestion** : Répertorier les index à des fins administratives
- **Intégration** : découvrez des index pour l'intégration d'applications
- **Surveillance** : Vérifiez l'état de l'index et les métadonnées
- **Filtrage** : recherchez des types spécifiques d'index (système, personnel, etc.)

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Ce point de terminaison n'est accessible que par les administrateurs
- Les index personnels ne sont visibles que par leurs propriétaires
- Les index de groupe sont visibles par les membres du groupe
- La réponse comprend les informations attribuées à l'utilisateur et au groupe
- La pagination utilise le paramètre de page, pas le décalage
- Le filtrage par type et statut permet d'affiner les résultats