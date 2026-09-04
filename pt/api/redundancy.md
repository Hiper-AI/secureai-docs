---
title: "Redundância e Failover Automático"
sidebar_label: "Redundância & Failover"
description: "Cadeias de failover de modelo definidas pelo chamador para a API SecureAI Completions"
---

# Redundância e failover

A API Completions pode **fazer failover** automaticamente de um modelo para outro quando uma chamada de provedor falha. Você define uma cadeia ordenada – um modelo primário mais até dois substitutos – e o SecureAI tenta cada um deles até obter sucesso. Isso oferece resiliência contra interrupções do provedor, limites de taxa e tempos limite sem qualquer lógica de nova tentativa em seu próprio código.

A redundância está disponível no endpoint [clássico `/chat/completions`](/pt/api/chat/completions) e no endpoint [compatível com OpenAI `/v1/chat/completions`](/pt/api/chat/openai-compatível).

## Como uma cadeia é definida

Existem três maneiras de solicitar uma cadeia, em ordem de precedência:

| # | Você envia | Cadeia resultante |
|---|----------|-----------------|
| 1 | `models: ["a", "b", "c"]` | Exatamente essa cadeia (substitui `model`). |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`. |
| 3 | `model: "a"` sozinho | Usa o `failoverDefaults` configurado pelo administrador da chave API se `a` aparecer neles (a cadeia começa na posição de `a`); caso contrário, uma única tentativa. |

Uma rede pode conter **no máximo 3 modelos distintos**. As entradas duplicadas são recolhidas. Cada entrada da cadeia pode ser uma string de modelo simples ou um objeto com tempos limite por tentativa:

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

Você não pode combinar `models` e `fallback_models` na mesma solicitação.

## Opções para toda a cadeia (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

| Campo | Alcance | Descrição |
|-------|-------|-------------|
| `timeout_ms` | 1.000–300.000 | Tempo limite geral por tentativa. |
| `first_token_timeout_ms` | 500–60000 | Para streaming: quanto tempo esperar pelo primeiro token de conteúdo antes de fazer failover. |
| `on` | subconjunto dos gatilhos abaixo | Quais classes de falha acionam o failover. O padrão é todos os quatro. |

Os tempos limite por tentativa (definidos dentro de uma entrada `models[]`) substituem os valores de toda a cadeia para essa tentativa.

## Gatilhos de failover

Uma tentativa fracassada é classificada em um destes motivos; o failover acontece apenas se o motivo estiver na sua lista `on` **e** houver outro modelo restante na cadeia:

| Razão | Causa |
|-------|-------|
| `connection_error` | Conexão recusada/redefinida, falha de DNS/busca. |
| `server_error` | O provedor retornou HTTP 5xx. |
| `rate_limit` | O provedor retornou HTTP 429. |
| `timeout` | A tentativa excedeu `timeout_ms` (ou `first_token_timeout_ms` durante a transmissão). |

Falhas que **não** podem ser repetidas nunca acionam failover — por exemplo, um bloco intencional de limite de taxa/orçamento de token do gateway, um disjuntor aberto ou uma rejeição de política/validação. Um substituto falharia de forma idêntica ou o bloqueio seria deliberado.

## Comportamento de streaming

Para solicitações de streaming, **o failover só é possível antes da chegada do primeiro token de conteúdo.** SecureAI puxa o fluxo upstream até o primeiro token (delimitado por `first_token_timeout_ms`); se isso falhar, ele fará failover para o próximo modelo. Depois que o primeiro token for enviado ao seu cliente, o modelo de serviço será bloqueado — uma interrupção posterior no meio do fluxo aparecerá como um quadro `error`, não como um failover.

## O que você recebe de volta

Quando uma cadeia multimodelo é executada, a resposta inclui um **relatório de failover**:

- Endpoint clássico: `metadata.failover`
- Endpoint compatível com OpenAI: `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` informa qual modelo realmente respondeu e `requested_model` é o primeiro modelo da cadeia. Uma solicitação de modelo único (legado) não produz nenhum relatório de failover.

## Quando toda a cadeia falha

Se todas as tentativas falharem, a solicitação retornará um erro listando todas as tentativas:

- **429** se *cada* falha fosse um limite de taxa.
- **502** caso contrário.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

No endpoint compatível com OpenAI, a mesma condição retorna o envelope de erro OpenAI com `code: "all_models_failed"`.

## Padrões de administrador (`failoverDefaults`)

Um administrador pode anexar uma cadeia padrão a uma chave de API para que os chamadores obtenham failover sem enviar uma cadeia em cada solicitação. Configurada em **Admin → Chaves de API**, a carga útil é validada e fixada:

- `models`: até 3 nomes de modelos distintos.
- `timeout_ms`: 1.000–300.000.
- `first_token_timeout_ms`: 500–60000.
- `on`: qualquer subconjunto dos quatro gatilhos.

Quando um chamador envia apenas `model: "a"` e `a` está presente em `failoverDefaults.models`, a cadeia começa na posição de `a` e continua através dos padrões restantes.

## Segurança e cobrança por tentativa

Cada tentativa é uma chamada completa e independente por meio do wrapper SMLTP - aplicação de política, governança de saída/residência e o Signed Entitlement Token mint, todos executados novamente por tentativa, vinculados ao modelo dessa tentativa e aos bytes de solicitação exatos. O faturamento reflete o modelo que realmente atendeu à resposta. Cada failover também emite um evento de segurança `api:model_failover` (entregue a qualquer [webhooks](/pt/api/webhooks/overview) inscrito) e uma entrada de log de auditoria.

## Relacionado

- [Conclusão do bate-papo](/pt/api/chat/completions)
- [Endpoint compatível com OpenAI](/pt/api/chat/openai-compatível)
- [Policy Check](/pt/api/policy-check) — visualize o acesso de toda a rede sem gastar pontos.
- [Webhooks](/pt/api/webhooks/overview) — inscreva-se em `api:model_failover`.