---
title: "コンプライアンスの受領書"
sidebar_label: "領収書"
description: "署名済みの SMLTP コンプライアンス受領書を取得して完了します"
openapi: "GET /receipts/{bundleId}"
---
# コンプライアンス受領書

完了が **SMLTP ゲートウェイ** を介してルーティングされると、SecureAI は、署名されたコンプライアンス **受領書** (呼び出しを管理するポリシーの暗号化された証拠) を生成します。このエンドポイントは、バンドル ID によってそのレシートを取得します。

領収書は、ゲートウェイ経由の展開に対してのみ存在します。直接プロバイダーの展開では、領収書に署名するゲートウェイが存在せず、このエンドポイントは `404` を返します。

## エンドポイント

```
GET /receipts/:bundleId
```

## バンドル ID の由来

完了応答は、呼び出しに対して SMLTP 資格が作成されるたびにバンドル ID を公開します。

- クラシック エンドポイント: `metadata.smltp.bundle_id` (および既製の `metadata.smltp.receipt_url`)。
- OpenAI 互換エンドポイント: `secureai.smltp_bundle_id`。

バンドル ID (`jti-…` などの資格 ID) は、ネイティブ/直接プロバイダー展開でも返されます。ただし、その ID の **署名済みレシート** は、トラフィックが SMLTP ゲートウェイを介してルーティングされる場合にのみ存在します。直接展開では、このエンドポイントは `404` を返します (下記を参照)。

## 認証

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエストの例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

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

`receipt` オブジェクトは、ゲートウェイによって発行される署名付きペイロードです。領収書が透明性と監査モデルにどのように適合するかについては、[SMLTP Security](/ja/security/smltp) を参照してください。

### 404 見つかりません

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 不正なリクエスト

バンドル ID が見つからない場合、または 128 文字を超える場合に返されます。

## 注意事項

- レシートは、ゲートウェイのメモリ内ストアに一定期間保持されます。長期的な証拠については、**ハッシュチェーン監査ログ** (信頼できる不変の記録) を利用してください。 [不変ログ](/ja/security/immutable-logs) を参照してください。
- すべての展開がゲートウェイを経由するわけではありません。 `404` は、統合のエラーではなく、「この呼び出しに対するゲートウェイ受信なし」として扱います。

## 関連

- [SMLTPセキュリティ](/ja/security/smltp)
- [不変ログ](/ja/security/immutable-logs)
- [チャット補完](/ja/api/chat/completions)