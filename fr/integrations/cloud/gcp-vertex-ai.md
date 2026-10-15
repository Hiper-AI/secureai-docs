---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Connectez Google Cloud pour que SecureAI puisse inventorier les agents, les modèles, les comptes de service, les clés, l'IAM, l'utilisation et les coûts de Vertex AI"
---

# Google Cloud — Discovery

Connectez votre projet Google Cloud afin que SecureAI puisse inventorier les agents, les points de terminaison et les modèles Vertex AI, ainsi que les comptes de service, les clés, les liaisons IAM, les journaux d'audit, l'utilisation et les coûts qui les entourent.

<Info>
Cette carte **lit uniquement** le projet et n'envoie jamais de prompt. Si vous souhaitez faire passer le trafic LLM de SecureAI par votre propre compte Google Cloud, consultez [Google Vertex AI — Inférence sur votre compte](/en/integrations/cloud/vertex-ai-inference).
</Info>

## Ce que SecureAI importe

- **Vertex AI** : agents (Agent Engine), points de terminaison de serving, jobs de batch et de tuning en cours, et modèles — le Model Registry ainsi que chaque modèle d'éditeur utilisé (Gemini, Claude, modèles ouverts).
- **Utilisation** sur les 30 derniers jours, par modèle : requêtes (et combien ont échoué), jetons d'entrée et de sortie, et jetons du cache de prompts.
- **Coût** sur les 30 derniers jours : les dépenses réelles de ce projet en IA, issues de votre exportation de la facturation vers BigQuery, ou une estimation au prix catalogue.
- **NHI** : comptes de service, clés de compte de service gérées par l'utilisateur, clés API, pools et fournisseurs de Workload Identity Federation, et clients OAuth — avec la date de la dernière authentification de chaque clé et de chaque compte de service. Révocables depuis l'[Inventaire des NHI](/fr/discovery/nhi-inventory).
- Liaisons de rôles **IAM** du projet.
- **Journaux d'audit cloud** des services d'IA et d'identité (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager) : les 200 derniers événements des 30 derniers jours.

## Prérequis

Un compte de service sous l'identité duquel SecureAI agit. Accordez-lui ces rôles **sur le projet** (**IAM et administration → IAM → Accorder l'accès**) :

| Rôle | Ce qu'il permet | |
|------|-----------------|---|
| `roles/aiplatform.viewer` | Agents, points de terminaison, jobs et modèles Vertex AI | Obligatoire |
| `roles/iam.securityReviewer` | Comptes de service, clés, clés API, Workload Identity, clients OAuth, liaisons IAM | Obligatoire |
| `roles/monitoring.viewer` | Requêtes et jetons par modèle | Recommandé |
| `roles/logging.viewer` | Journaux d'audit cloud | Recommandé |
| `roles/policyanalyzer.activityAnalysisViewer` | Dernière utilisation de chaque clé et compte de service | Facultatif |

Pour le **coût réel**, vos données Cloud Billing doivent être [exportées vers BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=fr), et le compte de service a besoin de `roles/bigquery.dataViewer` sur le dataset d'exportation et de `roles/bigquery.jobUser` sur le projet qui exécute la requête.

Pour **révoquer depuis SecureAI** (facultatif), accordez également le rôle de chaque action que vous souhaitez autoriser :

| Action | Rôle |
|--------|------|
| Désactiver un compte de service | `roles/iam.serviceAccountAdmin` |
| Supprimer une clé de compte de service | `roles/iam.serviceAccountKeyAdmin` |
| Supprimer une clé API | `roles/serviceusage.apiKeysAdmin` |
| Désactiver un pool ou un fournisseur Workload Identity | `roles/iam.workloadIdentityPoolAdmin` |
| Désactiver un client OAuth | `roles/iam.oauthClientAdmin` |

<Note>
Vous n'avez **pas** besoin de `roles/billing.viewer` : c'est un rôle de compte de facturation, il ne peut pas être accordé sur un projet et le connecteur ne l'utilise pas.
</Note>

Rien n'est ignoré en silence : ce que SecureAI ne peut pas lire est listé avec le rôle qui corrige le problème — lors de la connexion, après chaque synchronisation et dans le panneau GCP.

## Identifiants

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| `projectId` | Oui | L'**ID** du projet (par exemple `my-project-123`) — pas son nom ni son numéro. |
| `location` | Oui | Emplacement Vertex AI où se trouvent vos agents et points de terminaison (par exemple `us-central1`, `europe-west4`, `global`). L'utilisation et le coût couvrent tous les emplacements. |
| `locations` | Non | Plusieurs emplacements, séparés par des virgules (jusqu'à 10). Remplace `location`. |
| `serviceAccountJson` | L'un des deux | La clé JSON du compte de service. Chiffrée au repos. |
| `impersonateServiceAccount` | L'un des deux | Sans clé : l'adresse e-mail du compte de service dont SecureAI emprunte l'identité. Affiché uniquement lorsque votre déploiement propose l'accès sans clé. |
| `billingExportTable` | Non | `project.dataset.table` de votre exportation de facturation (par exemple `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| `billingProjectId` | Non | Projet qui exécute la requête BigQuery. Par défaut, le projet de la table ; un nom `dataset.table` est recherché dans ce projet (ou dans `projectId` s'il est vide). |

### Où les trouver

**Option A — clé JSON**

1. Dans la [Console Google Cloud](https://console.cloud.google.com/), accédez à **IAM et administration → Comptes de service → Créer un compte de service** (par exemple `secureai-discovery`).
2. Accédez à **IAM et administration → IAM → Accorder l'accès**, saisissez l'adresse e-mail du compte de service comme compte principal et ajoutez les rôles indiqués dans [Prérequis](#prérequis).
3. De retour dans **Comptes de service**, ouvrez le compte → **Clés → Ajouter une clé → Créer une clé → JSON**, puis téléchargez le fichier.
4. Collez l'**intégralité** du JSON dans `serviceAccountJson`, puis supprimez le fichier téléchargé.

La même chose avec `gcloud` :

```bash
PROJECT=my-project-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
Si Google répond que la création de clés de compte de service est désactivée, votre organisation applique la règle `iam.disableServiceAccountKeyCreation` — le comportement par défaut des organisations créées depuis 2024. Utilisez l'option B, ou demandez à l'administrateur de votre organisation une exception pour ce projet.
</Warning>

**Option B — sans clé (emprunt d'identité)**

1. Créez le compte de service et accordez-lui les rôles (étapes 1 et 2 ci-dessus).
2. Dans le formulaire de connexion de SecureAI, le champ **Service account to impersonate** indique le compte SecureAI à autoriser. Dans Google Cloud, ouvrez votre compte de service → **Autorisations → Accorder l'accès**, saisissez ce compte comme compte principal et attribuez-lui `roles/iam.serviceAccountTokenCreator`.
3. Saisissez l'adresse e-mail de votre compte de service dans le champ et laissez le JSON vide.

Si le champ n'apparaît pas, votre déploiement ne propose pas l'accès sans clé : utilisez l'option A.

## Se connecter

1. **Admin → Intégrations → Cloud → Google Cloud — Discovery → Connect.**
2. Saisissez l'ID du projet, l'emplacement (ou plusieurs dans **More Vertex AI Locations**) et soit la clé JSON, soit le compte de service dont emprunter l'identité. Ajoutez les champs de facturation si vous utilisez l'exportation.
3. Cliquez sur **Connect**. Avant d'enregistrer, SecureAI vérifie les identifiants par une lecture réelle du projet — cela prend quelques secondes. S'il ne peut pas lire le projet (ID erroné, aucun rôle, emplacement mal saisi), il en indique la raison et n'enregistre rien ; ce que vous avez saisi reste dans le formulaire.
4. Si l'enregistrement réussit mais que des rôles manquent, un avertissement les liste. Accordez-les et synchronisez à nouveau.
5. Synchronisez maintenant avec le bouton d'actualisation de la carte. Ensuite, SecureAI synchronise automatiquement toutes les 6 heures.

Pour modifier les identifiants plus tard, utilisez à nouveau **Connect**. Les champs laissés vides conservent leur valeur enregistrée ; saisir une clé JSON remplace un emprunt d'identité enregistré, et inversement.

## Vérifier

- [Cloud Sensors](/fr/discovery/cloud-sensors) liste les agents découverts. Cliquez sur la carte Google Cloud pour ouvrir le panneau GCP : utilisation et coûts (requêtes, échecs, jetons, cache, coût et sa source), modèles et déploiements, identité et accès (comptes de service et clés avec leur dernière utilisation, liaisons IAM), et audit.
- Si le panneau affiche **Discovery could not read everything**, accordez les rôles qu'il liste et synchronisez à nouveau.
- L'[Inventaire des NHI](/fr/discovery/nhi-inventory) affiche les comptes de service et les clés.

Si une synchronisation échoue (par exemple parce que la clé a été supprimée ou les rôles retirés), la carte affiche l'erreur et SecureAI réessaie avec un délai progressif, en conservant le dernier inventaire. Une lecture partielle ne retire jamais d'agents et ne supprime jamais d'identités.

## Coût

- **Avec `billingExportTable`** : les dépenses réelles de ce projet en services d'IA (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), déduction faite des crédits, dans la devise de votre compte de facturation. Lorsque des crédits couvrent l'utilisation, le montant net peut être nul ; le panneau affiche alors à côté le montant avant crédits. Google met à jour l'exportation avec un délai de plusieurs heures.
- **Sans elle** : une estimation — jetons de Cloud Monitoring × prix catalogue, y compris Claude et les jetons du cache de prompts. Elle ne reflète ni les remises ni les contrats d'engagement d'utilisation.

## Révocation

Les identités GCP sont révocables depuis l'[Inventaire des NHI](/fr/discovery/nhi-inventory) (cadenas) lorsque le connecteur dispose du rôle de l'action concernée (voir [Prérequis](#prérequis)). Ce que chacune fait chez Google :

| Identité | Ce qui se passe chez Google | Réversible |
|----------|-----------------------------|------------|
| Compte de service | Désactivé | Oui — réactivez-le dans Google Cloud |
| Clé de compte de service | Supprimée | Non |
| Clé API | Supprimée | Restaurable pendant 30 jours dans Google Cloud |
| Pool / fournisseur Workload Identity, client OAuth | Désactivé | Oui |

Garde-fous :

- Le compte de service utilisé par le connecteur, ainsi que ses clés, ne peuvent pas être révoqués depuis SecureAI — cela couperait la découverte. Effectuez leur rotation dans Google Cloud.
- Les comptes de service par défaut de Google (compte par défaut de Compute Engine, App Engine, Cloud Build, agents de service) demandent une seconde confirmation : en désactiver un arrête chaque VM, application ou build qui s'exécute sous son identité.
- S'il manque au connecteur le rôle d'une action, l'erreur indique ce rôle.

## Connexes

- [Google Vertex AI — Inférence sur votre compte](/en/integrations/cloud/vertex-ai-inference)
- [Présentation des fournisseurs Cloud AI](/fr/integrations/cloud/overview)
- [Google Workspace SSO](/fr/iam/google-workspace)
- [Inventaire des NHI](/fr/discovery/nhi-inventory)
