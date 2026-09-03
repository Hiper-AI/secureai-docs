---
sidebar_position: 1
title: "Lancer une session WebRTC de synthèse vocale"
openapi: "POST /speech/s2s/webrtc"
---
# Lancer une session WebRTC de synthèse vocale

Établissez une connexion WebRTC pour des conversations parole-parole en temps réel à l'aide de l'API OpenAI Realtime.

## Point de terminaison

```
POST /speech/s2s/webrtc
```

## Description

Établit une connexion WebRTC pour les conversations parole-parole en temps réel à l'aide de l'API OpenAI Realtime. Ce point de terminaison accepte une offre WebRTC SDP et renvoie une réponse SDP qui peut être utilisée pour établir une connexion homologue avec l'API en temps réel d'OpenAI.

### Flux d'utilisation

1. Le client crée une offre WebRTC (RTCPeerConnection.createOffer)
2. Le client envoie l'offre SDP à ce point de terminaison
3. Ce point de terminaison transmet l'offre à l'API OpenAI Realtime
4. Le client reçoit la réponse SDP et établit une connexion WebRTC
5. Le client peut alors avoir des conversations vocales en temps réel avec l'IA

### Suivi du temps S2S

- Chaque utilisateur dispose d'un quota de temps S2S mensuel basé sur sa licence
- Le temps est suivi en minutes et déduit lorsque les sessions sont enregistrées
- Utilisez `/speech/s2s/status` pour vérifier le temps restant
- Utilisez `/speech/s2s/log-session` pour enregistrer la durée de la session et déduire le temps

### Intégration SMLTP

- Toutes les demandes sont traitées via SMLTP pour des raisons de sécurité et de conformité
- La validation du modèle est appliquée en fonction de la politique SMLTP spécifiée
- Les demandes sont auditées et enregistrées pour le suivi de la conformité

## Authentification

Obligatoire : clé API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corps de la demande

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `sdp` | chaîne | Oui | Offre WebRTC SDP de RTCPeerConnection du client |
| `model` | chaîne | Non | Modèle OpenAI Realtime (par défaut : "gpt-4o-mini-realtime-preview") |
| `voice` | chaîne | Non | Voix à utiliser pour la réponse de l'IA (par défaut : "alliage") |
| `smltp_policy` | chaîne | Non | Politique SMLTP (par défaut : "interne") |
| `output_audio` | booléen | Non | S'il faut activer la sortie audio (par défaut : true) |
| `user_id` | chaîne | Non | ID utilisateur à qui facturer cette session (par défaut, propriétaire de la clé API) |
| `instructions` | chaîne | Non | Instructions système en option pour l'assistant AI |

### Modèles disponibles

- `gpt-4o-mini-realtime-preview`
- `gpt-4o-realtime-preview`

### Voix disponibles

- `alloy` (par défaut)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`
- `ash`
- `ballad`
- `coral`

### Politiques SMLTP disponibles

- `public`
- `internal` (par défaut)
- `internal-strict`
- `confidential`
- `hipaa`
- `gdpr`
- `pci-dss`

## Exemple de demande

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": true,
    "instructions": "You are a helpful customer service agent."
  }'
```

### JavaScript/Node.js

```javascript
// Create WebRTC peer connection
const pc = new RTCPeerConnection();

// Create offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// Send SDP offer to SecureAI
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sdp: offer.sdp,
    model: 'gpt-4o-mini-realtime-preview',
    voice: 'alloy',
    smltp_policy: 'internal',
    output_audio: true,
    instructions: 'You are a helpful customer service agent.'
  })
});

// Get SDP answer
const sdpAnswer = await response.text();

// Set remote description
await pc.setRemoteDescription(new RTCSessionDescription({
  type: 'answer',
  sdp: sdpAnswer
}));

// Now you can have real-time voice conversations
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/speech/s2s/webrtc"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n...",
    "model": "gpt-4o-mini-realtime-preview",
    "voice": "alloy",
    "smltp_policy": "internal",
    "output_audio": True,
    "instructions": "You are a helpful customer service agent."
}

response = requests.post(url, headers=headers, json=data)
sdp_answer = response.text
print('SDP Answer:', sdp_answer)
```

## Réponse

### Réponse réussie (200)

**Type de contenu** : `application/sdp`

La réponse est une chaîne de réponse SDP qui peut être utilisée avec `RTCPeerConnection.setRemoteDescription()`.

```
v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

## Réponses d'erreur

### 400 Requête incorrecte

```json
{
  "success": false,
  "error": "Invalid SDP offer",
  "message": "SDP offer is required and must be a string",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 403 Interdit

#### Délai S2S atteint

```json
{
  "success": false,
  "error": "S2S time limit reached",
  "message": "Insufficient S2S time remaining for this user",
  "remaining_minutes": 0,
  "next_renewal_date": "2024-12-01T12:55:35.721Z",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

#### Échec de la validation du modèle

```json
{
  "success": false,
  "error": "Model validation failed",
  "message": "Model gpt-4o-mini-realtime-preview is not allowed by SMLTP policy test-policy-active",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

### 500 Erreur de serveur interne

```json
{
  "success": false,
  "error": "S2S WebRTC failed",
  "message": "An error occurred while processing your request",
  "request_id": "96bba6a4-0e7a-4fd7-93a7-3b40428729fb"
}
```

## Remarques

- L'offre SDP doit être une chaîne d'offre WebRTC SDP valide
- Après avoir reçu la réponse SDP, utilisez-la pour définir la description distante sur votre RTCPeerConnection
- Vérifiez l'état de l'heure S2S avant de lancer des sessions à l'aide de `/speech/s2s/status`
- Durée de la session de journalisation une fois terminée à l'aide de `/speech/s2s/log-session`
- Toutes les demandes sont traitées via SMLTP pour des raisons de sécurité et de conformité
- Le paramètre `user_id` permet la facturation sur un autre compte utilisateur