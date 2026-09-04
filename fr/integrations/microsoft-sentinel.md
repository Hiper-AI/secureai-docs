---
id: microsoft-sentinel
title: "Intégration de Microsoft Sentinel"
sidebar_label: "Microsoft Sentinelle"
description: "Guide d'intégration : connexion de Microsoft Sentinel à HiperAI via Azure Data Collection Rules (DCR)"
---
# Intégration Microsoft Sentinel

Guide d'intégration : connexion de Microsoft Sentinel à HiperAI

Ce guide décrit les étapes nécessaires pour configurer Microsoft Sentinel pour recevoir les journaux de sécurité de SecureAI via Azure Data Collection Rules (DCR).

## Étape 1 : Créer l'identité de l'application (enregistrement de l'application)

Tout d’abord, nous allons créer une identité pour votre application dans Azure, lui permettant de s’authentifier en toute sécurité.

### A. Accédez à Azure Active Directory

Dans le portail Azure, recherchez et sélectionnez **Azure Active Directory**.

<div class="mac-window">
  ![Recherche Azure Active Directory](/img/ms%20sentinel%20-%20images/Sentinel%20-%201.png)
</div>

### B. Nouvelle inscription

Dans le menu de gauche, accédez à **Inscriptions d'applications** et cliquez sur **+ Nouvelle inscription**.

<div class="mac-window">
  ![Menu d'inscription des applications](/img/ms%20sentinel%20-%20images/Sentinel%20-%202.png)
</div>

### C. Nommer l'application

Fournissez un nom clair, tel que `SecureAI-Log-Ingester` et laissez les autres options par défaut. Cliquez sur **S'inscrire**.

<div class="mac-window">
  ![Formulaire d'inscription de l'application](/img/ms%20sentinel%20-%20images/Sentinel%20-%203.png)
</div>

### D. Copiez les identifiants

À partir de la page Présentation de la nouvelle application, copiez et stockez en toute sécurité les valeurs suivantes :
- **ID d'application (client)**
- **ID de répertoire (locataire)**

<div class="mac-window">
  ![Présentation de l'application avec identifiants](/img/ms%20sentinel%20-%20images/Sentinel%20-%204.png)
</div>

### E. Créer le secret client

Dans le menu de gauche, accédez à **Certificats et secrets** et cliquez sur **+ Nouveau secret client**. Fournissez une description (par exemple, « SentinelLogKey ») et cliquez sur **Ajouter**.

<div class="mac-window">
  ![Créer un secret client](/img/ms%20sentinel%20-%20images/Sentinel%20-%205.png)
</div>

**ÉTAPE CRITIQUE** : copiez immédiatement la **Valeur** du secret. C'est la seule fois où il sera entièrement visible. Conservez-le en toute sécurité avec les autres identifiants.

<div class="mac-window">
  ![Valeur secrète client](/img/ms%20sentinel%20-%20images/Sentinel%20-%206.png)
</div>

## Étape 2 : Créer l'infrastructure d'ingestion Azure

Maintenant, nous allons construire le « chemin » et le « stockage » pour vos journaux.

### A. Créer le point de terminaison de collecte de données (DCE)

#### 1. Trouver le service

Dans la barre de recherche Azure, recherchez et sélectionnez **Points de terminaison de collecte de données**.

<div class="mac-window">
  ![Rechercher les points de terminaison de la collecte de données](/img/ms%20sentinel%20-%20images/Sentinel%20-%207.png)
</div>

#### 2. Créer un nouveau DCE

Cliquez sur ** Créer **.

<div class="mac-window">
  ![Créer un point de terminaison de collecte de données](/img/ms%20sentinel%20-%20images/Sentinel%20-%208.png)
</div>

#### 3. Configurez le DCE

- **Nom** : `dce-secureai-integration`
- **Région** : choisissez la même région que votre espace de travail Log Analytics
– Cliquez sur **Réviser + Créer**, puis sur **Créer**.

<div class="mac-window">
  ![Examiner et créer un DCE](/img/ms%20sentinel%20-%20images/Sentinel%20-%209.png)
</div>

#### 4. Copiez l'URI

Une fois déployé, accédez à la ressource. Sur sa page Présentation, copiez l'**URI d'ingestion des journaux** et enregistrez-le.

<div class="mac-window">
  ![Présentation du DCE avec URI](/img/ms%20sentinel%20-%20images/Sentinel%20-%2010.png)
</div>

### B. Créer la table personnalisée et la règle de collecte de données (DCR)

#### 1. Accédez à Log Analytics

Accédez à votre **espace de travail Log Analytics**.

#### 2. Créez un tableau personnalisé

Dans le menu de gauche, cliquez sur **Tables**, puis sur **Créer** et sélectionnez **Nouveau journal personnalisé (basé sur DCR)**.

<div class="mac-window">
  ![Créer un tableau personnalisé](/img/ms%20sentinel%20-%20images/Sentinel%20-%2011.png)
</div>

#### 3. Onglet "Bases"

- **Nom de la table** : `secureaitosiem` (Azure ajoutera automatiquement `_CL`, ce qui donnera le nom complet `secureaitosiem_CL`)
- **Règle de collecte de données** : sélectionnez "Créer un nouveau..." et nommez-le `dcr-secureai-events`

<div class="mac-window">
  ![Configuration des règles de collecte de données](/img/ms%20sentinel%20-%20images/Sentinel%20-%2012.png)
</div>

- **Point de terminaison de la collecte de données** : sélectionnez le DCE que vous avez créé précédemment (`dce-secureai-integration`)
- Cliquez sur **Suivant : Schéma et transformation**

<div class="mac-window">
  ![Schéma et transformation suivants](/img/ms%20sentinel%20-%20images/Sentinel%20-%2013.png)
</div>

#### 4. Onglet "Schéma et transformation"

**Télécharger un exemple de fichier** : le système vous le demandera. Créez un fichier `.json` avec le contenu suivant et téléchargez-le :

```json
[
  {
    "time": "2025-08-30T21:34:29.013Z",
    "level": "Info",
    "message": "SecureAI platform started successfully",
    "component": "SystemService",
    "correlationId": "test-001"
  },
  {
    "time": "2025-08-30T21:34:30.013Z",
    "level": "Warning",
    "message": "High memory usage detected on server",
    "component": "MonitoringService",
    "correlationId": "test-002"
  },
  {
    "time": "2025-08-30T21:34:31.013Z",
    "level": "Error",
    "message": "Database connection timeout after 30 seconds",
    "component": "DatabaseService",
    "correlationId": "test-003"
  },
  {
    "time": "2025-08-30T21:34:32.013Z",
    "level": "Info",
    "message": "User admin@secureai.com logged in successfully",
    "component": "AuthService",
    "correlationId": "test-004"
  },
  {
    "time": "2025-08-30T21:34:33.013Z",
    "level": "Warning",
    "message": "API rate limit approaching threshold",
    "component": "APIGateway",
    "correlationId": "test-005"
  },
  {
    "time": "2025-08-30T21:34:34.013Z",
    "level": "Info",
    "message": "Security scan completed - 0 threats found",
    "component": "SecurityScanner",
    "correlationId": "test-006"
  },
  {
    "time": "2025-08-30T21:34:35.013Z",
    "level": "Error",
    "message": "Failed to sync with external SIEM system",
    "component": "SIEMSync",
    "correlationId": "test-007"
  },
  {
    "time": "2025-08-30T21:34:36.013Z",
    "level": "Info",
    "message": "Backup job completed successfully",
    "component": "BackupService",
    "correlationId": "test-008"
  }
]
```

**Télécharger un exemple de fichier** : vous pouvez également télécharger l'exemple de fichier JSON complet à utiliser directement :

<a href="/fr/sample-json.json" download>📥 exemple.json</a>

#### 5. Appliquer la transformation

Le système peut afficher un avertissement concernant le champ TimeGenerated. Cliquez sur le bouton **Éditeur de transformation**, supprimez tout le contenu existant et collez la requête KQL complète suivante :

```kql
source
| extend TimeGenerated = todatetime(['time'])
| project
    TimeGenerated,
    Level_s = tostring(['level']),
    Message_s = tostring(['message']),
    Component_s = tostring(['component']),
    CorrelationId_s = tostring(['correlationId'])
```

<div class="mac-window">
  ![Requête de transformation KQL](/img/ms%20sentinel%20-%20images/Sentinel%20-%2014.png)
</div>

Cliquez sur **Appliquer**. Vous devriez voir un aperçu du tableau avec toutes les colonnes et types de données corrects.

<div class="mac-window">
  ![Appliquer la transformation](/img/ms%20sentinel%20-%20images/Sentinel%20-%2015.png)
</div>

#### 6. Finaliser la création

Cliquez sur **Suivant : Vérifier + créer**, puis sur **Créer**.

<div class="mac-window">
  ![Examiner et créer un DCR](/img/ms%20sentinel%20-%20images/Sentinel%20-%2016.png)
</div>

## Étape 3 : Connecter l'identité à l'infrastructure (autorisations)

Cette étape cruciale autorise notre application à utiliser la règle de collecte de données que nous venons de créer.

### A. Accédez à votre nouveau DCR

Recherchez et ouvrez votre règle de collecte de données, `dcr-secureai-events` et dans « Présentation », copiez l'ID immuable et enregistrez-le pour l'intégration.

<div class="mac-window">
  ![Aperçu du DCR avec ID immuable](/img/ms%20sentinel%20-%20images/Sentinel%20-%2017.png)
</div>

### B. Attribuer le rôle

Dans le menu de gauche, accédez à **Contrôle d'accès (IAM)** et cliquez sur **+ Ajouter** → **Ajouter une attribution de rôle**.

<div class="mac-window">
  ![Ajouter une attribution de rôle](/img/ms%20sentinel%20-%20images/Sentinel%20-%2018.png)
</div>

**Rôle** : recherchez et sélectionnez **Monitoring Metrics Publisher**.

<div class="mac-window">
  ![Sélectionnez le rôle d'éditeur de métriques de surveillance](/img/ms%20sentinel%20-%20images/Sentinel%20-%2019.png)
</div>

**Membres** : cliquez sur **Sélectionner des membres** et recherchez le nom d'enregistrement de votre application (`SecureAI-Log-Ingester`). Sélectionnez-le.

<div class="mac-window">
  ![Sélectionnez un membre d'enregistrement de l'application](/img/ms%20sentinel%20-%20images/Sentinel%20-%2020.png)
</div>

Cliquez sur **Réviser + attribuer**.

## Étape 4 : Finaliser et partager les informations

Vous avez presque terminé. Juste une dernière étape.

### A. Rassembler les informations

Pour terminer l'intégration, l'application a besoin des six informations suivantes :

1. **ID du locataire** : (à partir de l'étape 1)
2. **ID client** : (à partir de l'étape 1)
3. **Secret client** : (à partir de l'étape 1)
4. **URI DCE** : (à partir de l'étape 2A)
5. **ID immuable DCR** : (Accédez à votre DCR `dcr-secureai-events` et copiez-le depuis la vue JSON)
6. **Nom du flux** : il s'agit d'une valeur construite. Le format est `Custom-{TableName}`. Dans notre cas, ce sera : `Custom-secureaitosiem_CL`

### B. Configurer l'application

Saisissez ces 6 valeurs dans les paramètres de configuration de votre application.

<div class="mac-window">
  ![Paramètres de configuration de l'application](/img/ms%20sentinel%20-%20images/Sentinel%20-%2021.png)
</div>

## Étape 5 : Vérifiez l'intégration

Une fois que vous avez saisi les détails d'intégration dans l'application SecureAI, vous pouvez vérifier que la connexion fonctionne correctement.

### A. Testez la connexion

Utilisez le bouton "Test de connexion" au sein de notre application. Cela enverra un événement de test à votre espace de travail Microsoft Sentinel.

### B. Rechercher l'événement de test dans Log Analytics

Pour voir si l'événement est arrivé dans Microsoft Sentinel, accédez à votre espace de travail Log Analytics et cliquez sur **Journaux**.

Exécutez la requête suivante pour voir vos données entrantes :

```kql
secureaitosiem_CL
| order by TimeGenerated desc
```

Vous devriez voir vos données de journal apparaître avec toutes les colonnes (`TimeGenerated`, `Level_s`, `Message_s`, etc.) correctement renseignées. Si oui, votre intégration est une réussite ! ✅

<div class="mac-window">
  ![Vérification d'intégration réussie](/img/ms%20sentinel%20-%20images/Sentinel%20-%2022.png)
</div>

**Remarque** : En fonction du trafic réseau et de la charge du système, l'affichage des journaux dans Microsoft Sentinel peut parfois prendre jusqu'à 10 minutes.

## Terminé !

Avec ces étapes, votre instance Microsoft Sentinel est entièrement configurée pour s'intégrer à SecureAI 😎.