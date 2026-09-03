---
sidebar_position: 3
title: "Index des trains avec documents"
openapi: "POST /indexes/{indexName}/train"
---
# Index des trains avec documents

Entraînez un index en téléchargeant des documents (fichiers) ou en fournissant des entrées de texte.

## Point de terminaison

```
POST /indexes/{indexName}/train
```

## Description

Entraînez un index en téléchargeant des documents (fichiers) ou en fournissant des entrées de texte. Ce point de terminaison prend en charge plusieurs formats de fichiers et peut traiter jusqu'à 20 fichiers à la fois.

### Formats de fichiers pris en charge

-TXT
-PDF
-DOCX
-DOC
-JSON
- CSV
-XLS
- XLSX

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Paramètres du chemin

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `indexName` | chaîne | Oui | Nom de l'index à entraîner |

## Corps de la demande

Ce point de terminaison accepte le format `multipart/form-data`.

### Paramètres

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `files` | tableau de binaires | Non | Fichiers de documents à télécharger (jusqu'à 20 fichiers, 50 Mo chacun) |
| `text_inputs` | chaîne | Non | Tableau de chaînes JSON d’entrées de texte. Chaque élément doit avoir : nom, type, contenu, taille |

### Format de saisie de texte

Lorsque vous utilisez `text_inputs`, fournissez un tableau de chaînes JSON avec des objets contenant :

```json
[
  {
    "name": "doc1.txt",
    "type": "text/plain",
    "content": "Document content here",
    "size": 20
  }
]
```

## Exemples de requêtes

### Télécharger des fichiers (données de formulaire en plusieurs parties)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@document3.txt"
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('files', fileInput1.files[0]);
formData.append('files', fileInput2.files[0]);
formData.append('files', fileInput3.files[0]);

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Files processed:', data.results.files_processed);
console.log('Documents indexed:', data.results.documents_indexed);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

files = [
    ('files', open('document1.pdf', 'rb')),
    ('files', open('document2.docx', 'rb')),
    ('files', open('document3.txt', 'rb'))
]

response = requests.post(url, headers=headers, files=files)
result = response.json()
print('Files processed:', result['results']['files_processed'])
print('Documents indexed:', result['results']['documents_indexed'])
```

### Utilisation des entrées de texte

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## Réponse

### Réponse réussie (200)

```json
{
  "success": true,
  "message": "Index trained successfully",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "results": {
    "files_processed": 3,
    "documents_extracted": 3,
    "documents_indexed": 3,
    "total_vectors": 11,
    "total_chunks": 3,
    "index_name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Toujours vrai pour les demandes réussies |
| `message` | chaîne | Message de réussite |
| `request_id` | chaîne | Demander un identifiant pour le suivi |
| `results` | objet | Résultats de la formation |

### Objet de résultats

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `files_processed` | entier | Nombre de dossiers traités |
| `documents_extracted` | entier | Nombre de documents extraits des dossiers |
| `documents_indexed` | entier | Nombre de documents indexés avec succès |
| `total_vectors` | entier | Nombre total de vecteurs stockés dans Pinecone |
| `total_chunks` | entier | Nombre total de blocs de texte créés |
| `index_name` | chaîne | Nom de l'index formé |
| `namespace` | chaîne | Espace de noms de l'index |

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
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
  "message": "User doesn't have access to this index"
}
```

### 404 Introuvable

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 413 Charge utile trop importante

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## Remarques

- Maximum 20 fichiers par demande
- Maximum 50 Mo par fichier
- Les fichiers peuvent être téléchargés sous forme de données multipart/form
- Les entrées de texte peuvent être fournies sous forme de tableau de chaînes JSON
- Les documents sont automatiquement fragmentés et vectorisés pour la recherche sémantique
- L'index doit exister avant la formation
- Les résultats de la formation montrent combien de documents ont été indexés avec succès