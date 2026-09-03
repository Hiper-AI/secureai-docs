---
sidebar_position: 1
title: "MCP コネクタの概要"
sidebar_label: "概要"
description: "Model Context Protocol (MCP) サーバーに接続して、SecureAI のアシスタントにツールへの管理されたアクセスを提供します"
---
# MCP コネクタ

SecureAI は **Model Context Protocol (MCP)** サーバーに接続できるため、アシスタントはガバナンスの下で外部ツール (データベースのクエリ、チケットの読み取り、クラウド操作の実行) を呼び出すことができます。コネクタは組み込みのマーケットプレイスから選択され、ユーザーごとに構成されます。すべてのツール呼び出しは引き続き SecureAI のポリシー層と安全層を通過します。

コネクタは **Admin → Integrations → MCP** (API ベース `/api/connectors`) で管理されます。

## トランスポートと認証のパターン

各コネクタは、SecureAI が接続する方法と認証方法を宣言します。次の 3 つのパターンがサポートされています。

|パターン |輸送 |認証 |例 |
|----------|-----------|------|----------|
|ローカルプロセス | `stdio` | API キー (環境内) | Notion、Cloudflare (ローカル ビン)、Azure (`npx @azure/mcp`)、AWS (`uvx awslabs.aws-api-mcp-server`)、リファレンス サーバー (Sequential Thinking、Web Fetch、Time)。 |
|リモート (トークン) | `streamable_http` | API キー / ベアラー (環境内) | GitHub 公式 MCP、Google Cloud ファミリー (BigQuery、Compute、Logging、Vertex AI、Cloud Run、GKE など)、Microsoft Learn。 |
|リモート (OAuth) | `streamable_http` | OAuth 2.1 + PKCE、動的クライアント登録 | Cloudflare (公式リモート MCP)。 [OAuth および DCR を使用したリモート MCP](/ja/en/integrations/mcp/remote-oauth-dcr) を参照してください。 |

一部のトークンベースのリモート コネクタ (Google Cloud ファミリなど) も OAuth フローを実行するため、ユーザーは静的トークンを貼り付けるのではなく、ポップアップ経由で独自の Google OAuth クライアントを使用して認証できます。

## コネクタの接続

1. **管理 → 統合 → MCP。**
2. マーケットプレイスからコネクタを選択します。
3. 必要な構成 (API キー/トークン) を指定するか、OAuth コネクタの OAuth ポップアップ経由で認証します。
4. 保存します。コネクタはアシスタントのツール ルーターで使用できるようになります。

## 工具の安全性

すべてのコネクタは、**ブロックされたツール パターン**、つまり MCP サーバーが公開しても SecureAI が呼び出すことを拒否する破壊的な操作 (`delete`、`destroy`、`terminate` など) を宣言します。このガードレールは一元的に適用されるため、接続されたツール サーバーにアシスタントを通じて破壊的なアクションを強制することはできません。

## 関連

- [OAuth および DCR を使用したリモート MCP](/ja/ja/integrations/mcp/remote-oauth-dcr)
- [AI ゲートウェイ — リモート エンドポイント](/ja/ja/ai-gateway/remote-endpoints)