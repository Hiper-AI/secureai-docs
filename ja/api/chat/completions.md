---
sidebar_position: 1
title: "チャットの完了"
openapi: "POST /chat/completions"
---
# チャットの完了

オプションのナレッジ ベース取得 (RAG)、モデルの冗長性/フェイルオーバー、通話ごとのセキュリティ ポリシー、ストリーミングを備えた AI チャット完了のメイン エンドポイント。

## エンドポイント

```
POST /chat/completions
```

## 説明

オプションのナレッジ ベース取得 (RAG) を備えた AI チャット完了のメイン エンドポイント。以下をサポートします。

- **2 つの入力形式** - 単一の `prompt` 文字列 (レガシー) **または** OpenAI スタイルの `messages` 配列。
- **モデルの冗長性** — 呼び出し元定義のフェイルオーバー チェーン (プライマリ + 最大 2 つのフォールバック)。 「冗長性とフェイルオーバー」(/ja/ja/api/redundancy) を参照してください。
- **通話ごとのセキュリティ** - SMLTP ポリシーの選択とインライン プロンプト シールドのオーバーライド。
- **ストリーミング** — サーバー送信イベント (SSE)。
- **署名済み受領書** — ゲートウェイを介してルーティングされた応答に関する SMLTP 準拠の受領書参照。

<Tip>
**OpenAI SDK の互換性**

**コード変更なし**で SecureAI を既存の OpenAI 統合にドロップしたい場合は、代わりに `/api/external/v1/chat/completions` の [OpenAI 互換エンドポイント](/ja/en/api/chat/openai-compatibility) を使用してください。このクラシック エンドポイントは、RAG をサポートする唯一のエンドポイントです。
</Tip>

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## ヘッダー

|ヘッダー |必須 |説明 |
|----------|----------|---------------|
| `Authorization` |はい | `Bearer sk-...` |
| `Content-Type` |はい | `application/json` |
| `Idempotency-Key` |いいえ |完了 POST を安全に再試行できるようにする一意のキー。同じキーを使用してリクエストを繰り返すと、2 回請求されるのではなく、元の結果が返されます。 |

## リクエスト本文

### 入力パラメータ

**`prompt` **または** `messages` の両方を指定することはできません。

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `prompt` |文字列 |条件付き |ユーザーのメッセージ (従来の 1 ターン フォーム)。 |
| `messages` |配列 |条件付き | `{ role, content }` の OpenAI スタイルの配列。 `role` は `system`、`user`、または `assistant` です。 `system` メッセージは最大 1 つ、最初のエントリとしてのみ。最大 100 メッセージ、合計コンテンツ 256 KB。 |
| `system_message` |文字列 |いいえ |カスタム システム プロンプト (レガシー)。 `messages` の帯域内 `system` ロールと組み合わせることはできません。 |

### モデルと冗長パラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `model` |文字列 |条件付き | AI モデル (例: `"openai/gpt-5-nano"`)。 `models` が指定されていない場合は必須です。 |
| `models` |配列 |いいえ |明示的なフェイルオーバー チェーン (`model` をオーバーライドします)。最大 3 つの異なるエントリ。各エントリはモデル文字列または `{ model, timeout_ms, first_token_timeout_ms }` です。 |
| `fallback_models` |配列 |いいえ |フォールバックは `model` の後に追加されます。 `models`との併用はできません。 |
| `redundancy` |オブジェクト |いいえ |チェーン全体のオプション: `{ timeout_ms, first_token_timeout_ms, on: [...] }`。 「冗長性とフェイルオーバー」(/ja/ja/api/redundancy) を参照してください。 |

### パラメータの取得と生成

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `index` |文字列 | **はい** |クエリするナレッジベース名。 RAG を使用しない直接 AI には `"Zero-Knowledge"` を使用します。このフィールドは必須です。`index` のないリクエストは `400 "Index required"` を返します。 |
| `use_rag` |ブール値 |いいえ |ナレッジの検索を有効にします (デフォルト: `true`)。 `use_rag: false` を設定しても、`index` 要件が免除されるわけではありません。つまり、`index: "Zero-Knowledge"` が送信されます。 |
| `smltp_policy` |文字列 |いいえ |セキュリティ ポリシー (`"internal"`、`"public"`、`"confidential"`、またはテナント カスタム ポリシー)。 |
| `prompt_shield` |オブジェクト |いいえ |通話ごとのプロンプト シールド コントロール: `{ enabled?: boolean, policy?: string }`。 [プロンプト シールド API](/ja/en/api/threat-defense/prompt-shield#per-call-control-on-completions) を参照してください。 |
| `temperature` |番号 |いいえ |ランダムネス制御 (0 ～ 2、デフォルト: 0.7)。 |
| `max_tokens` |整数 |いいえ |最大応答トークン (デフォルト: 1000、上限は 4000)。 |
| `stream` |ブール値 |いいえ |応答を SSE としてストリーミングします (デフォルト: `false`)。 |
| `conversation_id` |文字列 |いいえ |追跡用のオプションの会話 ID。 |
| `user_id` |文字列 |いいえ |このリクエストの請求先となるユーザーの MongoDB ObjectId (管理者ゲート。[請求モード](/ja/en/api/billing-modes) を参照)。 |

## リクエストの例

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-4821-summary" \
  -d '{
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "What is the company policy on remote work?" }
    ],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "redundancy": { "timeout_ms": 30000, "on": ["timeout", "server_error", "rate_limit"] },
    "index": "Zero-Knowledge",
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "id": "req-abc123",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the company's remote work policy..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350,
    "input_tokens": 150,
    "output_tokens": 200
  },
  "metadata": {
    "conversation_id": "conv-123",
    "index_used": "Zero-Knowledge",
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "served_model": "openai/gpt-5-nano",
    "requested_model": "openai/gpt-5-nano",
    "rag_enabled": true,
    "documents_retrieved": 0,
    "sources": []
  }
}
```

### メタデータ オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `conversation_id` |文字列 |会話 ID (エコーまたは生成)。 |
| `index_used` |文字列 |ナレッジベースが使用されます。 |
| `smltp_policy_used` |文字列 |適用された SMLTP ポリシー名。 |
| `smltp_policy_source` |文字列 |ポリシーの取得元 (`request`、キーのデフォルトなど)。 |
| `smltp_policy_hash` |文字列 \|ヌル |検証のために適用されたポリシーのハッシュ。 |
| `prompt_shield_policy` |オブジェクト \|ヌル |この通話に適用される Prompt Shield ポリシー (存在する場合)。 |
| `served_model` |文字列 |実際に答えを出したモデル。 |
| `requested_model` |文字列 |要求されたチェーンの最初のモデル。 |
| `failover` |オブジェクト | **マルチモデル チェーンが実行されている場合にのみ存在します。** `{ occurred, attempts[] }` — [冗長性とフェイルオーバー](/ja/en/api/redundancy) を参照してください。 |
| `smltp` |オブジェクト | SMLTP 資格が通話に対して作成されるときに存在します。 `{ bundle_id, receipt_url }`。 `bundle_id` (権利 ID、例: `jti-…`) は、ネイティブ/直接展開でも返されます。 `receipt_url` の署名付きレシートは、トラフィックが SMLTP ゲートウェイを介してルーティングされる場合にのみ取得できます (それ以外の場合、[Receipts](/ja/en/api/receipts) は `404` を返します)。 |
| `rag_enabled` |ブール値 | RAG が使用されたかどうか。 |
| `documents_retrieved` |整数 |取得されたドキュメントの数。 |
| `sources` |配列 |最大 3 つの文書ソースを取得 `{ source, score }`。 |

## ストリーミング

サーバー送信イベントを受信するには `"stream": true` を設定します。各 SSE 行は `data: <json>` で、ストリームは `data: [DONE]` で終わります。フレームは `type` フィールドを介して入力されます。

|フレーム `type` |ペイロード |
|--------------|----------|
| `metadata` |応答エンベロープ (`id`、`object`、`created`、`model` = サービング モデル、および上記の `metadata` オブジェクト)。最初に送信されました。 |
| `chunk` |増分デルタ: `{ id, object: "chat.completion.chunk", model, choices: [{ index, delta: { role, content }, finish_reason }] }`。 |
| `usage` |最終的なトークンの使用法。 |
| `error` |ストリームの途中でプロバイダーが中断されました (最初のトークンの後、フェイルオーバーは不可能になります)。 |

```text
data: {"type":"metadata","data":{"success":true,"id":"req-abc123","object":"chat.completion","created":1705312200,"model":"openai/gpt-5-nano","metadata":{...}}}

data: {"type":"chunk","data":{"id":"req-abc123","object":"chat.completion.chunk","model":"openai/gpt-5-nano","choices":[{"index":0,"delta":{"role":"assistant","content":"Based"},"finish_reason":null}]}}

data: {"type":"usage","data":{"usage":{"prompt_tokens":150,"completion_tokens":200,"total_tokens":350}}}

data: [DONE]
```

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid messages",
  "message": "a system message is only allowed as the first entry of messages"
}
```

### 401 不正

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Model, index, or policy not allowed"
}
```

### 429 / 502 — 冗長チェーンが枯渇しました

冗長チェーン内のすべてのモデルに障害が発生すると、応答で各試行が報告されます。すべての障害がレート制限であった場合、ステータスは `429`、それ以外の場合は `502` です。

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 2 model attempt(s) failed (last: anthropic/claude-sonnet-4 — server_error)",
  "request_id": "req-abc123",
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30012 },
    { "model": "anthropic/claude-sonnet-4", "status": "failed", "reason": "server_error", "latency_ms": 812 }
  ]
}
```

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 使用例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is the company policy on remote work?' }],
    model: 'openai/gpt-5-nano',
    fallback_models: ['anthropic/claude-sonnet-4'],
    smltp_policy: 'internal',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log('Served by:', data.metadata.served_model);
console.log('Response:', data.choices[0].message.content);
```

### パイソン

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "messages": [{"role": "user", "content": "What is the company policy on remote work?"}],
    "model": "openai/gpt-5-nano",
    "fallback_models": ["anthropic/claude-sonnet-4"],
    "smltp_policy": "internal",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("Served by:", result["metadata"]["served_model"])
print("Response:", result["choices"][0]["message"]["content"])
```

## 注意事項

- `index`は必須です。 RAG を使用しない直接 AI 応答の場合は `index: "Zero-Knowledge"` を送信します。
- `user_id` パラメーターは、リクエストを別のユーザー アカウント (管理者ゲート) に請求します。
- 温度は 0 ～ 2 に固定されます。 `max_tokens` の上限は 4000 です。
- モデルの呼び出しやポイントの消費を**せずに**、すべてのポリシーに対してリクエストを検証するには、[ポリシー チェック](/ja/ja/api/policy-check) を使用します。
- フェイルオーバー チェーンのセマンティクス (トリガー、タイムアウト、ストリーミング動作、枯渇ステータス コード) については、[冗長性とフェイルオーバー](/ja/ja/api/redundancy) を参照してください。