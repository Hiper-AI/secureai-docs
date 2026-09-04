---
sidebar_position: 1
title: "Protección de Datos (DLP y PII)"
sidebar_label: "Protección de Datos (DLP)"
---

# Protección de datos

La protección de datos evita la filtración accidental o maliciosa de información comercial confidencial e información de identificación personal (PII) durante las interacciones con IA.

---

## Capacidades de protección principales

### 1. Gestión DLP (Prevención de pérdida de datos empresariales)
Protege los activos comerciales propietarios en mensajes, archivos cargados y respuestas modelo:
- **Claves y credenciales de API**: evita que se filtren claves de AWS, tokens de OpenAI, contraseñas y certificados privados.
- **Código fuente y arquitectura**: detecta repositorios internos y fragmentos de código.
- **Contratos y Finanzas**: Identifica borradores de acuerdos confidenciales y datos financieros.

### 2. Redacción de PII (Privacidad y cumplimiento)
Detecta y enmascara automáticamente identificadores personales para cumplir con los estándares GDPR, HIPAA y CCPA:
- **Identificadores**: Nombres, direcciones de correo electrónico, números de teléfono, DNI (NS, DNI, Números de Pasaporte), tarjetas de crédito.
- **Modos de redacción**:
  - **Máscara**: ofusca cadenas confidenciales (por ejemplo, usuario@*****.com, ****-****-****-1234).
  - **Eliminar**: Elimina el texto confidencial por completo.
  - **Tokenize/Hash**: Reemplaza datos confidenciales con seudónimos deterministas para procesamiento interno.

### 3. Verificador semántico
Ayuda en las investigaciones legales y de seguridad al determinar si su inquilino de SecureAI generó un fragmento de texto sospechoso:
- **Niveles de confianza**: *Verificado*, *Coincidencia probable*, *Ambiguo*, *Sin coincidencia*.
- **Uso**: ¿Ir a **Administrador? ¿Protección de datos? Semantic Verifier** y pegue el fragmento de texto para analizar la probabilidad de origen.

---

## Configuración y configuración

1. **Configuración global**: Vaya a **¿Administrador? Protección de datos** para permitir el escaneo en tiempo real de entradas, salidas y archivos adjuntos.
2. **Plantillas y reglas personalizadas**: cargue plantillas iniciales regionales/industriales o agregue patrones de expresiones regulares personalizados.
3. **Modo de simulación**: pruebe las políticas con conjuntos de datos de muestra antes de aplicarlas en producción.
4. **Monitoreo de incidentes**: revise las métricas de redacción y bloqueo en los registros de incidentes de Protección de datos.