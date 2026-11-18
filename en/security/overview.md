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

- **Per-tenant keys**: SecureAI encrypts conversations and stored connector credentials at the field level with AES-256-GCM, under keys unique to your tenant and wrapped by a cloud key management service.
- **Encryption at rest**: databases and backups sit on Google Cloud disks, which Google encrypts at rest.
- **Encryption in transit**: connections use TLS 1.2 or TLS 1.3 with forward-secret AEAD cipher suites.
- **Your own key for evidence**: if you turn on evidence retention (off by default), you can encrypt that evidence with a key in your own AWS, Azure or Google Cloud key management service.

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
- **HIPAA, GDPR and PCI-DSS**: catalog names that apply the same controls as Internal Strict. Choosing one does not make your use compliant with that regulation. To enforce rules specific to a regulation, define a custom policy with the same name: it replaces the built-in one for your organization.

### Compliance support

- **Framework mapping**: SecureAI maps its checks to controls in frameworks such as the NIST AI RMF, ISO/IEC 42001 and the EU AI Act. The mapping is partial and helps you gather evidence. It is not a certification.
- **Certifications**: Hiper AI holds no SOC 2 report and no ISO/IEC 27001 certificate today.
- **Audit trail**: hash-chained logs of AI interactions and administrative actions, for your compliance and security reviews.
- **Policy enforcement**: SecureAI applies your security policies to every request that goes through the gateway.
- **Real-time monitoring**: security events show up in the console as they happen.

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
- **Audit evidence**: signed receipts and the framework mapping give your auditors material they can check on their own.
- **Containment**: an agent that goes through the gateway cannot exceed the permissions in its signed token, even if it is compromised.
- **Deterministic Revocation**: cutting off a user, key, or agent takes effect at the gateway in
  seconds — without waiting on any AI provider
- **Policy Driven**: automated enforcement of your security policies

## Next Steps

- [SMLTP Deep Dive](/en/security/smltp) - Learn more about SMLTP
- [Authentication](/en/iam/overview) - Understand authentication methods
- [API Security](/en/api) - Secure API usage guidelines 