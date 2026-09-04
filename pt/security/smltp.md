---
sidebar_position: 2
title: "Segurança e Protocolo SMLTP"
sidebar_label: "Segurança SMLTP"
---

# SMLTP Protocolo de segurança

SecureAI usa o **Secure Model Language Transfer Protocol (SMLTP)** para governar, conter e provar
comunicação com Large Language Models (LLMs).

## O que é SMLTP?

SMLTP é um protocolo de segurança com um **rascunho de especificação pública** (v0.2). Ele define um
**plano de controle determinístico** para tráfego de IA: em vez de confiar apenas na inspeção probabilística
de prompts, SMLTP cria cinco propriedades de cada chamada de IA governada determinística e criptograficamente
verificável.

| Camada | Mecanismo determinístico |
|---|---|
| **Identidade** | Ed25519 Signed Entitlement Token (SET) cunhado por solicitação |
| **Autorização** | Declarações `model` e `policy_hash` — a chamada é executada sob uma política nomeada ou não é executada |
| **Integridade do transporte** | `body_sha256` vincula o token aos bytes exatos da solicitação |
| **Contenção** | Modos de monitoramento/aplicação, cache de repetição, revogação de assunto, padrões de falha fechada |
| **Auditoria** | Registro acorrentado por hash e selado por Merkle com recibos de conformidade assinados |

## O modelo de dois planos

SMLTP separa deliberadamente dois tipos de controles:

- **Plano determinístico (criptografia):** quem está ligando, o que está autorizado a chamar, que
  solicitação não foi alterada, que um assunto revogado seja cortado e que o registro não possa ser silenciosamente
  reescrito. Estas são garantias, impostas por assinaturas e hashes.
- **Plano probabilístico (inspeção):** DLP, redação de PII e Prompt Shield executados *atrás* do
  controles determinísticos e são explicitamente de **melhor esforço**. SMLTP nunca afirma que a criptografia
  detecta injeção imediata ou que a inspeção captura todas as sequências sensíveis - afirma que o
  o veredicto da inspeção que *foi* produzido é registrado em um recibo assinado e verificável.

## Principais recursos

### Tokens de direitos assinados
- Cada solicitação governada carrega uma identidade, modelo, política e bytes de solicitação de token assinado por Ed25519
- Proteção de repetição por meio de IDs de token de uso único
- A revogação de um assunto entra em vigor no gateway em segundos – não é necessária cooperação do fornecedor

### Recibos de conformidade assinados
- Cada interação roteada pelo gateway produz um recibo assinado pelo gateway
- Os recibos registram a política vigente, o hash da solicitação e as evidências de inspeção que foram produzidas
- Os recibos podem ser verificados off-line em relação à chave pública do gateway — consulte
  [API de recibos](../api/receipts.md)

### Auditoria inviolável
- Os eventos de auditoria são encadeados por hash (`prev_hash` → `current_hash`) e selados em blocos Merkle
- As raízes Merkle podem ser ancoradas em um log de transparência externo (Sigstore Rekor), então o registro
  a integridade não depende da confiança no operador SecureAI - consulte
  [Registros imutáveis](./immutable-logs.md)

### Aplicação de políticas
- Modelo de listas de permissões, verificações de residência de dados (cerca geográfica) e controles de saída avaliados no gateway
- **Modo monitor** observa e atesta; **modo de aplicação** bloqueia chamadas não compatíveis com um sinal
  recibo de negação

### Gerenciamento de Chaves
- Chaves de assinatura Ed25519 com suporte para rotação; os recibos emitidos sob chaves anteriores permanecem verificáveis

## Escopo e honestidade

- **Escopo da implantação:** recebimentos e imposição SMLTP aplicam-se a **implantações roteadas por gateway**.
  As implantações que chamam diretamente os provedores ainda obtêm plataforma DLP/PII e registro de auditoria, mas não
  recibos assinados pelo gateway (a [API de recibos](../api/receipts.md) documenta esse comportamento).
- **Escopo de criptografia:** a criptografia de transporte é TLS; pacotes de solicitação entre cliente e gateway podem
  adicionalmente ser criptografado (AES-256-GCM). SMLTP atualmente não fornece criptografia de ponta a ponta
  através do provedor de IA e não reivindica sigilo de encaminhamento.
- **Escopo da inspeção:** a detecção de DLP/PII é probabilística e de melhor esforço. O que SMLTP garante é
  que o veredicto é *atestado* — o recibo comprova o que foi verificado e qual foi o resultado.

## Benefícios de segurança

- **Provabilidade**: recibos assinados transformam "temos registros" em "qualquer um pode verificar o que aconteceu"
- **Contenção**: mesmo um agente comprometido ou com mau comportamento não pode exceder seus direitos assinados
- **Revogação determinística**: bloquear um usuário, chave ou agente reduz o tráfego no gateway em segundos
- **Auditabilidade**: uma trilha inviolável que os auditores externos podem verificar de forma independente