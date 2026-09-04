---
sidebar_position: 2
title: "Parapluie Cisco"
sidebar_label: "Parapluie Cisco"
description: "Détecter l'IA fantôme de l'activité DNS de Cisco Umbrella via l'API Reporting v2"
---
# Parapluie Cisco

Connectez Cisco Umbrella pour que SecureAI puisse détecter quelles sources d'entreprise résolvent les domaines LLM/AI, à l'aide de l'**Reporting API v2** d'Umbrella. Umbrella est une source de couche DNS : elle confirme qu'un appareil a *résolu* un domaine d'IA (et non la charge utile TLS complète), ce qui est exactement ce dont la découverte de l'IA fantôme a besoin.

SecureAI exécute deux passes pour une couverture maximale :

1. Une liste organisée de domaines LLM/AI connus.
2. La **catégorie de contenu d'Umbrella `212` ("IA générative")**, de sorte que les nouveaux services d'IA populaires sont détectés avant même d'être dans la liste organisée.

## Prérequis

- Un package Umbrella qui inclut l'**API de reporting** et les journaux d'activité DNS.
- **Identifiants de l'API Umbrella** (clé API + secret) et votre **ID d'organisation**.

## Identifiants

| Champ | Obligatoire | Descriptif |
|-------|----------|-------------|
| `apiKey` | Oui | Clé API de rapport parapluie. |
| `apiSecret` | Oui | Secret de l’API Umbrella Reporting. Chiffré au repos. |
| `orgId` | Oui | Votre identifiant d’organisation faîtière. |

### Où les trouver

1. Connectez-vous au [Tableau de bord Umbrella](https://dashboard.umbrella.com/).
2. Accédez à **Admin → Clés API** et créez une clé avec la portée **Reporting**. Copiez la clé et le secret (affichés une fois).
3. Votre **ID d'organisation** est l'identifiant numérique dans l'URL du tableau de bord (`.../o/<orgId>/#/...`).

SecureAI s'authentifie avec `POST https://api.umbrella.com/auth/v2/token` (Basic `apiKey:apiSecret`, `client_credentials`) et lit `GET /reports/v2/activity/dns`.

## Se connecter

1. **Admin → Intégrations → Réseau → Cisco Umbrella → Connect.**
2. Saisissez la clé API, le secret et l'ID de l'organisation.
3. **Testez**, puis **Enregistrez**.
4. **Sync** : la première synchronisation remplit l'activité DNS récente en arrière-plan.

## Remarques

- Umbrella est une **couche DNS** : une correspondance confirme la résolution du domaine, pas un appel API terminé. Il est idéal pour la largeur (chaque appareil derrière Umbrella) mais ne transporte pas de charges utiles de requête.
- Si la sortie Umbrella doit passer par un proxy, définissez `UMBRELLA_PROXY_URL` (ou le standard `HTTPS_PROXY`) sur le backend SecureAI.

## Vérifier

Après la première synchronisation, ouvrez [Sources réseau](/fr/discovery/network-sources) — les sources qui ont résolu les domaines IA apparaissent avec leur(s) fournisseur(s), le nombre d'appels et la gravité.

## Connexes

- [CASB & Présentation du réseau](/fr/integrations/casb/overview)
- [Sources réseau](/fr/discovery/network-sources)