---
sidebar_position: 3
title: "Netzwerkquellen"
sidebar_label: "Netzwerkquellen"
description: "Shadow-AI-Erkennung – welche Unternehmens-Quell-IPs und Benutzer LLM-APIs aufrufen, aus Ihren CASB/SWG-Protokollen"
---
# Netzwerkquellen

**Netzwerkquellen** (Admin → Agent Registry → **Netzwerk**) zeigt die in Ihren CASB/SWG-Protokollen gefundene Schatten-KI an: Welche Unternehmens-Quell-IPs und Benutzer rufen LLM-APIs auf, auch wenn kein SDK oder kein [Endpunkt-Agent] (/de/en/agent/overview) bereitgestellt ist. Es wird von den [CASB- und Netzwerkanschlüssen] (/de/en/integrations/casb/overview) gespeist – Cisco Umbrella, Zscaler und anderen.

## Das Entdeckungsfenster

Die Aktivität wird über ein rollierendes Fenster gemeldet – **standardmäßig 30 Tage** (konfigurierbar über `NETWORK_DISCOVERY_WINDOW_DAYS`). Einige Unteransichten (Top-Domains, Top-Benutzer, unbekannte Domains) verwenden ein festes 7-Tage-Fenster. Bei der ersten Verbindung führt ein Konnektor einen Hintergrund-Backfill aus, sodass der Verlauf sofort verfügbar ist.

## Was jede Quelle zeigt

| Feld | Beschreibung |
|-------|-------------|
| **Quell-IP** | Das Unternehmensgerät/die Arbeitslast, das KI-Anrufe durchführt. |
| **Benutzer/Gateway** | Die primäre Benutzer- oder Gateway-Identität, wenn der Connector sie bereitstellt. |
| **Anrufe insgesamt** | Anruflautstärke innerhalb des Fensters. |
| **Top-Domain/Anbieter** | Das am häufigsten verwendete KI-Ziel und der Anbietersatz. |
| **Schweregrad** | `critical` / `high` / `medium` / `low`. |
| **Bedrohungsdomänen** | Ein Abzeichen, wenn eine Quelle riskante Ziele erreicht. |
| **Registriert** | Ob die Quelle selektiert/registriert wurde. |

Beim Drillen in eine Quelle wird eine Tabelle pro Beobachtung angezeigt (Domäne, Anbieter, Connector, Anrufe, Benutzer, zuletzt gesehen).

## Triage-Workflow

- **Registrieren** Sie eine Ihnen bekannte Quelle (sie wird Teil Ihres bekannten Inventars) oder **erhöhen** Sie sie zur Nachverfolgung.
- Erwartete Quellen/Rauschen **ignorieren/nicht ignorieren**.
- Überprüfen Sie die Warteschlange **unbekannte Domänen**, um AI-Ziele zu klassifizieren, die der Katalog nicht erkannt hat.
- Entdecken Sie **Analysen** und die **Topologie**-Ansicht für organisationsweite Muster.
- Export nach CSV.

## Synchronisierung

Führen Sie **Sync** pro Connector oder **Sync All** aus; Connectors werden auch nach einem Zeitplan synchronisiert (standardmäßig alle 30 Minuten). Der Backfill-Fortschritt und die Veraltung des Connectors werden inline angezeigt. Das Connector-Setup befindet sich unter **Admin → Integrationen → Netzwerk**.

## Verwandte

- [CASB & Netzwerk (SWG) Integrationen](/de/en/integrations/casb/overview) – verbinden Sie die Protokollquellen.
- [Endpoint Agent](/de/en/agent/overview) — für Endpunkte, die Sie direkt verwalten können.
- [AI Discovery & Inventory Overview](/de/en/discovery/overview)