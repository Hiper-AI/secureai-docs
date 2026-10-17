---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Microsoft Entra ID (SSO) の統合

この統合により、組織のユーザーは Microsoft の職場アカウントで SecureAI にサインインできるようになります (**Continue with Microsoft** ボタン)。セットアップは**セルフサービス**です。組織の管理者が自社の Microsoft Entra ID テナント (旧称 Azure Active Directory) に SecureAI を登録し、**管理画面 → 連携** で詳細を入力します。チケットを作成する必要も、Hiper AI の対応を待つ必要もありません。保存するとすぐに、ログイン ページにボタンが表示されます。

所要時間の目安: 10 分。

## 前提条件

- アプリの登録を作成できる Microsoft Entra ロール (例: **アプリケーション開発者** (Application Developer) または **アプリケーション管理者** (Application Administrator))。管理者の同意の付与 (ステップ 4) には、**クラウド アプリケーション管理者** (Cloud Application Administrator)、**アプリケーション管理者**、または **グローバル管理者** (Global Administrator) のロールが必要です。
- SecureAI への管理者アクセス権と、**連携** セクションに対する **Admin** 権限。

## しくみ

1. Entra ID テナントに**アプリの登録**を作成します。SecureAI は **クライアント シークレット**を使用した OpenID Connect (認可コード フロー) を使用します。
2. SecureAI で、**ディレクトリ (テナント) ID**、**アプリケーション (クライアント) ID**、**クライアント シークレットの値**を入力します。シークレットは暗号化して保存され、再表示されることはありません。
3. ユーザーが **Continue with Microsoft** をクリックすると、Microsoft がユーザーを認証し (組織の MFA と条件付きアクセス ポリシーが適用されます)、メール アドレスが SecureAI の**有効な**アカウントと一致する場合に SecureAI へのアクセスが許可されます。

SecureAI は**自社の**テナントが発行したトークンのみを受け入れます。サインインは自社のディレクトリに固定されており、マルチテナント エンドポイント (`common` / `organizations`) が使用されることはありません。

## ステップ 1: SecureAI からリダイレクト URI をコピーする

1. 管理者として SecureAI にサインインします。
2. **管理画面 → 連携** に移動し、**IAM** カテゴリで絞り込みます。
3. **Microsoft Entra ID (SSO)** カードで **統合を接続** をクリックします (カードに **Configured by Hiper AI** (Hiper AI が構成済み) と表示されている場合は **再設定** をクリックします)。
4. **1. Register SecureAI in Microsoft Entra ID** セクションで、**Redirect URI** の横にある **Copy** をクリックします。

URI は次のような形式です (ドメインはお使いのインスタンスのものになります)。

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

必ずお使いのインスタンスに表示される URI を使用してください。`https://` を含め、1 文字単位で完全に一致している必要があります。

このウィンドウは開いたままにしておいてください。後で戻って詳細を貼り付けます。

## ステップ 2: Microsoft Entra ID にアプリケーションを登録する

1. [Microsoft Entra 管理センター](https://entra.microsoft.com) (または [Azure portal](https://portal.azure.com) → **Microsoft Entra ID**) を開きます。

<div class="mac-window">
  ![Searching for Microsoft Entra ID in the Azure portal](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. **アプリケーション → アプリの登録** (Applications → App registrations) に移動します。

<div class="mac-window">
  ![App registrations menu](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. **+ 新規登録** (New registration) をクリックします。

<div class="mac-window">
  ![New registration button](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. フォームに入力します。
   - **名前**: わかりやすい名前 (例: `SecureAI SSO`)。ユーザーには同意画面でこの名前が表示されます。
   - **サポートされているアカウントの種類**: **この組織ディレクトリのみに含まれるアカウント (シングル テナント)** (Accounts in this organizational directory only)。
   - **リダイレクト URI**: プラットフォームとして **Web** を選択し (「シングルページ アプリケーション」ではありません)、ステップ 1 でコピーした URI を貼り付けます。
5. **登録** (Register) をクリックします。

<div class="mac-window">
  ![Application registration form](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. アプリケーションの **概要** (Overview) ページで、次の値をコピーします。
   - **アプリケーション (クライアント) ID** — `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx` のような GUID。
   - **ディレクトリ (テナント) ID** — `155812d2-1112-46c8-bf52-xxxxxxxxxxxx` のような別の GUID。

## ステップ 3: クライアント シークレットを作成する

1. アプリケーションのメニューで **証明書とシークレット** (Certificates & secrets) を開きます。

<div class="mac-window">
  ![Certificates & secrets menu](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. **クライアント シークレット** (Client secrets) で **+ 新しいクライアント シークレット** (New client secret) をクリックします。
3. 説明 (例: `SecureAI SSO`) を入力し、有効期限を選択します (Microsoft は 12 か月未満を推奨しています。最大は 24 か月です)。
4. **追加** (Add) をクリックします。

<div class="mac-window">
  ![Add a client secret](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. **すぐに** **値** (Value) 列をコピーします (`plm8Q~xxxxxxxx…` のような形式です)。この値は 1 回しか表示されません。

<div class="mac-window">
  ![Client secret value](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
**シークレット ID** (Secret ID、GUID 形式) ではなく、**値** (Value) をコピーしてください。シークレット ID を貼り付けると、SecureAI は保存時にそれを拒否します。
</Warning>

有効期限の日付を控えておいてください。シークレットの有効期限が切れると、新しいシークレットを入力するまで Microsoft でのサインインが機能しなくなります ([クライアント シークレットのローテーション](#クライアント-シークレットのローテーション) を参照)。

## ステップ 4: API のアクセス許可を確認する

SecureAI は、Microsoft Graph の委任されたアクセス許可 `openid`、`profile`、`email`、`User.Read` を要求します (`User.Read` はユーザーのプロフィール写真を読み取るために使用します)。`User.Read` は新しいアプリの登録に既定で追加されています。

1. アプリケーションのメニューで **API のアクセス許可** (API permissions) を開きます。
2. **Microsoft Graph → 委任されたアクセス許可** (Delegated permissions) に `User.Read` が含まれていることを確認します。明示的に一覧に表示したい場合は、`openid`、`profile`、`email` も追加します (**+ アクセス許可の追加 → Microsoft Graph → 委任されたアクセス許可** から)。

<div class="mac-window">
  ![Add delegated permissions](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. **＜組織名＞ に管理者の同意を与えます** (Grant admin consent) をクリックし、確定します。

<div class="mac-window">
  ![Grant admin consent](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

テナントでユーザーによるアプリケーションへの同意が許可されていない場合 (企業ではよくある設定です)、この手順は必須です。この手順を行わないと、ユーザーがサインインする際に「管理者の承認が必要」(Need admin approval) と表示されます。

## ステップ 5: SecureAI に詳細を入力してテストする

**管理画面 → 連携 → Microsoft Entra ID (SSO)** に戻ります。

1. **2. Paste the app registration details** で、次の項目を入力します。
   - **Directory (tenant) ID** (ディレクトリ (テナント) ID): ステップ 2 の GUID (`contoso.onmicrosoft.com` など、テナントの確認済みドメインも使用できます)。
   - **Application (client) ID** (アプリケーション (クライアント) ID): ステップ 2 の GUID。
   - **Client secret value** (クライアント シークレットの値): ステップ 3 の値。
   - **Allowed email domains** (許可するメール ドメイン、省略可、推奨): 組織のメール ドメインをカンマ区切りで入力します (例: `contoso.com, contoso.co.uk`)。これらのアドレスのみが Microsoft でサインインできます。空欄のままにすると、SecureAI に存在するテナントのアカウントであればすべて受け入れられます。
2. **3. Test the connection** で **Test connection** (接続をテスト) をクリックします。SecureAI は (誰もサインインさせずに) Microsoft に問い合わせ、次の項目を確認します。

   | チェック項目 | 失敗した場合 |
   |---|---|
   | ディレクトリ (テナント) ID | Microsoft がそのテナントを認識していません (`AADSTS90002`)。概要ページからディレクトリ ID をコピーしてください。 |
   | アプリケーション (クライアント) ID | そのアプリケーションがテナント内に存在しません (`AADSTS700016`)。クライアント ID と、アプリが同じテナントにあることを確認してください。 |
   | クライアント シークレット | シークレットが無効 (`AADSTS7000215`) または期限切れ (`AADSTS7000222`) です。**値** (Value) を貼り付けるか、新しいシークレットを作成してください。 |
   | アプリケーションに登録されたリダイレクト URI | ステップ 1 の URI がアプリの登録に含まれていません (ユーザーがサインイン時に受け取る `AADSTS50011` エラーです)。アプリで **認証 → プラットフォームを追加 → Web** (Authentication → Add a platform → Web) を開き、URI を正確に貼り付けて保存してください。 |

   テストはフォームに入力されている内容を使用するため、保存前にテストできます。アプリ専用トークンをブロックする条件付きアクセス ポリシーがテナントにある場合、シークレットが「could not be verified automatically」(自動的に検証できませんでした) と表示されることがあります。これはエラーではありません。実際にサインインして確認してください。

   <Note>
   このテストでは URI が登録されていることは確認できますが、**Web** プラットフォームと **シングルページ アプリケーション (SPA)** のどちらに登録されたかは確認できません。SPA として登録されている場合、テストは成功しますが、サインインは「Single sign-on could not be completed」で失敗します。**認証** で URI が **Web** の下に表示されていることを確認してください。
   </Note>

3. **Show "Continue with Microsoft" on the login page** (ログイン ページに「Continue with Microsoft」を表示) がオンになっていることを確認します (初回は既定でオンになっています)。
4. **Save** (保存) をクリックします。

以降、カードには **Active on the login page** (ログイン ページで有効) と表示され、インスタンスのログイン ページに **Continue with Microsoft** ボタンが表示されます。

## ステップ 6: ユーザーを追加する

SecureAI は初回サインイン時に**アカウントを自動作成しません**。Microsoft でサインインするすべてのユーザーが SecureAI に存在し、有効になっている必要があります。SecureAI アカウントのメール アドレスは、Entra ID のユーザーのメール アドレス (**メール** 属性。空の場合は **ユーザー プリンシパル名 (UPN)**) と一致している必要があります。大文字と小文字は区別されません。

- **既存のユーザー**: すでに SecureAI アカウントを持っているユーザー (パスワードを使用している場合も含む) は再作成されません。引き続きパスワードでサインインでき、Microsoft でもサインインできます。
- **SSO 専用の新規ユーザー**: **管理画面 → IAM管理 → ユーザー管理 → ユーザーを追加** で、認証方式として **ビジネスアカウント / SSO** を選択します。ユーザーにはパスワード作成用のメールは送信されず、**Continue with Microsoft** から直接サインインします。
- **多数のユーザー**: SCIM を使用して、Entra ID からユーザーを自動的にプロビジョニングおよびプロビジョニング解除できます。

SecureAI でユーザーが無効化されると (手動または SCIM 経由)、そのユーザーは SSO でもサインインできなくなります。

## サインインをテストする

1. シークレット (プライベート) ウィンドウでインスタンスのログイン ページを開きます。
2. **Continue with Microsoft** をクリックします。
3. 職場アカウントを選択し、求められた場合は MFA を完了します。
4. Microsoft から SecureAI にリダイレクトされ、サインインした状態になります。

パスワードによるサインインは引き続き使用できます。SSO を有効にしても無効にはなりません。

## 統合を無効化または削除する

- 構成を残したままボタンを非表示にするには、スイッチをオフにして保存します。
- 構成を削除するには、**Remove configuration** (構成を削除) を使用します。以前に Hiper AI が SSO を構成していたインスタンスでは、その構成が再び適用されます。

## クライアント シークレットのローテーション

シークレットの有効期限が切れる前に、次の手順を行います。

1. Entra ID で、古いシークレットを削除せずに新しいクライアント シークレットを作成します (ステップ 3)。
2. SecureAI で統合を開き、**Client secret value** に新しい値を貼り付け、**Test connection** をクリックしてから **Save** をクリックします。フィールドを空欄のままにすると、現在のシークレットが維持されます。
3. サインインが機能することを確認したら、Entra ID で古いシークレットを削除します。

変更はすぐに適用され、アクティブなセッションは終了しません。

## インスタンスに Hiper AI が構成した SSO がすでにある場合

依頼に応じて Hiper AI が Microsoft SSO を構成したインスタンスでは、カードに **Configured by Hiper AI** (Hiper AI が構成済み) と表示されます。その構成は引き続き機能します。連携で独自の構成を保存すると、それに置き換わります。後で独自の構成を削除すると、以前の構成が再び適用されます。

## トラブルシューティング

サインイン エラーは SecureAI のログイン ページに表示されます。

| SecureAI のメッセージ | 原因と対処法 |
|---|---|
| "User not found in SecureAI database." | そのメール アドレスの SecureAI アカウントが存在しません。アカウントを作成するか (ステップ 6)、メール アドレスが Entra ID のメール/UPN と一致していることを確認してください。 |
| "This account is not allowed to sign in here…" | メール アドレスのドメインが **Allowed email domains** に含まれていないか、トークンが別のテナントから発行されています。 |
| "This sign-in method is not enabled for your organization." | 統合が無効になっているか、構成が不完全です。連携のカードを確認してください。 |
| "Your identity provider did not complete the sign-in…" | Microsoft がエラーを返しました。ユーザーがキャンセルした、管理者の同意がない (ステップ 4)、またはユーザーがアプリケーションに割り当てられていない可能性があります。 |
| "Single sign-on could not be completed…" | コードの交換に失敗しました。通常、シークレットの有効期限切れまたは置き換え (**Test connection** を使用してください)、またはリダイレクト URI が **Web** ではなく **シングルページ アプリケーション** として登録されていることが原因です (**認証** で **Web** に移してください)。 |
| "Your account is inactive…" | SecureAI でアカウントが無効化されています。 |
| "The sign-in session expired or was not started from this browser…" | 10 分以上経過したか、別のタブ/ブラウザーでサインインが開始されました。ログイン ページからもう一度お試しください。 |

Microsoft が表示するエラー (SecureAI に戻る前):

- **AADSTS50011 – リダイレクト URI が一致しません**: Entra ID に登録された URI が、ステップ 1 で SecureAI に表示される URI と完全には一致していません (末尾のスラッシュが 1 つ多いだけでも一致しなくなります)。**Test connection** を使うと、最初のサインインの前に検出できます。
- **AADSTS65001 / 「管理者の承認が必要」**: 管理者の同意を与えてください (ステップ 4)。
- **AADSTS50105 – サインインしたユーザーがアプリケーションのロールに割り当てられていません**: エンタープライズ アプリケーションの **割り当てが必要ですか?** (Assignment required?) が **はい** に設定されています。**エンタープライズ アプリケーション → SecureAI SSO → ユーザーとグループ** (Enterprise applications → SecureAI SSO → Users and groups) で、ユーザーまたはグループを割り当ててください。
- **AADSTS7000215 / AADSTS7000222**: シークレットが無効または期限切れです。新しいシークレットを入力してください。

サポートが必要な場合は、プロフィール メニューの **サポートを受ける** からサポートに連絡し、アプリケーション (クライアント) ID、ディレクトリ ID、エラー メッセージを伝えてください。**クライアント シークレットは絶対に送信しないでください。**