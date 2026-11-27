---
title: "Audit Record Status (SMLTP)"
sidebarTitle: "Status"
description: "Check on one screen whether the gateway is signing, sealing, anchoring in Rekor and archiving the record of what AI does"
---

**AI Gateway → Status** (`/admin/smltp-status`) answers one question: is the record of what AI does in your
organization being signed, sealed and published right now? The screen reloads every 30 seconds while the tab is
visible.

{/* TODO: screenshot of AI Gateway → Status with the four stages Working (English UI, red boxes). */}

## What it shows

| Block | What it tells you |
|---|---|
| **End-to-end test** | Whether the last test request went through the whole chain, and when |
| **Signing**, **Sealing**, **Public anchoring**, **Archive** | Each stage's state and its latest event |
| **Coverage, last 24 h** | How many AI calls have a signed receipt and which ones went out without the gateway |
| **Public transparency page** | The switch that publishes the audit trail summary (see [Public Transparency Page](/en/security/public-transparency)) |

When SMLTP alerts are open, a notice at the top says how many and gives the overall state.

### States

| State | Meaning |
|---|---|
| **Working** | Every check of the stage passed |
| **Degraded** | The evidence an auditor verifies is missing, late or does not verify |
| **Down** | The control is not doing what is configured: the gateway is out of the path, unreachable or applying another mode |
| **No data** | No check of that stage has run yet |
| **Off** | The stage is not configured for your organization (today only **Archive**) |

Under a failing stage, **Why** lists the codes of the checks that failed, for example `rekor_anchoring_behind`. The
screen shows codes, not the checks' internal text, which Hiper AI writes for its operators.

## The end-to-end test

Every 15 minutes SecureAI sends a test request through the gateway that the gateway must refuse. It follows the request
to the end: signed receipt, leaf in the Merkle tree, sealed block and anchor confirmed in the public Rekor log. It is the
only check that produces its own evidence, so it fails even when your organization has no traffic.

**Last complete test** shows when it was confirmed in Rekor, and **See it in Rekor** opens that entry on
`search.sigstore.dev`. If some tests have not finished the trip yet, the card says how many are on the way.

**Test now**, at the top right, sends a test right away. Users with edit permission on AI Gateway see it, and it accepts
one test every 30 seconds. The gateway signs it at once; sealing and the Rekor anchor take a few minutes.

## The four stages

### Signing

The gateway signs a receipt for every AI call. The card shows the time of the **Last receipt**, and **Verify it** opens
that call in **Settings → Activity Logs**, filtered by the AI Gateway source, where you can verify its three layers.

### Sealing

Receipts are grouped in Merkle blocks of 10 entries chained with hashes. The card shows the time of the **Last block**
and how many entries it has. This stage also covers chain continuity: the check of each line as it is ingested and the
daily walk of the stored chain (see [Audit Record Integrity](/en/security/audit-integrity)).

With little traffic a block takes longer to fill. A partial block does not count as a failure.

### Public anchoring

The root of each sealed block is published in [Sigstore Rekor](https://rekor.sigstore.dev/), a public append-only
transparency log. The card shows the time of the **Last anchor** with its **See it in Rekor** link. If the newest block
is still waiting for its anchor, the card says for how many minutes. With the default settings, a block sealed more than
30 minutes ago without an anchor makes the stage **Degraded**.

### Archive

Each sealed block is copied to a bucket with locked retention (Google Cloud Storage with a locked retention policy, or
S3 with Object Lock in compliance mode). Until the retention expires, nobody can delete or rewrite that copy, including
whoever administers the database. The copy holds hashes and ids, never the content of the calls.

The card shows the time of the **Last copy** and, when blocks are waiting, how many minutes the oldest one has waited.
A block from the last 7 days still without a copy after 30 minutes makes the stage **Degraded**.

If the card says **Off**, your organization has no archive bucket configured. Hiper AI sets it up per organization: ask
Hiper AI support.

## Coverage

**Coverage, last 24 h** counts the AI calls that went through the gateway with a signed receipt. If an internal platform
feature called a model without going through the gateway, the card lists it by lane with its count. Those calls have no
signed receipt and are not in the chain.

## Notifications

When SMLTP is **Degraded** or **Down**:

- Hiper AI's operators get an email as soon as the state changes.
- The console bell shows **The AI audit record (SMLTP) has problems** or **is down**, with a link to this screen, while
  the alert is open.
- If the same problem lasts 30 minutes, every active admin of your organization gets an email with the state and the
  affected stages. You get one email per problem, not one per check run. The same problem after a recovery, or a
  different problem, can send another.

Neither the bell nor the email includes the checks' internal text.

## What to do when a stage fails

Hiper AI operates the gateway, and its operators already got the alert. Your part is knowing which evidence is missing
while the failure lasts and confirming the recovery.

| Stage | Common codes | What is happening | What to do |
|---|---|---|---|
| Signing | `gateway_not_in_path`, `gateway_unreachable`, `gateway_mode_mismatch`, `stale_gateway_behavior` | The gateway is out of the path or not applying the configured mode. Stage **Down** | Contact Hiper AI support with the codes. Calls from that period may have no receipt |
| Signing | `no_receipts`, `receipt_not_retrievable`, `receipt_store_loss` | There was traffic without a receipt, or a receipt cannot be fetched | Review that period's calls in Activity Logs; missing receipts are not recovered later |
| Signing | `gateway_key_not_in_manifest`, `gateway_key_not_head`, `gateway_key_revoked` | The gateway signs with a key that is not the manifest's current one | Contact support. A receipt signed with that key does not verify against the published manifest |
| Sealing | `merkle_sealing_stalled`, `merkle_entries_behind_window` | Some receipts are not in a sealed block yet | Wait for them to be sealed; if it lasts more than an hour, contact support |
| Sealing | `audit_events_dropped`, `audit_write_failed` | The gateway lost events before writing them | The chain records how many were lost inside the next entry's hash. Contact support |
| Sealing | `chain_gap`, `chain_store_gap` | A link of the chain is missing or the chain forked | Treat it as a security incident: someone may have deleted or rewritten records. See [Audit Record Integrity](/en/security/audit-integrity) |
| Sealing | `chain_walk_stale` | The daily walk of the chain did not run on time | Contact support |
| Public anchoring | `rekor_anchoring_behind`, `rekor_anchor_unreachable`, `rekor_dlq_failed` | Some sealed blocks have no Rekor anchor | Blocks are anchored once the service is back. If it lasts, contact support |
| Archive | `ledger_archive_behind` | Some sealed blocks have no copy in the bucket | Copies catch up once the archiver is back. If it lasts, contact support |
| End-to-end test | `heartbeat_not_sealed`, `heartbeat_not_anchored`, `heartbeat_rekor_unreachable`, other `heartbeat_*` | The test did not finish the trip | Look at which stage is failing; the code says at which step the test stopped |

When the stage is back to **Working**, use **Test now** and wait until **Last complete test** shows a time after the
failure. That test confirms the whole chain works again.

## See also

- [Audit Record Integrity](/en/security/audit-integrity)
- [Public Transparency Page](/en/security/public-transparency)
- [SMLTP Security](/en/security/smltp)
