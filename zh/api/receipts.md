---
title: "合规收据"
sidebar_label: "收据"
description: "获取已签名的 SMLTP 合规收据以完成"
openapi: "GET /receipts/{bundleId}"
---
# 合规收据

当通过 **SMLTP 网关**路由完成时，SecureAI 会生成一份签名的合规性**收据**——管理调用的策略的加密证明。该端点通过其捆绑 ID 获取该收据。

仅网关路由部署存在收据。在直接提供商部署中，没有用于签署收据的网关，并且此端点返回 `404`。

## 端点

```
GET /receipts/:bundleId
```

## 包 id 的来源

每当为调用创建 SMLTP 权利时，完成响应都会公开捆绑包 ID：

- 经典端点：`metadata.smltp.bundle_id`（以及现成的`metadata.smltp.receipt_url`）。
- OpenAI 兼容端点：`secureai.smltp_bundle_id`。

即使在本机/直接提供商部署中，也会返回捆绑 ID（权利 ID，例如 `jti-…`）。然而，仅当流量通过 SMLTP 网关路由时，该 ID 处的**签名收据**才存在 — 在直接部署中，此端点返回 `404`（见下文）。

## 身份验证

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求示例

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

### 200 好

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

`receipt` 对象是网关发出的签名有效负载。请参阅 [SMLTP 安全性](/zh/security/smltp) 了解收据如何适应透明度和审计模型。

### 404 未找到

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 错误请求

当捆绑包 ID 丢失或长度超过 128 个字符时返回。

## 注释

- 收据在网关的内存存储中保存一段有限的时间。对于长期证明，请依赖**哈希链审计日志**——权威的、不可变的记录。请参阅[不可变日志](/zh/security/immutable-logs)。
- 并非每个部署都通过网关进行路由；将 `404` 视为“此呼叫没有网关收据”，而不是集成中的错误。

## 相关

- [SMLTP 安全](/zh/security/smltp)
- [不可变日志](/zh/security/immutable-logs)
- [聊天完成](/zh/api/chat/completions)