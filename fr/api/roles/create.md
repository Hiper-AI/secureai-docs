---
id: create
title: "Créer un rôle"
sidebar_label: "Créer un rôle"
description: "Créer un nouveau rôle d'utilisateur"
openapi: "POST /roles"
---
# Créer un rôle

Créez un nouveau rôle d'utilisateur personnalisé avec des autorisations spécifiques.

## Point de terminaison

```
POST /roles
```

## Description

Ce point de terminaison permet aux administrateurs de créer de nouveaux rôles d'utilisateur personnalisés. Les rôles personnalisés peuvent disposer d'autorisations spécifiques adaptées aux besoins de votre organisation. Vous pouvez spécifier le nom du rôle, la description et les autorisations lors de la création.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `name` | chaîne | Oui | Nom du rôle (identifiant du système) |
| `displayName` | chaîne | Oui | Nom de rôle lisible par l'homme |
| `description` | chaîne | Oui | Description du rôle objectif |
| `hasAdminPanelAccess` | booléen | Non | Indique si le rôle a accès au panneau d'administration (par défaut : false) |
| `permissions` | tableau | Non | Tableau d'objets d'autorisation |
| `canInteractWithAI` | booléen | Non | Indique si le rôle peut interagir avec l'IA (par défaut : vrai) |
| `canUseChat` | booléen | Non | Indique si le rôle peut utiliser le chat (par défaut : vrai) |

## Exemple de demande

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## Réponse réussie

**Code d'état** : `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `message` | chaîne | Message de réussite |
| `role` | objet | Objet de rôle créé |
| `role.id` | chaîne | Identificateur de rôle unique |
| `role.name` | chaîne | Nom du rôle |
| `role.displayName` | chaîne | Nom d'affichage du rôle |
| `role.description` | chaîne | Description du rôle |
| `role.isSystem` | booléen | S'il s'agit d'un rôle système |
| `role.hasAdminPanelAccess` | booléen | Indique si le rôle a accès au panneau d'administration |
| `role.permissions` | tableau | Tableau d'objets d'autorisation |
| `role.permissions[].section` | chaîne | Section autorisations |
| `role.permissions[].level` | chaîne | Niveau d'autorisation |
| `role.canInteractWithAI` | booléen | Si le rôle peut interagir avec l'IA |
| `role.canUseChat` | booléen | Indique si le rôle peut utiliser le chat |
| `role.userCount` | entier | Nombre d'utilisateurs avec ce rôle |
| `role.createdBy` | objet | Utilisateur qui a créé le rôle |
| `role.createdBy.id` | chaîne | ID utilisateur du créateur |
| `role.createdBy.name` | chaîne | Nom du créateur |
| `role.createdBy.email` | chaîne | E-mail du créateur |
| `role.createdAt` | chaîne | Horodatage de création |

## Exemple d'utilisation

###JavaScript

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

###Python

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
    "details": {
      "field": "name",
      "value": null
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

### 409 Conflit

```json
{
  "success": false,
  "error": {
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## Sections d'autorisation disponibles

| Rubrique | Descriptif |
|---------|-------------|
| `home` | Accès au tableau de bord d'accueil |
| `user-management` | Opérations de gestion des utilisateurs |
| `index-management` | Opérations de gestion d'indices |
| `analytics` | Analyses et rapports |
| `group-management` | Opérations de gestion du groupe |
| `integrations` | Gestion de l'intégration |
| `services-status` | Surveillance de l'état des services |
| `settings` | Paramètres système |
| `announcements` | Gestion des annonces |
| `smltp-security` | Fonctionnalités de sécurité SMLTP |

## Niveaux d'autorisation disponibles

| Niveau | Descriptif |
|-------|-------------|
| `none` | Pas d'accès à la section |
| `reader` | Accès en lecture seule à la section |
| `admin` | Accès administratif complet à la section |

## Cas d'utilisation

- **Rôles personnalisés** : créez des rôles adaptés aux besoins de votre organisation
- **Contrôle d'accès** : définissez des autorisations spécifiques pour différents types d'utilisateurs
- **Sécurité** : mettre en œuvre les principes d'accès du moindre privilège
- **Conformité** : créez des rôles qui répondent aux exigences réglementaires
- **Intégration** : définir des rôles pour l'intégration de systèmes tiers

## Limites de taux

- **Par défaut** : 50 requêtes par minute
- **Quotidien** : 5 000 requêtes par jour
- **Mensuel** : 150 000 demandes par mois

## Remarques

- **Administrateur uniquement** : ce point de terminaison nécessite des privilèges d'administrateur
- **Champs obligatoires** : le nom, le displayName et la description sont obligatoires
- **Structure des autorisations** : les autorisations sont des objets avec des propriétés de section et de niveau.
- **Rôles système** : les rôles personnalisés ne sont jamais des rôles système
- **Réponse plate** : la réponse n'est pas imbriquée sous l'objet de données
- **Informations sur le créateur** : indique qui a créé le rôle
- **Nombre d'utilisateurs** : commence à 0 pour les nouveaux rôles
- Les noms de rôle doivent être uniques dans le système
- Le rôle est immédiatement disponible pour l'affectation des utilisateurs