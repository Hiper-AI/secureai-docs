---
sidebar_position: 3
title: "Forfaits d’inscription et d’installation"
sidebar_label: "Inscription et forfaits"
description: "Fonctionnement des packages d'installation, des clés d'inscription et des jetons d'appareil de SecureAI OS Agent"
---
# Forfaits d'inscription et d'installation

Un **package d'installation** est l'unité que vous créez pour déployer l'agent. Il regroupe la plate-forme, les balises et le groupe qu'un appareil doit rejoindre, ainsi qu'une clé d'inscription dédiée — de sorte que la commande d'installation est autonome.

## Création d'un package

Dans **Admin → Agent Registry → OS Agents**, créez un package avec :

| Champ | Descriptif |
|-------|-------------|
| **Nom/description** | Identifiez le package (par exemple « Ordinateurs portables d'ingénierie »). |
| **Plateforme** | Windows/Linux/MacOS. |
| **Type de forfait** | `standalone`. |
| **Balises de point de terminaison** | Étiquettes appliquées aux appareils inscrits avec ce package. |
| **Groupe d'inscription** | Le [groupe](/fr/en/agent/policies-and-groups) auquel un appareil est épinglé lors de la première inscription. |

Lors de l'enregistrement, SecureAI **génère automatiquement une clé API dédiée dont la portée est `agent:enroll`** et la stocke en tant que clé d'inscription du package, de sorte que la commande d'installation ne nécessite aucun identifiant distinct. La suppression du package désactive cette clé.

## Groupes d'inscription (épinglage automatique)

Le **groupe d'inscription** du package est une épingle fixe : un appareil qui s'inscrit avec le package est lié à ce groupe au premier contact. L’appartenance au groupe détermine ensuite la [politique](/fr/en/agent/policies-and-groups) que l’appareil résout.

## La poignée de main d'inscription

Lorsque l'agent s'exécute pour la première fois, il appelle `POST /enroll` à l'aide de la clé d'inscription et envoie son identifiant d'ordinateur, son nom d'hôte, son système d'exploitation, son architecture, sa version, son empreinte digitale et ses fonctionnalités. Le back-end :

1. Enregistre (ou fait correspondre) l'appareil.
2. Émet un **jeton par appareil**, affiché une fois, qui authentifie tous les appels ultérieurs.
3. Renvoie la **configuration** d'exécution (politique résolue, paramètres de sortie, routage, etc.).

Le jeton par appareil **tourne à chaque inscription**. Un appareil qui a été **révoqué** ne peut pas se réinscrire : la réponse d'inscription signale `revoked: true` et l'appareil reste coupé jusqu'à ce qu'un administrateur le réactive.

## Résolution d'URL back-end

L'agent appelle chez lui à `BACKEND_URL`. Côté serveur, l'URL effective est résolue à partir des en-têtes transférés/origine de la demande et peut être remplacée par la variable d'environnement `SECUREAI_AGENT_URL`, qui est utile derrière les proxys inverses.

## Gestion des appareils inscrits

Depuis l'onglet Agents du système d'exploitation, vous pouvez, par appareil : envoyer une commande, **révoquer** / **réactiver**, supprimer, attribuer un groupe et lier/dissocier un utilisateur propriétaire. Les opérations groupées sont prises en charge. La livraison des commandes s'effectue via un canal WebSocket avec un repli de la file d'attente de battements de cœur (les commandes mises en file d'attente lorsqu'un appareil est hors ligne sont livrées lors de son battement de cœur suivant, avec un TTL d'une heure).

## Connexes

- [Installation de l'Agent](/fr/en/agent/installation)
- [Politiques & Groupes](/fr/en/agent/policies-and-groups)
- [Auto-mise à jour et anti-altération](/fr/en/agent/quarantine-and-fleet-ops#self-update--anti-tamper)