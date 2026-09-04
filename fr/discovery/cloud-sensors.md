---
sidebar_position: 2
title: "Capteurs de nuage"
sidebar_label: "Capteurs de nuage"
description: "L'inventaire en lecture seule des agents et des modèles découverts au sein de vos plateformes cloud d'IA connectées"
---
# Capteurs cloud

**Cloud Sensors** (Admin → Agent Registry → **Cloud**) est l'inventaire des agents, modèles et déploiements découverts au sein de vos plateformes d'IA cloud connectées : **Azure AI Foundry, AWS Bedrock, GCP Vertex AI, OpenAI Platform et Anthropic Console**. C'est en lecture seule : vous configurez les connecteurs dans [Intégrations](/fr/integrations/cloud/overview) et Cloud Sensors affiche ce qu'ils ont trouvé.

## KPI

| KPI | Signification |
|-----|---------|
| **Fournisseurs connectés** | Combien de fournisseurs de cloud sont configurés et connectés. |
| **Agents découverts** | Total des agents/modèles actuellement visibles parmi les fournisseurs. |
| **Agents cloud actifs** | Agents toujours présents dans la dernière découverte. |
| **Retrait automatique** | Agents supprimés suite à une découverte récente (ils ont disparu du fournisseur). |

Chaque KPI comporte une sparkline de 30 jours construite à partir de l'historique de synchronisation.

## La table d'inventaire

| Colonne | Descriptif |
|--------|-------------|
| **Agent** | Nom de l'agent/du modèle découvert. |
| **Fournisseur** | Azure / AWS / GCP / OpenAI / Anthropique. |
| **Espace de travail/Déploiement** | Où il réside chez le fournisseur. |
| **Modèle** | Modèle sous-jacent. |
| **Statut** | `observed`, `active` ou `retired` (avec un suffixe `· auto` en cas de retrait automatique par découverte). |
| **Dernière découverte** | Quand il a été vu pour la dernière fois. |

Filtrer par fournisseur, statut ou recherche en texte libre ; exportez les lignes visibles au format CSV.

## Synchronisation

Exécutez **Sync** pour un seul fournisseur ou **Sync All**. Chaque fournisseur expose également une boîte de dialogue **Insights** (utilisation, coût, détails de gouvernance spécifiques à ce fournisseur). Les informations d'identification et la configuration du connecteur se trouvent dans **Admin → Intégrations → Cloud** : cet onglet y renvoie et l'état vide vous y dirige.

## Connexes

- [Cloud AI Providers](/fr/integrations/cloud/overview) — connectez et configurez les fournisseurs.
- [NHI Inventory](/fr/discovery/nhi-inventory) — identités découvertes par les mêmes connecteurs.
- [Aperçu de la découverte et de l'inventaire de l'IA](/fr/discovery/overview)