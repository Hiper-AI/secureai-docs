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

- **Zero-Knowledge-Haltung**: Vom Kunden verwaltete Schlüssel (BYOK), kurzlebige In-Memory-Verarbeitung und
  Durch die einsatzlokale Protokollierung bleiben vertrauliche Daten unter Ihrer Kontrolle
- **Verschlüsselung im Ruhezustand**: Alle gespeicherten Daten werden mit branchenüblichen Algorithmen verschlüsselt
- **Verschlüsselung während der Übertragung**: TLS 1.3-Verschlüsselung für die gesamte API-Kommunikation
- **Vom Kunden verwaltete Schlüssel**: Sie kontrollieren Ihre Verschlüsselungsschlüssel

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
- **HIPAA**: Entspricht den Gesundheitsdatenvorschriften
- **DSGVO**: Konform mit den europäischen Datenschutzbestimmungen
- **PCI-DSS**: Entspricht den Branchenstandards für Zahlungskarten

### Compliance und Zertifizierungen

- **Enterprise Ready**: Entwickelt für die Sicherheitsanforderungen von Unternehmen
- **Audit Trail**: Vollständige Protokollierung für Compliance- und Sicherheitsaudits
- **Richtliniendurchsetzung**: Automatisierte Durchsetzung von Sicherheitsrichtlinien
- **Echtzeitüberwachung**: Kontinuierliche Überwachung von Sicherheitsereignissen

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
- **Compliance Ready**: integrierte Unterstützung für wichtige Compliance-Frameworks
- **Eindämmung**: Selbst ein kompromittierter Agent kann seine kryptografisch signierten Berechtigungen nicht überschreiten
- **Deterministischer Widerruf**: Das Abschneiden eines Benutzers, Schlüssels oder Agenten wird am Gateway wirksam
  Sekunden – ohne auf einen KI-Anbieter warten zu müssen
- **Richtliniengesteuert**: Automatisierte Durchsetzung Ihrer Sicherheitsrichtlinien

## Nächste Schritte

- [SMLTP Deep Dive](/de/en/security/smltp) - Erfahren Sie mehr über SMLTP
- [Authentifizierung](/de/en/iam/overview) - Authentifizierungsmethoden verstehen
- [API-Sicherheit](/de/en/api) – Richtlinien zur sicheren API-Nutzung