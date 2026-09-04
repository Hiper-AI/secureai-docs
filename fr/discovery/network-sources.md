---
sidebar_position: 3
title: "Sources réseau"
sidebar_label: "Sources réseau"
description: "Découverte Shadow-AI — quelles adresses IP sources d'entreprise et quels utilisateurs appellent les API LLM, à partir de vos journaux CASB/SWG"
---
# Sources réseau

**Sources réseau** (Admin → Registre d'agent → **Réseau**) fait apparaître l'IA fantôme trouvée dans vos journaux CASB/SWG : quelles **IP sources d'entreprise et quels utilisateurs appellent les API LLM**, même si aucun SDK ou [agent de point final](/fr/agent/overview) n'est déployé. Il est alimenté par les [connecteurs CASB & Réseau](/fr/integrations/casb/overview) — Cisco Umbrella, Zscaler et autres.

## La fenêtre de découverte

L'activité est signalée sur une fenêtre continue — **30 jours par défaut** (configurable via `NETWORK_DISCOVERY_WINDOW_DAYS`). Quelques sous-vues (principaux domaines, principaux utilisateurs, domaines inconnus) utilisent une fenêtre fixe de 7 jours. Lors de la première connexion, un connecteur exécute un remplissage en arrière-plan afin que l'historique soit disponible immédiatement.

## Ce que montre chaque source

| Champ | Descriptif |
|-------|-------------|
| **IP source** | L'appareil/la charge de travail de l'entreprise effectuant des appels IA. |
| **Utilisateur/passerelle** | L'identité de l'utilisateur principal ou de la passerelle, lorsque le connecteur la fournit. |
| **Total des appels** | Volume d'appel dans la fenêtre. |
| **Top domaine/fournisseurs** | La destination IA la plus touchée et l'ensemble des fournisseurs. |
| **Gravité** | `critical` / `high` / `medium` / `low`. |
| **Domaines de menace** | Un badge lorsqu'une source atteint des destinations à risque. |
| **Inscrit** | Si la source a été triée/enregistrée. |

L'exploration d'une source affiche un tableau par observation (domaine, fournisseur, connecteur, appels, utilisateur, dernière visite).

## Workflow de tri

- **Enregistrez** une source que vous reconnaissez (elle devient une partie de votre inventaire connu), ou **élevez-la** pour un suivi.
- **Ignorer/ignorer** les sources attendues/bruit.
- Examinez la file d'attente **domaines inconnus** pour classer les destinations IA que le catalogue n'a pas reconnues.
- Explorez **analytics** et la vue **topologie** pour les modèles à l'échelle de l'organisation.
- Exporter au format CSV.

## Synchronisation

Exécutez **Sync** par connecteur ou **Sync All** ; les connecteurs se synchronisent également selon un calendrier (par défaut toutes les 30 minutes). La progression du remplissage et l’obsolescence du connecteur sont affichés en ligne. La configuration du connecteur se trouve dans **Admin → Intégrations → Réseau**.

## Connexes

- [Intégrations CASB & Network (SWG)](/fr/integrations/casb/overview) — connectez les sources des logs.
- [Endpoint Agent](/fr/agent/overview) — pour les points de terminaison que vous pouvez gérer directement.
- [Aperçu de la découverte et de l'inventaire de l'IA](/fr/discovery/overview)