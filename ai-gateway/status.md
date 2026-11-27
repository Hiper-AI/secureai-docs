---
title: "Estado del registro de auditoría (SMLTP)"
sidebarTitle: "Estado"
description: "Compruebe en una pantalla si el gateway firma, sella, ancla en Rekor y archiva el registro de lo que hace la IA"
---

**Gateway de IA → Estado** (`/admin/smltp-status`) contesta una pregunta: ¿el registro de lo que hace la IA en su
organización se está firmando, sellando y publicando ahora? La pantalla se recarga cada 30 segundos mientras la pestaña
está a la vista.

{/* TODO: captura de Gateway de IA → Estado con las cuatro etapas en Funcionando (en inglés, recuadros rojos). */}

## Qué muestra

| Bloque | Qué le dice |
|---|---|
| **Prueba de punta a punta** | Si el último pedido de prueba recorrió toda la cadena, y cuándo |
| **Firma**, **Sellado**, **Anclaje público**, **Archivo** | El estado de cada etapa y su último evento |
| **Cobertura, últimas 24 h** | Cuántas llamadas a la IA tienen recibo firmado y cuáles salieron sin pasar por el gateway |
| **Página pública de transparencia** | El interruptor que publica el resumen del registro (ver [Página pública de transparencia](/security/public-transparency)) |

Si hay alertas de SMLTP abiertas, un aviso arriba de todo dice cuántas son y el estado general.

### Estados

| Estado | Significado |
|---|---|
| **Funcionando** | Todos los chequeos de la etapa pasaron |
| **Con fallas** | La evidencia que verifica un auditor falta, llega tarde o no verifica |
| **Caído** | El control no hace lo configurado: el gateway quedó fuera del camino, no responde o aplica otro modo |
| **Sin datos** | Ningún chequeo de esa etapa corrió todavía |
| **Apagado** | La etapa no está configurada para su organización (hoy solo el **Archivo**) |

Debajo de una etapa con fallas aparece **Por qué** con los códigos de los chequeos que fallaron, por ejemplo
`rekor_anchoring_behind`. La pantalla muestra códigos y no el texto interno de los chequeos, que escribe Hiper AI para
sus operadores.

## La prueba de punta a punta

Cada 15 minutos SecureAI manda por el gateway un pedido de prueba que el gateway tiene que rechazar. Lo sigue hasta el
final: recibo firmado, hoja en el árbol Merkle, bloque sellado y ancla confirmada en el log público de Rekor. Es la única
prueba que genera su propia evidencia, así que falla aunque su organización no tenga tráfico.

**Última prueba completa** muestra cuándo se confirmó en Rekor y el enlace **Ver en Rekor** abre esa entrada en
`search.sigstore.dev`. Si hay pruebas que todavía no terminaron el recorrido, la tarjeta dice cuántas van en camino.

**Probar ahora**, arriba a la derecha, manda una prueba en el momento. Lo ven los usuarios con permiso de edición en
Gateway de IA, y acepta una prueba cada 30 segundos. El gateway la firma enseguida; el sellado y el ancla en Rekor tardan
unos minutos.

## Las cuatro etapas

### Firma

El gateway firma un recibo por cada llamada a la IA. La tarjeta muestra la hora del **Último recibo**, y **Verificarlo**
abre esa llamada en **Configuración → Registros de Actividad**, filtrada por el origen AI Gateway, donde puede verificar
sus tres capas.

### Sellado

Los recibos se agrupan en bloques Merkle de 10 entradas encadenados con hashes. La tarjeta muestra la hora del
**Último bloque** y cuántas entradas tiene. Esta etapa también incluye la continuidad de la cadena: el control de cada
línea al ingerirla y el recorrido diario de la cadena guardada (ver
[Integridad del registro de auditoría](/security/audit-integrity)).

Con poco tráfico un bloque tarda más en llenarse. Un bloque parcial no cuenta como falla.

### Anclaje público

La raíz de cada bloque sellado se publica en [Sigstore Rekor](https://rekor.sigstore.dev/), un log de transparencia
público de solo agregado. La tarjeta muestra la hora de la **Última ancla** con su enlace **Ver en Rekor**. Si el bloque
más nuevo todavía espera su ancla, la tarjeta dice hace cuántos minutos. Con la configuración por defecto, un bloque
sellado hace más de 30 minutos sin ancla pone la etapa en **Con fallas**.

### Archivo

Cada bloque sellado se copia a un bucket con retención bloqueada (Google Cloud Storage con política de retención
bloqueada, o S3 con Object Lock en modo compliance). Mientras dure la retención, nadie puede borrar ni reescribir esa
copia, ni siquiera quien administra la base de datos. La copia lleva hashes e identificadores, nunca el contenido de
las llamadas.

La tarjeta muestra la hora de la **Última copia** y, si hay bloques sin copiar, cuántos minutos lleva esperando el más
viejo. Un bloque de los últimos 7 días sin copia después de 30 minutos pone la etapa en **Con fallas**.

Si la tarjeta dice **Apagado**, su organización no tiene un bucket de archivo configurado. Hiper AI lo configura por
organización: pídalo al soporte de Hiper AI.

## Cobertura

**Cobertura, últimas 24 h** cuenta las llamadas a la IA que pasaron por el gateway con recibo firmado. Si alguna función
interna de la plataforma llamó a un modelo sin pasar por el gateway, la tarjeta la lista por carril con su cantidad.
Esas llamadas no tienen recibo firmado ni entran en la cadena.

## Avisos

Cuando SMLTP queda **Con fallas** o **Caído**:

- Los operadores de Hiper AI reciben un correo en cuanto cambia el estado.
- La campana de la consola muestra **El registro de auditoría de la IA (SMLTP) tiene fallas** o **está caído**, con un
  enlace a esta pantalla, mientras la alerta siga abierta.
- Si el mismo problema dura 30 minutos, cada administrador activo de su organización recibe un correo con el estado y
  las etapas afectadas. Llega un correo por problema, no uno por cada chequeo. El mismo problema después de una
  recuperación, o un problema distinto, puede mandar otro.

Ni la campana ni el correo incluyen el texto interno de los chequeos.

## Qué hacer cuando una etapa falla

Hiper AI opera el gateway y sus operadores ya recibieron el aviso. Lo que le toca a usted es saber qué evidencia
falta mientras dura la falla y confirmar la recuperación.

| Etapa | Códigos frecuentes | Qué pasa | Qué hacer |
|---|---|---|---|
| Firma | `gateway_not_in_path`, `gateway_unreachable`, `gateway_mode_mismatch`, `stale_gateway_behavior` | El gateway no está en el camino o no aplica el modo configurado. Etapa **Caído** | Contacte al soporte de Hiper AI con los códigos. Las llamadas de ese período pueden no tener recibo |
| Firma | `no_receipts`, `receipt_not_retrievable`, `receipt_store_loss` | Hubo tráfico sin recibo, o un recibo no se puede recuperar | Revise en Registros de Actividad las llamadas de ese período; los recibos que falten no se recuperan después |
| Firma | `gateway_key_not_in_manifest`, `gateway_key_not_head`, `gateway_key_revoked` | El gateway firma con una clave que no es la vigente del manifiesto | Contacte al soporte. Un recibo firmado con esa clave no verifica contra el manifiesto publicado |
| Sellado | `merkle_sealing_stalled`, `merkle_entries_behind_window` | Hay recibos que todavía no entraron en un bloque sellado | Espere a que se sellen; si dura más de una hora, contacte al soporte |
| Sellado | `audit_events_dropped`, `audit_write_failed` | El gateway perdió eventos antes de escribirlos | La cadena registra cuántos se perdieron dentro del hash de la entrada siguiente. Contacte al soporte |
| Sellado | `chain_gap`, `chain_store_gap` | Falta un eslabón de la cadena o hay una bifurcación | Trátelo como un incidente de seguridad: alguien pudo borrar o reescribir registros. Ver [Integridad del registro de auditoría](/security/audit-integrity) |
| Sellado | `chain_walk_stale` | El recorrido diario de la cadena no corrió a tiempo | Contacte al soporte |
| Anclaje público | `rekor_anchoring_behind`, `rekor_anchor_unreachable`, `rekor_dlq_failed` | Hay bloques sellados sin ancla en Rekor | Los bloques se anclan cuando el servicio vuelve. Si dura, contacte al soporte |
| Archivo | `ledger_archive_behind` | Hay bloques sellados sin copia en el bucket | Las copias se completan cuando el archivador vuelve. Si dura, contacte al soporte |
| Prueba de punta a punta | `heartbeat_not_sealed`, `heartbeat_not_anchored`, `heartbeat_rekor_unreachable`, otros `heartbeat_*` | La prueba no completó el recorrido | Mire qué etapa falla; el código dice en qué paso se cortó la prueba |

Cuando la etapa vuelva a **Funcionando**, use **Probar ahora** y espere a que **Última prueba completa** muestre una hora
posterior a la falla. Esa prueba confirma que la cadena entera funciona otra vez.

## Ver también

- [Integridad del registro de auditoría](/security/audit-integrity)
- [Página pública de transparencia](/security/public-transparency)
- [Seguridad SMLTP](/security/smltp)
