---
sidebar_position: 2
title: "Créer un nouvel utilisateur"
openapi: "POST /users"
---
# Créer un nouvel utilisateur

Créez un nouveau compte utilisateur. Accessible uniquement par les administrateurs.

## Point de terminaison

```
POST /users
```

## Description

Ce point de terminaison permet aux administrateurs de créer de nouveaux comptes d'utilisateurs dans le système. Vous pouvez spécifier divers attributs utilisateur, notamment le rôle, la licence et le type d'authentification. Il s'agit d'un point de terminaison administratif qui nécessite les autorisations appropriées.

## Flux de création d'utilisateurs

**Authentification de base** (`authType: "basic"`) : l'utilisateur reçoit un e-mail de bienvenue avec un lien de configuration du mot de passe. Le compte est créé sans vérification jusqu'à ce que le mot de passe soit défini.

**Enterprise SSO** (`authType: "enterprise"`) : l'utilisateur est créé et vérifié et peut se connecter via l'entreprise SSO (Auth0, Microsoft AD, etc.). Aucune configuration de mot de passe requise.

## Authentification

Obligatoire. Incluez votre clé API dans l’en-tête Autorisation.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Demande

### Corps de la demande

| Paramètre | Tapez | Obligatoire | Par défaut | Descriptif |
|---------------|------|----------|---------|-------------|
| `name` | chaîne | Oui | - | Nom complet de l'utilisateur |
| `username` | chaîne | Non | - | Nom d'utilisateur unique (généré automatiquement à partir d'un e-mail s'il n'est pas fourni) |
| `email` | chaîne | Oui | - | Adresse e-mail de l'utilisateur |
| `role` | chaîne | Non | utilisateur | Rôle de l'utilisateur (administrateur, utilisateur, globalReader) |
| `license` | chaîne | Non | Essentiel | Niveau de licence de l'utilisateur (Essential, Growth, Ultra, Early Access) |
| `roleId` | chaîne | Non | - | ID de rôle personnalisé (MongoDB ObjectId) |
| `setupCompleted` | booléen | Non | faux | Si la configuration utilisateur est terminée |
| `authType` | chaîne | Non | de base | Type d'authentification (de base, entreprise) |

### Exemple de demande

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## Réponse

### Réponse réussie (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours `true` pour les demandes réussies |
| `message` | chaîne | Message de réussite |
| `user` | objet | Objet utilisateur créé |
| `user.id` | chaîne | Identifiant unique de l'utilisateur |
| `user.name` | chaîne | Nom complet de l'utilisateur |
| `user.username` | chaîne | Nom d'utilisateur de l'utilisateur |
| `user.email` | chaîne | Adresse e-mail de l'utilisateur |
| `user.role` | chaîne | Rôle de l'utilisateur |
| `user.license` | chaîne | Niveau de licence de l'utilisateur |
| `user.status` | entier | Statut utilisateur (1=actif) |
| `user.isVerified` | booléen | Si l'utilisateur est vérifié |
| `user.setupCompleted` | booléen | Si la configuration utilisateur est terminée |
| `user.authType` | chaîne | Type d'authentification |
| `user.createdAt` | chaîne | Horodatage de création d'utilisateur |

## Exemple d'utilisation

###JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 Type d'authentification invalide

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 champs obligatoires manquants

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
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
  "message": "Admin access required"
}
```

### 409 Conflit

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## Validations et règles métier

- **Valeur de la licence** : doit être l'une des licences autorisées (`Essential`, `Growth`, `Ultra`, `Early Access`). Les valeurs non valides renvoient 400.
- **Capacité de la licence** : appliquée via `checkLicenseCapacity`. Si la capacité est pleine pour le niveau sélectionné, renvoie 400.
- **Normalisation des emails** : Minuscules et tronqués avant validation et stockage.
- **Normalisation du nom d'utilisateur** : Minuscules et tronqués avant validation et stockage. Généré automatiquement à partir d'un e-mail s'il n'est pas fourni.
- **Format email** : Validé avec une simple regex ; les e-mails invalides renvoient 400.
- **Format du nom d'utilisateur** : doit correspondre à `^[a-z0-9.-]{3,30}$` ; les noms d'utilisateur invalides renvoient 400.
- **Unicité** : `email`, `username` et `name` doivent être uniques. Les conflits renvoient 409.
- **Comportement d'invitation par e-mail** : pour l'authentification de base, les utilisateurs reçoivent des e-mails de bienvenue avec des liens de configuration de mot de passe.

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
  "message": "No Growth licenses available (used/limit)"
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
  "message": "A user with this email already exists"
}
```

## Rôles des utilisateurs

| Rôle | Descriptif | Autorisations |
|------|-------------|-------------|
| `admin` | Administrateur | Accès complet au système |
| `user` | Utilisateur régulier | Accès utilisateur standard |
| `globalReader` | Lecteur mondial | Accès au panneau d'administration en lecture seule |

## Niveaux de licence

| Licence | Descriptif | Caractéristiques |
|---------|-------------|--------------|
| `Essential` | Niveau de base | Fonctionnalités limitées |
| `Growth` | Niveau professionnel | Fonctionnalités améliorées |
| `Ultra` | Niveau Premium | Fonctionnalités complètes |
| `Early Access` | Niveau d'accès anticipé | Fonctionnalités bêta |

## Types d'authentification

| Tapez | Descriptif |
|------|-------------|
| `basic` | Authentification par nom d'utilisateur/mot de passe (l'utilisateur reçoit un e-mail de configuration du mot de passe) |
| `enterprise` | Intégration SSO d'entreprise (Auth0, Microsoft AD, etc.) |

## Cas d'utilisation

- **Intégration des utilisateurs** : créez de nouveaux comptes d'utilisateurs pour les membres de l'équipe
- **Intégration sans mot de passe** : créez des utilisateurs qui reçoivent des invitations par e-mail pour définir leurs propres mots de passe
- **Intégration SSO** : créez des utilisateurs qui s'authentifient via des fournisseurs d'identité externes
- **Création d'utilisateurs en masse** : créez plusieurs utilisateurs par programme
- **Intégration** : créez des utilisateurs à partir de systèmes externes
- **Tâches administratives** : gérer les comptes d'utilisateurs via l'API

## Limites de taux

Ce point de terminaison suit les limites de débit standard :
- 60 requêtes par minute
- 1000 requêtes par heure