---
id: create
title: "Rolle erstellen"
sidebar_label: "Rolle erstellen"
description: "Erstellen Sie eine neue Benutzerrolle"
openapi: "POST /roles"
---
# Rolle erstellen

Erstellen Sie eine neue benutzerdefinierte Benutzerrolle mit spezifischen Berechtigungen.

## Endpunkt

```
POST /roles
```

## Beschreibung

Mit diesem Endpunkt können Administratoren neue benutzerdefinierte Benutzerrollen erstellen. Benutzerdefinierte Rollen können über spezifische Berechtigungen verfügen, die auf die Anforderungen Ihrer Organisation zugeschnitten sind. Sie können beim Erstellen den Rollennamen, die Beschreibung und die Berechtigungen angeben.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Ja | Rollenname (Systemkennung) |
| `displayName` | Zeichenfolge | Ja | Für Menschen lesbarer Rollenname |
| `description` | Zeichenfolge | Ja | Beschreibung des Rollenzwecks |
| `hasAdminPanelAccess` | boolescher Wert | Nein | Ob die Rolle Zugriff auf das Admin-Panel hat (Standard: false) |
| `permissions` | Array | Nein | Array von Berechtigungsobjekten |
| `canInteractWithAI` | boolescher Wert | Nein | Ob die Rolle mit der KI interagieren kann (Standard: true) |
| `canUseChat` | boolescher Wert | Nein | Ob die Rolle den Chat nutzen kann (Standard: true) |

## Beispielanfrage

```json
{
  "name": "content_editor",
  "displayName": "Content Editor",
  "description": "Role for editing and managing content",
  "hasAdminPanelAccess": false,
  "permissions": [
    {
      "section": "user-management",
      "level": "reader"
    },
    {
      "section": "index-management",
      "level": "admin"
    }
  ],
  "canInteractWithAI": true,
  "canUseChat": true
}
```

## Erfolgsantwort

**Statuscode**: `201 Created`

```json
{
  "success": true,
  "message": "Role created successfully",
  "role": {
    "id": "60a7c8f5e8b4f5001f7a8c26",
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "isSystem": false,
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true,
    "userCount": 0,
    "createdBy": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `role` | Objekt | Erstelltes Rollenobjekt |
| `role.id` | Zeichenfolge | Eindeutiger Rollenbezeichner |
| `role.name` | Zeichenfolge | Rollenname |
| `role.displayName` | Zeichenfolge | Anzeigename für die Rolle |
| `role.description` | Zeichenfolge | Rollenbeschreibung |
| `role.isSystem` | boolescher Wert | Ob es sich um eine Systemrolle handelt |
| `role.hasAdminPanelAccess` | boolescher Wert | Ob die Rolle Zugriff auf das Admin-Panel hat |
| `role.permissions` | Array | Array von Berechtigungsobjekten |
| `role.permissions[].section` | Zeichenfolge | Berechtigungsabschnitt |
| `role.permissions[].level` | Zeichenfolge | Berechtigungsstufe |
| `role.canInteractWithAI` | boolescher Wert | Ob die Rolle mit der KI interagieren kann |
| `role.canUseChat` | boolescher Wert | Ob die Rolle Chat verwenden kann |
| `role.userCount` | Ganzzahl | Anzahl der Benutzer mit dieser Rolle |
| `role.createdBy` | Objekt | Benutzer, der die Rolle erstellt hat |
| `role.createdBy.id` | Zeichenfolge | Benutzer-ID des Erstellers |
| `role.createdBy.name` | Zeichenfolge | Name des Erstellers |
| `role.createdBy.email` | Zeichenfolge | E-Mail des Erstellers |
| `role.createdAt` | Zeichenfolge | Erstellungszeitstempel |

## Beispielverwendung

### JavaScript

```javascript
const createRole = async (roleData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/roles', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  
  return await response.json();
};

// Example usage
const roleData = {
  name: "content_editor",
  displayName: "Content Editor",
  description: "Role for editing and managing content",
  hasAdminPanelAccess: false,
  permissions: [
    {
      section: "user-management",
      level: "reader"
    },
    {
      section: "index-management",
      level: "admin"
    }
  ],
  canInteractWithAI: true,
  canUseChat: true
};

const result = await createRole(roleData);
console.log('Created role:', result.role.id);
```

### Python

```python
import requests

def create_role(role_data):
    url = "https://{customer.name}.hiperai.ai/api/external/roles"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=role_data)
    return response.json()

# Example usage
role_data = {
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": False,
    "permissions": [
        {
            "section": "user-management",
            "level": "reader"
        },
        {
            "section": "index-management",
            "level": "admin"
        }
    ],
    "canInteractWithAI": True,
    "canUseChat": True
}

result = create_role(role_data)
print("Created role:", result["role"]["id"])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/roles" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_editor",
    "displayName": "Content Editor",
    "description": "Role for editing and managing content",
    "hasAdminPanelAccess": false,
    "permissions": [
      {
        "section": "user-management",
        "level": "reader"
      },
      {
        "section": "index-management",
        "level": "admin"
      }
    ],
    "canInteractWithAI": true,
    "canUseChat": true
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Role name is required",
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
    "code": "ROLE_NAME_EXISTS",
    "message": "Role name already exists"
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

## Verfügbare Berechtigungsabschnitte

| Abschnitt | Beschreibung |
|---------|-------------|
| `home` | Zugriff auf das Home-Dashboard |
| `user-management` | Benutzerverwaltungsvorgänge |
| `index-management` | Indexverwaltungsvorgänge |
| `analytics` | Analytik und Reporting |
| `group-management` | Gruppenmanagement-Operationen |
| `integrations` | Integrationsmanagement |
| `services-status` | Überwachung des Dienststatus |
| `settings` | Systemeinstellungen |
| `announcements` | Ankündigungsmanagement |
| `smltp-security` | SMLTP-Sicherheitsfunktionen |

## Verfügbare Berechtigungsstufen

| Ebene | Beschreibung |
|-------|-------------|
| `none` | Kein Zugriff auf den Abschnitt |
| `reader` | Lesezugriff auf den Abschnitt |
| `admin` | Vollständiger administrativer Zugriff auf den Abschnitt |

## Anwendungsfälle

- **Benutzerdefinierte Rollen**: Erstellen Sie Rollen, die auf die Anforderungen Ihres Unternehmens zugeschnitten sind
- **Zugriffskontrolle**: Definieren Sie spezifische Berechtigungen für verschiedene Benutzertypen
- **Sicherheit**: Implementieren Sie Zugriffsprinzipien mit den geringsten Rechten
- **Compliance**: Erstellen Sie Rollen, die den gesetzlichen Anforderungen entsprechen
- **Integration**: Definieren Sie Rollen für die Systemintegration von Drittanbietern

## Tarifbegrenzungen

- **Standard**: 50 Anfragen pro Minute
- **Täglich**: 5.000 Anfragen pro Tag
- **Monatlich**: 150.000 Anfragen pro Monat

## Notizen

- **Nur Administrator**: Dieser Endpunkt erfordert Administratorrechte
- **Erforderliche Felder**: Name, Anzeigename und Beschreibung sind erforderlich
- **Berechtigungsstruktur**: Berechtigungen sind Objekte mit Abschnitts- und Ebeneneigenschaften
- **Systemrollen**: Benutzerdefinierte Rollen sind niemals Systemrollen
- **Flachantwort**: Die Antwort ist nicht unter dem Datenobjekt verschachtelt
- **Erstellerinfo**: Zeigt an, wer die Rolle erstellt hat
- **Benutzeranzahl**: Beginnt bei 0 für neue Rollen
- Rollennamen müssen innerhalb des Systems eindeutig sein
- Die Rolle steht sofort für die Benutzerzuweisung zur Verfügung