---
sidebar_position: 1
title: "웹훅 개요"
sidebar_label: "개요"
description: "서명된 HTTP 웹후크를 통해 SecureAI로부터 실시간 보안 및 플랫폼 이벤트 수신"
---
# 웹훅

SecureAI는 Prompt Shield 차단, 카나리아 누출, DLP/PII 사고, API 제한 이벤트, 모델 장애 조치 등 보안 및 플랫폼 이벤트를 자체 HTTP 엔드포인트에 실시간으로 푸시할 수 있습니다. 모든 전송은 HMAC-SHA256 서명으로 서명되므로 SecureAI에서 전송되었으며 변조되거나 재생되지 않았는지 확인할 수 있습니다.

웹훅 엔드포인트는 **관리 → 웹훅**(API 기반 `/api/admin/webhooks`)에서 관리자가 관리합니다.

## 엔드포인트 관리

| 액션 | 경로 |
|---------|-------|
| 엔드포인트 나열(+ 이벤트 카탈로그) | `GET /api/admin/webhooks` |
| 엔드포인트 생성(비밀번호를 한 번 반환) | `POST /api/admin/webhooks` |
| 엔드포인트 업데이트 | `PUT /api/admin/webhooks/:id` |
| 서명 비밀 번호 순환(한 번 반환됨) | `POST /api/admin/webhooks/:id/rotate-secret` |
| 테스트 배송 보내기 | `POST /api/admin/webhooks/:id/test` |
| 엔드포인트 삭제 | `DELETE /api/admin/webhooks/:id` |

생성 시간 입력: `url`, `description`, `events[]`([이벤트](/ko/api/webhooks/events) 참조) 및 `enabled`. 서명 비밀(`whsec_...`)은 생성 및 교체 시 **만** 표시됩니다. 안전하게 저장하세요. 다시 검색할 수 없습니다.

끝점 `url`은 SSRF 검증을 거쳤습니다. `http(s)`만 허용되며 인스턴스가 `WEBHOOKS_ALLOW_PRIVATE=true`로 실행되지 않는 한 개인/루프백/링크 로컬 호스트는 거부됩니다(자체 호스팅 수신기에는 종종 이것이 필요함).

## 배송 형식

각 전달은 JSON 본문이 포함된 HTTP `POST`입니다.

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "promptshield:attack:blocked",
  "created": 1705312200,
  "data": { "...": "event-specific payload" }
}
```

헤더는 다음과 같습니다.

| 헤더 | 설명 |
|---------|-------------|
| `Content-Type` | `application/json` |
| `X-SecureAI-Event` | 이벤트 유형(예: `promptshield:attack:blocked`). |
| `X-SecureAI-Delivery` | 고유한 배달 UUID(멱등성에 사용) |
| `X-SecureAI-Signature` | `t=<unix-seconds>,v1=<hex hmac-sha256(secret, "${t}.${rawBody}")>` |

전달을 확인하려면 엔드포인트가 `2xx` 상태를 반환해야 합니다.

## 서명 확인 중

`` `${t}.${rawBody}` `` using your signing secret and compare it to the `v1` value. Reject the delivery if it doesn't match, or if `t`에 대해 HMAC를 다시 계산하면 허용 범위를 벗어납니다(재생 보호). **원시 요청 본문에 대해 확인** — 먼저 JSON을 구문 분석하고 다시 직렬화하면 바이트가 변경되고 서명이 손상됩니다.

### Node.js(익스프레스)

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

### Python(플라스크)

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

## 신뢰성

- **재시도:** 0초/10초/60초 백오프로 최대 3회 시도할 수 있으며 각각 5초 시간 제한이 적용됩니다. `2xx`은 모두 인정합니다.
- **자동 비활성화:** 20번 연속 전송 실패 후 엔드포인트가 자동으로 비활성화됩니다. 관리자가 이를 다시 활성화합니다(실패 카운터도 재설정됨).
- **최소 한 번:** 전송이 반복될 수 있습니다. `X-SecureAI-Delivery`(또는 페이로드 `id`)에서 중복을 제거합니다.
- **Fire-and-forget:** 웹훅 전달은 원래 API 요청을 차단하거나 지연하지 않습니다.

## 관련

- [웹훅 이벤트](/ko/api/webhooks/events) — 전체 이벤트 카탈로그 및 페이로드.
- [이중화 및 장애 조치](/ko/api/redundancy) — `api:model_failover`의 소스입니다.
- [위협 방어](/ko/threat-defense/overview) — `promptshield:*` 이벤트의 소스입니다.