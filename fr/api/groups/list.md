---
id: list
title: "Liste des groupes"
sidebar_label: "Liste des groupes"
description: "Récupérer tous les groupes d'utilisateurs"
openapi: "GET /groups"
---
# Liste des groupes

Récupérez une liste de tous les groupes d'utilisateurs du système avec des options de pagination et de filtrage.

## Point de terminaison

```
GET /groups
```

## Description

Ce point de terminaison renvoie tous les groupes d'utilisateurs disponibles dans le système SecureAI. Il fournit des informations détaillées sur chaque groupe, notamment les membres, les autorisations et les métadonnées. Ceci est utile pour gérer l’accès des utilisateurs et la structure organisationnelle.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `page` | entier | Non | 1 | Numéro de page pour la pagination |
| `limit` | entier | Non | 20 | Nombre de groupes par page (1-100) |
| `search` | chaîne | Non | - | Terme de recherche pour le nom ou la description du groupe |
| `status` | chaîne | Non | - | Filtrer par statut de groupe |
| `sortBy` | chaîne | Non | créé à | Champ à trier par |
| `sortOrder` | chaîne | Non | desc | Ordre de tri (asc, desc) |

## Exemple de demande

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `groups[]` | tableau | Tableau d'objets de groupe |
| `groups[].id` | chaîne | Identifiant unique du groupe |
| `groups[].name` | chaîne | Nom du groupe |
| `groups[].description` | chaîne | Description du groupe |
| `groups[].status` | chaîne | Statut du groupe |
| `groups[].userCount` | entier | Nombre d'utilisateurs dans le groupe |
| `groups[].users` | tableau | Tableau d'objets utilisateur dans le groupe |
| `groups[].users[].id` | chaîne | Identifiant utilisateur |
| `groups[].users[].name` | chaîne | Nom d'utilisateur |
| `groups[].users[].email` | chaîne | E-mail de l'utilisateur |
| `groups[].createdAt` | chaîne | Horodatage de création |
| `pagination` | objet | Informations sur la pagination |

## Exemple d'utilisation

###JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

###Python

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

### Groupes de recherche

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### Options de tri

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### Pagination

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## Cas d'utilisation

- **Gestion des groupes** : répertoriez tous les groupes à des fins administratives
- **Organisation des utilisateurs** : découvrez les groupes disponibles pour l'affectation des utilisateurs
- **Contrôle d'accès** : vérifiez les autorisations du groupe et le nombre de membres
- **Reporting** : Générez des rapports sur la structure et l'adhésion du groupe
- **Intégration** : découvrez des groupes pour l'intégration d'applications

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Ce point de terminaison n'est accessible que par les administrateurs
- Pagination : utilise le paramètre de page, pas le décalage
- Réponse plate : la réponse n'est pas imbriquée sous l'objet de données
- Détails de l'utilisateur : comprend des informations utilisateur complètes pour chaque membre du groupe
- Filtre de statut : peut filtrer par statut de groupe
- La fonctionnalité de recherche fonctionne sur les noms et descriptions de groupes
- Les options de tri aident à organiser les résultats selon différents critères