---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Connectez Google Cloud pour que SecureAI puisse inventorier les agents, les modèles, les comptes de service, les clés, l'IAM, l'utilisation et les coûts de Vertex AI — dans un projet ou dans toute une organisation"
---

# Google Cloud — Discovery

Connectez votre projet Google Cloud (ou toute une organisation ou un dossier) afin que SecureAI puisse inventorier les agents, les points de terminaison et les modèles Vertex AI, ainsi que les comptes de service, les clés, les liaisons IAM, les journaux d'audit, l'utilisation et les coûts qui les entourent.

<Info>
Cette carte **lit uniquement** le projet et n'envoie jamais de prompt. Si vous souhaitez faire passer le trafic LLM de SecureAI par votre propre compte Google Cloud, consultez [Google Vertex AI — Inférence sur votre compte](/fr/integrations/cloud/vertex-ai-inference).
</Info>

## Ce que SecureAI importe

- **Vertex AI** : agents (Agent Engine), points de terminaison de serving, jobs de batch et de tuning en cours, et modèles — le Model Registry ainsi que chaque modèle d'éditeur utilisé (Gemini, Claude, modèles ouverts).
- **Agent Builder / Gemini Enterprise et Dialogflow CX** (facultatif) : les moteurs Agent Builder (Discovery Engine) avec leurs data stores, interrogés dans les emplacements `global`, `us` et `eu` ; et les agents Dialogflow CX, interrogés dans `global` et dans les emplacements Vertex AI que vous configurez.
- **Utilisation par modèle** sur les 30 derniers jours : requêtes (et combien ont échoué), jetons d'entrée et de sortie, et jetons du cache de prompts.
- **Utilisation par identifiant** sur les 30 derniers jours (Cloud Monitoring) : total des requêtes et requêtes vers les API d'IA (Vertex AI, Gemini API, Agent Builder, Dialogflow) pour chaque compte de service et chaque clé API. Le trafic des clients OAuth (personnes et outils comme la console ou `gcloud`) est totalisé à part. Elle fournit aussi la dernière utilisation de ces comptes et de ces clés.
- **Utilisation par modèle et par identité** (facultatif) : quel compte de service ou quelle personne a appelé quel modèle Vertex AI, d'après les journaux d'audit d'accès aux données (Data Access) si vous les avez activés. Voir [Utilisation par modèle et par identité](#utilisation-par-modèle-et-par-identité).
- **Coût** sur les 30 derniers jours : les dépenses réelles de ce projet en IA, issues de votre exportation de la facturation vers BigQuery, ou une estimation au prix catalogue.
- **NHI** : comptes de service, clés de compte de service gérées par l'utilisateur, clés API, pools et fournisseurs de Workload Identity Federation, et clients OAuth — avec leur dernière utilisation (d'après Policy Analyzer et l'utilisation par identifiant) et leur [risque de privilège](#risque-de-privilège). Révocables et restaurables depuis l'[Inventaire des NHI](/fr/discovery/nhi-inventory), à la main ou avec des [politiques automatiques](#politiques-nhi-automatiques).
- Liaisons de rôles **IAM** du projet.
- **Journaux d'audit cloud** des services d'IA et d'identité (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager) : les 200 derniers événements des 30 derniers jours.

Par défaut, le connecteur lit **un seul projet**. Avec le champ **Organization or folder**, il lit chaque projet actif d'une organisation ou d'un dossier : voir [Mode organisation ou dossier](#mode-organisation-ou-dossier).

## Prérequis

### API activées

SecureAI lit chaque surface avec l'API Google correspondante. Activez-les sur le projet (**API et services → Bibliothèque**, ou avec `gcloud services enable`) :

| API | Pour quoi faire | |
|-----|-----------------|---|
| `cloudresourcemanager.googleapis.com` | Le projet et ses liaisons IAM | Obligatoire |
| `iam.googleapis.com` | Comptes de service, clés, Workload Identity, clients OAuth | Obligatoire |
| `aiplatform.googleapis.com` | Agents, points de terminaison, jobs et modèles Vertex AI | Obligatoire |
| `apikeys.googleapis.com` | Clés API | Recommandé |
| `monitoring.googleapis.com` | Utilisation par modèle et par identifiant | Recommandé |
| `logging.googleapis.com` | Journaux d'audit et journaux d'accès aux données | Recommandé |
| `policyanalyzer.googleapis.com` | Dernière utilisation des clés et des comptes de service (Policy Analyzer) | Facultatif |
| `bigquery.googleapis.com` | Coût réel, si vous utilisez l'exportation de la facturation (sur le projet qui exécute la requête) | Facultatif |
| `cloudasset.googleapis.com` | Mode organisation ou dossier (sur le projet du compte de service) | Ce mode uniquement |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | Si vous utilisez ce produit |
| `dialogflow.googleapis.com` | Agents Dialogflow CX | Si vous utilisez ce produit |

Une API désactivée ne fait pas échouer la synchronisation : elle apparaît comme une lacune, **API disabled in the project — enable it**, qui nomme le service. Agent Builder et Dialogflow sont l'exception : si leur API est désactivée, SecureAI considère que le projet n'utilise pas ce produit et ne le signale pas comme une lacune.

### Rôles

Un compte de service sous l'identité duquel SecureAI agit. Accordez-lui ces rôles **sur le projet** (**IAM et administration → IAM → Accorder l'accès**) :

| Rôle | Ce qu'il permet | |
|------|-----------------|---|
| `roles/aiplatform.viewer` | Agents, points de terminaison, jobs et modèles Vertex AI | Obligatoire |
| `roles/iam.securityReviewer` | Comptes de service, clés, clés API, Workload Identity, clients OAuth, liaisons IAM | Obligatoire |
| `roles/monitoring.viewer` | Utilisation par modèle (requêtes et jetons) et utilisation par identifiant | Recommandé |
| `roles/logging.viewer` | Journaux d'audit cloud | Recommandé |
| `roles/policyanalyzer.activityAnalysisViewer` | Dernière utilisation de chaque clé et compte de service | Facultatif |
| `roles/logging.privateLogViewer` | Utilisation par modèle et par identité : les journaux d'accès aux données sont des journaux privés, et `roles/logging.viewer` ne les lit pas | Facultatif |
| `roles/discoveryengine.viewer` | Moteurs Agent Builder / Gemini Enterprise | Facultatif |
| `roles/dialogflow.reader` | Agents Dialogflow CX | Facultatif |

Pour le **coût réel**, vos données Cloud Billing doivent être [exportées vers BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=fr), et le compte de service a besoin de `roles/bigquery.dataViewer` sur le dataset d'exportation et de `roles/bigquery.jobUser` sur le projet qui exécute la requête.

Pour **révoquer et restaurer depuis SecureAI** (facultatif), il vous faut le rôle de chaque action que vous souhaitez autoriser. Si votre déploiement propose l'accès sans clé, accordez-les à un [compte de service distinct, dédié à la révocation](#compte-de-service-distinct-pour-la-révocation) et laissez au compte de lecture des rôles en lecture seule ; sinon, accordez-les au compte de service du connecteur :

| Action | Rôle |
|--------|------|
| Désactiver (ou réactiver) un compte de service | `roles/iam.serviceAccountAdmin` |
| Supprimer une clé de compte de service | `roles/iam.serviceAccountKeyAdmin` |
| Supprimer (ou restaurer) une clé API | `roles/serviceusage.apiKeysAdmin` |
| Désactiver (ou réactiver) un pool ou un fournisseur Workload Identity | `roles/iam.workloadIdentityPoolAdmin` |
| Désactiver (ou réactiver) un client OAuth | `roles/iam.oauthClientAdmin` |

<Note>
Vous n'avez **pas** besoin de `roles/billing.viewer` : c'est un rôle de compte de facturation, il ne peut pas être accordé sur un projet et le connecteur ne l'utilise pas.
</Note>

Rien n'est ignoré en silence : ce que SecureAI ne peut pas lire est listé avec le rôle qui corrige le problème — lors de la connexion, après chaque synchronisation et dans le panneau GCP.

## Identifiants

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| **Google Cloud Project ID** (`projectId`) | Oui | L'**ID** du projet (par exemple `my-project-123`) — pas son nom ni son numéro. En mode organisation, c'est le projet de quota et de facturation. |
| **Vertex AI Location** (`location`) | Oui | Emplacement Vertex AI où se trouvent vos agents et points de terminaison (par exemple `us-central1`, `europe-west4`, `global`). L'utilisation et le coût couvrent tous les emplacements. |
| **More Vertex AI Locations** (`locations`) | Non | Plusieurs emplacements, séparés par des virgules (jusqu'à 10). Remplace l'emplacement ci-dessus. |
| **Service Account JSON** (`serviceAccountJson`) | L'un des deux | La clé JSON du compte de service. Chiffrée au repos. |
| **Service account to impersonate** (`impersonateServiceAccount`) | L'un des deux | Sans clé : l'adresse e-mail du compte de service dont SecureAI emprunte l'identité. Affiché uniquement lorsque votre déploiement propose l'accès sans clé. |
| **Service account for revocation** (`revokeImpersonateServiceAccount`) | Non | Un second compte de service, utilisé uniquement pour révoquer ou restaurer des identités, jamais pour lire. Affiché uniquement lorsque votre déploiement propose l'accès sans clé. |
| **Organization or folder** (`scope`) | Non | `organizations/<number>` ou `folders/<number>` : lit chaque projet actif qu'il contient. |
| **BigQuery Billing Export Table** (`billingExportTable`) | Non | `project.dataset.table` de votre exportation de facturation (par exemple `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| **BigQuery Billing Project ID** (`billingProjectId`) | Non | Projet qui exécute la requête BigQuery. Par défaut, le projet de la table ; un nom `dataset.table` est recherché dans ce projet (ou dans l'ID du projet s'il est vide). |

### Où les trouver

**Option A — clé JSON**

1. Dans la [Console Google Cloud](https://console.cloud.google.com/), accédez à **IAM et administration → Comptes de service → Créer un compte de service** (par exemple `secureai-discovery`).
2. Accédez à **IAM et administration → IAM → Accorder l'accès**, saisissez l'adresse e-mail du compte de service comme compte principal et ajoutez les rôles indiqués dans [Prérequis](#prérequis).
3. De retour dans **Comptes de service**, ouvrez le compte → **Clés → Ajouter une clé → Créer une clé → JSON**, puis téléchargez le fichier.
4. Collez l'**intégralité** du JSON dans **Service Account JSON**, puis supprimez le fichier téléchargé.

La même chose avec `gcloud` :

```bash
PROJECT=my-project-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# Facultatif : dernière utilisation, utilisation par modèle et par identité, Agent Builder et Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

Si vous utilisez Agent Builder ou Dialogflow CX, leurs API sont déjà activées sur le projet ; vous n'avez pas besoin de les activer pour SecureAI.

<Warning>
Si Google répond que la création de clés de compte de service est désactivée, votre organisation applique la règle `iam.disableServiceAccountKeyCreation` — le comportement par défaut des organisations créées depuis 2024. Utilisez l'option B, ou demandez à l'administrateur de votre organisation une exception pour ce projet.
</Warning>

**Option B — sans clé (emprunt d'identité)**

1. Créez le compte de service et accordez-lui les rôles (étapes 1 et 2 ci-dessus).
2. Dans le formulaire de connexion de SecureAI, le texte d'aide du champ **Service account to impersonate (keyless — instead of the JSON)** indique le compte SecureAI à autoriser. Dans Google Cloud, ouvrez votre compte de service → **Autorisations → Accorder l'accès**, saisissez ce compte comme compte principal et attribuez-lui `roles/iam.serviceAccountTokenCreator`. Avec `gcloud` :

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. Saisissez l'adresse e-mail de votre compte de service dans le champ et laissez le JSON vide.

Si le champ n'apparaît pas, votre déploiement ne propose pas l'accès sans clé : utilisez l'option A.

### Compte de service distinct pour la révocation

Si votre déploiement propose l'accès sans clé, vous pouvez séparer la lecture et la révocation. C'est recommandé plutôt que de donner les rôles de révocation au compte de service qui lit :

1. Créez un second compte de service (par exemple `secureai-revoke`) et accordez-lui **uniquement** les rôles de révocation indiqués dans [Prérequis](#prérequis).
2. Sur ce compte, accordez `roles/iam.serviceAccountTokenCreator` au compte SecureAI indiqué dans le texte d'aide du champ **Service account for revocation (optional — separate from reading)**.
3. Saisissez son adresse e-mail dans ce champ.

SecureAI demande un jeton d'une heure à ce compte uniquement pendant qu'il révoque ou restaure une identité ; la synchronisation ne l'utilise jamais. Le compte de service de lecture conserve des rôles en lecture seule. SecureAI refuse également de révoquer le compte de révocation depuis l'inventaire.

## Mode organisation ou dossier

Pour inventorier plusieurs projets avec un seul connecteur, renseignez **Organization or folder** avec `organizations/<number>` ou `folders/<number>` (par exemple `organizations/123456789012`).

- SecureAI trouve les projets actifs avec **Cloud Asset Inventory** et lit chacun d'eux comme s'il s'agissait d'un connecteur à projet unique. Le **Google Cloud Project ID** reste le projet de quota et de facturation.
- Accordez au compte de service, **sur l'organisation ou le dossier** : `roles/cloudasset.viewer`, `roles/iam.securityReviewer` et `roles/aiplatform.viewer`, plus `roles/monitoring.viewer` et `roles/logging.viewer` pour l'utilisation et l'audit.
- Activez `cloudasset.googleapis.com` sur le projet du compte de service.

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

Pour un dossier, utilisez `gcloud resource-manager folders add-iam-policy-binding <number>` au lieu de `gcloud organizations add-iam-policy-binding`.

Pour qu'une synchronisation se termine dans un délai raisonnable, chacune est plafonnée. Le projet de quota passe en premier, puis les projets qui ont des ressources Vertex AI :

| Quoi | Plafond par synchronisation |
|------|-----------------------------|
| Projets inventoriés | 200 |
| Utilisation par modèle (Cloud Monitoring) hors du champ d'application des métriques du projet de quota | 15 projets avec Vertex AI |
| Journaux d'audit | 25 projets |
| Utilisation par modèle et par identité (journaux d'accès aux données) | 10 projets |

Ce qui dépasse un plafond apparaît comme une lacune partielle, avec la part qui a été lue. Un projet qui ne peut pas être lu est également listé comme une lacune, et **rien de ce projet n'est retiré ni supprimé**. Lors de la connexion, le test dans ce mode énumère uniquement la première page de projets et vérifie le projet de quota : la lecture de chaque projet est le travail de la synchronisation.

## Se connecter

1. **Admin → Integrations → Cloud → Google Cloud — Découverte → Connecter l'Intégration.**
2. Saisissez l'ID du projet, l'emplacement (ou plusieurs dans **More Vertex AI Locations**) et soit la clé JSON, soit le compte de service dont emprunter l'identité. Si vous les utilisez, ajoutez le compte de service de révocation, l'organisation ou le dossier, et les champs de facturation.
3. Cliquez sur **Connecter**. Avant d'enregistrer, SecureAI vérifie les identifiants par une lecture réelle du projet — cela prend quelques secondes. S'il ne peut pas lire le projet, il en indique la raison et n'enregistre rien ; ce que vous avez saisi reste dans le formulaire. Les messages possibles figurent dans [Dépannage](#dépannage).
4. Si l'enregistrement réussit mais que des rôles manquent, un avertissement les liste. Accordez-les et synchronisez à nouveau.
5. Synchronisez maintenant avec le bouton d'actualisation de la carte. Ensuite, SecureAI synchronise automatiquement toutes les 6 heures.

Pour modifier les identifiants plus tard, utilisez à nouveau **Connecter**. Les champs laissés vides conservent leur valeur enregistrée ; saisir une clé JSON remplace un emprunt d'identité enregistré, et inversement.

## Vérifier

- [Cloud Sensors](/fr/discovery/cloud-sensors) liste les agents découverts. Cliquez sur la carte Google Cloud pour ouvrir le panneau GCP : utilisation et coûts (requêtes, échecs, jetons, cache, coût et sa source), modèles et déploiements, identité et accès (comptes de service et clés avec leur dernière utilisation, liaisons IAM), et audit.
- Si le panneau affiche **Discovery could not read everything**, examinez chaque ligne (voir [Dépannage](#dépannage)) et synchronisez à nouveau.
- L'[Inventaire des NHI](/fr/discovery/nhi-inventory) affiche les comptes de service et les clés.

Si une synchronisation échoue (par exemple parce que la clé a été supprimée ou les rôles retirés), la carte affiche l'erreur et SecureAI réessaie avec un délai progressif, en conservant le dernier inventaire. Une lecture partielle ne retire jamais d'agents et ne supprime jamais d'identités.

## Utilisation par modèle et par identité

Cloud Monitoring indique combien de requêtes chaque identifiant a effectuées, mais pas vers quel modèle. Pour savoir **quelle identité a appelé quel modèle**, SecureAI lit les journaux d'audit d'**accès aux données** (Data Access) de Vertex AI. C'est facultatif et cela dépend de vous :

- SecureAI ne les lit que si les journaux **DATA_READ** ou **DATA_WRITE** sont activés pour `aiplatform.googleapis.com` (ou pour tous les services). SecureAI le détecte dans la stratégie IAM ; il ne les active jamais.
- Les activer entraîne un **coût d'ingestion Cloud Logging**, aux tarifs de Google. Vous les activez dans **IAM et administration → Journaux d'audit → Vertex AI API → Lecture des données**.
- Le compte de service a besoin de `roles/logging.privateLogViewer`.
- Par projet et par synchronisation, SecureAI lit jusqu'à 5 000 entrées ou pendant 20 secondes, selon la première limite atteinte.
- S'ils sont désactivés, le panneau affiche une lacune facultative qui explique comment les activer. Si vous les avez activés au niveau de l'organisation ou du dossier mais que vous connectez un seul projet, SecureAI ne peut pas le voir dans la stratégie du projet et affiche quand même la lacune.

## Risque de privilège

Une fois la stratégie IAM lue, SecureAI signale un compte de service comme **privilégié** lorsqu'il détient l'un de ces rôles :

- Propriétaire (`roles/owner`) ou Éditeur (`roles/editor`) ;
- tout rôle d'administration (`roles/<service>.admin` ou se terminant par `Admin`) ;
- `roles/iam.serviceAccountTokenCreator` ou `roles/iam.serviceAccountUser`, qui permettent à leur détenteur d'agir en tant qu'autres comptes de service.

Une clé gérée par l'utilisateur d'un compte de service privilégié hérite du signalement : qui détient la clé détient ce privilège. Les clés API **sans restriction** (aucune API cible et aucune restriction d'application) sont également signalées. Dans l'[Inventaire des NHI](/fr/discovery/nhi-inventory), elles apparaissent parmi les facteurs de risque sous **Privileged (admin role or impersonation)** et **API key without restrictions**. Si la stratégie IAM n'a pas pu être lue, SecureAI ne signale rien plutôt que de considérer un compte comme non privilégié.

## Coût

- **Avec la table d'exportation de la facturation** : les dépenses réelles de ce projet en services d'IA (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), déduction faite des crédits, dans la devise de votre compte de facturation. Lorsque des crédits couvrent l'utilisation, le montant net peut être nul ; le panneau affiche alors à côté le montant avant crédits. Google met à jour l'exportation avec un délai de plusieurs heures.
- **Sans elle** : une estimation — jetons de Cloud Monitoring × prix catalogue, y compris Claude et les jetons du cache de prompts. Elle ne reflète ni les remises ni les contrats d'engagement d'utilisation.

## Révocation et restauration

Les identités GCP sont révocables depuis l'[Inventaire des NHI](/fr/discovery/nhi-inventory) (cadenas) lorsque le connecteur, ou le compte de service de révocation, dispose du rôle de l'action concernée (voir [Prérequis](#prérequis)). Ce que chacune fait chez Google :

| Identité | Ce qui se passe chez Google | Réversible |
|----------|-----------------------------|------------|
| Compte de service | Désactivé | Oui — **Restore** le réactive |
| Clé de compte de service | Supprimée | Non — Google la détruit. Créez une nouvelle clé |
| Clé API | Supprimée | Oui, pendant 30 jours — **Restore** la rétablit ; au-delà, Google ne la conserve plus |
| Pool / fournisseur Workload Identity, client OAuth | Désactivé | Oui — **Restore** le réactive |

Pour annuler une révocation, ouvrez le menu de l'identité dans l'Inventaire des NHI et choisissez **Restore** (*Undo the revocation at Google Cloud*). L'identité est réactivée dans Google Cloud et, dans SecureAI, elle est débloquée et reste **In remediation** jusqu'à ce que vous l'examiniez.

- Seul ce que **SecureAI a révoqué dans Google Cloud** peut être restauré, à la main ou par une politique automatique. Ce n'est pas proposé pour un blocage appliqué uniquement sur la passerelle de SecureAI, ni pour une identité que votre équipe a désactivée directement dans Google Cloud.
- Une clé de compte de service supprimée ne peut pas être restaurée : SecureAI refuse sans appeler Google.
- La restauration utilise les mêmes rôles que la révocation.

Garde-fous :

- Le compte de service utilisé par le connecteur, ainsi que ses clés, ne peuvent pas être révoqués depuis SecureAI — cela couperait la découverte. Il en va de même pour le compte de service de révocation. Effectuez leur rotation dans Google Cloud.
- Le compte de service avec lequel s'authentifie la connexion d'[inférence Vertex AI](/fr/integrations/cloud/vertex-ai-inference), ni la clé avec laquelle elle signe, ne peuvent pas non plus être révoqués : cela arrêterait chaque appel gouverné. Avec l'option sans clé (emprunt d'identité), seul le compte de service est protégé : ses clés peuvent être révoquées, car SecureAI ne signe avec aucune d'elles. Si SecureAI ne peut pas vérifier quelle identité utilise la connexion d'inférence, il ne révoque aucun compte de service ni aucune clé de compte de service (les clés API ne sont pas concernées).
- Les comptes de service par défaut de Google (compte par défaut de Compute Engine, App Engine, Cloud Build, agents de service) demandent une seconde confirmation : en désactiver un arrête chaque VM, application ou build qui s'exécute sous son identité.
- S'il manque au connecteur le rôle d'une action, l'erreur indique ce rôle.

## Politiques NHI automatiques

Les **politiques NHI automatiques** (Inventaire des NHI → **Automatic policies**) alertent sur des identités Google Cloud ou les révoquent selon des règles, sans les examiner une par une. Elles sont évaluées à la fin de chaque synchronisation réussie du connecteur, uniquement sur ses identités.

| Règle | Sur Google Cloud | Seuil par défaut |
|-------|------------------|------------------|
| **Unused SA key / IAM access key** | Clé de compte de service qui ne s'est pas authentifiée depuis N jours. Elle n'agit que sur une dernière utilisation connue : une clé sans utilisation enregistrée n'est pas touchée. | 90 jours |
| **Old SA key / IAM access key** | Clé de compte de service créée il y a plus de N jours, utilisée ou non. | 365 jours |
| **Unrestricted API key** | Clé API sans restriction d'application et sans API cible. | — |
| **Privileged SA with a user key** | Clé gérée par l'utilisateur d'un compte de service [privilégié](#risque-de-privilège). | — |

Chaque règle a trois modes : **Off**, **Alert** et **Revoke**. Toutes démarrent désactivées. Les garde-fous :

- **Simulation mode (dryRun)** est activé par défaut : avec lui, aucune règle réglée sur **Revoke** ne coupe quoi que ce soit ; elle liste seulement ce qu'elle ferait. Le désactiver est la seule chose qui permet des coupures réelles. **Simulate with this configuration** montre l'effet avant d'enregistrer.
- **Revocation cap per run** : 5 par défaut (de 1 à 50). Si, lors d'une exécution, les règles **Revoke** correspondent à plus d'identités que le plafond, rien n'est coupé et une alerte est envoyée.
- **Exclusions** : aucune règle n'agit sur une identité dont le propriétaire, le nom ou la ressource correspond à un motif ; `*` est le seul caractère générique.
- Seules les listes de clés complètes sont évaluées.
- Un identifiant utilisé par SecureAI (celui du connecteur, celui du compte de révocation ou celui de l'inférence Vertex AI) n'est jamais coupé. Les clés des comptes de service par défaut de Google ne sont jamais coupées automatiquement : la règle se contente d'alerter, et une personne décide.

Sur Google Cloud, révoquer une clé de compte de service la **supprime** (elle ne peut pas être restaurée), et révoquer une clé API la supprime avec 30 jours pour la restaurer. Chaque action est auditée et notifiée.

## Dépannage

### Lors de la connexion

Si le test échoue, **Connecter** affiche l'un de ces messages et n'enregistre rien :

| Message | Cause | Que faire |
|---------|-------|-----------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | Vous avez saisi le nom ou le numéro du projet | Copiez l'**ID** du projet depuis le sélecteur de projets de la console. |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | L'ID n'existe pas, ou le compte de service n'a aucun rôle sur ce projet | Vérifiez l'ID et accordez les deux rôles obligatoires sur le projet. |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | L'emplacement n'existe pas (par exemple, faute de frappe) | Corrigez l'emplacement. |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | Mode organisation sans l'API Cloud Asset | Activez `cloudasset.googleapis.com` sur le projet du compte de service. |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | Mode organisation sans les rôles sur l'organisation ou le dossier, ou numéro erroné | Accordez les rôles sur l'organisation ou le dossier, ou videz le champ pour ne lire que le projet. |

### Lacunes du panneau

Lorsque le panneau GCP affiche **Discovery could not read everything**, chaque ligne nomme la surface et ce qui manque. Les lignes marquées *optional* ne font qu'enrichir l'inventaire.

| Ce qu'affiche la ligne | Ce que cela signifie | Que faire |
|------------------------|----------------------|-----------|
| Un rôle (par exemple `roles/monitoring.viewer`) | Il manque ce rôle au compte de service | Accordez-le sur le projet (ou sur l'organisation ou le dossier) et synchronisez à nouveau. |
| **API disabled in the project — enable it** | L'API de cette surface est désactivée ; le détail nomme le service | Activez-la dans **API et services → Bibliothèque**. |
| Aucun rôle, et un détail indiquant qu'une règle d'administration interdit l'emplacement | Une règle d'administration (`constraints/gcp.resourceLocations`) bloque cet emplacement, donc rien ne peut y exister. Aucun rôle ne corrige cela | Retirez cet emplacement de la configuration, ou demandez à l'administrateur de votre organisation de l'autoriser. |
| **Usage by model and identity** non activé | Les journaux d'accès aux données de Vertex AI sont désactivés | Facultatif : voir [Utilisation par modèle et par identité](#utilisation-par-modèle-et-par-identité). |
| Une lecture partielle (par exemple un plafond du mode organisation) | Seule une partie a été lue ; le détail indique combien | Rien n'est retiré ni supprimé à cause de cela. Si vous avez besoin de tout voir, réduisez le périmètre. |

## Connexes

- [Google Vertex AI — Inférence sur votre compte](/fr/integrations/cloud/vertex-ai-inference)
- [Présentation des fournisseurs Cloud AI](/fr/integrations/cloud/overview)
- [Google Workspace SSO](/fr/iam/google-workspace)
- [Inventaire des NHI](/fr/discovery/nhi-inventory)
