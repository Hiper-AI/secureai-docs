---
sidebar_position: 1
title: "認証の概要"
---
# API認証

SecureAI は、すべての外部 API アクセスに API キー認証を使用します。キーは管理者によって作成および構成されたベアラー トークンであり、モデル、ポリシー、制限、請求、セキュリティをキーごとに制御できます。

## 認証ヘッダー

```http
Authorization: Bearer sk-your-api-key-here
```

**API キーの形式:**
- `sk-` プレフィックスで始まります (例: `sk-8cd5253f...`)。
- プレフィックスの後には、64 文字の 16 進数のシークレットが続きます。
- キーの SHA-256 ハッシュのみがサーバー側に保存されます。完全なキーは作成時に **1 回**表示されます。紛失した場合は、キーをローテーション/再作成してください。

すべての API 呼び出しには HTTPS が必要です。

## API キーの作成と構成

管理者は、**[管理] → [API キー]** でキーを作成します (API ベース `/api/admin/api-keys`、管理者専用)。完全なキーは作成時に一度返されます。各キーには次の構成が含まれます。

### 所有権と請求

|設定 |説明 |
|----------|---------------|
| `name` |人間が判読できるラベル。 |
| `userId` |このキーが属する/請求の対象となるユーザー アカウント。 |
| `billingMode` | `user-completions` (ユーザーの完了手当から差し引く) または `usage-by-model` (モデルのコストによって予算を差し引く)。 [課金モード](/ja/api/billing-modes) を参照してください。 |

呼び出し元は、`user_id` 本体パラメーター (管理者ゲート) を使用して、**異なる** ユーザーに個別のリクエストを請求できます。

### 制限

|設定 |説明 |
|----------|---------------|
| `dailyLimit` |このキーの 1 日あたりの最大リクエスト。 |
| `monthlyLimit` |このキーの 1 か月あたりの最大リクエスト。 |
| `rateLimit.requestsPerMinute` | 1 分あたりの上限 (最大 1000)。 |
| `rateLimit.requestsPerHour` | 1 時間あたりの上限 (最大 10000)。 |
| `expiresAt` |オプションの有効期限。有効期限のないキーの場合は省略します。 |

### 許可リスト

|設定 |説明 |
|----------|---------------|
| `allowedModels[]` |設定されている場合、キーはこれらのモデル**のみ**を使用できます。空 = ライセンスのデフォルトのカタログ。 |
| `allowedIndexes[]` |キーがクエリできるナレッジ ベースを制限します。 |
| `allowedSMLTPPolicies[]` |キーが要求する可能性のある SMLTP ポリシー (デフォルト `["public", "internal"]`)。ポリシー リゾルバーに対して検証されるため、テナントのカスタム ポリシーが許可されます。 |

### プロンプトシールド

|設定 |説明 |
|----------|---------------|
| `enablePromptShield` |このキーのプロンプト シールドをオンにします。 |
| `promptShieldSensitivity` | `strict`、`balanced`、または `permissive`。 |
| `promptShieldPolicyId` |特定の Prompt Shield ポリシーをキーにバインドします。 |
| `allowedPromptShieldPolicies[]` |発信者が `prompt_shield.policy` を介して通話ごとに選択できるポリシー。 |

[プロンプト シールド API](/ja/api/threat-defense/prompt-shield) を参照してください。

### 冗長性のデフォルト

`failoverDefaults` は、デフォルト モデル [フェイルオーバー チェーン](/ja/api/redundancy) をキーに接続します: `models[]` (最大 3)、`timeout_ms` (1000 ～ 300000)、`first_token_timeout_ms` (500 ～ 60000)、および `on[]` トリガー。その後、呼び出し元はリクエストごとにチェーンを送信せずにフェイルオーバーを取得します。

## べき等性

補完 `POST` は `Idempotency-Key` ヘッダーを受け入れます。同じキーを使用して再試行すると、2 回目の請求ではなく元の結果が返されます。ネットワーク再試行を安全にするために使用します。 [チャット補完](/ja/api/chat/completions) を参照してください。

## レート制限

デフォルトの上限 (キーごとに設定可能):

- **1 分あたり**: 60 リクエスト
- **1 時間あたり**: 1000 リクエスト
- **毎日**: 100 件のリクエスト
- **毎月**: 10,000 リクエスト

キー所有者は、[`GET /usage`](/ja/api/usage) を介して独自のライブ クォータと制限を読み取ることができます。

## セキュリティ機能

- **HTTPS のみ** - すべての API 呼び出しには TLS が必要です。
- **保存時にハッシュ** — 各キーの SHA-256 ハッシュのみが保存されます。
- **使用状況の追跡と監査ログ** - すべての通話と認証イベントがログに記録されます。
- **SMLTP 準拠** - セキュリティ ポリシーはすべてのリクエストに適用されます。

## エラー応答

### 認証エラー

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### レート制限エラー

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## 一般的なエラー コード

|エラー |説明 |
|------|-----------|
| `Invalid API key` | API キーが無効、期限切れ、または取り消されています。 |
| `Rate limit exceeded: too many requests per minute` | 1 分あたりのレート制限を超えました。 |
| `Rate limit exceeded: too many requests per hour` |時間あたりのレート制限を超えました。 |
| `Access denied` |このキーにはモデル、インデックス、またはポリシーが許可されていません。 |

## 次のステップ

- [API リファレンス](/ja/api) — 利用可能なすべての外部エンドポイントを調べます。
- [チャット補完](/ja/api/chat/completions) — 補完の統合を開始します。
- [OpenAI互換エンドポイント](/ja/api/chat/openai-compatibility) — 既存のOpenAI SDKを再利用します。
- [使用法](/ja/api/usage) — クォータと制限を確認します。