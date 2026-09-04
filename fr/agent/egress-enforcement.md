---
sidebar_position: 5
title: "Application de la sortie"
sidebar_label: "Application de la sortie"
description: "Contrôlez ou bloquez le trafic IA sortant des points de terminaison avec l'agent SecureAI OS"
---
# Application de la sortie

L'application de la sortie contrôle ce qu'un point de terminaison est autorisé à envoyer **out** aux fournisseurs d'IA et aux serveurs MCP. Il est configuré par [politique](/fr/agent/policies-and-groups) et appliqué localement par l'agent.

## Modes

| Mode | Comportement |
|------|----------|
| **éteint** | Aucune application de sortie – découverte/surveillance uniquement. |
| **tuer** | Mettez fin au processus incriminé lorsqu'il effectue un appel AI non autorisé (ancienne valeur par défaut). |
| **bloquer** | Blocage réseau durable de la connexion (Windows Filtering Platform), laissant le processus en cours d'exécution. |
| **confinement** | Refus par défaut : tout est bloqué, sauf les destinations figurant sur une **liste autorisée** explicite. |

## Contrôles supplémentaires

| Contrôle | Descriptif |
|---------|-------------|
| **Liste verte** | Dans `lockdown`, l'ensemble des destinations qui restent autorisées. |
| **Bloquer le MCP distant** | Empêche le point de terminaison d’atteindre les serveurs MCP distants. |

La configuration résolue est transmise à chaque appareil sous le nom `egressEnforcement: { mode, allowList, blockRemoteMcp }` et réévaluée à chaque battement de cœur.

## Choisir un mode

- Commencez en **off** (ou en mode **monitor**) pour créer une image précise de ce que le point de terminaison appelle réellement — visible dans le tiroir de l'appareil et dans [AI Discovery](/fr/discovery/overview).
- Passez à **block** pour arrêter durablement la sortie d'IA non autorisée sans perturber le reste de la mise en réseau du processus.
- Utilisez **kill** là où vous souhaitez que le programme incriminé s'arrête complètement.
- Utilisez le **verrouillage** pour la posture la plus stricte : seuls vos points de terminaison d'IA sanctionnés (la liste verte) sont accessibles.

Les modes de sortie sont également regroupés dans les [préréglages de protection](/fr/agent/policies-and-groups#protection-presets) (Passif / Normal / Agressif), afin que vous puissiez définir un niveau de posture complet en un clic et affiner à partir de là.

<Warning>
`kill`, `block` et `lockdown` interrompent activement le trafic des points de terminaison. Validez un changement avec une **simulation à sec** et des **anneaux de déploiement** par étapes ([Policies & Groups](/fr/agent/policies-and-groups#safe-rollouts)) avant de l'appliquer à l'ensemble du parc.
</Warning>

## Connexes

- [Politiques & Groupes](/fr/agent/policies-and-groups)
- [Transparent Proxy](/fr/agent/transparent-proxy) — achemine le trafic IA autorisé via la passerelle au lieu de le bloquer.
- [Quarantine & Fleet Ops](/fr/agent/quarantine-and-fleet-ops)