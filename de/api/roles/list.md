---
id: list
title: "Rollen auflisten"
sidebar_label: "Rollen auflisten"
description: "Rufen Sie alle verfügbaren Benutzerrollen ab"
openapi: "GET /roles"
---
# Rollen auflisten

Rufen Sie alle verfügbaren Benutzerrollen im SecureAI-System ab.

## Endpunkt

```
GET /roles
```

## Beschreibung

Dieser Endpunkt gibt alle im SecureAI-System verfügbaren Benutzerrollen zurück. Es bietet detaillierte Informationen zu jeder Rolle, einschließlich Berechtigungen, Beschreibungen und Metadaten. Dies ist hilfreich, um die verfügbaren Rollen und ihre Fähigkeiten zu verstehen.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `page` | Ganzzahl | Nein | 1 | Seitenzahl für Paginierung (Standard: 1) |
| `limit` | Ganzzahl | Nein | 20 | Anzahl der Rollen pro Seite (Standard: 20) |
| `search` | Zeichenfolge | Nein | - | Suchbegriff für Name, Anzeigename oder Beschreibung |
| `isSystem` | Zeichenfolge | Nein | - | Nach Systemrollen filtern (wahr/falsch) |
| `sortBy` | Zeichenfolge | Nein | erstellt am | Zu sortierendes Feld (Standard: „createdAt“) |
| `sortOrder` | Zeichenfolge | Nein | absteigend | Sortierreihenfolge (auf/ab, Standard: „ab“) |

## Beispielanfrage

```bash
GET /roles?page=1&limit=10&search=admin
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "roles": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c26",
      "name": "custom_role",
      "displayName": "Custom Role",
      "description": "Custom role with specific permissions",
      "isSystem": false,
      "hasAdminPanelAccess": true,
      "permissions": [
        {
          "section": "user-management",
          "level": "admin"
        },
        {
          "section": "index-management",
          "level": "reader"
        }
      ],
      "canInteractWithAI": true,
      "canUseChat": true,
      "userCount": 5,
      "createdBy": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `roles` | Array | Array von Rollenobjekten |
| `roles[].id` | Zeichenfolge | Eindeutiger Rollenbezeichner |
| `roles[].name` | Zeichenfolge | Rollenname |
| `roles[].displayName` | Zeichenfolge | Anzeigename für die Rolle |
| `roles[].description` | Zeichenfolge | Rollenbeschreibung |
| `roles[].isSystem` | boolescher Wert | Ob es sich um eine Systemrolle handelt |
| `roles[].hasAdminPanelAccess` | boolescher Wert | Ob die Rolle Zugriff auf das Admin-Panel hat |
| `roles[].permissions` | Array | Array von Berechtigungsobjekten |
| `roles[].permissions[].section` | Zeichenfolge | Berechtigungsabschnitt |
| `roles[].permissions[].level` | Zeichenfolge | Berechtigungsstufe |
| `roles[].canInteractWithAI` | boolescher Wert | Ob die Rolle mit der KI interagieren kann |
| `roles[].canUseChat` | boolescher Wert | Ob die Rolle Chat verwenden kann |
| `roles[].userCount` | Ganzzahl | Anzahl der Benutzer mit dieser Rolle |
| `roles[].createdBy` | Objekt | Benutzer, der die Rolle erstellt hat |
| `roles[].createdBy.id` | Zeichenfolge | Benutzer-ID des Erstellers |
| `roles[].createdBy.name` | Zeichenfolge | Name des Erstellers |
| `roles[].createdBy.email` | Zeichenfolge | E-Mail des Erstellers |
| `roles[].createdAt` | Zeichenfolge | Erstellungszeitstempel |
| `roles[].updatedAt` | Zeichenfolge | Zeitstempel der letzten Aktualisierung |
| `pagination` | Objekt | Informationen zur Paginierung |
| `pagination.page` | Ganzzahl | Aktuelle Seitenzahl |
| `pagination.limit` | Ganzzahl | Artikel pro Seite |
| `pagination.total` | Ganzzahl | Gesamtzahl der Rollen |
| `pagination.pages` | Ganzzahl | Gesamtzahl der Seiten |

## Beispielverwendung

### JavaScript

```javascript
const listRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/roles${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await listRoles({
  page: 1,
  limit: 10,
  search: 'admin'
});
console.log(result.roles);
```

### Python

```python
import requests

def list_roles(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "page": 1,
    "limit": 10,
    "search": "admin"
}

result = list_roles(params)
print(result["roles"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/roles?page=1&limit=10&search=admin" \
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


## Anwendungsfälle

- **Rollenverwaltung**: Alle verfügbaren Rollen für die Benutzerzuweisung auflisten
- **Berechtigungsüberprüfung**: Verstehen Sie, welche Berechtigungen jede Rolle hat
- **Zugriffskontrolle**: Planen Sie den Benutzerzugriff basierend auf den verfügbaren Rollen
- **Benutzerzuweisung**: Weisen Sie Benutzern je nach Bedarf Rollen zu
- **Rollenanalyse**: Analysieren Sie die Rollennutzung und Benutzerverteilung

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

– Für diesen Endpunkt sind Administratorrechte erforderlich
- Seitenbasierte Paginierung: Verwendet Seitenparameter, keinen Offset
- Suche: Sucht in den Feldern „Name“, „Anzeigename“ und „Beschreibung“.
- Systemrollen: Kann nach System- oder benutzerdefinierten Rollen filtern
- Sortieren: Kann nach jedem Feld in aufsteigender oder absteigender Reihenfolge sortieren
- Flache Antwort: Die Antwort ist nicht unter dem Datenobjekt verschachtelt
- Benutzeranzahl: Zeigt an, wie viele Benutzer jede Rolle haben
- Erstellerinformationen: Zeigt an, wer die einzelnen Rollen erstellt hat