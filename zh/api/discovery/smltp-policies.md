---
sidebar_position: 3
title: "安全政策"
openapi: "GET /smltp-policies"
---
# 获取安全策略

检索可用的 SMLTP（安全模型语言传输协议）安全策略。

## 端点

```
GET /smltp-policies
```

## 说明

检索可用的 SMLTP（安全模型语言传输协议）安全策略。这些政策决定如何处理和保护您的数据。

## 身份验证

必需：API 密钥

```bash
Authorization: Bearer sk-your-api-key-here
```

## 请求

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

### 成功响应 (200)

```json
{
  "success": true,
  "policies": [
    {
      "id": "public",
      "name": "Public",
      "description": "For public, non-sensitive data"
    },
    {
      "id": "internal",
      "name": "Internal",
      "description": "For internal company data"
    },
    {
      "id": "confidential",
      "name": "Confidential",
      "description": "For confidential business data"
    }
  ],
  "restrictions": {
    "allowed_policies": ["public", "internal", "confidential"]
  }
}
```

### 响应字段

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `success` |布尔 |对于成功的请求始终如此 | `true` |
| `policies` |数组|可用安全策略列表 |参见示例 |
| `restrictions` |对象|政策准入限制|参见示例 |

### 策略对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `id` |字符串|唯一保单标识符 | `"internal"` |
| `name` |字符串|策略显示名称 | `"Internal"` |
| `description` |字符串|政策说明 | `"For internal company data"` |

### 限制对象

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `allowed_policies` |数组|允许的策略 ID 数组 | `["public", "internal", "confidential"]` |

## 错误响应

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

## 用法示例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Policies:', data.policies);
```

###Python

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/smltp-policies', headers=headers)
data = response.json()

print('Available Policies:', data['policies'])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 保单类型

### 公开
- **用例**：公共、非敏感数据
- **安全级别**：低
- **数据处理**：具有基本安全性的标准处理

### 内部
- **用例**：公司内部数据
- **安全级别**：中
- **数据处理**：通过额外的保障措施增强安全性

### 机密
- **用例**：机密业务数据
- **安全级别**：高
- **数据处理**：通过严格的数据处理实现最大的安全性

## 注释

- 根据您的数据敏感性选择适当的策略
- 政策影响您的数据的处理和保护方式
- 在聊天完成请求中使用策略 ID
- 某些政策可能会根据您的账户类型受到限制