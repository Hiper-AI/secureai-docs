---
title: "Public Transparency Page"
sidebarTitle: "Public Transparency"
description: "Publish your audit record's Rekor anchors and keys so a third party can verify them without an account"
---

The public transparency page lets anyone, with no SecureAI account, review your organization's AI audit record: which
blocks were anchored in Sigstore Rekor, with which keys, and when the last test went through the whole chain. With it an
auditor, a customer or a regulator can check that anchoring is continuous and verify any anchor on their own.

The page ships **off**. While it is off, its address answers 404 and only says that your organization has not published
the page.

{/* TODO: screenshot of /transparency with the summary, the anchors table and the commands (English UI, red boxes). */}

## What it publishes

| Section | Content |
|---|---|
| **Summary** | Number of sealed blocks, number of blocks anchored in Rekor, time of the last anchor and time of the last heartbeat through the whole chain |
| **Rekor anchors** | For each anchored block: block id, anchored value (the Merkle root or another value, with its kind), Rekor log index, entry uuid, integrated time and a link to the Rekor entry. Newest first, 25 per page |
| **Keys** | The SHA-256 of each key that signs the Rekor entries, with its status, and links to the published signing keys and the gateway key manifest |
| **How to verify it yourself** | Bash commands that verify the anchor selected in the table |

## What it never publishes

- What was asked of the AI or what it answered.
- Audit entries or receipts.
- Users, emails, IP addresses or any data that identifies a person.

The page does show the volume and rhythm of the audited activity: how many blocks are sealed and how often. That is
why publishing it is your decision.

## How to turn it on

1. Go to **AI Gateway → Status**.
2. Under **Public transparency page**, turn on **Publish the audit trail summary**. You need edit permission on
   AI Gateway.
3. Open **See what is published** to review the page at `https://<your-domain>/transparency`.

The change is logged as a policy change, with who made it. To stop publishing, turn the same switch off: the page goes
back to answering 404.

With the page off, users with access to AI Gateway see the same list of anchors through the authenticated API
`GET /api/smltp/anchors`, which takes the same parameters as the public one.

## The API

The page reads `GET /api/public/transparency`, which needs no authentication and answers 404 while the page is off.

| Parameter | Value |
|---|---|
| `limit` | Between 1 and 100. Default 50 |
| `before_log_index` | Returns the anchors with a Rekor index lower than this one. Use the response's `next_before_log_index` to ask for the next page |

The response has the format `smltp-public-transparency/1`: `rekor.origin`, `keys`, `totals`, `heartbeat` and `anchors`.

## Where an auditor finds everything

An auditor who only knows your domain finds, at `https://<your-domain>/.well-known/smltp`, where your organization
publishes what verification needs: the gateway's key manifest, the keys that sign the anchors, the check for one
receipt and the Rekor log it anchors in. No authentication is needed.

```bash
curl -s https://your-domain.com/.well-known/smltp
```

```json
{
  "format": "smltp-discovery/1",
  "key_manifest": "/api/public/keys/manifest",
  "anchor_signing_keys": "/api/public/export-signing-keys",
  "receipt_verify": "/api/public/verify/{bundle_id}",
  "receipt_verify_page": "/verify/{bundle_id}",
  "rekor": { "origin": "https://rekor.sigstore.dev" },
  "transparency": null
}
```

- It always answers, with the public page on or off: it only names routes that are already public.
- `transparency` holds this page's address while it is on, and `null` while it is off.
- Paths are relative to the domain the document was requested from.
- The document only says where to look. Trust still comes from the keys and their Rekor anchors, as the steps below
  explain.

## How a third party verifies an anchor

The page's commands use only `curl`, `sha256sum`, `base64` and `openssl`, and do not trust the SecureAI website. For the
selected anchor they check four things:

1. Rekor stores the SHA-256 of the anchored value, written as text.
2. Rekor's public key is the one the entry's `logID` names, and the entry sits at the published index.
3. Rekor's signature over the entry (the signed entry timestamp) is valid.
4. The key that signed the entry is one your organization publishes. Without this step, anyone with an Ed25519 key could
   have put the same root in Rekor. The page includes it only when opened over https.

The simplest path is to copy the script the page builds with its **Copy** button. If the auditor prefers to write it,
this version does the same for the newest anchor (it also needs `jq`):

```bash
HOST="https://your-domain.com"

curl -s "$HOST/api/public/transparency?limit=1" > t.json
ROOT=$(jq -r '.anchors[0].merkle_root' t.json)
UUID=$(jq -r '.anchors[0].rekor_uuid' t.json)
IDX=$(jq -r '.anchors[0].rekor_log_index' t.json)
REKOR=$(jq -r '.rekor.origin' t.json)

# 1. Rekor stores the SHA-256 of the anchored value
curl -s "$REKOR/api/v1/log/entries/$UUID" > entry.json
BODY=$(jq -r '.[].body' entry.json)
DATA_HASH=$(printf '%s' "$BODY" | base64 -d | jq -r '.spec.data.hash.value')
[ "$(printf '%s' "$ROOT" | sha256sum | cut -c1-64)" = "$DATA_HASH" ] && echo "OK 1" || echo "FAIL 1"

# 2. Rekor's key is the logID's and the entry is at the published index
curl -s "$REKOR/api/v1/log/publicKey" > rekor.pub
LOGID=$(jq -r '.[].logID' entry.json)
IT=$(jq -r '.[].integratedTime' entry.json)
LI=$(jq -r '.[].logIndex' entry.json)
[ "$(openssl pkey -pubin -in rekor.pub -outform DER | sha256sum | cut -c1-64)" = "$LOGID" ] && [ "$LI" = "$IDX" ] \
  && echo "OK 2" || echo "FAIL 2"

# 3. Rekor's signature over the entry is valid
printf '{"body":"%s","integratedTime":%s,"logID":"%s","logIndex":%s}' "$BODY" "$IT" "$LOGID" "$LI" > set-payload.json
jq -r '.[].verification.signedEntryTimestamp' entry.json | base64 -d > set.sig
openssl dgst -sha256 -verify rekor.pub -signature set.sig set-payload.json > /dev/null && echo "OK 3" || echo "FAIL 3"

# 4. The key that signed the entry is one the organization publishes
printf '%s' "$BODY" | base64 -d | jq -r '.. | .publicKey?.content? // empty' | head -n1 | base64 -d > anchor-key.pem
FP=$(openssl pkey -pubin -in anchor-key.pem -outform DER | sha256sum | cut -c1-64)
curl -s "$HOST/api/public/export-signing-keys" | grep -q "\"fingerprint_sha256\":\"$FP\"" && echo "OK 4" || echo "FAIL 4"
```

If all four print OK, that block is in Rekor exactly as your organization sealed it, signed with one of its keys.

### What this check does not prove

An anchor proves that a block's root existed and has not changed since it was published in Rekor. It does not prove
that a given record is inside that block: that takes the record's bundle, at
`https://<your-domain>/verify/<bundle_id>`. See [Public verification page](/en/security/immutable-logs).

## See also

- [Audit Record Status](/en/ai-gateway/status)
- [Audit Record Integrity](/en/security/audit-integrity)
