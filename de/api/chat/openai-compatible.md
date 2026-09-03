---
sidebar_position: 2
title: "OpenAI-kompatibler Endpunkt"
sidebar_label: "OpenAI-kompatibel"
description: "Drop-in-OpenAI-Chat-Completions-Oberfläche – richten Sie jedes OpenAI-SDK auf SecureAI"
openapi: "POST /v1/chat/completions"
---
# OpenAI-kompatibler Endpunkt

SecureAI stellt eine OpenAI-kompatible Oberfläche bereit, sodass Sie **jedes OpenAI SDK integrieren können, indem Sie nur die Basis-URL und den API-Schlüssel ändern** – keine Codeänderungen. Darunter läuft der vollständige SecureAI-Sicherheitsstack (API-Schlüsselauthentifizierung, Modell-/Index-Zulassungslisten, SMLTP-Richtliniendurchsetzung + Berechtigungen, Prompt Shield, PII/DLP, Punkteabrechnung und die [Modellredundanz-Engine](/de/en/api/redundancy)).

## Endpunkt

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

Richten Sie den `base_url` Ihres OpenAI-Clients auf:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**Nur Zero-Knowledge**

Diese Oberfläche unterstützt RAG/Wissensdatenbanken **nicht**. Anfragen werden an `Zero-Knowledge` angeheftet. Wenn Sie den Abruf einer Wissensdatenbank benötigen, verwenden Sie den klassischen Endpunkt [Chat Completion](/de/en/api/chat/completions).
</Info>

## Authentifizierung

```bash
Authorization: Bearer sk-your-api-key-here
```

## Verwendung eines OpenAI SDK

### Python (`openai`)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key-here",
    base_url="https://{customer.name}.hiperai.ai/api/external/v1",
)

resp = client.chat.completions.create(
    model="openai/gpt-5-nano",
    messages=[{"role": "user", "content": "Hello!"}],
    # SecureAI extensions travel via extra_body
    extra_body={
        "smltp_policy": "internal",
        "fallback_models": ["anthropic/claude-sonnet-4"],
    },
)
print(resp.choices[0].message.content)
print(resp.model_extra["secureai"]["served_model"])
```

### JavaScript (`openai`)

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-your-api-key-here',
  baseURL: 'https://{customer.name}.hiperai.ai/api/external/v1',
});

const resp = await client.chat.completions.create({
  model: 'openai/gpt-5-nano',
  messages: [{ role: 'user', content: 'Hello!' }],
  // @ts-expect-error — SecureAI extension fields
  smltp_policy: 'internal',
  fallback_models: ['anthropic/claude-sonnet-4'],
});
console.log(resp.choices[0].message.content);
```

## Anforderungstext

Standard-OpenAI-Felder werden unterstützt. `messages` ist erforderlich (auf dieser Oberfläche gibt es kein `prompt`). `max_completion_tokens` wird als Alias ​​für `max_tokens` akzeptiert.

Die folgenden OpenAI-Parameter werden unverändert an den Anbieter weitergegeben:

`tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `stop`, `top_p`, `frequency_penalty`, `presence_penalty`, `seed`, `logprobs`, `top_logprobs`, `user`.

### SecureAI-Erweiterungsfelder

Senden Sie diese als zusätzliche Textfelder (über `extra_body` in den OpenAI SDKs):

| Feld | Beschreibung |
|-------|-------------|
| `smltp_policy` | SMLTP-Sicherheitsrichtlinie für diesen Anruf. |
| `prompt_shield` | `{ enabled?, policy? }` – Prompt Shield-Überschreibung pro Anruf. |
| `models` / `fallback_models` | Modellieren Sie die [Redundanz](/de/en/api/redundancy)-Kette. |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`. |
| `user_id` | Abrechnung an einen anderen Benutzer (administriert). |

## Antwort

Standard-OpenAI-Form `chat.completion` plus ein `secureai`-Erweiterungsobjekt.

```json
{
  "id": "chatcmpl-1a2b3c...",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "anthropic/claude-sonnet-4",
  "choices": [
    { "index": 0, "message": { "role": "assistant", "content": "Hello!" }, "finish_reason": "stop" }
  ],
  "usage": { "prompt_tokens": 9, "completion_tokens": 3, "total_tokens": 12 },
  "secureai": {
    "served_model": "anthropic/claude-sonnet-4",
    "requested_model": "openai/gpt-5-nano",
    "failover": { "occurred": true, "attempts": [ ... ] },
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "smltp_bundle_id": "bnd_..."
  }
}
```

`secureai.smltp_bundle_id` (falls vorhanden) kann gegen eine unterschriebene Compliance-[Receipt](/de/en/api/receipts) eingetauscht werden.

### Streaming

Stellen Sie `stream: true` ein. Frames sind native OpenAI-Objekte `chat.completion.chunk`, die durch `data: [DONE]` beendet werden. Die Erweiterung `secureai` ist an den **ersten** Block angehängt. `choices` (einschließlich `tool_calls` Deltas und `finish_reason`) passieren unberührt.

## Fehler

Fehler von diesem Handler verwenden den OpenAI-Umschlag:

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

Wenn eine gesamte Redundanzkette ausfällt, verwendet der Fehler `code: "all_models_failed"` und den Status `429` (alle Ratenbegrenzungen) oder `502` (andernfalls). Die Ablehnung von Sicherheits-Middleware behält die Form von SecureAI `{ "success": false, ... }`; beide tragen immer ein `message`.

## Verwandte

- [Chat Completion](/de/en/api/chat/completions) – die klassische Oberfläche (fügt RAG hinzu).
- [Redundanz & Failover](/de/en/api/redundancy)
- [Prompt Shield API](/de/en/api/threat-defense/prompt-shield)