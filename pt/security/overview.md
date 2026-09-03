---
sidebar_position: 1
title: "Security Overview"
---



# Security Overview

Learn about SecureAI's security features and architecture.

## Security Features

SecureAI implements enterprise-grade security measures to protect your data and applications, with SMLTP (Secure Model Language Transfer Protocol) as the cornerstone of our security architecture.

### SMLTP (Secure Model Language Transfer Protocol)

**SMLTP** is a security protocol with a public specification draft that makes communication with
Large Language Models (LLMs) governed, contained, and provable. It provides:

- **Signed Entitlement Tokens**: every governed request carries an **Ed25519**-signed token binding
  identity, authorized model, policy hash, and the exact request bytes (SHA-256)
- **Signed Compliance Receipts**: each gateway-routed interaction produces a receipt that can be
  verified offline against the gateway's public key
- **Policy Enforcement**: model allowlists, data-residency checks, and egress controls — in monitor
  or enforce mode, with signed denial receipts
- **Tamper-Evident Audit Logging**: hash-chained, Merkle-sealed logs, optionally anchored to an
  external transparency log (Sigstore Rekor)
- **Key Rotation**: Ed25519 signing-key rotation; receipts issued under previous keys remain
  verifiable
- **Bundle Encryption**: optional AES-256-GCM encryption of request bundles between client and
  gateway

### Data Protection

- **Zero-Knowledge Posture**: customer-managed keys (BYOK), ephemeral in-memory processing, and
  deployment-local logging keep sensitive data under your control
- **Encryption at Rest**: All stored data is encrypted using industry-standard algorithms
- **Encryption in Transit**: TLS 1.3 encryption for all API communications
- **Customer-Managed Keys**: You control your encryption keys

### Access Control

- **Role-Based Access Control (RBAC)**: Granular permissions for different user types
- **API Key Management**: Secure authentication for all API requests
- **Rate Limiting**: Intelligent rate limiting to prevent abuse
- **Audit Logs**: Complete activity tracking for compliance and security

### Security Policies

SMLTP supports several built-in policy templates:

- **Internal**: Default policy for internal company data
- **Internal Strict**: Higher security for sensitive internal data
- **Public**: Less restrictive policy for non-sensitive, public data
- **HIPAA**: Compliant with healthcare data regulations
- **GDPR**: Compliant with European data protection regulations
- **PCI-DSS**: Compliant with payment card industry standards

### Compliance & Certifications

- **Enterprise Ready**: Designed for enterprise security requirements
- **Audit Trail**: Complete logging for compliance and security audits
- **Policy Enforcement**: Automated enforcement of security policies
- **Real-time Monitoring**: Continuous monitoring of security events

## How SMLTP Works

1. **Entitlement**: the control plane mints a signed token authorizing this caller, this model,
   under this policy, for these exact request bytes
2. **Verification**: the SMLTP gateway verifies the token — signature, expiry, model match, body
   hash, replay, and revocation — before the request goes anywhere
3. **Policy Enforcement**: model allowlist, residency, and egress rules are evaluated at the
   gateway; in enforce mode a non-compliant call is blocked with a signed denial receipt
4. **Inspection & Attestation**: DLP/PII inspection runs on the governed path (best-effort,
   probabilistic), and its verdict is recorded in the signed receipt
5. **Audit Logging**: every interaction lands in a hash-chained, Merkle-sealed audit trail

## Benefits

- **Provable, not just logged**: signed receipts let auditors verify interactions independently
- **Compliance Ready**: built-in support for major compliance frameworks
- **Containment**: even a compromised agent cannot exceed its cryptographically signed permissions
- **Deterministic Revocation**: cutting off a user, key, or agent takes effect at the gateway in
  seconds — without waiting on any AI provider
- **Policy Driven**: automated enforcement of your security policies

## Next Steps

- [SMLTP Deep Dive](/pt/en/security/smltp) - Learn more about SMLTP
- [Authentication](/pt/en/iam/overview) - Understand authentication methods
- [API Security](/pt/en/api) - Secure API usage guidelines 