---
sidebar_position: 1
title: "Présentation des fournisseurs d'IA cloud"
sidebar_label: "Aperçu"
description: "Connectez vos plateformes d'IA OpenAI, Anthropic, Azure, AWS et GCP afin que SecureAI puisse inventorier les agents, les modèles, les identités, l'utilisation et les coûts."
---
# Fournisseurs d'IA cloud

Les connecteurs Cloud AI Provider permettent à SecureAI d'accéder aux plates-formes d'IA que votre organisation utilise déjà (**OpenAI Platform, Anthropic Console, Azure AI Foundry et Google Vertex AI**) et d'inventorier automatiquement tout ce qui y est exécuté. Aucun agent ou SDK ne doit être déployé du côté du fournisseur ; SecureAI interroge l'API de gestion de chaque fournisseur avec les informations d'identification en lecture principalement que vous fournissez.

Une fois connecté, un connecteur découvre et synchronise en continu :

- **Agents, modèles et déploiements** exécutés sur la plateforme → affichés dans [Cloud Sensors](/fr/en/discovery/cloud-sensors).
- **Identités non humaines (NHI)** — Clés API, comptes de service et (lorsque pris en charge) clés BYOK → affichées dans [Inventaire NHI](/fr/en/discovery/nhi-inventory), avec contrôles de blocage/révoquer.
- **Utilisation, jetons et coût** au cours des 30 derniers jours.
- **Signaux de gouvernance** — Les liaisons IAM/RBAC, les limites de dépenses et les journaux d'audit sont apparus dans les informations par fournisseur.

## La boucle de configuration

Chaque fournisseur suit les quatre mêmes étapes :

1. **Ouvrez Admin → Intégrations** et sélectionnez la catégorie **Cloud**.
2. **Connectez** la carte du fournisseur et saisissez ses identifiants (voir la page de chaque fournisseur).
3. **Testez** la connexion pour valider les informations d'identification.
4. **Sync** : la première synchronisation exécute une importation complète ; les synchronisations suivantes sont incrémentielles et s'exécutent également selon un calendrier.

<Info>
**Là où les choses apparaissent**

Le connecteur **configuration** se trouve dans **Admin → Intégrations**. L'**inventaire** qu'il produit apparaît dans **Admin → Agent Registry** : agents/modèles découverts sous [Cloud Sensors](/fr/en/discovery/cloud-sensors), et identités découvertes sous [NHI Inventory](/fr/en/discovery/nhi-inventory). Vous pouvez réexécuter une synchronisation à partir de n’importe quel endroit.
</Info>

## Choisir les identifiants

Utilisez les informations d'identification **en lecture seule/de visualisation** dans la mesure du possible — SecureAI n'a besoin que de *lire* votre inventaire pour créer une image. Certaines fonctionnalités facultatives (révocation d'une clé divulguée, création d'une alerte de dépense) nécessitent des autorisations d'écriture supplémentaires ; chaque page du fournisseur les mentionne explicitement et ils sont toujours facultatifs.

Tous les secrets que vous saisissez (secrets client, JSON du compte de service, clés API d'administrateur) sont **chiffrés au repos**.

## Guides des fournisseurs

| Fournisseur | Type d'identifiant |
|--------------|-----------------|
| [Plateforme OpenAI](/fr/en/integrations/cloud/openai-platform) | Clé API d'administration de l'organisation |
| [Console Anthropique](/fr/en/integrations/cloud/anthropic-console) | Clé API d'administration (+ espace de travail / clés de conformité facultatives) |
| [Azure AI Foundry](/fr/en/integrations/cloud/azure-ai-foundry) | Principal du service Entra (locataire/client/secret) |
| [Google Vertex AI](/fr/en/integrations/cloud/gcp-vertex-ai) | Compte de service JSON |

## Connexes

- [Cloud Sensors](/fr/en/discovery/cloud-sensors) — l'inventaire des agents/modèles découverts.
- [NHI Inventory](/fr/en/discovery/nhi-inventory) — l'inventaire des identités découvertes et les contrôles de révocation.
- [Aperçu de la découverte et de l'inventaire de l'IA](/fr/en/discovery/overview)