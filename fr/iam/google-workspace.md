---
sidebar_position: 2
title: "Espace de travail Google (SSO)"
---
# Intégration de Google Workspace (SSO)

Ce guide vous guidera tout au long du processus de configuration de Google Workspace pour l'authentification unique (SSO) avec SecureAI. Vous apprendrez comment obtenir les informations d'identification nécessaires auprès de Google Cloud Console et les soumettre pour terminer l'intégration.

## Prérequis

- Accès administrateur à Google Cloud Console
- Un compte Google Workspace pour votre organisation
- Accès à la console d'administration Google Workspace de votre organisation (si vous utilisez des restrictions de domaine)
- Accès administrateur à SecureAI

## Étape 1 : Créer un projet dans Google Cloud Console

1. Connectez-vous à [Google Cloud Console](https://console.cloud.google.com)
2. Cliquez sur le menu déroulant du projet en haut de la page
3. Cliquez sur **Nouveau projet**

<div class="mac-window">
  ![Nouveau projet](/img/google%20sso%20images/google%20-%201.png)
</div>

4. Saisissez un nom de projet (par exemple, « SecureAI SSO »)
5. Cliquez sur **Créer**

<div class="mac-window">
  ![Créer un projet](/img/google%20sso%20images/google%20-%202.png)
</div>

## Étape 2 : Activez l'API Google+ (si nécessaire)

1. Dans votre projet, accédez à **API et services** > **Bibliothèque**.
2. Recherchez « API Google+ » ou « Google Identity »
3. Cliquez dessus et cliquez sur **Activer** (si ce n'est pas déjà activé)
4. **Remarque** : Google OAuth moderne n'exige peut-être pas cela, mais son activation garantit la compatibilité.

## Étape 3 : Configurer l'écran de consentement OAuth

1. Accédez à **API et services** > **Écran de consentement OAuth**.

<div class="mac-window">
  ![Écran de consentement OAuth](/img/google%20sso%20images/google%20-%203.png)
</div>

2. Remplissez les informations requises :
   - **Nom de l'application** : saisissez un nom (par exemple, "SecureAI")
   - **E-mail d'assistance utilisateur** : sélectionnez une adresse e-mail d'assistance
   - **Informations de contact** : ajoutez une adresse e-mail de contact

3. Choisissez **Type d'utilisateur** :
   - **Interne** : uniquement pour les utilisateurs de votre organisation Google Workspace (recommandé pour une utilisation en entreprise)
   - **Externe** : pour les utilisateurs extérieurs à votre organisation

4. Cliquez sur **Créer**

<div class="mac-window">
  ![Créer un consentement OAuth](/img/google%20sso%20images/google%20-%204.png)
</div>

5. **Image de marque** :
   - Accédez à la section **Branding** dans le menu de gauche
   - Recherchez des **domaines autorisés** et ajoutez le domaine de votre entreprise
   - Cela permet aux utilisateurs de se connecter avec l'adresse e-mail de leur entreprise
   - (De plus, vous pouvez ajouter l'URL de votre page d'accueil, votre politique de confidentialité et vos conditions d'utilisation si vous le souhaitez)

<div class="mac-window">
  ![Domaines autorisés](/img/google%20sso%20images/google%20-%205.png)
</div>

6. **Portées** :
   - Dans le menu de gauche, cliquez sur la section **Accès aux données**
   - Dans la section Accès aux données, cliquez sur **Ajouter ou supprimer des étendues**.
   - Une fenêtre s'ouvrira sur le côté gauche où vous pourrez rechercher des rôles
   - Recherchez le rôle **"openid"** et sélectionnez-le
   - Cliquez sur **Mettre à jour**
   - Cliquez ensuite sur **Enregistrer** dans la section Accès aux données
   - **Remarque** : Le champ d'application `openid` inclut automatiquement les accès `profile` et `email` - vous n'avez pas besoin de les ajouter séparément.
   - Si vous voyez d'autres options de portée, vous n'avez besoin que de **OpenID** pour SecureAI SSO

<div class="mac-window">
  ![Sélection de la portée OpenID](/img/google%20sso%20images/google%20-%206.png)
</div>

   - **Important** : La portée OpenID permet d'accéder à :
     - Adresse email de l'utilisateur
     - Informations de profil de base
     - C'est tout ce qui est nécessaire pour l'authentification SecureAI

7. **Utilisateurs de test** (si vous utilisez un externe) :
   - Ajouter des utilisateurs de test si nécessaire pendant les tests
   - Cliquez sur **Enregistrer et continuer**

8. **Résumé** :
   - Vérifiez votre configuration
   - Cliquez sur **Retour au tableau de bord**

## Étape 4 : Créer des informations d'identification OAuth 2.0

1. Accédez à **API et services** > **Identifiants**.
2. Cliquez sur **+ Créer des informations d'identification** > **ID client OAuth**.

<div class="mac-window">
  ![Créer un identifiant client OAuth](/img/google%20sso%20images/google%20-%207.png)
</div>
3. **Type d'application** : sélectionnez **Application Web**
4. **Nom** : saisissez un nom descriptif (par exemple, "SecureAI SSO Client")
5. **URI de redirection autorisés** : cliquez sur **+ Ajouter un URI** et saisissez :
   - `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
   - **Important** : L'URL doit correspondre exactement (y compris `https://` et `/api/auth/google/callback`)

<div class="mac-window">
  ![URI de redirection autorisés](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Cliquez sur **Créer**

## Étape 5 : Obtenez vos informations d'identification

Après avoir créé le client OAuth :

1. Une fenêtre contextuelle apparaîtra avec vos informations d'identification

<div class="mac-window">
  ![Popup des informations d'identification OAuth](/img/google%20sso%20images/google%20-%209.png)
</div>
2. **ID client** :
   - Ressemble à : `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`
   - **Copiez cette valeur** - vous en aurez besoin plus tard
3. **Secret client** :
   - Ressemble à : `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **Copiez cette valeur immédiatement**
   - **ATTENTION** : Ce secret n'est affiché qu'une seule fois dans la popup. Si vous le perdez, vous devrez créer un nouveau client OAuth

## Étape 6 : Envoyer des variables à l'équipe Hiper AI

Une fois que vous avez créé le client OAuth dans Google Cloud Console et suivi les étapes ci-dessus, vous aurez obtenu les informations essentielles suivantes :

1. **ID client** (à partir de l'étape 5)
2. **Secret client** (à partir de l'étape 5)
3. **URI de redirection** : `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`

Vous devez envoyer ces valeurs à l'équipe Hiper AI pour terminer l'intégration SSO.

### A. Accédez au panneau d'administration

1. Connectez-vous à votre instance SecureAI en tant qu'administrateur
2. Accédez à `https://{enterprise.name}.hiperai.ai/admin/home`
3. Dans le coin supérieur droit, cliquez sur la photo de votre profil d'administrateur
4. Cela ouvrira un menu déroulant avec diverses options

### B. Soumettre la demande d'assistance

1. Cliquez sur **"Obtenir de l'aide"** dans le menu déroulant.

<div class="mac-window">
  ![Obtenir le menu d'assistance](/img/microsoft%20entraid%20sso%20images/10%20-%20azure.png)
</div>

2. Une fenêtre contextuelle apparaîtra avec un formulaire de ticket d'assistance
3. Remplissez le formulaire avec les informations suivantes :
   - **Catégorie** : Sélectionnez **"Intégrations et implémentations"**

<div class="mac-window">
  ![Catégorie de formulaire de support](/img/microsoft%20entraid%20sso%20images/11%20-%20azure.png)
</div>

   - **Objet** : saisissez **"Intégration SSO de Google Workspace"**
   - **Description** : collez les valeurs que vous avez copiées lors du processus de configuration :
     - Identifiant client
     - Secret client
     - URI de redirection : `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
4. Cliquez sur le bouton **"Soumettre la demande"**

### C. Attendez la confirmation

- Vous recevrez un email de confirmation sous **24 à 72 heures** (selon disponibilité)
- L'e-mail confirmera que votre SSO a été configuré avec succès
- Une fois configuré, vous pourrez accéder à votre instance SecureAI en utilisant le bouton de connexion **"Continuer avec Google"** sur la page de connexion.

**Important** : Conservez vos informations d'identification en sécurité jusqu'à ce que l'intégration soit terminée. Ne les partagez pas via des canaux non sécurisés.

## Configuration utilisateur

### Utilisateurs existants

Les utilisateurs qui possèdent déjà des comptes dans SecureAI (qu'ils utilisent ou non l'authentification de base) **n'ont pas besoin d'être recréés**. Ils peuvent continuer à utiliser leurs comptes existants et pourront également se connecter à l'aide de Google Workspace SSO une fois celui-ci configuré.

**Important** : L'adresse e-mail de l'utilisateur dans Google Workspace doit correspondre exactement à l'adresse e-mail dans SecureAI pour que l'authentification unique fonctionne.

### Création de nouveaux utilisateurs SSO

Pour les nouveaux utilisateurs qui doivent accéder à SecureAI exclusivement via SSO :

1. Accédez à **Gestion des utilisateurs** dans le panneau d'administration SecureAI.
2. Cliquez pour créer un nouvel utilisateur
3. Lors de la création de l'utilisateur, sélectionnez l'option **"Compte professionnel / SSO"**
4. Cette configuration garantit que :
   - Le nouvel utilisateur **ne recevra pas d'e-mail** pour générer un mot de passe
   - L'utilisateur pourra accéder à SecureAI **directement à l'aide du bouton de connexion Google Workspace SSO**
   - L'e-mail de l'utilisateur dans Google Workspace doit correspondre exactement à l'e-mail saisi dans SecureAI

## Dépannage

### Erreur : "redirect_uri_mismatch"

- Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à ce qui est configuré sur le serveur
- Assurez-vous d'inclure `https://` (et non `http://` en production)
- L'URI de redirection doit être exactement : `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
- Vérifiez les barres obliques finales ou les fautes de frappe

### Erreur : "Utilisateur introuvable dans la base de données SecureAI"

- L'utilisateur doit être préalablement enregistré dans SecureAI
- Contacter l'administrateur SecureAI pour créer le compte utilisateur
- Vérifiez que l'adresse e-mail dans Google Workspace correspond exactement à l'adresse e-mail dans SecureAI

### Erreur : "Domaine de messagerie non autorisé pour la connexion à Google Workspace"

- Le domaine de messagerie de l'utilisateur ne figure pas dans la liste des domaines autorisés
- Contactez votre équipe de développement pour ajouter votre domaine à la liste autorisée
- Ou vérifiez que la configuration de la restriction de domaine est correcte

### Erreur : "access_denied" ou "unauthorized_client"

- Vérifiez que l'écran de consentement OAuth est correctement configuré
- Vérifiez que votre candidature est approuvée (si vous utilisez le type d'utilisateur externe)
- Assurez-vous que l'ID client et le secret client sont corrects

### Erreur : "client_invalide"

- Le secret client a peut-être été réinitialisé ou est incorrect
- Vérifiez le secret client dans Google Cloud Console
- Créez un nouveau Client Secret si nécessaire et fournissez la nouvelle valeur à votre équipe de développement

## Meilleures pratiques de sécurité en matière de secret client

1. **Ne confiez jamais de secrets aux référentiels de code**
2. **Alternez périodiquement les secrets** (recommandé : tous les 90 jours)
3. **Limiter l'accès** à la page d'informations d'identification de Google Cloud Console
4. **Utilisez des canaux sécurisés** lorsque vous partagez des secrets avec votre équipe de développement
5. **Surveiller l'utilisation** dans Google Cloud Console pour détecter toute activité suspecte

## Renouvellement de la clé secrète client

Pour alterner votre secret client (recommandé tous les 90 jours) :

1. Accédez à **API et services** > **Identifiants**.
2. Trouvez votre identifiant client OAuth 2.0
3. Cliquez sur l'**icône en forme de crayon** (Modifier)
4. Dans la section **Secret client**, cliquez sur **Réinitialiser le secret**.
5. **Copiez immédiatement** la nouvelle valeur secrète
6. Fournissez le nouveau secret à votre équipe de développement via la demande d'assistance du panneau d'administration
7. Ils mettront à jour la configuration sans interrompre le service
8. Après avoir confirmé le nouveau secret, vous pouvez éventuellement supprimer l'ancien secret.

**Remarque** : Il y a une brève période de chevauchement pendant la rotation pendant laquelle les deux secrets fonctionnent, permettant une transition en douceur.

## Test de la connexion SSO

Une fois la configuration terminée :

1. Accédez à votre page de connexion SecureAI
2. Cliquez sur **Continuer avec Google**
3. Sélectionnez votre compte Google Workspace
4. Accordez des autorisations si vous y êtes invité
5. Vous devriez être redirigé vers SecureAI et connecté

Si vous rencontrez des problèmes :
- Effacez les cookies de votre navigateur et réessayez
- Vérifiez que vous utilisez le bon compte Google Workspace
- Vérifiez que votre email existe dans SecureAI

## Assistance

Si vous rencontrez des problèmes lors de la configuration :

1. Vérifiez que vous disposez des autorisations d'administrateur dans Google Cloud Console
2. Vérifiez que vous disposez d'un accès administrateur à Google Workspace (si des restrictions de domaine sont utilisées)
3. Contactez votre équipe de développement via la demande d'assistance du panneau d'administration avec :
   - Captures d'écran des erreurs
   - L'identifiant client (vous pouvez le partager - ce n'est pas sensible)
   - Le message d'erreur complet
   - Toute erreur pertinente de la console du navigateur

**Ne partagez jamais votre secret client dans les demandes d'assistance** - partagez-le uniquement via des canaux sécurisés après avoir établi la vérification d'identité.

## Ressources supplémentaires

- [Documentation Google Cloud Console](https://cloud.google.com/docs)
- [Documentation Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Aide pour l'administrateur Google Workspace](https://support.google.com/a)