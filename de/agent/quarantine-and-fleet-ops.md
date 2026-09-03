---
sidebar_position: 6
title: "Quarantäne und Flotteneinsätze"
sidebar_label: "Quarantäne und Flotteneinsätze"
description: "Reagieren Sie auf Endpunktbedrohungen – Quarantäne, Wiederherstellung, Isolierung, Vorfälle und flottenweite Operationen"
---
# Quarantäne und Flottenoperationen

Über die Durchsetzung hinaus verfügt die Agentenflotte über eine Reaktions- und Betriebsebene: Quarantäne und Wiederherstellung, Endpunktisolierung, einen War Room für Vorfälle, einen Quarantäne-Tresor, Bedrohungsoptimierung und ein Flotten-Dashboard.

## Gerätebefehle und -rollen

Zerstörerische Gerätebefehle erfordern die erhöhte Systemrolle **Administrator** (strenger als der allgemeine Admin-Panel-Zugriff):

| Befehl | Wirkung |
|---------|--------|
| `quarantine` | Verschiebt und verschlüsselt eine schädliche Datei und beendet ihren Prozessbaum. **Destruktiv.** |
| `kill_process` / `kill_mcp` / `kill_network` | Beenden Sie einen Prozess, einen MCP-Server oder eine Netzwerkverbindung. |
| `isolate` / `unisolate` | Trennen Sie den Endpunkt vom Netzwerk bzw. stellen Sie ihn wieder her. |
| `revoke` | Sperren Sie das Gerät (es kann sich nicht mehr registrieren oder anrufen). |

`restore` (Wiederherstellen einer unter Quarantäne gestellten Datei) ist eine Wiederherstellungsaktion und steht jedem Administrator zur Verfügung. Der Agent bestätigt die Quarantäne-/Wiederherstellungsergebnisse zurück an das Backend.

## Quarantäne-Tresor

Unter Quarantäne gestellte Elemente werden in einem **Tresor** mit einem konfigurierbaren Aufbewahrungszeitraum (standardmäßig **30 Tage**) aufbewahrt. Im Tresor können Sie nach Maschine, Schweregrad, wiederhergestelltem/überprüftem Status filtern, überprüfte Elemente markieren und Elemente in großen Mengen **wiederherstellen**.

## Bedrohungsoptimierung

In der **Überprüfungswarteschlange** werden selbstquarantänierte Dateien und kürzlich automatisch beendete Richtlinien gesammelt, die auf eine falsche positive Überprüfung durch den Menschen warten. Jede Zeile enthält die aufgelöste Richtlinie des Geräts, sodass Sie die richtige Regel anpassen können. Von einem Vorfall aus können Sie eine Erkennung auf die **Blockliste** oder **Whitelist** setzen – global im Organisationskatalog oder auf eine Richtlinie beschränkt.

## Vorfälle (War Room)

Endpunktvorfälle werden im War Room als Runbooks selektiert. Zu den Aktionen auf Geräteebene gehören **ack-clear** (löschen aufgezeichneter Verstöße, Neuberechnung des Status und Schließen der zugehörigen Bedrohungs-Runbooks) und die Blockierung/Whitelist von Bedrohungen.

## Flotten-Dashboard

Das Dashboard fasst die gesamte Flotte zusammen: Abdeckung, Online-/Veraltungszahlen nach Betriebssystem, Statusverteilung, durchschnittliches Risiko, Facetten aktiver Vorfälle, eine Heatmap pro Gerät, eine Bedrohungszeitleiste pro Tag, Top-Bedrohungen und Top-Risiken.

## Selbstaktualisierung und Manipulationsschutz

- **Selbstaktualisierung** – der Agent aktualisiert sich selbst über einen `update`-Befehl plus ein signiertes Release-Manifest (Version + Prüfsumme + Signatur); Der neueste Build kann automatisch mit der Flotte synchronisiert werden.
- **Anti-Manipulations-/Deinstallationsschlüssel** – eine [Richtlinie](/de/en/agent/policies-and-groups#tamper-protection--uninstall-key) kann einen Deinstallationsschlüssel erfordern, damit der Agent nicht stillschweigend entfernt werden kann. Die Validierung funktioniert auch außerhalb des Netzwerks (ein Offline-Salt/Hash wird zum Endpunkt übertragen), mit einem flottenweiten Schlüssel als Fallback; Fehlgeschlagene Deinstallationsversuche werden überwacht.

## Verwandte

- [Richtlinien & Gruppen](/de/en/agent/richtlinien-und-gruppen)
- [Egress Enforcement](/de/en/agent/egress-enforcement)
- [Threat Defense](/de/en/threat-defense/overview)