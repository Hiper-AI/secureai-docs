---
id: licenses-availability
title: "许可证可用性"
sidebar_label: "许可证可用性"
description: "检索当前许可证池限制、使用情况和剩余量（仅限管理员）"
openapi: "GET /licenses/availability"
---
# 许可证可用性

检索每个层的许可证池限制、当前使用情况和剩余许可证。

## 端点

```
GET /licenses/availability
```

## 说明

返回所有许可证层的许可证池状态，包括限制、当前使用情况和剩余容量。仅限管理端点。

## 身份验证

**必需**：具有管理员权限的 API 密钥

```
Authorization: Bearer sk-your-api-key-here
```

## 请求

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/licenses/availability" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 回应

### 成功响应 (200)

```json
{
  "success": true,
  "limits": { "Essential": 1, "Growth": 0, "Ultra": 2, "Early Access": 12 },
  "usage": { "Essential": 1, "Growth": 5, "Ultra": 1, "Early Access": 0 },
  "remaining": { "Essential": 0, "Growth": Infinity, "Ultra": 1, "Early Access": 12 }
}
```

### 响应字段

|领域 |类型 |描述 |
|--------|------|-------------|
| `success` |布尔 |指示操作是否成功 |
| `limits` |对象|许可证池每层配置的限制 |
| `usage` |对象|当前每层分配/使用的许可证 |
| `remaining` |对象|每层剩余许可证 |

## 错误响应

### 401 未经授权

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "Admin access required"
}
```

## 注释

- 仅限管理端点
- 当该层没有强制执行池限制时，剩余可能会报告为 `Infinity`
- 价值观是组织范围内的聚合