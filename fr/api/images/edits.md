---
sidebar_position: 2
title: "Modifier les images"
openapi: "POST /images/edits"
---
# Modifier les images

Modifiez les images existantes à l'aide de Google Gemini 2.5 Flash Image avec des instructions textuelles.

## Point de terminaison

```
POST /images/edits
```

## Description

Modifiez les images existantes à l'aide de Google Gemini 2.5 Flash Image avec des instructions textuelles. Ce point de terminaison est spécifiquement conçu pour la **édition d'image à image** où :

- Un fichier image est **obligatoire** (contrairement à `/images/generations` où il est facultatif)
- Une invite textuelle décrit comment modifier ou transformer l'image
- L'image éditée est renvoyée avec les mêmes options de qualité et de format

Toutes les invites et réponses sont automatiquement traitées via SMLTP pour la journalisation des audits et la conformité.

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

Ce point de terminaison accepte le format `multipart/form-data`.

### Paramètres

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `prompt` | chaîne | Oui | Instructions textuelles décrivant comment modifier ou transformer l'image téléchargée (1 à 4 000 caractères) |
| `image` | binaire | Oui | Fichier image à modifier (JPEG, PNG, WEBP ou GIF, max 10 Mo) |
| `smltp_policy` | chaîne | Non | Politique de sécurité SMLTP (par défaut : "interne") |
| `response_format` | chaîne | Non | Format de réponse : "url" ou "b64_json" (par défaut : "url") |

## Exemples de requêtes

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/edits" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky and enhance the overall atmosphere" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky and enhance the overall atmosphere');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/edits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Edited image URL:', data.data[0].url);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/images/edits"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky and enhance the overall atmosphere',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers=headers, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806",
  "object": "image.edit",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_edit_68c5c6d2d57c85b102eb05e2_f55bb4aa_0.png",
      "revised_prompt": "Add dramatic sunset colors to the sky and enhance the overall atmosphere"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": true,
    "text_response": null,
    "smltp_trace_id": "trx-6caec994-73af-4f2c-9e13-572d53262f2a",
    "smltp_bundle_id": "jti-26464307-d455-4a3d-9ca4-8ec144cb601c",
    "smltp_policy": "internal"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours vrai pour les demandes réussies |
| `id` | chaîne | Identifiant unique de la demande |
| `object` | chaîne | Type d'objet : "image.edit" |
| `created` | entier | Horodatage Unix du moment où l'image a été modifiée |
| `data` | tableau | Tableau d'images éditées |
| `metadata` | objet | Métadonnées supplémentaires, y compris le suivi SMLTP |

### Objet image

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `url` | chaîne | URL pour accéder à l'image modifiée (lorsque format_réponse est "url") |
| `b64_json` | chaîne | Données d'image codées en base64 (lorsque format_réponse est "b64_json") |
| `revised_prompt` | chaîne | L'invite réellement utilisée pour l'édition (peut différer de l'entrée) |

### Objet de métadonnées

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `model` | chaîne | Modèle utilisé : "google/gemini-2.5-flash-image-preview" |
| `provider` | chaîne | Fournisseur : "Google" |
| `total_images` | entier | Nombre total d'images (toujours 1 pour les modifications) |
| `is_image_to_image` | booléen | Toujours vrai pour ce point de terminaison |
| `text_response` | chaîne\|null | Réponse textuelle facultative du modèle |
| `smltp_trace_id` | chaîne | ID de trace SMLTP pour le suivi des audits |
| `smltp_bundle_id` | chaîne | ID du bundle SMLTP pour le suivi des audits |
| `smltp_policy` | chaîne | Stratégie SMLTP appliquée |

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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
  "message": "SMLTP policy not allowed"
}
```

### 413 Charge utile trop importante

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 Service indisponible

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## Remarques

- Formats d'images pris en charge : JPEG, PNG, WEBP, GIF
- Taille maximale du fichier : 10 Mo par image
- Le fichier image est **obligatoire** pour ce point de terminaison (contrairement à `/images/generations`)
- L'invite décrit comment modifier ou transformer l'image téléchargée
- Toutes les demandes sont traitées via SMLTP pour des raisons de sécurité et de conformité
- Utilisez `response_format: "b64_json"` pour recevoir des données d'image codées en base64 au lieu d'URL