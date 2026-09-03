---
sidebar_position: 2
title: "Plateforme OpenAI"
sidebar_label: "Plateforme OpenAI"
description: "Connectez la plateforme OpenAI pour que SecureAI puisse inventorier les projets, les modèles, les clés, l'utilisation et les coûts."
---
# Plateforme OpenAI

Connectez votre organisation OpenAI afin que SecureAI puisse inventorier les projets, les modèles, les membres, les clés API, les comptes de service, les dépenses et les activités d'audit, et faire apparaître les clés divulguées ou trop privilégiées pour y remédier.

## Ce que SecureAI importe

- **Projets, modèles, membres, rôles et groupes**
- **NHIs** — Clés API et comptes de service (révocables — voir [NHI Inventory](/fr/en/discovery/nhi-inventory))
- **Alertes de dépenses, limites de débit, certificats et paramètres de conservation des données**
- **Journaux d'audit**
- **Utilisation et coût** au cours des 30 derniers jours, y compris les dépenses par utilisateur

## Prérequis

- Un **propriétaire de l'organisation** (ou administrateur) sur la plateforme OpenAI.
- Une **clé API Admin** (`sk-admin-…`). Les clés d'administrateur sont requises pour lire les projets, les membres et l'utilisation à l'échelle de l'organisation.

## Identifiants

| Champ | Obligatoire | Descriptif |
|-------|----------|-------------|
| `adminApiKey` | Oui | Clé **admin** de l'organisation, format `sk-admin-…`. Chiffré au repos. |
| `projectApiKey` | Non | Une ou plusieurs clés de projet (une par ligne), nécessaires uniquement pour l'inventaire des anciens assistants. |
| `organizationId` | Non | Votre identifiant `org-…` ; lève l'ambiguïté lorsqu'une clé s'étend sur plusieurs organisations. |

### Où obtenir la clé d'administration

1. Connectez-vous à la [Plateforme OpenAI](https://platform.openai.com/) en tant que propriétaire de l'organisation.
2. Accédez à **Paramètres → Organisation → Clés d'administration**.
3. Créez une nouvelle clé d'administration et copiez-la (affichée une fois).

## Se connecter

1. **Admin → Intégrations → Cloud → Plateforme OpenAI → Connect.**
2. Collez la clé API d'administration (et les champs facultatifs).
3. **Testez**, puis **Enregistrez**.
4. **Synchroniser**.

## Vérifier

Après la première synchronisation, ouvrez [Cloud Sensors](/fr/en/discovery/cloud-sensors) pour voir les modèles/assistants découverts, et [NHI Inventory](/fr/en/discovery/nhi-inventory) pour voir les clés et les comptes de service. Les **Insights** par fournisseur indiquent l'utilisation, le coût et les dépenses par utilisateur.

## Révocation

Les clés API OpenAI sont **révocables** depuis [NHI Inventory](/fr/en/discovery/nhi-inventory) : SecureAI peut désactiver une clé à la source. (Pour les comptes de service, les identités OpenAI sont uniquement réservées au moniteur.)

## Connexes

- [Présentation des fournisseurs Cloud AI](/fr/en/integrations/cloud/overview)
- [Inventaire NHI](/fr/en/discovery/nhi-inventory)