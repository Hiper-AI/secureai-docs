---
sidebar_position: 4
title: "Journaux immuables"
---
# Journaux immuables — Chaîne d'audit cryptographique

SecureAI enregistre **chaque interaction avec l'IA et chaque action administrative** dans une chaîne immuable à trois niveaux. Cette architecture garantit que toute modification, suppression ou manipulation d'enregistrements est détectable, même si quelqu'un a un accès direct à la base de données.

## Pourquoi est-ce important ?

Un journal qui n'existe que dans MongoDB n'est pas vraiment immuable : toute personne ayant accès au serveur peut le supprimer sans laisser de trace. SecureAI résout ce problème en épinglant chaque journal sur **Sigstore Rekor**, un journal de transparence public géré par l'Open Source Security Foundation (OpenSSF) — le même système que l'industrie du logiciel utilise pour vérifier la chaîne de traçabilité des packages critiques.

> **Garantie technique :** Une fois qu'un hachage de bloc Merkle est dans Rekor, personne, y compris l'opérateur SecureAI, ne peut modifier rétroactivement cet enregistrement. Tout auditeur tiers peut le vérifier de manière indépendante avec un seul appel curl.

---

##Les trois niveaux de preuve

Chaque ensemble d'interactions comporte trois niveaux de preuves cryptographiques :

### Couche 1 — Registre MongoDB (L1)

L'enregistrement principal de l'interaction est stocké dans MongoDB avec :

| Champ | Descriptif |
|-------|-------------|
| `current_hash` | SHA-256 de la charge utile de cette entrée + `prev_hash` précédent |
| `prev_hash` | Hachage de l'entrée immédiatement précédente — forme la **chaîne de hachage** |
| `bundle_id` | Identifiant unique du package d'interaction |
| `receipt_signature` | Si le fournisseur d'IA a renvoyé un accusé de réception signé des en-têtes de confidentialité |

La chaîne `prev_hash → current_hash → next_current_hash` provoque la **suppression de n'importe quelle ligne pour rompre la chaîne** — l'écart est détectable en parcourant la séquence.

### Couche 2 — Arbre Merkle (L2)

Toutes les 10 entrées de journal sont regroupées dans un **bloc Merkle** :

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

Le `merkle_root` est le hachage racine qui représente les 10 entrées. Si une entrée est modifiée, le `merkle_root` change, invalidant le test d'inclusion.

| Champ L2 | Descriptif |
|--------------|-------------|
| `block_id` | Identifiant du bloc Merkle |
| `merkle_root` | Hachage de racine d'arbre |
| `leaf_hash` | Hash de cette entrée spécifique dans l'arborescence |
| `leaf_index` | Position (0-9) dans le bloc |
| `verified` | `true` si `leaf_hash` est validé dans `merkle_root` |

### Couche 3 — Ancre Rekor (L3)

Le `merkle_root` de chaque bloc scellé est envoyé à **[Sigstore Rekor](https://rekor.sigstore.dev/)**, un journal public en ajout uniquement. Rekor revient :

| Champ L3 | Descriptif |
|--------------|-------------|
| `log_index` | Numéro de séquence global dans le journal Rekor — unique et croissant de manière monotone |
| `uuid` | Identifiant d'entrée dans Rekor |
| `integrated_time` | Horodatage dans lequel Rekor a signé le test d'inclusion |
| `rekor_url` | URL directe vers l'entrée JSON brut dans Rekor |

Une fois que `log_index` existe dans Rekor, **personne ne peut le supprimer** — le journal Rekor est public, distribué et immuable de par sa conception.

---

## Portail de transparence (administrateur)

### Accès

**Administrateur → AI Gateway → Portail de transparence**

### Vérifier un bundle

1. Tapez ou collez `bundle_id` dans le champ de recherche.
2. Cliquez sur **"Vérifier la preuve"**.
3. Vous verrez les trois couches avec des badges de statut :
   - ✅ **Vert** = vérifié avec succès
   - ⚠️ **Jaune** = scellement/ancrage en attente (normal pour les interactions il y a moins de 2 minutes)
   - ❌ **Rouge** = échec de vérification (signal d'avertissement)

### Copier le lien de vérification public

Lorsque le résultat est visible, une barre apparaît avec le bouton **"Copier l'URL de vérification publique"**. Ce lien est public : vous pouvez l'envoyer à un auditeur externe sans nécessiter de connexion.

---

##Page de vérification publique

Toute personne possédant un `bundle_id` peut vérifier le test sans accès à SecureAI :

```
https://tu-dominio.com/verify/<bundle_id>
```

La page affiche les trois couches, un bouton pour télécharger le test JSON et des commandes pour vérifier localement.

**Cette page n'expose pas :**
- Le contenu du message ni la réponse de l'IA
- Données utilisateur (nom, email, IP)
- Toute information personnellement identifiable

Il affiche uniquement les hachages, les horodatages, les index et l'état de vérification.

---

## Vérification indépendante avec curl

Un auditeur externe peut vérifier n'importe quel ensemble sans faire confiance à l'interface Web :

### Étape 1 – Faites le test

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### Étape 2 — Confirmez le hachage dans la couche Merkle

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### Étape 3 — Confirmez l'ancre dans Rekor

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

Un champ `signedEntryTimestamp` non vide confirme que Rekor a accepté et signé l'entrée. Cet horodatage ne peut pas être modifié rétroactivement.

---

## Bundle d'exportation signé (auditeurs et utilisateurs)

En plus du vérificateur public de `bundle_id`, SecureAI vous permet d'exporter des preuves cryptographiques dans un ZIP portable pour des audits hors ligne.

### Que comprend le ZIP ?

Lorsqu'un administrateur utilise **Exporter le bundle signé** dans les journaux ou SMLTP, un fichier est téléchargé avec :

- `data.csv` : données exportées.
- `manifest.json` : métadonnées cryptographiques (`rowCount`, `merkleRootOfExport`, `signingKeyFingerprint`, timestamp, etc.).
- `manifest.sig` : signature Ed25519 de `manifest.json`.
- `verify.js` : vérificateur hors ligne sans dépendances.
- `README.txt` : instructions rapides.

### Comment vérifier (hors ligne)

1. Décompressez le ZIP.
2. Ouvrez un terminal dans ce dossier.
3. Exécutez :

```bash
node verify.js
```

Résultat attendu sur un bundle intact :

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### Que détecte ce vérificateur ?

- Modification de n'importe quel champ dans `data.csv`.
- Suppression ou ajout de lignes dans `data.csv`.
- Modification de `manifest.json`.
- Utilisation d'une clé de signature incorrecte.

Si une vérification apparaît comme `FAIL`, cette exportation **ne doit pas être considérée comme fiable**.

### Test rapide pour l'audit

Pour démontrer la détection de fraude :

1. Exécutez `node verify.js` sur le ZIP nouvellement exporté (il devrait donner tous les `PASS`).
2. Modifiez n'importe quel caractère dans `data.csv` et enregistrez.
3. Exécutez à nouveau `node verify.js`.
4. Doit échouer au moins `Merkle root of export`.

Cela confirme la preuve de l’intégrité de bout en bout de l’ensemble de données exporté.

---

## Interprétation des états

| État L1 | Signification |
|---------------|-------------|
| ✅ Inscription présente | L'interaction est dans MongoDB avec une chaîne de hachage valide |

| État L2 | Signification |
|---------------|-------------|
| ✅ Merkle vérifié | Le hachage de cette entrée fait partie de l'arborescence Merkle et la vérification est correcte |
| ⚠️ Blocage en attente | Il n'y a pas encore 10 entrées pour former un bloc (normal dans les premières minutes) |
| ❌ La vérification a échoué | Le hachage ne correspond pas à merkle_root — manipulation possible |

| État L3 | Signification |
|---------------|-------------|
| ✅ Ancré à Rekor | Le merkle_root se trouve dans le journal public Rekor avec un horodatage signé |
| ⏳ Ancre en attente | Le bloc a été scellé mais pas encore envoyé à Rekor (peut prendre jusqu'à 30 secondes) |

---

## Flux complet d'un message

```
Usuario envía mensaje
        ↓
  SMLTP Gateway (Rust)
  - Registra en MongoDB (SMLTPLog)
  - Computa current_hash = sha256(prev_hash + payload)
  - Escribe en smltp_events.jsonl
        ↓
  Sealer de Merkle (cada 60s)
  - Acumula 10 entradas
  - Calcula merkle_root
  - Crea MerkleBlock en MongoDB
        ↓
  Rekor Anchor Sidecar (cada ~30s)
  - Lee BLOCK_SEALED del log
  - Firma con clave Ed25519
  - Envía a rekor.sigstore.dev
  - Guarda rekor_uuid en MongoDB
        ↓
Prueba completa disponible en /verify/<bundle_id>
```

---

## Conformité des fournisseurs

Le badge **"Provider Compliance"** indique si le fournisseur d'IA (OpenAI, Anthropic, etc.) a confirmé la réception des en-têtes de confidentialité SMLTP :

| Insigne | Signification |
|-------|-------------|
| ✅ VÉRIFIÉ / CERTIFIÉ | Le fournisseur a confirmé la réception avec un accusé de réception signé |
| 🛡️ PASSERELLE PROTÉGÉE | Des en-têtes de confidentialité ont été envoyés mais n'ont pas été explicitement confirmés par le fournisseur. Vos données sont protégées par la passerelle. |
| ⚠️ FOURNISSEUR NON VÉRIFIÉ | Le fournisseur n'a pas confirmé la réception. Les données ont voyagé protégées par SMLTP mais rien ne garantit que le prestataire respectera les consignes de non-formation. |

---

## Questions fréquemment posées

**Puis-je vérifier un forfait sans Internet ?**
Oui, téléchargez le test JSON à partir du bouton "Télécharger JSON" lorsque vous êtes en ligne. Les `merkle_root` et les hachages sont vérifiables hors ligne en recalculant l'arborescence.

**Que se passe-t-il si L3 est en attente ?**
Ceci est normal pour les interactions récentes (moins d’une minute). Le side-car de Rekor traite les blocages toutes les 30 secondes environ. Si après 5 minutes il est toujours en attente, vérifiez que le side-car `rekor-anchor` est en cours d'exécution.

**Combien de temps les enregistrements sont-ils conservés ?**
Par défaut, les journaux sont conservés en fonction du `retentionPeriod` configuré. Les enregistrements marqués comme conformes (`phi`, `pii`, `security`, `authorization`) ne sont jamais automatiquement supprimés.

**Puis-je partager le lien de vérification avec un client ?**
Oui. L'URL `/verify/<bundle_id>` ne nécessite pas de connexion et n'expose pas de données sensibles. Vous pouvez le partager en toute sécurité avec les auditeurs, les régulateurs ou les clients.