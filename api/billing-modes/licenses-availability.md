---
id: licenses-availability
title: "Disponibilidad de Licencias"
sidebar_label: "Disponibilidad de Licencias"
description: "Recuperar los límites, el uso y el resto del grupo de licencias actuales (solo administrador)"
openapi: "GET /licenses/availability"
---

# Disponibilidad de licencias

Recupere los límites del grupo de licencias, el uso actual y las licencias restantes para cada nivel.

## Endpoint

```
GET /licenses/availability
```

## Descripción

Devuelve el estado del grupo de licencias para todos los niveles de licencia, incluidos los límites, el uso actual y la capacidad restante. Endpoint solo para administradores.

## Autenticación

**Requerido**: Clave API con privilegios de administrador

```
Authorization: Bearer sk-your-api-key-here
```

## Solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

### Respuesta exitosa (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `success` | booleano | Indica si la operación fue exitosa |
| `limits` | objeto | Límites configurados del grupo de licencias por nivel |
| `usage` | objeto | Licencias actualmente asignadas/usadas por nivel |
| `remaining` | objeto | Licencias restantes por nivel |

## Respuestas de error

### 401 No autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Prohibido

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## Notas

- Endpoint solo para administradores
- El resto se puede informar como `Infinity` cuando no se aplica ningún límite de grupo para ese nivel
- Los valores son agregados de toda la organización.