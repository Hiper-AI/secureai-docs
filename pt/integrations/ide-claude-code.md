---
id: ide-claude-code
title: "Claude Code"
sidebar_label: "Claude Code"
description: "Use Claude Code with SecureAI — full SMLTP, DLP, and PII enforcement for AI-assisted development"
---



# Claude Code — IDE Integration

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) is Anthropic's agentic coding assistant. By pointing it at SecureAI's Anthropic-compatible proxy, every prompt your developers send passes through **SMLTP, DLP, PII scanning, Prompt Shield, rate limiting, and model governance** — without any changes to the developer's workflow.

---

## How it works

SecureAI exposes an Anthropic Messages API-compatible endpoint at:

```
https://<your-host>/api/claude-code
```

Claude Code natively supports redirecting all traffic to a custom base URL via the `ANTHROPIC_BASE_URL` environment variable. When configured, it speaks its native Anthropic protocol directly to SecureAI — no local proxy or wrapper script required.

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

All activity appears in the SecureAI admin dashboard under **AI Gateway → Audit Logs**, attributed to the developer's API key.

---

## Step 1 — Install Claude Code


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

## Step 2 — Generate an API key

1. Go to **Admin → API Keys** (`https://<your-host>/admin/apis`)
2. Click **Create API Key**
3. Set a name (e.g. `claude-code-dev-jane`)
4. Configure:
   - **Allowed models** — select which LLMs the key can use (see [available models](#available-models))
   - **SMLTP policy** — select the compliance policy (`internal`, `confidential`, `hipaa`, etc.)
   - **Rate limits** as required
5. Copy the `sk-…` value — it is shown only once

---

## Step 3 — Configure Claude Code

The recommended approach is to add the settings to the **project-level local settings file** (`.claude/settings.local.json`), which is git-ignored by default.

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
`ANTHROPIC_API_KEY` must be **explicitly set to an empty string** to prevent Claude Code from trying to authenticate directly with Anthropic.
</Warning>

<Tip>
**Shell profile (alternative)**

You can also add the variables to `~/.zshrc`, `~/.bashrc`, or your PowerShell `$PROFILE` instead of the settings file. The settings file is preferred for team projects so every developer inherits the same configuration automatically.
</Tip>

---

## Step 4 — Verify the connection

Start Claude Code from your project directory:

```bash
cd /path/to/your/project
claude
```

Run `/status` inside the session. You should see:

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

That confirms all traffic is routing through SecureAI.

---

## Available models

SecureAI exposes the same model catalog available in the chat interface. Use any `id` value from the table below in the env vars above.

### Anthropic (Claude)
| Model ID | Display name |
|---|---|
| `anthropic/claude-sonnet-4.6` | Claude Sonnet 4.6 |
| `anthropic/claude-opus-4.6` | Claude Opus 4.6 |

### OpenAI
| Model ID | Display name |
|---|---|
| `openai/gpt-5-mini` | GPT-5 Mini |
| `openai/gpt-5.1-codex` | GPT-5.1-Codex |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-Codex |

### Google (Gemini)
| Model ID | Display name |
|---|---|
| `google/gemini-3-flash-preview` | Gemini 3 Flash Preview |
| `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro Preview |

### Meta (Llama)
| Model ID | Display name |
|---|---|
| `meta-llama/llama-4-maverick` | Llama 4 Maverick |
| `meta-llama/llama-4-scout` | Llama 4 Scout |
| `meta-llama/llama-3.3-70b-instruct` | Llama 3.3 70B Instruct |

### Mistral
| Model ID | Display name |
|---|---|
| `mistralai/mistral-large-2512` | Mistral Large 3 2512 |
| `mistralai/ministral-14b-2512` | Ministral 14B 2512 |
| `mistralai/mistral-nemo` | Mistral Nemo |
| `mistralai/mistral-7b-instruct` | Mistral 7B Instruct |

### DeepSeek
| Model ID | Display name |
|---|---|
| `deepseek/deepseek-r1-0528` | DeepSeek R1 0528 |
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 |

### xAI (Grok)
| Model ID | Display name |
|---|---|
| `x-ai/grok-4` | Grok 4 |
| `x-ai/grok-code-fast-1` | Grok Code Fast 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 Fast |

### Qwen
| Model ID | Display name |
|---|---|
| `qwen/qwen3-coder` | Qwen3-Coder |
| `qwen/qwen3-coder-next` | Qwen3 Coder Next |
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### Self-Hosted (Remote SMLTP Endpoints)

Self-hosted models registered as active remote SMLTP endpoints are automatically available. Their IDs follow the pattern `self-hosted/<model-name>`. Run `/status` in Claude Code or call `GET /api/claude-code/v1/models` to see the live list.

---

## Claude Code model roles

Claude Code uses different models for different internal tasks. Map each role to any model from the catalog above:

| Environment variable | Role | Recommended |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Complex reasoning, main agentic loop | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | General coding tasks | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Quick completions, tool calls | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Spawned sub-agent tasks | `anthropic/claude-sonnet-4.6` |

You can mix providers freely. For example, use Gemini for fast/cheap sub-tasks and Claude for the main reasoning loop:

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## Security enforcement

Every request through the proxy is subject to the full SecureAI security stack:

| Layer | What it does |
|---|---|
| **SMLTP** | Attaches bundle ID, policy hash, trace ID, and egress enforcement to every call |
| **DLP** | Scans prompts for data-loss patterns (secrets, credentials, confidential docs) |
| **PII** | Detects and redacts personally identifiable information; graduated enforcement tiers |
| **Prompt Shield** | Detects prompt injection attempts |
| **Model governance** | Enforces allowed models, provider allowlists, and residency rules |
| **Rate limiting** | Per-key and per-user limits enforced via Redis |
| **Audit logs** | Full per-request audit trail in **AI Gateway → Audit Logs** |

The SMLTP policy is inherited from the API key configuration. To change the policy for a key, go to **Admin → API Keys**, edit the key, and select a different **SMLTP Policy**.

---

## Troubleshooting

### `/status` still shows `api.anthropic.com`

Claude Code has cached credentials from a previous login. Run `/logout` inside a Claude Code session, then restart:

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- Verify the `sk-…` key is active in **Admin → API Keys**
- Check that `ANTHROPIC_API_KEY` is set to an empty string (`""`)

### Model not available

- Check the API key's **Allowed Models** list in **Admin → API Keys**
- Call `GET /api/claude-code/v1/models` (with your `Bearer sk-…` token) to see exactly what the key can access

### DLP / PII block

If a prompt is blocked, Claude Code will receive an error response with a message explaining the violation. The incident is logged in **Admin → Incidents** and visible in **AI Gateway → Audit Logs**.
