---
sidebar_position: 4
title: "Azure — Découverte"
sidebarTitle: "Azure"
icon: "/img/icons/azure.svg"
sidebar_label: "Azure — Découverte"
description: "Connectez Azure et Microsoft Entra ID pour que SecureAI inventorie vos ressources Azure OpenAI et Foundry, vos projets et agents Foundry, AI Search, Bot Service et chaque identité non humaine (principaux de service, identités d'agent, identités managées, secrets, certificats et informations d'identification fédérées) avec ses autorisations, ainsi que le RBAC, l'activité, l'utilisation et les coûts."
---

# Azure — Découverte

Connectez votre locataire Azure pour que SecureAI inventorie vos ressources d'IA dans Azure et **chaque identité non humaine (NHI)** dans Microsoft Entra ID, avec les rôles et les autorisations de chacune.

<Info>
Cette connexion **lit uniquement** et n'envoie jamais de prompt. Pour faire passer le trafic LLM de SecureAI par votre propre ressource Foundry, consultez [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference). Ce sont deux connexions indépendantes, avec des principaux de service et des autorisations différents ; vous pouvez utiliser les deux sur le même abonnement.
</Info>

## Ce que SecureAI importe

Pour chaque abonnement que le principal de service peut lire :

- **Ressources d'IA** : chaque compte Azure AI Services, Azure OpenAI et autre Cognitive Services (Content Safety, Speech, Language, Document Intelligence…), avec sa région et son état.
- **Déploiements de modèles** d'Azure OpenAI et de Foundry, avec leur capacité et l'utilisation des 30 derniers jours (requêtes, jetons d'entrée et de sortie, depuis Azure Monitor).
- **Projets et agents Foundry** : les agents de Foundry Agent Service et les assistants classiques de chaque projet, avec le modèle utilisé par chacun. Également les hubs et les projets basés sur un hub (Azure Machine Learning), avec leurs points de terminaison en ligne et serverless.
- **Azure AI Search** et **Azure Bot Service**.
- **Coûts** du mois en cours, par service (Cost Management).
- **Activité** : événements de gestion de Cognitive Services et de Machine Learning des 30 derniers jours (journal d'activité).
- **NHI**, listées dans l'[Inventaire des NHI](/fr/discovery/nhi-inventory) :
  - **Principaux de service** des applications d'entreprise.
  - **Identités d'agent** de Microsoft Entra, celles que Foundry crée pour chaque agent (classées comme *agent*).
  - **Identités managées**, affectées par le système et par l'utilisateur.
  - **Secrets client** et **certificats** des inscriptions d'applications, avec leur date d'expiration.
  - **Informations d'identification fédérées** (fédération d'identité de charge de travail). Par exemple, une relation d'approbation OIDC avec GitHub Actions permet à ce dépôt d'obtenir des jetons au nom de l'application, sans aucun secret.
  - La **dernière connexion** de chaque application, lorsque votre locataire expose ce rapport.
- **Autorisations de chaque identité** : ses rôles Azure RBAC à tout niveau de l'abonnement (abonnement, groupe de ressources ou ressource), ses autorisations d'application Microsoft Graph et ses rôles d'annuaire Entra.
- **Attributions de rôles RBAC** : chaque rôle par son nom, avec les utilisateurs, groupes et applications qui le détiennent.

Une identité est marquée comme **privilégiée** lorsqu'elle détient l'un de ces éléments :

- l'un des rôles **Owner**, **Contributor**, **User Access Administrator** ou **Role Based Access Control Administrator** ;
- une autorisation d'écriture Graph, par exemple `Application.ReadWrite.All`, `Directory.ReadWrite.All`, `Mail.Send` ou `Files.ReadWrite.All` ;
- un rôle d'administrateur d'annuaire, par exemple Global Administrator ou Application Administrator.

Les secrets, certificats et informations d'identification fédérées d'une application privilégiée sont eux aussi marqués comme privilégiés.

SecureAI n'importe ni les quelque 130 principaux de service que Microsoft crée dans chaque locataire (Azure Portal, Microsoft Graph, etc.), ni les connexions de connexion sociale : ce ne sont pas vos identités à gouverner.

## Prérequis

Une **inscription d'application** Microsoft Entra ID (principal de service) avec un **secret client** et ces autorisations :

| Où | Autorisation | Obligatoire ? | Ce que cela permet |
|----|--------------|---------------|--------------------|
| Abonnement | Rôle **Reader** | Oui | Ressources, déploiements, projets, identités managées, attributions de rôles, utilisation et activité |
| Abonnement | Rôle **Cost Management Reader** | Recommandé | Coûts du mois en cours par service |
| Ressource Foundry | Rôle **Cognitive Services Data Reader** | Recommandé | Les agents de chaque projet Foundry |
| Microsoft Graph | `Application.Read.All` (autorisation d'application) | Oui | Principaux de service, identités d'agent, applications, secrets, certificats, informations d'identification fédérées et autorisations Graph |
| Microsoft Graph | `Directory.Read.All` (autorisation d'application) | Oui | Rôles d'annuaire et noms des membres de chaque rôle |
| Microsoft Graph | `AuditLog.Read.All` (autorisation d'application) | Recommandé | Dernière connexion de chaque application |
| Microsoft Graph | `Application.ReadWrite.All` (autorisation d'application) | Uniquement pour révoquer | Désactiver des principaux de service et supprimer des secrets, certificats et informations d'identification fédérées depuis SecureAI |

Les autorisations Graph nécessitent le **consentement administrateur**. Pour lire **tous** vos abonnements, attribuez **Reader** sur chacun, ou sur un groupe d'administration qui les contient.

<Note>
Les agents Foundry se trouvent dans le plan de données du projet, pas dans Azure Resource Manager : **Reader ne suffit pas pour les voir**. Sans **Cognitive Services Data Reader** (ou **Foundry User**) sur la ressource Foundry, la synchronisation fonctionne quand même, mais la liste des agents reste vide et SecureAI le signale comme une lacune. Cognitive Services Data Reader est le rôle le plus restreint qui le permet : lecture seule du plan de données.
</Note>

## Étape 1. Créer le principal de service

### Avec Azure CLI

Depuis [Azure Cloud Shell](https://shell.azure.com/) ou la CLI `az`. Remplacez `SUB_ID` par votre abonnement et, si vous utilisez Foundry, `MY_RESOURCE` et `MY_RG` par votre ressource et votre groupe de ressources :

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

L'étape 2 affiche les trois valeurs que vous collerez dans SecureAI. Pour **révoquer depuis SecureAI**, ajoutez aussi `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role` (`Application.ReadWrite.All`) à l'étape 3 et accordez de nouveau le consentement.

### Avec le portail Azure

1. Dans le [portail Azure](https://portal.azure.com/), accédez à **Microsoft Entra ID → Inscriptions d'applications → Nouvelle inscription**, donnez-lui un nom (par exemple `SecureAI Discovery`) et inscrivez-la.
2. Dans **Vue d'ensemble**, copiez l'**ID de l'annuaire (locataire)** et l'**ID de l'application (client)**.
3. Dans **Certificats et secrets → Secrets client → Nouveau secret client**, créez-en un et copiez sa **Valeur** (elle n'est affichée qu'une seule fois).
4. Dans **Autorisations d'API → Ajouter une autorisation → Microsoft Graph → Autorisations de l'application**, ajoutez `Application.Read.All`, `Directory.Read.All` et `AuditLog.Read.All` (et `Application.ReadWrite.All` si vous voulez révoquer depuis SecureAI). Cliquez ensuite sur **Accorder le consentement administrateur**.
5. Dans **Abonnements → votre abonnement → Contrôle d'accès (IAM) → Ajouter une attribution de rôle**, attribuez **Reader** et **Cost Management Reader** à l'application.
6. Dans **votre ressource Foundry → Contrôle d'accès (IAM)**, attribuez **Cognitive Services Data Reader** à l'application.

<Info>
L'application des rôles Azure peut prendre **jusqu'à 5 minutes**, et celle du consentement Graph quelques minutes de plus. Si la première synchronisation signale des lacunes pour des autorisations que vous venez d'accorder, attendez et synchronisez de nouveau.
</Info>

<Warning>
Traitez le secret comme un mot de passe. SecureAI le stocke **chiffré** et ne l'affiche plus jamais. Les secrets **expirent** (au bout d'un an avec la commande ci-dessus) : renouvelez-le avant cette date, faute de quoi la synchronisation cesse de fonctionner ce jour-là.
</Warning>

## Étape 2. Connecter Azure dans SecureAI

1. Accédez à **Admin → Intégrations**, filtrez par **Cloud** et, sur la carte **Azure — Découverte**, cliquez sur **Connecter l'Intégration**.
2. Remplissez les champs :

   | Champ | Quoi saisir |
   |-------|-------------|
   | **Azure Tenant ID (Directory ID)** | `tenantId` de l'étape 1 |
   | **App Registration Client ID** | `clientId` de l'étape 1 |
   | **App Registration Client Secret** | `clientSecret` de l'étape 1. Stocké chiffré. |
   | **Subscription ID** (facultatif) | Limite la lecture à cet abonnement. Vide : tous les abonnements où le principal a **Reader**. |

3. Cliquez sur **Connecter**. Avant d'enregistrer, SecureAI teste les identifiants par une vraie lecture : si le secret est incorrect ou si le principal ne peut pas lire l'abonnement, rien n'est stocké et le message indique ce qui manque. Si la connexion aboutit mais qu'une autorisation Graph manque, l'avis nomme cette autorisation.
4. **Synchronisez** avec le bouton d'actualisation de la carte. Une synchronisation Azure peut prendre plusieurs minutes (elle parcourt Azure Resource Manager, Microsoft Graph, Azure Monitor et Cost Management). Ensuite, SecureAI se synchronise automatiquement toutes les 6 heures.

## Étape 3. Vérifier

- [Cloud Sensors](/fr/discovery/cloud-sensors) liste les déploiements, agents et services découverts. Cliquez sur la carte Azure pour ouvrir ses Insights :
  - **Usage & Costs** : utilisation et coûts ;
  - **Models & Deployments** : déploiements et agents ;
  - **Identity & Access** : identités avec leurs rôles et l'indicateur *Privileged* ; secrets, certificats et informations d'identification fédérées ; rôles RBAC avec leurs membres ;
  - **Audit & Logs** : l'activité.
- L'[Inventaire des NHI](/fr/discovery/nhi-inventory) affiche les principaux de service, identités d'agent, identités managées, secrets, certificats et informations d'identification fédérées, avec leurs autorisations et leur caractère privilégié ou non.

Si une synchronisation échoue (par exemple parce que le secret a expiré), la carte affiche l'erreur et SecureAI réessaie avec un délai croissant, en conservant le dernier inventaire.

## Lacunes de couverture

Rien de ce que SecureAI n'a pas pu lire n'est ignoré en silence : lors de la connexion ou de la synchronisation, l'avis nomme l'autorisation manquante.

| Surface | Autorisation qui le corrige |
|---------|-----------------------------|
| Identités Entra (principaux de service, inscriptions d'applications) | `Application.Read.All` avec consentement administrateur |
| Autorisations Graph de chaque identité | `Application.Read.All` |
| Rôles d'annuaire | `Directory.Read.All` |
| Attributions de rôles et identités managées | **Reader** sur l'abonnement |
| Agents Foundry | **Cognitive Services Data Reader** sur la ressource Foundry |

Une lecture partielle (autorisation manquante, page non renvoyée par Azure, limitation de débit) **ne retire jamais d'agents ni ne supprime d'identités** de l'inventaire : SecureAI ne considère un élément comme supprimé que lorsque la liste où il apparaîtrait a été retournée en entier. Sans attributions de rôles, les autorisations d'une identité restent *inconnues*, jamais « aucune ».

## Révocation

Depuis l'[Inventaire des NHI](/fr/discovery/nhi-inventory) (cadenas), avec `Application.ReadWrite.All` :

| Identité | Ce qui se passe dans Azure | Réversible ? |
|----------|----------------------------|--------------|
| Principal de service | **Désactivé** (`accountEnabled: false`) | Oui : le réactiver dans Entra ID |
| Secret client | **Supprimé** de l'application | Non : en créer un nouveau |
| Certificat | **Retiré** de l'application | Non : le téléverser de nouveau |
| Information d'identification fédérée | La relation d'approbation est **supprimée** | Non : la recréer |
| Identité managée affectée par l'utilisateur | La ressource est **supprimée** (nécessite aussi **Managed Identity Contributor** sur celle-ci) | Non |

Garde-fous :

- SecureAI **ne propose pas de révoquer** le principal de service avec lequel il se connecte, ni ses secrets, car cela interromprait la découverte. Renouvelez-les dans Entra ID.
- Les identités managées **affectées par le système** ne sont pas révoquées depuis SecureAI : leur cycle de vie est celui de la ressource Azure.
- Les informations d'identification fédérées que **Foundry** conserve sur le *blueprint* de l'identité d'un agent ne sont pas non plus révoquées depuis SecureAI : les supprimer arrête l'agent.
- Les politiques NHI automatiques (révocation par ancienneté ou inutilisation) ne s'appliquent pas encore à Azure : la révocation est manuelle.

## Déconnexion

Dans **Admin → Intégrations → Cloud → Azure — Découverte**, la suppression de la connexion efface les identifiants stockés. Pour retirer l'accès de SecureAI côté Azure, supprimez l'inscription d'application ou son secret.

## Connexes

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Présentation des fournisseurs d'IA cloud](/fr/integrations/cloud/overview)
- [Cloud Sensors](/fr/discovery/cloud-sensors)
- [Inventaire des NHI](/fr/discovery/nhi-inventory)
- [Microsoft Entra ID (SSO)](/fr/iam/microsoft-entra-id)
