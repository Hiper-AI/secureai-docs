---
id: policies
title: "Políticas SMLTP"
sidebar_label: "Políticas SMLTP"
description: "Recuperar todas las políticas de seguridad SMLTP"
openapi: "GET /smltp-policies/all"
---

# Políticas SMLTP

Recupere todas las políticas de seguridad SMLTP (Protocolo seguro de transferencia de lenguaje de modelo) disponibles.

## Endpoint

```
GET /smltp-policies/all
```

## Descripción

Recupere todas las políticas SMLTP disponibles, incluidas las políticas integradas y personalizadas. **Solo se requiere acceso de administrador.**

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Parámetros de consulta

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
❌ No se admiten parámetros de consulta: la API real no acepta ningún parámetro de consulta.

## Solicitud de ejemplo

```bash
GET /smltp-policies/all
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `data` | objeto | Objeto de datos de respuesta |
| `data.builtInPolicies` | matriz | Matriz de objetos de política integrados |
| `data.customPolicies` | matriz | Matriz de objetos de política personalizados |
| `data.activePolicyTemplate` | cadena | ID de plantilla de política actualmente activa |
| `data.summary` | objeto | Estadísticas resumidas |
| `data.summary.totalPolicies` | entero | Número total de pólizas |
| `data.summary.builtInCount` | entero | Número de políticas integradas |
| `data.summary.customCount` | entero | Número de pólizas personalizadas |

## Ejemplo de uso

### JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

### Pitón

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 Demasiadas solicitudes

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

## Campos de objeto de política

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | cadena | Identificador de política |
| `name` | cadena | Nombre de la política |
| `type` | cadena | Tipo de política ("integrada" o "personalizada") |
| `description` | cadena | Descripción de la política |
| `isActive` | booleano | Si esta política está actualmente activa |
| `createdAt` | cadena | Marca de tiempo de creación (solo políticas personalizadas) |

## Casos de uso

- **Descubrimiento de políticas**: busque políticas de seguridad disponibles
- **Planificación de cumplimiento**: comprender los requisitos de las políticas
- **Configuración de seguridad**: seleccione las políticas adecuadas
- **Gestión de políticas activas**: compruebe qué política está actualmente activa
- **Integración**: Aplicar políticas para finalizar el chat

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Este endpoint requiere privilegios de administrador
- Sin parámetros: no se admiten parámetros de consulta
- Políticas integradas: devuelve políticas del sistema predefinidas
- Políticas personalizadas: devuelve políticas personalizadas si existen.
- Política activa: muestra qué plantilla de política está actualmente activa
- Respuesta plana: la respuesta está anidada bajo el objeto de datos.