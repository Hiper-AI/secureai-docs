---
sidebar_position: 3
title: "Políticas de Seguridad Descubiertas"
openapi: "GET /smltp-policies"
sidebar_label: "Políticas de Seguridad"
---

# Obtener políticas de seguridad

Recupere las políticas de seguridad SMLTP (Protocolo seguro de transferencia de lenguaje de modelo) disponibles.

## Endpoint

```
GET /smltp-policies
```

## Descripción

Recupere las políticas de seguridad SMLTP (Protocolo seguro de transferencia de lenguaje de modelo) disponibles. Estas políticas determinan cómo se procesan y protegen sus datos.

## Autenticación

Requerido: Clave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `success` | booleano | Siempre es cierto para solicitudes exitosas | `true` |
| `policies` | matriz | Lista de políticas de seguridad disponibles | Ver ejemplo |
| `restrictions` | objeto | Restricciones de acceso a políticas | Ver ejemplo |

### Objeto de política

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | cadena | Identificador de política único | `"internal"` |
| `name` | cadena | Nombre para mostrar de la política | `"Internal"` |
| `description` | cadena | Descripción de la política | `"For internal company data"` |

### Objeto de restricciones

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `allowed_policies` | matriz | Matriz de ID de políticas permitidas | `["public", "internal", "confidential"]` |

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## Ejemplo de uso

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

### Pitón

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### rizo

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Tipos de póliza

### Público
- **Caso de uso**: datos públicos y no confidenciales
- **Nivel de seguridad**: Bajo
- **Procesamiento de datos**: Procesamiento estándar con seguridad básica

### Interno
- **Caso de uso**: datos internos de la empresa
- **Nivel de seguridad**: Medio
- **Procesamiento de datos**: seguridad mejorada con salvaguardias adicionales

### Confidencial
- **Caso de uso**: datos comerciales confidenciales
- **Nivel de seguridad**: Alto
- **Procesamiento de datos**: Máxima seguridad con un manejo estricto de los datos

## Notas

- Elija la política adecuada según la sensibilidad de sus datos
- Las políticas afectan cómo se procesan y protegen sus datos
- Utilice el ID de política en las solicitudes de finalización del chat.
- Algunas políticas pueden estar restringidas según su tipo de cuenta