---
sidebar_position: 4
title: "Immutable Logs"
---




# Immutable Logs — Cryptographic audit chain

SecureAI records **every AI interaction and every administrative action** in a three-layer immutable chain. This architecture ensures that any modification, deletion or manipulation of records is detectable — even if someone has direct access to the database.

## Why does it matter?

A log that only exists in MongoDB is not truly immutable: anyone who has access to the server can delete it without leaving a trace. SecureAI solves this by pinning each log to **Sigstore Rekor**, a public transparency log operated by the Open Source Security Foundation (OpenSSF) — the same system the software industry uses to verify the chain of custody of critical packages.

> **Technical guarantee:** Once a Merkle block hash is in Rekor, no one — including the SecureAI operator — can retroactively alter that record. Any third-party auditor can independently verify it with a single curl call.

---

##The three layers of proof

Each interaction bundle has three levels of cryptographic evidence:

### Layer 1 — MongoDB Registry (L1)

The primary record of the interaction is stored in MongoDB with:

| Field | Description |
|-------|-------------|
| `current_hash` | SHA-256 of the payload of this entry + `prev_hash` previous |
| `prev_hash` | Hash of the immediately preceding entry — forms the **hash chain** |
| `bundle_id` | Unique identifier of the interaction package |
| `receipt_signature` | If the AI ​​provider returned a signed acknowledgment of the privacy headers |

The string `prev_hash → current_hash → next_current_hash` causes **deleting any row to break the string** — the discrepancy is detectable by traversing the sequence.

### Layer 2 — Merkle Tree (L2)

Every 10 log entries are grouped into a **Merkle block**:

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

The `merkle_root` is the root hash that represents the 10 entries. If any entry is altered, the `merkle_root` changes — invalidating the inclusion test.

| Field L2 | Description |
|----------|-------------|
| `block_id` | Merkle Block ID |
| `merkle_root` | Tree root hash |
| `leaf_hash` | Hash of this specific entry within the tree |
| `leaf_index` | Position (0–9) within the block |
| `verified` | `true` if `leaf_hash` is committed in `merkle_root` |

### Layer 3 — Rekor Anchor (L3)

The `merkle_root` of each sealed block is sent to **[Sigstore Rekor](https://rekor.sigstore.dev/)**, a public append-only log. Rekor returns:

| Field L3 | Description |
|----------|-------------|
| `log_index` | Global sequence number in Rekor log — unique and monotonically increasing |
| `uuid` | Entry identifier in Rekor |
| `integrated_time` | Timestamp in which Rekor signed the inclusion test |
| `rekor_url` | Direct URL to entry raw JSON in Rekor |

Once `log_index` exists in Rekor, **no one can delete it** — the Rekor log is public, distributed, and immutable by design.

---

## Transparency Portal (admin)

### Access

**Admin → AI Gateway → Transparency Portal**

### Verify a bundle

1. Type or paste `bundle_id` into the search field.
2. Click **"Verify Proof"**.
3. You will see the three layers with status badges:
   - ✅ **Green** = verified successfully
   - ⚠️ **Yellow** = sealing/anchor pending (normal for interactions less than 2 minutes ago)
   - ❌ **Red** = verification failure (warning signal)

### Copy public verification link

When the result is visible, a bar appears with the **"Copy public verification URL"** button. That link is public — you can send it to an external auditor without requiring a login.

---

##Public verification page

Anyone with a `bundle_id` can verify the test without access to SecureAI:

```
https://tu-dominio.com/verify/<bundle_id>
```

The page shows the three layers, a button to download the test JSON, and commands to verify locally.

**This page does not expose:**
- The content of the message nor the response of the AI
- User data (name, email, IP)
- Any personally identifiable information

It only shows hashes, timestamps, indexes and verification status.

---

## Independent verification with curl

An external auditor can verify any bundle without trusting the web interface:

### Step 1 — Get the test

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### Step 2 — Confirm the hash in the Merkle layer

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### Step 3 — Confirm the anchor in Rekor

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

A non-empty `signedEntryTimestamp` field confirms that Rekor has accepted and signed the entry. That timestamp cannot be retroactively altered.

---

## Signed export bundle (auditors and users)

In addition to the public verifier by `bundle_id`, SecureAI allows you to export cryptographic evidence in a portable ZIP for offline audits.

### What does the ZIP include?

When an administrator uses **Export signed bundle** in Logs or SMLTP, a file is downloaded with:

- `data.csv`: exported data.
- `manifest.json`: cryptographic metadata (`rowCount`, `merkleRootOfExport`, `signingKeyFingerprint`, timestamp, etc.).
- `manifest.sig`: signature Ed25519 of `manifest.json`.
- `verify.js`: offline verifier without dependencies.
- `README.txt`: quick instructions.

### How to verify (offline)

1. Unzip the ZIP.
2. Open a terminal in that folder.
3. Run:

```bash
node verify.js
```

Expected output on an intact bundle:

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### What does this verifier detect?

- Editing any field in `data.csv`.
- Deleting or adding rows in `data.csv`.
- Modification of `manifest.json`.
- Use of incorrect signing key.

If any check appears as `FAIL`, that export **should not be considered trusted**.

### Quick test for audit

To demonstrate tamper detection:

1. Run `node verify.js` on the newly exported ZIP (it should give all `PASS`).
2. Edit any character in `data.csv` and save.
3. Run `node verify.js` again.
4. Must fail at least `Merkle root of export`.

This confirms evidence of end-to-end integrity for the exported dataset.

---

## Interpretation of states

| L1 State | Meaning |
|-----------|-------------|
| ✅ Registration present | The interaction is in MongoDB with valid hash chain |

| L2 State | Meaning |
|-----------|-------------|
| ✅ Merkle verified | The hash of this entry is part of the Merkle tree and the verification is correct |
| ⚠️ Pending block | There are not yet 10 entries to form a block (normal in the first minutes) |
| ❌ Verification failed | Hash does not match merkle_root — possible manipulation |

| State L3 | Meaning |
|-----------|-------------|
| ✅ Anchored in Rekor | The merkle_root is in the Rekor public log with signed timestamp |
| ⏳ Anchor pending | The block has been sealed but not yet sent to Rekor (may take up to 30 seconds) |

---

## Complete flow of a message

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

## Supplier compliance

The **"Provider Compliance"** badge indicates whether the AI ​​provider (OpenAI, Anthropic, etc.) confirmed receiving the SMLTP privacy headers:

| Badge | Meaning |
|-------|-------------|
| ✅ VERIFIED / CERTIFIED | The supplier confirmed receipt with a signed acknowledgment |
| 🛡️ GATEWAY PROTECTED | Privacy headers were sent but not explicitly confirmed by the provider. Your data is protected by the gateway. |
| ⚠️ PROVIDER NOT VERIFIED | The supplier did not confirm receipt. The data traveled protected by SMLTP but there is no guarantee that the provider will respect the no-training instructions. |

---

## Frequently asked questions

**Can I verify a bundle without internet?**
Yes, download the test JSON from the "Download JSON" button while you are online. The `merkle_root` and hashes are verifiable offline by recomputing the tree.

**What happens if L3 is pending?**
This is normal for recent interactions (less than 1 minute). Rekor's sidecar processes blocks every ~30 seconds. If after 5 minutes it is still pending, verify that the sidecar `rekor-anchor` is running.

**How long are records kept?**
By default, logs are kept based on the configured `retentionPeriod`. Records marked as compliance (`phi`, `pii`, `security`, `authorization`) are never automatically deleted.

**Can I share the verification link with a customer?**
Yes. The URL `/verify/<bundle_id>` does not require login and does not expose sensitive data. It is safe to share with auditors, regulators or clients.