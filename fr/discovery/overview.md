---
sidebar_position: 1
title: "Aperçu de la découverte et de l'inventaire de l'IA"
sidebar_label: "Aperçu"
description: "Comment SecureAI découvre et inventorie chaque agent, modèle, identité et source d'IA fantôme au sein de votre organisation"
---
# Découverte et inventaire de l'IA

SecureAI crée un inventaire unique et continuellement mis à jour de l'IA de votre organisation : les agents et les modèles que vous exécutez, les identités qui se cachent derrière eux et l'IA fantôme dont vous ignoriez l'existence. Il le fait à partir de **trois signaux de découverte complémentaires**, tous apparus sous **Admin → Agent Registry**.

## Les trois signaux

| Signalisation | Voit | Alimenté par |
|--------|------|--------|
| **API Cloud** | Agents, modèles, déploiements et identités au sein de vos plateformes d'IA. | Connecteurs [Cloud AI Provider](/fr/en/integrations/cloud/overview) → [Cloud Sensors](/fr/en/discovery/cloud-sensors) |
| **Réseau / CASB** | IP sources d’entreprise appelant des API LLM, sans agent installé. | Connecteurs [CASB / SWG](/fr/en/integrations/casb/overview) → [Sources réseau](/fr/en/discovery/network-sources) |
| **Agent de point de terminaison** | Activité AI/MCP sur les ordinateurs portables et serveurs gérés. | [Agent OS](/fr/en/agent/overview) |

Les identités découvertes sur tous les signaux sont regroupées dans l'[Inventaire NHI](/fr/en/discovery/nhi-inventory), et les agents logiques/chatbots que vous gouvernez vivent dans le [Registre des agents](/fr/en/discovery/agent-registry).

## Les onglets d'inventaire

Sous **Admin → Agent Registry**, vous trouverez :

- **[Cloud Sensors](/fr/en/discovery/cloud-sensors)** — agents et modèles découverts dans le cloud.
- **[Network Sources](/fr/en/discovery/network-sources)** — sources shadow-AI trouvées dans les journaux CASB/SWG.
- **[NHI Inventory](/fr/en/discovery/nhi-inventory)** — identités non humaines (clés, comptes de service) avec contrôles de blocage/révoquer.
- **[Agent Registry](/fr/en/discovery/agent-registry)** — métadonnées de gouvernance pour vos agents IA logiques et vos chatbots.

## Pourquoi c'est important

Vous ne pouvez pas gouverner ce que vous ne pouvez pas voir. Discovery vous donne le dénominateur : chaque point de terminaison du modèle, chaque clé, chaque appareil ou charge de travail touchant l'IA. Ainsi, la politique, le contrôle des coûts et la réponse aux incidents s'appliquent à *l'ensemble* de votre patrimoine, et pas seulement aux parties qui ont été déclarées.

## Connexes

- [Fournisseurs Cloud AI](/fr/en/integrations/cloud/overview)
- [CASB & Réseau (SWG)](/fr/en/integrations/casb/overview)
- [Agent Endpoint](/fr/en/agent/overview)