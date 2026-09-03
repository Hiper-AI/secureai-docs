---
id: update
title: "Gruppe aktualisieren"
sidebar_label: "Gruppe aktualisieren"
description: "Aktualisieren Sie eine vorhandene Benutzergruppe"
openapi: "PUT /groups/{groupId}"
---
# Gruppe aktualisieren

Aktualisieren Sie eine vorhandene Benutzergruppe mit neuen Informationen, Beschreibungen oder Metadaten.

## Endpunkt

```
PUT /groups/{groupId}
```

## Beschreibung

Mit diesem Endpunkt können Administratoren eine vorhandene Benutzergruppe aktualisieren. Sie können den Gruppennamen, die Beschreibung, die Metadaten und andere Eigenschaften ändern. Die Gruppe muss vorhanden sein und Sie müssen über die entsprechenden Berechtigungen zum Aktualisieren verfügen.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Pfadparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `groupId` | Zeichenfolge | Ja | Der eindeutige Bezeichner der zu aktualisierenden Gruppe |

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Nein | Neuer Name für die Gruppe |
| `description` | Zeichenfolge | Nein | Neue Beschreibung für die Gruppe |
| `users` | Array | Nein | Array von Benutzer-IDs, die der Gruppe | zugewiesen werden sollen
| `status` | Zeichenfolge | Nein | Gruppenstatus |

## Beispielanfrage

```json
{
  "name": "Updated Engineering Team",
  "description": "Updated software engineering and development team",
  "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  "status": "Active"
}
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "message": "Group updated successfully",
  "group": {
    "id": "60a7c8f5e8b4f5001f7a8c25",
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "status": "Active",
    "userCount": 3,
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
      },
      {
        "id": "60a7c8f5e8b4f5001f7a8c27",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      }
    ],
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
| `group` | Objekt | Aktualisiertes Gruppenobjekt |
| `group.id` | Zeichenfolge | Eindeutiger Gruppenbezeichner |
| `group.name` | Zeichenfolge | Aktualisierter Gruppenname |
| `group.description` | Zeichenfolge | Aktualisierte Gruppenbeschreibung |
| `group.status` | Zeichenfolge | Gruppenstatus |
| `group.userCount` | Ganzzahl | Anzahl der Benutzer in der Gruppe |
| `group.users` | Array | Array von Benutzerobjekten in der Gruppe |
| `group.users[].id` | Zeichenfolge | Benutzer-ID |
| `group.users[].name` | Zeichenfolge | Benutzername |
| `group.users[].email` | Zeichenfolge | Benutzer-E-Mail |
| `group.createdAt` | Zeichenfolge | Ursprünglicher Erstellungszeitstempel |
| `group.updatedAt` | Zeichenfolge | Zeitstempel der letzten Aktualisierung |

## Beispielverwendung

### JavaScript

```javascript
const updateGroup = async (groupId, updateData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/groups/${groupId}`, {
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
  name: "Updated Engineering Team",
  description: "Updated software engineering and development team",
  users: ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
  status: "Active"
};

const result = await updateGroup('60a7c8f5e8b4f5001f7a8c25', updateData);
console.log('Updated group:', result.group);
```

### Python

```python
import requests

def update_group(group_id, update_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/groups/{group_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=update_data)
    return response.json()

# Example usage
update_data = {
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
    "status": "Active"
}

result = update_group("60a7c8f5e8b4f5001f7a8c25", update_data)
print("Updated group:", result["group"])
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/groups/60a7c8f5e8b4f5001f7a8c25" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Engineering Team",
    "description": "Updated software engineering and development team",
    "users": ["60a7c8f5e8b4f5001f7a8c24", "60a7c8f5e8b4f5001f7a8c26", "60a7c8f5e8b4f5001f7a8c27"],
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
    "message": "Group name cannot be empty",
    "details": {
      "field": "name",
      "value": ""
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
    "message": "Cannot update this group"
  }
}
```

### 404 Nicht gefunden

```json
{
  "success": false,
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "Group not found"
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

- **Gruppenverwaltung**: Gruppeninformationen und -beschreibungen aktualisieren
- **Benutzerzuweisung**: Weisen Sie der Gruppe neue Benutzer zu
- **Namensänderungen**: Gruppen zur besseren Übersichtlichkeit umbenennen
- **Statusaktualisierungen**: Gruppenstatus ändern
- **Team-Updates**: Gruppeninformationen aktualisieren, wenn sich die Teamstruktur ändert

## Tarifbegrenzungen

- **Standard**: 50 Anfragen pro Minute
- **Täglich**: 5.000 Anfragen pro Tag
- **Monatlich**: 150.000 Anfragen pro Monat

## Notizen

– Auf diesen Endpunkt können nur Administratoren zugreifen
- Teilweise Aktualisierungen: Schließen Sie nur die Felder ein, die Sie ändern möchten
- Benutzerzuweisung: Kann der Gruppe neue Benutzer zuweisen
- Namensvalidierung: Gruppennamen müssen eindeutig sein
- Flache Antwort: Die Antwort ist nicht unter dem Datenobjekt verschachtelt
- Benutzervalidierung: Benutzer-IDs werden vor der Zuweisung validiert
- Der `updatedAt`-Zeitstempel wird automatisch aktualisiert