---
sidebar_position: 1
title: "クラウド AI プロバイダーの概要"
sidebar_label: "概要"
description: "OpenAI、Anthropic、Azure、AWS、GCP AI プラットフォームを接続して、SecureAI がエージェント、モデル、ID、使用状況、コストをインベントリできるようにします"
---
# クラウド AI プロバイダー

クラウド AI プロバイダー コネクタを使用すると、SecureAI は組織がすでに使用している AI プラットフォーム (**OpenAI Platform、Anthropic Console、Azure AI Foundry、Google Vertex AI**) にアクセスし、そこで実行されているすべてのインベントリを自動的に作成できます。プロバイダー側​​にエージェントや SDK を展開する必要はありません。 SecureAI は、提供されたほとんどの読み取り資格情報を使用して各プロバイダーの管理 API をポーリングします。

接続されると、コネクタは以下を検出し、継続的に同期します。

- プラットフォーム上で実行されている **エージェント、モデル、およびデプロイメント** → [Cloud Sensors](/ja/discovery/cloud-sensors) に表示されます。
- **非人間 ID (NHI)** — API キー、サービス アカウント、および (サポートされている場合) BYOK キー → [NHI インベントリ](/ja/discovery/nhi-inventory) に表示され、ブロック/取り消し制御が行われます。
- 過去 30 日間の **使用量、トークン、およびコスト**。
- **ガバナンスシグナル** - プロバイダーごとのインサイトに表示される、IAM/RBAC バインディング、支出制限、監査ログ。

## セットアップループ

どのプロバイダーも同じ 4 つの手順に従います。

1. **[管理] → [統合]** を開き、**クラウド** カテゴリを選択します。
2. プロバイダー カードを **接続**し、その資格情報を入力します (各プロバイダーのページを参照)。
3. 接続を **テスト**して、資格情報を検証します。
4. **同期** — 最初の同期では完全なインポートが実行されます。後続の同期は増分であり、スケジュールに従って実行されます。

<Info>
**物事が現れる場所**

コネクタ **setup** は **Admin → Integrations** にあります。生成される **インベントリ** は **Admin → Agent Registry** に表示されます。検出されたエージェント/モデルは [Cloud Sensors](/ja/discovery/cloud-sensors) の下にあり、検出されたアイデンティティは [NHI Inventory](/ja/discovery/nhi-inventory) の下にあります。どちらの場所からでも同期を再実行できます。
</Info>

## 認証情報の選択

可能な限り、**読み取り専用/ビューア** 資格情報を使用します。SecureAI は、画像を構築するためにインベントリを *読み取る*だけで済みます。一部のオプション機能 (漏洩したキーの取り消し、使用量アラートの作成) には追加の書き込み権限が必要です。各プロバイダー ページではこれらを明示的に呼び出しますが、これらは常にオプションです。

入力したすべてのシークレット (クライアント シークレット、サービス アカウント JSON、管理 API キー) は **保存時に暗号化されます**。

## プロバイダー ガイド

|プロバイダー |資格情報の種類 |
|----------|------|
| [OpenAI プラットフォーム](/ja/integrations/cloud/openai-platform) |組織管理者 API キー |
| [Anthropic コンソール](/ja/integrations/cloud/anthropic-console) |管理者 API キー (+ オプションのワークスペース/コンプライアンス キー) |
| [Azure AI Foundry](/ja/integrations/cloud/azure-ai-foundry) | Entra サービス プリンシパル (テナント/クライアント/シークレット) |
| [Google Vertex AI](/ja/integrations/cloud/gcp-vertex-ai) |サービスアカウント JSON |

## 関連

- [Cloud Sensors](/ja/discovery/cloud-sensors) — 検出されたエージェント/モデルのインベントリ。
- [NHI Inventory](/ja/discovery/nhi-inventory) — 検出された ID インベントリと取り消しコントロール。
- [AI ディスカバリーとインベントリーの概要](/ja/discovery/overview)