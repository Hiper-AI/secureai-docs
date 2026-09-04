---
sidebar_position: 1
title: "Authentifizierungsübersicht"
---
# API-Authentifizierung

SecureAI verwendet die API-Schlüsselauthentifizierung für alle externen API-Zugriffe. Schlüssel sind Inhabertoken, die von Administratoren erstellt und konfiguriert werden und pro Schlüssel Kontrolle über Modelle, Richtlinien, Limits, Abrechnung und Sicherheit bieten.

## Authentifizierungsheader

```http
Authorization: Bearer sk-your-api-key-here
```

**API-Schlüsselformat:**
– Beginnt mit einem `sk-`-Präfix (z. B. `sk-8cd5253f...`).
- Auf das Präfix folgt ein 64 Zeichen langes hexadezimales Geheimnis.
- Nur ein SHA-256-Hash des Schlüssels wird serverseitig gespeichert – der vollständige Schlüssel wird **einmal** bei der Erstellung angezeigt. Wenn er verloren geht, drehen/erstellen Sie den Schlüssel neu.

Alle API-Aufrufe erfordern HTTPS.

## API-Schlüssel erstellen und konfigurieren

Administratoren erstellen Schlüssel unter **Admin → API-Schlüssel** (API-Basis `/api/admin/api-keys`, nur für Administratoren). Der vollständige Schlüssel wird einmal bei der Erstellung zurückgegeben. Jeder Schlüssel trägt die folgende Konfiguration:

### Eigentum und Abrechnung

| Einstellung | Beschreibung |
|---------|-------------|
| `name` | Für Menschen lesbares Etikett. |
| `userId` | Das Benutzerkonto, zu dem dieser Schlüssel gehört/gegen den er abrechnet. |
| `billingMode` | `user-completions` (von der Fertigstellungsvergütung des Benutzers abziehen) oder `usage-by-model` (ein Dollarbudget von den Modellkosten abziehen). Siehe [Abrechnungsmodi](/de/api/billing-modes). |

Anrufer können eine einzelne Anfrage einem **anderen** Benutzer mit dem Body-Parameter `user_id` (admin-gated) in Rechnung stellen.

### Grenzen

| Einstellung | Beschreibung |
|---------|-------------|
| `dailyLimit` | Maximale Anzahl an Anfragen pro Tag für diesen Schlüssel. |
| `monthlyLimit` | Maximale Anzahl an Anfragen pro Monat für diesen Schlüssel. |
| `rateLimit.requestsPerMinute` | Höchstgrenze pro Minute (bis zu 1000). |
| `rateLimit.requestsPerHour` | Stundenobergrenze (bis zu 10.000). |
| `expiresAt` | Optionaler Ablauf; weglassen für einen nicht ablaufenden Schlüssel. |

### Zulassungslisten

| Einstellung | Beschreibung |
|---------|-------------|
| `allowedModels[]` | Wenn festgelegt, darf der Schlüssel **nur** diese Modelle verwenden. Leer = der Lizenz-Standardkatalog. |
| `allowedIndexes[]` | Beschränkt, welche Wissensdatenbanken der Schlüssel abfragen kann. |
| `allowedSMLTPPolicies[]` | SMLTP-Richtlinien, die der Schlüssel anfordern kann (Standard `["public", "internal"]`). Wird anhand des Richtlinienlösers validiert, sodass benutzerdefinierte Mandantenrichtlinien zulässig sind. |

### Prompt Shield

| Einstellung | Beschreibung |
|---------|-------------|
| `enablePromptShield` | Aktivieren Sie Prompt Shield für diesen Schlüssel. |
| `promptShieldSensitivity` | `strict`, `balanced` oder `permissive`. |
| `promptShieldPolicyId` | Binden Sie eine bestimmte Prompt Shield-Richtlinie an den Schlüssel. |
| `allowedPromptShieldPolicies[]` | Richtlinien, die der Anrufer pro Anruf über `prompt_shield.policy` auswählen kann. |

Siehe [Prompt Shield API](/de/api/threat-defense/prompt-shield).

### Redundanzstandards

`failoverDefaults` fügt dem Schlüssel ein Standardmodell [Failover-Kette](/de/api/redundancy) hinzu: `models[]` (bis zu 3), `timeout_ms` (1000–300000), `first_token_timeout_ms` (500–60000) und `on[]` Trigger. Anrufer erhalten dann ein Failover, ohne bei jeder Anfrage eine Kette zu senden.

## Idempotenz

Abschluss-`POST`s akzeptieren einen `Idempotency-Key`-Header. Bei einem erneuten Versuch mit demselben Schlüssel wird das ursprüngliche Ergebnis zurückgegeben, anstatt ein zweites Mal in Rechnung gestellt zu werden – nutzen Sie es, um Netzwerkwiederholungen sicher zu machen. Siehe [Chat-Abschluss](/de/api/chat/completions).

## Ratenbegrenzung

Standardobergrenzen (per Taste konfigurierbar):

- **Pro Minute**: 60 Anfragen
- **Pro Stunde**: 1000 Anfragen
- **Täglich**: 100 Anfragen
- **Monatlich**: 10.000 Anfragen

Ein Schlüsselinhaber kann sein eigenes Live-Kontingent und seine eigenen Limits über [`GET /usage`](/de/api/usage) lesen.

## Sicherheitsfunktionen

- **Nur HTTPS** – alle API-Aufrufe erfordern TLS.
- **Im Ruhezustand gehasht** – von jedem Schlüssel wird nur ein SHA-256-Hash gespeichert.
- **Nutzungsverfolgung und Audit-Protokollierung** – jeder Anruf und jedes Authentifizierungsereignis wird protokolliert.
- **SMLTP-Konformität** – Sicherheitsrichtlinien werden bei jeder Anfrage durchgesetzt.

## Fehlerantworten

### Authentifizierungsfehler

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Ratengrenzfehler

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Häufige Fehlercodes

| Fehler | Beschreibung |
|-------|-------------|
| `Invalid API key` | Der API-Schlüssel ist ungültig, abgelaufen oder widerrufen. |
| `Rate limit exceeded: too many requests per minute` | Das Minutentariflimit wurde überschritten. |
| `Rate limit exceeded: too many requests per hour` | Das Stundentariflimit wurde überschritten. |
| `Access denied` | Modell, Index oder Richtlinie sind für diesen Schlüssel nicht zulässig. |

## Nächste Schritte

- [API-Referenz](/de/api) – Entdecken Sie alle verfügbaren externen Endpunkte.
- [Chat Completions](/de/api/chat/completions) – Beginnen Sie mit der Integration von Vervollständigungen.
- [OpenAI-kompatibler Endpunkt](/de/api/chat/openai-kompatibel) – Wiederverwendung eines vorhandenen OpenAI SDK.
- [Nutzung](/de/api/usage) — Kontingent und Limits prüfen.