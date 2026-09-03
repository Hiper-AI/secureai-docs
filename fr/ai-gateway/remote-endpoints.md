---
sidebar_position: 6
title: "Points de terminaison distants"
---
# points de terminaison distants

Les points de terminaison distants vous permettent de connecter des serveurs modèles externes ou auto-hébergés à SecureAI via les contrôles AI Gateway.

Ceci est utile lorsque votre organisation gère sa propre infrastructure modèle et souhaite néanmoins une gouvernance de sécurité centralisée.

## Où configurer

Accédez à **Admin → AI Gateway → Points de terminaison distants**.

## Options d'inscription

- **Installation rapide** : assistant guidé qui génère un flux de configuration en une seule commande.
- **Inscription manuelle** :
  - **Coller JSON**
  - Champs **Saisie manuelle**

## Modes de connectivité

- **Reverse Connect** : recommandé pour la plupart des déploiements ; connexion sortante, pas de ports entrants ouverts.
- **Cloudflare Tunnel** : connectivité zéro confiance utilisant le jeton de tunnel et le nom d'hôte.

## Opérations quotidiennes

Pour chaque point de terminaison, les administrateurs peuvent :

- exécuter **Bilan de santé**
- exécutez **Vérifier mTLS**
- inspecter les détails du point final (région, empreinte digitale, modèles, dernière vérification)
- supprimer le point final une fois mis hors service

## Flux d'intégration suggéré

1. Commencez par **Installation rapide**.
2. Choisissez le mode de connectivité.
3. Sélectionnez les modèles requis.
4. Terminez l'inscription.
5. Exécutez Health Check et vérifiez mTLS.
6. Confirmez que le point final reste sain après 5 à 10 minutes.

## Liste de contrôle de dépannage

- Point de terminaison inaccessible : vérifiez les valeurs du mode de connectivité et du nom d'hôte.
- TLS réussi mais défectueux : vérifiez l'état du service de passerelle/modèle distant.
- Non connecté : confirmez que le service à distance est en cours d'exécution et que l'enregistrement est valide.

## meilleures pratiques

- Préférez Reverse Connect sauf si votre architecture nécessite le mode tunnel.
- Gardez la propriété des points de terminaison claire par organisation/équipe.
- Vérifiez à nouveau l’état du point de terminaison après des modifications de politique ou de clés.