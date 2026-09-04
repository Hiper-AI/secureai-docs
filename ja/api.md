---
sidebar_position: 5
title: "APIリファレンス"
---
# APIリファレンス

SecureAI 外部 API は、知識ベースの取得、セキュリティ ポリシー、および包括的な使用状況追跡を備えた AI チャット完了機能を提供します。この API は、外部開発者と API キー認証を使用した統合向けに設計されています。

## 主な機能

- **RAG (検索拡張生成)**: 関連するコンテキストのナレッジ ベースを自動的に検索します。
- **マルチモデルのサポート**: OpenAI、Anthropic、Google、Meta、およびその他の AI モデル
- **モデルの冗長性とフェイルオーバー**: 試行ごとのタイムアウトを備えた呼び出し元定義のフェイルオーバー チェーン (プライマリ + フォールバック)
- **OpenAI 互換エンドポイント**: 任意の OpenAI SDK を `/api/external/v1` にポイントします — コードの変更はありません
- **画像生成**: Google Gemini 2.5 Flash イメージを使用して画像を生成および編集します
- **Speech-to-Speech (S2S)**: WebRTC で OpenAI Realtime API を使用したリアルタイム音声会話
- **セキュリティ ポリシー**: SMLTP ポリシーの適用、通話ごとのプロンプト シールド、および署名されたコンプライアンス受領書
- **Webhook**: セキュリティおよびプラットフォーム イベントの署名付きリアルタイム配信
- **使用状況追跡**: 包括的な使用状況の監視、セルフサービス クォータ、およびレート制限
- **ナレッジ ベースの統合**: 個人および共有ナレッジ ベースへのアクセス
- **ユーザー管理**: 完全なユーザー、グループ、および役割の管理機能
- **監査ログ**: 包括的なアクティビティおよびセキュリティ監査ログ

## 認証

すべてのエンドポイント (ヘルスチェックを除く) では、ベアラー トークンを使用した API キー認証が必要です。

```bash
Authorization: Bearer sk-your-api-key-here
```

## ベース URL

```
https://{customer.name}.hiperai.ai/api/external
```

OpenAI 互換サーフェスの場合は、SDK のベース URL を次のように指定します。

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## 請求と使用量

デフォルトでは、API リクエストは API キーを所有するユーザー アカウントに請求されます。リクエストに `user_id` パラメーターを含めることで、請求先の別のユーザーを指定できます。これにより、次のことが可能になります。

- ユーザーごとに課金されるマルチテナント アプリケーション
- 柔軟な完了制限管理
- ユーザーごとの「モデル別の使用状況」設定

## レート制限

- **デフォルト**: 1 分あたり 60 リクエスト、1 時間あたり 1000 リクエスト
- **1 日の制限**: 100 リクエスト (構成可能)
- **月間制限**: 10,000 リクエスト (構成可能)

## クイックスタート

### 1. ヘルスチェック

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. 利用可能なモデルを入手する

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. 利用可能なナレッジベースを入手する

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. チャット補完を作成する

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API エンドポイント

### システム
- [ヘルスチェック](/ja/api/system/health) - APIのステータスを確認します

### 発見
- [利用可能なモデルを取得](/ja/api/discovery/models) - 利用可能な AI モデルを一覧表示
- [利用可能なナレッジベースを取得](/ja/api/discovery/indexes) - アクセス可能なナレッジベースを一覧表示します
- [セキュリティ ポリシーの取得](/ja/api/discovery/smltp-policies) - 利用可能な SMLTP ポリシーの一覧を表示します。

### チャット
- [チャット完了](/ja/api/chat/completions) - RAG とのメイン AI チャット エンドポイント
- [OpenAI互換エンドポイント](/ja/api/chat/openai-compatibility) - OpenAI SDK用ドロップイン`/v1/chat/completions`
- [冗長性とフェイルオーバー](/ja/api/redundancy) - フェイルオーバーチェーンのモデル化
- [ポリシーチェック](/ja/api/policy-check) - モデルを呼び出さずにセキュリティパイプラインをドライランします
- [使用方法](/ja/api/usage) - セルフサービスの割り当て、予算、レート制限
- [Receipts](/ja/api/receipts) - 署名されたSMLTP準拠のレシートを取得します

### Webhook
- [Webhook概要](/ja/api/webhooks/overview) - 署名付きリアルタイムイベント配信
- [Webhook イベント](/ja/api/webhooks/events) - イベントカタログとペイロード

### 画像
- [画像の生成](/ja/api/images/generations) - テキストから画像を生成、または既存の画像を編集
- [画像編集](/ja/api/images/edits) - テキスト指示による画像間の編集

### スピーチ/S2S
- [S2S WebRTC セッションの開始](/ja/api/speech/webrtc) - リアルタイムの音声会話を確立します
- [S2S 時間ステータスの取得](/ja/api/speech/status) - S2S 時間割り当ての残りを確認する
- [S2S セッション期間をログに記録](/ja/api/speech/log-session) - セッション期間をログに記録し、時間を差し引く

### ユーザー管理
- [すべてのユーザーを取得](/ja/api/users/list) - ページネーションを使用してユーザーを取得
- [ユーザーの作成](/ja/api/users/create) - 新しいユーザーアカウントを作成します
- [ユーザーの更新](/ja/api/users/update) - 既存のユーザーを更新します
- [ライセンスの可用性を取得](/ja/api/billing-modes/licenses-availability) - ライセンスプールの制限と使用量を取得

### インデックス管理
- [すべてのインデックスを取得](/ja/api/indexes/list) - すべてのナレッジベースを取得します
- [インデックスの作成](/ja/api/indexes/create) - ナレッジベースの新規作成
- [インデックスの更新](/ja/api/indexes/update) - 既存のインデックスを更新します
- [ドキュメントでインデックスをトレーニング](/ja/api/indexes/train) - ドキュメントをアップロードしてインデックスをトレーニングします
- [文書のインデックス検索](/ja/api/indexes/search) - セマンティック検索を使用して文書を検索

### グループ経営
- [すべてのグループを取得](/ja/api/groups/list) - すべてのグループを取得します
- [グループの作成](/ja/api/groups/create) - 新規グループの作成
- [グループの更新](/ja/api/groups/update) - 既存のグループを更新します

### SMLTP セキュリティ
- [すべてのSMLTPポリシーを取得](/ja/api/smltp/policies) - すべてのセキュリティポリシーを一覧表示します
- [アクティブなポリシーを取得](/ja/api/smltp/active) - 現在のアクティブなポリシーを取得します
- [カスタムポリシーの作成](/ja/api/smltp/create) - カスタムSMLTPポリシーの作成
- [監査ログ](/ja/api/smltp/audit-logs) - SMLTP監査ログの取得

### 役割管理
- [すべてのロールを取得](/ja/api/roles/list) - すべてのロールを取得します
- [ロールの作成](/ja/api/roles/create) - 新しいカスタムロールを作成します

## エラー処理

### エラー応答フォーマット

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
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### 一般的な HTTP ステータス コード

|コード |説明 |
|------|---------------|
| `200` |成功 |
| `201` |正常に作成されました |
| `400` |不正なリクエスト - 無効なパラメータ |
| `401` |権限がありません - API キーが無効です |
| `403` |禁止 - 権限が不十分です |
| `404` |見つかりません |
| `409` |競合 - リソースはすでに存在します |
| `413` |ペイロードが大きすぎます - ファイル サイズが超過しました |
| `429` |レート制限を超えました |
| `500` |内部サーバーエラー |
| `503` |サービスが利用できません - サービスが設定されていません |

## SDK の例

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
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
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. 利用可能なモデルを入手する

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. 利用可能なナレッジベースを入手する

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. チャット補完を作成する

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API エンドポイント

### システム
- [ヘルスチェック](/ja/api/system/health) - APIのステータスを確認します

### 発見
- [利用可能なモデルを取得](/ja/api/discovery/models) - 利用可能な AI モデルを一覧表示
- [利用可能なナレッジベースを取得](/ja/api/discovery/indexes) - アクセス可能なナレッジベースを一覧表示します
- [セキュリティ ポリシーの取得](/ja/api/discovery/smltp-policies) - 利用可能な SMLTP ポリシーの一覧を表示します。

### チャット
- [チャット完了](/ja/api/chat/completions) - RAG とのメイン AI チャット エンドポイント
- [OpenAI互換エンドポイント](/ja/api/chat/openai-compatibility) - OpenAI SDK用ドロップイン`/v1/chat/completions`
- [冗長性とフェイルオーバー](/ja/api/redundancy) - フェイルオーバーチェーンのモデル化
- [ポリシーチェック](/ja/api/policy-check) - モデルを呼び出さずにセキュリティパイプラインをドライランします
- [使用方法](/ja/api/usage) - セルフサービスの割り当て、予算、レート制限
- [Receipts](/ja/api/receipts) - 署名されたSMLTP準拠のレシートを取得します

### Webhook
- [Webhook概要](/ja/api/webhooks/overview) - 署名付きリアルタイムイベント配信
- [Webhook イベント](/ja/api/webhooks/events) - イベントカタログとペイロード

### 画像
- [画像の生成](/ja/api/images/generations) - テキストから画像を生成、または既存の画像を編集
- [画像編集](/ja/api/images/edits) - テキスト指示による画像間の編集

### スピーチ/S2S
- [S2S WebRTC セッションの開始](/ja/api/speech/webrtc) - リアルタイムの音声会話を確立します
- [S2S 時間ステータスの取得](/ja/api/speech/status) - S2S 時間割り当ての残りを確認する
- [S2S セッション期間をログに記録](/ja/api/speech/log-session) - セッション期間をログに記録し、時間を差し引く

### ユーザー管理
- [すべてのユーザーを取得](/ja/api/users/list) - ページネーションを使用してユーザーを取得
- [ユーザーの作成](/ja/api/users/create) - 新しいユーザーアカウントを作成します
- [ユーザーの更新](/ja/api/users/update) - 既存のユーザーを更新します
- [ライセンスの可用性を取得](/ja/api/billing-modes/licenses-availability) - ライセンスプールの制限と使用量を取得

### インデックス管理
- [すべてのインデックスを取得](/ja/api/indexes/list) - すべてのナレッジベースを取得します
- [インデックスの作成](/ja/api/indexes/create) - ナレッジベースの新規作成
- [インデックスの更新](/ja/api/indexes/update) - 既存のインデックスを更新します
- [ドキュメントでインデックスをトレーニング](/ja/api/indexes/train) - ドキュメントをアップロードしてインデックスをトレーニングします
- [文書のインデックス検索](/ja/api/indexes/search) - セマンティック検索を使用して文書を検索

### グループ経営
- [すべてのグループを取得](/ja/api/groups/list) - すべてのグループを取得します
- [グループの作成](/ja/api/groups/create) - 新規グループの作成
- [グループの更新](/ja/api/groups/update) - 既存のグループを更新します

### SMLTP セキュリティ
- [すべてのSMLTPポリシーを取得](/ja/api/smltp/policies) - すべてのセキュリティポリシーを一覧表示します
- [アクティブなポリシーを取得](/ja/api/smltp/active) - 現在のアクティブなポリシーを取得します
- [カスタムポリシーの作成](/ja/api/smltp/create) - カスタムSMLTPポリシーの作成
- [監査ログ](/ja/api/smltp/audit-logs) - SMLTP監査ログの取得

### 役割管理
- [すべてのロールを取得](/ja/api/roles/list) - すべてのロールを取得します
- [ロールの作成](/ja/api/roles/create) - 新しいカスタムロールを作成します

## エラー処理

### エラー応答フォーマット

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
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### 一般的な HTTP ステータス コード

|コード |説明 |
|------|---------------|
| `200` |成功 |
| `201` |正常に作成されました |
| `400` |不正なリクエスト - 無効なパラメータ |
| `401` |権限がありません - API キーが無効です |
| `403` |禁止 - 権限が不十分です |
| `404` |見つかりません |
| `409` |競合 - リソースはすでに存在します |
| `413` |ペイロードが大きすぎます - ファイル サイズが超過しました |
| `429` |レート制限を超えました |
| `500` |内部サーバーエラー |
| `503` |サービスが利用できません - サービスが設定されていません |

## SDK の例

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
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
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## 次のステップ

- [ナレッジベースとRAG](/ja/indexes/overview) - ナレッジベースとRAGについて学びます
「」