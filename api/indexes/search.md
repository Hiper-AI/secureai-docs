---
sidebar_position: 4
title: "Búsqueda Semántica en Índice"
openapi: "GET /indexes/{indexName}/search"
sidebar_label: "Buscar en Índice"
---

# Índice de búsqueda de documentos

Busque documentos dentro de un índice mediante búsqueda semántica.

## Endpoint

```
GET /indexes/{indexName}/search
```

## Descripción

Busque documentos dentro de un índice mediante búsqueda semántica. Devuelve documentos coincidentes con puntuaciones de relevancia, ordenados por relevancia.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de ruta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `indexName` | cadena | Sí | Nombre del índice a buscar |

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `query` | cadena | Sí | Texto de consulta de búsqueda |
| `top_k` | entero | No | Número máximo de resultados a devolver (1-50, predeterminado: 10) |
| `min_score` | flotador | No | Umbral mínimo de puntuación de relevancia (0,0-1,0, valor predeterminado: 0,0) |

## Ejemplo de solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=What%20is%20machine%20learning?&top_k=10&min_score=0.5" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### JavaScript/Node.js

```javascript
const query = encodeURIComponent('What is machine learning?');
const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=${query}&top_k=10&min_score=0.5`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Total matches:', data.results.total);
data.results.matches.forEach(match => {
  console.log(`Rank ${match.rank}: ${match.content.substring(0, 100)}... (score: ${match.score})`);
});
```

### Pitón

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "query": "What is machine learning?",
    "top_k": 10,
    "min_score": 0.5
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Total matches:', result['results']['total'])
for match in result['results']['matches']:
    print(f"Rank {match['rank']}: {match['content'][:100]}... (score: {match['score']})")
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What is machine learning?",
  "results": {
    "matches": [
      {
        "rank": 1,
        "score": 0.85,
        "source": "training",
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed...",
        "metadata": {
          "page": 1,
          "chunkIndex": 0,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      },
      {
        "rank": 2,
        "score": 0.78,
        "source": "training",
        "content": "Machine learning algorithms build mathematical models based on training data to make predictions or decisions...",
        "metadata": {
          "page": 2,
          "chunkIndex": 1,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      }
    ],
    "total": 5,
    "top_k": 10
  },
  "index": {
    "name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas |
| `request_id` | cadena | Solicitar ID para seguimiento |
| `query` | cadena | La consulta de búsqueda que se utilizó |
| `results` | objeto | Resultados de la búsqueda |
| `index` | objeto | Información del índice |

### Objeto de resultados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `matches` | matriz | Conjunto de documentos coincidentes, ordenados por relevancia |
| `total` | entero | Número total de coincidencias encontradas |
| `top_k` | entero | Valor top_k solicitado |

### Coincidir objeto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `rank` | entero | Clasificación de resultados (basada en 1) |
| `score` | flotador | Puntuación de relevancia (0,0-1,0, cuanto más alto es más relevante) |
| `source` | cadena | Identificador de origen del documento |
| `content` | cadena | Vista previa del contenido (truncada a 500 caracteres) |
| `metadata` | objeto | Metadatos adicionales |

### Objeto de metadatos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `page` | entero\|nulo | Número de página (si es de PDF) |
| `chunkIndex` | entero\|nulo | Índice de fragmentos dentro del documento |
| `title` | cadena\|nulo | Título del documento |
| `documentId` | cadena\|nulo | Identificación del documento |

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
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

### 500 Error interno del servidor

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## Notas

- La búsqueda semántica utiliza similitud de vectores para encontrar documentos relevantes.
- Los resultados se ordenan por puntuación de relevancia (la más alta primero)
- Utilice `min_score` para filtrar resultados de baja relevancia
- Las vistas previas del contenido se truncan a 500 caracteres.
- El parámetro `top_k` limita el número de resultados devueltos
- Los metadatos incluyen información sobre el origen y la ubicación del documento.