---
sidebar_position: 1
title: "Generación de Imágenes"
openapi: "POST /images/generations"
sidebar_label: "Generar Imágenes"
---

# Generar imágenes

Genere nuevas imágenes a partir de mensajes de texto o transforme imágenes existentes utilizando Google Gemini 2.5 Flash Image.

## Endpoint

```
POST /images/generations
```

## Descripción

Genere nuevas imágenes a partir de descripciones de texto o transforme imágenes existentes. Este endpoint admite:

- **Texto a imagen**: genera imágenes a partir de descripciones de texto
- **Imagen a imagen**: transforma o edita imágenes existentes (carga un archivo de imagen)

Todas las indicaciones y respuestas se procesan automáticamente a través de SMLTP para el registro de auditoría y el cumplimiento.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

Este endpoint acepta los formatos `multipart/form-data` (para carga de archivos) y `application/json`.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `prompt` | cadena | Sí | Mensaje de texto que describe la imagen a generar o cómo transformar la imagen cargada (1-4000 caracteres) |
| `image` | binario | No | Archivo de imagen para generación de imagen a imagen (JPEG, PNG, WEBP o GIF, máximo 10 MB) |
| `smltp_policy` | cadena | No | Política de seguridad SMLTP (predeterminada: "interna") |
| `response_format` | cadena | No | Formato de respuesta: "url" o "b64_json" (predeterminado: "url") |
| `size` | cadena | No | Tamaño de imagen (predeterminado: "1024x1024") |
| `n` | entero | No | Número de imágenes a generar (1-4, predeterminado: 1) |

## Ejemplos de solicitudes

### Texto a imagen (JSON)

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

### Imagen a imagen (datos de formulario de varias partes)

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

### Pitón

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

## Respuesta

### Respuesta exitosa (200)

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

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas |
| `id` | cadena | Identificador de solicitud único |
| `object` | cadena | Tipo de objeto: "imagen.generación" |
| `created` | entero | Marca de tiempo Unix de cuando se crearon las imágenes |
| `data` | matriz | Matriz de imágenes generadas |
| `metadata` | objeto | Metadatos adicionales, incluido el seguimiento SMLTP |

### Objeto de imagen

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `url` | cadena | URL para acceder a la imagen generada (cuando el formato_respuesta es "url") |
| `b64_json` | cadena | Datos de imagen codificados en Base64 (cuando el formato_respuesta es "b64_json") |
| `revised_prompt` | cadena | El mensaje realmente utilizado para la generación (puede diferir de la entrada) |

### Objeto de metadatos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `model` | cadena | Modelo utilizado: "google/gemini-2.5-flash-image-preview" |
| `provider` | cadena | Proveedor: "Google" |
| `total_images` | entero | Número total de imágenes generadas |
| `is_image_to_image` | booleano | Si se trató de una generación de imagen a imagen |
| `text_response` | cadena\|nulo | Respuesta de texto opcional del modelo |
| `smltp_trace_id` | cadena | ID de seguimiento SMLTP para seguimiento de auditoría |
| `smltp_bundle_id` | cadena | ID de paquete SMLTP para seguimiento de auditorías |
| `smltp_policy` | cadena | Política SMLTP que se aplicó |

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Prohibido

```json
{
  "success": false,
  "error": "Access denied",
  "message": "SMLTP policy not allowed"
}
```

### 413 Carga útil demasiado grande

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### Servicio 503 no disponible

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## Notas

- Formatos de imagen admitidos para cargar: JPEG, PNG, WEBP, GIF
- Tamaño máximo de archivo: 10 MB por imagen
- Al cargar una imagen, el mensaje describe cómo transformarla
- Gemini normalmente genera de 1 a 4 imágenes por solicitud
- Todas las solicitudes se procesan a través de SMLTP por motivos de seguridad y cumplimiento.
- Utilice `response_format: "b64_json"` para recibir datos de imágenes codificados en base64 en lugar de URL