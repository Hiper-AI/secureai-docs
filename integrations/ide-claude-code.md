---
id: ide-claude-code
title: "Integración con Claude Code"
sidebar_label: "Claude Code"
description: "Utilice Claude Code con SecureAI: aplicación completa de SMLTP, DLP y PII para el desarrollo asistido por IA"
---

# Claude Code: integración IDE

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) es el asistente de codificación agente de Anthropic. Al apuntar al proxy compatible con Anthropic de SecureAI, cada mensaje que envían sus desarrolladores pasa por **SMLTP, DLP, escaneo de PII, Prompt Shield, limitación de velocidad y gobernanza de modelos**, sin ningún cambio en el flujo de trabajo del desarrollador.

---

## Cómo funciona

SecureAI expone un endpoint compatible con la API de Anthropic Messages en:

```
https://<your-host>/api/claude-code
```

Claude Code admite de forma nativa la redirección de todo el tráfico a una URL base personalizada a través de la variable de entorno `ANTHROPIC_BASE_URL`. Cuando se configura, habla su protocolo Anthropic nativo directamente a SecureAI, sin necesidad de proxy local ni secuencia de comandos contenedora.

```
Developer machine
    │
    │  Anthropic Messages API (POST /v1/messages)
    ▼
SecureAI  (/api/claude-code)
    │
    ├── API key auth
    ├── SMLTP bundle + policy hash
    ├── DLP scan (input)
    ├── PII scan + graduated enforcement
    ├── Prompt Shield (injection detection)
    ├── Model governance & rate limiting
    │
    ▼
OpenRouter / Self-Hosted LLM
```

Toda la actividad aparece en el panel de administración de SecureAI en **AI Gateway → Audit Logs**, atribuida a la clave API del desarrollador.

---

## Paso 1: instalar el Claude Code


<Tabs>
  <Tab title="macOS/Linux/WSL">

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

  </Tab>
  <Tab title="WindowsPowerShell">

```powershell
irm https://claude.ai/install.ps1 | iex
```

  </Tab>
</Tabs>

---

## Paso 2: generar una clave API

1. Vaya a **Administrador → Claves API** (`https://<your-host>/admin/apis`)
2. Haga clic en **Crear clave API**
3. Establezca un nombre (por ejemplo, `claude-code-dev-jane`)
4. Configurar:
   - **Modelos permitidos**: seleccione qué LLM puede usar la clave (consulte [modelos disponibles](#modelos-disponibles))
   - **Política SMLTP**: seleccione la política de cumplimiento (`internal`, `confidential`, `hipaa`, etc.)
   - **Límites de tarifas** según sea necesario
5. Copie el valor `sk-…`; se muestra solo una vez

---

## Paso 3: configurar el Claude Code

El enfoque recomendado es agregar la configuración al **archivo de configuración local a nivel de proyecto** (`.claude/settings.local.json`), que git ignora de forma predeterminada.

```json title=".claude/settings.local.json"
{
  "env": {
    "ANTHROPIC_BASE_URL":  "https://<your-host>/api/claude-code",
    "ANTHROPIC_AUTH_TOKEN": "sk-<your-secureai-api-key>",
    "ANTHROPIC_API_KEY":   "",

    "ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
    "CLAUDE_CODE_SUBAGENT_MODEL":     "anthropic/claude-sonnet-4.6",

    "CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK": "1"
  }
}
```

<Warning>
`ANTHROPIC_API_KEY` debe **establecerse explícitamente en una cadena vacía** para evitar que Claude Code intente autenticarse directamente con Anthropic.
</Warning>

<Tip>
**Perfil de carcasa (alternativo)**

También puede agregar las variables a `~/.zshrc`, `~/.bashrc` o a su PowerShell `$PROFILE` en lugar del archivo de configuración. Se prefiere el archivo de configuración para proyectos de equipo, de modo que cada desarrollador herede la misma configuración automáticamente.
</Tip>

---

## Paso 4: verificar la conexión

Inicie Claude Code desde el directorio de su proyecto:

```bash
cd /path/to/your/project
claude
```

Ejecute `/status` dentro de la sesión. Deberías ver:

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

Eso confirma que todo el tráfico se dirige a través de SecureAI.

---

## Modelos disponibles

SecureAI expone el mismo catálogo de modelos disponible en la interfaz de chat. Utilice cualquier valor `id` de la siguiente tabla en las variables de entorno anteriores.

### Antrópico (Claude)
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `anthropic/claude-sonnet-4.6` | Claude Soneto 4.6 |
| `anthropic/claude-opus-4.6` | Claude Opus 4.6 |

### IA abierta
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `openai/gpt-5-mini` | GPT-5 Mini |
| `openai/gpt-5.1-codex` | Códice GPT-5.1 |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | Códice GPT-5.3 |

### Google (Géminis)
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `google/gemini-3-flash-preview` | Vista previa flash de Géminis 3 |
| `google/gemini-3.1-pro-preview` | Vista previa de Géminis 3.1 Pro |

### Meta (Llama)
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `meta-llama/llama-4-maverick` | Llama 4 Maverick |
| `meta-llama/llama-4-scout` | Llama 4 Explorador |
| `meta-llama/llama-3.3-70b-instruct` | Llama 3.3 70B Instrucción |

###Mistral
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `mistralai/mistral-large-2512` | Mistral Grande 3 2512 |
| `mistralai/ministral-14b-2512` | Ministral 14B 2512 |
| `mistralai/mistral-nemo` | Mistral Nemo |
| `mistralai/mistral-7b-instruct` | Instrucción Mistral 7B |

### Búsqueda profunda
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `deepseek/deepseek-r1-0528` | DeepSeek R1 0528 |
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 |

### xAI (Asimilar)
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `x-ai/grok-4` | Grok 4 |
| `x-ai/grok-code-fast-1` | Código Grok Rápido 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 Rápido |

### Qwen
| Identificación del modelo | Nombre para mostrar |
|---|---|
| `qwen/qwen3-coder` | Codificador Qwen3 |
| `qwen/qwen3-coder-next` | Codificador Qwen3 Siguiente |
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### Autohospedado (endpoints SMLTP remotos)

Los modelos autohospedados registrados como endpoints SMLTP remotos activos están disponibles automáticamente. Sus identificaciones siguen el patrón `self-hosted/<model-name>`. Ejecute `/status` en Claude Code o llame a `GET /api/claude-code/v1/models` para ver la lista en vivo.

---

## Roles modelo de Claude Code

Claude Code utiliza diferentes modelos para diferentes tareas internas. Asigne cada rol a cualquier modelo del catálogo anterior:

| Variable de entorno | Rol | Recomendado |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Razonamiento complejo, principal bucle agente | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Tareas generales de codificación | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Finalizaciones rápidas, llamadas de herramientas | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Tareas de subagente generadas | `anthropic/claude-sonnet-4.6` |

Puede mezclar proveedores libremente. Por ejemplo, utilice Gemini para subtareas rápidas/económicas y Claude para el bucle de razonamiento principal:

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## Aplicación de la seguridad

Cada solicitud a través del proxy está sujeta a la pila de seguridad completa de SecureAI:

| Capa | Qué hace |
|---|---|
| **SMLTP** | Adjunta ID de paquete, hash de políticas, ID de rastreo y cumplimiento de salida a cada llamada |
| **DLP** | Analiza mensajes en busca de patrones de pérdida de datos (secretos, credenciales, documentos confidenciales) |
| **PII** | Detecta y redacta información de identificación personal; niveles de cumplimiento graduados |
| **Escudo rápido** | Detecta intentos de inyección rápidos |
| **Gobernanza modelo** | Hace cumplir los modelos permitidos, las listas de proveedores permitidos y las reglas de residencia |
| **Limitación de tasa** | Límites por clave y por usuario aplicados a través de Redis |
| **Registros de auditoría** | Seguimiento de auditoría completo por solicitud en **AI Gateway → Registros de auditoría** |

La política SMLTP se hereda de la configuración de la clave API. Para cambiar la política de una clave, vaya a **Administrador → Claves API**, edite la clave y seleccione una **Política SMLTP** diferente.

---

## Solución de problemas

### `/status` todavía muestra `api.anthropic.com`

Claude Code tiene credenciales almacenadas en caché de un inicio de sesión anterior. Ejecute `/logout` dentro de una sesión de Claude Code, luego reinicie:

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- Verifique que la clave `sk-…` esté activa en **Admin → Claves API**
- Compruebe que `ANTHROPIC_API_KEY` esté configurado en una cadena vacía (`""`)

### Modelo no disponible

- Verifique la lista **Modelos permitidos** de la clave API en **Administrador → Claves API**
- Llame a `GET /api/claude-code/v1/models` (con su token `Bearer sk-…`) para ver exactamente a qué puede acceder la clave

### Bloqueo DLP/PII

Si se bloquea un mensaje, Claude Code recibirá una respuesta de error con un mensaje que explica la infracción. El incidente se registra en **Admin → Incidentes** y es visible en **AI Gateway → Registros de auditoría**.