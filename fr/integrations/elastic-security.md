---
id: elastic-security
title: "Intégration de la sécurité élastique"
sidebar_label: "Sécurité élastique"
description: "Intégrez HiperAI à Elastic Security pour une détection avancée des menaces et des analyses de sécurité"
---
# Intégration de SecureAI avec Elastic SIEM

Ce guide fournit des instructions étape par étape sur la façon d'intégrer SecureAI à votre instance Elastic SIEM. Cette intégration vous permet de transférer les journaux d'événements de SecureAI vers Elasticsearch à des fins de surveillance, d'analyse et d'alerte.

## Étape 1 : Obtenez votre point de terminaison Elastic Cloud

Tout d'abord, vous devez obtenir l'URL du point de terminaison de votre déploiement Elastic Cloud.

1. Connectez-vous à votre compte Elastic Cloud.
2. Depuis la page d'accueil, localisez le déploiement souhaité.
3. Recherchez l'URL du point de terminaison Elasticsearch et copiez-la. Vous en aurez besoin plus tard pour la configuration de SecureAI.

<div class="mac-window">
  ![Point de terminaison Elastic Cloud](/img/elastic%20images/Elastic%20-%201.png)
</div>

## Étape 2 : Créer une clé API dans Elasticsearch

Une clé API est requise pour que SecureAI envoie des données en toute sécurité à votre cluster Elasticsearch.

1. Dans votre tableau de bord Kibana, accédez à **Gestion** > **Clés API**.
2. Cliquez sur le bouton **Créer une clé API**.

<div class="mac-window">
  ![Créer un bouton de clé API](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. Configurez la clé API avec les détails suivants :

<div class="mac-window">
  ![Configurer la clé API](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **Nom** : `secureai-siem-integration` (ou un autre nom descriptif).
   - **Rôle** : attribuez un rôle disposant des privilèges nécessaires pour écrire dans les index. Par souci de simplicité, dans ce guide, nous ne définissons pas de date d'expiration ni de restrictions de rôle spécifiques.
4. Cliquez sur **Créer une clé API**.

<div class="mac-window">
  ![Cliquez sur Créer une clé API](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. Votre clé sera générée et affichée. Copiez la clé API codée en Base64 et enregistrez-la dans un emplacement sécurisé. Vous ne pourrez plus le voir après avoir quitté cet écran.

<div class="mac-window">
  ![Clé API générée](/img/elastic%20images/Elastic%20-%205.png)
</div>

## Étape 3 : Créer l'index cible dans Elasticsearch

Vous devez créer et mapper un index dans Elasticsearch où les événements SecureAI seront stockés.

1. Dans Kibana, accédez à **Outils de développement**.
2. Dans la console, exécutez la commande suivante pour créer l'index `secureai-events` avec les mappages de champs appropriés :

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![Créer un index dans les outils de développement](/img/elastic%20images/Elastic%20-%206.png)
</div>

## Étape 4 : Configurer l'intégration Elastic SIEM dans SecureAI

Maintenant, entrez les détails d'Elastic dans le panneau des intégrations SecureAI.

1. Dans votre tableau de bord SecureAI, accédez à **Intégrations**.
2. Localisez la carte d'intégration **Elastic SIEM** et cliquez sur **Configurer**.
3. Remplissez les champs de configuration comme suit :
   - **Nom de l'intégration** : `secureai-app-elastic`
   - **URL élastique** : collez le point de terminaison que vous avez copié à l'étape 1.
   - **Clé API Elastic** : collez la clé API codée en Base64 que vous avez créée à l'étape 2.
   - **Indice élastique** : `secureai-events`
   - **Sélectionner les catégories d'événements** : cochez toutes les cases pour transférer tous les types d'événements disponibles vers votre Elastic SIEM.
4. Cliquez sur **Mettre à jour** pour enregistrer la configuration.

<div class="mac-window">
  ![Cliquez sur Mettre à jour pour enregistrer la configuration](/img/elastic%20images/Elastic%20-%207.png)
</div>

## Étape 5 : tester et vérifier la connexion

Après avoir enregistré la configuration, testez la connexion pour vous assurer que SecureAI peut communiquer avec votre instance Elastic.

1. Dans la fenêtre modale des paramètres d'intégration, cliquez sur le bouton **Test de connexion**.
2. Vous devriez voir un message de réussite : "Test réussi ! Connexion vérifiée."

<div class="mac-window">
  ![Message de réussite du test](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. Pour confirmer que les données de test ont été reçues, accédez à **Découvrir** dans Kibana.
4. Sélectionnez la vue de données `secureai-events` (modèle d'index).
5. Vous devriez voir un journal des événements de test de SecureAI, qui confirme que l'intégration fonctionne correctement.

<div class="mac-window">
  ![Confirmation du journal des événements de test](/img/elastic%20images/Elastic%20-%209.png)
</div>

Votre intégration SecureAI et Elastic SIEM est désormais active. Les événements seront enregistrés dans votre index `secureai-events` au fur et à mesure qu'ils se produisent.

## Terminé !

Avec ces étapes, votre instance Elastic est entièrement configurée pour s'intégrer à SecureAI 😎.