---
sidebar_position: 4
title: "Suchindex für Dokumente"
openapi: "GET /indexes/{indexName}/search"
---
# Suchindex für Dokumente

Durchsuchen Sie Dokumente innerhalb eines Index mithilfe der semantischen Suche.

## Endpunkt

```
GET /indexes/{indexName}/search
```

## Beschreibung

Durchsuchen Sie Dokumente innerhalb eines Index mithilfe der semantischen Suche. Gibt übereinstimmende Dokumente mit Relevanzbewertungen zurück, sortiert nach Relevanz.

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Pfadparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `indexName` | Zeichenfolge | Ja | Name des zu durchsuchenden Index |

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `query` | Zeichenfolge | Ja | Suchabfragetext |
| `top_k` | Ganzzahl | Nein | Maximale Anzahl zurückzugebender Ergebnisse (1–50, Standard: 10) |
| `min_score` | schweben | Nein | Mindestschwelle für die Relevanzbewertung (0,0–1,0, Standard: 0,0) |

## Beispiel für Anfrage

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

### Python

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

## Antwort

### Erfolgsantwort (200)

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

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr |
| `request_id` | Zeichenfolge | ID zur Nachverfolgung anfordern |
| `query` | Zeichenfolge | Die verwendete Suchabfrage |
| `results` | Objekt | Suchergebnisse |
| `index` | Objekt | Indexinformationen |

### Ergebnisobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `matches` | Array | Array passender Dokumente, sortiert nach Relevanz |
| `total` | Ganzzahl | Gesamtzahl der gefundenen Übereinstimmungen |
| `top_k` | Ganzzahl | Angeforderter top_k-Wert |

### Objekt abgleichen

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `rank` | Ganzzahl | Ergebnisrang (1-basiert) |
| `score` | schweben | Relevanzbewertung (0,0–1,0, höher ist relevanter) |
| `source` | Zeichenfolge | Dokumentquellenkennung |
| `content` | Zeichenfolge | Inhaltsvorschau (auf 500 Zeichen gekürzt) |
| `metadata` | Objekt | Zusätzliche Metadaten |

### Metadatenobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `page` | Ganzzahl\|null | Seitenzahl (falls aus PDF) |
| `chunkIndex` | Ganzzahl\|null | Chunk-Index innerhalb des Dokuments |
| `title` | string\|null | Dokumenttitel |
| `documentId` | string\|null | Dokument-ID |

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
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
  "message": "User doesn't have access to this index"
}
```

### 404 Nicht gefunden

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## Notizen

- Die semantische Suche nutzt Vektorähnlichkeit, um relevante Dokumente zu finden
- Die Ergebnisse werden nach Relevanzwert sortiert (höchster Wert zuerst).
- Verwenden Sie `min_score`, um Ergebnisse mit geringer Relevanz herauszufiltern
- Inhaltsvorschauen werden auf 500 Zeichen gekürzt
– Der Parameter `top_k` begrenzt die Anzahl der zurückgegebenen Ergebnisse
- Metadaten umfassen Informationen über die Quelle und den Speicherort des Dokuments