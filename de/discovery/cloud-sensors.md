---
sidebar_position: 2
title: "Wolkensensoren"
sidebar_label: "Wolkensensoren"
description: "Der schreibgeschützte Bestand an Agenten und Modellen, die in Ihren verbundenen KI-Cloud-Plattformen entdeckt wurden"
---
# Wolkensensoren

**Cloud Sensors** (Admin → Agent Registry → **Cloud**) ist das Inventar der Agenten, Modelle und Bereitstellungen, die in Ihren verbundenen Cloud-KI-Plattformen entdeckt wurden – **Azure AI Foundry, AWS Bedrock, GCP Vertex AI, OpenAI Platform und Anthropic Console**. Es ist schreibgeschützt: Sie konfigurieren die Konnektoren in [Integrationen](/de/en/integrations/cloud/overview) und Cloud Sensors zeigt, was sie gefunden haben.

## KPIs

| KPI | Bedeutung |
|-----|---------|
| **Angeschlossene Anbieter** | Wie viele Cloud-Anbieter sind konfiguriert und verbunden? |
| **Entdeckte Agenten** | Gesamtzahl der Agenten/Modelle, die derzeit bei allen Anbietern sichtbar sind. |
| **Aktive Cloud-Agenten** | In der neuesten Entdeckung sind immer noch Agenten vorhanden. |
| **Automatisch zurückgezogen** | Agenten wurden aufgrund einer kürzlichen Entdeckung entfernt (sie sind vom Anbieter verschwunden). |

Jeder KPI enthält eine 30-Tage-Sparkline, die aus dem Synchronisierungsverlauf erstellt wird.

## Die Inventartabelle

| Spalte | Beschreibung |
|--------|-------------|
| **Agent** | Erkannter Agenten-/Modellname. |
| **Anbieter** | Azure / AWS / GCP / OpenAI / Anthropic. |
| **Arbeitsbereich / Bereitstellung** | Wo es beim Anbieter liegt. |
| **Modell** | Zugrundeliegendes Modell. |
| **Status** | `observed`, `active` oder `retired` (mit dem Suffix `· auto`, wenn es durch Erkennung automatisch zurückgezogen wird). |
| **Letzte Entdeckung** | Als es das letzte Mal gesehen wurde. |

Filtern Sie nach Anbieter, Status oder Freitextsuche; Exportieren Sie die sichtbaren Zeilen in CSV.

## Synchronisierung

Führen Sie **Sync** für einen einzelnen Anbieter oder **Sync All** aus. Jeder Anbieter stellt außerdem einen **Insights**-Dialog zur Verfügung (Nutzung, Kosten, Governance-Details speziell für diesen Anbieter). Connector-Anmeldeinformationen und -Einrichtung finden Sie live unter **Admin → Integrationen → Cloud** – diese Registerkarte führt dorthin, und der leere Status verweist Sie dorthin.

## Verwandte

- [Cloud AI Providers](/de/en/integrations/cloud/overview) – Anbieter verbinden und konfigurieren.
- [NHI Inventory](/de/en/discovery/nhi-inventory) – Identitäten, die von denselben Konnektoren entdeckt werden.
- [AI Discovery & Inventory Overview](/de/en/discovery/overview)