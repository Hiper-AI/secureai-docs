---
id: create
title: "Créer un groupe"
sidebar_label: "Créer un groupe"
description: "Créer un nouveau groupe d'utilisateurs"
openapi: "POST /groups"
---
# Créer un groupe

Créez un nouveau groupe d'utilisateurs pour organiser les utilisateurs et gérer les autorisations d'accès.

## Point de terminaison

```
POST /groups
```

## Description

Ce point de terminaison permet aux administrateurs de créer de nouveaux groupes d'utilisateurs. Les groupes sont utilisés pour organiser les utilisateurs, gérer les autorisations et contrôler l'accès aux différentes parties du système. Vous pouvez spécifier le nom du groupe, la description et les métadonnées lors de la création.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Oui | Nom du groupe |
| `description` | chaîne | Oui | Description du groupe |
| `users` | tableau | Non | Tableau d'ID utilisateur à ajouter au groupe |
| `status` | chaîne | Non | Statut du groupe (par défaut "Actif") |

## Exemple de demande

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## Réponse réussie

**Code d'état** : `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `message` | chaîne | Message de réussite |
| `group` | objet | Objet de groupe créé |
| `group.id` | chaîne | Identifiant unique du groupe |
| `group.name` | chaîne | Nom du groupe |
| `group.description` | chaîne | Description du groupe |
| `group.status` | chaîne | Statut du groupe |
| `group.userCount` | entier | Nombre d'utilisateurs dans le groupe |
| `group.users` | tableau | Tableau d'objets utilisateur dans le groupe |
| `group.users[].id` | chaîne | Identifiant utilisateur |
| `group.users[].name` | chaîne | Nom d'utilisateur |
| `group.users[].email` | chaîne | E-mail de l'utilisateur |
| `group.createdAt` | chaîne | Horodatage de création |

## Exemple d'utilisation

###JavaScript

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

###Python

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name is required",
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
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

- **Organisation des utilisateurs** : créez des groupes pour organiser les utilisateurs par service ou par fonction.
- **Contrôle d'accès** : créez des groupes pour gérer les autorisations et les accès
- **Gestion d'équipe** : créez des groupes pour différentes équipes ou projets
- **Reporting** : organisez les utilisateurs pour le reporting et l'analyse
- **Intégration** : créez des groupes pour l'intégration de systèmes tiers

## Limites de taux

- **Par défaut** : 50 requêtes par minute
- **Quotidien** : 5 000 requêtes par jour
- **Mensuel** : 150 000 demandes par mois

## Remarques

- Ce point de terminaison n'est accessible que par les administrateurs
- Champs obligatoires : le nom et la description sont obligatoires
- Affectation d'utilisateur : peut attribuer des utilisateurs au groupe lors de la création
- Statut : Par défaut, "Actif" si non spécifié
- Validation : les identifiants des utilisateurs sont validés avant l'attribution
- Réponse plate : la réponse n'est pas imbriquée sous l'objet de données
- Le groupe est immédiatement disponible pour utilisation après sa création