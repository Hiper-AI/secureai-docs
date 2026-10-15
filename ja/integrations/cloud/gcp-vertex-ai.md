---
sidebar_position: 6
title: "Google Cloud — ディスカバリー"
sidebar_label: "Google Cloud — ディスカバリー"
description: "Google Cloud に接続すると、SecureAI が Vertex AI のエージェント、モデル、サービス アカウント、キー、IAM、使用状況、コストをインベントリできるようになります"
---

# Google Cloud — ディスカバリー

Google Cloud プロジェクトに接続すると、SecureAI は Vertex AI のエージェント、エンドポイント、モデルに加えて、それらに関連するサービス アカウント、キー、IAM バインディング、監査ログ、使用状況、コストをインベントリできるようになります。

<Info>
このカードはプロジェクトを**読み取るだけ**で、プロンプトを送信することはありません。SecureAI の LLM トラフィックをご自身の Google Cloud アカウントで実行したい場合は、[Google Vertex AI — お客様のアカウントでの推論](/en/integrations/cloud/vertex-ai-inference)を参照してください。
</Info>

## SecureAI がインポートするもの

- **Vertex AI**: エージェント (Agent Engine)、サービング エンドポイント、実行中のバッチ ジョブとチューニング ジョブ、モデル — Model Registry に加え、使用中のすべてのパブリッシャー モデル (Gemini、Claude、オープンモデル)。
- 過去 30 日間のモデルごとの**使用状況**: リクエスト数 (およびそのうち失敗した数)、入力トークンと出力トークン、プロンプト キャッシュのトークン。
- 過去 30 日間の**コスト**: BigQuery への請求データのエクスポートから得た、このプロジェクトの AI に関する実際の支出、または定価による見積もり。
- **NHI**: サービス アカウント、ユーザー管理のサービス アカウント キー、API キー、Workload Identity Federation のプールとプロバイダ、OAuth クライアント — 各キーと各サービス アカウントが最後に認証した日時も含みます。[NHI インベントリ](/ja/discovery/nhi-inventory)から取り消せます。
- プロジェクトの **IAM** ロール バインディング。
- AI サービスと ID サービス (Vertex AI、IAM、IAM Credentials、STS、API Keys、Resource Manager) の **Cloud Audit Logs**: 過去 30 日間の最新 200 件のイベント。

## 前提条件

SecureAI が使用するサービス アカウントが必要です。このアカウントに、**プロジェクトに対して**次のロールを付与します (**IAM と管理 → IAM → アクセスを許可**):

| ロール | 有効になるもの | |
|--------|----------------|---|
| `roles/aiplatform.viewer` | Vertex AI のエージェント、エンドポイント、ジョブ、モデル | 必須 |
| `roles/iam.securityReviewer` | サービス アカウント、キー、API キー、Workload Identity、OAuth クライアント、IAM バインディング | 必須 |
| `roles/monitoring.viewer` | モデルごとのリクエスト数とトークン数 | 推奨 |
| `roles/logging.viewer` | Cloud Audit Logs | 推奨 |
| `roles/policyanalyzer.activityAnalysisViewer` | 各キーと各サービス アカウントの最終使用日時 | 任意 |

**実際のコスト**を取得するには、Cloud Billing のデータが [BigQuery にエクスポート](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=ja)されている必要があり、サービス アカウントにはエクスポート先データセットに対する `roles/bigquery.dataViewer` と、クエリを実行するプロジェクトに対する `roles/bigquery.jobUser` が必要です。

**SecureAI から取り消す**場合 (任意) は、許可したい操作ごとに、そのロールも付与します:

| 操作 | ロール |
|------|--------|
| サービス アカウントを無効にする | `roles/iam.serviceAccountAdmin` |
| サービス アカウント キーを削除する | `roles/iam.serviceAccountKeyAdmin` |
| API キーを削除する | `roles/serviceusage.apiKeysAdmin` |
| Workload Identity のプールまたはプロバイダを無効にする | `roles/iam.workloadIdentityPoolAdmin` |
| OAuth クライアントを無効にする | `roles/iam.oauthClientAdmin` |

<Note>
`roles/billing.viewer` は**不要**です。これは請求先アカウントのロールであり、プロジェクトに対して付与することはできず、コネクタも使用しません。
</Note>

何も黙ってスキップされることはありません。SecureAI が読み取れなかったものは、それを解決するロールとともに表示されます — 接続時、各同期の後、そして GCP パネルで。

## 認証情報

| フィールド | 必須 | 説明 |
|------------|------|------|
| `projectId` | はい | プロジェクトの **ID** (例: `my-project-123`) — プロジェクト名やプロジェクト番号ではありません。 |
| `location` | はい | エージェントとエンドポイントがある Vertex AI のロケーション (例: `us-central1`、`europe-west4`、`global`)。使用状況とコストはすべてのロケーションが対象です。 |
| `locations` | いいえ | 複数のロケーションをカンマ区切りで指定 (最大 10 件)。`location` より優先されます。 |
| `serviceAccountJson` | いずれか一方 | サービス アカウント キーの JSON。保存時に暗号化されます。 |
| `impersonateServiceAccount` | いずれか一方 | キーなし: SecureAI が権限借用するサービス アカウントのメールアドレス。デプロイメントがキーなしアクセスを提供している場合にのみ表示されます。 |
| `billingExportTable` | いいえ | 請求データのエクスポートの `project.dataset.table` (例: `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`)。 |
| `billingProjectId` | いいえ | BigQuery のクエリを実行するプロジェクト。デフォルトはテーブルのプロジェクトです。`dataset.table` 形式の名前は、このプロジェクト (空の場合は `projectId`) 内で検索されます。 |

### 入手方法

**オプション A — JSON キー**

1. [Google Cloud コンソール](https://console.cloud.google.com/)で、**IAM と管理 → サービス アカウント → サービス アカウントを作成** に移動します (例: `secureai-discovery`)。
2. **IAM と管理 → IAM → アクセスを許可** に移動し、サービス アカウントのメールアドレスをプリンシパルとして入力して、[前提条件](#前提条件)のロールを追加します。
3. **サービス アカウント** に戻ってアカウントを開き、**キー → 鍵を追加 → 新しい鍵を作成 → JSON** でファイルをダウンロードします。
4. JSON **全体**を `serviceAccountJson` に貼り付け、ダウンロードしたファイルを削除します。

`gcloud` で行う場合:

```bash
PROJECT=my-project-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
サービス アカウント キーの作成が無効になっていると Google から応答があった場合、組織で `iam.disableServiceAccountKeyCreation` ポリシーが適用されています — 2024 年以降に作成された組織ではこれがデフォルトです。オプション B を使用するか、組織の管理者にこのプロジェクトの例外を依頼してください。
</Warning>

**オプション B — キーなし (権限借用)**

1. サービス アカウントを作成し、ロールを付与します (上記の手順 1 と 2)。
2. SecureAI の接続フォームでは、**Service account to impersonate** フィールドに、承認が必要な SecureAI のアカウントが表示されます。Google Cloud でご自身のサービス アカウントを開き、**権限 → アクセスを許可** で、そのアカウントをプリンシパルとして入力し、`roles/iam.serviceAccountTokenCreator` を付与します。
3. フィールドにご自身のサービス アカウントのメールアドレスを入力し、JSON は空のままにします。

フィールドが表示されない場合、デプロイメントはキーなしアクセスを提供していません。オプション A を使用してください。

## 接続する

1. **管理 → 統合 → クラウド → Google Cloud — Discovery → 接続。**
2. プロジェクト ID、ロケーション (または **More Vertex AI Locations** で複数)、そして JSON キーまたは権限借用するサービス アカウントのいずれかを入力します。エクスポートを使用している場合は請求関連のフィールドも追加します。
3. **接続** をクリックします。SecureAI は保存前に、プロジェクトを実際に読み取って認証情報を確認します — 数秒かかります。プロジェクトを読み取れない場合 (ID の誤り、ロールなし、ロケーションの入力ミス) は理由を表示し、何も保存しません。入力した内容はフォームに残ります。
4. 保存はされたもののロールが不足している場合は、警告に不足しているロールが一覧表示されます。それらを付与して、再度同期してください。
5. カードの更新ボタンで今すぐ同期します。以降、SecureAI は 6 時間ごとに自動的に同期します。

後で認証情報を変更するには、もう一度 **接続** を使用します。空のままのフィールドは保存済みの値を維持します。JSON キーを入力すると保存済みの権限借用が置き換えられ、その逆も同様です。

## 確認する

- [Cloud Sensors](/ja/discovery/cloud-sensors) に検出されたエージェントが一覧表示されます。Google Cloud のカードをクリックすると GCP パネルが開きます: 使用状況とコスト (リクエスト数、失敗数、トークン、キャッシュ、コストとその取得元)、モデルとデプロイ、ID とアクセス (サービス アカウントとキー、およびその最終使用日時、IAM バインディング)、監査。
- パネルに **Discovery could not read everything** と表示された場合は、表示されたロールを付与して再度同期してください。
- [NHI インベントリ](/ja/discovery/nhi-inventory)にはサービス アカウントとキーが表示されます。

同期が失敗した場合 (たとえばキーが削除された、ロールが外された場合)、カードにエラーが表示され、SecureAI は最後のインベントリを保持したまま、バックオフしながら再試行します。部分的な読み取りによってエージェントが廃止されたり、ID が削除されたりすることはありません。

## コスト

- **`billingExportTable` を指定した場合**: このプロジェクトの AI サービス (Vertex AI、Gemini API、Agent Builder、Dialogflow など) に対する実際の支出を、クレジット適用後の金額で、請求先アカウントの通貨で表示します。クレジットで使用量がまかなわれている場合、正味金額がゼロになることがあります。その場合、パネルにはクレジット適用前の金額が併せて表示されます。Google はエクスポートを数時間の遅延で更新します。
- **指定しない場合**: 見積もり — Cloud Monitoring のトークン数 × 定価で、Claude とプロンプト キャッシュのトークンも含みます。割引や確約利用契約は反映されません。

## 取り消し

コネクタにその操作のロールがある場合 ([前提条件](#前提条件)を参照)、GCP の ID は [NHI インベントリ](/ja/discovery/nhi-inventory) (南京錠) から取り消せます。Google 側でそれぞれ何が起きるか:

| ID | Google 側で起きること | 元に戻せるか |
|----|------------------------|--------------|
| サービス アカウント | 無効化 | はい — Google Cloud で再度有効にできます |
| サービス アカウント キー | 削除 | いいえ |
| API キー | 削除 | Google Cloud で 30 日間は復元できます |
| Workload Identity のプール / プロバイダ、OAuth クライアント | 無効化 | はい |

安全策:

- コネクタが使用するサービス アカウントとそのキーは、SecureAI から取り消すことはできません — 取り消すとディスカバリーが停止してしまうためです。Google Cloud でローテーションしてください。
- Google のデフォルトのサービス アカウント (Compute Engine のデフォルト、App Engine、Cloud Build、サービス エージェント) では 2 回目の確認が求められます。これらのいずれかを無効にすると、そのアカウントで実行されているすべての VM、アプリ、ビルドが停止します。
- コネクタにある操作のロールがない場合は、エラーにそのロールが表示されます。

## 関連

- [Google Vertex AI — お客様のアカウントでの推論](/en/integrations/cloud/vertex-ai-inference)
- [クラウド AI プロバイダーの概要](/ja/integrations/cloud/overview)
- [Google Workspace SSO](/ja/iam/google-workspace)
- [NHI インベントリ](/ja/discovery/nhi-inventory)
