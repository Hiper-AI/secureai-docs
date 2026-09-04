---
id: create
title: "创建 SMTP 策略"
sidebar_label: "创建 SMTP 策略"
description: "创建新的 SMTP 安全策略"
openapi: "POST /smltp-policies/active"
---
# 创建SMLTP策略

为您的帐户创建新的 SMLTP（安全模型语言传输协议）安全策略。

## 端点

```
POST /smltp-policies
```

## 说明

创建新的自定义 SMLTP 策略。仅需要管理员访问权限。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 请求正文

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `name` |字符串|是的 |保单名称|
| `description` |字符串|是的 |政策说明 |
| `policy` |对象|是的 |策略配置对象|
| `setAsActive` |布尔 |没有 |是否立即将此策略设置为活动（默认：false） |

## 请求示例

```json
{
  "name": "Custom Privacy Policy",
  "description": "Enhanced privacy protection for sensitive data",
  "policy": {
    // Policy configuration object
  },
  "setAsActive": false
}
```

## 成功响应

**状态代码**：`201 Created`

```json
{
  "success": true,
  "message": "SMLTP policy created successfully",
  "policy": {
    "id": "custom-privacy-policy",
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "type": "custom",
    "isActive": false,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `message` |字符串|成功留言|
| `policy` |对象|创建策略对象 |
| `policy.id` |字符串|策略标识符（根据名称生成）|
| `policy.name` |字符串|保单名称|
| `policy.description` |字符串|政策说明 |
| `policy.type` |字符串|策略类型（“自定义”）|
| `policy.isActive` |布尔 |政策当前是否有效 |
| `policy.createdAt` |字符串|创建时间戳 |

## 用法示例

### JavaScript

```javascript
const createSmltpPolicy = async (policyData) => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policyData)
  });
  
  return await response.json();
};

// Example usage
const policyData = {
  name: "Custom Privacy Policy",
  description: "Enhanced privacy protection for sensitive data",
  policy: {
    // Policy configuration object
  },
  setAsActive: false
};

const result = await createSmltpPolicy(policyData);
console.log('Created policy:', result.policy.id);
```

###Python

```python
import requests

def create_smltp_policy(policy_data):
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=policy_data)
    return response.json()

# Example usage
policy_data = {
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
        # Policy configuration object
    },
    "setAsActive": False
}

result = create_smltp_policy(policy_data)
print("Created policy:", result["policy"]["id"])
```

### 卷曲

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/smltp-policies" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Privacy Policy",
    "description": "Enhanced privacy protection for sensitive data",
    "policy": {
      // Policy configuration object
    },
    "setAsActive": false
  }'
```

## 错误响应

### 400 错误请求

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy name is required",
    "details": {
      "field": "name",
      "value": null
    }
  }
}
```

### 401 未经授权

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 403 禁止

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Admin privileges required"
  }
}
```

### 409 冲突

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NAME_EXISTS",
    "message": "Policy name already exists"
  }
}
```

### 429 请求过多

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```


## 用例

- **自定义安全**：创建适合您需求的策略
- **合规性**：实施特定的监管要求
- **风险管理**：定义缓解风险的安全措施
- **数据保护**：建立隐私和数据处理规则
- **策略管理**：创建和管理自定义 SMLTP 策略

## 速率限制

- **默认**：每分钟 50 个请求
- **每日**：每天 5,000 个请求
- **每月**：每月 150,000 个请求

## 注释

- 该端点需要管理员权限
- 必填字段：名称、描述和政策为必填项
- 策略 ID：根据名称生成（小写，连字符用于空格）
- 唯一名称：策略名称必须是唯一的
- 设置活动：可以选择立即设置为活动
- 扁平响应：响应未嵌套在数据对象下