---
title: "Recibos Criptográficos SMLTP"
sidebar_label: "Recibos SMLTP"
description: "Obtenga el recibo de cumplimiento SMLTP firmado para completarlo"
openapi: "GET /receipts/{bundleId}"
---

# Recibos de cumplimiento

Cuando una finalización se enruta a través de la **puerta de enlace SMLTP**, SecureAI produce un **recibo** de cumplimiento firmado: prueba criptográfica de la política que regía la llamada. Este endpoint recupera ese recibo por su identificación de paquete.

Los recibos existen solo para implementaciones enrutadas por puerta de enlace. En implementaciones de proveedor directo no hay una puerta de enlace para firmar recibos y este endpoint devuelve `404`.

## Endpoint

```
GET /receipts/:bundleId
```

## De dónde viene la identificación del paquete

Las respuestas de finalización exponen la identificación del paquete cada vez que se crea un derecho SMLTP para la llamada:

- Endpoint clásico: `metadata.smltp.bundle_id` (y un `metadata.smltp.receipt_url` ya preparado).
- Endpoint compatible con OpenAI: `secureai.smltp_bundle_id`.

La identificación del paquete (una identificación de derecho como `jti-…`) se devuelve incluso en implementaciones nativas/de proveedor directo. Sin embargo, el **recibo firmado** en esa identificación solo existe cuando el tráfico se enruta a través de la puerta de enlace SMLTP; en implementaciones directas, este endpoint devuelve `404` (ver más abajo).

## Autenticación

```bash
Authorization: Bearer sk-your-api-key-here
```

## Ejemplo de solicitud

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Respuesta

### 200 bien

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

El objeto `receipt` es la carga útil firmada emitida por la puerta de enlace. Consulte [Seguridad SMLTP](/security/smltp) para saber cómo encajan los recibos en el modelo de transparencia y auditoría.

### 404 no encontrado

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 Solicitud incorrecta

Se devuelve cuando falta la identificación del paquete o tiene más de 128 caracteres.

## Notas

- Los recibos se guardan en el almacén en memoria de la puerta de enlace por un tiempo limitado. Para obtener pruebas a largo plazo, confíe en el **registro de auditoría encadenado mediante hash**, el registro autorizado e inmutable. Consulte [Registros inmutables](/security/immutable-logs).
- No todas las rutas de implementación pasan por la puerta de enlace; Trate un `404` como "sin recibo de puerta de enlace para esta llamada", no como un error en su integración.

## Relacionado

- [Seguridad SMLTP](/seguridad/smltp)
- [Registros inmutables](/security/immutable-logs)
- [Finalización del chat](/api/chat/completions)