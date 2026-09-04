---
sidebar_position: 4
title: "Inventaire des NHI"
sidebar_label: "Inventaire des NHI"
description: "Inventoriez et gérez les identités non humaines (clés API et comptes de service) derrière vos agents IA et vos charges de travail"
---
# Inventaire NHI

L'**Inventaire NHI** (Administrateur → Registre des agents → **Identités non humaines**) est l'inventaire des informations d'identification de la machine derrière votre IA : les clés API, les comptes de service et les clés BYOK que les agents, les serveurs MCP et les charges de travail utilisent. Il regroupe les identités découvertes par chaque connecteur [Cloud AI Provider](/fr/integrations/cloud/overview), évalue leur risque et vous donne des contrôles pour les bloquer ou les révoquer.

## Ce que montre chaque identité

- **Provider** (SecureAI / OpenAI / Anthropic / Azure / GCP / AWS) et **type** (agent / mcp / workload).
- **Score de risque** (0-100) avec facteurs contributifs (voir ci-dessous).
- Puce ** Verdict SMLTP ** (bloquée / appliquée / surveillée) et nombre de reçus.
- **Utilisé par**, **dernière utilisation** (jours d'inactivité), **rotation** et un **compte à rebours d'expiration**.
- **Statut** : sain / remédiation / critique.

## Niveaux de contrôle

Tout ce que vous pouvez *faire* sur une identité dépend de la manière dont elle a été découverte :

| Niveau | Qu'est-ce que cela signifie | Action disponible |
|-------|---------------|------------------|
| **Géré** | Une identité émise par SecureAI (non cloud). | **Bloquer/Débloquer** au niveau de la passerelle : refuse ou restaure toute demande authentifiée par cette identité et envoie la liste de révocation de la passerelle. |
| **Révocable** | Découvert dans le cloud **et** exécutoire à la source. | **Révoquer** — le cadenas ("candadito") : supprime/désactive la clé **chez le fournisseur**. Irréversible; marque l'identité bloquée/critique. |
| **Moniteur uniquement** | Découvert dans le cloud mais non applicable. | Lecture seule. La dormance seule ne le fait jamais passer au niveau critique (elle ajoute un petit facteur de risque lié au moniteur uniquement). |

### Quels nuages sont révocables

| Type d'identité | Révocable à la source | Moniteur uniquement |
|---------------|-----------|--------------|
| **Clés API** | OpenAI, Anthropique, GCP, Azure, AWS | — |
| **Comptes de service/clés BYOK** | Anthropique, GCP, Azure | OpenAI, AWS |

## Actions

| Actions | Effet |
|--------|--------|
| **Bloquer/Débloquer** | Demandes de refus/restauration authentifiées par la clé SecureAI d'une identité gérée (liste de révocation de passerelle). |
| **Révoquer** | Coupez une identité révocable chez le fournisseur. Nécessite que l'identité soit exécutoire avec un identifiant externe ; sinon, renvoie "non révocable à la source". |
| **Marque pivotée** | Enregistrez qu'une clé a été tournée. |
| **Enregistrer/faire pivoter la clé de signature** | Gérez les clés de signature SET pour l’identité. |

## Notation des risques

Le balayeur de gouvernance calcule un score composite de 0 à 100 à partir de facteurs tels que : dormant/dormant-critique, rotation en retard/rotation critique, expiré/expirant bientôt, étendues larges, aucun propriétaire, réactivé et moniteur uniquement. La réactivation d’une identité précédemment dormante déclenche une alerte.

## Connexes

- [Cloud AI Providers](/fr/integrations/cloud/overview) — la source des identités découvertes.
- [Capteurs Cloud](/fr/discovery/cloud-sensors)
- [Aperçu de la découverte et de l'inventaire de l'IA](/fr/discovery/overview)