---
sidebar_position: 4
title: "NHI-Inventar"
sidebar_label: "NHI-Inventar"
description: "Inventarisieren und verwalten Sie die nichtmenschlichen Identitäten – API-Schlüssel und Dienstkonten – hinter Ihren KI-Agenten und Workloads"
---
# NHI-Inventar

Das **NHI-Inventar** (Admin → Agent Registry → **Non-Human Identities**) ist das Inventar der Maschinenanmeldeinformationen hinter Ihrer KI – die API-Schlüssel, Dienstkonten und BYOK-Schlüssel, die Agenten, MCP-Server und Workloads verwenden. Es fasst die von jedem [Cloud AI Provider](/de/integrations/cloud/overview)-Connector entdeckten Identitäten zusammen, bewertet deren Risiko und gibt Ihnen die Möglichkeit, sie zu blockieren oder zu widerrufen.

## Was jede Identität zeigt

- **Anbieter** (SecureAI / OpenAI / Anthropic / Azure / GCP / AWS) und **Typ** (Agent / mcp / Workload).
- **Risikobewertung** (0–100) mit beitragenden Faktoren (siehe unten).
- **SMLTP-Urteil**-Chip (blockiert / erzwungen / überwacht) und Empfangsanzahl.
- **Genutzt von**, **zuletzt verwendet** (Leerlaufzeiten), **Rotation** und ein **Ablauf-Countdown**.
- **Status**: fehlerfrei / Behebung / kritisch.

## Kontrollebenen

Wie viel Sie mit einer Identität *tun* können, hängt davon ab, wie sie entdeckt wurde:

| Ebene | Was es bedeutet | Aktion verfügbar |
|-------|--------------|----|
| **Verwaltet** | Eine von SecureAI ausgestellte (nicht cloudbasierte) Identität. | **Blockieren/Entsperren** am Gateway – lehnt jede von dieser Identität authentifizierte Anfrage ab oder stellt sie wieder her und verschiebt die Gateway-Sperrliste. |
| **Widerruflich** | Von der Cloud erkannt **und** an der Quelle durchsetzbar. | **Revoke** – das Vorhängeschloss („candadito“): löscht/deaktiviert den Schlüssel **beim Anbieter**. Irreversibel; Markiert die Identität als blockiert/kritisch. |
| **Nur Monitor** | Von der Cloud erkannt, aber nicht durchsetzbar. | Schreibgeschützt. Die Ruhephase allein führt nie zu einer kritischen Eskalation (sie fügt einen kleinen Risikofaktor hinzu, der nur auf den Monitor beschränkt ist). |

### Welche Clouds sind widerrufbar?

| Identitätstyp | Widerruflich an der Quelle | Nur Monitor |
|---------------|------|--------------|
| **API-Schlüssel** | OpenAI, Anthropic, GCP, Azure, AWS | — |
| **Dienstkonten/BYOK-Schlüssel** | Anthropisch, GCP, Azure | OpenAI, AWS |

## Aktionen

| Aktion | Wirkung |
|--------|--------|
| **Sperren / Entsperren** | Ablehnungs-/Wiederherstellungsanforderungen, die durch den SecureAI-Schlüssel (Gateway-Sperrliste) einer verwalteten Identität authentifiziert wurden. |
| **Widerrufen** | Erstellen Sie eine widerrufliche Identität beim Anbieter. Erfordert, dass die Identität mit einer externen ID durchsetzbar ist; Andernfalls wird „an der Quelle nicht widerrufbar“ zurückgegeben. |
| **Gedreht markieren** | Notieren Sie, dass ein Schlüssel gedreht wurde. |
| **Signaturschlüssel registrieren/rotieren** | Verwalten Sie SET-Signaturschlüssel für die Identität. |

## Risikobewertung

Der Governance-Sweeper berechnet eine zusammengesetzte Bewertung von 0–100 aus folgenden Faktoren: ruhend/ruhend-kritisch, Rotation überfällig/Rotation-kritisch, abgelaufen/bald ablaufend, breite Bereiche, kein Eigentümer, reaktiviert und nur überwacht. Die Reaktivierung einer zuvor ruhenden Identität löst eine Warnung aus.

## Verwandte

- [Cloud AI Providers](/de/integrations/cloud/overview) – die Quelle der entdeckten Identitäten.
- [Cloud-Sensoren](/de/discovery/cloud-sensors)
- [AI Discovery & Inventory Overview](/de/discovery/overview)