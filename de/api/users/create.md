---
sidebar_position: 2
title: "Neuen Benutzer erstellen"
openapi: "POST /users"
---
# Neuen Benutzer erstellen

Erstellen Sie ein neues Benutzerkonto. Nur für Administratoren zugänglich.

## Endpunkt

```
POST /users
```

## Beschreibung

Dieser Endpunkt ermöglicht Administratoren das Erstellen neuer Benutzerkonten im System. Sie können verschiedene Benutzerattribute angeben, einschließlich Rolle, Lizenz und Authentifizierungstyp. Dies ist ein administrativer Endpunkt, der entsprechende Berechtigungen erfordert.

## Benutzererstellungsablauf

**Basic Auth** (`authType: "basic"`): Der Benutzer erhält eine Willkommens-E-Mail mit einem Link zur Passworteinrichtung. Das Konto wird unbestätigt erstellt, bis das Passwort festgelegt wird.

**Enterprise SSO** (`authType: "enterprise"`): Der Benutzer wird verifiziert erstellt und kann sich über Enterprise SSO (Auth0, Microsoft AD usw.) anmelden. Keine Passwort-Einrichtung erforderlich.

## Authentifizierung

Erforderlich. Fügen Sie Ihren API-Schlüssel in den Autorisierungsheader ein.

```bash
Authorization: Bearer sk-your-api-key-here
```

## Anfrage

### Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Standard | Beschreibung |
|-----------|------|----------|---------|-------------|
| `name` | Zeichenfolge | Ja | - | Vollständiger Name des Benutzers |
| `username` | Zeichenfolge | Nein | - | Eindeutiger Benutzername (wird automatisch aus der E-Mail generiert, falls nicht angegeben) |
| `email` | Zeichenfolge | Ja | - | E-Mail-Adresse des Benutzers |
| `role` | Zeichenfolge | Nein | Benutzer | Benutzerrolle (Administrator, Benutzer, globalReader) |
| `license` | Zeichenfolge | Nein | Wesentlich | Lizenzstufe des Benutzers (Essential, Growth, Ultra, Early Access) |
| `roleId` | Zeichenfolge | Nein | - | Benutzerdefinierte Rollen-ID (MongoDB ObjectId) |
| `setupCompleted` | boolescher Wert | Nein | falsch | Ob die Benutzereinrichtung abgeschlossen ist |
| `authType` | Zeichenfolge | Nein | einfach | Authentifizierungstyp (Basis, Unternehmen) |

### Beispielanfrage

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "setupCompleted": false,
    "authType": "enterprise"
  }'
```

## Antwort

### Erfolgsantwort (201)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": false,
    "setupCompleted": false,
    "authType": "basic",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Immer `true` für erfolgreiche Anfragen |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `user` | Objekt | Erstelltes Benutzerobjekt |
| `user.id` | Zeichenfolge | Eindeutige Kennung des Benutzers |
| `user.name` | Zeichenfolge | Vollständiger Name des Benutzers |
| `user.username` | Zeichenfolge | Benutzername des Benutzers |
| `user.email` | Zeichenfolge | E-Mail-Adresse des Benutzers |
| `user.role` | Zeichenfolge | Benutzerrolle |
| `user.license` | Zeichenfolge | Lizenzstufe des Benutzers |
| `user.status` | Ganzzahl | Benutzerstatus (1=aktiv) |
| `user.isVerified` | boolescher Wert | Ob der Benutzer verifiziert ist |
| `user.setupCompleted` | boolescher Wert | Ob die Benutzereinrichtung abgeschlossen ist |
| `user.authType` | Zeichenfolge | Authentifizierungstyp |
| `user.createdAt` | Zeichenfolge | Zeitstempel der Benutzererstellung |

## Beispielverwendung

### JavaScript

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    license: 'Growth'
  })
});

const data = await response.json();

if (data.success) {
  console.log('User created:', data.user.name);
  console.log('User ID:', data.user.id);
}
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
}

data = {
    'name': 'John Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'role': 'user',
    'license': 'Growth'
}

response = requests.post('https://{customer.name}.hiperai.ai/api/external/users', 
                       headers=headers, json=data)
result = response.json()

if result['success']:
    print('User created:', result['user']['name'])
    print('User ID:', result['user']['id'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/users" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "license": "Growth"
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "The 'name' field is required"
}
```

### 400 Ungültiger AuthType

```json
{
  "success": false,
  "error": "Invalid authType",
  "message": "authType must be either \"basic\" or \"enterprise\""
}
```

### 400 Pflichtfelder fehlen

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Name and email are required"
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
  "message": "Admin access required"
}
```

### 409 Konflikt

```json
{
  "success": false,
  "error": "User already exists",
  "message": "A user with this email already exists"
}
```

## Validierungen und Geschäftsregeln

- **Lizenzwert**: Muss eine der zulässigen Lizenzen sein (`Essential`, `Growth`, `Ultra`, `Early Access`). Ungültige Werte geben 400 zurück.
- **Lizenzkapazität**: Durchgesetzt über `checkLicenseCapacity`. Wenn die Kapazität für die ausgewählte Ebene voll ist, wird 400 zurückgegeben.
- **E-Mail-Normalisierung**: Vor der Validierung und Speicherung in Kleinbuchstaben geschrieben und gekürzt.
- **Normalisierung des Benutzernamens**: Vor der Validierung und Speicherung in Kleinbuchstaben geschrieben und gekürzt. Wird automatisch aus der E-Mail generiert, sofern nicht angegeben.
- **E-Mail-Format**: Validiert mit einem einfachen regulären Ausdruck; Ungültige E-Mails geben 400 zurück.
- **Benutzernamenformat**: Muss mit `^[a-z0-9.-]{3,30}$` übereinstimmen; Ungültige Benutzernamen geben 400 zurück.
- **Einzigartigkeit**: `email`, `username` und `name` müssen eindeutig sein. Konflikte geben 409 zurück.
- **Verhalten bei E-Mail-Einladungen**: Bei der Basisauthentifizierung erhalten Benutzer Willkommens-E-Mails mit Links zur Passworteinrichtung.

## Normalisierung und Speicherung

- `email` und `username` werden immer in Kleinbuchstaben und gekürzt gespeichert.

## Typische Fehlerformen

### 400 Ungültige Lizenz

```json
{
  "success": false,
  "error": "Invalid license",
  "message": "License must be one of: Essential, Growth, Ultra, Early Access"
}
```

### 400-Lizenz nicht verfügbar

```json
{
  "success": false,
  "error": "License unavailable",
  "message": "No Growth licenses available (used/limit)"
}
```

### 400 Ungültige E-Mail

```json
{
  "success": false,
  "error": "Invalid email",
  "message": "Email format is invalid"
}
```

### 400 Ungültiger Benutzername

```json
{
  "success": false,
  "error": "Invalid username",
  "message": "Username must be 3-30 chars, lowercase letters, digits, \".\", "-", or \"\""
}
```

### 409 Konflikt (Einzigartigkeit)

```json
{
  "success": false,
  "error": "Email/Username/Name already exists",
  "message": "A user with this email already exists"
}
```

## Benutzerrollen

| Rolle | Beschreibung | Berechtigungen |
|------|-------------|-------------|
| `admin` | Administrator | Voller Systemzugriff |
| `user` | Normaler Benutzer | Standardbenutzerzugriff |
| `globalReader` | Globaler Leser | Schreibgeschützter Admin-Panel-Zugriff |

## Lizenzstufen

| Lizenz | Beschreibung | Funktionen |
|---------|-------------|----------|
| `Essential` | Grundstufe | Eingeschränkte Funktionen |
| `Growth` | Professionelle Stufe | Erweiterte Funktionen |
| `Ultra` | Premium-Stufe | Vollständige Funktionen |
| `Early Access` | Early-Access-Stufe | Beta-Funktionen |

## Authentifizierungstypen

| Geben Sie | ein Beschreibung |
|------|-------------|
| `basic` | Benutzername/Passwort-Authentifizierung (Benutzer erhält E-Mail zur Passworteinrichtung) |
| `enterprise` | Enterprise SSO-Integration (Auth0, Microsoft AD usw.) |

## Anwendungsfälle

- **Benutzer-Onboarding**: Erstellen Sie neue Benutzerkonten für Teammitglieder
- **Passwortloses Onboarding**: Erstellen Sie Benutzer, die E-Mail-Einladungen erhalten, um ihre eigenen Passwörter festzulegen
- **SSO-Integration**: Erstellen Sie Benutzer, die sich über externe Identitätsanbieter authentifizieren
- **Massenbenutzererstellung**: Erstellen Sie programmgesteuert mehrere Benutzer
- **Integration**: Benutzer aus externen Systemen erstellen
- **Administrative Aufgaben**: Benutzerkonten über die API verwalten

## Tarifbegrenzungen

Dieser Endpunkt folgt den Standardratenbegrenzungen:
- 60 Anfragen pro Minute
- 1000 Anfragen pro Stunde