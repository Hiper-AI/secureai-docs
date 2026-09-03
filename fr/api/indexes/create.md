---
id: create
title: "Créer un index"
sidebar_label: "Créer un index"
description: "Créer un nouvel index de base de connaissances"
openapi: "POST /indexes/all"
---
# Créer un index

Créez un nouvel index de base de connaissances pour stocker et récupérer des documents.

## Point de terminaison

```
POST /indexes
```

## Description

Ce point de terminaison permet aux administrateurs de créer un nouvel index de base de connaissances. L'index peut être attribué à des utilisateurs ou à des groupes spécifiques. Seuls les administrateurs peuvent créer des index.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Oui | Nom de l'index |
| `assignedUser` | chaîne | Non | ID utilisateur auquel attribuer l'index (MongoDB ObjectId) |
| `assignedGroup` | chaîne | Non | ID de groupe auquel attribuer l'index (MongoDB ObjectId) |
| `sharedIndexName` | chaîne | Non | Nom de l'index partagé (nom par défaut) |
| `namespace` | chaîne | Non | Espace de noms pour l'index (généré automatiquement s'il n'est pas fourni) |
| `region` | chaîne | Non | Astuce de région pour le stockage (facultatif) |
| `cloud` | chaîne | Non | Astuce du fournisseur de cloud (facultatif) |


## Exemple de demande

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## Réponse réussie

**Code d'état** : `201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `message` | chaîne | Message de réussite |
| `index` | objet | Objet d'index créé |
| `index.id` | chaîne | Identificateur d'index unique |
| `index.name` | chaîne | Nom de l'index |
| `index.sharedIndexName` | chaîne | Nom de l'index partagé |
| `index.namespace` | chaîne | Espace de noms d'index |
| `index.type` | chaîne | Type d'index (personnel, général, groupe, inconnu) |
| `index.assignedUser` | objet | Informations utilisateur attribuées (si personnelles) |
| `index.assignedGroup` | objet | Informations sur le groupe attribué (si groupe) |
| `index.createdAt` | chaîne | Horodatage de création |

## Exemple d'utilisation

###JavaScript

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

###Python

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## Validations et règles métier

- **Normalisation du nom d'index** (pour les contrôles de stockage et d'unicité) :
  - Minuscules, couper les espaces
  - Remplacer les espaces par des tirets
  - Supprimer tout caractère ne figurant pas dans `[a-z0-9-]`
- **Validation du nom de l'index** : doit correspondre à `^[a-z0-9-]{3,50}$` ; sinon, renvoie 400.
- **Unicité** : `name` normalisé doit être unique ; les doublons renvoient 409.
- **Quota d'utilisateur attribué** : si `assignedUser` est fourni, appliquez le quota d'index utilisateur via `checkUserIndexQuota` ; le dépassement du quota renvoie 403.
- **Restriction régionale (essentielle)** : pour la licence `Essential`, les index ne peuvent être créés qu'avec `cloud=aws` et `region=us-east-1` ; sinon 403.
- **Groupe attribué** : Lorsque `assignedGroup` est fourni, le groupe doit exister et ne pas être archivé (`status != 'Archived'`) ; sinon 400.

## Normalisation et stockage

- `name` est stocké normalisé.
- `sharedIndexName` est par défaut le `name` normalisé.
- `namespace` est par défaut `user-{userId}-index-{normalizedName}` lorsqu'il est attribué à un utilisateur.

## Formes d'erreur typiques

### 400 Nom d'index invalide

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 Quota d'index dépassé

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 Région non autorisée

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
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
    "message": "Cannot create general indexes without admin privileges"
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

## Types d'index

| Tapez | Descriptif | Autorisations requises |
|------|-------------|--------------------------|
| `personal` | Index personnel à usage individuel | Privilèges d'administrateur |
| `general` | Index organisationnel partagé | Privilèges d'administrateur |
| `group` | Index attribué au groupe | Privilèges d'administrateur |

## Champs obligatoires

| Champ | Descriptif | Exemple |
|-------|-------------|--------------|
| `name` | Nom de l'index | "ma-base-de-connaissances" |
| `region` | Région AWS | "nous-est-1" |
| `cloud` | Fournisseur de cloud | "aws" |

## Cas d'utilisation

- **Affectation d'utilisateur** : créez des index et attribuez-les à des utilisateurs spécifiques
- **Affectation de groupe** : créez des index et attribuez-les à des groupes
- **Bases de connaissances** : créez des bases de connaissances spécialisées pour des domaines spécifiques
- **Organisation du contenu** : organisez le contenu par sujet ou par catégorie
- **Stockage vectoriel** : créez des index pour stocker et récupérer des intégrations vectorielles

## Limites de taux

- **Par défaut** : 50 requêtes par minute
- **Quotidien** : 5 000 requêtes par jour
- **Mensuel** : 150 000 demandes par mois

## Remarques

- Ce point de terminaison n'est accessible que par les administrateurs
- Champs obligatoires : nom, région, cloud sont tous obligatoires
- Affectation : l'index peut être attribué à un utilisateur (assignedUser) ou à un groupe (assignedGroup)
- Génération automatique : l'espace de noms est généré automatiquement s'il n'est pas fourni
- Noms uniques : les noms d'index doivent être uniques dans tout le système.
- L'index est immédiatement disponible pour utilisation après sa création
- Dimension : La dimension vectorielle est gérée en interne par l'application (actuellement 4096)
- Métrique : la métrique de similarité est gérée en interne par l'application