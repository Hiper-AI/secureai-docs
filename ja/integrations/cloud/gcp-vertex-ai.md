---
sidebar_position: 6
title: "Google バーテックス AI"
sidebar_label: "Google バーテックス AI"
description: "Google Vertex AI に接続すると、SecureAI がエージェント、モデル、サービス アカウント、IAM、使用状況、コストをインベントリできるようになります"
---
# Google Vertex AI

Google Cloud プロジェクトに接続すると、SecureAI は Vertex AI エージェント、エンドポイント、モデルに加えて、それらに関連するサービス アカウント、IAM バインディング、監査ログ、使用状況、請求をインベントリできるようになります。

## SecureAI がインポートするもの

- **Vertex AI エージェント、エンドポイント、モデル**
- **NHI** — サービス アカウント、サービス アカウント キー、および API キー (取り消し可能 — [NHI Inventory](/ja/discovery/nhi-inventory) を参照)
- **IAM** ロール バインディング
- **クラウド監査ログ**
- 過去 30 日間の **リクエスト、トークン、費用**（BigQuery の請求書エクスポートからの実際値、または推定値）

## 前提条件

- JSON キーを持つ **サービス アカウント**、プロジェクトに対する読み取りロールが付与されています:
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - **実際**費用の請求エクスポートを使用する場合は、BigQuery ロール（例: `roles/bigquery.dataViewer`、`roles/bigquery.jobUser`）。
  - *(オプション)* キー/サービス アカウント管理者ロール (SecureAI にソースで ID を取り消す場合)。

## 認証情報

|フィールド |必須 |説明 |
|----------|----------|---------------|
| `projectId` |はい | GCP プロジェクト ID。 |
| `location` |はい |頂点領域 (例: `us-central1`)。 |
| `serviceAccountJson` |はい |サービスアカウントキーのJSON。保存時は暗号化されます。 |
| `billingExportTable` |いいえ |実際の請求用の BigQuery テーブル（例: `dataset.gcp_billing_export_v1_XXXX`）。 |
| `billingProjectId` |いいえ |請求エクスポートをホストするプロジェクト (異なる場合)。 |

### どこで入手できますか

1. [Google Cloud コンソール](https://console.cloud.google.com/) で、**IAM と管理 → サービス アカウント → サービス アカウントの作成** に移動します。
2. 上記の役割を付与します。
3. **「キー」→「キーの追加」→「JSON」** で、キー ファイルをダウンロードします。
4. **JSON 全体**を `serviceAccountJson` フィールドに貼り付けます。

## 接続する

1. **管理 → 統合 → クラウド → Google Vertex AI → 接続。 **
2. プロジェクト、場所、サービス アカウントの JSON (およびオプションの請求フィールド) を入力します。
3. **テスト**し、**保存**します。
4. **同期**。

## 確認する

検出されたエージェント/エンドポイント/モデルについては [Cloud Sensors](/ja/discovery/cloud-sensors) を開き、サービス アカウントとキーについては [NHI Inventory](/ja/discovery/nhi-inventory) を開きます。 Insights show IAM bindings, usage, and cost.

## 失効

コネクタにオプションのキー/SA 管理者ロールがある場合、GCP サービス アカウント、SA キー、API キーは [NHI インベントリ](/ja/discovery/nhi-inventory) から**取り消し可能**です。

## 関連

- [クラウド AI プロバイダーの概要](/ja/integrations/cloud/overview)
- [Google Workspace SSO](/ja/iam/google-workspace)
- [国民健康保険の目録](/ja/discovery/nhi-inventory)