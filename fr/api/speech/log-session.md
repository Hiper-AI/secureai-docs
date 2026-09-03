---
sidebar_position: 3
title: "Durée de la session S2S"
openapi: "POST /speech/s2s/log-session"
---
# Journaliser la durée de la session S2S

Enregistrez la durée d'une session Speech-to-Speech terminée et déduisez le temps du quota de temps S2S de l'utilisateur.

## Point de terminaison

```
POST /speech/s2s/log-session
```

## Description

Enregistrez la durée d'une session Speech-to-Speech terminée et déduisez le temps du quota de temps S2S de l'utilisateur. Cela doit être appelé après la fin d’une session pour suivre l’utilisation avec précision.

### Suivi de l'utilisation

- La durée est spécifiée en millisecondes
- automatiquement converti en minutes et déduit du quota de l'utilisateur
- Le temps est suivi par utilisateur en fonction du niveau de licence
- Les journaux d'activité sont créés à des fins d'audit

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `durationMs` | entier | Oui | Durée de la session en millisecondes (minimum : 0) |
| `user_id` | chaîne | Non | ID utilisateur à qui facturer cette session (par défaut, propriétaire de la clé API) |

## Exemple de demande

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "durationMs": 42624,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
  }'
```

### JavaScript/Node.js

```javascript
// Calculate session duration in milliseconds
const sessionStartTime = Date.now();
// ... session happens ...
const sessionEndTime = Date.now();
const durationMs = sessionEndTime - sessionStartTime;

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    durationMs: durationMs,
    user_id: '60a7c8f5e8b4f5001f7a8c23'
  })
});

const data = await response.json();
console.log('Session logged:', data.message);
```

###Python

```python
import requests
import time

# Calculate session duration
session_start = time.time() * 1000  # Convert to milliseconds
# ... session happens ...
session_end = time.time() * 1000
duration_ms = int(session_end - session_start)

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/log-session"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "durationMs": duration_ms,
    "user_id": "60a7c8f5e8b4f5001f7a8c23"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Session logged:', result['message'])
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "message": "S2S session logged successfully",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours vrai pour les demandes réussies |
| `message` | chaîne | Message de réussite |
| `request_id` | chaîne | Demander un identifiant pour le suivi |

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid user_id",
  "message": "The specified user_id does not exist",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
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

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Failed to log S2S session",
  "message": "An error occurred while logging the session",
  "request_id": "3fb8d444-2242-4764-9202-8e9e72464192"
}
```

## Remarques

- Appelez ce point de terminaison après la fin de chaque session S2S pour suivre avec précision l'utilisation
- La durée doit être calculée à partir du moment où la connexion WebRTC est établie jusqu'à sa fermeture
- Le temps est automatiquement converti de millisecondes en minutes et déduit du quota de l'utilisateur
- Le paramètre `user_id` permet la facturation sur un autre compte utilisateur
- Les journaux d'activité sont automatiquement créés à des fins d'audit
- Assurez-vous d'avoir suffisamment de temps restant avant de démarrer une session (vérifiez auprès de `/speech/s2s/status`)