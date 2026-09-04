---
title: "Referencia Rápida de Facturación"
sidebar_label: "Referencia de Facturación"
---

# Referencia rápida de modos de facturación

Una guía de comparación rápida para elegir entre los modos de facturación Finalizaciones de usuario y Uso por modelo.

## Comparación rápida

| Característica | Finalizaciones de usuario | Uso por modelo |
|---------|------------------|----------------|
| **Modo predeterminado** | ✅ Sí | ❌ No |
| **Estructura de costos** | Fijo (cuota de licencia) | Variable (por token) |
| **Permiso de usuario** | No requerido | Debe estar habilitado |
| **Seguimiento de costos** | La finalización cuenta | Recuento de tokens + costos |
| **Mejor para** | Costos predecibles | Uso de gran volumen |
| **Soporte alternativo** | ✅ Sí | ❌ No |

## Cuándo usar cada modo

### Modo de finalización del usuario

**Elige esto cuando:**
- ✅ Quiere costos fijos y predecibles
- ✅ Estás dentro de los límites de licencia existentes
- ✅ Estás construyendo herramientas internas
- ✅ Quiere utilizar las asignaciones de cuotas existentes
- ✅ Necesitas una gestión de costes sencilla

**Casos de uso de ejemplo:**
- Chatbots internos
- Desarrollo y pruebas
- Aplicaciones de bajo volumen
- Proyectos de presupuesto fijo

### Uso por modo de modelo

**Elige esto cuando:**
- ✅ Necesita un seguimiento detallado de los costos
- ✅ Utilizas modelos caros con frecuencia
- ✅ Quieres pagar solo por el uso real
- ✅ Necesita análisis de uso granular
- ✅ Tienes requerimientos de gran volumen

**Casos de uso de ejemplo:**
- Aplicaciones de producción
- Servicios de IA de alto volumen
- Proyectos sensibles a los costos
- Aplicaciones multimodelo

## Uso de API

Al utilizar la API externa con modos de facturación:

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## Límites de tarifas

### Límites de tasa predeterminados
- **Solicitudes por minuto**: 60 (configurable)
- **Solicitudes por hora**: 1.000 (configurable)
- **Límites diarios**: 100 solicitudes (configurables)
- **Límites mensuales**: 10.000 solicitudes (configurables)

### Límites específicos del modo de facturación
- **Finalizaciones de usuario**: según la cuota de licencia
- **Uso por modelo**: límites adicionales basados en dólares

## Integración de políticas SMLTP

Ambos modos de facturación admiten la aplicación de políticas SMLTP:

| Política | Descripción | Caso de uso |
|--------|-------------|----------|
| `public` | Para datos no confidenciales | Aplicaciones de cara al público |
| `internal` | Para datos de la empresa | Herramientas y procesos internos |
| `confidential` | Para información confidencial | Aplicaciones de acceso restringido |

### Ejemplo de configuración SMLTP

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## Ejemplos de configuración

### Configuración de finalización del usuario

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### Uso por configuración del modelo

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## Escenarios de error

### Errores de finalización del usuario

| Error | Causa | Solución |
|-------|-------|----------|
| `Completion limit exceeded` | Cuota mensual alcanzada | Habilitar uso por modelo o aumentar cuota |
| `Daily limit exceeded` | Límite diario alcanzado | Espere a que se restablezca o aumente el límite |
| `User not found` | ID de usuario no válido | Verificar que el usuario existe |

### Errores de uso por modelo

| Error | Causa | Solución |
|-------|-------|----------|
| `Usage by Model required` | El usuario no lo tiene habilitado | Habilitar uso por modelo para usuario |
| `Usage by Model budget exceeded` | Presupuesto mensual alcanzado | Aumentar límite de dólares |
| `Invalid billing mode` | Modo no válido especificado | Utilice `"usage-by-model"` o `"user-completions"` |

## Guía de migración

### De las terminaciones del usuario al uso por modelo

1. **Habilitar uso por modelo para el usuario**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **Actualizar configuración de clave API**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **Monitorear el uso y los costos**
   - Seguimiento del uso de tokens
   - Monitorear el gasto mensual
   - Ajustar los límites según sea necesario

### Del uso por modelo a las terminaciones del usuario

1. **Verificar que el usuario tenga cuota suficiente**
   - Verificar nivel de licencia
   - Verificar límites mensuales

2. **Actualizar configuración de clave API**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **Supervisar el uso de finalización**
   - Seguimiento del recuento de finalización
   - Garantizar que el comportamiento alternativo funcione

## Estimación de costos

### Costos de finalización del usuario

- **Costo fijo**: según el nivel de licencia
- **Sin cargos adicionales**: más allá de la licencia existente
- **Predecible**: Igual que el uso de la interfaz web

### Uso por costos modelo

- **Costo variable**: basado en el uso del token
- **Precios específicos del modelo**: diferentes tarifas por modelo
- **Costos de ejemplo**:
  - GPT-5.1: se aplican precios del proveedor
  - Claude Sonnet 4.6: se aplican precios del proveedor
  - GPT-5 Nano: se aplican precios del proveedor

## Consejos de seguimiento

### Monitoreo de finalización de usuarios

- El seguimiento de la finalización cuenta diariamente
- Monitorear el consumo de cuotas.
- Establecer alertas para acercarse a los límites
- Revisar los patrones de uso mensualmente

### Uso por modelo de seguimiento

- Seguimiento del uso y los costos del token
- Monitorear el gasto mensual
- Establecer alertas de límite de dólares
- Revisar el desglose de costos por modelo.

## Consideraciones de seguridad

### Ambos modos

- Utilice restricciones de IP para aplicaciones sensibles
- Rote las claves API con regularidad
- Monitorear actividad inusual
- Implementar un manejo adecuado de errores.

### Uso por modelo específico

- Establecer límites de dólares apropiados
- Monitorear los picos de costos
- Revisar los patrones de uso del modelo.
- Seguimiento del uso de modelos costosos

## Recursos de soporte

### Documentación
- [Descripción general de los modos de facturación] (../billing-modes.md)
- [Límites y cuotas](/api/limits-and-quotas) - Comprender los límites de la plataforma

### Panel de administración
- **Sección API**: crear y administrar claves API
- **Sección de Usuarios**: Habilitar uso por modelo

### Problemas comunes
1. **El uso por modelo no funciona**: verifique los permisos de usuario
2. **Cuota superada**: habilite el uso por modelo o aumente los límites
3. **Picos de costos**: revise el uso del modelo y establezca límites
4. **Errores de autenticación**: verifique la clave API y los permisos