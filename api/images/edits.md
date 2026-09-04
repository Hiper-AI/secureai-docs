---
sidebar_position: 2
title: "Edición de Imágenes"
openapi: "POST /images/edits"
sidebar_label: "Editar Imágenes"
---

# Editar imágenes

Edite imágenes existentes utilizando Google Gemini 2.5 Flash Image con instrucciones de texto.

## Endpoint

```
POST /images/edits
```

## Descripción

Edite imágenes existentes utilizando Google Gemini 2.5 Flash Image con instrucciones de texto. Este endpoint está diseñado específicamente para **edición de imagen a imagen** donde:

- Un archivo de imagen es **obligatorio** (a diferencia de `/images/generations` donde es opcional)
- Un mensaje de texto describe cómo editar o transformar la imagen.
- La imagen editada se devuelve con la misma calidad y opciones de formato.

Todas las indicaciones y respuestas se procesan automáticamente a través de SMLTP para el registro de auditoría y el cumplimiento.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

Este endpoint acepta el formato `multipart/form-data`.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `prompt` | cadena | Sí | Instrucciones de texto que describen cómo editar o transformar la imagen cargada (1-4000 caracteres) |
| `image` | binario | Sí | Archivo de imagen para editar (JPEG, PNG, WEBP o GIF, máximo 10 MB) |
| `smltp_policy` | cadena | No | Política de seguridad SMLTP (predeterminada: "interna") |
| `response_format` | cadena | No | Formato de respuesta: "url" o "b64_json" (predeterminado: "url") |

## Ejemplos de solicitudes

### rizo

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

### Pitón

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

## Respuesta

### Respuesta exitosa (200)

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

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas |
| `id` | cadena | Identificador de solicitud único |
| `object` | cadena | Tipo de objeto: "imagen.edit" |
| `created` | entero | Marca de tiempo Unix de cuando se editó la imagen |
| `data` | matriz | Conjunto de imágenes editadas |
| `metadata` | objeto | Metadatos adicionales, incluido el seguimiento SMLTP |

### Objeto de imagen

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `url` | cadena | URL para acceder a la imagen editada (cuando el formato_respuesta es "url") |
| `b64_json` | cadena | Datos de imagen codificados en Base64 (cuando el formato_respuesta es "b64_json") |
| `revised_prompt` | cadena | El mensaje realmente utilizado para la edición (puede diferir del ingresado) |

### Objeto de metadatos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `model` | cadena | Modelo utilizado: "google/gemini-2.5-flash-image-preview" |
| `provider` | cadena | Proveedor: "Google" |
| `total_images` | entero | Número total de imágenes (siempre 1 para ediciones) |
| `is_image_to_image` | booleano | Siempre es cierto para este endpoint |
| `text_response` | cadena\|nulo | Respuesta de texto opcional del modelo |
| `smltp_trace_id` | cadena | ID de seguimiento SMLTP para seguimiento de auditoría |
| `smltp_bundle_id` | cadena | ID de paquete SMLTP para seguimiento de auditorías |
| `smltp_policy` | cadena | Política SMLTP que se aplicó |

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### Servicio 503 no disponible

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## Notas

- Formatos de imagen admitidos: JPEG, PNG, WEBP, GIF
- Tamaño máximo de archivo: 10 MB por imagen
- El archivo de imagen es **obligatorio** para este endpoint (a diferencia de `/images/generations`)
- El mensaje describe cómo editar o transformar la imagen cargada.
- Todas las solicitudes se procesan a través de SMLTP por motivos de seguridad y cumplimiento.
- Utilice `response_format: "b64_json"` para recibir datos de imágenes codificados en base64 en lugar de URL