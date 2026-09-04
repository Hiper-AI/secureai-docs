---
title: "Reçus de conformité"
sidebar_label: "Recettes"
description: "Récupérez le reçu de conformité SMLTP signé pour un achèvement"
openapi: "GET /receipts/{bundleId}"
---
# Reçus de conformité

Lorsqu'une finalisation est acheminée via la **passerelle SMLTP**, SecureAI produit un **reçu** de conformité signé — preuve cryptographique de la politique qui régissait l'appel. Ce point de terminaison récupère ce reçu par son identifiant de bundle.

Les reçus existent uniquement pour les déploiements acheminés par passerelle. Sur les déploiements de fournisseurs directs, il n'existe aucune passerelle pour signer les reçus et ce point de terminaison renvoie `404`.

## Point de terminaison

```
GET /receipts/:bundleId
```

## D'où vient l'identifiant du bundle

Les réponses d'achèvement exposent l'ID du bundle chaque fois qu'un droit SMLTP est créé pour l'appel :

- Point de terminaison classique : `metadata.smltp.bundle_id` (et un `metadata.smltp.receipt_url` prêt à l'emploi).
- Point de terminaison compatible OpenAI : `secureai.smltp_bundle_id`.

L'identifiant du bundle (un identifiant de droit tel que `jti-…`) est renvoyé même sur les déploiements natifs/fournisseur direct. Cependant, le **reçu signé** à cet identifiant n'existe que lorsque le trafic est acheminé via la passerelle SMLTP — sur les déploiements directs, ce point de terminaison renvoie `404` (voir ci-dessous).

## Authentification

```bash
Authorization: Bearer sk-your-api-key-here
```

## Exemple de demande

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponse

### 200 OK

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

L'objet `receipt` est la charge utile signée émise par la passerelle. Voir [SMLTP Security](/fr/security/smltp) pour savoir comment les reçus s'intègrent dans le modèle de transparence et d'audit.

### 404 Introuvable

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 Requête incorrecte

Renvoyé lorsque l’identifiant du bundle est manquant ou comporte plus de 128 caractères.

## Remarques

- Les reçus sont conservés dans la mémoire en mémoire de la passerelle pendant une durée limitée. Pour une preuve à long terme, comptez sur le **journal d'audit chaîné par hachage** — l'enregistrement faisant autorité et immuable. Voir [Journaux immuables](/fr/security/immutable-logs).
- Tous les déploiements ne passent pas par la passerelle ; traitez un `404` comme « aucun reçu de passerelle pour cet appel », et non comme une erreur dans votre intégration.

## Connexes

- [Sécurité SMLTP](/fr/security/smltp)
- [Journaux immuables](/fr/security/immutable-logs)
- [Achèvement du chat](/fr/api/chat/completions)