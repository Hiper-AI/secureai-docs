---
sidebar_position: 2
title: "Installing the Agent"
sidebar_label: "Installation"
description: "Install the SecureAI OS Agent on Windows endpoints"
---



# Installing the Agent

The SecureAI OS Agent is installed from an **installer package** you build in **Admin → Agent Registry → OS Agents**. The package produces a ready-to-run command that carries two values: the **backend URL** and a scoped **enrollment key**. For the full package builder and enrollment mechanics, see [Enrollment & Installer Packages](/en/agent/enrollment-and-packages).

## Windows (MSI)

Windows uses a **code-signed MSI**. The MSI is never modified when it's downloaded, so its Authenticode signature stays valid — configuration is passed at install time on the `msiexec` command line instead of being baked into the file.

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

| Property | Description |
|----------|-------------|
| `BACKEND_URL` | Your SecureAI backend origin (the endpoint calls home here). |
| `ENROLL_KEY` | The scoped `agent:enroll` key from the installer package. |

The installer panel shows the exact command with your values pre-filled — copy it directly.

<Tip>
**Deploy at scale**

Push the same `msiexec` command through your existing MDM/RMM (Intune, GPO, SCCM, etc.). Because the URL and key are command-line properties, one signed MSI works for every tenant and group.
</Tip>

## macOS (coming soon)

For now the agent installs on Windows only. The macOS version is in development and has no installer yet, so the package builder offers Windows only.

## What happens on first run

On first launch the agent **enrolls**: it presents the enrollment key, registers the device, and receives a per-device token and its runtime configuration. It then begins heartbeating and applying its resolved [policy](/en/agent/policies-and-groups). See [Enrollment & Installer Packages](/en/agent/enrollment-and-packages) for the details, including how the backend URL is resolved and how device tokens rotate.

## Related

- [Enrollment & Installer Packages](/en/agent/enrollment-and-packages)
- [Policies & Groups](/en/agent/policies-and-groups)
- [Endpoint Agent Overview](/en/agent/overview)
