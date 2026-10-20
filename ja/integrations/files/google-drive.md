---
sidebar_position: 1
title: "Google Drive — Add from Drive"
sidebarTitle: "Google Drive"
icon: "/img/icons/google-drive.svg"
sidebar_label: "Google Drive"
description: "SecureAI のチャットで、ユーザーが Google ドライブおよび共有ドライブのファイルを添付できるようにします。独自の Google Cloud OAuth クライアントを使用したセルフサービスでの設定です。"
---

# Google Drive — Add from Drive

この連携により、ユーザーは添付ボタンの **Add from Drive** オプションから、**Google ドライブ**（マイドライブ、共有アイテム、**共有ドライブ**）のファイルをチャットから直接添付できます。

設定は**セルフサービス**です。組織の管理者が**自社の Google Cloud プロジェクト**で OAuth クライアントと API キーを作成し、**Admin → Integrations → Files** に登録します。チケットを起票したり、Hiper AI の対応を待ったりする必要はありません。設定を保存すると、すぐにチャットにオプションが表示されます。

所要時間の目安: 10 分。

## 仕組み

1. ユーザーが **Attach → Add from Drive** をクリックします。初回は、Google から**ご自身のアカウント**でのログインと SecureAI の承認を求められます。
2. **Google ドライブの公式ピッカー**（Google Picker）が開きます。ユーザーは 1 つ以上のファイルを選択します。
3. ユーザーのブラウザが、ユーザー自身のトークンを使って**選択したファイルのみ**をダウンロードし、メッセージに添付します。Google ドキュメントは Office 形式にエクスポートされます（Docs → `.docx`、Sheets → `.xlsx`、Slides → `.pptx`、それ以外は PDF）。
4. ファイルは他の添付ファイルと同じ経路をたどります。モデルに到達する前に、**DLP** と組織のポリシーを通過します。

<Info>
**SecureAI がドライブ全体を参照することはありません。** スコープには `drive.file` を使用します。SecureAI が読み取れるのは、各ユーザーがピッカーで選択したファイルだけで、それ以外は読み取れません。サービス アカウント、ドメイン全体の委任、バックグラウンドでの読み取りはありません。ユーザーが添付できるのは、ドライブで自分がすでに開けるものだけです。
</Info>

## 前提条件

- **Google Workspace の組織内**の Google Cloud プロジェクト、およびそのプロジェクトで API の有効化、Google Auth Platform の設定、認証情報の作成を行う権限（たとえば、プロジェクトの**オーナー**または**編集者**ロール）。
- SecureAI の管理者アクセス権（**Integrations** セクションに対する **Administrator** 権限）。
- **Attach from Drive / SharePoint** を含む SecureAI のプラン。含まれていない場合でも設定を済ませておくことはできますが、ユーザーにはオプションが表示されません。

## ステップ 1: SecureAI からアドレスをコピーする

1. 管理者として SecureAI にログインします。
2. **Admin → Integrations** に移動し、カテゴリ **Files** で絞り込みます。
3. **Google Drive** カードで **Connect integration** をクリックします。

<div class="mac-window">
  ![Files カテゴリのカード](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. **1. Set up Google Cloud** セクションに、Google Cloud で必要な 2 つの値が表示されています。それぞれに **Copy** ボタンがあります。
   - **Authorized JavaScript origin**: インスタンスのアドレスです。例: `https://<貴社名>.hiperai.ai`
   - **Website restrictions for the API key**: 2 行です。インスタンスのアドレスの末尾に `/*` を付けたものと、`https://docs.google.com/*` です。

<div class="mac-window">
  ![SecureAI のサイドパネルに表示されたオリジンと制限](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

必ずご利用のインスタンスに表示される値を使用してください。`https://` を含め、完全に一致している必要があります。オリジンの末尾に `/` は付けません。

<Note>
`https://docs.google.com/*` は Google のピッカーそのものです。ピッカーは `docs.google.com` のフレームとして開き、そこから API キーを提示します。この行がないと、ピッカーは **"The API developer key is invalid"** というエラーで開きます。
</Note>

## ステップ 2: プロジェクトを選択して API を有効にする

1. [Google Cloud コンソール](https://console.cloud.google.com)を開き、上部バーのプロジェクト セレクタで組織のプロジェクトを選択します（または、`SecureAI Drive` などの名前で新規作成します）。
2. **API とサービス → ライブラリ**（APIs & Services → Library）に移動し、**Google Drive API** を検索して **有効にする**（Enable）をクリックします。

<div class="mac-window">
  ![Google Drive API を有効にする](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. **Google Picker API** についても同様に行います。

<div class="mac-window">
  ![Google Picker API を有効にする](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## ステップ 3: 同意画面を設定する

1. **Google Auth Platform** に移動します（メニュー **API とサービス → OAuth 同意画面**、英語では「OAuth consent screen」）。プロジェクトで未設定の場合は、**開始**（Get started）をクリックします。
2. **アプリ名**（App name。例: `SecureAI`）と**ユーザー サポートメール**（User support email）を入力します。
3. **対象**（Audience）で **内部**（Internal）を選択します。Google Workspace 組織のアカウントのみがアプリを承認でき、Google による審査は不要です。
4. 連絡先のメールアドレスを入力し、ユーザーデータに関するポリシーに同意して、**作成**（Create）をクリックします。

<div class="mac-window">
  ![Google Auth Platform の内部対象](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

スコープを手動で追加する必要はありません。SecureAI が要求するのは、機密性のないスコープである `drive.file` のみです。

## ステップ 4: OAuth クライアントを作成する

1. **Google Auth Platform → クライアント**（Clients）で、**クライアントを作成**（Create client）をクリックします。
2. **アプリケーションの種類**（Application type）で **ウェブ アプリケーション**（Web application）を選択し、名前を付けます（例: `SecureAI — Add from Drive`）。
3. **承認済みの JavaScript 生成元**（Authorized JavaScript origins）で **URI を追加**（Add URI）をクリックし、ステップ 1 でコピーした **Authorized JavaScript origin** を貼り付けます。
4. **承認済みのリダイレクト URI**（Authorized redirect URIs）は空のままにします。ピッカーでは使用しません。
5. **作成**をクリックします。

<div class="mac-window">
  ![SecureAI のオリジンを設定したウェブ アプリケーション タイプの OAuth クライアント](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. **クライアント ID**（Client ID。末尾が `.apps.googleusercontent.com`）をコピーします。このクライアントにはシークレットは不要です。コピーしたり、どこかに登録したりしないでください。

<div class="mac-window">
  ![作成されたクライアント ID](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
組織がすでに SecureAI の [Google Workspace によるログイン](/ja/iam/google-workspace)用に Google ウェブ クライアントを使用している場合は、それを再利用できます。同じクライアントに JavaScript 生成元を追加してください。
</Note>

## ステップ 5: API キーを作成して制限する

1. **API とサービス → 認証情報**（Credentials）に移動し、**認証情報を作成 → API キー**（Create credentials → API key）をクリックします。
2. 作成したキーを開きます（**API キーを編集**、「Edit API key」）。
   - **アプリケーションの制限**（Application restrictions）で **ウェブサイト**（Websites）を選択し、ステップ 1 でコピーした**両方**の制限を **追加**（Add）で追加します。インスタンスのアドレスの末尾に `/*` を付けたものと、`https://docs.google.com/*` です。
   - **API の制限**（API restrictions）で **キーを制限**（Restrict key）を選択し、**Google Picker API** のみにチェックを入れます。
3. **保存**（Save）をクリックし、キー（`AIza` で始まります）をコピーします。API キーの変更が反映されるまでに最大 5 分かかる場合があります。

<div class="mac-window">
  ![ウェブサイトと Google Picker API に制限された API キー](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
API キーは**設計上、公開されるものです**。各ユーザーのブラウザがピッカーを開くためにこのキーを受け取ります。そのため、SecureAI のサイト、`docs.google.com`、Google Picker API に制限することが必須です。
</Warning>

**Test connection** を使用した後にキーを編集すると、Google が **"Warning: Potential breakage due to active usage"** と表示し、`drive.googleapis.com` を一覧に示す場合があります。この使用実績は、キーを確認するために Google Drive API を呼び出す SecureAI のテストによるものです。`UPDATE` と入力して確定してください。

## ステップ 6: SecureAI に登録、テスト、有効化する

1. SecureAI の **Google Drive** のサイドパネルに戻ります。
2. **2. Paste the identifiers** で、**Client ID** と **API key** を貼り付けます。
3. **3. Test it** で次を実行します。
   - **Test connection** は、SecureAI のサーバーから、API キーが有効であること、インスタンスと Google のピッカー（`docs.google.com`）からのリクエストを受け付けること、OAuth クライアントと**同じプロジェクト**のものであることを確認します。
   - **Try signing in** は、ユーザーに表示されるものと同じ Google のウィンドウを開きます。ご自身のアカウントでログインしてください。SecureAI は、オリジンが承認されていることと、Google Drive API が応答することを確認します。

<div class="mac-window">
  ![SecureAI のサイドパネルで成功したテスト](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. **4.** で、**Show "Add from Drive" to users** を有効のままにして **Save** をクリックします。

カードが **Available in the chat** に変わります。

## ステップ 7: ユーザーの使い方

1. チャットで、ユーザーが**添付**ボタンをクリックし、**Add from Drive** を選択します。

<div class="mac-window">
  ![添付メニューの Add from Drive](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. Google のウィンドウが開き、アカウントを選択して、選択したファイルの参照を SecureAI に許可します。ブラウザがポップアップをブロックする場合は、SecureAI のサイトに対してポップアップを許可する必要があります。
3. Google ドライブのピッカーが開き、マイドライブ、共有ドライブ、画像のタブが表示されます。1 つ以上のファイルを選択して **Select** をクリックします。


4. ファイルが Google ドライブのアイコン付きでメッセージに添付されます。送信時には組織の DLP ポリシーが適用されます。ポリシーでブロックされるデータ（たとえばメールアドレス）がファイルに含まれている場合、ほかの添付ファイルと同様にメッセージはブロックされます。

## トラブルシューティング

| 表示される内容 | 原因 | 対処方法 |
|---|---|---|
| **Test connection**: "The API key's website restrictions do not include this address"（API キーのウェブサイト制限にこのアドレスが含まれていません） | API キーに SecureAI のサイトが設定されていない | ステップ 1 の制限をそのまま（末尾 `/*`）追加する |
| **Test connection**: "The API key's website restrictions do not include https://docs.google.com/*"（API キーのウェブサイト制限に https://docs.google.com/* が含まれていません） | ステップ 1 の 2 つ目の制限が設定されていない | 追加して（ステップ 5）、数分待つ |
| **Test connection**: "The API key belongs to a different project than the OAuth client"（API キーが OAuth クライアントとは別のプロジェクトのものです） | 認証情報が別々のプロジェクトで作成された | OAuth クライアントと同じプロジェクトで API キーを作成する |
| **Test connection**: "The Google Drive API is not enabled"（Google Drive API が有効になっていません） | API が有効化されていない | ステップ 2 |
| Google のウィンドウに **Error 400: origin_mismatch** または **redirect_uri_mismatch** と表示される | JavaScript 生成元が OAuth クライアントに登録されていない | 追加する（ステップ 4）。反映に数分かかる場合があります |
| Google のウィンドウに **Error 403: org_internal** と表示される | ユーザーが Workspace 外のアカウントを使用している | 組織のアカウントでログインする必要があります |
| ピッカーに "The API developer key is invalid" と表示される | API キーのウェブサイトに `https://docs.google.com/*` が含まれていない、または Google Picker API が許可されていない | ステップ 5 を確認し、**Test connection** を使用する。キーの変更の反映には最大 5 分かかります |
| API キーの保存時に、Google から `UPDATE` の入力を求められる（"Potential breakage due to active usage"） | SecureAI のテストがキーを使って Drive API を呼び出した | `UPDATE` と入力して確定する |
| "Your browser blocked the Google sign-in window"（ブラウザが Google のログイン ウィンドウをブロックしました） | サイトでポップアップがブロックされている | SecureAI のアドレスに対してポップアップを許可する |
| 添付ファイル付きで送信したメッセージがブロックされる | DLP ポリシーがファイル内のデータを検出した | 想定どおりの動作です。**Data Protection** でインシデントを確認する |
| "SecureAI did not receive access to this file"（SecureAI はこのファイルへのアクセスを受け取っていません） | ピッカーでファイルが選択されていない | ドライブのウィンドウから選択する |
| "Its owner does not allow downloading it"（所有者がダウンロードを許可していません） | 所有者がダウンロードを無効にしている | 所有者にダウンロードを有効にするよう依頼する |
| ユーザーに **Add from Drive** が表示されない | 連携が無効、未保存、またはプランに含まれていない | **Admin → Integrations → Files** のカードを確認する |

## よくある質問

**共有ドライブでも使えますか?** はい。ピッカーには共有ドライブのタブがあり、ユーザーはメンバーになっているドライブを確認できます。

**各ユーザーは SecureAI にどのような権限を付与しますか?** `drive.file` のみです。ユーザーがピッカーで選択したファイルへのアクセスだけで、SecureAI がドライブ内の他のファイルを一覧表示、検索、読み取りすることはできません。

**無効にするには?** **Show "Add from Drive" to users** を無効にして保存するか、**Remove configuration** をクリックします。ユーザーがすでに付与したアクセスも遮断するには、Google Cloud で OAuth クライアントを削除してください。

**Hiper AI がすでに Drive を設定済みです。何か対応が必要ですか?** いいえ。独自の設定を保存しない限り、カードには **Configured by Hiper AI** と表示され、これまでどおり動作します。独自の設定を保存すると、それに置き換わります。

**以前のバージョンの「Google Drive サービス アカウント」はどうなりますか?** 使用されなくなりました。各ダウンロードはユーザー自身のトークンで行われ、ユーザーが開けないファイルを添付することはできないため、より安全です。
