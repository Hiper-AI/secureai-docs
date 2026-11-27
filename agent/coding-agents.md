---
title: "Agentes de código: inventario, hooks y proxy MCP"
sidebarTitle: "Agentes de código"
description: "Reglas, skills y plugins de los agentes de código, hooks que alguien borra o edita, y el proxy MCP local que controla cada llamada a una herramienta"
---

Esta página cubre tres controles del agente sobre las herramientas de programación con IA (Claude Code, Cursor,
Codex, Gemini CLI, GitHub Copilot y otras):

- el **inventario** de reglas, skills, plugins y hooks de cada equipo;
- los **hooks** de SecureAI que alguien borra o edita, que el agente repone y reporta como manipulación;
- el **proxy MCP local**, que pasa cada llamada a una herramienta MCP por su política.

<Note>
Requiere una versión de SecureAI Agent posterior a la 1.3.5, en Windows.
</Note>

## Inventario de reglas, skills y plugins

### Qué recorre

| Tipo | Archivos |
|---|---|
| **Reglas** | En cada proyecto: `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/`, `.windsurfrules`, `.windsurf/rules/`, `.github/copilot-instructions.md` y `.github/instructions/`. En el perfil del usuario: `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md` y las reglas globales de Windsurf |
| **Skills** | Las de Claude Code, `~/.codex/skills/*/SKILL.md` y `.agents/skills/*/SKILL.md` |
| **Plugins** | Los plugins de Claude Code y las extensiones de Claude Desktop |
| **Hooks** | Los de Claude Code, Gemini CLI, Codex y GitHub Copilot |

El agente recorre los proyectos que el usuario abrió en Claude Code. Un repositorio que solo se abrió en otra
herramienta no entra.

### Dónde se ve

**Inventario → Dispositivos → Inventario agéntico**. El filtro **Regla** muestra los archivos de instrucciones, con la
herramienta, la versión y el inicio de su huella SHA-256. Dos archivos con el mismo nombre y distinto contenido
aparecen como dos artefactos.

### Qué se registra

- De las reglas, las skills de otras herramientas, los plugins y las extensiones: el nombre, la versión, la descripción
  (en una skill), la huella SHA-256, la ruta completa del archivo y el usuario de Windows. El texto no se sube.
- De los hooks: el comando, con los secretos enmascarados.
- Las skills y los subagentes de Claude Code ya subían su contenido antes de este cambio, y lo siguen subiendo.

### Cómo se gobierna

Las reglas se juzgan con la lista de **skills** de la política. Con la política en **block**, el agente pone en
cuarentena las skills y los subagentes que esa lista deniega: mueve el archivo fuera de la carpeta de la herramienta.
Las reglas, los plugins y los hooks se reportan, pero el agente no los mueve.

## Hooks borrados o editados

El agente instala hooks en las herramientas de programación para ver cada sesión. Si alguien borra o edita uno, el
agente lo repone en el siguiente refresco (cerca de 30 segundos) y reporta un intento de manipulación.

### Qué archivos vigila

Los que escribe el agente: el archivo de SecureAI en la configuración administrada de Claude Code, los hooks de máquina
de Cursor, GitHub Copilot CLI, Codex, Gemini CLI, Factory, Qwen, Augment y Kiro, y los archivos de usuario de Junie,
Devin y goose.

No vigila el `settings.json` del usuario de Claude Code, el hook de usuario de Antigravity ni la extensión de usuario de
Gemini.

### Cuándo reporta

Solo con **Trazas de agentes de código** encendido en la política. Reporta cuando el archivo cambió desde la última
escritura del agente y hubo que reescribirlo. Un cambio que el usuario hace alrededor del hook, sin tocarlo, no se
reporta. Como mucho manda un reporte por archivo cada 15 minutos.

### Qué se registra y qué ve el colaborador

El reporte lleva la herramienta, si el hook fue borrado o editado y la ruta del archivo. No lleva el contenido ni el
proceso que lo tocó: el agente no lo identifica. El colaborador no ve ningún aviso.

En la consola cuenta como manipulación en **Analíticas → Seguridad → Flota**. También dispara los
[canales de alerta](/agent/alerts-and-siem#canales-de-alerta) y sale al SIEM como `endpoint_agent_tamper`.

## Proxy MCP local

Con el proxy encendido, el agente reescribe la configuración de los clientes MCP para que cada servidor local arranque
detrás de él. Así cada llamada a una herramienta (`tools/call`) pasa por la política antes de llegar al servidor.

### Cómo se prende

**Inventario → Dispositivos → Políticas**, abra la política del grupo, paso **Gobernanza**, sección **Agentes de
código → Proxy MCP local**. Con el proxy encendido aparece **Revisar argumentos y resultados**, que pasa los
argumentos y la respuesta de cada llamada por el detector de secretos y el DLP. Los dos vienen apagados. Apagarlos pide
MFA reciente y queda en la auditoría.

### Qué clientes envuelve

Claude Desktop, Claude Code, Cursor, Windsurf, Cline, Roo, Kilo, VS Code, Gemini CLI, Zed y OpenCode.

No toca la configuración de Codex (TOML), de Continue (YAML) ni un archivo JSON con comentarios.

### Qué decide en cada llamada

- Un servidor que la lista de **MCPs** de la política deniega: se niega con la política en **block** y genera una alerta
  con la política en **monitor**.
- Una regla por herramienta (`behaviorGuard.toolRules`) en `block` o `require_approval`: se niega si la supervisión de
  comportamiento está encendida. `require_approval` niega con un mensaje que pide la aprobación de un administrador; no
  queda esperando una aprobación. Estas reglas se cargan por la API: la consola todavía no las muestra.
- Con **Revisar argumentos y resultados**: la llamada se niega si los argumentos o la respuesta tienen un secreto o datos
  que el DLP bloquea.

El cliente recibe un error que empieza con "SecureAI:". Si el archivo de configuración del proxy falta o no lo escribió
un administrador, el proxy niega toda llamada a herramientas y deja pasar el resto del protocolo.

### Secretos y vuelta atrás

El agente saca de la configuración las variables con secretos y las guarda cifradas con DPAPI. El original queda en
`%LOCALAPPDATA%\hiperai\secureai-agent\mcp-wrap`. Si apaga el proxy o desinstala el agente, el agente restaura la
configuración original con sus secretos.

Si el usuario saca el proxy de un servidor a mano, el agente lo vuelve a poner y reporta un **Intento de
manipulación** de severidad crítica.

### Qué se registra

En las trazas del agente, por cada llamada: el servidor, la herramienta, la decisión y el tamaño en bytes de los
argumentos y del resultado. No se registran los argumentos ni el resultado.

### Qué no cubre

- **Servidores MCP remotos.** El proxy solo envuelve servidores locales. Los remotos siguen yendo directo; el agente
  los anota en su log local.
- Los clientes y formatos de la lista anterior que el proxy no reescribe.

## Relacionado

- [Políticas y grupos](/agent/policies-and-groups)
- [IDE: Claude Code](/integrations/ide-claude-code)
- [Alertas y SIEM](/agent/alerts-and-siem)
