---
sidebar_position: 3
title: "Enrollment & Installer Packages"
sidebar_label: "Enrollment & Packages"
description: "How SecureAI OS Agent installer packages, enrollment keys, and device tokens work"
---


# Enrollment & Installer Packages

An **installer package** is the unit you build to deploy the agent. It bundles the platform, the tags and group a device should join, and a dedicated enrollment key — so the install command is self-contained.

## Creating a package

In **Admin → Agent Registry → OS Agents**, create a package with:

| Field | Description |
|-------|-------------|
| **Name / description** | Identify the package (e.g. "Engineering laptops"). |
| **Platform** | Windows / Linux / macOS. |
| **Package type** | `standalone`. |
| **Endpoint tags** | Labels applied to devices enrolled with this package. |
| **Enrollment group** | The [group](/zh/agent/policies-and-groups) a device is pinned to on first enroll. |

On save, SecureAI **auto-generates a dedicated API key scoped to `agent:enroll`** and stores it as the package's enrollment key, so the install command needs no separate credential. Deleting the package deactivates that key.

## Enrollment groups (auto-pin)

The package's **enrollment group** is a hard pin: a device that enrolls with the package is bound to that group on first contact. Group membership then drives which [policy](/zh/agent/policies-and-groups) the device resolves.

## The enrollment handshake

When the agent first runs it calls `POST /enroll` using the enrollment key and sends its machine id, hostname, OS, architecture, version, fingerprint, and capabilities. The backend:

1. Registers (or matches) the device.
2. Issues a **per-device token**, shown once, that authenticates all subsequent calls.
3. Returns the runtime **configuration** (resolved policy, egress settings, routing, etc.).

The per-device token **rotates on every enroll**. A device that has been **revoked** cannot re-enroll — the enroll response reports `revoked: true`, and the device stays cut off until an admin re-enables it.

## Backend URL resolution

The agent calls home to `BACKEND_URL`. On the server side the effective URL is resolved from forwarded/request-origin headers and can be overridden with the `SECUREAI_AGENT_URL` environment variable, which is useful behind reverse proxies.

## Managing enrolled devices

From the OS Agents tab you can, per device: send a command, **revoke** / **re-enable**, delete, assign a group, and link/unlink an owner user. Bulk operations are supported. Command delivery is over a WebSocket channel with a heartbeat-queue fallback (commands queued while a device is offline are delivered on its next heartbeat, with a 1-hour TTL).

## Related

- [Installing the Agent](/zh/agent/installation)
- [Policies & Groups](/zh/agent/policies-and-groups)
- [Self-update & anti-tamper](/zh/agent/quarantine-and-fleet-ops#self-update--anti-tamper)
