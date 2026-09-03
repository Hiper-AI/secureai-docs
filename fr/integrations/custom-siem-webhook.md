---
id: custom-siem-webhook
title: "Intégration SIEM / Webhook personnalisée"
sidebar_label: "SIEM/Webhook personnalisé"
description: "Intégration SIEM générique (HTTP/Webhook) pour l'envoi de journaux de sécurité SecureAI à n'importe quel point de terminaison HTTP personnalisé"
---
# Intégration SIEM générique (HTTP/Webhook)

## Aperçu

L'intégration générique SIEM (HTTP/Webhook) vous permet d'envoyer des journaux de sécurité SecureAI à n'importe quel point de terminaison HTTP personnalisé. C'est parfait pour l'intégration avec des systèmes SIEM qui ne disposent pas de support natif, d'outils de sécurité personnalisés ou de système de journalisation basé sur HTTP.

## Cas d'utilisation

- **Systèmes SIEM personnalisés** : envoyez des journaux à vos outils internes de surveillance de la sécurité
- **Plateformes de sécurité tierces** : intégration avec des outils de sécurité qui acceptent les webhooks
- **Tableaux de bord personnalisés** : créez votre propre visualisation des événements de sécurité
- **Test et développement** : utilisez les services de test de webhook pour vérifier la livraison des journaux
- **Systèmes hérités** : connectez-vous à des outils de sécurité plus anciens qui ne prennent en charge que les points de terminaison HTTP.

## Étapes de configuration

### 1. Obtenez un point de terminaison de test

À des fins de tests, nous vous recommandons d'utiliser webhook.site :

1. Visitez [https://webhook.site](https://webhook.site)
2. Copiez votre URL unique (par exemple, `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`)
3. Gardez cette page ouverte pour surveiller les webhooks entrants

<div class="mac-window">
  ![Point de terminaison de test Webhook.site](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%201.png)
</div>

### 2. Configurez l'intégration

1. Accédez à **Intégrations** dans votre panneau d'administration SecureAI.
2. Recherchez **"SIEM générique (HTTP/Webhook)"** dans la catégorie SIEM
3. Cliquez sur **"Connecter l'intégration"**

### 3. Remplissez la configuration

#### Paramètres de base

- **Nom de l'intégration** : `Test Generic SIEM` (ou tout nom descriptif)
- **URL du point de terminaison** : `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`
- **Méthode HTTP** : `POST` (recommandée pour la plupart des plateformes SIEM)
- **En-têtes HTTP** : `{"Content-Type": "application/json"}`

<div class="mac-window">
  ![Configuration des en-têtes HTTP](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%202.png)
</div>

#### Catégories d'événements

Sélectionnez les types d'événements à transférer :

✅ **Recommandé pour les tests :**
- Authentification et connexion
- Utilisation de l'API et du modèle
- Accès aux données et PHI
- SMLTP et politiques
- Limites de facturation et d'utilisation
- Analyse

⚠️ **Facultatif (peut générer un volume élevé) :**
- Sécurité et violations
- Système et infrastructure
- Modifications de configuration

### 4. Testez la connexion

1. Cliquez sur **"Test de connexion"** pour vérifier la connectivité.

<div class="mac-window">
  ![Bouton Tester la connexion](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%203.png)
</div>

2. Vérifiez webhook.site – vous devriez voir une demande de test
3. Vérifiez que la réponse montre le succès

<div class="mac-window">
  ![Vérification de la réponse réussie](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%204.png)
</div>

### 5. Enregistrer et surveiller

1. Cliquez sur **"Connecter"** pour enregistrer la configuration
2. Effectuez des actions dans votre système SecureAI (connexion, appels API, etc.)
3. Surveillez webhook.site pour voir les journaux en temps réel

## Configuration avancée

### En-têtes personnalisés

Vous pouvez ajouter des en-têtes personnalisés pour l'authentification ou des exigences spécifiques :

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-api-key",
  "X-Custom-Header": "custom-value"
}
```

### Quand utiliser un SIEM personnalisé

L'intégration Custom SIEM est particulièrement utile dans ces scénarios :

- **Pas de système SIEM** : si vous n'utilisez actuellement aucune plateforme SIEM, cela constitue un moyen simple de commencer à collecter des journaux de sécurité.
- **Destinations de données supplémentaires** : envoyez des données à plusieurs emplacements simultanément (par exemple, votre SIEM principal + un système de sauvegarde)
- **Outils personnalisés** : intégration à des outils de sécurité spécialisés, des centres de données ou des tableaux de bord personnalisés
- **Plateformes de communication** : envoyez des alertes aux canaux Teams, Slack ou à d'autres outils de collaboration
- **Systèmes hérités** : connectez-vous à des outils de sécurité plus anciens qui ne prennent en charge que les points de terminaison HTTP.
- **Test et développement** : utilisez les services de test de webhook pour vérifier la livraison des journaux avant le déploiement en production.

**Remarque** : Si vous disposez déjà d'un SIEM pris en charge (Splunk, Microsoft Sentinel, Elastic), nous vous recommandons d'utiliser nos intégrations natives pour des performances et des fonctionnalités optimales.

## Dépannage

### Problèmes courants

1. **Délai d'expiration de la connexion** : vérifiez si le point de terminaison est accessible et répond
2. **Erreurs d'authentification** : vérifiez les clés API et les en-têtes d'authentification
3. **Problèmes SSL/TLS** : assurez-vous que la validation du certificat est appropriée pour les points de terminaison HTTPS

### Surveillance

- Vérifiez l'état de l'intégration dans votre panneau d'administration SecureAI
- Surveiller les taux de réussite de la livraison des webhooks
- Examiner les tentatives de webhook ayant échoué dans les journaux
- Vérifier la disponibilité des points de terminaison et les temps de réponse

## Considérations de sécurité

- **HTTPS uniquement** : utilisez toujours les points de terminaison HTTPS en production
- **Authentification** : implémentez une authentification appropriée pour vos points de terminaison webhook
- **Rate Limiting** : configurez des limites de débit appropriées sur vos points de terminaison
- **Conservation des journaux** : mettez en œuvre des politiques de conservation des journaux appropriées pour assurer la conformité
- **Contrôle d'accès** : restreindre l'accès aux points de terminaison du webhook aux systèmes autorisés uniquement

## meilleures pratiques

1. **Commencez petit** : commencez par les catégories d'événements essentielles et développez progressivement
2. **Testez minutieusement** : utilisez webhook.site ou des services similaires pour les tests initiaux
3. **Surveiller les performances** : surveillez les retards ou les échecs de livraison des webhooks
4. **Configuration du document** : conservez des enregistrements détaillés de la configuration de votre webhook
5. **Révision régulière** : examinez et mettez à jour périodiquement les configurations des webhooks
6. **Plans de sauvegarde** : disposez de méthodes de journalisation alternatives en cas d'échec des webhooks

## Terminé ! 

Avec ces étapes, votre instance de Webhook personnalisé est entièrement configurée pour s'intégrer à SecureAI 😎.