---
title: "Integridad del registro de auditoría"
sidebarTitle: "Integridad del registro"
description: "Cómo SecureAI hace evidente cualquier cambio en el registro de la IA: cadena de hashes, anclaje en Rekor, copia con retención bloqueada y recorrido diario"
---

El gateway SMLTP anota cada llamada a la IA en un registro de auditoría de solo agregado. Cuatro mecanismos hacen que
un cambio en ese registro se pueda detectar, y que un auditor lo compruebe sin confiar en Hiper AI:

| Mecanismo | Qué detecta |
|---|---|
| Cadena de hashes | Una entrada editada, borrada o insertada en el medio |
| Anclaje público en Rekor | Un bloque reescrito después de publicarse |
| Copia con retención bloqueada | Un bloque borrado de la base junto con sus entradas |
| Recorrido diario y avisos | Un eslabón que falta o una bifurcación en la cadena guardada |

Estos mecanismos **detectan** una manipulación, no la impiden. La base de datos rechaza las modificaciones y los
borrados que llegan por la aplicación; quien tenga acceso directo a la base puede borrar filas, y la cadena lo deja en
evidencia.

## Cadena de hashes

Cada entrada del gateway lleva `prev_hash`, el hash de la entrada anterior, y `current_hash`, el SHA-256 de su
contenido más `prev_hash`. La primera entrada de una cadena tiene `prev_hash` en 64 ceros. Editar, borrar o insertar
una entrada rompe el enlace con la siguiente.

Las entradas de la versión 2 de la cadena (`v: 2`) calculan el hash sobre un arreglo JSON que incluye:

- **Número de secuencia** (`seq`): numera desde 0 las líneas del archivo de cada gateway. Un lector detecta una línea
  que falta sin tener la anterior, y ocultarla obliga a renumerar y recalcular todas las siguientes, incluidas las de
  bloques ya anclados en Rekor.
- **Modelo**: el modelo que atendió la llamada queda dentro del hash.
- **Eventos perdidos**: si el gateway perdió eventos antes de escribirlos (cola llena o error de escritura), la entrada
  siguiente los cuenta en `details.dropped_since_last`, también dentro del hash. Una pérdida queda registrada en la
  cadena y no pasa en silencio.

La especificación de los dos formatos está en el borrador de SMLTP, sección 5.

## Bloques Merkle

Cada 10 entradas el gateway sella un bloque Merkle con la raíz del árbol, el primer y el último hash y la cantidad de
entradas. Si cambia una sola entrada, cambia la raíz y falla la prueba de inclusión de esa entrada.

## Anclaje público en Rekor

La raíz de cada bloque sellado se publica en [Sigstore Rekor](https://rekor.sigstore.dev/), un log de transparencia
público de solo agregado que opera la comunidad de Sigstore, firmada con una clave de su organización. Rekor devuelve un
índice y una marca de tiempo firmada.

Desde ese momento, un bloque reescrito en la base deja de coincidir con lo que guarda Rekor, y cualquiera puede
comprobarlo con `curl` y `openssl` sin cuenta en SecureAI:

- Un registro puntual, desde `https://<su-dominio>/verify/<bundle_id>`.
- Cualquier ancla de la organización, desde la [página pública de transparencia](/security/public-transparency), si
  usted la prende.

## Copia con retención bloqueada

El anclaje no alcanza si alguien borra un bloque entero junto con sus entradas: no queda nada que comparar con Rekor.
Por eso SecureAI copia cada bloque sellado a un bucket con retención bloqueada, en Google Cloud Storage con política de
retención bloqueada o en S3 con Object Lock en modo compliance. Hasta que vence la retención, el proveedor de la nube
no deja borrar ni reescribir esa copia, tampoco a quien administra la base de datos.

La copia lleva el id del bloque, la raíz Merkle, los hashes de las hojas, los ids de las entradas, las cantidades y las
fechas. No lleva el contenido de las entradas: puede tener datos personales, y un objeto bloqueado no se puede borrar
ante el pedido de una persona.

Hiper AI configura el bucket por organización. Si **Gateway de IA → Estado** muestra la etapa **Archivo** en
**Apagado**, su organización no lo tiene; pídalo al soporte de Hiper AI. El chequeo de salud comprueba que cada bloque
sellado en los últimos 7 días tenga su copia dentro de los 30 minutos.

## Recorrido diario y avisos

SecureAI revisa la cadena en dos momentos:

- **Al ingerirla**: compara el `prev_hash` de cada línea con la anterior del mismo archivo. Un corte abre una alerta de
  severidad alta (`smltp_chain_gap`).
- **Una vez por día**: recorre la cadena guardada en la base, en una ventana de 26 horas para que los recorridos se
  superpongan, y busca dos cosas:
  - **Hueco**: una entrada cuyo `prev_hash` no coincide con ninguna entrada guardada. La anterior se borró de la base o
    nunca se ingirió.
  - **Bifurcación**: dos entradas que apuntan a la misma anterior. Se escribieron dos cadenas desde un punto, o una
    entrada se reescribió y se guardó dos veces.

  Cada hallazgo abre una alerta de severidad alta (`smltp_chain_store_gap`) con el id de la entrada y los hashes, nunca
  el contenido.

El chequeo de salud `chain_continuity` pone la etapa **Sellado** de [Estado](/ai-gateway/status) en **Con fallas** si
hay una alerta nueva de cualquiera de los dos, o si el recorrido diario no corrió a tiempo. Eso dispara la campana de la
consola y, si dura 30 minutos, un correo a los administradores.

Además, cada 15 minutos una prueba recorre la cadena completa (firma, sellado y ancla confirmada en Rekor) aunque no haya
tráfico. Con un gateway sin actividad, esa prueba también mantiene la cadena con entradas recientes.

### Qué no ve el recorrido

- El borrado de la entrada más nueva de una cadena: ninguna otra entrada apunta a ella.
- Un hueco más viejo que la ventana de 26 horas.
- Con la prueba de 15 minutos apagada, un gateway sin actividad por más tiempo que la retención de SMLTP: la entrada
  anterior a la siguiente pudo borrarse por retención, a propósito.

Para esos casos quedan el ancla en Rekor y la copia con retención bloqueada, que conservan la raíz y los hashes de cada
bloque sellado.

## Qué hacer ante una alerta de la cadena

Un hueco o una bifurcación significa que alguien pudo borrar o reescribir registros con acceso directo a la base.
Trátelo como un incidente de seguridad:

1. Anote el id de la entrada y los hashes de la alerta.
2. Compare los bloques de ese período con sus anclas en Rekor y con la copia del bucket de archivo: ahí está la raíz y
   la lista de hashes que tenía el bloque al sellarse.
3. Contacte al soporte de Hiper AI con esos datos.

## Verificación en todos los planes

La verificación de recibos está incluida en todos los planes: la acción **Verificar** en los registros de actividad del
AI Gateway, la página pública `/verify/<bundle_id>` y el distintivo de verificación en cada respuesta.

## Alcance

- Solo las llamadas que pasan por el gateway entran en la cadena. **Cobertura, últimas 24 h** en
  [Estado](/ai-gateway/status) lista las llamadas internas que salieron sin pasar por el gateway; esas no tienen recibo.
- El anclaje prueba que una raíz existía y no cambió desde que se publicó. Lo anterior a la publicación lo cubren la
  cadena de hashes y el recorrido diario.

## Ver también

- [Estado del registro de auditoría](/ai-gateway/status)
- [Página pública de transparencia](/security/public-transparency)
- [Seguridad SMLTP](/security/smltp)
