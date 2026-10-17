---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Intégration Google Workspace (SSO)

Grâce à cette intégration, les utilisateurs de votre organisation se connectent à SecureAI avec leur compte Google Workspace (le bouton **Continue with Google**). La configuration est **en libre-service** : un administrateur de votre organisation crée un client OAuth dans votre propre projet Google Cloud et saisit les informations dans **Admin → Intégrations**. Aucun ticket à ouvrir, rien à attendre de Hiper AI : le bouton apparaît sur votre page de connexion dès que vous enregistrez.

Durée estimée : 10 minutes.

## Prérequis

- Un projet Google Cloud **au sein de votre organisation Google Workspace**, et l'autorisation d'y configurer Google Auth Platform et d'y créer des clients OAuth (par exemple le rôle **Propriétaire** (*Owner*) ou **Éditeur** (*Editor*) du projet).
- Un accès administrateur à SecureAI, avec l'autorisation **Administrateur** sur la section **Intégrations**.

## Fonctionnement

1. Vous créez dans Google Cloud un **client OAuth 2.0 de type « Application Web »**. SecureAI utilise OpenID Connect avec les champs d'application (scopes) `openid`, `email` et `profile`.
2. Dans SecureAI, vous saisissez l'**ID client**, le **code secret du client** et vos **domaines Google Workspace**. Le secret est stocké chiffré et n'est plus jamais affiché.
3. Lorsqu'un utilisateur clique sur **Continue with Google**, Google l'authentifie et SecureAI ne le laisse entrer que si :
   - Google a vérifié son adresse e-mail,
   - le compte est **géré par l'un de vos domaines Workspace** (la revendication `hd`), et
   - son adresse e-mail correspond à un compte SecureAI **actif**.

Un compte Google personnel (par exemple un compte @gmail.com, ou un compte personnel créé avec l'adresse e-mail de l'entreprise) **ne peut pas** se connecter, même s'il a la même adresse e-mail qu'un utilisateur SecureAI.

## Étape 1 : Copier l'URI de redirection depuis SecureAI

1. Connectez-vous à SecureAI en tant qu'administrateur.
2. Allez dans **Admin → Intégrations** et filtrez par la catégorie **IAM**.
3. Sur la carte **Google Workspace (SSO)**, cliquez sur **Connecter l'Intégration** (ou sur **Reconfigurer**, si la carte affiche **Configured by Hiper AI**).
4. Dans la section **1. Create an OAuth client in Google Cloud**, cliquez sur **Copy** à côté de **Redirect URI** (URI de redirection).

L'URI ressemble à ceci (avec le domaine de votre instance) :

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

Utilisez toujours l'URI affichée par votre instance : elle doit correspondre exactement, y compris `https://`.

## Étape 2 : Choisir ou créer un projet Google Cloud

1. Ouvrez la [console Google Cloud](https://console.cloud.google.com).
2. Dans le sélecteur de projet de la barre supérieure, choisissez un projet de votre organisation ou cliquez sur **Nouveau projet** (*New Project*).

<div class="mac-window">
  ![New project](/img/google%20sso%20images/google%20-%201.png)
</div>

3. Si vous en créez un : nommez-le (par exemple `SecureAI SSO`), vérifiez que l'**Organisation** est bien celle de votre Google Workspace, puis cliquez sur **Créer** (*Create*).

<div class="mac-window">
  ![Create project](/img/google%20sso%20images/google%20-%202.png)
</div>

Aucune API ne doit être activée pour la connexion.

## Étape 3 : Configurer Google Auth Platform (écran de consentement)

1. Dans le menu, allez dans **API et services → Écran de consentement OAuth** (*APIs & Services → OAuth consent screen* ; appelé **Google Auth Platform** dans la nouvelle console). Si c'est la première fois, cliquez sur **Commencer** (*Get started*).

<div class="mac-window">
  ![OAuth consent screen](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **Informations sur l'application** (*App information*) : un nom d'application (par exemple `SecureAI`) et une adresse e-mail d'assistance utilisateur.
3. **Audience** : choisissez **Interne** (*Internal*). Seuls les comptes de votre organisation Google Workspace peuvent utiliser l'application, et Google n'exige pas de validation de l'application.
4. **Coordonnées** (*Contact information*) : une adresse e-mail pour les notifications de Google.
5. Acceptez le règlement sur les données utilisateur et cliquez sur **Créer** (*Create*).

<div class="mac-window">
  ![Create the OAuth configuration](/img/google%20sso%20images/google%20-%204.png)
</div>

Les champs d'application `openid`, `email` et `profile` ne sont pas sensibles : vous n'avez pas besoin de les ajouter sous **Accès aux données** (*Data access*).

<Note>
Si vous choisissez **Externe** (*External*), l'application doit être **En production** (*In production*) (et non en « Test ») ; en mode test, seuls les utilisateurs test que vous avez listés peuvent se connecter. Même en mode Externe, SecureAI n'accepte que les comptes des domaines Workspace que vous configurez à l'étape 5.
</Note>

## Étape 4 : Créer le client OAuth

1. Dans Google Auth Platform, allez dans **Clients** (ou **API et services → Identifiants → + Créer des identifiants → ID client OAuth** ; *APIs & Services → Credentials → + Create credentials → OAuth client ID*).

<div class="mac-window">
  ![Create OAuth client ID](/img/google%20sso%20images/google%20-%207.png)
</div>

2. Cliquez sur **+ Créer un client** (*+ Create client*).
3. **Type d'application** (*Application type*) : **Application Web** (*Web application*).
4. **Nom** (*Name*) : par exemple `SecureAI SSO`.
5. Sous **URI de redirection autorisés** (*Authorized redirect URIs*), cliquez sur **+ Ajouter un URI** (*+ Add URI*) et collez l'URI de l'étape 1. (Vous n'avez pas besoin des **Origines JavaScript autorisées** (*Authorized JavaScript origins*).)

<div class="mac-window">
  ![Authorized redirect URIs](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Laissez décochée la case **Utiliser ce client pour un agent basé sur l'IA** (*Use this client for an AI-powered agent*) : elle concerne un autre type de client et SecureAI n'en a pas besoin.
7. Cliquez sur **Créer** (*Create*).
8. Dans la boîte de dialogue qui s'affiche, copiez l'**ID client** (*Client ID*, se termine par `.apps.googleusercontent.com`) et le **code secret du client** (*Client secret*, commence par `GOCSPX-`). Vous pouvez télécharger le fichier JSON en guise de sauvegarde. Ne fermez pas la boîte de dialogue avant de l'avoir copié.

<div class="mac-window">
  ![OAuth client created](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google n'affiche le secret complet qu'au moment de sa création. Conservez-le en lieu sûr ; si vous le perdez, ajoutez un nouveau secret sur le client.
</Warning>

Google indique qu'un nouveau client, ou une modification de ses URI, peut prendre de 5 minutes à quelques heures pour s'appliquer. Si, à l'étape 5, **Test connection** signale l'URI de redirection ou l'ID client tout juste créés, patientez quelques minutes et testez de nouveau avant de modifier quoi que ce soit.

## Étape 5 : Saisir les informations dans SecureAI et tester

Revenez dans **Admin → Intégrations → Google Workspace (SSO)** :

1. Dans **2. Paste the OAuth client details**, renseignez :
   - **Client ID** : celui de l'étape 4.
   - **Client secret** : celui de l'étape 4.
   - **Allowed email domains** (domaines e-mail autorisés ; obligatoire) : votre domaine Google Workspace principal et, si vous en utilisez, vos domaines secondaires, séparés par des virgules. Par exemple `contoso.com, contoso.co.uk`.
2. Dans **3. Test the connection**, cliquez sur **Test connection**. SecureAI interroge Google (sans connecter personne) et vérifie :

   | Vérification | En cas d'échec |
   |---|---|
   | Client ID | Google ne connaît pas ce client (`invalid_client`). Vérifiez que vous avez copié l'ID complet et que le client n'est ni supprimé ni désactivé. |
   | Redirect URI registered on the client | L'URI de l'étape 1 ne figure pas dans **URI de redirection autorisés** (`redirect_uri_mismatch`). Ajoutez-la à l'identique et patientez quelques minutes. |
   | Client secret | Le secret n'appartient pas à ce client (`invalid_client`). Collez-le de nouveau ou ajoutez-en un nouveau. |

   Le test utilise ce qui est saisi dans le formulaire : vous pouvez donc tester avant d'enregistrer.
3. Vérifiez que **Show "Continue with Google" on the login page** (afficher « Continue with Google » sur la page de connexion) est activé (il l'est par défaut la première fois). Sans domaines renseignés, SecureAI ne permet pas de l'enregistrer activé.
4. Cliquez sur **Save**.

Dès lors, la carte affiche **Active on the login page**, et le bouton **Continue with Google** apparaît sur la page de connexion de votre instance.

## Étape 6 : Ajouter vos utilisateurs

SecureAI **ne crée pas de comptes automatiquement** lors de la première connexion : toute personne qui se connectera avec Google doit exister dans SecureAI et être active, avec la **même adresse e-mail** que son compte Google Workspace (la casse n'a pas d'importance ; les alias `+` ne sont pas acceptés).

- **Utilisateurs existants** : les personnes qui ont déjà un compte SecureAI (même avec un mot de passe) ne sont pas recréées. Elles peuvent continuer à se connecter avec leur mot de passe, et aussi avec Google.
- **Nouveaux utilisateurs SSO uniquement** : dans **Admin → Gestion IAM → Gestion des utilisateurs → Ajouter un utilisateur**, choisissez la méthode d'authentification **Compte professionnel / SSO**. L'utilisateur ne reçoit pas d'e-mail pour créer un mot de passe et se connecte directement avec **Continue with Google**.

Lorsqu'un utilisateur est désactivé dans SecureAI, il ne peut plus se connecter par SSO non plus.

## Tester la connexion

1. Ouvrez la page de connexion de votre instance dans une fenêtre de navigation privée.
2. Cliquez sur **Continue with Google**.
3. Choisissez votre compte Google Workspace.
4. Google vous renvoie vers SecureAI, connecté.

La connexion par mot de passe continue de fonctionner : activer le SSO ne la désactive pas.

## Désactiver ou supprimer l'intégration

- Pour masquer le bouton tout en conservant la configuration, désactivez l'interrupteur et enregistrez.
- Pour la supprimer, utilisez **Remove configuration**. Si votre instance disposait auparavant d'un SSO configuré par Hiper AI, cette configuration s'applique de nouveau.

## Renouveler le secret client

1. Dans Google Cloud, ouvrez le client OAuth et cliquez sur **Ajouter un code secret** (*Add secret*) (l'ancien continue de fonctionner).
2. Dans SecureAI, collez la nouvelle valeur dans **Client secret**, cliquez sur **Test connection** puis sur **Save**. Si vous laissez le champ vide, le secret actuel est conservé.
3. Une fois que vous avez confirmé que la connexion fonctionne, désactivez puis supprimez l'ancien secret dans Google Cloud.

La modification s'applique immédiatement, sans mettre fin aux sessions actives.

## Si votre instance avait déjà un SSO configuré par Hiper AI

Les instances pour lesquelles Hiper AI a configuré le SSO Google sur demande affichent la carte avec le statut **Configured by Hiper AI**. Cette configuration continue de fonctionner. Si vous enregistrez la vôtre dans Intégrations, elle la remplace ; si vous supprimez la vôtre par la suite, la précédente s'applique de nouveau.

## Dépannage

Les erreurs de connexion s'affichent sur la page de connexion de SecureAI (en anglais) :

| Message dans SecureAI | Cause et solution |
|---|---|
| "User not found in SecureAI database." | Aucun compte SecureAI n'existe avec cette adresse e-mail. Créez-le (étape 6). |
| "This account is not allowed to sign in here…" | Le compte n'appartient à aucun des **Allowed email domains**, ou il s'agit d'un compte Google personnel (sans Workspace). Ajoutez le domaine ou utilisez le compte professionnel. |
| "Your identity provider has not verified this email address." | Google n'a pas marqué l'adresse e-mail comme vérifiée, ou l'adresse contient des caractères que SecureAI n'accepte pas (par exemple un alias `+`). |
| "This sign-in method is not enabled for your organization." | L'intégration est désactivée ou incomplète. Vérifiez la carte dans Intégrations. |
| "Your identity provider did not complete the sign-in…" | Google a renvoyé une erreur, par exemple parce que l'utilisateur a annulé. |
| "Single sign-on could not be completed…" | L'échange de code a échoué, généralement parce que le secret a été remplacé ou supprimé. Utilisez **Test connection**. |
| "The sign-in session expired or was not started from this browser…" | Plus de 10 minutes se sont écoulées, ou la connexion a été lancée dans un autre onglet/navigateur. Réessayez depuis la page de connexion. |

Erreurs affichées par Google (avant le retour vers SecureAI) :

- **Erreur 400 : redirect_uri_mismatch** : l'URI de redirection du client n'est pas exactement celle de l'étape 1. Corrigez-la sous **URI de redirection autorisés** (et non dans les origines JavaScript).
- **Erreur 403 : org_internal** : l'application est **Interne** et le compte n'appartient pas à l'organisation Google Cloud propriétaire du projet. Cela se produit aussi lorsque votre entreprise possède plusieurs organisations Google (par exemple `company.com` et `company.ai`) et que le client OAuth a été créé dans un projet de l'autre : créez-le dans un projet de l'organisation à laquelle appartiennent vos utilisateurs (le sélecteur de projet de la console indique l'organisation de chaque projet).
- **Erreur 401 : invalid_client / deleted_client** : le client OAuth n'existe pas ou a été supprimé. Créez-en un nouveau et mettez à jour SecureAI.
- **« Accès bloqué : votre administrateur n'a pas approuvé cette application »** (*Access blocked: your administrator has not trusted this app*) : les contrôles d'accès aux applications de votre Workspace bloquent les applications tierces. Dans la console d'administration Google (**Sécurité → Contrôle des accès et des données → Commandes des API → Gérer l'accès des applications tierces** ; *Security → Access and data control → API controls → Manage third-party app access*), marquez l'ID client comme **Approuvée** (*Trusted*).

Si vous avez besoin d'aide, contactez le support via **Obtenir de l'Aide** dans le menu de votre profil et indiquez l'ID client et le message d'erreur. **N'envoyez jamais le code secret du client.**

## Ressources supplémentaires

- [Configurer OAuth 2.0 dans Google Cloud](https://support.google.com/cloud/answer/6158849)
- [OpenID Connect chez Google](https://developers.google.com/identity/openid-connect/openid-connect)
- [Contrôler les applications tierces qui accèdent aux données Google Workspace](https://support.google.com/a/answer/7281227)