---
sidebar_position: 3
title: "Entrenar Índice con Documentos"
openapi: "POST /indexes/{indexName}/train"
sidebar_label: "Entrenar Índice"
---

# Entrenar Índice con Documentos.

Entrene un índice cargando documentos (archivos) o proporcionando entradas de texto.

## Endpoint

```
POST /indexes/{indexName}/train
```

## Descripción

Entrene un índice cargando documentos (archivos) o proporcionando entradas de texto. Este terminal admite múltiples formatos de archivos y puede procesar hasta 20 archivos a la vez.

### Formatos de archivo admitidos

- Texto
- PDF
- DOCX
- DOC
-JSON
-CSV
-XLS
-XLSX

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `indexName` | cadena | Sí | Nombre del índice a entrenar |

## Cuerpo de solicitud

Este endpoint acepta el formato `multipart/form-data`.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `files` | matriz de binarios | No | Archivos de documentos para cargar (hasta 20 archivos, 50 MB cada uno) |
| `text_inputs` | cadena | No | Matriz de cadenas JSON de entradas de texto. Cada elemento debe tener: nombre, tipo, contenido, tamaño |

### Formato de entrada de texto

Cuando utilice `text_inputs`, proporcione una matriz de cadenas JSON con objetos que contengan:

```json
[
  {
    "name": "doc1.txt",
    "type": "text/plain",
    "content": "Document content here",
    "size": 20
  }
]
```

## Ejemplos de solicitudes

### Cargar archivos (datos de formulario de varias partes)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@document3.txt"
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('files', fileInput1.files[0]);
formData.append('files', fileInput2.files[0]);
formData.append('files', fileInput3.files[0]);

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Files processed:', data.results.files_processed);
console.log('Documents indexed:', data.results.documents_indexed);
```

### Pitón

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

files = [
    ('files', open('document1.pdf', 'rb')),
    ('files', open('document2.docx', 'rb')),
    ('files', open('document3.txt', 'rb'))
]

response = requests.post(url, headers=headers, files=files)
result = response.json()
print('Files processed:', result['results']['files_processed'])
print('Documents indexed:', result['results']['documents_indexed'])
```

### Uso de entradas de texto

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "message": "Index trained successfully",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "results": {
    "files_processed": 3,
    "documents_extracted": 3,
    "documents_indexed": 3,
    "total_vectors": 11,
    "total_chunks": 3,
    "index_name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas |
| `message` | cadena | Mensaje de éxito |
| `request_id` | cadena | Solicitar ID para seguimiento |
| `results` | objeto | Resultados del entrenamiento |

### Objeto de resultados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `files_processed` | entero | Número de expedientes procesados ​​|
| `documents_extracted` | entero | Número de documentos extraídos de expedientes |
| `documents_indexed` | entero | Número de documentos indexados con éxito |
| `total_vectors` | entero | Número total de vectores almacenados en Pinecone |
| `total_chunks` | entero | Número total de fragmentos de texto creados |
| `index_name` | cadena | Nombre del índice entrenado |
| `namespace` | cadena | Espacio de nombres del índice |

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
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
  "message": "User doesn't have access to this index"
}
```

### 404 no encontrado

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 413 Carga útil demasiado grande

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## Notas

- Máximo 20 archivos por solicitud
- Máximo 50 MB por archivo
- Los archivos se pueden cargar como datos de formulario/multiparte
- Las entradas de texto se pueden proporcionar como una matriz de cadenas JSON
- Los documentos se fragmentan y vectorizan automáticamente para la búsqueda semántica.
- El índice debe existir antes del entrenamiento.
- Los resultados de la capacitación muestran cuántos documentos se indexaron exitosamente