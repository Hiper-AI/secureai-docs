---
id: splunk-security
title: "Splunk 安全集成"
sidebar_label: "Splunk安全"
description: "集成指南：通过 HTTP 事件收集器 (HEC) 连接 Splunk SIEM 与 HiperAI"
---
# Splunk 安全集成

集成指南：将 Splunk SIEM 与 HiperAI 连接

本指南介绍了配置 Splunk 以通过 HTTP 事件收集器 (HEC) 从 HiperAI 接收安全日志的必要步骤。

## 第 1 步：创建新索引

首先，我们将创建一个专用空间来存储应用程序的日志。

### A. 从 Splunk 主屏幕，导航至设置 > 索引。

<div class="mac-window">
  ![Splunk 设置索引](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. 单击右上角的“新建索引”按钮。

### C.配置索引：

- **索引名称**：`secureai_events`
- 将所有其他选项保留为标准配置的默认值。
- 单击**保存**。

<div class="mac-window">
  ![Splunk 索引配置](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

您的新索引现已创建并准备好接收数据。

## 步骤 2：启用 HTTP 事件收集器 (HEC)

接下来，我们将确保 Splunk 正在侦听传入的数据请求。

### A. 转至设置 > 数据输入。

<div class="mac-window">
  ![Splunk 数据输入](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. 在“本地输入”下，单击 HTTP 事件收集器。

<div class="mac-window">
  ![Splunk HTTP 事件收集器](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. 在右上角，单击全局设置。

### D. 验证以下配置：

- **所有令牌**：必须启用。
- **启用 SSL**：（可选）建议在生产环境中使用此选项，但可以在初始测试中禁用。
- **HTTP 端口号**：确保端口为 8088。
- 单击**保存**。

<div class="mac-window">
  ![Splunk HEC 全局设置](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## 步骤 3：创建 HEC 令牌

该令牌是我们的应用程序将用于通过 Splunk 进行身份验证的安全访问密钥。

### A. 返回 HTTP 事件收集器页面（设置 > 数据输入 > HTTP 事件收集器）。

### B. 单击“新建令牌”按钮。

<div class="mac-window">
  ![Splunk 新令牌按钮](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. 令牌配置（选项卡 1）：

- **姓名**：`token_secureai_app`
- **描述**：（可选）添加简短描述。
- **启用索引器确认**：**重要**：确保取消选中此复选框。
- 单击**下一步**。

<div class="mac-window">
  ![Splunk 令牌配置](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. 输入设置（选项卡 2）：

- **来源类型**：单击选择。在搜索字段中，输入 `_json` 并从列表中选择它。这告诉 Splunk 期望 JSON 格式的数据。
- **允许的索引**：在“可用索引”列中，找到我们创建的索引（`secureai_events`）并单击它，将其移动到“选定索引”列。
- **默认索引**：从下拉菜单中选择`secureai_events`。

<div class="mac-window">
  ![Splunk 输入设置](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- 点击“**审核**”，然后点击“**提交**”。

<div class="mac-window">
  ![Splunk 审核并提交](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. 复制令牌值！

Splunk 现在将显示令牌值。立即复制并将其保存在安全位置。这是您需要在我们的应用程序中配置的令牌。

<div class="mac-window">
  ![Splunk 令牌值](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## 步骤 4：最终确定并共享信息

你快完成了。只是最后一步。

### A. 收集信息

为了完成集成，应用程序需要以下三条信息：

1. **HEC URL**：Splunk 服务器的地址和 HEC 端口（例如 `http://splunk.yourcompany.com:8088/services/collector`）。
2. **HEC 令牌**：您在上一步中复制的值。
3. **索引名称**：您创建的索引的名称（`secureai_events`）。

<div class="mac-window">
  ![Splunk 索引信息](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. 查看防火墙规则

确保应用程序服务器和 Splunk 服务器之间的任何防火墙都允许 HEC 端口（通常为 TCP 8088）上的流量。

## 步骤 4：数据格式注意事项（Sourcetype）

为了确保正确识别和解析数据，我们的应用程序以特定的结构化 JSON 格式发送日志。

**重要**：从 SecureAI 发送的所有事件都将具有源类型 `secureai:json`。

该值直接在我们的应用程序发送的数据有效负载中设置，因此它将自动覆盖您为令牌选择的默认源类型（`_json`）。不需要采取进一步的操作，但重要的是您要知道您将在搜索中找到 sourcetype="secureai:json" 下的数据。

## 步骤 6：验证集成

将集成详细信息输入 SecureAI 应用程序后，您可以验证连接是否正常工作。

### A. 测试连接

使用我们的应用程序中的“测试连接”按钮。这会将测试事件发送到您的 Splunk 索引。

<div class="mac-window">
  ![Splunk 测试连接](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

如果事件发送正确，您将看到一条成功消息；如果提供的任何数据不正确，您将看到一条错误消息。

### B. 在 Splunk 中查找测试事件

要查看事件是否已到达 Splunk，请转至搜索和报告应用程序。

在搜索栏中，搜索您的索引（例如 `index="secureai_events"`）。

将时间范围设置为“过去 24 小时”。您应该看到测试日志出现在结果中。

<div class="mac-window">
  ![Splunk 搜索结果](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**注意**：根据网络流量和系统负载，日志有时可能需要长达 10 分钟才能显示在 Splunk 中。

## 完成！

通过这些步骤，您的 Splunk 实例已完全配置为与 SecureAI 集成。