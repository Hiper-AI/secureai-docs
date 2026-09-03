---
id: update
title: "Mettre à jour l'index"
sidebar_label: "Mettre à jour l'index"
description: "Mettre à jour un index de base de connaissances existant"
openapi: "PUT /indexes/{indexId}"
---
# Mettre à jour l'index

Mettez à jour un index de base de connaissances existant avec de nouveaux paramètres, métadonnées ou configuration.

## Point de terminaison

```
PUT /indexes/{indexId}
```

## Description

Ce point de terminaison permet aux administrateurs de mettre à jour un index de base de connaissances existant. Vous pouvez modifier le nom de l'index et le réattribuer à différents utilisateurs ou groupes. Seuls les administrateurs peuvent mettre à jour les index.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres du chemin

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `indexId` | chaîne | Oui | L'identifiant unique de l'index à mettre à jour |

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Non | Nouveau nom pour l'index |
| `assignedUser` | chaîne | Non | ID utilisateur auquel attribuer l'index (MongoDB ObjectId) |
| `assignedGroup` | chaîne | Non | ID de groupe auquel attribuer l'index (MongoDB ObjectId) |


## Exemple de demande

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
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
| `index` | objet | Objet d'index mis à jour |
| `index.id` | chaîne | Identificateur d'index unique |
| `index.name` | chaîne | Nom de l'index mis à jour |
| `index.sharedIndexName` | chaîne | Nom de l'index partagé |
| `index.namespace` | chaîne | Espace de noms d'index |
| `index.type` | chaîne | Type d'index (personnel, général, groupe, inconnu) |
| `index.assignedUser` | objet | Informations utilisateur attribuées (si personnelles) |
| `index.assignedGroup` | objet | Informations sur le groupe attribué (si groupe) |
| `index.createdAt` | chaîne | Horodatage de création original |
| `index.updatedAt` | chaîne | Horodatage de la dernière mise à jour |

## Exemple d'utilisation

###JavaScript

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
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
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

###Python

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

### boucle

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## Validations et règles métier

- **Attribution à un utilisateur (`assignedUser`)** :
  - Appliquer le quota d'index utilisateur via `checkUserIndexQuota` lors de la conversion en personnel ou du changement de responsable. Le quota dépassé renvoie 403.
- **Affectation à un groupe (`assignedGroup`)** :
  - Le groupe doit exister et être actif (`status != 'Archived'`) ; les groupes invalides/inactifs renvoient 400.

## Normalisation et stockage

- Lors du changement de nom, `name` continue d'être stocké normalisé ; `sharedIndexName` prend par défaut le nom normalisé s'il n'est pas explicitement défini.

## Formes d'erreur typiques

### 403 Quota d'index dépassé

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
}
```

### 400 Groupe invalide/inactif

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
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
    "message": "Cannot update this index"
  }
}
```

### 404 Introuvable

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
  }
}
```

### 409 Conflit

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
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

## Champs pouvant être mis à jour

| Champ | Descriptif | Remarques |
|-------|-------------|-------|
| `name` | Nom de l'index | Doit être unique dans tout le système |
| `assignedUser` | Affectation des utilisateurs | Attribue un index à un utilisateur spécifique |
| `assignedGroup` | Travail de groupe | Attribue un index à un groupe spécifique |

## Cas d'utilisation

- **Changements de nom** : Renommer les index pour une meilleure organisation
- **Affectation d'utilisateur** : réaffecter des index à différents utilisateurs
- **Affectation de groupe** : réaffecter les index à différents groupes
- **Transfert de propriété** : modifier la propriété de l'index entre les utilisateurs

## Limites de taux

- **Par défaut** : 50 requêtes par minute
- **Quotidien** : 5 000 requêtes par jour
- **Mensuel** : 150 000 demandes par mois

## Remarques

- Ce point de terminaison n'est accessible que par les administrateurs
- Champs limités : seuls le nom, l'utilisateur assigné et le groupe assigné peuvent être mis à jour.
- Logique d'affectation : l'attribution à un utilisateur efface l'affectation de groupe et vice versa
- Validation : les identifiants des utilisateurs et des groupes sont validés avant l'affectation
- Aucun paramètre : impossible de mettre à jour les paramètres, les métadonnées ou toute autre configuration
- L'horodatage `updatedAt` est automatiquement mis à jour
- Les noms d'index doivent rester uniques dans tout le système