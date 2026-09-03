---
sidebar_position: 3
title: "Registrierungs- und Installationspakete"
sidebar_label: "Anmeldung und Pakete"
description: "Funktionsweise von SecureAI OS Agent-Installationspaketen, Registrierungsschlüsseln und Gerätetokens"
---
# Registrierungs- und Installationspakete

Ein **Installationspaket** ist die Einheit, die Sie zum Bereitstellen des Agenten erstellen. Es bündelt die Plattform, die Tags und Gruppen, denen ein Gerät beitreten soll, sowie einen dedizierten Registrierungsschlüssel – sodass der Installationsbefehl in sich geschlossen ist.

## Ein Paket erstellen

Erstellen Sie unter **Admin → Agent Registry → OS Agents** ein Paket mit:

| Feld | Beschreibung |
|-------|-------------|
| **Name / Beschreibung** | Identifizieren Sie das Paket (z. B. „Engineering-Laptops“). |
| **Plattform** | Windows / Linux / macOS. |
| **Pakettyp** | `standalone`. |
| **Endpunkt-Tags** | Etiketten, die auf Geräte angewendet werden, die bei diesem Paket registriert sind. |
| **Anmeldegruppe** | Die [Gruppe](/de/en/agent/policies-and-groups), an die ein Gerät bei der ersten Registrierung angeheftet wird. |

Beim Speichern generiert SecureAI automatisch einen dedizierten API-Schlüssel mit dem Gültigkeitsbereich `agent:enroll`** und speichert ihn als Registrierungsschlüssel des Pakets, sodass für den Installationsbefehl keine separaten Anmeldeinformationen erforderlich sind. Durch das Löschen des Pakets wird dieser Schlüssel deaktiviert.

## Registrierungsgruppen (automatische Anheftung)

Die **Registrierungsgruppe** des Pakets ist ein fester Pin: Ein Gerät, das sich beim Paket registriert, wird beim ersten Kontakt an diese Gruppe gebunden. Die Gruppenmitgliedschaft bestimmt dann, welche [Richtlinie](/de/en/agent/policies-and-groups) das Gerät auflöst.

## Der Registrierungs-Handschlag

Wenn der Agent zum ersten Mal ausgeführt wird, ruft er `POST /enroll` mithilfe des Registrierungsschlüssels auf und sendet seine Computer-ID, seinen Hostnamen, sein Betriebssystem, seine Architektur, seine Version, seinen Fingerabdruck und seine Funktionen. Das Backend:

1. Registriert (oder gleicht) das Gerät ab.
2. Gibt ein **pro Gerät-Token** aus, das einmal angezeigt wird und alle nachfolgenden Aufrufe authentifiziert.
3. Gibt die Laufzeit-**Konfiguration** zurück (aufgelöste Richtlinie, Ausgangseinstellungen, Routing usw.).

Der gerätespezifische Token **rotiert bei jeder Registrierung**. Ein Gerät, das **widerrufen** wurde, kann sich nicht erneut registrieren – die Registrierungsantwort meldet `revoked: true` und das Gerät bleibt ausgeschaltet, bis ein Administrator es erneut aktiviert.

## Backend-URL-Auflösung

Der Agent ruft `BACKEND_URL` zu Hause an. Auf der Serverseite wird die effektive URL aus weitergeleiteten/request-origin-Headern aufgelöst und kann mit der Umgebungsvariablen `SECUREAI_AGENT_URL` überschrieben werden, was hinter Reverse-Proxys nützlich ist.

## Registrierte Geräte verwalten

Auf der Registerkarte „OS-Agenten“ können Sie pro Gerät Folgendes tun: einen Befehl senden, **widerrufen** / **erneut aktivieren**, löschen, eine Gruppe zuweisen und einen Eigentümerbenutzer verknüpfen/entkoppeln. Massenvorgänge werden unterstützt. Die Befehlsübermittlung erfolgt über einen WebSocket-Kanal mit einem Heartbeat-Queue-Fallback (Befehle, die in der Warteschlange stehen, während ein Gerät offline ist, werden beim nächsten Heartbeat mit einer einstündigen TTL übermittelt).

## Verwandte

- [Installation des Agenten](/de/en/agent/installation)
- [Richtlinien & Gruppen](/de/en/agent/richtlinien-und-gruppen)
- [Selbstupdate & Anti-Tamper](/de/en/agent/quarantine-and-fleet-ops#self-update--anti-tamper)