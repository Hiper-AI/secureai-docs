---
title: "Página pública de transparencia"
sidebarTitle: "Transparencia pública"
description: "Publique los anclajes en Rekor y las claves de su registro de auditoría para que un tercero los verifique sin cuenta"
---

La página pública de transparencia deja que cualquier persona, sin cuenta en SecureAI, revise el registro de auditoría
de la IA de su organización: qué bloques se anclaron en Sigstore Rekor, con qué claves y cuándo pasó la última prueba
por toda la cadena. Con eso un auditor, un cliente o un regulador comprueba que el anclaje es continuo y verifica
cualquier ancla por su cuenta.

La página viene **apagada**. Mientras esté apagada, la dirección responde 404 y muestra solo que su organización no
publicó la página.

{/* TODO: captura de /transparency con el resumen, la tabla de anclajes y los comandos (en inglés, recuadros rojos). */}

## Qué publica

| Sección | Contenido |
|---|---|
| **Resumen** | Cantidad de bloques sellados, cantidad de bloques anclados en Rekor, hora del último anclaje y hora del último latido que recorrió toda la cadena |
| **Anclajes en Rekor** | Por cada bloque anclado: id del bloque, valor anclado (la raíz Merkle u otro valor, con su tipo), índice en Rekor, uuid de la entrada, hora de integración y enlace a la entrada en Rekor. Del más nuevo al más viejo, 25 por página |
| **Claves** | El SHA-256 de cada clave que firma las entradas en Rekor, con su estado, y enlaces a las claves de firma publicadas y al manifiesto de claves del gateway |
| **Cómo verificarlo vos** | Comandos de Bash para verificar el ancla elegida en la tabla |

## Qué nunca publica

- Lo que se le preguntó a la IA ni lo que respondió.
- Las entradas del registro de auditoría ni los recibos.
- Usuarios, correos, direcciones IP o cualquier dato que identifique a una persona.

La página sí deja ver el volumen y el ritmo de la actividad auditada: cuántos bloques se sellan y cada cuánto. Por eso
la decisión de publicarla es suya.

## Cómo prenderla

1. Entre a **Gateway de IA → Estado**.
2. En **Página pública de transparencia**, prenda **Publicar el resumen del registro**. Necesita permiso de edición en
   Gateway de IA.
3. Abra **Ver lo que se publica** para revisar la página en `https://<su-dominio>/transparency`.

El cambio queda registrado como un cambio de política, con quién lo hizo. Para dejar de publicar, apague el mismo
interruptor: la página vuelve a responder 404.

Con la página apagada, los usuarios con acceso a Gateway de IA ven la misma lista de anclajes en la API autenticada
`GET /api/smltp/anchors`, con los mismos parámetros que la API pública.

## La API

La página lee `GET /api/public/transparency`, que no pide autenticación y responde 404 mientras la página esté apagada.

| Parámetro | Valor |
|---|---|
| `limit` | Entre 1 y 100. Por defecto, 50 |
| `before_log_index` | Devuelve los anclajes con un índice de Rekor menor a este. Use el `next_before_log_index` de la respuesta para pedir la página siguiente |

La respuesta tiene el formato `smltp-public-transparency/1`: `rekor.origin`, `keys`, `totals`, `heartbeat` y `anchors`.

## Dónde encuentra todo un auditor

Un auditor que solo conoce su dominio encuentra en `https://<su-dominio>/.well-known/smltp` dónde publica su
organización lo que hace falta para verificar: el manifiesto de claves del gateway, las claves que firman los anclajes,
la verificación de un recibo y el registro de Rekor en el que ancla. No pide autenticación.

```bash
curl -s https://su-dominio.com/.well-known/smltp
```

```json
{
  "format": "smltp-discovery/1",
  "key_manifest": "/api/public/keys/manifest",
  "anchor_signing_keys": "/api/public/export-signing-keys",
  "receipt_verify": "/api/public/verify/{bundle_id}",
  "receipt_verify_page": "/verify/{bundle_id}",
  "rekor": { "origin": "https://rekor.sigstore.dev" },
  "transparency": null
}
```

- Responde siempre, con la página pública prendida o apagada: solo nombra rutas que ya son públicas.
- `transparency` lleva la dirección de esta página mientras está prendida, y `null` mientras está apagada.
- Las rutas son relativas al dominio desde el que se pidió el documento.
- El documento solo dice dónde buscar. La confianza sigue saliendo de las claves y de sus anclajes en Rekor, como
  explican los pasos de abajo.

## Cómo verifica un ancla un tercero

Los comandos de la página usan solo `curl`, `sha256sum`, `base64` y `openssl`, y no confían en el sitio de SecureAI.
Para el ancla elegida comprueban cuatro cosas:

1. Rekor guarda el SHA-256 del valor anclado, escrito como texto.
2. La clave pública de Rekor es la que nombra el `logID` de la entrada, y la entrada está en el índice publicado.
3. La firma de Rekor sobre la entrada (el *signed entry timestamp*) es válida.
4. La clave que firmó la entrada es una de las que publica su organización. Sin este paso, cualquiera con una clave
   Ed25519 podría haber subido la misma raíz a Rekor. La página lo incluye solo cuando se abre por https.

Lo más simple es copiar el script que arma la página con el botón **Copiar**. Si el auditor prefiere escribirlo él,
esta versión hace lo mismo para el ancla más reciente (necesita además `jq`):

```bash
HOST="https://su-dominio.com"

curl -s "$HOST/api/public/transparency?limit=1" > t.json
ROOT=$(jq -r '.anchors[0].merkle_root' t.json)
UUID=$(jq -r '.anchors[0].rekor_uuid' t.json)
IDX=$(jq -r '.anchors[0].rekor_log_index' t.json)
REKOR=$(jq -r '.rekor.origin' t.json)

# 1. Rekor guarda el SHA-256 del valor anclado
curl -s "$REKOR/api/v1/log/entries/$UUID" > entry.json
BODY=$(jq -r '.[].body' entry.json)
DATA_HASH=$(printf '%s' "$BODY" | base64 -d | jq -r '.spec.data.hash.value')
[ "$(printf '%s' "$ROOT" | sha256sum | cut -c1-64)" = "$DATA_HASH" ] && echo "OK 1" || echo "FALLA 1"

# 2. La clave de Rekor es la del logID y la entrada está en el índice publicado
curl -s "$REKOR/api/v1/log/publicKey" > rekor.pub
LOGID=$(jq -r '.[].logID' entry.json)
IT=$(jq -r '.[].integratedTime' entry.json)
LI=$(jq -r '.[].logIndex' entry.json)
[ "$(openssl pkey -pubin -in rekor.pub -outform DER | sha256sum | cut -c1-64)" = "$LOGID" ] && [ "$LI" = "$IDX" ] \
  && echo "OK 2" || echo "FALLA 2"

# 3. La firma de Rekor sobre la entrada es válida
printf '{"body":"%s","integratedTime":%s,"logID":"%s","logIndex":%s}' "$BODY" "$IT" "$LOGID" "$LI" > set-payload.json
jq -r '.[].verification.signedEntryTimestamp' entry.json | base64 -d > set.sig
openssl dgst -sha256 -verify rekor.pub -signature set.sig set-payload.json > /dev/null && echo "OK 3" || echo "FALLA 3"

# 4. La clave que firmó la entrada es una que publica la organización
printf '%s' "$BODY" | base64 -d | jq -r '.. | .publicKey?.content? // empty' | head -n1 | base64 -d > anchor-key.pem
FP=$(openssl pkey -pubin -in anchor-key.pem -outform DER | sha256sum | cut -c1-64)
curl -s "$HOST/api/public/export-signing-keys" | grep -q "\"fingerprint_sha256\":\"$FP\"" && echo "OK 4" || echo "FALLA 4"
```

Si los cuatro dan OK, ese bloque está en Rekor tal como lo selló su organización, firmado con una de sus claves.

### Qué no prueba esta verificación

El ancla prueba que la raíz de un bloque existía y no cambió desde que se publicó en Rekor. No prueba que un registro
determinado esté dentro de ese bloque: para eso hace falta el paquete de ese registro, en
`https://<su-dominio>/verify/<bundle_id>`. Ver [Página pública de verificación](/security/immutable-logs).

## Ver también

- [Estado del registro de auditoría](/ai-gateway/status)
- [Integridad del registro de auditoría](/security/audit-integrity)
