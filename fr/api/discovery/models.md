---
sidebar_position: 1
title: "Modèles disponibles"
openapi: "GET /models"
---
# Obtenez les modèles disponibles

Récupérez les modèles d'IA disponibles en fonction des autorisations de votre clé API et de votre licence utilisateur.

## Point de terminaison

```
GET /models
```

## Description

Récupérez les modèles d'IA disponibles en fonction des autorisations de votre clé API et de votre licence utilisateur.

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Paramètres

| Paramètre | Tapez | Obligatoire | Descriptif | Exemple |
|---------------|------|--------------|-------------|-------------|
| `provider` | chaîne | Non | Filtrer les modèles par fournisseur | `"openai"` |

## Demande

### Demande de base

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Filtrer par fournisseur

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "models": [
    {
      "id": "openai/gpt-5-nano",
      "name": "openai/gpt-5-nano",
      "provider": "openai"
    },
    {
      "id": "anthropic/claude-sonnet-4.6",
      "name": "anthropic/claude-sonnet-4.6",
      "provider": "anthropic"
    }
  ],
  "user_license": "Pro",
  "restrictions": {
    "allowed_models": "all"
  },
  "filters": {
    "provider": "openai"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `success` | booléen | Toujours vrai pour les demandes réussies | `true` |
| `models` | tableau | Liste des modèles disponibles | Voir exemple |
| `user_license` | chaîne | Niveau de licence de l'utilisateur | `"Pro"` |
| `restrictions` | objet | Restrictions d'accès aux modèles | Voir exemple |
| `filters` | objet | Filtres appliqués | Voir exemple |

### Objet modèle

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `id` | chaîne | Identifiant unique du modèle | `"openai/gpt-5-nano"` |
| `name` | chaîne | Nom d'affichage du modèle | `"openai/gpt-5-nano"` |
| `provider` | chaîne | Fournisseur de modèles | `"openai"` |

### Objet de restrictions

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `allowed_models` | chaîne | Niveau d'accès au modèle | `"all"` |

### Filtre l'objet

| Champ | Tapez | Descriptif | Exemple |
|-------|------|-------------|---------|
| `provider` | chaîne | Filtre de fournisseur appliqué | `"openai"` |

## Réponses d'erreur

### 401 Non autorisé

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 Limite de débit dépassée

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Exemple d'utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/models', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Models:', data.models);
console.log('User License:', data.user_license);
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', headers=headers)
data = response.json()

print('Available Models:', data['models'])
print('User License:', data['user_license'])
```

### Filtrer par fournisseur

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'provider': 'openai'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', 
                      headers=headers, params=params)
data = response.json()

print('OpenAI Models:', data['models'])
```

### boucle

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Seaux LLM (actuels)

Le système de discussion classe les modèles en deux catégories d'exécution :

- Seau `standard`
- Seau `premium`

Cette référence est basée sur le mappage du bucket back-end actif.

### Godet standard

- `openai/gpt-oss-120b`
- `openai/gpt-5-nano`
- `google/gemini-3.1-flash-lite-preview`
- `google/gemini-3-flash-preview`
- `deepseek/deepseek-r1-distill-llama-70b`
- `deepseek/deepseek-r1`
- `deepseek/deepseek-v3.2`
- `meta-llama/llama-3.3-70b-instruct`
- `meta-llama/llama-4-maverick`
- `meta-llama/llama-4-scout`
- `mistralai/mistral-7b-instruct`
- `mistralai/mistral-nemo`
- `mistralai/ministral-14b-2512`
- `mistralai/mistral-large-2512`
- `x-ai/grok-3-mini`
- `qwen/qwen3-235b-a22b-2507`
- `qwen/qwen3-coder`
- `qwen/qwen3-coder-next`
- `qwen/qwen3.5-397b-a17b`

### Seau Premium

- `anthropic/claude-3.7-sonnet`
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-opus-4.6`
- `openai/o4-mini-high`
- `openai/o4-mini`
- `openai/gpt-5.2`
- `openai/gpt-5.3-codex`
- `openai/gpt-5.1`
- `google/gemini-3.1-pro-preview`
- `x-ai/grok-4`

## Fournisseurs disponibles

- **OpenAI**
- **Anthropique**
- **Google**
- **Méta**
-**Mistral**
- **Recherche profonde**
- **xAI**
-**Qwen**

## Remarques

- Les modèles disponibles dépendent de votre niveau d'abonnement
- Certains modèles peuvent être restreints en fonction de votre licence
- Utilisez le filtre de fournisseur pour obtenir des modèles de fournisseurs spécifiques
- La réponse inclut votre niveau de licence actuel et vos restrictions 
- Les restrictions de clé API (`allowedModels`) peuvent réduire davantage la liste de modèles