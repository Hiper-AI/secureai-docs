---
id: audit-logs
title: "Journaux d'audit"
sidebar_label: "Journaux d'audit"
description: "Récupérer les journaux d'audit SMLTP"
openapi: "GET /audit-logs"
---
# Journaux d'audit

Récupérez les journaux d’audit SMLTP (Secure Model Language Transfer Protocol) pour la surveillance de la sécurité et la conformité.

## Point de terminaison

```
GET /audit-logs
```

## Description

Ce point de terminaison renvoie les journaux d'audit SMLTP qui suivent les événements de sécurité, les violations de stratégie et les activités de conformité. Ceci est utile pour la surveillance de la sécurité, l’audit de conformité et l’enquête sur les incidents de sécurité.

## Authentification

**Obligatoire** : clé API avec privilèges d'administrateur

```
Authorization: Bearer sk-your-api-key-here
```

## Paramètres de requête

| Paramètre | Tapez | Obligatoire | Descriptif |
|---------------|------|--------------|-------------|
| `page` | entier | Non | 1 | Numéro de page pour la pagination (par défaut : 1) |
| `limit` | entier | Non | 50 | Nombre de journaux par page (par défaut : 50) |
| `startDate` | chaîne | Non | - | Date de début du filtrage (format ISO 8601) |
| `endDate` | chaîne | Non | - | Date de fin du filtrage (format ISO 8601) |
| `type` | chaîne | Non | - | Filtrer par type de journal |
| `severity` | chaîne | Non | - | Filtrer par niveau de gravité |
| `userId` | chaîne | Non | - | Filtrer par ID utilisateur |
| `search` | chaîne | Non | - | Terme de recherche pour la description ou les métadonnées |

## Exemple de demande

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## Réponse réussie

**Code d'état** : `200 OK`

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

### Champs de réponse

| Champ | Tapez | Descriptif |
|-------|------|-------------|
| `success` | booléen | Indique si l'opération a réussi |
| `data` | objet | Objet de données de réponse |
| `data.logs` | tableau | Tableau d'objets du journal d'audit |
| `data.logs[].id` | chaîne | Identifiant unique du journal d'audit |
| `data.logs[].timestamp` | chaîne | Horodatage du journal (ISO 8601) |
| `data.logs[].type` | chaîne | Type d'événement d'audit |
| `data.logs[].severity` | chaîne | Niveau de gravité |
| `data.logs[].description` | chaîne | Description de l'événement |
| `data.logs[].user` | objet | Informations utilisateur (si disponibles) |
| `data.logs[].user.id` | chaîne | Identifiant utilisateur |
| `data.logs[].user.name` | chaîne | Nom d'utilisateur |
| `data.logs[].user.email` | chaîne | E-mail de l'utilisateur |
| `data.logs[].metadata` | objet | Métadonnées supplémentaires |
| `data.logs[].complianceCategory` | chaîne | Catégorie de conformité |
| `data.logs[].outcome` | chaîne | Résultat de l'événement |
| `data.pagination` | objet | Informations sur la pagination |
| `data.pagination.page` | entier | Numéro de page actuel |
| `data.pagination.limit` | entier | Articles par page |
| `data.pagination.total` | entier | Nombre total de journaux |
| `data.pagination.pages` | entier | Nombre total de pages |
| `data.dateRange` | objet | Informations sur la plage de dates |

## Exemple d'utilisation

###JavaScript

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

###Python

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

### boucle

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Réponses d'erreur

### 401 Non autorisé

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 403 Interdit

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 429 Trop de demandes

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


## Exemples de filtrage

### Plage de dates

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### Filtrage des événements

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### Filtrage des utilisateurs

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## Cas d'utilisation

- ** Surveillance de la sécurité ** : surveillez les événements de sécurité et les violations des politiques.
- **Audit de conformité** : suivez les activités de conformité et les violations
- **Enquête sur les incidents** : enquêter sur les incidents et les violations de sécurité
- **Analyse des politiques** : analyser l'efficacité et l'application des politiques
- **Activité utilisateur** : suivez les actions des utilisateurs et l'utilisation de l'API

## Limites de taux

- **Par défaut** : 100 requêtes par minute
- **Quotidien** : 10 000 requêtes par jour
- **Mensuel** : 300 000 demandes par mois

## Remarques

- Ce point de terminaison nécessite des privilèges d'administrateur
- Pagination : utilise le paramètre de page, pas le décalage
- Plage de dates : par défaut, elle dure 7 jours si aucune date n'est fournie.
- Recherche : Recherches dans les champs de description et de métadonnées.opération
- Réponse imbriquée : la réponse est imbriquée sous l'objet de données
- Informations utilisateur : les informations utilisateur sont renseignées lorsqu'elles sont disponibles
- Les journaux sont conservés à des fins de conformité