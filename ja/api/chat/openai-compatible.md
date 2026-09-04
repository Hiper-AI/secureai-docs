---
sidebar_position: 2
title: "OpenAI互換エンドポイント"
sidebar_label: "OpenAI対応"
description: "ドロップイン OpenAI Chat Completions サーフェス — OpenAI SDK を SecureAI に向けます"
openapi: "POST /v1/chat/completions"
---
# OpenAI 互換エンドポイント

SecureAI は OpenAI 互換サーフェスを公開しているため、**ベース URL と API キーのみを変更するだけで**、コードを変更することなく、任意の OpenAI SDK と統合できます。完全な SecureAI セキュリティ スタック (API キー認証、モデル/インデックス ホワイトリスト、SMLTP ポリシーの適用 + 資格、プロンプト シールド、PII/DLP、ポイント請求、[モデル冗長エンジン](/ja/api/redundancy)) がその下で実行されます。

## エンドポイント

```
POST /api/external/v1/chat/completions
GET  /api/external/v1/models
```

OpenAI クライアントの `base_url` を次のように指定します。

```
https://{customer.name}.hiperai.ai/api/external/v1
```

<Info>
**知識ゼロのみ**

このサーフェスは RAG/ナレッジ ベースをサポートしません**。リクエストは `Zero-Knowledge` に固定されます。ナレッジベースの取得が必要な場合は、従来の [Chat Completion](/ja/api/chat/completions) エンドポイントを使用してください。
</Info>

## 認証

```bash
Authorization: Bearer sk-your-api-key-here
```

## OpenAI SDK の使用

### Python (`openai`)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key-here",
    base_url="https://{customer.name}.hiperai.ai/api/external/v1",
)

resp = client.chat.completions.create(
    model="openai/gpt-5-nano",
    messages=[{"role": "user", "content": "Hello!"}],
    # SecureAI extensions travel via extra_body
    extra_body={
        "smltp_policy": "internal",
        "fallback_models": ["anthropic/claude-sonnet-4"],
    },
)
print(resp.choices[0].message.content)
print(resp.model_extra["secureai"]["served_model"])
```

### JavaScript (`openai`)

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-your-api-key-here',
  baseURL: 'https://{customer.name}.hiperai.ai/api/external/v1',
});

const resp = await client.chat.completions.create({
  model: 'openai/gpt-5-nano',
  messages: [{ role: 'user', content: 'Hello!' }],
  // @ts-expect-error — SecureAI extension fields
  smltp_policy: 'internal',
  fallback_models: ['anthropic/claude-sonnet-4'],
});
console.log(resp.choices[0].message.content);
```

## リクエスト本文

標準の OpenAI フィールドがサポートされています。 `messages` は必須です (この面には `prompt` はありません)。 `max_completion_tokens` は `max_tokens` のエイリアスとして受け入れられます。

次の OpenAI パラメータは、そのままプロバイダに渡されます。

`tools`、`tool_choice`、`parallel_tool_calls`、`response_format`、`stop`、`top_p`、`frequency_penalty`、`presence_penalty`、`seed`、`logprobs`、`top_logprobs`、 `user`。

### SecureAI 拡張フィールド

これらを追加の本文フィールドとして送信します (OpenAI SDK の `extra_body` 経由):

|フィールド |説明 |
|------|-----------|
| `smltp_policy` |この通話の SMLTP セキュリティ ポリシー。 |
| `prompt_shield` | `{ enabled?, policy? }` — 呼び出しごとのプロンプト シールド オーバーライド。 |
| `models` / `fallback_models` |モデル [冗長性](/ja/api/redundancy) チェーン。 |
| `redundancy` | `{ timeout_ms, first_token_timeout_ms, on[] }`。 |
| `user_id` |別のユーザーに請求します (管理者ゲート)。 |

## 応答

標準の OpenAI `chat.completion` シェイプに、`secureai` 拡張オブジェクトを追加しました。

```json
{
  "id": "chatcmpl-1a2b3c...",
  "object": "chat.completion",
  "created": 1705312200,
  "model": "anthropic/claude-sonnet-4",
  "choices": [
    { "index": 0, "message": { "role": "assistant", "content": "Hello!" }, "finish_reason": "stop" }
  ],
  "usage": { "prompt_tokens": 9, "completion_tokens": 3, "total_tokens": 12 },
  "secureai": {
    "served_model": "anthropic/claude-sonnet-4",
    "requested_model": "openai/gpt-5-nano",
    "failover": { "occurred": true, "attempts": [ ... ] },
    "smltp_policy_used": "internal",
    "smltp_policy_source": "request",
    "smltp_policy_hash": "a1b2c3...",
    "prompt_shield_policy": null,
    "smltp_bundle_id": "bnd_..."
  }
}
```

`secureai.smltp_bundle_id` (存在する場合) は、署名済みのコンプライアンス [領収書](/ja/api/receipts) と交換できます。

### ストリーミング

`stream: true`を設定します。フレームは、`data: [DONE]` で終了するネイティブ OpenAI `chat.completion.chunk` オブジェクトです。 `secureai` 拡張子は **最初** チャンクに付加されます。 `choices` (`tool_calls` デルタおよび `finish_reason` を含む) はそのまま通過します。

## エラー

このハンドラーからのエラーは OpenAI エンベロープを使用します。

```json
{ "error": { "message": "you must provide a model parameter", "type": "invalid_request_error", "code": null } }
```

冗長チェーン全体に障害が発生すると、エラーは `code: "all_models_failed"` およびステータス `429` (すべてのレート制限) または `502` (それ以外) を使用します。セキュリティミドルウェアの拒否により、SecureAI `{ "success": false, ... }` の形状が維持されます。どちらも常に `message` を持ちます。

## 関連

- [チャット補完](/ja/api/chat/completions) — クラシック サーフェス (RAG を追加)。
- [冗長性とフェイルオーバー](/ja/api/redundancy)
- [プロンプト シールド API](/ja/api/threat-defense/prompt-shield)