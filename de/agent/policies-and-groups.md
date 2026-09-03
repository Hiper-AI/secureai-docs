---
sidebar_position: 4
title: "Richtlinien und Gruppen"
sidebar_label: "Richtlinien und Gruppen"
description: "Konfigurieren Sie, was der SecureAI OS Agent mit Richtlinien, Gruppen, Schutzvoreinstellungen und sicheren Rollouts durchsetzt"
---
# Richtlinien und Gruppen

Eine **Richtlinie** definiert, was der Agent durchsetzt; Eine **Gruppe** weist einer Gruppe von Geräten eine Richtlinie zu. Jedes Gerät löst seine gültige Richtlinie bei jedem Heartbeat auf, sodass sich Änderungen schnell verbreiten.

## Richtlinien

Eine Richtlinie (`AgentPolicy`) enthält:

| Einstellung | Beschreibung |
|---------|-------------|
| **Modus** | `monitor` (nur beobachten) oder `block` (erzwingen). |
| **Regelsätze** | Zulassungs-/Verweigerungslisten für `mcps`, `apps`, `providers` und `models`. |
| **Bedrohungsfeed** | Ob das Gerät den Bedrohungsfeed der Organisation nutzt. |
| **Durchsetzung des ausgehenden Datenverkehrs** | `off` / `kill` / `block` / `lockdown` (+ Zulassungsliste, Block-Remote-MCP). Siehe [Egress Enforcement](/de/en/agent/egress-enforcement). |
| **Verhaltensschutz** | Verhaltensbasierte KI-Überwachung: aktiviert, Empfindlichkeit und Standardaktion (`alert`, `quarantine`, `kill`, `block`, `require_approval`), für Endpunkt und/oder Gateway. |
| **Claude-Code-Routing** | Einstellungen für transparente Proxys. Siehe [Transparent Proxy](/de/en/agent/transparent-proxy). |
| **Manipulationsschutz** | Deinstallationsschlüssel-Anforderung (siehe unten). |
| **Einführung** | Gestaffelte Rollout-Konfiguration (siehe [Sichere Rollouts](#safe-rollouts)). |

### Schutzvoreinstellungen

Anstatt jeden Knopf einzustellen, können Sie eine einzelne Schutzvoreinstellung auswählen, die den Verhaltensschutz mit dem Ausgangsmodus bündelt:

| Voreinstellung | Verhalten |
|--------|----------|
| **Passiv** | Beobachten und aufmerksam machen; minimale Durchsetzung. |
| **Normal** | Ausgewogene Durchsetzung. |
| **Aggressiv** | Starke Durchsetzung (z. B. Sperrung/Quarantäne, strengerer Ausgang). |

Off-Preset-Kombinationen werden als **Benutzerdefiniert** angezeigt.

## Gruppen

Eine **Gruppe** (`AgentGroup`) hat eine `policyId` plus dynamische **Mitgliedschaftsregeln** – abgestimmt auf Betriebssystem, Hostnamen-Glob-Muster und Priorität. Die wirksame Richtlinie eines Geräts wird aufgelöst **Gerät → Gruppe → Richtlinie** und bei jedem Heartbeat neu bewertet, sodass das Verschieben eines Geräts zwischen Gruppen (oder das Bearbeiten der Regeln einer Gruppe) automatisch ein neues Ziel erhält.

## Sichere Rollouts

Richtlinienänderungen werden über einen kontrollierten Workflow versendet, sodass Sie sie vor der flottenweiten Durchsetzung validieren können:

- **Revisionen und Rollback** – jede Richtlinienänderung wird versioniert; Sie können jederzeit zu einer früheren Revision zurückkehren.
- **Rollout-Ringe** – Führen Sie eine Änderung durch gestaffelte Ringe (Pause/Fortsetzen/Vorwärts) statt auf einmal durch.
- **Probelaufsimulation** – Sehen Sie sich eine Vorschau dessen an, was eine Richtlinie im aktuellen Inventar erkennen oder blockieren würde, ohne etwas zu speichern oder zu erzwingen.
- **Ausnahmen** – ein Genehmigungsworkflow für Ausnahmen pro Gerät/pro Regel; Durch die Genehmigung wird ein verwalteter Ausschluss angehängt. Für die Genehmigung ist die Administratorrolle erforderlich.

## Manipulationsschutz und Deinstallationsschlüssel

Eine Richtlinie kann einen **Deinstallationsschlüssel** (`tamperProtection.uninstallRequiresKey`) erfordern, sodass der Agent ohne diesen Schlüssel nicht von einem lokalen Benutzer entfernt werden kann. Die Anforderung (und ein Hash-Schlüssel mit einem Offline-Salt/Hash) wird an den Endpunkt übermittelt, sodass dieser auch außerhalb des Netzwerks validieren kann. Deinstallationsversuche werden über einen öffentlichen Token-Validierungsendpunkt validiert (zuerst pro Richtlinienschlüssel, dann ein flottenweiter Fallback); Ausfälle werden geprüft. Siehe [Selbstupdate & Anti-Tamper](/de/en/agent/quarantine-and-fleet-ops#self-update--anti-tamper).

## Verwandte

- [Egress Enforcement](/de/en/agent/egress-enforcement)
- [Quarantäne & Flotten-Ops](/de/en/agent/quarantäne-und-flotten-ops)
- [Transparenter Proxy](/de/en/agent/transparent-proxy)