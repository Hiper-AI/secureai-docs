---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Google Workspace (SSO) 集成

通过此集成，您组织的用户可以使用其 Google Workspace 帐号登录 SecureAI（即 **使用Google继续** 按钮；界面为英文时显示为 **Continue with Google**）。配置为**自助式**：由您组织中的管理员在您自己的 Google Cloud 项目中创建 OAuth 客户端，然后在 **管理 → 集成** 中填写相关信息。无需提交工单，也无需等待 Hiper AI 处理：保存后，该按钮会立即出现在您的登录页面上。

预计用时：10 分钟。

## 先决条件

- 一个**位于您的 Google Workspace 组织内**的 Google Cloud 项目，并拥有在其中配置 Google Auth Platform 和创建 OAuth 客户端的权限（例如项目的 **所有者**（Owner）或 **编辑者**（Editor）角色）。
- SecureAI 的管理员访问权限，并在 **集成** 部分拥有 **管理员** 权限。

## 工作原理

1. 您在 Google Cloud 中创建一个**类型为“Web 应用”的 OAuth 2.0 客户端**。SecureAI 使用 OpenID Connect，范围为 `openid`、`email` 和 `profile`。
2. 您在 SecureAI 中填写**客户端 ID**、**客户端密钥**以及您的 **Google Workspace 网域**。密钥会加密存储，之后不会再显示。
3. 当用户点击 **使用Google继续** 时，Google 会对其进行身份验证；只有在满足以下所有条件时，SecureAI 才会允许其登录：
   - Google 已验证其电子邮件，
   - 该帐号**由您的某个 Workspace 网域管理**（`hd` 声明），并且
   - 其电子邮件与某个**活动**的 SecureAI 帐户匹配。

个人 Google 帐号（例如 @gmail.com 帐号，或使用公司电子邮件创建的个人帐号）**无法**登录，即使其电子邮件与某个 SecureAI 用户相同也不行。

## 步骤 1：从 SecureAI 复制重定向 URI

1. 以管理员身份登录 SecureAI。
2. 转到 **管理 → 集成**，并按 **身份和访问管理** 类别筛选。
3. 在 **Google Workspace (SSO)** 卡片上，点击 **连接集成**。
4. 在 **1. Create an OAuth client in Google Cloud**（在 Google Cloud 中创建 OAuth 客户端）部分，点击 **Redirect URI**（重定向 URI）旁边的 **Copy**（复制）。

该 URI 的格式如下（使用您实例的域名）：

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

请始终使用您的实例显示的 URI：它必须完全一致，包括 `https://`。

## 步骤 2：选择或创建 Google Cloud 项目

1. 打开 [Google Cloud 控制台](https://console.cloud.google.com)。
2. 在顶部栏的项目选择器中，选择您组织中的某个项目，或点击 **新建项目**。

<div class="mac-window">
  ![新建项目](/img/google%20sso%20images/google%20-%201.png)
</div>

3. 如果新建项目：为其命名（例如 `SecureAI SSO`），确认 **组织** 为您的 Google Workspace 组织，然后点击 **创建**。

<div class="mac-window">
  ![创建项目](/img/google%20sso%20images/google%20-%202.png)
</div>

登录无需启用任何 API。

## 步骤 3：配置 Google Auth Platform（同意屏幕）

1. 在菜单中，转到 **API 和服务 → OAuth 同意屏幕**（OAuth consent screen；在新版控制台中称为 **Google Auth Platform**）。如果是首次配置，请点击 **开始**（Get started）。

<div class="mac-window">
  ![OAuth 同意屏幕](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **应用信息**：应用名称（例如 `SecureAI`）和用户支持电子邮件。
3. **受众群体**：选择 **内部**。只有您 Google Workspace 组织中的帐号才能使用该应用，并且 Google 不要求进行应用验证。
4. **联系信息**：用于接收 Google 通知的电子邮件。
5. 接受用户数据政策，然后点击 **创建**。

<div class="mac-window">
  ![创建 OAuth 配置](/img/google%20sso%20images/google%20-%204.png)
</div>

`openid`、`email` 和 `profile` 范围不属于敏感范围：无需在 **数据访问** 中添加。

<Note>
如果选择 **外部**，应用必须处于 **正式版**（In production）状态（而不是“测试”）；在测试模式下，只有您列出的测试用户才能登录。即使选择外部，SecureAI 也只接受您在步骤 5 中配置的 Workspace 网域中的帐号。
</Note>

## 步骤 4：创建 OAuth 客户端

1. 在 Google Auth Platform 中，转到 **客户端**（或 **API 和服务 → 凭据 → + 创建凭据 → OAuth 客户端 ID**）。

<div class="mac-window">
  ![创建 OAuth 客户端 ID](/img/google%20sso%20images/google%20-%207.png)
</div>

2. 点击 **+ 创建客户端**。
3. **应用类型**：**Web 应用**。
4. **名称**：例如 `SecureAI SSO`。
5. 在 **已获授权的重定向 URI**（Authorized redirect URIs）下，点击 **+ 添加 URI**，然后粘贴步骤 1 中的 URI。（无需配置 **已获授权的 JavaScript 来源**。）

<div class="mac-window">
  ![已获授权的重定向 URI](/img/google%20sso%20images/google%20-%208.png)
</div>

6. 点击 **创建**。
7. 在弹出的对话框中，复制 **客户端 ID**（以 `.apps.googleusercontent.com` 结尾）和 **客户端密钥**（以 `GOCSPX-` 开头）。您可以下载 JSON 作为备份。

<div class="mac-window">
  ![已创建 OAuth 客户端](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google 只在创建时显示完整的密钥。请将其保存在安全的地方；如果丢失，请在该客户端上添加新的密钥。
</Warning>

重定向 URI 的更改可能需要几分钟才能在 Google 端生效。

## 步骤 5：在 SecureAI 中填写信息并测试

返回 **管理 → 集成 → Google Workspace (SSO)**：

1. 在 **2. Paste the OAuth client details**（粘贴 OAuth 客户端信息）中填写：
   - **Client ID**：步骤 4 中的客户端 ID。
   - **Client secret**：步骤 4 中的客户端密钥。
   - **Allowed email domains**（允许的电子邮件域；必填）：您的 Google Workspace 主网域，以及您使用的辅助网域（如有），以逗号分隔。例如 `contoso.com, contoso.co.uk`。
2. 在 **3. Test the connection**（测试连接）中，点击 **Test connection**。SecureAI 会向 Google 查询（不会让任何人登录）并检查：

   | 检查项 | 失败时 |
   |---|---|
   | Client ID | Google 不认识该客户端（`invalid_client`）。请确认您复制了完整的 ID，且该客户端未被删除或停用。 |
   | Redirect URI registered on the client | 步骤 1 中的 URI 不在 **已获授权的重定向 URI** 中（`redirect_uri_mismatch`）。请完全按原样添加，并等待几分钟。 |
   | Client secret | 该密钥不属于此客户端（`invalid_client`）。请重新粘贴，或添加新的密钥。 |

   测试使用的是表单中当前填写的内容，因此您可以在保存之前进行测试。
3. 打开 **Show "Continue with Google" on the login page**（在登录页面上显示 Google 登录按钮）。
4. 点击 **Save**（保存）。

此后，卡片会显示 **Active on the login page**（已在登录页面启用），并且 **使用Google继续** 按钮会出现在您实例的登录页面上。

## 步骤 6：添加用户

SecureAI 在首次登录时**不会自动创建帐户**：所有要使用 Google 登录的用户都必须已存在于 SecureAI 中且处于活动状态，并且其电子邮件与 Google Workspace 帐号**完全相同**（不区分大小写；不接受 `+` 别名）。

- **现有用户**：已拥有 SecureAI 帐户的用户（即使使用密码登录）不会被重新创建。他们可以继续使用密码登录，也可以使用 Google 登录。
- **新的仅 SSO 用户**：在 **管理 → IAM管理 → 用户管理 → 添加用户** 中，将身份验证方式选择为 **企业账户 / SSO**。该用户不会收到设置密码的电子邮件，可直接通过 **使用Google继续** 登录。

当用户在 SecureAI 中被停用后，也无法通过 SSO 登录。

## 测试登录

1. 在无痕窗口中打开您实例的登录页面。
2. 点击 **使用Google继续**。
3. 选择您的 Google Workspace 帐号。
4. Google 会将您重定向回 SecureAI，并已完成登录。

密码登录仍然可用：启用 SSO 不会关闭密码登录。

## 停用或删除集成

- 如需隐藏按钮但保留配置，请关闭开关并保存。
- 如需删除配置，请使用 **Remove configuration**（删除配置）。如果您的实例之前由 Hiper AI 配置过 SSO，则会重新应用该配置。

## 轮换客户端密钥

1. 在 Google Cloud 中打开该 OAuth 客户端，点击 **添加密钥**（Add secret）（旧密钥仍可继续使用）。
2. 在 SecureAI 中，将新值粘贴到 **Client secret**，点击 **Test connection**，然后点击 **Save**。将该字段留空会保留当前密钥。
3. 确认登录正常后，在 Google Cloud 中停用并删除旧密钥。

更改会立即生效，不会结束活动会话。

## 如果您的实例已由 Hiper AI 配置了 SSO

对于 Hiper AI 应要求配置了 Google SSO 的实例，卡片会显示 **Configured by Hiper AI**（由 Hiper AI 配置）。该配置会继续有效。如果您在“集成”中保存了自己的配置，它将替换原有配置；如果之后删除了您的配置，则会重新应用之前的配置。

## 故障排除

登录错误会显示在 SecureAI 登录页面上（部分消息以英文显示）：

| SecureAI 中的消息 | 原因及解决方法 |
|---|---|
| “在SecureAI数据库中未找到用户。” | 不存在使用该电子邮件的 SecureAI 帐户。请创建该帐户（步骤 6）。 |
| "This account is not allowed to sign in here…" | 该帐号不属于任何 **Allowed email domains**，或者是个人 Google 帐号（没有 Workspace）。请添加该网域，或使用公司帐号。 |
| “您的身份提供商尚未验证此电子邮件地址。” | Google 未将该电子邮件标记为已验证，或该电子邮件包含 SecureAI 不接受的字符（例如 `+` 别名）。 |
| "This sign-in method is not enabled for your organization." | 集成已停用或配置不完整。请在“集成”中检查该卡片。 |
| "Your identity provider did not complete the sign-in…" | Google 返回了错误，例如用户取消了登录。 |
| "Single sign-on could not be completed…" | 代码交换失败，通常是因为密钥已被替换或删除。请使用 **Test connection**。 |
| “登录会话已过期或不是从此浏览器发起的……” | 已超过 10 分钟，或登录是在其他标签页/浏览器中发起的。请从登录页面重试。 |

Google 显示的错误（返回 SecureAI 之前）：

- **错误 400：redirect_uri_mismatch**：客户端的重定向 URI 与步骤 1 中的 URI 不完全一致。请在 **已获授权的重定向 URI**（而不是 JavaScript 来源）中更正。
- **错误 403：org_internal**：应用为 **内部** 应用，而该帐号不属于拥有该项目的 Google Cloud 组织。如果贵公司有多个 Google 组织（例如 `company.com` 和 `company.ai`），而 OAuth 客户端是在另一个组织的项目中创建的，也会出现此错误：请在您的用户所属组织的项目中创建（控制台的项目选择器会显示每个项目所属的组织）。
- **错误 401：invalid_client / deleted_client**：OAuth 客户端不存在或已被删除。请创建新的客户端并更新 SecureAI。
- **“Access blocked: your administrator has not trusted this app”**（或以中文显示的同类消息，表示管理员尚未信任此应用）：您 Workspace 的应用访问权限控制阻止了第三方应用。在 Google 管理控制台中（**安全性 → 访问权限和数据控制 → API 控制 → 管理第三方应用访问权限**），将该客户端 ID 标记为 **受信任**。

如需帮助，请通过个人资料菜单中的 **获取支持** 联系支持团队，并提供客户端 ID 和错误消息。**切勿发送客户端密钥。**

## 其他资源

- [在 Google Cloud 中设置 OAuth 2.0](https://support.google.com/cloud/answer/6158849)
- [Google 的 OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [控制哪些第三方应用可以访问 Google Workspace 数据](https://support.google.com/a/answer/7281227)