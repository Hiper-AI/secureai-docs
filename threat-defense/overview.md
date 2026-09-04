---
sidebar_position: 1
title: "Defensa Contra Amenazas de IA"
sidebar_label: "Defensa Contra Amenazas"
---

# Defensa contra amenazas

Threat Defense proporciona protección en tiempo real contra ataques rápidos maliciosos, jailbreak, fugas de instrucciones y manipulación de resultados.

---

## Vectores de amenazas protegidos

| Amenaza | Descripción |
|---|---|
| **Inyección inmediata** | Intenta anular o eludir las instrucciones y restricciones del sistema. |
| **Fugas de cárcel** | Indicaciones adversas diseñadas para eludir las barreras de seguridad. |
| **Instrucción/fuga de aviso del sistema** | Ataques de extracción que intentan revelar instrucciones patentadas. |
| **Deriva de roles / Secuestro** | Manipular al asistente para que se desvíe de su ámbito comercial previsto. |
| **Ataques de extracción de datos** | Intentos automatizados de recopilar datos confidenciales de indexación o capacitación. |
| **Fugas de tokens canarios** | Detección de cadenas canarias ocultas que señalan la exposición de instrucciones. |

---

## Módulos clave

### 1. Motor de Prompt Shield
Evalúa cada mensaje entrante antes de que llegue al modelo de lenguaje:
- **Permitir**: la solicitud pasa todos los controles de seguridad.
- **Marca**: la solicitud está permitida, pero se registra como un evento de seguridad para revisión administrativa.
- **Bloquear**: la solicitud se bloquea inmediatamente con un evento de denegación firmado.

### 2. Barandillas de salida
Supervisa los resultados del modelo antes de la entrega al cliente para detectar:
- Aviso del sistema y fuga de contexto interno.
- Fuga de token canario.
- Desvío de roles no deseado o salidas peligrosas.

### 3. Fichas Canarias
Los tokens Canary son marcadores criptográficos ocultos únicos que se insertan en las instrucciones del chatbot:
- **Cómo funciona**: si un atacante logra extraer instrucciones, el marcador canario en la respuesta activa una alerta de seguridad inmediata de alta prioridad.
- **Configuración**: ¿Ir a **Administrador? ¿Defensa contra amenazas? Canary Tokens** para generar, rotar o monitorear tokens.

---

## Configuración de políticas y gestión de incidentes

1. **Configurar políticas**: Vaya a **¿Administrador? ¿Defensa contra amenazas? Políticas**. Seleccione entre **Estricto** (chatbots públicos), **Equilibrado** (uso empresarial estándar) o **Permisivo** (entornos de prueba).
2. **Revisar incidentes**: inspeccionar eventos marcados o bloqueados en **¿Administrador? ¿Defensa contra amenazas? Incidentes** para analizar las cargas útiles de los ataques y ajustar la sensibilidad.