---
sidebar_position: 2
title: "MCP à distance avec OAuth et DCR"
sidebar_label: "OAuth et DCR à distance"
description: "Comment SecureAI se connecte aux serveurs MCP distants à l'aide d'OAuth 2.1, PKCE et Dynamic Client Registration"
---
# MCP distant avec OAuth et DCR

Certains serveurs MCP distants autorisent l'accès avec **OAuth 2.1** plutôt qu'avec un jeton d'API statique. SecureAI prend en charge cela de bout en bout, y compris **PKCE** et **Dynamic Client Registration (DCR)** afin que vous n'ayez pas à pré-enregistrer une application OAuth. L'exemple de référence est le connecteur **Cloudflare Official Remote MCP** (`cloudflare-remote`).

## Comment fonctionne le flux

1. **Enregistrement client dynamique (RFC 7591).** Lorsqu'un connecteur déclare un `registrationUrl` et n'a pas de `clientId` statique, SecureAI s'enregistre en tant que client PKCE public à cette URL et met en cache le `client_id` résultant. Si l'URI de redirection change, il se réenregistre automatiquement. (Pour les connecteurs qui fournissent un identifiant client statique, cette étape est ignorée.)
2. **Autorisation + PKCE (S256).** SecureAI génère un vérificateur/défi PKCE, crée l'URL d'autorisation avec `code_challenge` et `code_challenge_method=S256` et redirige l'administrateur/utilisateur vers le fournisseur pour accorder l'accès.
3. **Rappel.** Le fournisseur redirige vers `GET /api/connectors/oauth/callback/:slug`. Cette route est sécurisée par le paramètre opaque `state` (correspondant à un magasin PKCE de courte durée de 10 minutes) plutôt que par une session, elle ne nécessite donc aucun middleware d'authentification.
4. **Échange et stockage de jetons.** SecureAI échange le code (avec le vérificateur PKCE) contre des jetons et les stocke **par utilisateur**. Le jeton d'accès est ensuite injecté dans le transport MCP (par exemple sous la forme `BEARER_TOKEN`) pour les appels d'outil de cet utilisateur.

## Connecter un connecteur OAuth MCP

1. **Admin → Intégrations → MCP** et choisissez un connecteur OAuth (par exemple Cloudflare Official Remote MCP).
2. Cliquez sur **Autoriser** : une fenêtre contextuelle ouvre l'écran de consentement du fournisseur.
3. Approuvez les étendues demandées.
4. En cas de succès, vous êtes redirigé et le connecteur apparaît comme connecté.

## Remarques

- **Jetons par utilisateur.** Chaque utilisateur autorise individuellement ; les appels d'outils s'exécutent avec la propre autorisation de cet utilisateur, et non avec des informations d'identification partagées.
- **PKCE est requis** pour ces connecteurs (`pkceRequired: true`), donc aucun secret client n'est stocké pour les clients publics.
- **Connecteurs client statiques.** Si votre organisation pré-enregistre un client OAuth, fournissez son identifiant/secret client et SecureAI l'utilise à la place du DCR.

## Connexes

- [Présentation des connecteurs MCP](/fr/integrations/mcp/overview)
- [AI Gateway — Points de terminaison distants](/fr/ai-gateway/remote-endpoints)