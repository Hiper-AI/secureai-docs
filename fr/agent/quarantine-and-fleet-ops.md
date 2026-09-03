---
sidebar_position: 6
title: "Quarantaine et opérations de flotte"
sidebar_label: "Quarantaine et opérations de flotte"
description: "Répondez aux menaces sur les points finaux : mise en quarantaine, restauration, isolement, incidents et opérations à l'échelle de la flotte"
---
# Quarantaine et opérations de flotte

Au-delà de l'application, la flotte d'agents dispose d'une couche de réponse et d'opérations : quarantaine et restauration, isolation des points de terminaison, salle de guerre des incidents, coffre-fort de quarantaine, réglage des menaces et tableau de bord de la flotte.

## Commandes et rôles de l'appareil

Les commandes de périphérique destructrices nécessitent le rôle **admin** système élevé (plus strict que l'accès général au panneau d'administration) :

| Commande | Effet |
|---------|--------|
| `quarantine` | Déplace et chiffre un fichier malveillant et tue son arborescence de processus. **Destructeur.** |
| `kill_process` / `kill_mcp` / `kill_network` | Terminez un processus, un serveur MCP ou une connexion réseau. |
| `isolate` / `unisolate` | Coupez le point final du réseau / restaurez-le. |
| `revoke` | Révoquer l'appareil (il ne peut plus s'inscrire ni appeler chez lui). |

`restore` (récupération d'un fichier mis en quarantaine) est une action de récupération et est disponible pour tout opérateur administrateur. L'agent confirme les résultats de quarantaine/restauration au backend.

## Coffre-fort de quarantaine

Les éléments mis en quarantaine sont conservés dans un **coffre** avec une période de conservation configurable (**30 jours** par défaut). À partir du coffre-fort, vous pouvez filtrer par machine, gravité, état restauré/révisé, marquer les éléments examinés et **restaurer** les éléments en masse.

## Réglage des menaces

La **file d'attente de révision** collecte les fichiers auto-mis en quarantaine et les suppressions automatiques de politiques récentes en attente d'un examen humain faussement positif, chaque ligne contenant la politique résolue de l'appareil afin que vous puissiez régler la bonne règle. À partir d'un incident, vous pouvez **bloquer** ou **mettre en liste blanche** une détection — globalement dans le catalogue de l'organisation ou étendue à une stratégie.

## Incidents (salle de guerre)

Les incidents de point de terminaison sont triés dans War Room sous forme de runbooks. Les actions au niveau de l'appareil incluent **ack-clear** (effacer les violations enregistrées, recalculer la posture et fermer les runbooks de menaces associés) et la liste de blocage/liste blanche des menaces.

## Tableau de bord de la flotte

Le tableau de bord résume l'ensemble du parc : couverture, nombres en ligne/obsolètes par système d'exploitation, répartition des postures, risque moyen, facettes des incidents actifs, carte thermique par appareil, chronologie des menaces quotidiennes, principales menaces et principaux risques.

## Auto-mise à jour et anti-altération

- **Auto-mise à jour** — l'agent se met à jour via une commande `update` plus un manifeste de version signé (version + somme de contrôle + signature) ; la version la plus récente peut être automatiquement synchronisée avec la flotte.
- **Clé anti-altération/désinstallation** — une [politique](/fr/en/agent/policies-and-groups#tamper-protection--uninstall-key) peut nécessiter une clé de désinstallation afin que l'agent ne puisse pas être supprimé silencieusement. La validation fonctionne même hors réseau (un sel/hachage hors ligne est transporté jusqu'au point final), avec une clé à l'échelle de la flotte comme solution de repli ; les tentatives de désinstallation ayant échoué sont auditées.

## Connexes

- [Politiques & Groupes](/fr/en/agent/policies-and-groups)
- [Egress Enforcement](/fr/en/agent/egress-enforcement)
- [Défense contre les menaces](/fr/en/threat-defense/overview)