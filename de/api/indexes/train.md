---
sidebar_position: 3
title: "Zugverzeichnis mit Dokumenten"
openapi: "POST /indexes/{indexName}/train"
---
# Index mit Dokumenten trainieren

Trainieren Sie einen Index, indem Sie Dokumente (Dateien) hochladen oder Texteingaben bereitstellen.

## Endpunkt

```
POST /indexes/{indexName}/train
```

## Beschreibung

Trainieren Sie einen Index, indem Sie Dokumente (Dateien) hochladen oder Texteingaben bereitstellen. Dieser Endpunkt unterstützt mehrere Dateiformate und kann bis zu 20 Dateien gleichzeitig verarbeiten.

### Unterstützte Dateiformate

- TXT
- PDF
- DOCX
- DOC
- JSON
- CSV
- XLS
- XLSX

## Authentifizierung

Erforderlich: API-Schlüssel

```bash
Authorization: Bearer sk-your-api-key-here
```

## Pfadparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `indexName` | Zeichenfolge | Ja | Name des zu trainierenden Index |

## Anforderungstext

Dieser Endpunkt akzeptiert das Format `multipart/form-data`.

### Parameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `files` | Array von binären | Nein | Dokumentdateien zum Hochladen (bis zu 20 Dateien, jeweils 50 MB) |
| `text_inputs` | Zeichenfolge | Nein | JSON-String-Array mit Texteingaben. Jedes Element sollte Folgendes haben: Name, Typ, Inhalt, Größe |

### Texteingabeformat

Stellen Sie bei Verwendung von `text_inputs` ein JSON-String-Array mit Objekten bereit, die Folgendes enthalten:

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

## Beispiele anfordern

### Dateien hochladen (mehrteilige Formulardaten)

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

### Python

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

### Verwenden von Texteingaben

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## Antwort

### Erfolgsantwort (200)

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

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Bei erfolgreichen Anfragen immer wahr |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `request_id` | Zeichenfolge | ID zur Nachverfolgung anfordern |
| `results` | Objekt | Trainingsergebnisse |

### Ergebnisobjekt

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `files_processed` | Ganzzahl | Anzahl der verarbeiteten Dateien |
| `documents_extracted` | Ganzzahl | Anzahl der aus Dateien extrahierten Dokumente |
| `documents_indexed` | Ganzzahl | Anzahl der erfolgreich indexierten Dokumente |
| `total_vectors` | Ganzzahl | Gesamtzahl der in Pinecone | gespeicherten Vektoren
| `total_chunks` | Ganzzahl | Gesamtzahl der erstellten Textblöcke |
| `index_name` | Zeichenfolge | Name des trainierten Index |
| `namespace` | Zeichenfolge | Namensraum des Index |

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
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

### 413 Nutzlast zu groß

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 Interner Serverfehler

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## Notizen

- Maximal 20 Dateien pro Anfrage
- Maximal 50 MB pro Datei
- Dateien können als Multipart-/Formulardaten hochgeladen werden
– Texteingaben können als JSON-String-Array bereitgestellt werden
- Dokumente werden für die semantische Suche automatisch in Chunks aufgeteilt und vektorisiert
- Der Index muss vor dem Training vorhanden sein
- Trainingsergebnisse zeigen, wie viele Dokumente erfolgreich indiziert wurden