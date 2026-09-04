---
sidebar_position: 1
title: "Présentation des connecteurs MCP"
sidebar_label: "Aperçu"
description: "Connectez les serveurs MCP (Model Context Protocol) pour donner aux assistants de SecureAI un accès gouverné aux outils"
---
# Connecteurs MCP

SecureAI peut se connecter aux serveurs **Model Context Protocol (MCP)** afin que ses assistants puissent appeler des outils externes (interroger des bases de données, lire des tickets, exécuter des opérations cloud) sous gouvernance. Les connecteurs sont choisis sur une place de marché intégrée et configurés par utilisateur ; chaque appel d'outil passe toujours par la couche de politique et de sécurité de SecureAI.

Les connecteurs sont gérés dans **Admin → Intégrations → MCP** (base API `/api/connectors`).

## Modèles de transport et d'authentification

Chaque connecteur déclare comment SecureAI l'atteint et comment il s'authentifie. Trois modèles sont pris en charge :

| Modèle | Transports | Authentification | Exemples |
|---------|-----------|------|----------|
| Processus local | `stdio` | Clé API (en environnement) | Notion, Cloudflare (bin local), Azure (`npx @azure/mcp`), AWS (`uvx awslabs.aws-api-mcp-server`), serveurs de référence (Sequential Thinking, Web Fetch, Time). |
| À distance (jeton) | `streamable_http` | Clé API/porteur (en env) | MCP officiel de GitHub, la famille Google Cloud (BigQuery, Compute, Logging, Vertex AI, Cloud Run, GKE,…), Microsoft Learn. |
| À distance (OAuth) | `streamable_http` | OAuth 2.1 + PKCE, avec enregistrement client dynamique | Cloudflare (MCP distant officiel). Voir [MCP distant avec OAuth & DCR](/fr/integrations/mcp/remote-oauth-dcr). |

Certains connecteurs distants basés sur des jetons (par exemple, la famille Google Cloud) transportent également un flux OAuth afin qu'un utilisateur puisse autoriser avec son propre client Google OAuth via une fenêtre contextuelle, plutôt que de coller un jeton statique.

## Connecter un connecteur

1. **Admin → Intégrations → MCP.**
2. Choisissez un connecteur sur le marché.
3. Fournissez la configuration requise : une clé/un jeton API, ou autorisez via la fenêtre contextuelle OAuth pour les connecteurs OAuth.
4. Enregistrez. Le connecteur devient disponible pour le routeur d'outils de l'assistant.

## Sécurité des outils

Chaque connecteur déclare des **modèles d'outils bloqués** – opérations destructrices (par exemple `delete`, `destroy`, `terminate`) que SecureAI refuse d'invoquer même si le serveur MCP les expose. Ce garde-fou est appliqué de manière centralisée, de sorte qu'un serveur d'outils connecté ne peut pas être contraint à une action destructrice via l'assistant.

## Connexes

- [MCP distant avec OAuth & DCR](/fr/integrations/mcp/remote-oauth-dcr)
- [AI Gateway — Points de terminaison distants](/fr/ai-gateway/remote-endpoints)