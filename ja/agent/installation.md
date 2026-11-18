---
sidebar_position: 2
title: "エージェントのインストール"
sidebar_label: "インストール"
description: "Windows エンドポイントに SecureAI OS エージェントをインストールする"
---
# エージェントのインストール

SecureAI OS エージェントは、**[管理] → [エージェント レジストリ] → [OS エージェント]** で構築した **インストーラー パッケージ**からインストールされます。このパッケージは、**バックエンド URL** とスコープ付き **登録キー**という 2 つの値を含む、すぐに実行できるコマンドを生成します。完全なパッケージ ビルダーと登録の仕組みについては、[登録とインストーラー パッケージ](/ja/agent/enrollment-and-packages) を参照してください。

## Windows (MSI)

Windows は **コード署名された MSI** を使用します。 MSI はダウンロード時に変更されないため、その Authenticode 署名は有効なままになります。構成は、ファイルに組み込まれるのではなく、インストール時に `msiexec` コマンド ラインで渡されます。

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

|プロパティ |説明 |
|----------|---------------|
| `BACKEND_URL` | SecureAI バックエンドの起点 (エンドポイントはここをホームとします)。 |
| `ENROLL_KEY` |インストーラー パッケージのスコープ付き `agent:enroll` キー。 |

インストーラー パネルには、値が事前に入力された正確なコマンドが表示されます。これを直接コピーします。

<Tip>
**大規模な導入**

既存の MDM/RMM (Intune、GPO、SCCM など) を介して同じ `msiexec` コマンドをプッシュします。 URL とキーはコマンド ライン プロパティであるため、1 つの署名付き MSI がすべてのテナントとグループに対して機能します。
</Tip>

## macOS（近日公開）

現在、エージェントは Windows にのみインストールできます。macOS 版は開発中でまだインストーラーがないため、パッケージ ビルダーで選択できるのは Windows だけです。

## 最初の実行時に何が起こるか

最初の起動時にエージェントは**登録**します。エージェントは登録キーを提示し、デバイスを登録し、デバイスごとのトークンとその実行時設定を受け取ります。次に、ハートビートを開始し、解決された [ポリシー](/ja/agent/policies-and-groups) を適用します。バックエンド URL の解決方法やデバイス トークンのローテーション方法などの詳細については、[登録とインストーラー パッケージ](/ja/agent/enrollment-and-packages) を参照してください。

## 関連

- [登録およびインストーラーパッケージ](/ja/agent/enrollment-and-packages)
- [ポリシーとグループ](/ja/agent/policies-and-groups)
- [エンドポイントエージェント概要](/ja/agent/overview)