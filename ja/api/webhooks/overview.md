---
sidebar_position: 1
title: "Webhook の概要"
sidebar_label: "概要"
description: "署名付き HTTP Webhook 経由で SecureAI からリアルタイムのセキュリティ イベントとプラットフォーム イベントを受信します"
---
# Webhook

SecureAI は、プロンプト シールド ブロック、カナリア リーク、DLP/PII インシデント、API 制限イベント、モデル フェイルオーバーなど、セキュリティ イベントとプラットフォーム イベントを独自の HTTP エンドポイントにリアルタイムでプッシュできます。すべての配信は HMAC-SHA256 署名で署名されるため、SecureAI から送信されたものであり、改ざんまたは再生されていないことを確認できます。

Webhook エンドポイントは、**Admin → Webhook** (API ベース `/api/admin/webhooks`) で管理者によって管理されます。

## エンドポイントの管理

|アクション |ルート |
|------|------|
|エンドポイントのリスト (+ イベント カタログ) | `GET /api/admin/webhooks` |
|エンドポイントの作成 (シークレットを 1 回返す) | `POST /api/admin/webhooks` |
|エンドポイントの更新 | `PUT /api/admin/webhooks/:id` |
|署名シークレットのローテーション (1 回返される) | `POST /api/admin/webhooks/:id/rotate-secret` |
|テスト配信を送信する | `POST /api/admin/webhooks/:id/test` |
|エンドポイントの削除 | `DELETE /api/admin/webhooks/:id` |

作成時の入力: `url`、`description`、`events[]` ([イベント](/ja/en/api/webhooks/events) を参照)、および `enabled`。署名シークレット (`whsec_...`) は作成時と回転時に**のみ**表示されます。安全に保存してください。再度取得することはできません。

エンドポイント `url` は SSRF で検証されています。`http(s)` のみが受け入れられ、インスタンスが `WEBHOOKS_ALLOW_PRIVATE=true` で実行されない限り、プライベート/ループバック/リンクローカル ホストは拒否されます (セルフホスト受信機はこれを必要とすることがよくあります)。

## 配信形式

各配信は、JSON 本文を含む HTTP `POST` です。

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

そしてこれらのヘッダー:

|ヘッダー |説明 |
|----------|---------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` |イベントのタイプ (例: `promptshield:attack:blocked`)。 |
| `X-SecureAI-Delivery` |一意の配信 UUID (冪等性のために使用)。 |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

エンドポイントは、配信を確認するために `2xx` ステータスを返す必要があります。

## 署名の検証

`` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t` の HMAC を再計算します。許容範囲外です (リプレイ保護)。 **生のリクエスト本文に対して検証します** — 最初に JSON を解析して再シリアル化すると、バイトが変更され、署名が破損します。

### Node.js (高速)

```javascript
import crypto from 'crypto';
import express from 'express';

const app = express();
const SECRET = process.env.SECUREAI_WEBHOOK_SECRET; // whsec_...
const TOLERANCE_SECONDS = 300;

// Capture the RAW body — do not use express.json() before verifying.
app.post('/webhooks/secureai', express.raw({ type: 'application/json' }), (req, res) => {
  const header = req.get('X-SecureAI-Signature') || '';
  const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=')));
  const t = Number(parts.t);
  const rawBody = req.body.toString('utf8');

  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > TOLERANCE_SECONDS) {
    return res.status(400).send('stale or invalid timestamp');
  }

  const expected = crypto.createHmac('sha256', SECRET).update(`${t}.${rawBody}`).digest('hex');
  const ok = parts.v1 &&
    crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));
  if (!ok) return res.status(401).send('bad signature');

  const event = JSON.parse(rawBody);
  console.log('Received', event.type, event.id);
  res.sendStatus(200);
});
```

### Python (フラスコ)

```python
import hashlib, hmac, time
from flask import Flask, request, abort

app = Flask(__name__)
SECRET = b"whsec_..."          # your signing secret
TOLERANCE_SECONDS = 300

@app.post("/webhooks/secureai")
def secureai_webhook():
    header = request.headers.get("X-SecureAI-Signature", "")
    parts = dict(kv.split("=", 1) for kv in header.split(","))
    t = int(parts.get("t", "0"))
    raw_body = request.get_data()  # raw bytes — do NOT use request.json first

    if abs(time.time() - t) > TOLERANCE_SECONDS:
        abort(400, "stale timestamp")

    signed = f"{t}.".encode() + raw_body
    expected = hmac.new(SECRET, signed, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(parts.get("v1", ""), expected):
        abort(401, "bad signature")

    return "", 200
```

## 信頼性

- **再試行:** 0 秒 / 10 秒 / 60 秒のバックオフで最大 3 回の試行、それぞれ 5 秒のタイムアウト。 `2xx` はすべて承認します。
- **自動無効化:** 20 回連続して配信に失敗すると、エンドポイントは自動的に無効になります。管理者がそれを再度有効にします (失敗カウンターもリセットされます)。
- **少なくとも 1 回:** 配信は繰り返される場合があります。`X-SecureAI-Delivery` (またはペイロード `id`) で重複を排除します。
- **ファイアアンドフォーゲット:** Webhook 配信は、発信元の API リクエストをブロックしたり遅延したりすることはありません。

## 関連

- [Webhook Events](/ja/en/api/webhooks/events) — 完全なイベント カタログとペイロード。
- [冗長性とフェイルオーバー](/ja/en/api/redundancy) — `api:model_failover`のソース。
- [Threat Defense](/ja/en/threat-defense/overview) — `promptshield:*` イベントのソース。