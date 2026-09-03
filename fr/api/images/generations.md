---
sidebar_position: 1
title: "Générer des images"
openapi: "POST /images/generations"
---
# Générer des images

Générez de nouvelles images à partir d'invites de texte ou transformez des images existantes à l'aide de Google Gemini 2.5 Flash Image.

## Point de terminaison

```
POST /images/generations
```

## Description

Générez de nouvelles images à partir de descriptions textuelles ou transformez des images existantes. Ce point de terminaison prend en charge :

- **Text-to-Image** : générer des images à partir de descriptions textuelles
- **Image-to-Image** : Transformez ou modifiez des images existantes (téléchargez un fichier image)

Toutes les invites et réponses sont automatiquement traitées via SMLTP pour la journalisation des audits et la conformité.

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

Ce point de terminaison accepte les formats `multipart/form-data` (pour les téléchargements de fichiers) et `application/json`.

### Paramètres

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `prompt` | chaîne | Oui | Invite textuelle décrivant l'image à générer ou comment transformer l'image téléchargée (1 à 4 000 caractères) |
| `image` | binaire | Non | Fichier image pour la génération d'image à image (JPEG, PNG, WEBP ou GIF, 10 Mo maximum) |
| `smltp_policy` | chaîne | Non | Politique de sécurité SMLTP (par défaut : "interne") |
| `response_format` | chaîne | Non | Format de réponse : "url" ou "b64_json" (par défaut : "url") |
| `size` | chaîne | Non | Taille de l'image (par défaut : "1024x1024") |
| `n` | entier | Non | Nombre d'images à générer (1-4, par défaut : 1) |

## Exemples de requêtes

### Texte-image (JSON)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
  }'
```

### Image à image (données de formulaire en plusieurs parties)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
// Text-to-Image
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over the ocean with mountains in the background, digital art style',
    smltp_policy: 'internal',
    response_format: 'url',
    n: 1
  })
});

const data = await response.json();
console.log('Generated image URL:', data.data[0].url);

// Image-to-Image
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response2 = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data2 = await response2.json();
console.log('Edited image URL:', data2.data[0].url);
```

###Python

```python
import requests

# Text-to-Image
url = "https://{customer.name}.hiperai.ai/api/external/images/generations"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Generated image URL:', result['data'][0]['url'])

# Image-to-Image
with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers={'Authorization': 'Bearer sk-your-api-key-here'}, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3",
  "object": "image.generation",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_68c5c6d2d57c85b102eb05e2_90d3756f_0.png",
      "revised_prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": false,
    "text_response": null,
    "smltp_trace_id": "trx-220eca66-5e3a-4a72-886b-e6ba8cde18a6",
    "smltp_bundle_id": "jti-bb850e61-fbfe-412a-8b0d-d180d4a36d22",
    "smltp_policy": "internal"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours vrai pour les demandes réussies |
| `id` | chaîne | Identifiant unique de la demande |
| `object` | chaîne | Type d'objet : "image.génération" |
| `created` | entier | Horodatage Unix de la création des images |
| `data` | tableau | Tableau d'images générées |
| `metadata` | objet | Métadonnées supplémentaires, y compris le suivi SMLTP |

### Objet image

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `url` | chaîne | URL pour accéder à l'image générée (lorsque format_réponse est "url") |
| `b64_json` | chaîne | Données d'image codées en base64 (lorsque format_réponse est "b64_json") |
| `revised_prompt` | chaîne | L'invite réellement utilisée pour la génération (peut différer de l'entrée) |

### Objet de métadonnées

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `model` | chaîne | Modèle utilisé : "google/gemini-2.5-flash-image-preview" |
| `provider` | chaîne | Fournisseur : "Google" |
| `total_images` | entier | Nombre total d'images générées |
| `is_image_to_image` | booléen | S'agissait-il d'une génération d'image à image |
| `text_response` | chaîne\|null | Réponse textuelle facultative du modèle |
| `smltp_trace_id` | chaîne | ID de trace SMLTP pour le suivi des audits |
| `smltp_bundle_id` | chaîne | ID du bundle SMLTP pour le suivi des audits |
| `smltp_policy` | chaîne | Stratégie SMLTP appliquée |

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
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
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 Service indisponible

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## Remarques

- Formats d'image pris en charge pour le téléchargement : JPEG, PNG, WEBP, GIF
- Taille maximale du fichier : 10 Mo par image
- Lors du téléchargement d'une image, l'invite décrit comment la transformer
- Gemini génère généralement 1 à 4 images par requête
- Toutes les demandes sont traitées via SMLTP pour des raisons de sécurité et de conformité
- Utilisez `response_format: "b64_json"` pour recevoir des données d'image codées en base64 au lieu d'URL