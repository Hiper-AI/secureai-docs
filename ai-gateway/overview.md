---
sidebar_position: 1
title: AI Gateway Overview
---

# AI Gateway

The **AI Gateway** is the centralized control plane for governing, securing, routing, and inspecting all organization-wide AI model traffic.

---

## Core Capabilities

### 1. Security Policies
Define organization-wide enforcement rules:
- **Model Allowlists**: Restrict which models and providers employees and applications can interact with.
- **Data Residency Geofencing**: Ensure prompts and responses remain within designated jurisdictions.
- **Enforcement Modes**: Run in **Monitor Mode** (log and attest without blocking) or **Enforce Mode** (fail-closed, blocking non-compliant traffic with cryptographic receipts).

### 2. Dashboard & Observability
Monitor real-time metrics across your enterprise:
- **Total Secured Interactions** and active SMLTP bundles.
- **Redaction & Blocking Rates**: Track sensitive data intercepted by DLP/PII engines.
- **Protocol Status**: Verify live gateway health and key rotation status.

### 3. Cryptographic Key Management
Manage Ed25519 signing keys and AES-256 encryption keys:
- **Zero-Downtime Rotation**: Rotate signing keys periodically while preserving offline verification for receipts signed under previous keys.
- **Config**: Go to **Admin ? AI Gateway ? Keys**.

### 4. Transparency Portal & Audit
Validate interaction integrity using cryptographic proofs:
- Search any interaction by undle_id to inspect its L1 hash chain, L2 Merkle tree, and L3 Sigstore Rekor transparency anchor.
- Generate shareable public verification links for third-party compliance auditors.

### 5. Extension Management
Manage and enforce security policies across the SecureAI browser extension fleet to prevent shadow AI usage on client browsers.
