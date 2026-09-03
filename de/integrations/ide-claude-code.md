---
id: ide-claude-code
title: "Claude Code"
sidebar_label: "Claude Code"
description: "Verwenden Sie Claude Code mit SecureAI – vollständige SMLTP-, DLP- und PII-Durchsetzung für KI-gestützte Entwicklung"
---
# Claude Code – IDE-Integration

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) ist der agentische Codierungsassistent von Anthropic. Indem es auf den Anthropic-kompatiblen Proxy von SecureAI verweist, durchläuft jede von Ihren Entwicklern gesendete Eingabeaufforderung **SMLTP, DLP, PII-Scanning, Prompt Shield, Ratenbegrenzung und Modell-Governance** – ohne Änderungen am Arbeitsablauf des Entwicklers.

---

## Wie es funktioniert

SecureAI stellt einen mit der Anthropic Messages API kompatiblen Endpunkt bereit unter:

```
https://<your-host>/api/claude-code
```

Claude Code unterstützt nativ die Umleitung des gesamten Datenverkehrs zu einer benutzerdefinierten Basis-URL über die Umgebungsvariable `ANTHROPIC_BASE_URL`. Wenn es konfiguriert ist, übermittelt es sein natives Anthropic-Protokoll direkt an SecureAI – kein lokaler Proxy oder Wrapper-Skript erforderlich.

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

Alle Aktivitäten werden im SecureAI-Admin-Dashboard unter **AI Gateway → Audit-Protokolle** angezeigt und dem API-Schlüssel des Entwicklers zugeordnet.

---

## Schritt 1 – Claude Code installieren


<Tabs>
  <Tab title="macOS / Linux / WSL">

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

  </Tab>
  <Tab title="Windows PowerShell">

```powershell
irm https://claude.ai/install.ps1 | iex
```

  </Tab>
</Tabs>

---

## Schritt 2 – Generieren Sie einen API-Schlüssel

1. Gehen Sie zu **Admin → API-Schlüssel** (`https://<your-host>/admin/apis`)
2. Klicken Sie auf **API-Schlüssel erstellen**
3. Legen Sie einen Namen fest (z. B. `claude-code-dev-jane`)
4. Konfigurieren Sie:
   - **Zulässige Modelle** – wählen Sie aus, welche LLMs der Schlüssel verwenden kann (siehe [verfügbare Modelle](#available-models))
   - **SMLTP-Richtlinie** – Wählen Sie die Compliance-Richtlinie aus (`internal`, `confidential`, `hipaa` usw.)
   - **Ratenbegrenzungen** nach Bedarf
5. Kopieren Sie den Wert `sk-…` – er wird nur einmal angezeigt

---

## Schritt 3 – Claude Code konfigurieren

Der empfohlene Ansatz besteht darin, die Einstellungen zur **lokalen Einstellungsdatei auf Projektebene** (`.claude/settings.local.json`) hinzuzufügen, die standardmäßig von Git ignoriert wird.

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
`ANTHROPIC_API_KEY` muss **explizit auf eine leere Zeichenfolge gesetzt** sein, um zu verhindern, dass Claude Code versucht, sich direkt bei Anthropic zu authentifizieren.
</Warning>

<Tip>
**Schalenprofil (alternativ)**

Sie können die Variablen auch zu `~/.zshrc`, `~/.bashrc` oder Ihrer PowerShell `$PROFILE` anstelle der Einstellungsdatei hinzufügen. Die Einstellungsdatei wird für Teamprojekte bevorzugt, damit jeder Entwickler automatisch die gleiche Konfiguration erbt.
</Tip>

---

## Schritt 4 – Überprüfen Sie die Verbindung

Starten Sie Claude Code aus Ihrem Projektverzeichnis:

```bash
cd /path/to/your/project
claude
```

Führen Sie `/status` innerhalb der Sitzung aus. Sie sollten Folgendes sehen:

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

Dies bestätigt, dass der gesamte Datenverkehr über SecureAI geleitet wird.

---

## Verfügbare Modelle

SecureAI stellt denselben Modellkatalog zur Verfügung, der in der Chat-Schnittstelle verfügbar ist. Verwenden Sie einen beliebigen `id`-Wert aus der Tabelle unten in den Umgebungsvariablen oben.

### Anthropisch (Claude)
| Modell-ID | Anzeigename |
|---|---|
| `anthropic/claude-sonnet-4.6` | Claude Sonett 4.6 |
| `anthropic/claude-opus-4.6` | Claude Opus 4.6 |

### OpenAI
| Modell-ID | Anzeigename |
|---|---|
| `openai/gpt-5-mini` | GPT-5 Mini |
| `openai/gpt-5.1-codex` | GPT-5.1-Codex |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-Codex |

### Google (Zwillinge)
| Modell-ID | Anzeigename |
|---|---|
| `google/gemini-3-flash-preview` | Gemini 3 Flash-Vorschau |
| `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro-Vorschau |

### Meta (Lama)
| Modell-ID | Anzeigename |
|---|---|
| `meta-llama/llama-4-maverick` | Lama 4 Maverick |
| `meta-llama/llama-4-scout` | Lama 4 Scout |
| `meta-llama/llama-3.3-70b-instruct` | Lama 3.3 70B Instruct |

### Mistral
| Modell-ID | Anzeigename |
|---|---|
| `mistralai/mistral-large-2512` | Mistral Large 3 2512 |
| `mistralai/ministral-14b-2512` | Ministerial 14B 2512 |
| `mistralai/mistral-nemo` | Mistral Nemo |
| `mistralai/mistral-7b-instruct` | Mistral 7B Instruct |

### DeepSeek
| Modell-ID | Anzeigename |
|---|---|
| `deepseek/deepseek-r1-0528` | DeepSeek R1 0528 |
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 |

### xAI (Grok)
| Modell-ID | Anzeigename |
|---|---|
| `x-ai/grok-4` | Grok 4 |
| `x-ai/grok-code-fast-1` | Grok Code Fast 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 Schnell |

### Qwen
| Modell-ID | Anzeigename |
|---|---|
| `qwen/qwen3-coder` | Qwen3-Coder |
| `qwen/qwen3-coder-next` | Qwen3 Coder Weiter |
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### Selbstgehostet (Remote-SMLTP-Endpunkte)

Self-hosted models registered as active remote SMLTP endpoints are automatically available. Ihre IDs folgen dem Muster `self-hosted/<model-name>`. Run `/status` in Claude Code or call `GET /api/claude-code/v1/models` to see the live list.

---

## Claude Code-Modellrollen

Claude Code uses different models for different internal tasks. Map each role to any model from the catalog above:

| Umgebungsvariable | Rolle | Empfohlen |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Komplexe Argumentation, Hauptagentenschleife | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Allgemeine Codierungsaufgaben | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Schnelle Vervollständigungen, Werkzeugaufrufe | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Gespawnte Subagenten-Aufgaben | `anthropic/claude-sonnet-4.6` |

Sie können die Anbieter frei mischen. For example, use Gemini for fast/cheap sub-tasks and Claude for the main reasoning loop:

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## Sicherheitsdurchsetzung

Every request through the proxy is subject to the full SecureAI security stack:

| Schicht | Was es tut |
|---|---|
| **SMLTP** | Attaches bundle ID, policy hash, trace ID, and egress enforcement to every call |
| **DLP** | Scans prompts for data-loss patterns (secrets, credentials, confidential docs) |
| **PII** | Detects and redacts personally identifiable information; abgestufte Durchsetzungsstufen |
| **Prompter Schild** | Erkennt sofortige Injektionsversuche |
| **Modell-Governance** | Enforces allowed models, provider allowlists, and residency rules |
| **Ratenbegrenzung** | Über Redis | erzwungene Grenzwerte pro Schlüssel und pro Benutzer
| **Überwachungsprotokolle** | Full per-request audit trail in **AI Gateway → Audit Logs** |

The SMLTP policy is inherited from the API key configuration. To change the policy for a key, go to **Admin → API Keys**, edit the key, and select a different **SMLTP Policy**.

---

## Fehlerbehebung

### `/status` zeigt immer noch `api.anthropic.com`

Claude Code has cached credentials from a previous login. Run `/logout` inside a Claude Code session, then restart:

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- Verify the `sk-…` key is active in **Admin → API Keys**
- Check that `ANTHROPIC_API_KEY` is set to an empty string (`""`)

### Model not available

- Überprüfen Sie die Liste **Zulässige Modelle** des API-Schlüssels unter **Admin → API-Schlüssel**
- Rufen Sie `GET /api/claude-code/v1/models` (mit Ihrem `Bearer sk-…`-Token an, um genau zu erfahren, worauf der Schlüssel zugreifen kann

### DLP / PII block

Wenn eine Eingabeaufforderung blockiert ist, erhält Claude Code eine Fehlerantwort mit einer Meldung, in der der Verstoß erläutert wird. Der Vorfall wird unter **Admin → Vorfälle** protokolliert und ist unter **AI Gateway → Audit-Protokolle** sichtbar.