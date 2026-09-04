---
sidebar_position: 1
title: "Webhook 概述"
sidebar_label: "概述"
description: "通过签名的 HTTP Webhooks 从 SecureAI 接收实时安全和平台事件"
---
# 网络钩子

SecureAI 可以将安全和平台事件实时推送到您自己的 HTTP 端点 - Prompt Shield 阻止、金丝雀泄漏、DLP/PII 事件、API 限制事件和模型故障转移。每次交付均使用 HMAC-SHA256 签名进行签名，因此您可以验证它来自 SecureAI 并且未被篡改或重播。

Webhook 端点由管理员在 **Admin → Webhooks**（API 基础 `/api/admin/webhooks`）中进行管理。

## 管理端点

|行动|路线 |
|--------|--------|
|列出端点（+事件目录）| `GET /api/admin/webhooks` |
|创建端点（返回秘密一次）| `POST /api/admin/webhooks` |
|更新端点 | `PUT /api/admin/webhooks/:id` |
|轮换签名秘密（返回一次）| `POST /api/admin/webhooks/:id/rotate-secret` |
|发送测试交付 | `POST /api/admin/webhooks/:id/test` |
|删除端点 | `DELETE /api/admin/webhooks/:id` |

创建时输入：`url`、`description`、`events[]`（请参阅[事件](/zh/api/webhooks/events)）和`enabled`。签名秘密 (`whsec_...`) **仅**在创建和旋转时显示 - 安全存储它；您无法再次检索它。

端点 `url` 经过 SSRF 验证：仅接受 `http(s)`，私有/环回/本地链路主机将被拒绝，除非实例与 `WEBHOOKS_ALLOW_PRIVATE=true` 一起运行（自托管接收器通常需要此）。

## 交付格式

每个交付都是一个带有 JSON 正文的 HTTP `POST`：

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

还有这些标题：

|标题|描述 |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` |事件类型（例如 `promptshield:attack:blocked`）。 |
| `X-SecureAI-Delivery` |唯一的交付 UUID（用于幂等性）。 |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

您的端点应返回任何 `2xx` 状态以确认传送。

## 验证签名

通过 `` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t` 重新计算 HMAC 超出了容差窗口（重放保护）。 **根据原始请求正文进行验证** — 首先解析并重新序列化 JSON 将更改字节并破坏签名。

### Node.js（Express）

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

### Python（烧瓶）

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

## 可靠性

- **重试：** 最多 3 次尝试，每次有 0 秒/10 秒/60 秒回退，每次 5 秒超时。任何`2xx`确认。
- **自动禁用：**连续 20 次传送失败后，端点将自动禁用；管理员重新启用它（这也会重置失败计数器）。
- **至少一次：** 交付可能会重复 — 在 `X-SecureAI-Delivery`（或有效负载 `id`）上进行重复数据删除。
- **即发即忘：** Webhook 传递永远不会阻止或延迟原始 API 请求。

## 相关

- [Webhook 事件](/zh/api/webhooks/events) — 完整的事件目录和有效负载。
- [冗余和故障转移](/zh/api/redundancy) — `api:model_failover` 的来源。
- [威胁防御](/zh/threat-defense/overview) — `promptshield:*` 事件的来源。