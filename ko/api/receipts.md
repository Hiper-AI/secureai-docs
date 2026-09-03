---
title: "규정 준수 영수증"
sidebar_label: "영수증"
description: "완료를 위해 서명된 SMLTP 준수 영수증을 가져옵니다."
openapi: "GET /receipts/{bundleId}"
---
# 준수 영수증

완료가 **SMLTP 게이트웨이**를 통해 라우팅되면 SecureAI는 통화를 관리하는 정책에 대한 암호화 증거인 서명된 규정 준수 **영수증**을 생성합니다. 이 엔드포인트는 번들 ID로 해당 영수증을 가져옵니다.

영수증은 게이트웨이 라우팅 배포에만 존재합니다. 직접 공급자 배포에는 영수증에 서명할 게이트웨이가 없으며 이 끝점은 `404`을 반환합니다.

## 엔드포인트

```
GET /receipts/:bundleId
```

## 번들 ID의 출처

완료 응답은 호출에 대해 SMLTP 자격이 부여될 때마다 번들 ID를 노출합니다.

- 클래식 끝점: `metadata.smltp.bundle_id` (및 기성품 `metadata.smltp.receipt_url`).
- OpenAI 호환 엔드포인트: `secureai.smltp_bundle_id`.

기본/직접 공급자 배포에서도 번들 ID(`jti-…`와 같은 자격 ID)가 반환됩니다. 그러나 해당 ID의 **서명된 영수증**은 트래픽이 SMLTP 게이트웨이를 통해 라우팅되는 경우에만 존재합니다. 직접 배포에서는 이 끝점이 `404`를 반환합니다(아래 참조).

## 인증

```bash
Authorization: Bearer sk-your-api-key-here
```

## 요청 예시

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 응답

### 200 OK

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

`receipt` 객체는 게이트웨이에서 내보내는 서명된 페이로드입니다. 영수증이 투명성 및 감사 모델에 어떻게 부합하는지 알아보려면 [SMLTP 보안](/ko/en/security/smltp)을 참조하세요.

### 404 찾을 수 없음

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 잘못된 요청

번들 ID가 누락되었거나 128자를 초과하는 경우 반환됩니다.

## 메모

- 영수증은 게이트웨이의 인메모리 저장소에 한정된 시간 동안 보관됩니다. 장기적인 증거를 위해 신뢰할 수 있고 변경할 수 없는 기록인 **해시 체인 감사 로그**를 활용하세요. [불변 로그](/ko/ko/security/immutable-logs)를 참조하세요.
- 모든 배포 경로가 게이트웨이를 통과하는 것은 아닙니다. `404`을 통합 오류가 아닌 "이 호출에 대한 게이트웨이 수신 없음"으로 처리합니다.

## 관련

- [SMLTP 보안](/ko/ko/security/smltp)
- [불변 로그](/ko/ko/security/immutable-logs)
- [채팅 완료](/ko/ko/api/chat/completions)