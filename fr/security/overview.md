---
sidebar_position: 1
title: "Présentation de la sécurité"
---
# Aperçu de la sécurité

Découvrez les fonctionnalités et l’architecture de sécurité de SecureAI.

## Fonctionnalités de sécurité

SecureAI met en œuvre des mesures de sécurité de niveau entreprise pour protéger vos données et applications, avec SMLTP (Secure Model Language Transfer Protocol) comme pierre angulaire de notre architecture de sécurité.

### SMLTP (Protocole de transfert de langage de modèle sécurisé)

**SMLTP** est un protocole de sécurité avec un projet de spécification publique qui permet de communiquer avec
Grands modèles linguistiques (LLM) régis, contenus et prouvables. Il fournit :

- **Jetons de droits signés** : chaque demande gouvernée comporte une liaison de jeton signée **Ed25519**
  identité, modèle autorisé, hachage de politique et octets exacts de la demande (SHA-256)
- **Reçus de conformité signés** : chaque interaction acheminée par la passerelle produit un reçu qui peut être
  vérifié hors ligne par rapport à la clé publique de la passerelle
- **Application des politiques** : modèles de listes d'autorisation, contrôles de résidence des données et contrôles de sortie — dans le moniteur
  ou en mode application, avec reçus de refus signés
- **Journaux d'audit inviolables** : journaux chaînés par hachage et scellés par Merkle, éventuellement ancrés à un
  journal de transparence externe (Sigstore Rekor)
- **Rotation des clés** : rotation de la clé de signature Ed25519 ; les reçus émis sous les clés précédentes restent
  vérifiable
- **Bundle Encryption** : cryptage AES-256-GCM en option des bundles de requêtes entre le client et
  passerelle

### Protection des données

- **Clés par locataire** : SecureAI chiffre les conversations et les identifiants de connecteurs stockés au niveau du champ avec AES-256-GCM, avec des clés propres à votre locataire, protégées par un service de gestion de clés dans le cloud.
- **Chiffrement au repos** : les bases de données et les sauvegardes sont sur des disques Google Cloud, que Google chiffre au repos.
- **Chiffrement en transit** : les connexions utilisent TLS 1.2 ou TLS 1.3 avec des suites de chiffrement AEAD à confidentialité persistante.
- **Votre propre clé pour les preuves** : si vous activez la conservation des preuves (désactivée par défaut), vous pouvez les chiffrer avec une clé de votre propre service de gestion de clés sur AWS, Azure ou Google Cloud.

### Contrôle d'accès

- **Contrôle d'accès basé sur les rôles (RBAC)** : autorisations granulaires pour différents types d'utilisateurs
- **API Key Management** : authentification sécurisée pour toutes les requêtes API
- **Rate Limiting** : limitation de débit intelligente pour éviter les abus
- **Journaux d'audit** : suivi complet des activités pour la conformité et la sécurité

### Politiques de sécurité

SMLTP prend en charge plusieurs modèles de stratégie intégrés :

- **Interne** : politique par défaut pour les données internes de l'entreprise
- **Internal Strict** : sécurité accrue pour les données internes sensibles
- **Public** : politique moins restrictive pour les données publiques non sensibles
- **HIPAA, RGPD et PCI-DSS** : noms du catalogue qui appliquent les mêmes contrôles qu'Internal Strict. En choisir un ne rend pas votre usage conforme à cette réglementation. Pour appliquer des règles propres à une réglementation, définissez une politique personnalisée du même nom : elle remplace la politique intégrée pour votre organisation.

### Aide à la conformité

- **Correspondance avec les référentiels** : SecureAI fait correspondre ses vérifications aux contrôles de référentiels comme le NIST AI RMF, l'ISO/IEC 42001 et l'AI Act de l'UE. La correspondance est partielle et sert à réunir des preuves. Ce n'est pas une certification.
- **Certifications** : Hiper AI ne détient aujourd'hui ni rapport SOC 2 ni certificat ISO/IEC 27001.
- **Piste d'audit** : journaux chaînés par hachage des interactions avec l'IA et des actions d'administration, pour vos revues de conformité et de sécurité.
- **Application des politiques** : SecureAI applique vos politiques de sécurité à chaque requête qui passe par la passerelle.
- **Surveillance en temps réel** : les événements de sécurité apparaissent dans la console au moment où ils se produisent.

## Comment fonctionne SMLTP

1. **Droit** : le plan de contrôle émet un jeton signé autorisant cet appelant, ce modèle,
   dans le cadre de cette politique, pour ces octets de requête exacts
2. **Vérification** : la passerelle SMLTP vérifie le jeton : signature, expiration, correspondance du modèle, corps
   hachage, relecture et révocation - avant que la demande n'aille quelque part
3. **Application des politiques** : les règles de liste d'autorisation, de résidence et de sortie du modèle sont évaluées au niveau
   passerelle ; en mode application, un appel non conforme est bloqué avec un accusé de réception signé
4. **Inspection et attestation** : l'inspection DLP/PII s'exécute sur le chemin gouverné (au mieux,
   probabiliste), et son verdict est consigné dans le récépissé signé
5. **Journalisation d'audit** : chaque interaction aboutit dans une piste d'audit enchaînée par hachage et scellée par Merkle

## Avantages

- **Prouvable, pas seulement enregistré** : les reçus signés permettent aux auditeurs de vérifier les interactions de manière indépendante
- **Preuves pour l'audit** : les reçus signés et la correspondance avec les référentiels donnent à vos auditeurs des éléments qu'ils peuvent vérifier eux-mêmes.
- **Confinement** : un agent qui passe par la passerelle ne peut pas dépasser les autorisations de son jeton signé, même s'il est compromis.
- **Révocation déterministe** : la coupure d'un utilisateur, d'une clé ou d'un agent prend effet au niveau de la passerelle dans
  secondes - sans attendre aucun fournisseur d'IA
- **Policy Driven** : application automatisée de vos politiques de sécurité

## Prochaines étapes

- [SMLTP Deep Dive](/fr/security/smltp) - En savoir plus sur SMLTP
- [Authentification](/fr/iam/overview) - Comprendre les méthodes d'authentification
- [Sécurité API](/fr/api) - Consignes d'utilisation de l'API sécurisée