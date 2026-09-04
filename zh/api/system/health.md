---
sidebar_position: 1
title: "健康检查"
openapi: "GET /health"
---
# 健康检查

检查 API 是否正在运行且健康。无需身份验证。

## 端点

```
GET /health
```

## 说明

此端点允许您验证 SecureAI 外部 API 是否正在运行且正常。此端点不需要身份验证。

## 请求

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## 回应

### 成功响应 (200)

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 响应字段

|领域 |类型 |描述 |示例|
|--------|------|-------------|---------|
| `success` |布尔 |成功健康检查始终如此 | `true` |
| `status` |字符串| API健康状况| `"healthy"` |
| `timestamp` |字符串| ISO 8601 格式的当前服务器时间戳 | `"2024-01-15T10:30:00.000Z"` |
| `version` |字符串|当前 API 版本 | `"1.0.0"` |

## 用法示例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/health');
const data = await response.json();
console.log('API Status:', data.status);
```

###Python

```python
import requests

response = requests.get('https://{customer.name}.hiperai.ai/api/external/health')
data = response.json()
print('API Status:', data['status'])
```

### 卷曲

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

## 注释

- 该端点不需要身份验证
- 使用此端点监控API可用性
- 响应包括当前 API 版本以进行兼容性检查