---
sidebar_position: 7
title: "Google Vertex AI — お客様のアカウントでの推論"
sidebar_label: "Vertex AI — 推論"
description: "SecureAI の LLM トラフィックをご自身の Google Cloud アカウントで実行します: 確約利用 (CUD) を使って Google に支払いつつ、SecureAI が DLP、ポリシー、署名付き受領書を引き続き適用します。"
---

# Google Vertex AI — お客様のアカウントでの推論

この統合を使用すると、SecureAI の大規模言語モデル (LLM) の呼び出しが、SecureAI が管理するプロバイダーではなく**お客様ご自身の Google Cloud プロジェクト**で実行されます。使用量は Google アカウントに直接請求されるため、確約利用 (CUD) や交渉済みの割引を活用できます。

SecureAI はすべてのリクエストの経路にとどまります: **DLP、モデル ポリシー、データ所在地、署名付き受領書**は、他のプロバイダーの場合とまったく同じように適用されます。

<Info>
**もう一方の Google Cloud カードと混同しないでください。** このページでは、Vertex AI を**推論プロバイダー**として接続します (Admin → Integrations → **AI providers**)。**Google Cloud — 検出** カード (**Cloud** カテゴリ) はプロジェクトを読み取り専用でインベントリするだけで、プロンプトを送信することはありません。こちらは [Google Cloud — ディスカバリー](/ja/integrations/cloud/gcp-vertex-ai)で説明しています。同じプロジェクトで両方を使用できますが、両者は独立しており、求める権限も異なります。
</Info>

## Vertex で実行されるものとされないもの

| お客様の Vertex で実行されるもの | SecureAI が管理するプロバイダーに残るもの |
|---|---|
| チャットとエージェント (選択したファミリーのモデル) | 埋め込み (ドキュメントとインデックスの検索) |
| Teams 会議の要約 (Gemini モデル) | 検索の再ランキング |
| 文法チェック、翻訳、その他の内部バックグラウンド タスク (**Remap everything** を選択した場合) | ドキュメントの OCR |
| | 管理者アシスタント |
| | 画像生成とリアルタイム音声 |
| | セルフホスト モデルと Claude Code プロキシ |

現在利用できるモデル: **Gemini** と、Vertex で MaaS として提供されるオープンモデル (**gpt-oss、DeepSeek、Llama、Qwen**)。**Vertex 上の Claude と Mistral はまだサポートされていません**。これらのモデルはフォールバックの設定に従って処理されます (下記を参照)。

## 使用できるクラウド プロバイダーの数

| プラン | 同時に有効にできる推論プロバイダー |
|--------|------------------------------------|
| **Scale** | 1 (Google Vertex AI、Azure AI Foundry、**または** Amazon Bedrock) |
| **Enterprise** | 最大 3 — たとえば Gemini には Vertex AI、GPT には Foundry、Claude には Bedrock |

複数のプロバイダーを有効にしている場合、それぞれが**異なる**モデル ファミリーを担当します: 1 つのファミリーを担当できる有効なプロバイダーは 1 つだけで、**Remap everything** にできるプロバイダーも 1 つだけです。統合を有効にした状態で保存すると、SecureAI は次の 2 つの場合に保存を拒否し、パネルにその理由を表示します:

| 場合 | パネルのメッセージ |
|------|--------------------|
| ルーティングが有効な別のプロバイダーと重複している (別のプロバイダーがすでに担当しているファミリー、または 2 つ目の **Remap everything**) | *This routing overlaps another enabled cloud provider: …* の後に、衝突しているファミリーまたはモードが表示されます。 |
| プランで、有効なプロバイダーをこれ以上追加できない | *Your plan's BYO-cloud provider limit is reached (… of … in use). Disable another provider or upgrade the plan.* |

## 前提条件

- 課金が有効になっている **Google Cloud プロジェクト**。
- そのプロジェクトで有効になっている **Agent Platform API (Vertex AI API)** (`aiplatform.googleapis.com` サービス)。
- プロジェクト内の、**Agent Platform User** ロール (`roles/aiplatform.user`) を持つ**サービス アカウント**と、SecureAI がそのアカウントとして動作するための次の 2 つの方法のいずれか:
  - **オプション A — そのサービス アカウントの JSON キー**。
  - **オプション B — キーなし (権限借用)**: パネルに表示される SecureAI のサービス アカウントに、お客様のサービス アカウントに対する **Service Account Token Creator** ロール (`roles/iam.serviceAccountTokenCreator`) を付与します。キーは保存されません。このオプションは、SecureAI のデプロイメントが提供している場合にのみ利用できます。提供していない場合、パネルではこのオプションが無効と表示され、*Keyless access is not enabled on this deployment.* という通知が出ます。
- SecureAI の Integrations セクションに対する **Admin** 権限。読み取り権限では、設定を表示できますが変更はできません。

## ステップ 1. Google Cloud でプロジェクトを準備する

コマンドライン (手早く) またはコンソール (スクリーンショット付き) のどちらからでも行えます。手順 1〜3 はどちらの認証オプションでも同じです。手順 4 (JSON キー) はオプション A の場合のみです。

<Tabs>
<Tab title="gcloud (Cloud Shell)">

[Cloud Shell](https://shell.cloud.google.com/) から、または `gcloud` をインストールした環境で実行します。`MY_PROJECT` を実際のプロジェクト ID に置き換えてください:

```bash
gcloud config set project MY_PROJECT

# 1. Agent Platform API (Vertex AI API) を有効にする
gcloud services enable aiplatform.googleapis.com

# 2. SecureAI 専用のサービス アカウントを作成する
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. モデルを呼び出すための最小限のロールを付与する
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:secureai-vertex@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. オプション A のみ: JSON キーを生成する
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MY_PROJECT.iam.gserviceaccount.com
```

</Tab>
<Tab title="Google Cloud コンソール">

1. [Google Cloud コンソール](https://console.cloud.google.com/)でプロジェクトを選択し、**API とサービス → ライブラリ** を開きます。**Agent Platform API** (旧称 **Vertex AI API**) を検索し、**有効にする** をクリックします。すでに **API が有効です** と表示されている場合は、何もする必要はありません。

   <div class="mac-window">
   ![Google Cloud で有効になっている Agent Platform API](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. **IAM と管理 → サービス アカウント → サービス アカウントを作成** に移動します。名前を付けます (例: `secureai-vertex`)。

   <div class="mac-window">
   ![サービス アカウントを作成する](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. **権限** で、プロジェクトに対する **Agent Platform User** ロール (`roles/aiplatform.user`) を付与し、**完了** をクリックします。推論に必要なロールはこれだけです。

   <div class="mac-window">
   ![Agent Platform User ロールを付与する](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. **オプション A のみ。** サービス アカウントを開き、**キー** タブ → **鍵を追加 → 新しい鍵を作成** に移動して、キーのタイプに **JSON** を選択し、**作成** をクリックします。ファイルのダウンロードは 1 回だけです。

   <div class="mac-window">
   ![JSON キーを作成する](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
JSON ファイルはパスワードと同じように扱ってください。SecureAI はこれを**暗号化**して保存し、二度と表示しませんが、ダウンロードしたファイル (`key.json`) はお使いのコンピューターに残ります: 内容を SecureAI に貼り付けたら**削除する**か、シークレット マネージャーに保管してください。
</Warning>

<Warning>
**キーを作成できない場合。** 手順 4 が `iam.disableServiceAccountKeyCreation` で失敗する場合、Google Cloud の組織のポリシーでサービス アカウント キーが禁止されています (新しい組織ではこれがデフォルトです)。デプロイメントが提供している場合は**オプション B (キーなし)** を使用してください。そうでない場合は、組織のポリシー管理者に、そのプロジェクトについて `iam.disableServiceAccountKeyCreation` 制約の例外を依頼してください。
</Warning>

### オプション B: キーなしで SecureAI を承認する

オプション B ではキーを作成しません。代わりに次の手順を行います:

1. SecureAI で Vertex AI パネルを開き (ステップ 2 を参照)、**Keyless (impersonation)** を選択して、**Your service account to impersonate** にご自身のサービス アカウントのメールアドレスを入力します。
2. パネルに、デプロイメントの SecureAI サービス アカウントが入力済みの、実行すべきコマンドが表示されます。**Copy** でコピーし、Cloud Shell で実行してください。次のようなコマンドです:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding secureai-vertex@MY_PROJECT.iam.gserviceaccount.com \
     --member="serviceAccount:SECUREAI_ACCOUNT" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   このロールはプロジェクトではなく、**お客様のサービス アカウントに対して**付与されます: SecureAI はそのアカウントとしてのみ動作でき、そのアカウントが持つのは `roles/aiplatform.user` だけです。

### オープンモデル (Llama、DeepSeek、Qwen、gpt-oss)

**Gemini の場合、これ以上の作業は不要です。** Llama、DeepSeek、Qwen、gpt-oss も使用するには、まず **Vertex AI → Model Garden** で各モデルの利用規約に同意してください。これらのオープンモデルには特定の**リージョン** (例: `us-central1`) が必要です。`global` では利用できない場合があります。

## ステップ 2. SecureAI でプロジェクトを接続する

1. **Admin → Integrations** に移動し、**AI providers** カテゴリを開いて、**Google Vertex AI — Inference on your account** カードをクリックします。
2. **Connection** で、次の項目を入力します:

   | フィールド | 入力する内容 |
   |------------|--------------|
   | **Google Cloud project ID** | プロジェクト ID (例: `my-project-123`)。表示名ではありません。 |
   | **Vertex AI location** | 最初は `global` のままにしてください: Gemini 3 の *preview* のデフォルト モデルがあるのはそこです。**データ所在地**が必要な場合は、リージョン (`us-central1`、`europe-west4` など) を入力します: SecureAI は各リクエストを選択したリージョンのエンドポイントに送信し、Google がそれをどこで処理するかは Google のデータ所在地に関するコミットメントに従います。`global` の場合は Google がリージョンを選択します。オープンモデルにはリージョンが必要です。 |
   | **Authentication** | **オプション A:** **Service-account key (JSON)** を選択したまま、`key.json` の内容**全体**を **Service-account key JSON** に貼り付けます。**オプション B:** **Keyless (impersonation)** を選択し、**Your service account to impersonate** にご自身のサービス アカウントのメールアドレスを入力して、パネルに表示されるコマンドを実行します (上記の **オプション B: キーなしで SecureAI を承認する** を参照)。 |

   <div class="mac-window">
   ![Vertex AI パネルの Connection セクション](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. **Save** をクリックします。この時点ではまだトラフィックはルーティングされません: 先にテストできるよう、統合は無効の状態で保存されます。

<Info>
**初日のおすすめ:** **Only these model families** モードで **Gemini** のみを選択し、デフォルト モデルは変更せず、フォールバックとシートごとの支出上限はどちらも無効のままにしてください。これが最も予測しやすい構成です。**Remap everything** は、この構成で検証が済んでから使用してください。
</Info>

<Info>
オプション A では、貼り付けたキーが再び表示されることはありません。置き換えるには新しいキーを貼り付けてください。保存時にフィールドを空のままにすると、現在のキーが維持されます。
</Info>

## ステップ 3. Vertex で実行するものを選択する

**What runs on Vertex** には 2 つのモードがあります:

- **Only these model families** — チェックを入れたファミリー (Gemini、gpt-oss、DeepSeek、Llama、Qwen) がお客様の Vertex で実行され、それ以外のモデルは引き続き SecureAI のプロバイダーで実行されます。これが最も慎重な始め方です (デフォルト: Gemini のみ)。
- **Remap everything to Vertex** — すべての LLM 呼び出しがお客様の Vertex で実行されます。Vertex に同等のモデルがないモデルは、**デフォルト モデル**が対応します。

**Default Vertex models** (編集可能):

| ティア | 用途 | デフォルト |
|--------|------|------------|
| **Fast** | バックグラウンド タスクとユーティリティ (文法、翻訳、Teams) | `google/gemini-2.5-flash` |
| **Standard** | 同等のモデルがないモデル | `google/gemini-3-flash-preview` |
| **Reasoning** | 同等のモデルがない推論モデル | `google/gemini-3.1-pro-preview` |
| **Vision** | 画像または PDF を含むリクエスト | `google/gemini-3-flash-preview` |

さらに 2 つのオプションがあります:

| オプション | 無効 (推奨) | 有効 |
|------------|-------------|------|
| **Allow fallback to SecureAI-managed models** | Vertex が失敗した場合やモデルに同等のものがない場合、リクエストは別のプロバイダーに送られず、**拒否**されます。 | それらのリクエストは、SecureAI が管理するプロバイダーで **1 回**再試行されます。再試行は監査されます。 |
| **Apply each seat's spend cap to turns served in your account** | お客様の Vertex で処理されたターンは、各ユーザーのシートの支出上限に計上されません。 | それらのターンは、SecureAI が処理するターンと同じく定価で、シートの支出上限 (月間上限と 4 時間のバースト上限の両方) に計上されます。 |

<div class="mac-window">

![What runs on Vertex セクション](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
利用できるモデルは**ロケーション**によって異なります。デフォルト モデル (その多くは *preview*) は、すべてのリージョンに存在するとは限りません。接続テストで **Model not available in this location** が返された場合は、別のリージョンを選択するか、デフォルト モデルをそのリージョンで提供されているモデルに置き換えてください。オープンモデル (MaaS) を使用するには、Vertex AI Model Garden で利用規約に同意し、特定のリージョンを指定する必要があります。
</Info>

## ステップ 4. 接続をテストする

1. 統合を保存した状態で、**Connection test** の **Test connection** をクリックします。
2. SecureAI は各デフォルト モデルに最小限のリクエストを**実際のトラフィックと同じ経路で** (ゲートウェイ、ポリシー、受領書を含めて) 送信し、それぞれの結果をレイテンシとともに表示します。

   <div class="mac-window">
   ![接続テストの結果](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. モデルが失敗した場合は、パネルに理由が表示されます。このページの最後にある**トラブルシューティング**のセクションを参照してください。

### ID がほかに実行できること

このテストでは、接続の ID がプロジェクト内でほかに何を実行できるかも、`projects:testIamPermissions` と推論経路と同じトークンで確認します。追加のロールは不要で、何も変更されません。パネルには次のいずれかの通知が表示されます:

| パネルの通知 | 意味 |
|--------------|------|
| *Permissions: roles/aiplatform.user — it can call models and also deploy or delete Vertex AI resources, and none of the permissions outside AI that SecureAI checks.* | `roles/aiplatform.user` であれば想定どおりの結果です。 |
| *Least privilege: this identity can call models and nothing else that SecureAI checked.* | `roles/aiplatform.user` のデプロイ権限すら持っていません (カスタム ロールなど)。 |
| *This identity can do much more than call models: …* (警告、権限の一覧付き) | IAM ポリシーの変更、サービス アカウント キーの作成、Storage・BigQuery・Secret Manager のデータの読み取りなど、AI 以外の権限を持っています。アクティビティ ログにはテストが警告として記録されます。サービス アカウントには `roles/aiplatform.user` のみを付与してください。 |
| *Could not check what else this identity can do in the project …* | Google が応答しませんでした。たとえば Cloud Resource Manager API が無効になっています。 |

<Info>
このテストでは 1 トークンのリクエストをいくつか送信し、**お客様の Google アカウントに請求されます** (数セント程度)。
</Info>

## ステップ 5. ルーティングを確認して有効にする

1. **Routing preview → Show which lane serves each model** を開きます。カタログの各モデルについて、**お客様の Vertex** が処理するのか (その場合はどの Vertex モデルで処理するのか)、**SecureAI** が処理するのか、またどのモデルが**ユーザーに表示されなくなる**のかが示されます。プレビューは統合が有効になった状態をシミュレートするため、有効にする前に影響を確認できます。
2. テストに合格したら、**Route traffic to Vertex AI** を有効にし、もう一度 **Save** をクリックします。**保存しないと、スイッチは有効のままになりません。** 有効にするには、プロジェクトと認証情報が設定されている必要があります。プランで別のクラウド プロバイダーを追加できない場合や、ルーティングが別のプロバイダーと重複している場合、SecureAI は保存を拒否し、その理由を表示します (上記の **使用できるクラウド プロバイダーの数** を参照)。

   <div class="mac-window">
   ![Route traffic to Vertex AI スイッチを有効にした状態](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. カードが緑色になり、**Routing to Vertex** と表示されます。保存済みでも無効の場合は、黄色で **Configured · not routing to Vertex** と表示されます。

変更は、保存したサーバーではすぐに、その他のサーバーでは最大 30 秒以内に適用されます。

## ステップ 6. モデル セレクターで確認する

統合が有効になると、お客様の Vertex で実行されるモデルには、チャットのモデル セレクターで名前の横に **Google Cloud のロゴ**が表示されます。ロゴにカーソルを合わせると、そのモデルが組織の Vertex AI アカウントで実行されることが示されます。

<div class="mac-window">

![Google Cloud のロゴが表示されたモデル セレクター](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

フォールバックなしの **Remap everything** モードでは、セレクターにはお客様の Vertex が処理するモデル**だけが表示されます**。同等のモデルがないモデルは、選択したものとは異なるモデルが応答することになるため、表示されません。

## 何が誰に請求されるか

- **LLM の使用量は、SecureAI ではなく Google からお客様のアカウントに請求されます**。料金は、お客様の割引と CUD が適用されたうえで Google Cloud の請求に表示されます。
- SecureAI は、Vertex で処理されたターンのコストを、分析専用の**定価による見積もり**として表示します。これは参考値であり、お客様の割引は**含まれていない**ため、Google の実際の金額はこれより低い場合があります。
- お客様の Vertex で処理されたターンは、**Apply each seat's spend cap to turns served in your account** を有効にしない限り、**各ユーザーのシートの支出上限に計上されません**。**シート レベル**は引き続き適用されます: お客様の Vertex が処理する場合でも、ユーザーは自分のレベル以下のモデルしか使用できません。
- **Govern BYO** シートで使用できるのは、組織自身のインフラストラクチャで処理されるモデル、つまりお客様の Vertex (または接続済みの別のクラウド プロバイダー) が処理するモデルと、お客様のサーバー上のセルフホスト モデルだけです。それ以外のモデルは拒否され、セレクターはそのシートに **Auto** を表示しません。

## セキュリティとコンプライアンス

- **認証情報は暗号化、または保存なし。** オプション A では、サービス アカウント キーは暗号化 (AES-256-GCM) して保存され、管理者に対してもブラウザに返されることはありません。画面に表示されるのはアカウントのメールアドレスだけです。オプション B ではキーは保存されません: SecureAI は、お客様のサービス アカウントとして動作する有効期間の短いトークンを Google に要求します。
- **経路は保護されたままです。** すべての呼び出しは SecureAI の SMLTP ゲートウェイを通過します: DLP、リクエストごとの署名付き認可トークン、そして検証可能な**署名付き受領書**。
- **データ所在地。** リージョンを固定した場合 (例: `europe-west4`)、SecureAI は各リクエストをそのリージョンのエンドポイントに送信し、組織のデータ所在地ポリシーを適用します。Google がリクエストをどこで処理するかは、Google のデータ所在地に関するコミットメントに従います。
- **フェイルクローズ。** 設定を読み取れない場合や Google のトークンを取得できない場合、リクエストは拒否されます。フォールバックを許可していない限り、別のプロバイダーには送信されません。
- **監査。** 統合の保存、テスト、切断はアクティビティ ログに記録されます。変更されたフィールドの名前は記録されますが、キーが記録されることはありません。
- **最小権限の可視化。** 接続テストでは、接続の ID がプロジェクト内でほかに何を実行できるかを確認し、AI 以外の権限を持っている場合は警告します (ステップ 4 の **ID がほかに実行できること** を参照)。
- **最小限の権限。** 推論には `roles/aiplatform.user` で十分です。この統合が IAM や請求を読み取る必要はありません。

## 切断

**Disconnect** (パネルのフッター) は、設定と保存されたキーを削除します。その時点から、**すべてのトラフィックが SecureAI が管理するプロバイダーに戻ります**。接続を維持したままルーティングを一時停止するには、**Route traffic to Vertex AI** スイッチだけを無効にすることもできます。

その後、Google Cloud でもアクセスを削除してください:

- **オプション A:** キーの使用をやめる場合は、**キーを取り消して**ください (サービス アカウント → キー)。
- **オプション B:** お客様のサービス アカウントに対して SecureAI のサービス アカウントに付与した `roles/iam.serviceAccountTokenCreator` ロールを削除してください (サービス アカウント → ご自身のアカウント → **権限**)。

## トラブルシューティング

**Test connection** に表示される可能性のある理由は次のとおりです:

| 理由 | 考えられる原因 | 対処方法 |
|------|----------------|----------|
| Credential rejected or not usable | JSON が不完全または無効、あるいはキーが取り消されている。キーなし: SecureAI のアカウントにお客様のサービス アカウントに対する `roles/iam.serviceAccountTokenCreator` がない、またはメールアドレスの入力ミス | JSON 全体をもう一度貼り付けるか、新しいキーを作成してください。キーなし: パネルに表示されるコマンドを実行し、メールアドレスを確認してください。 |
| Not authenticated | Google がトークンを拒否した | サービス アカウントが存在し、有効になっていることを確認してください。 |
| Vertex AI API is not enabled on the project | ステップ 1 の手順 1 が未実施 | プロジェクトで **Agent Platform API (Vertex AI API)** (`aiplatform.googleapis.com`) を有効にしてください。 |
| Missing roles/aiplatform.user | 権限が不足している | そのプロジェクトで、サービス アカウントに **Agent Platform User** ロール (`roles/aiplatform.user`) を付与してください。 |
| Model not available in this location | 選択したリージョンにモデルが存在しない、またはオープンモデルの利用規約に Model Garden で同意していない | リージョンまたはそのデフォルト モデルを変更してください。オープンモデルの場合は、Model Garden で利用規約に同意してください。 |
| Quota exceeded | Vertex の割り当てを使い切った | プロジェクトの割り当てを確認するか、Google に増加を依頼してください。 |
| Google returned an error | Google 側の障害 | 再試行してください。解決しない場合は、Google Cloud のステータスを確認してください。 |
| Blocked by your SMLTP model policy | SecureAI のポリシーでそのモデルが許可されていない | 許可ポリシーにモデルを追加してください。 |
| SMLTP Vertex gateway unreachable / TLS error | SecureAI のインフラストラクチャの問題 | サポートにお問い合わせください。お客様の Google プロジェクトには依存しません。 |
| Unexpected error | SecureAI が分類できなかった障害 | 再試行してください。解決しない場合は、パネルに表示されたメッセージを添えてサポートにお問い合わせください。 |
| No default models configured | 4 つのデフォルト モデルがすべて空のため、テストする対象がない | **Default Vertex models** で少なくとも 1 つを入力し、保存してから再度テストしてください。 |

チャットでユーザーに表示される可能性のあるエラー:

| コード | 意味 |
|--------|------|
| `SAI-VERTEX-001` | 選択したモデルに Vertex で同等のものがなく、フォールバックが無効になっています。別のモデルを選択するか、フォールバックを許可してください。 |
| `SAI-VERTEX-002` | Google へのアクセスを取得できませんでした (キーが無効または取り消されている、またはキーなしの場合は権限借用の権限が削除された)。認証情報を更新してください。 |
| `SAI-VERTEX-005` | 設定を読み取れなかったため、安全のためにリクエストが拒否されました。数秒後に再試行してください。 |

## 現在の制限事項

- **Vertex 上の Claude と Mistral** はサポートされていません (異なる API を使用するため)。
- **埋め込み、再ランキング、OCR、管理者アシスタント、画像生成、リアルタイム音声**は、SecureAI が管理するプロバイダーに残ります。
- 組織ごとに **Vertex のプロジェクトとロケーションは 1 つ**です。
- 同時に有効にできる推論プロバイダーの数はプランによって異なります (Scale: 1、Enterprise: 最大 3)。[Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference) と [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference) を参照してください。
- **Claude Code** プロキシは Anthropic を直接使用し、Vertex を経由しません。

## 関連

- [Google Cloud — ディスカバリー](/ja/integrations/cloud/gcp-vertex-ai) — プロジェクトのエージェント、モデル、ID、コストのインベントリ。
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [クラウド AI プロバイダーの概要](/ja/integrations/cloud/overview)
- [署名付き受領書](/ja/api/receipts)
