---
title: "使用量と割り当て"
sidebar_label: "使用法"
description: "API キーのセルフサービス ポイント、予算、およびレート制限のスナップショット"
openapi: "GET /usage"
---
# 使用量と割り当て量

呼び出し元の API キーの割り当てと使用状況 (請求対象ユーザーのポイント バケット、有効になっている場合のモデル別の使用量の予算、キー独自のリクエスト制限とレート制限) のセルフサービス スナップショットを返します。これは、管理パネルから読み取るデータと同じであり、キーホルダーに公開されます。

## エンドポイント

```
GET /usage
```

## 認証

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエストの例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/usage" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

```json
{
  "success": true,
  "points": {
    "remaining": 4188,
    "monthly_limit": 5000,
    "next_renewal": "2026-08-01T00:00:00.000Z"
  },
  "usage_by_model": {
    "enabled": true,
    "dollar_limit": 250,
    "current_spend": 61.4,
    "remaining_budget": 188.6
  },
  "api_key": {
    "name": "Production integration",
    "billing_mode": "user-completions",
    "daily": { "used": 120, "limit": 1000, "remaining": 880 },
    "monthly": { "used": 3400, "limit": 10000, "remaining": 6600 },
    "rate_limit": { "requests_per_minute": 60, "requests_per_hour": 1000 },
    "expires_at": null
  }
}
```

### フィールド

|フィールド |説明 |
|------|-----------|
| `points.remaining` |請求されたユーザーのバケットに残っているポイント。 |
| `points.monthly_limit` |ユーザーの毎月のポイント付与額。 |
| `points.next_renewal` |次回のポイント更新の ISO タイムスタンプ。 |
| `usage_by_model` |課金対象ユーザーがモデル使用量課金モードの場合: `dollar_limit`、`current_spend`、`remaining_budget`。それ以外の場合は `{ "enabled": false }`。 |
| `api_key.billing_mode` | `user-completions` または `usage-by-model` — [請求モード](/ja/en/api/billing-modes) を参照してください。 |
| `api_key.daily` / `api_key.monthly` |キーのリクエスト カウンタ (`used`、`limit`、`remaining`)。 |
| `api_key.rate_limit` |分単位および時間単位のリクエスト上限。 |
| `api_key.expires_at` | ISO 有効期限タイムスタンプ、またはキーの有効期限が切れない場合は `null`。 |

## 注意事項

- 値は **請求対象** ユーザーを反映します。リクエストが請求の代わりに `user_id` を使用する場合、キーの所有者とは異なる場合があります。
- *特定の* リクエストが (消費せずに) クォータを通過するかどうかをプレビューするには、[ポリシー チェック](/ja/en/api/policy-check) を使用し、`checks.quota` を読み取ります。

## 関連

- [課金モード](/ja/ja/api/billing-modes)
- [認証概要](/ja/ja/api/auth/overview)
- [ポリシーチェック](/ja/ja/api/policy-check)