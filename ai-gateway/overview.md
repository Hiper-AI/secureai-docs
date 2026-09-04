---
sidebar_position: 1
title: "AI Gateway — Plano de Control Centralizado"
sidebar_label: "AI Gateway"
---

# AI Gateway

**AI Gateway** es el plano de control centralizado para gobernar, proteger, enrutar e inspeccionar todo el tráfico del modelo de IA en toda la organización.

---

## Capacidades principales

### 1. Políticas de seguridad
Defina reglas de cumplimiento para toda la organización:
- **Listas de modelos permitidos**: restringe con qué modelos y proveedores pueden interactuar los empleados y las aplicaciones.
- **Geofencing de residencia de datos**: asegúrese de que las indicaciones y respuestas permanezcan dentro de las jurisdicciones designadas.
- **Modos de cumplimiento**: se ejecuta en **Modo de supervisión** (registrar y dar fe sin bloquear) o en **Modo de cumplimiento** (cerrado contra fallas, bloqueando el tráfico no conforme con recibos criptográficos).

### 2. Panel de control y observabilidad
Supervise las métricas en tiempo real en toda su empresa:
- **Total de interacciones seguras** y paquetes SMLTP activos.
- **Tasas de redacción y bloqueo**: realice un seguimiento de los datos confidenciales interceptados por los motores DLP/PII.
- **Estado del protocolo**: verifica el estado de la puerta de enlace en vivo y el estado de rotación de claves.

### 3. Gestión de claves criptográficas
Administre claves de firma Ed25519 y claves de cifrado AES-256:
- **Rotación sin tiempo de inactividad**: rote las claves de firma periódicamente mientras conserva la verificación fuera de línea para los recibos firmados con claves anteriores.
- **Configuración**: ¿Ir a **Administrador? ¿Puerta de entrada de IA? Llaves**.

### 4. Portal de Transparencia y Auditoría
Validar la integridad de la interacción mediante pruebas criptográficas:
- Busque cualquier interacción por undle_id para inspeccionar su cadena hash L1, su árbol Merkle L2 y su ancla de transparencia Sigstore Rekor L3.
- Genere enlaces de verificación pública compartibles para auditores de cumplimiento externos.

### 5. Gestión de extensiones
Administre y aplique políticas de seguridad en toda la flota de extensiones de navegador SecureAI para evitar el uso de IA en la sombra en los navegadores de los clientes.