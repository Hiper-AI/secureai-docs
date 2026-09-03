---
sidebar_position: 1
title: "Bilan de santé"
openapi: "GET /health"
---
# Bilan de santé

Vérifiez si l'API est en cours d'exécution et saine. Aucune authentification requise.

## Point de terminaison

```
GET /health
```

## Description

Ce point de terminaison vous permet de vérifier que l'API externe SecureAI est en cours d'exécution et saine. Aucune authentification n'est requise pour ce point de terminaison.

## Demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Champs de réponse

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `success` | booléen | Toujours vrai pour un bilan de santé réussi | `true` |
| `status` | chaîne | État de santé de l'API | `"healthy"` |
| `timestamp` | chaîne | Horodatage actuel du serveur au format ISO 8601 | `"2024-01-15T10:30:00.000Z"` |
| `version` | chaîne | Version actuelle de l'API | `"1.0.0"` |

## Exemple d'utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

###Python

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## Remarques

- Ce point de terminaison ne nécessite pas d'authentification
- Utilisez ce point de terminaison pour surveiller la disponibilité de l'API
- La réponse inclut la version actuelle de l'API pour la vérification de la compatibilité