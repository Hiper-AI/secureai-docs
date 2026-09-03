---
sidebar_position: 2
title: "Bases de connaissances disponibles"
openapi: "GET /indexes"
---
# Obtenez les bases de connaissances disponibles

Récupérez les bases de connaissances (index) disponibles auxquelles votre clé API peut accéder.

## Point de terminaison

```
GET /indexes
```

## Description

Récupérez les bases de connaissances (index) disponibles auxquelles votre clé API peut accéder. Comprend des index personnels, des index partagés et l'option Zero-Knowledge.

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "indexes": [
    {
      "id": "Zero-Knowledge",
      "name": "Zero-Knowledge",
      "type": "system",
      "description": "Direct AI responses without knowledge base retrieval"
    },
    {
      "id": "my-knowledge-base",
      "name": "my-knowledge-base",
      "type": "personal",
      "namespace": "user-namespace"
    }
  ],
  "restrictions": {
    "allowed_indexes": "all user indexes"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `success` | booléen | Toujours vrai pour les demandes réussies | `true` |
| `indexes` | tableau | Liste des bases de connaissances disponibles | Voir exemple |
| `restrictions` | objet | Restrictions d'accès à l'index | Voir exemple |

### Objet d'indexation

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `id` | chaîne | Identificateur d'index unique | `"my-knowledge-base"` |
| `name` | chaîne | Nom d'affichage de l'index | `"my-knowledge-base"` |
| `type` | chaîne | Type d'index | `"personal"` |
| `namespace` | chaîne | Espace de noms d'index (facultatif) | `"user-namespace"` |
| `description` | chaîne | Description de l'index (facultatif) | `"Direct AI responses..."` |

###Types d'index

| Tapez | Descriptif |
|------|-------------|
| `system` | Index fournis par le système (par exemple, Zero-Knowledge) |
| `personal` | Bases de connaissances personnelles de l'utilisateur |
| `general` | Bases de connaissances partagées |

### Objet de restrictions

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `allowed_indexes` | chaîne | Description des index autorisés | `"all user indexes"` |

## Réponses d'erreur

### 401 Non autorisé

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Exemple d'utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Indexes:', data.indexes);
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/indexes', headers=headers)
data = response.json()

print('Available Indexes:', data['indexes'])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Index spéciaux

### Zéro connaissance

L'index `Zero-Knowledge` est un index système spécial qui fournit des réponses directes de l'IA sans récupération de la base de connaissances. Utilisez-le quand vous le souhaitez :

- Réponses IA pures sans RAG
- Test des capacités du modèle IA
- Conversation générale sans contexte spécifique

## Remarques

- L'index Zero-Knowledge est toujours disponible
- Les index personnels sont créés par l'utilisateur
- L'accès aux index dépend de vos autorisations
- Utilisez l'ID d'index dans les demandes de fin de chat