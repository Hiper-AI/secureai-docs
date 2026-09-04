---
sidebar_position: 2
title: "Cisco-Regenschirm"
sidebar_label: "Cisco-Regenschirm"
description: "Erkennen Sie Schatten-KI anhand der DNS-Aktivität von Cisco Umbrella über die Reporting API v2"
---
# Cisco-Regenschirm

Verbinden Sie Cisco Umbrella, damit SecureAI mithilfe der **Reporting API v2** von Umbrella erkennen kann, welche Unternehmensquellen LLM/AI-Domänen auflösen. Umbrella ist eine Quelle auf DNS-Ebene: Sie bestätigt, dass ein Gerät eine KI-Domäne *aufgelöst* hat (nicht die vollständige TLS-Nutzlast), was genau das ist, was die Schatten-KI-Erkennung benötigt.

SecureAI führt zwei Durchgänge für maximale Abdeckung durch:

1. Eine kuratierte Liste bekannter LLM/AI-Domänen.
2. Umbrellas **Inhaltskategorie `212` („Generative KI“)**, sodass neu beliebte KI-Dienste erfasst werden, noch bevor sie in der kuratierten Liste enthalten sind.

## Voraussetzungen

– Ein Umbrella-Paket, das die **Reporting API** und DNS-Aktivitätsprotokolle enthält.
- **Umbrella-API-Anmeldeinformationen** (API-Schlüssel + Geheimnis) und Ihre **Organisations-ID**.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `apiKey` | Ja | Umbrella Reporting-API-Schlüssel. |
| `apiSecret` | Ja | Geheimnis der Umbrella Reporting API. Im Ruhezustand verschlüsselt. |
| `orgId` | Ja | Ihre Dachorganisations-ID. |

### Wo man sie bekommt

1. Melden Sie sich beim [Umbrella-Dashboard](https://dashboard.umbrella.com/) an.
2. Gehen Sie zu **Admin → API-Schlüssel** und erstellen Sie einen Schlüssel mit **Reporting**-Bereich. Kopieren Sie den Schlüssel und das Geheimnis (einmal angezeigt).
3. Ihre **Organisations-ID** ist die numerische ID in der Dashboard-URL (`.../o/<orgId>/#/...`).

SecureAI authentifiziert sich mit `POST https://api.umbrella.com/auth/v2/token` (Basic `apiKey:apiSecret`, `client_credentials`) und liest `GET /reports/v2/activity/dns`.

## Verbinden

1. **Admin → Integrationen → Netzwerk → Cisco Umbrella → Verbinden.**
2. Geben Sie den API-Schlüssel, das Geheimnis und die Organisations-ID ein.
3. **Testen**, dann **Speichern**.
4. **Synchronisierung** – die erste Synchronisierung füllt die letzten DNS-Aktivitäten im Hintergrund auf.

## Notizen

- Umbrella ist **DNS-Schicht**: Eine Übereinstimmung bestätigt die Domänenauflösung, kein abgeschlossener API-Aufruf. Es ist ideal für die Breite (jedes Gerät hinter Umbrella), trägt aber keine Anforderungsnutzlasten.
– Wenn der Umbrella-Ausgang über einen Proxy erfolgen muss, legen Sie `UMBRELLA_PROXY_URL` (oder den Standard `HTTPS_PROXY`) im SecureAI-Backend fest.

## Überprüfen

Öffnen Sie nach der ersten Synchronisierung [Netzwerkquellen](/de/discovery/network-sources) – Quellen, die KI-Domänen aufgelöst haben, werden mit ihren Anbietern, Anrufzahlen und Schweregrad angezeigt.

## Verwandte

- [CASB & Netzwerkübersicht](/de/integrations/casb/overview)
- [Netzwerkquellen](/de/discovery/network-sources)