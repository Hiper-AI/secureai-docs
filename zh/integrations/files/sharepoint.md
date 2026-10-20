---
sidebar_position: 2
title: "SharePoint & OneDrive — Add from SharePoint"
sidebarTitle: "SharePoint"
icon: "/img/icons/sharepoint.svg"
sidebar_label: "SharePoint & OneDrive"
description: "允许用户在 SecureAI 聊天中附加 SharePoint 站点和 OneDrive 中的文件。使用您自己的 Microsoft Entra ID 应用注册进行自助配置。"
---

# SharePoint & OneDrive — Add from SharePoint

通过此集成，您的用户可以使用附件按钮中的 **Add from SharePoint** 选项，直接在聊天中附加 **SharePoint 站点**（包括 Teams 站点）、**OneDrive** 以及**与我共享**中的文件。

配置采用**自助方式**：贵组织的管理员在**贵组织自己的 Microsoft Entra ID 目录**中将 SecureAI 注册为应用程序，并在 **Admin → Integrations → Files** 中填写标识符。无需提交工单，也无需等待 Hiper AI：保存配置后，该选项会立即出现在聊天中。

预计耗时：10 分钟。

## 工作原理

1. 用户点击 **Attach → Add from SharePoint**。首次使用时，Microsoft 会要求用户使用**自己的 Microsoft 365 账号**登录。
2. 打开基于 Microsoft Graph 的 SecureAI 浏览器：站点、库、文件夹、搜索，以及与该用户共享的文件。用户选择一个或多个文件。
3. 用户的浏览器使用用户自己的令牌，**仅下载所选文件**，并将其附加到消息中。
4. 文件与任何附件走相同的流程：在到达模型之前，会先经过 **DLP** 和贵组织的策略。

<Info>
**仅使用委托权限，绝不使用应用程序权限。** SecureAI 始终**代表已登录的用户**执行操作：用户只能看到并附加自己在 SharePoint 中本来就能打开的内容。该应用程序是不带客户端密码的“单页应用程序”（SPA），SecureAI 不会在后台读取任何内容。
</Info>

## 前提条件

- 包含 **SharePoint Online** 的 Microsoft 365 订阅（例如 Business Basic、Business Standard、E3 或 E5）。没有该许可证的 Entra ID 目录既没有 SharePoint 站点，也没有 OneDrive：可以登录，但没有可附加的文件。
- 一个允许注册应用程序并为 Microsoft Graph 权限**授予管理员同意**的 Entra ID 角色（例如**云应用程序管理员**或**全局管理员**）。
- SecureAI 管理员访问权限，并在 **Integrations** 部分具有 **Administrator** 权限。
- 包含 **Attach from Drive / SharePoint** 的 SecureAI 套餐。没有该套餐时，您仍可以先完成配置，但用户将看不到该选项。

## 步骤 1：从 SecureAI 复制重定向 URI

1. 以管理员身份登录 SecureAI。
2. 前往 **Admin → Integrations**，并按 **Files** 类别筛选。
3. 在 **SharePoint & OneDrive** 卡片上，点击 **Connect integration**。
4. 在 **1. Register SecureAI in Microsoft Entra ID** 部分，点击 **Redirect URI** 旁边的 **Copy**。

<div class="mac-window">
  ![SecureAI 侧边面板中的重定向 URI](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

该 URI 即您的实例地址，例如 `https://<您的公司>.hiperai.ai`。请始终使用您的实例所显示的 URI：它必须完全一致。

## 步骤 2：在 Entra ID 中注册应用程序

1. 打开 [Microsoft Entra 管理中心](https://entra.microsoft.com)，前往**标识 → 应用程序 → 应用注册**（Identity → Applications → App registrations）。
2. 点击**新注册**（New registration）。

<div class="mac-window">
  ![应用注册 → 新注册](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. 填写以下内容：
   - **名称**（Name）：例如 `SecureAI — Add from SharePoint`。
   - **支持的帐户类型**（Supported account types）：**仅此组织目录中的帐户**（Accounts in this organizational directory only，单租户）。
   - **重定向 URI**（Redirect URI）：在下拉列表中选择**单页应用程序(SPA)**（Single-page application），并粘贴您在步骤 1 中复制的 URI。
4. 点击**注册**（Register）。


<Warning>
平台必须是**单页应用程序(SPA)**，而不是 **Web**。如果使用 **Web**，登录会因错误 `AADSTS9002326` 而失败。如果您已将其注册为 Web，请前往**身份验证**（Authentication），使用相同的 URI 添加**单页应用程序**平台，并删除 Web 平台。
</Warning>

5. 在应用程序的**概述**（Overview）中，复制**应用程序(客户端) ID**（Application (client) ID）和**目录(租户) ID**（Directory (tenant) ID）。无需创建任何客户端密码。

<div class="mac-window">
  ![应用程序 ID 和目录 ID](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## 步骤 3：添加 Microsoft Graph 权限

1. 在应用程序中，前往 **API 权限 → 添加权限 → Microsoft Graph → 委托的权限**（API permissions → Add a permission → Microsoft Graph → Delegated permissions）。
2. 搜索并勾选：
   - `Files.Read.All` — 读取用户有权访问的文件。
   - `Sites.Read.All` — 列出和搜索用户有权访问的 SharePoint 站点。
3. 点击**添加权限**（Add permissions）。`User.Read` 默认已添加，请保留。

<div class="mac-window">
  ![Microsoft Graph 委托的权限](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## 步骤 4：授予管理员同意

1. 在 **API 权限**中，点击**代表 &lt;您的组织&gt; 授予管理员同意**（Grant admin consent for &lt;org&gt;），并点击**是**确认。
2. 三项权限的状态都必须显示为**已为 &lt;您的组织&gt; 授予**。

<div class="mac-window">
  ![已授予管理员同意](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

如果跳过此步骤，每位用户都会看到同意请求（如果贵组织不允许用户自行同意，则会看到错误 `AADSTS65001`）。

## 步骤 5：在 SecureAI 中填写、测试并启用

1. 返回 SecureAI 中的 **SharePoint & OneDrive** 侧边面板。
2. 在 **2. Paste the identifiers** 下，粘贴 **Directory (tenant) ID** 和 **Application (client) ID**。
3. 在 **3. Test it** 下：
   - **Test connection** 会从 SecureAI 服务器验证该目录是否存在。
   - **Try signing in** 会打开用户将看到的同一个 Microsoft 窗口：请使用您的账号登录。SecureAI 会确认重定向 URI 为 SPA 类型、`Files.Read.All` 和 `Sites.Read.All` 已获得同意，并确认 Microsoft Graph 有响应。

<div class="mac-window">
  ![SecureAI 侧边面板中通过的测试](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. 在 **4.** 下，保持 **Show "Add from SharePoint" to users** 处于开启状态，然后点击 **Save**。

卡片将变为 **Available in the chat**。

## 步骤 6：用户如何使用

1. 在聊天中，用户点击**附件**按钮并选择 **Add from SharePoint**。

<div class="mac-window">
  ![附件菜单中的 Add from SharePoint](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. 首次使用时，点击 **Sign in with Microsoft** 并选择其组织账号。
3. 通过 **Sites**、**Shared** 或搜索进行浏览，选择一个或多个文件，然后点击 **Add**。


4. 文件会带着 SharePoint 图标附加到消息中。

## 限制可使用的用户（可选）

若要仅允许部分用户或组使用 **Add from SharePoint**：

1. 在 Entra 中，前往**企业应用程序**（Enterprise applications），打开您注册的应用程序。
2. 在**属性**（Properties）中，开启**需要分配?**（Assignment required?）并保存。
3. 在**用户和组**（Users and groups）中，分配获准使用的用户或组。

未被分配的用户在登录时会收到错误 `AADSTS50105`，且无法附加文件。

## 故障排除

| 您看到的现象 | 原因 | 处理方法 |
|---|---|---|
| `AADSTS50011` — 重定向 URI 不匹配 | 步骤 1 中的 URI 尚未注册 | 在**身份验证 → 单页应用程序**中添加 |
| `AADSTS9002326` | URI 被注册为 **Web** | 将其移至**单页应用程序** |
| `AADSTS65001` — 缺少同意 | 未授予管理员同意 | 步骤 4 |
| `AADSTS700016` — 找不到应用程序 | 应用程序 ID 或目录 ID 有误 | 从**概述**中重新复制 |
| `AADSTS50105` | 用户未被分配到该应用程序 | 为其分配，或关闭**需要分配?** |
| **Try signing in**："These delegated permissions are missing"（缺少以下委托权限） | 缺少 `Files.Read.All` 或 `Sites.Read.All`，或缺少其同意 | 步骤 3 和 4 |
| **Try signing in**："this Microsoft 365 directory has no SharePoint Online license"（此 Microsoft 365 目录没有 SharePoint Online 许可证） | 该目录没有包含 SharePoint Online 的订阅 | 使用贵组织的 Microsoft 365 目录，或分配包含 SharePoint Online 的订阅 |
| SecureAI 浏览器提示贵组织没有 SharePoint Online | 同一情况，从用户侧看到 | 与上一行相同 |
| 用户看不到站点，只有 "Shared" | 用户不是任何站点的成员 | 属预期行为：用户只能看到自己本来就能打开的内容 |
| 用户看不到 **Add from SharePoint** | 集成已关闭、未保存，或套餐不包含该功能 | 检查 **Admin → Integrations → Files** 中的卡片 |

## 常见问题

**SecureAI 可以读取什么？** 仅限已登录用户本来就能读取的内容，并且仅在用户于浏览器中选择文件时才会读取。权限是委托权限：SecureAI 不存在以“应用程序身份”访问您的 SharePoint 的途径。

**条件访问策略是否有效？** 有效。登录是普通的 Microsoft 365 登录，会遵循 MFA、托管设备以及您的其他策略。

**如何关闭？** 关闭 **Show "Add from SharePoint" to users** 并保存，或点击 **Remove configuration**。如果还要吊销已签发的令牌，请在 Entra ID 中删除应用注册，或禁用您的企业应用程序的登录。

**Hiper AI 已经为我配置过 SharePoint。我需要做什么吗？** 不需要。只要您没有保存自己的配置，卡片就会显示 **Configured by Hiper AI**，一切照常运行。如果您保存了自己的配置，它将替换原有配置。
