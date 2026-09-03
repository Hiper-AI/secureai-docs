---
sidebar_position: 1
title: "Übersicht über Cloud-KI-Anbieter"
sidebar_label: "Überblick"
description: "Verbinden Sie Ihre OpenAI-, Anthropic-, Azure-, AWS- und GCP-KI-Plattformen, damit SecureAI Agenten, Modelle, Identitäten, Nutzung und Kosten inventarisieren kann"
---
# Cloud-KI-Anbieter

Mit Cloud AI Provider-Konnektoren kann SecureAI auf die KI-Plattformen zugreifen, die Ihr Unternehmen bereits nutzt – **OpenAI Platform, Anthropic Console, Azure AI Foundry und Google Vertex AI** – und alles, was dort läuft, automatisch inventarisieren. Auf der Anbieterseite muss kein Agent oder SDK bereitgestellt werden. SecureAI fragt die Verwaltungs-API jedes Anbieters mit den von Ihnen bereitgestellten, größtenteils lesbaren Anmeldeinformationen ab.

Sobald die Verbindung hergestellt ist, erkennt ein Connector Folgendes und synchronisiert es kontinuierlich:

- **Agenten, Modelle und Bereitstellungen**, die auf der Plattform ausgeführt werden → angezeigt in [Cloud Sensors](/de/en/discovery/cloud-sensors).
- **Nicht-menschliche Identitäten (NHIs)** – API-Schlüssel, Dienstkonten und (sofern unterstützt) BYOK-Schlüssel → angezeigt in [NHI Inventory](/de/en/discovery/nhi-inventory), mit Blockierungs-/Widerrufskontrollen.
- **Nutzung, Token und Kosten** für die letzten 30 Tage.
- **Governance-Signale** – IAM/RBAC-Bindungen, Ausgabenlimits und Prüfprotokolle, angezeigt in Insights pro Anbieter.

## Die Setup-Schleife

Jeder Anbieter folgt den gleichen vier Schritten:

1. **Öffnen Sie Admin → Integrationen** und wählen Sie die Kategorie **Cloud** aus.
2. **Verbinden** Sie die Anbieterkarte und geben Sie ihre Zugangsdaten ein (siehe Seite des jeweiligen Anbieters).
3. **Testen** Sie die Verbindung, um die Anmeldeinformationen zu validieren.
4. **Sync** – die erste Synchronisierung führt einen vollständigen Import durch; Nachfolgende Synchronisierungen erfolgen inkrementell und werden ebenfalls nach einem Zeitplan ausgeführt.

<Info>
**Wo Dinge erscheinen**

Connector **Setup** befindet sich in **Admin → Integrationen**. Das von ihm erzeugte **Inventar** erscheint in **Admin → Agent Registry**: entdeckte Agenten/Modelle unter [Cloud Sensors](/de/en/discovery/cloud-sensors) und entdeckte Identitäten unter [NHI Inventory](/de/en/discovery/nhi-inventory). Sie können eine Synchronisierung von jedem Ort aus erneut ausführen.
</Info>

## Anmeldeinformationen auswählen

Verwenden Sie nach Möglichkeit **schreibgeschützte/Viewer**-Anmeldeinformationen – SecureAI muss nur Ihr Inventar *lesen*, um ein Bild zu erstellen. Für einige optionale Funktionen (Widerrufen eines durchgesickerten Schlüssels, Erstellen einer Ausgabenwarnung) sind zusätzliche Schreibberechtigungen erforderlich. Jede Anbieterseite ruft diese explizit auf und sie sind immer optional.

Alle von Ihnen eingegebenen Geheimnisse (Client-Geheimnisse, Dienstkonto-JSON, Admin-API-Schlüssel) werden **im Ruhezustand verschlüsselt**.

## Anbieterhandbücher

| Anbieter | Anmeldeinformationstyp |
|----------|---|
| [OpenAI-Plattform](/de/en/integrations/cloud/openai-platform) | Organisationsadministrator-API-Schlüssel |
| [Anthropic Console](/de/en/integrations/cloud/anthropic-console) | Admin-API-Schlüssel (+ optionale Arbeitsbereichs-/Compliance-Schlüssel) |
| [Azure AI Foundry](/de/en/integrations/cloud/azure-ai-foundry) | Entra-Dienstprinzipal (Mandant/Client/Geheimnis) |
| [Google Vertex AI](/de/en/integrations/cloud/gcp-vertex-ai) | Dienstkonto JSON |

## Verwandte

- [Cloud Sensors](/de/en/discovery/cloud-sensors) – das erkannte Agenten-/Modellinventar.
- [NHI Inventory](/de/en/discovery/nhi-inventory) – das entdeckte Identitätsinventar und Widerrufskontrollen.
- [AI Discovery & Inventory Overview](/de/en/discovery/overview)