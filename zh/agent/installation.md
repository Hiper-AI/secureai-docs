---
sidebar_position: 2
title: "安装代理"
sidebar_label: "安装"
description: "在 Windows、Linux 和 macOS 端点上安装 SecureAI OS Agent"
---
# 安装代理

SecureAI OS Agent 是从您在 **Admin → Agent Registry → OS Agents** 中构建的 **安装程序包** 进行安装的。该包会生成一个可立即运行的命令 (Windows) 或脚本 (Linux/macOS)，其中包含两个值：**后端 URL** 和范围内的**注册密钥**。有关完整的包构建器和注册机制，请参阅[注册和安装程序包](/zh/agent/enrollment-and-packages)。

## Windows (MSI)

Windows 使用**代码签名的 MSI**。 MSI 在下载时从未被修改，因此其 Authenticode 签名保持有效 - 配置在安装时通过 `msiexec` 命令行传递，而不是烘焙到文件中。

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

|物业 |描述 |
|----------|-------------|
| `BACKEND_URL` |您的 SecureAI 后端源（端点在此处调用）。 |
| `ENROLL_KEY` |安装程序包中的范围 `agent:enroll` 密钥。 |

安装程序面板显示精确的命令以及预先填充的值 - 直接复制它。

<Tip>
**大规模部署**

通过现有的 MDM/RMM（Intune、GPO、SCCM 等）推送相同的 `msiexec` 命令。由于 URL 和密钥是命令行属性，因此一个签名的 MSI 适用于每个租户和组。
</Tip>

## Linux / macOS（脚本）

从安装程序包中下载独立的 shell 脚本并运行它。该脚本提取适当的 `.deb`/`.pkg` 并写入代理配置（例如，Linux 上的 `/etc/secureai-agent.toml`，macOS 上的 LaunchAgent plist）。

```bash
sudo ./secureai-agent-install.sh
```

后端 URL 和注册密钥已嵌入为您的包生成的脚本中。

## 第一次运行时会发生什么

首次启动时，代理**注册**：它提供注册密钥、注册设备并接收每个设备的令牌及其运行时配置。然后它开始检测信号并应用其解析的[策略](/zh/agent/policies-and-groups)。有关详细信息，请参阅[注册和安装程序包](/zh/agent/enrollment-and-packages)，包括如何解析后端 URL 以及如何轮换设备令牌。

## 相关

- [注册和安装程序包](/zh/agent/enrollment-and-packages)
- [策略和组](/zh/agent/policies-and-groups)
- [端点代理概述](/zh/agent/overview)