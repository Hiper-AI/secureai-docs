---
id: custom-siem-webhook
title: "自定义 SIEM/Webhook 集成"
sidebar_label: "自定义 SIEM/Webhook"
description: "通用 SIEM（HTTP/Webhook）集成，用于将 SecureAI 安全日志发送到任何自定义 HTTP 端点"
---
# 通用 SIEM (HTTP/Webhook) 集成

## 概述

通用 SIEM (HTTP/Webhook) 集成允许您将 SecureAI 安全日志发送到任何自定义 HTTP 端点。这非常适合与没有本机支持、自定义安全工具或任何基于 HTTP 的日志系统的 SIEM 系统集成。

## 用例

- **自定义 SIEM 系统**：将日志发送到您的内部安全监控工具
- **第三方安全平台**：与接受 webhooks 的安全工具集成
- **自定义仪表板**：构建您自己的安全事件可视化
- **测试和开发**：使用 webhook 测试服务来验证日志传递
- **旧系统**：连接到仅支持 HTTP 端点的旧安全工具

## 配置步骤

### 1. 获取测试端点

出于测试目的，我们建议使用 webhook.site：

1.访问[https://webhook.site](https://webhook.site)
2. 复制您的唯一 URL（例如 `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`）
3. 保持此页面打开以监控传入的 webhook

<div class="mac-window">
  ![Webhook.site 测试端点](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%201.png)
</div>

### 2. 配置集成

1. 导航至 SecureAI 管理面板中的 **集成**
2. 在 SIEM 类别中查找 **“通用 SIEM (HTTP/Webhook)”**
3. 单击**“连接集成”**

### 3.填写配置

#### 基本设置

- **集成名称**：`Test Generic SIEM`（或任何描述性名称）
- **端点 URL**：`https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`
- **HTTP 方法**：`POST`（推荐用于大多数 SIEM 平台）
- **HTTP 标头**：`{"Content-Type": "application/json"}`

<div class="mac-window">
  ![HTTP 标头配置](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%202.png)
</div>

#### 活动类别

选择要转发的事件类型：

✅ **推荐用于测试：**
- 身份验证和登录
- API 和模型使用
- 数据访问和 PHI
- SMLTP 和政策
- 计费和使用限制
- 分析

⚠️ **可选（可能会产生大量）：**
- 安全与违规
- 系统与基础设施
- 配置变更

### 4. 测试连接

1. 点击**“测试连接”**来验证连接

<div class="mac-window">
  ![测试连接按钮](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%203.png)
</div>

2. 检查 webhook.site - 您应该看到测试请求
3. 验证响应是否显示成功

<div class="mac-window">
  ![成功响应验证](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%204.png)
</div>

### 5. 保存并监控

1. 点击**“连接”**保存配置
2. 在 SecureAI 系统中执行操作（登录、API 调用等）
3.监控webhook.site查看实时日志

## 高级配置

### 自定义标头

您可以添加自定义标头以进行身份验证或特定要求：

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-api-key",
  "X-Custom-Header": "custom-value"
}
```

### 何时使用自定义 SIEM

自定义 SIEM 集成在以下场景中特别有用：

- **无 SIEM 系统**：如果您当前不使用任何 SIEM 平台，这提供了一种开始收集安全日志的简单方法
- **其他数据目的地**：同时将数据发送到多个位置（例如，您的主 SIEM + 备份系统）
- **自定义工具**：与专用安全工具、数据中心或自定义仪表板集成
- **通信平台**：向 Teams 渠道、Slack 或其他协作工具发送警报
- **旧系统**：连接到仅支持 HTTP 端点的旧安全工具
- **测试和开发**：在生产部署之前使用 webhook 测试服务验证日志传递

**注意**：如果您已有受支持的 SIEM（Splunk、Microsoft Sentinel、Elastic），我们建议使用我们的本机集成以获得最佳性能和功能。

## 故障排除

### 常见问题

1. **连接超时**：检查端点是否可访问并响应
2. **身份验证错误**：验证 API 密钥和身份验证标头
3. **SSL/TLS 问题**：确保 HTTPS 端点的证书验证正确

### 监控

- 在 SecureAI 管理面板中检查集成状态
- 监控 webhook 传送成功率
- 在日志中查看失败的 Webhook 尝试
- 验证端点可用性和响应时间

## 安全考虑

- **仅 HTTPS**：在生产中始终使用 HTTPS 端点
- **身份验证**：为您的 Webhook 端点实施正确的身份验证
- **速率限制**：在端点上配置适当的速率限制
- **日志保留**：实施适当的日志保留策略以确保合规性
- **访问控制**：仅限授权系统访问 Webhook 端点

## 最佳实践

1. **从小事做起**：从基本的活动类别开始，逐步扩大
2. **彻底测试**：使用 webhook.site 或类似服务进行初始测试
3. **监控性能**：监视 Webhook 传送延迟或失败
4. **文档配置**：保留您的 webhook 设置的详细记录
5. **定期审查**：定期审查和更新Webhook配置
6. **备份计划**：在 Webhooks 失败时有替代的日志记录方法

## 完成！ 

通过这些步骤，您的自定义 Webhook 实例已完全配置为与 SecureAI 集成。