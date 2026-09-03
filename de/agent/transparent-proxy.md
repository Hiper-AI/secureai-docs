---
sidebar_position: 7
title: "Transparenter Proxy (KI-Routing)"
sidebar_label: "Transparenter Proxy"
description: "Leiten Sie den KI-Verkehr des Entwicklers (z. B. Claude Code) vom Endpunkt über das SecureAI-Gateway"
---
# Transparenter Proxy (KI-Routing)

Der Agent kann den KI-Verkehr eines Entwicklers – zum Beispiel [Claude Code](/de/en/integrations/ide-claude-code) – transparent über das SecureAI-Gateway leiten. Dadurch unterliegt die Nutzung von Codierungsassistenten der gleichen Governance, Kostenverfolgung und Richtlinie wie der Rest Ihres KI-Bestands, ohne dass der Entwickler seine Tools ändern muss.

## Wie es funktioniert

Das Routing wird per [Richtlinie](/de/en/agent/policies-and-groups) über `claudeCodeRouting` konfiguriert:

| Einstellung | Beschreibung |
|---------|-------------|
| **Aktiviert** | Aktivieren Sie das Routing für Geräte im Rahmen dieser Richtlinie. |
| **Sperren** | `user` (Entwickler kann umschalten), `force_on` (immer geroutet) oder `force_off` (nie geroutet). |
| **Modellzuordnungen** | Zuordnung pro Familie für `opus` / `sonnet` / `haiku` auf das tatsächlich bereitgestellte Modell. |
| **Modellsperre** | `user` oder `force` – ob der Entwickler die Zuordnung ändern darf. |

Wenn Routing aktiviert ist, erstellt SecureAI einen API-Schlüssel pro Gerät und fügt ihn über die Transparent-Proxy-Konfiguration in die Umgebung des Endpunkts ein (z. B. als `ANTHROPIC_AUTH_TOKEN`). Die Nutzung wird **über den Punkte-Bucket des verknüpften Entwicklers abgerechnet**. Stellen Sie daher sicher, dass das Gerät mit einem Eigentümerbenutzer verknüpft ist (siehe [Registrierung & Pakete](/de/en/agent/enrollment-and-packages)).

## Flottenweite Standardeinstellungen

Gateway-Standardeinstellungen können einmal für die Flotte festgelegt werden – `anthropicBaseUrl`, `openaiBaseUrl`, das Authentifizierungstoken und eine Sperre – und von Geräten übernommen werden. Der Agent meldet, ob der Proxy derzeit ein- oder ausgeschaltet ist, und diese Übergänge werden überwacht.

## Warum Route statt Block

Für sanktionierte Entwickler-KI ist das Routing über das Gateway in der Regel einem [Egress-Block](/de/en/agent/egress-enforcement) vorzuziehen: Der Entwickler arbeitet weiter, während Sie Richtliniendurchsetzung, Kostenzuordnung und Überwachung dieses Datenverkehrs erhalten. Sperrung/Sperrung für nicht sanktionierte Anbieter vorbehalten.

## Verwandte

- [Egress Enforcement](/de/en/agent/egress-enforcement)
- [Richtlinien & Gruppen](/de/en/agent/richtlinien-und-gruppen)
- [AI Gateway Übersicht](/de/en/ai-gateway/overview)
- [Claude Code IDE Integration](/de/en/integrations/ide-claude-code)