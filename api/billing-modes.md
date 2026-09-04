---
title: "Modos de Facturación y Claves API"
sidebar_label: "Modos de Facturación"
---

# Claves API del modo de facturación

SecureAI admite dos modos de facturación distintos para las claves API, lo que permite a los administradores controlar cómo se rastrea y factura el uso para diferentes integraciones de API.

## Descripción general

Las claves API se pueden configurar con uno de dos modos de facturación:

- **Finalizaciones de usuario**: se deduce del depósito de finalización de licencia del usuario.
- **Uso por modelo**: cargos a la tarjeta de crédito del usuario según el uso real del modelo.

## Modos de facturación

### Modo de finalización del usuario

**Modo predeterminado**: las claves API utilizan este modo de forma predeterminada.

#### Cómo funciona
- Deduce las finalizaciones de la cuota de licencia mensual del usuario.
- Utiliza los mismos límites de finalización que la interfaz web.
- No hay cargos adicionales más allá de la licencia existente del usuario
- Vuelve al uso por modelo si no hay cuota disponible y el usuario tiene habilitado el uso por modelo.

#### Casos de uso
- Aplicaciones internas en las que desea utilizar asignaciones de licencias existentes
- Entornos de desarrollo y pruebas.
- Aplicaciones en las que desea costos fijos y predecibles
- Cuando desee permanecer dentro de los límites de la licencia existente

#### Configuración
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### Uso por modo de modelo

**Modo avanzado**: requiere configuración explícita y permiso del usuario.

#### Cómo funciona
- Cargos basados en el uso real del token y los costos del modelo.
- Realiza un seguimiento de tokens de entrada, tokens de salida y tokens totales
- Calcula los costos en función de los precios específicos del modelo.
- Requiere que el usuario tenga habilitado el Uso por modelo en su cuenta
- Tiene límites de dólares mensuales configurables

#### Casos de uso
- Aplicaciones de gran volumen donde se necesita un seguimiento preciso de los costos
- Aplicaciones que utilizan modelos de mayor coste (GPT-5.x, Claude Opus/Sonnet, etc.)
- Cuando necesite análisis de uso detallados
- Aplicaciones donde quieres pagar solo por lo que usas

#### Configuración
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## Creación de clave API

### Creación de claves API con modos de facturación

Cree y configure claves API desde el panel de administración de SecureAI.

1. Vaya a `Admin -> API Keys`.
2. Cree o edite una clave API.
3. Establezca `billingMode` en `user-completions` o `usage-by-model`.
4. Configure límites, modelos permitidos, índices permitidos y políticas SMLTP permitidas.

### Validación del modo de facturación

El sistema valida los requisitos del modo de facturación:

- **Modo de uso por modelo**: requiere que el usuario tenga habilitado el uso por modelo.
- **Modo de finalización de usuario**: funciona con cualquier usuario, pero puede recurrir al uso por modelo si no hay cuota disponible.

## Seguimiento de uso

### Seguimiento de finalización del usuario

Para el modo Finalizaciones de usuario, el sistema realiza un seguimiento de:
- Recuentos de finalización diarios y mensuales.
- Estadísticas de uso específicas del modelo
- Consumo de cuotas y límites

### Uso por seguimiento de modelo

Para el modo Uso por modelo, el sistema rastrea:
- Tokens de entrada, tokens de salida y tokens totales
- Costos y puntos específicos del modelo.
- Gasto mensual en dólares
- Análisis de uso detallados

## Ejemplos de respuesta API

### Respuesta del modo de finalización del usuario

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### Uso por respuesta del modo modelo

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## Manejo de errores

### Uso por modelo no habilitado

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### Cuota excedida (finalizaciones del usuario)

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### Presupuesto excedido (uso por modelo)

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## Mejores prácticas

### Elegir el modo de facturación adecuado

1. **Usar Completaciones de usuario cuando:**
   - Quieres costos predecibles
   - Estás dentro de los límites de licencia existentes
   - Estás construyendo herramientas internas.
   - Quiere utilizar asignaciones de cuotas existentes

2. **Utilice el uso por modelo cuando:**
   - Necesita un seguimiento detallado de los costos
   - Utilizas modelos caros con frecuencia.
   - Quieres pagar sólo por el uso real
   - Necesita análisis de uso granular

### Recomendaciones de configuración

1. **Establezca límites apropiados:**
   - Límites diarios para el control de tarifas.
   - Límites mensuales para el control de costos.
   - Límites en dólares para el modo Uso por modelo

2. **Monitorear el uso:**
   - Realice un seguimiento del uso de la clave API con regularidad
   - Configurar alertas para acercarse a los límites
   - Revisar los patrones de uso mensualmente

3. **Consideraciones de seguridad:**
   - Utilice restricciones de IP para aplicaciones sensibles
   - Rote las claves API con regularidad
   - Supervisar patrones de uso inusuales

## Mecanismo de respaldo

### Finalizaciones del usuario para el uso por modelo de reserva

Cuando una clave de API de finalización de usuario agota la cuota, el sistema vuelve automáticamente al uso por modelo si:

1. **El usuario tiene habilitado el uso por modelo** en la configuración de su cuenta.
2. **El usuario tiene presupuesto disponible** en su asignación de Uso por modelo
3. **La clave API permite el respaldo** (comportamiento predeterminado)

#### Proceso alternativo

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### Lógica de validación

#### Uso por requisitos de modelo

El sistema valida lo siguiente antes de permitir la facturación de Uso por modelo:

1. **Configuración de cuenta de usuario**: el usuario debe tener habilitado "Uso por modelo"
2. **Presupuesto mensual**: el usuario debe tener presupuesto disponible en su asignación
3. **Configuración de clave API**: la clave API debe configurarse para uso por modelo o permitir respaldo
4. **Acceso al modelo**: El usuario debe tener acceso al modelo solicitado

#### Escenarios de facturación mixtos

Cuando se utilizan varias claves API con diferentes modos de facturación:

- **Claves de finalización del usuario** consumen de la cuota mensual del usuario
- **Uso por claves de modelo** consume de la asignación presupuestaria del usuario
- **Escenarios alternativos** priorizan primero las finalizaciones del usuario y luego el uso por modelo.
- **El agotamiento de la cuota** activa el respaldo automático si está disponible

## Migración entre modos

### De las terminaciones del usuario al uso por modelo

1. **Habilitar uso por modelo**: asegúrese de que el usuario tenga habilitado el uso por modelo en su cuenta.
2. **Actualizar clave API**: cambie el modo de facturación en la configuración de la clave API
3. **Establecer límites de presupuesto**: configure límites de dólares mensuales apropiados
4. **Supervisar el uso**: realice un seguimiento tanto del uso de finalización como del consumo del presupuesto.
5. **Probar respaldo**: verificar que el comportamiento de respaldo funcione correctamente

### Del uso por modelo a las terminaciones del usuario

1. **Verificar cuota**: asegúrese de que el usuario tenga suficiente cuota de finalización mensual
2. **Actualizar clave API**: cambie el modo de facturación en la configuración de la clave API
3. **Monitorear el uso**: realice un seguimiento del consumo completado en comparación con los límites mensuales
4. **Configurar reserva**: configure la reserva para Uso por modelo si se agota la cuota
5. **Límites de prueba**: Verifique que los límites de cuota se apliquen correctamente

### Mejores prácticas de migración

- **Migración gradual**: Pruebe primero con claves API de bajo volumen
- **Monitorear ambas métricas**: realice un seguimiento tanto del uso de finalización como del consumo de presupuesto
- **Establecer límites apropiados**: configure límites realistas para ambos modos
- **Cambios en los documentos**: realice un seguimiento de los cambios en el modo de facturación para fines de auditoría.
- **Comunicación con el usuario**: informar a los usuarios sobre los cambios en el modo de facturación y sus implicaciones.

## Monitoreo y análisis

### Análisis de uso

El sistema proporciona análisis detallados para ambos modos de facturación:

- **Finalizaciones de usuarios**: recuentos de finalización, uso de cuotas, distribución de modelos.
- **Uso por modelo**: recuentos de tokens, costos, análisis específicos del modelo

### Integración del panel de administración

El panel de administración proporciona:
- Monitoreo de uso en tiempo real
- Configuración del modo de facturación
- Análisis e informes de uso.
- Seguimiento de costos y alertas.

## Solución de problemas

### Problemas comunes

1. **El uso por modelo no funciona:**
   - Verificar que el usuario tenga habilitado el Uso por modelo
   - Verifique los límites mensuales en dólares
   - Garantizar el acceso adecuado al modelo.

2. **Problemas con la cuota de finalización de usuarios:**
   - Verifique el nivel de licencia del usuario
   - Verificar los límites de finalización mensuales
   - Considere habilitar el uso por modelo como alternativa

3. **Errores de autenticación de clave API:**
   - Verificar que la clave API esté activa
   - Verificar restricciones de IP
   - Garantizar los permisos adecuados

### Soporte

Para problemas con los modos de facturación:
1. Consulte el panel de administración para ver las estadísticas de uso.
2. Revisar la configuración de la clave API
3. Comuníquese con el administrador del sistema para cambios en el modo de facturación.
4. Supervise los registros para obtener información detallada sobre los errores.