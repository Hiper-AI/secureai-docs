---
id: elastic-security
title: "弹性安全集成"
sidebar_label: "弹性安全"
description: "将 HiperAI 与 Elastic Security 集成以进行高级威胁检测和安全分析"
---
# 将 SecureAI 与 Elastic 集成 SIEM

本指南提供有关如何将 SecureAI 与 Elastic SIEM 实例集成的分步说明。此集成允许您将事件日志从 SecureAI 转发到 Elasticsearch 以进行监控、分析和警报。

## 步骤 1：获取您的 Elastic Cloud 端点

首先，您需要从 Elastic Cloud 部署获取终端节点 URL。

1. 登录您的弹性云账户。
2. 从主页找到您所需的部署。
3. 找到 Elasticsearch 端点 URL 并复制它。稍后您将需要它来进行 SecureAI 配置。

<div class="mac-window">
  ![弹性云端点](/img/elastic%20images/Elastic%20-%201.png)
</div>

## 步骤 2：在 Elasticsearch 中创建 API 密钥

SecureAI 需要 API 密钥才能安全地将数据发送到您的 Elasticsearch 集群。

1. 在 Kibana 仪表板中，导航到 **管理** > **API 密钥**。
2. 单击**创建 API 密钥**按钮。

<div class="mac-window">
  ![创建 API 密钥按钮](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. 使用以下详细信息配置 API 密钥：

<div class="mac-window">
  ![配置 API 密钥](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **名称**：`secureai-siem-integration`（或其他描述性名称）。
   - **角色**：分配具有写入索引所需权限的角色。为了简单起见，在本指南中，我们没有设置到期日期或特定角色限制。
4. 单击**创建 API 密钥**。

<div class="mac-window">
  ![点击创建 API 密钥](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. 将生成并显示您的密钥。复制 Base64 编码的 API 密钥并将其保存在安全位置。离开此屏幕后，您将无法再次看到它。

<div class="mac-window">
  ![API 密钥生成](/img/elastic%20images/Elastic%20-%205.png)
</div>

## 步骤3：在Elasticsearch中创建目标索引

您必须在 Elasticsearch 中创建并映射一个用于存储 SecureAI 事件的索引。

1. 在 Kibana 中，导航至 **开发人员工具**。
2. 在控制台中，执行以下命令以使用适当的字段映射创建 `secureai-events` 索引：

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![在开发者工具中创建索引](/img/elastic%20images/Elastic%20-%206.png)
</div>

## 步骤 4：在 SecureAI 中配置弹性 SIEM 集成

现在，将 Elastic 详细信息输入 SecureAI 集成面板。

1. 在 SecureAI 仪表板中，导航至 **集成**。
2. 找到 **Elastic SIEM** 集成卡并单击 **配置**。
3. 填写配置字段，如下所示：
   - **集成名称**：`secureai-app-elastic`
   - **弹性 URL**：粘贴您在步骤 1 中复制的端点。
   - **弹性 API 密钥**：粘贴您在步骤 2 中创建的 Base64 编码 API 密钥。
   - **弹性指数**：`secureai-events`
   - **选择事件类别**：选中所有复选框以将所有可用事件类型转发到您的 Elastic SIEM。
4. 单击“**更新**”保存配置。

<div class="mac-window">
  ![点击更新保存配置](/img/elastic%20images/Elastic%20-%207.png)
</div>

## 步骤 5：测试并验证连接

保存配置后，测试连接以确保 SecureAI 可以与您的 Elastic 实例进行通信。

1. 在集成设置模式中，单击“**测试连接**”按钮。
2. 您应该看到一条成功消息：“测试成功！连接已验证。”

<div class="mac-window">
  ![测试成功消息](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. 要确认已收到测试数据，请转至 Kibana 中的 **Discover**。
4. 选择`secureai-events`数据视图（索引模式）。
5. 您应该会看到来自 SecureAI 的测试事件日志，该日志确认集成正常工作。

<div class="mac-window">
  ![测试事件日志确认](/img/elastic%20images/Elastic%20-%209.png)
</div>

您的 SecureAI 和 Elastic SIEM 集成现已激活。事件发生时将记录在您的 `secureai-events` 索引中。

## 完成！

通过这些步骤，您的 Elastic 实例已完全配置为与 SecureAI 集成。