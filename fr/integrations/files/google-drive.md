---
sidebar_position: 1
title: "Google Drive — Add from Drive"
sidebar_label: "Google Drive"
description: "Permettez à vos utilisateurs de joindre des fichiers depuis Google Drive et les Drive partagés dans le chat SecureAI. Configuration en libre-service avec votre propre client OAuth Google Cloud."
---

# Google Drive — Add from Drive

Grâce à cette intégration, vos utilisateurs joignent des fichiers depuis **Google Drive** (Mon Drive, Partagés avec moi et **Drive partagés**) directement depuis le chat, avec l'option **Add from Drive** du bouton de pièce jointe.

La configuration est en **libre-service** : un administrateur de votre organisation crée un client OAuth et une clé API dans **votre propre projet Google Cloud** et les saisit dans **Admin → Integrations → Files**. Il n'est pas nécessaire d'ouvrir un ticket ni d'attendre Hiper AI : l'option apparaît dans le chat dès que vous enregistrez la configuration.

Durée estimée : 10 minutes.

## Fonctionnement

1. L'utilisateur clique sur **Attach → Add from Drive**. La première fois, Google lui demande de se connecter avec **son propre compte** et d'autoriser SecureAI.
2. Le **sélecteur officiel de Google Drive** (Google Picker) s'ouvre. L'utilisateur choisit un ou plusieurs fichiers.
3. Le navigateur de l'utilisateur télécharge **uniquement les fichiers choisis**, avec le jeton de l'utilisateur lui-même, et les joint au message. Les documents Google sont exportés au format Office (Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx` ; les autres, en PDF).
4. Le fichier suit le même parcours que n'importe quelle pièce jointe : il **passe par le DLP** et par les politiques de votre organisation avant d'atteindre un modèle.

<Info>
**SecureAI ne voit jamais l'ensemble de votre Drive.** Le périmètre `drive.file` est utilisé : SecureAI ne peut lire que les fichiers que chaque utilisateur choisit dans le sélecteur, et rien d'autre. Il n'y a ni compte de service, ni délégation à l'échelle du domaine, ni lecture en arrière-plan : un utilisateur ne peut joindre que ce qu'il peut déjà ouvrir dans Drive.
</Info>

## Prérequis

- Un projet Google Cloud **au sein de l'organisation de votre Google Workspace**, et les autorisations pour y activer des API, configurer Google Auth Platform et créer des identifiants (par exemple le rôle **Propriétaire** ou **Éditeur** du projet).
- Un accès administrateur à SecureAI, avec l'autorisation **Administrator** sur la section **Integrations**.
- Une offre SecureAI qui inclut **Attach from Drive / SharePoint**. Sans elle, vous pouvez préparer la configuration, mais les utilisateurs ne verront pas l'option.

## Étape 1 : Copier les adresses depuis SecureAI

1. Connectez-vous à SecureAI en tant qu'administrateur.
2. Accédez à **Admin → Integrations** et filtrez par la catégorie **Files**.
3. Sur la carte **Google Drive**, cliquez sur **Connect integration**.

<div class="mac-window">
  ![Cartes de la catégorie Files](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. Dans la section **1. Set up Google Cloud**, vous trouverez les deux valeurs dont vous avez besoin dans Google Cloud, chacune avec son bouton **Copy** :
   - **Authorized JavaScript origin** : l'adresse de votre instance, par exemple `https://<votre-entreprise>.hiperai.ai`.
   - **Website restriction for the API key** : la même adresse se terminant par `/*`.

<div class="mac-window">
  ![Origine et restriction dans le panneau latéral de SecureAI](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

Utilisez toujours les valeurs affichées par votre instance : elles doivent correspondre exactement, y compris `https://` et sans `/` final pour l'origine.

## Étape 2 : Choisir le projet et activer les API

1. Ouvrez la [console Google Cloud](https://console.cloud.google.com) et, dans le sélecteur de projet de la barre supérieure, choisissez un projet de votre organisation (ou créez-en un nouveau, par exemple `SecureAI Drive`).
2. Accédez à **API et services → Bibliothèque** (APIs & Services → Library), recherchez **Google Drive API** et cliquez sur **Activer** (Enable).

<div class="mac-window">
  ![Activer la Google Drive API](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. Répétez l'opération avec **Google Picker API**.

<div class="mac-window">
  ![Activer la Google Picker API](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## Étape 3 : Configurer l'écran de consentement

1. Accédez à **Google Auth Platform** (menu **API et services → Écran de consentement OAuth**, ou « OAuth consent screen »). Si le projet ne l'a pas encore configuré, cliquez sur **Commencer** (Get started).
2. Renseignez le **Nom de l'application** (App name ; par exemple `SecureAI`) et l'**Adresse e-mail d'assistance utilisateur** (User support email).
3. Dans **Audience**, choisissez **Interne** (Internal) : seuls les comptes de votre organisation Google Workspace pourront autoriser l'application, et Google n'exige aucune validation.
4. Renseignez l'adresse e-mail de contact, acceptez la politique relative aux données utilisateur et cliquez sur **Créer** (Create).

<div class="mac-window">
  ![Audience Interne dans Google Auth Platform](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

Il n'est pas nécessaire d'ajouter des périmètres manuellement : SecureAI demande uniquement `drive.file`, un périmètre non sensible.

## Étape 4 : Créer le client OAuth

1. Dans **Google Auth Platform → Clients**, cliquez sur **Créer un client** (Create client).
2. Dans **Type d'application** (Application type), choisissez **Application Web** (Web application) et donnez-lui un nom (par exemple `SecureAI — Add from Drive`).
3. Dans **Origines JavaScript autorisées** (Authorized JavaScript origins), cliquez sur **Ajouter un URI** (Add URI) et collez l'**Authorized JavaScript origin** que vous avez copiée à l'étape 1.
4. Laissez vides les **URI de redirection autorisés** (Authorized redirect URIs) : le sélecteur ne les utilise pas.
5. Cliquez sur **Créer**.

<div class="mac-window">
  ![Client OAuth de type Application Web avec l'origine de SecureAI](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. Copiez l'**ID client** (Client ID ; il se termine par `.apps.googleusercontent.com`). Ce client n'a pas besoin de secret : ne le copiez pas et ne le saisissez nulle part.

<div class="mac-window">
  ![ID client créé](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
Si votre organisation utilise déjà un client web Google pour la [connexion avec Google Workspace](/fr/iam/google-workspace) dans SecureAI, vous pouvez le réutiliser : ajoutez l'origine JavaScript à ce même client.
</Note>

## Étape 5 : Créer et restreindre la clé API

1. Accédez à **API et services → Identifiants** (Credentials) et cliquez sur **Créer des identifiants → Clé API** (Create credentials → API key).
2. Ouvrez la clé qui vient d'être créée (**Modifier la clé API**, ou « Edit API key ») :
   - Dans **Restrictions relatives aux applications** (Application restrictions), choisissez **Sites Web** (Websites) et ajoutez la **Website restriction** que vous avez copiée à l'étape 1 (l'adresse se terminant par `/*`).
   - Dans **Restrictions relatives aux API** (API restrictions), choisissez **Restreindre la clé** (Restrict key) et cochez uniquement **Google Picker API**.
3. Cliquez sur **Enregistrer** (Save) et copiez la clé (elle commence par `AIza`).

<div class="mac-window">
  ![Clé API restreinte aux Sites Web et à la Google Picker API](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
La clé API **est publique par conception** : le navigateur de chaque utilisateur la reçoit pour ouvrir le sélecteur. C'est pourquoi il est obligatoire de la restreindre au site de SecureAI et à la Google Picker API. Restreignez-la **avant** d'utiliser **Test connection** dans SecureAI : Google peut vous empêcher d'ajouter des restrictions à une clé qui a déjà enregistré une utilisation avec d'autres API.
</Warning>

## Étape 6 : Saisir, tester et activer dans SecureAI

1. Revenez au panneau latéral **Google Drive** dans SecureAI.
2. Dans **2. Paste the identifiers**, collez l'**ID client** (Client ID) et la **clé API** (API key).
3. Dans **3. Test it** :
   - **Test connection** vérifie, depuis les serveurs de SecureAI, que la clé API est valide, qu'elle accepte les requêtes de votre instance et qu'elle appartient au **même projet** que le client OAuth.
   - **Try signing in** ouvre la même fenêtre Google que verront vos utilisateurs : connectez-vous avec votre compte. SecureAI confirme que l'origine est autorisée et que la Google Drive API répond.

<div class="mac-window">
  ![Tests au vert dans le panneau latéral de SecureAI](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. Dans **4.**, laissez activée l'option **Show "Add from Drive" to users** et cliquez sur **Save**.

La carte passe à **Available in the chat**.

## Étape 7 : Utilisation par vos utilisateurs

1. Dans le chat, l'utilisateur clique sur le bouton de **pièce jointe** et choisit **Add from Drive**.

<div class="mac-window">
  ![Add from Drive dans le menu des pièces jointes](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. La première fois, Google lui demande de choisir son compte et d'autoriser SecureAI à voir les fichiers qu'il sélectionne.
3. Le sélecteur Google Drive s'ouvre, avec les onglets Mon Drive, Drive partagés et images. L'utilisateur choisit un ou plusieurs fichiers et clique sur **Select**.


4. Les fichiers apparaissent joints au message, avec l'icône Google Drive.

## Résolution des problèmes

| Ce que vous voyez | Cause | Que faire |
|---|---|---|
| **Test connection** : « The API key's website restrictions do not include this address » (les restrictions de sites Web de la clé API n'incluent pas cette adresse) | La clé API ne contient pas le site de SecureAI | Ajoutez la restriction exacte de l'étape 1, se terminant par `/*` |
| **Test connection** : « The API key belongs to a different project than the OAuth client » (la clé API appartient à un autre projet que le client OAuth) | Les identifiants ont été créés dans des projets différents | Créez la clé API dans le même projet que le client OAuth |
| **Test connection** : « The Google Drive API is not enabled » (la Google Drive API n'est pas activée) | L'API n'a pas été activée | Étape 2 |
| La fenêtre Google affiche **Error 400: origin_mismatch** ou **redirect_uri_mismatch** | L'origine JavaScript ne figure pas dans le client OAuth | Ajoutez-la (étape 4). Les modifications peuvent prendre quelques minutes |
| La fenêtre Google affiche **Error 403: org_internal** | L'utilisateur utilise un compte extérieur à votre Workspace | Il doit se connecter avec le compte de l'organisation |
| Le sélecteur affiche « The API developer key is invalid » | Clé API mal copiée ou sans la Google Picker API | Vérifiez l'étape 5 |
| « SecureAI did not receive access to this file » (SecureAI n'a pas reçu l'accès à ce fichier) | Le fichier n'a pas été choisi dans le sélecteur | Choisissez-le depuis la fenêtre Drive |
| « Its owner does not allow downloading it » (son propriétaire n'autorise pas le téléchargement) | Le propriétaire a désactivé le téléchargement | Demandez au propriétaire de l'activer |
| L'utilisateur ne voit pas **Add from Drive** | L'intégration est désactivée, non enregistrée, ou l'offre ne l'inclut pas | Vérifiez la carte dans **Admin → Integrations → Files** |

## Questions fréquentes

**Cela fonctionne-t-il avec les Drive partagés ?** Oui. Le sélecteur comporte un onglet pour les Drive partagés ; l'utilisateur voit les Drive dont il est membre.

**Quelles autorisations chaque utilisateur accorde-t-il à SecureAI ?** Uniquement `drive.file` : l'accès aux fichiers que l'utilisateur a choisis dans le sélecteur. SecureAI ne peut ni lister, ni rechercher, ni lire aucun autre fichier de votre Drive.

**Comment le désactiver ?** Désactivez **Show "Add from Drive" to users** et enregistrez, ou cliquez sur **Remove configuration**. Pour couper aussi l'accès déjà accordé par les utilisateurs, supprimez le client OAuth dans Google Cloud.

**Hiper AI avait déjà configuré Drive pour moi. Dois-je faire quelque chose ?** Non. Tant que vous n'enregistrez pas votre propre configuration, la carte affiche **Configured by Hiper AI** et tout continue de fonctionner de la même manière. Si vous enregistrez la vôtre, elle remplace celle-ci.

**Et le « compte de service Google Drive » de la version précédente ?** Il n'est plus utilisé : chaque téléchargement est effectué avec le jeton de l'utilisateur lui-même, ce qui est plus sûr, car un utilisateur ne peut jamais joindre un fichier qu'il ne peut pas ouvrir.
