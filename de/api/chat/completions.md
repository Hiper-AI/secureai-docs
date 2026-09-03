---
sidebar_position: 1
title: "Chat-Abschluss"
openapi: "POST /chat/completions"
---
# Chat-Abschluss

Der Hauptendpunkt für KI-Chat-Abschlüsse mit optionalem Wissensdatenbankabruf (RAG), Modellredundanz/Failover, Sicherheitsrichtlinien pro Anruf und Streaming.

## Endpunkt

```
POST /chat/completions
```

## Beschreibung

Der Hauptendpunkt für KI-Chat-Abschlüsse mit optionalem Wissensdatenbankabruf (RAG). Es unterstützt:

- **Zwei Eingabeformulare** – eine einzelne `prompt`-Zeichenfolge (Legacy) **oder** ein `messages`-Array im OpenAI-Stil.
- **Modellredundanz** – eine vom Aufrufer definierte Failover-Kette (primär + bis zu 2 Fallbacks). Siehe [Redundanz & Failover](/de/en/api/redundancy).
- **Sicherheit pro Anruf** – SMLTP-Richtlinienauswahl und eine Inline-Prompt-Shield-Überschreibung.
- **Streaming** – Vom Server gesendete Ereignisse (SSE).
- **Signierte Quittungen** – eine SMLTP-Compliance-Quittungsreferenz für über das Gateway weitergeleitete Antworten.

<Tip>
**OpenAI SDK-Kompatibilität**

Wenn Sie SecureAI mit **null Codeänderungen** in eine bestehende OpenAI-Integration integrieren möchten, verwenden Sie stattdessen den [OpenAI-kompatiblen Endpunkt](/de/en/api/chat/openai-kompatibel) unter `/api/external/v1/chat/completions`. Dieser klassische Endpunkt ist der einzige, der RAG unterstützt.
</Tip>

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Kopfzeilen

| Kopfzeile | Erforderlich | Beschreibung |
|--------|----------|-------------|
| `Authorization` | Ja | `Bearer sk-...` |
| `Content-Type` | Ja | `application/json` |
| `Idempotency-Key` | Nein | Ein eindeutiger Schlüssel, der dafür sorgt, dass ein Abschluss-POST sicher wiederholt werden kann. Wenn Sie eine Anfrage mit demselben Schlüssel wiederholen, wird das ursprüngliche Ergebnis zurückgegeben, anstatt dass eine doppelte Abrechnung erfolgt. |

## Anforderungstext

### Eingabeparameter

Geben Sie **entweder** `prompt` **oder** `messages` an – nicht beides.

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `prompt` | Zeichenfolge | Bedingt | Benutzernachricht (altes Single-Turn-Formular). |
| `messages` | Array | Bedingt | Array im OpenAI-Stil von `{ role, content }`. `role` ist `system`, `user` oder `assistant`. Höchstens eine `system`-Nachricht und nur als erster Eintrag. Maximal 100 Nachrichten, 256 KB Gesamtinhalt. |
| `system_message` | Zeichenfolge | Nein | Benutzerdefinierte Systemaufforderung (alt). Kann nicht mit einer bandinternen `system`-Rolle in `messages` kombiniert werden. |

### Modell- und Redundanzparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `model` | Zeichenfolge | Bedingt | KI-Modell (z. B. `"openai/gpt-5-nano"`). Erforderlich, sofern nicht `models` angegeben wird. |
| `models` | Array | Nein | Explizite Failover-Kette (überschreibt `model`). Bis zu 3 verschiedene Einträge; Jeder Eintrag ist eine Modellzeichenfolge oder `{ model, timeout_ms, first_token_timeout_ms }`. |
| `fallback_models` | Array | Nein | Nach `model` angehängte Fallbacks. Nicht kombinierbar mit `models`. |
| `redundancy` | Objekt | Nein | Kettenweite Optionen: `{ timeout_ms, first_token_timeout_ms, on: [...] }`. Siehe [Redundanz & Failover](/de/en/api/redundancy). |

### Parameter zum Abrufen und Generieren

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `index` | Zeichenfolge | **Ja** | Name der abzufragenden Wissensdatenbank. Verwenden Sie `"Zero-Knowledge"` für direkte KI ohne RAG. Dieses Feld ist erforderlich – eine Anfrage ohne `index` gibt `400 "Index required"` zurück. |
| `use_rag` | boolescher Wert | Nein | Wissensabruf aktivieren (Standard: `true`). Durch die Einstellung von `use_rag: false` wird die Anforderung `index` **nicht** aufgehoben – senden Sie `index: "Zero-Knowledge"`. |
| `smltp_policy` | Zeichenfolge | Nein | Sicherheitsrichtlinie (`"internal"`, `"public"`, `"confidential"` oder eine benutzerdefinierte Mandantenrichtlinie). |
| `prompt_shield` | Objekt | Nein | Prompt Shield-Steuerung pro Anruf: `{ enabled?: boolean, policy?: string }`. Siehe [Prompt Shield API](/de/en/api/threat-defense/prompt-shield#per-call-control-on-completions). |
| `temperature` | Zahl | Nein | Zufälligkeitskontrolle (0–2, Standard: 0,7). |
| `max_tokens` | Ganzzahl | Nein | Maximale Antworttokens (Standard: 1000, begrenzt auf 4000). |
| `stream` | boolescher Wert | Nein | Streamen Sie die Antwort als SSE (Standard: `false`). |
| `conversation_id` | Zeichenfolge | Nein | Optionale Konversations-ID zur Nachverfolgung. |
| `user_id` | Zeichenfolge | Nein | MongoDB ObjectId des Benutzers, dem diese Anfrage in Rechnung gestellt werden soll (admin-gated; siehe [Billing Modes](/de/en/api/billing-modes)). |

## Beispiel für Anfrage

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-4821-summary" \
  -d '{
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "What is the company policy on remote work?" }
    ],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "redundancy": { "timeout_ms": 30000, "on": ["timeout", "server_error", "rate_limit"] },
    "index": "Zero-Knowledge",
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "id": "req-abc123",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the company's remote work policy..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350,
    "input_tokens": 150,
    "output_tokens": 200
  },
  "metadata": {
    "conversation_id": "conv-123",
    "index_used": "Zero-Knowledge",
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "served_model": "openai/gpt-5-nano",
    "requested_model": "openai/gpt-5-nano",
    "rag_enabled": true,
    "documents_retrieved": 0,
    "sources": []
  }
}
```

### Metadatenobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `conversation_id` | Zeichenfolge | Konversations-ID (echo oder generiert). |
| `index_used` | Zeichenfolge | Verwendete Wissensdatenbank. |
| `smltp_policy_used` | Zeichenfolge | Name der angewendeten SMLTP-Richtlinie. |
| `smltp_policy_source` | Zeichenfolge | Woher die Richtlinie stammt (`request`, Schlüsselstandard usw.). |
| `smltp_policy_hash` | Zeichenfolge \| null | Hash der angewendeten Richtlinie zur Überprüfung. |
| `prompt_shield_policy` | Objekt \| null | Sofern vorhanden, gilt für diesen Anruf die Prompt Shield-Richtlinie. |
| `served_model` | Zeichenfolge | Modell, das tatsächlich die Antwort lieferte. |
| `requested_model` | Zeichenfolge | Erstes Modell in der gewünschten Kette. |
| `failover` | Objekt | **Nur vorhanden, wenn eine Multi-Modell-Kette ausgeführt wurde.** `{ occurred, attempts[] }` – siehe [Redundancy & Failover](/de/en/api/redundancy). |
| `smltp` | Objekt | Vorhanden, wenn eine SMLTP-Berechtigung für den Anruf erstellt wird. `{ bundle_id, receipt_url }`. Der `bundle_id` (eine Berechtigungs-ID, z. B. `jti-…`) wird auch bei nativen/direkten Bereitstellungen zurückgegeben; Die signierte Quittung unter `receipt_url` ist nur abrufbar, wenn der Datenverkehr über das SMLTP-Gateway geleitet wird (andernfalls gibt [Receipts](/de/en/api/receipts) `404` zurück). |
| `rag_enabled` | boolescher Wert | Ob RAG verwendet wurde. |
| `documents_retrieved` | Ganzzahl | Anzahl der abgerufenen Dokumente. |
| `sources` | Array | Bis zu 3 abgerufene Dokumentquellen `{ source, score }`. |

## Streaming

Legen Sie `"stream": true` fest, um vom Server gesendete Ereignisse zu empfangen. Jede SSE-Zeile ist `data: <json>` und der Stream endet mit `data: [DONE]`. Frames werden über ein `type`-Feld eingegeben:

| Rahmen `type` | Nutzlast |
|--------------|---------|
| `metadata` | Der Antwortumschlag (`id`, `object`, `created`, `model` = Serving-Modell und das `metadata`-Objekt oben). Zuerst gesendet. |
| `chunk` | Ein inkrementelles Delta: `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`. |
| `usage` | Endgültige Token-Nutzung. |
| `error` | Eine Unterbrechung des Providers in der Mitte des Streams (nach dem ersten Token ist kein Failover mehr möglich). |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Verboten

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429/502 – Redundanzkette erschöpft

Wenn jedes Modell in einer Redundanzkette ausfällt, meldet die Antwort jeden Versuch. Der Status ist `429`, wenn alle Fehler Ratengrenzen waren, andernfalls `502`.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 2 model attempt(s) failed (last: anthropic/claude-sonnet-4 — server_error)",
  "request_id": "req-abc123",
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30012 },
    { "model": "anthropic/claude-sonnet-4", "status": "failed", "reason": "server_error", "latency_ms": 812 }
  ]
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Beispielverwendung

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is the company policy on remote work?' }],
    model: 'openai/gpt-5-nano',
    fallback_models: ['anthropic/claude-sonnet-4'],
    smltp_policy: 'internal',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log('Served by:', data.metadata.served_model);
console.log('Response:', data.choices[0].message.content);
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
    "messages": [{"role": "user", "content": "What is the company policy on remote work?"}],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("Served by:", result["metadata"]["served_model"])
print("Response:", result["choices"][0]["message"]["content"])
```

## Notizen

- `index` ist erforderlich. Senden Sie `index: "Zero-Knowledge"` für direkte KI-Antworten ohne RAG.
– Der Parameter `user_id` rechnet die Anfrage einem anderen Benutzerkonto (administriert) zu.
- Die Temperatur wird auf 0–2 gehalten; `max_tokens` ist auf 4000 begrenzt.
- Um eine Anfrage anhand jeder Richtlinie zu validieren, **ohne** ein Modell aufzurufen oder Punkte auszugeben, verwenden Sie [Policy Check](/de/en/api/policy-check).
- Zur Semantik der Failover-Kette (Trigger, Timeouts, Streaming-Verhalten, Erschöpfungsstatuscodes) siehe [Redundancy & Failover](/de/en/api/redundancy).