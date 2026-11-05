---
sidebar_position: 1
title: "Descripción General de Seguridad"
sidebar_label: "Visión General"
---

# Descripción general de seguridad

Conozca las características y la arquitectura de seguridad de SecureAI.

## Funciones de seguridad

SecureAI implementa medidas de seguridad de nivel empresarial para proteger sus datos y aplicaciones, con SMLTP (Protocolo de transferencia de lenguaje de modelo seguro) como piedra angular de nuestra arquitectura de seguridad.

### SMLTP (Protocolo de transferencia de lenguaje de modelo seguro)

**SMLTP** es un protocolo de seguridad con un borrador de especificación pública que facilita la comunicación con
Modelos de lenguajes grandes (LLM) gobernados, contenidos y demostrables. Proporciona:

- **Tokens de derechos firmados**: cada solicitud gobernada lleva un enlace de token firmado **Ed25519**
  identidad, modelo autorizado, hash de política y bytes de solicitud exactos (SHA-256)
- **Recibos de cumplimiento firmados**: cada interacción enrutada por la puerta de enlace produce un recibo que se puede
  verificado fuera de línea con la clave pública de la puerta de enlace
- **Cumplimiento de políticas**: listas permitidas de modelos, comprobaciones de residencia de datos y controles de salida (en monitor)
  o en modo forzado, con recibos de denegación firmados
- **Registro de auditoría a prueba de manipulaciones**: registros encadenados mediante hash y sellados con Merkle, opcionalmente anclados a un
  registro de transparencia externo (Sigstore Rekor)
- **Rotación de clave**: rotación de clave de firma Ed25519; los recibos emitidos bajo claves anteriores permanecen
  verificable
- **Bundle Encryption**: cifrado AES-256-GCM opcional de paquetes de solicitudes entre el cliente y
  puerta de enlace

### Protección de datos

- **Claves por organización**: SecureAI cifra las conversaciones y las credenciales de conectores guardadas a nivel de campo con AES-256-GCM, con claves propias de su organización protegidas por un servicio de gestión de claves en la nube.
- **Cifrado en reposo**: las bases de datos y los backups están en discos de Google Cloud, que Google cifra en reposo.
- **Cifrado en tránsito**: las conexiones usan TLS 1.2 o TLS 1.3 con suites de cifrado AEAD con secreto perfecto hacia adelante.
- **Su propia clave para la evidencia**: si activa la retención de evidencia (apagada por defecto), puede cifrarla con una clave de su propio servicio de gestión de claves en AWS, Azure o Google Cloud.

### Control de acceso

- **Control de acceso basado en roles (RBAC)**: permisos granulares para diferentes tipos de usuarios
- **Administración de claves API**: autenticación segura para todas las solicitudes de API
- **Limitación de tasa**: limitación de tasa inteligente para evitar abusos
- **Registros de auditoría**: seguimiento completo de la actividad para cumplimiento y seguridad

### Políticas de seguridad

SMLTP admite varias plantillas de políticas integradas:

- **Interno**: Política predeterminada para datos internos de la empresa
- **Estricto interno**: mayor seguridad para datos internos confidenciales
- **Público**: política menos restrictiva para datos públicos no confidenciales
- **HIPAA, GDPR y PCI-DSS**: nombres del catálogo que aplican los mismos controles que Estricto interno. Elegir uno no hace que su uso cumpla con esa regulación. Para aplicar reglas propias de una regulación, defina una política personalizada con el mismo nombre: reemplaza a la integrada en su organización.

### Soporte para cumplimiento

- **Mapeo a marcos**: SecureAI mapea sus verificaciones a controles de marcos como NIST AI RMF, ISO/IEC 42001 y la Ley de IA de la UE. El mapeo es parcial y sirve para reunir evidencia. No es una certificación.
- **Certificaciones**: Hiper AI no tiene hoy un informe SOC 2 ni un certificado ISO/IEC 27001.
- **Pista de auditoría**: registros encadenados por hash de las interacciones con IA y de las acciones administrativas, para sus revisiones de cumplimiento y seguridad.
- **Aplicación de políticas**: SecureAI aplica sus políticas de seguridad a cada solicitud que pasa por el gateway.
- **Monitoreo en tiempo real**: los eventos de seguridad aparecen en la consola a medida que ocurren.

## Cómo funciona SMLTP

1. **Derecho**: el plano de control emite un token firmado que autoriza a esta persona que llama, este modelo,
   Según esta política, para estos bytes de solicitud exactos.
2. **Verificación**: la puerta de enlace SMLTP verifica el token: firma, vencimiento, coincidencia de modelo, cuerpo.
   hash, repetición y revocación, antes de que la solicitud llegue a alguna parte
3. **Aplicación de políticas**: la lista de modelos permitidos, la residencia y las reglas de salida se evalúan en el
   puerta de entrada; en modo obligatorio, una llamada no conforme se bloquea con un recibo de denegación firmado
4. **Inspección y atestación**: la inspección DLP/PII se ejecuta en la ruta gobernada (mejor esfuerzo,
   probabilístico), y su veredicto se registra en el recibo firmado
5. **Registro de auditoría**: cada interacción llega a un registro de auditoría encadenado mediante hash y sellado por Merkle.

## Beneficios

- **Demostrable, no sólo registrado**: los recibos firmados permiten a los auditores verificar las interacciones de forma independiente
- **Evidencia para auditorías**: los recibos firmados y el mapeo a marcos les dan a sus auditores material que pueden verificar por su cuenta.
- **Contención**: un agente que pasa por el gateway no puede exceder los permisos de su token firmado, aunque esté comprometido.
- **Revocación determinista**: el corte de un usuario, clave o agente tiene efecto en la puerta de enlace en
  segundos, sin esperar a ningún proveedor de IA
- **Policy Driven**: aplicación automatizada de sus políticas de seguridad

## Próximos pasos

- [Análisis profundo de SMLTP](/security/smltp) - Obtenga más información sobre SMLTP
- [Autenticación](/iam/overview) - Comprender los métodos de autenticación
- [Seguridad API](/api) - Pautas de uso seguro de API