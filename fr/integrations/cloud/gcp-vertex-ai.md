---
sidebar_position: 6
title: "Google Vertex AI"
sidebar_label: "Google Vertex AI"
description: "Connectez Google Vertex AI pour que SecureAI puisse inventorier les agents, les modèles, les comptes de service, l'IAM, l'utilisation et les coûts."
---
# Google Vertex AI

Connectez votre projet Google Cloud afin que SecureAI puisse inventorier les agents, les points de terminaison et les modèles Vertex AI, ainsi que les comptes de service, les liaisons IAM, les journaux d'audit, l'utilisation et la facturation qui les entourent.

## Ce que SecureAI importe

- **Agents, points de terminaison et modèles Vertex AI**
- **NHI** — comptes de service, clés de compte de service et clés API (révocables — voir [NHI Inventory](/fr/en/discovery/nhi-inventory))
- Liaisons de rôle **IAM**
- **Journaux d'audit cloud**
- **Demandes, jetons et coûts** pour les 30 derniers jours (réels à partir de l'exportation de la facturation BigQuery ou estimés)

## Prérequis

- Un **compte de service** avec une clé JSON, doté de rôles de lecture sur le projet :
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - Rôles BigQuery (par exemple `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`) si vous utilisez l'exportation de facturation pour le coût **réel**.
  - *(Facultatif)* Rôles d'administrateur de clé/compte de service si vous souhaitez que SecureAI révoque les identités à la source.

## Identifiants

| Champ | Obligatoire | Descriptif |
|-------|----------|-------------|
| `projectId` | Oui | ID du projet GCP. |
| `location` | Oui | Région de sommet (par exemple `us-central1`). |
| `serviceAccountJson` | Oui | Clé JSON du compte de service. Chiffré au repos. |
| `billingExportTable` | Non | Table BigQuery pour la facturation réelle (par exemple, `dataset.gcp_billing_export_v1_XXXX`). |
| `billingProjectId` | Non | Projet qui héberge l'export de facturation, s'il est différent. |

### Où les trouver

1. Dans la [Console Google Cloud](https://console.cloud.google.com/), accédez à **IAM et administrateur → Comptes de service → Créer un compte de service**.
2. Accordez les rôles répertoriés ci-dessus.
3. Sous **Clés → Ajouter une clé → JSON**, téléchargez le fichier de clé.
4. Collez le **entier** JSON dans le champ `serviceAccountJson`.

## Se connecter

1. **Admin → Intégrations → Cloud → Google Vertex AI → Connect.**
2. Saisissez le projet, l'emplacement et le JSON du compte de service (plus les champs de facturation facultatifs).
3. **Testez**, puis **Enregistrez**.
4. **Synchroniser**.

## Vérifier

Ouvrez [Cloud Sensors](/fr/en/discovery/cloud-sensors) pour les agents/endpoints/modèles découverts et [NHI Inventory](/fr/en/discovery/nhi-inventory) pour les comptes et les clés de service. Les insights montrent les liaisons IAM, leur utilisation et leur coût.

## Révocation

Les comptes de service GCP, les clés SA et les clés API sont **révocables** depuis [NHI Inventory](/fr/en/discovery/nhi-inventory) lorsque le connecteur dispose des rôles d'administrateur clé/SA facultatifs.

## Connexes

- [Présentation des fournisseurs Cloud AI](/fr/en/integrations/cloud/overview)
- [Google Workspace SSO](/fr/en/iam/google-workspace)
- [Inventaire NHI](/fr/en/discovery/nhi-inventory)