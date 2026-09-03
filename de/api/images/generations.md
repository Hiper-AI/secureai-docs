---
sidebar_position: 1
title: "Bilder generieren"
openapi: "POST /images/generations"
---
# Bilder generieren

Generieren Sie neue Bilder aus Textaufforderungen oder transformieren Sie vorhandene Bilder mit Google Gemini 2.5 Flash Image.

## Endpunkt

```
POST /images/generations
```

## Beschreibung

Generieren Sie neue Bilder aus Textbeschreibungen oder transformieren Sie vorhandene Bilder. Dieser Endpunkt unterstützt:

- **Text-to-Image**: Bilder aus Textbeschreibungen generieren
- **Bild-zu-Bild**: Vorhandene Bilder transformieren oder bearbeiten (Bilddatei hochladen)

Alle Eingabeaufforderungen und Antworten werden zur Auditprotokollierung und Compliance automatisch über SMLTP verarbeitet.

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

Dieser Endpunkt akzeptiert sowohl die Formate `multipart/form-data` (für Datei-Uploads) als auch `application/json`.

### Parameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `prompt` | Zeichenfolge | Ja | Textaufforderung, die das zu generierende Bild oder die Transformation des hochgeladenen Bildes beschreibt (1-4000 Zeichen) |
| `image` | binär | Nein | Bilddatei für die Bild-zu-Bild-Generierung (JPEG, PNG, WEBP oder GIF, max. 10 MB) |
| `smltp_policy` | Zeichenfolge | Nein | SMLTP-Sicherheitsrichtlinie (Standard: „intern“) |
| `response_format` | Zeichenfolge | Nein | Antwortformat: „url“ oder „b64_json“ (Standard: „url“) |
| `size` | Zeichenfolge | Nein | Bildgröße (Standard: „1024x1024“) |
| `n` | Ganzzahl | Nein | Anzahl der zu generierenden Bilder (1-4, Standard: 1) |

## Beispiele anfordern

### Text-zu-Bild (JSON)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
  }'
```

### Bild-zu-Bild (mehrteilige Formulardaten)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
// Text-to-Image
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over the ocean with mountains in the background, digital art style',
    smltp_policy: 'internal',
    response_format: 'url',
    n: 1
  })
});

const data = await response.json();
console.log('Generated image URL:', data.data[0].url);

// Image-to-Image
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response2 = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data2 = await response2.json();
console.log('Edited image URL:', data2.data[0].url);
```

### Python

```python
import requests

# Text-to-Image
url = "https://{customer.name}.hiperai.ai/api/external/images/generations"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Generated image URL:', result['data'][0]['url'])

# Image-to-Image
with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers={'Authorization': 'Bearer sk-your-api-key-here'}, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3",
  "object": "image.generation",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_68c5c6d2d57c85b102eb05e2_90d3756f_0.png",
      "revised_prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": false,
    "text_response": null,
    "smltp_trace_id": "trx-220eca66-5e3a-4a72-886b-e6ba8cde18a6",
    "smltp_bundle_id": "jti-bb850e61-fbfe-412a-8b0d-d180d4a36d22",
    "smltp_policy": "internal"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr |
| `id` | Zeichenfolge | Eindeutiger Anforderungsbezeichner |
| `object` | Zeichenfolge | Objekttyp: „image.generation“ |
| `created` | Ganzzahl | Unix-Zeitstempel, wann Bilder erstellt wurden |
| `data` | Array | Array generierter Bilder |
| `metadata` | Objekt | Zusätzliche Metadaten einschließlich SMLTP-Tracking |

### Bildobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `url` | Zeichenfolge | URL für den Zugriff auf das generierte Bild (wenn Antwortformat „URL“ ist) |
| `b64_json` | Zeichenfolge | Base64-codierte Bilddaten (wenn das Antwortformat „b64_json“ ist) |
| `revised_prompt` | Zeichenfolge | Der tatsächlich zur Generierung verwendete Prompt (kann von der Eingabe abweichen) |

### Metadatenobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `model` | Zeichenfolge | Verwendetes Modell: „google/gemini-2.5-flash-image-preview“ |
| `provider` | Zeichenfolge | Anbieter: „Google“ |
| `total_images` | Ganzzahl | Gesamtzahl der generierten Bilder |
| `is_image_to_image` | boolescher Wert | Ob es sich um eine Bild-zu-Bild-Generierung handelte |
| `text_response` | string\|null | Optionale Textantwort vom Modell |
| `smltp_trace_id` | Zeichenfolge | SMLTP-Trace-ID für Audit-Tracking |
| `smltp_bundle_id` | Zeichenfolge | SMLTP-Bundle-ID für Audit-Tracking |
| `smltp_policy` | Zeichenfolge | SMLTP-Richtlinie, die angewendet wurde |

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
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
  "message": "SMLTP policy not allowed"
}
```

### 413 Nutzlast zu groß

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 Dienst nicht verfügbar

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## Notizen

- Unterstützte Bildformate zum Hochladen: JPEG, PNG, WEBP, GIF
- Maximale Dateigröße: 10 MB pro Bild
- Beim Hochladen eines Bildes wird in der Eingabeaufforderung beschrieben, wie es transformiert wird
- Gemini generiert normalerweise 1–4 Bilder pro Anfrage
- Alle Anfragen werden aus Sicherheits- und Compliance-Gründen über SMLTP verarbeitet
- Verwenden Sie `response_format: "b64_json"`, um Base64-codierte Bilddaten anstelle von URLs zu empfangen