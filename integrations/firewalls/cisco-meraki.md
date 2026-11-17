---
title: "Cisco Meraki MX"
sidebarTitle: "Cisco Meraki MX"
icon: "/img/icons/cisco.svg"
description: "Vea la IA que usa su gente detrás de sus Meraki MX y bloquéela desde SecureAI con la API del Dashboard"
---

Con esta integración ve en SecureAI qué servicios de IA usa la gente detrás de sus Meraki MX, y SecureAI bloquea en
el MX los proveedores que usted prohíbe. El MX manda sus logs por syslog a un colector en su red, y SecureAI escribe
su lista de bloqueo en el content filtering de las redes que usted elige, por la API del Dashboard de Meraki.

<Note>
El conector `cisco-meraki` está en **beta**. Probamos el descubrimiento contra un tenant de SecureAI con líneas de
syslog en el formato que publica Cisco, sin un MX real. La escritura de la lista de bloqueo la probamos contra el
Dashboard de Meraki, en una red sin equipo; todavía no la repetimos desde un tenant. Vea
[Versiones probadas](#versiones-probadas). En beta, el equipo de SecureAI acompaña la configuración.
</Note>

## Cómo funciona

1. El MX manda por syslog dos tipos de log: `urls` (cada pedido HTTP, y cada sesión HTTPS con su nombre de host) y
   `flows` (cada conexión que cruza el firewall, con IP y puertos). Con el rol URLs también manda los bloqueos del
   content filtering (`content_filtering_block`).
2. El colector de SecureAI, un contenedor que corre en su red, saca el host de cada línea `urls`, se queda solo con
   las que van a un servicio de IA y se las manda a su tenant por HTTPS, sin la query string. El resto de la
   navegación no sale de su red.
3. SecureAI lee de cada línea la IP y la MAC del cliente y el host de destino, y lo muestra en **Inventario → Fuentes
   de red** con el conector `cisco-meraki`.
4. Cuando prende el bloqueo, SecureAI escribe su lista en los **Blocked URL patterns** de cada red que eligió. La
   vuelve a sincronizar a los pocos segundos de cada bloqueo o liberación, y cada 5 minutos.

Los patrones que usted cargó a mano en esa lista quedan como están. SecureAI recuerda cuáles escribió y solo agrega o
saca esos. No toca las categorías bloqueadas ni las URLs permitidas.

## Requisitos

- Un MX con licencia **Advanced Security**. Sin ella, la red no tiene content filtering y SecureAI no tiene dónde
  escribir el bloqueo. El descubrimiento funciona igual.
- Una API key del Dashboard de un administrador con permiso de escritura (full) en las redes donde SecureAI va a
  bloquear. La API tiene que estar habilitada en la organización (**Organization → Settings → Dashboard API
  access**). La key se genera en **My profile → API access**.
- Una máquina Linux con Docker en la red del MX para el colector. El MX tiene que llegarle por syslog, y ella tiene
  que salir por HTTPS a su tenant.
- Un administrador de SecureAI con segundo factor configurado.

## 1. Conectar el MX en SecureAI

1. Abra **Administrador → Integraciones** y elija la categoría **Red / SWG**.
2. En la tarjeta **Cisco Meraki MX**, haga clic en **Conectar**.
3. En **Agregar un Cisco Meraki MX**, escriba un nombre que le permita reconocer el equipo y, si quiere, la IP del
   colector.
4. Haga clic en **Crear y mostrar la configuración**. SecureAI le pide el segundo factor, crea la fuente de logs y el
   feed que usa el colector para filtrar, ofrece **Descargar el colector (.zip)** y muestra el `collector.env` y los
   **Valores para el Dashboard**.

Los tokens se ven solo en ese momento. Descargue el colector antes de cerrar el panel. Si pierde los tokens,
**Tokens nuevos** en la fila del equipo genera otros y los anteriores dejan de funcionar.

## 2. Instalar el colector

1. Copie el `.zip` a una máquina Linux con Docker en la red del MX y descomprímalo.
2. En la carpeta `secureai-collector`, ejecute `docker compose up -d`.

El colector escucha syslog en el puerto 514 de la máquina, UDP y TCP. Es el mismo colector que usan los otros
firewalls; la guía de [Fortinet FortiGate](/integrations/firewalls/fortinet-fortigate#2-instalar-el-colector)
muestra el contenido de los archivos y cómo correrlo sin Docker.

## 3. Mandar el syslog del MX al colector

En el Dashboard: **Network-wide → General**, sección **Reporting**, **Add a syslog server**:

- **Server IP**: la IP del colector.
- **Port**: 514.
- **Roles**: **URLs** y **Flows**.

Guarde. Desde el firmware MX 18.101, las líneas del rol Flows llegan con el tipo `firewall` en lugar de `flows`;
SecureAI lee los dos.

## 4. Prender el bloqueo

En el panel de **Cisco Meraki MX**, pestaña **Bloqueo**:

1. Pegue la **API key del Dashboard**.
2. **Ver mis redes con MX** lista las redes con MX de las organizaciones que ve esa key. Elija las redes. Si la key no
   puede listar organizaciones, escriba los ids de red (`L_…` o `N_…`).
3. Marque **Entiendo que SecureAI escribe en los patrones bloqueados de estas redes**.
4. Haga clic en **Prender el bloqueo**. SecureAI le pide el segundo factor y hace la primera sincronización.

SecureAI guarda la API key cifrada y no la vuelve a mostrar. El Activity Log registra quién prendió el bloqueo. En
**Inventario → Fuentes de red → Respuesta y auto-bloqueo** ve el estado (cuántos dominios en cuántas redes y la
última sincronización), cambia las redes con **Cambiar redes** o lo apaga con **Apagar**. Al cambiar las redes,
SecureAI saca sus patrones de las que quitó y los escribe en las nuevas.

Los bloqueos temporales que hace un analista desde **Fuentes de red** van a Meraki cuando el destino de bloqueo es
Meraki, o automático y su tenant no tiene Cisco Umbrella ni el bloqueo de Cloudflare Gateway. Un bloqueo por Meraki
alcanza a toda la red detrás de cada MX elegido, no solo a la IP de origen.

## 5. Comprobar

1. En el Dashboard, **Security & SD-WAN → Content filtering** de una red elegida: en **Blocked URL patterns** ve los
   dominios de la lista de bloqueo de SecureAI, después de los suyos.
2. Desde una máquina detrás del MX, abra un servicio de IA que prohibió. Según la documentación de Cisco, el MX
   muestra su página de bloqueo en HTTP y corta la conexión en HTTPS.
3. En **Inventario → Fuentes de red** aparece la IP de esa máquina con el conector `cisco-meraki`.

## Apagar el bloqueo

**Apagar**, en **Respuesta y auto-bloqueo**, pide el segundo factor. SecureAI saca de cada red los patrones que
escribió y deja los suyos, y el MX deja de bloquear esos dominios. El Activity Log lo registra con severidad
crítica. Si alguna red no acepta el cambio, el bloqueo sigue prendido y esa red conserva los patrones de SecureAI
hasta que usted vuelva a apagarlo.

Si pausa el enforcement de red en SecureAI, SecureAI deja de escribir en las redes y el MX sigue bloqueando la última
lista.

## Qué hace SecureAI si algo falla

| Situación | Qué pasa | Código |
|---|---|---|
| SecureAI no puede armar la lista de bloqueo | No escribe nada en ninguna red | `FEED_UNAVAILABLE` |
| La API de Meraki falla al leer o escribir una red | Esa red conserva la lista que tenía; las otras siguen. La próxima sincronización reintenta | `MERAKI_*` |
| Meraki responde sin la lista de patrones | SecureAI no la toma como vacía y no escribe en esa red | `MERAKI_BAD_RESPONSE` |
| Sus patrones más los de SecureAI superan el límite configurado | No escribe en ninguna red, no recorta y le avisa con una alerta crítica | `MERAKI_LIMIT` |
| Meraki responde 429 | Espera lo que indica `Retry-After` y reintenta | |

El panel muestra el código de la última falla.

## Límites

- **Sin descifrado, solo el host.** El MX no descifra HTTPS: en el log `urls` de una sesión HTTPS llega el host y el
  método `UNKNOWN`, sin ruta. El content filtering también decide por el host, así que SecureAI bloquea dominios
  enteros.
- **Las líneas `flows` no suman al inventario.** Traen IP y puertos, sin host: SecureAI las acepta y no las cuenta.
- **Los bloqueos del content filtering pueden no contarse.** En el ejemplo de la documentación de Cisco, el log
  `content_filtering_block` trae la MAC del cliente y no su IP, y SecureAI no puede atribuirlo a una fuente. Si su
  firmware agrega `client_ip`, SecureAI lo cuenta como bloqueado.
- **Límite de entradas.** Ni la referencia de la API
  ([Update Network Appliance Content Filtering](https://developer.cisco.com/meraki/api-v1/update-network-appliance-content-filtering/))
  ni la guía de content filtering del MX publican un máximo de patrones bloqueados, así que SecureAI no corta por
  defecto. En una red de prueba sin equipo, el Dashboard aceptó y guardó 20.000 patrones; no sabemos cuántos aplica
  un MX. Si el Dashboard rechaza la lista, esa red conserva la que tenía y el panel muestra `MERAKI_BAD_REQUEST`. Si
  conoce el límite de su organización, pida a soporte que lo fije: por encima, SecureAI no escribe en ninguna red y
  le avisa con `MERAKI_LIMIT`.
- **Comodines.** El MX compara sacando subdominios de izquierda a derecha, así que `openai.com` cubre
  `api.openai.com`, y un asterisco dentro de una URL vale como texto
  ([How to Filter Web Content Using MX and Cisco Talos](https://documentation.meraki.com/SASE_and_SD-WAN/MX/Operate_and_Maintain/Content_Filtering_and_Threat_Protection/Content_Filtering)).
  Por eso SecureAI escribe `*.openai.com` como `openai.com`. Un comodín en el medio (`bedrock.*.amazonaws.com`) no se
  puede escribir sin ensancharlo, y SecureAI lo deja afuera; el panel dice cuántos patrones quedaron afuera.
- **El bloqueo alcanza a toda la red detrás del MX**, no a un usuario ni a una IP.
- **Meraki tiene una categoría "Generative AI".** SecureAI no la usa: bloquea por dominio, proveedor por proveedor,
  para que lo que usted aprueba siga andando. Si la activa a mano en el Dashboard, puede bloquear también los
  proveedores que aprobó en SecureAI.

## Versiones probadas

| Fecha | Entorno | Resultado |
|---|---|---|
| 2026-11-12 | Sandbox de Cisco DevNet, red con un MX100 virtual, rol Observer | La API devolvió el content filtering con la forma que lee SecureAI |
| 2026-11-12 | Red de prueba sin equipo, en una organización de Meraki propia | SecureAI agregó sus dominios a un patrón cargado a mano, sacó un proveedor que dejó de estar prohibido y, al apagar el bloqueo, dejó solo el patrón cargado a mano. Las categorías bloqueadas y los patrones permitidos no cambiaron. El Dashboard aceptó 20.000 patrones |
| 2026-11-17 | Contra un tenant de SecureAI, sin MX | Alta desde la consola y descubrimiento en Fuentes de red, con líneas de syslog en el formato de la documentación de Cisco enviadas al colector |

Todavía no probamos con un MX real el formato de los logs ni que el MX bloquee los subdominios: los dos salen de la
documentación pública de Cisco ("Syslog Event Types and Log Samples" y la guía de content filtering). Tampoco
repetimos el bloqueo por la API del Dashboard desde un tenant. Por eso el conector está en beta.
