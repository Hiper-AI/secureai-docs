---
sidebar_position: 2
title: "Installieren des Agenten"
sidebar_label: "Installation"
description: "Installieren Sie den SecureAI OS Agent auf Windows-, Linux- und macOS-Endpunkten"
---
# Installation des Agenten

Der SecureAI OS Agent wird aus einem **Installationspaket** installiert, das Sie unter **Admin → Agent Registry → OS Agents** erstellen. Das Paket erzeugt einen betriebsbereiten Befehl (Windows) oder ein Skript (Linux/macOS), das zwei Werte enthält: die **Backend-URL** und einen gültigen **Registrierungsschlüssel**. Den vollständigen Paket-Builder und die Registrierungsmechanismen finden Sie unter [Registrierungs- und Installationspakete](/de/agent/enrollment-and-packages).

## Windows (MSI)

Windows verwendet ein **codesigniertes MSI**. Das MSI wird beim Herunterladen nie geändert, sodass seine Authenticode-Signatur gültig bleibt – die Konfiguration wird zum Zeitpunkt der Installation in der `msiexec`-Befehlszeile übergeben, anstatt in die Datei integriert zu werden.

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

| Eigentum | Beschreibung |
|----------|-------------|
| `BACKEND_URL` | Ihr SecureAI-Backend-Ursprung (der Endpunkt ist hier zu Hause). |
| `ENROLL_KEY` | Der gültige `agent:enroll`-Schlüssel aus dem Installationspaket. |

Das Installationsfenster zeigt den genauen Befehl mit vorab ausgefüllten Werten an – kopieren Sie ihn direkt.

<Tip>
**In großem Maßstab bereitstellen**

Senden Sie denselben `msiexec`-Befehl über Ihr vorhandenes MDM/RMM (Intune, GPO, SCCM usw.). Da es sich bei der URL und dem Schlüssel um Befehlszeileneigenschaften handelt, funktioniert eine signierte MSI für jeden Mandanten und jede Gruppe.
</Tip>

## Linux / macOS (Skript)

Laden Sie das eigenständige Shell-Skript aus dem Installationspaket herunter und führen Sie es aus. Das Skript ruft das entsprechende `.deb`/`.pkg` ab und schreibt die Agentenkonfiguration (z. B. `/etc/secureai-agent.toml` unter Linux, eine LaunchAgent-Plist unter macOS).

```bash
sudo ./secureai-agent-install.sh
```

Die Backend-URL und der Registrierungsschlüssel sind bereits in das für Ihr Paket generierte Skript eingebettet.

## Was passiert beim ersten Durchlauf?

Beim ersten Start führt der Agent eine **Registrierung** durch: Er präsentiert den Registrierungsschlüssel, registriert das Gerät und empfängt ein gerätespezifisches Token und seine Laufzeitkonfiguration. Anschließend beginnt es mit dem Heartbeating und der Anwendung seiner gelösten [Richtlinie](/de/agent/policies-and-groups). Weitere Informationen finden Sie unter [Registrierungs- und Installationspakete] (/en/agent/enrollment-and-packages), einschließlich der Auflösung der Backend-URL und der Rotation der Geräte-Tokens.

## Verwandte

- [Registrierungs- und Installationspakete](/de/agent/enrollment-and-packages)
- [Richtlinien & Gruppen](/de/agent/richtlinien-und-gruppen)
- [Endpoint Agent Übersicht](/de/agent/overview)