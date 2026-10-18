---
sidebar_position: 2
title: "SharePoint & OneDrive — Add from SharePoint"
sidebar_label: "SharePoint & OneDrive"
description: "Permettez à vos utilisateurs de joindre des fichiers depuis des sites SharePoint et OneDrive dans le chat SecureAI. Configuration en libre-service avec votre propre inscription d'application Microsoft Entra ID."
---

# SharePoint & OneDrive — Add from SharePoint

Grâce à cette intégration, vos utilisateurs joignent des fichiers depuis des **sites SharePoint** (y compris les sites Teams), **OneDrive** et **Partagés avec moi** directement depuis le chat, avec l'option **Add from SharePoint** du bouton de pièce jointe.

La configuration est en **libre-service** : un administrateur de votre organisation inscrit SecureAI en tant qu'application dans **votre propre annuaire Microsoft Entra ID** et saisit les identifiants dans **Admin → Integrations → Files**. Il n'est pas nécessaire d'ouvrir un ticket ni d'attendre Hiper AI : l'option apparaît dans le chat dès que vous enregistrez la configuration.

Durée estimée : 10 minutes.

## Fonctionnement

1. L'utilisateur clique sur **Attach → Add from SharePoint**. La première fois, Microsoft lui demande de se connecter avec **son propre compte Microsoft 365**.
2. L'explorateur de SecureAI s'ouvre sur Microsoft Graph : sites, bibliothèques, dossiers, recherche et fichiers partagés avec l'utilisateur. L'utilisateur choisit un ou plusieurs fichiers.
3. Le navigateur de l'utilisateur télécharge **uniquement les fichiers choisis**, avec le jeton de l'utilisateur lui-même, et les joint au message.
4. Le fichier suit le même parcours que n'importe quelle pièce jointe : il **passe par le DLP** et par les politiques de votre organisation avant d'atteindre un modèle.

<Info>
**Autorisations déléguées, jamais d'application.** SecureAI agit toujours **au nom de l'utilisateur connecté** : un utilisateur ne voit et ne joint que ce qu'il peut déjà ouvrir dans SharePoint. L'application est une « application monopage » (SPA) sans secret client, et SecureAI ne lit rien en arrière-plan.
</Info>

## Prérequis

- Un abonnement Microsoft 365 qui inclut **SharePoint Online** (par exemple Business Basic, Business Standard, E3 ou E5). Un annuaire Entra ID sans cette licence n'a ni sites SharePoint ni OneDrive : la connexion fonctionne, mais il n'y a aucun fichier à joindre.
- Un rôle Entra ID qui permet d'inscrire des applications et d'**accorder le consentement administrateur** pour les autorisations Microsoft Graph (par exemple **Administrateur d'application cloud** ou **Administrateur général**).
- Un accès administrateur à SecureAI, avec l'autorisation **Administrator** sur la section **Integrations**.
- Une offre SecureAI qui inclut **Attach from Drive / SharePoint**. Sans elle, vous pouvez préparer la configuration, mais les utilisateurs ne verront pas l'option.

## Étape 1 : Copier l'URI de redirection depuis SecureAI

1. Connectez-vous à SecureAI en tant qu'administrateur.
2. Accédez à **Admin → Integrations** et filtrez par la catégorie **Files**.
3. Sur la carte **SharePoint & OneDrive**, cliquez sur **Connect integration**.
4. Dans la section **1. Register SecureAI in Microsoft Entra ID**, cliquez sur **Copy** à côté de **Redirect URI**.

<div class="mac-window">
  ![Redirect URI dans le panneau latéral de SecureAI](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

L'URI correspond à l'adresse de votre instance, par exemple `https://<votre-entreprise>.hiperai.ai`. Utilisez toujours celle qu'affiche votre instance : elle doit correspondre exactement.

## Étape 2 : Inscrire l'application dans Entra ID

1. Ouvrez le [centre d'administration Microsoft Entra](https://entra.microsoft.com) et accédez à **Identité → Applications → Inscriptions d'applications** (Identity → Applications → App registrations).
2. Cliquez sur **Nouvelle inscription** (New registration).

<div class="mac-window">
  ![Inscriptions d'applications → Nouvelle inscription](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. Renseignez :
   - **Nom** (Name) : par exemple `SecureAI — Add from SharePoint`.
   - **Types de comptes pris en charge** (Supported account types) : **Comptes dans cet annuaire d'organisation uniquement** (Accounts in this organizational directory only ; locataire unique).
   - **URI de redirection** (Redirect URI) : dans la liste déroulante, choisissez **Application monopage (SPA)** (Single-page application) et collez l'URI que vous avez copiée à l'étape 1.
4. Cliquez sur **Inscrire** (Register).


<Warning>
La plateforme doit être **Application monopage (SPA)**, et non **Web**. Avec **Web**, la connexion échoue avec l'erreur `AADSTS9002326`. Si vous l'avez déjà inscrite comme Web, accédez à **Authentification** (Authentication), ajoutez une plateforme **Application monopage** avec la même URI et supprimez celle de type Web.
</Warning>

5. Dans la **Vue d'ensemble** (Overview) de l'application, copiez l'**ID d'application (client)** (Application (client) ID) et l'**ID de l'annuaire (locataire)** (Directory (tenant) ID). Il n'est pas nécessaire de créer de secret client.

<div class="mac-window">
  ![ID d'application et d'annuaire](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## Étape 3 : Ajouter les autorisations Microsoft Graph

1. Dans l'application, accédez à **Autorisations de l'API → Ajouter une autorisation → Microsoft Graph → Autorisations déléguées** (API permissions → Add a permission → Microsoft Graph → Delegated permissions).
2. Recherchez et cochez :
   - `Files.Read.All` — lire les fichiers auxquels l'utilisateur a accès.
   - `Sites.Read.All` — lister et rechercher les sites SharePoint auxquels l'utilisateur a accès.
3. Cliquez sur **Ajouter des autorisations** (Add permissions). `User.Read` est déjà ajoutée par défaut ; laissez-la.

<div class="mac-window">
  ![Autorisations déléguées de Microsoft Graph](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## Étape 4 : Accorder le consentement administrateur

1. Dans **Autorisations de l'API**, cliquez sur **Accorder le consentement administrateur pour &lt;votre organisation&gt;** (Grant admin consent for &lt;org&gt;) et confirmez avec **Oui**.
2. Les trois autorisations doivent avoir le statut **Accordé pour &lt;votre organisation&gt;**.

<div class="mac-window">
  ![Consentement administrateur accordé](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

Sans cette étape, chaque utilisateur verrait une demande de consentement (ou une erreur `AADSTS65001` si votre organisation n'autorise pas les utilisateurs à donner leur consentement).

## Étape 5 : Saisir, tester et activer dans SecureAI

1. Revenez au panneau latéral **SharePoint & OneDrive** dans SecureAI.
2. Dans **2. Paste the identifiers**, collez le **Directory (tenant) ID** et l'**Application (client) ID**.
3. Dans **3. Test it** :
   - **Test connection** vérifie, depuis les serveurs de SecureAI, que l'annuaire existe.
   - **Try signing in** ouvre la même fenêtre Microsoft que verront vos utilisateurs : connectez-vous avec votre compte. SecureAI confirme que l'URI de redirection est de type SPA, que `Files.Read.All` et `Sites.Read.All` ont reçu le consentement et que Microsoft Graph répond.

<div class="mac-window">
  ![Tests au vert dans le panneau latéral de SecureAI](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. Dans **4.**, laissez activée l'option **Show "Add from SharePoint" to users** et cliquez sur **Save**.

La carte passe à **Available in the chat**.

## Étape 6 : Utilisation par vos utilisateurs

1. Dans le chat, l'utilisateur clique sur le bouton de **pièce jointe** et choisit **Add from SharePoint**.

<div class="mac-window">
  ![Add from SharePoint dans le menu des pièces jointes](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. La première fois, il clique sur **Sign in with Microsoft** et choisit son compte professionnel.
3. Il parcourt **Sites**, **Shared** ou la recherche, choisit un ou plusieurs fichiers et clique sur **Add**.


4. Les fichiers apparaissent joints au message, avec l'icône SharePoint.

## Restreindre les utilisateurs autorisés (facultatif)

Pour que seuls certains utilisateurs ou groupes puissent utiliser **Add from SharePoint** :

1. Dans Entra, accédez à **Applications d'entreprise** (Enterprise applications) et ouvrez l'application que vous avez inscrite.
2. Dans **Propriétés** (Properties), activez **Affectation requise ?** (Assignment required?) et enregistrez.
3. Dans **Utilisateurs et groupes** (Users and groups), affectez les utilisateurs ou groupes autorisés.

Un utilisateur non affecté reçoit l'erreur `AADSTS50105` lors de la connexion et ne peut pas joindre de fichiers.

## Résolution des problèmes

| Ce que vous voyez | Cause | Que faire |
|---|---|---|
| `AADSTS50011` — l'URI de redirection ne correspond pas | L'URI de l'étape 1 n'est pas enregistrée | Ajoutez-la dans **Authentification → Application monopage** |
| `AADSTS9002326` | L'URI est enregistrée comme **Web** | Déplacez-la vers **Application monopage** |
| `AADSTS65001` — consentement manquant | Le consentement administrateur n'a pas été accordé | Étape 4 |
| `AADSTS700016` — application introuvable | ID d'application ou d'annuaire incorrect | Copiez-les à nouveau depuis la **Vue d'ensemble** |
| `AADSTS50105` | L'utilisateur n'est pas affecté à l'application | Affectez-le, ou désactivez **Affectation requise ?** |
| **Try signing in** : « These delegated permissions are missing » (ces autorisations déléguées sont manquantes) | `Files.Read.All` ou `Sites.Read.All` est manquante, ou son consentement | Étapes 3 et 4 |
| **Try signing in** : « this Microsoft 365 directory has no SharePoint Online license » (cet annuaire Microsoft 365 n'a pas de licence SharePoint Online) | L'annuaire n'a aucun abonnement incluant SharePoint Online | Utilisez l'annuaire Microsoft 365 de votre organisation, ou attribuez un abonnement qui inclut SharePoint Online |
| L'explorateur indique que votre organisation n'a pas SharePoint Online | Même cas, vu par un utilisateur | Comme pour la ligne précédente |
| L'utilisateur ne voit pas de sites, seulement « Shared » | L'utilisateur n'est membre d'aucun site | Comportement attendu : il ne voit que ce qu'il peut déjà ouvrir |
| L'utilisateur ne voit pas **Add from SharePoint** | L'intégration est désactivée, non enregistrée, ou l'offre ne l'inclut pas | Vérifiez la carte dans **Admin → Integrations → Files** |

## Questions fréquentes

**Que peut lire SecureAI ?** Uniquement ce que l'utilisateur connecté peut déjà lire, et seulement lorsqu'il choisit un fichier dans l'explorateur. Les autorisations sont déléguées : SecureAI n'a aucun accès « en tant qu'application » à votre SharePoint.

**Les politiques d'accès conditionnel fonctionnent-elles ?** Oui. La connexion est une connexion Microsoft 365 normale et respecte l'authentification multifacteur, les appareils gérés et le reste de vos politiques.

**Comment le désactiver ?** Désactivez **Show "Add from SharePoint" to users** et enregistrez, ou cliquez sur **Remove configuration**. Pour révoquer aussi les jetons déjà émis, supprimez l'inscription d'application dans Entra ID ou désactivez la connexion de votre application d'entreprise.

**Hiper AI avait déjà configuré SharePoint pour moi. Dois-je faire quelque chose ?** Non. Tant que vous n'enregistrez pas votre propre configuration, la carte affiche **Configured by Hiper AI** et tout continue de fonctionner de la même manière. Si vous enregistrez la vôtre, elle remplace celle-ci.
