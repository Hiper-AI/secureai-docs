---
sidebar_position: 1
title: "AI Gateway-Übersicht"
---
# KI-Gateway

Das **KI-Gateway** ist die zentrale Kontrollebene zur Steuerung, Sicherung, Weiterleitung und Überprüfung des gesamten unternehmensweiten KI-Modellverkehrs.

---

## Kernkompetenzen

### 1. Sicherheitsrichtlinien
Definieren Sie organisationsweite Durchsetzungsregeln:
- **Modell-Zulassungslisten**: Beschränken Sie, mit welchen Modellen und Anbietern Mitarbeiter und Anwendungen interagieren können.
- **Data Residency Geofencing**: Stellen Sie sicher, dass Eingabeaufforderungen und Antworten innerhalb der festgelegten Zuständigkeiten bleiben.
- **Erzwingungsmodi**: Ausführung im **Überwachungsmodus** (Protokollierung und Bescheinigung ohne Blockierung) oder **Erzwingungsmodus** (Fail-Closed, Blockierung von nicht konformem Datenverkehr mit kryptografischen Belegen).

### 2. Dashboard und Beobachtbarkeit
Überwachen Sie Echtzeitkennzahlen in Ihrem gesamten Unternehmen:
- **Gesamtzahl gesicherter Interaktionen** und aktive SMLTP-Pakete.
- **Redaktions- und Blockierungsraten**: Verfolgen Sie sensible Daten, die von DLP/PII-Engines abgefangen werden.
- **Protokollstatus**: Überprüfen Sie den Live-Gateway-Zustand und den Schlüsselrotationsstatus.

### 3. Kryptografische Schlüsselverwaltung
Verwalten Sie Ed25519-Signaturschlüssel und AES-256-Verschlüsselungsschlüssel:
- **Rotation ohne Ausfallzeiten**: Wechseln Sie die Signaturschlüssel regelmäßig und behalten Sie dabei die Offline-Überprüfung für Belege bei, die mit den vorherigen Schlüsseln signiert wurden.
- **Konfiguration**: Gehen Sie zu **Admin? KI-Gateway? Schlüssel**.

### 4. Transparenzportal und Audit
Validieren Sie die Interaktionsintegrität mithilfe kryptografischer Beweise:
- Durchsuchen Sie jede Interaktion nach undle_id, um deren L1-Hash-Kette, L2-Merkle-Baum und L3-Sigstore-Rekor-Transparenzanker zu überprüfen.
- Generieren Sie gemeinsam nutzbare öffentliche Verifizierungslinks für Compliance-Prüfer von Drittanbietern.

### 5. Erweiterungsmanagement
Verwalten und erzwingen Sie Sicherheitsrichtlinien in der gesamten SecureAI-Browsererweiterungsflotte, um die Nutzung von Schatten-KI auf Client-Browsern zu verhindern.