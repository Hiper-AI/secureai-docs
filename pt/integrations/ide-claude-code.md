---
id: ide-claude-code
title: "Integração com Claude Code"
sidebar_label: "Claude Code"
description: "Use Claude Code com SecureAI — aplicação completa de SMLTP, DLP e PII para desenvolvimento assistido por IA"
---

# Claude Code - Integração IDE

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) é o assistente de codificação agente da Anthropic. Ao apontá-lo para o proxy compatível com Anthropic da SecureAI, cada prompt enviado por seus desenvolvedores passa por **SMLTP, DLP, verificação de PII, Prompt Shield, limitação de taxa e governança de modelo** — sem quaisquer alterações no fluxo de trabalho do desenvolvedor.

---

##Como funciona

SecureAI expõe um endpoint compatível com API de mensagens antrópicas em:

```
https://<your-host>/api/claude-code
```

Claude Code suporta nativamente o redirecionamento de todo o tráfego para um URL base personalizado por meio da variável de ambiente `ANTHROPIC_BASE_URL`. Quando configurado, ele comunica seu protocolo Antrópico nativo diretamente ao SecureAI – sem necessidade de proxy local ou script wrapper.

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

Todas as atividades aparecem no painel de administração do SecureAI em **AI Gateway → Logs de auditoria**, atribuídas à chave de API do desenvolvedor.

---

## Passo 1 — Instale o Claude Code


<Tabs>
  <Tab title="macOS/Linux/WSL">

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

## Etapa 2 — Gere uma chave de API

1. Vá para **Admin → Chaves de API** (`https://<your-host>/admin/apis`)
2. Clique em **Criar chave de API**
3. Defina um nome (por exemplo, `claude-code-dev-jane`)
4. Configurar:
   - **Modelos permitidos** — selecione quais LLMs a chave pode usar (consulte [modelos disponíveis](#modelos disponíveis))
   - **SMLTP política** — selecione a política de conformidade (`internal`, `confidential`, `hipaa`, etc.)
   - **Limites de taxas** conforme necessário
5. Copie o valor `sk-…` — ele é mostrado apenas uma vez

---

## Etapa 3 — Configurar o Claude Code

A abordagem recomendada é adicionar as configurações ao **arquivo de configurações locais em nível de projeto** (`.claude/settings.local.json`), que é ignorado pelo git por padrão.

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
`ANTHROPIC_API_KEY` deve ser **definido explicitamente como uma string vazia** para evitar que Claude Code tente se autenticar diretamente com o Anthropic.
</Warning>

<Tip>
**Perfil Shell (alternativa)**

Você também pode adicionar as variáveis ​​a `~/.zshrc`, `~/.bashrc` ou seu PowerShell `$PROFILE` em vez do arquivo de configurações. O arquivo de configurações é preferido para projetos de equipe para que cada desenvolvedor herde a mesma configuração automaticamente.
</Tip>

---

## Passo 4 — Verifique a conexão

Inicie o Claude Code no diretório do seu projeto:

```bash
cd /path/to/your/project
claude
```

Execute `/status` dentro da sessão. Você deveria ver:

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

Isso confirma que todo o tráfego está sendo roteado através do SecureAI.

---

## Modelos disponíveis

SecureAI expõe o mesmo catálogo de modelos disponível na interface de chat. Use qualquer valor `id` da tabela abaixo nos env vars acima.

### Antrópico (Claude)
| ID do modelo | Nome de exibição |
|---|---|
| `anthropic/claude-sonnet-4.6` | Soneto de Claude 4.6 |
| `anthropic/claude-opus-4.6` | Cláudio Opus 4.6 |

### OpenAI
| ID do modelo | Nome de exibição |
|---|---|
| `openai/gpt-5-mini` | GPT-5Mini |
| `openai/gpt-5.1-codex` | GPT-5.1-Codex |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-Codex |

### Google (Gêmeos)
| ID do modelo | Nome de exibição |
|---|---|
| `google/gemini-3-flash-preview` | Prévia do Flash do Gêmeos 3 |
| `google/gemini-3.1-pro-preview` | Pré-visualização do Gemini 3.1 Pro |

### Meta (Lhama)
| ID do modelo | Nome de exibição |
|---|---|
| `meta-llama/llama-4-maverick` | Lhama 4 Maverick |
| `meta-llama/llama-4-scout` | Lhama 4 Batedor |
| `meta-llama/llama-3.3-70b-instruct` | Lhama 3.3 70B Instruir |

###Mistral
| ID do modelo | Nome de exibição |
|---|---|
| `mistralai/mistral-large-2512` | Mistral Grande 3 2512 |
| `mistralai/ministral-14b-2512` | Ministério 14B 2512 |
| `mistralai/mistral-nemo` | Mistral Nemo |
| `mistralai/mistral-7b-instruct` | Instrução Mistral 7B |

### DeepSeek
| ID do modelo | Nome de exibição |
|---|---|
| `deepseek/deepseek-r1-0528` | DeepSeek R1 0528 |
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 |

### xAI (Groque)
| ID do modelo | Nome de exibição |
|---|---|
| `x-ai/grok-4` | Grok 4 |
| `x-ai/grok-code-fast-1` | Código Grok Rápido 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 Rápido |

###Qwen
| ID do modelo | Nome de exibição |
|---|---|
| `qwen/qwen3-coder` | Codificador Qwen3 |
| `qwen/qwen3-coder-next` | Codificador Qwen3 Próximo |
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### Auto-hospedado (endpoints remotos SMLTP)

Modelos auto-hospedados registrados como endpoints remotos ativos SMLTP ficam automaticamente disponíveis. Seus IDs seguem o padrão `self-hosted/<model-name>`. Execute `/status` no Claude Code ou ligue para `GET /api/claude-code/v1/models` para ver a lista ao vivo.

---

## Funções do modelo do Claude Code

Claude Code usa diferentes modelos para diferentes tarefas internas. Mapeie cada função para qualquer modelo do catálogo acima:

| Variável de ambiente | Função | Recomendado |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Raciocínio complexo, principal ciclo de agência | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Tarefas gerais de codificação | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Conclusões rápidas, chamadas de ferramentas | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Tarefas de subagente geradas | `anthropic/claude-sonnet-4.6` |

Você pode misturar provedores livremente. Por exemplo, use Gemini para subtarefas rápidas/baratas e Claude para o ciclo de raciocínio principal:

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## Aplicação de segurança

Cada solicitação por meio do proxy está sujeita à pilha de segurança SecureAI completa:

| Camada | O que faz |
|---|---|
| **SMLTP** | Anexa ID de pacote, hash de política, ID de rastreamento e aplicação de saída a cada chamada |
| **DLP** | Verifica solicitações de padrões de perda de dados (segredos, credenciais, documentos confidenciais) |
| **PII** | Detecta e edita informações de identificação pessoal; níveis graduados de aplicação |
| **Escudo de alerta** | Detecta tentativas de injeção imediata |
| **Modelo de governança** | Aplica modelos permitidos, listas de permissões de provedores e regras de residência |
| **Limite de taxa** | Limites por chave e por usuário aplicados via Redis |
| **Registros de auditoria** | Trilha de auditoria completa por solicitação em **AI Gateway → Registros de auditoria** |

A política SMLTP é herdada da configuração da chave de API. Para alterar a política de uma chave, vá para **Admin → Chaves de API**, edite a chave e selecione uma política **SMLTP diferente**.

---

## Solução de problemas

### `/status` ainda mostra `api.anthropic.com`

Claude Code armazenou em cache as credenciais de um login anterior. Execute `/logout` dentro de uma sessão do Claude Code e reinicie:

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- Verifique se a chave `sk-…` está ativa em **Admin → API Keys**
- Verifique se `ANTHROPIC_API_KEY` está definido como uma string vazia (`""`)

### Modelo não disponível

- Verifique a lista **Modelos permitidos** da chave de API em **Admin → Chaves de API**
- Ligue para `GET /api/claude-code/v1/models` (com seu token `Bearer sk-…`) para ver exatamente o que a chave pode acessar

### DLP / Bloco PII

Se um prompt for bloqueado, Claude Code receberá uma resposta de erro com uma mensagem explicando a violação. O incidente é registrado em **Admin → Incidentes** e visível em **AI Gateway → Registros de auditoria**.