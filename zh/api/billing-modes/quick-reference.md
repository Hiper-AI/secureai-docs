---
title: "计费模式快速参考"
---
# 计费模式快速参考

用于在“用户完成次数”和“按模型使用情况”计费模式之间进行选择的快速比较指南。

## 快速比较

|特色|用户完成次数 |按型号使用 |
|--------------------|--------------------------------|----------------|
| **默认模式** | ✅ 是的 | ❌ 否 |
| **成本结构** |固定（许可证配额）|变量（每个令牌）|
| **用户权限** |不需要|必须启用 |
| **成本跟踪** |完成计数 |代币数量 + 成本 |
| **最适合** |可预测的成本|大容量使用 |
| **后备支持** | ✅ 是的 | ❌ 否 |

## 何时使用每种模式

### 用户完成模式

**在以下情况下选择此选项：**
- ✅ 您想要可预测的固定成本
- ✅ 您在现有许可限制内
- ✅ 您正在构建内部工具
- ✅ 您想要使用现有的配额分配
- ✅ 您需要简单的成本管理

**用例示例：**
- 内部聊天机器人
- 开发和测试
- 小批量应用
- 固定预算项目

### 按模型模式使用

**在以下情况下选择此选项：**
- ✅ 您需要详细的成本跟踪
- ✅ 您经常使用昂贵的型号
- ✅ 您只想为实际使用付费
- ✅ 您需要精细的使用情况分析
- ✅ 您有大量需求

**用例示例：**
- 生产应用
- 大容量人工智能服务
- 成本敏感型项目
- 多模型应用

## API 使用

当使用具有计费模式的外部 API 时：

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## 速率限制

### 默认速率限制
- **每分钟请求数**：60（可配置）
- **每小时请求**：1,000（可配置）
- **每日限制**：100 个请求（可配置）
- **每月限制**：10,000 个请求（可配置）

### 计费模式具体限制
- **用户完成数**：基于许可证配额
- **按型号使用**：额外的基于美元的限制

## SMLTP 策略集成

两种计费模式都支持 SMLTP 策略执行：

|政策 |描述 |使用案例|
|--------|-------------|----------|
| `public` |对于非敏感数据 |面向公众的应用程序 |
| `internal` |对于公司数据 |内部工具和流程|
| `confidential` |对于敏感信息 |限制访问应用程序 |

### SMLTP 配置示例

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## 配置示例

### 用户完成配置

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### 按模型配置使用

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## 错误场景

### 用户完成错误

|错误|原因 |解决方案 |
|--------|--------|----------|
| `Completion limit exceeded` |每月配额已达 |启用按模型使用或增加配额 |
| `Daily limit exceeded` |每日限额已达 |等待重置或增加限额 |
| `User not found` |无效的用户 ID |验证用户是否存在 |

### 模型错误的使用情况

|错误|原因 |解决方案 |
|--------|--------|----------|
| `Usage by Model required` |用户没有启用它 |为用户启用按模型使用 |
| `Usage by Model budget exceeded` |每月预算达到|提高美元限额 |
| `Invalid billing mode` |指定的模式无效 |使用 `"usage-by-model"` 或 `"user-completions"` |

## 迁移指南

### 从用户完成到按模型使用

1. **为用户启用按模型使用**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **更新API密钥配置**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **监控使用情况和成本**
   - 跟踪代币使用情况
   - 监控每月支出
   - 根据需要调整限制

### 从模型使用到用户完成

1. **验证用户有足够的配额**
   - 检查许可证等级
   - 验证每月限额

2. **更新API密钥配置**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **监控完成使用情况**
   - 跟踪完成计数
   - 确保后备行为有效

## 成本估算

### 用户完成成本

- **固定成本**：基于许可证级别
- **无额外费用**：超出现有许可证
- **可预测**：与 Web 界面使用相同

### 按模型成本划分的使用情况

- **可变成本**：基于代币使用情况
- **特定于型号的定价**：每个型号的费率不同
- **成本示例**：
  - GPT-5.1：适用提供商定价
  - Claude Sonnet 4.6：供应商定价适用
  - GPT-5 Nano：适用提供商定价

## 监控技巧

### 用户完成情况监控

- 每天跟踪完成计数
- 监控配额消耗
- 设置接近极限的警报
- 每月审查使用模式

### 模型监控的使用情况

- 跟踪代币使用情况和成本
- 监控每月支出
- 设置美元限额警报
- 按型号查看成本明细

## 安全考虑

### 两种模式

- 对敏感应用程序使用IP限制
- 定期轮换 API 密钥
- 监控异常活动
- 实施适当的错误处理

### 按特定型号使用

- 设置适当的美元限额
- 监控成本峰值
- 审查模型使用模式
- 跟踪昂贵模型的使用情况

## 支持资源

### 文档
- [计费模式概述](../billing-modes.md)
- [限制与配额](/zh/api/limits-and-quotas) - 了解平台限制

### 管理面板
- **API 部分**：创建和管理 API 密钥
- **用户部分**：启用按模型使用

### 常见问题
1. **按模型使用不起作用**：检查用户权限
2. **超出配额**：启用按模型使用或增加限制
3. **成本峰值**：审查模型使用情况并设置限制
4. **身份验证错误**：验证 API 密钥和权限