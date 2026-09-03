---
sidebar_position: 1
title: "Présentation de la passerelle AI"
---
# Passerelle IA

**AI Gateway** est le plan de contrôle centralisé permettant de gouverner, de sécuriser, d'acheminer et d'inspecter tout le trafic du modèle d'IA à l'échelle de l'organisation.

---

## Capacités de base

### 1. Politiques de sécurité
Définir des règles d'application à l'échelle de l'organisation :
- **Listes autorisées de modèles** : limitez les modèles et les fournisseurs avec lesquels les employés et les applications peuvent interagir.
- **Géofencing de résidence des données** : assurez-vous que les invites et les réponses restent dans les juridictions désignées.
- **Modes d'application** : exécution en **Mode moniteur** (enregistrer et attester sans blocage) ou en **Mode d'application** (fermé sur échec, bloquant le trafic non conforme avec des reçus cryptographiques).

### 2. Tableau de bord et observabilité
Surveillez les métriques en temps réel dans toute votre entreprise :
- **Interactions sécurisées totales** et bundles SMLTP actifs.
- **Taux de rédaction et de blocage** : suivez les données sensibles interceptées par les moteurs DLP/PII.
- **État du protocole** : vérifiez l'état de santé de la passerelle en direct et l'état de rotation des clés.

### 3. Gestion des clés cryptographiques
Gérez les clés de signature Ed25519 et les clés de chiffrement AES-256 :
- **Rotation sans temps d'arrêt** : faites pivoter périodiquement les clés de signature tout en préservant la vérification hors ligne des reçus signés sous les clés précédentes.
- **Config** : Allez dans **Admin ? Passerelle IA ? Clés**.

### 4. Portail de transparence et audit
Validez l’intégrité des interactions à l’aide de preuves cryptographiques :
- Recherchez n'importe quelle interaction par undle_id pour inspecter sa chaîne de hachage L1, son arbre Merkle L2 et son ancre de transparence L3 Sigstore Rekor.
- Générez des liens de vérification publics partageables pour les auditeurs de conformité tiers.

### 5. Gestion des extensions
Gérez et appliquez des politiques de sécurité dans l’ensemble du parc d’extensions de navigateur SecureAI pour empêcher l’utilisation de l’IA fantôme sur les navigateurs clients.