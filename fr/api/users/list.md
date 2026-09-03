---
sidebar_position: 1
title: "Obtenir tous les utilisateurs"
openapi: "GET /users"
---
# Obtenir tous les utilisateurs

Récupérez tous les utilisateurs avec la pagination et le filtrage. Accessible uniquement par les administrateurs.

## Point de terminaison

```
GET /users
```

## Description

Ce point de terminaison permet aux administrateurs de récupérer une liste paginée de tous les utilisateurs du système. Il prend en charge le filtrage selon divers critères, notamment le rôle, la licence, le statut et les termes de recherche. Il s'agit d'un point de terminaison administratif qui nécessite les autorisations appropriées.

## Authentification

Obligatoire. Incluez votre clé API dans l’en-tête Autorisation.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Demande

### Paramètres de requête

| Paramètre | Tapez | Obligatoire | Par défaut | Descriptif |
|---------------|------|----------|---------|-------------|
| `page` | entier | Non | 1 | Numéro de page pour la pagination |
| `limit` | entier | Non | 20 | Nombre d'utilisateurs par page (1-100) |
| `search` | chaîne | Non | - | Terme de recherche pour le nom, l'adresse e-mail ou le nom d'utilisateur |
| `role` | chaîne | Non | - | Filtrer par rôle utilisateur (admin, utilisateur, globalReader) |
| `license` | chaîne | Non | - | Filtrer par licence utilisateur (Essential, Growth, Ultra, Early Access) |
| `status` | entier | Non | - | Filtrer par statut d'utilisateur (0=inactif, 1=actif) |
| `sortBy` | chaîne | Non | créé à | Champ à trier par |
| `sortOrder` | chaîne | Non | desc | Ordre de tri (asc, desc) |

### Exemple de demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

Avec recherche :

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours `true` pour les demandes réussies |
| `users` | tableau | Tableau d'objets utilisateur |
| `users[].id` | chaîne | Identifiant unique de l'utilisateur |
| `users[].name` | chaîne | Nom complet de l'utilisateur |
| `users[].username` | chaîne | Nom d'utilisateur de l'utilisateur |
| `users[].email` | chaîne | Adresse e-mail de l'utilisateur |
| `users[].role` | chaîne | Rôle de l'utilisateur (administrateur, utilisateur, globalReader) |
| `users[].license` | chaîne | Niveau de licence de l'utilisateur (Essential, Growth, Ultra, Early Access) |
| `users[].status` | entier | Statut de l'utilisateur (0=inactif, 1=actif) |
| `users[].isVerified` | booléen | Si l'utilisateur est vérifié |
| `users[].setupCompleted` | booléen | Si la configuration utilisateur est terminée |
| `users[].authType` | chaîne | Type d'authentification (de base, auth0) |
| `users[].mfaEnabled` | booléen | Si MFA est activé |
| `users[].customRole` | objet | Informations sur le rôle personnalisé (si attribué) |
| `users[].customRole.id` | chaîne | ID de rôle personnalisé |
| `users[].customRole.name` | chaîne | Nom de rôle personnalisé |
| `users[].customRole.displayName` | chaîne | Nom d'affichage du rôle personnalisé |
| `users[].createdAt` | chaîne | Horodatage de création d'utilisateur |
| `users[].updatedAt` | chaîne | Horodatage de la dernière mise à jour de l'utilisateur |
| `users[].lastActive` | chaîne | Horodatage de la dernière activité de l'utilisateur |
| `pagination` | objet | Informations sur la pagination |
| `pagination.page` | entier | Numéro de page actuel |
| `pagination.limit` | entier | Articles par page |
| `pagination.total` | entier | Nombre total d'utilisateurs |
| `pagination.pages` | entier | Nombre total de pages |

## Exemple d'utilisation

###JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponses d'erreur

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
  "message": "Admin access required"
}
```

## Exemples de filtrage

### Recherche par nom ou par e-mail

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrer par rôle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrer par licence

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrer par statut

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Trier par dernier actif

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Cas d'utilisation

- **Gestion des utilisateurs** : affichez et gérez tous les utilisateurs du système
- **User Analytics** : analysez la répartition des utilisateurs par rôle, licence ou statut.
- **Recherche et filtre** : recherchez des utilisateurs spécifiques en fonction de divers critères
- **Tâches administratives** : Supporter les opérations administratives et les rapports

## Descriptions des rôles

- **admin** : accès complet au système avec contrôle administratif
- **utilisateur** : accès standard aux fonctionnalités de chat et aux bases de connaissances personnelles  
- **globalReader** : accès en lecture seule au panneau d'administration avec autorisations d'affichage

## Descriptions des licences

- **Essential** : niveau de base avec 29 000 points/mois
- **Croissance** : niveau intermédiaire avec des fonctionnalités améliorées
- **Ultra** : niveau Premium avec un maximum de fonctionnalités
- **Accès anticipé** : niveau bêta avec capacités expérimentales

## Limites de taux

Ce point de terminaison suit les limites de débit standard :
- 60 requêtes par minute
- 1000 requêtes par heure