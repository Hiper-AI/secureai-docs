---
sidebar_position: 1
title: "Défense contre les menaces"
---
# Défense contre les menaces

Threat Defense offre une protection en temps réel contre les attaques malveillantes, les jailbreaks, les fuites d'instructions et la manipulation des résultats.

---

## Vecteurs de menaces protégés

| Menace | Descriptif |
|---|---|
| **Injection rapide** | Tentatives de contourner ou de contourner les instructions et contraintes du système. |
| **Jailbreaks** | Invites contradictoires conçues pour contourner les garde-corps de sécurité. |
| **Instruction / Fuite d'invite du système** | Attaques d'extraction tentant de révéler des instructions propriétaires. |
| **Dérive des rôles / Détournement** | Manipuler l'assistant pour s'écarter de son domaine d'activité prévu. |
| **Attaques d'extraction de données** | Tentatives automatisées de récolte de données confidentielles de formation ou d’indexation. |
| **Fuites de jetons Canary** | Détection des cordes cachées des canaris signalant l'exposition des instructions. |

---

## Modules clés

### 1. Moteur de bouclier d'invite
Évalue chaque invite entrante avant qu'elle n'atteigne le modèle de langage :
- **Autoriser** : la requête réussit tous les contrôles de sécurité.
- **Drapeau** : la demande est autorisée, mais enregistrée en tant qu'événement de sécurité pour examen administratif.
- **Bloquer** : la demande est immédiatement bloquée avec un événement de refus signé.

### 2. Garde-corps de sortie
Surveille les sorties du modèle avant la livraison au client pour détecter :
- Invite du système et fuite de contexte interne.
- Fuite de jetons Canary.
- Dérive involontaire des rôles ou sorties dangereuses.

### 3. Jetons Canaries
Les jetons Canary sont des marqueurs cryptographiques uniques et cachés insérés dans les instructions du chatbot :
- **Comment ça marche** : si un attaquant réussit à extraire des instructions, le marqueur Canary dans la réponse déclenche une alerte de sécurité immédiate de haute priorité.
- **Configuration** : Allez dans **Admin ? Défense contre les menaces ? Canary Tokens** pour générer, faire pivoter ou surveiller des jetons.

---

## Configuration des politiques et gestion des incidents

1. **Configurer les politiques** : accédez à **Admin ? Défense contre les menaces ? Politiques**. Choisissez parmi **Strict** (chatbots publics), **Balanced** (utilisation standard en entreprise) ou **Permissive** (environnements de test).
2. **Examiner les incidents** : inspectez les événements signalés ou bloqués sous **Admin ? Défense contre les menaces ? Incidents** pour analyser les charges utiles des attaques et ajuster la sensibilité.