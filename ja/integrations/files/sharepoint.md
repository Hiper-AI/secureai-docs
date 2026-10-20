---
sidebar_position: 2
title: "SharePoint & OneDrive — Add from SharePoint"
sidebarTitle: "SharePoint"
icon: "/img/icons/sharepoint.svg"
sidebar_label: "SharePoint & OneDrive"
description: "SecureAI のチャットで、ユーザーが SharePoint サイトおよび OneDrive のファイルを添付できるようにします。独自の Microsoft Entra ID アプリ登録を使用したセルフサービスでの設定です。"
---

# SharePoint & OneDrive — Add from SharePoint

この連携により、ユーザーは添付ボタンの **Add from SharePoint** オプションから、**SharePoint サイト**（Teams のサイトを含む）、**OneDrive**、**共有アイテム**のファイルをチャットから直接添付できます。

設定は**セルフサービス**です。組織の管理者が**自社の Microsoft Entra ID ディレクトリ**に SecureAI をアプリケーションとして登録し、識別子を **Admin → Integrations → Files** に登録します。チケットを起票したり、Hiper AI の対応を待ったりする必要はありません。設定を保存すると、すぐにチャットにオプションが表示されます。

所要時間の目安: 10 分。

## 仕組み

1. ユーザーが **Attach → Add from SharePoint** をクリックします。初回は、Microsoft から**ご自身の Microsoft 365 アカウント**でのログインを求められます。
2. Microsoft Graph 上の SecureAI のブラウザが開き、サイト、ライブラリ、フォルダー、検索、ユーザーと共有されているファイルが表示されます。ユーザーは 1 つ以上のファイルを選択します。
3. ユーザーのブラウザが、ユーザー自身のトークンを使って**選択したファイルのみ**をダウンロードし、メッセージに添付します。
4. ファイルは他の添付ファイルと同じ経路をたどります。モデルに到達する前に、**DLP** と組織のポリシーを通過します。

<Info>
**委任されたアクセス許可のみを使用し、アプリケーションのアクセス許可は使用しません。** SecureAI は常に**ログインしているユーザーの代理として**動作します。ユーザーが表示・添付できるのは、SharePoint で自分がすでに開けるものだけです。アプリケーションはクライアント シークレットを持たない「シングルページ アプリケーション」（SPA）であり、SecureAI がバックグラウンドで何かを読み取ることはありません。
</Info>

## 前提条件

- **SharePoint Online** を含む Microsoft 365 サブスクリプション（たとえば Business Basic、Business Standard、E3、E5）。このライセンスのない Entra ID ディレクトリには SharePoint サイトも OneDrive もありません。ログインはできますが、添付するファイルがありません。
- アプリケーションを登録でき、Microsoft Graph のアクセス許可に対して**管理者の同意を付与**できる Entra ID のロール（たとえば**クラウド アプリケーション管理者**または**グローバル管理者**）。
- SecureAI の管理者アクセス権（**Integrations** セクションに対する **Administrator** 権限）。
- **Attach from Drive / SharePoint** を含む SecureAI のプラン。含まれていない場合でも設定を済ませておくことはできますが、ユーザーにはオプションが表示されません。

## ステップ 1: SecureAI からリダイレクト URI をコピーする

1. 管理者として SecureAI にログインします。
2. **Admin → Integrations** に移動し、カテゴリ **Files** で絞り込みます。
3. **SharePoint & OneDrive** カードで **Connect integration** をクリックします。
4. **1. Register SecureAI in Microsoft Entra ID** セクションで、**Redirect URI** の横にある **Copy** をクリックします。

<div class="mac-window">
  ![SecureAI のサイドパネルに表示されたリダイレクト URI](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

URI はインスタンスのアドレスです。例: `https://<貴社名>.hiperai.ai`。必ずご利用のインスタンスに表示されるものを使用してください。完全に一致している必要があります。

## ステップ 2: Entra ID にアプリケーションを登録する

1. [Microsoft Entra 管理センター](https://entra.microsoft.com)を開き、**ID → アプリケーション → アプリの登録**（Identity → Applications → App registrations）に移動します。
2. **新規登録**（New registration）をクリックします。

<div class="mac-window">
  ![アプリの登録 → 新規登録](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. 次の項目を入力します。
   - **名前**（Name）: 例: `SecureAI — Add from SharePoint`
   - **サポートされているアカウントの種類**（Supported account types）: **この組織ディレクトリのみに含まれるアカウント**（Accounts in this organizational directory only。シングル テナント）
   - **リダイレクト URI**（Redirect URI）: ドロップダウンで **シングルページ アプリケーション (SPA)**（Single-page application）を選択し、ステップ 1 でコピーした URI を貼り付けます。
4. **登録**（Register）をクリックします。


<Warning>
プラットフォームは **Web** ではなく、**シングルページ アプリケーション (SPA)** にする必要があります。**Web** の場合、ログインはエラー `AADSTS9002326` で失敗します。すでに Web として登録した場合は、**認証**（Authentication）に移動し、同じ URI で **シングルページ アプリケーション** プラットフォームを追加して、Web のものを削除してください。
</Warning>

5. アプリケーションの**概要**（Overview）で、**アプリケーション (クライアント) ID**（Application (client) ID）と**ディレクトリ (テナント) ID**（Directory (tenant) ID）をコピーします。クライアント シークレットを作成する必要はありません。

<div class="mac-window">
  ![アプリケーション ID とディレクトリ ID](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## ステップ 3: Microsoft Graph のアクセス許可を追加する

1. アプリケーションで **API のアクセス許可 → アクセス許可の追加 → Microsoft Graph → 委任されたアクセス許可**（API permissions → Add a permission → Microsoft Graph → Delegated permissions）に移動します。
2. 次のものを検索して選択します。
   - `Files.Read.All` — ユーザーがアクセスできるファイルを読み取ります。
   - `Sites.Read.All` — ユーザーがアクセスできる SharePoint サイトを一覧表示および検索します。
3. **アクセス許可の追加**（Add permissions）をクリックします。`User.Read` は既定で追加済みです。そのままにしてください。

<div class="mac-window">
  ![Microsoft Graph の委任されたアクセス許可](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## ステップ 4: 管理者の同意を付与する

1. **API のアクセス許可**で、**&lt;組織名&gt; に管理者の同意を与えます**（Grant admin consent for &lt;org&gt;）をクリックし、**はい**で確定します。
2. 3 つのアクセス許可すべての状態が **&lt;組織名&gt; に付与されました** になっている必要があります。

<div class="mac-window">
  ![付与された管理者の同意](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

この手順を行わない場合、各ユーザーに同意の要求が表示されます（組織がユーザーによる同意を許可していない場合は、エラー `AADSTS65001` が表示されます）。

## ステップ 5: SecureAI に登録、テスト、有効化する

1. SecureAI の **SharePoint & OneDrive** のサイドパネルに戻ります。
2. **2. Paste the identifiers** で、**Directory (tenant) ID** と **Application (client) ID** を貼り付けます。
3. **3. Test it** で次を実行します。
   - **Test connection** は、SecureAI のサーバーから、ディレクトリが存在することを確認します。
   - **Try signing in** は、ユーザーに表示されるものと同じ Microsoft のウィンドウを開きます。ご自身のアカウントでログインしてください。SecureAI は、リダイレクト URI が SPA タイプであること、`Files.Read.All` と `Sites.Read.All` に同意が付与されていること、Microsoft Graph が応答することを確認します。

<div class="mac-window">
  ![SecureAI のサイドパネルで成功したテスト](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. **4.** で、**Show "Add from SharePoint" to users** を有効のままにして **Save** をクリックします。

カードが **Available in the chat** に変わります。

## ステップ 6: ユーザーの使い方

1. チャットで、ユーザーが**添付**ボタンをクリックし、**Add from SharePoint** を選択します。

<div class="mac-window">
  ![添付メニューの Add from SharePoint](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. 初回は、**Sign in with Microsoft** をクリックし、組織のアカウントを選択します。
3. **Sites**、**Shared**、または検索で移動し、1 つ以上のファイルを選択して **Add** をクリックします。


4. ファイルが SharePoint のアイコン付きでメッセージに添付されます。

## 利用できるユーザーを制限する（任意）

一部のユーザーまたはグループのみが **Add from SharePoint** を使用できるようにするには、次の手順を行います。

1. Entra で **エンタープライズ アプリケーション**（Enterprise applications）に移動し、登録したアプリケーションを開きます。
2. **プロパティ**（Properties）で **割り当てが必要ですか?**（Assignment required?）を有効にして保存します。
3. **ユーザーとグループ**（Users and groups）で、利用を許可するユーザーまたはグループを割り当てます。

割り当てられていないユーザーは、ログイン時にエラー `AADSTS50105` が表示され、ファイルを添付できません。

## トラブルシューティング

| 表示される内容 | 原因 | 対処方法 |
|---|---|---|
| `AADSTS50011` — リダイレクト URI が一致しません | ステップ 1 の URI が登録されていない | **認証 → シングルページ アプリケーション** に追加する |
| `AADSTS9002326` | URI が **Web** として登録されている | **シングルページ アプリケーション** に移す |
| `AADSTS65001` — 同意がありません | 管理者の同意が付与されていない | ステップ 4 |
| `AADSTS700016` — アプリケーションが見つかりません | アプリケーション ID またはディレクトリ ID が正しくない | **概要**から再度コピーする |
| `AADSTS50105` | ユーザーがアプリケーションに割り当てられていない | ユーザーを割り当てるか、**割り当てが必要ですか?** を無効にする |
| **Try signing in**: "These delegated permissions are missing"（次の委任されたアクセス許可が不足しています） | `Files.Read.All` または `Sites.Read.All`、あるいはその同意が不足している | ステップ 3 と 4 |
| **Try signing in**: "this Microsoft 365 directory has no SharePoint Online license"（この Microsoft 365 ディレクトリには SharePoint Online のライセンスがありません） | ディレクトリに SharePoint Online を含むサブスクリプションがない | 組織の Microsoft 365 ディレクトリを使用するか、SharePoint Online を含むサブスクリプションを割り当てる |
| SecureAI のブラウザに、組織に SharePoint Online がないと表示される | 同じ状況をユーザー側で見たもの | 前の行と同じ |
| ユーザーにサイトが表示されず、"Shared" のみ表示される | ユーザーがどのサイトのメンバーでもない | 想定どおりの動作です。ユーザーには、すでに開けるものだけが表示されます |
| ユーザーに **Add from SharePoint** が表示されない | 連携が無効、未保存、またはプランに含まれていない | **Admin → Integrations → Files** のカードを確認する |

## よくある質問

**SecureAI は何を読み取れますか?** ログインしているユーザーがすでに読み取れるものだけで、かつユーザーがブラウザでファイルを選択したときだけです。アクセス許可は委任されたものであり、SecureAI が「アプリケーションとして」お客様の SharePoint にアクセスすることはありません。

**条件付きアクセス ポリシーは機能しますか?** はい。ログインは通常の Microsoft 365 のログインであり、MFA、管理対象デバイス、その他のポリシーが適用されます。

**無効にするには?** **Show "Add from SharePoint" to users** を無効にして保存するか、**Remove configuration** をクリックします。すでに発行されたトークンも失効させるには、Entra ID でアプリ登録を削除するか、エンタープライズ アプリケーションのサインインを無効にしてください。

**Hiper AI がすでに SharePoint を設定済みです。何か対応が必要ですか?** いいえ。独自の設定を保存しない限り、カードには **Configured by Hiper AI** と表示され、これまでどおり動作します。独自の設定を保存すると、それに置き換わります。
