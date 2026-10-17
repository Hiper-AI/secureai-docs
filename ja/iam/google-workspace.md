---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Google Workspace (SSO) の統合

この統合により、組織のユーザーは Google Workspace アカウントで SecureAI にサインインできるようになります (**Continue with Google** ボタン)。セットアップは**セルフサービス**です。組織の管理者が自社の Google Cloud プロジェクトに OAuth クライアントを作成し、**管理画面 → 連携** で詳細を入力します。チケットを作成する必要も、Hiper AI の対応を待つ必要もありません。保存するとすぐに、ログイン ページにボタンが表示されます。

所要時間の目安: 10 分。

## 前提条件

- **Google Workspace 組織内**の Google Cloud プロジェクトと、そのプロジェクトで Google Auth Platform を構成し OAuth クライアントを作成する権限 (例: プロジェクトの **オーナー** (Owner) または **編集者** (Editor) ロール)。
- SecureAI への管理者アクセス権と、**連携** セクションに対する **Admin** 権限。

## しくみ

1. Google Cloud で**種類が「ウェブ アプリケーション」の OAuth 2.0 クライアント**を作成します。SecureAI は `openid`、`email`、`profile` スコープを使用した OpenID Connect を使用します。
2. SecureAI で、**クライアント ID**、**クライアント シークレット**、**Google Workspace ドメイン**を入力します。シークレットは暗号化して保存され、再表示されることはありません。
3. ユーザーが **Continue with Google** をクリックすると、Google がユーザーを認証し、SecureAI は次の条件をすべて満たす場合にのみアクセスを許可します。
   - Google がユーザーのメール アドレスを確認済みであること
   - アカウントが**自社の Workspace ドメインのいずれかで管理されている**こと (`hd` クレーム)
   - メール アドレスが SecureAI の**有効な**アカウントと一致すること

個人の Google アカウント (例: @gmail.com アカウントや、会社のメール アドレスで作成した個人アカウント) は、SecureAI ユーザーと同じメール アドレスであっても、サインイン**できません**。

## ステップ 1: SecureAI からリダイレクト URI をコピーする

1. 管理者として SecureAI にサインインします。
2. **管理画面 → 連携** に移動し、**IAM** カテゴリで絞り込みます。
3. **Google Workspace (SSO)** カードで **統合を接続** をクリックします。
4. **1. Create an OAuth client in Google Cloud** セクションで、**Redirect URI** の横にある **Copy** をクリックします。

URI は次のような形式です (ドメインはお使いのインスタンスのものになります)。

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

必ずお使いのインスタンスに表示される URI を使用してください。`https://` を含め、完全に一致している必要があります。

## ステップ 2: Google Cloud プロジェクトを選択または作成する

1. [Google Cloud コンソール](https://console.cloud.google.com)を開きます。
2. 上部バーのプロジェクト選択ツールで、組織内のプロジェクトを選択するか、**新しいプロジェクト** (New Project) をクリックします。

<div class="mac-window">
  ![New project](/img/google%20sso%20images/google%20-%201.png)
</div>

3. 新しく作成する場合: 名前を付け (例: `SecureAI SSO`)、**組織** (Organization) が自社の Google Workspace 組織になっていることを確認して、**作成** (Create) をクリックします。

<div class="mac-window">
  ![Create project](/img/google%20sso%20images/google%20-%202.png)
</div>

サインインのために API を有効にする必要はありません。

## ステップ 3: Google Auth Platform (同意画面) を構成する

1. メニューで **API とサービス → OAuth 同意画面** (APIs & Services → OAuth consent screen) に移動します (新しいコンソールでは **Google Auth Platform** と呼ばれます)。初めての場合は **開始** (Get started) をクリックします。

<div class="mac-window">
  ![OAuth consent screen](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **アプリ情報** (App information): アプリ名 (例: `SecureAI`) とユーザー サポートメール。
3. **対象** (Audience): **内部** (Internal) を選択します。Google Workspace 組織内のアカウントのみがアプリを使用でき、Google によるアプリの確認は不要です。
4. **連絡先情報** (Contact information): Google からの通知を受け取るメール アドレス。
5. ユーザーデータに関するポリシーに同意し、**作成** (Create) をクリックします。

<div class="mac-window">
  ![Create the OAuth configuration](/img/google%20sso%20images/google%20-%204.png)
</div>

`openid`、`email`、`profile` スコープは機密性の高いスコープではないため、**データアクセス** (Data access) に追加する必要はありません。

<Note>
**外部** (External) を選択した場合、アプリは「テスト中」ではなく **本番環境** (In production) である必要があります。テストモードでは、登録したテストユーザーのみがサインインできます。外部を選択した場合でも、SecureAI はステップ 5 で構成した Workspace ドメインのアカウントのみを受け入れます。
</Note>

## ステップ 4: OAuth クライアントを作成する

1. Google Auth Platform で **クライアント** (Clients) に移動します (または **API とサービス → 認証情報 → + 認証情報を作成 → OAuth クライアント ID**)。

<div class="mac-window">
  ![Create OAuth client ID](/img/google%20sso%20images/google%20-%207.png)
</div>

2. **+ クライアントを作成** (Create client) をクリックします。
3. **アプリケーションの種類** (Application type): **ウェブ アプリケーション** (Web application)。
4. **名前** (Name): 例: `SecureAI SSO`。
5. **承認済みのリダイレクト URI** (Authorized redirect URIs) で **+ URI を追加** (Add URI) をクリックし、ステップ 1 の URI を貼り付けます (**承認済みの JavaScript 生成元** (Authorized JavaScript origins) は不要です)。

<div class="mac-window">
  ![Authorized redirect URIs](/img/google%20sso%20images/google%20-%208.png)
</div>

6. **作成** (Create) をクリックします。
7. 表示されたダイアログで、**クライアント ID** (末尾が `.apps.googleusercontent.com`) と **クライアント シークレット** (先頭が `GOCSPX-`) をコピーします。バックアップとして JSON をダウンロードすることもできます。

<div class="mac-window">
  ![OAuth client created](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google がシークレット全体を表示するのは作成時のみです。安全な場所に保管してください。紛失した場合は、クライアントに新しいシークレットを追加してください。
</Warning>

リダイレクト URI の変更が Google 側で反映されるまで、数分かかることがあります。

## ステップ 5: SecureAI に詳細を入力してテストする

**管理画面 → 連携 → Google Workspace (SSO)** に戻ります。

1. **2. Paste the OAuth client details** で、次の項目を入力します。
   - **Client ID** (クライアント ID): ステップ 4 で取得したもの。
   - **Client secret** (クライアント シークレット): ステップ 4 で取得したもの。
   - **Allowed email domains** (許可するメール ドメイン、必須): Google Workspace のプライマリ ドメインと、使用している場合はセカンダリ ドメインをカンマ区切りで入力します。例: `contoso.com, contoso.co.uk`。
2. **3. Test the connection** で **Test connection** (接続をテスト) をクリックします。SecureAI は (誰もサインインさせずに) Google に問い合わせ、次の項目を確認します。

   | チェック項目 | 失敗した場合 |
   |---|---|
   | クライアント ID | Google がそのクライアントを認識していません (`invalid_client`)。ID 全体をコピーしたこと、およびクライアントが削除または無効化されていないことを確認してください。 |
   | クライアントに登録されたリダイレクト URI | ステップ 1 の URI が **承認済みのリダイレクト URI** に含まれていません (`redirect_uri_mismatch`)。正確に追加し、数分待ってください。 |
   | クライアント シークレット | シークレットがそのクライアントのものではありません (`invalid_client`)。もう一度貼り付けるか、新しいシークレットを追加してください。 |

   テストはフォームに入力されている内容を使用するため、保存前にテストできます。
3. **Show "Continue with Google" on the login page** (ログイン ページに「Continue with Google」を表示) をオンにします。
4. **Save** (保存) をクリックします。

以降、カードには **Active on the login page** (ログイン ページで有効) と表示され、インスタンスのログイン ページに **Continue with Google** ボタンが表示されます。

## ステップ 6: ユーザーを追加する

SecureAI は初回サインイン時に**アカウントを自動作成しません**。Google でサインインするすべてのユーザーが SecureAI に存在して有効になっており、Google Workspace アカウントと**同じメール アドレス**を持っている必要があります (大文字と小文字は区別されません。`+` エイリアスは使用できません)。

- **既存のユーザー**: すでに SecureAI アカウントを持っているユーザー (パスワードを使用している場合も含む) は再作成されません。引き続きパスワードでサインインでき、Google でもサインインできます。
- **SSO 専用の新規ユーザー**: **管理画面 → IAM管理 → ユーザー管理 → ユーザーを追加** で、認証方式として **ビジネスアカウント / SSO** を選択します。ユーザーにはパスワード作成用のメールは送信されず、**Continue with Google** から直接サインインします。

SecureAI でユーザーが無効化されると、そのユーザーは SSO でもサインインできなくなります。

## サインインをテストする

1. シークレット (プライベート) ウィンドウでインスタンスのログイン ページを開きます。
2. **Continue with Google** をクリックします。
3. Google Workspace アカウントを選択します。
4. Google から SecureAI にリダイレクトされ、サインインした状態になります。

パスワードによるサインインは引き続き使用できます。SSO を有効にしても無効にはなりません。

## 統合を無効化または削除する

- 構成を残したままボタンを非表示にするには、スイッチをオフにして保存します。
- 構成を削除するには、**Remove configuration** (構成を削除) を使用します。以前に Hiper AI が SSO を構成していたインスタンスでは、その構成が再び適用されます。

## クライアント シークレットのローテーション

1. Google Cloud で OAuth クライアントを開き、**シークレットを追加** (Add secret) をクリックします (古いシークレットは引き続き機能します)。
2. SecureAI で、**Client secret** に新しい値を貼り付け、**Test connection** をクリックしてから **Save** をクリックします。フィールドを空欄のままにすると、現在のシークレットが維持されます。
3. サインインが機能することを確認したら、Google Cloud で古いシークレットを無効にして削除します。

変更はすぐに適用され、アクティブなセッションは終了しません。

## インスタンスに Hiper AI が構成した SSO がすでにある場合

依頼に応じて Hiper AI が Google SSO を構成したインスタンスでは、カードに **Configured by Hiper AI** (Hiper AI が構成済み) と表示されます。その構成は引き続き機能します。連携で独自の構成を保存すると、それに置き換わります。後で独自の構成を削除すると、以前の構成が再び適用されます。

## トラブルシューティング

サインイン エラーは SecureAI のログイン ページに表示されます。

| SecureAI のメッセージ | 原因と対処法 |
|---|---|
| "User not found in SecureAI database." | そのメール アドレスの SecureAI アカウントが存在しません。アカウントを作成してください (ステップ 6)。 |
| "This account is not allowed to sign in here…" | アカウントが **Allowed email domains** のいずれにも属していないか、個人の Google アカウント (Workspace 以外) です。ドメインを追加するか、会社のアカウントを使用してください。 |
| "Your identity provider has not verified this email address." | Google がメール アドレスを確認済みとしてマークしていないか、メール アドレスに SecureAI が受け付けない文字 (例: `+` エイリアス) が含まれています。 |
| "This sign-in method is not enabled for your organization." | 統合が無効になっているか、構成が不完全です。連携のカードを確認してください。 |
| "Your identity provider did not complete the sign-in…" | Google がエラーを返しました (例: ユーザーがキャンセルした場合)。 |
| "Single sign-on could not be completed…" | コードの交換に失敗しました。通常、シークレットが置き換えられたか削除されたことが原因です。**Test connection** を使用してください。 |
| "The sign-in session expired or was not started from this browser…" | 10 分以上経過したか、別のタブ/ブラウザーでサインインが開始されました。ログイン ページからもう一度お試しください。 |

Google が表示するエラー (SecureAI に戻る前):

- **Error 400: redirect_uri_mismatch**: クライアントのリダイレクト URI がステップ 1 の URI と完全には一致していません。(JavaScript 生成元ではなく) **承認済みのリダイレクト URI** で修正してください。
- **Error 403: org_internal**: アプリが **内部** に設定されており、アカウントがプロジェクトを所有する Google Cloud 組織に属していません。これは、会社に複数の Google 組織がある場合 (たとえば `company.com` と `company.ai`) に、OAuth クライアントがもう一方の組織のプロジェクトで作成されたときにも発生します。ユーザーが所属する組織のプロジェクトで作成してください (コンソールのプロジェクト選択ツールに各プロジェクトの組織が表示されます)。
- **Error 401: invalid_client / deleted_client**: OAuth クライアントが存在しないか、削除されています。新しいクライアントを作成し、SecureAI を更新してください。
- **「アクセスがブロックされました: このアプリは管理者によって信頼されていません」** ("Access blocked: your administrator has not trusted this app"): Workspace のアプリのアクセス制御によって、サードパーティ製アプリがブロックされています。Google 管理コンソール (**セキュリティ → アクセスとデータ管理 → API の制御 → サードパーティ製アプリのアクセスを管理**) で、クライアント ID を **信頼できる** (Trusted) に設定してください。

サポートが必要な場合は、プロフィール メニューの **サポートを受ける** からサポートに連絡し、クライアント ID とエラー メッセージを伝えてください。**クライアント シークレットは絶対に送信しないでください。**

## その他のリソース

- [Google Cloud での OAuth 2.0 の設定](https://support.google.com/cloud/answer/6158849)
- [Google の OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Google Workspace のデータにアクセスできるサードパーティ製アプリを管理する](https://support.google.com/a/answer/7281227)