---
sidebar_position: 4
title: "Politiques et groupes"
sidebar_label: "Politiques et groupes"
description: "Configurez ce que l'agent SecureAI OS applique avec des politiques, des groupes, des préréglages de protection et des déploiements sécurisés."
---
# Politiques et groupes

Une **politique** définit ce que l'agent applique ; un **groupe** attribue une stratégie à un ensemble d'appareils. Chaque appareil résout sa politique efficace à chaque battement de cœur, de sorte que les modifications se propagent rapidement.

## Politiques

Une stratégie (`AgentPolicy`) contient :

| Paramètre | Descriptif |
|---------|-------------|
| **Mode** | `monitor` (observer uniquement) ou `block` (appliquer). |
| **Ensembles de règles** | Listes d'autorisation/refus pour `mcps`, `apps`, `providers` et `models`. |
| **Flux de menaces** | Indique si l'appareil consomme le flux des menaces de l'organisation. |
| **Application de la loi sur les sorties** | `off` / `kill` / `block` / `lockdown` (+ liste verte, bloc-distant-MCP). Voir [Egress Enforcement](/fr/en/agent/egress-enforcement). |
| **Garde comportementale** | Surveillance comportementale de l'IA : activée, sensibilité et action par défaut (`alert`, `quarantine`, `kill`, `block`, `require_approval`), pour le point de terminaison et/ou la passerelle. |
| **Routage Claude Code** | Paramètres de proxy transparent. Voir [Proxy Transparent](/fr/en/agent/transparent-proxy). |
| **Protection contre l'effraction** | Exigence de clé de désinstallation (voir ci-dessous). |
| **Déploiement** | Configuration du déploiement par étapes (voir [Déploiements sécurisés](#safe-rollouts)). |

### Préréglages de protection

Plutôt que de régler chaque bouton, vous pouvez choisir un seul préréglage de protection qui regroupe la protection comportementale avec le mode de sortie :

| Préréglage | Comportement |
|--------|----------|
| **Passif** | Observer et alerter ; application minimale. |
| **Normal** | Application équilibrée. |
| **Agressif** | Application stricte (par exemple blocage/quarantaine, sortie plus stricte). |

Les combinaisons non prédéfinies sont affichées comme **Personnalisées**.

## Groupes

Un **groupe** (`AgentGroup`) a un `policyId` plus des **règles d'adhésion** dynamiques — correspondant au système d'exploitation, au modèle global de nom d'hôte et à la priorité. La stratégie efficace d'un appareil est résolue **appareil → groupe → stratégie**, réévaluée à chaque battement de cœur, de sorte que le déplacement d'un appareil entre les groupes (ou la modification des règles d'un groupe) le recible automatiquement.

## Déploiements sécurisés

Les modifications de politique sont transmises via un flux de travail contrôlé afin que vous puissiez les valider avant leur application à l'échelle de la flotte :

- **Révisions et restauration** : chaque modification de politique est versionnée ; revenir à une révision antérieure à tout moment.
- **Anneaux de déploiement** : avancez un changement via des anneaux par étapes (pause/reprise/avancée) au lieu de les effectuer d'un seul coup.
- **Simulation d'exécution à sec** : prévisualisez ce qu'une politique *serait* détecter ou bloquer par rapport à l'inventaire actuel, sans rien enregistrer ni appliquer.
- **Exceptions** — un workflow d'approbation pour les exceptions par appareil/par règle ; en approuver un ajoute une exclusion gérée. L’approbation nécessite le rôle d’administrateur.

## Protection contre la falsification et clé de désinstallation

Une stratégie peut nécessiter une **clé de désinstallation** (`tamperProtection.uninstallRequiresKey`) afin que l'agent ne puisse pas être supprimé par un utilisateur local sans cette clé. L'exigence (et une clé hachée avec un sel/hachage hors ligne) est transmise au point final afin qu'il puisse valider même hors réseau. Les tentatives de désinstallation sont validées via un point de terminaison public de validation de jeton (d'abord par clé de stratégie, puis par repli à l'échelle de la flotte) ; les échecs sont audités. Voir [Auto-mise à jour et anti-altération](/fr/en/agent/quarantine-and-fleet-ops#self-update--anti-tamper).

## Connexes

- [Egress Enforcement](/fr/en/agent/egress-enforcement)
- [Quarantine & Fleet Ops](/fr/en/agent/quarantine-and-fleet-ops)
- [Proxy Transparent](/fr/en/agent/transparent-proxy)