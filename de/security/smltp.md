---
sidebar_position: 2
title: "SMLTP-Sicherheit"
---
# SMLTP-Sicherheitsprotokoll

SecureAI verwendet das **Secure Model Language Transfer Protocol (SMLTP)** zur Steuerung, Eindämmung und Prüfung
Kommunikation mit Large Language Models (LLMs).

## Was ist SMLTP?

SMLTP ist ein Sicherheitsprotokoll mit einem **öffentlichen Spezifikationsentwurf** (v0.2). Es definiert a
**deterministische Kontrollebene** für KI-Verkehr: anstatt sich nur auf probabilistische Inspektionen zu verlassen
Bei Eingabeaufforderungen macht SMLTP fünf Eigenschaften jedes gesteuerten KI-Aufrufs deterministisch und kryptografisch
nachweisbar.

| Schicht | Deterministischer Mechanismus |
|---|---|
| **Identität** | Ed25519 Signierter Berechtigungs-Token (SET), geprägt auf Anfrage |
| **Autorisierung** | `model`- und `policy_hash`-Ansprüche – der Anruf wird unter einer benannten Richtlinie ausgeführt oder überhaupt nicht |
| **Transportintegrität** | `body_sha256` bindet das Token an die genauen Anforderungsbytes |
| **Eindämmung** | Überwachungs-/Erzwingungsmodi, Wiedergabe-Cache, Betreff-Widerruf, Fail-Closed-Standardeinstellungen |
| **Prüfung** | Hash-verkettetes, mit Merkle versiegeltes Protokoll mit signierten Compliance-Belegen |

## Das Zwei-Ebenen-Modell

SMLTP trennt bewusst zwei Arten von Kontrollen:

- **Deterministische Ebene (Kryptographie):** Wer ruft an, was darf er anrufen, das
  Die Anfrage wurde nicht geändert, ein widerrufener Betreff wird abgeschnitten und die Aufzeichnung kann nicht stillschweigend erfolgen
  umgeschrieben. Hierbei handelt es sich um Garantien, die durch Signaturen und Hashes durchgesetzt werden.
- **Probabilistische Ebene (Inspektion):** DLP, PII-Redaktion und Prompt Shield laufen *hinter* dem
  deterministische Kontrollen und sind ausdrücklich **Best-Effort**. SMLTP beansprucht diese Kryptografie niemals
  Erkennt eine sofortige Injektion oder die Inspektion erfasst jede empfindliche Saite – es wird behauptet, dass die
  Das vorgelegte Prüfurteil wird in einer unterschriebenen, nachweisbaren Quittung festgehalten.

## Hauptmerkmale

### Signierte Berechtigungstoken
– Jede geregelte Anfrage enthält eine Ed25519-signierte Token-Bindungsidentität, ein Modell, eine Richtlinie und Anfragebytes
- Wiedergabeschutz durch Einweg-Token-IDs
- Das Widerrufen eines Betreffs wird innerhalb von Sekunden am Gateway wirksam – keine Zusammenarbeit auf Anbieterseite erforderlich

### Unterzeichnete Compliance-Belege
- Jede vom Gateway weitergeleitete Interaktion erzeugt eine vom Gateway signierte Quittung
- In Quittungen werden die geltenden Richtlinien, der Anforderungs-Hash und die vorgelegten Inspektionsnachweise aufgezeichnet
– Belege können offline anhand des öffentlichen Schlüssels des Gateways überprüft werden – siehe
  [Receipts-API](../api/receipts.md)

### Manipulationssicheres Audit
– Audit-Ereignisse sind Hash-verkettet (`prev_hash` → `current_hash`) und in Merkle-Blöcken versiegelt
- Merkle-Wurzeln können in einem externen Transparenzprotokoll (Sigstore Rekor) verankert werden, also in den Datensätzen
  Integrität hängt nicht vom Vertrauen des SecureAI-Operators ab – siehe
  [Unveränderliche Protokolle](./immutable-logs.md)

### Durchsetzung von Richtlinien
- Am Gateway ausgewertete Modellzulassungslisten, Datenresidenzprüfungen (Geofence) und Ausgangskontrollen
- **Überwachungsmodus** beobachtet und bestätigt; Der **Erzwingungsmodus** blockiert nicht konforme Anrufe mit einer Signatur
  Ablehnungsbeleg

### Schlüsselverwaltung
- Signierschlüssel Ed25519 mit Rotationsunterstützung; Belege, die unter bisherigen Schlüsseln ausgestellt wurden, bleiben prüfbar

## Umfang und Ehrlichkeit

- **Bereitstellungsbereich:** SMLTP-Empfang und -Durchsetzung gelten für **Gateway-geroutete Bereitstellungen**.
  Bereitstellungen, die Anbieter direkt anrufen, erhalten weiterhin Plattform-DLP/PII und Audit-Protokollierung, jedoch nicht
  Gateway-signierte Belege (die [Receipts API](../api/receipts.md) dokumentiert dieses Verhalten).
- **Verschlüsselungsbereich:** Transportverschlüsselung ist TLS; Bündel zwischen Client und Gateway anfordern können
  zusätzlich verschlüsselt werden (AES-256-GCM). SMLTP bietet derzeit keine Ende-zu-Ende-Verschlüsselung
  durch den KI-Anbieter und erhebt keinen Anspruch auf Geheimhaltung.
- **Inspektionsbereich:** Die DLP/PII-Erkennung erfolgt probabilistisch und nach bestem Wissen und Gewissen. Was SMLTP garantiert, ist
  dass das Urteil *beglaubigt* ist – die Quittung belegt, was überprüft wurde und wie das Ergebnis ausfiel.

## Sicherheitsvorteile

- **Beweisbarkeit**: Unterschriebene Quittungen verwandeln „Wir haben Protokolle“ in „Jeder kann überprüfen, was passiert ist“
- **Eindämmung**: Selbst ein kompromittierter oder sich schlecht benehmender Agent kann seine unterzeichneten Berechtigungen nicht überschreiten
- **Deterministischer Widerruf**: Durch das Blockieren eines Benutzers, Schlüssels oder Agenten wird der Datenverkehr am Gateway in Sekundenschnelle reduziert
- **Überprüfbarkeit**: eine manipulationssichere Spur, die externe Prüfer unabhängig überprüfen können