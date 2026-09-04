---
sidebar_position: 2
title: "Seguridad y Protocolo SMLTP"
sidebar_label: "Seguridad SMLTP"
---

# Protocolo de seguridad SMLTP

SecureAI utiliza el **Protocolo de transferencia de lenguaje de modelo seguro (SMLTP)** para gobernar, contener y probar
comunicación con modelos de lenguaje grande (LLM).

## ¿Qué es SMLTP?

SMLTP es un protocolo de seguridad con un **borrador de especificación pública** (v0.2). Define un
**plano de control determinista** para el tráfico de IA: en lugar de depender únicamente de la inspección probabilística
de indicaciones, SMLTP hace que cinco propiedades de cada llamada de IA gobernada sean deterministas y criptográficamente
verificable.

| Capa | Mecanismo determinista |
|---|---|
| **Identidad** | Ed25519 Token de derecho firmado (SET) acuñado por solicitud |
| **Autorización** | Reclamaciones `model` y `policy_hash`: la llamada se ejecuta según una política determinada o no se ejecuta en absoluto |
| **Integridad del transporte** | `body_sha256` vincula el token a los bytes de solicitud exactos |
| **Contención** | Monitorear/hacer cumplir modos, reproducir caché, revocación de sujeto, valores predeterminados de cierre fallido |
| **Auditoría** | Registro encadenado mediante hash y sellado con Merkle con recibos de cumplimiento firmados |

## El modelo de dos planos

SMLTP separa deliberadamente dos tipos de controles:

- **Plano determinista (criptografía):** quién llama, a qué está autorizado a llamar, que
  la solicitud no fue alterada, que un tema revocado se corta y que el registro no puede ser silenciosamente
  reescrito. Estas son garantías, reforzadas mediante firmas y hashes.
- **Plano probabilístico (inspección):** DLP, redacción de PII y Prompt Shield se ejecutan *detrás* del
  controles deterministas y son explícitamente **mejor esfuerzo**. SMLTP nunca afirma que la criptografía
  detecta una inyección rápida o que la inspección detecta cada cadena sensible: afirma que el
  El veredicto de inspección que *fue* producido se registra en un recibo firmado y verificable.

## Características clave

### Tokens de derechos firmados
- Cada solicitud gobernada lleva un token vinculante firmado por Ed25519, modelo, política y bytes de solicitud.
- Protección de reproducción mediante ID de token de un solo uso
- La revocación de un asunto tiene efecto en la puerta de enlace en cuestión de segundos; no se necesita cooperación del proveedor

### Recibos de cumplimiento firmados
- Cada interacción enrutada por la puerta de enlace produce un recibo firmado por la puerta de enlace.
- Los recibos registran la política vigente, el hash de solicitud y la evidencia de inspección que se produjo.
- Los recibos se pueden verificar fuera de línea con la clave pública de la puerta de enlace; consulte
  [API de recibos](../api/receipts.md)

### Auditoría a prueba de manipulaciones
- Los eventos de auditoría están encadenados mediante hash (`prev_hash` → `current_hash`) y sellados en bloques Merkle
- Las raíces de Merkle se pueden anclar a un registro de transparencia externo (Sigstore Rekor), por lo que el registro
  la integridad no depende de confiar en el operador de SecureAI; consulte
  [Registros inmutables](./immutable-logs.md)

### Aplicación de políticas
- Modelo de listas permitidas, verificaciones de residencia de datos (geocerca) y controles de salida evaluados en la puerta de enlace
- **Modo monitor** observa y da fe; **modo de aplicación** bloquea llamadas no conformes con un signo firmado
  recibo de denegación

### Gestión de claves
- Ed25519 claves de firma con soporte de rotación; Los recibos emitidos bajo claves anteriores siguen siendo verificables.

## Alcance y honestidad

- **Alcance de la implementación:** Las recepciones y la aplicación de SMLTP se aplican a **implementaciones enrutadas por puerta de enlace**.
  Las implementaciones que llaman directamente a los proveedores aún obtienen DLP/PII de la plataforma y registros de auditoría, pero no
  recibos firmados por la puerta de enlace (la [API de recibos](../api/receipts.md) documenta este comportamiento).
- **Alcance del cifrado:** el cifrado de transporte es TLS; Los paquetes de solicitudes entre el cliente y la puerta de enlace pueden
  además estar cifrado (AES-256-GCM). SMLTP actualmente no proporciona cifrado de extremo a extremo
  a través del proveedor de IA y no reclama secreto previo.
- **Alcance de la inspección:** La detección de DLP/PII es probabilística y de mejor esfuerzo. Lo que garantiza SMLTP es
  que el veredicto esté *certificado*: el recibo prueba lo que se verificó y cuál fue el resultado.

## Beneficios de seguridad

- **Provabilidad**: los recibos firmados convierten "tenemos registros" en "cualquiera puede verificar lo que sucedió"
- **Contención**: incluso un agente comprometido o que se porta mal no puede exceder sus derechos firmados
- **Revocación determinista**: bloquear un usuario, clave o agente corta el tráfico en la puerta de enlace en segundos
- **Auditabilidad**: un rastro a prueba de manipulaciones que los auditores externos pueden verificar de forma independiente