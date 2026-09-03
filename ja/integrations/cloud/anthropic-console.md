---
sidebar_position: 3
title: "人間のコンソール"
sidebar_label: "人間のコンソール"
description: "Anthropic Console に接続すると、SecureAI はワークスペース、キー、使用状況、コスト、アクティビティの監査を行うことができます。"
---
# 人間のコンソール

Anthropic 組織を接続すると、SecureAI がワークスペース、API キー、サービス アカウント、支出制限、および (エンタープライズ上で) 監査ログとクロード コード分析をインベントリできるようになります。

## SecureAI がインポートするもの

- **ワークスペース**、使用量、およびコスト
- **NHI** — API キー、サービス アカウント、および BYOK キー (取り消し可能 — [NHI Inventory](/ja/en/discovery/nhi-inventory) を参照)
- **支出制限**
- **監査ログ** (エンタープライズ / コンプライアンス API)
- **クロード コード分析**

## 前提条件

- Anthropic コンソールの **管理者**。
- **管理 API キー** (`sk-ant-admin…`)。
- *(オプション)* エージェント プラットフォーム データのロックを解除するための **ワークスペース キー**、および監査ログのロックを解除するための **コンプライアンス API キー** (エンタープライズ)。

## 認証情報

|フィールド |必須 |説明 |
|----------|----------|---------------|
| `adminApiKey` |はい |組織管理者キー、形式 `sk-ant-admin…`。保存時は暗号化されます。 |
| `apiKey` |いいえ |ワークスペース キー — エージェント プラットフォーム インベントリのロックを解除します。 |
| `complianceApiKey` |いいえ | Enterprise Compliance API キー — 監査ログのロックを解除します。 |

### 管理キーを入手する場所

1. [Anthropic Console](https://console.anthropic.com/) に管理者としてサインインします。
2. **[設定] → [管理者キー]** (組織レベル) に移動します。
3. 管理キーを作成し、コピーします。

## 接続する

1. **「管理」→「統合」→「クラウド」→「Anthropic コンソール」→「接続」**
2. 管理者キー (およびオプションのキー) を貼り付けます。
3. **テスト**し、**保存**します。
4. **同期**。

## 確認する

検出されたワークスペース/エージェントについては [Cloud Sensors](/ja/ja/discovery/cloud-sensors) を開き、キーとサービス アカウントについては [NHI Inventory](/ja/ja/discovery/nhi-inventory) を開きます。分析情報には、使用量、コスト、支出の制限が表示されます。

## 失効

Anthropic API キー、サービス アカウント、BYOK キーは、[NHI Inventory](/ja/en/discovery/nhi-inventory) から **取り消し可能**です。

## 関連

- [クラウド AI プロバイダーの概要](/ja/ja/integrations/cloud/overview)
- [国民健康保険の目録](/ja/ja/discovery/nhi-inventory)