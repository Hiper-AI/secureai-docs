---
sidebar_position: 1
title: "Übersicht über CASB und Netzwerk (SWG)."
sidebar_label: "Überblick"
description: "Entdecken Sie Schatten-KI aus Ihren CASB-/SWG-/DNS-Protokollen – welche Unternehmensquellen LLM-APIs aufrufen, ohne dass ein Agent erforderlich ist"
---
# CASB- und Netzwerk (SWG)-Integrationen

Diese Konnektoren lösen das Problem der **Schatten-KI-Erkennung**: Sie finden jedes Unternehmensgerät, jeden Server oder jede Arbeitslast, die eine LLM-API aufruft – auch solche, bei denen Sie kein SDK oder den [Endpunktagenten](/de/agent/overview) (einen Build-Server, einen Lagersortierer, den Laptop eines Auftragnehmers) installieren können. SecureAI liest die Protokolle, die Ihre **CASB-/Secure Web Gateway (SWG)-/DNS-Plattform** bereits sammelt, und erkennt Datenverkehr zu KI-Anbietern.

Das Ergebnis ist eine Live-Inventur darüber, **welche Quell-IPs und Benutzer welche KI-Anbieter anrufen**, aufgetaucht in [Netzwerkquellen](/de/discovery/network-sources).

## Unterstützte Anschlüsse

| Stecker | Datenquelle | Status |
|-----------|-------------|--------|
| [Cisco Umbrella](/de/integrations/casb/cisco-umbrella) | DNS-Layer-Reporting-API v2 | Verfügbar |

## Die Setup-Schleife

1. **Admin → Integrationen → Netzwerk** (Kategorie CASB / SWG).
2. **Verbinden** Sie den Connector und geben Sie seine Anmeldeinformationen ein (siehe die Seite jedes Connectors). URL-Felder sind SSRF-geschützt und Geheimnisse werden im Ruhezustand verschlüsselt.
3. **Testen** Sie die Verbindung.
4. **Synchronisierung** – die erste Synchronisierung startet einen Hintergrund-**Backfill** (Standard-Lookback entspricht dem Erkennungsfenster); Nachfolgende Synchronisierungen werden nach einem Zeitplan ausgeführt (standardmäßig alle 30 Minuten).

## Das Entdeckungsfenster

Die Netzwerkerkennung meldet Aktivitäten über ein fortlaufendes Fenster – **standardmäßig 30 Tage** (konfigurierbar über die Umgebungsvariable `NETWORK_DISCOVERY_WINDOW_DAYS`). Einige Unteransichten (Top-Domains, Top-Benutzer, unbekannte Domains) verwenden ein festes 7-Tage-Fenster. Wie das Inventar präsentiert und selektiert wird, erfahren Sie unter [Netzwerkquellen](/de/discovery/network-sources).

## Was erkannt wird

Jeder Connector gleicht den Datenverkehr mit einem kuratierten Katalog bekannter LLM/KI-Domänen und, sofern die Plattform dies unterstützt, mit seiner nativen Inhaltskategorie „Generative KI“ ab. Erkannte Aktivitäten werden nach **Quell-IP** gruppiert und mit dem anrufenden Benutzer, den KI-Anbietern, dem Anrufvolumen, der Top-Domäne, einer **Schweregradbewertung** und einer **Bedrohungsdomänenkennzeichnung** für riskante Ziele angezeigt.

## Verwandte

- [Netzwerkquellen](/de/discovery/network-sources) – der entdeckte Inventarisierungs- und Triage-Workflow.
- [Endpoint Agent](/de/agent/overview) – für Endpunkte, an denen Sie einen Agenten bereitstellen *können*.
- [AI Discovery & Inventory Overview](/de/discovery/overview)