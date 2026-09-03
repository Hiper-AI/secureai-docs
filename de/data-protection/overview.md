---
sidebar_position: 1
title: "Datenschutz (DLP & PII)"
---
# Datenschutz

Der Datenschutz verhindert den versehentlichen oder böswilligen Verlust vertraulicher Geschäftsinformationen und persönlich identifizierbarer Informationen (PII) während KI-Interaktionen.

---

## Kernschutzfunktionen

### 1. DLP-Management (Business Data Loss Prevention)
Schützt proprietäre Unternehmensressourcen in Eingabeaufforderungen, hochgeladenen Dateien und Modellantworten:
- **API-Schlüssel und Anmeldeinformationen**: Verhindert die Offenlegung von AWS-Schlüsseln, OpenAI-Tokens, Passwörtern und privaten Zertifikaten.
- **Quellcode und Architektur**: Erkennt interne Repositorys und Codefragmente.
- **Verträge und Finanzen**: Identifiziert vertrauliche Vertragsentwürfe und Finanzdaten.

### 2. PII-Schwärzung (Datenschutz und Compliance)
Erkennt und maskiert automatisch persönliche Identifikatoren, um den DSGVO-, HIPAA- und CCPA-Standards zu entsprechen:
- **Identifikatoren**: Namen, E-Mail-Adressen, Telefonnummern, nationale Ausweise (SSN, DNI, Passnummern), Kreditkarten.
- **Schwärzungsmodi**:
  - **Maske**: Verschleiert sensible Zeichenfolgen (z. B. user@*****.com, ****-****-****-1234).
  - **Entfernen**: Entfernt den vertraulichen Text vollständig.
  - **Tokenize / Hash**: Ersetzt sensible Daten durch deterministische Pseudonyme für die interne Verarbeitung.

### 3. Semantischer Verifizierer
Hilft bei Sicherheits- und rechtlichen Untersuchungen, indem es ermittelt, ob ein verdächtiger Text von Ihrem SecureAI-Mandanten generiert wurde:
- **Konfidenzstufen**: *Verifiziert*, *Wahrscheinliche Übereinstimmung*, *Mehrdeutig*, *Keine Übereinstimmung*.
- **Nutzung**: Gehen Sie zu **Admin? Datenschutz? Semantic Verifier** und fügen Sie den Textausschnitt ein, um die Ursprungswahrscheinlichkeit zu analysieren.

---

## Konfiguration und Einrichtung

1. **Globale Einstellungen**: Gehen Sie zu **Admin? Datenschutz**, um Echtzeit-Scans für Eingaben, Ausgaben und Dateianhänge zu ermöglichen.
2. **Vorlagen und benutzerdefinierte Regeln**: Laden Sie regionale/branchenspezifische Startervorlagen oder fügen Sie benutzerdefinierte Regex-Muster hinzu.
3. **Simulationsmodus**: Testen Sie Richtlinien anhand von Beispieldatensätzen, bevor Sie sie in der Produktion durchsetzen.
4. **Vorfallüberwachung**: Überprüfen Sie die Schwärzungs- und Blockierungsmetriken in den Datenschutz-Vorfallprotokollen.