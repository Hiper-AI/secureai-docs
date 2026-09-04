---
id: microsoft-sentinel
title: "微软哨兵集成"
sidebar_label: "微软哨兵"
description: "集成指南：通过 Azure 数据收集规则 (DCR) 连接 Microsoft Sentinel 与 HiperAI"
---
# Microsoft Sentinel 集成

集成指南：将Microsoft Sentinel与HiperAI连接

本指南介绍了配置 Microsoft Sentinel 以通过 Azure 数据收集规则 (DCR) 从 SecureAI 接收安全日志的必要步骤。

## 第 1 步：创建应用程序身份（应用程序注册）

首先，我们将在 Azure 中为您的应用程序创建一个身份，使其能够安全地进行身份验证。

### A. 转到 Azure Active Directory

在 Azure 门户中，搜索并选择 **Azure Active Directory**。

<div class="mac-window">
  ![Azure Active Directory 搜索](/img/ms%20sentinel%20-%20images/Sentinel%20-%201.png)
</div>

### B. 新注册

在左侧菜单上，导航至 **应用程序注册**，然后单击 **+ 新注册**。

<div class="mac-window">
  ![应用程序注册菜单](/img/ms%20sentinel%20-%20images/Sentinel%20-%202.png)
</div>

### C. 命名应用程序

提供一个明确的名称，例如 `SecureAI-Log-Ingester` 并将其他选项保留为默认值。单击**注册**。

<div class="mac-window">
  ![应用注册表](/img/ms%20sentinel%20-%20images/Sentinel%20-%203.png)
</div>

### D. 复制 ID

从新应用程序的概述页面，复制并安全存储以下值：
- **应用程序（客户端）ID**
- **目录（租户）ID**

<div class="mac-window">
  ![带有 ID 的应用程序概述](/img/ms%20sentinel%20-%20images/Sentinel%20-%204.png)
</div>

### E. 创建客户端密钥

在左侧菜单中，转到 **证书和机密**，然后单击 **+ 新客户端机密**。提供描述（例如“SentinelLogKey”）并单击“**添加**”。

<div class="mac-window">
  ![创建客户端密钥](/img/ms%20sentinel%20-%20images/Sentinel%20-%205.png)
</div>

**关键步骤**：立即复制秘密的**值**。这是唯一一次完全可见。将其与其他 ID 一起安全存放。

<div class="mac-window">
  ![客户端秘密值](/img/ms%20sentinel%20-%20images/Sentinel%20-%206.png)
</div>

## 步骤 2：创建 Azure 摄取基础设施

现在，我们将为您的日志构建“路径”和“存储”。

### A. 创建数据收集端点 (DCE)

#### 1. 找到服务

在 Azure 搜索栏中，搜索并选择“**数据收集终结点**”。

<div class="mac-window">
  ![搜索数据收集端点](/img/ms%20sentinel%20-%20images/Sentinel%20-%207.png)
</div>

#### 2.创建一个新的DCE

单击 **+ 创建**。

<div class="mac-window">
  ![创建数据收集端点](/img/ms%20sentinel%20-%20images/Sentinel%20-%208.png)
</div>

#### 3. 配置 DCE

- **姓名**：`dce-secureai-integration`
- **区域**：选择与您的 Log Analytics 工作区相同的区域
- 单击“**查看 + 创建**”，然后单击“**创建**”

<div class="mac-window">
  ![查看并创建 DCE](/img/ms%20sentinel%20-%20images/Sentinel%20-%209.png)
</div>

#### 4. 复制 URI

部署后，导航到资源。在其概述页面上，复制 **日志摄取 URI** 并保存。

<div class="mac-window">
  ![带 URI 的 DCE 概述](/img/ms%20sentinel%20-%20images/Sentinel%20-%2010.png)
</div>

### B. 创建自定义表和数据收集规则 (DCR)

#### 1. 转到日志分析

导航到您的 **Log Analytics 工作区**。

#### 2. 创建自定义表

在左侧菜单中，单击“**表**”，然后单击“**+ 创建**”，然后选择“**新建自定义日志（基于 DCR）**”。

<div class="mac-window">
  ![创建自定义表](/img/ms%20sentinel%20-%20images/Sentinel%20-%2011.png)
</div>

#### 3.“基本”选项卡

- **表名称**：`secureaitosiem`（Azure 将自动附加 `_CL`，使全名成为 `secureaitosiem_CL`）
- **数据收集规则**：选择“创建新...”并将其命名为`dcr-secureai-events`

<div class="mac-window">
  ![数据收集规则设置](/img/ms%20sentinel%20-%20images/Sentinel%20-%2012.png)
</div>

- **数据收集端点**：选择您之前创建的 DCE (`dce-secureai-integration`)
- 单击**下一步：架构和转换**

<div class="mac-window">
  ![下一个架构和转换](/img/ms%20sentinel%20-%20images/Sentinel%20-%2013.png)
</div>

#### 4.“架构和转换”选项卡

**上传示例文件**：系统会提示您。创建一个包含以下内容的 `.json` 文件并上传：

```json
[
  {
    "time": "2025-08-30T21:34:29.013Z",
    "level": "Info",
    "message": "SecureAI platform started successfully",
    "component": "SystemService",
    "correlationId": "test-001"
  },
  {
    "time": "2025-08-30T21:34:30.013Z",
    "level": "Warning",
    "message": "High memory usage detected on server",
    "component": "MonitoringService",
    "correlationId": "test-002"
  },
  {
    "time": "2025-08-30T21:34:31.013Z",
    "level": "Error",
    "message": "Database connection timeout after 30 seconds",
    "component": "DatabaseService",
    "correlationId": "test-003"
  },
  {
    "time": "2025-08-30T21:34:32.013Z",
    "level": "Info",
    "message": "User admin@secureai.com logged in successfully",
    "component": "AuthService",
    "correlationId": "test-004"
  },
  {
    "time": "2025-08-30T21:34:33.013Z",
    "level": "Warning",
    "message": "API rate limit approaching threshold",
    "component": "APIGateway",
    "correlationId": "test-005"
  },
  {
    "time": "2025-08-30T21:34:34.013Z",
    "level": "Info",
    "message": "Security scan completed - 0 threats found",
    "component": "SecurityScanner",
    "correlationId": "test-006"
  },
  {
    "time": "2025-08-30T21:34:35.013Z",
    "level": "Error",
    "message": "Failed to sync with external SIEM system",
    "component": "SIEMSync",
    "correlationId": "test-007"
  },
  {
    "time": "2025-08-30T21:34:36.013Z",
    "level": "Info",
    "message": "Backup job completed successfully",
    "component": "BackupService",
    "correlationId": "test-008"
  }
]
```

**下载示例文件**：您还可以下载完整的示例 JSON 文件直接使用：

<a href="/zh/sample-json.json" download>📥sample.json</a>

#### 5. 应用转换

系统可能会显示有关 TimeGenerated 字段的警告。单击 **转换编辑器** 按钮，删除所有现有内容，然后粘贴以下完整的 KQL 查询：

```kql
source
| extend TimeGenerated = todatetime(['time'])
| project
    TimeGenerated,
    Level_s = tostring(['level']),
    Message_s = tostring(['message']),
    Component_s = tostring(['component']),
    CorrelationId_s = tostring(['correlationId'])
```

<div class="mac-window">
  ![KQL转换查询](/img/ms%20sentinel%20-%20images/Sentinel%20-%2014.png)
</div>

单击**应用**。您应该看到包含所有正确列和数据类型的表预览。

<div class="mac-window">
  ![应用转换](/img/ms%20sentinel%20-%20images/Sentinel%20-%2015.png)
</div>

#### 6. 完成创建

单击“**下一步：查看 + 创建**”，然后单击“**创建**”。

<div class="mac-window">
  ![查看并创建 DCR](/img/ms%20sentinel%20-%20images/Sentinel%20-%2016.png)
</div>

## 步骤 3：将身份连接到基础设施（权限）

这一关键步骤授予我们的应用程序使用我们刚刚创建的数据收集规则的权限。

### A. 转到您的新 DCR

搜索并打开数据收集规则 `dcr-secureai-events`，然后在“概述”中复制不可变 ID 并将其保存以进行集成。

<div class="mac-window">
  ![具有不可变 ID 的 DCR 概述](/img/ms%20sentinel%20-%20images/Sentinel%20-%2017.png)
</div>

### B. 分配角色

在左侧菜单上，转到 **访问控制 (IAM)** 并单击 **+ 添加** → **添加角色分配**。

<div class="mac-window">
  ![添加角色分配](/img/ms%20sentinel%20-%20images/Sentinel%20-%2018.png)
</div>

**角色**：搜索并选择**Monitoring Metrics Publisher**。

<div class="mac-window">
  ![选择监控指标发布者角色](/img/ms%20sentinel%20-%20images/Sentinel%20-%2019.png)
</div>

**成员**：单击**选择成员**并搜索您的应用程序注册名称 (`SecureAI-Log-Ingester`)。选择它。

<div class="mac-window">
  ![选择应用注册会员](/img/ms%20sentinel%20-%20images/Sentinel%20-%2020.png)
</div>

单击“**查看 + 分配**”。

## 步骤 4：最终确定并共享信息

你快完成了。只是最后一步。

### A. 收集信息

为了完成集成，应用程序需要以下六项信息：

1. **租户 ID**：（来自第 1 步）
2. **客户端 ID**：（来自步骤 1）
3. **客户端秘密**：（来自步骤 1）
4. **DCE URI**：（来自步骤 2A）
5. **DCR 不可变 ID**：（导航到 DCR `dcr-secureai-events` 并从 JSON 视图复制此内容）
6. **流名称**：这是一个构造值。格式为`Custom-{TableName}`。在我们的例子中，它将是：`Custom-secureaitosiem_CL`

### B. 配置应用程序

将这 6 个值输入到应用程序的配置设置中。

<div class="mac-window">
  ![应用程序配置设置](/img/ms%20sentinel%20-%20images/Sentinel%20-%2021.png)
</div>

## 步骤 5：验证集成

将集成详细信息输入 SecureAI 应用程序后，您可以验证连接是否正常工作。

### A. 测试连接

使用我们的应用程序中的“测试连接”按钮。这会将测试事件发送到您的 Microsoft Sentinel 工作区。

### B. 在 Log Analytics 中查找测试事件

要查看事件是否到达 Microsoft Sentinel，请转到 Log Analytics 工作区并单击 **日志**。

运行以下查询以查看传入的数据：

```kql
secureaitosiem_CL
| order by TimeGenerated desc
```

您应该会看到日志数据显示，并且所有列（`TimeGenerated`、`Level_s`、`Message_s` 等）均已正确填充。如果是这样，您的集成就成功了！ ✅

<div class="mac-window">
  ![集成验证成功](/img/ms%20sentinel%20-%20images/Sentinel%20-%2022.png)
</div>

**注意**：根据网络流量和系统负载，有时日志可能需要长达 10 分钟才能显示在 Microsoft Sentinel 中。

## 完成！

通过这些步骤，您的 Microsoft Sentinel 实例已完全配置为与 SecureAI 集成。