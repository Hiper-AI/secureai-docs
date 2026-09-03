---
sidebar_position: 2
title: "シスコのアンブレラ"
sidebar_label: "シスコのアンブレラ"
description: "Reporting API v2 を介して Cisco Umbrella DNS アクティビティからシャドウ AI を検出"
---
#シスコアンブレラ

Cisco Umbrella に接続すると、SecureAI は、Umbrella の **Reporting API v2** を使用して、LLM/AI ドメインを解決している企業ソースを検出できます。 Umbrella は DNS 層ソースです。これにより、デバイスが AI ドメイン (完全な TLS ペイロードではない) を *解決* したことが確認されます。これはまさにシャドウ AI 検出に必要なものです。

SecureAI は、カバレッジを最大化するために 2 つのパスを実行します。

1. 既知の LLM/AI ドメインの厳選されたリスト。
2. Umbrella の **コンテンツ カテゴリ `212` (「生成 AI」)** なので、新しく人気のある AI サービスは、厳選されたリストに含まれる前から検出されます。

## 前提条件

- **レポート API** と DNS アクティビティ ログを含む Umbrella パッケージ。
- **Umbrella API 認証情報** (API キー + シークレット) と **組織 ID**。

## 認証情報

|フィールド |必須 |説明 |
|----------|----------|---------------|
| `apiKey` |はい | Umbrella レポート API キー。 |
| `apiSecret` |はい | Umbrella Reporting API シークレット。保存時は暗号化されます。 |
| `orgId` |はい |アンブレラ組織 ID。 |

### どこで入手できますか

1. [Umbrella ダッシュボード](https://dashboard.umbrella.com/) にサインインします。
2. **[管理] → [API キー]** に移動し、**レポート** スコープのキーを作成します。キーとシークレットをコピーします（一度だけ表示されます）。
3. **組織 ID** は、ダッシュボード URL (`.../o/<orgId>/#/...`) 内の数値 ID です。

SecureAI は `POST https://api.umbrella.com/auth/v2/token` (基本 `apiKey:apiSecret`、`client_credentials`) で認証し、`GET /reports/v2/activity/dns` を読み取ります。

## 接続する

1. **「管理」→「統合」→「ネットワーク」→「Cisco Umbrella」→「接続」**
2. API キー、シークレット、および組織 ID を入力します。
3. **テスト**し、**保存**します。
4. **同期** — 最初の同期では、バックグラウンドで最近の DNS アクティビティがバックフィルされます。

## 注意事項

- アンブレラは **DNS レイヤー**: 一致は、完了した API 呼び出しではなく、ドメイン解決を確認します。これは幅広さ（Umbrella の背後にあるすべてのデバイス）にとって理想的ですが、要求ペイロードを伝送しません。
- Umbrella の出力がプロキシを経由する必要がある場合は、SecureAI バックエンドで `UMBRELLA_PROXY_URL` (または標準の `HTTPS_PROXY`) を設定します。

## 確認する

最初の同期後、[ネットワーク ソース](/ja/ja/discovery/network-sources) を開きます。AI ドメインを解決したソースが、プロバイダー、コール数、重大度とともに表示されます。

## 関連

- [CASB とネットワークの概要](/ja/ja/integrations/casb/overview)
- [ネットワークソース](/ja/ja/discovery/network-sources)