---
id: active
title: "Políticas SMLTP Activas"
sidebar_label: "Políticas Activas"
description: "Recuperar políticas SMLTP actualmente activas"
openapi: "GET /smltp-policies/active"
---

# Políticas SMLTP activas

Recupere las políticas SMLTP (Protocolo seguro de transferencia de lenguaje de modelo) actualmente activas para su cuenta.

## Endpoint

```
GET /smltp-policies/active
```

## Descripción

Recupere la configuración de la política SMLTP actualmente activa. **Solo se requiere acceso de administrador.**

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Solicitud de ejemplo

```bash
GET /smltp-policies/active
```

## Respuesta exitosa

**Código de estado**: `200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `data` | objeto | Objeto de datos de respuesta |
| `data.template` | cadena | ID de plantilla de política actualmente activa |
| `data.policy` | objeto | Objeto de configuración de política actual |
| `data.lastUpdated` | cadena | Marca de tiempo de la última actualización |

## Ejemplo de uso

### JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

### Pitón

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
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


## Casos de uso

- **Revisión de políticas**: compruebe qué plantilla de política está activa actualmente
- **Verificación de configuración**: revisar la configuración de política actual
- **Gestión de plantillas**: comprenda qué plantilla de política se está utilizando
- **Solución de problemas**: comprender la configuración de políticas actual
- **Preparación de auditoría**: revisar la política activa para auditorías de cumplimiento

## Límites de tarifas

- **Predeterminado**: 100 solicitudes por minuto
- **Diario**: 10.000 solicitudes por día
- **Mensual**: 300.000 solicitudes por mes

## Notas

- Este endpoint requiere privilegios de administrador
- Política única: devuelve la plantilla y la configuración de la política actualmente activa.
- Sin matrices: no devuelve una matriz de políticas, solo la activa
- ID de plantilla: muestra qué plantilla de política está activa actualmente
- Configuración de política: devuelve el objeto de configuración de política real
- Respuesta anidada: la respuesta está anidada en el objeto de datos.