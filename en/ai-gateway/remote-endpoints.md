---
sidebar_position: 6
title: "Remote Endpoints"
---



# Remote Endpoints

Remote Endpoints let you connect external or self-hosted model servers to SecureAI through AI Gateway controls.

This is useful when your organization runs its own model infrastructure and still wants centralized security governance.

## Where To Configure

Go to **Admin → AI Gateway → Remote Endpoints**.

## Registration Options

- **Quick Install**: guided wizard that generates a one-command setup flow.
- **Manual Registration**:
  - **Paste JSON**
  - **Manual Entry** fields

## Connectivity Modes

- **Reverse Connect**: recommended for most deployments; outbound connection, no open inbound ports.
- **Cloudflare Tunnel**: zero-trust connectivity using tunnel token and hostname.

## Daily Operations

For each endpoint, admins can:

- run **Health Check**
- run **Verify mTLS**
- inspect endpoint details (region, fingerprint, models, last check)
- remove endpoint when decommissioned

## Suggested Onboarding Flow

1. Start with **Quick Install**.
2. Choose connectivity mode.
3. Select required models.
4. Complete registration.
5. Run Health Check and Verify mTLS.
6. Confirm endpoint remains healthy after 5 to 10 minutes.

## Troubleshooting Checklist

- Endpoint unreachable: verify connectivity mode and hostname values.
- TLS passed but unhealthy: check remote gateway/model service status.
- Not connected: confirm remote service is running and registration is valid.

## Best Practices

- Prefer Reverse Connect unless your architecture requires tunnel mode.
- Keep endpoint ownership clear by organization/team.
- Re-check endpoint health after policy or key changes.
