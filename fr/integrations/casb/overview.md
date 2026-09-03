---
sidebar_position: 1
title: "Présentation de CASB & Réseau (SWG)"
sidebar_label: "Aperçu"
description: "Découvrez l'IA fantôme à partir de vos journaux CASB / SWG / DNS - quelles sources d'entreprise appellent les API LLM, sans aucun agent requis"
---
# Intégrations CASB et réseau (SWG)

Ces connecteurs résolvent le problème de la **shadow-AI Discovery** : trouver chaque appareil, serveur ou charge de travail d'entreprise qui appelle une API LLM, même ceux sur lesquels vous ne pouvez pas installer de SDK ou d'[endpoint agent](/fr/en/agent/overview) (un serveur de build, un trieur d'entrepôt, l'ordinateur portable d'un entrepreneur). SecureAI lit les journaux que votre plate-forme **CASB / Secure Web Gateway (SWG) / DNS** collecte déjà et détecte le trafic vers les fournisseurs d'IA.

Le résultat est un inventaire en direct de **quelles adresses IP sources et utilisateurs appellent quels fournisseurs d'IA**, apparu dans [Network Sources](/fr/en/discovery/network-sources).

## Connecteurs pris en charge

| Connecteur | Source de données | Statut |
|---------------|-------------|--------|
| [Cisco Umbrella](/fr/en/integrations/casb/cisco-umbrella) | API de reporting de couche DNS v2 | Disponible |

## La boucle de configuration

1. **Admin → Intégrations → Réseau** (catégorie CASB / SWG).
2. **Connectez** le connecteur et saisissez ses identifiants (voir la page de chaque connecteur). Les champs d'URL sont protégés par SSRF et les secrets sont chiffrés au repos.
3. **Testez** la connexion.
4. **Sync** — la première synchronisation lance un **remplissage** en arrière-plan (l'analyse par défaut correspond à la fenêtre de découverte) ; les synchronisations suivantes s'exécutent selon un planning (par défaut toutes les 30 minutes).

## La fenêtre de découverte

La découverte du réseau signale l'activité sur une fenêtre glissante : **30 jours par défaut** (configurable via la variable d'environnement `NETWORK_DISCOVERY_WINDOW_DAYS`). Quelques sous-vues (principaux domaines, principaux utilisateurs, domaines inconnus) utilisent une fenêtre fixe de 7 jours. Voir [Sources réseau](/fr/en/discovery/network-sources) pour savoir comment l'inventaire est présenté et trié.

## Ce qui est détecté

Chaque connecteur compare le trafic à un catalogue organisé de domaines LLM/AI connus et, lorsque la plateforme le prend en charge, à sa catégorie de contenu native « IA générative ». L'activité détectée est regroupée par **IP source** et apparaît avec l'utilisateur appelant, le(s) fournisseur(s) d'IA, le volume d'appels, le domaine principal, une note de **gravité** et un indicateur de **domaine de menace** pour les destinations à risque.

## Connexes

- [Sources réseau](/fr/en/discovery/network-sources) — le workflow d'inventaire et de tri découvert.
- [Endpoint Agent](/fr/en/agent/overview) — pour les points de terminaison sur lesquels vous *pouvez* déployer un agent.
- [Aperçu de la découverte et de l'inventaire de l'IA](/fr/en/discovery/overview)