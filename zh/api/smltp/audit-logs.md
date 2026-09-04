---
id: audit-logs
title: "审核日志"
sidebar_label: "审核日志"
description: "检索 SMLTP 审核日志"
openapi: "GET /audit-logs"
---
# 审核日志

检索 SMLTP（安全模型语言传输协议）审核日志以进行安全监控和合规性。

## 端点

```
GET /audit-logs
```

## 说明

此端点返回跟踪安全事件、策略违规和合规活动的 SMLTP 审核日志。这对于安全监控、合规性审核和调查安全事件非常有用。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 查询参数

|参数|类型 |必填|描述 |
|------------|------|----------|----------|
| `page` |整数 |没有 | 1 |分页页码（默认：1）|
| `limit` |整数 |没有 | 50 | 50每页日志数（默认：50）|
| `startDate` |字符串|没有 | - |过滤开始日期（ISO 8601 格式）|
| `endDate` |字符串|没有 | - |过滤结束日期（ISO 8601 格式）|
| `type` |字符串|没有 | - |按日志类型过滤 |
| `severity` |字符串|没有 | - |按严重级别过滤 |
| `userId` |字符串|没有 | - |按用户 ID 过滤 |
| `search` |字符串|没有 | - |描述或元数据的搜索词 |

## 请求示例

```bash
GET /audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20
```

## 成功响应

**状态代码**：`200 OK`

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "60a7c8f5e8b4f5001f7a8c23",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "type": "smltp_policy_management",
        "severity": "info",
        "description": "External API: Created new SMLTP policy Custom Policy",
        "user": {
          "id": "60a7c8f5e8b4f5001f7a8c24",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "metadata": {
          "endpoint": "/api/external/smltp-policies",
          "policyId": "custom-policy",
          "policyName": "Custom Policy",
          "setAsActive": false,
          "apiKeyId": "60a7c8f5e8b4f5001f7a8c25"
        },
        "complianceCategory": "data_protection",
        "outcome": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    },
    "dateRange": {
      "startDate": "2024-01-08T10:30:00.000Z",
      "endDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `data` |对象|响应数据对象 |
| `data.logs` |数组|审计日志对象数组 |
| `data.logs[].id` |字符串|唯一的审计日志标识符 |
| `data.logs[].timestamp` |字符串|日志时间戳（ISO 8601）|
| `data.logs[].type` |字符串|审计事件类型 |
| `data.logs[].severity` |字符串|严重程度 |
| `data.logs[].description` |字符串|活动描述 |
| `data.logs[].user` |对象|用户信息（如果有）|
| `data.logs[].user.id` |字符串|用户名 |
| `data.logs[].user.name` |字符串|用户名 |
| `data.logs[].user.email` |字符串|用户邮箱 |
| `data.logs[].metadata` |对象|附加元数据 |
| `data.logs[].complianceCategory` |字符串|合规类别|
| `data.logs[].outcome` |字符串|活动结果 |
| `data.pagination` |对象|分页信息|
| `data.pagination.page` |整数 |当前页码 |
| `data.pagination.limit` |整数 |每页项目 |
| `data.pagination.total` |整数 |日志总数 |
| `data.pagination.pages` |整数 |总页数 |
| `data.dateRange` |对象|日期范围信息 |

## 用法示例

### JavaScript

```javascript
const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://{customer.name}.hiperai.ai/api/external/audit-logs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk-your-api-key-here'
    }
  });
  
  return await response.json();
};

// Example usage
const result = await getAuditLogs({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-20T23:59:59Z',
  severity: 'info',
  limit: 20
});
console.log(result.data.logs);
```

###Python

```python
import requests

def get_audit_logs(params=None):
    url = "https://{customer.name}.hiperai.ai/api/external/audit-logs"
    headers = {
        "Authorization": "Bearer sk-your-api-key-here"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
params = {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z",
    "severity": "info",
    "limit": 20
}

result = get_audit_logs(params)
print(result["data"]["logs"])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/audit-logs?startDate=2024-01-01T00:00:00Z&endDate=2024-01-20T23:59:59Z&severity=info&limit=20" \
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


## 过滤示例

### 日期范围

```bash
# Get logs from last 7 days
GET /audit-logs?startDate=2024-01-13T00:00:00Z&endDate=2024-01-20T23:59:59Z

# Get logs from specific date
GET /audit-logs?startDate=2024-01-20T00:00:00Z&endDate=2024-01-20T23:59:59Z
```

### 事件过滤

```bash
# Get all SMLTP policy management events
GET /audit-logs?type=smltp_policy_management

# Get info level events
GET /audit-logs?severity=info
```

### 用户过滤

```bash
# Get logs for specific user
GET /audit-logs?userId=60a7c8f5e8b4f5001f7a8c24

# Search in descriptions
GET /audit-logs?search=policy
```

## 用例

- **安全监控**：监控安全事件和策略违规
- **合规审计**：跟踪合规活动和违规行为
- **事件调查**：调查安全事件和违规行为
- **政策分析**：分析政策有效性和执行情况
- **用户活动**：跟踪用户操作和 API 使用情况

## 速率限制

- **默认**：每分钟 100 个请求
- **每日**：每天 10,000 个请求
- **每月**：每月 300,000 个请求

## 注释

- 该端点需要管理员权限
- 分页：使用页面参数，而不是偏移量
- 日期范围：如果未提供日期，则默认为过去 7 天
- 搜索：在描述和元数据.操作字段中搜索
- 嵌套响应：响应嵌套在数据对象下
- 用户信息：用户信息可用时填充
- 出于合规目的保留日志