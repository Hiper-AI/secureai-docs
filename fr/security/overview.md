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

- **Zero-Knowledge Posture** : clés gérées par le client (BYOK), traitement éphémère en mémoire et
  la journalisation locale du déploiement garde les données sensibles sous votre contrôle
- **Chiffrement au repos** : toutes les données stockées sont chiffrées à l'aide d'algorithmes conformes aux normes de l'industrie.
- **Chiffrement en transit** : chiffrement TLS 1.3 pour toutes les communications API
- **Clés gérées par le client** : vous contrôlez vos clés de chiffrement

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
- **HIPAA** : Conforme à la réglementation sur les données de santé
- **RGPD** : Conforme à la réglementation européenne sur la protection des données
- **PCI-DSS** : Conforme aux normes de l'industrie des cartes de paiement

### Conformité et certifications

- **Enterprise Ready** : conçu pour répondre aux exigences de sécurité des entreprises
- **Piste d'audit** : journalisation complète des audits de conformité et de sécurité
- **Application des politiques** : application automatisée des politiques de sécurité
- **Surveillance en temps réel** : Surveillance continue des événements de sécurité

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
- **Compliance Ready** : prise en charge intégrée des principaux cadres de conformité
- **Confinement** : même un agent compromis ne peut pas dépasser ses autorisations signées cryptographiquement
- **Révocation déterministe** : la coupure d'un utilisateur, d'une clé ou d'un agent prend effet au niveau de la passerelle dans
  secondes - sans attendre aucun fournisseur d'IA
- **Policy Driven** : application automatisée de vos politiques de sécurité

## Prochaines étapes

- [SMLTP Deep Dive](/fr/en/security/smltp) - En savoir plus sur SMLTP
- [Authentification](/fr/en/iam/overview) - Comprendre les méthodes d'authentification
- [Sécurité API](/fr/en/api) - Consignes d'utilisation de l'API sécurisée