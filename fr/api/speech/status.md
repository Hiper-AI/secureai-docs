---
sidebar_position: 2
title: "Obtenir l'état de l'heure S2S"
openapi: "GET /speech/s2s/status"
---
# Obtenir l'état de l'heure S2S

Récupérez l’état actuel de la synthèse vocale (S2S) pour l’utilisateur de facturation.

## Point de terminaison

```
GET /speech/s2s/status
```

## Description

Récupérez l'état actuel du temps Speech-to-Speech (S2S) pour l'utilisateur de facturation, y compris le temps restant, la limite mensuelle totale, la durée d'utilisation et les informations de renouvellement.

### Quotas de temps S2S

- Les quotas sont basés sur le niveau de licence de l'utilisateur
- L'heure est réinitialisée mensuellement en fonction de la date d'attribution de la licence
- Les licences d'essai non renouvelables ne se réinitialisent pas automatiquement

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `user_id` | chaîne | Non | ID utilisateur pour lequel vérifier l'état (par défaut, propriétaire de la clé API) |

## Exemple de demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/status?user_id=60a7c8f5e8b4f5001f7a8c23', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Remaining minutes:', data.remaining_minutes);
console.log('Total minutes:', data.total_minutes);
console.log('Used minutes:', data.used_minutes);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/status"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Remaining minutes:', result['remaining_minutes'])
print('Total minutes:', result['total_minutes'])
print('Used minutes:', result['used_minutes'])
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "remaining_minutes": 38.2896,
  "total_minutes": 45,
  "used_minutes": 6.7104,
  "has_time_remaining": true,
  "next_renewal_date": "2025-12-01T12:55:35.721Z",
  "non_renewable": false,
  "request_id": "a8c307b4-c0c9-4b30-98db-5aced06c1cfe"
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours vrai pour les demandes réussies |
| `remaining_minutes` | numéro | Temps S2S restant en minutes |
| `total_minutes` | numéro | Délai mensuel total S2S |
| `used_minutes` | numéro | Temps S2S utilisé ce mois-ci |
| `has_time_remaining` | booléen | Indique si l'utilisateur dispose d'un temps S2S restant |
| `next_renewal_date` | chaîne\|null | Quand le quota de temps S2S sera réinitialisé (nul pour les licences non renouvelables) |
| `non_renewable` | booléen | S'il s'agit d'une licence d'essai non renouvelable |
| `request_id` | chaîne | Demander un identifiant pour le suivi |

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id is invalid"
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

### 404 Introuvable

```json
{
  "success": false,
  "error": "User not found",
  "message": "The specified user_id does not exist"
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Remarques

- Vérifiez ce point de terminaison avant de lancer des sessions S2S pour vous assurer que suffisamment de temps est disponible
- Le paramètre `user_id` permet de vérifier l'état d'un autre utilisateur (par défaut, propriétaire de la clé API)
- Les quotas de temps sont basés sur le niveau de licence de l'utilisateur
- Les licences d'essai non renouvelables auront `non_renewable: true` et `next_renewal_date: null`