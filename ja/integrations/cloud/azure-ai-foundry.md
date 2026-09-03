---
sidebar_position: 4
title: "Azure AI ファウンドリ"
sidebar_label: "Azure AI ファウンドリ"
description: "Azure AI Foundry / Azure OpenAI に接続すると、SecureAI がエージェント、モデル、ID、RBAC、使用状況、コストをインベントリできるようになります"
---
# Azure AI ファウンドリ

Azure テナントを接続すると、SecureAI が Azure OpenAI / AI Foundry エージェント、AI Search、Bot Service、ML エンドポイントと、それらを管理する Entra ID および RBAC のインベントリを作成できるようになります。

## SecureAI がインポートするもの

- **Azure OpenAI / AI Foundry エージェント、AI Search、Bot Service、および ML エンドポイント**
- **NHI** — Entra サービス プリンシパル、アプリ シークレットと証明書、マネージド ID (取り消し可能 — [NHI Inventory](/ja/en/discovery/nhi-inventory) を参照)
- **Azure RBAC** ロールの割り当て
- **アクティビティログ**
- 過去 30 日間の **使用量、トークン、支出**

## 前提条件

- クライアント シークレットを使用した **Entra ID (Azure AD) アプリ登録** (サービス プリンシパル)。
- **Microsoft Graph アプリケーションのアクセス許可**は管理者の同意を得て付与されます:
  - `Application.Read.All`、`Directory.Read.All`、`AuditLog.Read.All` (読み取り)。
  - `Application.ReadWrite.All` — SecureAI にソースで ID を取り消したい場合のみ**。
- サービス プリンシパルは、関連するサブスクリプション/リソース グループに対する **Reader** ロールを割り当てました。

## 認証情報

|フィールド |必須 |説明 |
|----------|----------|---------------|
| `tenantId` |はい |ディレクトリ (テナント) ID。 |
| `clientId` |はい |アプリ登録のアプリケーション (クライアント) ID。 |
| `clientSecret` |はい |クライアントの秘密。保存時は暗号化されます。 |
| `subscriptionId` |いいえ |検出の範囲を特定のサブスクリプションに設定します。 |

SecureAI は、OAuth2 (クライアント - 資格情報サービス - プリンシパル フロー) 経由で認証します。

### どこで入手できますか

1. [Azure portal](https://portal.azure.com/) で、**Microsoft Entra ID → アプリの登録 → 新規登録** に移動します。
2. アプリの概要から **ディレクトリ (テナント) ID** と **アプリケーション (クライアント) ID** をコピーします。
3. **証明書とシークレット**で、**クライアント シークレット**を作成し、その値をコピーします。
4. **API アクセス許可** で、上記の Microsoft Graph アクセス許可を追加し、**管理者の同意を付与します**。
5. アプリにターゲット サブスクリプションの **リーダー** ロールを割り当てます (**サブスクリプション → アクセス制御 (IAM)**)。

## 接続する

1. **「管理」→「統合」→「クラウド」→「Azure AI Foundry」→「接続」**
2. テナント、クライアント、シークレット (およびオプションのサブスクリプション) を入力します。
3. **テスト**し、**保存**します。
4. **同期** (Azure の同期には数分かかる場合があります — マルチサービス + グラフ + アクティビティ ログ スイープ)。

## 確認する

検出されたエージェント/エンドポイントについては [Cloud Sensors](/ja/ja/discovery/cloud-sensors) を開き、サービス プリンシパル、シークレット、およびマネージド ID については [NHI Inventory](/ja/ja/discovery/nhi-inventory) を開きます。インサイトには、RBAC、使用量、支出が表示されます。

## 失効

Entra サービス プリンシパル、アプリのシークレット/証明書、およびマネージド ID は、Microsoft Graph を介して [NHI Inventory](/ja/en/discovery/nhi-inventory) から**取り消し可能**です。これには、上記の `Application.ReadWrite.All` 権限が必要です。

## 関連

- [クラウド AI プロバイダーの概要](/ja/ja/integrations/cloud/overview)
- [Microsoft Entra ID SSO](/ja/ja/iam/microsoft-entra-id)
- [国民健康保険の目録](/ja/ja/discovery/nhi-inventory)