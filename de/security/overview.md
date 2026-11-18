---
sidebar_position: 1
title: "Sicherheitsübersicht"
---
# Sicherheitsübersicht

Erfahren Sie mehr über die Sicherheitsfunktionen und die Architektur von SecureAI.

## Sicherheitsfunktionen

SecureAI implementiert Sicherheitsmaßnahmen auf Unternehmensniveau, um Ihre Daten und Anwendungen zu schützen, mit SMLTP (Secure Model Language Transfer Protocol) als Eckpfeiler unserer Sicherheitsarchitektur.

### SMLTP (Secure Model Language Transfer Protocol)

**SMLTP** ist ein Sicherheitsprotokoll mit einem öffentlichen Spezifikationsentwurf, der die Kommunikation mit ermöglicht
Große Sprachmodelle (LLMs), geregelt, enthalten und beweisbar. Es bietet:

- **Signierte Berechtigungs-Tokens**: Jede geregelte Anfrage trägt eine **Ed25519**-signierte Token-Bindung
  Identität, autorisiertes Modell, Richtlinien-Hash und die genauen Anforderungsbytes (SHA-256)
- **Signierte Compliance-Belege**: Jede über das Gateway weitergeleitete Interaktion erzeugt einen Beleg, der sein kann
  offline anhand des öffentlichen Schlüssels des Gateways verifiziert
- **Richtliniendurchsetzung**: Modellzulassungslisten, Datenresidenzprüfungen und Ausgangskontrollen – im Monitor
  oder Erzwingungsmodus, mit signierten Ablehnungsbestätigungen
- **Tamper-Evident Audit Logging**: Hash-verkettete, mit Merkle versiegelte Protokolle, optional verankert in einem
  externes Transparenzprotokoll (Sigstore Rekor)
- **Schlüsselrotation**: Ed25519 Signaturschlüsselrotation; Quittungen, die unter früheren Schlüsseln ausgestellt wurden, bleiben erhalten
  nachweisbar
- **Bundle-Verschlüsselung**: optionale AES-256-GCM-Verschlüsselung von Anforderungspaketen zwischen Client und
  Tor

### Datenschutz

- **Schlüssel pro Mandant**: SecureAI verschlüsselt Unterhaltungen und gespeicherte Connector-Zugangsdaten auf Feldebene mit AES-256-GCM, mit Schlüsseln, die nur Ihrem Mandanten gehören und von einem Cloud-Schlüsselverwaltungsdienst geschützt werden.
- **Verschlüsselung im Ruhezustand**: Datenbanken und Backups liegen auf Google-Cloud-Datenträgern, die Google im Ruhezustand verschlüsselt.
- **Verschlüsselung während der Übertragung**: Verbindungen nutzen TLS 1.2 oder TLS 1.3 mit AEAD-Cipher-Suites mit Forward Secrecy.
- **Eigener Schlüssel für Nachweise**: Wenn Sie die Aufbewahrung von Nachweisen aktivieren (standardmäßig aus), können Sie diese mit einem Schlüssel aus Ihrem eigenen Schlüsselverwaltungsdienst in AWS, Azure oder Google Cloud verschlüsseln.

### Zugangskontrolle

- **Rollenbasierte Zugriffskontrolle (RBAC)**: Detaillierte Berechtigungen für verschiedene Benutzertypen
- **API-Schlüsselverwaltung**: Sichere Authentifizierung für alle API-Anfragen
- **Ratenbegrenzung**: Intelligente Ratenbegrenzung zur Verhinderung von Missbrauch
- **Audit-Protokolle**: Vollständige Aktivitätsverfolgung für Compliance und Sicherheit

### Sicherheitsrichtlinien

SMLTP unterstützt mehrere integrierte Richtlinienvorlagen:

- **Intern**: Standardrichtlinie für interne Unternehmensdaten
- **Intern streng**: Höhere Sicherheit für sensible interne Daten
- **Öffentlich**: Weniger restriktive Richtlinie für nicht sensible, öffentliche Daten
- **HIPAA, DSGVO und PCI-DSS**: Katalognamen, die dieselben Kontrollen wie Intern streng anwenden. Die Auswahl macht Ihre Nutzung nicht konform mit der jeweiligen Vorschrift. Für Regeln, die eine Vorschrift verlangt, legen Sie eine eigene Richtlinie mit demselben Namen an: Sie ersetzt die integrierte in Ihrer Organisation.

### Unterstützung bei der Compliance

- **Zuordnung zu Rahmenwerken**: SecureAI ordnet seine Prüfungen Kontrollen aus Rahmenwerken wie NIST AI RMF, ISO/IEC 42001 und dem EU AI Act zu. Die Zuordnung ist unvollständig und hilft beim Sammeln von Nachweisen. Sie ist keine Zertifizierung.
- **Zertifizierungen**: Hiper AI hat heute keinen SOC-2-Bericht und kein ISO/IEC-27001-Zertifikat.
- **Audit Trail**: hash-verkettete Protokolle der KI-Interaktionen und der administrativen Aktionen, für Ihre Compliance- und Sicherheitsprüfungen.
- **Richtliniendurchsetzung**: SecureAI wendet Ihre Sicherheitsrichtlinien auf jede Anfrage an, die über das Gateway läuft.
- **Echtzeitüberwachung**: Sicherheitsereignisse erscheinen in der Konsole, sobald sie auftreten.

## So funktioniert SMLTP

1. **Berechtigung**: Die Kontrollebene prägt ein signiertes Token, das diesen Anrufer, dieses Modell, autorisiert.
   gemäß dieser Richtlinie für genau diese Anforderungsbytes
2. **Verifizierung**: Das SMLTP-Gateway überprüft das Token – Signatur, Ablauf, Modellübereinstimmung, Text
   Hash, Wiedergabe und Widerruf – bevor die Anfrage irgendwohin geht
3. **Richtliniendurchsetzung**: Modellzulassungsliste, Wohnsitz- und Ausgangsregeln werden am ausgewertet
   Tor; Im Durchsetzungsmodus wird ein nicht konformer Anruf mit einer signierten Ablehnungsbestätigung blockiert
4. **Inspektion und Bescheinigung**: Die DLP/PII-Inspektion erfolgt auf dem geregelten Pfad (Best-Effort,
   probabilistisch) und sein Urteil wird in der unterschriebenen Quittung festgehalten
5. **Audit-Protokollierung**: Jede Interaktion landet in einem Hash-verketteten, mit Merkle versiegelten Audit-Trail

## Vorteile

- **Nachweisbar, nicht nur protokolliert**: Mit signierten Belegen können Prüfer Interaktionen unabhängig überprüfen
- **Nachweise für Audits**: Signierte Belege und die Zuordnung zu Rahmenwerken geben Ihren Prüfern Material, das sie selbst überprüfen können.
- **Eindämmung**: Ein Agent, der über das Gateway läuft, kann die Berechtigungen seines signierten Tokens nicht überschreiten, auch wenn er kompromittiert ist.
- **Deterministischer Widerruf**: Das Abschneiden eines Benutzers, Schlüssels oder Agenten wird am Gateway wirksam
  Sekunden – ohne auf einen KI-Anbieter warten zu müssen
- **Richtliniengesteuert**: Automatisierte Durchsetzung Ihrer Sicherheitsrichtlinien

## Nächste Schritte

- [SMLTP Deep Dive](/de/security/smltp) - Erfahren Sie mehr über SMLTP
- [Authentifizierung](/de/iam/overview) - Authentifizierungsmethoden verstehen
- [API-Sicherheit](/de/api) – Richtlinien zur sicheren API-Nutzung