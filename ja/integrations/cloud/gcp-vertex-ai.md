---
sidebar_position: 6
title: "Google Cloud — ディスカバリー"
sidebar_label: "Google Cloud — ディスカバリー"
description: "Google Cloud に接続すると、SecureAI が Vertex AI のエージェント、モデル、サービス アカウント、キー、IAM、使用状況、コストを、1 つのプロジェクトまたは組織全体でインベントリできるようになります"
---

# Google Cloud — ディスカバリー

Google Cloud プロジェクト (または組織全体やフォルダ) に接続すると、SecureAI は Vertex AI のエージェント、エンドポイント、モデルに加えて、それらに関連するサービス アカウント、キー、IAM バインディング、監査ログ、使用状況、コストをインベントリできるようになります。

<Info>
このカードはプロジェクトを**読み取るだけ**で、プロンプトを送信することはありません。SecureAI の LLM トラフィックをご自身の Google Cloud アカウントで実行したい場合は、[Google Vertex AI — お客様のアカウントでの推論](/ja/integrations/cloud/vertex-ai-inference)を参照してください。
</Info>

## SecureAI がインポートするもの

- **Vertex AI**: エージェント (Agent Engine)、サービング エンドポイント、実行中のバッチ ジョブとチューニング ジョブ、モデル — Model Registry に加え、使用中のすべてのパブリッシャー モデル (Gemini、Claude、オープンモデル)。
- **Agent Builder / Gemini Enterprise と Dialogflow CX** (任意): Agent Builder (Discovery Engine) のエンジンとそのデータストア (`global`、`us`、`eu` の各ロケーションで照会)、および Dialogflow CX のエージェント (`global` と、設定した Vertex AI のロケーションで照会)。
- 過去 30 日間の**モデルごとの使用状況**: リクエスト数 (およびそのうち失敗した数)、入力トークンと出力トークン、プロンプト キャッシュのトークン。
- 過去 30 日間の**認証情報ごとの使用状況** (Cloud Monitoring): サービス アカウントと API キーごとの、リクエストの総数と AI API (Vertex AI、Gemini API、Agent Builder、Dialogflow) へのリクエスト数。OAuth クライアントのトラフィック (ユーザーや、コンソール、`gcloud` などのツール) は別途集計されます。これらのアカウントとキーの最終使用日時もここから得られます。
- **モデルと ID ごとの使用状況** (任意): どのサービス アカウントまたはユーザーがどの Vertex AI モデルを呼び出したか。データアクセス監査ログを有効にしている場合に、そこから取得します。[モデルと ID ごとの使用状況](#モデルと-id-ごとの使用状況)を参照してください。
- 過去 30 日間の**コスト**: BigQuery への請求データのエクスポートから得た、このプロジェクトの AI に関する実際の支出、または定価による見積もり。
- **NHI**: サービス アカウント、ユーザー管理のサービス アカウント キー、API キー、Workload Identity Federation のプールとプロバイダ、OAuth クライアント — 最終使用日時 (Policy Analyzer と認証情報ごとの使用状況から取得) と[特権リスク](#特権リスク)も含みます。[NHI インベントリ](/ja/discovery/nhi-inventory)から、手動または[NHI の自動ポリシー](#nhi-の自動ポリシー)で取り消しと復元ができます。
- プロジェクトの **IAM** ロール バインディング。
- AI サービスと ID サービス (Vertex AI、IAM、IAM Credentials、STS、API Keys、Resource Manager) の **Cloud Audit Logs**: 過去 30 日間の最新 200 件のイベント。

デフォルトでは、コネクタは **1 つのプロジェクト**を読み取ります。**Organization or folder** フィールドを使用すると、組織またはフォルダ内のすべてのアクティブなプロジェクトを読み取ります: [組織またはフォルダ モード](#組織またはフォルダ-モード)を参照してください。

## 前提条件

### 有効にする API

SecureAI は、各領域を対応する Google API で読み取ります。プロジェクトでそれらを有効にしてください (**API とサービス → ライブラリ**、または `gcloud services enable` で):

| API | 用途 | |
|-----|------|---|
| `cloudresourcemanager.googleapis.com` | プロジェクトとその IAM バインディング | 必須 |
| `iam.googleapis.com` | サービス アカウント、キー、Workload Identity、OAuth クライアント | 必須 |
| `aiplatform.googleapis.com` | Vertex AI のエージェント、エンドポイント、ジョブ、モデル | 必須 |
| `apikeys.googleapis.com` | API キー | 推奨 |
| `monitoring.googleapis.com` | モデルごとおよび認証情報ごとの使用状況 | 推奨 |
| `logging.googleapis.com` | 監査ログとデータアクセス ログ | 推奨 |
| `policyanalyzer.googleapis.com` | キーとサービス アカウントの最終使用日時 (Policy Analyzer) | 任意 |
| `bigquery.googleapis.com` | 請求データのエクスポートを使用する場合の実際のコスト (クエリを実行するプロジェクトで) | 任意 |
| `cloudasset.googleapis.com` | 組織またはフォルダ モード (サービス アカウントのプロジェクトで) | そのモードのみ |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | その製品を使用している場合 |
| `dialogflow.googleapis.com` | Dialogflow CX のエージェント | その製品を使用している場合 |

無効になっている API があっても同期は失敗しません: サービス名とともに、**API disabled in the project — enable it** という不足項目として表示されます。例外は Agent Builder と Dialogflow です: これらの API が無効の場合、SecureAI はプロジェクトがその製品を使用していないものとみなし、不足項目として扱いません。

### ロール

SecureAI が使用するサービス アカウントが必要です。このアカウントに、**プロジェクトに対して**次のロールを付与します (**IAM と管理 → IAM → アクセスを許可**):

| ロール | 有効になるもの | |
|--------|----------------|---|
| `roles/aiplatform.viewer` | Vertex AI のエージェント、エンドポイント、ジョブ、モデル | 必須 |
| `roles/iam.securityReviewer` | サービス アカウント、キー、API キー、Workload Identity、OAuth クライアント、IAM バインディング | 必須 |
| `roles/monitoring.viewer` | モデルごとの使用状況 (リクエスト数とトークン数) と認証情報ごとの使用状況 | 推奨 |
| `roles/logging.viewer` | Cloud Audit Logs | 推奨 |
| `roles/policyanalyzer.activityAnalysisViewer` | 各キーと各サービス アカウントの最終使用日時 | 任意 |
| `roles/logging.privateLogViewer` | モデルと ID ごとの使用状況: データアクセス ログはプライベート ログであり、`roles/logging.viewer` では読み取れません | 任意 |
| `roles/discoveryengine.viewer` | Agent Builder / Gemini Enterprise のエンジン | 任意 |
| `roles/dialogflow.reader` | Dialogflow CX のエージェント | 任意 |

**実際のコスト**を取得するには、Cloud Billing のデータが [BigQuery にエクスポート](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=ja)されている必要があり、サービス アカウントにはエクスポート先データセットに対する `roles/bigquery.dataViewer` と、クエリを実行するプロジェクトに対する `roles/bigquery.jobUser` が必要です。

**SecureAI から取り消しと復元を行う**場合 (任意) は、許可したい操作ごとにそのロールが必要です。デプロイメントがキーなしアクセスを提供している場合は、それらのロールを[取り消し用の別のサービス アカウント](#取り消し用の別のサービス-アカウント)に付与し、読み取り用のアカウントは読み取り専用のロールのままにしてください。そうでない場合は、コネクタのサービス アカウントに付与します:

| 操作 | ロール |
|------|--------|
| サービス アカウントを無効にする (または再度有効にする) | `roles/iam.serviceAccountAdmin` |
| サービス アカウント キーを削除する | `roles/iam.serviceAccountKeyAdmin` |
| API キーを削除する (または復元する) | `roles/serviceusage.apiKeysAdmin` |
| Workload Identity のプールまたはプロバイダを無効にする (または再度有効にする) | `roles/iam.workloadIdentityPoolAdmin` |
| OAuth クライアントを無効にする (または再度有効にする) | `roles/iam.oauthClientAdmin` |

<Note>
`roles/billing.viewer` は**不要**です。これは請求先アカウントのロールであり、プロジェクトに対して付与することはできず、コネクタも使用しません。
</Note>

何も黙ってスキップされることはありません。SecureAI が読み取れなかったものは、それを解決するロールとともに表示されます — 接続時、各同期の後、そして GCP パネルで。

## 認証情報

| フィールド | 必須 | 説明 |
|------------|------|------|
| **Google Cloud Project ID** (`projectId`) | はい | プロジェクトの **ID** (例: `my-project-123`) — プロジェクト名やプロジェクト番号ではありません。組織モードでは、割り当てと請求のプロジェクトになります。 |
| **Vertex AI Location** (`location`) | はい | エージェントとエンドポイントがある Vertex AI のロケーション (例: `us-central1`、`europe-west4`、`global`)。使用状況とコストはすべてのロケーションが対象です。 |
| **More Vertex AI Locations** (`locations`) | いいえ | 複数のロケーションをカンマ区切りで指定 (最大 10 件)。上記のロケーションより優先されます。 |
| **Service Account JSON** (`serviceAccountJson`) | いずれか一方 | サービス アカウント キーの JSON。保存時に暗号化されます。 |
| **Service account to impersonate** (`impersonateServiceAccount`) | いずれか一方 | キーなし: SecureAI が権限借用するサービス アカウントのメールアドレス。デプロイメントがキーなしアクセスを提供している場合にのみ表示されます。 |
| **Service account for revocation** (`revokeImpersonateServiceAccount`) | いいえ | ID の取り消しまたは復元にのみ使用し、読み取りには使用しない 2 つ目のサービス アカウント。デプロイメントがキーなしアクセスを提供している場合にのみ表示されます。 |
| **Organization or folder** (`scope`) | いいえ | `organizations/<number>` または `folders/<number>`: その中のすべてのアクティブなプロジェクトを読み取ります。 |
| **BigQuery Billing Export Table** (`billingExportTable`) | いいえ | 請求データのエクスポートの `project.dataset.table` (例: `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`)。 |
| **BigQuery Billing Project ID** (`billingProjectId`) | いいえ | BigQuery のクエリを実行するプロジェクト。デフォルトはテーブルのプロジェクトです。`dataset.table` 形式の名前は、このプロジェクト (空の場合はプロジェクト ID) 内で検索されます。 |

### 入手方法

**オプション A — JSON キー**

1. [Google Cloud コンソール](https://console.cloud.google.com/)で、**IAM と管理 → サービス アカウント → サービス アカウントを作成** に移動します (例: `secureai-discovery`)。
2. **IAM と管理 → IAM → アクセスを許可** に移動し、サービス アカウントのメールアドレスをプリンシパルとして入力して、[前提条件](#前提条件)のロールを追加します。
3. **サービス アカウント** に戻ってアカウントを開き、**キー → 鍵を追加 → 新しい鍵を作成 → JSON** でファイルをダウンロードします。
4. JSON **全体**を **Service Account JSON** に貼り付け、ダウンロードしたファイルを削除します。

`gcloud` で行う場合:

```bash
PROJECT=my-project-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# 任意: 最終使用日時、モデルと ID ごとの使用状況、Agent Builder、Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

Agent Builder または Dialogflow CX を使用している場合、それらの API はすでにプロジェクトで有効になっています。SecureAI のために有効にする必要はありません。

<Warning>
サービス アカウント キーの作成が無効になっていると Google から応答があった場合、組織で `iam.disableServiceAccountKeyCreation` ポリシーが適用されています — 2024 年以降に作成された組織ではこれがデフォルトです。オプション B を使用するか、組織の管理者にこのプロジェクトの例外を依頼してください。
</Warning>

**オプション B — キーなし (権限借用)**

1. サービス アカウントを作成し、ロールを付与します (上記の手順 1 と 2)。
2. SecureAI の接続フォームでは、**Service account to impersonate (keyless — instead of the JSON)** フィールドのヘルプテキストに、承認が必要な SecureAI のアカウントが表示されます。Google Cloud でご自身のサービス アカウントを開き、**権限 → アクセスを許可** で、そのアカウントをプリンシパルとして入力し、`roles/iam.serviceAccountTokenCreator` を付与します。`gcloud` で行う場合:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. フィールドにご自身のサービス アカウントのメールアドレスを入力し、JSON は空のままにします。

フィールドが表示されない場合、デプロイメントはキーなしアクセスを提供していません。オプション A を使用してください。

### 取り消し用の別のサービス アカウント

デプロイメントがキーなしアクセスを提供している場合は、読み取りと取り消しを分けることができます。読み取り用のサービス アカウントに取り消しのロールを付与するよりも、こちらをお勧めします:

1. 2 つ目のサービス アカウント (例: `secureai-revoke`) を作成し、[前提条件](#前提条件)の取り消しのロール**のみ**を付与します。
2. そのアカウントで、**Service account for revocation (optional — separate from reading)** フィールドのヘルプテキストに表示される SecureAI のアカウントに `roles/iam.serviceAccountTokenCreator` を付与します。
3. そのフィールドにこのアカウントのメールアドレスを入力します。

SecureAI がこのアカウントから 1 時間有効なトークンを取得するのは、ID を取り消すか復元するときだけです。同期では使用しません。読み取り用のサービス アカウントは読み取り専用のロールのままです。また、SecureAI はインベントリから取り消し用のアカウントを取り消すことを拒否します。

## 組織またはフォルダ モード

1 つのコネクタで複数のプロジェクトをインベントリするには、**Organization or folder** に `organizations/<number>` または `folders/<number>` を入力します (例: `organizations/123456789012`)。

- SecureAI は **Cloud Asset Inventory** でアクティブなプロジェクトを見つけ、それぞれを単一プロジェクトのコネクタと同じように読み取ります。**Google Cloud Project ID** は引き続き割り当てと請求のプロジェクトです。
- サービス アカウントに、**組織またはフォルダに対して**次のロールを付与します: `roles/cloudasset.viewer`、`roles/iam.securityReviewer`、`roles/aiplatform.viewer`、さらに使用状況と監査のために `roles/monitoring.viewer` と `roles/logging.viewer`。
- サービス アカウントのプロジェクトで `cloudasset.googleapis.com` を有効にします。

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

フォルダの場合は、`gcloud organizations add-iam-policy-binding` の代わりに `gcloud resource-manager folders add-iam-policy-binding <number>` を使用します。

同期が妥当な時間で終わるように、各同期には上限があります。割り当てプロジェクトが最初に処理され、次に Vertex AI のリソースがあるプロジェクトが処理されます:

| 対象 | 同期あたりの上限 |
|------|------------------|
| インベントリするプロジェクト | 200 |
| 割り当てプロジェクトの指標スコープ外の、モデルごとの使用状況 (Cloud Monitoring) | Vertex AI のあるプロジェクト 15 件 |
| 監査ログ | 25 プロジェクト |
| モデルと ID ごとの使用状況 (データアクセス ログ) | 10 プロジェクト |

上限を超えた分は、どれだけ読み取れたかとともに、部分的な不足項目として表示されます。読み取れないプロジェクトも不足項目として一覧表示され、**そのプロジェクトのものが廃止されたり削除されたりすることはありません**。接続時、このモードのテストではプロジェクトの最初のページを列挙し、割り当てプロジェクトを確認するだけです: 各プロジェクトの読み取りは同期の役割です。

## 接続する

1. **Admin → Integrations → Cloud → Google Cloud — 検出 → 統合を接続。**
2. プロジェクト ID、ロケーション (または **More Vertex AI Locations** で複数)、そして JSON キーまたは権限借用するサービス アカウントのいずれかを入力します。使用する場合は、取り消し用のサービス アカウント、組織またはフォルダ、請求関連のフィールドも追加します。
3. **接続** をクリックします。SecureAI は保存前に、プロジェクトを実際に読み取って認証情報を確認します — 数秒かかります。プロジェクトを読み取れない場合は理由を表示し、何も保存しません。入力した内容はフォームに残ります。表示される可能性のあるメッセージは[トラブルシューティング](#トラブルシューティング)にあります。
4. 保存はされたもののロールが不足している場合は、警告に不足しているロールが一覧表示されます。それらを付与して、再度同期してください。
5. カードの更新ボタンで今すぐ同期します。以降、SecureAI は 6 時間ごとに自動的に同期します。

後で認証情報を変更するには、もう一度 **接続** を使用します。空のままのフィールドは保存済みの値を維持します。JSON キーを入力すると保存済みの権限借用が置き換えられ、その逆も同様です。

## 確認する

- [Cloud Sensors](/ja/discovery/cloud-sensors) に検出されたエージェントが一覧表示されます。Google Cloud のカードをクリックすると GCP パネルが開きます: 使用状況とコスト (リクエスト数、失敗数、トークン、キャッシュ、コストとその取得元)、モデルとデプロイ、ID とアクセス (サービス アカウントとキー、およびその最終使用日時、IAM バインディング)、監査。
- パネルに **Discovery could not read everything** と表示された場合は、各行を確認し ([トラブルシューティング](#トラブルシューティング)を参照)、再度同期してください。
- [NHI インベントリ](/ja/discovery/nhi-inventory)にはサービス アカウントとキーが表示されます。

同期が失敗した場合 (たとえばキーが削除された、ロールが外された場合)、カードにエラーが表示され、SecureAI は最後のインベントリを保持したまま、バックオフしながら再試行します。部分的な読み取りによってエージェントが廃止されたり、ID が削除されたりすることはありません。

## モデルと ID ごとの使用状況

Cloud Monitoring からは、各認証情報が行ったリクエスト数はわかりますが、どのモデルに対するものかはわかりません。**どの ID がどのモデルを呼び出したか**を知るために、SecureAI は Vertex AI の**データアクセス**監査ログを読み取ります。これは任意であり、有効にするかどうかはお客様が決めます:

- SecureAI がこれを読み取るのは、`aiplatform.googleapis.com` (またはすべてのサービス) に対して **DATA_READ** または **DATA_WRITE** のログが有効になっている場合だけです。SecureAI は IAM ポリシーからこれを検出します。SecureAI がログを有効にすることはありません。
- 有効にすると、Google の料金で **Cloud Logging の取り込み費用**が発生します。有効にするには **IAM と管理 → 監査ログ → Vertex AI API → データ読み取り** を使用します。
- サービス アカウントには `roles/logging.privateLogViewer` が必要です。
- SecureAI はプロジェクトおよび同期ごとに、最大 5,000 件のエントリ、または 20 秒間のうち、先に達した方まで読み取ります。
- 無効になっている場合、パネルには有効にする方法を説明する任意の不足項目が表示されます。組織またはフォルダで有効にしていても、単一のプロジェクトを接続している場合、SecureAI はプロジェクトのポリシーからそれを確認できないため、不足項目が表示されたままになります。

## 特権リスク

IAM ポリシーを読み取ったうえで、SecureAI は次のいずれかのロールを持つサービス アカウントに**特権あり**のフラグを付けます:

- オーナー (`roles/owner`) または編集者 (`roles/editor`)
- 管理者ロール (`roles/<service>.admin`、または末尾が `Admin` のロール)
- `roles/iam.serviceAccountTokenCreator` または `roles/iam.serviceAccountUser` (保持者が他のサービス アカウントとして動作できるロール)

特権のあるサービス アカウントのユーザー管理キーは、このフラグを引き継ぎます: キーを持つ者がその特権を持つことになるためです。**制限のない** API キー (API の制限もアプリケーションの制限もないもの) にもフラグが付きます。[NHI インベントリ](/ja/discovery/nhi-inventory)では、これらはリスク要因の中に **Privileged (admin role or impersonation)** および **API key without restrictions** として表示されます。IAM ポリシーを読み取れなかった場合、SecureAI はアカウントを特権なしとみなすのではなく、何にもフラグを付けません。

## コスト

- **`billingExportTable` を指定した場合**: このプロジェクトの AI サービス (Vertex AI、Gemini API、Agent Builder、Dialogflow など) に対する実際の支出を、クレジット適用後の金額で、請求先アカウントの通貨で表示します。クレジットで使用量がまかなわれている場合、正味金額がゼロになることがあります。その場合、パネルにはクレジット適用前の金額が併せて表示されます。Google はエクスポートを数時間の遅延で更新します。
- **指定しない場合**: 見積もり — Cloud Monitoring のトークン数 × 定価で、Claude とプロンプト キャッシュのトークンも含みます。割引や確約利用契約は反映されません。

## 取り消しと復元

コネクタ、または取り消し用のサービス アカウントにその操作のロールがある場合 ([前提条件](#前提条件)を参照)、GCP の ID は [NHI インベントリ](/ja/discovery/nhi-inventory) (南京錠) から取り消せます。Google 側でそれぞれ何が起きるか:

| ID | Google 側で起きること | 元に戻せるか |
|----|------------------------|--------------|
| サービス アカウント | 無効化 | はい — **Restore** で再度有効になります |
| サービス アカウント キー | 削除 | いいえ — Google が破棄します。新しいキーを作成してください |
| API キー | 削除 | 30 日間ははい — **Restore** で元に戻ります。それ以降は Google が保持しません |
| Workload Identity のプール / プロバイダ、OAuth クライアント | 無効化 | はい — **Restore** で再度有効になります |

取り消しを元に戻すには、NHI インベントリで ID のメニューを開き、**Restore** (*Undo the revocation at Google Cloud*) を選択します。ID は Google Cloud で再度有効になり、SecureAI ではブロックが解除され、確認するまで **In remediation** のままになります。

- 復元できるのは、手動または自動ポリシーによって **SecureAI が Google Cloud で取り消したもの**だけです。SecureAI のゲートウェイでのみブロックしたものや、お客様のチームが Google Cloud で直接無効にした ID には提供されません。
- 削除されたサービス アカウント キーは復元できません: SecureAI は Google を呼び出さずに拒否します。
- 復元には、取り消しと同じロールを使用します。

安全策:

- コネクタが使用するサービス アカウントとそのキーは、SecureAI から取り消すことはできません — 取り消すとディスカバリーが停止してしまうためです。取り消し用のサービス アカウントも同様です。これらは Google Cloud でローテーションしてください。
- [Vertex AI での推論](/ja/integrations/cloud/vertex-ai-inference)の接続が認証に使用するサービス アカウントと、署名に使用するキーも取り消せません: 取り消すと、管理対象のすべての呼び出しが停止するためです。キーレス (権限借用) オプションの場合、保護されるのはサービス アカウントのみです。SecureAI はそのキーのいずれでも署名しないため、キーは取り消せます。推論接続がどのアイデンティティを使用しているかを SecureAI が確認できない場合は、サービス アカウントもサービス アカウント キーも取り消しません (API キーは影響を受けません)。
- Google のデフォルトのサービス アカウント (Compute Engine のデフォルト、App Engine、Cloud Build、サービス エージェント) では 2 回目の確認が求められます。これらのいずれかを無効にすると、そのアカウントで実行されているすべての VM、アプリ、ビルドが停止します。
- コネクタにある操作のロールがない場合は、エラーにそのロールが表示されます。

## NHI の自動ポリシー

**NHI の自動ポリシー** (NHI インベントリ → **Automatic policies**) は、ルールに基づいて Google Cloud の ID についてアラートを出したり取り消したりするもので、1 つずつ確認する必要はありません。コネクタの同期が成功するたびにその最後に、そのコネクタの ID のみを対象に評価されます。

| ルール | Google Cloud での対象 | デフォルトのしきい値 |
|--------|------------------------|----------------------|
| **Unused SA key / IAM access key** | N 日間認証していないサービス アカウント キー。最終使用日時がわかっている場合にのみ動作します: 使用記録のないキーには何もしません。 | 90 日 |
| **Old SA key / IAM access key** | 使用の有無にかかわらず、N 日より前に作成されたサービス アカウント キー。 | 365 日 |
| **Unrestricted API key** | アプリケーションの制限も API の制限もない API キー。 | — |
| **Privileged SA with a user key** | [特権のある](#特権リスク)サービス アカウントのユーザー管理キー。 | — |

各ルールには **Off**、**Alert**、**Revoke** の 3 つのモードがあります。すべて無効の状態で始まります。安全策:

- **Simulation mode (dryRun)** はデフォルトで有効です: 有効な間は、**Revoke** に設定したルールも何も遮断せず、何をするかを一覧表示するだけです。実際の遮断を有効にできるのは、これを無効にした場合だけです。**Simulate with this configuration** で、保存前に効果を確認できます。
- **Revocation cap per run**: デフォルトは 5 (1〜50)。1 回の実行で **Revoke** のルールに該当する ID が上限を超えた場合、何も遮断されず、アラートが送信されます。
- **Exclusions**: 所有者、名前、またはリソースがパターンに一致する ID には、どのルールも動作しません。ワイルドカードは `*` のみです。
- 評価されるのは、キーの一覧が完全に取得できた場合だけです。
- SecureAI が使用する認証情報 (コネクタのもの、取り消し用アカウントのもの、または Vertex AI での推論のもの) が遮断されることはありません。Google のデフォルトのサービス アカウントのキーが自動的に遮断されることもありません: ルールはアラートを出すだけで、判断は人が行います。

Google Cloud では、サービス アカウント キーを取り消すとそのキーは**削除**され (復元できません)、API キーを取り消すと削除され、30 日間は復元できます。すべての操作は監査され、通知されます。

## トラブルシューティング

### 接続時

テストが失敗した場合、**接続** は次のいずれかのメッセージを表示し、何も保存しません:

| メッセージ | 原因 | 対処方法 |
|------------|------|----------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | プロジェクト名またはプロジェクト番号を入力した | コンソールのプロジェクト選択ツールからプロジェクトの **ID** をコピーしてください。 |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | ID が存在しないか、サービス アカウントがそのプロジェクトに対するロールを持っていない | ID を確認し、プロジェクトに対して 2 つの必須ロールを付与してください。 |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | ロケーションが存在しない (入力ミスなど) | ロケーションを修正してください。 |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | Cloud Asset API なしで組織モードを使用している | サービス アカウントのプロジェクトで `cloudasset.googleapis.com` を有効にしてください。 |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | 組織またはフォルダに対するロールがない状態で組織モードを使用している、または番号が誤っている | 組織またはフォルダに対してロールを付与するか、このフィールドを削除してプロジェクトのみを読み取ってください。 |

### パネルの不足項目

GCP パネルに **Discovery could not read everything** と表示された場合、各行には対象の領域と不足しているものが示されます。*optional* と表示された行は、インベントリを充実させるためのものにすぎません。

| 行に表示される内容 | 意味 | 対処方法 |
|--------------------|------|----------|
| ロール (例: `roles/monitoring.viewer`) | サービス アカウントにそのロールがない | プロジェクト (または組織かフォルダ) に対してそのロールを付与し、再度同期してください。 |
| **API disabled in the project — enable it** | その領域の API が無効になっている。詳細にサービス名が示されます | **API とサービス → ライブラリ** で有効にしてください。 |
| ロールの表示がなく、組織のポリシーでそのロケーションが禁止されているという詳細 | 組織のポリシー (`constraints/gcp.resourceLocations`) がそのロケーションをブロックしているため、そこには何も存在できない。ロールでは解決しません | 設定からそのロケーションを削除するか、組織の管理者に許可を依頼してください。 |
| **Usage by model and identity** が有効になっていない | Vertex AI のデータアクセス ログが無効になっている | 任意: [モデルと ID ごとの使用状況](#モデルと-id-ごとの使用状況)を参照してください。 |
| 部分的な読み取り (例: 組織モードの上限) | 一部のみ読み取られた。詳細にどれだけ読み取れたかが示されます | これを理由に何かが廃止されたり削除されたりすることはありません。すべてを確認する必要がある場合は、範囲を絞ってください。 |

## 関連

- [Google Vertex AI — お客様のアカウントでの推論](/ja/integrations/cloud/vertex-ai-inference)
- [クラウド AI プロバイダーの概要](/ja/integrations/cloud/overview)
- [Google Workspace SSO](/ja/iam/google-workspace)
- [NHI インベントリ](/ja/discovery/nhi-inventory)
