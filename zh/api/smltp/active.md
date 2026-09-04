---
id: active
title: "有效的 SMLTP 策略"
sidebar_label: "有效的 SMLTP 策略"
description: "检索当前活动的 SMLTP 策略"
openapi: "GET /smltp-policies/active"
---
# 有效的 SMLTP 策略

检索您帐户当前有效的 SMLTP（安全模型语言传输协议）策略。

## 端点

```
GET /smltp-policies/active
```

## 说明

检索当前活动的 SMLTP 策略配置。 **仅需要管理员访问权限。**

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 请求示例

```bash
GET /smltp-policies/active
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "data": {
    "template": "internal",
    "policy": {
      // Current policy configuration object
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `data` |对象|响应数据对象 |
| `data.template` |字符串|当前活动的策略模板 ID |
| `data.policy` |对象|当前策略配置对象|
| `data.lastUpdated` |字符串|最后更新时间戳 |

## 用法示例

### JavaScript

```javascript
const getActiveSmltpPolicy = async () => {
  const response = await fetch('https://{customer.name}.hiperai.ai/api/external/smltp-policies/active', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getActiveSmltpPolicy();
console.log('Active template:', result.data.template);
console.log('Policy config:', result.data.policy);
```

###Python

```python
import requests

def get_active_smltp_policy():
    url = "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example usage
result = get_active_smltp_policy()
print("Active template:", result["data"]["template"])
print("Policy config:", result["data"]["policy"])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/smltp-policies/active" \
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


## 用例

- **策略审核**：检查当前处于活动状态的策略模板
- **配置检查**：查看当前策略配置
- **模板管理**：了解正在使用哪个策略模板
- **故障排除**：了解当前的策略设置
- **审计准备**：审查合规性审计的现行政策

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 该端点需要管理员权限
- 单一策略：返回当前活动的策略模板和配置
- 无数组：不返回策略数组，仅返回活动策略
- 模板 ID：显示当前处于活动状态的策略模板
- 策略配置：返回实际的策略配置对象
- 嵌套响应：响应嵌套在数据对象下