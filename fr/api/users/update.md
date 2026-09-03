---
id: update
title: "Mettre à jour l'utilisateur"
sidebar_label: "Mettre à jour l'utilisateur"
description: "Mettre à jour un compte utilisateur existant"
openapi: "PUT /users/{userId}"
---
# Mettre à jour l'utilisateur

Mettez à jour un compte utilisateur existant avec de nouvelles informations.

## Point de terminaison

```
PUT /users/{userId}
```

## Description

Ce point de terminaison permet aux administrateurs de mettre à jour un compte utilisateur existant. Vous pouvez modifier les détails de l'utilisateur tels que le nom, l'adresse e-mail, le rôle, le niveau de licence et d'autres paramètres de compte.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres du chemin

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `userId` | chaîne | Oui | L'identifiant unique de l'utilisateur à mettre à jour |

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Non | Nom complet de l'utilisateur |
| `username` | chaîne | Non | Nom d'utilisateur unique pour l'utilisateur |
| `email` | chaîne | Non | Adresse email de l'utilisateur |
| `password` | chaîne | Non | Nouveau mot de passe pour le compte utilisateur |
| `role` | chaîne | Non | Rôle utilisateur (administrateur, utilisateur, globalReader) |
| `license` | chaîne | Non | Niveau de licence (Essential, Growth, Ultra, Early Access) |
| `status` | entier | Non | Statut du compte (0=inactif, 1=actif) |
| `roleId` | chaîne | Non | ID de rôle personnalisé (MongoDB ObjectId) |
| `setupCompleted` | booléen | Non | Si la configuration utilisateur est terminée |
| `isVerified` | booléen | Non | Si l'utilisateur est vérifié |

## Exemple de demande

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## Réponse réussie

**Code d'état** : `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `message` | chaîne | Message de réussite |
| `user` | objet | Objet utilisateur mis à jour |
| `user.id` | chaîne | Identifiant unique de l'utilisateur |
| `user.name` | chaîne | Nom complet de l'utilisateur |
| `user.username` | chaîne | Nom d'utilisateur de l'utilisateur |
| `user.email` | chaîne | Adresse e-mail de l'utilisateur |
| `user.role` | chaîne | Rôle de l'utilisateur dans le système |
| `user.license` | chaîne | Niveau de licence de l'utilisateur |
| `user.status` | entier | Statut du compte de l'utilisateur (0=inactif, 1=actif) |
| `user.isVerified` | booléen | Si l'utilisateur est vérifié |
| `user.setupCompleted` | booléen | Si la configuration utilisateur est terminée |
| `user.authType` | chaîne | Type d'authentification |
| `user.customRole` | objet | Informations sur le rôle personnalisé (si attribué) |
| `user.createdAt` | chaîne | Horodatage de création de compte |
| `user.updatedAt` | chaîne | Horodatage de la dernière mise à jour |
| `user.lastActive` | chaîne | Horodatage de la dernière activité de l'utilisateur |

## Exemple d'utilisation

###JavaScript

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

###Python

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

### boucle

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 Introuvable

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 Conflit

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## Validations et règles métier

- **Valeur de la licence** : doit figurer dans les licences autorisées (`Essential`, `Growth`, `Ultra`, `Early Access`). Les valeurs non valides renvoient 400.
- **Capacité de la licence** : appliquée via `checkLicenseCapacity` ; renvoie 400 lorsque le niveau sélectionné est plein.
- **Garde de rétrogradation de licence** : si le passage à un niveau inférieur réduit le quota d'index personnel, le changement est bloqué lorsque le nombre actuel d'index personnels dépasse `INDEX_QUOTAS[new_license]` ; renvoie 400 avec des conseils explicites.
- **Normalisation des emails** : Minuscules et tronqués avant validation et stockage.
- **Normalisation du nom d'utilisateur** : Minuscules et tronqués avant validation et stockage.
- **Format d'e-mail** : validation regex simple ; les e-mails invalides renvoient 400.
- **Format du nom d'utilisateur** : doit correspondre à `^[a-z0-9.-]{3,30}$` ; les noms d'utilisateur invalides renvoient 400.
- **Unicité** : `email`, `username` et `name` doivent rester uniques ; les conflits reviennent 409.

## Normalisation et stockage

- `email` et `username` sont toujours stockés en minuscules et tronqués.

## Formes d'erreur typiques

### 400 Licence invalide

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400 Licence indisponible

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 La rétrogradation de la licence dépasse le quota

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
}
```

### 400 E-mail invalide

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 Nom d'utilisateur invalide

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 Conflit (unicité)

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this username already exists"
}
```

## Rôles des utilisateurs

| Rôle | Descriptif | Autorisations |
|------|-------------|-------------|
| `admin` | Administrateur | Accès complet au système |
| `user` | Utilisateur régulier | Accès utilisateur standard |
| `globalReader` | Lecteur mondial | Accès au panneau d'administration en lecture seule |

## Niveaux de licence

| Niveau | Descriptif | Caractéristiques |
|------|-------------|--------------|
| `Essential` | Niveau de base | Fonctionnalités limitées |
| `Growth` | Niveau professionnel | Fonctionnalités améliorées |
| `Ultra` | Niveau Premium | Fonctionnalités complètes |
| `Early Access` | Niveau d'accès anticipé | Fonctionnalités bêta |

## État du compte

| Statut | Descriptif |
|--------|-------------|
| `0` | Compte inactif |
| `1` | Compte actif |

## Cas d'utilisation

- **Gestion des rôles** : mise à jour des rôles d'utilisateur pour le contrôle d'accès
- **Mises à niveau de licence** : modification des niveaux de licence utilisateur
- **Maintenance du compte** : mise à jour des informations utilisateur et des métadonnées
- **Gestion des statuts** : activation ou suspension des comptes d'utilisateurs
- **Mises à jour du profil** : modification des noms d'utilisateur, des adresses e-mail ou d'autres détails

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Seuls les administrateurs peuvent mettre à jour les comptes d'utilisateurs
- Les adresses e-mail doivent être uniques pour tous les utilisateurs
- Les mises à jour des mots de passe sont facultatives et ne seront appliquées que si elles sont fournies
- Les mises à jour des métadonnées sont fusionnées avec les métadonnées existantes
- L'horodatage `updatedAt` est automatiquement mis à jour en cas d'opérations réussies