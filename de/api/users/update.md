---
id: update
title: "Benutzer aktualisieren"
sidebar_label: "Benutzer aktualisieren"
description: "Aktualisieren Sie ein vorhandenes Benutzerkonto"
openapi: "PUT /users/{userId}"
---
# Benutzer aktualisieren

Aktualisieren Sie ein vorhandenes Benutzerkonto mit neuen Informationen.

## Endpunkt

```
PUT /users/{userId}
```

## Beschreibung

Mit diesem Endpunkt können Administratoren ein vorhandenes Benutzerkonto aktualisieren. Sie können Benutzerdetails wie Name, E-Mail, Rolle, Lizenzstufe und andere Kontoeinstellungen ändern.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Pfadparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `userId` | Zeichenfolge | Ja | Die eindeutige Kennung des zu aktualisierenden Benutzers |

## Anforderungstext

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `name` | Zeichenfolge | Nein | Vollständiger Name des Benutzers |
| `username` | Zeichenfolge | Nein | Eindeutiger Benutzername für den Benutzer |
| `email` | Zeichenfolge | Nein | E-Mail-Adresse des Benutzers |
| `password` | Zeichenfolge | Nein | Neues Passwort für das Benutzerkonto |
| `role` | Zeichenfolge | Nein | Benutzerrolle (Administrator, Benutzer, globalReader) |
| `license` | Zeichenfolge | Nein | Lizenzstufe (Essential, Growth, Ultra, Early Access) |
| `status` | Ganzzahl | Nein | Kontostatus (0=inaktiv, 1=aktiv) |
| `roleId` | Zeichenfolge | Nein | Benutzerdefinierte Rollen-ID (MongoDB ObjectId) |
| `setupCompleted` | boolescher Wert | Nein | Ob die Benutzereinrichtung abgeschlossen ist |
| `isVerified` | boolescher Wert | Nein | Ob der Benutzer verifiziert ist |

## Beispielanfrage

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user",
  "license": "Growth",
  "status": 1,
  "setupCompleted": true,
  "isVerified": true
}
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60a7c8f5e8b4f5001f7a8c23",
    "name": "John Doe Updated",
    "username": "johndoe",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1,
    "isVerified": true,
    "setupCompleted": true,
    "authType": "basic",
    "customRole": {
      "id": "60a7c8f5e8b4f5001f7a8c24",
      "name": "custom_role",
      "displayName": "Custom Role"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `message` | Zeichenfolge | Erfolgsmeldung |
| `user` | Objekt | Aktualisiertes Benutzerobjekt |
| `user.id` | Zeichenfolge | Eindeutige Benutzerkennung |
| `user.name` | Zeichenfolge | Vollständiger Name des Benutzers |
| `user.username` | Zeichenfolge | Benutzername des Benutzers |
| `user.email` | Zeichenfolge | E-Mail-Adresse des Benutzers |
| `user.role` | Zeichenfolge | Rolle des Benutzers im System |
| `user.license` | Zeichenfolge | Lizenzstufe des Benutzers |
| `user.status` | Ganzzahl | Kontostatus des Benutzers (0=inaktiv, 1=aktiv) |
| `user.isVerified` | boolescher Wert | Ob der Benutzer verifiziert ist |
| `user.setupCompleted` | boolescher Wert | Ob die Benutzereinrichtung abgeschlossen ist |
| `user.authType` | Zeichenfolge | Authentifizierungstyp |
| `user.customRole` | Objekt | Benutzerdefinierte Rolleninformationen (falls zugewiesen) |
| `user.createdAt` | Zeichenfolge | Zeitstempel der Kontoerstellung |
| `user.updatedAt` | Zeichenfolge | Zeitstempel der letzten Aktualisierung |
| `user.lastActive` | Zeichenfolge | Zeitstempel der letzten Aktivität des Benutzers |

## Beispielverwendung

### JavaScript

```javascript
const updateUser = async (userId, userData) => {
  const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage
const userData = {
  name: "John Doe Updated",
  email: "john.updated@example.com",
  role: "user",
  license: "Growth",
  status: 1
};

const result = await updateUser('60a7c8f5e8b4f5001f7a8c23', userData);
console.log(result);
```

### Python

```python
import requests

def update_user(user_id, user_data):
    url = f"https://{customer.name}.hiperai.ai/api/external/users/{user_id}"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=user_data)
    return response.json()

# Example usage
user_data = {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
}

result = update_user("60a7c8f5e8b4f5001f7a8c23", user_data)
print(result)
```

### cURL

```bash
curl -X PUT "https://{customer.name}.hiperai.ai/api/external/users/60a7c8f5e8b4f5001f7a8c23" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "license": "Growth",
    "status": 1
  }'
```

## Fehlerantworten

### 400 Ungültige Anfrage

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
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

### 404 Nicht gefunden

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 409 Konflikt

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email address already in use"
  }
}
```

## Validierungen und Geschäftsregeln

- **Lizenzwert**: Muss in den zulässigen Lizenzen enthalten sein (`Essential`, `Growth`, `Ultra`, `Early Access`). Ungültige Werte geben 400 zurück.
- **Lizenzkapazität**: Durchgesetzt über `checkLicenseCapacity`; gibt 400 zurück, wenn die ausgewählte Ebene voll ist.
- **Lizenz-Downgrade-Schutz**: Wenn der Wechsel zu einer niedrigeren Stufe das persönliche Indexkontingent verringert, wird die Änderung blockiert, wenn die aktuelle Anzahl persönlicher Indexe `INDEX_QUOTAS[new_license]` überschreitet; gibt 400 mit expliziter Anleitung zurück.
- **E-Mail-Normalisierung**: Vor der Validierung und Speicherung in Kleinbuchstaben geschrieben und gekürzt.
- **Normalisierung des Benutzernamens**: Vor der Validierung und Speicherung in Kleinbuchstaben geschrieben und gekürzt.
- **E-Mail-Format**: Einfache Regex-Validierung; Ungültige E-Mails geben 400 zurück.
- **Benutzernamenformat**: Muss mit `^[a-z0-9.-]{3,30}$` übereinstimmen; Ungültige Benutzernamen geben 400 zurück.
- **Einzigartigkeit**: `email`, `username` und `name` müssen eindeutig bleiben; Konflikte geben 409 zurück.

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
  "message": "No Ultra licenses available (used/limit)"
}
```

### 400 Lizenz-Downgrade überschreitet Kontingent

```json
{
  "success": false,
  "error": "License downgrade exceeds index quota",
  "message": "Cannot change license to Essential: user has 5 personal indexes but Essential allows 2. Remove or reassign 3 index(es) before downgrading."
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
  "message": "A user with this username already exists"
}
```

## Benutzerrollen

| Rolle | Beschreibung | Berechtigungen |
|------|-------------|-------------|
| `admin` | Administrator | Voller Systemzugriff |
| `user` | Normaler Benutzer | Standardbenutzerzugriff |
| `globalReader` | Globaler Leser | Schreibgeschützter Admin-Panel-Zugriff |

## Lizenzstufen

| Stufe | Beschreibung | Funktionen |
|------|-------------|----------|
| `Essential` | Grundstufe | Eingeschränkte Funktionen |
| `Growth` | Professionelle Stufe | Erweiterte Funktionen |
| `Ultra` | Premium-Stufe | Vollständige Funktionen |
| `Early Access` | Early-Access-Stufe | Beta-Funktionen |

## Kontostatus

| Status | Beschreibung |
|--------|-------------|
| `0` | Inaktives Konto |
| `1` | Aktives Konto |

## Anwendungsfälle

- **Rollenverwaltung**: Aktualisieren von Benutzerrollen für die Zugriffskontrolle
- **Lizenz-Upgrades**: Änderung der Benutzerlizenzstufen
- **Kontopflege**: Benutzerinformationen und Metadaten aktualisieren
- **Statusverwaltung**: Benutzerkonten aktivieren oder sperren
- **Profilaktualisierungen**: Ändern von Benutzernamen, E-Mails oder anderen Details

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

- Nur Administratoren können Benutzerkonten aktualisieren
- E-Mail-Adressen müssen für alle Benutzer eindeutig sein
- Passwortaktualisierungen sind optional und werden nur angewendet, wenn sie bereitgestellt werden
- Metadatenaktualisierungen werden mit vorhandenen Metadaten zusammengeführt
– Der `updatedAt`-Zeitstempel wird bei erfolgreichen Vorgängen automatisch aktualisiert