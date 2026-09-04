---
id: create
title: "Crear Política SMLTP"
sidebar_label: "Crear Política SMLTP"
description: "Crear una nueva política de seguridad SMLTP"
openapi: "POST /smltp-policies/active"
---

# Crear política SMLTP

Cree una nueva política de seguridad SMLTP (Protocolo seguro de transferencia de lenguaje de modelo) para su cuenta.

## Endpoint

```
POST /smltp-policies
```

## Descripción

Cree una nueva política SMLTP personalizada. Solo se requiere acceso de administrador.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Cuerpo de solicitud

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `name` | cadena | Sí | Nombre de la política |
| `description` | cadena | Sí | Descripción de la política |
| `policy` | objeto | Sí | Objeto de configuración de política |
| `setAsActive` | booleano | No | Si se debe establecer esta política como activa inmediatamente (valor predeterminado: falso) |

## Solicitud de ejemplo

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## Respuesta exitosa

**Código de estado**: `201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `message` | cadena | Mensaje de éxito |
| `policy` | objeto | Objeto de política creado |
| `policy.id` | cadena | Identificador de política (generado a partir del nombre) |
| `policy.name` | cadena | Nombre de la política |
| `policy.description` | cadena | Descripción de la política |
| `policy.type` | cadena | Tipo de política ("personalizada") |
| `policy.isActive` | booleano | Si la política está actualmente activa |
| `policy.createdAt` | cadena | Marca de tiempo de creación |

## Ejemplo de uso

### JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

### Pitón

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## Respuestas de error

### 400 Solicitud incorrecta

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

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

### 403 Prohibido

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 Conflicto

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
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


## Casos de uso

- **Seguridad personalizada**: cree políticas adaptadas a sus necesidades
- **Cumplimiento**: implementar requisitos reglamentarios específicos
- **Gestión de riesgos**: definir medidas de seguridad para la mitigación de riesgos
- **Protección de Datos**: Establecer reglas de privacidad y manejo de datos
- **Gestión de políticas**: cree y administre políticas SMLTP personalizadas

## Límites de tarifas

- **Predeterminado**: 50 solicitudes por minuto
- **Diario**: 5000 solicitudes por día
- **Mensual**: 150.000 solicitudes por mes

## Notas

- Este endpoint requiere privilegios de administrador
- Campos obligatorios: nombre, descripción y política son obligatorios
- ID de política: generado a partir del nombre (minúsculas, guiones para espacios)
- Nombres únicos: los nombres de las políticas deben ser únicos
- Establecer activo: opcionalmente se puede configurar como activo inmediatamente
- Respuesta plana: la respuesta no está anidada en el objeto de datos