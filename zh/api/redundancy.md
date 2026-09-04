---
title: "冗余和故障转移"
sidebar_label: "冗余和故障转移"
description: "SecureAI Completions API 的调用者定义的模型故障转移链"
---
# 冗余和故障转移

当提供者调用失败时，Completions API 可以自动从一种模型“故障转移”到另一种模型。您定义一个有序链——一个主要模型加上最多两个后备模型——SecureAI 会依次尝试每个模型，直到其中一个成功。这使您能够抵御提供商中断、速率限制和超时，而无需在您自己的代码中添加任何重试逻辑。

[经典 `/chat/completions`](/zh/api/chat/completions) 端点和 [OpenAI 兼容 `/v1/chat/completions`](/zh/api/chat/openai-completions) 端点均提供冗余。

## 链是如何定义的

请求链有三种方式，按优先顺序排列：

| ＃|你发送|由此产生的链|
|---|----------|-----------------|
| 1 | `models: ["a", "b", "c"]` |正是该链（覆盖 `model`）。 |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`。 |
| 3 | `model: "a"`独自|如果 `a` 出现在 API 密钥的管理员配置的 `failoverDefaults` 中（链从 `a` 的位置开始）；否则一次尝试。 |

一条链可以包含**最多 3 个不同的模型**。重复的条目被折叠。每个链条目可以是纯模型字符串或具有每次尝试超时的对象：

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

您不能在同一请求中组合 `models` 和 `fallback_models`。

## 链范围选项 (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

|领域 |范围 |描述 |
|--------|--------|-------------|
| `timeout_ms` | 1000–300000 |每次尝试的总体超时。 |
| `first_token_timeout_ms` | 500–60000 |对于流式传输：故障转移之前等待第一个内容令牌的时间。 |
| `on` |以下触发器的子集 |哪些故障类别会触发故障转移。默认为全部四个。 |

每次尝试超时（在 `models[]` 条目内设置）会覆盖该尝试的链范围值。

## 故障转移触发器

失败的尝试归为以下原因之一；仅当原因在您的 `on` 列表中时才会发生故障转移 **并且** 链中还存在另一个模型：

|原因 |原因 |
|--------|--------|
| `connection_error` |连接被拒绝/重置、DNS/获取失败。 |
| `server_error` |提供商返回 HTTP 5xx。 |
| `rate_limit` |提供程序返回 HTTP 429。
| `timeout` |尝试超出了 `timeout_ms`（或流式传输时的 `first_token_timeout_ms`）。 |

**不可**可重试的故障永远不会触发故障转移 - 例如有意的网关速率限制/令牌预算块、开路断路器或策略/验证拒绝。回退也会同样失败，或者该块是故意的。

## 流媒体行为

对于流请求，**仅在第一个内容令牌到达之前才可能进行故障转移。** SecureAI 拉取上游流，直到第一个令牌（以 `first_token_timeout_ms` 为界）；如果失败，则会故障转移到下一个模型。一旦第一个令牌发送到您的客户端，服务模型就会被锁定 - 稍后的中流中断将显示为 `error` 帧，而不是故障转移。

## 你得到什么

当多模型链运行时，响应包括**故障转移报告**：

- 经典端点：`metadata.failover`
- OpenAI 兼容端点：`secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` 告诉您实际回答的模型，而 `requested_model` 是链中的第一个模型。单模型（旧版）请求不会生成故障转移报告。

## 当整个链条失败时

如果每次尝试都失败，请求将返回一个错误，列出所有尝试：

- **429** 如果“每个”失败都是速率限制。
- **502** 否则。

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

在 OpenAI 兼容端点上，相同的条件返回带有 `code: "all_models_failed"` 的 OpenAI 错误包络。

## 管理员默认值 (`failoverDefaults`)

管理员可以将默认链附加到 API 密钥，以便调用者可以进行故障转移，而无需在每个请求上发送链。在 **Admin → API Keys** 中配置，有效负载经过验证和限制：

- `models`：最多 3 个不同的型号名称。
- `timeout_ms`：1000–300000。
- `first_token_timeout_ms`：500–60000。
- `on`：四个触发器的任意子集。

当调用者仅发送 `model: "a"` 并且 `a` 存在于 `failoverDefaults.models` 中时，链从 `a` 的位置开始，并继续通过剩余的默认值。

## Security & billing per attempt

每次尝试都是通过 SMLTP 包装器进行的完整、独立的调用 - 策略执行、出口/驻留治理和签名权利令牌铸币每次尝试都会重新运行，并绑定到该尝试的模型和确切的请求字节。计费反映了实际提供响应的模型。每个故障转移还会发出一个 `api:model_failover` 安全事件（传递到任何订阅的 [webhooks](/zh/api/webhooks/overview)）和一个审核日志条目。

## 相关

- [聊天完成](/zh/api/chat/completions)
- [OpenAI兼容端点](/zh/api/chat/openai-兼容)
- [Policy Check](/zh/api/policy-check) — 无需花费积分即可预览全链的访问情况。
- [Webhooks](/zh/api/webhooks/overview) — 订阅 `api:model_failover`。