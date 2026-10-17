---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Microsoft Entra ID (SSO) 集成

通过此集成，您组织的用户可以使用其 Microsoft 工作帐户登录 SecureAI（即 **使用Azure Entra继续** 按钮；界面为英文时显示为 **Continue with Microsoft**）。配置为**自助式**：由您组织中的管理员在您自己的 Microsoft Entra ID 租户（以前称为 Azure Active Directory）中注册 SecureAI，然后在 **管理 → 集成** 中填写相关信息。无需提交工单，也无需等待 Hiper AI 处理：保存后，该按钮会立即出现在您的登录页面上。

预计用时：10 分钟。

## 先决条件

- 具有可创建应用注册的 Microsoft Entra 角色（例如 **应用程序开发人员** 或 **应用程序管理员**）。授予管理员同意（步骤 4）需要 **云应用程序管理员**、**应用程序管理员** 或 **全局管理员** 角色。
- SecureAI 的管理员访问权限，并在 **集成** 部分拥有 **管理员** 权限。

## 工作原理

1. 您在 Entra ID 租户中创建一个**应用注册**。SecureAI 使用 OpenID Connect（授权代码流）和**客户端密码**。
2. 您在 SecureAI 中填写**目录(租户) ID**、**应用程序(客户端) ID** 和**客户端密码值**。密码会加密存储，之后不会再显示。
3. 当用户点击 **使用Azure Entra继续** 时，Microsoft 会对其进行身份验证（应用您的 MFA 和条件访问策略）；如果用户的电子邮件与某个**活动**的 SecureAI 帐户匹配，SecureAI 就会允许其登录。

SecureAI 只接受由**您的**租户颁发的令牌：登录固定在您的目录上，绝不会使用多租户终结点（`common` / `organizations`）。

## 步骤 1：从 SecureAI 复制重定向 URI

1. 以管理员身份登录 SecureAI。
2. 转到 **管理 → 集成**，并按 **身份和访问管理** 类别筛选。
3. 在 **Microsoft Entra ID (SSO)** 卡片上，点击 **连接集成**。
4. 在 **1. Register SecureAI in Microsoft Entra ID**（在 Microsoft Entra ID 中注册 SecureAI）部分，点击 **Redirect URI**（重定向 URI）旁边的 **Copy**（复制）。

该 URI 的格式如下（使用您实例的域名）：

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

请始终使用您的实例显示的 URI：它必须逐字符完全一致，包括 `https://`。

请保持此窗口打开，稍后您需要回来粘贴相关信息。

## 步骤 2：在 Microsoft Entra ID 中注册应用程序

1. 打开 [Microsoft Entra 管理中心](https://entra.microsoft.com)（或 [Azure 门户](https://portal.azure.com) → **Microsoft Entra ID**）。

<div class="mac-window">
  ![在 Azure 门户中搜索 Microsoft Entra ID](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. 转到 **应用程序 → 应用注册**（Applications → App registrations）。

<div class="mac-window">
  ![应用注册菜单](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. 点击 **+ 新注册**（New registration）。

<div class="mac-window">
  ![新注册按钮](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. 填写表单：
   - **名称**：一个描述性名称，例如 `SecureAI SSO`。用户会在同意屏幕上看到该名称。
   - **受支持的帐户类型**：**仅此组织目录中的帐户(单租户)**（Accounts in this organizational directory only (Single tenant)）。
   - **重定向 URI**：平台选择 **Web**（不是“单页应用程序”），然后粘贴您在步骤 1 中复制的 URI。
5. 点击 **注册**。

<div class="mac-window">
  ![应用程序注册表单](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. 在应用程序的 **概述** 页面上，复制：
   - **应用程序(客户端) ID** — 一个 GUID，例如 `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`。
   - **目录(租户) ID** — 另一个 GUID，例如 `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`。

## 步骤 3：创建客户端密码

1. 在应用程序的菜单中，打开 **证书和密码**（Certificates & secrets）。

<div class="mac-window">
  ![证书和密码菜单](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. 在 **客户端密码** 下，点击 **+ 新客户端密码**。
3. 输入说明（例如 `SecureAI SSO`）并选择过期时间（Microsoft 建议少于 12 个月；最长为 24 个月）。
4. 点击 **添加**。

<div class="mac-window">
  ![添加客户端密码](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. **立即**复制 **值** 列（类似 `plm8Q~xxxxxxxx…`）。它只显示一次。

<div class="mac-window">
  ![客户端密码值](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
请复制 **值**，而不是 **机密 ID**（后者是一个 GUID）。如果粘贴的是机密 ID，SecureAI 会在保存时拒绝。
</Warning>

请记下过期日期：密码过期后，Microsoft 登录将停止工作，直到您填写新的密码（请参阅下文的“轮换客户端密码”一节）。

## 步骤 4：检查 API 权限

SecureAI 请求 Microsoft Graph 委托的权限 `openid`、`profile`、`email` 和 `User.Read`（后者用于读取用户的个人资料照片）。新注册默认已添加 `User.Read`。

1. 在应用程序的菜单中，打开 **API 权限**（API permissions）。
2. 确认 **Microsoft Graph → 委托的权限** 中包含 `User.Read`；如果希望显式列出，也可以添加 `openid`、`profile` 和 `email`（通过 **+ 添加权限 → Microsoft Graph → 委托的权限**）。

<div class="mac-window">
  ![添加委托的权限](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. 点击 **代表 [您的组织] 授予管理员同意**（Grant admin consent for …）并确认。

<div class="mac-window">
  ![授予管理员同意](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

如果您的租户不允许用户自行同意应用程序（这是企业中的常见设置），则此步骤是必需的：否则用户在登录时会看到“需要管理员批准”（Need admin approval）。

## 步骤 5：在 SecureAI 中填写信息并测试

返回 **管理 → 集成 → Microsoft Entra ID (SSO)**：

1. 在 **2. Paste the app registration details**（粘贴应用注册信息）中填写：
   - **Directory (tenant) ID**：步骤 2 中的 GUID（也可以使用租户的已验证域，例如 `contoso.onmicrosoft.com`）。
   - **Application (client) ID**：步骤 2 中的 GUID。
   - **Client secret value**：步骤 3 中的值。
   - **Allowed email domains**（允许的电子邮件域；可选，建议填写）：您组织的电子邮件域，以逗号分隔，例如 `contoso.com, contoso.co.uk`。只有这些域的地址才能使用 Microsoft 登录。如果留空，则接受您租户中任何已存在于 SecureAI 的帐户。
2. 在 **3. Test the connection**（测试连接）中，点击 **Test connection**。SecureAI 会向 Microsoft 查询（不会让任何人登录）并检查：

   | 检查项 | 失败时 |
   |---|---|
   | Directory (tenant) ID | Microsoft 不认识该租户（`AADSTS90002`）。请从“概述”页面复制目录 ID。 |
   | Application (client) ID | 该租户中不存在此应用程序（`AADSTS700016`）。请检查客户端 ID，并确认该应用位于同一租户中。 |
   | Client secret | 密码无效（`AADSTS7000215`）或已过期（`AADSTS7000222`）。请粘贴 **值**，或创建新的密码。 |

   测试使用的是表单中当前填写的内容，因此您可以在保存之前进行测试。如果您的租户有阻止仅应用令牌的条件访问策略，密码可能会显示为“Could not be verified automatically”（无法自动验证）：这不是错误——请通过实际登录进行确认。

3. 打开 **Show "Continue with Microsoft" on the login page**（在登录页面上显示 Microsoft 登录按钮）。
4. 点击 **Save**（保存）。

此后，卡片会显示 **Active on the login page**（已在登录页面启用），并且 **使用Azure Entra继续** 按钮会出现在您实例的登录页面上。

## 步骤 6：添加用户

SecureAI 在首次登录时**不会自动创建帐户**：所有要使用 Microsoft 登录的用户都必须已存在于 SecureAI 中且处于活动状态。SecureAI 帐户的电子邮件必须与该用户在 Entra ID 中的电子邮件一致（**邮件**（Mail）属性；如果为空，则使用**用户主体名称 / UPN**）。不区分大小写。

- **现有用户**：已拥有 SecureAI 帐户的用户（即使使用密码登录）不会被重新创建。他们可以继续使用密码登录，也可以使用 Microsoft 登录。
- **新的仅 SSO 用户**：在 **管理 → IAM管理 → 用户管理 → 添加用户** 中，将身份验证方式选择为 **企业账户 / SSO**。该用户不会收到设置密码的电子邮件，可直接通过 **使用Azure Entra继续** 登录。
- **大量用户**：您可以使用 SCIM 从 Entra ID 自动预配和取消预配用户。

当用户在 SecureAI 中被停用（手动或通过 SCIM）后，也无法通过 SSO 登录。

## 测试登录

1. 在无痕窗口中打开您实例的登录页面。
2. 点击 **使用Azure Entra继续**。
3. 选择您的工作帐户，并在出现提示时完成 MFA。
4. Microsoft 会将您重定向回 SecureAI，并已完成登录。

密码登录仍然可用：启用 SSO 不会关闭密码登录。

## 停用或删除集成

- 如需隐藏按钮但保留配置，请关闭开关并保存。
- 如需删除配置，请使用 **Remove configuration**（删除配置）。如果您的实例之前由 Hiper AI 配置过 SSO，则会重新应用该配置。

## 轮换客户端密码

在密码过期之前：

1. 在 Entra ID 中创建新的客户端密码（步骤 3），不要删除旧密码。
2. 在 SecureAI 中打开该集成，将新值粘贴到 **Client secret value**，点击 **Test connection**，然后点击 **Save**。将该字段留空会保留当前密码。
3. 确认登录正常后，在 Entra ID 中删除旧密码。

更改会立即生效，不会结束活动会话。

## 如果您的实例已由 Hiper AI 配置了 SSO

对于 Hiper AI 应要求配置了 Microsoft SSO 的实例，卡片会显示 **Configured by Hiper AI**（由 Hiper AI 配置）。该配置会继续有效。如果您在“集成”中保存了自己的配置，它将替换原有配置；如果之后删除了您的配置，则会重新应用之前的配置。

## 故障排除

登录错误会显示在 SecureAI 登录页面上（部分消息以英文显示）：

| SecureAI 中的消息 | 原因及解决方法 |
|---|---|
| “在SecureAI数据库中未找到用户。” | 不存在使用该电子邮件的 SecureAI 帐户。请创建该帐户（步骤 6），或检查电子邮件是否与 Entra ID 中的邮件/UPN 一致。 |
| "This account is not allowed to sign in here…" | 该电子邮件的域不在 **Allowed email domains** 中，或令牌来自其他租户。 |
| "This sign-in method is not enabled for your organization." | 集成已停用或配置不完整。请在“集成”中检查该卡片。 |
| "Your identity provider did not complete the sign-in…" | Microsoft 返回了错误：用户取消了登录、缺少管理员同意（步骤 4），或用户未分配到该应用程序。 |
| "Single sign-on could not be completed…" | 代码交换失败，通常是因为密码已过期或已被替换。请使用 **Test connection**。 |
| “您的账户已停用……” | 该帐户在 SecureAI 中已被停用。 |
| “登录会话已过期或不是从此浏览器发起的……” | 已超过 10 分钟，或登录是在其他标签页/浏览器中发起的。请从登录页面重试。 |

Microsoft 显示的错误（返回 SecureAI 之前）：

- **AADSTS50011 – The redirect URI does not match**：在 Entra ID 中注册的 URI 与 SecureAI 在步骤 1 中显示的 URI 不完全一致，或者注册为了“单页应用程序”而不是 **Web**。
- **AADSTS65001 / “需要管理员批准”（Need admin approval）**：请授予管理员同意（步骤 4）。
- **AADSTS50105 – The signed in user is not assigned to a role for the application**：企业应用程序的 **需要进行分配?** 设置为 **是**。请在 **企业应用程序 → SecureAI SSO → 用户和组** 中分配该用户或某个组。
- **AADSTS7000215 / AADSTS7000222**：密码无效或已过期。请填写新的密码。

如需帮助，请通过个人资料菜单中的 **获取支持** 联系支持团队，并提供应用程序(客户端) ID、目录 ID 和错误消息。**切勿发送客户端密码。**