---
title: "计费模式 API 密钥"
---
# 计费模式 API 密钥

SecureAI 支持两种不同的 API 密钥计费模式，允许管理员控制如何跟踪不同 API 集成的使用情况和计费方式。

## 概述

API 密钥可以配置为以下两种计费模式之一：

- **用户完成**：从用户的许可证完成存储桶中扣除
- **按型号使用情况**：根据实际型号使用情况向用户信用卡收费

## 计费模式

### 用户完成模式

**默认模式** - API 密钥默认使用此模式。

#### 它是如何工作的
- 从用户的每月许可证配额中扣除完成情况
- 使用与网络界面相同的完成限制
- 除了用户现有许可证之外，无需额外付费
- 如果没有可用配额并且用户启用了按模型使用情况，则回退到按模型使用情况

#### 用例
- 您想要使用现有许可证分配的内部应用程序
- 开发和测试环境
- 您需要可预测的固定成本的应用程序
- 当您想保持在现有许可限制范围内时

#### 配置
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### 按模型模式使用

**高级模式** - 需要显式配置和用户许可。

#### 它是如何工作的
- 根据实际代币使用情况和模型成本收费
- 跟踪输入令牌、输出令牌和总令牌
- 根据特定型号的定价计算成本
- 要求用户在其帐户中启用按模型使用情况
- 具有可配置的每月美元限额

#### 用例
- 需要精确成本跟踪的大批量应用
- 使用较高成本模型的应用程序（GPT-5.x、Claude Opus/Sonnet 等）
- 当您需要详细的使用情况分析时
- 您只想为您使用的内容付费的应用程序

#### 配置
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## API 密钥创建

### 使用计费模式创建 API 密钥

从 SecureAI 管理面板创建和配置 API 密钥。

1. 转到`Admin -> API Keys`。
2. 创建或编辑 API 密钥。
3. 将`billingMode`设置为`user-completions`或`usage-by-model`。
4. 配置限制、允许的模型、允许的索引和允许的 SMLTP 策略。

### 计费模式验证

系统验证计费模式要求：

- **按模型使用模式**：要求用户启用按模型使用情况
- **用户完成模式**：适用于任何用户，但如果没有可用配额，可能会退回到按模型使用

## 使用情况跟踪

### 用户完成情况跟踪

对于用户完成模式，系统跟踪：
- 每日和每月完成计数
- 特定型号的使用统计
- 配额消耗及限制

### 模型跟踪的使用情况

对于按模型使用模式，系统跟踪：
- 输入代币、输出代币和总代币
- 特定型号的成本和积分
- 每月美元支出
- 详细的使用情况分析

## API 响应示例

### 用户完成模式响应

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### 按模型使用模式响应

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## 错误处理

### 按型号使用未启用

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### 超出配额（用户完成）

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### 超出预算（按型号划分的使用情况）

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## 最佳实践

### 选择正确的计费模式

1. **在以下情况下使用用户完成：**
   - 您想要可预测的成本
   - 您在现有许可限制内
   - 您正在构建内部工具
   - 您想要使用现有的配额分配

2. **在以下情况下使用按模型使用情况：**
   - 您需要详细的成本跟踪
   - 您经常使用昂贵的型号
   - 您只需为实际使用付费
   - 您需要精细的使用情况分析

### 配置建议

1. **设置适当的限制：**
   - 速率控制的每日限制
   - 成本控制的每月限额
   - 按型号模式使用的美元限制

2. **监控使用情况：**
   - 定期跟踪API密钥使用情况
   - 设置接近限制的警报
   - 每月审查使用模式

3. **安全考虑：**
   - 对敏感应用程序使用 IP 限制
   - 定期轮换 API 密钥
   - 监控异常使用模式

## 后备机制

### 按模型回退计算的用户完成使用情况

当用户完成 API 密钥遇到配额耗尽时，如果出现以下情况，系统会自动回退到按模型使用情况：

1. **用户在其帐户设置中启用了按模型使用情况**
2. **用户在按模型分配的使用情况中具有可用预算**
3. **API 密钥允许回退**（默认行为）

#### 后备流程

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### 验证逻辑

#### 按型号要求使用

在允许按模型使用情况计费之前，系统会验证以下内容：

1. **用户帐户设置**：用户必须启用“按模型使用”
2. **每月预算**：用户的分配中必须有可用预算
3. **API 密钥配置**：API 密钥必须配置为按模型使用或允许回退
4. **模型访问**：用户必须有权访问所请求的模型

#### 混合计费场景

当使用多个不同计费方式的API Key时：

- **用户完成密钥**消耗用户的每月配额
- **模型密钥的使用**从用户的预算分配中消耗
- **后备方案** 首先优先考虑用户完成，然后按模型使用
- **配额耗尽**触发自动回退（如果可用）

## 模式之间的迁移

### 从用户完成到按模型使用

1. **启用按模型使用**：确保用户在其帐户中启用按模型使用情况
2. **更新API Key**：更改API key配置中的计费模式
3. **设置预算限额**：配置适当的每月美元限额
4. **监控使用情况**：跟踪完成使用情况和预算消耗
5. **测试回退**：验证回退行为是否正常工作

### 从模型使用到用户完成

1. **验证配额**：确保用户有足够的每月完成配额
2. **更新API Key**：更改API key配置中的计费模式
3. **监控使用情况**：根据每月限制跟踪完成消耗
4. **配置回退**：如果配额耗尽，设置回退到按模型使用情况
5. **测试限制**：验证配额限制是否正确执行

### 迁移最佳实践

- **逐步迁移**：首先使用少量 API 密钥进行测试
- **监控两个指标**：跟踪完成使用情况和预算消耗
- **设置适当的限制**：为两种模式配置实际限制
- **文档更改**：跟踪计费模式更改以进行审计
- **用户沟通**：告知用户计费模式的变化及其影响

## 监控和分析

### 使用情况分析

系统提供两种计费模式的详细分析：

- **用户完成**：完成计数、配额使用、模型分布
- **按模型使用情况**：代币数量、成本、特定于模型的分析

### 管理面板集成

管理面板提供：
- 实时使用情况监控
- 计费模式配置
- 使用情况分析和报告
- 成本跟踪和警报

## 故障排除

### 常见问题

1. **按型号使用不起作用：**
   - 验证用户已启用按模型使用情况
   - 检查每月美元限额
   - 确保正确的模型访问

2. **用户完成配额问题：**
   - 检查用户的许可级别
   - 验证每月完成限制
   - 考虑启用按模型使用情况作为后备

3. **API密钥认证错误：**
   - 验证 API 密钥是否处于活动状态
   - 检查IP限制
   - 确保适当的权限

### 支持

对于计费模式问题：
1. 检查管理面板的使用统计信息
2. 检查 API 密钥配置
3.联系系统管理员变更计费方式
4.监控日志以获取详细的错误信息