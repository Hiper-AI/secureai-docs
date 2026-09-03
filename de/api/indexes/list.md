---
id: list
title: "Alle Indizes auflisten"
sidebar_label: "Alle Indizes auflisten"
description: "Rufen Sie alle verfügbaren Wissensdatenbankindizes ab"
openapi: "GET /indexes/all"
---
# Alle Indizes auflisten

Rufen Sie eine umfassende Liste aller verfügbaren Wissensdatenbankindizes im System ab.

## Endpunkt

```
GET /indexes/all
```

## Beschreibung

Dieser Endpunkt gibt alle im SecureAI-System verfügbaren Wissensdatenbankindizes zurück. Es bietet detaillierte Informationen zu jedem Index, einschließlich Typ, Status, Erstellungsdatum und Metadaten. Dies ist nützlich, um verfügbare Wissensdatenbanken und deren Fähigkeiten zu ermitteln.

## Authentifizierung

**Erforderlich**: API-Schlüssel

```
Authorization: Bearer sk-your-api-key-here
```

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `page` | Ganzzahl | Nein | 1 | Seitenzahl für Paginierung |
| `limit` | Ganzzahl | Nein | 50 | Anzahl der Indizes pro Seite (1-100) |
| `search` | Zeichenfolge | Nein | - | Suchbegriff für Indexnamen oder Shared Indexnamen |
| `type` | Zeichenfolge | Nein | - | Nach Indextyp filtern (persönlich, allgemein, Gruppe) |
| `status` | Zeichenfolge | Nein | aktiv | Nach Indexstatus filtern (aktiv, gelöscht, alle) |
| `sortBy` | Zeichenfolge | Nein | erstellt am | Feld zum Sortieren nach |
| `sortOrder` | Zeichenfolge | Nein | absteigend | Sortierreihenfolge (aufsteigend, absteigend) |

## Beispielanfrage

```bash
GET /indexes/all?type=personal&limit=20&page=1
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "indexes": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "my-knowledge-base",
      "sharedIndexName": "my-knowledge-base",
      "namespace": "user-namespace",
      "type": "personal",
      "assignedUser": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedGroup": null,
      "userId": "60a7c8f5e8b4f5001f7a8c24",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `indexes[]` | Array | Array von Indexobjekten |
| `indexes[].id` | Zeichenfolge | Eindeutiger Indexbezeichner |
| `indexes[].name` | Zeichenfolge | Indexname |
| `indexes[].sharedIndexName` | Zeichenfolge | Gemeinsamer Indexname |
| `indexes[].namespace` | Zeichenfolge | Index-Namespace |
| `indexes[].type` | Zeichenfolge | Indextyp (persönlich, allgemein, Gruppe, unbekannt) |
| `indexes[].assignedUser` | Objekt | Zugewiesene Benutzerinformationen (sofern personenbezogen) |
| `indexes[].assignedGroup` | Objekt | Zugewiesene Gruppeninformationen (falls Gruppe) |
| `indexes[].userId` | Zeichenfolge | Benutzer-ID |
| `indexes[].isActive` | boolescher Wert | Ob der Index aktiv ist |
| `indexes[].createdAt` | Zeichenfolge | Erstellungszeitstempel |
| `indexes[].updatedAt` | Zeichenfolge | Zeitstempel der letzten Aktualisierung |
| `indexes[].deletedAt` | Zeichenfolge | Löschzeitstempel (falls gelöscht) |
| `pagination` | Objekt | Informationen zur Paginierung |

## Indextypen

| Geben Sie | ein Beschreibung | Zugriff |
|------|-------------|--------|
| `personal` | Vom Benutzer erstellte persönliche Indexe | Voller Zugriff für Eigentümer |
| `general` | Gemeinsame Organisationsindizes | Variiert je nach Berechtigungen |
| `group` | Gruppenzugewiesene Indizes | Gruppenmitglieder |
| `unknown` | Indizes mit unklarer Zuordnung | Variiert |

## Indexstatus

| Status | Beschreibung |
|--------|-------------|
| `active` | Index steht zur Nutzung zur Verfügung |
| `deleted` | Index wurde gelöscht |
| `all` | Sowohl aktive als auch gelöschte | einschließen

## Beispielverwendung

### JavaScript

```javascript
const listIndexes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/indexes/all${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listIndexes({
  type: 'personal',
  limit: 10,
  page: 1
});
console.log(result.indexes);
```

### Python

```python
import requests

def list_indexes(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "type": "personal",
    "limit": 10,
    "page": 1
}

result = list_indexes(params)
print(result["indexes"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/all?type=personal&limit=10&page=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Fehlerantworten

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

## Filterbeispiele

### Nach Typ filtern

```bash
# Get only personal indexes
GET /indexes/all?type=personal

# Get only group indexes
GET /indexes/all?type=group
```

### Nach Status filtern

```bash
# Get only active indexes
GET /indexes/all?status=active

# Get deleted indexes
GET /indexes/all?status=deleted
```

### Paginierung

```bash
# Get first 20 indexes
GET /indexes/all?limit=20&page=1

# Get next 20 indexes
GET /indexes/all?limit=20&page=2
```

## Anwendungsfälle

- **Discovery**: Finden Sie verfügbare Wissensdatenbanken für RAG-Operationen
- **Verwaltung**: Listen Sie Indizes für Verwaltungszwecke auf
- **Integration**: Entdecken Sie Indizes für die Anwendungsintegration
- **Überwachung**: Überprüfen Sie den Indexstatus und die Metadaten
- **Filtern**: Suchen Sie nach bestimmten Arten von Indizes (System, Persönlich usw.)

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

– Auf diesen Endpunkt können nur Administratoren zugreifen
- Persönliche Indizes sind nur für ihre Besitzer sichtbar
- Gruppenindizes sind für Gruppenmitglieder sichtbar
- Die Antwort enthält zugewiesene Benutzer- und Gruppeninformationen
- Die Paginierung verwendet Seitenparameter, keinen Offset
- Das Filtern nach Typ und Status hilft, die Ergebnisse einzugrenzen