---
sidebar_position: 7
title: "透過的プロキシ (AI ルーティング)"
sidebar_label: "透過的プロキシ"
description: "開発者 AI トラフィック (例: Claude Code) をエンドポイントから SecureAI ゲートウェイ経由でルーティングします。"
---
# 透過プロキシ (AI ルーティング)

エージェントは、開発者の AI トラフィック ([Claude Code](/ja/en/integrations/ide-claude-code) など) を SecureAI ゲートウェイ経由で透過的にルーティングできます。これにより、開発者がツールを変更することなく、他の AI 資産と同じガバナンス、コスト追跡、ポリシーの下でコーディング アシスタントを使用できるようになります。

## 仕組み

ルーティングは、`claudeCodeRouting` 経由で [ポリシー](/ja/en/agent/policies-and-groups) ごとに構成されます。

|設定 |説明 |
|----------|---------------|
| **有効** |このポリシーに基づいてデバイスのルーティングをオンにします。 |
| **ロック** | `user` (開発者は切り替えることができます)、`force_on` (常にルーティングされます)、または `force_off` (ルーティングされません)。 |
| **モデル マッピング** |実際に提供されるモデルへの `opus` / `sonnet` / `haiku` のファミリごとのマッピング。 |
| **モデルロック** | `user` または `force` — 開発者がマッピングを変更できるかどうか。 |

ルーティングが有効な場合、SecureAI は **デバイスごとの API キー**を作成し、それを透過プロキシ構成を介してエンドポイントの環境 (`ANTHROPIC_AUTH_TOKEN` など) に挿入します。使用量は **リンクされた開発者のポイント バケット**に請求されるため、デバイスが所有者ユーザーにリンクされていることを確認してください ([登録とパッケージ](/ja/en/agent/enrollment-and-packages) を参照)。

## フリート全体のデフォルト

ゲートウェイのデフォルトは、フリート (`anthropicBaseUrl`、`openaiBaseUrl`、認証トークン、ロック) に対して 1 回設定でき、デバイスに継承されます。エージェントはプロキシが現在オンかオフかを報告し、それらの遷移が監査されます。

## ブロックではなくルートを選択する理由

認可された開発者 AI の場合、通常、[egress block](/ja/en/agent/egress-enforcement) よりもゲートウェイを経由するルーティングが推奨されます。開発者は作業を続けながら、ポリシーの適用、コストの帰属、そのトラフィックの監査を取得できます。承認されていないプロバイダーのブロック/ロックダウンを予約します。

## 関連

- [出力強制](/ja/ja/agent/egress-enforcement)
- [ポリシーとグループ](/ja/ja/agent/policies-and-groups)
- [AIゲートウェイ概要](/ja/ja/ai-gateway/overview)
- [クロードコードIDE統合](/ja/ja/integrations/ide-claude-code)