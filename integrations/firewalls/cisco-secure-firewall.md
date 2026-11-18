---
title: "Cisco Secure Firewall"
sidebarTitle: "Cisco Secure Firewall"
icon: "/img/icons/cisco.svg"
description: "Vea la IA que usa su gente detrás de sus Cisco Secure Firewall y bloquéela desde SecureAI, sin Cisco AI Defense"
---

Con esta integración ve en SecureAI qué servicios de IA usa la gente detrás de sus Cisco Secure Firewall Threat
Defense (FTD) administrados por un Management Center (FMC), desde qué equipo y con qué frecuencia, y los bloquea desde
SecureAI. No necesita Cisco AI Defense: el FTD manda sus eventos de conexión a SecureAI y el FMC descarga de SecureAI
la lista de dominios que tiene que bloquear.

<Note>
La probamos con FMCv y FTDv 7.4.2, en laboratorio y contra un tenant de SecureAI; vea
[Versiones probadas](#versiones-probadas).
</Note>

## Cómo funciona

1. El FTD manda por syslog un evento por conexión (mensajes `430002` y `430003`) al colector de SecureAI, un
   contenedor que corre en su red. Cada evento trae el origen (`SrcIP`, `User`), el destino (`URL`, `DNSQuery` o
   `ReferencedHost`), la aplicación que reconoce OpenAppID (`WebApplication`), la categoría de URL (`URLCategory`)
   y la acción (`AccessControlRuleAction`).
2. El colector se queda solo con las conexiones a servicios de IA y se las manda a su tenant por HTTPS. El resto de
   la navegación no sale de su red.
3. SecureAI cuenta una vez cada conexión, aunque el FTD la registre al inicio y al final, y la muestra en
   **Inventario → Fuentes de red** con el conector Cisco Secure Firewall.
4. Cuando usted bloquea dominios de IA en SecureAI, entran a un feed de bloqueo. El FMC lo descarga cada 30 minutos
   y lo aplica en los FTD con Security Intelligence, por URL y por DNS.

## Requisitos

- FMC y FTD 7.2 o posterior, con un usuario del FMC que pueda editar objetos, políticas de control de acceso y
  Platform Settings, y hacer deploy.
- Licencias: **Threat**, para Security Intelligence, y **URL Filtering**, para que el FTD informe la categoría de URL.
- Una máquina Linux con Docker en la red del FTD para el colector. El FTD tiene que llegarle por syslog, y ella
  tiene que salir por HTTPS a su tenant.
- Que el FMC salga por HTTPS a su tenant (`https://<tenant>.hiperai.com`) para descargar el feed.
- Un administrador de SecureAI con segundo factor configurado: crear y rotar los tokens lo pide.

## 1. Conectar el FTD en SecureAI

1. Abra **Administrador → Integraciones** y elija la categoría **Red / SWG**.
2. En la tarjeta **Cisco Secure Firewall**, haga clic en **Conectar**.
3. En **Agregar un Cisco Secure Firewall**, escriba un nombre que le permita reconocer el equipo. Los otros dos
   campos son opcionales:
   - **IP del colector**: SecureAI la pone como servidor de syslog en los valores para el FMC.
   - **IP pública del FMC**: el FMC descarga la lista para sus FTD. Si carga su IP, SecureAI solo le entrega la lista
     de bloqueo a esa dirección, aunque otro tenga el token.
4. Haga clic en **Crear y mostrar la configuración**. SecureAI le pide el segundo factor y crea la fuente de logs
   del colector, el feed de bloqueo del FMC y el feed con la lista de dominios de IA que usa el colector para
   filtrar. Después ofrece **Descargar el colector (.zip)** y muestra el `collector.env` y los **Valores para el
   FMC**: el servidor de syslog y la URL del feed, con el token adentro, para el feed de URL y para el de DNS.

Los tokens se ven solo en ese momento. Descargue el colector y copie los valores antes de cerrar el panel, y guarde
los tokens en su gestor de secretos. Si los pierde, **Tokens nuevos** en la fila del equipo genera otros y los
anteriores dejan de funcionar.

Para cambiar después qué dirección puede descargar la lista de bloqueo, abra **Acciones → IP permitida** en la fila del equipo. Acepta IPv4 e IPv6. Si deja el campo vacío, la descarga cualquiera que tenga el token. **Tokens nuevos** no cambia la IP permitida.

En **Equipos conectados** ve si llegan los logs y cuándo descargó el FMC la lista de bloqueo por última vez. Si
SecureAI rechaza una descarga con el token correcto, el panel muestra desde qué IP llegó y por qué: una IP que no
está entre las permitidas o el feed deshabilitado.

## 2. Instalar el colector

El `.zip` del panel trae `docker-compose.yml`, `vector.yaml` y `collector.env`. El colector es
[Vector](https://vector.dev) con la imagen oficial `timberio/vector`; SecureAI no publica una imagen propia.

1. Copie el `.zip` a una máquina Linux con Docker en la red del FTD y descomprímalo.
2. En la carpeta `secureai-collector`, ejecute `docker compose up -d`.

El colector escucha syslog en el puerto 514 de la máquina, UDP y TCP. Cada hora descarga de su tenant la lista de
dominios de IA y solo manda las líneas cuyo destino está en esa lista. Si su tenant deja de contestar, conserva la
última lista 7 días. La guía de [Fortinet FortiGate](/integrations/firewalls/fortinet-fortigate#2-instalar-el-colector)
muestra el contenido de los archivos y cómo correrlo sin Docker: es el mismo colector.

## 3. Mandar los eventos de conexión al colector

En el FMC:

1. **Devices → Platform Settings**, la política Threat Defense de sus FTD (si no tiene una, créela y asígnele los
   equipos), sección **Syslog**:
   - pestaña **Logging Setup**: active **Enable logging**;
   - pestaña **Syslog Servers → Add**: un objeto de red con la IP del colector, protocolo UDP, puerto 514 y la zona
     o interfaz por la que el FTD lo alcanza.
2. **Policies → Access Control**, su política, **More → Logging**: marque **Use the syslog settings configured in the
   FTD Platform Settings policy deployed on the device**. Con la severidad ALERT, el FTD manda los eventos como
   `%FTD-1-430003`, que es lo que lee SecureAI.
3. En las reglas que llevan tráfico a internet, pestaña **Logging**: marque **Log at End of Connection** y, en
   **Send Connection Events to**, **Syslog Server**.
4. Haga deploy.

Con loguear al final de la conexión alcanza: el evento de fin trae todo lo del inicio más los contadores. Sin
descifrado, el FTD informa en `URL` el host que lee del SNI (`https://chatgpt.com`) y en `WebApplication` la
aplicación (`ChatGPT`, `Anthropic Claude`). Sin la licencia de URL Filtering no manda `URLCategory`.

## 4. Bloquear con el feed de SecureAI

### Feed de URL

1. **Objects → Object Management → Security Intelligence → URL Lists and Feeds → Add URL Lists and Feeds**:

   | Campo | Valor |
   |---|---|
   | Name | `secureai-ia-prohibida` |
   | Type | Feed |
   | Feed URL | La URL del feed que muestra el panel: `https://feed:<token del feed>@<tenant>.hiperai.com/api/network-feeds/<id del feed>` |
   | Update Frequency | 30 minutos |

   El token va en la URL, antes del host, y el FMC lo manda como HTTP Basic al descargar el feed. No lo ponga como
   parámetro (`?token=`): quedaría en los logs.

2. En su política de control de acceso, paso **Security Intelligence**, pestaña **URLs**: elija el feed, la zona
   (Any) y **Add to Block List**.
3. Guarde y haga deploy.

El FMC no acepta una frecuencia menor a 30 minutos sin una URL de checksum MD5, y SecureAI todavía no publica ese
checksum. Para no esperar la próxima descarga, **URL Lists and Feeds → Update Feeds** la fuerza.

Una entrada del feed cubre el dominio y sus subdominios: con `openai.com` en el feed, el FTD bloquea
`api.openai.com`. También acepta comodines (`*.anthropic.com`).

En FMC 7.7 o posterior puede agregar el feed a la Block List por la REST API
(`PUT .../accesspolicies/{id}/securityintelligencepolicies/{id}`). En 7.2 y 7.4 esa ruta es de solo lectura.

### Feed de DNS

La API del FMC no deja crear feeds DNS ni editar políticas DNS, así que este paso se hace por la GUI, una sola vez:

1. **Objects → Object Management → Security Intelligence → DNS Lists and Feeds → Add DNS Lists and Feeds**: tipo
   Feed, con la URL de DNS que muestra el panel y la misma frecuencia.
2. **Policies → DNS**, la política DNS que usa su política de control de acceso, **Add DNS Rule**: acción **Domain
   Not Found** y, en la pestaña **DNS**, el feed. La regla por defecto de la Global Block List no se puede editar:
   cree una nueva.
3. Si su política de control de acceso usa otra política DNS, elíjala en **Security Intelligence → DNS Policy**.
4. Para que los bloqueos por DNS lleguen a SecureAI: en esa misma pantalla, el ícono de logging al lado de **DNS
   Policy** abre **DNS Block List Logging Options**. Marque **Syslog Server** y **OK**.
5. Guarde la política y haga deploy.

Después de este paso, el FMC descarga el feed solo: lo que usted bloquea en SecureAI llega sin volver a la GUI. Una
consulta a `chatgpt.com` que atraviesa el FTD recibe NXDOMAIN, y `api.openai.com` también, por ser subdominio de
`openai.com`.

El bloqueo por DNS alcanza solo las consultas que cruzan el FTD. Un equipo que resuelve con un DNS que no pasa por el
FTD (por ejemplo, un DNS interno del mismo lado de la red) no queda bloqueado por DNS; el bloqueo por URL sí lo
alcanza.

## 5. Comprobar

1. Desde un equipo detrás del FTD, abra chatgpt.com. En unos segundos el equipo aparece en **Inventario → Fuentes de
   red**, con el conector Cisco Secure Firewall, el origen y, si el FTD lo conoce, el usuario.
2. En la fila del equipo, abra **Acciones** y elija **Bloquear**. Marque los dominios, elija la duración y escriba el
   motivo. **Aplicado vía** tiene que decir **Feed de bloqueo para firewalls**. También puede prohibir el proveedor
   (por ejemplo, OpenAI) en SecureAI.
3. Después de la próxima descarga del feed (hasta 30 minutos; **Update Feeds** en el FMC la adelanta), el equipo no
   llega a chatgpt.com. El FTD manda el bloqueo por syslog y la fila del equipo suma llamadas bloqueadas.
4. Para levantarlo, elija **Acciones → Liberar** en la fila. SecureAI saca los dominios del feed y el FTD los deja
   pasar después de la próxima descarga.

## Bloqueo automático

En **Respuesta y auto-bloqueo**, arriba de la lista de Fuentes de red, active **Auto-bloquear fuentes que superen
el umbral** y elija el umbral de llamadas, cuánto dura el bloqueo y cuántos bloqueos automáticos puede haber a la
vez. Cuando una fuente pasa el umbral, SecureAI pone sus dominios de IA en el feed y los saca al vencer. Guardar
estos ajustes pide el segundo factor.

## Límites

- **Sin descifrado TLS, el FTD ve el nombre del destino y no el contenido.** Lo lee de la consulta DNS y del SNI.
  SecureAI sabe que alguien usó ChatGPT, desde qué equipo y cuántas veces; no qué escribió.
- **Hasta 30 minutos entre el bloqueo en SecureAI y la descarga del FMC**, por la frecuencia mínima del feed sin
  checksum. Después de cada descarga, el FTD tarda unos minutos más en aplicar la lista. Contra un tenant de
  SecureAI medimos 2 min 37 s desde la descarga hasta el bloqueo en el cliente, unos 9 minutos para liberar, y 31
  minutos de punta a punta para un proveedor prohibido con el refresco normal del FMC.
- **Deshabilitar o borrar el feed en SecureAI no desbloquea nada.** SecureAI responde 403 y el FMC se queda con la
  última lista. Para desbloquear, use **Liberar**, saque el proveedor de prohibidos o saque el feed de la Block List.
- **El bloqueo alcanza a toda la red detrás del FTD**, no a un usuario ni a una IP: el feed es una lista de dominios.
- **Si su tenant tiene además Cisco Umbrella o el bloqueo de Cloudflare Gateway, los bloqueos van ahí y no al
  feed.** Para mandarlos al FMC, pida a soporte que fije el destino de bloqueo en el feed.
- **Los bloqueos por DNS no llegan a SecureAI con la configuración por defecto.** El FMC manda el logging de la
  Security Intelligence de DNS solo al FMC; el paso 4 de [Feed de DNS](#feed-de-dns) lo manda también por syslog.
  Los bloqueos por URL salen por syslog sin ese paso.
- **El FMC no admite la misma cuenta en la GUI y en la REST API a la vez.** Si automatiza con la API, use un usuario
  aparte.
- **Si cambia la URL del feed por la REST API, el FMC 7.4.2 sigue descargando la URL vieja**, aun después de un
  deploy forzado. Al crear otro objeto de feed, el FMC recarga la lista y descarga todos los feeds de la URL nueva.
  Desde la GUI no pasa: al guardar la URL nueva, el FMC descarga los feeds en el momento. Si rota el token con
  **Tokens nuevos**, cargue la URL nueva en el FMC desde la GUI.
- Si SecureAI no puede armar la lista, responde con un error y el FMC conserva la anterior. Nunca recibe una lista
  vacía por un error.

## Versiones probadas

| Versión | Equipo | Resultado |
|---|---|---|
| FMC 7.7 | Sandbox de Cisco DevNet, solo lectura | Lectura de la API: qué objetos de Security Intelligence existen y cuáles se pueden escribir |
| FMCv y FTDv 7.4.2 | En laboratorio | Descubrimiento por syslog de chatgpt.com, claude.ai y consultas DNS. Descarga del feed con el token como HTTP Basic. Bloqueo por URL y por DNS de chatgpt.com, api.openai.com (subdominio) y api.anthropic.com (comodín); claude.ai, fuera del feed, siguió andando. Los bloqueos por URL y por DNS volvieron a SecureAI por syslog. Con el feed deshabilitado, el FMC recibió 403 y el FTD siguió bloqueando |
| FMCv y FTDv 7.4.2 | Contra un tenant de SecureAI | El recorrido de esta guía desde la consola: alta, colector del panel, descubrimiento en Fuentes de red, bloqueo y liberación, proveedor prohibido con el refresco normal del FMC, bloqueo automático por umbral, restricción del feed por IP y **Tokens nuevos**. El feed de DNS no lo repetimos contra el tenant: se configura en la GUI del FMC y lo probamos en laboratorio |

Todavía no la probamos en FMC 7.2 ni 7.7 con FTD, ni en equipos físicos. Los nombres de los menús de la GUI pueden
cambiar entre versiones.
