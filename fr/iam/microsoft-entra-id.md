---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Intégration Microsoft Entra ID (SSO)

Grâce à cette intégration, les utilisateurs de votre organisation se connectent à SecureAI avec leur compte professionnel Microsoft (le bouton **Continue with Microsoft**). La configuration est **en libre-service** : un administrateur de votre organisation inscrit SecureAI dans votre propre locataire Microsoft Entra ID (anciennement Azure Active Directory) et saisit les informations dans **Admin → Intégrations**. Aucun ticket à ouvrir, rien à attendre de Hiper AI : le bouton apparaît sur votre page de connexion dès que vous enregistrez.

Durée estimée : 10 minutes.

## Prérequis

- Un rôle Microsoft Entra autorisé à créer des inscriptions d'applications (par exemple **Développeur d'applications** ou **Administrateur d'application**). Accorder le consentement administrateur (étape 4) nécessite le rôle **Administrateur d'applications cloud**, **Administrateur d'application** ou **Administrateur général**.
- Un accès administrateur à SecureAI, avec l'autorisation **Administrateur** sur la section **Intégrations**.

## Fonctionnement

1. Vous créez une **inscription d'application** dans votre locataire Entra ID. SecureAI utilise OpenID Connect (flux de code d'autorisation) avec un **secret client**.
2. Dans SecureAI, vous saisissez l'**ID de l'annuaire (locataire)**, l'**ID d'application (client)** et la **valeur du secret client**. Le secret est stocké chiffré et n'est plus jamais affiché.
3. Lorsqu'un utilisateur clique sur **Continue with Microsoft**, Microsoft l'authentifie (en appliquant vos stratégies MFA et d'accès conditionnel) et SecureAI le laisse entrer si son adresse e-mail correspond à un compte SecureAI **actif**.

SecureAI n'accepte que les jetons émis par **votre** locataire : la connexion est liée à votre annuaire, et les points de terminaison multilocataires (`common` / `organizations`) ne sont jamais utilisés.

## Étape 1 : Copier l'URI de redirection depuis SecureAI

1. Connectez-vous à SecureAI en tant qu'administrateur.
2. Allez dans **Admin → Intégrations** et filtrez par la catégorie **IAM**.
3. Sur la carte **Microsoft Entra ID (SSO)**, cliquez sur **Connecter l'Intégration** (ou sur **Reconfigurer**, si la carte affiche **Configured by Hiper AI**).
4. Dans la section **1. Register SecureAI in Microsoft Entra ID**, cliquez sur **Copy** à côté de **Redirect URI** (URI de redirection).

L'URI ressemble à ceci (avec le domaine de votre instance) :

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

Utilisez toujours l'URI affichée par votre instance : elle doit correspondre caractère pour caractère, y compris `https://`.

Gardez cette fenêtre ouverte ; vous y reviendrez pour coller les informations.

## Étape 2 : Inscrire l'application dans Microsoft Entra ID

1. Ouvrez le [centre d'administration Microsoft Entra](https://entra.microsoft.com) (ou le [portail Azure](https://portal.azure.com) → **Microsoft Entra ID**).

<div class="mac-window">
  ![Searching for Microsoft Entra ID in the Azure portal](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. Allez dans **Applications → Inscriptions d'applications** (*Applications → App registrations*).

<div class="mac-window">
  ![App registrations menu](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. Cliquez sur **+ Nouvelle inscription** (*+ New registration*).

<div class="mac-window">
  ![New registration button](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. Remplissez le formulaire :
   - **Nom** (*Name*) : un nom explicite, par exemple `SecureAI SSO`. Les utilisateurs le voient sur l'écran de consentement.
   - **Types de comptes pris en charge** (*Supported account types*) : **Comptes dans cet annuaire d'organisation uniquement (locataire unique)** (*Accounts in this organizational directory only (Single tenant)*).
   - **URI de redirection** (*Redirect URI*) : plateforme **Web** (et non « Application monopage »), puis collez l'URI copiée à l'étape 1.
5. Cliquez sur **S'inscrire** (*Register*).

<div class="mac-window">
  ![Application registration form](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. Sur la page **Vue d'ensemble** (*Overview*) de l'application, copiez :
   - **ID d'application (client)** (*Application (client) ID*) — un GUID tel que `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`.
   - **ID de l'annuaire (locataire)** (*Directory (tenant) ID*) — un autre GUID, tel que `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`.

## Étape 3 : Créer un secret client

1. Dans le menu de l'application, ouvrez **Certificats & secrets** (*Certificates & secrets*).

<div class="mac-window">
  ![Certificates & secrets menu](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Sous **Secrets client** (*Client secrets*), cliquez sur **+ Nouveau secret client** (*+ New client secret*).
3. Saisissez une description (par exemple `SecureAI SSO`) et choisissez une durée d'expiration (Microsoft recommande moins de 12 mois ; le maximum est de 24).
4. Cliquez sur **Ajouter** (*Add*).

<div class="mac-window">
  ![Add a client secret](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. Copiez **immédiatement** la colonne **Valeur** (*Value*) (elle ressemble à `plm8Q~xxxxxxxx…`). Elle n'est affichée qu'une seule fois.

<div class="mac-window">
  ![Client secret value](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
Copiez la **Valeur** (*Value*), et non l'**ID du secret** (*Secret ID*, qui est un GUID). Si vous collez l'ID du secret, SecureAI le refuse à l'enregistrement.
</Warning>

Notez la date d'expiration : lorsque le secret expire, la connexion Microsoft cesse de fonctionner jusqu'à ce que vous en saisissiez un nouveau (voir [Renouveler le secret client](#renouveler-le-secret-client)).

## Étape 4 : Vérifier les autorisations d'API

SecureAI demande les autorisations Microsoft Graph déléguées `openid`, `profile`, `email` et `User.Read` (cette dernière pour lire la photo de profil de l'utilisateur). `User.Read` est ajoutée par défaut aux nouvelles inscriptions.

1. Dans le menu de l'application, ouvrez **Autorisations de l'API** (*API permissions*).
2. Vérifiez que **Microsoft Graph → Autorisations déléguées** incluent `User.Read` et, si vous souhaitez les lister explicitement, `openid`, `profile` et `email` (via **+ Ajouter une autorisation → Microsoft Graph → Autorisations déléguées**).

<div class="mac-window">
  ![Add delegated permissions](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. Cliquez sur **Accorder un consentement d'administrateur pour [votre organisation]** (*Grant admin consent for [your organization]*) et confirmez.

<div class="mac-window">
  ![Grant admin consent](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

Si votre locataire ne permet pas aux utilisateurs de consentir eux-mêmes aux applications (un paramètre courant en entreprise), cette étape est obligatoire : sans elle, les utilisateurs voient « Approbation de l'administrateur nécessaire » (*Need admin approval*) lors de la connexion.

## Étape 5 : Saisir les informations dans SecureAI et tester

Revenez dans **Admin → Intégrations → Microsoft Entra ID (SSO)** :

1. Dans **2. Paste the app registration details**, renseignez :
   - **Directory (tenant) ID** : le GUID de l'étape 2 (un domaine vérifié de votre locataire, tel que `contoso.onmicrosoft.com`, fonctionne également).
   - **Application (client) ID** : le GUID de l'étape 2.
   - **Client secret value** : la valeur de l'étape 3.
   - **Allowed email domains** (domaines e-mail autorisés ; facultatif, recommandé) : les domaines e-mail de votre organisation, séparés par des virgules, par exemple `contoso.com, contoso.co.uk`. Seules ces adresses peuvent se connecter avec Microsoft. Si le champ est vide, tout compte de votre locataire qui existe dans SecureAI est accepté.
2. Dans **3. Test the connection**, cliquez sur **Test connection**. SecureAI interroge Microsoft (sans connecter personne) et vérifie :

   | Vérification | En cas d'échec |
   |---|---|
   | Directory (tenant) ID | Microsoft ne connaît pas ce locataire (`AADSTS90002`). Copiez l'ID de l'annuaire depuis la page Vue d'ensemble. |
   | Application (client) ID | Aucune application de ce type n'existe dans le locataire (`AADSTS700016`). Vérifiez l'ID client et que l'application se trouve dans le même locataire. |
   | Client secret | Le secret est invalide (`AADSTS7000215`) ou expiré (`AADSTS7000222`). Collez la **Valeur** ou créez-en un nouveau. |
   | Redirect URI registered on the app | L'URI de l'étape 1 ne figure pas dans l'inscription d'application (l'erreur `AADSTS50011` qu'un utilisateur obtiendrait à la connexion). Dans l'application, ouvrez **Authentification → Ajouter une plateforme → Web** (*Authentication → Add a platform → Web*), collez-la à l'identique et enregistrez. |

   Le test utilise ce qui est saisi dans le formulaire : vous pouvez donc tester avant d'enregistrer. Si votre locataire dispose d'une stratégie d'accès conditionnel qui bloque les jetons d'application seule, le secret peut s'afficher comme « could not be verified automatically » (n'a pas pu être vérifié automatiquement) : ce n'est pas une erreur — confirmez avec une vraie connexion.

   <Note>
   Le test confirme que l'URI est enregistrée, mais pas si elle l'a été sous la plateforme **Web** ou sous **Application monopage (SPA)**. Enregistrée comme SPA, l'URI passe le test et la connexion échoue avec « Single sign-on could not be completed ». Vérifiez que, dans **Authentification**, l'URI apparaît sous **Web**.
   </Note>

3. Vérifiez que **Show "Continue with Microsoft" on the login page** (afficher « Continue with Microsoft » sur la page de connexion) est activé (il l'est par défaut la première fois).
4. Cliquez sur **Save**.

Dès lors, la carte affiche **Active on the login page**, et le bouton **Continue with Microsoft** apparaît sur la page de connexion de votre instance.

## Étape 6 : Ajouter vos utilisateurs

SecureAI **ne crée pas de comptes automatiquement** lors de la première connexion : toute personne qui se connectera avec Microsoft doit exister dans SecureAI et être active. L'adresse e-mail du compte SecureAI doit correspondre à celle de l'utilisateur dans Entra ID (l'attribut **Messagerie** (*Mail*) ; s'il est vide, le **nom d'utilisateur principal (UPN)** est utilisé). La casse n'a pas d'importance.

- **Utilisateurs existants** : les personnes qui ont déjà un compte SecureAI (même avec un mot de passe) ne sont pas recréées. Elles peuvent continuer à se connecter avec leur mot de passe, et aussi avec Microsoft.
- **Nouveaux utilisateurs SSO uniquement** : dans **Admin → Gestion IAM → Gestion des utilisateurs → Ajouter un utilisateur**, choisissez la méthode d'authentification **Compte professionnel / SSO**. L'utilisateur ne reçoit pas d'e-mail pour créer un mot de passe et se connecte directement avec **Continue with Microsoft**.
- **Nombreux utilisateurs** : vous pouvez les provisionner et les déprovisionner automatiquement depuis Entra ID avec SCIM.

Lorsqu'un utilisateur est désactivé dans SecureAI (manuellement ou via SCIM), il ne peut plus se connecter par SSO non plus.

## Tester la connexion

1. Ouvrez la page de connexion de votre instance dans une fenêtre de navigation privée.
2. Cliquez sur **Continue with Microsoft**.
3. Choisissez votre compte professionnel et effectuez l'authentification MFA si elle vous est demandée.
4. Microsoft vous renvoie vers SecureAI, connecté.

La connexion par mot de passe continue de fonctionner : activer le SSO ne la désactive pas.

## Désactiver ou supprimer l'intégration

- Pour masquer le bouton tout en conservant la configuration, désactivez l'interrupteur et enregistrez.
- Pour la supprimer, utilisez **Remove configuration**. Si votre instance disposait auparavant d'un SSO configuré par Hiper AI, cette configuration s'applique de nouveau.

## Renouveler le secret client

Avant l'expiration du secret :

1. Dans Entra ID, créez un nouveau secret client (étape 3) sans supprimer l'ancien.
2. Dans SecureAI, ouvrez l'intégration, collez la nouvelle valeur dans **Client secret value**, cliquez sur **Test connection** puis sur **Save**. Si vous laissez le champ vide, le secret actuel est conservé.
3. Une fois que vous avez confirmé que la connexion fonctionne, supprimez l'ancien secret dans Entra ID.

La modification s'applique immédiatement, sans mettre fin aux sessions actives.

## Si votre instance avait déjà un SSO configuré par Hiper AI

Les instances pour lesquelles Hiper AI a configuré le SSO Microsoft sur demande affichent la carte avec le statut **Configured by Hiper AI**. Cette configuration continue de fonctionner. Si vous enregistrez la vôtre dans Intégrations, elle la remplace ; si vous supprimez la vôtre par la suite, la précédente s'applique de nouveau.

## Dépannage

Les erreurs de connexion s'affichent sur la page de connexion de SecureAI (en anglais) :

| Message dans SecureAI | Cause et solution |
|---|---|
| "User not found in SecureAI database." | Aucun compte SecureAI n'existe avec cette adresse e-mail. Créez-le (étape 6) ou vérifiez que l'adresse correspond au Mail/UPN dans Entra ID. |
| "This account is not allowed to sign in here…" | Le domaine de l'adresse e-mail ne figure pas dans **Allowed email domains**, ou le jeton provient d'un autre locataire. |
| "This sign-in method is not enabled for your organization." | L'intégration est désactivée ou incomplète. Vérifiez la carte dans Intégrations. |
| "Your identity provider did not complete the sign-in…" | Microsoft a renvoyé une erreur : l'utilisateur a annulé, le consentement administrateur est manquant (étape 4), ou l'utilisateur n'est pas affecté à l'application. |
| "Single sign-on could not be completed…" | L'échange de code a échoué : généralement un secret expiré ou remplacé (utilisez **Test connection**), ou l'URI de redirection enregistrée comme **Application monopage** au lieu de **Web** (déplacez-la vers **Web** dans **Authentification**). |
| "Your account is inactive…" | Le compte est désactivé dans SecureAI. |
| "The sign-in session expired or was not started from this browser…" | Plus de 10 minutes se sont écoulées, ou la connexion a été lancée dans un autre onglet/navigateur. Réessayez depuis la page de connexion. |

Erreurs affichées par Microsoft (avant le retour vers SecureAI) :

- **AADSTS50011 – L'URI de redirection ne correspond pas** : l'URI enregistrée dans Entra ID n'est pas exactement celle que SecureAI affiche à l'étape 1 (une barre oblique finale en trop suffit à empêcher la correspondance). **Test connection** le détecte avant la première connexion.
- **AADSTS65001 / « Approbation de l'administrateur nécessaire »** (*Need admin approval*) : accordez le consentement administrateur (étape 4).
- **AADSTS50105 – L'utilisateur connecté n'est affecté à aucun rôle pour l'application** : l'application d'entreprise a l'option **Affectation obligatoire ?** (*Assignment required?*) réglée sur **Oui**. Affectez l'utilisateur ou un groupe sous **Applications d'entreprise → SecureAI SSO → Utilisateurs et groupes** (*Enterprise applications → SecureAI SSO → Users and groups*).
- **AADSTS7000215 / AADSTS7000222** : secret invalide ou expiré. Saisissez-en un nouveau.

Si vous avez besoin d'aide, contactez le support via **Obtenir de l'Aide** dans le menu de votre profil et indiquez l'ID d'application (client), l'ID de l'annuaire et le message d'erreur. **N'envoyez jamais le secret client.**