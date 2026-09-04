---
title: "Recibos Criptográficos SMLTP"
sidebar_label: "Recibos SMLTP"
description: "Obtenha o recibo de conformidade SMLTP assinado para conclusão"
openapi: "GET /receipts/{bundleId}"
---

# Recibos de Conformidade

Quando uma conclusão é roteada através do gateway **SMLTP**, a SecureAI produz um **recibo** de conformidade assinado — prova criptográfica da política que regeu a chamada. Este endpoint busca esse recibo por seu ID de pacote.

Os recibos existem apenas para implantações roteadas por gateway. Em implantações de provedor direto, não há gateway para assinar recibos e esse endpoint retorna `404`.

## Ponto final

```
GET /receipts/:bundleId
```

## De onde vem o ID do pacote

As respostas de conclusão expõem o ID do pacote sempre que um direito SMLTP é criado para a chamada:

- Endpoint clássico: `metadata.smltp.bundle_id` (e um `metadata.smltp.receipt_url` pronto).
- Endpoint compatível com OpenAI: `secureai.smltp_bundle_id`.

O ID do pacote (um ID de autorização como `jti-…`) é retornado mesmo em implantações de provedor nativo/direto. O **recibo assinado** nesse ID, no entanto, só existe quando o tráfego é roteado através do gateway SMLTP — em implantações diretas, esse endpoint retorna `404` (veja abaixo).

## Autenticação

```bash
Authorization: Bearer sk-your-api-key-here
```

## Exemplo de solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Resposta

### 200 OK

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

O objeto `receipt` é a carga assinada emitida pelo gateway. Consulte [SMLTP Segurança](/pt/security/smltp) para saber como os recibos se enquadram no modelo de transparência e auditoria.

### 404 não encontrado

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 Solicitação incorreta

Retornado quando o ID do pacote está ausente ou tem mais de 128 caracteres.

## Notas

- Os recibos são mantidos no armazenamento na memória do gateway por tempo limitado. Para provas de longo prazo, confie no **log de auditoria encadeado por hash** — o registro oficial e imutável. Veja [Logs Imutáveis](/pt/security/immutable-logs).
- Nem toda implantação passa pelo gateway; trate um `404` como "sem recebimento de gateway para esta chamada", e não como um erro em sua integração.

## Relacionado

- [SMLTP Segurança](/pt/security/smltp)
- [Logs imutáveis](/pt/security/immutable-logs)
- [Conclusão do bate-papo](/pt/api/chat/completions)