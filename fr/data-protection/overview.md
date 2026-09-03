---
sidebar_position: 1
title: "Protection des données (DLP et informations personnelles)"
---
# Protection des données

La protection des données empêche la fuite accidentelle ou malveillante d’informations commerciales confidentielles et d’informations personnellement identifiables (PII) lors des interactions avec l’IA.

---

## Capacités de protection de base

### 1. Gestion DLP (prévention des pertes de données d'entreprise)
Protège les actifs commerciaux propriétaires dans les invites, les fichiers téléchargés et les réponses de modèle :
- **Clés et informations d'identification API** : empêche la fuite des clés AWS, des jetons OpenAI, des mots de passe et des certificats privés.
- **Code source et architecture** : détecte les référentiels internes et les extraits de code.
- **Contrats et données financières** : identifie les projets d'accords confidentiels et les données financières.

### 2. Rédaction des informations personnelles (confidentialité et conformité)
Détecte et masque automatiquement les identifiants personnels pour répondre aux normes GDPR, HIPAA et CCPA :
- **Identifiants** : noms, adresses e-mail, numéros de téléphone, pièces d'identité nationales (SSN, DNI, numéros de passeport), cartes de crédit.
- **Modes de rédaction** :
  - **Masque** : masque les chaînes sensibles (par exemple, user@*****.com, ****-****-****-1234).
  - **Supprimer** : supprime entièrement le texte sensible.
  - **Tokenize / Hash** : remplace les données sensibles par des pseudonymes déterministes pour le traitement interne.

### 3. Vérificateur sémantique
Aide aux enquêtes de sécurité et juridiques en déterminant si un morceau de texte suspect a été généré par votre locataire SecureAI :
- **Niveaux de confiance** : *Vérifié*, *Correspondance probable*, *Ambigüe*, *Aucune correspondance*.
- **Utilisation** : Allez dans **Admin ? Protection des données ? Semantic Verifier** et collez l'extrait de texte pour analyser la probabilité d'origine.

---

## Configuration et configuration

1. **Paramètres globaux** : accédez à **Admin ? Protection des données** pour permettre une analyse en temps réel des entrées, des sorties et des pièces jointes.
2. **Modèles et règles personnalisées** : chargez des modèles de démarrage régionaux/sectoriels ou ajoutez des modèles d'expression régulière personnalisés.
3. **Mode simulation** : testez les politiques sur des exemples d'ensembles de données avant de les appliquer en production.
4. **Surveillance des incidents** : examinez les mesures de rédaction et de blocage dans les journaux d'incidents de protection des données.