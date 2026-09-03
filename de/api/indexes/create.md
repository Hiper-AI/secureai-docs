---
id: create
title: "Index erstellen"
sidebar_label: "Index erstellen"
description: "Erstellen Sie einen neuen Wissensdatenbankindex"
openapi: "POST /indexes/all"
---
# Index erstellen

Erstellen Sie einen neuen Wissensdatenbankindex zum Speichern und Abrufen von Dokumenten.

## Endpunkt

```
POST /indexes
```

## Beschreibung

Mit diesem Endpunkt können Administratoren einen neuen Wissensdatenbankindex erstellen. Der Index kann bestimmten Benutzern oder Gruppen zugewiesen werden. Nur Administratoren können Indizes erstellen.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Ja | Indexname |
| `assignedUser` | Zeichenfolge | Nein | Benutzer-ID, der der Index zugewiesen werden soll (MongoDB ObjectId) |
| `assignedGroup` | Zeichenfolge | Nein | Gruppen-ID, der der Index zugewiesen werden soll (MongoDB ObjectId) |
| `sharedIndexName` | Zeichenfolge | Nein | Gemeinsamer Indexname (standardmäßig Name) |
| `namespace` | Zeichenfolge | Nein | Namespace für den Index (automatisch generiert, falls nicht angegeben) |
| `region` | Zeichenfolge | Nein | Regionshinweis für die Speicherung (optional) |
| `cloud` | Zeichenfolge | Nein | Hinweis zum Cloud-Anbieter (optional) |


## Beispielanfrage

```json
{
  "name": "my-knowledge-base",
  "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
  "sharedIndexName": "my-knowledge-base",
  "region": "us-east-1",
  "cloud": "aws"
}
```

## Erfolgsantwort

**Statuscode**: `201 Created`

```json
{
  "success": true,
  "message": "Index created successfully",
  "index": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "my-knowledge-base",
    "sharedIndexName": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base",
    "type": "personal",
    "assignedUser": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedGroup": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `index` | Objekt | Indexobjekt erstellt |
| `index.id` | Zeichenfolge | Eindeutiger Indexbezeichner |
| `index.name` | Zeichenfolge | Indexname |
| `index.sharedIndexName` | Zeichenfolge | Gemeinsamer Indexname |
| `index.namespace` | Zeichenfolge | Index-Namespace |
| `index.type` | Zeichenfolge | Indextyp (persönlich, allgemein, Gruppe, unbekannt) |
| `index.assignedUser` | Objekt | Zugewiesene Benutzerinformationen (sofern personenbezogen) |
| `index.assignedGroup` | Objekt | Zugewiesene Gruppeninformationen (falls Gruppe) |
| `index.createdAt` | Zeichenfolge | Erstellungszeitstempel |

## Beispielverwendung

### JavaScript

```javascript
const createIndex = async (indexData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(indexData)
  });
  
  return await response.json();
};

// Example usage
const indexData = {
  name: "my-knowledge-base",
  assignedUser: "60a7c8f5e8b4f5001f7a8c24",
  region: "us-east-1",
  cloud: "aws"
};

const result = await createIndex(indexData);
console.log('Created index:', result.index.id);
```

### Python

```python
import requests

def create_index(index_data):
    url = "https://{customer.name}.hiperai.ai/api/external/indexes"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=index_data)
    return response.json()

# Example usage
index_data = {
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
}

result = create_index(index_data)
print("Created index:", result["index"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-knowledge-base",
    "assignedUser": "60a7c8f5e8b4f5001f7a8c24",
    "region": "us-east-1",
    "cloud": "aws"
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Index name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

## Validierungen und Geschäftsregeln

- **Normalisierung des Indexnamens** (für Speicher- und Eindeutigkeitsprüfungen):
  - Kleinbuchstaben, Leerzeichen entfernen
  - Ersetzen Sie Leerzeichen durch Bindestriche
  - Entfernen Sie alle Zeichen, die nicht in `[a-z0-9-]` enthalten sind.
- **Indexnamensvalidierung**: Muss mit `^[a-z0-9-]{3,50}$` übereinstimmen; andernfalls wird 400 zurückgegeben.
- **Einzigartigkeit**: Normalisiertes `name` muss eindeutig sein; Duplikate geben 409 zurück.
- **Zugewiesene Benutzerquote**: Wenn `assignedUser` bereitgestellt wird, erzwingen Sie die Benutzerindexquote über `checkUserIndexQuota`; Das überschrittene Kontingent gibt 403 zurück.
- **Regionsbeschränkung (wesentlich)**: Für die Lizenz `Essential` können Indizes nur mit `cloud=aws` und `region=us-east-1` erstellt werden; sonst 403.
- **Zugewiesene Gruppe**: Wenn `assignedGroup` bereitgestellt wird, muss die Gruppe vorhanden sein und darf nicht archiviert werden (`status != 'Archived'`); sonst 400.

## Normalisierung und Speicherung

- `name` wird normalisiert gespeichert.
- `sharedIndexName` verwendet standardmäßig das normalisierte `name`.
- `namespace` ist standardmäßig `user-{userId}-index-{normalizedName}`, wenn es einem Benutzer zugewiesen wird.

## Typische Fehlerformen

### 400 Ungültiger Indexname

```json
{
  "success": false,
  "error": "Invalid index name",
  "message": "Index name must be 3-50 chars, lowercase letters, digits, or hyphens"
}
```

### 403 Indexkontingent überschritten

```json
{
  "success": false,
  "error": "Index quota exceeded",
  "message": "User has reached the maximum number of indexes for Growth license (current/limit)."
}
```

### 403 Region nicht zulässig

```json
{
  "success": false,
  "error": "Region not allowed for license",
  "message": "Essential plan is restricted to AWS us-east-1. Please choose cloud=aws and region=us-east-1."
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
    "message": "Cannot create general indexes without admin privileges"
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

## Indextypen

| Geben Sie | ein Beschreibung | Erforderliche Berechtigungen |
|------|-------------|-------|
| `personal` | Persönlicher Index für den individuellen Gebrauch | Administratorrechte |
| `general` | Gemeinsamer Organisationsindex | Administratorrechte |
| `group` | Gruppenzugewiesener Index | Administratorrechte |

## Erforderliche Felder

| Feld | Beschreibung | Beispiel |
|-------|-------------|----------|
| `name` | Indexname | „meine-Wissensdatenbank“ |
| `region` | AWS-Region | „us-east-1“ |
| `cloud` | Cloud-Anbieter | „aws“ |

## Anwendungsfälle

- **Benutzerzuweisung**: Erstellen Sie Indizes und weisen Sie sie bestimmten Benutzern zu
- **Gruppenzuweisung**: Indizes erstellen und Gruppen zuweisen
- **Wissensdatenbanken**: Erstellen Sie spezielle Wissensdatenbanken für bestimmte Domänen
- **Inhaltsorganisation**: Organisieren Sie Inhalte nach Thema oder Kategorie
- **Vektorspeicher**: Erstellen Sie Indizes zum Speichern und Abrufen von Vektoreinbettungen

## Tarifbegrenzungen

- **Standard**: 50 Anfragen pro Minute
- **Täglich**: 5.000 Anfragen pro Tag
- **Monatlich**: 150.000 Anfragen pro Monat

## Notizen

– Auf diesen Endpunkt können nur Administratoren zugreifen
- Erforderliche Felder: Name, Region, Cloud sind alle erforderlich
- Zuweisung: Der Index kann einem Benutzer (assignedUser) oder einer Gruppe (assignedGroup) zugewiesen werden.
- Automatische Generierung: Namespace wird automatisch generiert, wenn er nicht angegeben wird
- Eindeutige Namen: Indexnamen müssen im gesamten System eindeutig sein
- Der Index steht nach der Erstellung sofort zur Nutzung zur Verfügung
- Dimension: Die Vektordimension wird intern von der Anwendung verwaltet (derzeit 4096).
- Metrik: Die Ähnlichkeitsmetrik wird intern von der Anwendung verwaltet