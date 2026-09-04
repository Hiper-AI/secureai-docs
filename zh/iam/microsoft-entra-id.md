---
sidebar_position: 3
title: "微软 Entra ID (SSO)"
---
# Microsoft Entra ID (SSO) 积分

本指南将引导您完成使用 SecureAI 配置 Microsoft Entra ID（以前称为 Azure Active Directory）以实现单点登录 (SSO) 的过程。您将了解如何从 Azure 获取必要的凭据并提交它们以完成集成。

## 先决条件

- 管理员访问 Azure 门户
- Azure Entra ID (Azure AD) 租户
- SecureAI 的管理员访问权限

## 步骤 1：在 Azure 门户中创建应用程序

1.登录[Azure门户](https://portal.azure.com)
2. 搜索并选择 **Azure Active Directory** 或 **Microsoft Entra ID**

<div class="mac-window">
  ![Azure 门户搜索](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

3. 在侧面菜单中，选择**应用程序注册**

<div class="mac-window">
  ![应用程序注册菜单](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

4. 点击**+新注册**

<div class="mac-window">
  ![新注册按钮](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

## 步骤 2：配置应用程序

1. **名称**：输入描述性名称（例如“SecureAI SSO”）
2. **支持的账户类型**：
   - 选择**仅此组织目录中的帐户**
   - 或者**任何组织目录中的帐户**（如果您需要支持多个组织）
3. **重定向 URI**：
   - 平台：**网络**
   - URI：`https://your-backend-domain.com/api/auth/azure/callback`
   - **注意**：您将从您的开发团队获取此 URL
4. 点击**注册**

<div class="mac-window">
  ![注册按钮](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

## 步骤 3：获取应用程序（客户端）ID

1. 在您的申请的**概述**页面上
2. 复制 **应用程序（客户端）ID** 值
   - 这是一个如下所示的 GUID：`b96ee19f-5a15-4a85-b936-****-****`
   - **保存此值** - 您稍后将需要它

## 步骤 4：获取目录（租户）ID

1. 在同一**概述**页面上
2. 复制**目录（租户）ID** 值
   - 这是一个如下所示的 GUID：`155812d2-1112-46c8-bf52-****-****`
   - **保存此值** - 您稍后将需要它

## 步骤 5：创建客户端密钥

1. 在应用程序的侧面菜单中，选择 **证书和机密**

<div class="mac-window">
  ![证书和机密菜单](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. 在 **客户端密钥** 部分中，单击 **+ 新客户端密钥**
3. **描述**：输入描述（例如“SecureAI SSO Secret”）
4. **过期**：
   - 选择有效期（建议：24个月）
   - **重要**：确保在密钥过期之前更新密钥
5. 单击“**添加**”

<div class="mac-window">
  ![添加客户端秘密按钮](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

6. **立即**复制秘密的**值**
   - 它看起来像这样：`plm8Q~************************************`

<div class="mac-window">
  ![客户端密钥值](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>
   - **警告**：该值仅显示一次。如果你丢失了它，你将需要创建一个新的秘密
   - **安全地存储该值**

## 步骤6：配置API权限

1. 在侧面菜单中，选择 **API 权限**
2.点击**+添加权限**
3. 选择 **Microsoft Graph**
4. 选择**委派权限**
5. 检查以下权限：
   - `openid`（自动包含）
   - `profile`
   - `email`
6. 单击“**添加权限**”

<div class="mac-window">
  ![添加权限按钮](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

7. 如果您的组织需要管理员同意：
   - 单击**授予管理员同意**

<div class="mac-window">
  ![授予管理员同意按钮](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

## 步骤 7：将变量发送给 Hiper AI 团队

在 Azure 中创建应用程序并按照上述步骤操作后，您将获得三个关键信息：

1. **客户端 ID**（来自步骤 3）
2. **租户 ID**（来自第 4 步）
3. **客户端秘密值**（来自步骤 5）

您必须将这三个值发送给 Hiper AI 团队才能完成 SSO 集成。

### A. 访问管理面板

1. 以管理员身份登录您的SecureAI实例
2. 导航至`https://{enterprise.name}.hiperai.ai/admin/home`
3. 在右上角，单击您的管理员个人资料图片
4. 这将打开一个包含各种选项的下拉菜单

### B. 提交支持请求

1. 从下拉菜单中单击**“获取支持”**

<div class="mac-window">
  ![获取支持菜单](/img/microsoft%20entraid%20sso%20images/10%20-%20azure.png)
</div>

2. 将出现一个弹出窗口，其中包含支持票表格
3. 在表格中填写以下信息：
   - **类别**：选择**“集成和实施”**

<div class="mac-window">
  ![支持表单类别](/img/microsoft%20entraid%20sso%20images/11%20-%20azure.png)
</div>

   - **主题**：输入 **“Microsoft Entra ID SSO 集成”**
   - **描述**：粘贴您在设置过程中复制的三个值：
     - 客户端 ID（应用程序 ID）
     - 租户 ID（目录 ID）
     - 客户秘密值
4. 单击**“提交请求”**按钮

### C. 等待确认

- 您将在 **24 至 72 小时**内收到一封确认电子邮件（取决于供应情况）
- 该电子邮件将确认您的 SSO 已成功配置
- 配置完成后，您将能够使用登录页面上的 **“继续使用 Azure EntraID”** 登录按钮来访问 SecureAI 实例

**重要**：在集成完成之前，请确保您的凭据安全。不要通过不安全的渠道分享它们。

## 用户配置

### 现有用户

已在 SecureAI 中拥有帐户的用户（无论是否使用基本身份验证）**不需要重新创建**。他们可以继续使用现有帐户，并且在配置后还可以使用 Azure Entra ID SSO 登录。

**重要**：Azure 中的用户电子邮件必须与 SecureAI 中的电子邮件完全匹配，SSO 才能正常工作。

### 创建新的 SSO 用户

对于应仅通过 SSO 访问 SecureAI 的新用户：

1. 导航至 SecureAI 管理面板中的 **用户管理**
2.点击创建新用户
3. 创建用户时，选择**“企业帐户/SSO”**选项
4. 此配置可确保：
   - 新用户**不会收到生成密码的电子邮件**
   - 用户将能够直接使用 Azure Entra ID SSO** 登录按钮访问 SecureAI
   - 用户在Azure中的电子邮件必须与在SecureAI中输入的电子邮件完全匹配

## 故障排除

### 错误：“redirect_uri 值必须是有效的绝对 URI”
- 验证 Azure 中的重定向 URI 是否与服务器上的配置完全匹配
- 确保适当地包含 `https://` 或 `http://`

### 错误：“在 SecureAI 数据库中找不到用户”
- 用户必须事先在SecureAI中注册
- 联系SecureAI管理员创建用户帐户

### 错误：“无效的客户端密码”
- 秘密可能已过期
- 创建新的客户端密钥并更新配置

## 客户秘密更新

客户端秘密有一个到期日期。到期前：

1. 按照步骤 5 创建新的客户端密钥
2. 为您的开发团队提供新的价值
3.他们会在不中断服务的情况下更新配置

## 支持

如果您在配置过程中遇到问题：
1. 验证您在 Azure 中是否具有管理员权限
2. 联系您的开发团队：
   - 错误的屏幕截图
   - 您获得的ID（不含秘密）
   - 完整的错误信息