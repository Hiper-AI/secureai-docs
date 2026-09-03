---
sidebar_position: 2
title: "Eventos de webhook"
sidebar_label: "Eventos"
description: "O catálogo de eventos do webhook SecureAI"
---
# Eventos de webhook

Ao criar ou atualizar um [endpoint webhook](/pt/en/api/webhooks/overview), você o inscreve em um ou mais tipos de eventos. Use `"*"` para receber todos os eventos.

## Catálogo de eventos

| Evento | Dispara quando |
|-------|-----------|
| `*` | Curinga — assina **todos** os eventos abaixo. |
| `promptshield:attack:blocked` | O Prompt Shield bloqueou uma tentativa de injeção imediata/jailbreak. |
| `promptshield:attack:detected` | O Prompt Shield sinalizou um prompt suspeito (detectado, mas não bloqueado). |
| `promptshield:canary:leaked` | Um token canário foi encontrado na saída do modelo (prompt do sistema/sinal de exfiltração de dados). |
| `dlp:incident` | Uma regra de prevenção contra perda de dados correspondente. |
| `pii:incident` | PII foi detectada/redigida. |
| `api:limit_reached` | Uma chave de API atingiu um limite diário/mensal/de taxa. |
| `api:model_failover` | Uma cadeia de [redundância](/pt/en/api/redundancy) fez failover de um modelo para outro. |

A inscrição em um nome de evento desconhecido é rejeitada no momento da criação/atualização.

## Envelope de carga útil

Cada entrega compartilha o mesmo envelope; o objeto `data` é específico do evento.

```json
{
  "id": "evt_3f9a1c2b4d5e6f7a8b9c0d1e",
  "type": "api:model_failover",
  "created": 1705312200,
  "data": {
    "failedModel": "openai/gpt-5-nano",
    "reason": "timeout",
    "nextModel": "anthropic/claude-sonnet-4",
    "latencyMs": 30011,
    "userId": "60a7c8f5e8b4f5001f7a8c23",
    "apiKeyId": "6512ab..."
  }
}
```

## Entregas de teste

O botão **Enviar evento de teste** (ou `POST /api/admin/webhooks/:id/test`) entrega um evento `webhook:test` para que você possa confirmar seu receptor e verificação de assinatura antes de ir ao ar:

```json
{
  "id": "evt_test_1a2b3c4d5e6f7a8b",
  "type": "webhook:test",
  "created": 1705312200,
  "data": { "message": "SecureAI webhook test delivery", "endpointId": "6512ab..." }
}
```

## Relacionado

- [Visão geral dos Webhooks](/pt/en/api/webhooks/overview) — formato de entrega, verificação de assinatura, confiabilidade.