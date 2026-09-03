---
sidebar_position: 1
title: "Bases de connaissances et RAG"
---
# Bases de connaissances et système RAG

SecureAI utilise la **Retrieval-Augmented Generation (RAG)** pour connecter les modèles d'IA à vos données et documents privés, garantissant ainsi des réponses sécurisées, précises et contextuelles.

---

## Qu'est-ce que RAG ?

**Retrieval-Augmented Generation (RAG)** est une technique d'IA qui combine des modèles de langage avec des sources de connaissances externes. Au lieu de vous fier uniquement aux données pré-entraînées du modèle :

1. **Traitement des requêtes** : le système analyse l'invite de l'utilisateur pour identifier les exigences de connaissances pertinentes.
2. **Récupération de connaissances** : la recherche sémantique récupère les morceaux de documents pertinents de votre index.
3. **Augmentation du contexte** : le contexte récupéré est injecté dans l'invite du modèle.
4. **Génération de réponse** : l'IA génère une réponse factuelle et fondée citant vos documents.

---

## Types d'index dans SecureAI

Les index sont des bases de connaissances structurées classées par accessibilité :

| Type d'index | Portée | Accès et confidentialité | Idéal pour |
|---|---|---|---|
| **Index personnels** | Utilisateur individuel | Chiffré de bout en bout ; stockage sans connaissance (même les administrateurs ne peuvent pas lire le contenu) | Notes personnelles, recherches privées, documents de projets individuels |
| **Indices de groupe** | Équipes / Départements | Accès basé sur les rôles contrôlé par l'appartenance au groupe | Wikis du département, documentation du projet d'équipe, SOP partagées |
| **Indices mondiaux** | À l’échelle de l’organisation | Accès en lecture pour tous les utilisateurs de l'entreprise | Politiques de l'entreprise, directives RH, manuels à l'échelle de l'entreprise |

### 1. Index personnels
- **Zero-Knowledge Privacy** : Vos fichiers et conversations sont cryptés avec des clés de locataire/utilisateur.
- **Création** : 
  - **Utilisateurs** : ouvrez l'interface de discussion, cliquez sur le sélecteur d'index à côté du sélecteur de modèle, passez à l'onglet *Personnel* et cliquez sur **+**.
  - **Administrateurs** : Allez dans **Admin ? Gestion des indices ? Créez un index** et attribuez-le à un utilisateur spécifique.

### 2. Index de groupe
- **Collaboration** : plusieurs membres de l'équipe peuvent interroger et contribuer à des documents à la même base de connaissances.
- **Création** :
  - Allez dans **Admin ? Gestion de groupe ? Créez un groupe**, attribuez des membres et associez un index de groupe partagé.

### 3. Indices mondiaux
- **Normes à l'échelle de l'entreprise** : référentiels centralisés pour la conformité de l'entreprise, les termes juridiques et les directives opérationnelles.
- **Création** : Allez dans **Admin ? Gestion des indices ? Créez un index** et définissez la portée sur **Global**.

---

## Comment fonctionne l'indexation

Lorsque vous téléchargez des fichiers (PDF, documents Word, CSV, JSON, Markdown ou texte brut) :

`
Document brut --?  Extraction de texte --?  Chunking sémantique --?  Incorporations vectorielles --?  Stockage vectoriel (index)
`

1. **Traitement des documents** : le texte et les métadonnées (horodatages, noms de fichiers) sont extraits et nettoyés.
2. **Chunking** : le contenu est divisé en morceaux sémantiques optimisés avec chevauchement pour maintenir la continuité contextuelle.
3. **Génération d'intégration** : les morceaux sont convertis en intégrations vectorielles de grande dimension.
4. **Stockage vectoriel** : les intégrations sont stockées dans des bases de données vectorielles hautes performances pour une récupération instantanée des similarités.

---

## meilleures pratiques

- **Nom** : utilisez des noms clairs et descriptifs pour les index et les fichiers téléchargés (par exemple, HR-Policy-2026 au lieu de doc1).
- **Préparation du fichier** : assurez-vous que les documents téléchargés contiennent du texte clair ; nettoyez les analyses de mauvaise qualité avant de les télécharger.
- **Limites de fichiers** : les téléchargements standard prennent en charge des fichiers jusqu'à 10 Mo par lot.
- **Portée appropriée** : Conservez des notes personnelles sensibles dans les index personnels ; déplacer les ressources de l’équipe vers les index de groupe.