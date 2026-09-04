---
id: policies
title: "SMLTP 策略"
sidebar_label: "SMLTP 策略"
description: "检索所有 SMLTP 安全策略"
openapi: "GET /smltp-policies/all"
---
# SMLTP 政策

检索所有可用的 SMLTP（安全模型语言传输协议）安全策略。

## 端点

```
GET /smltp-policies/all
```

## 说明

检索所有可用的 SMLTP 策略，包括内置和自定义策略。 **仅需要管理员访问权限。**

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 查询参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
❌ 不支持查询参数 - 实际 API 不接受任何查询参数。

## 请求示例

```bash
GET /smltp-policies/all
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "data": {
    "builtInPolicies": [
      {
        "id": "public",
        "name": "Public",
        "type": "built-in",
        "description": "For public, non-sensitive data",
        "isActive": false
      },
      {
        "id": "internal",
        "name": "Internal", 
        "type": "built-in",
        "description": "For internal company data",
        "isActive": true
      },
      {
        "id": "confidential",
        "name": "Confidential",
        "type": "built-in", 
        "description": "For confidential business data",
        "isActive": false
      },
      {
        "id": "hipaa",
        "name": "HIPAA",
        "type": "built-in",
        "description": "For healthcare data compliance", 
        "isActive": false
      },
      {
        "id": "gdpr",
        "name": "GDPR",
        "type": "built-in",
        "description": "For European data protection compliance",
        "isActive": false
      },
      {
        "id": "pci-dss", 
        "name": "PCI-DSS",
        "type": "built-in",
        "description": "For payment card industry compliance",
        "isActive": false
      }
    ],
    "customPolicies": [],
    "activePolicyTemplate": "internal",
    "summary": {
      "totalPolicies": 7,
      "builtInCount": 7,
      "customCount": 0
    }
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `data` |对象|响应数据对象 |
| `data.builtInPolicies` |数组|内置策略对象数组 |
| `data.customPolicies` |数组|自定义策略对象数组 |
| `data.activePolicyTemplate` |字符串|当前活动的策略模板 ID |
| `data.summary` |对象|统计摘要|
| `data.summary.totalPolicies` |整数 |保单总数 |
| `data.summary.builtInCount` |整数 |内置策略数量 |
| `data.summary.customCount` |整数 |定制保单数量|

## 用法示例

### JavaScript

```javascript
const getSmltpPolicies = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getSmltpPolicies();
console.log('Built-in policies:', result.data.builtInPolicies);
console.log('Active policy:', result.data.activePolicyTemplate);
```

###Python

```python
import requests

def get_smltp_policies():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_smltp_policies()
print("Built-in policies:", result["data"]["builtInPolicies"])
print("Active policy:", result["data"]["activePolicyTemplate"])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/all" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 错误响应

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

## 策略对象字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `id` |字符串|策略标识符 |
| `name` |字符串|保单名称|
| `type` |字符串|策略类型（“内置”或“自定义”）|
| `description` |字符串|政策说明 |
| `isActive` |布尔 |该政策目前是否有效 |
| `createdAt` |字符串|创建时间戳（仅限自定义策略）|

## 用例

- **策略发现**：查找可用的安全策略
- **合规规划**：了解政策要求
- **安全配置**：选择适当的策略
- **活动策略管理**：检查当前处于活动状态的策略
- **集成**：将策略应用于聊天完成

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 该端点需要管理员权限
- 无参数：不支持查询参数
- 内置策略：返回预定义的系统策略
- 自定义策略：返回自定义策略（如果存在）
- 活动策略：显示当前处于活动状态的策略模板
- 扁平响应：响应嵌套在数据对象下