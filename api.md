---
sidebar_position: 5
title: "Referencia de la API Externa"
sidebar_label: "Referencia API"
---

# Referencia de API

La API externa SecureAI proporciona capacidades de finalización de chat de IA con recuperación de la base de conocimientos, políticas de seguridad y seguimiento integral del uso. Esta API está diseñada para integraciones y desarrolladores externos que utilizan autenticación de clave API.

## Características clave

- **RAG (Generación aumentada de recuperación)**: busca automáticamente bases de conocimiento para contexto relevante
- **Soporte multimodelo**: OpenAI, Anthropic, Google, Meta y otros modelos de IA
- **Redundancia de modelo y conmutación por error**: cadenas de conmutación por error definidas por el llamante (principal + alternativas) con tiempos de espera por intento
- **Endpoint compatible con OpenAI**: apunte cualquier SDK de OpenAI a `/api/external/v1`; sin cambios de código
- **Generación de imágenes**: genera y edita imágenes usando Google Gemini 2.5 Flash Image
- **Voz a voz (S2S)**: conversaciones de voz en tiempo real utilizando OpenAI Realtime API con WebRTC
- **Políticas de seguridad**: aplicación de políticas SMLTP, Prompt Shield por llamada y recibos de cumplimiento firmados
- **Webhooks**: entrega firmada y en tiempo real de eventos de plataforma y seguridad
- **Seguimiento de uso**: monitoreo de uso integral, cuota de autoservicio y limitación de velocidad
- **Integración de la base de conocimientos**: acceso a bases de conocimientos personales y compartidas
- **Administración de usuarios**: capacidades completas de administración de usuarios, grupos y roles
- **Registro de auditoría**: registros completos de auditoría de seguridad y actividad

## Autenticación

Todos los endpoints (excepto la verificación de estado) requieren autenticación de clave API mediante el token de portador:

```bash
Authorization: Bearer sk-your-api-key-here
```

## URL base

```
https://{customer.name}.hiperai.ai/api/external
```

Para la superficie compatible con OpenAI, apunte la URL base de su SDK a:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## Facturación y uso

De forma predeterminada, las solicitudes de API se facturan a la cuenta de usuario propietaria de la clave API. Puede especificar un usuario diferente para facturar incluyendo el parámetro `user_id` en su solicitud. Esto permite:

- Aplicaciones multiinquilino con facturación por usuario
- Gestión flexible del límite de finalización
- Configuración de "Uso por modelo" por usuario

## Límites de tarifas

- **Predeterminado**: 60 solicitudes por minuto, 1000 solicitudes por hora
- **Límites diarios**: 100 solicitudes (configurables)
- **Límites mensuales**: 10.000 solicitudes (configurables)

## Inicio rápido

### 1. Control de salud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. Obtenga modelos disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Obtenga bases de conocimientos disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Crear una finalización de chat

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## Endpoints API

### Sistema
- [Comprobación de estado](/api/system/health) - Verificar el estado de la API

### Descubrimiento
- [Obtener modelos disponibles](/api/discovery/models) - Listar los modelos de IA disponibles
- [Obtener bases de conocimientos disponibles](/api/discovery/indexes) - Listar bases de conocimientos accesibles
- [Obtener políticas de seguridad](/api/discovery/smltp-policies) - Listar las políticas SMLTP disponibles

### Charla
- [Finalización del chat](/api/chat/completions) - Endpoint principal del chat de IA con RAG
- [Endpoint compatible con OpenAI](/api/chat/openai-compatible) - Directo `/v1/chat/completions` para SDK de OpenAI
- [Redundancia y conmutación por error](/api/redundancy) - Modelo de cadenas de conmutación por error
- [Verificación de políticas](/api/policy-check) - Ejecute en seco el canal de seguridad sin llamar a un modelo
- [Uso](/api/usage) - Límites de cuota, presupuesto y tarifas de autoservicio
- [Recibos](/api/receipts) - Obtener recibos de cumplimiento SMLTP firmados

### Webhooks
- [Descripción general de webhooks](/api/webhooks/overview) - Entrega de eventos firmados en tiempo real
- [Eventos de Webhook](/api/webhooks/events) - Catálogo de eventos y cargas útiles

### Imágenes
- [Generar imágenes](/api/images/generaciones) - Generar imágenes a partir de texto o editar imágenes existentes
- [Editar imágenes](/api/images/edits) - Edición de imagen a imagen con instrucciones de texto

### Habla/S2S
- [Iniciar sesión S2S WebRTC](/api/speech/webrtc) - Establecer conversaciones de voz en tiempo real
- [Obtener estado de tiempo S2S](/api/speech/status) - Verificar la cuota de tiempo restante de S2S
- [Registrar duración de la sesión S2S](/api/speech/log-session) - Registrar la duración de la sesión y deducir el tiempo

### Gestión de usuarios
- [Obtener todos los usuarios](/api/users/list) - Recuperar usuarios con paginación
- [Crear usuario](/api/users/create) - Crear nueva cuenta de usuario
- [Actualizar usuario](/api/users/update) - Actualizar usuario existente
- [Obtener disponibilidad de licencia](/api/billing-modes/licenses-availability) - Recuperar límites y uso del grupo de licencias

### Gestión de índices
- [Obtener todos los índices](/api/indexes/list) - Recuperar todas las bases de conocimiento
- [Crear índice](/api/indexes/create) - Crear nueva base de conocimientos
- [Actualizar índice](/api/indexes/update) - Actualizar índice existente
- [Entrenar Índice con Documentos](/api/indexes/train) - Entrenar Índice cargando documentos
- [Índice de búsqueda de documentos](/api/indexes/search) - Buscar documentos mediante búsqueda semántica

### Gestión de grupos
- [Obtener todos los grupos](/api/groups/list) - Recuperar todos los grupos
- [Crear grupo](/api/groups/create) - Crear nuevo grupo
- [Actualizar grupo](/api/groups/update) - Actualizar grupo existente

### Seguridad SMLTP
- [Obtener todas las políticas SMLTP](/api/smltp/policies) - Listar todas las políticas de seguridad
- [Obtener política activa](/api/smltp/active) - Obtener política activa actual
- [Crear política personalizada](/api/smltp/create) - Crear política SMLTP personalizada
- [Registros de auditoría](/api/smltp/audit-logs) - Recuperar registros de auditoría SMLTP

### Gestión de roles
- [Obtener todos los roles](/api/roles/list) - Recuperar todos los roles
- [Crear rol](/api/roles/create) - Crear nuevo rol personalizado

## Manejo de errores

### Formato de respuesta de error

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Error de límite de velocidad

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Códigos de estado HTTP comunes

| Código | Descripción |
|------|-------------|
| `200` | Éxito |
| `201` | Creado con éxito |
| `400` | Solicitud incorrecta: parámetros no válidos |
| `401` | No autorizado: clave API no válida |
| `403` | Prohibido: permisos insuficientes |
| `404` | No encontrado |
| `409` | Conflicto: el recurso ya existe |
| `413` | Carga útil demasiado grande: se excedió el tamaño del archivo |
| `429` | Límite de tarifa excedido |
| `500` | Error interno del servidor |
| `503` | Servicio no disponible: servicio no configurado |

## Ejemplos de SDK

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Pitón

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. Obtenga modelos disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Obtenga bases de conocimientos disponibles

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Crear una finalización de chat

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## Endpoints API

### Sistema
- [Comprobación de estado](/api/system/health) - Verificar el estado de la API

### Descubrimiento
- [Obtener modelos disponibles](/api/discovery/models) - Listar los modelos de IA disponibles
- [Obtener bases de conocimientos disponibles](/api/discovery/indexes) - Listar bases de conocimientos accesibles
- [Obtener políticas de seguridad](/api/discovery/smltp-policies) - Listar las políticas SMLTP disponibles

### Charla
- [Finalización del chat](/api/chat/completions) - Endpoint principal del chat de IA con RAG
- [Endpoint compatible con OpenAI](/api/chat/openai-compatible) - Directo `/v1/chat/completions` para SDK de OpenAI
- [Redundancia y conmutación por error](/api/redundancy) - Modelo de cadenas de conmutación por error
- [Verificación de políticas](/api/policy-check) - Ejecute en seco el canal de seguridad sin llamar a un modelo
- [Uso](/api/usage) - Límites de cuota, presupuesto y tarifas de autoservicio
- [Recibos](/api/receipts) - Obtener recibos de cumplimiento SMLTP firmados

### Webhooks
- [Descripción general de webhooks](/api/webhooks/overview) - Entrega de eventos firmados en tiempo real
- [Eventos de Webhook](/api/webhooks/events) - Catálogo de eventos y cargas útiles

### Imágenes
- [Generar imágenes](/api/images/generaciones) - Generar imágenes a partir de texto o editar imágenes existentes
- [Editar imágenes](/api/images/edits) - Edición de imagen a imagen con instrucciones de texto

### Habla/S2S
- [Iniciar sesión S2S WebRTC](/api/speech/webrtc) - Establecer conversaciones de voz en tiempo real
- [Obtener estado de tiempo S2S](/api/speech/status) - Verificar la cuota de tiempo restante de S2S
- [Registrar duración de la sesión S2S](/api/speech/log-session) - Registrar la duración de la sesión y deducir el tiempo

### Gestión de usuarios
- [Obtener todos los usuarios](/api/users/list) - Recuperar usuarios con paginación
- [Crear usuario](/api/users/create) - Crear nueva cuenta de usuario
- [Actualizar usuario](/api/users/update) - Actualizar usuario existente
- [Obtener disponibilidad de licencia](/api/billing-modes/licenses-availability) - Recuperar límites y uso del grupo de licencias

### Gestión de índices
- [Obtener todos los índices](/api/indexes/list) - Recuperar todas las bases de conocimiento
- [Crear índice](/api/indexes/create) - Crear nueva base de conocimientos
- [Actualizar índice](/api/indexes/update) - Actualizar índice existente
- [Entrenar Índice con Documentos](/api/indexes/train) - Entrenar Índice cargando documentos
- [Índice de búsqueda de documentos](/api/indexes/search) - Buscar documentos mediante búsqueda semántica

### Gestión de grupos
- [Obtener todos los grupos](/api/groups/list) - Recuperar todos los grupos
- [Crear grupo](/api/groups/create) - Crear nuevo grupo
- [Actualizar grupo](/api/groups/update) - Actualizar grupo existente

### Seguridad SMLTP
- [Obtener todas las políticas SMLTP](/api/smltp/policies) - Listar todas las políticas de seguridad
- [Obtener política activa](/api/smltp/active) - Obtener política activa actual
- [Crear política personalizada](/api/smltp/create) - Crear política SMLTP personalizada
- [Registros de auditoría](/api/smltp/audit-logs) - Recuperar registros de auditoría SMLTP

### Gestión de roles
- [Obtener todos los roles](/api/roles/list) - Recuperar todos los roles
- [Crear rol](/api/roles/create) - Crear nuevo rol personalizado

## Manejo de errores

### Formato de respuesta de error

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Error de límite de velocidad

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Códigos de estado HTTP comunes

| Código | Descripción |
|------|-------------|
| `200` | Éxito |
| `201` | Creado con éxito |
| `400` | Solicitud incorrecta: parámetros no válidos |
| `401` | No autorizado: clave API no válida |
| `403` | Prohibido: permisos insuficientes |
| `404` | No encontrado |
| `409` | Conflicto: el recurso ya existe |
| `413` | Carga útil demasiado grande: se excedió el tamaño del archivo |
| `429` | Límite de tarifa excedido |
| `500` | Error interno del servidor |
| `503` | Servicio no disponible: servicio no configurado |

## Ejemplos de SDK

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Pitón

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### rizo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Próximos pasos

- [Base de conocimientos y RAG](/indexes/overview) - Obtenga más información sobre las bases de conocimientos y RAG
```