---
title: "冗長性とフェイルオーバー"
sidebar_label: "冗長性とフェイルオーバー"
description: "SecureAI Completions API の呼び出し元定義モデル フェイルオーバー チェーン"
---
# 冗長性とフェイルオーバー

Completions API は、プロバイダー呼び出しが失敗したときに、あるモデルから別のモデルに自動的に**フェイルオーバー**できます。順序付けされたチェーン (プライマリ モデルと最大 2 つのフォールバック) を定義すると、SecureAI はいずれかが成功するまで順番にそれぞれを試行します。これにより、独自のコードに再試行ロジックを追加しなくても、プロバイダーの停止、レート制限、タイムアウトに対する回復力が得られます。

冗長性は、[クラシック `/chat/completions`](/ja/api/chat/completions) エンドポイントと [OpenAI 互換 `/v1/chat/completions`](/ja/api/chat/openai-completions) エンドポイントの両方で利用できます。

## チェーンの定義方法

チェーンをリクエストするには、優先順位に従って 3 つの方法があります。

| # |あなたが送信します |結果のチェーン |
|---|----------|------|
| 1 | `models: ["a", "b", "c"]` |まさにそのチェーンです (`model` をオーバーライドします)。 |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`。 |
| 3 | `model: "a"` 単独 | `a` が含まれている場合は、API キーの管理者設定 `failoverDefaults` を使用します (チェーンは `a` の位置から始まります)。それ以外の場合は 1 回の試行です。 |

チェーンには **最大 3 つの異なるモデル**を含めることができます。重複するエントリは折りたたまれます。各チェーン エントリは、プレーンなモデル文字列または試行ごとのタイムアウトを持つオブジェクトにすることができます。

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

同じリクエスト内で `models` と `fallback_models` を組み合わせることはできません。

## チェーン全体のオプション (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

|フィールド |範囲 |説明 |
|----------|----------|---------------|
| `timeout_ms` | 1000–300000 |試行ごとの全体的なタイムアウト。 |
| `first_token_timeout_ms` | 500–60000 |ストリーミングの場合: フェイルオーバーするまでに最初のコンテンツ トークンを待機する時間。 |
| `on` |以下のトリガーのサブセット |どの障害クラスがフェイルオーバーをトリガーするか。デフォルトは 4 つすべてです。 |

試行ごとのタイムアウト (`models[]` エントリ内で設定) は、その試行のチェーン全体の値をオーバーライドします。

## フェイルオーバートリガー

失敗した試行は、次のいずれかの理由に分類されます。フェイルオーバーは、理由が `on` リストに含まれており、** チェーン内に別のモデルが残っている場合にのみ発生します。

|理由 |原因 |
|------|------|
| `connection_error` |接続拒否/リセット、DNS/フェッチ失敗。 |
| `server_error` |プロバイダーが HTTP 5xx を返しました。 |
| `rate_limit` |プロバイダーが HTTP 429 を返しました。
| `timeout` |試行は `timeout_ms` (またはストリーミング中は `first_token_timeout_ms`) を超えました。 |

**再試行不可能**な障害 (意図的なゲートウェイ レート制限/トークン予算ブロック、オープン サーキット ブレーカー、ポリシー/検証の拒否など) がフェイルオーバーをトリガーすることはありません。フォールバックも同様に失敗するか、ブロックが意図的に行われます。

## ストリーミング動作

ストリーミング リクエストの場合、**フェイルオーバーは最初のコンテンツ トークンが到着する前にのみ可能です。** SecureAI は、最初のトークン (`first_token_timeout_ms` によって制限される) までアップストリーム ストリームをプルします。それが失敗した場合は、次のモデルにフェイルオーバーします。最初のトークンがクライアントに送信されると、サービス提供モデルはロックインされます。その後のストリーム途中の中断は、フェイルオーバーではなく `error` フレームとして表面化します。

## 得られるもの

マルチモデル チェーンが実行されると、応答には **フェイルオーバー レポート**が含まれます。

- クラシック エンドポイント: `metadata.failover`
- OpenAI 互換エンドポイント: `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` はどのモデルが実際に応答したかを示し、`requested_model` はチェーン内の最初のモデルです。単一モデル (レガシー) リクエストでは、フェイルオーバー レポートは生成されません。

## チェーン全体が失敗した場合

すべての試行が失敗した場合、リクエストはすべての試行をリストしたエラーを返します。

- **429** *すべての*失敗がレート制限だった場合。
- **502** それ以外の場合。

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

OpenAI 互換エンドポイントでは、同じ条件により `code: "all_models_failed"` の OpenAI エラー エンベロープが返されます。

## 管理者のデフォルト (`failoverDefaults`)

管理者はデフォルトのチェーンを API キーに添付できるため、呼び出し元はリクエストごとにチェーンを送信せずにフェイルオーバーを取得できます。 **[管理] → [API キー]** で構成すると、ペイロードが検証され、クランプされます。

- `models`: 最大 3 つの異なるモデル名。
- `timeout_ms`: 1000 ～ 300000。
- `first_token_timeout_ms`: 500 ～ 60000。
- `on`: 4 つのトリガーの任意のサブセット。

呼び出し元が `model: "a"` のみを送信し、`failoverDefaults.models` に `a` が存在する場合、チェーンは `a` の位置から開始され、残りのデフォルトまで継続します。

## セキュリティと試行ごとの課金

すべての試行は、SMLTP ラッパーを介した完全な独立した呼び出しです。ポリシーの適用、出力/常駐ガバナンス、および署名付き資格トークンのミントはすべて試行ごとに再実行され、その試行のモデルと正確な要求バイトにバインドされます。請求には、実際に応答を提供したモデルが反映されます。各フェイルオーバーは、`api:model_failover` セキュリティ イベント (サブスクライブされた [webhooks](/ja/api/webhooks/overview) に配信される) と監査ログ エントリも生成します。

## 関連

- [チャット補完](/ja/api/chat/completions)
- [OpenAI互換エンドポイント](/ja/api/chat/openai互換)
- [ポリシーチェック](/ja/api/policy-check) — ポイントを消費せずにチェーン全体のアクセスをプレビューします。
- [Webhooks](/ja/api/webhooks/overview) — `api:model_failover` をサブスクライブします。