---
id: list
title: "Gruppen auflisten"
sidebar_label: "Gruppen auflisten"
description: "Rufen Sie alle Benutzergruppen ab"
openapi: "GET /groups"
---
# Gruppen auflisten

Rufen Sie eine Liste aller Benutzergruppen im System mit Paginierungs- und Filteroptionen ab.

## Endpunkt

```
GET /groups
```

## Beschreibung

Dieser Endpunkt gibt alle im SecureAI-System verfügbaren Benutzergruppen zurück. Es bietet detaillierte Informationen zu jeder Gruppe, einschließlich Mitgliedern, Berechtigungen und Metadaten. Dies ist nützlich für die Verwaltung des Benutzerzugriffs und der Organisationsstruktur.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `page` | Ganzzahl | Nein | 1 | Seitenzahl für Paginierung |
| `limit` | Ganzzahl | Nein | 20 | Anzahl der Gruppen pro Seite (1-100) |
| `search` | Zeichenfolge | Nein | - | Suchbegriff für Gruppennamen oder Beschreibung |
| `status` | Zeichenfolge | Nein | - | Nach Gruppenstatus filtern |
| `sortBy` | Zeichenfolge | Nein | erstellt am | Feld zum Sortieren nach |
| `sortOrder` | Zeichenfolge | Nein | absteigend | Sortierreihenfolge (aufsteigend, absteigend) |

## Beispielanfrage

```bash
GET /groups?search=engineering&limit=20&page=1&sortBy=createdAt&sortOrder=desc
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "groups": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c25",
      "name": "Engineering Team",
      "description": "Software engineering and development team",
      "status": "Active",
      "userCount": 15,
      "users": [
        {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `groups[]` | Array | Array von Gruppenobjekten |
| `groups[].id` | Zeichenfolge | Eindeutiger Gruppenbezeichner |
| `groups[].name` | Zeichenfolge | Gruppenname |
| `groups[].description` | Zeichenfolge | Gruppenbeschreibung |
| `groups[].status` | Zeichenfolge | Gruppenstatus |
| `groups[].userCount` | Ganzzahl | Anzahl der Benutzer in der Gruppe |
| `groups[].users` | Array | Array von Benutzerobjekten in der Gruppe |
| `groups[].users[].id` | Zeichenfolge | Benutzer-ID |
| `groups[].users[].name` | Zeichenfolge | Benutzername |
| `groups[].users[].email` | Zeichenfolge | Benutzer-E-Mail |
| `groups[].createdAt` | Zeichenfolge | Erstellungszeitstempel |
| `pagination` | Objekt | Informationen zur Paginierung |

## Beispielverwendung

### JavaScript

```javascript
const listGroups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/groups${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listGroups({
  search: 'engineering',
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
console.log(result.groups);
```

### Python

```python
import requests

def list_groups(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "search": "engineering",
    "limit": 10,
    "page": 1,
    "sortBy": "createdAt",
    "sortOrder": "desc"
}

result = list_groups(params)
print(result["groups"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/groups?search=engineering&limit=10&page=1&sortBy=createdAt&sortOrder=desc" \
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

### 403 Verboten

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
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

### Suchgruppen

```bash
# Search by name
GET /groups?search=engineering

# Search by description
GET /groups?search=development
```

### Sortieroptionen

```bash
# Sort by name ascending
GET /groups?sortBy=name&sortOrder=asc

# Sort by user count descending
GET /groups?sortBy=userCount&sortOrder=desc

# Sort by creation date
GET /groups?sortBy=createdAt&sortOrder=desc
```

### Paginierung

```bash
# Get first 20 groups
GET /groups?limit=20&page=1

# Get next 20 groups
GET /groups?limit=20&page=2
```

## Anwendungsfälle

- **Gruppenverwaltung**: Alle Gruppen zu Verwaltungszwecken auflisten
- **Benutzerorganisation**: Entdecken Sie verfügbare Gruppen für die Benutzerzuweisung
- **Zugriffskontrolle**: Überprüfen Sie Gruppenberechtigungen und Mitgliederzahlen
- **Berichterstellung**: Erstellen Sie Berichte über Gruppenstruktur und Mitgliedschaft
- **Integration**: Entdecken Sie Gruppen für die Anwendungsintegration

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

– Auf diesen Endpunkt können nur Administratoren zugreifen
- Paginierung: Verwendet Seitenparameter, keinen Offset
- Flache Antwort: Die Antwort ist nicht unter dem Datenobjekt verschachtelt
- Benutzerdetails: Enthält vollständige Benutzerinformationen für jedes Gruppenmitglied
- Statusfilter: Kann nach Gruppenstatus filtern
- Die Suchfunktion funktioniert über Gruppennamen und Beschreibungen hinweg
- Sortieroptionen helfen dabei, Ergebnisse nach verschiedenen Kriterien zu organisieren