---
id: update
title: "Mettre à jour le groupe"
sidebar_label: "Mettre à jour le groupe"
description: "Mettre à jour un groupe d'utilisateurs existant"
openapi: "PUT /groups/{groupId}"
---
# Mettre à jour le groupe

Mettez à jour un groupe d'utilisateurs existant avec de nouvelles informations, descriptions ou métadonnées.

## Point de terminaison

```
PUT /groups/{groupId}
```

## Description

Ce point de terminaison permet aux administrateurs de mettre à jour un groupe d'utilisateurs existant. Vous pouvez modifier le nom du groupe, la description, les métadonnées et d'autres propriétés. Le groupe doit exister et vous devez disposer des autorisations appropriées pour le mettre à jour.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres du chemin

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `groupId` | chaîne | Oui | L'identifiant unique du groupe à mettre à jour |

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Non | Nouveau nom pour le groupe |
| `description` | chaîne | Non | Nouvelle description du groupe |
| `users` | tableau | Non | Tableau d'ID utilisateur à attribuer au groupe |
| `status` | chaîne | Non | Statut du groupe |

## Exemple de demande

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "message": "Group updated successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "status": "Active",
    "userCount": 3,
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
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c27",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `message` | chaîne | Message de réussite |
| `group` | objet | Objet de groupe mis à jour |
| `group.id` | chaîne | Identifiant unique du groupe |
| `group.name` | chaîne | Nom du groupe mis à jour |
| `group.description` | chaîne | Description du groupe mise à jour |
| `group.status` | chaîne | Statut du groupe |
| `group.userCount` | entier | Nombre d'utilisateurs dans le groupe |
| `group.users` | tableau | Tableau d'objets utilisateur dans le groupe |
| `group.users[].id` | chaîne | Identifiant utilisateur |
| `group.users[].name` | chaîne | Nom d'utilisateur |
| `group.users[].email` | chaîne | E-mail de l'utilisateur |
| `group.createdAt` | chaîne | Horodatage de création original |
| `group.updatedAt` | chaîne | Horodatage de la dernière mise à jour |

## Exemple d'utilisation

###JavaScript

```javascript
const updateGroup = async (groupId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/groups/${groupId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  return await response.json();
};

// Example usage
const updateData = {
  name: "Updated Engineering Team",
  description: "Updated software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  status: "Active"
};

const result = await updateGroup('60a7c8f5e8b4f5001f7a8c25', updateData);
console.log('Updated group:', result.group);
```

###Python

```python
import requests

def update_group(group_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/groups/{group_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
}

result = update_group("60a7c8f5e8b4f5001f7a8c25", update_data)
print("Updated group:", result["group"])
```

### boucle

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/groups/60a7c8f5e8b4f5001f7a8c25" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
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
    "message": "Group name cannot be empty",
    "details": {
      "field": "name",
      "value": ""
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
    "message": "Cannot update this group"
  }
}
```

### 404 Introuvable

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
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

- **Gestion des groupes** : mettre à jour les informations et les descriptions des groupes
- **Affectation d'utilisateur** : attribuez de nouveaux utilisateurs au groupe
- **Changements de nom** : renommez les groupes pour une meilleure clarté
- **Mises à jour du statut** : modifier le statut du groupe
- **Mises à jour de l'équipe** : mettez à jour les informations du groupe lorsque la structure de l'équipe change

## Limites de taux

- **Par défaut** : 50 requêtes par minute
- **Quotidien** : 5 000 requêtes par jour
- **Mensuel** : 150 000 demandes par mois

## Remarques

- Ce point de terminaison n'est accessible que par les administrateurs
- Mises à jour partielles : n'incluez que les champs que vous souhaitez modifier
- Affectation d'utilisateur : peut attribuer de nouveaux utilisateurs au groupe
- Validation du nom : les noms de groupe doivent être uniques
- Réponse plate : la réponse n'est pas imbriquée sous l'objet de données
- Validation des utilisateurs : les identifiants des utilisateurs sont validés avant l'attribution
- L'horodatage `updatedAt` est automatiquement mis à jour