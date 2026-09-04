---
sidebar_position: 1
title: "Autenticação da API"
sidebar_label: "Autenticação"
---

# Autenticação API

SecureAI usa autenticação de chave API para todos os acessos externos à API. Chaves são tokens de portador criados e configurados por administradores, com controles por chave sobre modelos, políticas, limites, cobrança e segurança.

## Cabeçalho de autenticação

```http
Authorization: Bearer sk-your-api-key-here
```

**Formato de chave de API:**
- Começa com um prefixo `sk-` (por exemplo, `sk-8cd5253f...`).
- O prefixo é seguido por um segredo hexadecimal de 64 caracteres.
- Apenas um hash SHA-256 da chave é armazenado no lado do servidor — a chave completa é mostrada **uma vez**, na criação. Se estiver perdido, gire/recrie a chave.

Todas as chamadas de API requerem HTTPS.

## Criando e configurando chaves de API

Os administradores criam chaves em **Admin → Chaves de API** (API base `/api/admin/api-keys`, somente administrador). A chave completa é retornada uma vez na criação. Cada chave carrega a seguinte configuração:

### Propriedade e cobrança

| Configuração | Descrição |
|--------|-------------|
| `name` | Etiqueta legível por humanos. |
| `userId` | A conta de usuário à qual esta chave pertence/fatura. |
| `billingMode` | `user-completions` (deduzir do subsídio de conclusão do usuário) ou `usage-by-model` (deduzir um orçamento em dólares pelo custo do modelo). Consulte [Modos de cobrança](/pt/api/billing-modes). |

Os chamadores podem cobrar uma solicitação individual para um usuário **diferente** com o parâmetro corporal `user_id` (controlado pelo administrador).

### Limites

| Configuração | Descrição |
|--------|-------------|
| `dailyLimit` | Máximo de solicitações por dia para esta chave. |
| `monthlyLimit` | Máximo de solicitações por mês para esta chave. |
| `rateLimit.requestsPerMinute` | Teto por minuto (até 1000). |
| `rateLimit.requestsPerHour` | Teto por hora (até 10.000). |
| `expiresAt` | Expiração opcional; omitir para uma chave que não expira. |

### Listas de permissões

| Configuração | Descrição |
|--------|-------------|
| `allowedModels[]` | Se definida, a chave pode usar **apenas** estes modelos. Vazio = o catálogo padrão da licença. |
| `allowedIndexes[]` | Restringe quais bases de conhecimento a chave pode consultar. |
| `allowedSMLTPPolicies[]` | Políticas SMLTP que a chave pode solicitar (padrão `["public", "internal"]`). Validado no resolvedor de políticas, portanto, políticas personalizadas de locatário são permitidas. |

### Escudo de alerta

| Configuração | Descrição |
|--------|-------------|
| `enablePromptShield` | Ative o Prompt Shield para esta chave. |
| `promptShieldSensitivity` | `strict`, `balanced` ou `permissive`. |
| `promptShieldPolicyId` | Vincule uma política específica do Prompt Shield à chave. |
| `allowedPromptShieldPolicies[]` | Políticas que o chamador pode selecionar por chamada via `prompt_shield.policy`. |

Consulte [API Prompt Shield](/pt/api/threat-defense/prompt-shield).

### Padrões de redundância

`failoverDefaults` anexa um modelo padrão [cadeia de failover](/pt/api/redundancy) à chave: `models[]` (até 3), `timeout_ms` (1000–300000), `first_token_timeout_ms` (500–60000) e `on[]` gatilhos. Os chamadores obtêm failover sem enviar uma cadeia em cada solicitação.

## Idempotência

Conclusão `POST` aceita um cabeçalho `Idempotency-Key`. Tentar novamente com a mesma chave retorna o resultado original em vez de cobrar uma segunda vez – use-o para tornar as tentativas de rede seguras. Consulte [Conclusão do bate-papo](/pt/api/chat/completions).

## Limitação de taxa

Limites padrão (configuráveis por chave):

- **Por minuto**: 60 solicitações
- **Por hora**: 1.000 solicitações
- **Diariamente**: 100 solicitações
- **Mensal**: 10.000 solicitações

Um detentor de chave pode ler suas próprias cotas e limites ativos via [`GET /usage`](/pt/api/usage).

## Recursos de segurança

- **Somente HTTPS** — todas as chamadas de API exigem TLS.
- **Hashed em repouso** — apenas um hash SHA-256 de cada chave é armazenado.
- **Rastreamento de uso e registro de auditoria** — todos os eventos de chamada e autenticação são registrados.
- **SMLTP conformidade** — as políticas de segurança são aplicadas em cada solicitação.

## Respostas de erro

### Erro de autenticação

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### Erro de limite de taxa

```json
{
  "success": false,
  "error": "Rate limit exceeded: too many requests per minute",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## Códigos de erro comuns

| Erro | Descrição |
|-------|------------|
| `Invalid API key` | A chave de API é inválida, expirou ou foi revogada. |
| `Rate limit exceeded: too many requests per minute` | Limite de taxa por minuto excedido. |
| `Rate limit exceeded: too many requests per hour` | Limite de taxa por hora excedido. |
| `Access denied` | Modelo, índice ou política não permitido para esta chave. |

## Próximas etapas

- [Referência de API](/pt/api) — Explore todos os endpoints externos disponíveis.
- [Conclusões de bate-papo](/pt/api/chat/completions) — Comece a integrar as conclusões.
- [Endpoint compatível com OpenAI](/pt/api/chat/openai-compatível) — Reutilize um SDK OpenAI existente.
- [Uso](/pt/api/usage) — Verifique cotas e limites.