---
sidebar_position: 5
title: "API-Referenz"
---
# API-Referenz

Die SecureAI External API bietet KI-Chat-Abschlussfunktionen mit Wissensdatenbankabruf, Sicherheitsrichtlinien und umfassender Nutzungsverfolgung. Diese API ist für externe Entwickler und Integrationen konzipiert, die eine API-Schlüsselauthentifizierung verwenden.

## Hauptmerkmale

- **RAG (Retrieval-Augmented Generation)**: Wissensdatenbanken automatisch nach relevantem Kontext durchsuchen
- **Unterstützung mehrerer Modelle**: OpenAI, Anthropic, Google, Meta und andere KI-Modelle
- **Modellredundanz und Failover**: Vom Aufrufer definierte Failover-Ketten (primär + Fallbacks) mit Zeitüberschreitungen pro Versuch
- **OpenAI-kompatibler Endpunkt**: Richten Sie ein beliebiges OpenAI SDK auf `/api/external/v1` – keine Codeänderungen
- **Bildgenerierung**: Bilder mit Google Gemini 2.5 Flash Image erstellen und bearbeiten
- **Speech-to-Speech (S2S)**: Echtzeit-Sprachgespräche mithilfe der OpenAI Realtime API mit WebRTC
- **Sicherheitsrichtlinien**: SMLTP-Richtliniendurchsetzung, Prompt Shield pro Anruf und signierte Compliance-Belege
- **Webhooks**: Signierte Bereitstellung von Sicherheits- und Plattformereignissen in Echtzeit
- **Nutzungsverfolgung**: Umfassende Nutzungsüberwachung, Self-Service-Kontingent und Ratenbegrenzung
- **Wissensdatenbank-Integration**: Zugriff auf persönliche und gemeinsame Wissensdatenbanken
- **Benutzerverwaltung**: Vollständige Benutzer-, Gruppen- und Rollenverwaltungsfunktionen
- **Audit-Protokollierung**: Umfassende Aktivitäts- und Sicherheits-Audit-Protokolle

## Authentifizierung

Alle Endpunkte (außer Integritätsprüfung) erfordern eine API-Schlüsselauthentifizierung mithilfe eines Bearer-Tokens:

```bash
Authorization: Bearer sk-your-api-key-here
```

## Basis-URL

```
https://{customer.name}.hiperai.ai/api/external
```

Für die OpenAI-kompatible Oberfläche geben Sie die Basis-URL Ihres SDKs an:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## Abrechnung und Nutzung

Standardmäßig werden API-Anfragen dem Benutzerkonto in Rechnung gestellt, das den API-Schlüssel besitzt. Sie können einen anderen Benutzer für die Abrechnung angeben, indem Sie den Parameter `user_id` in Ihre Anfrage aufnehmen. Dies ermöglicht:

- Mandantenfähige Anwendungen mit Abrechnung pro Benutzer
- Flexibles Abschlusslimitmanagement
- Benutzerspezifische „Nutzung nach Modell“-Einstellungen

## Tarifbegrenzungen

- **Standard**: 60 Anfragen pro Minute, 1000 Anfragen pro Stunde
- **Tageslimits**: 100 Anfragen (konfigurierbar)
- **Monatliche Limits**: 10.000 Anfragen (konfigurierbar)

## Schnellstart

### 1. Gesundheitscheck

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. Verfügbare Modelle abrufen

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Erhalten Sie verfügbare Wissensdatenbanken

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Erstellen Sie einen Chat-Abschluss

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API-Endpunkte

### System
- [Health Check](/de/en/api/system/health) - API-Status prüfen

### Entdeckung
- [Verfügbare Modelle abrufen](/de/en/api/discovery/models) – Verfügbare KI-Modelle auflisten
- [Verfügbare Wissensdatenbanken abrufen](/de/en/api/discovery/indexes) - Verfügbare Wissensdatenbanken auflisten
- [Sicherheitsrichtlinien abrufen](/de/en/api/discovery/smltp-policies) - Verfügbare SMLTP-Richtlinien auflisten

### Chatten
- [Chat Completion](/de/en/api/chat/completions) – Haupt-KI-Chat-Endpunkt mit RAG
- [OpenAI-kompatibler Endpunkt](/de/en/api/chat/openai-kompatibel) - Drop-in `/v1/chat/completions` für OpenAI SDKs
- [Redundanz & Failover](/de/en/api/redundancy) - Failover-Ketten modellieren
- [Policy Check](/de/en/api/policy-check) - Führen Sie einen Probelauf der Sicherheitspipeline durch, ohne ein Modell aufzurufen
- [Nutzung](/de/en/api/usage) – Self-Service-Kontingent, Budget und Ratenlimits
- [Receipts](/de/en/api/receipts) - Signierte SMLTP-Konformitätsbelege abrufen

### Webhooks
- [Webhooks-Übersicht](/de/en/api/webhooks/overview) - Signierte Echtzeit-Ereigniszustellung
- [Webhook Events](/de/en/api/webhooks/events) - Eventkatalog und Payloads

### Bilder
- [Bilder generieren](/de/en/api/images/generations) - Bilder aus Text generieren oder vorhandene Bilder bearbeiten
- [Bilder bearbeiten](/de/en/api/images/edits) - Bild-zu-Bild-Bearbeitung mit Textanweisungen

### Sprache/S2S
- [S2S WebRTC-Sitzung initiieren](/de/en/api/speech/webrtc) - Sprachgespräche in Echtzeit aufbauen
- [S2S-Zeitstatus abrufen](/de/en/api/speech/status) - Überprüfen Sie das verbleibende S2S-Zeitkontingent
- [S2S-Sitzungsdauer protokollieren](/de/en/api/speech/log-session) - Sitzungsdauer und Abzugszeit protokollieren

### Benutzerverwaltung
- [Alle Benutzer abrufen](/de/en/api/users/list) - Benutzer mit Paginierung abrufen
- [Benutzer erstellen](/de/en/api/users/create) - Neues Benutzerkonto erstellen
- [Benutzer aktualisieren](/de/en/api/users/update) - Bestehenden Benutzer aktualisieren
- [Lizenzverfügbarkeit abrufen](/de/en/api/billing-modes/licenses-availability) - Lizenzpoollimits und -nutzung abrufen

### Indexverwaltung
- [Alle Indizes abrufen](/de/en/api/indexes/list) - Alle Wissensdatenbanken abrufen
- [Index erstellen](/de/en/api/indexes/create) - Neue Wissensdatenbank erstellen
- [Index aktualisieren](/de/en/api/indexes/update) - Bestehenden Index aktualisieren
- [Index mit Dokumenten trainieren](/de/en/api/indexes/train) - Index durch Hochladen von Dokumenten trainieren
- [Suchindex für Dokumente](/de/en/api/indexes/search) - Suche nach Dokumenten mittels semantischer Suche

### Gruppenmanagement
- [Alle Gruppen abrufen](/de/en/api/groups/list) - Alle Gruppen abrufen
- [Gruppe erstellen](/de/en/api/groups/create) - Neue Gruppe erstellen
- [Gruppe aktualisieren](/de/en/api/groups/update) - Bestehende Gruppe aktualisieren

### SMLTP-Sicherheit
- [Alle SMLTP-Richtlinien abrufen](/de/en/api/smltp/policies) - Alle Sicherheitsrichtlinien auflisten
- [Aktive Richtlinie abrufen](/de/en/api/smltp/active) - Aktuelle aktive Richtlinie abrufen
- [Benutzerdefinierte Richtlinie erstellen](/de/en/api/smltp/create) - Benutzerdefinierte SMLTP-Richtlinie erstellen
- [Audit-Logs](/de/en/api/smltp/audit-logs) – SMLTP-Audit-Logs abrufen

### Rollenverwaltung
- [Alle Rollen abrufen](/de/en/api/roles/list) - Alle Rollen abrufen
- [Rolle erstellen](/de/en/api/roles/create) - Neue benutzerdefinierte Rolle erstellen

## Fehlerbehandlung

### Fehlerantwortformat

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Ratenbegrenzungsfehler

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Allgemeine HTTP-Statuscodes

| Code | Beschreibung |
|------|-------------|
| `200` | Erfolg |
| `201` | Erfolgreich erstellt |
| `400` | Fehlerhafte Anfrage – ungültige Parameter |
| `401` | Nicht autorisiert – ungültiger API-Schlüssel |
| `403` | Verboten – unzureichende Berechtigungen |
| `404` | Nicht gefunden |
| `409` | Konflikt – Ressource existiert bereits |
| `413` | Nutzlast zu groß – Dateigröße überschritten |
| `429` | Ratenlimit überschritten |
| `500` | Interner Serverfehler |
| `503` | Dienst nicht verfügbar – Dienst nicht konfiguriert |

## SDK-Beispiele

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. Verfügbare Modelle abrufen

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Erhalten Sie verfügbare Wissensdatenbanken

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Erstellen Sie einen Chat-Abschluss

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API-Endpunkte

### System
- [Health Check](/de/en/api/system/health) - API-Status prüfen

### Entdeckung
- [Verfügbare Modelle abrufen](/de/en/api/discovery/models) – Verfügbare KI-Modelle auflisten
- [Verfügbare Wissensdatenbanken abrufen](/de/en/api/discovery/indexes) - Verfügbare Wissensdatenbanken auflisten
- [Sicherheitsrichtlinien abrufen](/de/en/api/discovery/smltp-policies) - Verfügbare SMLTP-Richtlinien auflisten

### Chatten
- [Chat Completion](/de/en/api/chat/completions) – Haupt-KI-Chat-Endpunkt mit RAG
- [OpenAI-kompatibler Endpunkt](/de/en/api/chat/openai-kompatibel) - Drop-in `/v1/chat/completions` für OpenAI SDKs
- [Redundanz & Failover](/de/en/api/redundancy) - Failover-Ketten modellieren
- [Policy Check](/de/en/api/policy-check) - Führen Sie einen Probelauf der Sicherheitspipeline durch, ohne ein Modell aufzurufen
- [Nutzung](/de/en/api/usage) – Self-Service-Kontingent, Budget und Ratenlimits
- [Receipts](/de/en/api/receipts) - Signierte SMLTP-Konformitätsbelege abrufen

### Webhooks
- [Webhooks-Übersicht](/de/en/api/webhooks/overview) - Signierte Echtzeit-Ereigniszustellung
- [Webhook Events](/de/en/api/webhooks/events) - Eventkatalog und Payloads

### Bilder
- [Bilder generieren](/de/en/api/images/generations) - Bilder aus Text generieren oder vorhandene Bilder bearbeiten
- [Bilder bearbeiten](/de/en/api/images/edits) - Bild-zu-Bild-Bearbeitung mit Textanweisungen

### Sprache/S2S
- [S2S WebRTC-Sitzung initiieren](/de/en/api/speech/webrtc) - Sprachgespräche in Echtzeit aufbauen
- [S2S-Zeitstatus abrufen](/de/en/api/speech/status) - Überprüfen Sie das verbleibende S2S-Zeitkontingent
- [S2S-Sitzungsdauer protokollieren](/de/en/api/speech/log-session) - Sitzungsdauer und Abzugszeit protokollieren

### Benutzerverwaltung
- [Alle Benutzer abrufen](/de/en/api/users/list) - Benutzer mit Paginierung abrufen
- [Benutzer erstellen](/de/en/api/users/create) - Neues Benutzerkonto erstellen
- [Benutzer aktualisieren](/de/en/api/users/update) - Bestehenden Benutzer aktualisieren
- [Lizenzverfügbarkeit abrufen](/de/en/api/billing-modes/licenses-availability) - Lizenzpoollimits und -nutzung abrufen

### Indexverwaltung
- [Alle Indizes abrufen](/de/en/api/indexes/list) - Alle Wissensdatenbanken abrufen
- [Index erstellen](/de/en/api/indexes/create) - Neue Wissensdatenbank erstellen
- [Index aktualisieren](/de/en/api/indexes/update) - Bestehenden Index aktualisieren
- [Index mit Dokumenten trainieren](/de/en/api/indexes/train) - Index durch Hochladen von Dokumenten trainieren
- [Suchindex für Dokumente](/de/en/api/indexes/search) - Suche nach Dokumenten mittels semantischer Suche

### Gruppenmanagement
- [Alle Gruppen abrufen](/de/en/api/groups/list) - Alle Gruppen abrufen
- [Gruppe erstellen](/de/en/api/groups/create) - Neue Gruppe erstellen
- [Gruppe aktualisieren](/de/en/api/groups/update) - Bestehende Gruppe aktualisieren

### SMLTP-Sicherheit
- [Alle SMLTP-Richtlinien abrufen](/de/en/api/smltp/policies) - Alle Sicherheitsrichtlinien auflisten
- [Aktive Richtlinie abrufen](/de/en/api/smltp/active) - Aktuelle aktive Richtlinie abrufen
- [Benutzerdefinierte Richtlinie erstellen](/de/en/api/smltp/create) - Benutzerdefinierte SMLTP-Richtlinie erstellen
- [Audit-Logs](/de/en/api/smltp/audit-logs) – SMLTP-Audit-Logs abrufen

### Rollenverwaltung
- [Alle Rollen abrufen](/de/en/api/roles/list) - Alle Rollen abrufen
- [Rolle erstellen](/de/en/api/roles/create) - Neue benutzerdefinierte Rolle erstellen

## Fehlerbehandlung

### Fehlerantwortformat

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Ratenbegrenzungsfehler

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Allgemeine HTTP-Statuscodes

| Code | Beschreibung |
|------|-------------|
| `200` | Erfolg |
| `201` | Erfolgreich erstellt |
| `400` | Fehlerhafte Anfrage – ungültige Parameter |
| `401` | Nicht autorisiert – ungültiger API-Schlüssel |
| `403` | Verboten – unzureichende Berechtigungen |
| `404` | Nicht gefunden |
| `409` | Konflikt – Ressource existiert bereits |
| `413` | Nutzlast zu groß – Dateigröße überschritten |
| `429` | Ratenlimit überschritten |
| `500` | Interner Serverfehler |
| `503` | Dienst nicht verfügbar – Dienst nicht konfiguriert |

## SDK-Beispiele

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Nächste Schritte

- [Knowledge Base & RAG](/de/en/indexes/overview) - Erfahren Sie mehr über Knowledge Bases und RAG
„