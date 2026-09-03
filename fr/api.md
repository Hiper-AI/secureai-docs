---
sidebar_position: 5
title: "Référence API"
---
# Référence API

L'API externe SecureAI fournit des fonctionnalités de complétion de chat IA avec récupération de la base de connaissances, politiques de sécurité et suivi complet de l'utilisation. Cette API est conçue pour les développeurs externes et les intégrations utilisant l'authentification par clé API.

## Principales fonctionnalités

- **RAG (Retrieval-Augmented Generation)** : recherche automatique dans les bases de connaissances pour le contexte pertinent
- **Prise en charge multi-modèles** : OpenAI, Anthropic, Google, Meta et autres modèles d'IA
- **Redondance et basculement de modèle** : chaînes de basculement définies par l'appelant (primaire + secours) avec délais d'attente par tentative
- **Point de terminaison compatible OpenAI** : pointez n'importe quel SDK OpenAI sur `/api/external/v1` — aucune modification de code
- **Génération d'images** : générez et modifiez des images à l'aide de Google Gemini 2.5 Flash Image
- **Speech-to-Speech (S2S)** : conversations vocales en temps réel utilisant l'API OpenAI Realtime avec WebRTC
- **Politiques de sécurité** : application des politiques SMLTP, bouclier d'invite par appel et reçus de conformité signés
- **Webhooks** : livraison signée et en temps réel des événements de sécurité et de plateforme
- **Suivi de l'utilisation** : surveillance complète de l'utilisation, quota en libre-service et limitation du débit
- **Intégration de la base de connaissances** : accès à des bases de connaissances personnelles et partagées
- **Gestion des utilisateurs** : fonctionnalités complètes de gestion des utilisateurs, des groupes et des rôles
- **Journalisation d'audit** : journaux d'audit d'activité et de sécurité complets

## Authentification

Tous les points de terminaison (à l'exception de la vérification de l'état) nécessitent une authentification par clé API à l'aide du jeton Bearer :

```bash
Authorization: Bearer sk-your-api-key-here
```

## URL de base

```
https://{customer.name}.hiperai.ai/api/external
```

Pour la surface compatible OpenAI, pointez l'URL de base de votre SDK vers :

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## Facturation et utilisation

Par défaut, les requêtes API sont facturées au compte utilisateur propriétaire de la clé API. Vous pouvez spécifier un autre utilisateur à facturer en incluant le paramètre `user_id` dans votre demande. Cela permet de :

- Applications multi-locataires avec facturation par utilisateur
- Gestion flexible des limites d'achèvement
- Paramètres "Utilisation par modèle" par utilisateur

## Limites de taux

- **Par défaut** : 60 requêtes par minute, 1 000 requêtes par heure
- **Limites quotidiennes** : 100 requêtes (configurables)
- **Limites mensuelles** : 10 000 requêtes (configurables)

## Démarrage rapide

### 1. Bilan de santé

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. Obtenez les modèles disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Obtenez les bases de connaissances disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Créer une fin de chat

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## Points de terminaison de l'API

### Système
- [Health Check](/fr/en/api/system/health) - Vérifier l'état de l'API

### Découverte
- [Obtenir les modèles disponibles](/fr/en/api/discovery/models) - Liste des modèles IA disponibles
- [Obtenir les bases de connaissances disponibles](/fr/en/api/discovery/indexes) - Répertorier les bases de connaissances accessibles
- [Obtenir les politiques de sécurité](/fr/en/api/discovery/smltp-policies) - Liste des politiques SMLTP disponibles

### Discuter
- [Chat Completion](/fr/en/api/chat/completions) - Point de terminaison principal du chat IA avec RAG
- [OpenAI-Compatible Endpoint](/fr/en/api/chat/openai-compatible) - Drop-in `/v1/chat/completions` pour les SDK OpenAI
- [Redondance & Failover](/fr/en/api/redundancy) - Modéliser les chaînes de basculement
- [Policy Check](/fr/en/api/policy-check) - Exécuter à sec le pipeline de sécurité sans appeler de modèle
- [Usage](/fr/en/api/usage) - Quotas, budgets et limites de tarifs en libre-service
- [Receipts](/fr/en/api/receipts) - Récupérer les reçus de conformité SMLTP signés

### Webhooks
- [Présentation des Webhooks](/fr/en/api/webhooks/overview) - Livraison d'événements signés en temps réel
- [Événements Webhook](/fr/en/api/webhooks/events) - Catalogue d'événements et charges utiles

### Images
- [Générer des images](/fr/en/api/images/generations) - Générer des images à partir de texte ou modifier des images existantes
- [Modifier les images](/fr/en/api/images/edits) - Édition image à image avec instructions textuelles

### Discours/S2S
- [Initier une session S2S WebRTC](/fr/en/api/speech/webrtc) - Établir des conversations vocales en temps réel
- [Obtenir le statut horaire S2S](/fr/en/api/speech/status) - Vérifier le quota de temps S2S restant
- [Enregistrer la durée de la session S2S](/fr/en/api/speech/log-session) - Enregistrer la durée de la session et déduire le temps

### Gestion des utilisateurs
- [Get All Users](/fr/en/api/users/list) - Récupérer les utilisateurs avec pagination
- [Créer un utilisateur](/fr/en/api/users/create) - Créer un nouveau compte utilisateur
- [Mettre à jour l'utilisateur](/fr/en/api/users/update) - Mettre à jour l'utilisateur existant
- [Obtenir la disponibilité des licences](/fr/en/api/billing-modes/licenses-availability) - Récupérer les limites et l'utilisation du pool de licences

### Gestion des index
- [Get All Indexes](/fr/en/api/indexes/list) - Récupérer toutes les bases de connaissances
- [Créer un index](/fr/en/api/indexes/create) - Créer une nouvelle base de connaissances
- [Mettre à jour l'index](/fr/en/api/indexes/update) - Mettre à jour l'index existant
- [Train Index with Documents](/fr/en/api/indexes/train) - Former l'index en téléchargeant des documents
- [Index de recherche de documents](/fr/en/api/indexes/search) - Rechercher des documents par recherche sémantique

### Gestion de groupe
- [Get All Groups](/fr/en/api/groups/list) - Récupérer tous les groupes
- [Créer un groupe](/fr/en/api/groups/create) - Créer un nouveau groupe
- [Mettre à jour le groupe](/fr/en/api/groups/update) - Mettre à jour le groupe existant

### Sécurité SMLTP
- [Obtenir toutes les politiques SMLTP](/fr/en/api/smltp/policies) - Liste toutes les politiques de sécurité
- [Obtenir la politique active](/fr/en/api/smltp/active) - Obtenir la politique active actuelle
- [Créer une politique personnalisée](/fr/en/api/smltp/create) - Créer une politique SMLTP personnalisée
- [Journaux d'audit](/fr/en/api/smltp/audit-logs) - Récupérer les journaux d'audit SMLTP

### Gestion des rôles
- [Get All Roles](/fr/en/api/roles/list) - Récupérer tous les rôles
- [Créer un rôle](/fr/en/api/roles/create) - Créer un nouveau rôle personnalisé

## Gestion des erreurs

### Format de réponse d'erreur

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Erreur de limite de débit

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Codes d'état HTTP courants

| Codes | Descriptif |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête incorrecte – paramètres invalides |
| `401` | Clé API non autorisée - non valide |
| `403` | Interdit - autorisations insuffisantes |
| `404` | Pas trouvé |
| `409` | Conflit – la ressource existe déjà |
| `413` | Charge utile trop volumineuse : taille du fichier dépassée |
| `429` | Limite de débit dépassée |
| `500` | Erreur de serveur interne |
| `503` | Service indisponible - service non configuré |

## Exemples de SDK

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. Obtenez les modèles disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Obtenez les bases de connaissances disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Créer une fin de chat

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## Points de terminaison de l'API

### Système
- [Health Check](/fr/en/api/system/health) - Vérifier l'état de l'API

### Découverte
- [Obtenir les modèles disponibles](/fr/en/api/discovery/models) - Liste des modèles IA disponibles
- [Obtenir les bases de connaissances disponibles](/fr/en/api/discovery/indexes) - Répertorier les bases de connaissances accessibles
- [Obtenir les politiques de sécurité](/fr/en/api/discovery/smltp-policies) - Liste des politiques SMLTP disponibles

### Discuter
- [Chat Completion](/fr/en/api/chat/completions) - Point de terminaison principal du chat IA avec RAG
- [OpenAI-Compatible Endpoint](/fr/en/api/chat/openai-compatible) - Drop-in `/v1/chat/completions` pour les SDK OpenAI
- [Redondance & Failover](/fr/en/api/redundancy) - Modéliser les chaînes de basculement
- [Policy Check](/fr/en/api/policy-check) - Exécuter à sec le pipeline de sécurité sans appeler de modèle
- [Usage](/fr/en/api/usage) - Quotas, budgets et limites de tarifs en libre-service
- [Receipts](/fr/en/api/receipts) - Récupérer les reçus de conformité SMLTP signés

### Webhooks
- [Présentation des Webhooks](/fr/en/api/webhooks/overview) - Livraison d'événements signés en temps réel
- [Événements Webhook](/fr/en/api/webhooks/events) - Catalogue d'événements et charges utiles

### Images
- [Générer des images](/fr/en/api/images/generations) - Générer des images à partir de texte ou modifier des images existantes
- [Modifier les images](/fr/en/api/images/edits) - Édition image à image avec instructions textuelles

### Discours/S2S
- [Initier une session S2S WebRTC](/fr/en/api/speech/webrtc) - Établir des conversations vocales en temps réel
- [Obtenir le statut horaire S2S](/fr/en/api/speech/status) - Vérifier le quota de temps S2S restant
- [Enregistrer la durée de la session S2S](/fr/en/api/speech/log-session) - Enregistrer la durée de la session et déduire le temps

### Gestion des utilisateurs
- [Get All Users](/fr/en/api/users/list) - Récupérer les utilisateurs avec pagination
- [Créer un utilisateur](/fr/en/api/users/create) - Créer un nouveau compte utilisateur
- [Mettre à jour l'utilisateur](/fr/en/api/users/update) - Mettre à jour l'utilisateur existant
- [Obtenir la disponibilité des licences](/fr/en/api/billing-modes/licenses-availability) - Récupérer les limites et l'utilisation du pool de licences

### Gestion des index
- [Get All Indexes](/fr/en/api/indexes/list) - Récupérer toutes les bases de connaissances
- [Créer un index](/fr/en/api/indexes/create) - Créer une nouvelle base de connaissances
- [Mettre à jour l'index](/fr/en/api/indexes/update) - Mettre à jour l'index existant
- [Train Index with Documents](/fr/en/api/indexes/train) - Former l'index en téléchargeant des documents
- [Index de recherche de documents](/fr/en/api/indexes/search) - Rechercher des documents par recherche sémantique

### Gestion de groupe
- [Get All Groups](/fr/en/api/groups/list) - Récupérer tous les groupes
- [Créer un groupe](/fr/en/api/groups/create) - Créer un nouveau groupe
- [Mettre à jour le groupe](/fr/en/api/groups/update) - Mettre à jour le groupe existant

### Sécurité SMLTP
- [Obtenir toutes les politiques SMLTP](/fr/en/api/smltp/policies) - Liste toutes les politiques de sécurité
- [Obtenir la politique active](/fr/en/api/smltp/active) - Obtenir la politique active actuelle
- [Créer une politique personnalisée](/fr/en/api/smltp/create) - Créer une politique SMLTP personnalisée
- [Journaux d'audit](/fr/en/api/smltp/audit-logs) - Récupérer les journaux d'audit SMLTP

### Gestion des rôles
- [Get All Roles](/fr/en/api/roles/list) - Récupérer tous les rôles
- [Créer un rôle](/fr/en/api/roles/create) - Créer un nouveau rôle personnalisé

## Gestion des erreurs

### Format de réponse d'erreur

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Erreur de limite de débit

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Codes d'état HTTP courants

| Codes | Descriptif |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête incorrecte – paramètres invalides |
| `401` | Clé API non autorisée - non valide |
| `403` | Interdit - autorisations insuffisantes |
| `404` | Pas trouvé |
| `409` | Conflit – la ressource existe déjà |
| `413` | Charge utile trop volumineuse : taille du fichier dépassée |
| `429` | Limite de débit dépassée |
| `500` | Erreur de serveur interne |
| `503` | Service indisponible - service non configuré |

## Exemples de SDK

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### boucle

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Prochaines étapes

- [Base de connaissances & RAG](/fr/en/indexes/overview) - En savoir plus sur les bases de connaissances et RAG
```