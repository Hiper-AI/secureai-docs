---
sidebar_position: 4
title: "Unveränderliche Protokolle"
---
# Unveränderliche Protokolle – Kryptografische Prüfkette

SecureAI zeichnet **jede KI-Interaktion und jede Verwaltungsaktion** in einer dreischichtigen unveränderlichen Kette auf. Diese Architektur stellt sicher, dass jede Änderung, Löschung oder Manipulation von Datensätzen erkennbar ist – auch wenn jemand direkten Zugriff auf die Datenbank hat.

## Warum ist das wichtig?

Ein Protokoll, das nur in MongoDB existiert, ist nicht wirklich unveränderlich: Jeder, der Zugriff auf den Server hat, kann es löschen, ohne Spuren zu hinterlassen. SecureAI löst dieses Problem, indem es jedes Protokoll an **Sigstore Rekor** anheftet, ein öffentliches Transparenzprotokoll, das von der Open Source Security Foundation (OpenSSF) betrieben wird – das gleiche System, das die Softwareindustrie verwendet, um die Aufbewahrungskette kritischer Pakete zu überprüfen.

> **Technische Garantie:** Sobald sich ein Merkle-Block-Hash in Rekor befindet, kann niemand – einschließlich des SecureAI-Betreibers – diesen Datensatz rückwirkend ändern. Jeder externe Prüfer kann dies mit einem einzigen Curl-Aufruf unabhängig überprüfen.

---

##Die drei Beweisebenen

Jedes Interaktionsbündel verfügt über drei Ebenen des kryptografischen Nachweises:

### Schicht 1 – MongoDB-Registrierung (L1)

Der primäre Datensatz der Interaktion wird in MongoDB gespeichert mit:

| Feld | Beschreibung |
|-------|-------------|
| `current_hash` | SHA-256 der Nutzlast dieses Eintrags + `prev_hash` vorherige |
| `prev_hash` | Hash des unmittelbar vorhergehenden Eintrags – bildet die **Hash-Kette** |
| `bundle_id` | Eindeutiger Bezeichner des Interaktionspakets |
| `receipt_signature` | Wenn der KI-Anbieter eine signierte Bestätigung der Datenschutz-Header zurückgegeben hat |

Die Zeichenfolge `prev_hash → current_hash → next_current_hash` führt dazu, dass **das Löschen einer beliebigen Zeile die Zeichenfolge unterbricht** – die Diskrepanz ist durch Durchlaufen der Sequenz erkennbar.

### Ebene 2 – Merkle Tree (L2)

Alle 10 Protokolleinträge werden in einem **Merkle-Block** gruppiert:

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

Der `merkle_root` ist der Root-Hash, der die 10 Einträge darstellt. Wenn ein Eintrag geändert wird, ändert sich die `merkle_root` – wodurch der Einschlusstest ungültig wird.

| Feld L2 | Beschreibung |
|----------|-------------|
| `block_id` | Merkle-Block-ID |
| `merkle_root` | Baumwurzel-Hash |
| `leaf_hash` | Hash dieses spezifischen Eintrags im Baum |
| `leaf_index` | Position (0–9) innerhalb des Blocks |
| `verified` | `true`, wenn `leaf_hash` in `merkle_root` | festgeschrieben wird

### Schicht 3 – Rekor-Anker (L3)

Der `merkle_root` jedes versiegelten Blocks wird an **[Sigstore Rekor](https://rekor.sigstore.dev/)** gesendet, ein öffentliches Protokoll, das nur zum Anhängen bestimmt ist. Rekor gibt zurück:

| Feld L3 | Beschreibung |
|----------|-------------|
| `log_index` | Globale Sequenznummer im Rekor-Log – eindeutig und monoton ansteigend |
| `uuid` | Eintragskennung in Rekor |
| `integrated_time` | Zeitstempel, in dem Rekor den Einschlusstest unterzeichnet hat |
| `rekor_url` | Direkte URL zum Eintrag von Roh-JSON in Rekor |

Sobald `log_index` in Rekor existiert, kann **niemand es löschen** – das Rekor-Protokoll ist öffentlich, verteilt und von Natur aus unveränderlich.

---

## Transparenzportal (admin)

### Zugriff

**Admin → AI Gateway → Transparenzportal**

### Überprüfen Sie ein Bundle

1. Geben oder fügen Sie `bundle_id` in das Suchfeld ein.
2. Klicken Sie auf **"Beweis überprüfen"**.
3. Sie sehen die drei Ebenen mit Statusabzeichen:
   - ✅ **Grün** = erfolgreich verifiziert
   - ⚠️ **Gelb** = Versiegelung/Verankerung ausstehend (normal für Interaktionen vor weniger als 2 Minuten)
   - ❌ **Rot** = Verifizierungsfehler (Warnsignal)

### Öffentlichen Verifizierungslink kopieren

Wenn das Ergebnis sichtbar ist, erscheint eine Leiste mit der Schaltfläche **„Öffentliche Verifizierungs-URL kopieren“**. Dieser Link ist öffentlich – Sie können ihn ohne Anmeldung an einen externen Prüfer senden.

---

##Öffentliche Verifizierungsseite

Jeder mit einem `bundle_id` kann den Test ohne Zugriff auf SecureAI überprüfen:

```
https://tu-dominio.com/verify/<bundle_id>
```

Die Seite zeigt die drei Ebenen, eine Schaltfläche zum Herunterladen des Test-JSON und Befehle zur lokalen Überprüfung.

**Diese Seite stellt Folgendes nicht zur Verfügung:**
- Der Inhalt der Nachricht noch die Antwort der KI
- Benutzerdaten (Name, E-Mail, IP)
- Alle persönlich identifizierbaren Informationen

Es werden nur Hashes, Zeitstempel, Indizes und der Verifizierungsstatus angezeigt.

---

## Unabhängige Überprüfung mit Curl

Ein externer Prüfer kann jedes Paket überprüfen, ohne der Weboberfläche zu vertrauen:

### Schritt 1 – Machen Sie den Test

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### Schritt 2 – Bestätigen Sie den Hash in der Merkle-Ebene

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### Schritt 3 – Bestätigen Sie den Anker in Rekor

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

Ein nicht leeres `signedEntryTimestamp`-Feld bestätigt, dass Rekor den Eintrag akzeptiert und signiert hat. Dieser Zeitstempel kann nicht rückwirkend geändert werden.

---

## Signiertes Exportpaket (Auditoren und Benutzer)

Zusätzlich zum öffentlichen Verifizierer von `bundle_id` ermöglicht Ihnen SecureAI den Export kryptografischer Beweise in eine tragbare ZIP-Datei für Offline-Prüfungen.

### Was beinhaltet die ZIP-Datei?

Wenn ein Administrator **Signiertes Bundle exportieren** in Protokollen oder SMLTP verwendet, wird eine Datei heruntergeladen mit:

- `data.csv`: exportierte Daten.
- `manifest.json`: kryptografische Metadaten (`rowCount`, `merkleRootOfExport`, `signingKeyFingerprint`, Zeitstempel usw.).
- `manifest.sig`: Signatur Ed25519 von `manifest.json`.
- `verify.js`: Offline-Verifizierer ohne Abhängigkeiten.
- `README.txt`: Kurzanleitung.

### So überprüfen Sie (offline)

1. Entpacken Sie die ZIP-Datei.
2. Öffnen Sie ein Terminal in diesem Ordner.
3. Ausführen:

```bash
node verify.js
```

Erwartete Ausgabe für ein intaktes Bundle:

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### Was erkennt dieser Prüfer?

- Bearbeiten eines beliebigen Feldes in `data.csv`.
- Löschen oder Hinzufügen von Zeilen in `data.csv`.
- Änderung von `manifest.json`.
- Verwendung eines falschen Signaturschlüssels.

Wenn eine Prüfung als `FAIL` angezeigt wird, sollte dieser Export **nicht als vertrauenswürdig betrachtet werden**.

### Schnelltest für Audit

So demonstrieren Sie die Manipulationserkennung:

1. Führen Sie `node verify.js` auf der neu exportierten ZIP-Datei aus (es sollte alle `PASS` enthalten).
2. Bearbeiten Sie ein beliebiges Zeichen in `data.csv` und speichern Sie es.
3. Führen Sie `node verify.js` erneut aus.
4. Muss mindestens `Merkle root of export` fehlschlagen.

Dies bestätigt den Nachweis der End-to-End-Integrität für den exportierten Datensatz.

---

## Interpretation von Zuständen

| L1-Status | Bedeutung |
|-----------|-------------|
| ✅ Anmeldung vorhanden | Die Interaktion erfolgt in MongoDB mit gültiger Hash-Kette |

| L2-Status | Bedeutung |
|-----------|-------------|
| ✅ Merkle verifiziert | Der Hash dieses Eintrags ist Teil des Merkle-Baums und die Überprüfung ist korrekt |
| ⚠️ Ausstehende Sperre | Es sind noch nicht 10 Einträge vorhanden, um einen Block zu bilden (normal in den ersten Minuten) |
| ❌ Überprüfung fehlgeschlagen | Hash stimmt nicht mit merkle_root überein – mögliche Manipulation |

| Zustand L3 | Bedeutung |
|-----------|-------------|
| ✅ Verankert in Rekor | Die merkle_root befindet sich im öffentlichen Rekor-Protokoll mit signiertem Zeitstempel |
| ⏳ Anker ausstehend | Der Block wurde versiegelt, aber noch nicht an Rekor gesendet (kann bis zu 30 Sekunden dauern) |

---

## Vollständiger Nachrichtenfluss

```
Usuario envía mensaje
        ↓
  SMLTP Gateway (Rust)
  - Registra en MongoDB (SMLTPLog)
  - Computa current_hash = sha256(prev_hash + payload)
  - Escribe en smltp_events.jsonl
        ↓
  Sealer de Merkle (cada 60s)
  - Acumula 10 entradas
  - Calcula merkle_root
  - Crea MerkleBlock en MongoDB
        ↓
  Rekor Anchor Sidecar (cada ~30s)
  - Lee BLOCK_SEALED del log
  - Firma con clave Ed25519
  - Envía a rekor.sigstore.dev
  - Guarda rekor_uuid en MongoDB
        ↓
Prueba completa disponible en /verify/<bundle_id>
```

---

## Lieferantenkonformität

Das Abzeichen **„Provider Compliance“** gibt an, ob der KI-Anbieter (OpenAI, Anthropic usw.) den Erhalt der SMLTP-Datenschutzheader bestätigt hat:

| Abzeichen | Bedeutung |
|-------|-------------|
| ✅ GEPRÜFT / ZERTIFIZIERT | Der Lieferant bestätigte den Erhalt mit einer unterschriebenen Empfangsbestätigung |
| 🛡️ GATEWAY-GESCHÜTZT | Datenschutz-Header wurden gesendet, aber vom Anbieter nicht ausdrücklich bestätigt. Ihre Daten werden durch das Gateway geschützt. |
| ⚠️ ANBIETER NICHT VERIFIZIERT | Der Lieferant hat den Erhalt nicht bestätigt. Die Daten werden durch SMLTP geschützt übertragen, es gibt jedoch keine Garantie dafür, dass der Anbieter die No-Training-Anweisungen beachtet. |

---

## Häufig gestellte Fragen

**Kann ich ein Paket ohne Internet verifizieren?**
Ja, laden Sie den Test-JSON über die Schaltfläche „JSON herunterladen“ herunter, während Sie online sind. Die `merkle_root` und Hashes können offline durch Neuberechnung des Baums überprüft werden.

**Was passiert, wenn L3 aussteht?**
Dies ist bei kürzlich erfolgten Interaktionen (weniger als 1 Minute) normal. Der Sidecar von Rekor verarbeitet Blöcke alle ca. 30 Sekunden. Wenn es nach 5 Minuten immer noch aussteht, überprüfen Sie, ob der Sidecar `rekor-anchor` läuft.

**Wie lange werden Aufzeichnungen aufbewahrt?**
Standardmäßig werden Protokolle basierend auf dem konfigurierten `retentionPeriod` geführt. Als Konformität markierte Datensätze (`phi`, `pii`, `security`, `authorization`) werden niemals automatisch gelöscht.

**Kann ich den Verifizierungslink mit einem Kunden teilen?**
Ja. Für die URL `/verify/<bundle_id>` ist keine Anmeldung erforderlich und es werden keine vertraulichen Daten offengelegt. Die Weitergabe an Wirtschaftsprüfer, Aufsichtsbehörden oder Kunden ist sicher.