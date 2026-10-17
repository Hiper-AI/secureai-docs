---
sidebar_position: 4
title: "Azure — 検出"
sidebar_label: "Azure — 検出"
description: "Azure と Microsoft Entra ID を接続すると、SecureAI が Azure OpenAI と Foundry のリソース、Foundry のプロジェクトとエージェント、AI Search、Bot Service、およびすべての非人間 ID (サービス プリンシパル、エージェント ID、マネージド ID、シークレット、証明書、フェデレーション資格情報) を、それぞれの権限、RBAC、アクティビティ、使用状況、コストとともにインベントリ化します。"
---

# Azure — 検出

Azure テナントを接続すると、SecureAI は Azure 上の AI リソースと、Microsoft Entra ID 内の**すべての非人間 ID (NHI)** を、それぞれが持つロールと権限とともにインベントリ化できます。

<Info>
この接続は**読み取り専用**で、プロンプトを送信することはありません。SecureAI の LLM トラフィックを代わりにお客様自身の Foundry リソースで実行するには、[Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference) を参照してください。この 2 つは、サービス プリンシパルと権限が異なる独立した接続であり、同じサブスクリプションで両方を使用できます。
</Info>

## SecureAI がインポートするもの

サービス プリンシパルが読み取れるサブスクリプションごとに、次の内容をインポートします。

- **AI リソース**: すべての Azure AI Services、Azure OpenAI、その他の Cognitive Services アカウント (Content Safety、Speech、Language、Document Intelligence など)。リージョンと状態も含みます。
- Azure OpenAI と Foundry の**モデルのデプロイ**。容量と、直近 30 日間の使用状況 (リクエスト数、入力・出力トークン数。Azure Monitor から取得) を含みます。
- **Foundry のプロジェクトとエージェント**: 各プロジェクトの Foundry Agent Service のエージェントと従来のアシスタント、およびそれぞれが使用するモデル。ハブとハブベースのプロジェクト (Azure Machine Learning)、そのオンライン エンドポイントとサーバーレス エンドポイントも対象です。
- **Azure AI Search** と **Azure Bot Service**。
- 当月の**コスト** (サービス別、Cost Management)。
- **アクティビティ**: 直近 30 日間の Cognitive Services と Machine Learning の管理イベント (アクティビティ ログ)。
- **NHI**。[NHI インベントリ](/ja/discovery/nhi-inventory)に一覧表示されます。
  - エンタープライズ アプリケーションの**サービス プリンシパル**。
  - Microsoft Entra の**エージェント ID**。Foundry がエージェントごとに作成するもので、*エージェント*として分類されます。
  - システム割り当てとユーザー割り当ての**マネージド ID**。
  - アプリの登録の**クライアント シークレット**と**証明書** (有効期限を含む)。
  - **フェデレーション資格情報** (ワークロード ID フェデレーション)。たとえば GitHub Actions の OIDC 信頼を設定すると、そのリポジトリはシークレットを一切使わずに、アプリケーションとしてトークンを取得できます。
  - 各アプリケーションの**最終サインイン**。テナントがそのレポートを公開している場合に限ります。
- **各 ID の権限**: サブスクリプションの任意のスコープ (サブスクリプション、リソース グループ、リソース) での Azure RBAC ロール、Microsoft Graph のアプリケーション権限、Entra のディレクトリ ロール。
- **RBAC ロールの割り当て**: 各ロールを名前で表示し、それを持つユーザー、グループ、アプリケーションを併記します。

次のいずれかを持つ ID は**特権**としてフラグが付けられます。

- **Owner**、**Contributor**、**User Access Administrator**、**Role Based Access Control Administrator** のいずれかのロール。
- Graph の書き込み権限 (`Application.ReadWrite.All`、`Directory.ReadWrite.All`、`Mail.Send`、`Files.ReadWrite.All` など)。
- ディレクトリの管理者ロール (Global Administrator、Application Administrator など)。

特権アプリケーションのシークレット、証明書、フェデレーション資格情報にも、特権としてフラグが付けられます。

Microsoft がすべてのテナントに作成する約 130 個のサービス プリンシパル (Azure Portal、Microsoft Graph など) と、ソーシャル サインインの接続はインポートしません。これらはお客様が管理する対象の ID ではありません。

## 前提条件

**クライアント シークレット**を持つ Microsoft Entra ID の**アプリの登録** (サービス プリンシパル) と、次の権限が必要です。

| 場所 | 権限 | 必須か | 有効になること |
|------|------|--------|----------------|
| サブスクリプション | **Reader** ロール | はい | リソース、デプロイ、プロジェクト、マネージド ID、ロールの割り当て、使用状況、アクティビティ |
| サブスクリプション | **Cost Management Reader** ロール | 推奨 | サービス別の当月累計コスト |
| Foundry リソース | **Cognitive Services Data Reader** ロール | 推奨 | 各 Foundry プロジェクトのエージェント |
| Microsoft Graph | `Application.Read.All` (アプリケーション権限) | はい | サービス プリンシパル、エージェント ID、アプリケーション、シークレット、証明書、フェデレーション資格情報、Graph の権限 |
| Microsoft Graph | `Directory.Read.All` (アプリケーション権限) | はい | ディレクトリ ロールと、各ロールのメンバー名 |
| Microsoft Graph | `AuditLog.Read.All` (アプリケーション権限) | 推奨 | 各アプリケーションの最終サインイン |
| Microsoft Graph | `Application.ReadWrite.All` (アプリケーション権限) | 失効する場合のみ | SecureAI からサービス プリンシパルを無効にし、シークレット、証明書、フェデレーション資格情報を削除する |

Graph の権限には**管理者の同意**が必要です。**すべて**のサブスクリプションを読み取るには、各サブスクリプションに **Reader** を割り当てるか、それらを含む管理グループに割り当てます。

<Note>
Foundry のエージェントは、Azure Resource Manager ではなくプロジェクトのデータ プレーンにあります。**Reader だけでは表示できません**。Foundry リソースに **Cognitive Services Data Reader** (または **Foundry User**) がない場合でも同期は動作しますが、エージェント一覧は空のままとなり、SecureAI はそれをギャップとして報告します。Cognitive Services Data Reader は、これを可能にする最小のロールで、データ プレーンの読み取りのみを許可します。
</Note>

## ステップ 1. サービス プリンシパルを作成する

### Azure CLI を使う場合

[Azure Cloud Shell](https://shell.azure.com/) または `az` CLI から実行します。`SUB_ID` をお使いのサブスクリプションに置き換え、Foundry を使用する場合は `MY_RESOURCE` と `MY_RG` をお使いのリソースとリソース グループに置き換えてください。

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

ステップ 2 で、SecureAI に貼り付ける 3 つの値が出力されます。**SecureAI から失効**できるようにするには、ステップ 3 で `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role` (`Application.ReadWrite.All`) も追加し、あらためて同意を付与してください。

### Azure portal を使う場合

1. [Azure portal](https://portal.azure.com/) で **Microsoft Entra ID → アプリの登録 → 新規登録**に移動し、名前 (例: `SecureAI Discovery`) を付けて登録します。
2. **概要**で、**ディレクトリ (テナント) ID** と**アプリケーション (クライアント) ID** をコピーします。
3. **証明書とシークレット → クライアント シークレット → 新しいクライアント シークレット**でシークレットを作成し、その**値**をコピーします (表示されるのは 1 回だけです)。
4. **API のアクセス許可 → アクセス許可の追加 → Microsoft Graph → アプリケーションのアクセス許可**で、`Application.Read.All`、`Directory.Read.All`、`AuditLog.Read.All` を追加します (SecureAI から失効する場合は `Application.ReadWrite.All` も追加)。続いて**管理者の同意を与えます**をクリックします。
5. **サブスクリプション → お使いのサブスクリプション → アクセス制御 (IAM) → ロールの割り当ての追加**で、アプリケーションに **Reader** と **Cost Management Reader** を割り当てます。
6. **お使いの Foundry リソース → アクセス制御 (IAM)** で、アプリケーションに **Cognitive Services Data Reader** を割り当てます。

<Info>
Azure のロールが反映されるまで**最大 5 分**、Graph の同意が反映されるまでさらに数分かかることがあります。付与したばかりの権限について最初の同期でギャップが表示された場合は、しばらく待ってからもう一度同期してください。
</Info>

<Warning>
シークレットはパスワードと同様に扱ってください。SecureAI はシークレットを**暗号化**して保存し、二度と表示しません。シークレットには**有効期限**があります (上記のコマンドでは 1 年後)。期限前にローテーションしないと、その日から同期が動作しなくなります。
</Warning>

## ステップ 2. SecureAI で Azure を接続する

1. **管理 → 統合**に移動し、**Cloud** で絞り込んで、**Azure — 検出**カードの**統合を接続**をクリックします。
2. 各フィールドを入力します。

   | フィールド | 入力する内容 |
   |------------|--------------|
   | **Azure Tenant ID (Directory ID)** | ステップ 1 の `tenantId` |
   | **App Registration Client ID** | ステップ 1 の `clientId` |
   | **App Registration Client Secret** | ステップ 1 の `clientSecret`。暗号化して保存されます。 |
   | **Subscription ID** (任意) | 読み取りをそのサブスクリプションに限定します。空欄の場合: プリンシパルが **Reader** を持つすべてのサブスクリプション。 |

3. **接続**をクリックします。保存する前に、SecureAI は実際の読み取りで資格情報をテストします。シークレットが正しくない場合や、プリンシパルがサブスクリプションを読み取れない場合は何も保存されず、不足している内容がメッセージに表示されます。接続はできても Graph の権限が不足している場合は、通知にその権限名が表示されます。
4. カードの更新ボタンで**同期**します。Azure の同期には数分かかることがあります (Azure Resource Manager、Microsoft Graph、Azure Monitor、Cost Management を順に処理するため)。その後は、SecureAI が 6 時間ごとに自動で同期します。

## ステップ 3. 確認する

- [Cloud Sensors](/ja/discovery/cloud-sensors) に、検出されたデプロイ、エージェント、サービスが一覧表示されます。Azure カードをクリックすると Insights が開きます。
  - **Usage & Costs**: 使用状況とコスト
  - **Models & Deployments**: デプロイとエージェント
  - **Identity & Access**: ロールと *Privileged* フラグ付きの ID、シークレット、証明書、フェデレーション資格情報、メンバー付きの RBAC ロール
  - **Audit & Logs**: アクティビティ
- [NHI インベントリ](/ja/discovery/nhi-inventory)には、サービス プリンシパル、エージェント ID、マネージド ID、シークレット、証明書、フェデレーション資格情報が、権限と特権かどうかとともに表示されます。

同期が失敗した場合 (たとえばシークレットの期限切れ)、カードにエラーが表示され、SecureAI は最後のインベントリを保持したまま、バックオフを入れて再試行します。

## カバレッジのギャップ

SecureAI が読み取れなかったものが黙ってスキップされることはありません。接続時または同期時に、不足している権限が通知に表示されます。

| 対象 | 解決する権限 |
|------|--------------|
| Entra の ID (サービス プリンシパル、アプリの登録) | 管理者の同意を伴う `Application.Read.All` |
| 各 ID の Graph 権限 | `Application.Read.All` |
| ディレクトリ ロール | `Directory.Read.All` |
| ロールの割り当てとマネージド ID | サブスクリプションの **Reader** |
| Foundry のエージェント | Foundry リソースの **Cognitive Services Data Reader** |

部分的な読み取り (権限の不足、Azure が返さなかったページ、スロットリング) では、インベントリから**エージェントが除外されることも ID が削除されることもありません**。SecureAI は、その項目が表示されるはずの一覧が完全に返されたときにのみ、削除されたものとして扱います。ロールの割り当てがない場合、ID の権限は「なし」ではなく*不明*のままです。

## 失効

[NHI インベントリ](/ja/discovery/nhi-inventory) (南京錠のアイコン) から、`Application.ReadWrite.All` を使って行います。

| ID | Azure での動作 | 元に戻せるか |
|----|----------------|--------------|
| サービス プリンシパル | **無効化**されます (`accountEnabled: false`) | はい: Entra ID で再び有効にします |
| クライアント シークレット | アプリケーションから**削除**されます | いいえ: 新しく作成します |
| 証明書 | アプリケーションから**削除**されます | いいえ: 再度アップロードします |
| フェデレーション資格情報 | 信頼が**削除**されます | いいえ: 再作成します |
| ユーザー割り当てマネージド ID | リソースが**削除**されます (そのリソースに対する **Managed Identity Contributor** も必要) | いいえ |

保護の仕組み:

- SecureAI は、自身の接続に使用しているサービス プリンシパルとそのシークレットについては、検出が止まってしまうため、**失効を提示しません**。これらは Entra ID でローテーションしてください。
- **システム割り当て**のマネージド ID は SecureAI から失効しません。そのライフサイクルは Azure リソースに従います。
- **Foundry** がエージェントの ID の*ブループリント*に保持しているフェデレーション資格情報も、SecureAI からは失効しません。削除するとエージェントが停止します。
- NHI の自動ポリシー (経過期間や未使用による失効) は、Azure にはまだ適用されません。失効は手動で行います。

## 切断

**管理 → 統合 → Cloud → Azure — 検出**で接続を削除すると、保存されている資格情報が削除されます。Azure 側で SecureAI のアクセスを削除するには、アプリの登録またはそのシークレットを削除してください。

## 関連

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [クラウド AI プロバイダーの概要](/ja/integrations/cloud/overview)
- [Cloud Sensors](/ja/discovery/cloud-sensors)
- [NHI インベントリ](/ja/discovery/nhi-inventory)
- [Microsoft Entra ID (SSO)](/ja/iam/microsoft-entra-id)
