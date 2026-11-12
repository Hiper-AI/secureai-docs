---
title: "Fortinet FortiGate"
sidebarTitle: "Fortinet FortiGate"
icon: "/img/icons/fortinet.svg"
description: "Vea la IA que usa su gente detrás de sus FortiGate y bloquéela desde SecureAI, sin el módulo GenAI de Fortinet"
---

Con esta integración ve en SecureAI qué servicios de IA usa la gente detrás de sus FortiGate, desde qué equipo y con
qué frecuencia, y los bloquea desde SecureAI. No necesita el módulo de control de GenAI de Fortinet: el FortiGate
manda sus logs a SecureAI y descarga de SecureAI la lista de dominios que tiene que bloquear.

<Note>
La integración está en **beta**. La probamos en laboratorio con FortiGate-VM y FortiOS 7.6.8; vea
[Versiones probadas](#versiones-probadas).
</Note>

## Cómo funciona

1. El FortiGate manda por syslog sus logs de tráfico (`type=traffic`) y de los perfiles de seguridad (`type=utm`,
   subtipos `webfilter`, `app-ctrl` y `dns`) al colector de SecureAI, un contenedor que corre en su red.
2. El colector se queda solo con las líneas cuyo destino es un servicio de IA y se las manda a su tenant por
   HTTPS. El resto de la navegación no sale de su red.
3. SecureAI lee de cada línea el origen (`srcip`, `user`, `srcname`), el destino (`hostname`, `qname` o el host de
   `url`), la decisión (`action`, `utmaction`) y la clasificación de FortiGuard (`app`, `appcat`, `catdesc`), y lo
   muestra en **Inventario → Fuentes de red**.
4. Cuando usted bloquea dominios de IA en SecureAI, entran a un feed de bloqueo. El FortiGate lo descarga con un
   External Connector y su perfil de DNS Filter deja de resolver esos dominios.

## Requisitos

- Un FortiGate con FortiOS 7.2 o posterior, y un administrador con permiso de escritura en Log & Report, Security
  Profiles, Security Fabric y Policy & Objects.
- Una máquina Linux con Docker en la red del FortiGate para el colector (1 vCPU y 1 GB alcanzan para miles de
  eventos por segundo). El FortiGate tiene que llegarle por syslog, y ella tiene que salir por HTTPS a su tenant.
- Que el FortiGate salga por HTTPS a su tenant (`https://<tenant>.hiperai.com`) para descargar el feed.
- Un administrador de SecureAI con segundo factor configurado: crear y rotar los tokens lo pide.

## 1. Conectar el FortiGate en SecureAI

1. Abra **Administrador → Integraciones** y elija la categoría **Red / SWG**.
2. En la tarjeta **Fortinet FortiGate**, haga clic en **Conectar**.

![Tarjeta de Fortinet FortiGate en Integraciones, categoría Red / SWG](/img/fortinet/console-card.png)

3. En **Agregar un Fortinet FortiGate**, escriba un nombre que le permita reconocer el equipo. Los otros dos campos
   son opcionales:
   - **IP del colector**: SecureAI la pone como servidor de syslog en la configuración del FortiGate.
   - **IP pública del firewall**: si la carga, SecureAI solo le entrega la lista de bloqueo a esa dirección, aunque
     otro tenga el token.

![Formulario para agregar un FortiGate](/img/fortinet/console-form.png)

4. Haga clic en **Crear y mostrar la configuración**. SecureAI le pide el segundo factor y crea tres cosas: la
   fuente de logs del colector, el feed de bloqueo del FortiGate y el feed con la lista de dominios de IA que usa
   el colector para filtrar. Después muestra dos bloques para copiar: `collector.env`, con los datos del colector,
   y la CLI de FortiOS, con la URL y el token del feed.

![Panel con collector.env y la CLI de FortiOS](/img/fortinet/console-config.png)

Los tokens se ven solo en ese momento. Copie los dos bloques antes de cerrar el panel y guárdelos en su gestor de
secretos. Si los pierde, **Tokens nuevos** en la fila del equipo genera otros y los anteriores dejan de funcionar.

En **Equipos conectados** ve, por cada FortiGate, si llegan sus logs y cuándo descargó la lista de bloqueo por
última vez. Si un equipo deja de descargarla por más de 30 minutos, el panel lo avisa.

![Equipo conectado: recibe logs y descargó la lista de bloqueo](/img/fortinet/console-devices.png)

## 2. Instalar el colector

En la máquina Linux, guarde el bloque `collector.env` del paso 1 junto al colector de SecureAI y levántelo con
`docker compose up -d`. Escucha syslog en el puerto 514, UDP y TCP.

## 3. Mandar los logs del FortiGate al colector

En la GUI de FortiOS: **Log & Report → Log Settings**, pestaña **Global Settings**. Ponga **Syslog logging** en
**Enable** y cargue la IP del colector. En FortiOS 7.2 y 7.4 la opción se llama **Send logs to syslog**.

![Log Settings con syslog al colector](/img/fortinet/fortigate-log-settings-syslog.png)

Por CLI es el comienzo del bloque que le dio el panel:

```
config log syslogd setting
    set status enable
    set server "<IP del colector>"
    set port 514
    set mode udp
    set format default
end
```

`format default` manda el formato key=value nativo de FortiOS, que es el que lee SecureAI. Si ya manda syslog a
otro equipo, use `log syslogd2` (hasta `syslogd4`) para no tocarlo.

Las políticas que llevan tráfico a internet necesitan:

- **Log Allowed Traffic** en *All Sessions* (`set logtraffic all`) o en *Security Events* (`set logtraffic utm`);
- un perfil de SSL Inspection, aunque sea `certificate-inspection`, para que FortiOS lea el nombre del destino
  (SNI) de las conexiones HTTPS;
- Application Control con el perfil `default` o uno propio. FortiGuard clasifica la IA generativa como `GenAI`;
- el perfil de DNS Filter del paso 4, con **Log all DNS queries and responses**.

![Política con DNS Filter, Application Control, SSL Inspection y Log Allowed Traffic](/img/fortinet/fortigate-policy-profiles.png)

## 4. Bloquear con el feed de SecureAI

La CLI del panel crea el External Connector `secureai-ia-prohibida` con la URL y el token del feed, y lo pone en
**Block** en el perfil de DNS Filter `default`. Si sus políticas usan otro perfil, cambie `default` por el suyo antes
de pegarla. Por la GUI:

1. **Security Fabric → External Connectors → Create New → Threat Feeds → Domain Name**:

   | Campo | Valor |
   |---|---|
   | Name | `secureai-ia-prohibida` |
   | URI of external resource | La URL del feed que muestra el panel |
   | HTTP basic authentication | Activado. Usuario: cualquiera (por ejemplo `feed`). Contraseña: el token del feed |
   | Refresh Rate | 5 minutos |

   ![External Connector de tipo Domain Name](/img/fortinet/fortigate-external-connector.png)

   **View Entries** muestra la lista que descargó. SecureAI escribe cada dominio dos veces, `chatgpt.com` y
   `*.chatgpt.com`, para cubrir el dominio y sus subdominios. Mientras no bloquee nada, la lista está vacía.

   ![View Entries con los dominios bloqueados desde SecureAI](/img/fortinet/fortigate-view-entries.png)

2. En el perfil de DNS Filter de sus políticas (**Security Profiles → DNS Filter**), la categoría del connector
   aparece en **Remote Categories**. Póngala en **Block** y deje **Redirect to Block Portal**.

   ![DNS Filter con la categoría remota en Block](/img/fortinet/fortigate-dns-filter-remote-category.png)

3. En **Options**, al final del perfil, active **Allow DNS requests when a rating error occurs** y **Log all DNS
   queries and responses**.

   ![Opciones del perfil de DNS Filter](/img/fortinet/fortigate-dns-filter-options.png)

<Warning>
Sin **Allow DNS requests when a rating error occurs** (`set options error-allow`), un FortiGate sin la suscripción
de DNS Filter de FortiGuard, o sin conexión a FortiGuard, bloquea todos los dominios por error de clasificación, no
solo los del feed.
</Warning>

Por CLI y por la REST API, FortiOS deja la categoría del connector en 0, que DNS Filter no puede usar. Por eso la
CLI del panel le asigna la 221; si ya la usa otro connector, elija otra libre entre 192 y 221 y use la misma en el
perfil.

DNS Filter actúa sobre las consultas DNS que pasan por el FortiGate: las de los equipos que lo usan como servidor DNS
o las que atraviesan una política con el perfil. Un equipo que resuelve por otro camino (DNS sobre HTTPS del
navegador, un resolver que no pasa por el FortiGate) no se bloquea así.

## 5. Comprobar

1. Desde un equipo detrás del FortiGate, abra chatgpt.com. En uno o dos minutos el equipo aparece en
   **Inventario → Fuentes de red**, con las llamadas, los proveedores y, si el FortiGate lo conoce, el usuario.

   ![Fuentes de red con el equipo detectado por el FortiGate](/img/fortinet/console-network-sources.png)

   En el detalle de la fuente (**Acciones → Ver detalles**), **Conectores** dice `fortinet-fortigate` y
   **Aplicación en el gateway** ofrece bloquear por el feed de firewalls.

   ![Detalle de la fuente con el conector Fortinet](/img/fortinet/console-source-detail.png)

2. En la fila del equipo, abra **Acciones** y elija **Bloquear**.

   ![Menú de acciones de la fuente](/img/fortinet/console-block-menu.png)

3. Marque los dominios (por ejemplo `chatgpt.com` y `api.openai.com`), elija la duración (de 30 minutos a **Hasta
   liberar**) y escriba el motivo. **Aplicado vía** tiene que decir **Feed de bloqueo para firewalls**.

   ![Diálogo de bloqueo con el feed de firewalls como destino](/img/fortinet/console-block-dialog.png)

4. En el próximo refresco del connector, desde el equipo, `nslookup chatgpt.com` devuelve 208.91.112.55, la IP del
   portal de bloqueo de FortiGuard, y el navegador no llega. En **Log & Report → Security Events → DNS Query**, la
   respuesta de `chatgpt.com` tiene **Action** `redirect`.

   ![Log de DNS Query con la respuesta redirigida](/img/fortinet/fortigate-dns-log-redirect.png)

5. Ese log vuelve a SecureAI. En el detalle de la fuente, **Aplicación en el gateway** pasa a **Bloqueo confirmado**
   y cuenta las consultas que el FortiGate bloqueó desde que creó el bloqueo.

   ![Bloqueo confirmado en el detalle de la fuente](/img/fortinet/console-block-confirmed.png)

6. Para levantarlo, elija **Acciones → Liberar** en la fila. SecureAI saca los dominios del feed y el FortiGate los
   vuelve a resolver en su próximo refresco.

   ![Menú de acciones con Liberar](/img/fortinet/console-release-menu.png)

## Bloqueo automático

En **Respuesta y auto-bloqueo**, arriba de la lista de Fuentes de red, active **Auto-bloquear fuentes que superen
el umbral** y elija el umbral de llamadas (por día o por 7 días), cuánto dura el bloqueo y cuántos bloqueos
automáticos puede haber a la vez. Cuando una fuente pasa el umbral, SecureAI pone sus dominios de IA en el feed y
los saca al vencer. Guardar estos ajustes pide el segundo factor.

![Respuesta y auto-bloqueo con el umbral](/img/fortinet/console-auto-block.png)

## Límites

- **Sin inspección TLS, el FortiGate ve el nombre del destino y no el contenido.** SecureAI sabe que alguien usó
  ChatGPT, desde qué equipo y cuántas veces; no qué escribió.
- **El connector usa `https://`.** Con `http://` el token del feed viaja en claro.
- **Deshabilitar o borrar el feed no desbloquea nada.** El FortiGate se queda con la última lista que descargó.
  Para desbloquear, use **Liberar** o saque la categoría del perfil de DNS Filter.
- **El bloqueo alcanza a toda la red detrás del FortiGate**, no a un usuario ni a una IP: el feed es una lista de
  dominios.
- **Si su tenant tiene además Cisco Umbrella o el bloqueo de Cloudflare Gateway, los bloqueos van ahí y no al
  feed.** Para mandarlos al FortiGate, pida a soporte que fije el destino de bloqueo en el feed.
- **Los contadores son aproximados.** FortiOS registra una misma sesión en el log de seguridad y en el de tráfico.
  SecureAI la cuenta una vez, salvo que el servicio se reinicie en el medio.
- Si SecureAI no puede armar la lista, responde con un error y el FortiGate conserva la anterior. Nunca recibe una
  lista vacía por un error.

## Versiones probadas

| FortiOS | Equipo | Resultado |
|---|---|---|
| 7.6.8 | FortiGate-VM, en laboratorio | Alta desde la consola, descubrimiento por DNS Filter y Application Control, bloqueo manual y automático por el feed, bloqueo confirmado y liberación |

Todavía no la probamos en FortiOS 7.2 ni 7.4, ni en equipos físicos. Los pasos usan objetos que existen en las tres
versiones; los nombres de los menús de la GUI pueden cambiar.
