---
sidebar_position: 4
title: "Fonderie Azure AI"
sidebar_label: "Fonderie Azure AI"
description: "Connectez Azure AI Foundry/Azure OpenAI afin que SecureAI puisse inventorier les agents, les modèles, les identités, le RBAC, l'utilisation et le coût."
---
# Fonderie Azure AI

Connectez votre locataire Azure afin que SecureAI puisse inventorier les agents Azure OpenAI/AI Foundry, AI Search, Bot Service et les points de terminaison ML, ainsi que les identités Entra et RBAC qui les régissent.

## Ce que SecureAI importe

- **Agents Azure OpenAI/AI Foundry, AI Search, Bot Service et points de terminaison ML**
- **NHI** — Principes de service Entra, secrets et certificats d'application et identités gérées (révocables — voir [Inventaire NHI](/fr/discovery/nhi-inventory))
- Attributions de rôles **Azure RBAC**
- **Journaux d'activité**
- **Utilisation, jetons et dépenses** au cours des 30 derniers jours

## Prérequis

- Un **enregistrement d'application Entra ID (Azure AD)** (principal du service) avec un secret client.
- **Autorisations de l'application Microsoft Graph** accordées avec le consentement de l'administrateur :
  - `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` (lire).
  - `Application.ReadWrite.All` — **uniquement** si vous souhaitez que SecureAI révoque les identités à la source.
- Le principal du service a attribué un rôle **Lecteur** sur les abonnements/groupes de ressources concernés.

## Identifiants

| Champ | Obligatoire | Descriptif |
|-------|----------|-------------|
| `tenantId` | Oui | ID d’annuaire (locataire). |
| `clientId` | Oui | ID d’application (client) de l’enregistrement de l’application. |
| `clientSecret` | Oui | Secret client. Chiffré au repos. |
| `subscriptionId` | Non | Étendez la découverte à un abonnement spécifique. |

SecureAI s'authentifie via OAuth2 (flux principal du service d'identification du client).

### Où les trouver

1. Dans le [Portail Azure](https://portal.azure.com/), accédez à **Microsoft Entra ID → Inscriptions d'applications → Nouvelle inscription**.
2. Copiez l'**ID de répertoire (locataire)** et l'**ID d'application (client)** à partir de la présentation de l'application.
3. Sous **Certificats et secrets**, créez un **secret client** et copiez sa valeur.
4. Sous **Autorisations API**, ajoutez les autorisations Microsoft Graph ci-dessus et **Accordez le consentement de l'administrateur**.
5. Attribuez à l'application le rôle **Lecteur** sur l'abonnement cible (**Abonnements → Contrôle d'accès (IAM)**).

## Se connecter

1. **Admin → Intégrations → Cloud → Azure AI Foundry → Connect.**
2. Saisissez le locataire, le client, le secret (et l'abonnement facultatif).
3. **Testez**, puis **Enregistrez**.
4. **Sync** (les synchronisations Azure peuvent prendre plusieurs minutes : multiservice + graphique + balayages du journal d'activité).

## Vérifier

Ouvrez [Cloud Sensors](/fr/discovery/cloud-sensors) pour les agents/points de terminaison découverts et [NHI Inventory](/fr/discovery/nhi-inventory) pour les principaux de service, les secrets et les identités gérées. Les informations montrent le RBAC, l'utilisation et les dépenses.

## Révocation

Les principaux de service Entra, les secrets/certificats d'application et les identités gérées sont **révocables** via Microsoft Graph à partir de [NHI Inventory](/fr/discovery/nhi-inventory) — cela nécessite l'autorisation `Application.ReadWrite.All` ci-dessus.

## Connexes

- [Présentation des fournisseurs Cloud AI](/fr/integrations/cloud/overview)
- [Microsoft Entra ID SSO](/fr/iam/microsoft-entra-id)
- [Inventaire NHI](/fr/discovery/nhi-inventory)