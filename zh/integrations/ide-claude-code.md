---
id: ide-claude-code
title: "克劳德·科德"
sidebar_label: "克劳德·科德"
description: "将 Claude Code 与 SecureAI 结合使用 — 全面实施 SMLTP、DLP 和 PII，以实现 AI 辅助开发"
---
# Claude Code — IDE 集成

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) 是 Anthropic 的代理编码助手。通过将其指向 SecureAI 的 Anthropic 兼容代理，您的开发人员发送的每个提示都会通过 **SMLTP、DLP、PII 扫描、Prompt Shield、速率限制和模型治理** — 无需对开发人员的工作流程进行任何更改。

---

## 它是如何工作的

SecureAI 在以下位置公开了与 Anthropic Messages API 兼容的端点：

```
https://<your-host>/api/claude-code
```

Claude Code 本身支持通过 `ANTHROPIC_BASE_URL` 环境变量将所有流量重定向到自定义基本 URL。配置后，它会直接与 SecureAI 对话其本机 Anthropic 协议，无需本地代理或包装脚本。

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

所有活动都显示在 SecureAI 管理仪表板的 **AI Gateway → 审核日志** 下，归因于开发人员的 API 密钥。

---

## 步骤 1 — 安装 Claude Code


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

## 步骤 2 — 生成 API 密钥

1. 转到 **管理 → API 密钥** (`https://<your-host>/admin/apis`)
2. 点击**创建 API 密钥**
3. 设置名称（例如`claude-code-dev-jane`）
4. 配置：
   - **允许的模型** — 选择密钥可以使用哪些 LLM（请参阅[可用模型](#available-models)）
   - **SMLTP 策略** — 选择合规性策略（`internal`、`confidential`、`hipaa` 等）
   - **速率限制** 根据需要
5. 复制 `sk-…` 值 — 它仅显示一次

---

## 步骤 3 — 配置 Claude Code

推荐的方法是将设置添加到**项目级本地设置文件** (`.claude/settings.local.json`)，默认情况下该文件是 git 忽略的。

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
`ANTHROPIC_API_KEY` 必须**显式设置为空字符串**，以防止 Claude Code 尝试直接通过 Anthropic 进行身份验证。
</Warning>

<Tip>
**外壳轮廓（替代）**

您还可以将变量添加到 `~/.zshrc`、`~/.bashrc` 或 PowerShell `$PROFILE` 而不是设置文件。设置文件是团队项目的首选，因此每个开发人员都会自动继承相同的配置。
</Tip>

---

## 步骤 4 — 验证连接

从项目目录启动 Claude Code：

```bash
cd /path/to/your/project
claude
```

在会话内运行 `/status`。你应该看到：

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

这证实了所有流量都通过 SecureAI 路由。

---

## 可用型号

SecureAI 在聊天界面中公开了相同的模型目录。在上面的环境变量中使用下表中的任何 `id` 值。

### 人类（克劳德）
|型号 ID |显示名称 |
|---|---|
| `anthropic/claude-sonnet-4.6` |克劳德十四行诗 4.6 |
| `anthropic/claude-opus-4.6` |克劳德作品 4.6 |

### 开放人工智能
|型号 ID |显示名称 |
|---|---|
| `openai/gpt-5-mini` | GPT-5 迷你 |
| `openai/gpt-5.1-codex` | GPT-5.1-法典 |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-法典 |

### 谷歌（双子座）
|型号 ID |显示名称 |
|---|---|
| `google/gemini-3-flash-preview` | Gemini 3 Flash 预览 |
| `google/gemini-3.1-pro-preview` | Gemini 3.1 专业版预览 |

### 元（骆驼）
|型号 ID |显示名称 |
|---|---|
| `meta-llama/llama-4-maverick` |骆驼 4 特立独行 |
| `meta-llama/llama-4-scout` |骆驼 4 侦察兵 |
| `meta-llama/llama-3.3-70b-instruct` |骆驼 3.3 70B 指导 |

### 米斯特拉尔
|型号 ID |显示名称 |
|---|---|
| `mistralai/mistral-large-2512` |米斯特拉尔大 3 2512 |
| `mistralai/ministral-14b-2512` |部委 14B 2512 |
| `mistralai/mistral-nemo` |米斯特拉尔尼莫 |
| `mistralai/mistral-7b-instruct` |米斯特拉尔 7B 指导 |

### 深度搜索
|型号 ID |显示名称 |
|---|---|
| `deepseek/deepseek-r1-0528` | 0528 | 深度搜索 R1
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 |

### xAI (Grok)
|型号 ID |显示名称 |
|---|---|
| `x-ai/grok-4` |格洛克 4 |
| `x-ai/grok-code-fast-1` | Grok 代码快速 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 快速 |

### 奎文
|型号 ID |显示名称 |
|---|---|
| `qwen/qwen3-coder` | Qwen3-编码器 |
| `qwen/qwen3-coder-next` | Qwen3 编码器
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### 自托管（远程 SMLTP 端点）

注册为活动远程 SMLTP 端点的自托管模型自动可用。他们的 ID 遵循 `self-hosted/<model-name>` 模式。运行Claude Code中的`/status`或调用`GET /api/claude-code/v1/models`来查看实时列表。

---

## Claude Code 模型角色

Claude Code 针对不同的内部任务使用不同的模型。将每个角色映射到上面目录中的任何模型：

|环境变量 |角色 |推荐|
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` |复杂的推理，主要的代理循环 | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` |一般编码任务 | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` |快速完成、工具调用 | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` |生成的子代理任务 | `anthropic/claude-sonnet-4.6` |

您可以自由混合提供商。例如，使用 Gemini 执行快速/廉价的子任务，使用 Claude 执行主要推理循环：

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## 安全执行

通过代理的每个请求都受到完整的 SecureAI 安全堆栈的约束：

|层 |它有什么作用 |
|---|---|
| **SMLTP** |将捆绑 ID、策略哈希、跟踪 ID 和出口强制附加到每个调用 |
| **DLP** |扫描数据丢失模式的提示（秘密、凭据、机密文档）|
| **个人身份信息** |检测并编辑个人身份信息；分级执法等级|
| **提示盾** |检测提示注入尝试 |
| **模型治理** |强制执行允许的模型、提供商许可名单和驻留规则 |
| **速率限制** |通过 Redis 强制执行每键和每用户限制 |
| **审核日志** | **AI Gateway → 审计日志** | 中的完整每个请求审计跟踪

SMLTP 策略继承自 API 密钥配置。要更改密钥的策略，请转至 **管理 → API 密钥**，编辑密钥，然后选择不同的 **SMLTP 策略**。

---

## 故障排除

### `/status` 仍然显示 `api.anthropic.com`

Claude Code 已缓存上次登录的凭据。在 Claude Code 会话中运行 `/logout`，然后重新启动：

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- 验证 `sk-…` 密钥在 **管理 → API 密钥** 中处于活动状态
- 检查 `ANTHROPIC_API_KEY` 是否设置为空字符串 (`""`)

### 型号不可用

- 在 **管理 → API 密钥** 中检查 API 密钥的 **允许的模型** 列表
- 调用 `GET /api/claude-code/v1/models`（使用您的 `Bearer sk-…` 令牌）以查看密钥可以访问的内容

### DLP / PII 块

如果提示被阻止，Claude Code 将收到错误响应，其中包含解释违规的消息。该事件记录在**管理→事件**中，并在**AI Gateway→审核日志**中可见。