---
id: update
title: "Index aktualisieren"
sidebar_label: "Index aktualisieren"
description: "Aktualisieren Sie einen vorhandenen Wissensdatenbankindex"
openapi: "PUT /indexes/{indexId}"
---
# Index aktualisieren

Aktualisieren Sie einen vorhandenen Wissensdatenbankindex mit neuen Einstellungen, Metadaten oder Konfigurationen.

## Endpunkt

```
PUT /indexes/{indexId}
```

## Beschreibung

Mit diesem Endpunkt können Administratoren einen vorhandenen Wissensdatenbankindex aktualisieren. Sie können den Indexnamen ändern und ihn anderen Benutzern oder Gruppen neu zuweisen. Nur Administratoren können Indizes aktualisieren.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Pfadparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `indexId` | Zeichenfolge | Ja | Der eindeutige Bezeichner des zu aktualisierenden Index |

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Nein | Neuer Name für den Index |
| `assignedUser` | Zeichenfolge | Nein | Benutzer-ID, der der Index zugewiesen werden soll (MongoDB ObjectId) |
| `assignedGroup` | Zeichenfolge | Nein | Gruppen-ID, der der Index zugewiesen werden soll (MongoDB ObjectId) |


## Beispielanfrage

```json
{
  "name": "updated-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "message": "Index updated successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "updated-knowledge-base",
    "sharedIndexName": "updated-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-updated-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `index` | Objekt | Aktualisiertes Indexobjekt |
| `index.id` | Zeichenfolge | Eindeutiger Indexbezeichner |
| `index.name` | Zeichenfolge | Aktualisierter Indexname |
| `index.sharedIndexName` | Zeichenfolge | Gemeinsamer Indexname |
| `index.namespace` | Zeichenfolge | Index-Namespace |
| `index.type` | Zeichenfolge | Indextyp (persönlich, allgemein, Gruppe, unbekannt) |
| `index.assignedUser` | Objekt | Zugewiesene Benutzerinformationen (sofern personenbezogen) |
| `index.assignedGroup` | Objekt | Zugewiesene Gruppeninformationen (falls Gruppe) |
| `index.createdAt` | Zeichenfolge | Ursprünglicher Erstellungszeitstempel |
| `index.updatedAt` | Zeichenfolge | Zeitstempel der letzten Aktualisierung |

## Beispielverwendung

### JavaScript

```javascript
const updateIndex = async (indexId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/${indexId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  return await response.json();
};

// Example usage
const updateData = {
  name: "updated-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24"
};

const result = await updateIndex('60a7c8f5e8b4f5001f7a8c23', updateData);
console.log('Updated index:', result.index);
```

### Python

```python
import requests

def update_index(index_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/indexes/{index_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
}

result = update_index("60a7c8f5e8b4f5001f7a8c23", update_data)
print("Updated index:", result["index"])
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/indexes/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24"
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name already exists or invalid assigned IDs",
    "details": {
      "field": "name | assignedUser | assignedGroup"
    }
  }
}
```

## Validierungen und Geschäftsregeln

- **Zuweisung an einen Benutzer (`assignedUser`)**:
  - Erzwingen Sie die Benutzerindexkontingente über `checkUserIndexQuota`, wenn Sie in einen persönlichen Index konvertieren oder den Beauftragten ändern. Überschrittenes Kontingent gibt 403 zurück.
- **Zu einer Gruppe zuweisen (`assignedGroup`)**:
  - Gruppe muss existieren und aktiv sein (`status != 'Archived'`); Ungültige/inaktive Gruppen geben 400 zurück.

## Normalisierung und Speicherung

- Beim Umbenennen wird `name` weiterhin normalisiert gespeichert; `sharedIndexName` verwendet standardmäßig den normalisierten Namen, wenn er nicht explizit festgelegt wird.

## Typische Fehlerformen

### 403 Indexkontingent überschritten

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Ultra license (current/limit)."
}
```

### 400 Gruppe ungültig/inaktiv

```json
{
  "success": false,
  "error": "Invalid or inactive group",
  "message": "The specified group does not exist or is not active"
}
```

### 401 Nicht autorisiert

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 403 Verboten

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Cannot update this index"
  }
}
```

### 404 Nicht gefunden

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NOT_FOUND",
    "message": "Index not found"
  }
}
```

### 409 Konflikt

```json
{
  "success": false,
  "error": {
    "code": "INDEX_NAME_EXISTS",
    "message": "Index name already exists"
  }
}
```

### 429 Zu viele Anfragen

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

## Aktualisierbare Felder

| Feld | Beschreibung | Notizen |
|-------|-------------|-------|
| `name` | Indexname | Muss im gesamten System eindeutig sein |
| `assignedUser` | Benutzerzuordnung | Weist einem bestimmten Benutzer einen Index zu |
| `assignedGroup` | Gruppenzuordnung | Weist den Index einer bestimmten Gruppe zu |

## Anwendungsfälle

- **Namensänderungen**: Indizes zur besseren Organisation umbenennen
- **Benutzerzuweisung**: Indizes verschiedenen Benutzern neu zuweisen
- **Gruppenzuweisung**: Indizes verschiedenen Gruppen neu zuweisen
- **Eigentumsübertragung**: Indexeigentum zwischen Benutzern ändern

## Tarifbegrenzungen

- **Standard**: 50 Anfragen pro Minute
- **Täglich**: 5.000 Anfragen pro Tag
- **Monatlich**: 150.000 Anfragen pro Monat

## Notizen

– Auf diesen Endpunkt können nur Administratoren zugreifen
- Eingeschränkte Felder: Nur Name, zugewiesener Benutzer und zugewiesene Gruppe können aktualisiert werden
- Zuweisungslogik: Durch die Zuweisung zu einem Benutzer wird die Gruppenzuweisung gelöscht und umgekehrt
- Validierung: Benutzer- und Gruppen-IDs werden vor der Zuweisung validiert
- Keine Einstellungen: Einstellungen, Metadaten oder andere Konfigurationen können nicht aktualisiert werden
– Der `updatedAt`-Zeitstempel wird automatisch aktualisiert
- Indexnamen müssen im gesamten System eindeutig bleiben