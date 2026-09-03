---
sidebar_position: 4
title: "不変ログ"
---
# 不変ログ — 暗号化監査チェーン

SecureAI は、**すべての AI 対話とすべての管理アクション**を 3 層の不変チェーンに記録します。このアーキテクチャにより、誰かがデータベースに直接アクセスした場合でも、レコードの変更、削除、操作が確実に検出可能になります。

## なぜそれが重要なのでしょうか?

MongoDB にのみ存在するログは、真に不変ではありません。サーバーにアクセスできる人なら誰でも、痕跡を残さずに削除できます。 SecureAI は、Open Source Security Foundation (OpenSSF) が運営する公開透明性ログである **Sigstore Rekor** に各ログを固定することでこの問題を解決します。これは、ソフトウェア業界が重要なパッケージの保管過程を検証するために使用しているのと同じシステムです。

> **技術的保証:** マークル ブロック ハッシュが Rekor に保存されると、SecureAI オペレーターを含む誰もそのレコードを遡って変更することはできません。サードパーティの監査人は、単一のcurl呼び出しで独立して検証できます。

---

##3 つの証拠

各インタラクション バンドルには、次の 3 つのレベルの暗号証拠があります。

### レイヤ 1 — MongoDB レジストリ (L1)

インタラクションの主な記録は、次のものとともに MongoDB に保存されます。

|フィールド |説明 |
|------|-----------|
| `current_hash` |このエントリのペイロードの SHA-256 + `prev_hash` 前 |
| `prev_hash` |直前のエントリのハッシュ — **ハッシュ チェーン** を形成します。
| `bundle_id` |インタラクション パッケージの一意の識別子 |
| `receipt_signature` | AI プロバイダーがプライバシー ヘッダーの署名済み確認応答を返した場合 |

文字列 `prev_hash → current_hash → next_current_hash` を使用すると、**行を削除すると文字列が分割されます**。シーケンスをトラバースすることで不一致を検出できます。

### レイヤー 2 — マークル ツリー (L2)

10 個のログ エントリごとに **Merkle ブロック** にグループ化されます。

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

`merkle_root` は、10 個のエントリを表すルート ハッシュです。いずれかのエントリが変更されると、`merkle_root` が変更され、包含テストが無効になります。

|フィールド L2 |説明 |
|----------|---------------|
| `block_id` |マークルブロックID |
| `merkle_root` |ツリールートハッシュ |
| `leaf_hash` |ツリー内のこの特定のエントリのハッシュ |
| `leaf_index` |ブロック内の位置 (0 ～ 9) |
| `verified` | `leaf_hash` が `merkle_root` でコミットされた場合 `true` |

### レイヤー 3 — Rekor アンカー (L3)

封印された各ブロックの `merkle_root` は、追加専用の公開ログである **[Sigstore Rekor](https://rekor.sigstore.dev/)** に送信されます。 Rekor は次のように返します。

|フィールド L3 |説明 |
|----------|---------------|
| `log_index` | Rekor ログ内のグローバル シーケンス番号 — 一意で単調増加 |
| `uuid` | Rekor | のエントリ識別子
| `integrated_time` | Rekor が包含テストに署名したタイムスタンプ |
| `rekor_url` | Rekor の生の JSON を入力するための直接 URL |

`log_index` が Rekor に存在すると、**誰も削除できません**。Rekor ログは公開され、分散され、設計上不変です。

---

## 透明性ポータル (管理者)

### アクセス

**管理者 → AI ゲートウェイ → 透明性ポータル**

### バンドルを確認する

1. 検索フィールドに `bundle_id` を入力または貼り付けます。
2. **「校正確認」** をクリックします。
3. ステータス バッジが付いた 3 つのレイヤーが表示されます。
   - ✅ **緑色** = 正常に検証されました
   - ⚠️ **黄色** = 封印/アンカー保留中 (2 分以内のインタラクションでは通常)
   - ❌ **赤** = 検証失敗 (警告信号)

### 公開検証リンクをコピーします

結果が表示されると、**「公開検証 URL をコピー」** ボタンのあるバーが表示されます。このリンクは公開されており、ログインを必要とせずに外部監査人に送信できます。

---

##公開検証ページ

`bundle_id` を持っている人は誰でも、SecureAI にアクセスせずにテストを検証できます。

```
https://tu-dominio.com/verify/<bundle_id>
```

このページには、3 つのレイヤー、テスト JSON をダウンロードするボタン、ローカルで検証するコマンドが表示されます。

**このページでは次のものは公開されません**
- メッセージの内容とAIの応答
- ユーザーデータ (名前、電子メール、IP)
- 個人を特定できる情報

ハッシュ、タイムスタンプ、インデックス、検証ステータスのみが表示されます。

---

##カールによる独立した検証

外部監査人は、Web インターフェイスを信頼せずにバンドルを検証できます。

### ステップ 1 — テストを受ける

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### ステップ 2 — マークル層のハッシュを確認する

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### ステップ 3 — Rekor でアンカーを確認する

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

`signedEntryTimestamp` フィールドが空でない場合は、Rekor がエントリを受け入れ、署名したことを確認します。そのタイムスタンプを遡って変更することはできません。

---

## 署名付きエクスポート バンドル (監査者とユーザー)

`bundle_id` による公開検証機能に加えて、SecureAI を使用すると、オフライン監査用に暗号化証拠をポータブル ZIP 形式でエクスポートできます。

### ZIP には何が含まれていますか?

管理者がログまたは SMLTP で **署名済みバンドルのエクスポート** を使用すると、次のファイルがダウンロードされます。

- `data.csv`: エクスポートされたデータ。
- `manifest.json`: 暗号化メタデータ (`rowCount`、`merkleRootOfExport`、`signingKeyFingerprint`、タイムスタンプなど)。
- `manifest.sig`: `manifest.json` の署名 Ed25519。
- `verify.js`: 依存関係のないオフライン検証ツール。
- `README.txt`: 簡単な説明。

### 確認方法（オフライン）

1. ZIP を解凍します。
2. そのフォルダー内のターミナルを開きます。
3. 以下を実行します。

```bash
node verify.js
```

無傷のバンドルで期待される出力:

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### この検証ツールは何を検出しますか?

- `data.csv` 内の任意のフィールドを編集します。
- `data.csv` 内の行の削除または追加。
- `manifest.json`の修正。
- 間違った署名キーの使用。

いずれかのチェックが `FAIL` と表示される場合、そのエクスポートは **信頼できるものとみなされません**。

### 監査のための簡単なテスト

改ざん検出をデモンストレーションするには:

1. 新しくエクスポートされた ZIP に対して `node verify.js` を実行します (すべて `PASS` が返されるはずです)。
2. `data.csv` 内の任意の文字を編集して保存します。
3. `node verify.js` を再度実行します。
4. 少なくとも `Merkle root of export` に失敗する必要があります。

これにより、エクスポートされたデータセットのエンドツーエンドの整合性の証拠が確認されます。

---

## 状態の解釈

| L1 状態 |意味 |
|----------|---------------|
| ✅ 登録プレゼント |インタラクションは有効なハッシュ チェーンを持つ MongoDB 内で行われます。

| L2 状態 |意味 |
|----------|---------------|
| ✅ マークル認証済 |このエントリのハッシュはマークル ツリーの一部であり、検証は正しいです。
| ⚠️保留中のブロック |ブロックを形成するエントリがまだ 10 個ありません (最初の数分間は正常です)。
| ❌ 検証に失敗しました |ハッシュが merkle_root と一致しません — 操作の可能性 |

|状態 L3 |意味 |
|----------|---------------|
| ✅ Rekor に固定 | merkle_root は、署名付きタイムスタンプ付きで Rekor パブリック ログにあります。
| ⏳ アンカー保留中 |ブロックは封印されていますが、まだ Rekor に送信されていません (最大 30 秒かかる場合があります) |

---

## メッセージの完全なフロー

```
Usuario envía mensaje
        ↓
  SMLTP Gateway (Rust)
  - Registra en MongoDB (SMLTPLog)
  - Computa current_hash = sha256(prev_hash + payload)
  - Escribe en smltp_events.jsonl
        ↓
  Sealer de Merkle (cada 60s)
  - Acumula 10 entradas
  - Calcula merkle_root
  - Crea MerkleBlock en MongoDB
        ↓
  Rekor Anchor Sidecar (cada ~30s)
  - Lee BLOCK_SEALED del log
  - Firma con clave Ed25519
  - Envía a rekor.sigstore.dev
  - Guarda rekor_uuid en MongoDB
        ↓
Prueba completa disponible en /verify/<bundle_id>
```

---

## サプライヤーのコンプライアンス

**「プロバイダー コンプライアンス」** バッジは、AI プロバイダー (OpenAI、Anthropic など) が SMLTP プライバシー ヘッダーの受信を確認したかどうかを示します。

|バッジ |意味 |
|------|-----------|
| ✅ 検証済み/認定済み |サプライヤーは署名入りの確認書で受領を確認しました。
| 🛡️ ゲートウェイが保護されています |プライバシー ヘッダーは送信されましたが、プロバイダーによって明示的に確認されていませんでした。データはゲートウェイによって保護されます。 |
| ⚠️プロバイダーが未確認 |サプライヤーは受領を確認していません。データは SMLTP によって保護されて転送されますが、プロバイダーがトレーニングなしの指示を遵守するという保証はありません。 |

---

## よくある質問

**インターネットなしでバンドルを確認できますか?**
はい、オンライン中に [JSON をダウンロード] ボタンからテスト JSON をダウンロードします。 `merkle_root` とハッシュは、ツリーを再計算することでオフラインで検証できます。

**L3 が保留中の場合はどうなりますか?**
これは、最近のインタラクション (1 分未満) では正常です。 Rekor のサイドカーは、約 30 秒ごとにブロックを処理します。 5 分経っても保留中の場合は、サイドカー `rekor-anchor` が実行されていることを確認してください。

**記録はどのくらいの期間保存されますか?**
デフォルトでは、ログは構成された `retentionPeriod` に基づいて保存されます。準拠としてマークされたレコード (`phi`、`pii`、`security`、`authorization`) は自動的に削除されません。

**確認リンクを顧客と共有できますか?**
はい。 URL `/verify/<bundle_id>` はログインを必要とせず、機密データを公開しません。監査人、規制当局、または顧客と安全に共有できます。