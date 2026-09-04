---
sidebar_position: 4
title: "不可变日志"
---
# 不可变日志 — 加密审计链

SecureAI 在三层不可变链中记录**每个人工智能交互和每个管理操作**。这种架构确保对记录的任何修改、删除或操作都是可检测的——即使有人可以直接访问数据库。

## 为什么这很重要？

仅存在于 MongoDB 中的日志并不是真正不可变的：任何有权访问服务器的人都可以删除它而不留下任何痕迹。 SecureAI 通过将每个日志固定到 **Sigstore Rekor** 来解决这个问题，这是一个由开源安全基金会 (OpenSSF) 运营的公共透明日志 — 软件行业使用同一系统来验证关键软件包的监管链。

> **技术保证：** 一旦 Merkle 区块哈希位于 Rekor 中，任何人（包括 SecureAI 运营商）都无法追溯更改该记录。任何第三方审核员都可以通过一次curl调用独立验证它。

---

##三层证明

每个交互包都具有三个级别的加密证据：

### 第 1 层 — MongoDB 注册表 (L1)

交互的主要记录存储在 MongoDB 中：

|领域 |描述 |
|--------|-------------|
| `current_hash` |此条目有效负载的 SHA-256 + `prev_hash` 上一个 |
| `prev_hash` |前一个条目的哈希值 — 形成 **哈希链** |
| `bundle_id` |交互包唯一标识|
| `receipt_signature` |如果AI提供商返回了隐私标头的签名确认|

字符串 `prev_hash → current_hash → next_current_hash` 导致**删除任何行来破坏字符串** - 通过遍历序列可以检测到差异。

### 第 2 层 — Merkle 树 (L2)

每 10 个日志条目被分组到一个 **Merkle 块**：

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

`merkle_root` 是代表 10 个条目的根哈希。如果任何条目被更改，`merkle_root` 就会更改 — 使包含测试无效。

| L2 场 |描述 |
|----------|-------------|
| `block_id` | Merkle 区块 ID |
| `merkle_root` |树根哈希 |
| `leaf_hash` |树中此特定条目的哈希值 |
| `leaf_index` |块内的位置 (0–9) |
| `verified` | `true` 如果 `leaf_hash` 提交到 `merkle_root` |

### 第 3 层 — Rekor 锚点 (L3)

每个密封块的 `merkle_root` 被发送到 **[Sigstore Rekor](https://rekor.sigstore.dev/)**，一个公共的仅附加日志。 Rekor 返回：

| L3 场 |描述 |
|----------|-------------|
| `log_index` | Rekor 日志中的全局序列号 — 唯一且单调递增 |
| `uuid` | Rekor | 中的条目标识符
| `integrated_time` | Rekor 签署包含测试的时间戳 |
| `rekor_url` |指向 Rekor 中原始 JSON 条目的直接 URL |

一旦 `log_index` 存在于 Rekor 中，**没有人可以删除它** — Rekor 日志在设计上是公共的、分布式的且不可变的。

---

## 透明度门户（管理员）

### 访问

**管理员 → AI Gateway → 透明度门户**

### 验证捆绑包

1. 在搜索字段中输入或粘贴 `bundle_id`。
2. 单击**“验证证明”**。
3. 您将看到带有状态徽章的三层：
   - ✅ **绿色** = 验证成功
   - ⚠️ **黄色** = 密封/锚定待定（不到 2 分钟前的交互正常）
   - ❌ **红色** = 验证失败（警告信号）

### 复制公开验证链接

当结果可见时，会出现一个带有 **“复制公共验证 URL”** 按钮的栏。该链接是公开的——您可以将其发送给外部审计员，无需登录。

---

##公开验证页面

任何拥有 `bundle_id` 的人都可以验证测试，而无需访问 SecureAI：

```
https://tu-dominio.com/verify/<bundle_id>
```

该页面显示了三层、用于下载测试 JSON 的按钮以及用于本地验证的命令。

**此页面不公开：**
- 消息内容或人工智能的响应
- 用户数据（姓名、电子邮件、IP）
- 任何个人身份信息

它仅显示哈希值、时间戳、索引和验证状态。

---

## 使用curl进行独立验证

外部审核员可以在不信任 Web 界面的情况下验证任何捆绑包：

### 第 1 步 — 进行测试

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### 步骤 2 — 确认 Merkle 层中的哈希值

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### 步骤 3 — 确认 Rekor 中的锚点

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

非空的 `signedEntryTimestamp` 字段确认 Rekor 已接受并签署了该条目。该时间戳无法追溯更改。

---

## 签名导出包（审核员和用户）

除了 `bundle_id` 的公共验证器之外，SecureAI 还允许您以便携式 ZIP 格式导出加密证据以进行离线审计。

### ZIP 包含什么？

当管理员在日志或 SMLTP 中使用 **导出签名包** 时，将下载一个文件：

- `data.csv`：导出的数据。
- `manifest.json`：加密元数据（`rowCount`、`merkleRootOfExport`、`signingKeyFingerprint`、时间戳等）。
- `manifest.sig`：`manifest.json` 的签名 Ed25519。
- `verify.js`：没有依赖项的离线验证器。
- `README.txt`：快速说明。

### 如何验证（离线）

1. 解压 ZIP。
2. 在该文件夹中打开终端。
3. 运行：

```bash
node verify.js
```

完整包的预期输出：

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### 这个验证器检测什么？

- 编辑`data.csv`中的任何字段。
- 删除或添加`data.csv`中的行。
- 修改`manifest.json`。
- 使用不正确的签名密钥。

如果任何检查显示为 `FAIL`，则该导出**不应被视为可信**。

### 审计快速测试

演示篡改检测：

1. 在新导出的 ZIP 上运行 `node verify.js`（它应该给出所有 `PASS`）。
2. 编辑`data.csv`中的任意字符并保存。
3. 再次运行`node verify.js`。
4. 必须至少失败 `Merkle root of export`。

这证实了导出数据集的端到端完整性的证据。

---

## 状态解释

| L1 状态 |意义|
|------------|-------------|
| ✅ 报名礼物 | MongoDB 中与有效哈希链的交互 |

| L2 状态 |意义|
|------------|-------------|
| ✅ Merkle 验证 |该条目的哈希是 Merkle 树的一部分并且验证正确 |
| ⚠️ 待处理块 |还没有 10 个条目形成一个块（前几分钟正常） |
| ❌ 验证失败 |哈希与 merkle_root 不匹配 — 可能被操纵 |

|状态 L3 |意义|
|------------|-------------|
| ✅ 锚定于 Rekor | merkle_root 位于 Rekor 公共日志中，带有签名时间戳 |
| ⏳ 锚定待定 |该块已被密封，但尚未发送到Rekor（可能最多需要 30 秒）|

---

## 消息的完整流程

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

## 供应商合规性

**“提供商合规性”**徽章指示 AI 提供商（OpenAI、Anthropic 等）是否确认收到 SMLTP 隐私标头：

|徽章|意义|
|--------|-------------|
| ✅ 已验证/认证 |供应商通过签署的确认书确认收货 |
| 🛡️ 网关受保护 |隐私标头已发送，但提供商未明确确认。您的数据受网关保护。 |
| ⚠️ 提供商未经验证 |供应商未确认收货。传输的数据受 SMLTP 保护，但不能保证提供商会遵守非培训说明。 |

---

## 常见问题

**我可以在没有互联网的情况下验证捆绑包吗？**
是的，当您在线时，通过“下载 JSON”按钮下载测试 JSON。 `merkle_root` 和哈希值可以通过重新计算树来离线验证。

**如果 L3 待决会发生什么？**
这对于最近的交互（少于 1 分钟）来说是正常的。 Rekor 的 sidecar 每约 30 秒处理一次块。如果 5 分钟后仍处于待处理状态，请验证 sidecar `rekor-anchor` 是否正在运行。

**记录保存多长时间？**
默认情况下，日志根据配置的`retentionPeriod`保留。标记为合规性的记录（`phi`、`pii`、`security`、`authorization`）永远不会自动删除。

**我可以与客户分享验证链接吗？**
是的。 URL `/verify/<bundle_id>` 不需要登录，也不会暴露敏感数据。与审计师、监管机构或客户分享是安全的。