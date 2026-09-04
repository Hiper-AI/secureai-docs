---
sidebar_position: 5
title: "Durchsetzung des Ausgangs"
sidebar_label: "Durchsetzung des Ausgangs"
description: "Kontrollieren oder blockieren Sie ausgehenden KI-Verkehr von Endpunkten mit dem SecureAI OS Agent"
---
# Durchsetzung des ausgehenden Datenverkehrs

Die Durchsetzung des ausgehenden Datenverkehrs steuert, was ein Endpunkt an KI-Anbieter und MCP-Server **aussenden** darf. Es wird per [Richtlinie](/de/agent/policies-and-groups) konfiguriert und lokal vom Agenten durchgesetzt.

## Modi

| Modus | Verhalten |
|------|----------|
| **aus** | Keine Ausgangsdurchsetzung – nur Erkennung/Überwachung. |
| **töten** | Beenden Sie den fehlerhaften Prozess, wenn er einen unzulässigen KI-Aufruf durchführt (alte Standardeinstellung). |
| **blockieren** | Dauerhafte Netzwerkblockierung der Verbindung (Windows-Filterplattform), sodass der Prozess weiter ausgeführt wird. |
| **Sperrung** | Standardverweigerung: Alles wird blockiert, mit Ausnahme von Zielen auf einer expliziten **Zulassungsliste**. |

## Zusätzliche Steuerelemente

| Kontrolle | Beschreibung |
|---------|-------------|
| **Zulassungsliste** | In `lockdown` der Satz von Zielen, die weiterhin zulässig sind. |
| **Remote-MCP blockieren** | Blockiert, dass der Endpunkt entfernte MCP-Server erreicht. |

Die aufgelöste Konfiguration wird als `egressEnforcement: { mode, allowList, blockRemoteMcp }` an jedes Gerät übermittelt und bei jedem Heartbeat neu bewertet.

## Einen Modus auswählen

- Beginnen Sie im **Aus**-Modus (oder einer Richtlinie im **Monitor**-Modus), um ein genaues Bild davon zu erstellen, was der Endpunkt tatsächlich aufruft – sichtbar in der Geräteschublade und in [AI Discovery](/de/discovery/overview).
- Wechseln Sie zu **Blockieren**, um unzulässigen KI-Austritt dauerhaft zu stoppen, ohne den Rest der Netzwerkvernetzung des Prozesses zu stören.
- Verwenden Sie **kill**, wenn Sie möchten, dass das fehlerhafte Programm sofort gestoppt wird.
- Verwenden Sie **Sperrung** für die strengste Haltung – nur Ihre sanktionierten KI-Endpunkte (die Zulassungsliste) sind erreichbar.

Egress-Modi sind auch in den [Schutzvoreinstellungen](/de/agent/policies-and-groups#protection-presets) (Passiv / Normal / Aggressiv) gebündelt, sodass Sie mit einem Klick eine Ebene für die gesamte Haltung festlegen und von dort aus eine Feinabstimmung vornehmen können.

<Warning>
`kill`, `block` und `lockdown` unterbrechen aktiv den Endpunktverkehr. Validieren Sie eine Änderung mit **Trockensimulation** und gestaffelten **Rollout-Ringen** ([Richtlinien & Gruppen](/de/agent/policies-and-groups#safe-rollouts)), bevor Sie sie flottenweit anwenden.
</Warning>

## Verwandte

- [Richtlinien & Gruppen](/de/agent/richtlinien-und-gruppen)
- [Transparent Proxy](/de/agent/transparent-proxy) – leitet zugelassenen KI-Verkehr über das Gateway, anstatt ihn zu blockieren.
- [Quarantäne & Flotten-Ops](/de/agent/quarantäne-und-flotten-ops)