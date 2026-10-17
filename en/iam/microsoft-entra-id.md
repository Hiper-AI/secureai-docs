---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Microsoft Entra ID (SSO) Integration

With this integration, your organization's users sign in to SecureAI with their Microsoft work account (the **Continue with Microsoft** button). Setup is **self-serve**: an administrator in your organization registers SecureAI in your own Microsoft Entra ID tenant (formerly Azure Active Directory) and enters the details in **Admin → Integrations**. There is no ticket to open and nothing to wait for from Hiper AI: the button appears on your login page as soon as you save.

Estimated time: 10 minutes.

## Prerequisites

- A Microsoft Entra role that can create app registrations (for example **Application Developer** or **Application Administrator**). Granting admin consent (step 4) requires **Cloud Application Administrator**, **Application Administrator** or **Global Administrator**.
- Administrator access to SecureAI, with **Admin** permission on the **Integrations** section.

## How it works

1. You create an **app registration** in your Entra ID tenant. SecureAI uses OpenID Connect (authorization code flow) with a **client secret**.
2. In SecureAI you enter the **Directory (tenant) ID**, the **Application (client) ID** and the **client secret value**. The secret is stored encrypted and is never shown again.
3. When a user clicks **Continue with Microsoft**, Microsoft authenticates them (with your MFA and Conditional Access policies) and SecureAI lets them in if their email matches an **active** SecureAI account.

SecureAI only accepts tokens issued by **your** tenant: sign-in is pinned to your directory, and the multi-tenant endpoints (`common` / `organizations`) are never used.

## Step 1: Copy the redirect URI from SecureAI

1. Sign in to SecureAI as an administrator.
2. Go to **Admin → Integrations** and filter by the **IAM** category.
3. On the **Microsoft Entra ID (SSO)** card, click **Connect Integration** (or **Reconfigure**, if the card says **Configured by Hiper AI**).
4. In section **1. Register SecureAI in Microsoft Entra ID**, click **Copy** next to the **Redirect URI**.

The URI looks like this (with your instance's domain):

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

Always use the URI your instance shows: it must match character for character, including `https://`.

Keep this window open; you will come back to paste the details.

## Step 2: Register the application in Microsoft Entra ID

1. Open the [Microsoft Entra admin center](https://entra.microsoft.com) (or the [Azure portal](https://portal.azure.com) → **Microsoft Entra ID**).

<div class="mac-window">
  ![Searching for Microsoft Entra ID in the Azure portal](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. Go to **Applications → App registrations**.

<div class="mac-window">
  ![App registrations menu](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. Click **+ New registration**.

<div class="mac-window">
  ![New registration button](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. Fill in the form:
   - **Name**: a descriptive name, for example `SecureAI SSO`. Users see it on the consent screen.
   - **Supported account types**: **Accounts in this organizational directory only (Single tenant)**.
   - **Redirect URI**: platform **Web** (not "Single-page application"), and paste the URI you copied in step 1.
5. Click **Register**.

<div class="mac-window">
  ![Application registration form](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. On the application's **Overview** page, copy:
   - **Application (client) ID** — a GUID such as `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`.
   - **Directory (tenant) ID** — another GUID, such as `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`.

## Step 3: Create a client secret

1. In the application's menu, open **Certificates & secrets**.

<div class="mac-window">
  ![Certificates & secrets menu](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Under **Client secrets**, click **+ New client secret**.
3. Enter a description (for example `SecureAI SSO`) and choose an expiry (Microsoft recommends less than 12 months; the maximum is 24).
4. Click **Add**.

<div class="mac-window">
  ![Add a client secret](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. **Immediately** copy the **Value** column (it looks like `plm8Q~xxxxxxxx…`). It is shown only once.

<div class="mac-window">
  ![Client secret value](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
Copy the **Value**, not the **Secret ID** (which is a GUID). If you paste the Secret ID, SecureAI rejects it on save.
</Warning>

Write down the expiry date: when the secret expires, Microsoft sign-in stops working until you enter a new one (see [Rotate the client secret](#rotate-the-client-secret)).

## Step 4: Review API permissions

SecureAI requests the delegated Microsoft Graph permissions `openid`, `profile`, `email` and `User.Read` (the latter to read the user's profile photo). `User.Read` is added by default to new registrations.

1. In the application's menu, open **API permissions**.
2. Check that **Microsoft Graph → Delegated permissions** include `User.Read` and, if you want them listed explicitly, `openid`, `profile` and `email` (via **+ Add a permission → Microsoft Graph → Delegated permissions**).

<div class="mac-window">
  ![Add delegated permissions](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. Click **Grant admin consent for [your organization]** and confirm.

<div class="mac-window">
  ![Grant admin consent](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

If your tenant does not let users consent to applications (a common setting in companies), this step is mandatory: without it users see "Need admin approval" when signing in.

## Step 5: Enter the details in SecureAI and test

Go back to **Admin → Integrations → Microsoft Entra ID (SSO)**:

1. In **2. Paste the app registration details**, fill in:
   - **Directory (tenant) ID**: the GUID from step 2 (a verified domain of your tenant, such as `contoso.onmicrosoft.com`, also works).
   - **Application (client) ID**: the GUID from step 2.
   - **Client secret value**: the value from step 3.
   - **Allowed email domains** (optional, recommended): your organization's email domains, comma-separated, for example `contoso.com, contoso.co.uk`. Only those addresses can sign in with Microsoft. If left empty, any account of your tenant that exists in SecureAI is accepted.
2. In **3. Test the connection**, click **Test connection**. SecureAI asks Microsoft (without signing anyone in) and checks:

   | Check | If it fails |
   |---|---|
   | Directory (tenant) ID | Microsoft does not know that tenant (`AADSTS90002`). Copy the Directory ID from the Overview page. |
   | Application (client) ID | No such application exists in the tenant (`AADSTS700016`). Check the client ID and that the app lives in the same tenant. |
   | Client secret | The secret is invalid (`AADSTS7000215`) or expired (`AADSTS7000222`). Paste the **Value** or create a new one. |
   | Redirect URI registered on the app | The URI from step 1 is not on the app registration (the `AADSTS50011` error a user would get at sign-in). In the app open **Authentication → Add a platform → Web**, paste it exactly and save. |

   The test uses what is typed in the form, so you can test before saving. If your tenant has a Conditional Access policy that blocks app-only tokens, the secret may show as "could not be verified automatically": that is not an error — confirm with a real sign-in.

   <Note>
   The test confirms the URI is registered, but not whether it was registered under the **Web** platform or under **Single-page application (SPA)**. Registered as SPA, the test passes and sign-in fails with "Single sign-on could not be completed". Check that under **Authentication** the URI is listed under **Web**.
   </Note>

3. Check that **Show "Continue with Microsoft" on the login page** is on (it starts on the first time).
4. Click **Save**.

From then on the card shows **Active on the login page**, and the **Continue with Microsoft** button appears on your instance's login page.

## Step 6: Add your users

SecureAI **does not create accounts automatically** on first sign-in: everyone who will sign in with Microsoft must exist in SecureAI and be active. The SecureAI account's email must match the user's email in Entra ID (the **Mail** attribute; when it is empty, the **user principal name / UPN** is used). Case does not matter.

- **Existing users**: people who already have a SecureAI account (even with a password) are not recreated. They can keep signing in with their password, and also with Microsoft.
- **New SSO-only users**: in **Admin → IAM Management → User Management → Add User**, choose the authentication method **Business Account / SSO**. The user does not get an email to create a password and signs in directly with **Continue with Microsoft**.
- **Many users**: you can provision and deprovision them automatically from Entra ID with SCIM.

When a user is deactivated in SecureAI (manually or via SCIM), they cannot sign in through SSO either.

## Test the sign-in

1. Open your instance's login page in an incognito window.
2. Click **Continue with Microsoft**.
3. Pick your work account and complete MFA if prompted.
4. Microsoft sends you back to SecureAI, signed in.

Password sign-in keeps working: enabling SSO does not turn it off.

## Disable or remove the integration

- To hide the button but keep the configuration, turn the switch off and save.
- To delete it, use **Remove configuration**. If your instance previously had SSO configured by Hiper AI, that configuration applies again.

## Rotate the client secret

Before the secret expires:

1. In Entra ID, create a new client secret (step 3) without deleting the old one.
2. In SecureAI, open the integration, paste the new value into **Client secret value**, click **Test connection** and then **Save**. Leaving the field empty keeps the current secret.
3. Once you have confirmed that sign-in works, delete the old secret in Entra ID.

The change applies immediately, without ending active sessions.

## If your instance already had SSO configured by Hiper AI

Instances where Hiper AI configured Microsoft SSO on request show the card as **Configured by Hiper AI**. That configuration keeps working. If you save your own in Integrations, it replaces it; if you later remove yours, the previous one applies again.

## Troubleshooting

Sign-in errors are shown on the SecureAI login page:

| Message in SecureAI | Cause and fix |
|---|---|
| "User not found in SecureAI database." | There is no SecureAI account with that email. Create it (step 6) or check that the email matches the Entra ID Mail/UPN. |
| "This account is not allowed to sign in here…" | The email's domain is not in **Allowed email domains**, or the token came from another tenant. |
| "This sign-in method is not enabled for your organization." | The integration is disabled or incomplete. Check the card in Integrations. |
| "Your identity provider did not complete the sign-in…" | Microsoft returned an error: the user cancelled, admin consent is missing (step 4), or the user is not assigned to the application. |
| "Single sign-on could not be completed…" | The code exchange failed: usually an expired or replaced secret (use **Test connection**), or the redirect URI registered as **Single-page application** instead of **Web** (move it to **Web** under **Authentication**). |
| "Your account is inactive…" | The account is deactivated in SecureAI. |
| "The sign-in session expired or was not started from this browser…" | More than 10 minutes passed, or the sign-in started in another tab/browser. Try again from the login page. |

Errors shown by Microsoft (before returning to SecureAI):

- **AADSTS50011 – The redirect URI does not match**: the URI registered in Entra ID is not exactly the one SecureAI shows in step 1 (one extra trailing slash is enough to break the match). **Test connection** catches it before the first sign-in.
- **AADSTS65001 / "Need admin approval"**: grant admin consent (step 4).
- **AADSTS50105 – The signed in user is not assigned to a role for the application**: the enterprise application has **Assignment required?** set to **Yes**. Assign the user or a group under **Enterprise applications → SecureAI SSO → Users and groups**.
- **AADSTS7000215 / AADSTS7000222**: invalid or expired secret. Enter a new one.

If you need help, contact support from **Get Support** in your profile menu and include the Application (client) ID, the Directory ID and the error message. **Never send the client secret.**
