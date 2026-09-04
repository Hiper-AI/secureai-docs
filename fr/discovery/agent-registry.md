---
sidebar_position: 5
title: "Registre des agents"
sidebar_label: "Registre des agents"
description: "Gouvernez vos agents d'IA logiques et vos chatbots : propriétaires, objectif, niveau d'autonomie, risque et liaisons"
---
# Registre des agents

Le **Agent Registry** (Admin → Agent Registry → **AI Agents**) est l'inventaire de gouvernance de vos agents et chatbots IA **logiques** – les applications et assistants que votre organisation crée et exécute. Il enregistre les métadonnées dont vous avez besoin pour gouverner chacun d'entre eux : à qui appartient-il, à quoi il sert, à quel point il est autonome et à quoi il est connecté.

<Info>
**Pas la flotte de points de terminaison**

Le registre d'agents concerne les agents IA *logiques* (un chatbot de support, un copilote interne). Il est différent de la flotte **OS Agents** : le logiciel SecureAI installé sur les points de terminaison, documenté sous [Endpoint Agent](/fr/agent/overview).
</Info>

## Ce qui est enregistré par agent

| Champ | Descriptif |
|-------|-------------|
| **Propriétaire** | L’utilisateur/l’équipe responsable. |
| **Objectif** | Ce que fait l'agent. |
| **Autonomie** | Niveau **L1–L3**, d'assistance à totalement autonome. |
| **Risque** | Notation du risque de gouvernance. |
| **Fixations** | Serveurs MCP connectés et ensembles de données/bases de connaissances. |
| **Surveillance** | Pour les chatbots, la configuration surveillance/Prompt-Shield. |

## Travailler avec le registre

- **Importer** des agents pour amorcer l'inventaire.
- Examinez les **relations** entre les agents, leurs outils et leurs données.
- **Appliquer l'autonomie suggérée** : acceptez un niveau d'autonomie recommandé pour un agent.
- Enregistrez les chatbots pour la surveillance ; un chatbot vu pour la première fois via l'[API Prompt Shield](/fr/api/threat-defense/prompt-shield) est automatiquement enregistré ici sous le nom `observed` pour votre examen.

## Connexes

- [Endpoint Agent](/fr/agent/overview) — la flotte d'agents au niveau du système d'exploitation (distincte de celle-ci).
- [NHI Inventory](/fr/discovery/nhi-inventory) — les identités avec lesquelles les agents s'authentifient.
- [API Prompt Shield](/fr/api/threat-defense/prompt-shield) — enregistre automatiquement les chatbots.
- [Aperçu de la découverte et de l'inventaire de l'IA](/fr/discovery/overview)