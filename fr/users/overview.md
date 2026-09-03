---
sidebar_position: 1
title: "Gestion des utilisateurs et des accès"
---
# Gestion des utilisateurs et des accès

SecureAI fournit une administration des utilisateurs de niveau entreprise, un contrôle d'accès basé sur les rôles (RBAC), des niveaux d'autorisation et une allocation de licences.

---

## Rôles système

SecureAI inclut des rôles système intégrés pour régir l'accès à la plateforme :

| Rôle | Niveau d'accès | Descriptif |
|---|---|---|
| **Administrateur** | Contrôle total | Privilèges administratifs complets : gérez les utilisateurs, créez des rôles personnalisés, configurez les politiques SMLTP/AI Gateway, affichez les journaux et configurez le SSO. |
| **Utilisateur** | Norme | Accès utilisateur régulier : discutez avec des modèles d'IA, créez et gérez des index personnels, téléchargez des documents. |
| **Lecteur mondial** | Lecture seule | Mêmes fonctionnalités que l'utilisateur standard, plus visibilité en lecture seule sur les panneaux d'administration et l'état du système. Impossible de modifier les paramètres. |

### Rôles personnalisés et autorisations granulaires
Les administrateurs peuvent créer des rôles personnalisés avec des niveaux d'autorisation personnalisés (**Aucun**, **Lecteur**, **Administrateur**) dans des modules spécifiques :
- **Gestion des utilisateurs et des groupes** : création d'utilisateurs, édition, affectation de groupes.
- **Gestion des index** : téléchargement de documents, création d'index, formation d'index.
- **Sécurité & SMLTP** : Politiques de sécurité, réponse aux incidents, vérification d'audit.
- **Intégrations et AI Gateway** : connexion des fournisseurs de cloud, des clés API et des points de terminaison.

---

## Gestion des licences

Les comptes d'utilisateurs sont provisionnés selon les niveaux de licence de l'organisation :

| Niveau | Fonctionnalités incluses |
|---|---|
| **Ultra** | Fonctionnalités complètes de la plateforme, index illimités, débit du modèle prioritaire, politiques de conformité SMLTP personnalisées, support dédié. |
| **Croissance** | Outils de collaboration d'équipe, index de groupe, politiques de sécurité SMLTP standard, support standard. |
| **Essentiel** | Interface de discussion principale, index personnels, accès au modèle de base, support communautaire. |

---

## Tâches administratives courantes

- **Créer un utilisateur** : Allez dans **Admin ? Utilisateurs ? Créer un utilisateur**. Définissez l'e-mail, le rôle et le niveau de licence.
- **Attribuer à des groupes** : accédez à **Admin ? Groupes** pour organiser les utilisateurs en équipes collaboratives avec des index de groupe partagés.
- **Configurer SSO** : connectez votre fournisseur d'identité d'entreprise (Google Workspace ou Microsoft Entra ID) dans les paramètres **Authentification**.