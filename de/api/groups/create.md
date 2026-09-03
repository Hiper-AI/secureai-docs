---
id: create
title: "Gruppe erstellen"
sidebar_label: "Gruppe erstellen"
description: "Erstellen Sie eine neue Benutzergruppe"
openapi: "POST /groups"
---
# Gruppe erstellen

Erstellen Sie eine neue Benutzergruppe, um Benutzer zu organisieren und Zugriffsberechtigungen zu verwalten.

## Endpunkt

```
POST /groups
```

## Beschreibung

Dieser Endpunkt ermöglicht Administratoren das Erstellen neuer Benutzergruppen. Gruppen werden verwendet, um Benutzer zu organisieren, Berechtigungen zu verwalten und den Zugriff auf verschiedene Teile des Systems zu steuern. Sie können beim Erstellen den Gruppennamen, die Beschreibung und die Metadaten angeben.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Ja | Gruppenname |
| `description` | Zeichenfolge | Ja | Gruppenbeschreibung |
| `users` | Array | Nein | Array von Benutzer-IDs, die der Gruppe hinzugefügt werden sollen |
| `status` | Zeichenfolge | Nein | Gruppenstatus (standardmäßig „Aktiv“) |

## Beispielanfrage

```json
{
  "name": "Engineering Team",
  "description": "Software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  "status": "Active"
}
```

## Erfolgsantwort

**Statuscode**: `201 Created`

```json
{
  "success": true,
  "message": "Group created successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "status": "Active",
    "userCount": 2,
    "users": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c26",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `group` | Objekt | Erstelltes Gruppenobjekt |
| `group.id` | Zeichenfolge | Eindeutiger Gruppenbezeichner |
| `group.name` | Zeichenfolge | Gruppenname |
| `group.description` | Zeichenfolge | Gruppenbeschreibung |
| `group.status` | Zeichenfolge | Gruppenstatus |
| `group.userCount` | Ganzzahl | Anzahl der Benutzer in der Gruppe |
| `group.users` | Array | Array von Benutzerobjekten in der Gruppe |
| `group.users[].id` | Zeichenfolge | Benutzer-ID |
| `group.users[].name` | Zeichenfolge | Benutzername |
| `group.users[].email` | Zeichenfolge | Benutzer-E-Mail |
| `group.createdAt` | Zeichenfolge | Erstellungszeitstempel |

## Beispielverwendung

### JavaScript

```javascript
const createGroup = async (groupData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/groups', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return await response.json();
};

// Example usage
const groupData = {
  name: "Engineering Team",
  description: "Software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
  status: "Active"
};

const result = await createGroup(groupData);
console.log('Created group:', result.group.id);
```

### Python

```python
import requests

def create_group(group_data):
    url = "https://{customer.name}.hiperai.ai/api/external/groups"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=group_data)
    return response.json()

# Example usage
group_data = {
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
}

result = create_group(group_data)
print("Created group:", result["group"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/groups" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26"],
    "status": "Active"
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Group name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
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
    "message": "Admin privileges required"
  }
}
```

### 409 Konflikt

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NAME_EXISTS",
    "message": "Group name already exists"
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

## Anwendungsfälle

- **Benutzerorganisation**: Erstellen Sie Gruppen, um Benutzer nach Abteilung oder Funktion zu organisieren
- **Zugriffskontrolle**: Richten Sie Gruppen zur Verwaltung von Berechtigungen und Zugriff ein
- **Teamverwaltung**: Erstellen Sie Gruppen für verschiedene Teams oder Projekte
- **Berichterstellung**: Benutzer für Berichte und Analysen organisieren
- **Integration**: Erstellen Sie Gruppen für die Systemintegration von Drittanbietern

## Tarifbegrenzungen

- **Standard**: 50 Anfragen pro Minute
- **Täglich**: 5.000 Anfragen pro Tag
- **Monatlich**: 150.000 Anfragen pro Monat

## Notizen

– Auf diesen Endpunkt können nur Administratoren zugreifen
- Erforderliche Felder: Sowohl Name als auch Beschreibung sind erforderlich
- Benutzerzuweisung: Kann der Gruppe während der Erstellung Benutzer zuweisen
- Status: Standardmäßig ist „Aktiv“, wenn nicht angegeben
- Validierung: Benutzer-IDs werden vor der Zuweisung validiert
- Flache Antwort: Die Antwort ist nicht unter dem Datenobjekt verschachtelt
- Die Gruppe ist nach der Erstellung sofort einsatzbereit