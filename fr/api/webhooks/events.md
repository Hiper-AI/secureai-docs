---
sidebar_position: 2
title: "Événements Webhook"
sidebar_label: "Événements"
description: "Le catalogue d'événements du webhook SecureAI"
---
# Événements Webhook

Lors de la création ou de la mise à jour d'un [point de terminaison webhook](/fr/api/webhooks/overview), vous l'abonnez à un ou plusieurs types d'événements. Utilisez `"*"` pour recevoir chaque événement.

## Catalogue d'événements

| Événement | Se déclenche lorsque |
|-------|---------------|
| `*` | Wildcard : s'abonne à **tous** les événements ci-dessous. |
| `promptshield:attack:blocked` | Prompt Shield a bloqué une tentative d'injection d'invite/de jailbreak. |
| `promptshield:attack:detected` | Prompt Shield a signalé une invite suspecte (détectée mais non bloquée). |
| `promptshield:canary:leaked` | Un jeton Canary a été trouvé dans la sortie du modèle (invite système/signal d'exfiltration de données). |
| `dlp:incident` | Une règle de prévention contre la perte de données correspond. |
| `pii:incident` | Les informations personnelles ont été détectées/expurgées. |
| `api:limit_reached` | Une clé API atteint une limite quotidienne/mensuelle/tarive. |
| `api:model_failover` | Une chaîne de [redondance](/fr/api/redundancy) basculée d'un modèle à un autre. |

L'abonnement à un nom d'événement inconnu est rejeté au moment de la création/mise à jour.

## Enveloppe de charge utile

Chaque livraison partage la même enveloppe ; l'objet `data` est spécifique à un événement.

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "api:model_failover",
  "created": 1705312200,
  "data": {
    "failedModel": "openai/gpt-5-nano",
    "reason": "timeout",
    "nextModel": "anthropic/claude-sonnet-4",
    "latencyMs": 30011,
    "userId": "60a7c8f5e8b4f5001f7a8c23",
    "apiKeyId": "6512ab..."
  }
}
```

## Test des livraisons

Le bouton **Envoyer un événement de test** (ou `POST /api/admin/webhooks/:id/test`) génère un événement `webhook:test` afin que vous puissiez confirmer votre destinataire et la vérification de votre signature avant de passer en ligne :

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## Connexes

- [Webhooks Overview](/fr/api/webhooks/overview) — format de livraison, vérification de signature, fiabilité.