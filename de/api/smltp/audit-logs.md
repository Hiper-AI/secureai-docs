---
id: audit-logs
title: "Audit-Protokolle"
sidebar_label: "Audit-Protokolle"
description: "Rufen Sie SMLTP-Überwachungsprotokolle ab"
openapi: "GET /audit-logs"
---
# Audit-Protokolle

Rufen Sie SMLTP-Prüfprotokolle (Secure Model Language Transfer Protocol) zur Sicherheitsüberwachung und Compliance ab.

## Endpunkt

```
GET /audit-logs
```

## Beschreibung

Dieser Endpunkt gibt SMLTP-Überwachungsprotokolle zurück, die Sicherheitsereignisse, Richtlinienverstöße und Compliance-Aktivitäten verfolgen. Dies ist nützlich für die Sicherheitsüberwachung, Compliance-Prüfung und die Untersuchung von Sicherheitsvorfällen.

## Authentifizierung

**Erforderlich**: API-Schlüssel mit Administratorrechten

```
Authorization: Bearer sk-your-api-key-here
```

## Abfrageparameter

| Parameter | Geben Sie | ein Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `page` | Ganzzahl | Nein | 1 | Seitenzahl für Paginierung (Standard: 1) |
| `limit` | Ganzzahl | Nein | 50 | Anzahl der Protokolle pro Seite (Standard: 50) |
| `startDate` | Zeichenfolge | Nein | - | Startdatum für die Filterung (ISO 8601-Format) |
| `endDate` | Zeichenfolge | Nein | - | Enddatum für die Filterung (ISO 8601-Format) |
| `type` | Zeichenfolge | Nein | - | Nach Protokolltyp filtern |
| `severity` | Zeichenfolge | Nein | - | Nach Schweregrad filtern |
| `userId` | Zeichenfolge | Nein | - | Nach Benutzer-ID filtern |
| `search` | Zeichenfolge | Nein | - | Suchbegriff für Beschreibung oder Metadaten |

## Beispielanfrage

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## Erfolgsantwort

**Statuscode**: `200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Antwortfelder

| Feld | Geben Sie | ein Beschreibung |
|-------|------|-------------|
| `success` | boolescher Wert | Zeigt an, ob der Vorgang erfolgreich war |
| `data` | Objekt | Antwortdatenobjekt |
| `data.logs` | Array | Array von Audit-Log-Objekten |
| `data.logs[].id` | Zeichenfolge | Eindeutige Prüfprotokoll-ID |
| `data.logs[].timestamp` | Zeichenfolge | Protokollzeitstempel (ISO 8601) |
| `data.logs[].type` | Zeichenfolge | Art des Audit-Ereignisses |
| `data.logs[].severity` | Zeichenfolge | Schweregrad |
| `data.logs[].description` | Zeichenfolge | Veranstaltungsbeschreibung |
| `data.logs[].user` | Objekt | Benutzerinformationen (falls verfügbar) |
| `data.logs[].user.id` | Zeichenfolge | Benutzer-ID |
| `data.logs[].user.name` | Zeichenfolge | Benutzername |
| `data.logs[].user.email` | Zeichenfolge | Benutzer-E-Mail |
| `data.logs[].metadata` | Objekt | Zusätzliche Metadaten |
| `data.logs[].complianceCategory` | Zeichenfolge | Compliance-Kategorie |
| `data.logs[].outcome` | Zeichenfolge | Veranstaltungsergebnis |
| `data.pagination` | Objekt | Informationen zur Paginierung |
| `data.pagination.page` | Ganzzahl | Aktuelle Seitenzahl |
| `data.pagination.limit` | Ganzzahl | Artikel pro Seite |
| `data.pagination.total` | Ganzzahl | Gesamtzahl der Protokolle |
| `data.pagination.pages` | Ganzzahl | Gesamtzahl der Seiten |
| `data.dateRange` | Objekt | Informationen zum Datumsbereich |

## Beispielverwendung

### JavaScript

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

### Python

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

### cURL

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
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

### Datumsbereich

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### Ereignisfilterung

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### Benutzerfilterung

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## Anwendungsfälle

- **Sicherheitsüberwachung**: Überwachen Sie Sicherheitsereignisse und Richtlinienverstöße
- **Compliance-Auditing**: Verfolgen Sie Compliance-Aktivitäten und -Verstöße
- **Untersuchung von Vorfällen**: Untersuchen Sie Sicherheitsvorfälle und -verstöße
- **Richtlinienanalyse**: Analysieren Sie die Wirksamkeit und Durchsetzung von Richtlinien
- **Benutzeraktivität**: Verfolgen Sie Benutzeraktionen und API-Nutzung

## Tarifbegrenzungen

- **Standard**: 100 Anfragen pro Minute
- **Täglich**: 10.000 Anfragen pro Tag
- **Monatlich**: 300.000 Anfragen pro Monat

## Notizen

– Für diesen Endpunkt sind Administratorrechte erforderlich
- Paginierung: Verwendet Seitenparameter, keinen Offset
- Datumsbereich: Der Standardwert beträgt 7 Tage, wenn keine Daten angegeben sind
- Suche: Sucht in den Feldern „Beschreibung“ und „metadata.operation“.
- Verschachtelte Antwort: Die Antwort ist unter dem Datenobjekt verschachtelt
- Benutzerinformationen: Benutzerinformationen werden ausgefüllt, sofern verfügbar
- Protokolle werden aus Compliance-Zwecken aufbewahrt