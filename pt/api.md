---
sidebar_position: 5
title: "Referência da API Externa"
sidebar_label: "Referência API"
---

# Referência de API

A API externa SecureAI fornece recursos de conclusão de chat de IA com recuperação de base de conhecimento, políticas de segurança e rastreamento de uso abrangente. Esta API foi projetada para desenvolvedores externos e integrações usando autenticação de chave de API.

## Principais recursos

- **RAG (Geração Aumentada de Recuperação)**: Pesquise automaticamente bases de conhecimento para contexto relevante
- **Suporte a vários modelos**: OpenAI, Anthropic, Google, Meta e outros modelos de IA
- **Redundância e failover de modelo**: cadeias de failover definidas pelo chamador (primário + substitutos) com tempos limite por tentativa
- **Endpoint compatível com OpenAI**: aponte qualquer SDK OpenAI para `/api/external/v1` — sem alterações de código
- **Geração de imagens**: gere e edite imagens usando o Google Gemini 2.5 Flash Image
- **Speech-to-Speech (S2S)**: conversas de voz em tempo real usando OpenAI Realtime API com WebRTC
- **Políticas de segurança**: aplicação de políticas SMLTP, Prompt Shield por chamada e recibos de conformidade assinados
- **Webhooks**: entrega assinada e em tempo real de eventos de segurança e de plataforma
- **Acompanhamento de uso**: monitoramento abrangente de uso, cota de autoatendimento e limitação de taxa
- **Integração da base de conhecimento**: acesso a bases de conhecimento pessoais e compartilhadas
- **Gerenciamento de usuários**: recursos completos de gerenciamento de usuários, grupos e funções
- **Registro de auditoria**: registros abrangentes de atividades e auditoria de segurança

## Autenticação

Todos os endpoints (exceto verificação de integridade) exigem autenticação de chave de API usando token de portador:

```bash
Authorization: Bearer sk-your-api-key-here
```

##URL base

```
https://{customer.name}.hiperai.ai/api/external
```

Para a superfície compatível com OpenAI, aponte o URL base do seu SDK para:

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## Faturamento e uso

Por padrão, as solicitações de API são cobradas da conta do usuário que possui a chave de API. Você pode especificar um usuário diferente para faturar incluindo o parâmetro `user_id` em sua solicitação. Isso permite:

- Aplicativos multilocatários com faturamento por usuário
- Gerenciamento flexível de limites de conclusão
- Configurações de "Uso por modelo" por usuário

## Limites de taxa

- **Padrão**: 60 solicitações por minuto, 1.000 solicitações por hora
- **Limites diários**: 100 solicitações (configuráveis)
- **Limites mensais**: 10.000 solicitações (configuráveis)

## Início rápido

### 1. Exame de saúde

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. Obtenha modelos disponíveis

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Obtenha bases de conhecimento disponíveis

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Crie uma conclusão de bate-papo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## Terminais de API

### Sistema
- [Verificação de integridade](/pt/api/system/health) - Verifique o status da API

### Descoberta
- [Obter modelos disponíveis](/pt/api/discovery/models) - Listar modelos de IA disponíveis
- [Obter bases de conhecimento disponíveis](/pt/api/discovery/indexes) - Listar bases de conhecimento acessíveis
- [Obter políticas de segurança](/pt/api/discovery/smltp-policies) - Listar políticas SMLTP disponíveis

### Bate-papo
- [Conclusão do bate-papo](/pt/api/chat/completions) - Endpoint principal do bate-papo da IA com RAG
- [Ponto final compatível com OpenAI](/pt/api/chat/openai-compatível) - Drop-in `/v1/chat/completions` para SDKs OpenAI
- [Redundância e Failover](/pt/api/redundancy) - Modelar cadeias de failover
- [Policy Check](/pt/api/policy-check) - Execute o pipeline de segurança sem chamar um modelo
- [Uso](/pt/api/usage) - Cota de autoatendimento, orçamento e limites de taxa
- [Recibos](/pt/api/receipts) - Buscar recibos de conformidade assinados SMLTP

### Webhooks
- [Visão geral dos Webhooks](/pt/api/webhooks/overview) - Entrega de eventos assinados em tempo real
- [Eventos Webhook](/pt/api/webhooks/events) - Catálogo de eventos e cargas úteis

### Imagens
- [Gerar Imagens](/pt/api/images/generações) - Gerar imagens a partir de texto ou editar imagens existentes
- [Editar imagens](/pt/api/images/edits) - Edição imagem a imagem com instruções de texto

### Fala/S2S
- [Iniciar sessão S2S WebRTC](/pt/api/speech/webrtc) - Estabelecer conversas de voz em tempo real
- [Obter status de tempo S2S](/pt/api/speech/status) - Verifique a cota de tempo S2S restante
- [Registrar duração da sessão S2S](/pt/api/speech/log-session) - Registrar duração da sessão e deduzir o tempo

### Gerenciamento de usuários
- [Obter todos os usuários](/pt/api/users/list) - Recuperar usuários com paginação
- [Criar usuário](/pt/api/users/create) - Criar nova conta de usuário
- [Atualizar usuário](/pt/api/users/update) - Atualizar usuário existente
- [Obter disponibilidade de licença](/pt/api/billing-modes/licenses-availability) - Recuperar limites e uso do pool de licenças

### Gerenciamento de índice
- [Obter todos os índices](/pt/api/indexes/list) - Recuperar todas as bases de conhecimento
- [Criar Índice](/pt/api/indexes/create) - Criar nova base de conhecimento
- [Atualizar índice](/pt/api/indexes/update) - Atualizar índice existente
- [Treinar índice com documentos](/pt/api/indexes/train) - Treinar índice enviando documentos
- [Índice de pesquisa de documentos](/pt/api/indexes/search) - Pesquisa de documentos usando pesquisa semântica

### Gerenciamento de Grupo
- [Obter todos os grupos](/pt/api/groups/list) - Recuperar todos os grupos
- [Criar Grupo](/pt/api/groups/create) - Criar novo grupo
- [Atualizar grupo](/pt/api/groups/update) - Atualizar grupo existente

### SMLTP Segurança
- [Obter todas as políticas SMLTP](/pt/api/smltp/policies) - Listar todas as políticas de segurança
- [Obter política ativa](/pt/api/smltp/active) - Obter política ativa atual
- [Criar política personalizada](/pt/api/smltp/create) - Criar política personalizada SMLTP
- [Registros de auditoria](/pt/api/smltp/audit-logs) - Recuperar registros de auditoria SMLTP

### Gerenciamento de funções
- [Obter todas as funções](/pt/api/roles/list) - Recuperar todas as funções
- [Criar função](/pt/api/roles/create) - Criar nova função personalizada

## Tratamento de erros

### Formato de resposta de erro

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
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Códigos de status HTTP comuns

| Código | Descrição |
|------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Solicitação incorreta - parâmetros inválidos |
| `401` | Não autorizado – chave de API inválida |
| `403` | Proibido - permissões insuficientes |
| `404` | Não encontrado |
| `409` | Conflito – o recurso já existe |
| `413` | Carga útil muito grande - tamanho do arquivo excedido |
| `429` | Limite de taxa excedido |
| `500` | Erro interno do servidor |
| `503` | Serviço indisponível - serviço não configurado |

## Exemplos de SDK

###JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

###Píton

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. Obtenha modelos disponíveis

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. Obtenha bases de conhecimento disponíveis

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. Crie uma conclusão de bate-papo

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## Terminais de API

### Sistema
- [Verificação de integridade](/pt/api/system/health) - Verifique o status da API

### Descoberta
- [Obter modelos disponíveis](/pt/api/discovery/models) - Listar modelos de IA disponíveis
- [Obter bases de conhecimento disponíveis](/pt/api/discovery/indexes) - Listar bases de conhecimento acessíveis
- [Obter políticas de segurança](/pt/api/discovery/smltp-policies) - Listar políticas SMLTP disponíveis

### Bate-papo
- [Conclusão do bate-papo](/pt/api/chat/completions) - Endpoint principal do bate-papo da IA com RAG
- [Endpoint compatível com OpenAI](/pt/api/chat/openai-compatível) - Drop-in `/v1/chat/completions` para SDKs OpenAI
- [Redundância e Failover](/pt/api/redundancy) - Modelar cadeias de failover
- [Policy Check](/pt/api/policy-check) - Execute o pipeline de segurança sem chamar um modelo
- [Uso](/pt/api/usage) - Cota de autoatendimento, orçamento e limites de taxa
- [Receipts](/pt/api/receipts) - Buscar recibos de conformidade assinados SMLTP

### Webhooks
- [Visão geral dos Webhooks](/pt/api/webhooks/overview) - Entrega de eventos assinados em tempo real
- [Eventos Webhook](/pt/api/webhooks/events) - Catálogo de eventos e cargas úteis

### Imagens
- [Gerar Imagens](/pt/api/images/generações) - Gerar imagens a partir de texto ou editar imagens existentes
- [Editar imagens](/pt/api/images/edits) - Edição imagem a imagem com instruções de texto

### Fala/S2S
- [Iniciar sessão S2S WebRTC](/pt/api/speech/webrtc) - Estabelecer conversas de voz em tempo real
- [Obter status de tempo S2S](/pt/api/speech/status) - Verifique a cota de tempo S2S restante
- [Registrar duração da sessão S2S](/pt/api/speech/log-session) - Registrar duração da sessão e deduzir o tempo

### Gerenciamento de usuários
- [Obter todos os usuários](/pt/api/users/list) - Recuperar usuários com paginação
- [Criar usuário](/pt/api/users/create) - Criar nova conta de usuário
- [Atualizar usuário](/pt/api/users/update) - Atualizar usuário existente
- [Obter disponibilidade de licença](/pt/api/billing-modes/licenses-availability) - Recuperar limites e uso do pool de licenças

### Gerenciamento de índice
- [Obter todos os índices](/pt/api/indexes/list) - Recuperar todas as bases de conhecimento
- [Criar Índice](/pt/api/indexes/create) - Criar nova base de conhecimento
- [Atualizar índice](/pt/api/indexes/update) - Atualizar índice existente
- [Treinar índice com documentos](/pt/api/indexes/train) - Treinar índice enviando documentos
- [Índice de pesquisa de documentos](/pt/api/indexes/search) - Pesquisa de documentos usando pesquisa semântica

### Gerenciamento de Grupo
- [Obter todos os grupos](/pt/api/groups/list) - Recuperar todos os grupos
- [Criar Grupo](/pt/api/groups/create) - Criar novo grupo
- [Atualizar grupo](/pt/api/groups/update) - Atualizar grupo existente

### SMLTP Segurança
- [Obter todas as políticas SMLTP](/pt/api/smltp/policies) - Listar todas as políticas de segurança
- [Obter política ativa](/pt/api/smltp/active) - Obter política ativa atual
- [Criar política personalizada](/pt/api/smltp/create) - Criar política personalizada SMLTP
- [Registros de auditoria](/pt/api/smltp/audit-logs) - Recuperar registros de auditoria SMLTP

### Gerenciamento de funções
- [Obter todas as funções](/pt/api/roles/list) - Recuperar todas as funções
- [Criar função](/pt/api/roles/create) - Criar nova função personalizada

## Tratamento de erros

### Formato de resposta de erro

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
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### Códigos de status HTTP comuns

| Código | Descrição |
|------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Solicitação incorreta - parâmetros inválidos |
| `401` | Não autorizado – chave de API inválida |
| `403` | Proibido - permissões insuficientes |
| `404` | Não encontrado |
| `409` | Conflito – o recurso já existe |
| `413` | Carga útil muito grande - tamanho do arquivo excedido |
| `429` | Limite de taxa excedido |
| `500` | Erro interno do servidor |
| `503` | Serviço indisponível - serviço não configurado |

## Exemplos de SDK

###JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

###Píton

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## Próximas etapas

- [Base de Conhecimento & RAG](/pt/indexes/overview) - Aprenda sobre Bases de Conhecimento e RAG
```