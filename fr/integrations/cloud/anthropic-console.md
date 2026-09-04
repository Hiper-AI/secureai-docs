---
sidebar_position: 3
title: "Console anthropique"
sidebar_label: "Console anthropique"
description: "Connectez la console Anthropic pour que SecureAI puisse inventorier les espaces de travail, les clés, l'utilisation, les coûts et les activités d'audit."
---
# Console anthropique

Connectez votre organisation Anthropic afin que SecureAI puisse inventorier les espaces de travail, les clés API, les comptes de service, les limites de dépenses et (sur Enterprise) le journal d'audit et les analyses Claude Code.

## Ce que SecureAI importe

- **Espaces de travail**, utilisation et coût
- **NHIs** — Clés API, comptes de service et clés BYOK (révocables — voir [NHI Inventory](/fr/discovery/nhi-inventory))
- **Limites de dépenses**
- **Journal d'audit** (API Entreprise / Conformité)
- **Analyse Claude Code**

## Prérequis

- **Admin** sur la console Anthropic.
- Une **clé API Admin** (`sk-ant-admin…`).
- *(Facultatif)* une **clé d'espace de travail** pour déverrouiller les données de la plateforme d'agent et une **clé API de conformité** (Entreprise) pour déverrouiller le journal d'audit.

## Identifiants

| Champ | Obligatoire | Descriptif |
|-------|----------|-------------|
| `adminApiKey` | Oui | Clé d'administration de l'organisation, format `sk-ant-admin…`. Chiffré au repos. |
| `apiKey` | Non | Clé d'espace de travail : déverrouille l'inventaire de la plateforme d'agent. |
| `complianceApiKey` | Non | Clé API Enterprise Compliance : déverrouille le journal d'audit. |

### Où obtenir la clé d'administration

1. Connectez-vous à la [Console Anthropic](https://console.anthropic.com/) en tant qu'administrateur.
2. Accédez à **Paramètres → Clés d'administration** (au niveau de l'organisation).
3. Créez une clé d'administrateur et copiez-la.

## Se connecter

1. **Admin → Intégrations → Cloud → Anthropic Console → Connect.**
2. Collez la clé d'administration (et toutes les clés facultatives).
3. **Testez**, puis **Enregistrez**.
4. **Synchroniser**.

## Vérifier

Ouvrez [Cloud Sensors](/fr/discovery/cloud-sensors) pour les espaces de travail/agents découverts et [NHI Inventory](/fr/discovery/nhi-inventory) pour les clés et les comptes de service. Les informations indiquent les limites d'utilisation, de coût et de dépenses.

## Révocation

Les clés API Anthropic, les comptes de service et les clés BYOK sont **révocables** depuis [NHI Inventory](/fr/discovery/nhi-inventory).

## Connexes

- [Présentation des fournisseurs Cloud AI](/fr/integrations/cloud/overview)
- [Inventaire NHI](/fr/discovery/nhi-inventory)