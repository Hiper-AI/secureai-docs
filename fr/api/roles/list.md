---
id: list
title: "Répertorier les rôles"
sidebar_label: "Répertorier les rôles"
description: "Récupérer tous les rôles d'utilisateur disponibles"
openapi: "GET /roles"
---
# Liste des rôles

Récupérez tous les rôles d'utilisateur disponibles dans le système SecureAI.

## Point de terminaison

```
GET /roles
```

## Description

Ce point de terminaison renvoie tous les rôles d'utilisateur disponibles dans le système SecureAI. Il fournit des informations détaillées sur chaque rôle, notamment les autorisations, les descriptions et les métadonnées. Ceci est utile pour comprendre les rôles disponibles et leurs capacités.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `page` | entier | Non | 1 | Numéro de page pour la pagination (par défaut : 1) |
| `limit` | entier | Non | 20 | Nombre de rôles par page (par défaut : 20) |
| `search` | chaîne | Non | - | Terme de recherche pour le nom, le nom d'affichage ou la description |
| `isSystem` | chaîne | Non | - | Filtrer par rôles système (vrai/faux) |
| `sortBy` | chaîne | Non | créé à | Champ de tri (par défaut : "createdAt") |
| `sortOrder` | chaîne | Non | desc | Ordre de tri (asc/desc, par défaut : "desc") |

## Exemple de demande

```bash
GET /roles?page=1&limit=10&search=admin
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `roles` | tableau | Tableau d'objets de rôle |
| `roles[].id` | chaîne | Identificateur de rôle unique |
| `roles[].name` | chaîne | Nom du rôle |
| `roles[].displayName` | chaîne | Nom d'affichage du rôle |
| `roles[].description` | chaîne | Description du rôle |
| `roles[].isSystem` | booléen | S'il s'agit d'un rôle système |
| `roles[].hasAdminPanelAccess` | booléen | Indique si le rôle a accès au panneau d'administration |
| `roles[].permissions` | tableau | Tableau d'objets d'autorisation |
| `roles[].permissions[].section` | chaîne | Section autorisations |
| `roles[].permissions[].level` | chaîne | Niveau d'autorisation |
| `roles[].canInteractWithAI` | booléen | Si le rôle peut interagir avec l'IA |
| `roles[].canUseChat` | booléen | Indique si le rôle peut utiliser le chat |
| `roles[].userCount` | entier | Nombre d'utilisateurs avec ce rôle |
| `roles[].createdBy` | objet | Utilisateur qui a créé le rôle |
| `roles[].createdBy.id` | chaîne | ID utilisateur du créateur |
| `roles[].createdBy.name` | chaîne | Nom du créateur |
| `roles[].createdBy.email` | chaîne | E-mail du créateur |
| `roles[].createdAt` | chaîne | Horodatage de création |
| `roles[].updatedAt` | chaîne | Horodatage de la dernière mise à jour |
| `pagination` | objet | Informations sur la pagination |
| `pagination.page` | entier | Numéro de page actuel |
| `pagination.limit` | entier | Articles par page |
| `pagination.total` | entier | Nombre total de rôles |
| `pagination.pages` | entier | Nombre total de pages |

## Exemple d'utilisation

###JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

###Python

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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


## Cas d'utilisation

- **Gestion des rôles** : répertoriez tous les rôles disponibles pour l'attribution des utilisateurs
- **Révision des autorisations** : comprenez les autorisations dont dispose chaque rôle
- **Contrôle d'accès** : planifiez l'accès des utilisateurs en fonction des rôles disponibles
- **Affectation des utilisateurs** : attribuez des rôles aux utilisateurs en fonction de leurs besoins
- **Analyse des rôles** : analysez l'utilisation des rôles et la répartition des utilisateurs

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Ce point de terminaison nécessite des privilèges d'administrateur
- Pagination basée sur la page : utilise le paramètre de page, pas le décalage
- Rechercher : recherche dans les champs de nom, displayName et de description
- Rôles système : peut filtrer par rôles système ou personnalisés
- Tri : peut trier selon n'importe quel champ par ordre croissant ou décroissant
- Réponse plate : la réponse n'est pas imbriquée sous l'objet de données
- Nombre d'utilisateurs : indique combien d'utilisateurs ont chaque rôle
- Informations sur le créateur : indique qui a créé chaque rôle