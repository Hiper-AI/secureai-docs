---
id: splunk-security
title: "Intégration de la sécurité Splunk"
sidebar_label: "Sécurité Splunk"
description: "Guide d'intégration : Connexion de Splunk SIEM à HiperAI via HTTP Event Collector (HEC)"
---
# Intégration de la sécurité Splunk

Guide d'intégration : Connecter Splunk SIEM à HiperAI

Ce guide décrit les étapes nécessaires pour configurer Splunk pour recevoir les journaux de sécurité de HiperAI via le HTTP Event Collector (HEC).

## Étape 1 : Créer un nouvel index

Dans un premier temps, nous allons créer un espace dédié pour stocker les logs de l'application.

### A. Depuis l'écran d'accueil de Splunk, accédez à Paramètres > Index.

<div class="mac-window">
  ![Index des paramètres Splunk](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. Cliquez sur le bouton Nouvel index dans le coin supérieur droit.

### C. Configurez l'index :

- **Nom de l'index** : `secureai_events`
- Laissez toutes les autres options avec leurs valeurs par défaut pour une configuration standard.
- Cliquez sur **Enregistrer**.

<div class="mac-window">
  ![Configuration de l'index Splunk](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

Votre nouvel index est maintenant créé et prêt à recevoir des données.

## Étape 2 : Activer le collecteur d'événements HTTP (HEC)

Ensuite, nous veillerons à ce que Splunk écoute les demandes de données entrantes.

### A. Accédez à Paramètres > Entrées de données.

<div class="mac-window">
  ![Entrées de données Splunk](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. Sous « Entrées locales », cliquez sur HTTP Event Collector.

<div class="mac-window">
  ![Collecteur d'événements HTTP Splunk](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. Dans le coin supérieur droit, cliquez sur Paramètres globaux.

### D. Vérifiez la configuration suivante :

- **Tous les jetons** : doivent être activés.
- **Activer SSL** : (Facultatif) Ceci est recommandé pour les environnements de production mais peut être désactivé pour les tests initiaux.
- **Numéro de port HTTP** : assurez-vous que le port est 8088.
- Cliquez sur **Enregistrer**.

<div class="mac-window">
  ![Paramètres globaux Splunk HEC](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## Étape 3 : Créer le jeton HEC

Le jeton est la clé d'accès sécurisée que notre application utilisera pour s'authentifier auprès de Splunk.

### A. Revenez à la page HTTP Event Collector (Paramètres > Entrées de données > HTTP Event Collector).

### B. Cliquez sur le bouton Nouveau jeton.

<div class="mac-window">
  ![Bouton Splunk Nouveau jeton](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. Configuration du jeton (onglet 1) :

- **Nom** : `token_secureai_app`
- **Description** : (Facultatif) Ajoutez une brève description.
- **Activer la reconnaissance de l'indexeur** : **IMPORTANT** : assurez-vous que cette case n'est pas cochée.
- Cliquez sur **Suivant**.

<div class="mac-window">
  ![Configuration du jeton Splunk](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. Paramètres d'entrée (onglet 2) :

- **Type de source** : cliquez sur Sélectionner. Dans le champ de recherche, tapez `_json` et sélectionnez-le dans la liste. Cela indique à Splunk d'attendre des données au format JSON.
- **Index autorisés** : dans la colonne « Index disponibles », recherchez l'index que nous avons créé (`secureai_events`) et cliquez dessus pour le déplacer vers la colonne « Index sélectionnés ».
- **Index par défaut** : Sélectionnez `secureai_events` dans le menu déroulant.

<div class="mac-window">
  ![Paramètres d'entrée Splunk](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- Cliquez sur **Réviser**, puis sur **Soumettre**.

<div class="mac-window">
  ![Révision Splunk et soumission](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. Copiez la valeur du jeton !

Splunk affichera désormais la valeur du jeton. Copiez-le immédiatement et enregistrez-le dans un emplacement sécurisé. C'est le token que vous devrez configurer dans notre application.

<div class="mac-window">
  ![Valeur du jeton Splunk](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## Étape 4 : Finaliser et partager les informations

Vous avez presque terminé. Juste une dernière étape.

### A. Rassembler les informations

Pour terminer l'intégration, l'application a besoin des trois informations suivantes :

1. **URL HEC** : l'adresse de votre serveur Splunk et le port HEC (par exemple, `http://splunk.yourcompany.com:8088/services/collector`).
2. **Le jeton HEC** : la valeur que vous avez copiée à l'étape précédente.
3. **Le nom de l'index** : Le nom de l'index que vous avez créé (`secureai_events`).

<div class="mac-window">
  ![Informations sur l'index Splunk](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. Vérifier les règles du pare-feu

Assurez-vous que tout pare-feu entre le serveur d'applications et votre serveur Splunk autorise le trafic sur le port HEC (généralement TCP 8088).

## Étape 4 : Remarque sur le format des données (type de source)

Pour garantir que les données sont correctement identifiées et analysées, notre application envoie des journaux dans un format JSON structuré spécifique.

**Important** : Tous les événements envoyés depuis SecureAI auront le type de source `secureai:json`.

Cette valeur est définie directement dans la charge utile de données envoyée par notre application, elle remplacera donc automatiquement le type de source par défaut (`_json`) que vous avez sélectionné pour le jeton. Aucune autre action n'est requise, mais il est important que vous sachiez que vous trouverez les données sous sourcetype="secureai:json" dans vos recherches.

## Étape 6 : Vérifiez l'intégration

Une fois que vous avez saisi les détails d'intégration dans l'application SecureAI, vous pouvez vérifier que la connexion fonctionne correctement.

### A. Testez la connexion

Utilisez le bouton "Test de connexion" au sein de notre application. Cela enverra un événement de test à votre index Splunk.

<div class="mac-window">
  ![Test de connexion Splunk](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

Vous verrez un message de réussite si l'événement a été envoyé correctement ou un message d'erreur si l'une des données fournies est incorrecte.

### B. Rechercher l'événement test dans Splunk

Pour voir si l’événement est arrivé dans Splunk, accédez à l’application Search & Reporting.

Dans la barre de recherche, lancez une recherche sur votre index (par exemple, `index="secureai_events"`).

Définissez la plage horaire sur « Dernières 24 heures ». Vous devriez voir le journal du test apparaître dans les résultats.

<div class="mac-window">
  ![Résultats de recherche Splunk](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**Remarque** : En fonction du trafic réseau et de la charge du système, l'affichage des journaux dans Splunk peut parfois prendre jusqu'à 10 minutes.

## Terminé !

Avec ces étapes, votre instance Splunk est entièrement configurée pour s'intégrer à SecureAI 😎.