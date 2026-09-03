---
sidebar_position: 1
title: "Verfügbare Modelle"
openapi: "GET /models"
---
# Verfügbare Modelle abrufen

Rufen Sie verfügbare KI-Modelle basierend auf Ihren API-Schlüsselberechtigungen und Ihrer Benutzerlizenz ab.

## Endpunkt

```
GET /models
```

## Beschreibung

Rufen Sie verfügbare KI-Modelle basierend auf Ihren API-Schlüsselberechtigungen und Ihrer Benutzerlizenz ab.

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung | Beispiel |
|-----------|------|----------|-------------|---------|
| `provider` | Zeichenfolge | Nein | Modelle nach Anbieter filtern | `"openai"` |

## Anfrage

### Grundlegende Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Nach Anbieter filtern

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "models": [
    {
      "id": "openai/gpt-5-nano",
      "name": "openai/gpt-5-nano",
      "provider": "openai"
    },
    {
      "id": "anthropic/claude-sonnet-4.6",
      "name": "anthropic/claude-sonnet-4.6",
      "provider": "anthropic"
    }
  ],
  "user_license": "Pro",
  "restrictions": {
    "allowed_models": "all"
  },
  "filters": {
    "provider": "openai"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr | `true` |
| `models` | Array | Liste der verfügbaren Modelle | Siehe Beispiel |
| `user_license` | Zeichenfolge | Lizenzstufe des Benutzers | `"Pro"` |
| `restrictions` | Objekt | Modellzugriffsbeschränkungen | Siehe Beispiel |
| `filters` | Objekt | Angewandte Filter | Siehe Beispiel |

### Modellobjekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `id` | Zeichenfolge | Eindeutige Modellkennung | `"openai/gpt-5-nano"` |
| `name` | Zeichenfolge | Modellanzeigename | `"openai/gpt-5-nano"` |
| `provider` | Zeichenfolge | Modellanbieter | `"openai"` |

### Restrictions-Objekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `allowed_models` | Zeichenfolge | Modellzugriffsebene | `"all"` |

### Filtert Objekt

| Feld | Geben Sie | ein Beschreibung | Beispiel |
|-------|------|-------------|---------|
| `provider` | Zeichenfolge | Angewandter Anbieterfilter | `"openai"` |

## Fehlerantworten

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 Ratenlimit überschritten

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Beispielverwendung

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/models', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Models:', data.models);
console.log('User License:', data.user_license);
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', headers=headers)
data = response.json()

print('Available Models:', data['models'])
print('User License:', data['user_license'])
```

### Nach Anbieter filtern

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'provider': 'openai'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', 
                      headers=headers, params=params)
data = response.json()

print('OpenAI Models:', data['models'])
```

### cURL

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## LLM-Buckets (aktuell)

Das Chat-System klassifiziert Modelle in zwei Ausführungsbereiche:

- `standard` Eimer
- `premium` Eimer

Diese Referenz basiert auf der aktiven Backend-Bucket-Zuordnung.

### Standardeimer

- `openai/gpt-oss-120b`
- `openai/gpt-5-nano`
- `google/gemini-3.1-flash-lite-preview`
- `google/gemini-3-flash-preview`
- `deepseek/deepseek-r1-distill-llama-70b`
- `deepseek/deepseek-r1`
- `deepseek/deepseek-v3.2`
- `meta-llama/llama-3.3-70b-instruct`
- `meta-llama/llama-4-maverick`
- `meta-llama/llama-4-scout`
- `mistralai/mistral-7b-instruct`
- `mistralai/mistral-nemo`
- `mistralai/ministral-14b-2512`
- `mistralai/mistral-large-2512`
- `x-ai/grok-3-mini`
- `qwen/qwen3-235b-a22b-2507`
- `qwen/qwen3-coder`
- `qwen/qwen3-coder-next`
- `qwen/qwen3.5-397b-a17b`

### Premium-Eimer

- `anthropic/claude-3.7-sonnet`
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-opus-4.6`
- `openai/o4-mini-high`
- `openai/o4-mini`
- `openai/gpt-5.2`
- `openai/gpt-5.3-codex`
- `openai/gpt-5.1`
- `google/gemini-3.1-pro-preview`
- `x-ai/grok-4`

## Verfügbare Anbieter

- **OpenAI**
- **Anthropisch**
- **Google**
- **Meta**
- **Mistral**
- **DeepSeek**
- **xAI**
- **Qwen**

## Notizen

- Die verfügbaren Modelle hängen von Ihrer Abonnementstufe ab
- Einige Modelle können aufgrund Ihrer Lizenz eingeschränkt sein
- Verwenden Sie den Anbieterfilter, um Modelle von bestimmten Anbietern zu erhalten
- Die Antwort enthält Ihre aktuelle Lizenzstufe und Einschränkungen 
- API-Schlüsselbeschränkungen (`allowedModels`) können die Modellliste weiter reduzieren