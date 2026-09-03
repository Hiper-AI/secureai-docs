---
sidebar_position: 2
title: "SMLTP Security"
---



# SMLTP Security Protocol

SecureAI uses the **Secure Model Language Transfer Protocol (SMLTP)** to govern, contain, and prove
communication with Large Language Models (LLMs).

## What is SMLTP?

SMLTP is a security protocol with a **public specification draft** (v0.2). It defines a
**deterministic control plane** for AI traffic: instead of relying only on probabilistic inspection
of prompts, SMLTP makes five properties of every governed AI call deterministic and cryptographically
verifiable.

| Layer | Deterministic mechanism |
|---|---|
| **Identity** | Ed25519 Signed Entitlement Token (SET) minted per request |
| **Authorization** | `model` and `policy_hash` claims — the call runs under a named policy or not at all |
| **Transport integrity** | `body_sha256` binds the token to the exact request bytes |
| **Containment** | Monitor/enforce modes, replay cache, subject revocation, fail-closed defaults |
| **Audit** | Hash-chained, Merkle-sealed log with signed compliance receipts |

## The two-plane model

SMLTP deliberately separates two kinds of controls:

- **Deterministic plane (cryptography):** who is calling, what they are authorized to call, that the
  request was not altered, that a revoked subject is cut off, and that the record cannot be silently
  rewritten. These are guarantees, enforced by signatures and hashes.
- **Probabilistic plane (inspection):** DLP, PII redaction, and Prompt Shield run *behind* the
  deterministic controls and are explicitly **best-effort**. SMLTP never claims that cryptography
  detects prompt injection or that inspection catches every sensitive string — it claims that the
  inspection verdict that *was* produced is recorded in a signed, verifiable receipt.

## Key Features

### Signed Entitlement Tokens
- Every governed request carries an Ed25519-signed token binding identity, model, policy, and request bytes
- Replay protection via single-use token IDs
- Revoking a subject takes effect at the gateway within seconds — no provider-side cooperation needed

### Signed Compliance Receipts
- Each gateway-routed interaction produces a receipt signed by the gateway
- Receipts record the governing policy, request hash, and the inspection evidence that was produced
- Receipts can be verified offline against the gateway's public key — see
  [Receipts API](../api/receipts.md)

### Tamper-Evident Audit
- Audit events are hash-chained (`prev_hash` → `current_hash`) and sealed into Merkle blocks
- Merkle roots can be anchored to an external transparency log (Sigstore Rekor), so the record's
  integrity does not depend on trusting the SecureAI operator — see
  [Immutable Logs](./immutable-logs.md)

### Policy Enforcement
- Model allowlists, data-residency (geofence) checks, and egress controls evaluated at the gateway
- **Monitor mode** observes and attests; **enforce mode** blocks non-compliant calls with a signed
  denial receipt

### Key Management
- Ed25519 signing keys with rotation support; receipts issued under previous keys remain verifiable

## Scope and honesty

- **Deployment scope:** SMLTP receipts and enforcement apply to **gateway-routed deployments**.
  Deployments that call providers directly still get platform DLP/PII and audit logging, but not
  gateway-signed receipts (the [Receipts API](../api/receipts.md) documents this behavior).
- **Encryption scope:** transport encryption is TLS; request bundles between client and gateway can
  additionally be encrypted (AES-256-GCM). SMLTP does not currently provide end-to-end encryption
  through the AI provider, and does not claim forward secrecy.
- **Inspection scope:** DLP/PII detection is probabilistic and best-effort. What SMLTP guarantees is
  that the verdict is *attested* — the receipt proves what was checked and what the result was.

## Security Benefits

- **Provability**: signed receipts turn "we have logs" into "anyone can verify what happened"
- **Containment**: even a compromised or misbehaving agent cannot exceed its signed entitlements
- **Deterministic revocation**: blocking a user, key, or agent cuts traffic at the gateway in seconds
- **Auditability**: a tamper-evident trail that external auditors can verify independently
