---
title: "Audit Record Integrity"
sidebarTitle: "Record Integrity"
description: "How SecureAI makes any change to the AI audit record evident: hash chain, Rekor anchoring, retention-locked copy and a daily walk"
---

The SMLTP gateway writes every AI call to an append-only audit record. Four mechanisms make a change to that record
detectable, and let an auditor check it without trusting Hiper AI:

| Mechanism | What it detects |
|---|---|
| Hash chain | An entry edited, deleted or inserted in the middle |
| Public anchoring in Rekor | A block rewritten after it was published |
| Retention-locked copy | A block deleted from the database together with its entries |
| Daily walk and alerts | A missing link or a fork in the stored chain |

These mechanisms **detect** tampering; they do not prevent it. The database rejects updates and deletes that come
through the application; someone with direct database access can delete rows, and the chain makes that evident.

## Hash chain

Each gateway entry carries `prev_hash`, the hash of the entry before it, and `current_hash`, the SHA-256 of its content
plus `prev_hash`. The first entry of a chain has a `prev_hash` of 64 zeros. Editing, deleting or inserting an entry
breaks the link with the next one.

Entries of version 2 of the chain (`v: 2`) hash a JSON array that includes:

- **Sequence number** (`seq`): numbers the lines of each gateway's file from 0. A reader spots a missing line without
  holding the previous one, and hiding it means renumbering and rehashing every later line, including those in blocks
  already anchored in Rekor.
- **Model**: the model that served the call is inside the hash.
- **Dropped events**: if the gateway lost events before writing them (queue full or write error), the next entry counts
  them in `details.dropped_since_last`, also inside the hash. A loss is recorded in the chain instead of passing
  silently.

The SMLTP draft specification, section 5, defines both formats.

## Merkle blocks

Every 10 entries the gateway seals a Merkle block with the tree's root, the first and last hash and the number of
entries. If a single entry changes, the root changes and that entry's inclusion proof fails.

## Public anchoring in Rekor

The root of each sealed block is published in [Sigstore Rekor](https://rekor.sigstore.dev/), a public append-only
transparency log run by the Sigstore community, signed with a key of your organization. Rekor returns an index and a
signed timestamp.

From then on, a block rewritten in the database no longer matches what Rekor stores, and anyone can check it with `curl`
and `openssl`, with no SecureAI account:

- One record, from `https://<your-domain>/verify/<bundle_id>`.
- Any anchor of the organization, from the [public transparency page](/en/security/public-transparency), if you turn
  it on.

## Retention-locked copy

Anchoring falls short if someone deletes a whole block together with its entries: nothing is left to compare with Rekor.
So SecureAI copies each sealed block to a bucket with locked retention, in Google Cloud Storage with a locked retention
policy or in S3 with Object Lock in compliance mode. Until the retention expires, the cloud provider does not let anyone
delete or rewrite that copy, including whoever administers the database.

The copy holds the block id, the Merkle root, the leaf hashes, the entry ids, the counts and the dates. It does not hold
the entries' content: it can carry personal data, and a locked object cannot be erased when a person asks.

Hiper AI sets up the bucket per organization. If **AI Gateway → Status** shows the **Archive** stage as **Off**, your
organization does not have one; ask Hiper AI support. The health check verifies that every block sealed in the last 7
days has its copy within 30 minutes.

## Daily walk and alerts

SecureAI checks the chain at two points:

- **On ingestion**: it compares each line's `prev_hash` with the line before it in the same file. A break opens a
  high-severity alert (`smltp_chain_gap`).
- **Once a day**: it walks the chain stored in the database, over a 26-hour window so that walks overlap, looking for
  two things:
  - **Gap**: an entry whose `prev_hash` matches no stored entry. The one before it was deleted from the database or
    never ingested.
  - **Fork**: two entries pointing to the same previous one. Two chains were written from one point, or an entry was
    rewritten and stored twice.

  Each finding opens a high-severity alert (`smltp_chain_store_gap`) with the entry id and the hashes, never the content.

The `chain_continuity` health check makes the **Sealing** stage of [Status](/en/ai-gateway/status) **Degraded** when
either alert is new, or when the daily walk did not run on time. That triggers the console bell and, if it lasts 30
minutes, an email to the admins.

On top of that, every 15 minutes a test goes through the whole chain (signing, sealing and an anchor confirmed in Rekor)
even with no traffic. On an idle gateway, that test also keeps recent entries in the chain.

### What the walk does not see

- Deletion of the newest entry of a chain: no other entry points to it.
- A gap older than the 26-hour window.
- With the 15-minute test off, a gateway idle for longer than SMLTP retention: the entry before its next one may have
  been removed by retention, on purpose.

For those cases the Rekor anchor and the retention-locked copy keep each sealed block's root and hashes.

## What to do on a chain alert

A gap or a fork means someone with direct database access may have deleted or rewritten records. Treat it as a
security incident:

1. Write down the entry id and the hashes from the alert.
2. Compare that period's blocks with their Rekor anchors and with the copy in the archive bucket: they hold the root and
   the list of hashes the block had when it was sealed.
3. Contact Hiper AI support with that data.

## Verification on every plan

Receipt verification is included on every plan: the **Verify** action in the AI Gateway activity logs, the public page
`/verify/<bundle_id>` and the verification badge on each response.

## Scope

- Only calls that go through the gateway enter the chain. **Coverage, last 24 h** on [Status](/en/ai-gateway/status)
  lists the internal calls that went out without the gateway; those have no receipt.
- An anchor proves that a root existed and has not changed since it was published. What happened before publication is
  covered by the hash chain and the daily walk.

## See also

- [Audit Record Status](/en/ai-gateway/status)
- [Public Transparency Page](/en/security/public-transparency)
- [SMLTP Security](/en/security/smltp)
