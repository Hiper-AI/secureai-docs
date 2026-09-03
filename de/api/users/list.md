---
sidebar_position: 1
title: "Alle Benutzer abrufen"
openapi: "GET /users"
---
# Alle Benutzer abrufen

Rufen Sie alle Benutzer mit Paginierung und Filterung ab. Nur für Administratoren zugänglich.

## Endpunkt

```
GET /users
```

## Beschreibung

Mit diesem Endpunkt können Administratoren eine paginierte Liste aller Benutzer im System abrufen. Es unterstützt das Filtern nach verschiedenen Kriterien, einschließlich Rolle, Lizenz, Status und Suchbegriffen. Dies ist ein administrativer Endpunkt, der entsprechende Berechtigungen erfordert.

## Authentifizierung

Erforderlich. Fügen Sie Ihren API-Schlüssel in den Autorisierungsheader ein.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anfrage

### Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Standard | Beschreibung |
|-----------|------|----------|---------|-------------|
| `page` | Ganzzahl | Nein | 1 | Seitenzahl für Paginierung |
| `limit` | Ganzzahl | Nein | 20 | Anzahl der Benutzer pro Seite (1-100) |
| `search` | Zeichenfolge | Nein | - | Suchbegriff für Name, E-Mail oder Benutzername |
| `role` | Zeichenfolge | Nein | - | Nach Benutzerrolle filtern (Administrator, Benutzer, globalReader) |
| `license` | Zeichenfolge | Nein | - | Nach Benutzerlizenz filtern (Essential, Growth, Ultra, Early Access) |
| `status` | Ganzzahl | Nein | - | Nach Benutzerstatus filtern (0=inaktiv, 1=aktiv) |
| `sortBy` | Zeichenfolge | Nein | erstellt am | Feld zum Sortieren nach |
| `sortOrder` | Zeichenfolge | Nein | absteigend | Sortierreihenfolge (aufsteigend, absteigend) |

### Beispielanfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20&role=user&status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

Mit Suche:

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john&license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

### Erfolgsantwort (200)

```json
{
  "success": true,
  "users": [
    {
      "id": "60a7c8f5e8b4f5001f7a8c23",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "license": "Growth",
      "status": 1,
      "isVerified": true,
      "setupCompleted": true,
      "authType": "basic",
      "mfaEnabled": false,
      "customRole": {
        "id": "60a7c8f5e8b4f5001f7a8c24",
        "name": "custom_role",
        "displayName": "Custom Role"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "lastActive": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Immer `true` für erfolgreiche Anfragen |
| `users` | Array | Array von Benutzerobjekten |
| `users[].id` | Zeichenfolge | Eindeutige Kennung des Benutzers |
| `users[].name` | Zeichenfolge | Vollständiger Name des Benutzers |
| `users[].username` | Zeichenfolge | Benutzername des Benutzers |
| `users[].email` | Zeichenfolge | E-Mail-Adresse des Benutzers |
| `users[].role` | Zeichenfolge | Benutzerrolle (Administrator, Benutzer, globalReader) |
| `users[].license` | Zeichenfolge | Lizenzstufe des Benutzers (Essential, Growth, Ultra, Early Access) |
| `users[].status` | Ganzzahl | Benutzerstatus (0=inaktiv, 1=aktiv) |
| `users[].isVerified` | boolescher Wert | Ob der Benutzer verifiziert ist |
| `users[].setupCompleted` | boolescher Wert | Ob die Benutzereinrichtung abgeschlossen ist |
| `users[].authType` | Zeichenfolge | Authentifizierungstyp (Basic, auth0) |
| `users[].mfaEnabled` | boolescher Wert | Ob MFA aktiviert ist |
| `users[].customRole` | Objekt | Benutzerdefinierte Rolleninformationen (falls zugewiesen) |
| `users[].customRole.id` | Zeichenfolge | Benutzerdefinierte Rollen-ID |
| `users[].customRole.name` | Zeichenfolge | Benutzerdefinierter Rollenname |
| `users[].customRole.displayName` | Zeichenfolge | Anzeigename der benutzerdefinierten Rolle |
| `users[].createdAt` | Zeichenfolge | Zeitstempel der Benutzererstellung |
| `users[].updatedAt` | Zeichenfolge | Zeitstempel der letzten Benutzeraktualisierung |
| `users[].lastActive` | Zeichenfolge | Zeitstempel der letzten Aktivität des Benutzers |
| `pagination` | Objekt | Informationen zur Paginierung |
| `pagination.page` | Ganzzahl | Aktuelle Seitenzahl |
| `pagination.limit` | Ganzzahl | Artikel pro Seite |
| `pagination.total` | Ganzzahl | Gesamtzahl der Benutzer |
| `pagination.pages` | Ganzzahl | Gesamtzahl der Seiten |

## Beispielverwendung

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();

if (data.success) {
  console.log(`Showing ${data.users.length} of ${data.pagination.total} users`);
  data.users.forEach(user => {
    console.log(`${user.name} (${user.email}) - ${user.role}`);
  });
}
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'page': 1,
    'limit': 20,
    'role': 'user',
    'status': 1
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/users', 
                      headers=headers, params=params)
data = response.json()

if data['success']:
    print(f"Showing {len(data['users'])} of {data['pagination']['total']} users")
    for user in data['users']:
        print(f"{user['name']} ({user['email']}) - {user['role']}")
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?page=1&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Fehlerantworten

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
  "message": "Admin access required"
}
```

## Filterbeispiele

### Suche nach Name oder E-Mail

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?search=john" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Nach Rolle filtern

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?role=admin" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Nach Lizenz filtern

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?license=Growth" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Nach Status filtern

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?status=1" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### Sortieren nach „Zuletzt aktiv“.

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/users?sortBy=lastActive&sortOrder=desc" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Anwendungsfälle

- **Benutzerverwaltung**: Alle Benutzer im System anzeigen und verwalten
- **Benutzeranalyse**: Analysieren Sie die Benutzerverteilung nach Rolle, Lizenz oder Status
- **Suchen und Filtern**: Finden Sie bestimmte Benutzer anhand verschiedener Kriterien
- **Verwaltungsaufgaben**: Unterstützung von Verwaltungsvorgängen und Berichterstattung

## Rollenbeschreibungen

- **admin**: Vollständiger Systemzugriff mit administrativer Kontrolle
- **Benutzer**: Standardzugriff auf Chatfunktionen und persönliche Wissensdatenbanken  
- **globalReader**: Lesezugriff auf das Admin-Panel mit Anzeigeberechtigungen

## Lizenzbeschreibungen

- **Essential**: Basisstufe mit 29.000 Punkten/Monat
- **Wachstum**: Mittelklasse mit erweiterten Funktionen
- **Ultra**: Premium-Stufe mit maximalen Funktionen
- **Early Access**: Beta-Stufe mit experimentellen Funktionen

## Tarifbegrenzungen

Dieser Endpunkt folgt den Standardratenbegrenzungen:
- 60 Anfragen pro Minute
- 1000 Anfragen pro Stunde