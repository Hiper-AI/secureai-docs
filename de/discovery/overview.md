---
sidebar_position: 1
title: "Übersicht über KI-Erkennung und Inventar"
sidebar_label: "Überblick"
description: "Wie SecureAI jeden KI-Agenten, jedes Modell, jede Identität und jede Schatten-KI-Quelle in Ihrem Unternehmen erkennt und inventarisiert"
---
# KI-Erkennung und -Bestandsaufnahme

SecureAI erstellt ein einziges, kontinuierlich aktualisiertes Inventar der KI in Ihrem Unternehmen – die Agenten und Modelle, die Sie ausführen, die Identitäten dahinter und die Schatten-KI, von der Sie nichts wussten. Dies geschieht über **drei komplementäre Erkennungssignale**, die alle unter **Admin → Agent Registry** angezeigt werden.

## Die drei Signale

| Signal | Sieht | Gefüttert von |
|--------|------|--------|
| **Cloud-APIs** | Agenten, Modelle, Bereitstellungen und Identitäten innerhalb Ihrer KI-Plattformen. | [Cloud AI Provider](/de/integrations/cloud/overview) Konnektoren → [Cloud Sensors](/de/discovery/cloud-sensors) |
| **Netzwerk / CASB** | Unternehmensquell-IPs rufen LLM-APIs auf, ohne dass ein Agent installiert ist. | [CASB / SWG](/de/integrations/casb/overview) Konnektoren → [Netzwerkquellen](/de/discovery/network-sources) |
| **Endpunkt-Agent** | AI/MCP-Aktivität auf verwalteten Laptops und Servern. | [OS Agent](/de/agent/overview) |

Über alle Signale hinweg entdeckte Identitäten werden im [NHI-Inventar](/de/discovery/nhi-inventory) erfasst, und die von Ihnen verwalteten logischen Agenten/Chatbots leben im [Agentenregister](/de/discovery/agent-registry).

## Die Inventar-Registerkarten

Unter **Admin → Agent Registry** finden Sie:

- **[Cloud Sensors](/de/discovery/cloud-sensors)** – von der Cloud entdeckte Agenten und Modelle.
- **[Netzwerkquellen](/de/discovery/network-sources)** – Schatten-KI-Quellen in CASB/SWG-Protokollen gefunden.
- **[NHI Inventory](/de/discovery/nhi-inventory)** – nicht-menschliche Identitäten (Schlüssel, Dienstkonten) mit Sperr-/Widerrufskontrollen.
- **[Agent Registry](/de/discovery/agent-registry)** – Governance-Metadaten für Ihre logischen KI-Agenten und Chatbots.

## Warum es wichtig ist

Sie können nicht regieren, was Sie nicht sehen können. Discovery liefert Ihnen den Nenner: jeden Modellendpunkt, jeden Schlüssel, jedes Gerät oder jede Workload, die mit KI in Berührung kommen – sodass Richtlinien, Kostenkontrolle und Reaktion auf Vorfälle für Ihren *gesamten* Bestand gelten, nicht nur für die deklarierten Teile.

## Verwandte

- [Cloud-KI-Anbieter](/de/integrations/cloud/overview)
- [CASB & Netzwerk (SWG)](/de/integrations/casb/overview)
- [Endpoint Agent](/de/agent/overview)