---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Google Workspace (SSO) Integration

With this integration, your organization's users sign in to SecureAI with their Google Workspace account (the **Continue with Google** button). Setup is **self-serve**: an administrator in your organization creates an OAuth client in your own Google Cloud project and enters the details in **Admin → Integrations**. There is no ticket to open and nothing to wait for from Hiper AI: the button appears on your login page as soon as you save.

Estimated time: 10 minutes.

## Prerequisites

- A Google Cloud project **inside your Google Workspace organization**, and permission to configure Google Auth Platform and create OAuth clients in it (for example the project **Owner** or **Editor** role).
- Administrator access to SecureAI, with **Admin** permission on the **Integrations** section.

## How it works

1. You create an **OAuth 2.0 client of type "Web application"** in Google Cloud. SecureAI uses OpenID Connect with the `openid`, `email` and `profile` scopes.
2. In SecureAI you enter the **Client ID**, the **Client secret** and your **Google Workspace domains**. The secret is stored encrypted and is never shown again.
3. When a user clicks **Continue with Google**, Google authenticates them and SecureAI lets them in only if:
   - Google verified their email,
   - the account is **managed by one of your Workspace domains** (the `hd` claim), and
   - their email matches an **active** SecureAI account.

A personal Google account (for example an @gmail.com account, or a personal account created with the company email) **cannot** sign in, even if it has the same email as a SecureAI user.

## Step 1: Copy the redirect URI from SecureAI

1. Sign in to SecureAI as an administrator.
2. Go to **Admin → Integrations** and filter by the **IAM** category.
3. On the **Google Workspace (SSO)** card, click **Connect Integration**.
4. In section **1. Create an OAuth client in Google Cloud**, click **Copy** next to the **Redirect URI**.

The URI looks like this (with your instance's domain):

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

Always use the URI your instance shows: it must match exactly, including `https://`.

## Step 2: Choose or create a Google Cloud project

1. Open the [Google Cloud console](https://console.cloud.google.com).
2. In the project picker on the top bar, choose a project in your organization or click **New Project**.

<div class="mac-window">
  ![New project](/img/google%20sso%20images/google%20-%201.png)
</div>

3. If you create one: name it (for example `SecureAI SSO`), check that the **Organization** is your Google Workspace one, and click **Create**.

<div class="mac-window">
  ![Create project](/img/google%20sso%20images/google%20-%202.png)
</div>

No API needs to be enabled for sign-in.

## Step 3: Configure Google Auth Platform (consent screen)

1. In the menu, go to **APIs & Services → OAuth consent screen** (called **Google Auth Platform** in the new console). If it is the first time, click **Get started**.

<div class="mac-window">
  ![OAuth consent screen](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **App information**: an app name (for example `SecureAI`) and a user support email.
3. **Audience**: choose **Internal**. Only accounts in your Google Workspace organization can use the app, and Google does not require app verification.
4. **Contact information**: an email for notices from Google.
5. Accept the user data policy and click **Create**.

<div class="mac-window">
  ![Create the OAuth configuration](/img/google%20sso%20images/google%20-%204.png)
</div>

The `openid`, `email` and `profile` scopes are not sensitive: you do not need to add them under **Data access**.

<Note>
If you choose **External**, the app must be **In production** (not "Testing"); in testing mode only the test users you list can sign in. Even with External, SecureAI only accepts accounts from the Workspace domains you configure in step 5.
</Note>

## Step 4: Create the OAuth client

1. In Google Auth Platform, go to **Clients** (or **APIs & Services → Credentials → + Create credentials → OAuth client ID**).

<div class="mac-window">
  ![Create OAuth client ID](/img/google%20sso%20images/google%20-%207.png)
</div>

2. Click **+ Create client**.
3. **Application type**: **Web application**.
4. **Name**: for example `SecureAI SSO`.
5. Under **Authorized redirect URIs**, click **+ Add URI** and paste the URI from step 1. (You do not need **Authorized JavaScript origins**.)

<div class="mac-window">
  ![Authorized redirect URIs](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Click **Create**.
7. In the dialog that appears, copy the **Client ID** (ends in `.apps.googleusercontent.com`) and the **Client secret** (starts with `GOCSPX-`). You can download the JSON as a backup.

<div class="mac-window">
  ![OAuth client created](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google shows the full secret only when it is created. Store it somewhere safe; if you lose it, add a new secret on the client.
</Warning>

Changes to the redirect URI can take a few minutes to propagate at Google.

## Step 5: Enter the details in SecureAI and test

Go back to **Admin → Integrations → Google Workspace (SSO)**:

1. In **2. Paste the OAuth client details**, fill in:
   - **Client ID**: from step 4.
   - **Client secret**: from step 4.
   - **Allowed email domains** (required): your primary Google Workspace domain and, if you use them, your secondary domains, comma-separated. For example `contoso.com, contoso.co.uk`.
2. In **3. Test the connection**, click **Test connection**. SecureAI asks Google (without signing anyone in) and checks:

   | Check | If it fails |
   |---|---|
   | Client ID | Google does not know that client (`invalid_client`). Check that you copied the full ID and that the client is not deleted or disabled. |
   | Redirect URI registered on the client | The URI from step 1 is not in **Authorized redirect URIs** (`redirect_uri_mismatch`). Add it exactly and wait a few minutes. |
   | Client secret | The secret does not belong to that client (`invalid_client`). Paste it again or add a new one. |

   The test uses what is typed in the form, so you can test before saving.
3. Turn on **Show "Continue with Google" on the login page**.
4. Click **Save**.

From then on the card shows **Active on the login page**, and the **Continue with Google** button appears on your instance's login page.

## Step 6: Add your users

SecureAI **does not create accounts automatically** on first sign-in: everyone who will sign in with Google must exist in SecureAI and be active, with the **same email** as their Google Workspace account (case does not matter; `+` aliases are not accepted).

- **Existing users**: people who already have a SecureAI account (even with a password) are not recreated. They can keep signing in with their password, and also with Google.
- **New SSO-only users**: in **Admin → IAM Management → User Management → Add User**, choose the authentication method **Business Account / SSO**. The user does not get an email to create a password and signs in directly with **Continue with Google**.

When a user is deactivated in SecureAI, they cannot sign in through SSO either.

## Test the sign-in

1. Open your instance's login page in an incognito window.
2. Click **Continue with Google**.
3. Pick your Google Workspace account.
4. Google sends you back to SecureAI, signed in.

Password sign-in keeps working: enabling SSO does not turn it off.

## Disable or remove the integration

- To hide the button but keep the configuration, turn the switch off and save.
- To delete it, use **Remove configuration**. If your instance previously had SSO configured by Hiper AI, that configuration applies again.

## Rotate the client secret

1. In Google Cloud, open the OAuth client and click **Add secret** (the old one keeps working).
2. In SecureAI, paste the new value into **Client secret**, click **Test connection** and then **Save**. Leaving the field empty keeps the current secret.
3. Once you have confirmed that sign-in works, disable and delete the old secret in Google Cloud.

The change applies immediately, without ending active sessions.

## If your instance already had SSO configured by Hiper AI

Instances where Hiper AI configured Google SSO on request show the card as **Configured by Hiper AI**. That configuration keeps working. If you save your own in Integrations, it replaces it; if you later remove yours, the previous one applies again.

## Troubleshooting

Sign-in errors are shown on the SecureAI login page:

| Message in SecureAI | Cause and fix |
|---|---|
| "User not found in SecureAI database." | There is no SecureAI account with that email. Create it (step 6). |
| "This account is not allowed to sign in here…" | The account does not belong to one of the **Allowed email domains**, or it is a personal Google account (no Workspace). Add the domain or use the corporate account. |
| "Your identity provider has not verified this email address." | Google did not mark the email as verified, or the email contains characters SecureAI does not accept (for example a `+` alias). |
| "This sign-in method is not enabled for your organization." | The integration is disabled or incomplete. Check the card in Integrations. |
| "Your identity provider did not complete the sign-in…" | Google returned an error, for example because the user cancelled. |
| "Single sign-on could not be completed…" | The code exchange failed, usually because the secret was replaced or deleted. Use **Test connection**. |
| "The sign-in session expired or was not started from this browser…" | More than 10 minutes passed, or the sign-in started in another tab/browser. Try again from the login page. |

Errors shown by Google (before returning to SecureAI):

- **Error 400: redirect_uri_mismatch**: the client's redirect URI is not exactly the one from step 1. Fix it under **Authorized redirect URIs** (not JavaScript origins).
- **Error 403: org_internal**: the app is **Internal** and the account does not belong to the Google Cloud organization that owns the project. This also happens when your company has more than one Google organization (for example `company.com` and `company.ai`) and the OAuth client was created in a project of the other one: create it in a project of the organization your users belong to (the console's project picker shows each project's organization).
- **Error 401: invalid_client / deleted_client**: the OAuth client does not exist or was deleted. Create a new one and update SecureAI.
- **"Access blocked: your administrator has not trusted this app"**: your Workspace's app access controls block third-party apps. In the Google Admin console (**Security → Access and data control → API controls → Manage third-party app access**), mark the client ID as **Trusted**.

If you need help, contact support from **Get Support** in your profile menu and include the Client ID and the error message. **Never send the client secret.**

## Additional resources

- [Setting up OAuth 2.0 in Google Cloud](https://support.google.com/cloud/answer/6158849)
- [OpenID Connect at Google](https://developers.google.com/identity/openid-connect/openid-connect)
- [Control which third-party apps access Google Workspace data](https://support.google.com/a/answer/7281227)
