---
sidebar_position: 4
title: "불변 로그"
---
# 불변 로그 — 암호화 감사 체인

SecureAI는 **모든 AI 상호 작용과 모든 관리 작업**을 3계층 불변 체인에 기록합니다. 이 아키텍처는 누군가가 데이터베이스에 직접 액세스할 수 있는 경우에도 기록의 수정, 삭제 또는 조작을 감지할 수 있도록 보장합니다.

## 그게 왜 중요한가요?

MongoDB에만 존재하는 로그는 실제로 불변이 아닙니다. 서버에 액세스할 수 있는 사람은 누구나 흔적을 남기지 않고 삭제할 수 있습니다. SecureAI는 오픈 소스 보안 재단(OpenSSF)에서 운영하는 공개 투명성 로그인 **Sigstore Rekor**에 각 로그를 고정하여 이 문제를 해결합니다. 이는 소프트웨어 업계에서 중요한 패키지의 관리 연속성을 확인하는 데 사용하는 것과 동일한 시스템입니다.

> **기술적 보증:** 일단 Merkle 블록 해시가 Rekor에 있으면 SecureAI 운영자를 포함한 누구도 해당 기록을 소급하여 변경할 수 없습니다. 모든 제3자 감사자는 단일 컬 호출을 통해 이를 독립적으로 확인할 수 있습니다.

---

##3단계 증명

각 상호 작용 번들에는 세 가지 수준의 암호화 증거가 있습니다.

### 레이어 1 — MongoDB 레지스트리(L1)

상호 작용의 기본 기록은 다음과 함께 MongoDB에 저장됩니다.

| 필드 | 설명 |
|-------|-------------|
| `current_hash` | 이 항목 페이로드의 SHA-256 + `prev_hash` 이전 |
| `prev_hash` | 바로 앞 항목의 해시 — **해시 체인**을 형성합니다 |
| `bundle_id` | 상호작용 패키지의 고유 식별자 |
| `receipt_signature` | AI 제공자가 개인 정보 보호 헤더에 대한 서명된 승인을 반환한 경우 |

문자열 `prev_hash → current_hash → next_current_hash`로 인해 **행을 삭제하면 문자열이 끊어집니다**. 불일치는 시퀀스를 순회하여 감지할 수 있습니다.

### 레이어 2 — 머클 트리(L2)

10개의 로그 항목마다 **머클 블록**으로 그룹화됩니다.

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

`merkle_root`은 10개 항목을 나타내는 루트 해시입니다. 항목이 변경되면 `merkle_root`이 변경되어 포함 테스트가 무효화됩니다.

| 필드 L2 | 설명 |
|----------|-------------|
| `block_id` | 머클 블록 ID |
| `merkle_root` | 트리 루트 해시 |
| `leaf_hash` | 트리 내 특정 항목의 해시 |
| `leaf_index` | 블록 내 위치(0-9) |
| `verified` | `true` `leaf_hash`가 `merkle_root`에서 커밋된 경우 |

### 레이어 3 - Rekor 앵커(L3)

봉인된 각 블록의 `merkle_root`은 공개 추가 전용 로그인 **[Sigstore Rekor](https://rekor.sigstore.dev/)**로 전송됩니다. Rekor는 다음을 반환합니다.

| 필드 L3 | 설명 |
|----------|-------------|
| `log_index` | Rekor 로그의 전역 시퀀스 번호 - 고유하고 단조롭게 증가 |
| `uuid` | Rekor의 항목 식별자 |
| `integrated_time` | Rekor가 포함 테스트에 서명한 타임스탬프 |
| `rekor_url` | Rekor의 원시 JSON 항목에 대한 직접 URL |

`log_index`이 Rekor에 존재하면 **아무도 삭제할 수 없습니다** — Rekor 로그는 공개되고 배포되며 설계상 불변입니다.

---

## 투명성 포털(관리자)

### 액세스

**관리자 → AI 게이트웨이 → 투명성 포털**

### 번들 확인

1. 검색 필드에 `bundle_id`를 입력하거나 붙여넣습니다.
2. **"증명 확인"**을 클릭하세요.
3. 상태 배지가 있는 세 개의 레이어가 표시됩니다.
   - ✅ **녹색** = 성공적으로 확인됨
   - ⚠️ **노란색** = 봉인/앵커 보류 중(2분 미만의 상호 작용은 정상)
   - ❌ **빨간색** = 확인 실패(경고 신호)

### 공개 확인 링크 복사

결과가 표시되면 **"공개확인 URL 복사"** 버튼이 있는 막대가 나타납니다. 해당 링크는 공개되어 있으므로 로그인하지 않고도 외부 감사자에게 보낼 수 있습니다.

---

##공개인증페이지

`bundle_id`이 있는 사람은 누구나 SecureAI에 액세스하지 않고도 테스트를 확인할 수 있습니다.

```
https://tu-dominio.com/verify/<bundle_id>
```

이 페이지에는 세 개의 레이어, 테스트 JSON을 다운로드하기 위한 버튼, 로컬에서 확인하기 위한 명령이 표시됩니다.

**이 페이지는 다음을 노출하지 않습니다:**
- 메시지 내용이나 AI의 응답
- 사용자 데이터(이름, 이메일, IP)
- 개인 식별 정보

해시, 타임스탬프, 인덱스 및 확인 상태만 표시됩니다.

---

## 컬을 이용한 독립적 검증

외부 감사자는 웹 인터페이스를 신뢰하지 않고도 모든 번들을 확인할 수 있습니다.

### 1단계 — 테스트 받기

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### 2단계 - Merkle 레이어의 해시 확인

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### 3단계 - Rekor에서 앵커 확인

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

비어 있지 않은 `signedEntryTimestamp` 필드는 Rekor가 항목을 수락하고 서명했음을 확인합니다. 해당 타임스탬프는 소급하여 변경할 수 없습니다.

---

## 서명된 내보내기 번들(감사자 및 사용자)

`bundle_id`에 의한 공개 검증자 외에도 SecureAI를 사용하면 오프라인 감사를 위해 휴대용 ZIP으로 암호화 증거를 내보낼 수 있습니다.

### ZIP에는 무엇이 포함되나요?

관리자가 로그 또는 SMLTP에서 **서명된 번들 내보내기**를 사용하면 다음을 통해 파일이 다운로드됩니다.

- `data.csv`: 내보낸 데이터입니다.
- `manifest.json`: 암호화 메타데이터(`rowCount`, `merkleRootOfExport`, `signingKeyFingerprint`, 타임스탬프 등).
- `manifest.sig`: `manifest.json`의 서명 Ed25519.
- `verify.js`: 종속성이 없는 오프라인 검증자입니다.
- `README.txt`: 빠른 지침.

### 인증방법(오프라인)

1. ZIP 압축을 푼다.
2. 해당 폴더에서 터미널을 엽니다.
3. 실행:

```bash
node verify.js
```

온전한 번들의 예상 출력:

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### 이 검증자는 무엇을 감지합니까?

- `data.csv`의 필드를 편집합니다.
- `data.csv`에서 행을 삭제하거나 추가합니다.
- `manifest.json` 수정.
- 잘못된 서명 키를 사용했습니다.

검사 항목이 `FAIL`로 나타나면 해당 내보내기는 **신뢰할 수 있는 것으로 간주되어서는 안 됩니다**.

### 감사를 위한 빠른 테스트

변조 감지를 시연하려면:

1. 새로 내보낸 ZIP에서 `node verify.js`를 실행합니다(모든 `PASS`가 제공되어야 함).
2. `data.csv`의 문자를 편집하고 저장합니다.
3. `node verify.js`를 다시 실행하세요.
4. 최소한 `Merkle root of export`에 실패해야 합니다.

이는 내보낸 데이터세트의 엔드투엔드 무결성 증거를 확인합니다.

---

## 상태 해석

| L1 상태 | 의미 |
|------------|-------------|
| ✅ 등록현황 | 유효한 해시 체인이 있는 MongoDB에서 상호 작용이 이루어집니다. |

| L2 상태 | 의미 |
|------------|-------------|
| ✅ 머클 검증됨 | 이 항목의 해시는 Merkle 트리의 일부이며 확인이 정확합니다 |
| ⚠️ 보류 중인 차단 | 블록을 형성하는 데 아직 10개의 항목이 없습니다(처음 몇 분 동안은 정상) |
| ❌ 인증 실패 | 해시가 merkle_root와 일치하지 않습니다. 조작 가능 |

| 상태 L3 | 의미 |
|------------|-------------|
| ✅ Rekor에 고정됨 | merkle_root는 서명된 타임스탬프와 함께 Rekor 공개 로그에 있습니다. |
| ⏳ 앵커 보류 중 | 블록이 봉인되었지만 아직 Rekor로 전송되지 않았습니다(최대 30초 정도 소요될 수 있음) |

---

## 메시지의 전체 흐름

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

## 공급업체 규정 준수

**"공급자 규정 준수"** 배지는 AI 공급자(OpenAI, Anthropic 등)가 SMLTP 개인정보 보호 헤더 수신을 확인했는지 여부를 나타냅니다.

| 배지 | 의미 |
|-------|-------------|
| ✅ 검증됨/인증됨 | 공급업체는 서명된 승인으로 수령을 확인했습니다. |
| 🛡️ 게이트웨이 보호됨 | 개인 정보 헤더가 전송되었지만 공급자가 명시적으로 확인하지 않았습니다. 귀하의 데이터는 게이트웨이에 의해 보호됩니다. |
| ⚠️ 제공업체가 확인되지 않음 | 공급자가 수령을 확인하지 않았습니다. 이동된 데이터는 SMLTP에 의해 보호되지만 공급자가 훈련 금지 지침을 준수한다는 보장은 없습니다. |

---

## 자주 묻는 질문

**인터넷 없이 번들을 확인할 수 있나요?**
예, 온라인 상태에서 "JSON 다운로드" 버튼을 눌러 테스트 JSON을 다운로드하세요. `merkle_root` 및 해시는 트리를 다시 계산하여 오프라인으로 확인할 수 있습니다.

**L3가 보류되면 어떻게 되나요?**
이는 최근 상호작용(1분 미만)의 경우 정상적인 현상입니다. Rekor의 사이드카 프로세스는 ~30초마다 차단됩니다. 5분 후에도 여전히 보류 중인 경우 사이드카 `rekor-anchor`가 실행 중인지 확인하세요.

**기록은 얼마나 오래 보관되나요?**
기본적으로 로그는 구성된 `retentionPeriod`에 따라 보관됩니다. 준수로 표시된 기록(`phi`, `pii`, `security`, `authorization`)은 자동으로 삭제되지 않습니다.

**확인 링크를 고객과 공유할 수 있나요?**
그렇습니다. URL `/verify/<bundle_id>`은 로그인이 필요하지 않으며 민감한 데이터를 노출하지 않습니다. 감사자, 규제 기관 또는 고객과 공유하는 것이 안전합니다.