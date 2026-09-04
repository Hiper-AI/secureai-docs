---
sidebar_position: 1
title: "身份验证概述"
---
# API 认证

SecureAI 对所有外部 API 访问使用 API 密钥身份验证。密钥是由管理员创建和配置的不记名令牌，每个密钥对模型、策略、限制、计费和安全性进行控制。

## 身份验证标头

```http
Authorization: Bearer sk-your-api-key-here
```

**API 密钥格式：**
- 以 `sk-` 前缀开头（例如 `sk-8cd5253f...`）。
- 前缀后跟 64 个字符的十六进制机密。
- 仅密钥的 SHA-256 哈希值存储在服务器端 - 完整密钥在创建时显示**一次**。如果丢失，请轮换/重新创建密钥。

所有 API 调用都需要 HTTPS。

## 创建和配置 API 密钥

管理员在 **Admin → API Keys** 中创建密钥（API 基础 `/api/admin/api-keys`，仅限管理员）。完整密钥在创建后返回。每个密钥都包含以下配置：

### 所有权和计费

|设置|描述 |
|---------|-------------|
| `name` |人类可读的标签。 |
| `userId` |该密钥所属/计费的用户帐户。 |
| `billingMode` | `user-completions`（从用户的完成津贴中扣除）或`usage-by-model`（按模型成本扣除一美元预算）。参见【计费模式】(/zh/api/billing-modes)。 |

调用者可以使用 `user_id` 正文参数（管理门控）向 **不同** 用户计费单个请求。

### 限制

|设置|描述 |
|---------|-------------|
| `dailyLimit` |该密钥每天的最大请求数。 |
| `monthlyLimit` |每月对此密钥的最大请求数。 |
| `rateLimit.requestsPerMinute` |每分钟上限（最多 1000）。 |
| `rateLimit.requestsPerHour` |每小时上限（最多 10000）。 |
| `expiresAt` |可选择到期；省略非过期密钥。 |

### 允许名单

|设置|描述 |
|---------|-------------|
| `allowedModels[]` |如果设置，密钥可能**仅**使用这些型号。空 = 许可证默认目录。 |
| `allowedIndexes[]` |限制该键可以查询哪些知识库。 |
| `allowedSMLTPPolicies[]` |密钥可能请求的 SMLTP 策略（默认 `["public", "internal"]`）。针对策略解析器进行验证，因此允许租户自定义策略。 |

### 提示盾

|设置|描述 |
|---------|-------------|
| `enablePromptShield` |为此键打开提示盾。 |
| `promptShieldSensitivity` | `strict`、`balanced` 或 `permissive`。 |
| `promptShieldPolicyId` |将特定的 Prompt Shield 策略绑定到密钥。 |
| `allowedPromptShieldPolicies[]` |呼叫者可以通过`prompt_shield.policy`为每次呼叫选择策略。 |

参见【Prompt Shield API】(/zh/api/threat-defense/prompt-shield)。

### 冗余默认值

`failoverDefaults` 将默认模型 [故障转移链](/zh/api/redundancy) 附加到密钥：`models[]`（最多 3 个）、`timeout_ms` (1000–300000)、`first_token_timeout_ms` (500–60000) 和 `on[]` 触发器。然后，调用者无需在每个请求上发送链即可进行故障转移。

## 幂等性

完成 `POST` 接受 `Idempotency-Key` 标头。使用相同的密钥重试会返回原始结果，而不是再次计费 - 使用它可以确保网络重试安全。请参阅[聊天完成](/zh/api/chat/completions)。

## 速率限制

默认上限（每个键可配置）：

- **每分钟**：60 个请求
- **每小时**：1000 个请求
- **每日**：100 个请求
- **每月**：10,000 个请求

密钥持有者可以通过 [`GET /usage`](/zh/api/usage) 读取自己的实时配额和限制。

## 安全特性

- **仅限 HTTPS** — 所有 API 调用都需要 TLS。
- **静态散列** — 仅存储每个密钥的 SHA-256 散列。
- **使用情况跟踪和审核日志** — 每个呼叫和身份验证事件都会被记录。
- **SMLTP 合规性** — 对每个请求强制执行安全策略。

## 错误响应

### 身份验证错误

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### 速率限制错误

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## 常见错误代码

|错误|描述 |
|--------|-------------|
| `Invalid API key` | API 密钥无效、已过期或已撤销。 |
| `Rate limit exceeded: too many requests per minute` |超出每分钟速率限制。 |
| `Rate limit exceeded: too many requests per hour` |超出每小时速率限制。 |
| `Access denied` |此键不允许使用模型、索引或策略。 |

## 后续步骤

- [API 参考](/zh/api) — 探索所有可用的外部端点。
- [聊天完成](/zh/api/chat/completions) — 开始集成完成。
- [OpenAI 兼容端点](/zh/api/chat/openai-兼容) — 重用现有的 OpenAI SDK。
- [使用情况](/zh/api/usage) — 检查配额和限制。