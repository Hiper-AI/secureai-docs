---
sidebar_position: 2
title: "Webhook イベント"
sidebar_label: "イベント"
description: "SecureAI Webhook イベント カタログ"
---
# Webhook イベント

[Webhook エンドポイント](/ja/api/webhooks/overview) を作成または更新するときは、それを 1 つ以上のイベント タイプにサブスクライブします。すべてのイベントを受信するには `"*"` を使用します。

## イベントカタログ

|イベント | | の場合に起動します。
|------|-----------|
| `*` |ワイルドカード — 以下の **すべて** イベントをサブスクライブします。 |
| `promptshield:attack:blocked` |プロンプト シールドは、プロンプト インジェクション/ジェイルブレイクの試みをブロックしました。 |
| `promptshield:attack:detected` |プロンプト シールドは、疑わしいプロンプトにフラグを立てました (検出されましたがブロックされていません)。 |
| `promptshield:canary:leaked` |カナリア トークンがモデル出力 (システム プロンプト/データ漏洩信号) で見つかりました。 |
| `dlp:incident` |データ損失防止ルールが一致しました。 |
| `pii:incident` | PII が検出/編集されました。 |
| `api:limit_reached` | API キーが日次/月次/レート制限に達しました。 |
| `api:model_failover` | [冗長性](/ja/api/redundancy) チェーンは、あるモデルから別のモデルにフェイルオーバーしました。 |

不明なイベント名のサブスクライブは、作成時または更新時に拒否されます。

## ペイロードエンベロープ

すべての配達は同じ封筒を共有します。 `data` オブジェクトはイベント固有です。

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "api:model_failover",
  "created": 1705312200,
  "data": {
    "failedModel": "openai/gpt-5-nano",
    "reason": "timeout",
    "nextModel": "anthropic/claude-sonnet-4",
    "latencyMs": 30011,
    "userId": "60a7c8f5e8b4f5001f7a8c23",
    "apiKeyId": "6512ab..."
  }
}
```

## テスト配信

**テスト イベントの送信** ボタン (または `POST /api/admin/webhooks/:id/test`) は `webhook:test` イベントを配信するため、ライブになる前に受信者と署名の検証を確認できます。

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## 関連

- [Webhook 概要](/ja/api/webhooks/overview) — 配信形式、署名検証、信頼性。