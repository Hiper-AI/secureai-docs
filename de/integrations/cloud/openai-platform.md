---
sidebar_position: 2
title: "OpenAI-Plattform"
sidebar_label: "OpenAI-Plattform"
description: "Verbinden Sie die OpenAI-Plattform, damit SecureAI Projekte, Modelle, Schlüssel, Nutzung und Kosten inventarisieren kann"
---
# OpenAI-Plattform

Verbinden Sie Ihre OpenAI-Organisation, damit SecureAI Projekte, Modelle, Mitglieder, API-Schlüssel, Dienstkonten, Ausgaben und Prüfaktivitäten inventarisieren und durchgesickerte oder überprivilegierte Schlüssel zur Behebung aufdecken kann.

## Was SecureAI importiert

- **Projekte, Modelle, Mitglieder, Rollen und Gruppen**
- **NHIs** – API-Schlüssel und Dienstkonten (widerruflich – siehe [NHI Inventory](/de/en/discovery/nhi-inventory))
- **Ausgabewarnungen, Ratenlimits, Zertifikate und Einstellungen zur Datenaufbewahrung**
- **Überwachungsprotokolle**
- **Nutzung und Kosten** für die letzten 30 Tage, einschließlich der Ausgaben pro Benutzer

## Voraussetzungen

- Ein **Organisationseigentümer** (oder Administrator) auf der OpenAI-Plattform.
– Ein **Admin-API-Schlüssel** (`sk-admin-…`). Zum Lesen organisationsweiter Projekte, Mitglieder und Nutzung sind Administratorschlüssel erforderlich.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `adminApiKey` | Ja | **Administratorschlüssel** der Organisation, Format `sk-admin-…`. Im Ruhezustand verschlüsselt. |
| `projectApiKey` | Nein | Ein oder mehrere Projektschlüssel (einer pro Zeile), nur für die Bestandsaufnahme älterer Assistenten erforderlich. |
| `organizationId` | Nein | Ihre `org-…`-ID; macht eindeutig, wenn ein Schlüssel mehrere Organisationen umfasst. |

### Wo bekomme ich den Admin-Schlüssel?

1. Melden Sie sich bei der [OpenAI-Plattform](https://platform.openai.com/) als Organisationseigentümer an.
2. Gehen Sie zu **Einstellungen → Organisation → Admin-Schlüssel**.
3. Erstellen Sie einen neuen Admin-Schlüssel und kopieren Sie ihn (wird einmal angezeigt).

## Verbinden

1. **Admin → Integrationen → Cloud → OpenAI-Plattform → Verbinden.**
2. Fügen Sie den Admin-API-Schlüssel (und optionale Felder) ein.
3. **Testen**, dann **Speichern**.
4. **Synchronisieren**.

## Überprüfen

Öffnen Sie nach der ersten Synchronisierung [Cloud Sensors](/de/en/discovery/cloud-sensors), um erkannte Modelle/Assistenten anzuzeigen, und [NHI Inventory](/de/en/discovery/nhi-inventory), um Schlüssel und Dienstkonten anzuzeigen. **Insights** pro Anbieter zeigen Nutzung, Kosten und Ausgaben pro Benutzer.

## Widerruf

OpenAI-API-Schlüssel sind von [NHI Inventory](/de/en/discovery/nhi-inventory) **widerrufbar**: SecureAI kann einen Schlüssel an der Quelle deaktivieren. (Für Dienstkonten sind OpenAI-Identitäten nur zur Überwachung bestimmt.)

## Verwandte

- [Übersicht Cloud-KI-Anbieter](/de/en/integrations/cloud/overview)
- [NHI Inventory](/de/en/discovery/nhi-inventory)