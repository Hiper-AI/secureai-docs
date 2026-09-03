---
title: "Chaves de API do modo de faturamento"
---
# Chaves de API do modo de faturamento

SecureAI oferece suporte a dois modos de cobrança distintos para chaves de API, permitindo que os administradores controlem como o uso é rastreado e cobrado por diferentes integrações de API.

## Visão geral

As chaves de API podem ser configuradas com um dos dois modos de cobrança:

- **Conclusões do usuário**: deduz do intervalo de conclusão da licença do usuário
- **Uso por modelo**: cobranças no cartão de crédito do usuário com base no uso real do modelo

## Modos de cobrança

### Modo de conclusão do usuário

**Modo padrão** – As chaves de API usam esse modo por padrão.

#### Como funciona
- Deduz conclusões da cota de licença mensal do usuário
- Usa os mesmos limites de conclusão da interface web
- Sem custos adicionais além da licença existente do usuário
- Volta para Uso por modelo se nenhuma cota estiver disponível e o usuário tiver o Uso por modelo habilitado

#### Casos de uso
- Aplicativos internos onde você deseja usar alocações de licenças existentes
- Ambientes de desenvolvimento e testes
- Aplicações onde você deseja custos fixos e previsíveis
- Quando você quiser permanecer dentro dos limites de licença existentes

#### Configuração
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### Uso por modo de modelo

**Modo Avançado** - Requer configuração explícita e permissão do usuário.

#### Como funciona
- Cobranças baseadas no uso real do token e nos custos do modelo
- Rastreia tokens de entrada, tokens de saída e tokens totais
- Calcula custos com base em preços específicos do modelo
- Requer que o usuário tenha o Uso por modelo habilitado em sua conta
- Possui limites mensais configuráveis em dólares

#### Casos de uso
- Aplicações de alto volume onde você precisa de rastreamento preciso de custos
- Aplicações utilizando modelos de maior custo (GPT-5.x, Claude Opus/Sonnet, etc.)
- Quando você precisar de análises detalhadas de uso
- Aplicativos onde você deseja pagar apenas pelo que usa

#### Configuração
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## Criação de chave de API

### Criando chaves de API com modos de faturamento

Crie e configure chaves de API no painel de administração do SecureAI.

1. Vá para `Admin -> API Keys`.
2. Crie ou edite uma chave de API.
3. Defina `billingMode` como `user-completions` ou `usage-by-model`.
4. Configure limites, modelos permitidos, índices permitidos e políticas SMLTP permitidas.

### Validação do modo de cobrança

O sistema valida os requisitos do modo de faturamento:

- **Modo Uso por Modelo**: Requer que o usuário tenha o Uso por Modelo habilitado
- **Modo de conclusão do usuário**: funciona com qualquer usuário, mas pode voltar ao uso por modelo se nenhuma cota estiver disponível

## Rastreamento de uso

### Acompanhamento de conclusões do usuário

Para o modo Conclusões do usuário, o sistema rastreia:
- Contagens de conclusão diárias e mensais
- Estatísticas de uso específicas do modelo
- Consumo e limites de cotas

### Uso por rastreamento de modelo

Para o modo Uso por modelo, o sistema rastreia:
- Tokens de entrada, tokens de saída e tokens totais
- Custos e pontos específicos do modelo
- Gastos mensais em dólares
- Análise detalhada de uso

## Exemplos de respostas de API

### Resposta do modo de conclusão do usuário

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### Uso por resposta do modo de modelo

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## Tratamento de erros

### Uso por modelo não ativado

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### Cota excedida (conclusões do usuário)

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### Orçamento excedido (uso por modelo)

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## Melhores práticas

### Escolhendo o modo de cobrança correto

1. **Use as conclusões do usuário quando:**
   - Você quer custos previsíveis
   - Você está dentro dos limites de licença existentes
   - Você está construindo ferramentas internas
   - Você deseja usar alocações de cotas existentes

2. **Use Uso por modelo quando:**
   - Você precisa de rastreamento detalhado de custos
   - Você usa modelos caros com frequência
   - Você deseja pagar apenas pelo uso real
   - Você precisa de análises granulares de uso

### Recomendações de configuração

1. **Estabeleça limites apropriados:**
   - Limites diários para controle de taxas
   - Limites mensais para controle de custos
   - Limites em dólares para o modo Uso por modelo

2. **Monitore o uso:**
   - Acompanhe o uso da chave API regularmente
   - Configure alertas para limites próximos
   - Revise os padrões de uso mensalmente

3. **Considerações de segurança:**
   - Use restrições de IP para aplicativos confidenciais
   - Gire as chaves de API regularmente
   - Monitore padrões de uso incomuns

## Mecanismo de reserva

### Conclusões do usuário para uso por modelo substituto

Quando uma chave de API de conclusão do usuário atinge o esgotamento da cota, o sistema volta automaticamente para Uso por modelo se:

1. **O usuário tem o Uso por modelo ativado** nas configurações da conta
2. **O usuário tem orçamento disponível** em sua alocação Uso por modelo
3. **Chave de API permite fallback** (comportamento padrão)

#### Processo substituto

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### Lógica de validação

#### Uso por Requisitos do Modelo

O sistema valida o seguinte antes de permitir o faturamento de Uso por Modelo:

1. **Configurações de conta de usuário**: O usuário deve ter "Uso por modelo" ativado
2. **Orçamento Mensal**: O usuário deve ter orçamento disponível em sua alocação
3. **Configuração da chave de API**: a chave de API deve ser configurada para uso por modelo ou permitir fallback
4. **Acesso ao modelo**: O usuário deve ter acesso ao modelo solicitado

#### Cenários mistos de faturamento

Quando várias chaves de API com diferentes modos de faturamento são usadas:

- **Chaves de conclusão do usuário** consomem da cota mensal do usuário
- **Uso por chaves de modelo** consome da alocação de orçamento do usuário
- **Cenários substitutos** priorizam primeiro as conclusões do usuário e depois o uso por modelo
- **Esgotamento da cota** aciona substituto automático, se disponível

## Migração entre modos

### Das conclusões do usuário ao uso por modelo

1. **Ativar uso por modelo**: certifique-se de que o usuário tenha o uso por modelo ativado em sua conta
2. **Atualizar chave de API**: altere o modo de cobrança na configuração da chave de API
3. **Definir limites de orçamento**: Configure limites mensais apropriados em dólares
4. **Monitore o uso**: acompanhe o uso de conclusão e o consumo do orçamento
5. **Teste substituto**: verifique se o comportamento de substituto funciona corretamente

### Do uso por modelo às conclusões do usuário

1. **Verificar cota**: certifique-se de que o usuário tenha cota de conclusão mensal suficiente
2. **Atualizar chave de API**: altere o modo de cobrança na configuração da chave de API
3. **Monitore o uso**: acompanhe o consumo de conclusão em relação aos limites mensais
4. **Configurar substituto**: configure o substituto para uso por modelo se a cota estiver esgotada
5. **Limites de teste**: verifique se os limites de cota são aplicados corretamente

### Práticas recomendadas de migração

- **Migração gradual**: teste primeiro com chaves de API de baixo volume
- **Monitore ambas as métricas**: acompanhe o uso de conclusão e o consumo do orçamento
- **Definir limites apropriados**: Configure limites realistas para ambos os modos
- **Alterações em documentos**: acompanhe as alterações no modo de faturamento para fins de auditoria
- **Comunicação do usuário**: informe os usuários sobre alterações no modo de cobrança e suas implicações

## Monitoramento e Análise

### Análise de uso

O sistema fornece análises detalhadas para ambos os modos de faturamento:

- **Conclusões do usuário**: contagens de conclusão, uso de cota, distribuição de modelo
- **Uso por modelo**: contagens de tokens, custos, análises específicas do modelo

### Integração com painel de administração

O painel de administração fornece:
- Monitoramento de uso em tempo real
- Configuração do modo de cobrança
- Análises e relatórios de uso
- Acompanhamento de custos e alertas

## Solução de problemas

### Problemas comuns

1. **O uso por modelo não funciona:**
   - Verifique se o usuário tem o Uso por modelo habilitado
   - Verifique os limites mensais em dólares
   - Garanta o acesso adequado ao modelo

2. **Problemas de cota de conclusões do usuário:**
   - Verifique o nível de licença do usuário
   - Verifique os limites mensais de conclusão
   - Considere ativar o uso por modelo como alternativa

3. **Erros de autenticação de chave de API:**
   - Verifique se a chave API está ativa
   - Verifique as restrições de IP
   - Garanta as permissões adequadas

### Suporte

Para problemas com modos de faturamento:
1. Verifique o painel de administração para estatísticas de uso
2. Revise a configuração da chave API
3. Entre em contato com o administrador do sistema para alterações no modo de faturamento
4. Monitore os logs para obter informações detalhadas sobre erros