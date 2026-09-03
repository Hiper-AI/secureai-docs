---
sidebar_position: 4
title: "Index de recherche de documents"
openapi: "GET /indexes/{indexName}/search"
---
# Index de recherche de documents

Recherchez des documents dans un index à l’aide de la recherche sémantique.

## Point de terminaison

```
GET /indexes/{indexName}/search
```

## Description

Recherchez des documents dans un index à l’aide de la recherche sémantique. Renvoie les documents correspondants avec des scores de pertinence, triés par pertinence.

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Paramètres du chemin

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `indexName` | chaîne | Oui | Nom de l'index à rechercher |

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `query` | chaîne | Oui | Texte de la requête de recherche |
| `top_k` | entier | Non | Nombre maximum de résultats à renvoyer (1-50, par défaut : 10) |
| `min_score` | flotter | Non | Seuil de score de pertinence minimum (0,0-1,0, par défaut : 0,0) |

## Exemple de demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=What%20is%20machine%20learning?&top_k=10&min_score=0.5" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const query = encodeURIComponent('What is machine learning?');
const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=${query}&top_k=10&min_score=0.5`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Total matches:', data.results.total);
data.results.matches.forEach(match => {
  console.log(`Rank ${match.rank}: ${match.content.substring(0, 100)}... (score: ${match.score})`);
});
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "query": "What is machine learning?",
    "top_k": 10,
    "min_score": 0.5
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Total matches:', result['results']['total'])
for match in result['results']['matches']:
    print(f"Rank {match['rank']}: {match['content'][:100]}... (score: {match['score']})")
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What is machine learning?",
  "results": {
    "matches": [
      {
        "rank": 1,
        "score": 0.85,
        "source": "training",
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed...",
        "metadata": {
          "page": 1,
          "chunkIndex": 0,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      },
      {
        "rank": 2,
        "score": 0.78,
        "source": "training",
        "content": "Machine learning algorithms build mathematical models based on training data to make predictions or decisions...",
        "metadata": {
          "page": 2,
          "chunkIndex": 1,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      }
    ],
    "total": 5,
    "top_k": 10
  },
  "index": {
    "name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours vrai pour les demandes réussies |
| `request_id` | chaîne | Demander un identifiant pour le suivi |
| `query` | chaîne | La requête de recherche utilisée |
| `results` | objet | Résultats de recherche |
| `index` | objet | Informations sur l'index |

### Objet de résultats

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `matches` | tableau | Tableau de documents correspondants, triés par pertinence |
| `total` | entier | Nombre total de correspondances trouvées |
| `top_k` | entier | Valeur top_k demandée |

### Objet de correspondance

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `rank` | entier | Classement des résultats (basé sur 1) |
| `score` | flotter | Score de pertinence (0,0-1,0, plus élevé est plus pertinent) |
| `source` | chaîne | Identificateur de la source du document |
| `content` | chaîne | Aperçu du contenu (tronqué à 500 caractères) |
| `metadata` | objet | Métadonnées supplémentaires |

### Objet de métadonnées

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `page` | entier\|null | Numéro de page (si à partir d'un PDF) |
| `chunkIndex` | entier\|null | Index de fragments dans le document |
| `title` | chaîne\|null | Titre du document |
| `documentId` | chaîne\|null | Numéro d'identification du document |

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
}
```

### 401 Non autorisé

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Interdit

```json
{
  "success": false,
  "error": "Access denied",
  "message": "User doesn't have access to this index"
}
```

### 404 Introuvable

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## Remarques

- La recherche sémantique utilise la similarité vectorielle pour trouver des documents pertinents
- Les résultats sont triés par score de pertinence (le plus élevé en premier)
- Utilisez `min_score` pour filtrer les résultats peu pertinents
- Les aperçus du contenu sont tronqués à 500 caractères
- Le paramètre `top_k` limite le nombre de résultats renvoyés
- Les métadonnées incluent des informations sur la source et l'emplacement du document