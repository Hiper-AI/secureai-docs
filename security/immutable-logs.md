---
sidebar_position: 4
title: "Logs Inmutables (Auditoría Criptográfica)"
sidebar_label: "Logs Inmutables"
---


# Immutable Logs — Cadena criptográfica de auditoría

SecureAI registra **cada interacción con IA y cada acción administrativa** en una cadena inmutable de tres capas. Esta arquitectura garantiza que cualquier modificación, borrado o manipulación de los registros sea detectable — incluso si alguien tiene acceso directo a la base de datos.

## ¿Por qué importa?

Un log que solo existe en MongoDB no es verdaderamente inmutable: quien tenga acceso al servidor puede borrarlo sin dejar rastro. SecureAI resuelve esto anclando cada registro a **Sigstore Rekor**, un log de transparencia público operado por la Open Source Security Foundation (OpenSSF) — el mismo sistema que usa la industria del software para verificar la cadena de custodia de paquetes críticos.

> **Garantía técnica:** Una vez que un hash de bloque Merkle está en Rekor, nadie — incluyendo el operador de SecureAI — puede alterar retroactivamente ese registro. Cualquier auditor externo puede verificarlo de forma independiente con una sola llamada curl.

---

## Las tres capas de prueba

Cada bundle de interacción tiene tres niveles de evidencia criptográfica:

### Capa 1 — Registro MongoDB (L1)

El registro primario de la interacción se almacena en MongoDB con:

| Campo | Descripción |
|-------|-------------|
| `current_hash` | SHA-256 del payload de esta entrada + `prev_hash` anterior |
| `prev_hash` | Hash de la entrada inmediatamente anterior — forma la **cadena de hashes** |
| `bundle_id` | Identificador único del paquete de interacción |
| `receipt_signature` | Si el proveedor de IA devolvió un acuse firmado de las cabeceras de privacidad |

La cadena `prev_hash → current_hash → next_current_hash` hace que **borrar cualquier fila rompa la cadena** — la discrepancia es detectable al recorrer la secuencia.

### Capa 2 — Árbol Merkle (L2)

Cada 10 entradas de log se agrupan en un **bloque Merkle**:

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

El `merkle_root` es el hash raíz que representa las 10 entradas. Si cualquier entrada se altera, el `merkle_root` cambia — lo que invalida la prueba de inclusión.

| Campo L2 | Descripción |
|----------|-------------|
| `block_id` | ID del bloque Merkle |
| `merkle_root` | Hash raíz del árbol |
| `leaf_hash` | Hash de esta entrada específica dentro del árbol |
| `leaf_index` | Posición (0–9) dentro del bloque |
| `verified` | `true` si el `leaf_hash` está confirmado en el `merkle_root` |

### Capa 3 — Ancla Rekor (L3)

El `merkle_root` de cada bloque sellado se envía a **[Sigstore Rekor](https://rekor.sigstore.dev/)**, un log público append-only. Rekor devuelve:

| Campo L3 | Descripción |
|----------|-------------|
| `log_index` | Número de secuencia global en el log de Rekor — único y monótonamente creciente |
| `uuid` | Identificador del entry en Rekor |
| `integrated_time` | Timestamp en que Rekor firmó la prueba de inclusión |
| `rekor_url` | URL directa al entry raw JSON en Rekor |

Una vez que el `log_index` existe en Rekor, **nadie puede eliminarlo** — el log de Rekor es público, distribuido e inmutable por diseño.

---

## Portal de Transparencia (admin)

### Acceder

**Admin → AI Gateway → Transparency Portal**

### Verificar un bundle

1. Escribe o pega el `bundle_id` en el campo de búsqueda.
2. Haz clic en **"Verify Proof"**.
3. Verás las tres capas con badges de estado:
   - ✅ **Verde** = verificado correctamente
   - ⚠️ **Amarillo** = pendiente de sellado/ancla (normal para interacciones de hace menos de 2 minutos)
   - ❌ **Rojo** = fallo de verificación (señal de alerta)

### Copiar enlace público de verificación

Cuando el resultado está visible, aparece una barra con el botón **"Copy public verification URL"**. Ese enlace es público — puedes enviárselo a un auditor externo sin que necesite login.

---

## Página pública de verificación

Cualquier persona con un `bundle_id` puede verificar la prueba sin acceso a SecureAI:

```
https://tu-dominio.com/verify/<bundle_id>
```

La página muestra las tres capas, un botón para descargar el JSON de prueba, y comandos para verificar localmente.

**Esta página no expone:**
- El contenido del mensaje ni la respuesta de la IA
- Datos del usuario (nombre, email, IP)
- Cualquier información de identificación personal

Solo muestra hashes, timestamps, índices y estado de verificación.

---

## Verificación independiente con curl

Un auditor externo puede verificar cualquier bundle sin confiar en la interfaz web:

### Paso 1 — Obtener la prueba

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### Paso 2 — Confirmar el hash en la capa Merkle

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### Paso 3 — Confirmar el ancla en Rekor

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

Un campo `signedEntryTimestamp` no vacío confirma que Rekor ha aceptado y firmado la entrada. Ese timestamp no puede ser retroactivamente alterado.

---

## Export bundle firmado (auditores y usuarios)

Además del verificador público por `bundle_id`, SecureAI permite exportar evidencia criptográfica en un ZIP portable para auditorías offline.

### Qué incluye el ZIP

Cuando un administrador usa **Export signed bundle** en Logs o SMLTP, se descarga un archivo con:

- `data.csv`: datos exportados.
- `manifest.json`: metadatos criptográficos (`rowCount`, `merkleRootOfExport`, `signingKeyFingerprint`, timestamp, etc.).
- `manifest.sig`: firma Ed25519 de `manifest.json`.
- `verify.js`: verificador offline sin dependencias.
- `README.txt`: instrucciones rápidas.

### Cómo verificar (offline)

1. Descomprime el ZIP.
2. Abre una terminal en esa carpeta.
3. Ejecuta:

```bash
node verify.js
```

Salida esperada en un bundle intacto:

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### Qué detecta este verificador

- Edición de cualquier campo en `data.csv`.
- Borrado o agregado de filas en `data.csv`.
- Modificación de `manifest.json`.
- Uso de clave de firma incorrecta.

Si cualquier chequeo aparece como `FAIL`, ese export **no debe considerarse confiable**.

### Prueba rápida para auditoría

Para demostrar detección de manipulación:

1. Ejecuta `node verify.js` sobre el ZIP recién exportado (debe dar todo `PASS`).
2. Edita un carácter cualquiera en `data.csv` y guarda.
3. Ejecuta de nuevo `node verify.js`.
4. Debe fallar al menos `Merkle root of export`.

Esto confirma evidencia de integridad de extremo a extremo para el dataset exportado.

---

## Interpretación de los estados

| Estado L1 | Significado |
|-----------|-------------|
| ✅ Registro presente | La interacción está en MongoDB con hash chain válido |

| Estado L2 | Significado |
|-----------|-------------|
| ✅ Merkle verificado | El hash de esta entrada forma parte del árbol Merkle y la verificación es correcta |
| ⚠️ Bloque pendiente | Aún no hay 10 entradas para formar un bloque (normal en los primeros minutos) |
| ❌ Verificación fallida | El hash no coincide con el merkle_root — posible manipulación |

| Estado L3 | Significado |
|-----------|-------------|
| ✅ Anclado en Rekor | El merkle_root está en el log público de Rekor con timestamp firmado |
| ⏳ Ancla pendiente | El bloque se selló pero aún no se envió a Rekor (puede tomar hasta 30 segundos) |

---

## Flujo completo de un mensaje

```
Usuario envía mensaje
        ↓
  SMLTP Gateway (Rust)
  - Registra en MongoDB (SMLTPLog)
  - Computa current_hash = sha256(prev_hash + payload)
  - Escribe en smltp_events.jsonl
        ↓
  Sealer de Merkle (cada 60s)
  - Acumula 10 entradas
  - Calcula merkle_root
  - Crea MerkleBlock en MongoDB
        ↓
  Rekor Anchor Sidecar (cada ~30s)
  - Lee BLOCK_SEALED del log
  - Firma con clave Ed25519
  - Envía a rekor.sigstore.dev
  - Guarda rekor_uuid en MongoDB
        ↓
Prueba completa disponible en /verify/<bundle_id>
```

---

## Cumplimiento de proveedores

El badge **"Provider Compliance"** indica si el proveedor de IA (OpenAI, Anthropic, etc.) confirmó recibir las cabeceras de privacidad SMLTP:

| Badge | Significado |
|-------|-------------|
| ✅ VERIFIED / CERTIFIED | El proveedor confirmó recepción con un acuse firmado |
| 🛡️ GATEWAY PROTECTED | Las cabeceras de privacidad se enviaron pero el proveedor no confirmó explícitamente. Tu datos están protegidos por el gateway. |
| ⚠️ PROVIDER NOT VERIFIED | El proveedor no confirmó recepción. Los datos viajaron protegidos por SMLTP pero no hay garantía de que el proveedor respete las instrucciones de no-entrenamiento. |

---

## Preguntas frecuentes

**¿Puedo verificar un bundle sin internet?**
Sí, descarga el JSON de prueba desde el botón "Download JSON" mientras tienes conexión. El `merkle_root` y los hashes son verificables offline recomputando el árbol.

**¿Qué pasa si L3 está pendiente?**
Es normal para interacciones recientes (menos de 1 minuto). El sidecar de Rekor procesa bloques cada ~30 segundos. Si después de 5 minutos sigue pendiente, verifica que el sidecar `rekor-anchor` esté corriendo.

**¿Cuánto tiempo se guardan los registros?**
Por defecto, los registros se conservan según el `retentionPeriod` configurado. Los registros marcados como compliance (`phi`, `pii`, `security`, `authorization`) nunca se eliminan automáticamente.

**¿Puedo compartir el enlace de verificación con un cliente?**
Sí. La URL `/verify/<bundle_id>` no requiere login y no expone datos sensibles. Es segura para compartir con auditores, reguladores o clientes.
