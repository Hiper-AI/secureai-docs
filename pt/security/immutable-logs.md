---
sidebar_position: 4
title: "Logs Imutáveis (Auditoria Criptográfica)"
sidebar_label: "Logs Imutáveis"
---

# Logs Imutáveis — Cadeia de auditoria criptográfica

SecureAI registra **cada interação de IA e cada ação administrativa** em uma cadeia imutável de três camadas. Essa arquitetura garante que qualquer modificação, exclusão ou manipulação de registros seja detectável — mesmo que alguém tenha acesso direto ao banco de dados.

## Por que isso importa?

Um log que existe apenas no MongoDB não é verdadeiramente imutável: qualquer pessoa que tenha acesso ao servidor pode excluí-lo sem deixar rastros. SecureAI resolve isso fixando cada log em **Sigstore Rekor**, um log de transparência pública operado pela Open Source Security Foundation (OpenSSF) — o mesmo sistema que a indústria de software usa para verificar a cadeia de custódia de pacotes críticos.

> **Garantia técnica:** Depois que um hash de bloco Merkle estiver em Rekor, ninguém — incluindo o operador SecureAI — poderá alterar retroativamente esse registro. Qualquer auditor terceirizado pode verificá-lo de forma independente com uma única chamada curl.

---

##As três camadas de prova

Cada pacote de interação possui três níveis de evidência criptográfica:

### Camada 1 — Registro MongoDB (L1)

O registro primário da interação é armazenado no MongoDB com:

| Campo | Descrição |
|-------|------------|
| `current_hash` | SHA-256 da carga desta entrada + `prev_hash` anterior |
| `prev_hash` | Hash da entrada imediatamente anterior — forma a **cadeia de hash** |
| `bundle_id` | Identificador único do pacote de interação |
| `receipt_signature` | Se o provedor de IA retornou uma confirmação assinada dos cabeçalhos de privacidade |

A string `prev_hash → current_hash → next_current_hash` faz com que **a exclusão de qualquer linha quebre a string** — a discrepância é detectável ao percorrer a sequência.

### Camada 2 — Árvore Merkle (L2)

Cada 10 entradas de log são agrupadas em um **bloco Merkle**:

```
  Merkle Root
    /       \
  h(0,1)   h(2,3)
  /    \   /    \
 h0    h1 h2    h3   ...hasta h9
```

O `merkle_root` é o hash raiz que representa as 10 entradas. Se alguma entrada for alterada, o `merkle_root` muda — invalidando o teste de inclusão.

| Campo L2 | Descrição |
|----------|------------|
| `block_id` | ID do bloco Merkle |
| `merkle_root` | Hash de raiz de árvore |
| `leaf_hash` | Hash desta entrada específica dentro da árvore |
| `leaf_index` | Posição (0–9) dentro do bloco |
| `verified` | `true` se `leaf_hash` for confirmado em `merkle_root` |

### Camada 3 — Rekor Âncora (L3)

O `merkle_root` de cada bloco selado é enviado para **[Sigstore Rekor](https://rekor.sigstore.dev/)**, um log público somente para acréscimos. Rekor retorna:

| Campo L3 | Descrição |
|----------|------------|
| `log_index` | Número de sequência global no log Rekor — único e crescente monotonicamente |
| `uuid` | Identificador de entrada em Rekor |
| `integrated_time` | Timestamp em que Rekor assinou o teste de inclusão |
| `rekor_url` | URL direto para inserir JSON bruto em Rekor |

Uma vez que `log_index` existe em Rekor, **ninguém pode excluí-lo** — o log Rekor é público, distribuído e imutável por design.

---

## Portal da Transparência (admin)

### Acesso

**Administrador → AI Gateway → Portal de Transparência**

### Verifique um pacote

1. Digite ou cole `bundle_id` no campo de pesquisa.
2. Clique em **"Verificar Prova"**.
3. Você verá as três camadas com emblemas de status:
   - ✅ **Verde** = verificado com sucesso
   - ⚠️ **Amarelo** = selagem/âncora pendente (normal para interações há menos de 2 minutos)
   - ❌ **Vermelho** = falha na verificação (sinal de alerta)

### Copiar link de verificação pública

Quando o resultado estiver visível, uma barra aparecerá com o botão **"Copiar URL de verificação pública"**. Esse link é público – você pode enviá-lo a um auditor externo sem precisar de login.

---

##Página de verificação pública

Qualquer pessoa com um `bundle_id` pode verificar o teste sem acesso ao SecureAI:

```
https://tu-dominio.com/verify/<bundle_id>
```

A página mostra as três camadas, um botão para baixar o JSON de teste e comandos para verificar localmente.

**Esta página não expõe:**
- O conteúdo da mensagem nem a resposta da IA
- Dados do usuário (nome, email, IP)
- Qualquer informação pessoalmente identificável

Ele mostra apenas hashes, carimbos de data/hora, índices e status de verificação.

---

## Verificação independente com curl

Um auditor externo pode verificar qualquer pacote sem confiar na interface web:

### Etapa 1 — Faça o teste

```bash
BUNDLE_ID="fc9c40c6-c210-4a18-8403-59a46f220e34"
HOST="https://tu-dominio.com"

curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq .
```

### Passo 2 — Confirme o hash na camada Merkle

```bash
# Verificar que el leaf_hash esté en el merkle_root
LEAF=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.leaf_hash')
ROOT=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer2.merkle_root')
echo "Leaf: $LEAF"
echo "Root: $ROOT"
```

### Etapa 3 — Confirme a âncora em Rekor

```bash
REKOR_UUID=$(curl -s "$HOST/api/public/verify/$BUNDLE_ID" | jq -r '.layer3.uuid')

curl -s "https://rekor.sigstore.dev/api/v1/log/entries/${REKOR_UUID}" \
  | jq '.[].verification'
```

Um campo `signedEntryTimestamp` não vazio confirma que Rekor aceitou e assinou a entrada. Esse carimbo de data/hora não pode ser alterado retroativamente.

---

## Pacote de exportação assinado (auditores e usuários)

Além do verificador público do `bundle_id`, o SecureAI permite exportar evidências criptográficas em um ZIP portátil para auditorias offline.

### O que o ZIP inclui?

Quando um administrador usa **Exportar pacote assinado** em Logs ou SMLTP, um arquivo é baixado com:

- `data.csv`: dados exportados.
- `manifest.json`: metadados criptográficos (`rowCount`, `merkleRootOfExport`, `signingKeyFingerprint`, carimbo de data/hora, etc.).
- `manifest.sig`: assinatura Ed25519 de `manifest.json`.
- `verify.js`: verificador offline sem dependências.
- `README.txt`: instruções rápidas.

### Como verificar (off-line)

1. Descompacte o ZIP.
2. Abra um terminal nessa pasta.
3. Execute:

```bash
node verify.js
```

Resultado esperado em um pacote intacto:

```text
[PASS] Manifest signature (Ed25519)
[PASS] Row count matches manifest
[PASS] Merkle root of export
[PASS] Signing key fingerprint
✓ All checks PASSED — bundle is authentic.
```

### O que esse verificador detecta?

- Editando qualquer campo em `data.csv`.
- Excluindo ou adicionando linhas em `data.csv`.
- Modificação de `manifest.json`.
- Uso de chave de assinatura incorreta.

Se alguma verificação aparecer como `FAIL`, essa exportação **não deve ser considerada confiável**.

### Teste rápido para auditoria

Para demonstrar a detecção de violação:

1. Execute `node verify.js` no ZIP recém-exportado (deve fornecer todos `PASS`).
2. Edite qualquer caractere em `data.csv` e salve.
3. Execute `node verify.js` novamente.
4. Deve falhar pelo menos `Merkle root of export`.

Isto confirma a evidência de integridade ponta a ponta do conjunto de dados exportado.

---

## Interpretação de estados

| Estado L1 | Significado |
|-----------|------------|
| ✅ Inscrição presente | A interação está no MongoDB com cadeia de hash válida |

| Estado L2 | Significado |
|-----------|------------|
| ✅ Merkle verificado | O hash desta entrada faz parte da árvore Merkle e a verificação está correta |
| ⚠️ Bloqueio pendente | Ainda não há 10 entradas para formar bloco (normal nos primeiros minutos) |
| ❌ Falha na verificação | Hash não corresponde a merkle_root — possível manipulação |

| Estado L3 | Significado |
|-----------|------------|
| ✅ Ancorado em Rekor | O merkle_root está no log público Rekor com carimbo de data/hora assinado |
| ⏳ Âncora pendente | O bloco foi selado, mas ainda não foi enviado para Rekor (pode levar até 30 segundos) |

---

## Fluxo completo de uma mensagem

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

## Conformidade do fornecedor

O selo **"Provider Compliance"** indica se o provedor de IA (OpenAI, Anthropic, etc.) confirmou o recebimento dos cabeçalhos de privacidade SMLTP:

| Distintivo | Significado |
|-------|------------|
| ✅ VERIFICADO/CERTIFICADO | O fornecedor confirmou a recepção com um aviso de recepção assinado |
| 🛡️ GATEWAY PROTEGIDO | Cabeçalhos de privacidade foram enviados, mas não confirmados explicitamente pelo provedor. Seus dados são protegidos pelo gateway. |
| ⚠️ FORNECEDOR NÃO VERIFICADO | O fornecedor não confirmou o recebimento. Os dados trafegados são protegidos por SMLTP, mas não há garantia de que o provedor respeitará as instruções de não treinamento. |

---

## Perguntas frequentes

**Posso verificar um pacote sem internet?**
Sim, baixe o JSON de teste no botão "Baixar JSON" enquanto estiver online. O `merkle_root` e os hashes podem ser verificados offline, recalculando a árvore.

**O que acontece se L3 estiver pendente?**
Isso é normal para interações recentes (menos de 1 minuto). O sidecar do Rekor processa blocos a cada aproximadamente 30 segundos. Se após 5 minutos ainda estiver pendente, verifique se o sidecar `rekor-anchor` está rodando.

**Por quanto tempo os registros são mantidos?**
Por padrão, os logs são mantidos com base no `retentionPeriod` configurado. Registros marcados como conformidade (`phi`, `pii`, `security`, `authorization`) nunca são excluídos automaticamente.

**Posso compartilhar o link de verificação com um cliente?**
Sim. A URL `/verify/<bundle_id>` não requer login e não expõe dados confidenciais. É seguro compartilhar com auditores, reguladores ou clientes.