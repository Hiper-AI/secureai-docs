---
id: ide-claude-code
title: "クロード・コード"
sidebar_label: "クロード・コード"
description: "SecureAI で Claude Code を使用する — AI 支援開発のための完全な SMLTP、DLP、および PII の強制"
---
# クロード コード — IDE 統合

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) は、Anthropic のエージェント コーディング アシスタントです。 SecureAI の Anthropic 互換プロキシを指すことで、開発者が送信するすべてのプロンプトは、開発者のワークフローを変更することなく、**SMLTP、DLP、PII スキャン、プロンプト シールド、レート制限、モデル ガバナンス**を通過します。

---

## 仕組み

SecureAI は、Anthropic Messages API 互換のエンドポイントを次の場所で公開します。

```
https://<your-host>/api/claude-code
```

Claude Code は、`ANTHROPIC_BASE_URL` 環境変数を介してすべてのトラフィックをカスタム ベース URL にリダイレクトすることをネイティブにサポートしています。構成すると、ネイティブ Anthropic プロトコルを SecureAI に直接伝えます。ローカル プロキシやラッパー スクリプトは必要ありません。

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

すべてのアクティビティは、SecureAI 管理ダッシュボードの **AI Gateway → Audit Logs** の下に表示され、開発者の API キーに関連付けられます。

---

## ステップ 1 — クロード コードをインストールする


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

## ステップ 2 — API キーを生成する

1. **[管理] → [API キー]** (`https://<your-host>/admin/apis`) に移動します。
2. [**API キーの作成**] をクリックします。
3. 名前を設定します (例: `claude-code-dev-jane`)
4. 以下を設定します。
   - **許可されたモデル** — キーが使用できる LLM を選択します ([利用可能なモデル](#available-models) を参照)
   - **SMLTP ポリシー** — コンプライアンス ポリシー (`internal`、`confidential`、`hipaa` など) を選択します。
   - **レート制限** (必要に応じて)
5. `sk-…` 値をコピーします。これは 1 回だけ表示されます。

---

## ステップ 3 — クロード コードの構成

推奨されるアプローチは、**プロジェクト レベルのローカル設定ファイル** (`.claude/settings.local.json`) に設定を追加することです。これはデフォルトでは git 無視されます。

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
Claude Code が Anthropic で直接認証を試行しないようにするには、`ANTHROPIC_API_KEY` を **明示的に空の文字列**に設定する必要があります。
</Warning>

<Tip>
**シェル プロファイル (代替)**

設定ファイルの代わりに変数を `~/.zshrc`、`~/.bashrc`、または PowerShell `$PROFILE` に追加することもできます。設定ファイルはチーム プロジェクトに推奨されるため、すべての開発者が同じ構成を自動的に継承します。
</Tip>

---

## ステップ 4 — 接続を確認する

プロジェクト ディレクトリから Claude Code を開始します。

```bash
cd /path/to/your/project
claude
```

セッション内で `/status` を実行します。以下が表示されるはずです:

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

これにより、すべてのトラフィックが SecureAI を介してルーティングされていることを確認できます。

---

## 利用可能なモデル

SecureAI は、チャット インターフェイスで利用可能な同じモデル カタログを公開します。上記の環境変数には、以下の表の任意の `id` 値を使用します。

### 人間性 (クロード)
|モデルID |表示名 |
|---|---|
| `anthropic/claude-sonnet-4.6` |クロード・ソネット 4.6 |
| `anthropic/claude-opus-4.6` |クロード作品4.6 |

### OpenAI
|モデルID |表示名 |
|---|---|
| `openai/gpt-5-mini` | GPT-5ミニ |
| `openai/gpt-5.1-codex` | GPT-5.1-コーデックス |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-コーデックス |

### Google (双子座)
|モデルID |表示名 |
|---|---|
| `google/gemini-3-flash-preview` | Gemini 3 フラッシュ プレビュー |
| `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro プレビュー |

### メタ (ラマ)
|モデルID |表示名 |
|---|---|
| `meta-llama/llama-4-maverick` |ラマ 4 マーベリック |
| `meta-llama/llama-4-scout` |ラマ 4 スカウト |
| `meta-llama/llama-3.3-70b-instruct` |ラマ 3.3 70B 指示する |

### ミストラル
|モデルID |表示名 |
|---|---|
| `mistralai/mistral-large-2512` |ミストラル ラージ 3 2512 |
| `mistralai/ministral-14b-2512` |大臣 14B 2512 |
| `mistralai/mistral-nemo` |ミストラル・ニモ |
| `mistralai/mistral-7b-instruct` |ミストラル 7B 指示 |

### ディープシーク
|モデルID |表示名 |
|---|---|
| `deepseek/deepseek-r1-0528` |ディープシーク R1 0528 |
| `deepseek/deepseek-v3.2` |ディープシーク V3.2 |

### xAI (グロク)
|モデルID |表示名 |
|---|---|
| `x-ai/grok-4` |グロク4 |
| `x-ai/grok-code-fast-1` | Grok コード高速 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 高速 |

### クウェン
|モデルID |表示名 |
|---|---|
| `qwen/qwen3-coder` | Qwen3-コーダー |
| `qwen/qwen3-coder-next` | Qwen3 コーダー 次へ |
| `qwen/qwen3-235b-a22b-2507` |クウェン3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` |クウェン3.5 397B A17B |

### セルフホスト (リモート SMLTP エンドポイント)

アクティブなリモート SMLTP エンドポイントとして登録されたセルフホスト モデルは、自動的に使用可能になります。それらの ID は `self-hosted/<model-name>` のパターンに従います。クロード コードで `/status` を実行するか、`GET /api/claude-code/v1/models` を呼び出してライブ リストを確認します。

---

## クロード コード モデルの役割

Claude Code は、さまざまな内部タスクにさまざまなモデルを使用します。各ロールを上記のカタログの任意のモデルにマッピングします。

|環境変数 |役割 |おすすめ |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` |複雑な推論、メイン エージェント ループ | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` |一般的なコーディング タスク | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` |クイック完了、ツール呼び出し | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` |生成されたサブエージェント タスク | `anthropic/claude-sonnet-4.6` |

プロバイダーは自由に組み合わせることができます。たとえば、高速/安価なサブタスクには Gemini を使用し、メインの推論ループには Claude を使用します。

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## セキュリティの強制

プロキシを経由するすべてのリクエストは、完全な SecureAI セキュリティ スタックの対象となります。

|レイヤー |何をするのか |
|---|---|
| **SMTP** |バンドル ID、ポリシー ハッシュ、トレース ID、および出力強制をすべての呼び出しに付加します。
| **DLP** |データ損失パターン (秘密、資格情報、機密文書) のプロンプトをスキャンします。
| **個人情報** |個人を特定できる情報を検出して編集します。段階的な施行層 |
| **プロンプト シールド** |プロンプト インジェクション試行を検出します。
| **モデル ガバナンス** |許可されたモデル、プロバイダーの許可リスト、および常駐ルールを強制します。
| **レート制限** | Redis 経由でキーごとおよびユーザーごとに制限を適用 |
| **監査ログ** | **AI ゲートウェイ → 監査ログ** のリクエストごとの完全な監査証跡 |

SMLTP ポリシーは API キー設定から継承されます。キーのポリシーを変更するには、**[管理] → [API キー]** に移動し、キーを編集して、別の **SMLTP ポリシー**を選択します。

---

## トラブルシューティング

### `/status` にはまだ `api.anthropic.com` が表示されます

クロード コードには、以前のログインの認証情報がキャッシュされています。クロード コード セッション内で `/logout` を実行し、再起動します。

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- `sk-…` キーが **Admin → API Keys** でアクティブであることを確認します。
- `ANTHROPIC_API_KEY` が空の文字列 (`""`) に設定されていることを確認します。

### モデルがありません

- **[管理] → [API キー]** で API キーの **許可されたモデル** リストを確認します。
- `GET /api/claude-code/v1/models` (`Bearer sk-…` トークンを使用して) を呼び出して、キーがアクセスできるものを正確に確認します

### DLP / PII ブロック

プロンプトがブロックされると、Claude Code は違反を説明するメッセージを含むエラー応答を受け取ります。インシデントは **[管理] → [インシデント]** に記録され、**[AI ゲートウェイ] → [監査ログ]** に表示されます。