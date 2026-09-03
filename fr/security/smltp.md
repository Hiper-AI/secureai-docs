---
sidebar_position: 2
title: "Sécurité SMLTP"
---
# Protocole de sécurité SMLTP

SecureAI utilise le **Secure Model Language Transfer Protocol (SMLTP)** pour gouverner, contenir et prouver
communication avec les grands modèles linguistiques (LLM).

## Qu'est-ce que SMLTP ?

SMLTP est un protocole de sécurité avec un **projet de spécification publique** (v0.2). Il définit un
**plan de contrôle déterministe** pour le trafic IA : au lieu de s'appuyer uniquement sur une inspection probabiliste
d'invites, SMLTP rend cinq propriétés de chaque appel d'IA gouverné déterministes et cryptographiquement
vérifiable.

| Couche | Mécanisme déterministe |
|---|---|
| **Identité** | Ed25519 Jeton de droit signé (SET) émis par demande |
| **Autorisation** | `model` et `policy_hash` revendications — l'appel s'exécute sous une stratégie nommée ou pas du tout |
| **Intégrité des transports** | `body_sha256` lie le jeton aux octets exacts de la requête |
| **Confinement** | Modes de surveillance/application, cache de relecture, révocation de sujet, valeurs par défaut fermées en cas d'échec |
| **Audit** | Journal enchaîné par hachage et scellé par Merkle avec reçus de conformité signés |

## Le modèle à deux plans

SMLTP sépare délibérément deux types de contrôles :

- **Plan déterministe (cryptographie) :** qui appelle, ce qu'il est autorisé à appeler, que le
  la demande n'a pas été modifiée, qu'un sujet révoqué est coupé et que le dossier ne peut pas être silencieux
  réécrit. Ce sont des garanties, renforcées par des signatures et des hachages.
- **Plan probabiliste (inspection) :** DLP, rédaction de PII et Prompt Shield exécutés *derrière* le
  contrôles déterministes et sont explicitement **au mieux**. SMLTP ne prétend jamais que la cryptographie
  détecte une injection rapide ou que l'inspection détecte chaque chaîne sensible - il prétend que le
  le verdict d'inspection qui *a* été produit est enregistré dans un reçu signé et vérifiable.

## Principales fonctionnalités

### Jetons de droit signés
- Chaque requête gouvernée comporte une identité, un modèle, une politique et des octets de liaison de jeton signé Ed25519.
- Protection contre la relecture via des identifiants de jeton à usage unique
- La révocation d'un sujet prend effet au niveau de la passerelle en quelques secondes — aucune coopération du côté du fournisseur n'est nécessaire

### Reçus de conformité signés
- Chaque interaction acheminée par la passerelle produit un reçu signé par la passerelle
- Les reçus enregistrent la politique en vigueur, le hachage de la demande et les preuves d'inspection qui ont été produites
- Les reçus peuvent être vérifiés hors ligne par rapport à la clé publique de la passerelle — voir
  [API des reçus](../api/receipts.md)

### Audit inviolable
- Les événements d'audit sont chaînés par hachage (`prev_hash` → `current_hash`) et scellés dans des blocs Merkle
- Les racines Merkle peuvent être ancrées à un journal de transparence externe (Sigstore Rekor), de sorte que l'enregistrement
  l'intégrité ne dépend pas de la confiance dans l'opérateur SecureAI - voir
  [Journaux immuables](./immutable-logs.md)

### Application des politiques
- Modèle de listes d'autorisation, de vérifications de résidence des données (géofence) et de contrôles de sortie évalués au niveau de la passerelle.
- **Mode moniteur** observe et atteste ; **le mode appliquer** bloque les appels non conformes avec un signé
  reçu de refus

### Gestion des clés
- Clés de signature Ed25519 avec support de rotation ; les reçus émis sous les clés précédentes restent vérifiables

## Portée et honnêteté

- **Portée du déploiement :** les réceptions et l'application SMLTP s'appliquent aux **déploiements acheminés par passerelle**.
  Les déploiements qui appellent directement les fournisseurs bénéficient toujours de la DLP/PII de la plateforme et de la journalisation d'audit, mais pas
  reçus signés par la passerelle (l'[API Receipts](../api/receipts.md) documente ce comportement).
- **Portée du chiffrement :** le chiffrement du transport est TLS ; les bundles de requêtes entre le client et la passerelle peuvent
  être en outre crypté (AES-256-GCM). SMLTP ne fournit actuellement pas de chiffrement de bout en bout
  via le fournisseur d’IA et ne revendique pas le secret ultérieur.
- **Portée de l'inspection :** La détection DLP/PII est probabiliste et s'effectue au mieux. Ce que SMLTP garantit, c'est
  que le verdict est *attesté* — le reçu prouve ce qui a été vérifié et quel a été le résultat.

## Avantages en matière de sécurité

- **Prouvabilité** : les reçus signés transforment "nous avons des journaux" en "n'importe qui peut vérifier ce qui s'est passé"
- **Confinement** : même un agent compromis ou se comportant mal ne peut pas dépasser ses droits signés
- **Révocation déterministe** : le blocage d'un utilisateur, d'une clé ou d'un agent réduit le trafic au niveau de la passerelle en quelques secondes
- **Auditabilité** : une trace inviolable que les auditeurs externes peuvent vérifier de manière indépendante