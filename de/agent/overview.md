---
sidebar_position: 1
title: "Übersicht über den Endpoint-Agenten"
sidebar_label: "Überblick"
description: "Der SecureAI OS Agent – ​​Endpunkt-KI-Governance, DLP und Ausgangskontrolle für Laptops und Server"
---
# Endpunkt-Agent

Der SecureAI **OS Agent** läuft auf Ihren Endpunkten – Windows-Laptops, Linux-Servern, macOS-Maschinen – und erzwingt die KI-Governance dort, wo die Arbeit tatsächlich stattfindet. Es erkennt KI/MCP-Aktivitäten auf dem Gerät, wendet Datenverlust- und Verhaltensschutzmaßnahmen an und kann den ausgehenden Datenverkehr zu KI-Anbietern gemäß den Richtlinien steuern oder blockieren.

Die Agentenflotte wird unter **Admin → Agent Registry → OS Agents** verwaltet.

## Was der Agent tut

- **Erkennt die KI-Nutzung auf dem Gerät** – installierte KI-SDKs/-Prozesse, MCP-Server und Schattennetzwerkaufrufe an KI-Anbieter.
- **Erzwingt Richtlinien** – Überwachen oder blockieren Sie KI-Anbieter/-Modelle/Apps/MCPs, wenden Sie eine verhaltensbezogene KI-Überwachung an und erzwingen Sie die Ausgangskontrolle (siehe [Egress Enforcement](/de/agent/egress-enforcement)).
- **Schützt Daten** – Endpunkt-DLP/PII-Inspektion.
- **Reagiert auf Bedrohungen** – isoliert schädliche Dateien und kann einen gefährdeten Endpunkt isolieren (siehe [Quarantäne & Flottenoperationen](/de/agent/quarantine-and-fleet-ops)).
- **Optional leitet der Entwickler-KI-Verkehr** über das Gateway von SecureAI (siehe [Transparent Proxy](/de/agent/transparent-proxy)).

## Gerätegesundheit und -haltung

Jedes registrierte Gerät meldet einen Gesundheitsstatus und eine Sicherheitslage:

| Signal | Werte |
|--------|--------|
| **Status** | `healthy`, `stale` (kein Herzschlag für ca. 5 Minuten), `enrolled`, `paused`, `revoked` |
| **Haltung** | `protected`, `at_risk`, `infected` |
| **Risikobewertung** | 0–100, berechnet aus Verstößen, Bedrohungen und Konfiguration |

Auf der Registerkarte **OS-Agents** werden alle Geräte mit Status, Status, Risiko, Betriebssystem/Version, Gruppe, aktiver Richtlinie und verknüpftem Besitzer aufgeführt. Durch Erweitern eines Geräts werden aktuelle Schattennetzwerkbeobachtungen, MCP-Inventar, AI-SDK-Prozesse, Richtlinienverstöße, blockierte Verbindungen, Quarantäneelemente, Bedrohungen und der Befehlsverlauf angezeigt.

## So fangen Sie an

1. **[Agent installieren](/de/agent/installation)** auf Endpunkten (signiertes MSI unter Windows; Skript unter Linux/macOS).
2. Verstehen Sie **[Registrierungs- und Installationspakete](/de/agent/enrollment-and-packages)** – wie Geräte beitreten und ihre Konfiguration erhalten.
3. Konfigurieren Sie **[Richtlinien & Gruppen](/de/agent/policies-and-groups)**, um zu entscheiden, was jedes Gerät durchsetzt.
4. Optimieren Sie **[Egress Enforcement](/de/agent/egress-enforcement)** und **[Quarantäne & Flottenoperationen](/de/agent/quarantine-and-fleet-ops)** für die Reaktion.

## Rollen

Mit dem allgemeinen Zugriff auf das Admin-Panel können Sie die Flotte anzeigen und konfigurieren. **Zerstörerische Aktionen** – Quarantäne, Prozess-/MCP-/Netzwerk-Kill, Isolieren und Widerrufen – erfordern die erhöhte Systemrolle **Administrator**. Siehe [Quarantäne & Flotten-Ops](/de/agent/quarantine-and-fleet-ops).

## Verwandte

- [AI Discovery & Inventory](/de/discovery/overview) – der Agent ist eines von drei Discovery-Signalen.
- [Threat Defense](/de/threat-defense/overview)