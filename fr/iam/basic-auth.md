---
sidebar_position: 4
title: "Authentification de base"
---
# Authentification de base

L'authentification de base fournit une méthode simple d'authentification par nom d'utilisateur et mot de passe pour SecureAI. Les utilisateurs s'authentifient auprès de notre base de données à l'aide de leurs informations d'identification, avec une prise en charge facultative de l'authentification multifacteur.

## Qu'est-ce que l'authentification de base ?

**L'authentification de base** est une méthode d'authentification simple qui utilise un nom d'utilisateur et un mot de passe pour authentifier les utilisateurs auprès de notre base de données. Il s'agit de la méthode d'authentification la plus simple disponible dans SecureAI.

## Principales fonctionnalités

### **Connexion simple**
- **Nom d'utilisateur et mot de passe** : les utilisateurs fournissent leurs informations d'identification pour se connecter
- **Authentification de base de données** : les informations d'identification sont vérifiées par rapport à notre base de données
- **Stockage sécurisé** : les mots de passe sont hachés et stockés en toute sécurité

### **Authentification multifacteur (MFA)**
- **Google Authenticator** : les utilisateurs peuvent inscrire leur application Google Authenticator
- **Microsoft Authenticator** : prise en charge de l'application Microsoft Authenticator
- **Configuration du code QR** : processus d'inscription facile avec des codes QR
- **Codes de sauvegarde** : codes de récupération pour l'accès au compte

### **Configuration OTP par e-mail**
- **Default Email OTP** : Email OTP est activé par défaut comme deuxième facteur
- **Désactivation par utilisateur** : les administrateurs peuvent désactiver l'OTP de messagerie pour des utilisateurs spécifiques
- **Alternative MFA** : les utilisateurs peuvent passer de l'OTP de messagerie aux applications d'authentification

## Comment ça marche

### **Flux d'authentification**
1. **Connexion utilisateur** : l'utilisateur saisit son nom d'utilisateur et son mot de passe.
2. **Vérification des informations d'identification** : le système vérifie les informations d'identification par rapport à la base de données
3. **Deuxième facteur** : e-mail OTP envoyé ou code d'application MFA requis
4. **Accès accordé** : l'utilisateur a accès à la plateforme SecureAI

### **Comportement du deuxième facteur**
- **Avant la configuration de MFA** : l'OTP par e-mail est toujours requis comme deuxième facteur
- **Après la configuration MFA** : l'utilisateur peut choisir entre un e-mail OTP ou un code MFA
- **Options de connexion** : l'utilisateur sélectionne la méthode préférée du deuxième facteur lors de la connexion
- **Repli** : Email OTP reste disponible comme option de sauvegarde

## Expérience utilisateur

### **Première connexion (avant MFA)**
- Entrez le nom d'utilisateur et le mot de passe
- Recevoir un e-mail OTP comme deuxième facteur
- Accéder à la plateforme SecureAI

### **Processus de configuration de l'AMF**
1. ** Accédez au chat ** : accédez à "/chat-ai/new-chat" ou à n'importe quelle page de chat
2. **Ouvrir le menu Profil** : cliquez sur l'image de profil dans le coin supérieur droit.
3. **Accéder aux paramètres** : sélectionnez « Paramètres » dans la liste déroulante.
4. **Allez dans Sécurité** : Cliquez sur l'onglet "Sécurité"
5. **Activer MFA** : cliquez sur "Activer l'authentification multifacteur".
6. **Scannez le code QR** : utilisez Google ou Microsoft Authenticator pour scanner le code QR
7. **Entrez le code** : saisissez le code à 6 chiffres de votre application d'authentification
8. **Enregistrer les codes de sauvegarde** : stockez les codes de sauvegarde générés en toute sécurité

### **Connexion après la configuration MFA**
- Entrez le nom d'utilisateur et le mot de passe
- Choisissez la méthode du deuxième facteur :
  - **E-mail OTP** : recevez le code par e-mail
  - **Code MFA** : saisissez le code de l'application d'authentification
- Accéder à la plateforme SecureAI

### **Utilisation du code de sauvegarde**
- Utilisez des codes de sauvegarde si l'application d'authentification n'est pas disponible
- Chaque code de sauvegarde ne peut être utilisé qu'une seule fois
- Générez de nouveaux codes de sauvegarde si nécessaire

## Fonctionnalités de sécurité

### **Sécurité par mot de passe**
- **Strong Hashing** : les mots de passe sont hachés en toute sécurité
- **Stockage de base de données** : informations d'identification stockées dans notre base de données
- **Transmission sécurisée** : Toutes les données d'authentification cryptées

### **Sécurité MFA**
- **Codes basés sur le temps** : les applications d'authentification génèrent des codes basés sur le temps
- **Inscription sécurisée** : configuration sécurisée basée sur un code QR
- **Récupération de sauvegarde** : codes de sauvegarde pour la récupération de compte

### **Gestion des sessions**
- **Sessions sécurisées** : gestion des sessions cryptées
- **Protection contre l'expiration** : expiration automatique de la session
- **Contrôle de session simultané** : gérez plusieurs sessions actives

## Pour commencer

1. **Activer l'authentification de base** : configurer dans le panneau d'administration
2. **Créer des comptes utilisateur** : configurer les informations d'identification de l'utilisateur
3. **Configurer MFA** : activer l'authentification multifacteur
4. **Formation des utilisateurs** : informez les utilisateurs sur le processus de connexion
5. **Surveiller l'utilisation** : suivez les modèles d'authentification

## Prochaines étapes

- [Google Workspace](/fr/iam/google-workspace) - Intégration à Google Workspace
- [Microsoft Entra ID](/fr/iam/microsoft-entra-id) - Connectez-vous avec Microsoft Entra ID
- [Présentation IAM](/fr/iam/overview) - En savoir plus sur la gestion des identités