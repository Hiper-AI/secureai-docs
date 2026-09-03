---
sidebar_position: 2
title: "Bilder bearbeiten"
openapi: "POST /images/edits"
---
# Bilder bearbeiten

Bearbeiten Sie vorhandene Bilder mit Google Gemini 2.5 Flash Image mit Textanweisungen.

## Endpunkt

```
POST /images/edits
```

## Beschreibung

Bearbeiten Sie vorhandene Bilder mit Google Gemini 2.5 Flash Image mit Textanweisungen. Dieser Endpunkt ist speziell für die **Bild-zu-Bild-Bearbeitung** konzipiert, wobei:

- Eine Bilddatei ist **erforderlich** (im Gegensatz zu `/images/generations`, wo sie optional ist)
- Eine Textaufforderung beschreibt, wie das Bild bearbeitet oder transformiert wird
- Das bearbeitete Bild wird mit den gleichen Qualitäts- und Formatoptionen zurückgegeben

Alle Eingabeaufforderungen und Antworten werden zur Auditprotokollierung und Compliance automatisch über SMLTP verarbeitet.

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

Dieser Endpunkt akzeptiert das Format `multipart/form-data`.

### Parameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `prompt` | Zeichenfolge | Ja | Textanweisungen, die beschreiben, wie das hochgeladene Bild bearbeitet oder transformiert wird (1-4000 Zeichen) |
| `image` | binär | Ja | Bilddatei zum Bearbeiten (JPEG, PNG, WEBP oder GIF, max. 10 MB) |
| `smltp_policy` | Zeichenfolge | Nein | SMLTP-Sicherheitsrichtlinie (Standard: „intern“) |
| `response_format` | Zeichenfolge | Nein | Antwortformat: „url“ oder „b64_json“ (Standard: „url“) |

## Beispiele anfordern

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/edits" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky and enhance the overall atmosphere" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky and enhance the overall atmosphere');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/edits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Edited image URL:', data.data[0].url);
```

### Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/images/edits"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky and enhance the overall atmosphere',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers=headers, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806",
  "object": "image.edit",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_edit_68c5c6d2d57c85b102eb05e2_f55bb4aa_0.png",
      "revised_prompt": "Add dramatic sunset colors to the sky and enhance the overall atmosphere"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": true,
    "text_response": null,
    "smltp_trace_id": "trx-6caec994-73af-4f2c-9e13-572d53262f2a",
    "smltp_bundle_id": "jti-26464307-d455-4a3d-9ca4-8ec144cb601c",
    "smltp_policy": "internal"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr |
| `id` | Zeichenfolge | Eindeutiger Anforderungsbezeichner |
| `object` | Zeichenfolge | Objekttyp: „image.edit“ |
| `created` | Ganzzahl | Unix-Zeitstempel, wann das Bild bearbeitet wurde |
| `data` | Array | Array bearbeiteter Bilder |
| `metadata` | Objekt | Zusätzliche Metadaten einschließlich SMLTP-Tracking |

### Bildobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `url` | Zeichenfolge | URL für den Zugriff auf das bearbeitete Bild (wenn das Antwortformat „URL“ ist) |
| `b64_json` | Zeichenfolge | Base64-codierte Bilddaten (wenn das Antwortformat „b64_json“ ist) |
| `revised_prompt` | Zeichenfolge | Die tatsächlich zum Bearbeiten verwendete Eingabeaufforderung (kann von der Eingabe abweichen) |

### Metadatenobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `model` | Zeichenfolge | Verwendetes Modell: „google/gemini-2.5-flash-image-preview“ |
| `provider` | Zeichenfolge | Anbieter: „Google“ |
| `total_images` | Ganzzahl | Gesamtzahl der Bilder (immer 1 für Bearbeitungen) |
| `is_image_to_image` | boolescher Wert | Für diesen Endpunkt immer wahr |
| `text_response` | string\|null | Optionale Textantwort vom Modell |
| `smltp_trace_id` | Zeichenfolge | SMLTP-Trace-ID für Audit-Tracking |
| `smltp_bundle_id` | Zeichenfolge | SMLTP-Bundle-ID für Audit-Tracking |
| `smltp_policy` | Zeichenfolge | SMLTP-Richtlinie, die angewendet wurde |

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 Dienst nicht verfügbar

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## Notizen

- Unterstützte Bildformate: JPEG, PNG, WEBP, GIF
- Maximale Dateigröße: 10 MB pro Bild
– Die Bilddatei ist für diesen Endpunkt **erforderlich** (im Gegensatz zu `/images/generations`)
- Die Eingabeaufforderung beschreibt, wie das hochgeladene Bild bearbeitet oder transformiert wird
- Alle Anfragen werden aus Sicherheits- und Compliance-Gründen über SMLTP verarbeitet
- Verwenden Sie `response_format: "b64_json"`, um Base64-codierte Bilddaten anstelle von URLs zu empfangen