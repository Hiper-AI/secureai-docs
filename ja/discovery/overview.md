---
sidebar_position: 1
title: "AI の検出とインベントリの概要"
sidebar_label: "概要"
description: "SecureAI が組織全体のすべての AI エージェント、モデル、アイデンティティ、シャドウ AI ソースを検出してインベントリを作成する方法"
---
# AI の検出とインベントリ

SecureAI は、組織内の AI (実行するエージェントとモデル、その背後にあるアイデンティティ、および知らなかったシャドウ AI) の継続的に更新される単一のインベントリを構築します。これは、**管理 → エージェント レジストリ** の下に表示される **3 つの相補的な検出シグナル**から行われます。

## 3 つの信号

|信号 |見る |提供元 |
|----------|------|----------|
| **クラウド API** | AI プラットフォーム内のエージェント、モデル、デプロイメント、およびアイデンティティ。 | [クラウド AI プロバイダー](/ja/integrations/cloud/overview) コネクタ → [クラウドセンサー](/ja/discovery/cloud-sensors) |
| **ネットワーク / CASB** |エージェントがインストールされていない、LLM API を呼び出す企業ソース IP。 | [CASB / SWG](/ja/integrations/casb/overview) コネクタ → [ネットワーク ソース](/ja/discovery/network-sources) |
| **エンドポイント エージェント** |管理されたラップトップおよびサーバー上の AI/MCP アクティビティ。 | [OSエージェント](/ja/agent/overview) |

すべてのシグナルで検出された ID は [NHI インベントリ](/ja/discovery/nhi-inventory) にロールアップされ、管理する論理エージェント/チャットボットは [エージェント レジストリ](/ja/discovery/agent-registry) に存在します。

## インベントリタブ

**[管理者] → [エージェント レジストリ]** の下に次のものが表示されます。

- **[クラウド センサー](/ja/discovery/cloud-sensors)** — クラウドで検出されたエージェントとモデル。
- **[ネットワーク ソース](/ja/discovery/network-sources)** — CASB/SWG ログで見つかったシャドウ AI ソース。
- **[NHI Inventory](/ja/discovery/nhi-inventory)** — ブロック/取り消し制御を備えた人間以外の ID (キー、サービス アカウント)。
- **[エージェント レジストリ](/ja/discovery/agent-registry)** — 論理 AI エージェントとチャットボットのガバナンス メタデータ。

## なぜそれが重要なのか

目に見えないものを統治することはできません。 Discovery は、すべてのモデル エンドポイント、すべてのキー、AI に関わるすべてのデバイスやワークロードなどの分母を提供します。そのため、ポリシー、コスト管理、インシデント対応は、宣言された部分だけでなく、資産「全体」に適用されます。

## 関連

- [クラウド AI プロバイダー](/ja/integrations/cloud/overview)
- [CASB とネットワーク (SWG)](/ja/integrations/casb/overview)
- [エンドポイントエージェント](/ja/agent/overview)