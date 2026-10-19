---
sidebar_position: 1
title: "Google Drive — Add from Drive"
sidebarTitle: "Google Drive"
icon: "/img/icons/google-drive.svg"
sidebar_label: "Google Drive"
description: "Let your users attach files from Google Drive and shared drives in the SecureAI chat. Self-serve setup with your own Google Cloud OAuth client."
---

# Google Drive — Add from Drive

With this integration, your users attach files from **Google Drive** (My Drive, Shared with me, and **shared drives**) directly from the chat, using the **Add from Drive** option in the attach button.

Setup is **self-serve**: an administrator in your organization creates an OAuth client and an API key in **your own Google Cloud project** and enters them in **Admin → Integrations → Files**. There is no need to open a ticket or wait for Hiper AI: the option appears in the chat as soon as you save the configuration.

Estimated time: 10 minutes.

## How it works

1. The user clicks **Attach → Add from Drive**. The first time, Google asks them to sign in with **their own account** and to authorize SecureAI.
2. The **official Google Drive picker** (Google Picker) opens. The user selects one or more files.
3. The user's browser downloads **only the selected files**, using the user's own token, and attaches them to the message. Google documents are exported to Office formats (Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`; everything else, to PDF).
4. The file follows the same path as any attachment: it **goes through DLP** and your organization's policies before reaching a model.

<Info>
**SecureAI never sees your entire Drive.** The `drive.file` scope is used: SecureAI can only read the files that each user selects in the picker, and nothing else. There is no service account, no domain-wide delegation, and no background reading: a user can only attach what they can already open in Drive.
</Info>

## Prerequisites

- A Google Cloud project **within your Google Workspace organization**, and permissions to enable APIs, configure Google Auth Platform, and create credentials in it (for example, the **Owner** or **Editor** role on the project).
- SecureAI administrator access, with **Administrator** permission on the **Integrations** section.
- A SecureAI plan that includes **Attach from Drive / SharePoint**. Without it you can leave the configuration ready, but users will not see the option.

## Step 1: Copy the addresses from SecureAI

1. Sign in to SecureAI as an administrator.
2. Go to **Admin → Integrations** and filter by the **Files** category.
3. On the **Google Drive** card, click **Connect integration**.

<div class="mac-window">
  ![Cards in the Files category](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. In the **1. Set up Google Cloud** section you will find the two values you need in Google Cloud, each with its own **Copy** button:
   - **Authorized JavaScript origin**: the address of your instance, for example `https://<your-company>.hiperai.ai`.
   - **Website restriction for the API key**: the same address ending in `/*`.

<div class="mac-window">
  ![Origin and restriction in the SecureAI drawer](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

Always use the values shown by your instance: they must match exactly, including `https://` and with no trailing `/` on the origin.

## Step 2: Choose the project and enable the APIs

1. Open the [Google Cloud console](https://console.cloud.google.com) and, in the project selector in the top bar, choose a project from your organization (or create a new one, for example `SecureAI Drive`).
2. Go to **APIs & Services → Library**, search for **Google Drive API**, and click **Enable**.

<div class="mac-window">
  ![Enable the Google Drive API](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. Repeat for **Google Picker API**.

<div class="mac-window">
  ![Enable the Google Picker API](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## Step 3: Configure the consent screen

1. Go to **Google Auth Platform** (menu **APIs & Services → OAuth consent screen**). If the project does not have it configured yet, click **Get started**.
2. Fill in **App name** (for example `SecureAI`) and the **User support email**.
3. Under **Audience**, choose **Internal**: only accounts in your Google Workspace organization will be able to authorize the app, and Google does not require verification.
4. Fill in the contact email, accept the user data policy, and click **Create**.

<div class="mac-window">
  ![Internal audience in Google Auth Platform](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

You do not need to add scopes manually: SecureAI requests only `drive.file`, a non-sensitive scope.

## Step 4: Create the OAuth client

1. In **Google Auth Platform → Clients**, click **Create client**.
2. Under **Application type**, choose **Web application** and give it a name (for example `SecureAI — Add from Drive`).
3. Under **Authorized JavaScript origins**, click **Add URI** and paste the **Authorized JavaScript origin** you copied in step 1.
4. Leave the **Authorized redirect URIs** empty: the picker does not use them.
5. Click **Create**.

<div class="mac-window">
  ![Web application OAuth client with the SecureAI origin](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. Copy the **Client ID** (it ends in `.apps.googleusercontent.com`). This client does not need a secret: do not copy it or enter it anywhere.

<div class="mac-window">
  ![Client ID created](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
If your organization already uses a Google web client for [Google Workspace sign-in](/en/iam/google-workspace) in SecureAI, you can reuse it: add the JavaScript origin to that same client.
</Note>

## Step 5: Create and restrict the API key

1. Go to **APIs & Services → Credentials** and click **Create credentials → API key**.
2. Open the newly created key (**Edit API key**):
   - Under **Application restrictions**, choose **Websites** and add the **Website restriction** you copied in step 1 (the address ending in `/*`).
   - Under **API restrictions**, choose **Restrict key** and select only **Google Picker API**.
3. Click **Save** and copy the key (it starts with `AIza`).

<div class="mac-window">
  ![API key restricted to Websites and the Google Picker API](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
The API key **is public by design**: each user's browser receives it to open the picker. That is why it is mandatory to restrict it to the SecureAI site and to the Google Picker API. Restrict it **before** using **Test connection** in SecureAI: Google may prevent you from adding restrictions to a key that has already recorded usage with other APIs.
</Warning>

## Step 6: Enter, test, and enable in SecureAI

1. Go back to the **Google Drive** drawer in SecureAI.
2. Under **2. Paste the identifiers**, paste the **Client ID** and the **API key**.
3. Under **3. Test it**:
   - **Test connection** verifies from SecureAI's servers that the API key is valid, that it accepts requests from your instance, and that it belongs to the **same project** as the OAuth client.
   - **Try signing in** opens the same Google window your users will see: sign in with your account. SecureAI confirms that the origin is authorized and that the Google Drive API responds.

<div class="mac-window">
  ![Green checks in the SecureAI drawer](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. Under **4.**, leave **Show "Add from Drive" to users** turned on and click **Save**.

The card changes to **Available in the chat**.

## Step 7: How your users use it

1. In the chat, the user clicks the **attach** button and chooses **Add from Drive**.

<div class="mac-window">
  ![Add from Drive in the attach menu](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. The first time, Google asks them to choose their account and to authorize SecureAI to see the files they select.
3. The Google Drive picker opens, with tabs for My Drive, shared drives, and images. They select one or more files and click **Select**.


4. The files appear attached to the message, with the Google Drive icon.

## Troubleshooting

| What you see | Cause | What to do |
|---|---|---|
| **Test connection**: "The API key's website restrictions do not include this address" | The API key does not have the SecureAI site | Add the exact restriction from step 1, ending in `/*` |
| **Test connection**: "The API key belongs to a different project than the OAuth client" | The credentials were created in different projects | Create the API key in the same project as the OAuth client |
| **Test connection**: "The Google Drive API is not enabled" | The API has not been enabled | Step 2 |
| The Google window shows **Error 400: origin_mismatch** or **redirect_uri_mismatch** | The JavaScript origin is not in the OAuth client | Add it (step 4). Changes may take a few minutes |
| The Google window shows **Error 403: org_internal** | The user is using an account outside your Workspace | They must sign in with their organization account |
| The picker shows "The API developer key is invalid" | API key copied incorrectly or without the Google Picker API | Review step 5 |
| "SecureAI did not receive access to this file" | The file was not selected in the picker | Select it from the Drive window |
| "Its owner does not allow downloading it" | The owner disabled downloading | Ask the owner to enable it |
| The user does not see **Add from Drive** | The integration is turned off, not saved, or the plan does not include it | Check the card in **Admin → Integrations → Files** |

## Frequently asked questions

**Does it work with shared drives?** Yes. The picker has a tab for shared drives; the user sees the drives they are a member of.

**What permissions does each user give SecureAI?** Only `drive.file`: access to the files the user selected in the picker. SecureAI cannot list, search, or read any other file in your Drive.

**How do I turn it off?** Turn off **Show "Add from Drive" to users** and save, or click **Remove configuration**. To also cut off the access users have already granted, delete the OAuth client in Google Cloud.

**Hiper AI had already configured Drive for me. Do I need to do anything?** No. As long as you do not save a configuration of your own, the card shows **Configured by Hiper AI** and everything keeps working the same. If you save your own, it replaces that one.

**What about the "Google Drive service account" from the previous version?** It is no longer used: each download is made with the user's own token, which is more secure, because a user can never attach a file they cannot open.
