---
sidebar_position: 7
title: "Proxy transparent (routage AI)"
sidebar_label: "Proxy transparent"
description: "Acheminer le trafic IA du développeur (par exemple Claude Code) via la passerelle SecureAI à partir du point de terminaison"
---
# Proxy transparent (routage AI)

L'agent peut acheminer de manière transparente le trafic IA d'un développeur — par exemple [Claude Code](/fr/integrations/ide-claude-code) — via la passerelle SecureAI. Cela place l’utilisation de l’assistant de codage sous la même gouvernance, le même suivi des coûts et la même politique que le reste de votre parc d’IA, sans que le développeur ne modifie ses outils.

## Comment ça marche

Le routage est configuré par [policy](/fr/agent/policies-and-groups) via `claudeCodeRouting` :

| Paramètre | Descriptif |
|---------|-------------|
| **Activé** | Activez le routage pour les appareils soumis à cette stratégie. |
| **Verrouiller** | `user` (le développeur peut basculer), `force_on` (toujours acheminé) ou `force_off` (jamais acheminé). |
| **Mappages de modèles** | Mappage par famille pour `opus` / `sonnet` / `haiku` avec le modèle réellement servi. |
| **Verrouillage du modèle** | `user` ou `force` — indique si le développeur peut modifier le mappage. |

Lorsque le routage est activé, SecureAI **crée une clé API par appareil** et l'injecte dans l'environnement du point de terminaison (par exemple sous la forme `ANTHROPIC_AUTH_TOKEN`) via la configuration du proxy transparent. L'utilisation est **facturée sur le compartiment de points du développeur lié**, assurez-vous donc que l'appareil est lié à un utilisateur propriétaire (voir [Inscription et packages](/fr/agent/enrollment-and-packages)).

## Valeurs par défaut à l'échelle de la flotte

Les paramètres par défaut de la passerelle peuvent être définis une fois pour la flotte — `anthropicBaseUrl`, `openaiBaseUrl`, le jeton d'authentification et un verrou — et hérités par les appareils. L'agent indique si le proxy est actuellement activé ou désactivé, et ces transitions sont auditées.

## Pourquoi router au lieu de bloquer

Pour l'IA des développeurs sanctionnés, le routage via la passerelle est généralement préférable à un [blocage de sortie](/fr/agent/egress-enforcement) : le développeur continue de travailler, tandis que vous bénéficiez de l'application des politiques, de l'attribution des coûts et de l'audit de ce trafic. Réservez le blocage/verrouillage aux fournisseurs non autorisés.

## Connexes

- [Egress Enforcement](/fr/agent/egress-enforcement)
- [Politiques & Groupes](/fr/agent/policies-and-groups)
- [Présentation d'AI Gateway](/fr/ai-gateway/overview)
- [Intégration de l'EDI Claude Code](/fr/integrations/ide-claude-code)