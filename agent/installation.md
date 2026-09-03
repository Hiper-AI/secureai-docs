---
sidebar_position: 2
title: Installing the Agent
sidebar_label: Installation
description: "Install the SecureAI OS Agent on Windows, Linux, and macOS endpoints"
---

# Installing the Agent

The SecureAI OS Agent is installed from an **installer package** you build in **Admin → Agent Registry → OS Agents**. The package produces a ready-to-run command (Windows) or script (Linux/macOS) that carries two values: the **backend URL** and a scoped **enrollment key**. For the full package builder and enrollment mechanics, see [Enrollment & Installer Packages](/agent/enrollment-and-packages).

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

## Linux / macOS (script)

Download the self-contained shell script from the installer package and run it. The script pulls the appropriate `.deb`/`.pkg` and writes the agent configuration (e.g. `/etc/secureai-agent.toml` on Linux, a LaunchAgent plist on macOS).

```bash
sudo ./secureai-agent-install.sh
```

The backend URL and enrollment key are already embedded in the script generated for your package.

## What happens on first run

On first launch the agent **enrolls**: it presents the enrollment key, registers the device, and receives a per-device token and its runtime configuration. It then begins heartbeating and applying its resolved [policy](/agent/policies-and-groups). See [Enrollment & Installer Packages](/agent/enrollment-and-packages) for the details, including how the backend URL is resolved and how device tokens rotate.

## Related

- [Enrollment & Installer Packages](/agent/enrollment-and-packages)
- [Policies & Groups](/agent/policies-and-groups)
- [Endpoint Agent Overview](/agent/overview)
