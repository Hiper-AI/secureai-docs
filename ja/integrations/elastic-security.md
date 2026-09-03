---
id: elastic-security
title: "柔軟なセキュリティの統合"
sidebar_label: "柔軟なセキュリティ"
description: "HiperAI と Elastic Security を統合して、高度な脅威検出とセキュリティ分析を実現"
---
# SecureAI と Elastic SIEM の統合

このガイドでは、SecureAI を Elastic SIEM インスタンスと統合する方法について段階的に説明します。この統合により、監視、分析、アラートのためにイベント ログを SecureAI から Elasticsearch に転送できるようになります。

## ステップ 1: Elastic Cloud エンドポイントを取得する

まず、Elastic Cloud デプロイメントからエンドポイント URL を取得する必要があります。

1. Elastic Cloud アカウントにログインします。
2. ホームページから、目的の展開を見つけます。
3. Elasticsearch エンドポイント URL を見つけてコピーします。これは、後で SecureAI 構成に必要になります。

<div class="mac-window">
  ![Elastic Cloud エンドポイント](/img/elastic%20images/Elastic%20-%201.png)
</div>

## ステップ 2: Elasticsearch で API キーを作成する

SecureAI がデータを Elasticsearch クラスターに安全に送信するには API キーが必要です。

1. Kibana ダッシュボードで、**管理** > **API キー** に移動します。
2. [**API キーの作成**] ボタンをクリックします。

<div class="mac-window">
  ![APIキー作成ボタン](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. 次の詳細を使用して API キーを構成します。

<div class="mac-window">
  ![API キーの設定](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **名前**: `secureai-siem-integration` (または別のわかりやすい名前)。
   - **ロール**: インデックスへの書き込みに必要な権限を持つロールを割り当てます。このガイドではわかりやすくするために、有効期限や特定のロール制限を設定していません。
4. [**API キーの作成**] をクリックします。

<div class="mac-window">
  ![API キーの作成をクリック](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. キーが生成され、表示されます。 Base64 でエンコードされた API キーをコピーし、安全な場所に保存します。この画面を終了すると、再度表示することはできません。

<div class="mac-window">
  ![API キーが生成されました](/img/elastic%20images/Elastic%20-%205.png)
</div>

## ステップ 3: Elasticsearch でターゲット インデックスを作成する

SecureAI イベントが保存される Elasticsearch でインデックスを作成してマッピングする必要があります。

1. Kibana で、**開発者ツール** に移動します。
2. コンソールで次のコマンドを実行して、適切なフィールド マッピングを使用して `secureai-events` インデックスを作成します。

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![開発者ツールでインデックスを作成](/img/elastic%20images/Elastic%20-%206.png)
</div>

## ステップ 4: SecureAI で Elastic SIEM 統合を構成する

ここで、SecureAI 統合パネルに Elastic の詳細を入力します。

1. SecureAI ダッシュボードで、**統合** に移動します。
2. **Elastic SIEM** 統合カードを見つけて、**構成** をクリックします。
3. 次のように構成フィールドに入力します。
   - **統合名**: `secureai-app-elastic`
   - **エラスティック URL**: ステップ 1 でコピーしたエンドポイントを貼り付けます。
   - **Elastic API Key**: ステップ 2 で作成した Base64 エンコードされた API キーを貼り付けます。
   - **弾性指数**: `secureai-events`
   - **イベント カテゴリの選択**: すべてのボックスをオンにして、利用可能なすべてのイベント タイプを Elastic SIEM に転送します。
4. [**更新**] をクリックして構成を保存します。

<div class="mac-window">
  ![更新をクリックして設定を保存](/img/elastic%20images/Elastic%20-%207.png)
</div>

## ステップ 5: 接続のテストと検証

構成を保存した後、接続をテストして、SecureAI が Elastic インスタンスと通信できることを確認します。

1. 統合設定モーダルで、**接続のテスト** ボタンをクリックします。
2. 「テスト成功! 接続が確認されました。」という成功メッセージが表示されます。

<div class="mac-window">
  ![テスト成功メッセージ](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. テスト データが受信されたことを確認するには、Kibana の **Discover** に移動します。
4. `secureai-events` データ ビュー (インデックス パターン) を選択します。
5. SecureAI からのテスト イベント ログが表示され、統合が正しく機能していることが確認されます。

<div class="mac-window">
  ![テストイベントログの確認](/img/elastic%20images/Elastic%20-%209.png)
</div>

SecureAI と Elastic SIEM の統合がアクティブになりました。イベントは発生時に `secureai-events` インデックスに記録されます。

## 完了しました!

これらの手順により、Elastic インスタンスは SecureAI と統合するように完全に構​​成されます 😎。