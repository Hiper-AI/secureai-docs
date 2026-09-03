---
id: splunk-security
title: "Splunk セキュリティの統合"
sidebar_label: "Splunk セキュリティ"
description: "統合ガイド: HTTP Event Collector (HEC) を介した Splunk SIEM と HiperAI の接続"
---
# Splunk セキュリティの統合

統合ガイド: Splunk SIEM と HiperAI の接続

このガイドでは、HTTP Event Collector (HEC) 経由で HiperAI からセキュリティ ログを受信するように Splunk を構成するために必要な手順について説明します。

## ステップ 1: 新しいインデックスを作成する

まず、アプリケーションのログを保存する専用のスペースを作成します。

### A. Splunk ホーム画面から、[設定] > [インデックス] に移動します。

<div class="mac-window">
  ![Splunk 設定インデックス](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. 右上隅にある [新しいインデックス] ボタンをクリックします。

### C. インデックスを構成します。

- **インデックス名**: `secureai_events`
- 他のすべてのオプションは、標準構成のデフォルト値のままにします。
- [**保存**] をクリックします。

<div class="mac-window">
  ![Splunk インデックス設定](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

新しいインデックスが作成され、データを受信できるようになりました。

## ステップ 2: HTTP イベント コレクター (HEC) を有効にする

次に、Splunk が受信データ要求をリッスンしていることを確認します。

### A. [設定] > [データ入力] に移動します。

<div class="mac-window">
  ![Splunk データ入力](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. [ローカル入力] で、[HTTP イベント コレクター] をクリックします。

<div class="mac-window">
  ![Splunk HTTP イベントコレクター](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. 右上隅にある [グローバル設定] をクリックします。

### D. 次の構成を確認します。

- **すべてのトークン**: 有効にする必要があります。
- **SSL を有効にする**: (オプション) これは運用環境に推奨されますが、初期テストでは無効にすることができます。
- **HTTP ポート番号**: ポートが 8088 であることを確認します。
- [**保存**] をクリックします。

<div class="mac-window">
  ![Splunk HEC グローバル設定](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## ステップ 3: HEC トークンを作成する

トークンは、アプリケーションが Splunk で認証するために使用する安全なアクセス キーです。

### A. HTTP イベント コレクター ページに戻ります ([設定] > [データ入力] > [HTTP イベント コレクター])。

### B. [新しいトークン] ボタンをクリックします。

<div class="mac-window">
  ![Splunk 新しいトークン ボタン](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. トークン構成 (タブ 1):

- **名前**: `token_secureai_app`
- **説明**: (オプション) 簡単な説明を追加します。
- **インデクサーの確認を有効にする**: **重要**: このチェックボックスがオフになっていることを確認してください。
- [**次へ**] をクリックします。

<div class="mac-window">
  ![Splunk トークンの設定](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. 入力設定 (タブ 2):

- **ソース タイプ**: [選択]をクリックします。検索フィールドに「`_json`」と入力し、リストから選択します。これにより、Splunk が JSON 形式のデータを期待するように指示されます。
- **許可されたインデックス**: [利用可能なインデックス] 列で、作成したインデックス (`secureai_events`) を見つけてクリックし、[選択されたインデックス] 列に移動します。
- **デフォルトのインデックス**: ドロップダウン メニューから `secureai_events` を選択します。

<div class="mac-window">
  ![Splunk入力設定](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- [**レビュー**] をクリックしてから、**送信** をクリックします。

<div class="mac-window">
  ![Splunk のレビューと送信](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. トークン値をコピーします。

Splunk はトークン値を表示します。すぐにコピーして安全な場所に保存します。これは、アプリケーションで構成する必要があるトークンです。

<div class="mac-window">
  ![Splunk トークン値](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## ステップ 4: 情報を最終決定して共有する

これでほぼ完了です。最後のステップだけです。

### A. 情報を収集する

統合を完了するには、アプリケーションには次の 3 つの情報が必要です。

1. **HEC URL**: Splunk サーバーのアドレスと HEC ポート (例: `http://splunk.yourcompany.com:8088/services/collector`)。
2. **HEC トークン**: 前の手順でコピーした値。
3. **インデックス名**: 作成したインデックスの名前 (`secureai_events`)。

<div class="mac-window">
  ![Splunk インデックス情報](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. ファイアウォール ルールを確認する

アプリケーションサーバーと Splunk サーバー間のファイアウォールが HEC ポート (通常は TCP 8088) 上のトラフィックを許可していることを確認してください。

## ステップ 4: データ形式 (ソースタイプ) に関する注意

データが正しく識別され、解析されることを保証するために、アプリケーションは特定の構造化された JSON 形式でログを送信します。

**重要**: SecureAI から送信されるすべてのイベントは、ソースタイプ `secureai:json` になります。

この値はアプリケーションによって送信されるデータ ペイロードに直接設定されるため、トークンに対して選択したデフォルトのソースタイプ (`_json`) が自動的にオーバーライドされます。これ以上のアクションは必要ありませんが、検索では、sourcetype="secureai:json" の下にデータが見つかることを知っておくことが重要です。

## ステップ 6: 統合を確認する

SecureAI アプリケーションに統合の詳細を入力すると、接続が正しく機能していることを確認できます。

### A. 接続をテストする

アプリケーション内の「接続のテスト」ボタンを使用します。これにより、テスト イベントが Splunk インデックスに送信されます。

<div class="mac-window">
  ![Splunk テスト接続](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

イベントが正しく送信された場合は成功メッセージが表示され、提供されたデータのいずれかが間違っている場合はエラー メッセージが表示されます。

### B. Splunk でテスト イベントを見つける

イベントが Splunk に到着したかどうかを確認するには、検索とレポート アプリに移動します。

検索バーで、インデックスの検索を実行します (例: `index="secureai_events"`)。

時間範囲を「過去 24 時間」に設定します。結果にテスト ログが表示されるはずです。

<div class="mac-window">
  ![Splunk の検索結果](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**注意**: ネットワーク トラフィックとシステム負荷によっては、Splunk にログが表示されるまでに最大 10 分かかる場合があります。

## 完了しました!

これらの手順により、Splunk インスタンスは SecureAI と統合するように完全に構成されます 😎。