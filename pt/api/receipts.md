---
title: "Compliance Receipts"
sidebar_label: "Receipts"
description: "Fetch the signed SMLTP compliance receipt for a completion"
openapi: "GET /receipts/{bundleId}"
---



# Compliance Receipts

When a completion is routed through the **SMLTP gateway**, SecureAI produces a signed compliance **receipt** — cryptographic proof of the policy that governed the call. This endpoint fetches that receipt by its bundle id.

Receipts exist only for gateway-routed deployments. On direct-provider deployments there is no gateway to sign receipts, and this endpoint returns `404`.

## Endpoint

```
GET /receipts/:bundleId
```

## Where the bundle id comes from

Completion responses expose the bundle id whenever an SMLTP entitlement is minted for the call:

- Classic endpoint: `metadata.smltp.bundle_id` (and a ready-made `metadata.smltp.receipt_url`).
- OpenAI-compatible endpoint: `secureai.smltp_bundle_id`.

The bundle id (an entitlement id such as `jti-…`) is returned even on native/direct-provider deployments. The **signed receipt** at that id, however, only exists when traffic is routed through the SMLTP gateway — on direct deployments this endpoint returns `404` (see below).

## Authentication

```bash
Authorization: Bearer sk-your-api-key-here
```

## Request Example

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Response

### 200 OK

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

The `receipt` object is the signed payload emitted by the gateway. See [SMLTP Security](/pt/en/security/smltp) for how receipts fit into the transparency and audit model.

### 404 Not Found

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 Bad Request

Returned when the bundle id is missing or longer than 128 characters.

## Notes

- Receipts are held in the gateway's in-memory store for a limited time. For long-term proof, rely on the **hash-chained audit log** — the authoritative, immutable record. See [Immutable Logs](/pt/en/security/immutable-logs).
- Not every deployment routes through the gateway; treat a `404` as "no gateway receipt for this call," not an error in your integration.

## Related

- [SMLTP Security](/pt/en/security/smltp)
- [Immutable Logs](/pt/en/security/immutable-logs)
- [Chat Completion](/pt/en/api/chat/completions)
