---
sidebar_position: 3
title: "Politiques de sécurité"
openapi: "GET /smltp-policies"
---
# Obtenir les politiques de sécurité

Récupérez les politiques de sécurité SMLTP (Secure Model Language Transfer Protocol) disponibles.

## Point de terminaison

```
GET /smltp-policies
```

## Description

Récupérez les politiques de sécurité SMLTP (Secure Model Language Transfer Protocol) disponibles. Ces politiques déterminent la manière dont vos données sont traitées et protégées.

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `success` | booléen | Toujours vrai pour les demandes réussies | `true` |
| `policies` | tableau | Liste des politiques de sécurité disponibles | Voir exemple |
| `restrictions` | objet | Restrictions d'accès aux règles | Voir exemple |

### Objet de stratégie

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `id` | chaîne | Identificateur de politique unique | `"internal"` |
| `name` | chaîne | Nom d'affichage de la stratégie | `"Internal"` |
| `description` | chaîne | Description de la politique | `"For internal company data"` |

### Objet de restrictions

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `allowed_policies` | tableau | Tableau des ID de stratégie autorisés | `["public", "internal", "confidential"]` |

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
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Types de politiques

### Publique
- **Cas d'utilisation** : données publiques non sensibles
- **Niveau de sécurité** : Faible
- **Traitement des données** : traitement standard avec sécurité de base

### Interne
- **Cas d'utilisation** : données internes de l'entreprise
- **Niveau de sécurité** : Moyen
- **Traitement des données** : sécurité renforcée avec des garanties supplémentaires

### Confidentiel
- **Cas d'utilisation** : données commerciales confidentielles
- **Niveau de sécurité** : Élevé
- **Traitement des données** : sécurité maximale avec un traitement strict des données

## Remarques

- Choisissez la politique appropriée en fonction de la sensibilité de vos données
- Les politiques affectent la façon dont vos données sont traitées et protégées
- Utilisez l'ID de politique dans les demandes d'achèvement de chat
- Certaines politiques peuvent être restreintes en fonction de votre type de compte