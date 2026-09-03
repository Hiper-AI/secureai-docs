---
id: licenses-availability
title: "Disponibilité des licences"
sidebar_label: "Disponibilité des licences"
description: "Récupérer les limites actuelles du pool de licences, leur utilisation et le reste (administrateur uniquement)"
openapi: "GET /licenses/availability"
---
# Disponibilité des licences

Récupérez les limites du pool de licences, l’utilisation actuelle et les licences restantes pour chaque niveau.

## Point de terminaison

```
GET /licenses/availability
```

## Description

Renvoie l'état du pool de licences pour tous les niveaux de licence, y compris les limites, l'utilisation actuelle et la capacité restante. Point de terminaison réservé aux administrateurs.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `limits` | objet | Limites configurées pour le pool de licences par niveau |
| `usage` | objet | Licences actuellement attribuées/utilisées par niveau |
| `remaining` | objet | Licences restantes par niveau |

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

## Remarques

- Point de terminaison réservé à l'administrateur
- Le reste peut être signalé comme `Infinity` lorsqu'aucune limite de pool n'est appliquée pour ce niveau.
- Les valeurs sont des agrégats à l'échelle de l'organisation