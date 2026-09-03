---
sidebar_position: 3
title: "Identifiant Microsoft Entra (SSO)"
---
# Intégration Microsoft Entra ID (SSO)

Ce guide vous guidera tout au long du processus de configuration de Microsoft Entra ID (anciennement Azure Active Directory) pour l'authentification unique (SSO) avec SecureAI. Vous apprendrez comment obtenir les informations d’identification nécessaires auprès d’Azure et les soumettre pour terminer l’intégration.

## Prérequis

- Accès administrateur au portail Azure
- Un locataire Azure Entra ID (Azure AD)
- Accès administrateur à SecureAI

## Étape 1 : Créer une application dans le portail Azure

1. Connectez-vous au [Portail Azure](https://portal.azure.com)
2. Recherchez et sélectionnez **Azure Active Directory** ou **Microsoft Entra ID**.

<div class="mac-window">
  ![Recherche sur le portail Azure](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

3. Dans le menu latéral, sélectionnez **Inscriptions d'applications**

<div class="mac-window">
  ![Menu d'inscription des applications](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

4. Cliquez sur **+ Nouvelle inscription**

<div class="mac-window">
  ![Nouveau bouton d'inscription](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

## Étape 2 : Configurer l'application

1. **Nom** : saisissez un nom descriptif (par exemple, "SecureAI SSO")
2. **Types de comptes pris en charge** :
   - Sélectionnez **Comptes dans cet annuaire organisationnel uniquement**
   - Ou **Comptes dans n'importe quel répertoire d'organisation** si vous devez prendre en charge plusieurs organisations
3. **URI de redirection** :
   - Plateforme : **Web**
   -URI : `https://your-backend-domain.com/api/auth/azure/callback`
   - **Remarque** : Vous obtiendrez cette URL auprès de votre équipe de développement
4. Cliquez sur **S'inscrire**

<div class="mac-window">
  ![Bouton d'inscription](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

## Étape 3 : Obtenez l'ID de l'application (client)

1. Sur la page **Aperçu** de votre candidature
2. Copiez la valeur **ID d'application (client)**
   - Il s'agit d'un GUID qui ressemble à ceci : `b96ee19f-5a15-4a85-b936-****-****`
   - **Enregistrez cette valeur** - vous en aurez besoin plus tard

## Étape 4 : Obtenez l'ID d'annuaire (locataire)

1. Sur la même page **Présentation**
2. Copiez la valeur **ID d'annuaire (locataire)**
   - Il s'agit d'un GUID qui ressemble à ceci : `155812d2-1112-46c8-bf52-****-****`
   - **Enregistrez cette valeur** - vous en aurez besoin plus tard

## Étape 5 : Créer une clé secrète client

1. Dans le menu latéral de votre application, sélectionnez **Certificats et secrets**

<div class="mac-window">
  ![Menu Certificats et secrets](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Dans la section **Secrets client**, cliquez sur **+ Nouveau secret client**.
3. **Description** : saisissez une description (par exemple, "SecureAI SSO Secret")
4. **Expire** :
   - Sélectionnez une période d'expiration (recommandé : 24 mois)
   - **IMPORTANT** : Assurez-vous de renouveler le secret avant son expiration
5. Cliquez sur **Ajouter**

<div class="mac-window">
  ![Ajouter un bouton secret client](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

6. **IMMÉDIATEMENT** copiez la **Valeur** du secret
   - Cela ressemblera à ceci : `plm8Q~************************************`

<div class="mac-window">
  ![Valeur secrète client](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>
   - **AVERTISSEMENT** : Cette valeur n'est affichée qu'une seule fois. Si vous le perdez, vous devrez créer un nouveau secret
   - **Stockez cette valeur en toute sécurité**

## Étape 6 : Configurer les autorisations de l'API

1. Dans le menu latéral, sélectionnez **Autorisations API**
2. Cliquez sur **+ Ajouter une autorisation**
3. Sélectionnez **Microsoft Graph**
4. Sélectionnez **Autorisations déléguées**
5. Vérifiez les autorisations suivantes :
   - `openid` (automatiquement inclus)
   - `profile`
   - `email`
6. Cliquez sur **Ajouter des autorisations**

<div class="mac-window">
  ![Ajouter un bouton d'autorisations](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

7. Si votre organisation requiert le consentement de l'administrateur :
   - Cliquez sur ** Accorder le consentement de l'administrateur **

<div class="mac-window">
  ![Bouton Accorder le consentement de l'administrateur](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

## Étape 7 : Envoyer des variables à l'équipe Hiper AI

Une fois que vous avez créé l'application dans Azure et suivi les étapes ci-dessus, vous aurez obtenu trois informations critiques :

1. **ID client** (à partir de l'étape 3)
2. **ID du locataire** (à partir de l'étape 4)
3. **Valeur secrète du client** (à partir de l'étape 5)

Vous devez envoyer ces trois valeurs à l'équipe Hiper AI pour terminer l'intégration SSO.

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

   - **Objet** : Saisissez **"Intégration SSO Microsoft Entra ID"**
   - **Description** : collez les trois valeurs que vous avez copiées lors du processus de configuration :
     - ID client (ID d'application)
     - ID du locataire (ID d'annuaire)
     - Valeur secrète client
4. Cliquez sur le bouton **"Soumettre la demande"**

### C. Attendez la confirmation

- Vous recevrez un email de confirmation sous **24 à 72 heures** (selon disponibilité)
- L'e-mail confirmera que votre SSO a été configuré avec succès
- Une fois configuré, vous pourrez accéder à votre instance SecureAI à l'aide du bouton de connexion **"Continuer avec Azure EntraID"** sur la page de connexion.

**Important** : Conservez vos informations d'identification en sécurité jusqu'à ce que l'intégration soit terminée. Ne les partagez pas via des canaux non sécurisés.

## Configuration utilisateur

### Utilisateurs existants

Les utilisateurs qui possèdent déjà des comptes dans SecureAI (qu'ils utilisent ou non l'authentification de base) **n'ont pas besoin d'être recréés**. Ils peuvent continuer à utiliser leurs comptes existants et pourront également se connecter à l’aide de l’authentification unique Azure Entra ID une fois celle-ci configurée.

**Important** : L'e-mail de l'utilisateur dans Azure doit correspondre exactement à l'e-mail dans SecureAI pour que SSO fonctionne.

### Création de nouveaux utilisateurs SSO

Pour les nouveaux utilisateurs qui doivent accéder à SecureAI exclusivement via SSO :

1. Accédez à **Gestion des utilisateurs** dans le panneau d'administration SecureAI.
2. Cliquez pour créer un nouvel utilisateur
3. Lors de la création de l'utilisateur, sélectionnez l'option **"Compte professionnel / SSO"**
4. Cette configuration garantit que :
   - Le nouvel utilisateur **ne recevra pas d'e-mail** pour générer un mot de passe
   - L'utilisateur pourra accéder à SecureAI **directement à l'aide du bouton de connexion Azure Entra ID SSO**
   - L'e-mail de l'utilisateur dans Azure doit correspondre exactement à l'e-mail saisi dans SecureAI

## Dépannage

### Erreur : « la valeur redirect_uri doit être un URI absolu valide »
- Vérifiez que l'URI de redirection dans Azure correspond exactement à ce qui est configuré sur le serveur
- Assurez-vous d'inclure `https://` ou `http://` selon le cas

### Erreur : "Utilisateur introuvable dans la base de données SecureAI"
- L'utilisateur doit être préalablement enregistré dans SecureAI
- Contacter l'administrateur SecureAI pour créer le compte utilisateur

### Erreur : « Secret client non valide »
- Le secret a peut-être expiré
- Créer un nouveau secret client et mettre à jour la configuration

## Renouvellement de la clé secrète client

Le secret client a une date d’expiration. Avant son expiration :

1. Créez un nouveau secret client après l'étape 5
2. Offrez la nouvelle valeur à votre équipe de développement
3. Ils mettront à jour la configuration sans interrompre le service

## Assistance

Si vous rencontrez des problèmes lors de la configuration :
1. Vérifiez que vous disposez des autorisations d'administrateur dans Azure
2. Contactez votre équipe de développement avec :
   - Captures d'écran des erreurs
   - Les identifiants que vous avez obtenus (sans le secret)
   - Le message d'erreur complet