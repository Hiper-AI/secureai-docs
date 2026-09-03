---
sidebar_position: 1
title: "Présentation de l'agent de point de terminaison"
sidebar_label: "Aperçu"
description: "L'agent SecureAI OS – gouvernance de l'IA des points de terminaison, DLP et contrôle de sortie pour les ordinateurs portables et les serveurs"
---
# Agent de point de terminaison

L'agent SecureAI **OS Agent** s'exécute sur vos points de terminaison (ordinateurs portables Windows, serveurs Linux, machines macOS) et applique la gouvernance de l'IA là où le travail se déroule réellement. Il découvre l'activité AI/MCP sur l'appareil, applique des protections contre la perte de données et comportementales, et peut contrôler ou bloquer la sortie vers les fournisseurs d'IA conformément à la politique.

La flotte d'agents est gérée sous **Admin → Agent Registry → OS Agents**.

## Ce que fait l'agent

- **Découvre l'utilisation de l'IA sur l'appareil** : SDK/processus d'IA installés, serveurs MCP et appels de réseau fantôme aux fournisseurs d'IA.
- **Applique la politique** — surveille ou bloque les fournisseurs/modèles/applications/MCP d'IA, applique une surveillance comportementale de l'IA et applique le contrôle de sortie (voir [Egress Enforcement](/fr/en/agent/egress-enforcement)).
- **Protège les données** — inspection DLP/PII du point final.
- **Répond aux menaces** — met en quarantaine les fichiers malveillants et peut isoler un point de terminaison compromis (voir [Quarantine & Fleet Ops](/fr/en/agent/quarantine-and-fleet-ops)).
- **Achemine éventuellement le trafic IA des développeurs** via la passerelle SecureAI (voir [Transparent Proxy](/fr/en/agent/transparent-proxy)).

## Santé et posture de l'appareil

Chaque appareil inscrit signale un état de santé et une posture de sécurité :

| Signalisation | Valeurs |
|--------|--------|
| **Statut** | `healthy`, `stale` (aucun battement de coeur pendant environ 5 minutes), `enrolled`, `paused`, `revoked` |
| **Postures** | `protected`, `at_risk`, `infected` |
| **Score de risque** | 0 à 100, calculé à partir des violations, des menaces et de la configuration |

L'onglet **OS Agents** répertorie chaque appareil avec son état, sa posture, son risque, son système d'exploitation/version, son groupe, sa stratégie active et son propriétaire associé. L'extension d'un appareil affiche les observations récentes du réseau fantôme, l'inventaire MCP, les processus AI-SDK, les violations de stratégie, les connexions bloquées, les éléments de quarantaine, les menaces et l'historique des commandes.

## Comment commencer

1. **[Installer l'agent](/fr/en/agent/installation)** sur les endpoints (MSI signé sous Windows ; script sous Linux/macOS).
2. Comprendre **[packages d'inscription et d'installation](/fr/en/agent/enrollment-and-packages)** — comment les appareils rejoignent et obtiennent leur configuration.
3. Configurez **[policies & groups](/fr/en/agent/policies-and-groups)** pour décider de ce que chaque appareil applique.
4. Réglez **[egressforcement](/fr/en/agent/egress-enforcement)** et **[quarantine & Fleet Ops](/fr/en/agent/quarantine-and-fleet-ops)** pour la réponse.

## Rôles

L'accès général au panneau d'administration vous permet de visualiser et de configurer la flotte. **Les actions destructrices** (mise en quarantaine, suppression de processus/MCP/réseau, isolement et révocation) nécessitent le rôle **admin** système élevé. Voir [Quarantine & Fleet Ops](/fr/en/agent/quarantine-and-fleet-ops).

## Connexes

- [AI Discovery & Inventory](/fr/en/discovery/overview) — l'agent est l'un des trois signaux de découverte.
- [Défense contre les menaces](/fr/en/threat-defense/overview)