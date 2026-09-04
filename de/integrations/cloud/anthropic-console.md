---
sidebar_position: 3
title: "Anthropische Konsole"
sidebar_label: "Anthropische Konsole"
description: "Verbinden Sie die Anthropic Console, damit SecureAI Arbeitsbereiche, Schlüssel, Nutzung, Kosten und Prüfaktivitäten inventarisieren kann"
---
# Anthropische Konsole

Verbinden Sie Ihre Anthropic-Organisation, damit SecureAI Arbeitsbereiche, API-Schlüssel, Dienstkonten, Ausgabenlimits und (auf Enterprise) das Audit-Protokoll und die Claude-Code-Analysen inventarisieren kann.

## Was SecureAI importiert

- **Arbeitsbereiche**, Nutzung und Kosten
- **NHIs** – API-Schlüssel, Dienstkonten und BYOK-Schlüssel (widerruflich – siehe [NHI Inventory](/de/discovery/nhi-inventory))
- **Ausgabenlimits**
- **Audit-Protokoll** (Enterprise/Compliance-API)
- **Claude Code-Analyse**

## Voraussetzungen

- **Admin** auf der Anthropic Console.
– Ein **Admin-API-Schlüssel** (`sk-ant-admin…`).
- *(Optional)* ein **Workspace-Schlüssel** zum Entsperren der Agent-Plattform-Daten und ein **Compliance-API-Schlüssel** (Enterprise) zum Entsperren des Audit-Protokolls.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `adminApiKey` | Ja | Organisationsadministratorschlüssel, Format `sk-ant-admin…`. Im Ruhezustand verschlüsselt. |
| `apiKey` | Nein | Arbeitsbereichsschlüssel – schaltet den Bestand der Agentenplattform frei. |
| `complianceApiKey` | Nein | Enterprise Compliance API-Schlüssel – entsperrt das Audit-Protokoll. |

### Wo bekomme ich den Admin-Schlüssel?

1. Melden Sie sich als Administrator bei der [Anthropic Console](https://console.anthropic.com/) an.
2. Gehen Sie zu **Einstellungen → Admin-Schlüssel** (Organisationsebene).
3. Erstellen Sie einen Admin-Schlüssel und kopieren Sie ihn.

## Verbinden

1. **Admin → Integrationen → Cloud → Anthropic Console → Verbinden.**
2. Fügen Sie den Admin-Schlüssel (und alle optionalen Schlüssel) ein.
3. **Testen**, dann **Speichern**.
4. **Synchronisieren**.

## Überprüfen

Öffnen Sie [Cloud Sensors](/de/discovery/cloud-sensors) für erkannte Arbeitsbereiche/Agenten und [NHI Inventory](/de/discovery/nhi-inventory) für Schlüssel und Dienstkonten. Einblicke zeigen Nutzung, Kosten und Ausgabengrenzen.

## Widerruf

Anthropic API-Schlüssel, Dienstkonten und BYOK-Schlüssel können von [NHI Inventory](/de/discovery/nhi-inventory) **widerruflich** werden.

## Verwandte

- [Übersicht Cloud-KI-Anbieter](/de/integrations/cloud/overview)
- [NHI Inventory](/de/discovery/nhi-inventory)