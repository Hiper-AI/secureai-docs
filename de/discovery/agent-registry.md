---
sidebar_position: 5
title: "Agentenregister"
sidebar_label: "Agentenregister"
description: "Steuern Sie Ihre logischen KI-Agenten und Chatbots – Eigentümer, Zweck, Autonomiegrad, Risiko und Bindungen"
---
# Agentenregister

Die **Agent-Registrierung** (Admin → Agent-Registrierung → **KI-Agenten**) ist das Governance-Inventar Ihrer **logischen** KI-Agenten und Chatbots – der Anwendungen und Assistenten, die Ihr Unternehmen erstellt und ausführt. Es zeichnet die Metadaten auf, die Sie zur Verwaltung jedes einzelnen benötigen: Wem gehört es, wozu dient es, wie autonom ist es und womit ist es verbunden.

<Info>
**Nicht die Endpunktflotte**

Bei der Agentenregistrierung geht es um *logische* KI-Agenten (einen Support-Chatbot, einen internen Copiloten). Es unterscheidet sich von der **OS Agents**-Flotte – der auf Endpunkten installierten SecureAI-Software, dokumentiert unter [Endpoint Agent](/de/agent/overview).
</Info>

## Was pro Agent aufgezeichnet wird

| Feld | Beschreibung |
|-------|-------------|
| **Eigentümer** | Der verantwortliche Benutzer/das verantwortliche Team. |
| **Zweck** | Was der Agent tut. |
| **Autonomie** | Niveau **L1–L3**, von unterstützend bis vollständig autonom. |
| **Risiko** | Governance-Risikobewertung. |
| **Bindungen** | Angeschlossene MCP-Server und Datensätze/Wissensdatenbanken. |
| **Überwachung** | Für Chatbots die Überwachungs-/Prompt-Shield-Konfiguration. |

## Arbeiten mit der Registry

- **Import**-Agenten zum Bootstrapping des Inventars.
- Überprüfen Sie **Beziehungen** zwischen Agenten, ihren Tools und ihren Daten.
- **Vorgeschlagene Autonomie anwenden** – Akzeptieren Sie eine empfohlene Autonomiestufe für einen Agenten.
- Chatbots zur Überwachung registrieren; Ein Chatbot, der zum ersten Mal über die [Prompt Shield API](/de/api/threat-defense/prompt-shield) gesehen wurde, wird hier automatisch als `observed` für Ihre Überprüfung registriert.

## Verwandte

- [Endpoint Agent](/de/agent/overview) – die Agentenflotte auf Betriebssystemebene (im Gegensatz dazu).
- [NHI Inventory](/de/discovery/nhi-inventory) – die Identitäten, mit denen sich Agenten authentifizieren.
- [Prompt Shield API](/de/api/threat-defense/prompt-shield) – registriert Chatbots automatisch.
- [AI Discovery & Inventory Overview](/de/discovery/overview)