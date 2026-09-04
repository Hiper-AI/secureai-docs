---
sidebar_position: 2
title: "Google Workspace (单点登录)"
---
# Google Workspace (SSO) 积分

本指南将引导您完成使用 SecureAI 配置 Google Workspace 以进行单点登录 (SSO) 的过程。您将了解如何从 Google Cloud Console 获取必要的凭据并提交它们以完成集成。

## 先决条件

- 管理员访问 Google Cloud Console
- 您的组织的 Google Workspace 帐户
- 访问您组织的 Google Workspace 管理控制台（如果使用域限制）
- SecureAI 的管理员访问权限

## 步骤 1：在 Google Cloud Console 中创建项目

1.登录[Google Cloud Console](https://console.cloud.google.com)
2. 单击页面顶部的项目下拉列表
3. 单击“**新建项目**”

<div class="mac-window">
  ![新项目](/img/google%20sso%20images/google%20-%201.png)
</div>

4. 输入项目名称（例如“SecureAI SSO”）
5. 单击“**创建**”

<div class="mac-window">
  ![创建项目](/img/google%20sso%20images/google%20-%202.png)
</div>

## 步骤 2：启用 Google+ API（如果需要）

1. 在您的项目中，转到 **API 和服务** > **库**
2. 搜索“Google+ API”或“Google 身份”
3. 单击它并单击“**启用**”（如果尚未启用）
4. **注意**：现代 Google OAuth 可能不需要此功能，但启用它可确保兼容性

## 步骤 3：配置 OAuth 同意屏幕

1. 转至 **API 和服务** > **OAuth 同意屏幕**

<div class="mac-window">
  ![OAuth 同意屏幕](/img/google%20sso%20images/google%20-%203.png)
</div>

2.填写所需信息：
   - **应用程序名称**：输入名称（例如“SecureAI”）
   - **用户支持电子邮件**：选择支持电子邮件地址
   - **联系信息**：添加联系电子邮件地址

3. 选择**用户类型**：
   - **内部**：仅适用于您的 Google Workspace 组织中的用户（建议公司使用）
   - **外部**：适用于组织外部的用户

4. 单击“**创建**”

<div class="mac-window">
  ![创建 OAuth 同意](/img/google%20sso%20images/google%20-%204.png)
</div>

5. **品牌**：
   - 转到左侧菜单中的 **品牌** 部分
   - 查找**授权域**并添加您的公司域
   - 这允许用户使用他们的公司电子邮件地址登录
   - （此外，如果需要，您可以添加主页 URL、隐私政策和服务条款）

<div class="mac-window">
  ![授权域名](/img/google%20sso%20images/google%20-%205.png)
</div>

6. **范围**：
   - 在左侧菜单中，单击“**数据访问**”部分
   - 在“数据访问”部分中，单击“**添加或删除范围**”
   - 左侧将会打开一个窗口，您可以在其中搜索角色
   - 搜索角色 **“openid”** 并选择它
   - 单击**更新**
   - 然后单击数据访问部分中的**保存**
   - **注意**：`openid` 范围自动包含 `profile` 和 `email` 访问权限 - 您无需单独添加它们
   - 如果您看到其他范围选项，您只需要 **OpenID** for SecureAI SSO

<div class="mac-window">
  ![OpenID 范围选择](/img/google%20sso%20images/google%20-%206.png)
</div>

   - **重要**：OpenID 范围提供对以下内容的访问：
     - 用户的电子邮件地址
     - 基本个人资料信息
     - 这就是 SecureAI 身份验证所需的全部内容

7. **测试用户**（如果使用外部）：
   - 在测试过程中如果需要添加测试用户
   - 单击**保存并继续**

8. **总结**：
   - 检查您的配置
   - 单击**返回仪表板**

## 步骤 4：创建 OAuth 2.0 凭证

1. 转至 **API 和服务** > **凭证**
2. 单击 **+ 创建凭据** > **OAuth 客户端 ID**

<div class="mac-window">
  ![创建 OAuth 客户端 ID](/img/google%20sso%20images/google%20-%207.png)
</div>
3. **应用程序类型**：选择**Web应用程序**
4. **名称**：输入描述性名称（例如“SecureAI SSO Client”）
5. **授权重定向 URI**：单击 **+ 添加 URI** 并输入：
   - `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
   - **重要**：URL 必须完全匹配（包括 `https://` 和 `/api/auth/google/callback`）

<div class="mac-window">
  ![授权重定向 URI](/img/google%20sso%20images/google%20-%208.png)
</div>

6. 单击“**创建**”

## 第 5 步：获取您的凭据

创建 OAuth 客户端后：

1. 将出现一个弹出窗口，其中包含您的凭据

<div class="mac-window">
  ![OAuth 凭据弹出窗口](/img/google%20sso%20images/google%20-%209.png)
</div>
2. **客户端ID**：
   - 看起来像：`123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`
   - **复制此值** - 您稍后将需要它
3. **客户秘密**：
   - 看起来像：`GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **立即复制该值**
   - **警告**：此秘密仅在弹出窗口中显示一次。如果丢失，您将需要创建一个新的 OAuth 客户端

## 步骤 6：将变量发送给 Hiper AI 团队

在 Google Cloud Console 中创建 OAuth 客户端并按照上述步骤操作后，您将获得以下关键信息：

1. **客户端 ID**（来自步骤 5）
2. **客户端秘密**（来自步骤 5）
3. **重定向 URI**: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`

您必须将这些值发送给 Hiper AI 团队才能完成 SSO 集成。

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

   - **主题**：输入 **“Google Workspace SSO 集成”**
   - **说明**：粘贴您在设置过程中复制的值：
     - 客户ID
     - 客户秘密
     - 重定向 URI：`https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
4. 单击**“提交请求”**按钮

### C. 等待确认

- 您将在 **24 至 72 小时**内收到一封确认电子邮件（取决于供应情况）
- 该电子邮件将确认您的 SSO 已成功配置
- 配置完成后，您将能够使用登录页面上的 **“继续使用 Google”** 登录按钮访问您的 SecureAI 实例

**重要**：在集成完成之前，请确保您的凭据安全。不要通过不安全的渠道分享它们。

## 用户配置

### 现有用户

已在 SecureAI 中拥有帐户的用户（无论是否使用基本身份验证）**不需要重新创建**。他们可以继续使用现有帐户，并且在配置后也可以使用 Google Workspace SSO 登录。

**重要**：Google Workspace 中的用户电子邮件必须与 SecureAI 中的电子邮件完全匹配，SSO 才能正常工作。

### 创建新的 SSO 用户

对于应仅通过 SSO 访问 SecureAI 的新用户：

1. 导航至 SecureAI 管理面板中的 **用户管理**
2.点击创建新用户
3. 创建用户时，选择**“企业帐户/SSO”**选项
4. 此配置可确保：
   - 新用户**不会收到生成密码的电子邮件**
   - 用户将能够直接使用 Google Workspace SSO** 登录按钮访问 SecureAI
   - Google Workspace中的用户电子邮件必须与SecureAI中输入的电子邮件完全匹配

## 故障排除

### 错误：“redirect_uri_mismatch”

- 验证 Google Cloud Console 中的重定向 URI 是否与服务器上的配置完全匹配
- 确保包含 `https://`（不在生产中包含 `http://`）
- 重定向 URI 必须准确无误：`https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
- 检查结尾斜杠或拼写错误

### 错误：“在 SecureAI 数据库中找不到用户”

- 用户必须事先在SecureAI中注册
- 联系SecureAI管理员创建用户帐户
- 验证 Google Workspace 中的电子邮件地址与 SecureAI 中的电子邮件地址完全匹配

### 错误：“Google Workspace 登录不允许使用电子邮件域”

- 用户的电子邮件域不在允许的域列表中
- 联系您的开发团队将您的域添加到允许列表中
- 或者验证域限制配置是否正确

### 错误：“access_denied”或“unauthorized_client”

- 验证 OAuth 同意屏幕是否已正确配置
- 检查您的申请是否已获得批准（如果使用外部用户类型）
- 确保客户端 ID 和客户端密钥正确

### 错误：“invalid_client”

- 客户端密码可能已重置或不正确
- 在 Google Cloud Console 中验证客户端密钥
- 如果需要，创建新的客户端密钥，并为您的开发团队提供新的价值

## 客户端秘密安全最佳实践

1. **永远不要将机密提交到代码存储库**
2. **定期轮换机密**（建议：每 90 天一次）
3. **限制对 Google Cloud Console 凭据页面的访问**
4. **与开发团队共享秘密时使用安全通道**
5. **在 Google Cloud Console 中监控使用情况**是否存在可疑活动

## 客户秘密更新

要轮换您的客户端密钥（建议每 90 天一次）：

1. 转至 **API 和服务** > **凭证**
2. 找到您的 OAuth 2.0 客户端 ID
3. 单击 **铅笔图标**（编辑）
4. 在 **客户端密码** 部分中，单击 **重置密码**
5. **立即复制**新的秘密值
6. 通过管理面板支持请求向您的开发团队提供新的秘密
7. 他们会在不中断服务的情况下更新配置
8. 确认新密钥有效后，您可以选择删除旧密钥

**注意**：轮换期间有一个短暂的重叠期，两个秘密都起作用，从而实现平稳过渡。

## 测试 SSO 登录

配置完成后：

1. 进入您的SecureAI登录页面
2. 点击**继续使用 Google**
3. 选择您的Google Workspace帐户
4. 如果出现提示，请授予权限
5. 您应该被重定向到 SecureAI 并登录

如果您遇到问题：
- 清除浏览器cookie并重试
- 验证您使用的是正确的 Google Workspace 帐户
- 检查您的电子邮件是否存在于 SecureAI 中

## 支持

如果您在配置过程中遇到问题：

1. 验证您在 Google Cloud Console 中是否拥有管理员权限
2. 验证您是否具有 Google Workspace 管理员访问权限（如果使用域限制）
3. 通过管理面板支持请求联系您的开发团队：
   - 错误的屏幕截图
   - 客户端 ID（您可以共享此信息 - 它不敏感）
   - 完整的错误信息
   - 任何相关的浏览器控制台错误

**切勿在支持请求中共享您的客户端密钥** - 仅在建立身份验证后通过安全渠道共享。

## 其他资源

- [Google Cloud 控制台文档](https://cloud.google.com/docs)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Google Workspace 管理员帮助](https://support.google.com/a)